import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Copy, Eye, EyeOff, KeyRound, Loader2, Pencil, RefreshCw, Trash2, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, EmptyState } from '@/proposal-tracker/components/tracker/common';
import {
  addEngineer, deleteEngineer, generatePassword, isValidPassword, listEngineers, nextEngineerCode, PASSWORD_RULE,
  renameEngineer, setEngineerActive, setEngineerPassword, type EngineerAccount,
} from '@/proposal-tracker/lib/accounts';

export const ENGINEER_ACCOUNTS_QUERY = ['proposal-engineers'];
const LOGIN_URL = 'https://gcoman.com/login';

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

/** Shown once after creating an engineer or resetting a password, so the admin can send it. */
const CredentialsDialog = ({ creds, onClose }: { creds: { name: string; email: string; password: string } | null; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const text = creds
    ? `Hello ${creds.name},\n\nYour Proposal Tracker login for Global Chemicals LLC:\n\nLogin page: ${LOGIN_URL}\nEmail: ${creds.email}\nPassword: ${creds.password}\n\nPlease keep these details private.`
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
            This is the only time the password is shown. Copy it and send it to the engineer yourself. If it gets lost, use Reset password.
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

/**
 * Admin: create proposal engineers with a password, reset passwords, rename,
 * disable/enable and delete them. The admin sends the credentials manually.
 */
const EngineerAccounts = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: engineers = [], isLoading, error } = useQuery({ queryKey: ENGINEER_ACCOUNTS_QUERY, queryFn: listEngineers });

  const [form, setForm] = useState({ code: '', name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [creds, setCreds] = useState<{ name: string; email: string; password: string } | null>(null);
  const [renaming, setRenaming] = useState<EngineerAccount | null>(null);
  const [newName, setNewName] = useState('');
  const [resetting, setResetting] = useState<EngineerAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [deleting, setDeleting] = useState<EngineerAccount | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ENGINEER_ACCOUNTS_QUERY });
  const fail = (e: unknown) => toast({ title: 'Could not save', description: e instanceof Error ? e.message : String(e), variant: 'destructive' });
  const code = form.code || nextEngineerCode(engineers);

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
    if (!isValidPassword(form.password)) {
      toast({ title: 'Password too weak', description: `Use ${PASSWORD_RULE}.`, variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await addEngineer({ ...form, code });
      setCreds({ name: form.name.trim(), email: form.email.trim().toLowerCase(), password: form.password });
      setForm({ code: '', name: '', email: '', password: '' });
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
    if (await run(e.id, () => setEngineerPassword(e.id, newPassword))) {
      setResetting(null);
      setCreds({ name: e.name, email: e.email, password: newPassword });
    }
  };

  return (
    <div>
      <PageHeader
        title="Engineer Accounts"
        description="Create proposal engineer logins and send each engineer their email and password yourself."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Add engineer</CardTitle>
          <CardDescription>
            The login works straight away. Password: {PASSWORD_RULE}. Use the ↻ button to generate one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitAdd} className="grid gap-4 md:grid-cols-[90px_1fr_1fr_1fr_auto] items-end">
            <div className="space-y-2">
              <Label htmlFor="eng-code">Code</Label>
              <Input id="eng-code" value={code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eng-name">Full name</Label>
              <Input id="eng-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eng-email">Email (their login)</Label>
              <Input id="eng-email" type="email" autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eng-password">Password</Label>
              <PasswordField id="eng-password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : error ? (
            <p className="text-sm text-destructive">Could not load engineers: {(error as Error).message}</p>
          ) : engineers.length === 0 ? (
            <EmptyState title="No engineers yet" hint="Add your first proposal engineer above." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engineers.map((e) => (
                  <TableRow key={e.id} className={e.active ? '' : 'opacity-60'}>
                    <TableCell className="font-medium">{e.code}</TableCell>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.email}</TableCell>
                    <TableCell>
                      {e.active
                        ? <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge>
                        : <Badge variant="secondary">Disabled</Badge>}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap space-x-1">
                      <Button variant="ghost" size="sm" title="Rename" onClick={() => { setRenaming(e); setNewName(e.name); }}>
                        <Pencil className="h-4 w-4" /><span className="sr-only">Rename {e.name}</span>
                      </Button>
                      <Button variant="ghost" size="sm" title="Reset password" onClick={() => { setResetting(e); setNewPassword(''); }}>
                        <KeyRound className="h-4 w-4" /><span className="sr-only">Reset password for {e.name}</span>
                      </Button>
                      <Button variant={e.active ? 'outline' : 'default'} size="sm" disabled={busyId === e.id}
                        onClick={() => void run(e.id, () => setEngineerActive(e.id, !e.active)).then((ok) => ok && toast({
                          title: e.active ? 'Engineer disabled' : 'Engineer enabled',
                          description: e.active ? `${e.name} has been signed out and can no longer sign in.` : `${e.name} can sign in again.`,
                        }))}>
                        {e.active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="ghost" size="sm" title="Delete" className="text-destructive hover:text-destructive" onClick={() => setDeleting(e)}>
                        <Trash2 className="h-4 w-4" /><span className="sr-only">Delete {e.name}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CredentialsDialog creds={creds} onClose={() => setCreds(null)} />

      {/* Rename */}
      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {renaming?.code}</DialogTitle>
            <DialogDescription>The email is their login and can't be changed. To use a different email, delete the engineer and add them again.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename">Full name</Label>
            <Input id="rename" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenaming(null)}>Cancel</Button>
            <Button disabled={!newName.trim() || busyId === renaming?.id}
              onClick={() => { const e = renaming!; void run(e.id, () => renameEngineer(e.id, newName)).then((ok) => ok && setRenaming(null)); }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset password */}
      <Dialog open={!!resetting} onOpenChange={(o) => !o && setResetting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password for {resetting?.name}</DialogTitle>
            <DialogDescription>Their old password stops working immediately. Send them the new one.</DialogDescription>
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
            <AlertDialogTitle>Delete {deleting?.name} ({deleting?.code})?</AlertDialogTitle>
            <AlertDialogDescription>
              Their login is removed permanently and can't be undone. To block them but keep the account, use Disable instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { const e = deleting!; void run(e.id, () => deleteEngineer(e.id)).then((ok) => ok && toast({ title: 'Engineer deleted', description: `${e.name} has been removed.` })); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EngineerAccounts;
