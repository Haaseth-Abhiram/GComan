import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Check, Contact, Copy, Eye, EyeOff, KeyRound, Loader2, Pencil, RefreshCw, Search, ShieldCheck, Trash2, UserPlus, UserRound } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChoiceBar, FormBody, FormDialogContent, FormFooter, FormHeader, FormSection, Required } from '@/components/admin/FormDialog';
import { useToast } from '@/hooks/use-toast';
import { generatePassword, isValidPassword, PASSWORD_RULE } from '@/portal/lib/access';
import { useCan } from '@/portal/lib/useCan';
import { RBAC_KEY, fetchAssignableRoles, type AssignableRole } from '@/portal/lib/rbac';
import {
  EMPLOYEES_QUERY, createEmployee, deleteEmployee, listEmployees, nextEmployeeCode,
  setEmployeeActive, setEmployeePassword, setWorkDetails, updateEmployee, EMPLOYMENT_TYPES, type EmployeeInput, type EmployeeRow,
} from '@/portal/lib/employees';
import { RoleChip } from '@/portal/theme/ui';
import { EmployeeProfileDialog } from '@/portal/components/ProfileCards';

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
  designation: '', joined_on: '', reporting_manager_id: '', proposal_access: false, proposal_code: '', employment_type: '', work_location: '', roles: [],
});
const formFrom = (e: EmployeeRow): FormState => ({
  employee_code: e.employee_code, full_name: e.full_name, email: e.email, password: '', phone: e.phone ?? '',
  department: e.department ?? '', designation: e.designation ?? '', joined_on: e.joined_on ?? '',
  reporting_manager_id: e.reporting_manager_id ?? '', proposal_access: !!e.proposal_code, proposal_code: e.proposal_code ?? '', employment_type: e.employment_type ?? '', work_location: e.work_location ?? '', roles: e.roles,
});

/** Live checklist for the temporary password; mirrors isValidPassword. */
const PASSWORD_CHECKS: { text: string; ok: (p: string) => boolean }[] = [
  { text: '8+ characters', ok: (p) => p.length >= 8 },
  { text: 'Uppercase', ok: (p) => /[A-Z]/.test(p) },
  { text: 'Lowercase', ok: (p) => /[a-z]/.test(p) },
  { text: 'Number', ok: (p) => /[0-9]/.test(p) },
];

/** Add / edit form. Email and password only when adding. */
const EmployeeForm = ({ mode, form, setForm, list, editingId, assignable, canPersonal }: {
  mode: 'add' | 'edit';
  form: FormState;
  setForm: (f: FormState) => void;
  list: EmployeeRow[];
  editingId?: string;
  /** Roles you can give by hand (Admin, Manager). */
  assignable: AssignableRole[];
  canPersonal: boolean;
}) => {
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const managers = list.filter((e) => e.active && e.id !== editingId);
  const toggleRole = (key: string, on: boolean) =>
    setForm({ ...form, roles: on ? [...form.roles, key] : form.roles.filter((r) => r !== key) });
  return (
    <>
      <FormSection icon={UserRound} title="Basic details" hint={mode === 'add' ? 'Who they are and how they sign in.' : 'Who they are.'}>
        <div className="space-y-2">
          <Label htmlFor="emp-name">Full name<Required /></Label>
          <Input id="emp-name" value={form.full_name} onChange={set('full_name')} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-code">Employee ID<Required /></Label>
          <Input id="emp-code" value={form.employee_code} onChange={set('employee_code')} required />
        </div>
        {mode === 'add' && (
          <div className="space-y-2">
            <Label htmlFor="emp-email">Email (their login)<Required /></Label>
            <Input id="emp-email" type="email" autoComplete="off" value={form.email} onChange={set('email')} required placeholder="name@company.com" />
          </div>
        )}
        {/* Personal details need their own permission (the database ignores them otherwise). */}
        {canPersonal && (
          <div className="space-y-2">
            <Label htmlFor="emp-phone">Phone</Label>
            <Input id="emp-phone" type="tel" value={form.phone} onChange={set('phone')} />
          </div>
        )}
        {mode === 'add' && (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="emp-password">Temporary password<Required /></Label>
            <PasswordField id="emp-password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            <ul className="flex flex-wrap gap-1.5" aria-label="Password requirements">
              {PASSWORD_CHECKS.map(({ text, ok }) => {
                const met = ok(form.password);
                return (
                  <li key={text} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${met ? 'bg-emerald-50 text-emerald-700' : 'bg-[#f1f3f8] text-muted-foreground'}`}>
                    {met ? <Check className="h-3 w-3" aria-hidden="true" /> : <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />}
                    {text}<span className="sr-only">{met ? ' (met)' : ' (not met)'}</span>
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-muted-foreground">Use ↻ to generate one.</p>
          </div>
        )}
      </FormSection>

      <FormSection icon={Briefcase} title="Job details" hint="Where they work and who they report to.">
        <div className="space-y-2">
          <Label htmlFor="emp-dept">Department</Label>
          <Input id="emp-dept" value={form.department} onChange={set('department')} placeholder="e.g. Sales" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-desig">Designation</Label>
          <Input id="emp-desig" value={form.designation} onChange={set('designation')} placeholder="e.g. Sales Executive" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Employment type</Label>
          <ChoiceBar label="Employment type" options={EMPLOYMENT_TYPES} value={form.employment_type} columns="grid-cols-2 sm:grid-cols-4"
            onPick={(key) => setForm({ ...form, employment_type: form.employment_type === key ? '' : key })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emp-location">Work location</Label>
          <Input id="emp-location" maxLength={120} value={form.work_location} onChange={set('work_location')} placeholder="e.g. Sohar office" />
        </div>
        {canPersonal && (
          <div className="space-y-2">
            <Label htmlFor="emp-joined">Joining date</Label>
            <Input id="emp-joined" type="date" value={form.joined_on} onChange={set('joined_on')} />
          </div>
        )}
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
      </FormSection>

      <FormSection icon={ShieldCheck} title="Role and access" hint="What this person is allowed to do.">
        <p className="text-xs text-muted-foreground sm:col-span-2">
          Everyone is an <strong>Employee</strong>. Someone with people reporting to them is also a <strong>Manager</strong>.
          Super Admin is set in Settings → Users &amp; Roles.
        </p>
        {assignable.map((r) => (
          <Label key={r.key} htmlFor={`role-${r.key}`}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 font-normal leading-normal transition-colors sm:col-span-2 ${form.roles.includes(r.key) ? 'border-[#f1592a] bg-[#fff7f3]' : 'hover:border-[#223f96]/40'}`}>
            <Checkbox id={`role-${r.key}`} aria-label={r.name} checked={form.roles.includes(r.key)} onCheckedChange={(c) => toggleRole(r.key, c === true)} className="mt-0.5" />
            <span>
              <span className="block text-sm font-medium">{r.name}</span>
              <span className="block text-xs text-muted-foreground">{r.description}{r.sensitive && ' Only a Super Admin can give or remove it.'}</span>
            </span>
          </Label>
        ))}
        <div className={`space-y-3 rounded-xl border p-3 transition-colors sm:col-span-2 ${form.proposal_access ? 'border-[#f1592a] bg-[#fff7f3]' : ''}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Label htmlFor="emp-proposal">Proposal Tracker access</Label>
              <p className="text-xs text-muted-foreground">Lets this person work on proposals in the Proposal Tracker.</p>
            </div>
            <Switch id="emp-proposal" checked={form.proposal_access} onCheckedChange={(on) => setForm({ ...form, proposal_access: on })} />
          </div>
          {form.proposal_access && (
            <div className="max-w-[220px] space-y-1">
              <Label htmlFor="emp-pcode">Tracker code</Label>
              <Input id="emp-pcode" className="bg-white" value={form.proposal_code} onChange={set('proposal_code')} placeholder="Next free code" />
            </div>
          )}
        </div>
      </FormSection>
    </>
  );
};

/**
 * Admin: every employee of the company. Adding one creates their login with
 * a temporary password the admin sends them personally (no emails are sent).
 */
const EmployeesAdmin = () => {
  const can = useCan();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: list = [], isLoading, error } = useQuery({ queryKey: EMPLOYEES_QUERY, queryFn: listEmployees });
  const { data: assignable = [] } = useQuery({ queryKey: [...RBAC_KEY, 'assignable'], queryFn: fetchAssignableRoles });
  const roleName = (k: string) => assignable.find((r) => r.key === k)?.name ?? k;

  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState<FormState | null>(null);
  const [editing, setEditing] = useState<{ row: EmployeeRow; form: FormState } | null>(null);
  const [saving, setSaving] = useState(false);
  const [creds, setCreds] = useState<{ name: string; email: string; password: string } | null>(null);
  const [resetting, setResetting] = useState<EmployeeRow | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [deleting, setDeleting] = useState<EmployeeRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [profileOf, setProfileOf] = useState<EmployeeRow | null>(null);

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
      const id = await createEmployee(adding);
      // The login exists from here on, so a failure below must not hide the new password.
      if (adding.employment_type || adding.work_location.trim()) await setWorkDetails(id, adding).catch(fail);
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
      if (editing.form.employment_type !== (editing.row.employment_type ?? '') || editing.form.work_location !== (editing.row.work_location ?? '')) {
        await setWorkDetails(editing.row.id, editing.form);
      }
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
            Everyone who signs in to the Employee Portal, with their role.
          </p>
        </div>
        {can('portal.employees.create') && <Button onClick={() => setAdding(emptyForm(list))}><UserPlus className="h-4 w-4 mr-2" />Add employee</Button>}
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
                    <TableHead>Role</TableHead>
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
                          {e.roles.map((k) => <RoleChip key={k} role={{ key: k, name: roleName(k) }} />)}
                          {e.reports_count > 0 && <RoleChip role={{ key: 'manager', name: `Manager (${e.reports_count})` }} />}
                          {!e.roles.length && !e.reports_count && <RoleChip role={{ key: 'employee', name: 'Employee' }} />}
                          {e.proposal_code && <Badge variant="outline" title="Proposal Tracker access">Tracker {e.proposal_code}</Badge>}
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
                        {(can('portal.employees.documents') || can('portal.employees.personal')) && <Button variant="ghost" size="sm" title="Profile and documents" onClick={() => setProfileOf(e)}>
                          <Contact className="h-4 w-4" /><span className="sr-only">Profile and documents of {e.full_name}</span>
                        </Button>}
                        {can('portal.employees.edit') && <Button variant="ghost" size="sm" title="Edit" onClick={() => setEditing({ row: e, form: formFrom(e) })}>
                          <Pencil className="h-4 w-4" /><span className="sr-only">Edit {e.full_name}</span>
                        </Button>}
                        {can('portal.employees.reset_password') && <Button variant="ghost" size="sm" title="Reset password" onClick={() => { setResetting(e); setNewPassword(''); }}>
                          <KeyRound className="h-4 w-4" /><span className="sr-only">Reset password for {e.full_name}</span>
                        </Button>}
                        {can('portal.employees.disable') && <Button variant={e.active ? 'outline' : 'default'} size="sm" disabled={busyId === e.id}
                          onClick={() => void run(e.id, () => setEmployeeActive(e.id, !e.active)).then((ok) => ok && toast({
                            title: e.active ? 'Employee disabled' : 'Employee enabled',
                            description: e.active ? `${e.full_name} has been signed out and can no longer sign in.` : `${e.full_name} can sign in again.`,
                          }))}>
                          {e.active ? 'Disable' : 'Enable'}
                        </Button>}
                        {can('portal.employees.delete') && <Button variant="ghost" size="sm" title="Delete" className="text-destructive hover:text-destructive" onClick={() => setDeleting(e)}>
                          <Trash2 className="h-4 w-4" /><span className="sr-only">Delete {e.full_name}</span>
                        </Button>}
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
      <EmployeeProfileDialog employee={profileOf} canDocuments={can('portal.employees.documents')} onClose={() => setProfileOf(null)} />

      {/* Add */}
      <Dialog open={!!adding} onOpenChange={(o) => !o && setAdding(null)}>
        <FormDialogContent>
          <form onSubmit={submitAdd} className="flex min-h-0 flex-1 flex-col">
            <FormHeader icon={UserPlus} title="Add employee"
              description="The login works straight away. They choose their own password at first sign-in." />
            <FormBody>
              {adding && <EmployeeForm mode="add" form={adding} setForm={setAdding} list={list} assignable={assignable} canPersonal={can('portal.employees.personal')} />}
            </FormBody>
            <FormFooter>
              <Button type="button" variant="outline" onClick={() => setAdding(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}Add employee
              </Button>
            </FormFooter>
          </form>
        </FormDialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <FormDialogContent>
          <form onSubmit={submitEdit} className="flex min-h-0 flex-1 flex-col">
            <FormHeader icon={Pencil} title={`Edit ${editing?.row.full_name ?? ''}`}
              description={<>Login email: {editing?.row.email}. A Super Admin can change it in Settings → Users &amp; Roles → Change email.</>} />
            <FormBody>
              {editing && (
                <EmployeeForm mode="edit" form={editing.form} setForm={(f) => setEditing({ ...editing, form: f })} assignable={assignable} canPersonal={can('portal.employees.personal')}
                  list={list} editingId={editing.row.id} />
              )}
            </FormBody>
            <FormFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save</Button>
            </FormFooter>
          </form>
        </FormDialogContent>
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
