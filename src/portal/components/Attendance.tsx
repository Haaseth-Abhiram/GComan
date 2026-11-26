/**
 * Employee-side attendance pieces: the "Today" card with the punch button, the
 * punch-in screen shown after login, and the My attendance page (history +
 * correction requests).
 */
import { Fragment, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ChevronLeft, ChevronRight, Clock, Loader2, LogIn, LogOut, Pencil, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  ATTENDANCE_ME_QUERY, STATUS_CLASS, STATUS_LABEL, addDays, cancelCorrection, fetchAttendanceMe, fetchMyAttendance,
  fmtClock, fmtDate, fmtMinutes, fmtTime, hhmm, monthRange, punchIn, punchOut, requestCorrection,
  type AttendanceDay, type AttendanceRules, type AttendanceSession, type Correction, type DayStatus,
} from '@/portal/lib/attendance';
import logo from '@/assets/global-chemicals-logo.svg';

export const StatusBadge = ({ status }: { status: DayStatus }) => (
  <Badge variant="outline" className={STATUS_CLASS[status]}>{STATUS_LABEL[status]}</Badge>
);

export const DayFlags = ({ day }: { day: Pick<AttendanceDay, 'is_late' | 'auto_out' | 'corrected'> }) => (
  <span className="inline-flex flex-wrap gap-1">
    {day.is_late && <Badge variant="outline" className="border-orange-300 text-orange-700">Late</Badge>}
    {day.auto_out && <Badge variant="outline" className="border-rose-300 text-rose-700" title="Forgot to punch out: closed automatically">Auto punch-out</Badge>}
    {day.corrected && <Badge variant="outline" className="border-sky-300 text-sky-700" title="Times changed by an approved correction">Corrected</Badge>}
  </span>
);

const usePunch = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (kind: 'in' | 'out') => (kind === 'in' ? punchIn() : punchOut()),
    onSuccess: (s, kind) => {
      toast(kind === 'in'
        ? { title: 'Punched in', description: `At ${fmtTime(s.punch_in_at)}. Have a good day!` }
        : s.auto_punched_out
          ? { title: 'Already punched out', description: `You were punched out automatically at ${fmtTime(s.punch_out_at)}.` }
          : { title: 'Punched out', description: `At ${fmtTime(s.punch_out_at)}.` });
      void qc.invalidateQueries({ queryKey: ['portal', 'attendance'] });
    },
    onError: (e: Error) => {
      toast({ title: 'Could not save', description: e.message, variant: 'destructive' });
      void qc.invalidateQueries({ queryKey: ['portal', 'attendance'] });
    },
  });
};

export const useAttendanceMe = () =>
  useQuery({ queryKey: ATTENDANCE_ME_QUERY, queryFn: fetchAttendanceMe, refetchInterval: 60_000 });

/** Rules line, e.g. "Office 9:45 AM – 7:00 PM · late after 10:00 AM · auto punch-out 8:00 PM". */
const RulesLine = ({ rules }: { rules: AttendanceRules }) => (
  <p className="text-xs text-muted-foreground">
    Office {fmtClock(rules.office_start)} – {fmtClock(rules.office_end)} · late after {fmtClock(rules.late_after)} ·
    automatic punch-out at {fmtClock(rules.auto_punch_out)}
  </p>
);

/** Home page card: today's status and the punch button. */
export const TodayAttendanceCard = () => {
  const { data: me, isLoading, error } = useAttendanceMe();
  const punch = usePunch();
  if (isLoading) return <Card><CardContent className="py-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></CardContent></Card>;
  if (error || !me) return <Card><CardContent className="py-6 text-sm text-destructive">Could not load attendance: {(error as Error)?.message}</CardContent></Card>;

  const open = me.open_session;
  const sum = me.today_summary;
  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />Today · {fmtDate(me.today)}</CardTitle>
          <CardDescription>
            {open ? `Punched in since ${fmtTime(open.punch_in_at)}. You will be punched out automatically at ${fmtTime(open.auto_punch_out_at)} if you forget.`
              : sum ? `Punched out at ${fmtTime(sum.last_out)}.`
                : me.day_off?.kind === 'holiday' ? `Today is a holiday: ${me.day_off.name}.`
                  : me.day_off?.kind === 'leave' ? `You are on ${me.day_off.name}${me.day_off.half_day ? ' for half the day' : ''} today.`
                    : me.is_weekly_off ? 'Today is your weekly off.' : 'You have not punched in yet today.'}
          </CardDescription>
        </div>
        {open ? (
          <Button variant="outline" disabled={punch.isPending} onClick={() => punch.mutate('out')}>
            {punch.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogOut className="h-4 w-4 mr-2" />}Punch out
          </Button>
        ) : (
          <Button disabled={punch.isPending} onClick={() => punch.mutate('in')}>
            {punch.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <LogIn className="h-4 w-4 mr-2" />}Punch in
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {sum && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span>First in <strong>{fmtTime(sum.first_in)}</strong></span>
            <span>Worked <strong>{fmtMinutes(sum.worked_minutes)}</strong></span>
            <span>Sessions <strong>{sum.sessions}</strong></span>
            <StatusBadge status={sum.status} />
            <DayFlags day={sum} />
          </div>
        )}
        <RulesLine rules={me.rules} />
      </CardContent>
    </Card>
  );
};

/** Current local time 'HH:MM' in the company timezone. */
const nowHHMM = (tz: string) => new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
const GATE_KEY = (employeeId: string, d: string) => `gc-portal-punch-gate-skipped-${employeeId}-${d}`;

/**
 * After login on a working day with no punch yet (and before the automatic
 * punch-out time), show a full-page "Punch in" screen first. "Not now" skips
 * it for that employee for the rest of the day in this browser tab.
 */
export const PunchInGate = ({ employeeId, name, children }: { employeeId: string; name: string; children: React.ReactNode }) => {
  const { data: me, isLoading } = useAttendanceMe();
  const punch = usePunch();
  const [skippedNow, setSkipped] = useState(false);
  const skipped = skippedNow || (!!me && (() => {
    try { return sessionStorage.getItem(GATE_KEY(employeeId, me.today)) === '1'; } catch { return false; }
  })());
  if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  const show = me && !skipped && !me.is_weekly_off && me.today_sessions.length === 0
    && nowHHMM(me.rules.timezone) < me.rules.auto_punch_out;
  if (!show) return <>{children}</>;
  const late = nowHHMM(me.rules.timezone) > me.rules.late_after;
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="space-y-3">
          <img src={logo} alt="Global Chemicals LLC" width={150} height={48} className="h-12 w-auto mx-auto" />
          <CardTitle className="text-2xl">Good to see you, {name.split(' ')[0]}</CardTitle>
          <CardDescription>{fmtDate(me.today)} · it is {fmtTime(new Date().toISOString(), me.rules.timezone)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {late && (
            <p className="text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-md px-3 py-2 flex items-center gap-2 justify-center">
              <AlertTriangle className="h-4 w-4" />Punching in now is after {fmtClock(me.rules.late_after)} and will be marked late.
            </p>
          )}
          <Button size="lg" className="w-full" disabled={punch.isPending} onClick={() => punch.mutate('in')}>
            {punch.isPending ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <LogIn className="h-5 w-5 mr-2" />}Punch in
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => {
            try { sessionStorage.setItem(GATE_KEY(employeeId, me.today), '1'); } catch { /* ignore */ }
            setSkipped(true);
          }}>
            Not now
          </Button>
          <RulesLine rules={me.rules} />
        </CardContent>
      </Card>
    </div>
  );
};

// ---- My attendance page --------------------------------------------------------------

type CorrectionDraft = { date: string; sessionId: string | null; in: string; out: string; reason: string; current?: AttendanceSession };

const CorrectionDialog = ({ draft, setDraft, sessionsOfDay, today }: {
  draft: CorrectionDraft | null;
  setDraft: (d: CorrectionDraft | null) => void;
  sessionsOfDay: (date: string) => AttendanceSession[];
  today: string;
}) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const save = useMutation({
    mutationFn: (d: CorrectionDraft) => requestCorrection({
      date: d.date, sessionId: d.sessionId, reason: d.reason,
      // For a fix, only send what changed; for an add, both.
      in: d.sessionId && d.current && d.in === hhmm(d.current.punch_in_at) ? null : d.in || null,
      out: d.sessionId && d.current && d.out === hhmm(d.current.punch_out_at) ? null : d.out || null,
    }),
    onSuccess: () => {
      toast({ title: 'Correction requested', description: 'The administrator will review it.' });
      setDraft(null);
      void qc.invalidateQueries({ queryKey: ['portal', 'attendance'] });
    },
    onError: (e: Error) => toast({ title: 'Could not send', description: e.message, variant: 'destructive' }),
  });
  if (!draft) return null;
  const sessions = sessionsOfDay(draft.date);
  const pick = (s: AttendanceSession | null) =>
    setDraft({ ...draft, sessionId: s?.id ?? null, current: s ?? undefined, in: s ? hhmm(s.punch_in_at) : '', out: s ? hhmm(s.punch_out_at) : '' });
  return (
    <Dialog open onOpenChange={(o) => !o && setDraft(null)}>
      <DialogContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save.mutate(draft); }}>
          <DialogHeader>
            <DialogTitle>Request a correction</DialogTitle>
            <DialogDescription>For today or the last 30 days. Times are Oman time. The administrator approves or rejects it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="corr-date">Date</Label>
            <Input id="corr-date" type="date" value={draft.date} max={today} min={addDays(today, -30)} required
              onChange={(e) => setDraft({ date: e.target.value, sessionId: null, in: '', out: '', reason: draft.reason })} />
          </div>
          <div className="space-y-2">
            <Label>Which punch?</Label>
            <div className="flex flex-wrap gap-2">
              {sessions.map((s) => (
                <Button key={s.id} type="button" size="sm" variant={draft.sessionId === s.id ? 'default' : 'outline'} onClick={() => pick(s)}>
                  {fmtTime(s.punch_in_at)} – {s.punch_out_at ? fmtTime(s.punch_out_at) : 'still in'}
                </Button>
              ))}
              <Button type="button" size="sm" variant={draft.sessionId === null ? 'default' : 'outline'} onClick={() => pick(null)}>
                <Plus className="h-3.5 w-3.5 mr-1" />Add a missing punch
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="corr-in">Punch in</Label>
              <Input id="corr-in" type="time" value={draft.in} required={!draft.sessionId} onChange={(e) => setDraft({ ...draft, in: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="corr-out">Punch out</Label>
              <Input id="corr-out" type="time" value={draft.out} required={!draft.sessionId} onChange={(e) => setDraft({ ...draft, out: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="corr-reason">Reason</Label>
            <Textarea id="corr-reason" maxLength={500} required value={draft.reason} placeholder="e.g. Forgot to punch out after the client meeting"
              onChange={(e) => setDraft({ ...draft, reason: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Send request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CORR_STATUS: Record<Correction['status'], string> = {
  pending: 'border-amber-300 text-amber-700', approved: 'border-emerald-300 text-emerald-700',
  rejected: 'border-rose-300 text-rose-700', cancelled: 'border-muted-foreground/30 text-muted-foreground',
};

export const CorrectionSummary = ({ c }: { c: Correction }) => (
  <span>
    {c.kind === 'add'
      ? <>Add {fmtTime(c.requested_in)} – {fmtTime(c.requested_out)}</>
      : <>{c.requested_in && <>In {fmtTime(c.old_in)} → <strong>{fmtTime(c.requested_in)}</strong> </>}
          {c.requested_out && <>Out {fmtTime(c.old_out)} → <strong>{fmtTime(c.requested_out)}</strong></>}</>}
  </span>
);

export const AttendancePage = () => {
  const { data: me } = useAttendanceMe();
  const today = me?.today;
  const [month, setMonth] = useState<string | null>(null);
  const current = month ?? today?.slice(0, 7);
  const range = current ? monthRange(`${current}-01`) : null;
  const { data, isLoading, error } = useQuery({
    queryKey: ['portal', 'attendance', 'month', current],
    queryFn: () => fetchMyAttendance(range!.from, range!.to),
    enabled: !!range,
  });
  const [draft, setDraft] = useState<CorrectionDraft | null>(null);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const qc = useQueryClient();
  const { toast } = useToast();
  const cancel = useMutation({
    mutationFn: cancelCorrection,
    onSuccess: () => { toast({ title: 'Request cancelled' }); void qc.invalidateQueries({ queryKey: ['portal', 'attendance'] }); },
    onError: (e: Error) => toast({ title: 'Could not cancel', description: e.message, variant: 'destructive' }),
  });

  const sessionsOf = useMemo(() => {
    const by = new Map<string, AttendanceSession[]>();
    for (const s of data?.sessions ?? []) by.set(s.work_date, [...(by.get(s.work_date) ?? []), s]);
    return (d: string) => by.get(d) ?? [];
  }, [data]);
  const totals = useMemo(() => {
    const t = { present: 0, half_day: 0, absent: 0, late: 0 };
    for (const d of data?.days ?? []) {
      if (d.status in t) t[d.status as 'present' | 'half_day' | 'absent'] += 1;
      if (d.is_late) t.late += 1;
    }
    return t;
  }, [data]);

  if (!today || !current) return <Loader2 className="h-5 w-5 animate-spin" />;
  const shiftMonth = (n: number) => {
    const [y, m] = current.split('-').map(Number);
    const d = new Date(Date.UTC(y, m - 1 + n, 1));
    setMonth(d.toISOString().slice(0, 7));
  };
  const pendingDays = new Set((data?.corrections ?? []).filter((c) => c.status === 'pending').map((c) => c.work_date));
  const canCorrect = (d: string) => d <= today && d >= addDays(today, -30);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My attendance</h1>
        <Button variant="outline" onClick={() => setDraft({ date: today, sessionId: null, in: '', out: '', reason: '' })}>
          <Pencil className="h-4 w-4 mr-2" />Request a correction
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Previous month" onClick={() => shiftMonth(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <CardTitle className="text-base min-w-[140px] text-center">{fmtDate(`${current}-01`, { month: 'long', year: 'numeric' })}</CardTitle>
            <Button variant="outline" size="icon" aria-label="Next month" disabled={current >= today.slice(0, 7)} onClick={() => shiftMonth(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <div className="hidden sm:flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className={STATUS_CLASS.present}>Present {totals.present}</Badge>
            <Badge variant="outline" className={STATUS_CLASS.half_day}>Half day {totals.half_day}</Badge>
            <Badge variant="outline" className={STATUS_CLASS.absent}>Absent {totals.absent}</Badge>
            <Badge variant="outline" className="border-orange-300 text-orange-700">Late {totals.late}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" /></div>
            : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
              : !data?.days.length ? <p className="py-8 text-center text-sm text-muted-foreground">No punches this month.</p>
                : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead><TableHead>First in</TableHead><TableHead>Last out</TableHead>
                          <TableHead>Worked</TableHead><TableHead>Status</TableHead><TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.days.map((d) => (
                          <Fragment key={d.work_date}>
                            <TableRow className="cursor-pointer" onClick={() => setOpenDay(openDay === d.work_date ? null : d.work_date)}>
                              <TableCell className="whitespace-nowrap font-medium">{fmtDate(d.work_date)}</TableCell>
                              <TableCell>{fmtTime(d.first_in)}</TableCell>
                              <TableCell>{d.is_open ? '—' : fmtTime(d.last_out)}</TableCell>
                              <TableCell>{fmtMinutes(d.worked_minutes)}{d.sessions > 1 && <span className="text-xs text-muted-foreground"> · {d.sessions} sessions</span>}</TableCell>
                              <TableCell><span className="inline-flex flex-wrap gap-1"><StatusBadge status={d.status} /><DayFlags day={d} /></span></TableCell>
                              <TableCell className="text-right">
                                {pendingDays.has(d.work_date)
                                  ? <Badge variant="outline" className={CORR_STATUS.pending}>Correction pending</Badge>
                                  : canCorrect(d.work_date) && (
                                    <Button size="sm" variant="ghost" onClick={(e) => {
                                      e.stopPropagation();
                                      const first = sessionsOf(d.work_date)[0];
                                      setDraft({ date: d.work_date, sessionId: first?.id ?? null, current: first,
                                        in: hhmm(first?.punch_in_at), out: hhmm(first?.punch_out_at), reason: '' });
                                    }}>Correct</Button>
                                  )}
                              </TableCell>
                            </TableRow>
                            {openDay === d.work_date && (
                              <TableRow className="bg-muted/40 hover:bg-muted/40">
                                <TableCell colSpan={6} className="text-sm">
                                  {sessionsOf(d.work_date).map((s) => (
                                    <div key={s.id}>
                                      {fmtTime(s.punch_in_at)} – {s.punch_out_at ? fmtTime(s.punch_out_at) : 'still in'}
                                      {s.auto_punched_out && <span className="text-rose-700"> (automatic punch-out)</span>}
                                      {s.corrected_at && <span className="text-sky-700"> (corrected)</span>}
                                    </div>
                                  ))}
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">My correction requests</CardTitle>
          <CardDescription>Your last 50 requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {!data?.corrections.length ? <p className="text-sm text-muted-foreground">No requests yet.</p> : (
            <ul className="divide-y">
              {data.corrections.map((c) => (
                <li key={c.id} className="py-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{fmtDate(c.work_date)} · <CorrectionSummary c={c} /></div>
                    <div className="text-muted-foreground">{c.reason}</div>
                    {c.decision_comment && <div className="text-muted-foreground">Admin: {c.decision_comment}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={CORR_STATUS[c.status]}>{c.status[0].toUpperCase() + c.status.slice(1)}</Badge>
                    {c.status === 'pending' && (
                      <Button size="sm" variant="ghost" disabled={cancel.isPending} onClick={() => cancel.mutate(c.id)}>Cancel</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <CorrectionDialog draft={draft} setDraft={setDraft} sessionsOfDay={sessionsOf} today={today} />
    </div>
  );
};
