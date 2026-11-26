/** Settings → Roles: list, create, rename, (de)activate, delete with reassignment. */
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Lock, MoreHorizontal, Pencil, Plus, Search, Trash2, Type } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { MY_ACCESS_QUERY } from '@/portal/lib/useMyAccess';
import { RBAC_KEY, deleteRole, saveRole, setRoleActive, type RbacOverview, type RbacRole } from '@/portal/lib/rbac';

// Plain-language note for the roles the system hands out by itself.
const AUTO_NOTE: Record<string, string> = {
  super_admin: 'Website administrators. Always has every permission.',
  employee: 'Everyone with an active employee account.',
  manager: 'Anyone who has people reporting to them.',
};

const RolesTab = ({ ov }: { ov: RbacOverview }) => {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [naming, setNaming] = useState<{ mode: 'new' | 'rename'; from?: RbacRole; name: string; description: string } | null>(null);
  const [deleting, setDeleting] = useState<{ role: RbacRole; reassign: string } | null>(null);

  const refresh = () => { void qc.invalidateQueries({ queryKey: RBAC_KEY }); void qc.invalidateQueries({ queryKey: [MY_ACCESS_QUERY] }); };
  const fail = (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' });

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? ov.roles.filter((r) => `${r.name} ${r.description}`.toLowerCase().includes(s)) : ov.roles;
  }, [ov.roles, q]);

  const name = useMutation({
    mutationFn: async (n: NonNullable<typeof naming>) =>
      n.mode === 'rename' ? saveRole(n.from!.key, n.name, n.description) : saveRole(null, n.name, n.description),
    onSuccess: (key, n) => {
      refresh();
      setNaming(null);
      toast({ title: n.mode === 'rename' ? 'Role saved' : 'Role created' });
      if (n.mode !== 'rename') navigate(`/admin/settings/roles/${key}`);
    },
    onError: fail,
  });
  const toggle = useMutation({
    mutationFn: (r: RbacRole) => setRoleActive(r.key, !r.active),
    onSuccess: (_d, r) => { refresh(); toast({ title: r.active ? 'Role deactivated' : 'Role activated', description: r.active ? `Its ${r.users} people lose its permissions until it is active again.` : undefined }); },
    onError: fail,
  });
  const remove = useMutation({
    mutationFn: (d: NonNullable<typeof deleting>) => deleteRole(d.role.key, d.role.users ? d.reassign : null),
    onSuccess: (n, d) => { refresh(); setDeleting(null); toast({ title: 'Role deleted', description: n ? `${n} ${n === 1 ? 'person' : 'people'} ${d.reassign === '-' ? 'lost the role' : 'moved'}.` : undefined }); },
    onError: fail,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">Roles</CardTitle>
          <CardDescription>A role is a set of permissions for one kind of job. Open a role to choose its permissions and data access.</CardDescription>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search roles…" value={q} onChange={(e) => setQ(e.target.value)} className="w-48 pl-8" />
          </div>
          {ov.can_edit_roles && <Button onClick={() => setNaming({ mode: 'new', name: '', description: '' })}><Plus className="h-4 w-4 mr-2" />New role</Button>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead><TableHead>How people get it</TableHead><TableHead className="text-center">People</TableHead>
                <TableHead className="text-center">Permissions</TableHead><TableHead className="text-center">Active</TableHead><TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((r) => (
                <TableRow key={r.key} className={r.active ? '' : 'opacity-60'}>
                  <TableCell>
                    <Link to={`/admin/settings/roles/${r.key}`} className="font-medium hover:underline">{r.name}</Link>
                    {r.builtin && (
                      <Badge variant="outline" className="ml-2 text-muted-foreground"
                        title="Comes with the system: it can't be deleted or turned off. You can still change its permissions.">System role</Badge>
                    )}
                    <div className="text-xs text-muted-foreground">{AUTO_NOTE[r.key] ?? (r.description || '—')}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {r.implicit
                      ? <span title="The system gives this role by itself; you never assign it.">Automatically</span>
                      : <span title="Give it to people under People, or on the Employees page.">You assign it</span>}
                  </TableCell>
                  <TableCell className="text-center">{r.users}</TableCell>
                  <TableCell className="text-center">{r.key === 'super_admin' ? 'All' : r.permissions.length}</TableCell>
                  <TableCell className="text-center">
                    {r.builtin ? (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title="System roles are always on: the app depends on them.">
                        <Lock className="h-3 w-3" />Always on
                      </span>
                    ) : (
                      <Switch checked={r.active} disabled={!ov.can_edit_roles || toggle.isPending} aria-label={`${r.name} active`} onCheckedChange={() => toggle.mutate(r)} />
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/settings/roles/${r.key}`}><Pencil className="h-4 w-4 mr-1" />{ov.can_edit_roles && r.key !== 'super_admin' ? 'Edit permissions' : 'View'}</Link>
                    </Button>
                    {ov.can_edit_roles && !r.builtin ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-1" aria-label={`More actions for ${r.name}`}><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setNaming({ mode: 'rename', from: r, name: r.name, description: r.description })}>
                            <Type className="h-4 w-4 mr-2" />Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleting({ role: r, reassign: '' })}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : <span className="ml-1 inline-block w-9" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={!!naming} onOpenChange={(o) => !o && setNaming(null)}>
        <DialogContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (naming) name.mutate(naming); }}>
            <DialogHeader>
              <DialogTitle>{naming?.mode === 'rename' ? 'Rename role' : 'New role'}</DialogTitle>
              <DialogDescription>{naming?.mode === 'rename' ? 'People who have this role keep it.' : 'You choose its permissions on the next screen.'}</DialogDescription>
            </DialogHeader>
            {naming && (
              <div className="space-y-3">
                <div className="space-y-1"><Label htmlFor="rn">Name</Label>
                  <Input id="rn" required maxLength={40} value={naming.name} onChange={(e) => setNaming({ ...naming, name: e.target.value })} /></div>
                <div className="space-y-1"><Label htmlFor="rd">Description</Label>
                  <Input id="rd" maxLength={200} value={naming.description} onChange={(e) => setNaming({ ...naming, description: e.target.value })} /></div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNaming(null)}>Cancel</Button>
              <Button type="submit" disabled={name.isPending}>{name.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete the {deleting?.role.name} role?</DialogTitle>
            <DialogDescription>This can't be undone.</DialogDescription>
          </DialogHeader>
          {deleting && deleting.role.users > 0 && (
            <div className="space-y-2">
              <Label>{deleting.role.users} {deleting.role.users === 1 ? 'person has' : 'people have'} this role. Move them to:</Label>
              <Select value={deleting.reassign} onValueChange={(v) => setDeleting({ ...deleting, reassign: v })}>
                <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                <SelectContent>
                  {ov.roles.filter((r) => !r.implicit && r.active && r.key !== deleting.role.key).map((r) => <SelectItem key={r.key} value={r.key}>{r.name}</SelectItem>)}
                  <SelectItem value="-">No other role (just remove it)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" disabled={remove.isPending || (!!deleting?.role.users && !deleting.reassign)}
              onClick={() => deleting && remove.mutate(deleting)}>{remove.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Delete role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RolesTab;
