/**
 * Employee Portal → Leave: balances, apply (with live day count), my requests
 * with their approval steps, team requests for managers, and holidays.
 */
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarPlus, Check, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fmtDate } from '@/portal/lib/attendance';
import {
  STATUS_STYLE, STATUS_TEXT, applyLeave, cancelLeave, fetchLeaveOverview, fetchTeamLeave, fmtDays,
  managerDecide, previewLeave, type LeaveRequest,
} from '@/portal/lib/leave';

const LEAVE_KEY = ['portal', 'leave'];

export const LeaveStatusBadge = ({ status }: { status: LeaveRequest['status'] }) => (
  <Badge variant="outline" className={STATUS_STYLE[status]}>{STATUS_TEXT[status]}</Badge>
);

export const leaveDates = (r: Pick<LeaveRequest, 'start_date' | 'end_date' | 'half_day'>) =>
  r.start_date === r.end_date
    ? `${fmtDate(r.start_date)}${r.half_day ? ' (half day)' : ''}`
    : `${fmtDate(r.start_date)} – ${fmtDate(r.end_date)}`;

/** Who did what so far: "Manager Mia forwarded · Admin approved · …". */
export const LeaveSteps = ({ r }: { r: LeaveRequest }) => {
  const parts: string[] = [];
  if (r.manager_step) parts.push(`Reviewed by ${r.manager_step.by ?? 'manager'}${r.manager_step.comment ? `: “${r.manager_step.comment}”` : ''}`);
  if (r.admin_step) parts.push(`Approved by ${r.admin_step.by ?? 'admin'}${r.admin_step.comment ? `: “${r.admin_step.comment}”` : ''}`);
  if (r.final_step) parts.push(`Final approval by ${r.final_step.by ?? 'manager'}${r.final_step.comment ? `: “${r.final_step.comment}”` : ''}`);
  if (r.rejected) parts.push(`Rejected by ${r.rejected.by ?? '—'}${r.rejected.comment ? `: “${r.rejected.comment}”` : ''}`);
  if (r.cancelled_note) parts.push(r.cancelled_note);
  return parts.length ? <div className="text-xs text-muted-foreground space-y-0.5">{parts.map((p) => <div key={p}>{p}</div>)}</div> : null;
};

const ApplyDialog = ({ open, onClose, types, today, hasManager }: {
  open: boolean;
  onClose: () => void;
  types: { id: string; name: string; allow_half_day: boolean; remaining: number | null; active: boolean }[];
  today: string;
  hasManager: boolean;
}) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({ type: '', from: today, to: today, half: false, reason: '' });
  const [preview, setPreview] = useState<{ days?: number; error?: string; loading?: boolean }>({});
  const type = types.find((t) => t.id === form.type);

  useEffect(() => { if (open) setForm({ type: '', from: today, to: today, half: false, reason: '' }); }, [open, today]);

  // Live day count (and the database's own validation message).
  useEffect(() => {
    if (!open || !form.type || !form.from || !form.to) { setPreview({}); return; }
    let alive = true;
    setPreview({ loading: true });
    const t = setTimeout(() => {
      previewLeave({ type: form.type, from: form.from, to: form.to, half: form.half })
        .then((days) => alive && setPreview({ days }))
        .catch((e: Error) => alive && setPreview({ error: e.message }));
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [open, form.type, form.from, form.to, form.half]);

  const apply = useMutation({
    mutationFn: () => applyLeave(form),
    onSuccess: () => {
      toast({ title: 'Leave requested', description: hasManager ? 'Your manager will review it first.' : 'The administrator will review it.' });
      void qc.invalidateQueries({ queryKey: LEAVE_KEY });
      onClose();
    },
    onError: (e: Error) => toast({ title: 'Could not apply', description: e.message, variant: 'destructive' }),
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); apply.mutate(); }}>
          <DialogHeader>
            <DialogTitle>Apply for leave</DialogTitle>
            <DialogDescription>Weekly off days and holidays are not counted. Pending requests count against your balance.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Leave type</Label>
            <div className="flex flex-wrap gap-2">
              {types.filter((t) => t.active).map((t) => (
                <Button key={t.id} type="button" size="sm" variant={form.type === t.id ? 'default' : 'outline'}
                  onClick={() => setForm({ ...form, type: t.id, half: t.allow_half_day ? form.half : false })}>
                  {t.name}<span className="ml-1 opacity-70">({t.remaining === null ? '∞' : fmtDays(t.remaining)})</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lv-from">From</Label>
              <Input id="lv-from" type="date" required value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value, to: form.to < e.target.value ? e.target.value : form.to })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lv-to">To</Label>
              <Input id="lv-to" type="date" required value={form.to} min={form.from}
                onChange={(e) => setForm({ ...form, to: e.target.value, half: e.target.value === form.from ? form.half : false })} />
            </div>
          </div>
          {type?.allow_half_day && form.from === form.to && (
            <div className="flex items-center gap-2">
              <Checkbox id="lv-half" checked={form.half} onCheckedChange={(c) => setForm({ ...form, half: c === true })} />
              <Label htmlFor="lv-half">Half day only</Label>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="lv-reason">Reason</Label>
            <Textarea id="lv-reason" required maxLength={500} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          <div className="min-h-[1.5rem] text-sm">
            {preview.loading ? <span className="text-muted-foreground">Counting days…</span>
              : preview.error ? <span className="text-destructive">{preview.error}</span>
                : preview.days !== undefined ? <span><strong>{fmtDays(preview.days)}</strong> leave day{preview.days === 1 ? '' : 's'}</span> : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={apply.isPending || !form.type || !!preview.error}>
              {apply.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Send request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

/** Requests of the manager's team; the ones waiting for them first. */
const TeamLeave = () => {
  const { data = [], isLoading } = useQuery({ queryKey: [...LEAVE_KEY, 'team'], queryFn: fetchTeamLeave });
  const [rejecting, setRejecting] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState('');
  const qc = useQueryClient();
  const { toast } = useToast();
  const decide = useMutation({
    mutationFn: (v: { r: LeaveRequest; action: 'approve' | 'reject'; comment: string }) => managerDecide(v.r.id, v.action, v.comment),
    onSuccess: (r) => {
      toast({ title: STATUS_TEXT[r.status], description: `${r.employee.full_name} · ${leaveDates(r)}` });
      setRejecting(null);
      void qc.invalidateQueries({ queryKey: LEAVE_KEY });
    },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Team leave</CardTitle>
        <CardDescription>You review first; after the admin approves, you give the final approval.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : !data.length ? <p className="text-sm text-muted-foreground">No team requests.</p> : (
          <ul className="divide-y">
            {data.map((r) => (
              <li key={r.id} className="py-3 flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1 text-sm">
                  <div className="font-medium">{r.employee.full_name} · {r.type.name} · {fmtDays(r.days)} day{Number(r.days) === 1 ? '' : 's'}</div>
                  <div>{leaveDates(r)}</div>
                  <div className="text-muted-foreground">“{r.reason}”</div>
                  <LeaveSteps r={r} />
                </div>
                {r.my_turn ? (
                  <div className="flex gap-2">
                    <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate({ r, action: 'approve', comment: '' })}>
                      <Check className="h-4 w-4 mr-1" />{r.status === 'manager_review' ? 'Forward to admin' : 'Final approve'}
                    </Button>
                    <Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => { setRejecting(r); setComment(''); }}>
                      <X className="h-4 w-4 mr-1" />Reject
                    </Button>
                  </div>
                ) : <LeaveStatusBadge status={r.status} />}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <Dialog open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject leave</DialogTitle>
            <DialogDescription>{rejecting?.employee.full_name} · {rejecting && leaveDates(rejecting)}. They will see your reason.</DialogDescription>
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

export const LeavePage = ({ canApply, isManager }: { canApply: boolean; isManager: boolean }) => {
  const { data, isLoading, error } = useQuery({ queryKey: [...LEAVE_KEY, 'overview'], queryFn: () => fetchLeaveOverview() });
  const [applying, setApplying] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();
  const cancel = useMutation({
    mutationFn: cancelLeave,
    onSuccess: () => { toast({ title: 'Leave request cancelled' }); void qc.invalidateQueries({ queryKey: LEAVE_KEY }); },
    onError: (e: Error) => toast({ title: 'Could not cancel', description: e.message, variant: 'destructive' }),
  });

  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !data) return <p className="text-sm text-destructive">Could not load leave: {(error as Error)?.message}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Leave</h1>
          <p className="text-sm text-muted-foreground">
            {data.manager ? `Your requests go to ${data.manager.full_name} first, then the admin, then back to ${data.manager.full_name} for final approval.`
              : 'Your requests go to the admin.'}
          </p>
        </div>
        {canApply && <Button onClick={() => setApplying(true)}><CalendarPlus className="h-4 w-4 mr-2" />Apply for leave</Button>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.balances.filter((b) => b.active).map((b) => (
          <Card key={b.id}>
            <CardContent className="pt-5 space-y-1">
              <div className="text-sm text-muted-foreground">{b.name}</div>
              <div className="text-2xl font-bold">{b.remaining === null ? '∞' : fmtDays(b.remaining)}<span className="text-sm font-normal text-muted-foreground"> left</span></div>
              <div className="text-xs text-muted-foreground">
                {b.entitled === null ? 'No yearly limit' : `${fmtDays(b.entitled)} per year`} · used {fmtDays(b.used)}{Number(b.pending) ? ` · pending ${fmtDays(b.pending)}` : ''}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isManager && <TeamLeave />}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">My requests · {data.year}</CardTitle>
          </CardHeader>
          <CardContent>
            {!data.requests.length ? <p className="text-sm text-muted-foreground">No leave requests yet.</p> : (
              <ul className="divide-y">
                {data.requests.map((r) => (
                  <li key={r.id} className="py-3 flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">{r.type.name} · {fmtDays(r.days)} day{Number(r.days) === 1 ? '' : 's'}</div>
                      <div>{leaveDates(r)}</div>
                      <div className="text-muted-foreground">“{r.reason}”</div>
                      <LeaveSteps r={r} />
                    </div>
                    <div className="flex items-center gap-2">
                      <LeaveStatusBadge status={r.status} />
                      {(r.status === 'manager_review' || r.status === 'admin_review') && (
                        <Button size="sm" variant="ghost" disabled={cancel.isPending} onClick={() => cancel.mutate(r.id)}>Cancel</Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Holidays</CardTitle>
            <CardDescription>Not counted as leave days.</CardDescription>
          </CardHeader>
          <CardContent>
            {!data.holidays.length ? <p className="text-sm text-muted-foreground">No holidays entered yet.</p> : (
              <ul className="space-y-2 text-sm">
                {data.holidays.map((h) => (
                  <li key={h.date} className={`flex justify-between gap-2 ${h.date < data.today ? 'text-muted-foreground' : ''}`}>
                    <span>{h.name}</span><span className="whitespace-nowrap">{fmtDate(h.date)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <ApplyDialog open={applying} onClose={() => setApplying(false)} types={data.balances} today={data.today} hasManager={!!data.manager} />
    </div>
  );
};

