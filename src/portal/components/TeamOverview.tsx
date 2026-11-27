/**
 * Employee Portal home for people who may see company attendance: who is in
 * today, what is waiting for them and what is coming up in the next 7 days.
 * Each block loads only with its own permission (the database enforces it).
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlarmClock, ArrowRight, Building2, CheckCircle2, ChevronRight, Hourglass, Inbox, Loader2, LogOut, Plane, RefreshCw, UserX, Users, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { can, type MyAccess } from '@/portal/lib/access';
import { addDays, fetchAdminAttendance, fmtDate, fmtTime } from '@/portal/lib/attendance';
import { fetchAdminLeave } from '@/portal/lib/leave';
import { fetchAdminReports } from '@/portal/lib/reports';
import { fetchAdminProjects } from '@/portal/lib/projects';
import { listEmployees } from '@/portal/lib/employees';
import { companyToday, dayOffName, lastWorkingDay, onFullLeave, peopleToday, type PersonToday } from '@/portal/lib/overview';
import { Hero, KpiCard } from '@/portal/theme/ui';

const OVERVIEW_KEY = ['portal', 'overview'];

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const initials = (name: string) => {
  const w = name.split(/\s+/).filter(Boolean);
  return [w[0], w.length > 1 ? w[w.length - 1] : ''].map((x) => x?.[0]?.toUpperCase() ?? '').join('');
};
const shortDate = (d: string) => fmtDate(d, { day: 'numeric', month: 'short' });

const Chip = ({ tone, children }: { tone: 'green' | 'amber' | 'violet' | 'slate' | 'navy'; children: ReactNode }) => {
  const tones = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    amber: 'bg-amber-50 text-amber-700 ring-amber-600/25',
    violet: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    slate: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    navy: 'bg-[#eef2fb] text-[#223f96] ring-[#223f96]/15',
  };
  return <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
};

const Panel = ({ title, hint, aside, children }: { title: string; hint?: string; aside?: ReactNode; children: ReactNode }) => (
  <Card>
    <CardContent className="p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#101a3a]">{title}</h2>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {aside}
      </div>
      {children}
    </CardContent>
  </Card>
);

const Empty = ({ children }: { children: ReactNode }) => <p className="rounded-xl border border-dashed py-4 text-center text-sm text-muted-foreground">{children}</p>;
const Spinner = () => <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-primary" aria-label="Loading" /></div>;
const Failed = ({ what }: { what: string }) => <p className="py-3 text-sm text-destructive">Could not load {what}. Use Refresh to try again.</p>;

const Stat = ({ icon: Icon, value, label, hint }: { icon: LucideIcon; value: ReactNode; label: string; hint?: string }) => (
  <div className="rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm">
    <Icon className="h-4 w-4 text-[#ff9a6c]" aria-hidden="true" />
    <p className="mt-2 text-2xl font-bold leading-none">{value}</p>
    <p className="mt-1 text-xs font-medium text-white/75">{label}</p>
    {hint && <p className="text-[11px] text-white/55">{hint}</p>}
  </div>
);

const STATE_CHIP = {
  in: <Chip tone="green">In office</Chip>,
  out: <Chip tone="navy">Checked out</Chip>,
  leave: <Chip tone="violet">On leave</Chip>,
  'not-in': <Chip tone="slate">Not in yet</Chip>,
  'day-off': <Chip tone="slate">Day off</Chip>,
};

const personLine = (p: PersonToday) =>
  p.day ? (p.day.is_open ? `In at ${fmtTime(p.day.first_in)}` : `In at ${fmtTime(p.day.first_in)} · Out at ${fmtTime(p.day.last_out)}`)
    : p.state === 'leave' ? p.leaveType : p.designation;

export const TeamOverview = ({ access }: { access: MyAccess }) => {
  const qc = useQueryClient();
  const today = companyToday();
  const adminPages = !!access.admin_pages;
  const may = {
    leave: can(access, 'portal.leave.view'),
    reports: can(access, 'portal.reports.view'),
    projects: can(access, 'portal.projects.view'),
    employees: can(access, 'portal.employees.view'),
  };
  const live = { refetchInterval: 60_000 };

  // Two weeks back (to find the last working day) to a week ahead (coming up).
  const attendance = useQuery({ queryKey: [...OVERVIEW_KEY, 'attendance', today], queryFn: () => fetchAdminAttendance(addDays(today, -14), addDays(today, 7)), ...live });
  const att = attendance.data;
  const previous = att ? lastWorkingDay(att, today) : null;
  const reports = useQuery({ queryKey: [...OVERVIEW_KEY, 'reports', previous], queryFn: () => fetchAdminReports(previous), enabled: may.reports && !!previous, ...live });
  const leave = useQuery({ queryKey: [...OVERVIEW_KEY, 'leave'], queryFn: () => fetchAdminLeave('action'), enabled: may.leave, ...live });
  const projects = useQuery({ queryKey: [...OVERVIEW_KEY, 'projects'], queryFn: fetchAdminProjects, enabled: may.projects });
  const employees = useQuery({ queryKey: [...OVERVIEW_KEY, 'employees'], queryFn: listEmployees, enabled: may.employees });

  const queries = [attendance, reports, leave, projects, employees];
  const refreshing = queries.some((q) => q.isFetching);

  const people = att ? peopleToday(att, today) : [];
  const count = (s: PersonToday['state']) => people.filter((p) => p.state === s).length;
  const inOffice = count('in');
  const onLeave = count('leave');
  const notIn = count('not-in');
  const late = people.filter((p) => p.late).length;
  const checkedIn = people.filter((p) => p.day).length;
  const interns = (employees.data ?? []).filter((e) => e.active && e.employment_type === 'intern').length;
  const dayOff = att ? dayOffName(att, today) : null;
  const show = (n: number) => (att ? n : '…');

  // ---- What is waiting for this person -------------------------------------------
  const missing = att && previous && reports.data
    ? reports.data.rows.filter((r) => !r.report && !onFullLeave(att, r.employee.id, previous)).length : 0;
  const toReview = can(access, 'portal.reports.approve') ? (reports.data?.waiting ?? []).filter((r) => r.can_review).length : 0;
  const leaveToApprove = can(access, 'portal.leave.approve') ? (leave.data?.length ?? 0) : 0;
  const corrections = can(access, 'portal.attendance.approve') ? (att?.pending_corrections ?? 0) : 0;
  const todo = [
    { n: leaveToApprove, to: '/admin/leave', text: `${plural(leaveToApprove, 'leave request')} waiting for your approval` },
    { n: corrections, to: '/admin/attendance', text: `${plural(corrections, 'attendance correction')} to decide` },
    { n: toReview, to: '/admin/reports', text: `${plural(toReview, 'daily report')} waiting for review` },
    { n: missing, to: '/admin/reports', text: `${plural(missing, 'daily report')} not submitted for the last working day` },
  ].filter((i) => i.n > 0);
  const todoLoading = attendance.isLoading || reports.isLoading || leave.isLoading;
  const todoFailed = attendance.isError || reports.isError || leave.isError;

  // ---- Next 7 days ---------------------------------------------------------------
  const from = addDays(today, 1);
  const to = addDays(today, 7);
  const deadlines = (projects.data?.projects ?? [])
    .filter((p) => p.end_date && p.end_date >= today && p.end_date <= to && p.status !== 'completed' && p.status !== 'cancelled')
    .sort((a, b) => a.end_date!.localeCompare(b.end_date!));
  const names = new Map((att?.employees ?? []).filter((e) => e.active).map((e) => [e.id, e.full_name]));
  const upcomingLeave = (att?.leave ?? [])
    .filter((l) => names.has(l.employee_id) && l.start_date <= to && l.end_date >= from)
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  const longDate = fmtDate(today, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employee Portal</h1>
          <p className="text-sm text-muted-foreground">{longDate} — today at a glance.</p>
        </div>
        <Button variant="outline" onClick={() => void qc.invalidateQueries({ queryKey: OVERVIEW_KEY })} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </div>

      <Hero eyebrow={dayOff ? `${longDate} · ${dayOff}` : longDate} title="Today at a glance"
        subtitle={todoLoading ? 'Checking what is waiting for you…' : todo.length ? `${plural(todo.length, 'item')} waiting for you.` : todoFailed ? 'Some information could not be loaded.' : 'Nothing is waiting for you.'}>
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat icon={Building2} value={show(inOffice)} label="In office" />
          <Stat icon={LogOut} value={show(count('out'))} label="Checked out" />
          <Stat icon={Plane} value={show(onLeave)} label="On leave" />
          <Stat icon={AlarmClock} value={show(late)} label="Late" />
          <Stat icon={Users} value={show(people.length)} label="Active employees" hint={interns ? plural(interns, 'intern') : undefined} />
        </div>
      </Hero>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard icon={CheckCircle2} accent="green" label="In office now" value={att ? `${inOffice} / ${people.length}` : '…'}
          hint={att ? `${checkedIn} checked in today · ${late} late` : undefined} />
        <KpiCard icon={UserX} accent="violet" label="Not in yet" value={show(notIn)}
          hint={att ? (dayOff ? `Today is a day off (${dayOff})` : `${onLeave} on leave today`) : undefined} />
        <KpiCard icon={Hourglass} accent="orange" label="Waiting for you" value={todoLoading ? '…' : todo.length}
          hint={todo.length ? 'See the list below' : 'All caught up'} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Needs your attention" hint="Open an item to deal with it" aside={todo.length ? <Chip tone="amber">{todo.length} to do</Chip> : undefined}>
            {todoLoading ? <Spinner /> : (
              <>
                {todoFailed && <Failed what="some of your to-do items" />}
                {todo.length ? (
                  <ul className="space-y-2">
                    {todo.map((i) => {
                      const row = (
                        <>
                          <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#fff1eb] px-2 text-sm font-bold text-[#c2410c]">{i.n}</span>
                          <span className="min-w-0 flex-1 text-sm font-medium">{i.text}</span>
                        </>
                      );
                      const box = 'flex items-center gap-3 rounded-xl border p-3';
                      return (
                        <li key={i.text}>
                          {adminPages
                            ? <Link to={i.to} className={`${box} transition-colors hover:border-[#f1592a] hover:bg-[#fff7f3]`}>{row}<ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" /></Link>
                            : <div className={box}>{row}</div>}
                        </li>
                      );
                    })}
                  </ul>
                ) : !todoFailed && <Empty><Inbox className="mx-auto mb-1 h-5 w-5" aria-hidden="true" />Nothing needs your attention.</Empty>}
              </>
            )}
          </Panel>

          <Panel title="Today’s attendance" hint={att ? plural(people.length, 'active employee') : undefined}
            aside={adminPages ? <Button asChild variant="link" className="h-auto px-0 text-xs"><Link to="/admin/attendance">Open attendance<ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button> : undefined}>
            {attendance.isLoading ? <Spinner /> : attendance.isError ? <Failed what="attendance" /> : !people.length ? <Empty>No active employees yet.</Empty> : (
              <ul className="divide-y">
                {people.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
                    <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#223f96] to-[#3f63c9] text-xs font-bold text-white">{initials(p.name)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{personLine(p) || '—'}</span>
                    </span>
                    <span className="flex gap-1.5">{p.late && <Chip tone="amber">Late</Chip>}{STATE_CHIP[p.state]}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Coming up" hint="Next 7 days">
          <div className="space-y-5">
            {may.projects && (
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Deadlines</h3>
                {projects.isLoading ? <Spinner /> : projects.isError ? <Failed what="deadlines" /> : !deadlines.length ? <Empty>No deadlines this week.</Empty> : (
                  <ul className="space-y-2">
                    {deadlines.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate font-medium">{p.name}</span>
                        <Chip tone="amber">{p.end_date === today ? 'Today' : shortDate(p.end_date!)}</Chip>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Leave</h3>
              {attendance.isLoading ? <Spinner /> : attendance.isError ? <Failed what="leave" /> : !upcomingLeave.length ? <Empty>Nobody is on leave this week.</Empty> : (
                <ul className="space-y-2">
                  {upcomingLeave.map((l) => (
                    <li key={`${l.employee_id}-${l.start_date}`} className="text-sm">
                      <span className="block font-medium">{names.get(l.employee_id)}</span>
                      <span className="block text-xs text-muted-foreground">
                        {l.type} · {l.start_date === l.end_date ? shortDate(l.start_date) : `${shortDate(l.start_date)} – ${shortDate(l.end_date)}`}{l.half_day && ' · Half day'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
