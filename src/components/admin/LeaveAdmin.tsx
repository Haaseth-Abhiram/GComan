import { useState } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronLeft, ChevronRight, Loader2, Palmtree, Pencil, Plus, Trash2, X } from 'lucide-react';
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
import { useCan } from '@/portal/lib/useCan';
import { fmtDate } from '@/portal/lib/attendance';
import { whenText } from '@/portal/lib/notifications';
import { LeaveStatusBadge, LeaveSteps, leaveDates } from '@/portal/components/Leave';
import {
  STATUS_TEXT, adminDecide, deleteHoliday, fetchAdminBalances, fetchAdminLeave, fetchHolidays, fetchLeaveTypes, fmtDays,
  saveHoliday, saveLeaveType, setAllowance, type Holiday, type LeaveBalance, type LeaveRequest, type LeaveType,
} from '@/portal/lib/leave';

const KEY = ['admin', 'leave'];
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Muscat' });
const thisYear = () => Number(today().slice(0, 4));
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

type Filter = 'action' | 'manager_review' | 'manager_final' | 'approved' | 'rejected' | 'cancelled' | 'all';
const FILTERS: [Filter, string][] = [
  ['action', 'Waiting for you'], ['manager_review', 'Manager review'], ['manager_final', 'Manager approval'],
  ['approved', 'Approved'], ['rejected', 'Rejected'], ['cancelled', 'Cancelled'], ['all', 'All'],
];
/** Still moving through the approval steps: listed whatever the year. */
const OPEN: Filter[] = ['action', 'manager_review', 'manager_final'];
const useRequests = (filter: Filter, year: number) => {
  const open = OPEN.includes(filter);
  const q = useQuery({
    queryKey: [...KEY, 'requests', open ? 'pending' : 'year', open ? null : year],
    queryFn: () => fetchAdminLeave(open ? 'pending' : 'all', year),
  });
  const wanted = filter === 'action' ? 'admin_review' : filter;
  return { ...q, list: (q.data ?? []).filter((r) => filter === 'all' || r.status === wanted) };
};

const RequestItem = ({ r, canDecide, balance }: { r: LeaveRequest; canDecide: boolean; balance: LeaveBalance | undefined }) => {
  const [reviewing, setReviewing] = useState(false);
  const [comment, setComment] = useState('');
  const invalidate = useInvalidate();
  const { toast } = useToast();
  const decide = useMutation({
    mutationFn: (action: 'approve' | 'reject') => adminDecide(r.id, action, comment),
    onSuccess: (x) => {
      toast({ title: STATUS_TEXT[x.status], description: `${x.employee.full_name} · ${leaveDates(x)}` });
      setReviewing(false);
      setComment('');
      void invalidate();
    },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });
  const manager = r.manager?.full_name ?? 'the manager';
  const open = r.status === 'manager_review' || r.status === 'admin_review' || r.status === 'manager_final';
  return (
    <li className="py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#223f96] text-xs font-bold text-white" aria-hidden="true">
          {r.employee.full_name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
        </span>
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold text-[#101a3a]">{r.employee.full_name} <span className="font-mono text-[11px] font-normal text-muted-foreground">{r.employee.employee_code}</span></p>
          <p className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-violet-300 text-violet-700">{r.type.name}</Badge>
            <span>{leaveDates(r)}</span><span className="font-semibold">· {fmtDays(r.days)} day{Number(r.days) === 1 ? '' : 's'}</span>
          </p>
          <p className="mt-2 break-words border-l-2 border-[#f1592a]/50 pl-2.5 text-xs italic">“{r.reason}”</p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">Applied {whenText(r.created_at)}{r.manager && ` · Reporting manager: ${r.manager.full_name}`}</p>
          {balance && balance.entitled !== null && (
            <p className="mt-2 inline-block rounded-lg bg-[#f5f8ff] px-2.5 py-1 text-xs text-[#223f96]">
              {balance.name} balance {r.start_date.slice(0, 4)}: {fmtDays(balance.entitled)} allowed · {fmtDays(balance.used)} approved · {fmtDays(balance.pending)} pending ·{' '}
              <strong>{fmtDays(balance.remaining)} left</strong>
            </p>
          )}
          <div className="mt-1.5"><LeaveSteps r={r} /></div>
          {r.status === 'manager_review' && <p className="mt-1 text-xs font-medium text-amber-700">Step 1: waiting for {manager} to review it and send it to you.</p>}
          {r.status === 'manager_final' && <p className="mt-1 text-xs font-medium text-amber-700">You approved it; {manager} gives the final approval.</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <LeaveStatusBadge status={r.status} />
          {open && canDecide && !reviewing && (
            <Button size="sm" variant={r.status === 'admin_review' ? 'default' : 'outline'} onClick={() => setReviewing(true)}>
              {r.status === 'admin_review' ? 'Review' : r.status === 'manager_review' ? 'Decide now' : 'Decide instead'}
            </Button>
          )}
        </div>
      </div>
      {open && canDecide && reviewing && (
        <div className="mt-3 space-y-2 rounded-xl border border-[#dce6f7] p-4 sm:ml-[52px]">
          <Label htmlFor={`fb-${r.id}`}>Your review / feedback</Label>
          <Textarea id={`fb-${r.id}`} rows={3} autoFocus maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional to approve, required to reject." />
          <p className="flex justify-between gap-2 text-[11px] text-muted-foreground">
            <span>
              {r.status === 'manager_final' ? `This is the final decision, made instead of ${manager}.`
                : r.status === 'manager_review' ? `${manager} has not reviewed it yet. Deciding now skips that review; if you approve, they still give the final approval.`
                  : 'If a manager is set, Approve sends it to them for the final approval; otherwise your approval is final.'}
              {' '}The employee sees your feedback.
            </span>
            <span className="tabular-nums">{comment.length}/500</span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate('approve')}><Check className="h-4 w-4 mr-1" />Approve</Button>
            <Button size="sm" variant="destructive" disabled={decide.isPending || !comment.trim()} onClick={() => decide.mutate('reject')}><X className="h-4 w-4 mr-1" />Reject</Button>
            <Button size="sm" variant="outline" onClick={() => setReviewing(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </li>
  );
};

const RequestsTab = ({ year }: { year: number }) => {
  const canDecide = useCan()('portal.leave.approve');
  const [filter, setFilter] = useState<Filter>('action');
  const { list, isLoading, error } = useRequests(filter, year);
  // A request's balance is the one of the year it falls in, so load each year shown.
  const years = [...new Set(list.map((r) => Number(r.start_date.slice(0, 4))))].sort();
  const balances = useQueries({ queries: years.map((y) => ({ queryKey: [...KEY, 'balances', y], queryFn: () => fetchAdminBalances(y) })) });
  const balanceOf = (r: LeaveRequest) => balances[years.indexOf(Number(r.start_date.slice(0, 4)))]?.data
    ?.employees.find((e) => e.id === r.employee.id)?.balances.find((b) => b.id === r.type.id);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Leave applications{OPEN.includes(filter) ? '' : ` — ${year}`}</CardTitle>
        <CardDescription>
          Order: 1) the reporting manager reviews and sends it to you, 2) you approve or reject, 3) the manager gives the final approval.
          Without a manager your decision is final.
        </CardDescription>
        <div className="flex flex-wrap gap-2 pt-2" role="group" aria-label="Filter by status">
          {FILTERS.map(([k, text]) => <Button key={k} size="sm" variant={filter === k ? 'default' : 'outline'} aria-pressed={filter === k} onClick={() => setFilter(k)}>{text}</Button>)}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : !list.length ? <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground"><Palmtree className="h-6 w-6" />No leave applications here.</div>
            : <ul className="divide-y">{list.map((r) => <RequestItem key={r.id} r={r} canDecide={canDecide} balance={balanceOf(r)} />)}</ul>}
      </CardContent>
    </Card>
  );
};

// ---- Balances ----------------------------------------------------------------------------

const BalancesTab = ({ year }: { year: number }) => {
  const canEdit = useCan()('portal.leave.allowances');
  const defaults = useQuery({ queryKey: [...KEY, 'types'], queryFn: fetchLeaveTypes });
  const defaultOf = (id: string) => defaults.data?.find((t) => t.id === id)?.days_per_year;
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
          <CardTitle className="text-base">Leave balances — {year}</CardTitle>
          <CardDescription>Remaining = yearly days − approved − pending. Click a number to give one employee more or fewer days this year.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : !data?.employees.length ? <p className="py-8 text-center text-sm text-muted-foreground">No active employees.</p> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    {types.map((t) => (
                      <TableHead key={t.id}>{t.name}
                        {defaultOf(t.id) != null && <span className="block text-[10px] font-medium normal-case tracking-normal opacity-70">default {fmtDays(defaultOf(t.id)!)} / year</span>}
                      </TableHead>
                    ))}
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
                          <TableCell key={t.id}>
                            {b.entitled === null ? (
                              <span className="text-xs text-muted-foreground"><strong>{fmtDays(b.used)}</strong> taken{Number(b.pending) ? ` · ${fmtDays(b.pending)} pending` : ''}</span>
                            ) : (
                              <button type="button" className="rounded-lg px-2 py-1 text-left hover:bg-muted" disabled={!canEdit}
                                title={canEdit ? 'Click to change the yearly days' : undefined}
                                onClick={() => setEditing({ empId: e.id, empName: e.full_name, typeId: b.id, typeName: b.name, days: String(b.entitled ?? ''), overridden: b.overridden })}>
                                <span className={`block text-sm font-bold tabular-nums ${Number(b.remaining) < 0 ? 'text-red-600' : ''}`}>
                                  {fmtDays(b.remaining)} <span className="text-xs font-normal text-muted-foreground">of {fmtDays(b.entitled)} left</span>
                                  {canEdit && <Pencil className="ml-1 inline h-3 w-3 text-muted-foreground" aria-hidden="true" />}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                  {fmtDays(b.used)} used{Number(b.pending) ? ` · ${fmtDays(b.pending)} pending` : ''}
                                  {b.overridden && <Badge variant="outline" className="border-orange-300 px-1.5 py-0 text-[10px] text-orange-700">custom</Badge>}
                                </span>
                              </button>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            {editing?.overridden && <Button variant="ghost" disabled={save.isPending} onClick={() => save.mutate(null)}>
              Reset to default{defaultOf(editing.typeId) != null ? ` (${fmtDays(defaultOf(editing.typeId)!)})` : ''}
            </Button>}
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
  const canEdit = useCan()('portal.leave.types');
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
        {canEdit && <Button onClick={() => open(emptyType)}><Plus className="h-4 w-4 mr-2" />Add leave type</Button>}
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
                      {canEdit && <Button variant="ghost" size="sm" onClick={() => open(t)}><Pencil className="h-4 w-4" /><span className="sr-only">Edit {t.name}</span></Button>}
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

const HolidaysTab = ({ year }: { year: number }) => {
  const canEdit = useCan()('portal.leave.holidays');
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
          <CardTitle className="text-base">Company holidays — {year}</CardTitle>
          <CardDescription>Employees see these under Leave and on their attendance calendar. They are not counted as leave or absent days; leave covering one is recounted.</CardDescription>
        </div>
        {canEdit && <Button onClick={() => setEditing({ date: `${year}-01-01`, name: '', old: null })}><Plus className="h-4 w-4 mr-2" />Add holiday</Button>}
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : !data.length ? <p className="py-8 text-center text-sm text-muted-foreground">No holidays for {year} yet.</p> : (
            <div className="overflow-x-auto">
              <Table className="min-w-[520px]">
                <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Day</TableHead><TableHead>Holiday</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
                <TableBody>
                  {data.map((h) => (
                    <TableRow key={h.date}>
                      <TableCell className="whitespace-nowrap font-semibold">{fmtDate(h.date, { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                      <TableCell>{fmtDate(h.date, { weekday: 'long' })}</TableCell>
                      <TableCell>{h.name}{h.date < today() && <Badge variant="secondary" className="ml-2">Past</Badge>}</TableCell>
                      <TableCell className="whitespace-nowrap text-right">
                        {canEdit && <>
                          <Button variant="ghost" size="sm" onClick={() => setEditing({ date: h.date, name: h.name, old: h.date })}><Pencil className="h-4 w-4" /><span className="sr-only">Edit {h.name}</span></Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleting(h)}><Trash2 className="h-4 w-4" /><span className="sr-only">Delete {h.name}</span></Button>
                        </>}
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
  const [year, setYear] = useState(thisYear());
  const { list: waiting } = useRequests('action', year);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Palmtree className="h-5 w-5" />Leave Management</h1>
        <p className="text-sm text-muted-foreground">Approve or reject leave applications, see every employee's leave balance, and manage leave types and company holidays.</p>
      </div>
      <Tabs defaultValue="requests" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="requests">Leave requests{waiting.length ? <Badge className="ml-2 h-5 px-1.5">{waiting.length}</Badge> : null}</TabsTrigger>
            <TabsTrigger value="balances">Leave balances</TabsTrigger>
            <TabsTrigger value="types">Leave types</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
          </TabsList>
          <YearPicker year={year} setYear={setYear} />
        </div>
        <TabsContent value="requests"><RequestsTab year={year} /></TabsContent>
        <TabsContent value="balances"><BalancesTab year={year} /></TabsContent>
        <TabsContent value="types"><TypesTab /></TabsContent>
        <TabsContent value="holidays"><HolidaysTab year={year} /></TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveAdmin;
