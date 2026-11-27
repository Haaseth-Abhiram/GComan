/** Notifications and messages (migration 20261127120000_notifications.sql). */
import { DATABASE_UPDATE_NEEDED, rpc } from '@/portal/lib/rpc';

export type NoticeKind = 'message' | 'report' | 'leave' | 'attendance' | 'project';
export const KIND_TEXT: Record<NoticeKind, string> = {
  project: 'Projects', leave: 'Leave', attendance: 'Attendance', report: 'Daily reports', message: 'Messages',
};

export interface Notice {
  id: string;
  kind: NoticeKind;
  priority: 'normal' | 'urgent';
  title: string;
  body: string | null;
  link: string | null;
  sender_label: string | null;
  read_at: string | null;
  created_at: string;
}
export interface MyNotices { unread: number; urgent: Notice[]; items: Notice[] }
export interface MessageOptions {
  can_send: boolean;
  can_all: boolean;
  can_team: boolean;
  people: { id: string; full_name: string; employee_code: string; designation: string | null }[];
  sent: { id: string; title: string; body: string | null; priority: 'normal' | 'urgent'; created_at: string; recipients: number; read: number; to: string[] }[];
}

export const NOTICES_KEY = ['portal', 'notifications'];
export const fetchNotices = async () => {
  // Sends the reminders that are due (does nothing until the reminders script is run).
  await rpc('notif_tick').catch(() => {});
  return rpc<MyNotices>('notif_mine');
};
export const markRead = (ids: string[] | null) => rpc<void>('notif_read', { _ids: ids });
export const fetchMessageOptions = () => rpc<MessageOptions>('notif_options');
export const sendMessage = (m: { audience: 'people' | 'team' | 'all'; to: string[]; title: string; body: string; priority: 'normal' | 'urgent' }) =>
  rpc<number>('notif_send', {
    _audience: m.audience, _to: m.audience === 'people' ? m.to : null, _title: m.title, _body: m.body, _priority: m.priority,
  });

// ---- admin: scheduled reminders (migration 20261127160000_reminders.sql) --------
export type ReminderKind = 'punch_in' | 'punch_out' | 'report' | 'deadline';
export interface Reminder { kind: ReminderKind; enabled: boolean; send_at: string; days: number[]; sent_today: number }
export const fetchReminders = () => rpc<{ timer: boolean; items: Reminder[] }>('reminders_admin').catch((e: Error) => {
  if (e.message !== DATABASE_UPDATE_NEEDED) throw e;
  throw new Error('To switch on reminders, run supabase/migrations/20261127160000_reminders.sql in the Supabase SQL editor.');
});
export const saveReminder = (r: Pick<Reminder, 'kind' | 'enabled' | 'send_at' | 'days'>) =>
  rpc<unknown>('reminders_admin_save', { _kind: r.kind, _enabled: r.enabled, _send_at: r.send_at, _days: r.days });
export const sendReminderNow = (kind: ReminderKind) => rpc<number>('reminders_admin_send_now', { _kind: kind });

export const whenText = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Muscat', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });

/** "5 min ago", "3 h ago", else the date and time. */
export const timeAgo = (iso: string) => {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  return min < 24 * 60 ? `${Math.round(min / 60)} h ago` : whenText(iso);
};
