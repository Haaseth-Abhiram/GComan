import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { fmtDate } from '@/portal/lib/attendance';
import { LeaveStatusBadge, LeaveSteps, leaveDates } from '@/portal/components/Leave';
import {
  STATUS_TEXT, adminDecide, deleteHoliday, fetchAdminBalances, fetchAdminLeave, fetchHolidays, fetchLeaveTypes, fmtDays,
  saveHoliday, saveLeaveType, setAllowance, type Holiday, type LeaveRequest, type LeaveType,
} from '@/portal/lib/leave';

const KEY = ['admin', 'leave'];
const thisYear = () => Number(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Muscat' }).slice(0, 4));
const Spinner = () => <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

const YearPicker = ({ year, setYear }: { year: number; setYear: (y: number) => void }) => (
  <div className="flex items-center gap-2">
    <Button variant="outline" size="icon" aria-label="Previous year" onClick={() => setYear(year - 1)}><ChevronLeft className="h-4 w-4" /></Button>
    <span className="w-14 text-center font-medium">{year}</span>
    <Button variant="outline" size="icon" aria-label="Next year" onClick={() => setYear(year + 1)}><ChevronRight className="h-4 w-4" /></Button>
  </div>
);

const useInvalidate = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: KEY });
};

// ---- Requests ----------------------------------------------------------------------------

const whoseTurn = (r: LeaveRequest) =>
  r.status === 'admin_review' ? 'Your approval'
    : r.status === 'manager_review' ? `Waiting for ${r.manager?.full_name ?? 'manager'} (you can act instead)`
      : r.status === 'manager_final' ? `Final approval by ${r.manager?.full_name ?? 'manager'} (you can act instead)` : STATUS_TEXT[r.status];

const RequestsTab = () => {
  const [filter, setFilter] = useState<'action' | 'pending' | 'all'>('action');
  const [year, setYear] = useState(thisYear());
  const { data = [], isLoading, error } = useQuery({ queryKey: [...KEY, 'requests', filter, year], queryFn: () => fetchAdminLeave(filter, year) });
  const [rejecting, setRejecting] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState('');
  const invalidate = useInvalidate();
  const { toast } = useToast();
  const decide = useMutation({
    mutationFn: (v: { r: LeaveRequest; action: 'approve' | 'reject'; comment: string }) => adminDecide(v.r.id, v.action, v.comment),
    onSuccess: (r) => {
      toast({ title: STATUS_TEXT[r.status], description: `${r.employee.full_name} · ${leaveDates(r)}` });
      setRejecting(null);
      void invalidate();
    },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div className="flex gap-1">
          <Button size="sm" variant={filter === 'action' ? 'default' : 'outline'} onClick={() => setFilter('action')}>Needs your approval</Button>
          <Button size="sm" variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>All pending</Button>
          <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
        </div>
        {filter === 'all' && <YearPicker year={year} setYear={setYear} />}
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : !data.length ? <p className="py-8 text-center text-sm text-muted-foreground">Nothing here.</p> : (
            <ul className="divide-y">
              {data.map((r) => {
                const open = r.status === 'manager_review' || r.status === 'admin_review' || r.status === 'manager_final';
                return (
                  <li key={r.id} className="py-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">
                        {r.employee.full_name} <span className="text-muted-foreground">({r.employee.employee_code})</span> · {r.type.name} · {fmtDays(r.days)} day{Number(r.days) === 1 ? '' : 's'}
                      </div>
                      <div>{leaveDates(r)}</div>
                      <div className="text-muted-foreground">“{r.reason}”</div>
                      <LeaveSteps r={r} />
                      {open && <div className="text-xs font-medium text-amber-700">{whoseTurn(r)}</div>}
                    </div>
                    {open ? (
                      <div className="flex gap-2">
                        <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate({ r, action: 'approve', comment: '' })}><Check className="h-4 w-4 mr-1" />Approve</Button>
                        <Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => { setRejecting(r); setComment(''); }}><X className="h-4 w-4 mr-1" />Reject</Button>
                      </div>
                    ) : <LeaveStatusBadge status={r.status} />}
                  </li>
                );
              })}
            </ul>
          )}
      </CardContent>
      <Dialog open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject leave</DialogTitle>
            <DialogDescription>{rejecting?.employee.full_name} · {rejecting && leaveDates(rejecting)}. The employee will see your reason.</DialogDescription>
          </DialogHeader>
          <Textarea maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Reason" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>Cancel</Button>
            <Button variant="destructive" disabled={!comment.trim() || decide.isPending}
              onClick={() => rejecting && decide.mutate({ r: rejecting, action: 'reject', comment })}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// ---- Balances ----------------------------------------------------------------------------

const BalancesTab = () => {
  const [year, setYear] = useState(thisYear());
  const { data, isLoading, error } = useQuery({ queryKey: [...KEY, 'balances', year], queryFn: () => fetchAdminBalances(year) });
  const [editing, setEditing] = useState<{ empId: string; empName: string; typeId: string; typeName: string; days: string; overridden: boolean } | null>(null);
  const invalidate = useInvalidate();
  const { toast } = useToast();
  const save = useMutation({
    mutationFn: (days: number | null) => setAllowance(editing!.empId, editing!.typeId, year, days),
    onSuccess: () => { toast({ title: 'Allowance saved' }); setEditing(null); void invalidate(); },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });
  const types = data?.employees[0]?.balances.filter((b) => b.active) ?? [];
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">Balances</CardTitle>
          <CardDescription>Remaining days (pending requests included). Click a number to change one employee's allowance for this year.</CardDescription>
        </div>
        <YearPicker year={year} setYear={setYear} />
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : !data?.employees.length ? <p className="py-8 text-center text-sm text-muted-foreground">No active employees.</p> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    {types.map((t) => <TableHead key={t.id} className="text-center">{t.name}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.employees.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div className="font-medium">{e.full_name}</div>
                        <div className="text-xs text-muted-foreground">{e.employee_code}</div>
                      </TableCell>
                      {types.map((t) => {
                        const b = e.balances.find((x) => x.id === t.id);
                        if (!b) return <TableCell key={t.id} />;
                        return (
                          <TableCell key={t.id} className="text-center">
                            <button type="button" className="rounded px-2 py-1 hover:bg-muted text-sm"
                              disabled={b.entitled === null}
                              title={b.entitled === null ? 'No yearly limit' : `Allowance ${fmtDays(b.entitled)} · used ${fmtDays(b.used)} · pending ${fmtDays(b.pending)}`}
                              onClick={() => setEditing({ empId: e.id, empName: e.full_name, typeId: b.id, typeName: b.name, days: String(b.entitled ?? ''), overridden: b.overridden })}>
                              <span className="font-semibold">{b.remaining === null ? '∞' : fmtDays(b.remaining)}</span>
                              {b.entitled !== null && <span className="text-xs text-muted-foreground"> / {fmtDays(b.entitled)}</span>}
                              {b.overridden && <span className="ml-1 text-xs text-sky-700">*</span>}
                            </button>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="mt-2 text-xs text-muted-foreground">* allowance changed for this employee.</p>
            </div>
          )}
      </CardContent>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.typeName} allowance · {year}</DialogTitle>
            <DialogDescription>{editing?.empName}. Days for this year only (steps of 0.5).</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="allow-days">Days</Label>
            <Input id="allow-days" type="number" min={0} max={366} step={0.5} value={editing?.days ?? ''}
              onChange={(e) => editing && setEditing({ ...editing, days: e.target.value })} />
          </div>
          <DialogFooter className="gap-2">
            {editing?.overridden && <Button variant="ghost" disabled={save.isPending} onClick={() => save.mutate(null)}>Use the default</Button>}
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button disabled={save.isPending || editing?.days === ''} onClick={() => save.mutate(Number(editing!.days))}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// ---- Leave types -----------------------------------------------------------------------------

const emptyType: Partial<LeaveType> = { code: '', name: '', description: '', days_per_year: null, paid: true, allow_half_day: true, active: true };

const TypesTab = () => {
  const { data = [], isLoading, error } = useQuery({ queryKey: [...KEY, 'types'], queryFn: fetchLeaveTypes });
  const [editing, setEditing] = useState<(Partial<LeaveType> & { daysText: string }) | null>(null);
  const invalidate = useInvalidate();
  const { toast } = useToast();
  const save = useMutation({
    mutationFn: () => saveLeaveType({ ...editing!, days_per_year: editing!.daysText.trim() === '' ? null : Number(editing!.daysText) }),
    onSuccess: () => { toast({ title: 'Leave type saved' }); setEditing(null); void invalidate(); },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });
  const open = (t: Partial<LeaveType>) => setEditing({ ...t, daysText: t.days_per_year === null || t.days_per_year === undefined ? '' : String(t.days_per_year) });
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">Leave types</CardTitle>
          <CardDescription>Days per year apply to everyone unless changed for one employee under Balances.</CardDescription>
        </div>
        <Button onClick={() => open(emptyType)}><Plus className="h-4 w-4 mr-2" />Add leave type</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Days / year</TableHead>
                  <TableHead>Paid</TableHead><TableHead>Half day</TableHead><TableHead>Status</TableHead><TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((t) => (
                  <TableRow key={t.id} className={t.active ? '' : 'opacity-60'}>
                    <TableCell className="font-medium">{t.code}</TableCell>
                    <TableCell>
                      <div>{t.name}</div>
                      {t.description && <div className="text-xs text-muted-foreground">{t.description}</div>}
                    </TableCell>
                    <TableCell>{fmtDays(t.days_per_year)}</TableCell>
                    <TableCell>{t.paid ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{t.allow_half_day ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{t.active ? <Badge className="bg-emerald-600 hover:bg-emerald-600">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => open(t)}><Pencil className="h-4 w-4" /><span className="sr-only">Edit {t.name}</span></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
            <DialogHeader>
              <DialogTitle>{editing?.id ? `Edit ${editing.name}` : 'Add leave type'}</DialogTitle>
              <DialogDescription>Leave types can't be deleted (old requests use them); untick Active to hide one.</DialogDescription>
            </DialogHeader>
            {editing && (
              <div className="grid gap-4 sm:grid-cols-[100px_1fr]">
                <div className="space-y-2">
                  <Label htmlFor="lt-code">Code</Label>
                  <Input id="lt-code" required maxLength={6} value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lt-name">Name</Label>
                  <Input id="lt-name" required maxLength={60} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="lt-desc">Description</Label>
                  <Input id="lt-desc" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="lt-days">Days per year</Label>
                  <Input id="lt-days" type="number" min={0} max={366} step={0.5} placeholder="Empty = no limit" value={editing.daysText}
                    onChange={(e) => setEditing({ ...editing, daysText: e.target.value })} />
                </div>
                <div className="flex flex-wrap gap-6 sm:col-span-2">
                  {([['paid', 'Paid'], ['allow_half_day', 'Half day allowed'], ['active', 'Active']] as const).map(([k, label]) => (
                    <div key={k} className="flex items-center gap-2">
                      <Checkbox id={`lt-${k}`} checked={!!editing[k]} onCheckedChange={(c) => setEditing({ ...editing, [k]: c === true })} />
                      <Label htmlFor={`lt-${k}`}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// ---- Holidays ---------------------------------------------------------------------------------

const HolidaysTab = () => {
  const [year, setYear] = useState(thisYear());
  const { data = [], isLoading, error } = useQuery({ queryKey: [...KEY, 'holidays', year], queryFn: () => fetchHolidays(year) });
  const [editing, setEditing] = useState<{ date: string; name: string; old: string | null } | null>(null);
  const [deleting, setDeleting] = useState<Holiday | null>(null);
  const invalidate = useInvalidate();
  const { toast } = useToast();
  const changed = (n: number) => (n ? ` ${n} leave request${n === 1 ? ' was' : 's were'} recounted.` : '');
  const save = useMutation({
    mutationFn: () => saveHoliday(editing!.date, editing!.name, editing!.old),
    onSuccess: (n) => { toast({ title: 'Holiday saved', description: `Not counted as a leave day.${changed(n)}` }); setEditing(null); void invalidate(); },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });
  const remove = useMutation({
    mutationFn: (d: string) => deleteHoliday(d),
    onSuccess: (n) => { toast({ title: 'Holiday removed', description: changed(n).trim() || undefined }); setDeleting(null); void invalidate(); },
    onError: (e: Error) => toast({ title: 'Could not delete', description: e.message, variant: 'destructive' }),
  });
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">Holidays</CardTitle>
          <CardDescription>Public and company holidays. Leave that covers a holiday is recounted automatically.</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <YearPicker year={year} setYear={setYear} />
          <Button onClick={() => setEditing({ date: `${year}-01-01`, name: '', old: null })}><Plus className="h-4 w-4 mr-2" />Add holiday</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : !data.length ? <p className="py-8 text-center text-sm text-muted-foreground">No holidays for {year} yet.</p> : (
            <ul className="divide-y">
              {data.map((h) => (
                <li key={h.date} className="py-2 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{h.name}</div>
                    <div className="text-sm text-muted-foreground">{fmtDate(h.date, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setEditing({ date: h.date, name: h.name, old: h.date })}><Pencil className="h-4 w-4" /><span className="sr-only">Edit {h.name}</span></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleting(h)}><Trash2 className="h-4 w-4" /><span className="sr-only">Delete {h.name}</span></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </CardContent>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
            <DialogHeader>
              <DialogTitle>{editing?.old ? 'Edit holiday' : 'Add holiday'}</DialogTitle>
              <DialogDescription>For a holiday of several days, add each date.</DialogDescription>
            </DialogHeader>
            {editing && (
              <div className="grid gap-4 sm:grid-cols-[170px_1fr]">
                <div className="space-y-2">
                  <Label htmlFor="hol-date">Date</Label>
                  <Input id="hol-date" type="date" required value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hol-name">Name</Label>
                  <Input id="hol-name" required maxLength={100} placeholder="e.g. National Day" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && fmtDate(deleting.date)} becomes a normal working day. Leave covering it will count this day again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleting && remove.mutate(deleting.date)}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

// ---- Page --------------------------------------------------------------------------------------

const LeaveAdmin = () => {
  const { data: action = [] } = useQuery({ queryKey: [...KEY, 'requests', 'action', thisYear()], queryFn: () => fetchAdminLeave('action') });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leave</h1>
        <p className="text-sm text-muted-foreground">
          With a manager: manager reviews → you approve → manager gives final approval. Without a manager you decide alone.
          Weekly off days and holidays are not counted.
        </p>
      </div>
      <Tabs defaultValue="requests">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="requests">Requests{action.length ? <Badge className="ml-2 h-5 px-1.5">{action.length}</Badge> : null}</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="types">Leave types</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
        </TabsList>
        <TabsContent value="requests"><RequestsTab /></TabsContent>
        <TabsContent value="balances"><BalancesTab /></TabsContent>
        <TabsContent value="types"><TypesTab /></TabsContent>
        <TabsContent value="holidays"><HolidaysTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveAdmin;
