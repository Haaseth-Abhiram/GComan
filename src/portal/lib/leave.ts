/**
 * Leave (types, balances, holidays, requests and the approval chain). All rules
 * live in the database (migration 20261126160000_leave.sql).
 */
import { supabase } from '@/integrations/supabase/client';

export type LeaveStatus = 'manager_review' | 'admin_review' | 'manager_final' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveBalance {
  id: string;
  code: string;
  name: string;
  description: string;
  paid: boolean;
  allow_half_day: boolean;
  active: boolean;
  entitled: number | null;   // null = no limit
  overridden: boolean;
  used: number;
  pending: number;
  remaining: number | null;
}

interface Step { by: string | null; at: string; comment: string | null }

export interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  half_day: boolean;
  half_session?: 'first' | 'second' | null;
  days: number;
  reason: string;
  status: LeaveStatus;
  created_at: string;
  type: { id: string; code: string; name: string; paid: boolean };
  employee: { id: string; full_name: string; employee_code: string; designation: string | null };
  manager: { id: string; full_name: string; active: boolean } | null;
  manager_step: Step | null;
  admin_step: Step | null;
  final_step: Step | null;
  rejected: { by: string | null; comment: string | null } | null;
  cancelled_note: string | null;
  my_turn?: boolean;
}

export interface Holiday { date: string; name: string }

export interface LeaveOverview {
  year: number;
  today: string;
  half_sessions?: boolean;   // the database can store first / second half
  weekly_off: number[];
  manager: { id: string; full_name: string } | null;
  balances: LeaveBalance[];
  requests: LeaveRequest[];
  holidays: Holiday[];
}

export interface LeaveType {
  id: string;
  code: string;
  name: string;
  description: string;
  days_per_year: number | null;
  paid: boolean;
  allow_half_day: boolean;
  active: boolean;
}

const rpc = async <T,>(fn: string, args?: Record<string, unknown>): Promise<T> => {
  const { data, error } = await (supabase.rpc as unknown as (f: string, a?: Record<string, unknown>) =>
    Promise<{ data: unknown; error: { message: string } | null }>)(fn, args);
  if (error) throw new Error(error.message);
  return data as T;
};

// Employee
export const fetchLeaveOverview = (year?: number) => rpc<LeaveOverview>('leave_overview', { _year: year ?? null });
export const previewLeave = (v: { type: string; from: string; to: string; half: boolean }) =>
  rpc<number>('leave_preview', { _type: v.type, _from: v.from, _to: v.to, _half: v.half });
export const applyLeave = (v: { type: string; from: string; to: string; half: boolean; session?: 'first' | 'second' | null; reason: string }) =>
  rpc<LeaveRequest>('leave_apply', {
    _type: v.type, _from: v.from, _to: v.to, _half: v.half, _reason: v.reason,
    // Only sent when chosen, so full days also work on a database without this field.
    ...(v.half && v.session ? { _half_session: v.session } : {}),
  });
export const cancelLeave = (id: string) => rpc<void>('leave_cancel', { _id: id });

// Manager
export const fetchTeamLeave = () => rpc<LeaveRequest[]>('leave_team_requests');
export const managerDecide = (id: string, action: 'approve' | 'reject', comment: string) =>
  rpc<LeaveRequest>('leave_manager_decide', { _id: id, _action: action, _comment: comment });

// Admin
export const fetchAdminLeave = (filter: 'action' | 'pending' | 'all', year?: number) =>
  rpc<LeaveRequest[]>('leave_admin_requests', { _filter: filter, _year: year ?? null });
export const adminDecide = (id: string, action: 'approve' | 'reject', comment: string) =>
  rpc<LeaveRequest>('leave_admin_decide', { _id: id, _action: action, _comment: comment });
export const fetchAdminBalances = (year: number) =>
  rpc<{ year: number; employees: { id: string; employee_code: string; full_name: string; designation: string | null; balances: LeaveBalance[] }[] }>(
    'leave_admin_balances', { _year: year });
export const setAllowance = (employeeId: string, typeId: string, year: number, days: number | null) =>
  rpc<void>('leave_admin_set_allowance', { _emp: employeeId, _type: typeId, _year: year, _days: days });
export const fetchLeaveTypes = () => rpc<LeaveType[]>('leave_admin_types');
export const saveLeaveType = (t: Partial<LeaveType>) =>
  rpc<string>('leave_admin_save_type', { _p: { ...t, days_per_year: t.days_per_year ?? '' } });
export const fetchHolidays = (year: number) => rpc<Holiday[]>('leave_admin_holidays', { _year: year });
export const saveHoliday = (date: string, name: string, oldDate?: string | null) =>
  rpc<number>('leave_admin_save_holiday', { _date: date, _name: name, _old_date: oldDate ?? null });
export const deleteHoliday = (date: string) => rpc<number>('leave_admin_delete_holiday', { _date: date });

// Display
export const HALF_TEXT = { first: 'First half', second: 'Second half' } as const;
export const STATUS_TEXT: Record<LeaveStatus, string> = {
  manager_review: 'Waiting for manager',
  admin_review: 'Waiting for admin',
  manager_final: 'Waiting for manager’s final approval',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};
export const STATUS_STYLE: Record<LeaveStatus, string> = {
  manager_review: 'border-amber-300 text-amber-700',
  admin_review: 'border-amber-300 text-amber-700',
  manager_final: 'border-amber-300 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  cancelled: 'text-muted-foreground',
};
export const isPending = (s: LeaveStatus) => s === 'manager_review' || s === 'admin_review' || s === 'manager_final';
export const fmtDays = (n: number | null) => (n === null ? 'No limit' : `${Number(n) % 1 ? Number(n).toFixed(1) : Number(n)}`);
