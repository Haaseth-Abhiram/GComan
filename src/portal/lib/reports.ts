/**
 * Daily work report. All rules live in the database
 * (migration 20261127110000_daily_reports.sql).
 */
import { rpc } from '@/portal/lib/rpc';

export type ReportStatus = 'draft' | 'submitted' | 'reviewed' | 'returned';

export interface ReportPerson {
  id: string;
  full_name: string;
  employee_code: string;
  designation: string | null;
  department: string | null;
}

export interface WorkReport {
  id: string;
  report_date: string;
  status: ReportStatus;
  summary: string | null;
  pending: string | null;
  submitted_at: string | null;
  submitted_to: string | null;   // manager's name; null = the admin
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_comment: string | null;
  employee: ReportPerson;
  worked_minutes: number | null;
  can_review: boolean;
  items?: ReportItem[];
}

export interface ReportItem { project_id: string; code?: string; name?: string; work: string; hours: number }

export interface MyReportDay {
  date: string;
  today: string;
  date_allowed: boolean;
  manager: string | null;
  worked_minutes: number | null;
  report: WorkReport | null;
  /** Projects I am on (empty until projects are installed). */
  projects?: { id: string; code: string; name: string }[];
  history: { report_date: string; status: ReportStatus; summary: string | null; review_comment: string | null }[];
}

export interface AdminReportDay {
  date: string;
  today: string;
  rows: { employee: ReportPerson; report: WorkReport | null }[];
  waiting: WorkReport[];
}

export const REPORT_STATUS_TEXT: Record<ReportStatus, string> = {
  draft: 'Draft', submitted: 'Submitted', reviewed: 'Reviewed', returned: 'Sent back',
};
export const REPORT_STATUS_STYLE: Record<ReportStatus, string> = {
  draft: 'border-slate-300 bg-slate-50 text-slate-700',
  submitted: 'border-sky-300 bg-sky-50 text-sky-800',
  reviewed: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  returned: 'border-amber-300 bg-amber-50 text-amber-800',
};

export const REPORT_DAYS_BACK = 7;
export const REPORT_TEXT_MAX = 2000;

/** "YYYY-MM-DD" moved by n days. */
export const shiftDay = (iso: string, n: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};

export const REPORTS_KEY = ['portal', 'reports'];

export const fetchMyReport = (date: string | null) => rpc<MyReportDay>('report_get', { _date: date });
export const saveMyReport = (v: { date: string; summary: string; pending: string; submit: boolean; items: { project_id: string; work: string; hours: string }[] }) =>
  rpc<MyReportDay>('report_save', {
    _date: v.date, _summary: v.summary, _pending: v.pending, _submit: v.submit,
    _items: v.items.map((i) => ({ project_id: i.project_id, work: i.work, hours: i.hours.trim() === '' ? null : Number(i.hours) })),
  });
export const fetchTeamReports = () => rpc<WorkReport[]>('report_team');
export const reviewReport = (id: string, action: 'reviewed' | 'returned', comment: string) =>
  rpc<WorkReport>('report_review', { _id: id, _action: action, _comment: comment });
export const fetchAdminReports = (date: string | null) => rpc<AdminReportDay>('report_admin', { _date: date });
