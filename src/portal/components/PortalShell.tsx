/**
 * Frame of the Employee Portal: navy sidebar (a drawer on phones) and a top bar
 * with the page title, punch status, role and sign-out.
 */
import { useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Bell, CalendarClock, CalendarDays, ClipboardList, Clock, ExternalLink, FolderKanban, Home, Loader2, LogIn, LogOut, Menu, NotebookPen, ShieldCheck, User, X,
  type LucideIcon,
} from 'lucide-react';
import { can, type MyAccess, type MyEmployee } from '@/portal/lib/access';
import { fmtTime } from '@/portal/lib/attendance';
import { useAttendanceMe, usePunch } from '@/portal/components/Attendance';
import { UrgentBanner, useNotices } from '@/portal/components/Notifications';
import { DatabaseNotice } from '@/portal/components/DatabaseNotice';
import { RoleChip } from '@/portal/theme/ui';
import { usePortalTheme } from '@/portal/theme/usePortalTheme';
import icon from '@/assets/gc-icon.webp';

interface Item { to: string; label: string; icon: LucideIcon; show: boolean }

const sectionsFor = (access: MyAccess): { label: string; items: Item[] }[] => [
  { label: 'Overview', items: [{ to: '/portal', label: 'Dashboard', icon: Home, show: true }] },
  {
    label: 'My work',
    items: [
      { to: '/portal/projects', label: 'My projects', icon: FolderKanban, show: can(access, 'emp.projects.view') },
      { to: '/portal/attendance', label: 'Attendance', icon: CalendarClock, show: can(access, 'emp.attendance.create') },
      { to: '/portal/reports', label: 'Daily report', icon: NotebookPen, show: can(access, 'emp.reports.create') || can(access, 'team.reports.view') },
      { to: '/portal/leave', label: 'Leave', icon: CalendarDays, show: can(access, 'emp.leave.create') || can(access, 'team.leave.view') },
      { to: '/portal/notifications', label: 'Notifications', icon: Bell, show: true },
      { to: '/proposal-tracker', label: 'Proposal Tracker', icon: ClipboardList, show: can(access, 'proposal.tracker.view') },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/portal/profile', label: 'My profile', icon: User, show: true },
      { to: '/', label: 'Back to website', icon: ExternalLink, show: true },
    ],
  },
  { label: 'Admin', items: [{ to: '/admin', label: 'Admin panel', icon: ShieldCheck, show: !!access.admin_pages }] },
];

/** "In since …" and the punch button in the top bar. */
const PunchControls = () => {
  const { data: me } = useAttendanceMe();
  const punch = usePunch();
  if (!me) return null;
  const open = me.open_session;
  return (
    <>
      {open && (
        <span className="hidden h-10 shrink-0 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 xl:inline-flex">
          <Clock className="h-4 w-4" aria-hidden="true" />In since {fmtTime(open.punch_in_at)}
        </span>
      )}
      <button
        type="button"
        disabled={punch.isPending}
        onClick={() => punch.mutate(open ? 'out' : 'in')}
        aria-label={open ? 'Punch out' : 'Punch in'}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f1762a] to-[#f1592a] px-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgba(241,89,42,0.7)] transition-opacity hover:opacity-95 disabled:opacity-60"
      >
        {punch.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          : open ? <LogOut className="h-4 w-4" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
        <span className="hidden sm:inline">{open ? 'Punch out' : 'Punch in'}</span>
      </button>
    </>
  );
};

export const PortalShell = ({ access, employee, signOut, children }: {
  access: MyAccess; employee: MyEmployee; signOut: () => Promise<void>; children: ReactNode;
}) => {
  usePortalTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const sections = sectionsFor(access)
    .map((s) => ({ ...s, items: s.items.filter((i) => i.show) }))
    .filter((s) => s.items.length);
  const isActive = (to: string) => (to === '/portal' || to === '/' ? pathname === to || pathname === `${to}/` : pathname.startsWith(to));
  const unread = useNotices().data?.unread ?? 0;
  const section = sections.find((s) => s.items.some((i) => isActive(i.to)));
  const current = section?.items.find((i) => isActive(i.to));

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      {open && <div className="fixed inset-0 z-40 bg-[#0b0e17]/40 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] shrink-0 flex-col bg-gradient-to-b from-[#121d4a] via-[#0e163a] to-[#0a1029] text-white shadow-2xl shadow-black/20 transition-transform duration-300 motion-reduce:transition-none lg:visible lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? 'translate-x-0' : 'invisible -translate-x-full'}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#f1592a]/20 blur-[70px]" />
          <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-[#4f74e0]/20 blur-[80px]" />
        </div>
        <div className="relative flex items-center gap-3 px-5 pb-5 pt-6">
          <Link to="/portal" className="flex flex-1 items-center gap-2.5" aria-label="Employee Portal home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1 shadow-lg">
              <img src={icon} alt="" width={32} height={32} className="h-full w-full object-contain" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold uppercase tracking-tight">Global Chemicals</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55">Employee Portal</span>
            </span>
          </Link>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 pb-2" aria-label="Employee Portal">
          <div className="flex flex-col gap-4">
            {sections.map((s) => (
              <div key={s.label}>
                <p className="px-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/40">{s.label}</p>
                <ul className="mt-1.5 flex flex-col gap-0.5">
                  {s.items.map((i) => (
                    <li key={i.to}>
                      <NavLink
                        to={i.to}
                        end={i.to === '/portal' || i.to === '/'}
                        onClick={() => setOpen(false)}
                        className={({ isActive: on }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f1592a] ${on
                          ? 'bg-gradient-to-r from-[#f1762a] to-[#f1592a] text-white shadow-lg shadow-[#f1592a]/25'
                          : 'text-white/70 hover:bg-white/[0.07] hover:text-white'}`}
                      >
                        <i.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                        <span className="truncate">{i.label}</span>
                        {i.to === '/portal/notifications' && unread > 0 && (
                          <span className="ml-auto rounded-full bg-[#f1592a] px-1.5 text-[11px] font-bold text-white">{unread > 99 ? '99+' : unread}</span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="relative border-t border-white/10 p-3">
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f1762a] to-[#3f63c9] text-sm font-semibold">
              {(employee.full_name[0] ?? 'E').toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-semibold leading-tight">{employee.full_name}</span>
              <span className="block truncate font-mono text-[11px] leading-tight text-white/50">{employee.employee_code}</span>
            </span>
            <button type="button" onClick={() => void signOut()} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white">
              <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 bg-white/90 shadow-[0_8px_24px_-18px_rgba(16,26,58,0.35)] backdrop-blur-xl">
          <div className="flex h-[4.5rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7e9ee] bg-white text-[#223f96] shadow-sm lg:hidden">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {current && (
                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f1762a] to-[#f1592a] text-white shadow-[0_8px_18px_-8px_rgba(241,89,42,0.7)] sm:flex">
                  <current.icon className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0">
                <p className="hidden text-[12.5px] font-medium text-muted-foreground sm:block">Employee Portal{section ? ` / ${section.label}` : ''}</p>
                <p className="truncate text-lg font-bold leading-tight tracking-tight text-[#101a3a] sm:text-[1.3rem]">{current?.label ?? 'Employee Portal'}</p>
              </div>
            </div>
            <Link to="/portal/notifications" aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e7e9ee] bg-white text-[#223f96] shadow-sm hover:border-[#f1592a]/60">
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unread > 0 && <span className="absolute -right-1.5 -top-1.5 min-w-[1.25rem] rounded-full bg-red-600 px-1 text-center text-[11px] font-bold leading-5 text-white">{unread > 99 ? '99+' : unread}</span>}
            </Link>
            {can(access, 'emp.attendance.create') && <PunchControls />}
            {/* The highest role first (database order). */}
            {access.roles[0] && <span className="hidden md:inline-flex"><RoleChip role={access.roles[0]} /></span>}
          </div>
          <div aria-hidden="true" className="h-[2px] w-full bg-gradient-to-r from-[#223f96] via-[#f1592a] to-[#4f74e0]" />
        </header>
        <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl"><DatabaseNotice /><UrgentBanner />{children}</div>
        </main>
      </div>
    </div>
  );
};
