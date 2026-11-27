/** Settings → Audit log: every change to roles, permissions, scopes and Super Admins. */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RBAC_KEY, SCOPE_LABEL, fetchAudit, fetchRbacUsers, type AuditEntry, type RbacOverview, type Scope } from '@/portal/lib/rbac';

const ANY = '__any__';
const scopeText = (v: unknown) => (v ? SCOPE_LABEL[v as Scope] ?? String(v) : 'not set');

/** One plain sentence per entry. */
const describe = (a: AuditEntry, ov: RbacOverview) => {
  const role = a.role_name ?? a.role_key ?? 'a role';
  const who = a.user_name ?? 'someone';
  const perm = a.permission_label ?? a.permission_key ?? '';
  const res = ov.scope_resources.find((r) => r.key === a.resource)?.label ?? a.resource;
  const o = a.old_value ?? {}; const n = a.new_value ?? {};
  switch (a.entity) {
    case 'role':
      if (a.action === 'created') return `Created role “${String(n.name)}”`;
      if (a.action === 'removed') return `Deleted role “${String(o.name)}”`;
      return ['name', 'description', 'active'].filter((k) => o[k] !== n[k]).map((k) =>
        k === 'active' ? `${n.active ? 'Activated' : 'Deactivated'} role “${String(n.name)}”`
          : `Changed ${k} of role “${String(o.name)}”: “${String(o[k] ?? '')}” → “${String(n[k] ?? '')}”`).join('; ') || `Changed role “${String(n.name)}”`;
    case 'role_permission': return a.action === 'created' ? `Granted “${perm}” to ${role}` : `Revoked “${perm}” from ${role}`;
    case 'user_role': return a.action === 'created' ? `Gave ${role} role to ${who}` : `Removed ${role} role from ${who}`;
    case 'user_override':
      if (a.action === 'removed') return `Removed personal ${String(o.effect)} of “${perm}” for ${who}`;
      return `Personal ${String(n.effect)}: “${perm}” for ${who}${n.reason ? ` (${String(n.reason)})` : ''}`;
    case 'role_scope': return `${role} · ${res} access: ${scopeText(o.scope)} → ${scopeText(n.scope)}`;
    case 'user_scope': return `${who} · personal ${res} access: ${scopeText(o.scope)} → ${a.action === 'removed' ? 'follow roles' : scopeText(n.scope)}`;
    case 'user_email': return `Changed the sign-in email of ${who}: ${String(o.email)} → ${String(n.email)}`;
    case 'super_admin': return a.action === 'created' ? `Made ${who} a Super Admin` : `Removed Super Admin from ${who}`;
    default: return `${a.entity} ${a.action}`;
  }
};

const AuditTab = ({ ov }: { ov: RbacOverview }) => {
  const [user, setUser] = useState(ANY);
  const [role, setRole] = useState(ANY);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  // The person filter needs "Users: view"; without it the list is simply empty.
  const { data: users = [] } = useQuery({ queryKey: [...RBAC_KEY, 'users'], queryFn: fetchRbacUsers, retry: false });
  const { data = [], isLoading, error } = useQuery({
    queryKey: [...RBAC_KEY, 'audit', user, role, from, to],
    queryFn: () => fetchAudit({ user: user === ANY ? null : user, role: role === ANY ? null : role, from, to }),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit log</CardTitle>
        <CardDescription>Every change to roles, permissions, data access and Super Admins: who made it, when, and old → new. Latest 500.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1"><Label>Person (changed or changed by)</Label>
            <Select value={user} onValueChange={setUser}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Anyone</SelectItem>
                {users.map((u) => <SelectItem key={u.user_id} value={u.user_id}>{u.full_name}</SelectItem>)}
              </SelectContent>
            </Select></div>
          <div className="space-y-1"><Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any role</SelectItem>
                {ov.roles.map((r) => <SelectItem key={r.key} value={r.key}>{r.name}</SelectItem>)}
              </SelectContent>
            </Select></div>
          <div className="space-y-1"><Label htmlFor="af">From</Label><Input id="af" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" /></div>
          <div className="space-y-1"><Label htmlFor="at">To</Label><Input id="at" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" /></div>
          <Button variant="ghost" onClick={() => { setUser(ANY); setRole(ANY); setFrom(''); setTo(''); }}>Clear</Button>
        </div>
        {isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
            : !data.length ? <p className="py-8 text-center text-sm text-muted-foreground">No changes recorded for this filter.</p> : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="w-[170px]">When</TableHead><TableHead className="w-[170px]">By</TableHead><TableHead>Change</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {data.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="whitespace-nowrap text-sm">{new Date(a.at).toLocaleString('en-GB', { timeZone: 'Asia/Muscat', dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                        <TableCell className="text-sm">{a.actor_name ?? (a.actor ? 'Unknown' : 'System')}</TableCell>
                        <TableCell className="text-sm">{describe(a, ov)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
      </CardContent>
    </Card>
  );
};

export default AuditTab;
