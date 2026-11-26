/**
 * Employee Portal, mounted at /portal/*. Every active employee lands here after
 * signing in on /login. Home, attendance (punch in/out, corrections), leave,
 * profile, password, and the way into the Proposal Tracker for proposal
 * engineers. Daily reports and notifications are added by later steps.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CalendarClock, CalendarDays, ClipboardList, Home, Loader2, LogOut, ShieldCheck, User, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { can, fetchMyAccess, type MyAccess, type MyEmployee } from '@/portal/lib/access';
import { ChangePasswordForm } from '@/portal/components/ChangePasswordForm';
import { ForcedPasswordChange } from '@/portal/components/ForcedPasswordChange';
import { AttendancePage, PunchInGate, TodayAttendanceCard } from '@/portal/components/Attendance';
import { LeavePage } from '@/portal/components/Leave';
import logo from '@/assets/global-chemicals-logo.svg';

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

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
);

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

const HomePage = () => {
  const { access, employee } = usePortal();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {employee.full_name.split(' ')[0]}</h1>
        <p className="text-sm text-muted-foreground">Welcome to the Global Chemicals employee portal.</p>
      </div>
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
      <h1 className="text-2xl font-bold">My profile</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
            <CardDescription>Ask the administrator if anything here is wrong.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <Detail label="Full name" value={employee.full_name} />
              <Detail label="Employee ID" value={employee.employee_code} />
              <Detail label="Email (login)" value={employee.email} />
              <Detail label="Phone" value={employee.phone} />
              <Detail label="Department" value={employee.department} />
              <Detail label="Designation" value={employee.designation} />
              <Detail label="Joining date" value={employee.joined_on ? new Date(employee.joined_on).toLocaleDateString() : null} />
              <Detail label="Reports to" value={employee.manager_name} />
            </dl>
            <div className="mt-4 flex flex-wrap gap-1">
              {access.roles.map((r) => <Badge key={r.key} variant="secondary">{r.name}</Badge>)}
              {employee.proposal_code && <Badge variant="outline">Tracker code {employee.proposal_code}</Badge>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm key={formKey} onDone={() => {
              setFormKey((k) => k + 1);
              toast({ title: 'Password changed', description: 'Use your new password next time you sign in.' });
            }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ---- Shell -----------------------------------------------------------------------

const navClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`;

const Shell = () => {
  const { access, employee, signOut } = usePortal();
  const showLeave = can(access, 'emp.leave.create') || can(access, 'team.leave.view');
  const routes = (
    <Routes>
      <Route index element={<HomePage />} />
      {can(access, 'emp.attendance.create') && <Route path="attendance" element={<AttendancePage />} />}
      {showLeave && (
        <Route path="leave" element={<LeavePage canApply={can(access, 'emp.leave.create')} isManager={can(access, 'team.leave.view')} />} />
      )}
      <Route path="profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-3">
          <Link to="/portal" className="flex items-center gap-3 mr-4">
            <img src={logo} alt="Global Chemicals LLC" width={120} height={38} className="h-9 w-auto" />
            <span className="hidden sm:inline text-sm font-semibold text-muted-foreground">Employee Portal</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 flex-1">
            <NavLink to="/portal" end className={navClass}><Home className="h-4 w-4" />Home</NavLink>
            {can(access, 'emp.attendance.create') && (
              <NavLink to="/portal/attendance" className={navClass}><CalendarClock className="h-4 w-4" />Attendance</NavLink>
            )}
            {showLeave && <NavLink to="/portal/leave" className={navClass}><CalendarDays className="h-4 w-4" />Leave</NavLink>}
            {can(access, 'proposal.tracker.view') && (
              <NavLink to="/proposal-tracker" className={navClass}><ClipboardList className="h-4 w-4" />Proposal Tracker</NavLink>
            )}
            <NavLink to="/portal/profile" className={navClass}><User className="h-4 w-4" />My profile</NavLink>
            {access.admin_pages && <NavLink to="/admin" className={navClass}><ShieldCheck className="h-4 w-4" />Admin panel</NavLink>}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-muted-foreground">{employee.full_name}</span>
            <Button variant="outline" size="sm" onClick={() => void signOut()}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {can(access, 'emp.attendance.create') ? <PunchInGate employeeId={employee.id} name={employee.full_name}>{routes}</PunchInGate> : routes}
      </main>
    </div>
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

  if (load.state === 'loading' || load.state === 'disabled') return <>{head}<Spinner /></>;
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
