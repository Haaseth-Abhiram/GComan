/**
 * Who the signed-in person is and what they may do: one call to the database
 * function rbac_my_access() (migration 20261126140000_employee_portal_foundation).
 *
 * The database enforces every permission itself; the front end only uses
 * this to decide what to show.
 */
import { supabase } from '@/integrations/supabase/client';

export type RoleKey = 'super_admin' | 'manager' | 'proposal_engineer' | 'employee' | (string & {});

export type Permission =
  | 'portal.employees.view' | 'portal.employees.create' | 'portal.employees.edit' | 'portal.employees.delete'
  | 'emp.portal.view' | 'team.members.view' | 'proposal.tracker.view' | (string & {});

export interface MyEmployee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  designation: string | null;
  joined_on: string | null;
  proposal_code: string | null;
  active: boolean;
  must_change_password: boolean;
  manager_name: string | null;
}

export interface MyAccess {
  is_super_admin: boolean;
  roles: { key: RoleKey; name: string; area: 'admin' | 'portal' }[];
  permissions: Permission[];
  employee: MyEmployee | null;
}

export const NO_ACCESS: MyAccess = { is_super_admin: false, roles: [], permissions: [], employee: null };

export async function fetchMyAccess(): Promise<MyAccess> {
  const { data, error } = await supabase.rpc('rbac_my_access');
  if (error) throw error;
  return (data as unknown as MyAccess) ?? NO_ACCESS;
}

export const can = (a: MyAccess | null | undefined, p: Permission) =>
  !!a && (a.is_super_admin || a.permissions.includes(p));

/**
 * Where a freshly signed-in user belongs: website admins → /admin, active
 * employees → /portal, disabled employees → 'disabled', anyone else → null.
 */
export async function destinationForUser(userId: string): Promise<'/admin' | '/portal' | 'disabled' | null> {
  const { data: role } = await supabase
    .from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle();
  if (role) return '/admin';
  const access = await fetchMyAccess().catch(() => null);
  if (access?.employee) return access.employee.active ? '/portal' : 'disabled';
  return null;
}

// ---- Passwords ---------------------------------------------------------------

/** Same rule the database enforces (and the website sign-up form uses). */
export const PASSWORD_RULE = '8+ characters with an uppercase letter, a lowercase letter and a number';
export const isValidPassword = (p: string) =>
  p.length >= 8 && p.length <= 72 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p);

/** A random password that satisfies the rule, for the admin to hand out. */
export function generatePassword(): string {
  const pick = (set: string, n: number) => Array.from(crypto.getRandomValues(new Uint32Array(n)), (x) => set[x % set.length]).join('');
  // No look-alike characters (0/O, 1/l/I) so it can be read out or typed from a message.
  const chars = pick('ABCDEFGHJKLMNPQRSTUVWXYZ', 2) + pick('abcdefghijkmnpqrstuvwxyz', 6) + pick('23456789', 3);
  return Array.from(chars).sort(() => (crypto.getRandomValues(new Uint8Array(1))[0] > 127 ? 1 : -1)).join('');
}

/** Changes the signed-in user's own password (current password required). */
export async function changeMyPassword(current: string, next: string) {
  const { error } = await supabase.rpc('my_change_password', { _current: current, _new: next });
  if (error) throw new Error(error.message);
}
