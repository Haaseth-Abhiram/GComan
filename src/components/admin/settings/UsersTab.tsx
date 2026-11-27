/**
 * Settings → Users & Roles: everyone with an employee account or Super Admin
 * access. "Edit roles" and "Change email" open right under the person.
 */
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Crown, KeyRound, Loader2, Lock, Mail, Pencil, Search, ShieldCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MY_ACCESS_QUERY } from '@/portal/lib/useMyAccess';
import { EMPLOYEES_QUERY } from '@/portal/lib/employees';
import { RBAC_KEY, changeUserEmail, fetchRbacUsers, setSuperAdmin, setUserRoles, type RbacOverview, type RbacUser } from '@/portal/lib/rbac';
import { RoleChip } from '@/portal/theme/ui';

/** Every role the person has, assigned or automatic. */
const roleKeys = (u: RbacUser) => [...(u.is_super_admin ? ['super_admin'] : []), ...u.roles, ...u.automatic];
const isAdminArea = (u: RbacUser) => u.is_super_admin || u.roles.includes('admin');

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';

const lastSignIn = (at: string | null) =>
  at ? `last sign-in ${new Date(at).toLocaleString('en-GB', { timeZone: 'Asia/Muscat', dateStyle: 'medium', timeStyle: 'short' })}` : 'never signed in';

/** The role buttons that open under a person. */
const RoleButtons = ({ u, ov, onClose }: { u: RbacUser; ov: RbacOverview; onClose: () => void }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [superAdmin, setSuper] = useState(u.is_super_admin);
  const [admin, setAdmin] = useState(u.roles.includes('admin'));
  const [manager, setManager] = useState(u.roles.includes('manager'));
  const superChanged = superAdmin !== u.is_super_admin;
  const adminChanged = admin !== u.roles.includes('admin');
  const managerChanged = manager !== u.roles.includes('manager');
  const hasTeam = u.automatic.includes('manager');
  const iAmSuper = ov.is_super_admin;

  const save = useMutation({
    // Two separate database calls: the Admin role first, then Super Admin.
    mutationFn: async () => {
      if (adminChanged || managerChanged) {
        await setUserRoles(u.user_id, [...(admin ? ['admin'] : []), ...(manager ? ['manager'] : [])]);
      }
      if (superChanged) await setSuperAdmin(u.user_id, superAdmin);
    },
    onSuccess: () => {
      toast({ title: 'Roles saved', description: `${u.full_name}'s access has been updated.` });
      onClose();
    },
    onError: (e: Error) => toast({ title: 'Could not save the roles', description: e.message, variant: 'destructive' }),
    onSettled: () => Promise.all([
      qc.invalidateQueries({ queryKey: RBAC_KEY }),
      qc.invalidateQueries({ queryKey: [MY_ACCESS_QUERY] }),
      qc.invalidateQueries({ queryKey: EMPLOYEES_QUERY }),
    ]),
  });

  const buttons = [
    { key: 'super_admin', on: superAdmin, toggle: () => setSuper(!superAdmin), locked: iAmSuper ? null : 'Only a Super Admin can change this.' },
    { key: 'admin', on: admin, toggle: () => setAdmin(!admin),
      locked: !u.employee_id ? 'Add this person on the Employees page first.' : iAmSuper ? null : 'Only a Super Admin can change this.' },
    { key: 'manager', on: manager || hasTeam, toggle: () => setManager(!manager),
      locked: !u.employee_id ? 'Add this person on the Employees page first.'
        : hasTeam ? 'Automatic: people report to this person (change “Reports to” on the Employees page).' : null },
    { key: 'employee', on: u.automatic.includes('employee'), toggle: undefined, locked: 'Automatic for every active employee.' },
  ];

  return (
    <div className="mt-3 space-y-3 rounded-xl border border-[#dce3f5] bg-white p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Roles</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={`Roles of ${u.full_name}`}>
        {buttons.map((b) => {
          const name = ov.roles.find((r) => r.key === b.key)?.name ?? b.key;
          return (
            <button
              key={b.key}
              type="button"
              role="checkbox"
              aria-checked={b.on}
              disabled={!!b.locked || save.isPending}
              title={b.locked ?? undefined}
              onClick={b.toggle}
              className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed ${b.on
                ? 'border-transparent bg-gradient-to-r from-[#223f96] to-[#3f63c9] text-white shadow-sm disabled:opacity-70'
                : 'border-[#e3e9f5] bg-[#f8faff] text-muted-foreground hover:border-[#223f96]/30 hover:bg-[#eef2fb] hover:text-[#223f96] disabled:opacity-45'}`}
            >
              {b.key === 'super_admin' && <Crown className="h-3 w-3" aria-hidden="true" />}
              {b.locked && <Lock className="h-3 w-3" aria-hidden="true" />}
              {name}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Employee is always on for an active employee. Anyone chosen under “Reports to” on the Employees page is a Manager too.
        {!u.employee_id && ' This login has no employee record, so it can only be a Super Admin.'}
      </p>
      {(superChanged || adminChanged || managerChanged) && (
        <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {superChanged && (superAdmin
            ? `${u.full_name} will have full access to everything, including the website, SEO and Settings. `
            : `${u.full_name} will no longer be a Super Admin. `)}
          {adminChanged && (admin
            ? `${u.full_name} will get the Admin role and can open the admin panel.`
            : `${u.full_name} will lose the Admin role. `)}
          {managerChanged && (manager ? ` ${u.full_name} will be a Manager.` : ` ${u.full_name} will no longer be given the Manager role.`)}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={save.isPending || (!superChanged && !adminChanged && !managerChanged)} onClick={() => save.mutate()}>
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save roles
        </Button>
        <Button size="sm" variant="outline" disabled={save.isPending} onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

/** The new sign-in email, opened under a person. */
const ChangeEmail = ({ u, onClose }: { u: RbacUser; onClose: () => void }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const value = email.trim().toLowerCase();

  const save = useMutation({
    mutationFn: () => changeUserEmail(u.user_id, value),
    onSuccess: (saved) => {
      toast({ title: 'Email changed', description: `${u.full_name} now signs in with ${saved}. Their password is the same.` });
      onClose();
    },
    onError: (e: Error) => toast({ title: 'Could not change the email', description: e.message, variant: 'destructive' }),
    onSettled: () => Promise.all([
      qc.invalidateQueries({ queryKey: RBAC_KEY }),
      qc.invalidateQueries({ queryKey: EMPLOYEES_QUERY }),
    ]),
  });

  return (
    <form className="mt-3 space-y-2 rounded-xl border border-[#dce3f5] bg-white p-4 shadow-sm"
      onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
      <label htmlFor={`email-${u.user_id}`} className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        New sign-in email <span className="font-normal normal-case">(now: {u.email})</span>
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input id={`email-${u.user_id}`} type="email" required autoFocus autoComplete="off" maxLength={254}
          placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" className="shrink-0" disabled={save.isPending || !value || value === u.email.toLowerCase()}>
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save email
        </Button>
        <Button type="button" variant="outline" className="shrink-0" disabled={save.isPending} onClick={onClose}>Cancel</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        They are signed out and must sign in with the new email. Their password stays the same, and no email is sent, so tell them.
      </p>
    </form>
  );
};

type Filter = 'all' | 'admin' | 'portal';

const UsersTab = ({ ov }: { ov: RbacOverview }) => {
  const { data: users = [], isLoading, error } = useQuery({ queryKey: [...RBAC_KEY, 'users'], queryFn: fetchRbacUsers });
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  // Only one panel is open at a time.
  const [open, setOpen] = useState<{ id: string; panel: 'roles' | 'email' } | null>(null);
  const isOpen = (id: string, panel: 'roles' | 'email') => open?.id === id && open.panel === panel;
  const toggle = (id: string, panel: 'roles' | 'email') => setOpen(isOpen(id, panel) ? null : { id, panel });

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users.filter((u) =>
      (filter === 'all' || (filter === 'admin' ? isAdminArea(u) : !!u.employee_id))
      && (!s || [u.full_name, u.email, u.employee_code, u.department].some((v) => v?.toLowerCase().includes(s))));
  }, [users, q, filter]);

  const chips: [Filter, string, number][] = [
    ['all', 'All', users.length],
    ['admin', 'Admin area', users.filter(isAdminArea).length],
    ['portal', 'Employee Portal', users.filter((u) => u.employee_id).length],
  ];

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[#eef0f4] px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f1592a]/20 to-[#f1592a]/10 text-[#d9461a] ring-1 ring-inset ring-[#f1592a]/25">
          <KeyRound className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[15px] font-bold text-[#101a3a]">Users</h2>
          <p className="text-xs text-muted-foreground">
            {ov.can_edit_users ? 'Click “Edit roles” to change someone’s roles.' : 'You can see roles but not change them.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-[#eef0f4] bg-[#fafbff] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Show">
          {chips.map(([key, text, count]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${filter === key
                ? 'border-transparent bg-[#223f96] text-white'
                : 'border-[#e3e9f5] bg-white text-muted-foreground hover:text-[#223f96]'}`}
            >
              {text} <span className="opacity-70">{count}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search name, email, ID…" aria-label="Search users" value={q} onChange={(e) => setQ(e.target.value)} className="w-full pl-8 sm:w-64" />
        </div>
      </div>

      {isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        : error ? <p className="p-5 text-sm text-destructive">{(error as Error).message}</p>
          : !shown.length ? (
            <div className="flex flex-col items-center gap-2 py-10 text-sm text-muted-foreground"><Users className="h-6 w-6" />No users found.</div>
          ) : (
            <ul className="divide-y divide-[#eef0f4]">
              {shown.map((u) => (
                <li key={u.user_id} className={`px-5 py-4 ${u.active ? '' : 'opacity-70'}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#223f96] to-[#3f63c9] text-sm font-bold text-white">
                      {initials(u.full_name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#101a3a]">
                        {u.full_name}
                        {u.employee_code && <span className="font-mono text-[11px] font-normal text-muted-foreground">{u.employee_code}</span>}
                        {u.is_self && <Badge variant="secondary">You</Badge>}
                        {!u.active && <Badge variant="outline" className="border-red-300 text-red-700">Disabled</Badge>}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{u.email} · {lastSignIn(u.last_sign_in_at)}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {!roleKeys(u).length && <span className="text-xs text-muted-foreground">No role</span>}
                        {ov.roles.filter((r) => roleKeys(u).includes(r.key)).map((r) => <RoleChip key={r.key} role={r} />)}
                        {u.proposal_code && <Badge variant="outline" title="Proposal Tracker access">Tracker {u.proposal_code}</Badge>}
                        {u.overrides > 0 && <Badge variant="outline" className="border-sky-300 text-sky-700">{u.overrides} personal exception{u.overrides === 1 ? '' : 's'}</Badge>}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {u.is_self ? (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />Another Super Admin changes your roles and email
                        </span>
                      ) : (
                        <>
                          {/* A Super Admin's roles are changed by a Super Admin only. */}
                          {ov.can_edit_users && (ov.is_super_admin || !u.is_super_admin) && (
                            <Button variant="outline" size="sm" aria-expanded={isOpen(u.user_id, 'roles')} aria-label={`Edit roles of ${u.full_name}`}
                              onClick={() => toggle(u.user_id, 'roles')}>
                              <Pencil className="mr-1 h-4 w-4" />Edit roles
                            </Button>
                          )}
                          {ov.is_super_admin && (
                            <Button variant="outline" size="sm" aria-expanded={isOpen(u.user_id, 'email')} aria-label={`Change email of ${u.full_name}`}
                              onClick={() => toggle(u.user_id, 'email')}>
                              <Mail className="mr-1 h-4 w-4" />Change email
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {isOpen(u.user_id, 'roles') && <RoleButtons u={u} ov={ov} onClose={() => setOpen(null)} />}
                  {isOpen(u.user_id, 'email') && <ChangeEmail u={u} onClose={() => setOpen(null)} />}
                </li>
              ))}
            </ul>
          )}
    </Card>
  );
};

export default UsersTab;
