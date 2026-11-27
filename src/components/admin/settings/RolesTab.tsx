/**
 * Settings → Roles & Permissions: pick one of the four roles, then switch each
 * action on or off. Changes apply immediately and the database enforces them.
 * Switching on a sensitive permission asks first.
 */
import { Fragment, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Crown, Loader2, Lock, ShieldCheck, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { can } from '@/portal/lib/access';
import { useMyAccess, MY_ACCESS_QUERY } from '@/portal/lib/useMyAccess';
import {
  RBAC_KEY, SCOPE_LABEL, groupPermissions, saveRoleAccess,
  type PageGroup, type RbacOverview, type RbacPermission, type RbacRole, type Scope,
} from '@/portal/lib/rbac';

// Who each role is, and how a person gets it.
const ABOUT: Record<string, { who: string; how: string }> = {
  super_admin: { who: 'Website administrators. Always has every permission.', how: 'Given by a Super Admin' },
  admin: { who: 'Runs website leads and the employee side.', how: 'Given by a Super Admin' },
  manager: { who: 'Sees their team and approves its leave.', how: 'Given in Users & Roles, or automatic with a team' },
  employee: { who: 'Punches in, applies for leave, manages their profile.', how: 'Automatic: every active employee' },
};

/** Table columns; any other action goes in "Other". */
const COLUMNS = [
  ['view', 'View'], ['create', 'Create'], ['edit', 'Edit'], ['delete', 'Delete'],
  ['download', 'Download'], ['approve', 'Approve'], ['export', 'Export'], ['other', 'Other'],
] as const;
const columnOf = (p: RbacPermission) => {
  const last = p.key.slice(p.key.lastIndexOf('.') + 1);
  return COLUMNS.some(([k]) => k === last) ? last : 'other';
};
const actionName = (p: RbacPermission) => (p.tab ? `${p.tab}: ${p.action}` : p.action);
const NOT_SET = '__not_set__';
const rank = (s: string) => ({ own: 1, team: 2, department: 3, all: 4 } as Record<string, number>)[s] ?? 0;

interface Change { perms: string[]; scopes: Record<string, Scope | ''>; done: string }

const RolesTab = ({ ov }: { ov: RbacOverview }) => {
  const [params, setParams] = useSearchParams();
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: me } = useMyAccess();
  const role: RbacRole | undefined = ov.roles.find((r) => r.key === params.get('role'))
    ?? ov.roles.find((r) => r.key === 'admin') ?? ov.roles[0];
  const [confirm, setConfirm] = useState<{ change: Change; sensitive: RbacPermission[] } | null>(null);

  const save = useMutation({
    mutationFn: (c: Change) => saveRoleAccess(role!.key, c.perms, c.scopes),
    onSuccess: (_d, c) => toast({ title: 'Saved', description: c.done }),
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
    // Stay busy until the fresh list is back, so the next change builds on it.
    onSettled: () => Promise.all([
      qc.invalidateQueries({ queryKey: RBAC_KEY }),
      qc.invalidateQueries({ queryKey: [MY_ACCESS_QUERY] }),
    ]),
  });

  if (!role) return null;
  const isSuperRole = role.key === 'super_admin';
  const has = (key: string) => isSuperRole || role.permissions.includes(key);

  // Why this role can't be edited (or null if it can).
  const readOnly = isSuperRole ? 'Super Admin always has every permission. This cannot be changed.'
    : !ov.can_edit_roles ? 'You can view roles but not change them.'
      : !ov.is_super_admin && ov.my_role_keys.includes(role.key) ? 'You hold this role yourself, so only another administrator can change it.'
        : !ov.is_super_admin && role.permissions.some((k) => k.startsWith('settings.')) ? 'This role can change Settings, so only a Super Admin can edit it.' : null;

  /** Why one switch is locked for the current editor (or null). */
  const lockReason = (p: RbacPermission) => {
    if (readOnly) return readOnly;
    if (!ov.is_super_admin) {
      if (p.key.startsWith('settings.')) return 'Only a Super Admin can change Settings permissions.';
      if (!has(p.key) && !can(me, p.key)) return 'You can only give permissions you have yourself.';
    }
    return null;
  };

  const allScopes = (override: Record<string, Scope | ''> = {}) =>
    Object.fromEntries(ov.scope_resources.map((r) => [r.key, (override[r.key] ?? role.scopes[r.key] ?? '') as Scope | '']));

  const setPerms = (items: RbacPermission[], on: boolean, what: string) => {
    const changing = items.filter((p) => !lockReason(p) && has(p.key) !== on);
    if (!changing.length) return;
    const keys = changing.map((p) => p.key);
    const change: Change = {
      perms: on ? [...role.permissions, ...keys] : role.permissions.filter((k) => !keys.includes(k)),
      scopes: allScopes(),
      done: `${role.name}: ${what} ${on ? 'allowed' : 'removed'}.`,
    };
    const sensitive = on ? changing.filter((p) => p.sensitive) : [];
    if (sensitive.length) setConfirm({ change, sensitive }); else save.mutate(change);
  };

  const modules = groupPermissions(ov.permissions);
  const areas = [['admin', 'Admin pages'], ['portal', 'Employee Portal features']] as const;

  const row = (moduleName: string, pg: PageGroup) => {
    const open = pg.items.filter((p) => !lockReason(p));
    const allOn = pg.items.every((p) => has(p.key));
    return (
      <tr key={`${moduleName}-${pg.page}`} className="border-b border-[#eef1f7] align-top last:border-0 hover:bg-[#fafbff]">
        <th scope="row" className="px-5 py-3 text-left font-semibold text-[#101a3a]">{pg.page}</th>
        <td className="px-2 py-3 text-center">
          <Switch className="data-[state=checked]:bg-[#223f96]" aria-label={`${pg.page}: all actions`} checked={allOn}
            disabled={!open.length || save.isPending} onCheckedChange={(on) => setPerms(pg.items, on, `everything on ${pg.page}`)} />
        </td>
        {COLUMNS.map(([col]) => {
          const items = pg.items.filter((p) => columnOf(p) === col);
          return (
            <td key={col} className="px-2 py-3 text-center">
              {!items.length ? <span className="text-[#c9ceda]" aria-label="Not available">—</span> : (
                <div className="flex flex-col items-center gap-2">
                  {items.map((p) => {
                    const lock = lockReason(p);
                    return (
                      <div key={p.key} className="flex flex-col items-center gap-1" title={lock ?? p.description}>
                        <Switch className="data-[state=checked]:bg-[#223f96]" aria-label={`${pg.page}: ${actionName(p)}`}
                          checked={has(p.key)} disabled={!!lock || save.isPending}
                          onCheckedChange={(on) => setPerms([p], on, `“${pg.page}: ${actionName(p)}”`)} />
                        {(col === 'other' || actionName(p).toLowerCase() !== col) && (
                          <span className="max-w-[7.5rem] text-[10.5px] leading-tight text-muted-foreground">
                            {p.sensitive && <AlertTriangle className="mr-0.5 inline h-3 w-3 text-amber-600" aria-label="Sensitive" />}
                            {actionName(p)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" role="radiogroup" aria-label="Role">
        {ov.roles.map((r) => {
          const on = r.key === role.key;
          return (
            <button
              key={r.key}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={save.isPending}
              onClick={() => setParams({ tab: 'roles', role: r.key }, { replace: true })}
              className={`flex flex-col rounded-2xl border p-4 text-left transition-all ${on
                ? 'border-transparent bg-gradient-to-br from-[#223f96] to-[#3f63c9] text-white shadow-[0_10px_24px_-12px_rgba(34,63,150,0.7)]'
                : 'border-[#e7e9ee] bg-white shadow-sm hover:border-[#223f96]/30'}`}
            >
              <span className="flex items-center gap-2">
                {r.key === 'super_admin'
                  ? <Crown className={`h-4 w-4 ${on ? 'text-[#ffd0bd]' : 'text-[#f1592a]'}`} aria-hidden="true" />
                  : <ShieldCheck className={`h-4 w-4 ${on ? 'text-white' : 'text-[#223f96]'}`} aria-hidden="true" />}
                <span className={`text-sm font-bold ${on ? 'text-white' : 'text-[#101a3a]'}`}>{r.name}</span>
                <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${on ? 'bg-white/15' : 'bg-slate-100 text-slate-600'}`}>
                  <Users className="h-3 w-3" aria-hidden="true" />{r.users}
                </span>
              </span>
              <span className={`mt-1.5 block text-xs leading-relaxed ${on ? 'text-white/85' : 'text-muted-foreground'}`}>{ABOUT[r.key]?.who ?? r.description}</span>
              <span className={`mt-auto block pt-2 text-[11px] font-semibold ${on ? 'text-white/70' : 'text-[#223f96]'}`}>{ABOUT[r.key]?.how}</span>
            </button>
          );
        })}
      </div>

      {readOnly && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <Lock className="h-4 w-4 shrink-0" />{readOnly}
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 border-b border-[#eef0f4] py-4">
          <div>
            <CardTitle className="text-[15px] font-bold text-[#101a3a]">{role.name} — permissions</CardTitle>
            <CardDescription className="text-xs">Switch each action on or off. “All” turns the whole page on or off. Changes apply immediately.</CardDescription>
          </div>
          {save.isPending && <span className="inline-flex items-center gap-2 text-xs text-muted-foreground" role="status"><Loader2 className="h-4 w-4 animate-spin" />Saving…</span>}
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#223f96] text-white">
                <th scope="col" className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider">Page</th>
                <th scope="col" className="w-16 px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wider">All</th>
                {COLUMNS.map(([k, label]) => (
                  <th key={k} scope="col" className="w-24 px-2 py-3 text-center text-[11px] font-bold uppercase tracking-wider">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areas.map(([area, title]) => (
                <Fragment key={area}>
                  <tr className="bg-[#101a3a] text-white">
                    <th colSpan={COLUMNS.length + 2} scope="colgroup" className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider">{title}</th>
                  </tr>
                  {modules.filter((m) => m.area === area).map((m) => (
                    <Fragment key={m.module}>
                      <tr className="bg-[#f4f6fc]">
                        <th colSpan={COLUMNS.length + 2} scope="colgroup" className="px-5 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-[#45548a]">{m.module}</th>
                      </tr>
                      {m.pages.map((pg) => row(m.module, pg))}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Data access</CardTitle>
          <CardDescription>Whose records this role sees on admin pages. People always see their own records in the Employee Portal.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {ov.scope_resources.map((r) => (
            <div key={r.key} className="space-y-1">
              <div className="text-sm font-medium">{r.label}</div>
              <Select
                value={isSuperRole ? 'all' : role.scopes[r.key] || NOT_SET}
                disabled={!!readOnly || save.isPending}
                onValueChange={(v) => save.mutate({
                  perms: role.permissions,
                  scopes: allScopes({ [r.key]: v === NOT_SET ? '' : (v as Scope) }),
                  done: `${role.name}: ${r.label.toLowerCase()} access changed.`,
                })}
              >
                <SelectTrigger aria-label={`${r.label} data access`}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={NOT_SET}>Not set (no access)</SelectItem>
                  {r.scopes.map((s) => (
                    <SelectItem key={s} value={s} disabled={!ov.is_super_admin && s !== 'none' && rank(s) > rank(me?.scopes?.[r.key] ?? 'none')}>
                      {SCOPE_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{r.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give sensitive permissions?</DialogTitle>
            <DialogDescription>Everyone with the {role.name} role ({role.users} {role.users === 1 ? 'person' : 'people'}) will be able to:</DialogDescription>
          </DialogHeader>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {confirm?.sensitive.map((p) => <li key={p.key}><strong>{p.label}</strong> — {p.description}</li>)}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>Go back</Button>
            <Button onClick={() => { if (confirm) save.mutate(confirm.change); setConfirm(null); }}>Yes, allow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesTab;
