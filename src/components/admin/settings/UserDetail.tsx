/**
 * Settings → People → one person: roles, Super Admin, data access, personal
 * allow/deny exceptions, and the effective permissions with where each comes from.
 * Precedence: Super Admin › personal deny › personal allow › active roles › denied.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, Loader2, Lock, Save, Search, ShieldCheck, Undo2, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { can } from '@/portal/lib/access';
import { useMyAccess, MY_ACCESS_QUERY } from '@/portal/lib/useMyAccess';
import {
  RBAC_KEY, SCOPE_LABEL, fetchRbacOverview, fetchRbacUsers, fetchUserDetail, groupPermissions, setSuperAdmin, setUserOverrides,
  setUserRoles, type RbacPermission, type Scope, type UserOverride,
} from '@/portal/lib/rbac';
import { PermissionTree, matches, useUnsavedWarning } from './PermissionTree';

type Choice = 'default' | 'allow' | 'deny';
const FOLLOW = '__follow__';

const UserDetail = () => {
  const { userId = '' } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: me } = useMyAccess();
  const { data: ov } = useQuery({ queryKey: [...RBAC_KEY, 'overview'], queryFn: fetchRbacOverview });
  const { data: users = [] } = useQuery({ queryKey: [...RBAC_KEY, 'users'], queryFn: fetchRbacUsers });
  const { data: detail, isLoading, error } = useQuery({ queryKey: [...RBAC_KEY, 'user', userId], queryFn: () => fetchUserDetail(userId) });
  const u = users.find((x) => x.user_id === userId);

  const [roles, setRoles] = useState<string[]>([]);
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [scopes, setScopes] = useState<Record<string, Scope | ''>>({});
  const [search, setSearch] = useState('');
  const [onlyExceptions, setOnlyExceptions] = useState(false);
  const [onlyAllowed, setOnlyAllowed] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<RbacPermission[] | null>(null);
  const [leaving, setLeaving] = useState(false);

  const reset = () => {
    if (!detail || !u) return;
    setRoles([...u.roles]);
    setChoices(Object.fromEntries(detail.overrides.map((o) => [o.key, o.effect])));
    setReasons(Object.fromEntries(detail.overrides.map((o) => [o.key, o.reason ?? ''])));
    setScopes({ ...detail.scope_overrides });
  };
  useEffect(reset, [detail, u?.roles.join()]); // eslint-disable-line react-hooks/exhaustive-deps -- reset when the stored data changes
  useEffect(() => { if (ov) setExpanded(new Set(groupPermissions(ov.permissions).map((m) => m.module))); }, [ov?.permissions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const perms = ov?.permissions ?? [];
  const storedChoice = (k: string): Choice => detail?.overrides.find((o) => o.key === k)?.effect ?? 'default';
  const rolesDirty = !!u && [...roles].sort().join() !== [...u.roles].sort().join();
  const overridesDirty = perms.some((p) => (choices[p.key] ?? 'default') !== storedChoice(p.key)
    || ((choices[p.key] ?? 'default') !== 'default' && (reasons[p.key] ?? '') !== (detail?.overrides.find((o) => o.key === p.key)?.reason ?? '')));
  const scopesDirty = !!detail && (ov?.scope_resources ?? []).some((r) => (scopes[r.key] || '') !== (detail.scope_overrides[r.key] || ''));
  const dirty = rolesDirty || overridesDirty || scopesDirty;
  useUnsavedWarning(dirty);

  const readOnly = !ov || !u || !detail ? 'Loading' :
    u.is_self ? 'This is you. Nobody can change their own access; ask another administrator.' :
      !ov.can_edit_users ? 'You can view people but not change their access.' :
        !u.employee_id ? 'This login has no employee record, so it holds no roles. Add them on the Employees page first.' : null;
  const exceptionsLocked = readOnly ?? (detail?.is_super_admin ? 'A Super Admin already has every permission.' : null);

  /** Why this exception can't be changed at all (or null). */
  const lockFor = (p: RbacPermission) => {
    if (exceptionsLocked) return exceptionsLocked;
    if (ov && !ov.is_super_admin && p.key.startsWith('settings.')) return 'Only a Super Admin can change Settings permissions.';
    return null;
  };
  /** Non-Super-Admins can only ALLOW what they have themselves (deny is always fine). */
  const allowBlocked = (p: RbacPermission) => !!ov && !ov.is_super_admin && !can(me, p.key);

  const effectiveOf = (k: string) => detail?.effective.find((e) => e.key === k);

  const shownModules = useMemo(() => groupPermissions(perms.filter((p) =>
    matches(p, search)
    && (!onlyExceptions || (choices[p.key] ?? 'default') !== 'default')
    && (!onlyAllowed || effectiveOf(p.key)?.allowed))), [perms, search, onlyExceptions, onlyAllowed, choices, detail]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useMutation({
    mutationFn: async () => {
      if (rolesDirty) await setUserRoles(userId, roles);
      if (overridesDirty || scopesDirty) {
        const overrides: UserOverride[] = Object.entries(choices).filter(([, c]) => c !== 'default')
          .map(([key, c]) => ({ key, effect: c as 'allow' | 'deny', reason: reasons[key] || null }));
        await setUserOverrides(userId, overrides, Object.fromEntries((ov?.scope_resources ?? []).map((r) => [r.key, scopes[r.key] || ''])));
      }
    },
    onSuccess: () => {
      toast({ title: 'Access saved', description: u?.full_name });
      setConfirm(null);
      void qc.invalidateQueries({ queryKey: RBAC_KEY });
      void qc.invalidateQueries({ queryKey: [MY_ACCESS_QUERY] });
    },
    onError: (e: Error) => { setConfirm(null); toast({ title: 'Could not save', description: e.message, variant: 'destructive' }); void qc.invalidateQueries({ queryKey: RBAC_KEY }); },
  });
  const trySave = () => {
    const sensitive = perms.filter((p) => p.sensitive && choices[p.key] === 'allow' && storedChoice(p.key) !== 'allow');
    const sensitiveRoles = (ov?.roles ?? []).filter((r) => roles.includes(r.key) && !u?.roles.includes(r.key))
      .flatMap((r) => perms.filter((p) => p.sensitive && r.permissions.includes(p.key)));
    const all = [...new Map([...sensitive, ...sensitiveRoles].map((p) => [p.key, p])).values()];
    if (all.length) setConfirm(all); else save.mutate();
  };
  const superToggle = useMutation({
    mutationFn: (on: boolean) => setSuperAdmin(userId, on),
    onSuccess: (_d, on) => { toast({ title: on ? 'Now a Super Admin' : 'Super Admin removed', description: u?.full_name }); void qc.invalidateQueries({ queryKey: RBAC_KEY }); },
    onError: (e: Error) => toast({ title: 'Could not change', description: e.message, variant: 'destructive' }),
  });

  if (isLoading || !ov) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !detail || !u) return <p className="text-sm text-muted-foreground">{(error as Error)?.message ?? 'Person not found.'} <Link className="underline" to="/admin/settings?tab=users">Back</Link></p>;

  const back = () => (dirty ? setLeaving(true) : navigate('/admin/settings?tab=users'));
  const assignable = ov.roles.filter((r) => !r.implicit);
  const autoRoles = ov.roles.filter((r) => r.implicit && detail.active_roles.includes(r.key) && r.key !== 'super_admin');
  const sourceText = (k: string) => {
    const e = effectiveOf(k);
    if (detail.is_super_admin) return 'Super Admin';
    if (!e) return '';
    if (e.override === 'deny') return 'Personal: denied';
    if (e.override === 'allow') return 'Personal: allowed';
    return e.from_roles.length ? `From ${e.from_roles.join(', ')}` : 'Not granted';
  };

  return (
    <div className="space-y-4 pb-24">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-1" onClick={back}><ArrowLeft className="h-4 w-4 mr-1" />People</Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {u.full_name}
          {detail.is_super_admin && <Badge className="bg-primary hover:bg-primary"><ShieldCheck className="h-3 w-3 mr-1" />Super Admin</Badge>}
          {!u.active && <Badge variant="secondary">Disabled</Badge>}
        </h1>
        <p className="text-sm text-muted-foreground">{[u.employee_code, u.email, u.department].filter(Boolean).join(' · ')}</p>
      </div>
      {readOnly && (
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900"><Lock className="h-4 w-4" />{readOnly}</div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Roles</CardTitle>
            <CardDescription>Their permissions are everything their active roles allow, plus personal exceptions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ov.is_super_admin && !u.is_self && (
              <div className="flex items-start justify-between gap-4 rounded-md border p-3">
                <div>
                  <Label htmlFor="super" className="font-medium">Super Admin</Label>
                  <p className="text-xs text-muted-foreground">Full access to everything, including the website, SEO and Settings. Saved immediately.</p>
                </div>
                <Switch id="super" checked={detail.is_super_admin} disabled={superToggle.isPending} onCheckedChange={(v) => superToggle.mutate(v)} />
              </div>
            )}
            {assignable.map((r) => (
              <div key={r.key} className="flex items-start gap-2">
                <Checkbox id={`r-${r.key}`} className="mt-0.5" checked={roles.includes(r.key)} disabled={!!readOnly || (!r.active && !roles.includes(r.key))}
                  onCheckedChange={(c) => setRoles(c === true ? [...roles, r.key] : roles.filter((x) => x !== r.key))} />
                <div>
                  <Label htmlFor={`r-${r.key}`}>{r.name}{!r.active && <span className="text-muted-foreground"> (inactive)</span>}</Label>
                  <p className="text-xs text-muted-foreground">{r.description || `${r.permissions.length} permissions`}</p>
                </div>
              </div>
            ))}
            {autoRoles.length > 0 && <p className="text-xs text-muted-foreground">Also given automatically by the system: {autoRoles.map((r) => r.name).join(', ')}.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Data access</CardTitle>
            <CardDescription>Normally follows their roles. Set a personal scope to override it for this person.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ov.scope_resources.map((r) => (
              <div key={r.key} className="grid grid-cols-[110px_1fr] items-center gap-3">
                <span className="text-sm font-medium">{r.label}</span>
                <Select value={scopes[r.key] || FOLLOW} disabled={!!exceptionsLocked}
                  onValueChange={(v) => setScopes({ ...scopes, [r.key]: v === FOLLOW ? '' : (v as Scope) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FOLLOW}>Follow roles (now: {SCOPE_LABEL[detail.effective_scopes[r.key] ?? 'none'].toLowerCase()})</SelectItem>
                    {r.scopes.map((s) => <SelectItem key={s} value={s}>{SCOPE_LABEL[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="exceptions">
        <TabsList>
          <TabsTrigger value="exceptions">Personal exceptions</TabsTrigger>
          <TabsTrigger value="effective">Effective permissions</TabsTrigger>
        </TabsList>
        <div className="my-3 flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search permissions…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Button size="sm" variant="ghost" onClick={() => setExpanded(new Set(shownModules.map((m) => m.module)))}>Expand all</Button>
          <Button size="sm" variant="ghost" onClick={() => setExpanded(new Set())}>Collapse all</Button>
        </div>

        <TabsContent value="exceptions" className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Use sparingly: <strong>Allow</strong> gives one permission without a role; <strong>Deny</strong> takes one away even if a role gives it.
          </p>
          <div className="flex items-center gap-2">
            <Checkbox id="onlyex" checked={onlyExceptions} onCheckedChange={(c) => setOnlyExceptions(c === true)} />
            <Label htmlFor="onlyex" className="text-sm font-normal">Only show exceptions</Label>
          </div>
          <PermissionTree
            modules={shownModules} expanded={expanded}
            toggle={(m) => setExpanded((e) => { const n = new Set(e); if (n.has(m)) n.delete(m); else n.add(m); return n; })}
            control={(p) => {
              const lock = lockFor(p);
              const c = choices[p.key] ?? 'default';
              return (
                <span className="inline-flex items-center gap-2">
                  <Select value={c} disabled={!!lock} onValueChange={(v) => setChoices({ ...choices, [p.key]: v as Choice })}>
                    <SelectTrigger className="h-8 w-[150px]" title={lock ?? undefined}><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">From roles ({effectiveOf(p.key)?.from_roles.length ? 'yes' : 'no'})</SelectItem>
                      <SelectItem value="allow" disabled={allowBlocked(p) && c !== 'allow'}>Allow{allowBlocked(p) ? ' (you lack it)' : ''}</SelectItem>
                      <SelectItem value="deny">Deny</SelectItem>
                    </SelectContent>
                  </Select>
                  {c !== 'default' && (
                    <Input className="h-8 w-48" placeholder="Reason (optional)" maxLength={300} disabled={!!lock}
                      value={reasons[p.key] ?? ''} onChange={(e) => setReasons({ ...reasons, [p.key]: e.target.value })} />
                  )}
                </span>
              );
            }}
            moduleSummary={(m) => {
              const n = m.keys.filter((k) => (choices[k] ?? 'default') !== 'default').length;
              return n ? `${n} exception${n === 1 ? '' : 's'}` : '';
            }}
          />
        </TabsContent>

        <TabsContent value="effective" className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox id="onlyal" checked={onlyAllowed} onCheckedChange={(c) => setOnlyAllowed(c === true)} />
            <Label htmlFor="onlyal" className="text-sm font-normal">Only show what they can do</Label>
            {dirty && <span className="text-xs text-amber-700">Shows the saved state — save to see your changes here.</span>}
          </div>
          <PermissionTree
            modules={shownModules} expanded={expanded}
            toggle={(m) => setExpanded((e) => { const n = new Set(e); if (n.has(m)) n.delete(m); else n.add(m); return n; })}
            control={(p) => {
              const ok = effectiveOf(p.key)?.allowed;
              return (
                <span className={`inline-flex w-[190px] items-center gap-1 text-xs ${ok ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                  {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}{sourceText(p.key)}
                </span>
              );
            }}
            moduleSummary={(m) => `${m.keys.filter((k) => effectiveOf(k)?.allowed).length} / ${m.keys.length}`}
          />
        </TabsContent>
      </Tabs>

      {!readOnly && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur md:left-[var(--sidebar-width,16rem)]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">{dirty ? 'You have unsaved changes.' : 'No unsaved changes.'}</span>
            <div className="flex gap-2">
              <Button variant="outline" disabled={!dirty || save.isPending} onClick={reset}><Undo2 className="h-4 w-4 mr-2" />Cancel changes</Button>
              <Button disabled={!dirty || save.isPending} onClick={trySave}>
                {save.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save changes
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give sensitive permissions?</DialogTitle>
            <DialogDescription>{u.full_name} will be able to:</DialogDescription>
          </DialogHeader>
          <ul className="list-disc space-y-1 pl-5 text-sm">{confirm?.map((p) => <li key={p.key}><strong>{p.label}</strong> — {p.description}</li>)}</ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>Go back</Button>
            <Button disabled={save.isPending} onClick={() => save.mutate()}>{save.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Yes, save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={leaving} onOpenChange={setLeaving}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>You changed {u.full_name}'s access but haven't saved.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaving(false)}>Stay</Button>
            <Button variant="destructive" onClick={() => navigate('/admin/settings?tab=users')}>Discard and leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDetail;
