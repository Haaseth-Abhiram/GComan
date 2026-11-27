/**
 * "Today at a glance": turns the attendance data into the numbers and lists of
 * the company overview. All dates are 'YYYY-MM-DD' in the company timezone.
 */
import { DEFAULT_TZ, addDays, isoWeekday, type AdminAttendance, type AttendanceDay } from '@/portal/lib/attendance';

export const companyToday = () => new Date().toLocaleDateString('en-CA', { timeZone: DEFAULT_TZ });

export type PersonState = 'in' | 'out' | 'leave' | 'not-in' | 'day-off';

export interface PersonToday {
  id: string;
  name: string;
  designation: string | null;
  state: PersonState;
  late: boolean;
  day: AttendanceDay | null;
  leaveType: string | null;
}

const ORDER: Record<PersonState, number> = { in: 0, out: 1, leave: 2, 'not-in': 3, 'day-off': 4 };

const leaveOn = (att: AdminAttendance, employeeId: string, date: string) =>
  att.leave.find((l) => l.employee_id === employeeId && l.start_date <= date && l.end_date >= date) ?? null;

/** Why nobody is expected on `date` (holiday or weekly off), or null on a working day. */
export const dayOffName = (att: AdminAttendance, date: string) =>
  att.holidays.find((h) => h.date === date)?.name ?? (att.rules.weekly_off.includes(isoWeekday(date)) ? 'Weekly off' : null);

/** The latest working day before `today` (looks back two weeks at most). */
export const lastWorkingDay = (att: AdminAttendance, today: string) => {
  for (let i = 1; i <= 14; i++) {
    const d = addDays(today, -i);
    if (!dayOffName(att, d)) return d;
  }
  return null;
};

/** On approved leave for the whole of `date`. */
export const onFullLeave = (att: AdminAttendance, employeeId: string, date: string) => {
  const l = leaveOn(att, employeeId, date);
  return !!l && !l.half_day;
};

export const peopleToday = (att: AdminAttendance, today: string): PersonToday[] => {
  const dayOff = dayOffName(att, today);
  return att.employees
    .filter((e) => e.active)
    .map((e) => {
      const day = att.days.find((d) => d.employee_id === e.id && d.work_date === today) ?? null;
      const leave = leaveOn(att, e.id, today);
      // Punching in wins over leave (someone on half-day leave who came in is in the office).
      const state: PersonState = day ? (day.is_open ? 'in' : 'out') : leave ? 'leave' : dayOff ? 'day-off' : 'not-in';
      return { id: e.id, name: e.full_name, designation: e.designation, state, late: !!day?.is_late, day, leaveType: leave?.type ?? null };
    })
    .sort((a, b) => ORDER[a.state] - ORDER[b.state] || a.name.localeCompare(b.name));
};
