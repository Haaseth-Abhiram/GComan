/**
 * Employee-side attendance pieces: the "Today" card with the punch button, the
 * punch-in screen shown after login, and the My attendance page (history +
 * correction requests).
 */
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Clock, Loader2, LogIn, LogOut, Pencil, Plus, Timer } from 'lucide-react';
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
  type AttendanceDay, type AttendanceMe, type AttendanceRules, type AttendanceSession, type Correction, type DayStatus,
} from '@/portal/lib/attendance';
import { CalendarGrid, MonthChooser, MonthTotals, calendarDays } from '@/portal/components/AttendanceCalendar';
import { fetchLeaveOverview } from '@/portal/lib/leave';
import { NOTICES_KEY } from '@/portal/lib/notifications';
import { rpc } from '@/portal/lib/rpc';
import { FullScreen, LoadingScreen } from '@/portal/theme/ui';
import { Link } from 'react-router-dom';

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

export const usePunch = () => {
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
      void qc.invalidateQueries({ queryKey: NOTICES_KEY });   // a punch creates a notification
    },
    onError: (e: Error) => {
      toast({ title: 'Could not save', description: e.message, variant: 'destructive' });
      void qc.invalidateQueries({ queryKey: ['portal', 'attendance'] });
    },
  });
};

export const useAttendanceMe = (enabled = true) =>
  useQuery({ queryKey: ATTENDANCE_ME_QUERY, queryFn: fetchAttendanceMe, refetchInterval: 60_000, refetchOnMount: 'always', enabled });

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

/** "27 Nov 2026, 06:05 pm" in the company timezone. */
const dateTime = (iso: string, tz: string) =>
  `${new Date(iso).toLocaleDateString('en-GB', { timeZone: tz, day: '2-digit', month: 'short', year: 'numeric' })}, ${fmtTime(iso, tz)}`;

/** The full screen asking to punch in, with the last punch out. */
const PunchInScreen = ({ name, me, onSignOut, adminPages }: {
  name: string; me: AttendanceMe; onSignOut: () => void; adminPages: boolean;
}) => {
  const punch = usePunch();
  // The latest finished session of the last 30 days (also today's).
  const recent = useQuery({
    queryKey: ['portal', 'attendance', 'last', me.today],
    queryFn: () => fetchMyAttendance(addDays(me.today, -30), me.today), refetchOnMount: 'always',
  });
  const last = (recent.data?.sessions ?? []).filter((s) => s.punch_out_at).sort((a, b) => b.punch_out_at!.localeCompare(a.punch_out_at!))[0];
  const off = me.day_off && !me.day_off.half_day ? me.day_off : null;
  const late = !off && !me.today_sessions.length && nowHHMM(me.rules.timezone) > me.rules.late_after;
  return (
    <FullScreen>
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-[#e7e9ee] bg-white text-center shadow-[0_30px_70px_-30px_rgba(16,26,58,0.5)]">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#101a3a] via-[#182a68] to-[#223f96] px-6 pb-12 pt-6 text-white">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#f1592a]/45 blur-[60px]" />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
            {fmtDate(me.today, { weekday: 'long' })}, {fmtDate(me.today, { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
          <p className="relative mt-1 text-sm font-semibold text-white/90">Employee Portal</p>
        </div>
        <div className="relative -mt-9 flex justify-center">
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#f1762a] to-[#f1592a] text-white shadow-[0_12px_24px_-8px_rgba(241,89,42,0.7)] ring-4 ring-white">
            <Clock className="h-8 w-8" aria-hidden="true" />
          </span>
        </div>
        <div className="space-y-4 px-6 pb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#101a3a]">Hi {name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Punch in to start your day.</p>
          </div>
          {last && (last.auto_punched_out ? (
            <p className="flex items-start gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2.5 text-left text-xs leading-relaxed text-violet-800">
              <Timer className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>You did not punch out last time, so you were punched out automatically at {dateTime(last.punch_out_at!, me.rules.timezone)}.</span>
            </p>
          ) : (
            <p className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f7fb] px-3 py-1 text-xs text-muted-foreground ring-1 ring-inset ring-[#e7e9ee]">
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />Last punch out: {dateTime(last.punch_out_at!, me.rules.timezone)}
            </p>
          ))}
          {off && (
            <p className="rounded-xl border border-sky-200 bg-sky-50 px-3.5 py-2.5 text-left text-xs leading-relaxed text-sky-900">
              {off.kind === 'holiday' ? `Today is a holiday (${off.name}).` : off.kind === 'leave' ? `You are on ${off.name} today.` : 'Today is your weekly off.'}
              {' '}Punching in records attendance for today.
            </p>
          )}
          {late && (
            <p className="flex items-start gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-2.5 text-left text-sm text-orange-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Punching in now is after {fmtClock(me.rules.late_after)} and will be marked late.
            </p>
          )}
          <Button size="lg" className="w-full" autoFocus disabled={punch.isPending} onClick={() => punch.mutate('in')}>
            {punch.isPending ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <LogIn className="h-5 w-5 mr-2" />}Punch in
          </Button>
          <Button variant="outline" className="w-full" disabled={punch.isPending} onClick={onSignOut}>Sign out</Button>
          {adminPages && (
            <Button asChild variant="link" className="w-full"><Link to="/admin">Open the admin panel without punching in</Link></Button>
          )}
        </div>
      </div>
    </FullScreen>
  );
};

/**
 * As in the Zyllo portal: the portal is open only while punched in. Signing in
 * without an open session (a new day, or after punching out) shows the punch-in
 * screen, and so does punching out.
 */
export const PunchInGate = ({ name, onSignOut, adminPages, children }: {
  name: string; onSignOut: () => void; adminPages: boolean; children: React.ReactNode;
}) => {
  const { data: me, isFetchedAfterMount, refetch, isFetching } = useAttendanceMe();
  // A tab left open past the automatic punch-out: check again right after it.
  const autoOutAt = me?.open_session?.auto_punch_out_at;
  useEffect(() => {
    if (!autoOutAt) return undefined;
    const t = setTimeout(() => void refetch(), Math.max(0, new Date(autoOutAt).getTime() - Date.now() + 2000));
    return () => clearTimeout(t);
  }, [autoOutAt, refetch]);
  // Never decide on a cached answer (it could belong to an earlier sign-in).
  if (!isFetchedAfterMount) return <LoadingScreen />;
  if (!me) {
    return (
      <FullScreen>
        <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-red-700">Could not check your attendance. Please try again.</p>
          <Button className="w-full" disabled={isFetching} onClick={() => void refetch()}>Try again</Button>
          <Button variant="outline" className="w-full" onClick={onSignOut}>Sign out</Button>
        </div>
      </FullScreen>
    );
  }
  if (me.open_session) return <>{children}</>;
  return <PunchInScreen name={name} me={me} onSignOut={onSignOut} adminPages={adminPages} />;
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
  const year = current ? Number(current.slice(0, 4)) : 0;
  // Holidays and approved leave colour the calendar; without leave access it just shows punches.
  const leave = useQuery({ queryKey: ['portal', 'leave', 'year', year], queryFn: () => fetchLeaveOverview(year), enabled: !!year, retry: false });
  const since = useQuery({ queryKey: ['portal', 'attendance', 'since'], queryFn: () => rpc<string | null>('att_my_since'), retry: false });
  const [selected, setSelected] = useState<string | null>(null);
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
  if (!today || !current || !me) return <Loader2 className="h-5 w-5 animate-spin" />;
  const calendar = calendarDays({
    month: current, today, since: since.data ?? null, weeklyOff: me.rules.weekly_off, rows: data?.days ?? [],
    holidays: leave.data?.holidays ?? [],
    leave: (leave.data?.requests ?? []).filter((r) => r.status === 'approved').map((r) => ({ start_date: r.start_date, end_date: r.end_date, half_day: r.half_day, name: r.type.name })),
  });
  const picked = calendar.find((d) => d.date === selected) ?? null;
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
        <CardHeader>
          <CardTitle className="text-base">{fmtDate(`${current}-01`, { month: 'long', year: 'numeric' })}</CardTitle>
          <CardDescription>Monthly summary and calendar. Choose a day to see its punches.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <MonthChooser month={current} today={today} onChange={(m) => { setMonth(m); setSelected(null); }} />
          <MonthTotals days={calendar} />
          <CalendarGrid days={calendar} today={today} selected={selected} onSelect={(d) => setSelected(d === selected ? null : d)} />
          {picked && (
            <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4" aria-live="polite">
              <div className="text-sm">
                <p className="font-bold text-[#101a3a]">{fmtDate(picked.date)}{picked.note && <span className="font-normal text-muted-foreground"> · {picked.note}</span>}</p>
                {sessionsOf(picked.date).map((s) => (
                  <p key={s.id}>{fmtTime(s.punch_in_at)} – {s.punch_out_at ? fmtTime(s.punch_out_at) : 'still in'}{s.auto_punched_out && <span className="text-rose-700"> (automatic punch-out)</span>}</p>
                ))}
                {!sessionsOf(picked.date).length && <p className="text-muted-foreground">No punches on this day.</p>}
              </div>
              {canCorrect(picked.date) && !pendingDays.has(picked.date) && (
                <Button size="sm" variant="outline" onClick={() => {
                  const first = sessionsOf(picked.date)[0];
                  setDraft({ date: picked.date, sessionId: first?.id ?? null, current: first, in: hhmm(first?.punch_in_at), out: hhmm(first?.punch_out_at), reason: '' });
                }}>Request correction</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance history</CardTitle>
          <CardDescription>Every punch in and punch out of the month.</CardDescription>
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
