import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CorrectionSummary, DayFlags, StatusBadge } from '@/portal/components/Attendance';
import {
  addDays, decideCorrection, fetchAdminAttendance, fetchAdminCorrections, fmtClock, fmtDate, fmtMinutes, fmtTime,
  isoWeekday, monthRange, type AdminAttendance, type AttendanceDay, type Correction,
} from '@/portal/lib/attendance';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const todayInOman = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Muscat' }); // YYYY-MM-DD

const Spinner = () => <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
const Empty = ({ text }: { text: string }) => <p className="py-8 text-center text-sm text-muted-foreground">{text}</p>;

const MonthPicker = ({ month, setMonth, max }: { month: string; setMonth: (m: string) => void; max: string }) => {
  const shift = (n: number) => {
    const [y, m] = month.split('-').map(Number);
    setMonth(new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7));
  };
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" aria-label="Previous month" onClick={() => shift(-1)}><ChevronLeft className="h-4 w-4" /></Button>
      <span className="min-w-[140px] text-center font-medium">{fmtDate(`${month}-01`, { month: 'long', year: 'numeric' })}</span>
      <Button variant="outline" size="icon" aria-label="Next month" disabled={month >= max} onClick={() => shift(1)}><ChevronRight className="h-4 w-4" /></Button>
    </div>
  );
};

const useMonthData = (month: string, employeeId?: string | null) => {
  const { from, to } = monthRange(`${month}-01`);
  return useQuery({
    queryKey: ['admin', 'attendance', from, to, employeeId ?? 'all'],
    queryFn: () => fetchAdminAttendance(from, to, employeeId),
    enabled: employeeId !== '',
  });
};

const nameOf = (data: AdminAttendance | undefined, id: string) => data?.employees.find((e) => e.id === id)?.full_name ?? '—';

/** Rows of (employee, day): date, name, in, out, worked, status. */
const DaysTable = ({ rows, data, showName = true, showDate = true }: {
  rows: AttendanceDay[]; data?: AdminAttendance; showName?: boolean; showDate?: boolean;
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          {showDate && <TableHead>Date</TableHead>}
          {showName && <TableHead>Employee</TableHead>}
          <TableHead>First in</TableHead><TableHead>Last out</TableHead><TableHead>Worked</TableHead><TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((d) => (
          <TableRow key={`${d.employee_id}-${d.work_date}`}>
            {showDate && <TableCell className="whitespace-nowrap">{fmtDate(d.work_date)}</TableCell>}
            {showName && <TableCell className="font-medium">{nameOf(data, d.employee_id)}</TableCell>}
            <TableCell>{fmtTime(d.first_in)}</TableCell>
            <TableCell>{d.is_open ? '—' : fmtTime(d.last_out)}</TableCell>
            <TableCell>{fmtMinutes(d.worked_minutes)}{d.sessions > 1 && <span className="text-xs text-muted-foreground"> · {d.sessions} sessions</span>}</TableCell>
            <TableCell><span className="inline-flex flex-wrap gap-1"><StatusBadge status={d.status} /><DayFlags day={d} /></span></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// ---- Daily -----------------------------------------------------------------------------

const DailyTab = ({ today }: { today: string }) => {
  const [date, setDate] = useState(today);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'attendance', date, date, 'all'],
    queryFn: () => fetchAdminAttendance(date, date),
  });
  const byEmp = useMemo(() => new Map((data?.days ?? []).map((d) => [d.employee_id, d])), [data]);
  const off = data ? data.rules.weekly_off.includes(isoWeekday(date)) : false;
  const holiday = data?.holidays.find((h) => h.date === date);
  const leaveOf = (id: string) => data?.leave.find((l) => l.employee_id === id && l.start_date <= date && l.end_date >= date);
  const people = (data?.employees ?? []).filter((e) => e.active && e.since <= date);
  const counts = { in: 0, out: 0, notIn: 0, late: 0, leave: 0 };
  for (const e of people) {
    const d = byEmp.get(e.id);
    const lv = leaveOf(e.id);
    if (!d && lv && !lv.half_day) counts.leave += 1;
    else if (!d) counts.notIn += 1; else if (d.is_open) counts.in += 1; else counts.out += 1;
    if (d?.is_late) counts.late += 1;
  }
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Previous day" onClick={() => setDate(addDays(date, -1))}><ChevronLeft className="h-4 w-4" /></Button>
          <Input type="date" value={date} max={today} onChange={(e) => e.target.value && setDate(e.target.value)} className="w-[160px]" />
          <Button variant="outline" size="icon" aria-label="Next day" disabled={date >= today} onClick={() => setDate(addDays(date, 1))}><ChevronRight className="h-4 w-4" /></Button>
          {off && <Badge variant="secondary">Weekly off</Badge>}
          {holiday && <Badge variant="secondary">Holiday: {holiday.name}</Badge>}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="bg-sky-100 text-sky-800 border-sky-200">In {counts.in}</Badge>
          <Badge variant="outline">Punched out {counts.out}</Badge>
          <Badge variant="outline" className="border-violet-300 text-violet-700">On leave {counts.leave}</Badge>
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200">Not in {counts.notIn}</Badge>
          <Badge variant="outline" className="border-orange-300 text-orange-700">Late {counts.late}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : !people.length ? <Empty text="No active employees on this date." /> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead><TableHead>First in</TableHead><TableHead>Last out</TableHead>
                    <TableHead>Worked</TableHead><TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {people.map((e) => {
                    const d = byEmp.get(e.id);
                    const lv = leaveOf(e.id);
                    return (
                      <TableRow key={e.id}>
                        <TableCell>
                          <div className="font-medium">{e.full_name}</div>
                          <div className="text-xs text-muted-foreground">{e.employee_code}{e.designation ? ` · ${e.designation}` : ''}</div>
                        </TableCell>
                        <TableCell>{d ? fmtTime(d.first_in) : '—'}</TableCell>
                        <TableCell>{d && !d.is_open ? fmtTime(d.last_out) : '—'}</TableCell>
                        <TableCell>{d ? fmtMinutes(d.worked_minutes) : '—'}</TableCell>
                        <TableCell>
                          <span className="inline-flex flex-wrap gap-1">
                            {d && <><StatusBadge status={d.status} /><DayFlags day={d} /></>}
                            {lv && <Badge variant="outline" className="border-violet-300 text-violet-700">{lv.type}{lv.half_day ? ' (half day)' : ''}</Badge>}
                            {!d && !lv && <Badge variant="outline" className="text-muted-foreground">{holiday ? 'Holiday' : off ? 'Weekly off' : date === today ? 'Not in yet' : 'No punches'}</Badge>}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

// ---- By employee -----------------------------------------------------------------------

const EmployeeTab = ({ today }: { today: string }) => {
  const [month, setMonth] = useState(today.slice(0, 7));
  const [emp, setEmp] = useState('');
  const { data: all } = useMonthData(month);
  const { data, isLoading } = useMonthData(month, emp);
  const rows = [...(data?.days ?? [])].sort((a, b) => b.work_date.localeCompare(a.work_date));
  const t = { present: 0, half_day: 0, absent: 0, late: 0, minutes: 0 };
  for (const d of rows) {
    if (d.status === 'present' || d.status === 'half_day' || d.status === 'absent') t[d.status] += 1;
    if (d.is_late) t.late += 1;
    t.minutes += d.worked_minutes;
  }
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <Select value={emp} onValueChange={setEmp}>
          <SelectTrigger className="w-[260px]"><SelectValue placeholder="Choose an employee" /></SelectTrigger>
          <SelectContent>
            {(all?.employees ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.full_name} ({e.employee_code}){e.active ? '' : ' · disabled'}</SelectItem>)}
          </SelectContent>
        </Select>
        <MonthPicker month={month} setMonth={setMonth} max={today.slice(0, 7)} />
      </CardHeader>
      <CardContent className="space-y-4">
        {!emp ? <Empty text="Choose an employee to see their month." /> : isLoading ? <Spinner /> : (
          <>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Present {t.present}</Badge>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Half day {t.half_day}</Badge>
              <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200">Absent {t.absent}</Badge>
              <Badge variant="outline" className="border-orange-300 text-orange-700">Late {t.late}</Badge>
              <Badge variant="outline">Total worked {fmtMinutes(t.minutes)}</Badge>
            </div>
            {rows.length ? <DaysTable rows={rows} data={data} showName={false} /> : <Empty text="No punches this month." />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

// ---- Late / missed punch-out -------------------------------------------------------------

const FilteredTab = ({ today, filter, title, description, empty }: {
  today: string; filter: (d: AttendanceDay) => boolean; title: string; description: string; empty: string;
}) => {
  const [month, setMonth] = useState(today.slice(0, 7));
  const { data, isLoading, error } = useMonthData(month);
  const rows = (data?.days ?? []).filter(filter).sort((a, b) => b.work_date.localeCompare(a.work_date));
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <MonthPicker month={month} setMonth={setMonth} max={today.slice(0, 7)} />
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : rows.length ? <DaysTable rows={rows} data={data} /> : <Empty text={empty} />}
      </CardContent>
    </Card>
  );
};

// ---- Corrections ------------------------------------------------------------------------

const CORR_STATUS: Record<Correction['status'], string> = {
  pending: 'border-amber-300 text-amber-700', approved: 'border-emerald-300 text-emerald-700',
  rejected: 'border-rose-300 text-rose-700', cancelled: 'text-muted-foreground',
};

const CorrectionsTab = () => {
  const [status, setStatus] = useState<'pending' | 'all'>('pending');
  const { data = [], isLoading, error } = useQuery({ queryKey: ['admin', 'attendance', 'corrections', status], queryFn: () => fetchAdminCorrections(status) });
  const [rejecting, setRejecting] = useState<Correction | null>(null);
  const [comment, setComment] = useState('');
  const qc = useQueryClient();
  const { toast } = useToast();
  const decide = useMutation({
    mutationFn: (v: { c: Correction; action: 'approved' | 'rejected'; comment: string }) => decideCorrection(v.c.id, v.action, v.comment),
    onSuccess: (c) => {
      toast({ title: c.status === 'approved' ? 'Correction approved' : 'Correction rejected', description: `${c.employee.full_name} · ${fmtDate(c.work_date)}` });
      setRejecting(null);
      void qc.invalidateQueries({ queryKey: ['admin', 'attendance'] });
    },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
  });
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">Correction requests</CardTitle>
          <CardDescription>Approving changes the punch times; the rules are checked again at that moment.</CardDescription>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant={status === 'pending' ? 'default' : 'outline'} onClick={() => setStatus('pending')}>Pending</Button>
          <Button size="sm" variant={status === 'all' ? 'default' : 'outline'} onClick={() => setStatus('all')}>All</Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <Spinner /> : error ? <p className="text-sm text-destructive">{(error as Error).message}</p>
          : !data.length ? <Empty text={status === 'pending' ? 'No requests waiting.' : 'No requests yet.'} /> : (
            <ul className="divide-y">
              {data.map((c) => (
                <li key={c.id} className="py-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{c.employee.full_name} <span className="text-muted-foreground">({c.employee.employee_code})</span> · {fmtDate(c.work_date)}</div>
                    <div><CorrectionSummary c={c} /></div>
                    <div className="text-muted-foreground">“{c.reason}”</div>
                    {c.status !== 'pending' && c.status !== 'cancelled' && (
                      <div className="text-xs text-muted-foreground">{c.status === 'approved' ? 'Approved' : 'Rejected'} by {c.decided_by ?? '—'}{c.decision_comment ? ` · ${c.decision_comment}` : ''}</div>
                    )}
                  </div>
                  {c.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button size="sm" disabled={decide.isPending} onClick={() => decide.mutate({ c, action: 'approved', comment: '' })}><Check className="h-4 w-4 mr-1" />Approve</Button>
                      <Button size="sm" variant="outline" disabled={decide.isPending} onClick={() => { setRejecting(c); setComment(''); }}><X className="h-4 w-4 mr-1" />Reject</Button>
                    </div>
                  ) : <Badge variant="outline" className={CORR_STATUS[c.status]}>{c.status[0].toUpperCase() + c.status.slice(1)}</Badge>}
                </li>
              ))}
            </ul>
          )}
      </CardContent>
      <Dialog open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject correction</DialogTitle>
            <DialogDescription>{rejecting?.employee.full_name} · {rejecting && fmtDate(rejecting.work_date)}. The employee will see your reason.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea id="reject-reason" maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>Cancel</Button>
            <Button variant="destructive" disabled={!comment.trim() || decide.isPending}
              onClick={() => rejecting && decide.mutate({ c: rejecting, action: 'rejected', comment })}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// ---- Page -----------------------------------------------------------------------------------

/** Admin: everyone's attendance. Punch times are never edited here; they change only through approved corrections. */
const AttendanceAdmin = () => {
  const today = todayInOman();
  const { data } = useQuery({ queryKey: ['admin', 'attendance', today, today, 'all'], queryFn: () => fetchAdminAttendance(today, today) });
  const rules = data?.rules;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        {rules && (
          <p className="text-sm text-muted-foreground">
            Office {fmtClock(rules.office_start)} – {fmtClock(rules.office_end)} (Oman time) · late after {fmtClock(rules.late_after)} ·
            under {rules.half_day_min_hours} h = absent, {rules.half_day_min_hours} h+ = half day, until {fmtClock(rules.office_end)} = present ·
            automatic punch-out {fmtClock(rules.auto_punch_out)} · weekly off {rules.weekly_off.map((d) => WEEKDAYS[d - 1]).join(', ') || 'none'}
          </p>
        )}
      </div>
      <Tabs defaultValue="daily">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="employee">By employee</TabsTrigger>
          <TabsTrigger value="late">Late</TabsTrigger>
          <TabsTrigger value="missing">Missed punch-out</TabsTrigger>
          <TabsTrigger value="corrections">
            Corrections{data?.pending_corrections ? <Badge className="ml-2 h-5 px-1.5">{data.pending_corrections}</Badge> : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="daily"><DailyTab today={today} /></TabsContent>
        <TabsContent value="employee"><EmployeeTab today={today} /></TabsContent>
        <TabsContent value="late">
          <FilteredTab today={today} filter={(d) => d.is_late} title="Late arrivals"
            description={rules ? `First punch-in of the day after ${fmtClock(rules.late_after)}.` : ''} empty="Nobody was late this month." />
        </TabsContent>
        <TabsContent value="missing">
          <FilteredTab today={today} filter={(d) => d.auto_out} title="Missed punch-out"
            description={rules ? `Forgot to punch out: closed automatically at ${fmtClock(rules.auto_punch_out)}.` : ''} empty="No missed punch-outs this month." />
        </TabsContent>
        <TabsContent value="corrections"><CorrectionsTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceAdmin;
