/**
 * Settings → Roles → one role: every permission in a Module → Page → Action
 * tree, data scopes, bulk selection, search, and Save / Cancel. Nothing is
 * stored until Save; sensitive additions ask for confirmation first.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Eye, Loader2, Lock, Save, Search, Undo2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useMyAccess, MY_ACCESS_QUERY } from '@/portal/lib/useMyAccess';
import { can } from '@/portal/lib/access';
import {
  RBAC_KEY, SCOPE_LABEL, fetchRbacOverview, groupPermissions, saveRoleAccess,
  type ModuleGroup, type RbacPermission, type Scope,
} from '@/portal/lib/rbac';
import { PermissionTree, matches, useUnsavedWarning } from './PermissionTree';

type Filter = 'all' | 'granted' | 'not_granted' | 'sensitive';
const NOT_SET = '__not_set__';

const RoleEditor = () => {
  const { roleKey = '' } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: me } = useMyAccess();
  const { data: ov, isLoading, error } = useQuery({ queryKey: [...RBAC_KEY, 'overview'], queryFn: fetchRbacOverview });
  const role = ov?.roles.find((r) => r.key === roleKey);

  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [scopes, setScopes] = useState<Record<string, Scope | ''>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<RbacPermission[] | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [preview, setPreview] = useState(false);

  // Load (and re-load after save) the stored state into the draft.
  const reset = () => {
    if (!role) return;
    setDraft(new Set(role.permissions));
    setScopes({ ...role.scopes });
  };
  useEffect(reset, [role?.key, ov]); // eslint-disable-line react-hooks/exhaustive-deps -- reset when the stored role changes
  useEffect(() => { if (ov) setExpanded(new Set(groupPermissions(ov.permissions).map((m) => m.module))); }, [ov?.permissions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const perms = ov?.permissions ?? [];
  const added = perms.filter((p) => draft.has(p.key) && !role?.permissions.includes(p.key));
  const removed = perms.filter((p) => !draft.has(p.key) && role?.permissions.includes(p.key));
  const scopeChanged = !!role && (ov?.scope_resources ?? []).some((r) => (scopes[r.key] || '') !== (role.scopes[r.key] || ''));
  const dirty = added.length + removed.length > 0 || scopeChanged;
  useUnsavedWarning(dirty);

  // Why this role can't be edited (or null if it can).
  const readOnly = !ov || !role ? 'Loading' :
    role.key === 'super_admin' ? 'Super Admin always has every permission.' :
      !ov.can_edit_roles ? 'You can view roles but not change them.' :
        !ov.is_super_admin && ov.my_role_keys.includes(role.key) ? 'You hold this role yourself, so only another administrator can change it.' :
          !ov.is_super_admin && role.permissions.some((k) => k.startsWith('settings.')) ? 'This role can change Settings, so only a Super Admin can edit it.' : null;

  /** Why one permission is locked for the current editor (or null). */
  const lockReason = (p: RbacPermission) => {
    if (readOnly) return readOnly;
    if (ov && !ov.is_super_admin) {
      if (p.key.startsWith('settings.')) return 'Only a Super Admin can change Settings permissions.';
      if (!draft.has(p.key) && !can(me, p.key)) return 'You can only give permissions you have yourself.';
    }
    return null;
  };

  const shownModules = useMemo(() => {
    const keep = (p: RbacPermission) => matches(p, search) && (
      filter === 'all' || (filter === 'granted' && draft.has(p.key)) || (filter === 'not_granted' && !draft.has(p.key)) || (filter === 'sensitive' && p.sensitive));
    return groupPermissions(perms.filter(keep));
  }, [perms, search, filter, draft]);

  const setMany = (keys: string[], on: boolean) => setDraft((d) => {
    const n = new Set(d);
    for (const k of keys) {
      const p = perms.find((x) => x.key === k);
      if (!p || lockReason(p)) continue;
      if (on) n.add(k); else n.delete(k);
    }
    return n;
  });
  const triState = (keys: string[]) => {
    const on = keys.filter((k) => draft.has(k)).length;
    return on === 0 ? false : on === keys.length ? true : 'indeterminate' as const;
  };

  const save = useMutation({
    mutationFn: () => saveRoleAccess(roleKey, [...draft], Object.fromEntries((ov?.scope_resources ?? []).map((r) => [r.key, scopes[r.key] || '']))),
    onSuccess: () => {
      toast({ title: 'Role saved', description: `${role?.name}: ${added.length} added, ${removed.length} removed.` });
      setConfirm(null);
      void qc.invalidateQueries({ queryKey: RBAC_KEY });
      void qc.invalidateQueries({ queryKey: [MY_ACCESS_QUERY] });
    },
    onError: (e: Error) => { setConfirm(null); toast({ title: 'Could not save', description: e.message, variant: 'destructive' }); },
  });
  const trySave = () => {
    const sensitive = added.filter((p) => p.sensitive);
    if (sensitive.length) setConfirm(sensitive); else save.mutate();
  };

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !ov) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;
  if (!role) return <p className="text-sm text-muted-foreground">Role not found. <Link className="underline" to="/admin/settings">Back to Settings</Link></p>;

  const total = perms.length;
  const allKeys = shownModules.flatMap((m) => m.keys);
  const back = () => (dirty ? setLeaving(true) : navigate('/admin/settings?tab=roles'));

  // Pages and actions this role reaches, for the preview.
  const previewModules = groupPermissions(perms.filter((p) => role.key === 'super_admin' || draft.has(p.key)));

  return (
    <div className="space-y-4 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-1" onClick={back}><ArrowLeft className="h-4 w-4 mr-1" />Roles</Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {role.name}
            {!role.active && <Badge variant="secondary">Inactive</Badge>}
            {role.builtin && <Badge variant="outline">System role</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground">
            {role.description || 'No description.'} · {role.implicit ? 'Given automatically' : 'You assign it'} · {role.users} {role.users === 1 ? 'person' : 'people'} · {draft.size} of {total} permissions
          </p>
        </div>
        <Button variant="outline" onClick={() => setPreview(true)}><Eye className="h-4 w-4 mr-2" />Preview access</Button>
      </div>

      {readOnly && (
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <Lock className="h-4 w-4" />{readOnly}
        </div>
      )}

      {/* Data scopes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Data access</CardTitle>
          <CardDescription>Whose records this role sees on pages it can open. People always see their own records in the Employee Portal.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {ov.scope_resources.map((r) => (
            <div key={r.key} className="space-y-1">
              <div className="text-sm font-medium">{r.label}</div>
              <Select value={(scopes[r.key] || NOT_SET)} disabled={!!readOnly}
                onValueChange={(v) => setScopes({ ...scopes, [r.key]: v === NOT_SET ? '' : (v as Scope) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search permissions…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <div className="flex flex-wrap gap-1">
          {([['all', 'All'], ['granted', 'Granted'], ['not_granted', 'Not granted'], ['sensitive', 'Sensitive']] as const).map(([k, l]) => (
            <Button key={k} size="sm" variant={filter === k ? 'default' : 'outline'} onClick={() => setFilter(k)}>{l}</Button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap gap-1">
          <Button size="sm" variant="ghost" onClick={() => setExpanded(new Set(shownModules.map((m) => m.module)))}>Expand all</Button>
          <Button size="sm" variant="ghost" onClick={() => setExpanded(new Set())}>Collapse all</Button>
          {!readOnly && <>
            <Button size="sm" variant="outline" onClick={() => setMany(allKeys, true)}>Select all</Button>
            <Button size="sm" variant="outline" onClick={() => setMany(allKeys, false)}>Deselect all</Button>
          </>}
        </div>
      </div>

      {!shownModules.length ? <p className="py-8 text-center text-sm text-muted-foreground">No permissions match.</p> : (
        <PermissionTree
          modules={shownModules}
          expanded={expanded}
          toggle={(m) => setExpanded((e) => { const n = new Set(e); if (n.has(m)) n.delete(m); else n.add(m); return n; })}
          control={(p) => {
            const lock = lockReason(p);
            return (
              <Checkbox checked={role.key === 'super_admin' || draft.has(p.key)} disabled={!!lock} title={lock ?? undefined}
                aria-label={`${p.page} ${p.tab ?? ''} ${p.action}`} onCheckedChange={(c) => setMany([p.key], c === true)} />
            );
          }}
          moduleBulk={readOnly ? undefined : (m: ModuleGroup) => (
            <Checkbox checked={triState(m.keys)} aria-label={`All of ${m.module}`} onCheckedChange={(c) => setMany(m.keys, c === true)} />
          )}
          pageBulk={readOnly ? undefined : (_m, pg) => {
            const keys = pg.items.map((i) => i.key);
            return <Checkbox checked={triState(keys)} aria-label={`All of ${pg.page}`} onCheckedChange={(c) => setMany(keys, c === true)} />;
          }}
          moduleSummary={(m) => `${m.keys.filter((k) => role.key === 'super_admin' || draft.has(k)).length} / ${m.keys.length}`}
        />
      )}

      {/* Save bar */}
      {!readOnly && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 px-4 py-3 backdrop-blur md:left-[var(--sidebar-width,16rem)]">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {dirty ? `Unsaved: ${added.length} to add, ${removed.length} to remove${scopeChanged ? ', data access changed' : ''}.` : 'No unsaved changes.'}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" disabled={!dirty || save.isPending} onClick={reset}><Undo2 className="h-4 w-4 mr-2" />Cancel changes</Button>
              <Button disabled={!dirty || save.isPending} onClick={trySave}>
                {save.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm sensitive additions */}
      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give sensitive permissions?</DialogTitle>
            <DialogDescription>Everyone with the {role.name} role ({role.users} {role.users === 1 ? 'person' : 'people'}) will be able to:</DialogDescription>
          </DialogHeader>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {confirm?.map((p) => <li key={p.key}><strong>{p.label}</strong> — {p.description}</li>)}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>Go back</Button>
            <Button disabled={save.isPending} onClick={() => save.mutate()}>{save.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Yes, save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave with unsaved changes */}
      <Dialog open={leaving} onOpenChange={setLeaving}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>You changed this role but haven't saved. Leaving now throws the changes away.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaving(false)}>Stay</Button>
            <Button variant="destructive" onClick={() => navigate('/admin/settings?tab=roles')}>Discard and leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview */}
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>What {role.name} can do</DialogTitle>
            <DialogDescription>{dirty ? 'Including your unsaved changes.' : 'As saved.'} Data access: {ov.scope_resources.map((r) => `${r.label}: ${scopes[r.key] ? SCOPE_LABEL[scopes[r.key] as Scope] : 'not set'}`).join(' · ')}</DialogDescription>
          </DialogHeader>
          {!previewModules.length ? <p className="text-sm text-muted-foreground">Nothing yet: this role gives no permissions.</p> : (
            <div className="space-y-3">
              {previewModules.map((m) => (
                <div key={m.module}>
                  <div className="font-semibold">{m.module}</div>
                  <ul className="ml-4 list-disc text-sm">
                    {m.pages.map((pg) => (
                      <li key={pg.page}><span className="font-medium">{pg.page}</span>: {pg.items.map((i) => (i.tab ? `${i.tab} › ` : '') + i.action).join(', ')}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const rank = (s: string) => ({ own: 1, team: 2, department: 3, all: 4 } as Record<string, number>)[s] ?? 0;

export default RoleEditor;
