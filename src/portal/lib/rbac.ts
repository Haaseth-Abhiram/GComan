/**
 * Admin → Settings: roles, permissions, data scopes, personal exceptions and the
 * audit log (migrations 20261126170000 + 20261126180000/180100). The database
 * enforces every rule; these calls only read and request changes.
 */
import { rpc } from '@/portal/lib/rpc';

export type Scope = 'none' | 'own' | 'team' | 'department' | 'all';
export const SCOPE_LABEL: Record<Scope, string> = {
  none: 'No access', own: 'Own records only', team: 'Their team (reporting line)', department: 'Their department', all: 'All records',
};

export interface RbacRole {
  key: string;
  name: string;
  description: string;
  implicit: boolean;   // automatic (Super Admin, Manager, Employee); Admin is assigned
  users: number;
  permissions: string[];
  scopes: Record<string, Scope>;
}
export interface RbacPermission {
  key: string;
  area: 'admin' | 'portal';
  module: string;
  page: string;
  tab: string | null;
  action: string;
  label: string;
  kind: 'page' | 'tab' | 'action' | 'field' | 'widget';
  sensitive: boolean;
  description: string;
}
export interface ScopeResource { key: string; label: string; description: string; scopes: Scope[] }
export interface RbacOverview {
  can_edit_roles: boolean;
  can_edit_users: boolean;
  is_super_admin: boolean;
  my_role_keys: string[];
  roles: RbacRole[];
  permissions: RbacPermission[];
  scope_resources: ScopeResource[];
}
export interface RbacUser {
  user_id: string;
  email: string;
  last_sign_in_at: string | null;
  employee_id: string | null;
  employee_code: string | null;
  department: string | null;
  full_name: string;
  active: boolean;
  proposal_code: string | null;
  is_super_admin: boolean;
  is_self: boolean;
  roles: string[];
  automatic: string[];
  overrides: number;
}
export interface UserOverride { key: string; effect: 'allow' | 'deny'; reason: string | null }
export interface RbacUserDetail {
  user_id: string;
  is_super_admin: boolean;
  active_roles: string[];
  overrides: UserOverride[];
  scope_overrides: Record<string, Scope>;
  effective: { key: string; allowed: boolean; override: 'allow' | 'deny' | null; from_roles: string[] }[];
  effective_scopes: Record<string, Scope>;
}
export interface AuditEntry {
  id: number;
  at: string;
  actor: string | null;
  actor_name: string | null;
  entity: 'role' | 'role_permission' | 'user_role' | 'user_override' | 'role_scope' | 'user_scope' | 'super_admin' | 'user_email';
  action: 'created' | 'changed' | 'removed';
  role_key: string | null;
  role_name: string | null;
  user_id: string | null;
  user_name: string | null;
  permission_key: string | null;
  permission_label: string | null;
  resource: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
}
export interface AssignableRole { key: string; name: string; description: string; sensitive: boolean }

export const RBAC_KEY = ['admin', 'rbac'];

// Roles (four fixed ones: only their permissions can change)
/** Set per person on the Employees page, not through roles or exceptions. */
const PERSON_SWITCHES = ['proposal.tracker.view'];
export const fetchRbacOverview = async () => {
  const ov = await rpc<RbacOverview>('rbac_admin_overview');
  return { ...ov, permissions: ov.permissions.filter((p) => !PERSON_SWITCHES.includes(p.key)) };
};
export const saveRole = (key: string | null, name: string, description: string) =>
  rpc<string>('rbac_admin_save_role', { _key: key, _name: name, _description: description });
export const saveRoleAccess = (role: string, perms: string[], scopes: Record<string, Scope | ''>) =>
  rpc<{ added: string[]; removed: string[] }>('rbac_admin_save_role_access', { _role: role, _perms: perms, _scopes: scopes });

// People
export const fetchRbacUsers = () => rpc<RbacUser[]>('rbac_admin_users');
export const fetchUserDetail = (userId: string) => rpc<RbacUserDetail>('rbac_admin_user_detail', { _user: userId });
export const setUserRoles = (userId: string, roles: string[]) => rpc<void>('rbac_admin_set_user_roles', { _user: userId, _roles: roles });
export const setSuperAdmin = (userId: string, on: boolean) => rpc<void>('rbac_admin_set_super_admin', { _user: userId, _on: on });
export const setUserOverrides = (userId: string, overrides: UserOverride[], scopes: Record<string, Scope | ''>) =>
  rpc<void>('rbac_admin_set_user_overrides', { _user: userId, _overrides: overrides, _scopes: scopes });
/** Super Admin only: the email a person signs in with. Returns the saved email. */
export const changeUserEmail = (userId: string, email: string) => rpc<string>('rbac_admin_change_email', { _user: userId, _email: email });
export const fetchAssignableRoles = () => rpc<AssignableRole[]>('rbac_assignable_roles');

// Audit
export const fetchAudit = (f: { user?: string | null; role?: string | null; from?: string | null; to?: string | null }) =>
  rpc<AuditEntry[]>('rbac_admin_audit', { _user: f.user ?? null, _role: f.role ?? null, _from: f.from || null, _to: f.to || null });

// ---- Grouping for the permission tree -------------------------------------------------

export interface PageGroup { page: string; items: RbacPermission[] }
export interface ModuleGroup { module: string; area: 'admin' | 'portal'; pages: PageGroup[]; keys: string[] }

/** Module → Page → permissions, in catalogue order. */
export const groupPermissions = (perms: RbacPermission[]): ModuleGroup[] => {
  const modules: ModuleGroup[] = [];
  for (const p of perms) {
    let m = modules.find((x) => x.module === p.module);
    if (!m) { m = { module: p.module, area: p.area, pages: [], keys: [] }; modules.push(m); }
    let pg = m.pages.find((x) => x.page === p.page);
    if (!pg) { pg = { page: p.page, items: [] }; m.pages.push(pg); }
    pg.items.push(p);
    m.keys.push(p.key);
  }
  return modules;
};

export const KIND_LABEL: Record<RbacPermission['kind'], string> = {
  page: 'Page', tab: 'Tab', action: 'Action', field: 'Field', widget: 'Widget',
};
