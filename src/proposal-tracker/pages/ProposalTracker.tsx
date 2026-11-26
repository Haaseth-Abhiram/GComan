import { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { Bell, ChevronDown, LogOut, RotateCcw } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ProposalTrackerSidebar } from '@/proposal-tracker/components/shell/ProposalTrackerSidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { ROLE_LABEL, visibleRfqs } from '@/proposal-tracker/lib/permissions';
import { resetDemoData, runDailyDeadlineAlerts, useDb } from '@/proposal-tracker/lib/db';
import { PageHeader, daysUntil, useActor } from '@/proposal-tracker/components/tracker/common';
import { can } from '@/proposal-tracker/lib/permissions';
import { BackToTop, useScrolled } from '@/proposal-tracker/components/tracker/motion';
import Dashboard from '@/proposal-tracker/pages/tracker/Dashboard';
import RfqRegister from '@/proposal-tracker/pages/tracker/RfqRegister';
import Assignment from '@/proposal-tracker/pages/tracker/Assignment';
import MyProposals from '@/proposal-tracker/pages/tracker/MyProposals';
import Tasks from '@/proposal-tracker/pages/tracker/Tasks';
import Followups from '@/proposal-tracker/pages/tracker/Followups';
import Documents from '@/proposal-tracker/pages/tracker/Documents';
import Approvals from '@/proposal-tracker/pages/tracker/Approvals';
import Submissions from '@/proposal-tracker/pages/tracker/Submissions';
import Reports from '@/proposal-tracker/pages/tracker/Reports';
import Permissions from '@/proposal-tracker/pages/tracker/Permissions';
import EngineerDashboard from '@/proposal-tracker/pages/tracker/EngineerDashboard';
import Engineers from '@/proposal-tracker/pages/tracker/Engineers';
import EngineerDetail from '@/proposal-tracker/pages/tracker/EngineerDetail';
import DailyUpdates from '@/proposal-tracker/pages/tracker/DailyUpdates';
import { useNotices } from '@/proposal-tracker/lib/notifications';

const ProposalTracker = () => {
  const { user, signOut } = useAuth();
  const db = useDb();
  const actor = useActor();
  const { pathname } = useLocation();
  const scrolled = useScrolled();
  const name = user!.name;
  const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  useEffect(() => { document.title = 'Proposal Engineer Tracker (prototype)'; }, []);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]); // new page starts at the top

  // Notifications are derived from the signed-in user's own data (see lib/notifications.ts).
  const notifications = useNotices(user!.id);
  const dbAlerts = useDb();
  // Daily deadline-alert emails: once per proposal per day while the app is open (prototype stand-in for a scheduled job).
  useEffect(() => { runDailyDeadlineAlerts(); }, [dbAlerts.rfqs]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <ProposalTrackerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className={`min-h-16 border-b flex items-center gap-3 px-4 sticky top-0 z-10 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur shadow-md' : 'bg-background'}`}>
            <SidebarTrigger />
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold leading-tight truncate">Proposal Engineer Tracker</h1>
              <p className="text-xs text-muted-foreground truncate">Welcome, {name} · {format(new Date(), 'EEEE, d MMMM yyyy')}</p>
            </div>
            <Badge variant="outline" className="hidden md:inline-flex">{ROLE_LABEL[user!.role]}</Badge>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <p className="text-sm font-semibold mb-2">Notifications</p>
                {notifications.length === 0 && <p className="text-sm text-muted-foreground">You're all caught up.</p>}
                <ul className="space-y-2">
                  {notifications.map((n, i) => (
                    <li key={i} className="text-sm border-b last:border-0 pb-2 last:pb-0">
                      {n.text}
                      <span className="block text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.at.length > 10 ? n.at : `${n.at}T00:00:00`), { addSuffix: true })}</span>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2" aria-label="Profile menu">
                  <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{initials}</AvatarFallback></Avatar>
                  <ChevronDown className="h-4 w-4 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium truncate">{name}</p>
                  <p className="text-xs font-normal text-muted-foreground truncate">{user!.email}</p>
                  <p className="text-xs font-normal text-muted-foreground">{ROLE_LABEL[user!.role]}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {can(actor, 'permissions.manage') && <DropdownMenuItem onClick={() => resetDemoData(actor)} className="cursor-pointer"><RotateCcw className="h-4 w-4 mr-2" />Reset demo data</DropdownMenuItem>}
                <DropdownMenuItem onClick={() => void signOut()} className="cursor-pointer"><LogOut className="h-4 w-4 mr-2" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 mb-6">
              Prototype — your login is real, but proposal data is stored in this browser only (not the database yet).
            </div>
            <div key={pathname} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Routes>
              <Route path="/" element={<><PageHeader title="Dashboard" />{can(actor, 'rfq.viewAll') ? <Dashboard /> : <EngineerDashboard engineerId={user!.id} />}</>} />
              <Route path="/engineers" element={<Engineers />} />
              <Route path="/engineers/:id" element={<EngineerDetail />} />
              <Route path="/daily-updates" element={<DailyUpdates />} />
              <Route path="/rfqs" element={<RfqRegister />} />
              <Route path="/assignment" element={<Assignment />} />
              <Route path="/my-proposals" element={<MyProposals />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/followups" element={<Followups />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="*" element={<Navigate to="/proposal-tracker" replace />} />
            </Routes>
            </div>
          </main>
          <BackToTop />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProposalTracker;
