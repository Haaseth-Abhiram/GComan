import { useMemo } from 'react';
import { daysUntil } from '@/proposal-tracker/components/tracker/common';
import { useDb, type DbView } from '@/proposal-tracker/lib/db';
import { can } from '@/proposal-tracker/lib/permissions';

/** Default days before the deadline when the alert starts (the admin can change it per proposal). */
export const DEADLINE_ALERT_DAYS = 5;
const ACTIVE_STATUSES = ['Assigned', 'In Progress', 'Under Review', 'Returned'];

export interface Notice { text: string; at: string; to: string }

/** Notifications derived from live data for one person. Works on the permission-scoped view only. */
export function buildNotices(db: DbView, personId: string): Notice[] {
  const rfqOf = (id: string) => db.rfqs.find((r) => r.id === id);
  const out: Notice[] = [];
  db.followups.filter((f) => f.createdBy === personId && !f.done && daysUntil(f.dueDate) <= 1)
    .forEach((f) => out.push({ text: `Follow-up ${daysUntil(f.dueDate) < 0 ? 'overdue' : 'due'}: ${f.type} (${rfqOf(f.rfqId)?.ref})`, at: f.dueDate, to: '/proposal-tracker/followups' }));
  db.tasks.filter((t) => t.ownerId === personId && t.status !== 'Submitted' && daysUntil(t.dueDate) <= 1)
    .forEach((t) => out.push({ text: `Task ${daysUntil(t.dueDate) < 0 ? 'overdue' : 'due'}: ${t.title} (${rfqOf(t.rfqId)?.ref})`, at: t.dueDate, to: '/proposal-tracker/tasks' }));
  db.rfqs.filter((r) => (r.primaryEngineerId === personId || r.supportingIds.includes(personId)) && r.status === 'Returned')
    .forEach((r) => out.push({ text: `${r.ref} was returned for corrections`, at: r.updatedAt, to: '/proposal-tracker/my-proposals' }));
  if (db.me && db.me.id === personId && db.me.role === 'admin')
    db.rfqs.filter((r) => r.status === 'Under Review')
      .forEach((r) => out.push({ text: `${r.ref} is awaiting review`, at: r.updatedAt, to: '/proposal-tracker/approvals' }));
  // Deadline alert: starts alertDaysBefore (default 5) before the deadline, if the admin left it on, while work is still going on.
  const isAdmin = !!db.me && db.me.id === personId && db.me.role === 'admin';
  db.rfqs.filter((r) => (r.alertEnabled ?? true) && ACTIVE_STATUSES.includes(r.status) && (isAdmin || r.primaryEngineerId === personId || r.supportingIds.includes(personId)))
    .forEach((r) => {
      const d = daysUntil(r.deadline);
      if (d > (r.alertDaysBefore ?? DEADLINE_ALERT_DAYS)) return;
      const when = d < 0 ? `overdue by ${-d} day${d === -1 ? '' : 's'}` : d === 0 ? 'due today' : `coming in ${d} day${d === 1 ? '' : 's'}`;
      out.push({ text: `Deadline ${when}: ${r.ref} — ${r.project}`, at: r.deadline, to: `/proposal-tracker/rfqs?view=${r.id}` });
    });
  return out.sort((a, b) => a.at.localeCompare(b.at));
}

export const useNotices = (personId: string): Notice[] => {
  const db = useDb();
  return useMemo(() => buildNotices(db, personId), [db, personId]);
};
