/**
 * Employee Portal → Leave: balances by year, the apply form (with live day count),
 * company holidays and my history; managers also get "Team requests".
 */
import { useEffect, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase, CalendarDays, Check, ChevronLeft, ChevronRight, ClipboardCheck, ClipboardList, HeartPulse, Loader2, Palmtree,
  PartyPopper, Plane, Send, Sun, Users, X, type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { fmtDate } from '@/portal/lib/attendance';
import { whenText } from '@/portal/lib/notifications';
import {
  HALF_TEXT, STATUS_STYLE, STATUS_TEXT, applyLeave, cancelLeave, fetchLeaveOverview, fetchTeamLeave, fmtDays, isPending,
  managerDecide, previewLeave, type Holiday, type LeaveBalance, type LeaveOverview, type LeaveRequest,
} from '@/portal/lib/leave';

const LEAVE_KEY = ['portal', 'leave'];

export const LeaveStatusBadge = ({ status }: { status: LeaveRequest['status'] }) => (
  <Badge variant="outline" className={STATUS_STYLE[status]}>{STATUS_TEXT[status]}</Badge>
);

export const leaveDates = (r: Pick<LeaveRequest, 'start_date' | 'end_date' | 'half_day' | 'half_session'>) =>
  r.start_date === r.end_date
    ? `${fmtDate(r.start_date)}${r.half_day ? ` (${r.half_session ? HALF_TEXT[r.half_session] : 'half day'})` : ''}`
    : `${fmtDate(r.start_date)} – ${fmtDate(r.end_date)}`;

/** Who did what so far (used by the admin). */
export const LeaveSteps = ({ r }: { r: LeaveRequest }) => {
  const parts: string[] = [];
  if (r.manager_step) parts.push(`Reviewed by ${r.manager_step.by ?? 'manager'}${r.manager_step.comment ? `: “${r.manager_step.comment}”` : ''}`);
  if (r.admin_step) parts.push(`Approved by ${r.admin_step.by ?? 'admin'}${r.admin_step.comment ? `: “${r.admin_step.comment}”` : ''}`);
  if (r.final_step) parts.push(`Final approval by ${r.final_step.by ?? 'manager'}${r.final_step.comment ? `: “${r.final_step.comment}”` : ''}`);
  if (r.rejected) parts.push(`Rejected by ${r.rejected.by ?? '—'}${r.rejected.comment ? `: “${r.rejected.comment}”` : ''}`);
  if (r.cancelled_note) parts.push(r.cancelled_note);
  return parts.length ? <div className="text-xs text-muted-foreground space-y-0.5">{parts.map((p) => <div key={p}>{p}</div>)}</div> : null;
};

const dayCount = (n: number) => `${fmtDays(n)} day${Number(n) === 1 ? '' : 's'}`;
const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const Spinner = () => <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

const Title = ({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: ReactNode }) => (
  <CardHeader className="flex flex-row items-start gap-3 space-y-0">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef2fb] text-[#223f96]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
    <div><CardTitle className="text-base">{title}</CardTitle>{hint && <CardDescription>{hint}</CardDescription>}</div>
  </CardHeader>
);

// ---- Balances ----------------------------------------------------------------------------

const LOOKS: { icon: LucideIcon; bar: string }[] = [
  { icon: Palmtree, bar: 'from-[#f1762a] to-[#f1592a]' },
  { icon: HeartPulse, bar: 'from-[#223f96] to-[#3f63c9]' },
  { icon: Briefcase, bar: 'from-[#0d9488] to-[#14b8a6]' },
  { icon: Sun, bar: 'from-[#6d28d9] to-[#8b5cf6]' },
  { icon: Plane, bar: 'from-[#059669] to-[#10b981]' },
  { icon: CalendarDays, bar: 'from-[#d97706] to-[#f59e0b]' },
];

const Balances = ({ balances }: { balances: LeaveBalance[] }) => (
  <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
    {balances.filter((b) => b.active).map((b, i) => {
      const { icon: Icon, bar } = LOOKS[i % LOOKS.length];
      const percent = b.entitled ? Math.min(100, ((Number(b.used) + Number(b.pending)) / Number(b.entitled)) * 100) : 0;
      return (
        <div key={b.id} className="relative overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white p-5 pt-6 shadow-[0_8px_24px_-12px_rgba(16,26,58,0.12)]">
          <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${bar}`} />
          <span className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${bar}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
          <p className="mt-4 text-[28px] font-extrabold leading-none tabular-nums text-[#101a3a]">
            {b.remaining === null ? 'No limit' : fmtDays(b.remaining)}
            {b.entitled !== null && <span className="ml-1 text-sm font-semibold text-muted-foreground">/ {fmtDays(b.entitled)} left</span>}
          </p>
          <p className="mt-1.5 text-sm font-semibold">{b.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Used {fmtDays(b.used)}{Number(b.pending) > 0 && ` · Pending ${fmtDays(b.pending)}`}{!b.paid && ' · Unpaid'}
          </p>
          {!!b.entitled && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eef0f5]">
              <div className={`h-full rounded-full bg-gradient-to-r ${bar}`} style={{ width: `${percent}%` }} />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ---- Apply -------------------------------------------------------------------------------

const EMPTY = { type: '', from: '', to: '', half: '' as '' | 'half' | 'first' | 'second', reason: '' };

const ApplyForm = ({ data }: { data: LeaveOverview }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [preview, setPreview] = useState<{ days?: number; error?: string; loading?: boolean }>({});
  const [done, setDone] = useState('');
  const type = data.balances.find((b) => b.id === form.type);
  const single = !!form.from && form.from === form.to;
  const ready = !!form.type && !!form.from && !!form.to;
  const half = form.half !== '';

  const set = (patch: Partial<typeof EMPTY>) => {
    setDone('');
    setForm((f) => {
      const n = { ...f, ...patch };
      if (patch.from && (!n.to || n.to < n.from)) n.to = n.from; // the end date follows the start date
      if (n.from !== n.to || data.balances.find((b) => b.id === n.type)?.allow_half_day === false) n.half = '';
      return n;
    });
  };

  // Live day count, with the database's own message when the dates can't be used.
  useEffect(() => {
    if (!ready) { setPreview({}); return; }
    let alive = true;
    setPreview({ loading: true });
    const t = setTimeout(() => {
      previewLeave({ type: form.type, from: form.from, to: form.to, half })
        .then((days) => alive && setPreview({ days }))
        .catch((e: Error) => alive && setPreview({ error: e.message }));
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [ready, form.type, form.from, form.to, half]);

  const apply = useMutation({
    mutationFn: () => applyLeave({
      type: form.type, from: form.from, to: form.to, half, reason: form.reason,
      session: form.half === 'first' || form.half === 'second' ? form.half : null,
    }),
    onSuccess: (r) => {
      toast({ title: 'Leave requested', description: data.manager ? 'Your manager will review it first.' : 'The administrator will review it.' });
      setDone(`Leave applied (${dayCount(r.days)}) and sent to ${data.manager ? data.manager.full_name : 'the admin'} for review.`);
      setForm(EMPTY);
      void qc.invalidateQueries({ queryKey: LEAVE_KEY });
    },
    onError: (e: Error) => toast({ title: 'Could not apply', description: e.message, variant: 'destructive' }),
  });

  const durations: [typeof EMPTY.half, string][] = data.half_sessions
    ? [['', 'Full day'], ['first', HALF_TEXT.first], ['second', HALF_TEXT.second]]
    : [['', 'Full day'], ['half', 'Half day']];

  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); apply.mutate(); }}>
      <div className="space-y-2">
        <p className="text-sm font-medium">Leave type</p>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2" role="radiogroup" aria-label="Leave type">
          {data.balances.filter((b) => b.active).map((b) => {
            const on = form.type === b.id;
            return (
              <button key={b.id} type="button" role="radio" aria-checked={on} onClick={() => set({ type: b.id })}
                className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${on
                  ? 'border-transparent bg-gradient-to-r from-[#223f96] to-[#3f63c9] text-white shadow-lg shadow-[#223f96]/30'
                  : 'border-[#e3e9f5] bg-[#f8faff] hover:border-[#223f96]/30 hover:bg-[#eef2fb]'}`}>
                <span className="truncate">{b.name}</span>
                <span className={`shrink-0 text-xs font-medium ${on ? 'text-white/80' : 'text-muted-foreground'}`}>{b.remaining === null ? 'no limit' : `${fmtDays(b.remaining)} left`}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="lv-from">From</Label>
          <Input id="lv-from" type="date" required value={form.from} onChange={(e) => set({ from: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="lv-to">To</Label>
          <Input id="lv-to" type="date" required value={form.to} min={form.from || undefined} onChange={(e) => set({ to: e.target.value })} /></div>
      </div>

      {single && type?.allow_half_day !== false && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Duration</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Duration">
            {durations.map(([key, text]) => (
              <Button key={text} type="button" size="sm" variant={form.half === key ? 'default' : 'outline'} aria-pressed={form.half === key} onClick={() => set({ half: key })}>{text}</Button>
            ))}
          </div>
        </div>
      )}

      {!!form.from && !!form.to && (
        <p aria-live="polite" className={`flex items-start gap-2 rounded-xl border px-4 py-2.5 text-sm ${preview.error ? 'border-red-200 bg-red-50 text-red-700' : 'border-[#dce6f7] bg-[#f5f8ff] text-[#223f96]'}`}>
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {!form.type ? 'Choose a leave type to count the days.' : preview.error ? preview.error
              : preview.days === undefined ? 'Counting leave days…'
                : `${dayCount(preview.days)} of leave (weekly off days and company holidays are not counted).`}
          </span>
        </p>
      )}
      {!!form.from && form.from < data.today && <p className="-mt-2 text-xs text-muted-foreground">This leave is in the past. You can apply up to 30 days back (e.g. sick leave).</p>}

      <div className="space-y-2">
        <p className="text-sm font-medium">Reporting manager</p>
        {data.manager ? (
          <div className="flex items-center gap-3 rounded-xl border border-[#223f96]/20 bg-[#f4f7ff] px-3 py-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#223f96] text-xs font-bold text-white" aria-hidden="true">{initials(data.manager.full_name)}</span>
            <span className="min-w-0 text-sm"><span className="block font-semibold text-[#101a3a]">{data.manager.full_name}</span>
              <span className="block text-xs text-muted-foreground">Reviews it first, then the admin, then gives the final approval.</span></span>
          </div>
        ) : <p className="rounded-xl border border-dashed px-3 py-2.5 text-sm text-muted-foreground">No reporting manager is set for you, so the admin decides.</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lv-reason">Reason</Label>
        <Textarea id="lv-reason" rows={3} required maxLength={500} value={form.reason} onChange={(e) => set({ reason: e.target.value })} />
        <p className="text-right text-[11px] tabular-nums text-muted-foreground">{form.reason.length}/500</p>
      </div>

      {done && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">{done}</p>}
      <Button type="submit" disabled={apply.isPending || !ready || !form.reason.trim() || !!preview.error}>
        {apply.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardCheck className="mr-2 h-4 w-4" />}Apply for leave
      </Button>
    </form>
  );
};

// ---- Holidays and history ------------------------------------------------------------------

const HolidayList = ({ holidays, year, today }: { holidays: Holiday[]; year: number; today: string }) => {
  const list = holidays.filter((h) => h.date.startsWith(String(year)));
  if (!list.length) return <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground"><PartyPopper className="h-6 w-6" />No company holidays have been added for {year} yet.</div>;
  return (
    <ul className="flex flex-col gap-2">
      {list.map((h) => {
        const past = h.date < today;
        return (
          <li key={h.date} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${past ? 'border-[#f0f2f6] bg-[#fafbfc] opacity-60' : 'border-[#e7e9ee]'}`}>
            <span className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl ${past ? 'bg-slate-100 text-slate-500' : 'bg-gradient-to-br from-[#0d9488] to-[#14b8a6] text-white'}`}>
              <span className="text-sm font-bold leading-none">{h.date.slice(8)}</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase">{fmtDate(h.date, { month: 'short' })}</span>
            </span>
            <span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#101a3a]">{h.name}</span>
              <span className="text-xs text-muted-foreground">{fmtDate(h.date, { weekday: 'long' })}</span></span>
          </li>
        );
      })}
    </ul>
  );
};

/** What the employee is told: rejection reason and written feedback, not who decided. */
const feedback = (r: LeaveRequest) => {
  if (r.status === 'rejected') return r.rejected?.comment ? `Reason: ${r.rejected.comment}` : null;
  if (r.cancelled_note) return r.cancelled_note;
  const notes = [r.manager_step, r.admin_step, r.final_step].map((s) => s?.comment).filter((c) => c && !c.includes('in place of the manager'));
  return notes.length ? `Feedback: ${notes.join(' · ')}` : null;
};

const History = ({ requests }: { requests: LeaveRequest[] }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [confirming, setConfirming] = useState<string | null>(null);
  const cancel = useMutation({
    mutationFn: cancelLeave,
    onSuccess: () => { toast({ title: 'Leave request cancelled' }); void qc.invalidateQueries({ queryKey: LEAVE_KEY }); },
    onError: (e: Error) => toast({ title: 'Could not cancel', description: e.message, variant: 'destructive' }),
    onSettled: () => setConfirming(null),
  });
  if (!requests.length) return <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground"><ClipboardList className="h-6 w-6" />No leave requests this year.</div>;
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[720px]">
        <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Dates</TableHead><TableHead>Days</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-semibold">{r.type.name}</TableCell>
              <TableCell className="whitespace-nowrap">{leaveDates(r)}</TableCell>
              <TableCell className="font-semibold tabular-nums">{fmtDays(r.days)}</TableCell>
              <TableCell className="max-w-[16rem] break-words text-muted-foreground">{r.reason}</TableCell>
              <TableCell>
                <LeaveStatusBadge status={r.status} />
                {feedback(r) && <p className="mt-1 max-w-[18rem] break-words text-xs text-muted-foreground">{feedback(r)}</p>}
              </TableCell>
              <TableCell className="text-right">
                {(r.status === 'manager_review' || r.status === 'admin_review') && (confirming === r.id ? (
                  <span className="inline-flex flex-wrap justify-end gap-1">
                    <Button size="sm" variant="destructive" disabled={cancel.isPending} onClick={() => cancel.mutate(r.id)}>Yes, cancel</Button>
                    <Button size="sm" variant="outline" onClick={() => setConfirming(null)}>Keep</Button>
                  </span>
                ) : <Button size="sm" variant="outline" className="text-destructive" onClick={() => setConfirming(r.id)}>Cancel</Button>)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ---- Team requests (managers) --------------------------------------------------------------

const TeamItem = ({ r }: { r: LeaveRequest }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const review = r.status === 'manager_review';
  const decide = useMutation({
    mutationFn: (action: 'approve' | 'reject') => managerDecide(r.id, action, comment),
    onSuccess: (x) => { toast({ title: STATUS_TEXT[x.status], description: `${x.employee.full_name} · ${leaveDates(x)}` }); setComment(''); void qc.invalidateQueries({ queryKey: LEAVE_KEY }); },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });
  return (
    <li className="py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#223f96] text-xs font-bold text-white" aria-hidden="true">{initials(r.employee.full_name)}</span>
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold text-[#101a3a]">{r.employee.full_name} <span className="font-mono text-[11px] font-normal text-muted-foreground">{r.employee.employee_code}</span></p>
          <p className="mt-1 flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-violet-300 text-violet-700">{r.type.name}</Badge><span>{leaveDates(r)}</span><span className="font-semibold">· {dayCount(r.days)}</span></p>
          <p className="mt-2 break-words border-l-2 border-[#f1592a]/50 pl-2.5 text-xs italic">“{r.reason}”</p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Applied {whenText(r.created_at)}
            {r.manager_step && ` · Sent to the admin ${whenText(r.manager_step.at)}`}
            {r.admin_step && ` · Approved by the admin ${whenText(r.admin_step.at)}`}
          </p>
          {r.admin_step?.comment && <p className="mt-1.5 break-words rounded-lg bg-[#fff6f1] px-2.5 py-1.5 text-xs"><span className="font-semibold text-[#c2410c]">Admin: </span>{r.admin_step.comment}</p>}
          {r.manager_step?.comment && <p className="mt-1.5 break-words text-xs text-muted-foreground">Note to the admin: {r.manager_step.comment}</p>}
          {r.rejected && <p className="mt-1.5 break-words text-xs text-muted-foreground">Rejected by {r.rejected.by ?? '—'}{r.rejected.comment ? `: ${r.rejected.comment}` : ''}</p>}
          {r.status === 'admin_review' && <p className="mt-1.5 text-xs font-semibold text-[#c2410c]">With the admin now — you approve it after the admin does.</p>}
        </div>
        <LeaveStatusBadge status={r.status} />
      </div>
      {r.my_turn && (
        <div className="mt-3 space-y-2 rounded-xl border border-[#dce6f7] p-4 sm:ml-[52px]">
          <Label htmlFor={`tl-${r.id}`}>{review ? 'Note for the admin' : 'Your feedback'}</Label>
          <Textarea id={`tl-${r.id}`} rows={2} maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional to approve, required to reject." />
          <p className="text-[11px] text-muted-foreground">
            {review ? 'Step 1: review the request. Send it to the admin, or reject it.' : 'Step 3: the admin approved it. Your decision is final.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate('approve')}>
              {review ? <><Send className="mr-1 h-4 w-4" />Send to admin</> : <><Check className="mr-1 h-4 w-4" />Final approve</>}
            </Button>
            <Button size="sm" variant="outline" className="text-destructive" disabled={decide.isPending || !comment.trim()} onClick={() => decide.mutate('reject')}><X className="mr-1 h-4 w-4" />Reject</Button>
          </div>
        </div>
      )}
    </li>
  );
};

const TeamRequests = ({ requests, loading }: { requests: LeaveRequest[]; loading: boolean }) => {
  const [filter, setFilter] = useState<'waiting' | 'all'>('waiting');
  const waiting = requests.filter((r) => r.my_turn);
  const shown = filter === 'waiting' ? waiting : requests;
  return (
    <Card>
      <Title icon={Users} title="Team leave requests" hint="You review your team's leave first and send it to the admin; after the admin approves, you give the final approval." />
      <CardContent>
        <div className="mb-2 flex flex-wrap gap-2" role="group" aria-label="Show">
          <Button size="sm" variant={filter === 'waiting' ? 'default' : 'outline'} aria-pressed={filter === 'waiting'} onClick={() => setFilter('waiting')}>Waiting for you ({waiting.length})</Button>
          <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All (recent and upcoming)</Button>
        </div>
        {loading ? <Spinner /> : !shown.length ? (
          <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground"><Palmtree className="h-6 w-6" />{filter === 'waiting' ? 'Nothing waiting for you.' : 'No team leave requests yet.'}</div>
        ) : <ul className="divide-y">{shown.map((r) => <TeamItem key={r.id} r={r} />)}</ul>}
      </CardContent>
    </Card>
  );
};

// ---- Page ----------------------------------------------------------------------------------

export const LeavePage = ({ canApply, isManager }: { canApply: boolean; isManager: boolean }) => {
  const [year, setYear] = useState<number | undefined>(undefined);
  const [thisYear, setThisYear] = useState<number | null>(null);
  const { data, isLoading, error } = useQuery({ queryKey: [...LEAVE_KEY, 'overview', year ?? 'now'], queryFn: () => fetchLeaveOverview(year) });
  const team = useQuery({ queryKey: [...LEAVE_KEY, 'team'], queryFn: fetchTeamLeave, enabled: isManager });
  const waiting = team.data?.filter((r) => r.my_turn).length ?? 0;
  useEffect(() => { if (data && year === undefined) setThisYear(data.year); }, [data, year]);

  const now = thisYear ?? data?.year ?? 0;
  const shownYear = year ?? now;

  const mine = isLoading ? <Spinner /> : error || !data ? <p className="text-sm text-destructive">Could not load leave: {(error as Error)?.message}</p> : (
    <div className="space-y-6">
      <Balances balances={data.balances} />
      <div className="grid gap-6 lg:grid-cols-5">
        {canApply && (
          <Card className="lg:col-span-3">
            <Title icon={Palmtree} title="Apply for leave" hint={data.manager ? 'Sent to your manager, then the admin' : 'Sent to the admin for approval'} />
            <CardContent><ApplyForm data={data} /></CardContent>
          </Card>
        )}
        <Card className={canApply ? 'self-start lg:col-span-2' : 'lg:col-span-5'}>
          <Title icon={CalendarDays} title={`Company holidays ${data.year}`} hint="Not counted as leave" />
          <CardContent><HolidayList holidays={data.holidays} year={data.year} today={data.today} /></CardContent>
        </Card>
      </div>
      <Card>
        <Title icon={ClipboardList} title={`Leave history & approval status — ${data.year}`} hint="Requests still waiting are always listed." />
        <CardContent><History requests={data.requests} /></CardContent>
      </Card>
    </div>
  );

  const balances = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto text-base font-bold text-[#101a3a]">Leave balance {shownYear || ''}</h2>
        <Button size="icon" variant="outline" aria-label="Previous year" disabled={!now} onClick={() => setYear(shownYear - 1)}><ChevronLeft className="h-4 w-4" /></Button>
        <Button size="sm" variant="outline" disabled={shownYear === now} onClick={() => setYear(undefined)}>This year</Button>
        <Button size="icon" variant="outline" aria-label="Next year" disabled={!now || shownYear > now} onClick={() => setYear(shownYear + 1)}><ChevronRight className="h-4 w-4" /></Button>
      </div>
      {mine}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold"><Plane className="h-5 w-5" />Leave</h1>
      {!isManager ? balances : (
        <Tabs defaultValue="mine" className="space-y-4">
          <TabsList>
            <TabsTrigger value="mine"><Plane className="mr-1.5 h-4 w-4" />My leave</TabsTrigger>
            <TabsTrigger value="team"><Users className="mr-1.5 h-4 w-4" />Team requests{waiting > 0 && <Badge className="ml-2 h-5 px-1.5">{waiting}</Badge>}</TabsTrigger>
          </TabsList>
          <TabsContent value="mine">{balances}</TabsContent>
          <TabsContent value="team"><TeamRequests requests={team.data ?? []} loading={team.isLoading} /></TabsContent>
        </Tabs>
      )}
    </div>
  );
};
