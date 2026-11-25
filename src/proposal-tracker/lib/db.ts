/**
 * PROTOTYPE DATA LAYER — browser localStorage, NOT a real database.
 *
 * Every read and write in the portal goes through this file, so swapping to
 * Supabase later means re-implementing these functions (schema + RLS draft in
 * supabase/proposal-tracker-schema.sql).
 *
 * Access control lives HERE, not in the pages:
 *  - WRITES: every mutator re-derives the caller from the stored employee
 *    record and the session (it ignores any role/grants the UI passes), then
 *    checks can(). RFQ lookups for a user who may not see the RFQ fail with
 *    "RFQ not found", so direct IDs or URLs reveal nothing.
 *  - READS: useDb() returns a per-user view — only visible RFQs and their
 *    children, and `costing` is removed unless the user holds the costing
 *    permission.
 * In a browser prototype this is still client-side (anyone can open DevTools);
 * real enforcement is the RLS policies in the SQL file.
 */
import { useSyncExternalStore } from 'react';
import {
  can, canSeeRfq, effectiveGrants, PERMISSIONS, PERMISSION_INFO, visibleRfqs,
  type Action, type Permission, type Role, type Subject,
} from '@/proposal-tracker/lib/permissions';
import { getSessionUserId } from '@/proposal-tracker/lib/session';

export type { Role, Permission };
export type Priority = 'High' | 'Medium' | 'Low';
export const RFQ_STATUSES = ['New', 'Assigned', 'In Progress', 'Under Review', 'Returned', 'Approved', 'Submitted'] as const;
export type RfqStatus = (typeof RFQ_STATUSES)[number];
export const DOC_CATEGORIES = ['RFQ', 'Specification', 'BOQ', 'Vendor Offer', 'Submitted Proposal'] as const;
export type DocCategory = (typeof DOC_CATEGORIES)[number];
/** Statuses an engineer can set on a proposal or task. */
export const EDIT_STATUSES = ['In Progress', 'Under Review', 'Submitted'] as const;
export const TASK_STATUSES = EDIT_STATUSES;
export type TaskStatus = (typeof TASK_STATUSES)[number];
/** Progress / completion only moves in these steps. */
export const PROGRESS_STEPS = [25, 50, 75, 100] as const;
export const FOLLOWUP_TYPES = ['Customer Clarification', 'Vendor Response', 'Next Action', 'Reminder'] as const;
export type FollowupType = (typeof FOLLOWUP_TYPES)[number];

export interface Employee { id: string; code: string; name: string; email: string; role: Role }
/** Commercial data — only present in views for users with proposal.view_commercial_costing. */
/** Where an RFQ request came from. */
export const RFQ_SOURCES = ['Email', 'Phone call', 'WhatsApp', 'Website', 'Social media', 'Tender portal', 'Referral', 'Walk-in', 'Other'] as const;
export type RfqSource = (typeof RFQ_SOURCES)[number];
export interface Costing { estimatedCost: number; quotedPrice: number }
export interface Rfq {
  id: string;
  ref: string;
  customerRef: string;
  customer: { name: string; contact: string; email: string; phone: string };
  project: string;
  receivedDate: string;
  deadline: string;
  priority: Priority;
  /** How the request reached us (older records may not have one). */
  source?: RfqSource;
  targetDate: string;
  primaryEngineerId: string | null;
  supportingIds: string[];
  status: RfqStatus;
  progress: number;
  pendingActions: string;
  costing?: Costing;
  /** Deadline alert, controlled by the admin per proposal. Default: on, 5 days before the deadline. */
  alertEnabled?: boolean;
  alertDaysBefore?: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export interface Task {
  id: string; rfqId: string; title: string; description: string; ownerId: string;
  startDate: string; dueDate: string; priority: Priority; status: TaskStatus; completion: number;
  createdAt: string; updatedAt: string;
}
export interface Followup {
  id: string; rfqId: string; type: FollowupType; note: string; dueDate: string; done: boolean;
  createdBy: string; createdAt: string; updatedAt: string;
}
export interface Doc {
  id: string; rfqId: string; category: DocCategory; name: string; size: number; mime: string;
  dataUrl: string; uploadedBy: string; createdAt: string;
}
export interface Approval {
  id: string; rfqId: string; action: 'Sent for Review' | 'Approved' | 'Returned'; reviewerId: string; comment: string; at: string;
}
export interface Submission {
  id: string; rfqId: string; submittedDate: string; revision: number; reference: string; notes: string;
  supportingDocs: string[]; recordedBy: string; createdAt: string;
}
export interface Activity { id: string; kind: 'rfq' | 'assign' | 'progress' | 'task' | 'followup' | 'doc' | 'review' | 'submit'; text: string; by: string; at: string; rfqId?: string }
/** A short note an engineer logs about the day's work. Private to that engineer (and Admin). */
export interface DailyUpdate { id: string; engineerId: string; rfqId: string | null; date: string; note: string; createdAt: string }
/** A deadline-alert email to the assigned engineers. PROTOTYPE: recorded here, not delivered by a mail server. */
export interface EmailLog { id: string; rfqId: string; toIds: string[]; subject: string; body: string; at: string; day: string; kind: 'manual' | 'daily'; fromId?: string }
export interface AuditEntry { id: string; at: string; actorId: string; action: string; detail: string; rfqId?: string }

export interface DbState {
  employees: Employee[]; rfqs: Rfq[]; tasks: Task[]; followups: Followup[]; documents: Doc[];
  approvals: Approval[]; submissions: Submission[]; activities: Activity[]; dailyUpdates: DailyUpdate[];
  /** user_permissions: employeeId -> granted permissions */
  grants: Record<string, Permission[]>;
  audit: AuditEntry[];
  emailLog: EmailLog[];
}
/** What the signed-in user is allowed to see. */
export interface DbView extends DbState { me: (Subject & { name: string }) | null }

const KEY = 'gc-portal-db-v11'; // v11: demo data removed (forces browsers holding v10 sample data to start empty); // v9: RFQ source; v8: email log; v7: local-date seeds + alert fields (reseeds demo data)
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const nowIso = () => new Date().toISOString();
/** Local calendar date as YYYY-MM-DD (toISOString would be UTC and can be a day off near midnight). */
const localDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const todayStr = () => localDate(new Date());
const off = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return localDate(d); };
const ago = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

// Demo roster: engineer codes P1..P10 are DATA. Nothing in the app logic refers to a specific engineer;
// every screen is driven by the signed-in user's id.
const ENGINEER_ROSTER: Array<[string, string]> = [
  ['P1', 'Khalid Al Balushi'], ['P2', 'Fatma Al Harthi'], ['P3', 'Salim Al Rawahi'], ['P4', 'Aisha Al Busaidi'],
  ['P5', 'Hamad Al Kindi'], ['P6', 'Mariam Al Lawati'], ['P7', 'Yousuf Al Habsi'], ['P8', 'Noor Al Siyabi'],
  ['P9', 'Said Al Mahrouqi'], ['P10', 'Huda Al Farsi'],
];
const engId = (n: number) => `e-p${n}`;

function seed(): DbState {
  const t = nowIso();
  const y = new Date().getFullYear();
  const employees: Employee[] = [
    { id: 'e-admin', code: 'ADM', name: 'Admin Demo', email: 'admin.demo@gcoman.com', role: 'admin' },
    ...ENGINEER_ROSTER.map(([code, name]): Employee => ({ id: `e-${code.toLowerCase()}`, code, name, email: `${code.toLowerCase()}.demo@gcoman.com`, role: 'engineer' })),
  ];

  // [customer, project, receivedOffset, deadlineOffset, status, primary#, supporting#, progress, priority, pending, costing]
  type Row = [string, string, number, number, RfqStatus, number | null, number | null, number, Priority, string, Costing | null];
  const rows: Row[] = []; // demo proposals removed: the database starts empty (schema only)
  const rfqs: Rfq[] = rows.map(([cust, project, recv, dl, status, prim, sup, progress, pr, pending, costing], i): Rfq => ({
    id: `r-${i + 1}`, ref: `GC-RFQ-${y}-${String(i + 1).padStart(3, '0')}`, customerRef: `CUST-${1001 + i}`,
    customer: { name: cust, contact: 'Procurement Dept', email: '', phone: '+968 0000 0000' },
    project, receivedDate: off(recv), deadline: off(dl), priority: pr, source: RFQ_SOURCES[i % 6], targetDate: off(dl - 2),
    primaryEngineerId: prim ? engId(prim) : null, supportingIds: sup ? [engId(sup)] : [], status, progress, pendingActions: pending,
    ...(costing ? { costing } : {}), createdBy: 'e-admin', createdAt: t, updatedAt: t,
  }));

  // Tasks: the primary owns "vendor quotations"; a supporting engineer owns the compliance sheet.
  const tasks: Task[] = [];
  const mkTask = (rfq: Rfq, title: string, owner: string, completion: number): void => {
    tasks.push({
      id: `t-${tasks.length + 1}`, rfqId: rfq.id, title, description: '', ownerId: owner, startDate: off(-2), dueDate: rfq.deadline > off(-1) ? off(Math.max(-1, Math.round((new Date(rfq.deadline).getTime() - Date.now()) / 86_400_000) - 2)) : off(-1),
      priority: rfq.priority, status: completion === 100 ? 'Submitted' : 'In Progress', completion, createdAt: t, updatedAt: t,
    });
  };
  rfqs.filter((r) => r.primaryEngineerId && r.status !== 'Submitted').forEach((r) => {
    mkTask(r, 'Collect vendor quotations', r.primaryEngineerId!, r.progress >= 50 ? 50 : 25);
    r.supportingIds.forEach((s) => mkTask(r, 'Prepare technical compliance sheet', s, 25));
  });

  const fuTypes: FollowupType[] = ['Customer Clarification', 'Vendor Response', 'Next Action', 'Reminder'];
  const followups: Followup[] = rfqs.filter((r) => ['r-2', 'r-8', 'r-10', 'r-12', 'r-14', 'r-16'].includes(r.id)).map((r, i): Followup => ({
    id: `f-${i + 1}`, rfqId: r.id, type: fuTypes[i % 4], note: `Follow up with ${r.customer.name} on ${r.project.toLowerCase()}.`,
    dueDate: off(i % 3 - 1), done: false, createdBy: r.primaryEngineerId!, createdAt: t, updatedAt: t,
  }));

  const approvals: Approval[] = [];
  rfqs.forEach((r, i) => {
    if (!r.primaryEngineerId) return;
    if (['Under Review', 'Returned', 'Approved', 'Submitted'].includes(r.status))
      approvals.push({ id: `a-${i}s`, rfqId: r.id, action: 'Sent for Review', reviewerId: r.primaryEngineerId, comment: '', at: ago(120 - i) });
    if (r.status === 'Submitted') approvals.push({ id: `a-${i}a`, rfqId: r.id, action: 'Approved', reviewerId: 'e-admin', comment: 'Pricing and terms OK.', at: ago(100 - i) });
    if (r.status === 'Returned') approvals.push({ id: `a-${i}r`, rfqId: r.id, action: 'Returned', reviewerId: 'e-admin', comment: 'Revise pricing and resubmit.', at: ago(30) });
  });
  const submissions: Submission[] = rfqs.filter((r) => r.status === 'Submitted').map((r, i): Submission => ({
    id: `s-${i + 1}`, rfqId: r.id, submittedDate: off(Math.min(-1, Math.round((new Date(r.deadline).getTime() - Date.now()) / 86_400_000) - 1)),
    revision: 1, reference: `SUB-${String(i + 1).padStart(3, '0')}`, notes: '', supportingDocs: [], recordedBy: r.primaryEngineerId!, createdAt: t,
  }));

  const noteFor = (r: Rfq, d: number) => (d === 0 ? `Worked on the ${r.project.toLowerCase()} proposal for ${r.customer.name}.` : `Prepared inputs for ${r.customer.name}.`);
  const dailyUpdates: DailyUpdate[] = [];
  employees.filter((e) => e.role === 'engineer').forEach((e) => {
    const mine = rfqs.filter((r) => r.primaryEngineerId === e.id);
    if (!mine.length) return;
    [0, -1].forEach((d) => dailyUpdates.push({ id: `d-${dailyUpdates.length + 1}`, engineerId: e.id, rfqId: mine[0].id, date: off(d), note: noteFor(mine[0], d), createdAt: ago(d === 0 ? 2 : 26) }));
  });

  const activities: Activity[] = rfqs.slice(0, 5).map((r, i): Activity => ({
    id: `x-${i + 1}`, kind: i === 0 ? 'rfq' : 'assign', text: i === 0 ? `New RFQ received: ${r.ref} from ${r.customer.name}` : `${r.ref} assigned`, by: 'e-admin', at: ago(3 + i * 7), rfqId: r.id,
  }));

  // Demo grants. Admin holds approval + costing because it was GRANTED, not because of role.
  const grants: Record<string, Permission[]> = {
    'e-admin': ['proposal.approve', 'proposal.view_commercial_costing'],
  };
  const audit: AuditEntry[] = [];
  return { employees, rfqs, tasks, followups, documents: [], approvals, submissions, activities, dailyUpdates, grants, audit, emailLog: [] };
}

let state: DbState = (() => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DbState;
  } catch { /* fall through */ }
  return seed();
})();
const listeners = new Set<() => void>();

function commit(next: DbState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    throw new Error('Browser storage is full — delete some documents and try again.');
  }
  state = next;
  listeners.forEach((l) => l());
}

// ---------------------------------------------------------------------------
// Reads: a per-user, permission-scoped view of the data.
// ---------------------------------------------------------------------------
function subjectOf(id: string | null): (Subject & { name: string }) | null {
  const e = state.employees.find((x) => x.id === id);
  return e ? { id: e.id, role: e.role, name: e.name, grants: effectiveGrants(e.role, state.grants[e.id]) } : null;
}

let viewCache: { s: DbState; a: string | null; v: DbView } | null = null;
function view(): DbView {
  const a = getSessionUserId();
  if (viewCache && viewCache.s === state && viewCache.a === a) return viewCache.v;
  const me = subjectOf(a);
  let v: DbView;
  if (!me) {
    v = { employees: [], rfqs: [], tasks: [], followups: [], documents: [], approvals: [], submissions: [], activities: [], dailyUpdates: [], grants: {}, audit: [], emailLog: [], me: null };
  } else {
    const seeCost = can(me, 'costing.view');
    const rfqs = visibleRfqs(me, state.rfqs).map((r) => {
      if (seeCost) return r;
      const { costing: _hidden, ...rest } = r;
      return rest as Rfq;
    });
    const byId = new Map(rfqs.map((r) => [r.id, r]));
    const manages = (rfqId: string) => can(me, 'task.manage', byId.get(rfqId));
    v = {
      me,
      // Names are needed to label assignments; contact details are only for Admin and the user themself.
      employees: state.employees.map((e) => (can(me, 'rfq.viewAll') || e.id === me.id ? e : { ...e, email: '' })),
      rfqs,
      // Tasks: whoever manages the RFQ sees all of them; anyone else only their own.
      tasks: state.tasks.filter((t) => byId.has(t.rfqId) && (manages(t.rfqId) || t.ownerId === me.id)),
      followups: state.followups.filter((x) => byId.has(x.rfqId)),
      documents: state.documents.filter((x) => byId.has(x.rfqId)),
      approvals: state.approvals.filter((x) => byId.has(x.rfqId)),
      submissions: state.submissions.filter((x) => byId.has(x.rfqId)),
      activities: state.activities.filter((x) => (x.rfqId ? byId.has(x.rfqId) : can(me, 'rfq.viewAll'))),
      // Daily updates are private: engineers only ever receive their own.
      dailyUpdates: state.dailyUpdates.filter((d) => can(me, 'rfq.viewAll') || d.engineerId === me.id),
      grants: can(me, 'permissions.manage') ? state.grants : { [me.id]: state.grants[me.id] ?? [] },
      audit: can(me, 'permissions.manage') ? state.audit : [],
      // Admins see every alert email; engineers only the ones addressed to them.
      emailLog: (state.emailLog ?? []).filter((m) => can(me, 'rfq.viewAll') || m.toIds.includes(me.id) || m.fromId === me.id),
    };
  }
  viewCache = { s: state, a, v };
  return v;
}
export const useDb = (): DbView =>
  useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, view);

// ---------------------------------------------------------------------------
// Writes: caller is re-derived here; the UI's claims are ignored.
// ---------------------------------------------------------------------------
/** Callers pass the UI's idea of who they are; only `id` is used, and it must match the session. */
export interface Actor { id: string; role?: Role; name?: string; grants?: Permission[] }

function who(actor: Actor) {
  if (!actor?.id || actor.id !== getSessionUserId()) throw new Error('You are not signed in as that user.');
  const s = subjectOf(actor.id);
  if (!s) throw new Error('Unknown user.');
  return s;
}
function assertCan(actor: Actor, action: Action, rfq?: Rfq) {
  if (!can(who(actor), action, rfq)) throw new Error('You do not have permission to do that.');
}
/** Loads an RFQ for this caller. Anything they may not see is reported as "not found". */
function rfqFor(actor: Actor, id: string): Rfq {
  const s = who(actor);
  const r = state.rfqs.find((x) => x.id === id);
  if (!r || !canSeeRfq(s, r)) throw new Error('RFQ not found.');
  return r;
}
const log = (actor: Actor, kind: Activity['kind'], text: string, rfqId?: string): Activity[] =>
  [{ id: uid(), kind, text, by: actor.id, at: nowIso(), rfqId }, ...state.activities].slice(0, 200);
const aud = (actor: Actor, action: string, detail: string, rfqId?: string): AuditEntry[] =>
  [{ id: uid(), at: nowIso(), actorId: actor.id, action, detail, rfqId }, ...state.audit].slice(0, 500);
const patchRfq = (id: string, patch: Partial<Rfq>): Rfq[] =>
  state.rfqs.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: nowIso() } : r));

export const MAX_FILE = 1_000_000; // ~1 MB per file (localStorage budget)
export const readFile = (f: File) =>
  new Promise<string>((res, rej) => {
    if (f.size > MAX_FILE) return rej(new Error(`${f.name} is larger than 1 MB (prototype limit).`));
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result));
    fr.onerror = () => rej(new Error(`Could not read ${f.name}.`));
    fr.readAsDataURL(f);
  });

export interface NewRfq {
  customerRef: string; customerName: string; contact: string; email: string; phone: string;
  project: string; receivedDate: string; deadline: string; priority: Priority; source: RfqSource;
}
export const nextRfqRef = () => {
  const y = new Date().getFullYear();
  const n = state.rfqs.filter((r) => r.ref.startsWith(`GC-RFQ-${y}-`)).length;
  const max = state.rfqs.reduce((m, r) => Math.max(m, Number(r.ref.split('-').pop()) || 0), n);
  return `GC-RFQ-${y}-${String(max + 1).padStart(3, '0')}`;
};

export async function createRfq(actor: Actor, input: NewRfq, files: File[], costing?: Costing): Promise<Rfq> {
  assertCan(actor, 'rfq.create');
  if (costing) {
    assertCan(actor, 'costing.view');
    if (![costing.estimatedCost, costing.quotedPrice].every((n) => Number.isFinite(n) && n >= 0)) throw new Error('Enter valid, non-negative amounts.');
  }
  if (input.customerRef && state.rfqs.some((r) => r.customerRef.toLowerCase() === input.customerRef.toLowerCase()))
    throw new Error(`Customer reference "${input.customerRef}" already exists.`);
  const mine = who(actor).role === 'engineer';
  const dataUrls = await Promise.all(files.map(readFile));
  const ref = nextRfqRef();
  const t = nowIso();
  const rfq: Rfq = {
    id: uid(), ref, customerRef: input.customerRef,
    customer: { name: input.customerName, contact: input.contact, email: input.email, phone: input.phone },
    project: input.project, receivedDate: input.receivedDate, deadline: input.deadline, priority: input.priority, source: input.source,
    // An engineer who registers a proposal owns it from the start, so it appears in their My Proposals.
    targetDate: input.deadline, primaryEngineerId: mine ? actor.id : null, supportingIds: [], status: mine ? 'Assigned' : 'New', progress: 0,
    pendingActions: '', ...(costing ? { costing } : {}), createdBy: actor.id, createdAt: t, updatedAt: t,
  };
  const docs: Doc[] = files.map((f, i) => ({
    id: uid(), rfqId: rfq.id, category: 'RFQ', name: f.name, size: f.size, mime: f.type, dataUrl: dataUrls[i], uploadedBy: actor.id, createdAt: t,
  }));
  commit({ ...state, rfqs: [rfq, ...state.rfqs], documents: [...docs, ...state.documents],
    activities: log(actor, 'rfq', `New RFQ registered: ${ref} from ${input.customerName}`, rfq.id),
    audit: aud(actor, 'rfq.created', `Created ${ref}`, rfq.id) });
  return rfq;
}

export function assignRfq(actor: Actor, id: string, v: { primary: string; supporting: string[]; priority: Priority; targetDate: string; alertEnabled: boolean; alertDaysBefore: number }) {
  assertCan(actor, 'rfq.assign');
  const r = rfqFor(actor, id);
  if (!Number.isInteger(v.alertDaysBefore) || v.alertDaysBefore < 1 || v.alertDaysBefore > 60) throw new Error('Alert days must be between 1 and 60.');
  if (!v.primary) throw new Error('Select a primary engineer.');
  const isEngineer = (eid: string) => state.employees.some((e) => e.id === eid && e.role === 'engineer');
  if (![v.primary, ...v.supporting].every(isEngineer)) throw new Error('Only Engineers can be assigned to an RFQ.');
  const supporting = v.supporting.filter((s) => s !== v.primary);
  const name = state.employees.find((e) => e.id === v.primary)?.name ?? 'engineer';
  commit({ ...state,
    rfqs: patchRfq(id, { primaryEngineerId: v.primary, supportingIds: supporting, priority: v.priority, targetDate: v.targetDate, alertEnabled: v.alertEnabled, alertDaysBefore: v.alertDaysBefore, status: r.status === 'New' ? 'Assigned' : r.status }),
    activities: log(actor, 'assign', `${r.ref} assigned to ${name}`, id),
    audit: aud(actor, 'rfq.assigned', `${r.ref}: primary ${name}, ${supporting.length} supporting`, id) });
}

export function updateProgress(actor: Actor, id: string, v: { progress: number; status: RfqStatus; pendingActions: string }) {
  const r = rfqFor(actor, id);
  assertCan(actor, 'proposal.update', r);
  if (!(EDIT_STATUSES as readonly string[]).includes(v.status)) throw new Error('Status must be In Progress, Under Review or Submitted.');
  if (!(PROGRESS_STEPS as readonly number[]).includes(v.progress)) throw new Error('Progress must be 25, 50, 75 or 100.');
  const progress = v.status === 'Submitted' ? 100 : v.progress;
  const toReview = v.status === 'Under Review' && r.status !== 'Under Review';
  commit({ ...state, rfqs: patchRfq(id, { progress, status: v.status, pendingActions: v.pendingActions }),
    approvals: toReview ? [...state.approvals, { id: uid(), rfqId: id, action: 'Sent for Review', reviewerId: actor.id, comment: '', at: nowIso() }] : state.approvals,
    activities: log(actor, 'progress', `${r.ref} updated: ${v.status}, ${progress}%`, id) });
}

export function sendForReview(actor: Actor, id: string) {
  const r = rfqFor(actor, id);
  assertCan(actor, 'proposal.update', r);
  if (r.status === 'Under Review') throw new Error('Already awaiting admin review.');
  commit({ ...state, rfqs: patchRfq(id, { status: 'Under Review', progress: Math.max(r.progress, 75) }),
    approvals: [...state.approvals, { id: uid(), rfqId: id, action: 'Sent for Review', reviewerId: actor.id, comment: '', at: nowIso() }],
    activities: log(actor, 'review', `${r.ref} sent for admin review`, id) });
}

export function reviewRfq(actor: Actor, id: string, action: 'Approved' | 'Returned', comment: string) {
  const r = rfqFor(actor, id);
  assertCan(actor, 'proposal.review', r); // needs the explicit proposal.approve grant, not just a role
  if (r.status !== 'Under Review') throw new Error('This proposal is not awaiting review.');
  if (action === 'Returned' && !comment.trim()) throw new Error('A comment is required when returning a proposal.');
  const me = who(actor);
  commit({ ...state, rfqs: patchRfq(id, { status: action === 'Approved' ? 'Approved' : 'Returned' }),
    approvals: [...state.approvals, { id: uid(), rfqId: id, action, reviewerId: actor.id, comment: comment.trim(), at: nowIso() }],
    activities: log(actor, 'review', `${r.ref} ${action.toLowerCase()} by ${me.name}`, id),
    audit: aud(actor, `proposal.${action.toLowerCase()}`, `${r.ref} ${action.toLowerCase()}${comment.trim() ? `: ${comment.trim()}` : ''}`, id) });
}

export async function recordSubmission(actor: Actor, v: {
  rfqId: string; submittedDate: string; revision: number; reference: string; notes: string; supportingDocs: string[]; newFiles?: File[];
}) {
  const r = rfqFor(actor, v.rfqId);
  assertCan(actor, 'proposal.submit', r);
  if (!['Approved', 'Submitted'].includes(r.status)) throw new Error('Only approved proposals can be submitted.');
  if (state.submissions.some((s) => s.reference.toLowerCase() === v.reference.toLowerCase()))
    throw new Error(`Submission reference "${v.reference}" is already used.`);
  if (!Number.isInteger(v.revision) || v.revision < 1) throw new Error('Revision must be a whole number (1 or higher).');
  if (state.submissions.some((s) => s.rfqId === v.rfqId && s.revision === v.revision))
    throw new Error(`Revision ${v.revision} is already recorded for this RFQ.`);
  const files = v.newFiles ?? [];
  const urls = await Promise.all(files.map(readFile));
  const t = nowIso();
  const docs: Doc[] = files.map((f, i) => ({ id: uid(), rfqId: v.rfqId, category: 'Submitted Proposal', name: f.name, size: f.size, mime: f.type, dataUrl: urls[i], uploadedBy: actor.id, createdAt: t }));
  const { newFiles: _n, ...rest } = v;
  commit({ ...state, rfqs: patchRfq(v.rfqId, { status: 'Submitted', progress: 100 }),
    documents: [...docs, ...state.documents],
    submissions: [...state.submissions, { id: uid(), ...rest, supportingDocs: [...v.supportingDocs, ...files.map((f) => f.name)], recordedBy: actor.id, createdAt: t }],
    activities: log(actor, 'submit', `${r.ref} submitted (revision ${v.revision})`, v.rfqId),
    audit: aud(actor, 'proposal.submitted', `${r.ref} revision ${v.revision}, ref ${v.reference}`, v.rfqId) });
}

export function updateRfq(actor: Actor, id: string, input: NewRfq) {
  assertCan(actor, 'rfq.manage');
  const r = rfqFor(actor, id);
  if (input.customerRef && state.rfqs.some((x) => x.id !== id && x.customerRef.toLowerCase() === input.customerRef.toLowerCase()))
    throw new Error(`Customer reference "${input.customerRef}" already exists.`);
  commit({ ...state,
    rfqs: patchRfq(id, { customerRef: input.customerRef, customer: { name: input.customerName, contact: input.contact, email: input.email, phone: input.phone },
      project: input.project, receivedDate: input.receivedDate, deadline: input.deadline, priority: input.priority, source: input.source }),
    activities: log(actor, 'rfq', `RFQ details updated: ${r.ref}`, id),
    audit: aud(actor, 'rfq.updated', `Edited ${r.ref}`, id) });
}

export function deleteRfq(actor: Actor, id: string) {
  assertCan(actor, 'rfq.manage');
  const r = rfqFor(actor, id);
  commit({ ...state,
    rfqs: state.rfqs.filter((x) => x.id !== id), tasks: state.tasks.filter((x) => x.rfqId !== id),
    followups: state.followups.filter((x) => x.rfqId !== id), documents: state.documents.filter((x) => x.rfqId !== id),
    approvals: state.approvals.filter((x) => x.rfqId !== id), submissions: state.submissions.filter((x) => x.rfqId !== id),
    activities: log(actor, 'rfq', `RFQ deleted: ${r.ref}`),
    audit: aud(actor, 'rfq.deleted', `Deleted ${r.ref} (${r.customer.name})`) });
}

// ---------------------------------------------------------------------------
// Deadline alert emails (prototype: logged, not delivered — real sending needs a mail server)
// ---------------------------------------------------------------------------
const ALERT_ACTIVE = ['Assigned', 'In Progress', 'Under Review', 'Returned'];
const daysTo = (d: string) => Math.round((new Date(`${d}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86_400_000);
function alertEmail(r: Rfq): { subject: string; body: string } {
  const d = daysTo(r.deadline);
  const when = d < 0 ? `was ${-d} day${d === -1 ? '' : 's'} ago` : d === 0 ? 'is today' : `is in ${d} day${d === 1 ? '' : 's'}`;
  return {
    subject: `Deadline alert: ${r.ref} — ${r.project}`,
    body: `Hello,

The deadline for ${r.ref} (${r.customer.name} — ${r.project}) ${when} (${r.deadline}).
Please update your progress or let the admin know if you need help.

Thank you`,
  };
}
const alertRecipients = (r: Rfq) => [r.primaryEngineerId, ...r.supportingIds].filter((x): x is string => !!x);

/** Admin: send the deadline alert for one proposal now. Returns the recipients' names. */
export function emailDeadlineAlert(actor: Actor, id: string): string[] {
  const r = rfqFor(actor, id);
  // Admins (assign) or the engineers working on the proposal may send it.
  if (!can(who(actor), 'rfq.assign') && !can(who(actor), 'proposal.update', r)) throw new Error('You do not have permission to do that.');
  const me = who(actor);
  // Admin -> the assigned engineers. Engineer -> the admin(s) and the other engineers on the proposal (never themselves).
  const toIds = can(me, 'rfq.assign')
    ? alertRecipients(r)
    : [...state.employees.filter((e) => e.role === 'admin').map((e) => e.id), ...alertRecipients(r)].filter((x, i, a) => x !== me.id && a.indexOf(x) === i);
  if (!toIds.length) throw new Error(can(me, 'rfq.assign') ? 'Assign an engineer first.' : 'There is nobody to send this alert to.');
  const m = alertEmail(r);
  if (!can(me, 'rfq.assign')) m.body = `${m.body}

— Sent by ${me.name}`;
  const names = toIds.map((x) => state.employees.find((e) => e.id === x)?.name ?? x);
  commit({ ...state, emailLog: [{ id: uid(), rfqId: id, toIds, ...m, at: nowIso(), day: todayStr(), kind: 'manual', fromId: actor.id }, ...(state.emailLog ?? [])],
    audit: aud(actor, 'alert.emailed', `${r.ref}: deadline alert emailed to ${names.join(', ')}`, id) });
  return names;
}

/** Engineer: turn the deadline alert on/off and choose how many days before the deadline it starts (default 5). */
export function setDeadlineAlert(actor: Actor, id: string, v: { alertEnabled: boolean; alertDaysBefore: number }) {
  const r = rfqFor(actor, id);
  assertCan(actor, 'proposal.update', r);
  if (!Number.isInteger(v.alertDaysBefore) || v.alertDaysBefore < 1 || v.alertDaysBefore > 60) throw new Error('Alert days must be between 1 and 60.');
  commit({ ...state, rfqs: patchRfq(id, { alertEnabled: v.alertEnabled, alertDaysBefore: v.alertDaysBefore }),
    audit: aud(actor, 'alert.updated', `${r.ref}: deadline alert ${v.alertEnabled ? `${v.alertDaysBefore} days before` : 'off'}`, id) });
}

/** The "every day" job: once per proposal per day, from alertDaysBefore until the deadline. Runs whenever the app is open. */
export function runDailyDeadlineAlerts() {
  if (!getSessionUserId()) return;
  const today = todayStr();
  const log = state.emailLog ?? [];
  const added: EmailLog[] = [];
  state.rfqs.forEach((r) => {
    const d = daysTo(r.deadline);
    if (!(r.alertEnabled ?? true) || !ALERT_ACTIVE.includes(r.status) || !r.primaryEngineerId || d < 0 || d > (r.alertDaysBefore ?? 5)) return;
    if (log.some((m) => m.rfqId === r.id && m.kind === 'daily' && m.day === today)) return;
    added.push({ id: uid(), rfqId: r.id, toIds: alertRecipients(r), ...alertEmail(r), at: nowIso(), day: today, kind: 'daily' });
  });
  if (added.length) commit({ ...state, emailLog: [...added, ...log] });
}

/** Commercial costing: needs the costing permission AND the right to work on that proposal. */
export function setCosting(actor: Actor, id: string, v: Costing) {
  assertCan(actor, 'costing.view');
  const r = rfqFor(actor, id);
  assertCan(actor, 'proposal.update', r);
  if (![v.estimatedCost, v.quotedPrice].every((n) => Number.isFinite(n) && n >= 0)) throw new Error('Enter valid, non-negative amounts.');
  commit({ ...state, rfqs: patchRfq(id, { costing: { estimatedCost: v.estimatedCost, quotedPrice: v.quotedPrice } }),
    audit: aud(actor, 'costing.updated', `Updated commercial costing for ${r.ref}`, id) });
}

export function saveTask(actor: Actor, v: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
  const s = who(actor);
  const r = rfqFor(actor, v.rfqId);
  const existing = v.id ? state.tasks.find((t) => t.id === v.id) : undefined;
  if (existing && !can(s, 'task.manage', r)) {
    // Not a manager of this RFQ: may only update completion/status of a task they own.
    if (existing.ownerId !== s.id) throw new Error('You can only update your own tasks.');
    if (!(PROGRESS_STEPS as readonly number[]).includes(v.completion)) throw new Error('Completion must be 25, 50, 75 or 100.');
    const done = v.status === 'Submitted' ? 100 : v.completion;
    commit({ ...state, tasks: state.tasks.map((t) => (t.id === existing.id ? { ...t, completion: done, status: done === 100 ? 'Submitted' : v.status === 'Submitted' ? 'In Progress' : v.status, updatedAt: nowIso() } : t)),
      activities: log(actor, 'task', `Task updated: ${existing.title} (${r.ref})`, r.id) });
    return;
  }
  assertCan(actor, 'task.manage', r);
  if (![r.primaryEngineerId, ...r.supportingIds].includes(v.ownerId)) throw new Error('Task owner must be an engineer assigned to this RFQ.');
  if (v.dueDate < v.startDate) throw new Error('Due date cannot be before the start date.');
  if (!(PROGRESS_STEPS as readonly number[]).includes(v.completion)) throw new Error('Completion must be 25, 50, 75 or 100.');
  const completion = v.status === 'Submitted' ? 100 : v.completion;
  const status: TaskStatus = completion === 100 ? 'Submitted' : v.status === 'Submitted' ? 'In Progress' : v.status;
  const t = nowIso();
  if (existing) {
    commit({ ...state, tasks: state.tasks.map((x) => (x.id === existing.id ? { ...x, ...v, id: existing.id, completion, status, updatedAt: t } : x)),
      activities: log(actor, 'task', `Task updated: ${v.title} (${r.ref})`, r.id) });
  } else {
    commit({ ...state, tasks: [{ ...v, id: uid(), completion, status, createdAt: t, updatedAt: t }, ...state.tasks],
      activities: log(actor, 'task', `Task created: ${v.title} (${r.ref})`, r.id) });
  }
}
export function deleteTask(actor: Actor, id: string) {
  const task = state.tasks.find((t) => t.id === id);
  if (!task) return;
  assertCan(actor, 'task.manage', rfqFor(actor, task.rfqId));
  commit({ ...state, tasks: state.tasks.filter((t) => t.id !== id) });
}

export function addFollowup(actor: Actor, v: { rfqId: string; type: FollowupType; note: string; dueDate: string }) {
  const r = rfqFor(actor, v.rfqId);
  assertCan(actor, 'followup.manage', r);
  const t = nowIso();
  commit({ ...state, followups: [{ id: uid(), ...v, done: false, createdBy: actor.id, createdAt: t, updatedAt: t }, ...state.followups],
    activities: log(actor, 'followup', `Follow-up added (${v.type}) for ${r.ref}`, r.id) });
}
export function toggleFollowup(actor: Actor, id: string) {
  const f = state.followups.find((x) => x.id === id);
  if (!f) return;
  assertCan(actor, 'followup.manage', rfqFor(actor, f.rfqId));
  commit({ ...state, followups: state.followups.map((x) => (x.id === id ? { ...x, done: !x.done, updatedAt: nowIso() } : x)) });
}

export async function addDocument(actor: Actor, v: { rfqId: string; category: DocCategory; file: File }) {
  const r = rfqFor(actor, v.rfqId);
  assertCan(actor, 'doc.upload', r);
  const dataUrl = await readFile(v.file);
  commit({ ...state, documents: [{ id: uid(), rfqId: v.rfqId, category: v.category, name: v.file.name, size: v.file.size, mime: v.file.type, dataUrl, uploadedBy: actor.id, createdAt: nowIso() }, ...state.documents],
    activities: log(actor, 'doc', `Document uploaded (${v.category}) to ${r.ref}`, r.id) });
}
export function deleteDocument(actor: Actor, id: string) {
  const d = state.documents.find((x) => x.id === id);
  if (!d) return;
  assertCan(actor, 'doc.delete', rfqFor(actor, d.rfqId));
  commit({ ...state, documents: state.documents.filter((x) => x.id !== id) });
}

/** Admin-only: grant or revoke one of the configurable permissions. Audited. */
export function setGrant(actor: Actor, employeeId: string, permission: Permission, enabled: boolean) {
  assertCan(actor, 'permissions.manage');
  if (!PERMISSIONS.includes(permission)) throw new Error('Unknown permission.');
  const emp = state.employees.find((e) => e.id === employeeId);
  if (!emp) throw new Error('Unknown employee.');
  if (!PERMISSION_INFO[permission].roles.includes(emp.role))
    throw new Error(`"${PERMISSION_INFO[permission].label}" cannot be granted to the ${emp.role} role.`);
  const current = state.grants[employeeId] ?? [];
  if (current.includes(permission) === enabled) return;
  const next = enabled ? [...current, permission] : current.filter((p) => p !== permission);
  commit({ ...state, grants: { ...state.grants, [employeeId]: next },
    audit: aud(actor, enabled ? 'permission.granted' : 'permission.revoked',
      `${enabled ? 'Granted' : 'Revoked'} "${permission}" ${enabled ? 'to' : 'from'} ${emp.name}`) });
}

export function resetDemoData(actor: Actor) {
  assertCan(actor, 'permissions.manage');
  commit(seed());
}

/** Daily work update. Always recorded against the signed-in engineer; the UI cannot choose someone else. */
export function addDailyUpdate(actor: Actor, v: { rfqId: string | null; note: string; date?: string }) {
  assertCan(actor, 'dailyupdate.add');
  const note = v.note.trim();
  if (note.length < 3) throw new Error('Write a short note (at least 3 characters).');
  if (note.length > 1000) throw new Error('Keep the note under 1000 characters.');
  const date = v.date ?? todayStr();
  if (date > todayStr()) throw new Error('The date cannot be in the future.');
  let ref = '';
  if (v.rfqId) {
    const r = rfqFor(actor, v.rfqId);
    assertCan(actor, 'proposal.update', r); // must be one of the RFQ's assigned engineers
    ref = ` on ${r.ref}`;
  }
  commit({ ...state,
    dailyUpdates: [{ id: uid(), engineerId: actor.id, rfqId: v.rfqId, date, note, createdAt: nowIso() }, ...state.dailyUpdates],
    activities: log(actor, 'progress', `Daily update added${ref}`, v.rfqId ?? undefined) });
}

/**
 * Everything belonging to one engineer. An engineer may read only their own;
 * Admin may read any engineer's. (The same rule the views apply, exposed as an explicit API.)
 */
export function readEngineerWork(actor: Actor, engineerId: string) {
  const me = who(actor);
  if (!(can(me, 'rfq.viewAll') || engineerId === me.id)) throw new Error('You do not have permission to view that engineer.');
  const emp = state.employees.find((e) => e.id === engineerId && e.role === 'engineer');
  if (!emp) throw new Error('Engineer not found.');
  const seeCost = can(me, 'costing.view');
  const rfqs = state.rfqs
    .filter((r) => r.primaryEngineerId === engineerId || r.supportingIds.includes(engineerId))
    .map((r) => { if (seeCost) return r; const { costing: _c, ...rest } = r; return rest as Rfq; });
  return {
    engineer: emp,
    rfqs,
    tasks: state.tasks.filter((t) => t.ownerId === engineerId),
    followups: state.followups.filter((f) => f.createdBy === engineerId),
    dailyUpdates: state.dailyUpdates.filter((d) => d.engineerId === engineerId),
  };
}

// ---------------------------------------------------------------------------
// Demo sign-in support (stands in for the real auth service reading the users table).
// ---------------------------------------------------------------------------
export interface LoginIdentity { id: string; email: string; name: string; role: Role; code: string }
const toIdentity = (e: Employee): LoginIdentity => ({ id: e.id, email: e.email, name: e.name, role: e.role, code: e.code });
export const findLoginByEmail = (email: string): LoginIdentity | null => {
  const e = state.employees.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  return e ? toIdentity(e) : null;
};
export const findLoginById = (id: string | null): LoginIdentity | null => {
  const e = state.employees.find((x) => x.id === id);
  return e ? toIdentity(e) : null;
};
/** Demo convenience only: the login page lists the seeded accounts. */
export const listDemoLogins = (): LoginIdentity[] => state.employees.map(toIdentity);
