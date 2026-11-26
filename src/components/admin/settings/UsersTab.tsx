/** Settings → People: everyone with an employee account or Super Admin access. */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, ShieldCheck, UserCog } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RBAC_KEY, fetchRbacUsers, type RbacOverview, type RbacUser } from '@/portal/lib/rbac';

export const RoleBadges = ({ u, ov }: { u: RbacUser; ov: RbacOverview }) => {
  const role = (k: string) => ov.roles.find((r) => r.key === k);
  return (
    <div className="flex flex-wrap gap-1">
      {u.is_super_admin && <Badge className="bg-primary hover:bg-primary"><ShieldCheck className="h-3 w-3 mr-1" />Super Admin</Badge>}
      {u.roles.map((k) => (
        <Badge key={k} variant="secondary" className={role(k)?.active === false ? 'line-through opacity-60' : ''} title={role(k)?.active === false ? 'Role is inactive' : undefined}>
          {role(k)?.name ?? k}{k === 'proposal_engineer' && u.proposal_code ? ` ${u.proposal_code}` : ''}
        </Badge>
      ))}
      {u.automatic.map((k) => <Badge key={k} variant="outline" className="text-muted-foreground" title="Given automatically by the system">{role(k)?.name ?? k}</Badge>)}
      {u.overrides > 0 && <Badge variant="outline" className="border-sky-300 text-sky-700">{u.overrides} personal exception{u.overrides === 1 ? '' : 's'}</Badge>}
    </div>
  );
};

const ALL = '__all__';

const UsersTab = ({ ov }: { ov: RbacOverview }) => {
  const { data: users = [], isLoading, error } = useQuery({ queryKey: [...RBAC_KEY, 'users'], queryFn: fetchRbacUsers });
  const [q, setQ] = useState('');
  const [role, setRole] = useState(ALL);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users.filter((u) =>
      (!s || [u.full_name, u.email, u.employee_code, u.department].some((v) => v?.toLowerCase().includes(s)))
      && (role === ALL || (role === 'super_admin' ? u.is_super_admin : u.roles.includes(role) || u.automatic.includes(role))));
  }, [users, q, role]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">People</CardTitle>
          <CardDescription>Open a person to change their roles, data access and personal exceptions, or to see exactly what they can do.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search name, email, ID…" value={q} onChange={(e) => setQ(e.target.value)} className="w-56 pl-8" />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All roles</SelectItem>
              {ov.roles.map((r) => <SelectItem key={r.key} value={r.key}>{r.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          : error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Person</TableHead><TableHead>Roles</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
                <TableBody>
                  {shown.map((u) => (
                    <TableRow key={u.user_id} className={u.active ? '' : 'opacity-60'}>
                      <TableCell>
                        <div className="font-medium">{u.full_name}{u.is_self && <span className="text-xs text-muted-foreground"> (you)</span>}</div>
                        <div className="text-xs text-muted-foreground">{[u.employee_code, u.email, u.department].filter(Boolean).join(' · ')}</div>
                      </TableCell>
                      <TableCell><RoleBadges u={u} ov={ov} /></TableCell>
                      <TableCell>{u.active ? <Badge variant="outline" className="border-emerald-300 text-emerald-700">Active</Badge> : <Badge variant="secondary">Disabled</Badge>}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild><Link to={`/admin/settings/users/${u.user_id}`}><UserCog className="h-4 w-4 mr-1" />{ov.can_edit_users && !u.is_self ? 'Manage' : 'View'}</Link></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {!shown.length && <p className="py-6 text-center text-sm text-muted-foreground">Nobody matches.</p>}
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default UsersTab;
