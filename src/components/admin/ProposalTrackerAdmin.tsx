import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TrackerAuthBridge } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { TrackerBaseContext } from '@/proposal-tracker/lib/base';
import { setSessionOverride } from '@/proposal-tracker/lib/session';
import { findLoginByEmail, listDemoLogins, syncEngineers, type LoginIdentity } from '@/proposal-tracker/lib/db';
import { EMPLOYEES_QUERY, listEmployees } from '@/portal/lib/employees';
import { PageHeader } from '@/proposal-tracker/components/tracker/common';
import Dashboard from '@/proposal-tracker/pages/tracker/Dashboard';
import Engineers from '@/proposal-tracker/pages/tracker/Engineers';
import EngineerDetail from '@/proposal-tracker/pages/tracker/EngineerDetail';
import RfqRegister from '@/proposal-tracker/pages/tracker/RfqRegister';
import Assignment from '@/proposal-tracker/pages/tracker/Assignment';
import Approvals from '@/proposal-tracker/pages/tracker/Approvals';
import Submissions from '@/proposal-tracker/pages/tracker/Submissions';
import Reports from '@/proposal-tracker/pages/tracker/Reports';
import Permissions from '@/proposal-tracker/pages/tracker/Permissions';
import DailyUpdates from '@/proposal-tracker/pages/tracker/DailyUpdates';

export const TRACKER_ADMIN_BASE = '/admin/proposal-tracker';

/**
 * Admin-side modules of the Proposal Engineer Tracker, inside the website
 * admin. Admin.tsx only renders this after useUserRole() has confirmed a real
 * Supabase admin, so the tracker's demo login is skipped: the admin acts as
 * the tracker employee with the same email, or else the first tracker Admin.
 *
 * Engineer-side modules (My Proposals, engineer dashboard, Tasks, Follow-ups,
 * Documents) stay in the standalone app at /proposal-tracker.
 */
const pickIdentity = (email?: string | null): LoginIdentity | null => {
  const byEmail = email ? findLoginByEmail(email) : null;
  if (byEmail?.role === 'admin') return byEmail;
  return listDemoLogins().find((l) => l.role === 'admin') ?? null;
};

const ProposalTrackerAdmin = () => {
  const { user } = useAuth();
  const identity = useMemo(() => pickIdentity(user?.email), [user?.email]);

  // Set during render, not in an effect: the tracker data layer reads the
  // caller synchronously while the child pages render.
  setSessionOverride(identity?.id ?? null);
  useEffect(() => () => setSessionOverride(null), []);

  // Engineers are real employees (Supabase) with Proposal Tracker access (a
  // tracker code); copy the active ones into the browser-local tracker so
  // assignment lists and labels show the real people.
  const { data: employees } = useQuery({ queryKey: EMPLOYEES_QUERY, queryFn: listEmployees });
  useEffect(() => {
    if (!employees) return;
    syncEngineers(
      employees
        .filter((e) => e.active && e.proposal_code)
        .map((e) => ({ id: e.id, code: e.proposal_code!, name: e.full_name, email: e.email })),
      'replace',
    );
  }, [employees]);

  if (!identity) {
    return <p className="text-sm text-muted-foreground">The tracker has no Admin employee record to act as.</p>;
  }

  return (
    <TrackerBaseContext.Provider value={TRACKER_ADMIN_BASE}>
      <TrackerAuthBridge user={identity}>
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 mb-6">
          Proposal Tracker prototype — data is stored in this browser only (not the database). Acting as tracker admin: {identity.name}.
        </div>
        <Routes>
          <Route path="/" element={<><PageHeader title="Proposal Tracker" /><Dashboard /></>} />
          <Route path="/engineers" element={<Engineers />} />
          {/* Engineer logins are managed with every other employee now. */}
          <Route path="/accounts" element={<Navigate to="/admin/employees" replace />} />
          <Route path="/engineers/:id" element={<EngineerDetail />} />
          <Route path="/rfqs" element={<RfqRegister />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/daily-updates" element={<DailyUpdates />} />
          <Route path="*" element={<Navigate to={TRACKER_ADMIN_BASE} replace />} />
        </Routes>
      </TrackerAuthBridge>
    </TrackerBaseContext.Provider>
  );
};

export default ProposalTrackerAdmin;
