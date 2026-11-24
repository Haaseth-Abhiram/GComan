import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, UserPlus, FileText, ListChecks, PhoneCall, FolderOpen, ShieldCheck, Send, BarChart3, KeyRound, Users, NotebookPen,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useActor } from '@/proposal-tracker/components/tracker/common';
import { can } from '@/proposal-tracker/lib/permissions';
import gcLogo from '@/assets/gc-icon.webp';

const items = [
  { title: 'Dashboard', url: '/proposal-tracker', icon: LayoutDashboard },
  { title: 'Engineers', url: '/proposal-tracker/engineers', icon: Users, need: 'rfq.viewAll' as const },
  { title: 'RFQ Register', url: '/proposal-tracker/rfqs', icon: ClipboardList },
  { title: 'Engineer Assignment', url: '/proposal-tracker/assignment', icon: UserPlus, need: 'rfq.assign' as const },
  { title: 'My Proposals', url: '/proposal-tracker/my-proposals', icon: FileText, engineerOnly: true },
  { title: 'Task Tracker', url: '/proposal-tracker/tasks', icon: ListChecks },
  { title: 'Daily Updates', url: '/proposal-tracker/daily-updates', icon: NotebookPen },
  { title: 'Follow-ups', url: '/proposal-tracker/followups', icon: PhoneCall },
  { title: 'Document Management', url: '/proposal-tracker/documents', icon: FolderOpen },
  { title: 'Review & Approval', url: '/proposal-tracker/approvals', icon: ShieldCheck },
  { title: 'Proposal Submission', url: '/proposal-tracker/submissions', icon: Send, need: 'proposal.submit' as const },
  { title: 'Reports', url: '/proposal-tracker/reports', icon: BarChart3, need: 'report.view' as const },
  { title: 'Permissions', url: '/proposal-tracker/permissions', icon: KeyRound, need: 'permissions.manage' as const },
];

export function ProposalTrackerSidebar() {
  const { pathname } = useLocation();
  const actor = useActor();
  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <div className="p-4 border-b border-border/50">
        <Link to="/proposal-tracker" className="flex items-center gap-3">
          <img src={gcLogo} alt="Global Chemicals" width={32} height={32} className="h-8 w-8" />
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="font-bold text-sm">Proposal Engineer</p>
            <p className="text-xs text-muted-foreground">Tracker</p>
          </div>
        </Link>
      </div>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.filter((i) => (!i.need || can(actor, i.need)) && !('engineerOnly' in i && actor.role !== 'engineer')).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="h-10 rounded-lg transition-all duration-200 hover:bg-primary/10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-semibold data-[active=true]:shadow-sm data-[active=true]:hover:bg-primary" tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium flex-1">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
