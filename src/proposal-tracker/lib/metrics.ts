import type { Rfq } from '@/proposal-tracker/lib/db';
import { isOverdue } from '@/proposal-tracker/components/tracker/common';

/** "Pending" = assigned work that is not actively being drafted: not started, awaiting review, returned, or approved awaiting submission. */
export const PENDING_STATUSES = ['Assigned', 'Under Review', 'Returned', 'Approved'] as const;

export const isPending = (r: Rfq) => (PENDING_STATUSES as readonly string[]).includes(r.status);

/** One definition of the headline numbers, used by the dashboard, the Engineers page and reports. */
export function engineerMetrics(rfqs: Rfq[]) {
  return {
    assigned: rfqs.length,
    inProgress: rfqs.filter((r) => r.status === 'In Progress').length,
    pending: rfqs.filter(isPending).length,
    submitted: rfqs.filter((r) => r.status === 'Submitted').length,
    overdue: rfqs.filter(isOverdue).length,
  };
}

/** Rfqs matching a dashboard filter key (also used by the ?status= links). */
export function matchesFilter(r: Rfq, key: string): boolean {
  if (key === 'all' || !key) return true;
  if (key === 'Pending') return isPending(r);
  if (key === 'Overdue') return isOverdue(r);
  return r.status === key;
}
