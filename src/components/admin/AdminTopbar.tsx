/** Top bar of the admin panel: menu button, page title, your role, portal link and sign-out. */
import { Link, useLocation } from 'react-router-dom';
import { LogOut, UserRound } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import type { MyAccess } from '@/portal/lib/access';
import { RoleChip } from '@/portal/theme/ui';

// First match wins, so more specific paths come first.
const PAGES: [path: string, section: string, title: string][] = [
  ['/admin/contacts', 'Lead Management', 'Contact Forms'],
  ['/admin/jobs', 'Lead Management', 'Job Applications'],
  ['/admin/resumes', 'Lead Management', 'Resume Folders'],
  ['/admin/downloads', 'Lead Management', 'Download Leads'],
  ['/admin/newsletter', 'Lead Management', 'Newsletter'],
  ['/admin/search-console', 'Lead Management', 'Search Console'],
  ['/admin/ar-indexing', 'Lead Management', 'Index Coverage'],
  ['/admin/seo-languages', 'Lead Management', 'AR vs EN SEO'],
  ['/admin/proposal-tracker', 'Proposal Tracker', 'Proposal Tracker'],
  ['/admin/employee-portal', 'Employee Portal', 'Overview'],
  ['/admin/employees', 'Employee Portal', 'Employees'],
  ['/admin/attendance', 'Employee Portal', 'Attendance'],
  ['/admin/leave', 'Employee Portal', 'Leave'],
  ['/admin/reports', 'Employee Portal', 'Daily Reports'],
  ['/admin/projects', 'Employee Portal', 'Projects'],
  ['/admin/notifications', 'Employee Portal', 'Notifications'],
  ['/admin/settings', 'Administration', 'Settings'],
];

export const AdminTopbar = ({ access }: { access: MyAccess | undefined }) => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const [, section, title] = PAGES.find(([p]) => pathname.startsWith(p)) ?? ['', 'Overview', 'Dashboard'];
  const name = access?.employee?.full_name ?? user?.email ?? '';
  return (
    <header className="sticky top-0 z-10 bg-white/90 shadow-[0_8px_24px_-18px_rgba(16,26,58,0.35)] backdrop-blur-xl">
      <div className="flex h-[4.5rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="h-10 w-10 shrink-0 rounded-xl border border-[#e7e9ee] bg-white text-[#223f96] shadow-sm" />
        <div className="min-w-0 flex-1">
          <p className="hidden text-[12.5px] font-medium text-muted-foreground sm:block">Admin / {section}</p>
          <p className="truncate text-lg font-bold leading-tight tracking-tight text-[#101a3a] sm:text-[1.3rem]">{title}</p>
        </div>
        {access?.roles[0] && <span className="hidden sm:inline-flex"><RoleChip role={access.roles[0]} /></span>}
        <span className="hidden max-w-[14rem] truncate text-sm font-medium text-[#101a3a] lg:inline">{name}</span>
        {access?.employee && (
          <Link to="/portal" className="hidden h-10 shrink-0 items-center gap-2 rounded-xl border border-[#e7e9ee] bg-white px-3.5 text-sm font-semibold text-[#223f96] shadow-sm hover:border-[#f1592a]/60 md:inline-flex">
            <UserRound className="h-4 w-4" aria-hidden="true" />My portal
          </Link>
        )}
        <button type="button" onClick={() => void signOut()} aria-label="Sign out" title="Sign out" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7e9ee] bg-white text-[#223f96] shadow-sm hover:border-[#f1592a]/60 hover:text-[#d9461a]">
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div aria-hidden="true" className="h-[2px] w-full bg-gradient-to-r from-[#223f96] via-[#f1592a] to-[#4f74e0]" />
    </header>
  );
};
