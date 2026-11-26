/**
 * Attendance (punch in / out, history, correction requests). Every rule lives
 * in the database (migration 20261126150000_attendance.sql); this file only
 * calls it and formats the results in the COMPANY timezone (Oman), whatever
 * timezone the viewer's computer is set to.
 */
import { supabase } from '@/integrations/supabase/client';

export interface AttendanceRules {
  timezone: string;
  office_start: string;   // 'HH:MM'
  late_after: string;
  office_end: string;
  half_day_min_hours: number;
  auto_punch_out: string;
  weekly_off: number[];   // ISO weekdays, 1 = Mon … 7 = Sun
  today: string;          // 'YYYY-MM-DD' in the company timezone
}

export type DayStatus = 'working' | 'present' | 'half_day' | 'absent';

export interface AttendanceDay {
  employee_id: string;
  work_date: string;
  first_in: string;
  last_out: string | null;
  worked_minutes: number;
  sessions: number;
  is_open: boolean;
  is_late: boolean;
  auto_out: boolean;
  corrected: boolean;
  status: DayStatus;
}

export interface AttendanceSession {
  id: string;
  employee_id: string;
  work_date: string;
  punch_in_at: string;
  punch_out_at: string | null;
  auto_punched_out: boolean;
  corrected_at: string | null;
  auto_punch_out_at: string | null;
}

export interface Correction {
  id: string;
  work_date: string;
  session_id: string | null;
  requested_in: string | null;
  requested_out: string | null;
  old_in: string | null;
  old_out: string | null;
  kind: 'add' | 'fix';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  decided_at: string | null;
  decision_comment: string | null;
  decided_by: string | null;
  employee: { id: string; full_name: string; employee_code: string };
}

export interface AttendanceMe {
  rules: AttendanceRules;
  today: string;
  /** True on a full day off: weekly off, holiday or full-day approved leave. */
  is_weekly_off: boolean;
  day_off: { kind: 'weekly' | 'holiday' | 'leave'; name: string; half_day?: boolean } | null;
  open_session: AttendanceSession | null;
  today_summary: AttendanceDay | null;
  today_sessions: AttendanceSession[];
}

const rpc = async <T,>(fn: string, args?: Record<string, unknown>): Promise<T> => {
  // Function names are checked by the generated types elsewhere; these all return JSON.
  const { data, error } = await (supabase.rpc as unknown as (f: string, a?: Record<string, unknown>) =>
    Promise<{ data: unknown; error: { message: string } | null }>)(fn, args);
  if (error) throw new Error(error.message);
  return data as T;
};

export const ATTENDANCE_ME_QUERY = ['portal', 'attendance', 'me'];

export const fetchAttendanceMe = () => rpc<AttendanceMe>('att_me');
export const punchIn = () => rpc<AttendanceSession>('att_punch_in');
export const punchOut = () => rpc<AttendanceSession>('att_punch_out');

export const fetchMyAttendance = (from: string, to: string) =>
  rpc<{ rules: AttendanceRules; days: AttendanceDay[]; sessions: AttendanceSession[]; corrections: Correction[] }>(
    'att_my_attendance', { _from: from, _to: to });

/** in/out are 'HH:MM' in the company timezone on `date`; null = keep the current value. */
export const requestCorrection = (v: { date: string; sessionId: string | null; in: string | null; out: string | null; reason: string }) =>
  rpc<Correction>('att_request_correction', { _date: v.date, _session: v.sessionId, _in: v.in, _out: v.out, _reason: v.reason });

export const cancelCorrection = (id: string) => rpc<void>('att_cancel_correction', { _id: id });

// ---- Admin ---------------------------------------------------------------------

export interface AdminAttendance {
  rules: AttendanceRules;
  employees: { id: string; employee_code: string; full_name: string; department: string | null; designation: string | null; active: boolean; since: string }[];
  days: AttendanceDay[];
  sessions: AttendanceSession[];
  pending_corrections: number;
  holidays: { date: string; name: string }[];
  leave: { employee_id: string; start_date: string; end_date: string; half_day: boolean; type: string }[];
}

export const fetchAdminAttendance = (from: string, to: string, employeeId?: string | null) =>
  rpc<AdminAttendance>('att_admin_attendance', { _from: from, _to: to, _emp: employeeId ?? null });

export const fetchAdminCorrections = (status: 'pending' | 'all') =>
  rpc<Correction[]>('att_admin_corrections', { _status: status });

export const decideCorrection = (id: string, action: 'approved' | 'rejected', comment: string) =>
  rpc<Correction>('att_admin_decide_correction', { _id: id, _action: action, _comment: comment });

// ---- Formatting (company timezone) -------------------------------------------------

export const DEFAULT_TZ = 'Asia/Muscat';

export const fmtTime = (iso: string | null | undefined, tz = DEFAULT_TZ) =>
  iso ? new Date(iso).toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true }) : '—';

/** 'HH:MM' (24 h) in the company timezone, for time inputs. */
export const hhmm = (iso: string | null | undefined, tz = DEFAULT_TZ) =>
  iso ? new Date(iso).toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }) : '';

/** 'YYYY-MM-DD' → 'Wed 26 Nov 2026' (date-only, no timezone shift). */
export const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', { ...opts, timeZone: 'UTC' });

/** '09:45' → '9:45 AM'. */
export const fmtClock = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

export const fmtMinutes = (min: number) => `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m`;

export const addDays = (d: string, n: number) => {
  const x = new Date(`${d}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};

/** First and last day of the month containing `d` ('YYYY-MM-DD'). */
export const monthRange = (d: string) => {
  const [y, m] = d.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { from: `${d.slice(0, 7)}-01`, to: `${d.slice(0, 7)}-${String(last).padStart(2, '0')}` };
};

/** ISO weekday (1 = Mon … 7 = Sun) of 'YYYY-MM-DD'. */
export const isoWeekday = (d: string) => ((new Date(`${d}T12:00:00Z`).getUTCDay() + 6) % 7) + 1;

export const STATUS_LABEL: Record<DayStatus, string> = {
  working: 'Working', present: 'Present', half_day: 'Half day', absent: 'Absent',
};
export const STATUS_CLASS: Record<DayStatus, string> = {
  working: 'bg-sky-100 text-sky-800 border-sky-200',
  present: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  half_day: 'bg-amber-100 text-amber-800 border-amber-200',
  absent: 'bg-rose-100 text-rose-800 border-rose-200',
};
