/**
 * Employee Portal, mounted at /portal/*. Every active employee lands here after
 * signing in on /login. Home, attendance (punch in/out, corrections), leave,
 * profile, password, and the way into the Proposal Tracker for proposal
 * engineers. Daily reports and notifications are added by later steps.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CalendarCheck, ClipboardList, Clock, IdCard, Loader2, NotebookPen, Plane, User, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { can, fetchMyAccess, type MyAccess, type MyEmployee } from '@/portal/lib/access';
import { ChangePasswordForm } from '@/portal/components/ChangePasswordForm';
import { ForcedPasswordChange } from '@/portal/components/ForcedPasswordChange';
import { AttendancePage, PunchInGate, TodayAttendanceCard, useAttendanceMe } from '@/portal/components/Attendance';
import { LeavePage } from '@/portal/components/Leave';
import { PortalShell } from '@/portal/components/PortalShell';
import { TeamOverview } from '@/portal/components/TeamOverview';
import { DailyReportPage } from '@/portal/components/DailyReport';
import { NoticeList, NotificationsPage } from '@/portal/components/Notifications';
import { MyProjectsPage, ProjectPage, Progress, TaskLine } from '@/portal/components/Projects';
import { MyProfileCards } from '@/portal/components/ProfileCards';
import { PROJECTS_KEY, fetchMyProjects } from '@/portal/lib/projects';
import { REPORTS_KEY, REPORT_STATUS_TEXT, fetchMyReport } from '@/portal/lib/reports';
import { Hero, KpiCard, LoadingScreen, RoleChip } from '@/portal/theme/ui';
import { fmtMinutes, fmtTime } from '@/portal/lib/attendance';
import { fetchLeaveOverview, fmtDays, isPending } from '@/portal/lib/leave';

// ---- Access context ----------------------------------------------------------

interface PortalCtx { access: MyAccess; employee: MyEmployee; signOut: () => Promise<void> }
const PortalContext = createContext<PortalCtx | null>(null);
const usePortal = () => {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside the Employee Portal');
  return ctx;
};

type Load =
  | { state: 'loading' }
  | { state: 'signed-out' }
  | { state: 'not-employee'; access: MyAccess }
  | { state: 'disabled' }
  | { state: 'ready'; access: MyAccess; employee: MyEmployee };

// ---- Pages ---------------------------------------------------------------------

const Detail = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium">{value || '—'}</dd>
  </div>
);

const MyTeam = ({ managerId }: { managerId: string }) => {
  // RLS returns only the signed-in manager's direct reports for this filter.
  const { data = [], isLoading } = useQuery({
    queryKey: ['portal', 'my-team', managerId],
    queryFn: async () => {
      const { data, error } = await supabase.from('employees')
        .select('id, employee_code, full_name, designation, active')
        .eq('reporting_manager_id', managerId).eq('active', true).order('full_name');
      if (error) throw error;
      return data;
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />My team</CardTitle>
        <CardDescription>People who report to you.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nobody reports to you yet.</p>
        ) : (
          <ul className="divide-y">
            {data.map((m) => (
              <li key={m.id} className="py-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{m.full_name}</span>
                <span className="text-xs text-muted-foreground">{m.designation ?? m.employee_code}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

/** Headline numbers for what this person may do. */
const HomeNumbers = () => {
  const { access, employee } = usePortal();
  const attendance = can(access, 'emp.attendance.create');
  const leave = can(access, 'emp.leave.create');
  const att = useAttendanceMe(attendance);
  const writes = can(access, 'emp.reports.create');
  const rep = useQuery({ queryKey: [...REPORTS_KEY, 'mine', null], queryFn: () => fetchMyReport(null), enabled: writes });
  const lv = useQuery({ queryKey: ['portal', 'leave', 'home'], queryFn: () => fetchLeaveOverview(), enabled: leave });
  const paid = (lv.data?.balances ?? []).filter((b) => b.paid && b.active && b.remaining !== null);
  const left = paid.reduce((sum, b) => sum + Number(b.remaining), 0);
  const waiting = (lv.data?.requests ?? []).filter((r) => isPending(r.status)).length;
  const today = att.data;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {attendance && (
        <KpiCard icon={Clock} accent="navy" label="Worked today" to="/portal/attendance"
          value={today ? fmtMinutes(today.today_summary?.worked_minutes ?? 0) : '…'}
          hint={today?.today_summary?.is_late ? 'Marked late today' : 'Updates every minute'} />
      )}
      {attendance && (
        <KpiCard icon={CalendarCheck} accent="green" label="Today" to="/portal/attendance"
          value={!today ? '…' : today.open_session ? 'Working' : today.today_summary ? 'Punched out' : today.is_weekly_off ? 'Day off' : 'Not in'}
          hint={today?.open_session ? `Since ${fmtTime(today.open_session.punch_in_at)}` : today?.day_off?.name} />
      )}
      {leave && (
        <KpiCard icon={Plane} accent="violet" label="Paid leave left" to="/portal/leave"
          value={lv.data ? `${fmtDays(left)} d` : '…'} hint={waiting ? `${waiting} request${waiting === 1 ? '' : 's'} waiting` : 'This year'} />
      )}
      {writes && (
        <KpiCard icon={NotebookPen} accent="orange" label="Today's report" to="/portal/reports"
          value={!rep.data ? '…' : rep.data.report ? REPORT_STATUS_TEXT[rep.data.report.status] : 'Not started'}
          hint={rep.data?.report?.status === 'returned' ? 'Change it and submit again' : undefined} />
      )}
      {!writes && (
        <KpiCard icon={IdCard} accent="orange" label="Employee ID" to="/portal/profile"
          value={employee.employee_code} hint={employee.department ?? undefined} />
      )}
    </div>
  );
};

const PanelLink = ({ to }: { to: string }) => <Button asChild variant="link" className="h-auto px-0 text-xs"><Link to={to}>View all</Link></Button>;

/** Leave balance, projects, open tasks and the latest notifications. */
const HomePanels = () => {
  const { access } = usePortal();
  const leave = can(access, 'emp.leave.create');
  const projects = can(access, 'emp.projects.view');
  const lv = useQuery({ queryKey: ['portal', 'leave', 'home'], queryFn: () => fetchLeaveOverview(), enabled: leave });
  const pr = useQuery({ queryKey: [...PROJECTS_KEY, 'mine'], queryFn: fetchMyProjects, enabled: projects });
  const head = 'flex flex-row items-center justify-between gap-3 space-y-0';
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {leave && (
        <Card>
          <CardHeader className={head}><CardTitle className="text-base">Leave balance</CardTitle><PanelLink to="/portal/leave" /></CardHeader>
          <CardContent className="space-y-3">
            {(lv.data?.balances ?? []).filter((b) => b.active && b.entitled !== null).map((b) => (
              <div key={b.id}>
                <div className="flex justify-between text-sm"><span>{b.name}</span><span className="font-semibold">{fmtDays(b.remaining)} of {fmtDays(b.entitled)} left</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#e9edf7]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9]" style={{ width: `${b.entitled ? Math.max(0, Number(b.remaining) / Number(b.entitled)) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader className={head}><CardTitle className="text-base">Recent notifications</CardTitle><PanelLink to="/portal/notifications" /></CardHeader>
        <CardContent><NoticeList limit={4} /></CardContent>
      </Card>
      {projects && (
        <Card>
          <CardHeader className={head}><CardTitle className="text-base">Assigned projects</CardTitle><PanelLink to="/portal/projects" /></CardHeader>
          <CardContent className="space-y-3">
            {(pr.data?.projects ?? []).slice(0, 4).map((p) => (
              <Link key={p.id} to={`/portal/projects/${p.id}`} className="block">
                <p className="mb-1 text-sm font-medium">{p.name}</p><Progress done={p.tasks_done} total={p.tasks_total} />
              </Link>
            ))}
            {pr.data && !pr.data.projects.length && <p className="text-sm text-muted-foreground">No projects assigned yet.</p>}
          </CardContent>
        </Card>
      )}
      {projects && (
        <Card>
          <CardHeader className={head}><CardTitle className="text-base">My open tasks</CardTitle><PanelLink to="/portal/projects" /></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {(pr.data?.tasks ?? []).slice(0, 5).map((t) => (
                <li key={t.id}><Link to={`/portal/projects/${t.project_id}`} className="block py-2"><span className="block text-sm font-medium">{t.title}</span><TaskLine t={t} /></Link></li>
              ))}
            </ul>
            {pr.data && !pr.data.tasks.length && <p className="text-sm text-muted-foreground">No open tasks.</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const HomePage = () => {
  const { access, employee } = usePortal();
  // People who may see everyone's attendance get the company overview for today.
  if (can(access, 'portal.attendance.view')) return <TeamOverview access={access} />;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <div className="space-y-6">
      <Hero
        eyebrow={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Muscat' })}
        title={`${greeting}, ${employee.full_name.split(' ')[0]}`}
        subtitle={[employee.designation, employee.department].filter(Boolean).join(' · ') || 'Here is your day at a glance'}
      >
        <div className="flex flex-wrap gap-1.5">{access.roles.map((r) => <RoleChip key={r.key} role={r} />)}</div>
      </Hero>
      <HomeNumbers />
      <HomePanels />
      <div className="grid gap-6 md:grid-cols-2">
        {can(access, 'emp.attendance.create') && <TodayAttendanceCard />}
        {can(access, 'proposal.tracker.view') && (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4" />Proposal Tracker</CardTitle>
              <CardDescription>Your RFQs, tasks, follow-ups and daily updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild><Link to="/proposal-tracker">Open Proposal Tracker<ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" />My details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <Detail label="Employee ID" value={employee.employee_code} />
              <Detail label="Department" value={employee.department} />
              <Detail label="Designation" value={employee.designation} />
              <Detail label="Reports to" value={employee.manager_name} />
            </dl>
            <Button asChild variant="link" className="px-0 mt-2"><Link to="/portal/profile">View my profile</Link></Button>
          </CardContent>
        </Card>
        {can(access, 'team.members.view') && <MyTeam managerId={employee.id} />}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { access, employee } = usePortal();
  const { toast } = useToast();
  const [formKey, setFormKey] = useState(0);
  return (
    <div className="space-y-6">
      <MyProfileCards employeeId={employee.id} roles={access.roles} canEdit={can(access, 'emp.profile.edit')} canUpload={can(access, 'emp.documents.create')} />
      <Card className="max-w-xl">
        <CardHeader><CardTitle className="text-base">Change password</CardTitle></CardHeader>
        <CardContent>
          <ChangePasswordForm key={formKey} onDone={() => {
            setFormKey((k) => k + 1);
            toast({ title: 'Password changed', description: 'Use your new password next time you sign in.' });
          }} />
        </CardContent>
      </Card>
    </div>
  );
};

// ---- Shell -----------------------------------------------------------------------

const Shell = () => {
  const { access, employee, signOut } = usePortal();
  const showLeave = can(access, 'emp.leave.create') || can(access, 'team.leave.view');
  const showReports = can(access, 'emp.reports.create') || can(access, 'team.reports.view');
  const routes = (
    <Routes>
      <Route index element={<HomePage />} />
      {can(access, 'emp.attendance.create') && <Route path="attendance" element={<AttendancePage />} />}
      {showLeave && (
        <Route path="leave" element={<LeavePage canApply={can(access, 'emp.leave.create')} isManager={can(access, 'team.leave.view')} />} />
      )}
      {can(access, 'emp.projects.view') && <Route path="projects" element={<MyProjectsPage />} />}
      {can(access, 'emp.projects.view') && <Route path="projects/:projectId" element={<ProjectPage />} />}
      <Route path="notifications" element={<NotificationsPage />} />
      {showReports && (
        <Route path="reports" element={<DailyReportPage canWrite={can(access, 'emp.reports.create')} isManager={can(access, 'team.reports.view')} />} />
      )}
      <Route path="profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
  const portal = <PortalShell access={access} employee={employee} signOut={signOut}>{routes}</PortalShell>;
  if (!can(access, 'emp.attendance.create')) return portal;
  return (
    <PunchInGate name={employee.full_name} onSignOut={() => void signOut()} adminPages={!!access.admin_pages}>{portal}</PunchInGate>
  );
};

// ---- Entry -------------------------------------------------------------------------

const PortalApp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  // Signed out from inside the portal → plain /login (no "come back here" link).
  const wasSignedIn = useRef(false);
  if (load.state === 'ready') wasSignedIn.current = true;

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return setLoad({ state: 'signed-out' });
    try {
      const access = await fetchMyAccess();
      const emp = access.employee;
      if (!emp) return setLoad({ state: 'not-employee', access });
      if (!emp.active) return setLoad({ state: 'disabled' });
      setLoad({ state: 'ready', access, employee: emp });
    } catch (e) {
      console.error('Employee portal: could not load access', e);
      setLoad({ state: 'signed-out' });
    }
  }, []);

  useEffect(() => {
    void refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setLoad({ state: 'signed-out' });
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (load.state !== 'disabled') return;
    toast({ title: 'Account disabled', description: 'Please contact your administrator.', variant: 'destructive' });
    void signOut();
  }, [load.state, signOut, toast]);

  const head = (
    <Helmet defer={false}>
      <meta name="robots" content="noindex, nofollow" />
      <title>Employee Portal | Global Chemicals</title>
    </Helmet>
  );

  if (load.state === 'loading' || load.state === 'disabled') return <>{head}<LoadingScreen /></>;
  if (load.state === 'signed-out') return <Navigate to={wasSignedIn.current ? '/login' : '/login?next=/portal'} replace />;
  if (load.state === 'not-employee') {
    // Website admins without an employee record belong in the admin dashboard.
    return <Navigate to={load.access.is_super_admin ? '/admin' : '/'} replace />;
  }

  const { access, employee } = load;
  if (employee.must_change_password) {
    return (
      <>{head}
        <ForcedPasswordChange name={employee.full_name} onSignOut={() => void signOut()}
          onDone={() => setLoad({ state: 'ready', access, employee: { ...employee, must_change_password: false } })} />
      </>
    );
  }

  return (
    <PortalContext.Provider value={{ access, employee, signOut }}>
      {head}
      <Shell />
    </PortalContext.Provider>
  );
};

export default PortalApp;
