/**
 * CENTRAL PERMISSION MODEL — the only place permission rules are defined.
 *
 * Two roles (Admin, Engineer) plus four grantable permissions that
 * are stored per user (the `user_permissions` table in the real schema).
 * A role alone never confers approval, costing or optional-RFQ rights: those
 * need an explicit grant, and a grant only counts if the user's role is
 * eligible for it (an Engineer can never approve, even if a row says so).
 *
 * Pages and the data layer both call can(); nothing else hardcodes role checks.
 */
import type { Rfq } from '@/proposal-tracker/lib/db';

export type Role = 'admin' | 'engineer';
export const ROLES: Role[] = ['admin', 'engineer'];
export const ROLE_LABEL: Record<Role, string> = { admin: 'Admin', engineer: 'Engineer' };

export const PERMISSIONS = [
  'proposal.approve',
  'proposal.view_commercial_costing',
  'rfq.create',
  'report.export_limited',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const PERMISSION_INFO: Record<Permission, { label: string; description: string; roles: Role[] }> = {
  'proposal.approve': {
    label: 'Approve proposals',
    description: 'Approve or return proposals under review. Never implied by role.',
    roles: ['admin'],
  },
  'proposal.view_commercial_costing': {
    label: 'View commercial costing',
    description: 'See estimated cost, quoted price and margin. Hidden from everyone else.',
    roles: ['admin', 'engineer'],
  },
  'rfq.create': {
    label: 'Create RFQs',
    description: 'Included in every role: Admins and Engineers can create RFQs.',
    roles: [],
  },
  'report.export_limited': {
    label: 'Export reports (limited)',
    description: 'Lets an Engineer view and export reports covering only their own assigned proposals.',
    roles: ['engineer'],
  },
};

export type Action =
  | 'rfq.create' | 'rfq.manage' | 'rfq.assign' | 'rfq.viewAll'
  | 'report.view' | 'report.exportAll'
  | 'proposal.update' | 'proposal.review' | 'proposal.submit'
  | 'task.manage' | 'followup.manage' | 'doc.upload' | 'doc.delete'
  | 'costing.view' | 'permissions.manage' | 'dailyupdate.add';

export interface Subject { id: string; role: Role; grants?: Permission[] }

/** Grants that actually count for this role. */
export const effectiveGrants = (role: Role, grants: Permission[] = []) =>
  grants.filter((p) => PERMISSION_INFO[p]?.roles.includes(role));

const has = (s: Subject, p: Permission) => effectiveGrants(s.role, s.grants).includes(p);
const elevated = (s: Subject) => s.role === 'admin';
const isPrimary = (s: Subject, r?: Rfq) => !!r && r.primaryEngineerId === s.id;
const isAssigned = (s: Subject, r?: Rfq) => !!r && (r.primaryEngineerId === s.id || r.supportingIds.includes(s.id));

/** May this user see this RFQ at all? (Engineers: only assigned ones, plus ones they created.) */
export const canSeeRfq = (s: Subject, r: Rfq) => elevated(s) || isAssigned(s, r) || r.createdBy === s.id;

export function can(s: Subject, action: Action, rfq?: Rfq): boolean {
  switch (action) {
    case 'rfq.viewAll': case 'rfq.manage': case 'rfq.assign': case 'report.exportAll':
      return elevated(s);
    case 'rfq.create':
      return elevated(s) || s.role === 'engineer'; // every Engineer can add their own proposal
    case 'report.view':
      return elevated(s) || has(s, 'report.export_limited');
    case 'proposal.review':
      return elevated(s) && has(s, 'proposal.approve'); // role is necessary, never sufficient
    case 'costing.view':
      return has(s, 'proposal.view_commercial_costing');
    case 'permissions.manage':
      return s.role === 'admin';
    case 'dailyupdate.add':
      return s.role === 'engineer';
    case 'proposal.update':
      return elevated(s) || isAssigned(s, rfq);
    case 'doc.upload':
      return elevated(s) || isAssigned(s, rfq);
    case 'proposal.submit': // Admin only
      return s.role === 'admin';
    case 'task.manage': case 'followup.manage': case 'doc.delete':
      return elevated(s) || isPrimary(s, rfq);
  }
}

/** RFQs a user may see. */
export const visibleRfqs = (s: Subject, rfqs: Rfq[]) => rfqs.filter((r) => canSeeRfq(s, r));
