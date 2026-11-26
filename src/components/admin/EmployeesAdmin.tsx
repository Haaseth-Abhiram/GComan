import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Eye, EyeOff, KeyRound, Loader2, Pencil, RefreshCw, Search, Trash2, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { generatePassword, isValidPassword, PASSWORD_RULE } from '@/portal/lib/access';
import {
  ASSIGNABLE_ROLES, EMPLOYEES_QUERY, createEmployee, deleteEmployee, listEmployees, nextEmployeeCode, nextProposalCode,
  setEmployeeActive, setEmployeePassword, updateEmployee, type EmployeeInput, type EmployeeRow,
} from '@/portal/lib/employees';

const LOGIN_URL = 'https://gcoman.com/login';
const NO_MANAGER = 'none';

/** Password input with show/hide and a "generate" button. */
const PasswordField = ({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input id={id} type={show ? 'text' : 'password'} value={value} autoComplete="new-password" required
          onChange={(e) => onChange(e.target.value)} className="pr-10" />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <Button type="button" variant="outline" size="icon" title="Generate a password" onClick={() => { onChange(generatePassword()); setShow(true); }}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

/** Shown once after adding an employee or resetting a password, so the admin can send it. */
const CredentialsDialog = ({ creds, onClose }: { creds: { name: string; email: string; password: string } | null; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const text = creds
    ? `Hello ${creds.name},\n\nYour Global Chemicals LLC employee portal login:\n\nLogin page: ${LOGIN_URL}\nEmail: ${creds.email}\nTemporary password: ${creds.password}\n\nYou will be asked to choose your own password the first time you sign in. Please keep these details private.`
    : '';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: the text is still selectable */ }
  };
  return (
    <Dialog open={!!creds} onOpenChange={(o) => { if (!o) { setCopied(false); onClose(); } }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send these login details</DialogTitle>
          <DialogDescription>
            This is the only time the password is shown. Copy it and send it to the employee yourself. If it gets lost, use Reset password.
          </DialogDescription>
        </DialogHeader>
        <pre className="whitespace-pre-wrap rounded-md border bg-muted/50 p-3 text-sm font-mono select-all">{text}</pre>
        <DialogFooter>
          <Button onClick={() => void copy()}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Copied' : 'Copy message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type FormState = EmployeeInput & { email: string; password: string };
const emptyForm = (list: EmployeeRow[]): FormState => ({
  employee_code: nextEmployeeCode(list), full_name: '', email: '', password: '', phone: '', department: '',
  designation: '', joined_on: '', reporting_manager_id: '', proposal_code: '', roles: [],
});
const formFrom = (e: EmployeeRow): FormState => ({
  employee_code: e.employee_code, full_name: e.full_name, email: e.email, password: '', phone: e.phone ?? '',
  department: e.department ?? '', designation: e.designation ?? '', joined_on: e.joined_on ?? '',
  reporting_manager_id: e.reporting_manager_id ?? '', proposal_code: e.proposal_code ?? '', roles: e.roles,
});

/** Add / edit form. Email and password only when adding. */
const EmployeeForm = ({ mode, form, setForm, list, editingId }: {
  mode: 'add' | 'edit';
  form: FormState;
  setForm: (f: FormState) => void;
  list: EmployeeRow[];
  editingId?: string;
}) => {
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const managers = list.filter((e) => e.active && e.id !== editingId);
  const toggleRole = (key: string, on: boolean) => {
    const roles = on ? [...form.roles, key] : form.roles.filter((r) => r !== key);
    const proposal_code = key === 'proposal_engineer' && on && !form.proposal_code ? nextProposalCode(list) : form.proposal_code;
    setForm({ ...form, roles, proposal_code });
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="emp-code">Employee ID</Label>
        <Input id="emp-code" value={form.employee_code} onChange={set('employee_code')} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emp-name">Full name</Label>
        <Input id="emp-name" value={form.full_name} onChange={set('full_name')} required />
      </div>
      {mode === 'add' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="emp-email">Email (their login)</Label>
            <Input id="emp-email" type="email" autoComplete="off" value={form.email} onChange={set('email')} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-password">Temporary password</Label>
            <PasswordField id="emp-password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="emp-dept">Department</Label>
        <Input id="emp-dept" value={form.department} onChange={set('department')} placeholder="e.g. Sales" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emp-desig">Designation</Label>
        <Input id="emp-desig" value={form.designation} onChange={set('designation')} placeholder="e.g. Proposal Engineer" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emp-phone">Phone</Label>
        <Input id="emp-phone" type="tel" value={form.phone} onChange={set('phone')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emp-joined">Joining date</Label>
        <Input id="emp-joined" type="date" value={form.joined_on} onChange={set('joined_on')} />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="emp-manager">Reports to</Label>
        <Select value={form.reporting_manager_id || NO_MANAGER}
          onValueChange={(v) => setForm({ ...form, reporting_manager_id: v === NO_MANAGER ? '' : v })}>
          <SelectTrigger id="emp-manager"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_MANAGER}>No manager (the admin approves directly)</SelectItem>
            {managers.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name} ({m.employee_code})</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">The person chosen here becomes a Manager automatically and will approve this employee's leave.</p>
      </div>
      <div className="space-y-3 sm:col-span-2 rounded-md border p-3">
        <p className="text-sm font-medium">Roles</p>
        <p className="text-xs text-muted-foreground">Everyone is an Employee. Extra roles:</p>
        {ASSIGNABLE_ROLES.map((r) => {
          const on = form.roles.includes(r.key);
          return (
            <div key={r.key} className="space-y-2">
              <div className="flex items-start gap-2">
                <Checkbox id={`role-${r.key}`} checked={on} onCheckedChange={(c) => toggleRole(r.key, c === true)} className="mt-0.5" />
                <div>
                  <Label htmlFor={`role-${r.key}`}>{r.name}</Label>
                  <p className="text-xs text-muted-foreground">{r.description}</p>
                </div>
              </div>
              {r.key === 'proposal_engineer' && on && (
                <div className="ml-6 max-w-[160px] space-y-1">
                  <Label htmlFor="emp-pcode">Tracker code</Label>
                  <Input id="emp-pcode" value={form.proposal_code} onChange={set('proposal_code')} required />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Admin: every employee of the company. Adding one creates their login with
 * a temporary password the admin sends them personally (no emails are sent).
 */
const EmployeesAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: list = [], isLoading, error } = useQuery({ queryKey: EMPLOYEES_QUERY, queryFn: listEmployees });

  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState<FormState | null>(null);
  const [editing, setEditing] = useState<{ row: EmployeeRow; form: FormState } | null>(null);
  const [saving, setSaving] = useState(false);
  const [creds, setCreds] = useState<{ name: string; email: string; password: string } | null>(null);
  const [resetting, setResetting] = useState<EmployeeRow | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [deleting, setDeleting] = useState<EmployeeRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: EMPLOYEES_QUERY });
  const fail = (e: unknown) => toast({ title: 'Could not save', description: e instanceof Error ? e.message : String(e), variant: 'destructive' });

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((e) => [e.employee_code, e.full_name, e.email, e.department, e.designation, e.proposal_code]
      .some((v) => v?.toLowerCase().includes(q)));
  }, [list, query]);

  const run = async (id: string, fn: () => Promise<void>) => {
    setBusyId(id);
    try {
      await fn();
      await refresh();
      return true;
    } catch (e) {
      fail(e);
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const submitAdd = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!adding) return;
    if (!isValidPassword(adding.password)) {
      toast({ title: 'Password too weak', description: `Use ${PASSWORD_RULE}.`, variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await createEmployee(adding);
      setCreds({ name: adding.full_name.trim(), email: adding.email.trim().toLowerCase(), password: adding.password });
      setAdding(null);
      await refresh();
    } catch (e) {
      fail(e);
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      await updateEmployee(editing.row.id, editing.form);
      toast({ title: 'Employee updated', description: editing.form.full_name });
      setEditing(null);
      await refresh();
    } catch (e) {
      fail(e);
    } finally {
      setSaving(false);
    }
  };

  const submitReset = async () => {
    if (!resetting) return;
    if (!isValidPassword(newPassword)) {
      toast({ title: 'Password too weak', description: `Use ${PASSWORD_RULE}.`, variant: 'destructive' });
      return;
    }
    const e = resetting;
    if (await run(e.id, () => setEmployeePassword(e.id, newPassword))) {
      setResetting(null);
      setCreds({ name: e.full_name, email: e.email, password: newPassword });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Everyone who signs in to the Employee Portal. Proposal engineers are employees with the Proposal Engineer role.
          </p>
        </div>
        <Button onClick={() => setAdding(emptyForm(list))}><UserPlus className="h-4 w-4 mr-2" />Add employee</Button>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name, ID, email, department…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : error ? (
            <p className="text-sm text-destructive">Could not load employees: {(error as Error).message}</p>
          ) : list.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No employees yet. Use “Add employee”.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Reports to</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((e) => (
                    <TableRow key={e.id} className={e.active ? '' : 'opacity-60'}>
                      <TableCell className="font-medium whitespace-nowrap">{e.employee_code}</TableCell>
                      <TableCell>
                        <div className="font-medium">{e.full_name}</div>
                        {e.designation && <div className="text-xs text-muted-foreground">{e.designation}</div>}
                      </TableCell>
                      <TableCell>{e.email}</TableCell>
                      <TableCell>{e.department ?? '—'}</TableCell>
                      <TableCell>{e.manager_name ?? '—'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {e.roles.includes('proposal_engineer') && <Badge variant="secondary">Proposal Engineer {e.proposal_code}</Badge>}
                          {e.reports_count > 0 && <Badge variant="secondary">Manager ({e.reports_count})</Badge>}
                          {!e.roles.length && !e.reports_count && <span className="text-xs text-muted-foreground">Employee</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {!e.active
                          ? <Badge variant="secondary">Disabled</Badge>
                          : e.must_change_password
                            ? <Badge variant="outline" className="border-amber-400 text-amber-700 whitespace-nowrap" title="Still using the password you gave them">Temporary password</Badge>
                            : <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge>}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap space-x-1">
                        <Button variant="ghost" size="sm" title="Edit" onClick={() => setEditing({ row: e, form: formFrom(e) })}>
                          <Pencil className="h-4 w-4" /><span className="sr-only">Edit {e.full_name}</span>
                        </Button>
                        <Button variant="ghost" size="sm" title="Reset password" onClick={() => { setResetting(e); setNewPassword(''); }}>
                          <KeyRound className="h-4 w-4" /><span className="sr-only">Reset password for {e.full_name}</span>
                        </Button>
                        <Button variant={e.active ? 'outline' : 'default'} size="sm" disabled={busyId === e.id}
                          onClick={() => void run(e.id, () => setEmployeeActive(e.id, !e.active)).then((ok) => ok && toast({
                            title: e.active ? 'Employee disabled' : 'Employee enabled',
                            description: e.active ? `${e.full_name} has been signed out and can no longer sign in.` : `${e.full_name} can sign in again.`,
                          }))}>
                          {e.active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete" className="text-destructive hover:text-destructive" onClick={() => setDeleting(e)}>
                          <Trash2 className="h-4 w-4" /><span className="sr-only">Delete {e.full_name}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {shown.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No employee matches “{query}”.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <CredentialsDialog creds={creds} onClose={() => setCreds(null)} />

      {/* Add */}
      <Dialog open={!!adding} onOpenChange={(o) => !o && setAdding(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={submitAdd} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add employee</DialogTitle>
              <DialogDescription>
                The login works straight away. The password is temporary: they must choose their own at first sign-in. Password: {PASSWORD_RULE}. Use ↻ to generate one.
              </DialogDescription>
            </DialogHeader>
            {adding && <EmployeeForm mode="add" form={adding} setForm={setAdding} list={list} />}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAdding(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Add employee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={submitEdit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit {editing?.row.full_name}</DialogTitle>
              <DialogDescription>
                Login email: {editing?.row.email}. The email can't be changed; to use a different one, delete the employee and add them again.
              </DialogDescription>
            </DialogHeader>
            {editing && (
              <EmployeeForm mode="edit" form={editing.form} setForm={(f) => setEditing({ ...editing, form: f })}
                list={list} editingId={editing.row.id} />
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset password */}
      <Dialog open={!!resetting} onOpenChange={(o) => !o && setResetting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password for {resetting?.full_name}</DialogTitle>
            <DialogDescription>Their old password stops working immediately. Send them the new one; they'll be asked to choose their own when they next sign in.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reset-password">New password</Label>
            <PasswordField id="reset-password" value={newPassword} onChange={setNewPassword} />
            <p className="text-xs text-muted-foreground">{PASSWORD_RULE}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetting(null)}>Cancel</Button>
            <Button disabled={busyId === resetting?.id} onClick={() => void submitReset()}>Set password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.full_name} ({deleting?.employee_code})?</AlertDialogTitle>
            <AlertDialogDescription>
              Their login is removed permanently and can't be undone. Anyone reporting to them will have no manager. To block them but keep the record, use Disable instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { const e = deleting!; void run(e.id, () => deleteEmployee(e.id)).then((ok) => ok && toast({ title: 'Employee deleted', description: `${e.full_name} has been removed.` })); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesAdmin;
