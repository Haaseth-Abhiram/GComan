import { useEffect, useState } from 'react';
import { FileText, Briefcase, Download, LayoutDashboard, Home, BarChart3, Mail, FolderOpen, Globe, Search, Languages, Users, ClipboardList, UserPlus, NotebookPen, ShieldCheck, Send, KeyRound, UserCog, CalendarClock, CalendarDays, Settings } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import gcLogo from '@/assets/gc-icon.webp';
import { useMyAccess } from '@/portal/lib/useMyAccess';
import { can } from '@/portal/lib/access';

interface NewCounts {
  contacts: number;
  jobs: number;
  downloads: number;
  newsletter: number;
}

// Admin-side modules of the Proposal Engineer Tracker (see ProposalTrackerAdmin.tsx).
const TRACKER = '/admin/proposal-tracker';
const trackerItems = [
  { title: 'Tracker Dashboard',   url: TRACKER,                       icon: LayoutDashboard },
  { title: 'Engineers',           url: `${TRACKER}/engineers`,        icon: Users },
  { title: 'RFQ Register',        url: `${TRACKER}/rfqs`,             icon: ClipboardList },
  { title: 'Engineer Assignment', url: `${TRACKER}/assignment`,       icon: UserPlus },
  { title: 'Daily Updates',       url: `${TRACKER}/daily-updates`,    icon: NotebookPen },
  { title: 'Review & Approval',   url: `${TRACKER}/approvals`,        icon: ShieldCheck },
  { title: 'Proposal Submission', url: `${TRACKER}/submissions`,      icon: Send },
  { title: 'Tracker Reports',     url: `${TRACKER}/reports`,          icon: BarChart3 },
  { title: 'Permissions',         url: `${TRACKER}/permissions`,      icon: KeyRound },
];

// Employee Portal administration (see src/components/admin/EmployeesAdmin.tsx).
// Each item shows only for people whose roles give one of the listed permissions.
const peopleItems = [
  { title: 'Employees', url: '/admin/employees', icon: UserCog, perms: ['portal.employees.view'] },
  { title: 'Attendance', url: '/admin/attendance', icon: CalendarClock, perms: ['portal.attendance.view'] },
  { title: 'Leave', url: '/admin/leave', icon: CalendarDays, perms: ['portal.leave.view'] },
];
const adminItems = [
  { title: 'Settings', url: '/admin/settings', icon: Settings, perms: ['settings.users.view', 'settings.roles.view', 'settings.audit.view'] },
];

const quickLinks = [
  { title: 'View Website', url: '/', icon: Home, external: false },
  { title: 'Zoho Mail', url: 'https://mail.zoho.com', icon: Mail, external: true },
];

export function AdminSidebar() {
  const location = useLocation();
  const { data: access } = useMyAccess();
  // Website, SEO and Proposal Tracker admin pages are for Super Admins (website admins) only.
  const isSuper = !!access?.is_super_admin;
  const visible = <T extends { perms: string[] }>(items: T[]) => items.filter((i) => i.perms.some((p) => can(access, p)));
  const [counts, setCounts] = useState<NewCounts>({ contacts: 0, jobs: 0, downloads: 0, newsletter: 0 });

  useEffect(() => {
    if (!access?.admin_pages) return;  // counts only include what the person may see (database rules)
    let cancelled = false;
    const load = async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const since = sevenDaysAgo.toISOString();
      try {
        const [c, j, d, n] = await Promise.all([
          supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).gte('created_at', since),
          supabase.from('job_applications').select('*', { count: 'exact', head: true }).gte('created_at', since),
          supabase.from('download_leads').select('*', { count: 'exact', head: true }).gte('created_at', since),
          supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).gte('subscribed_at', since),
        ]);
        if (!cancelled) {
          setCounts({
            contacts: c.count || 0,
            jobs: j.count || 0,
            downloads: d.count || 0,
            newsletter: n.count || 0,
          });
        }
      } catch (e) {
        console.warn('Sidebar count fetch failed', e);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [location.pathname, access?.admin_pages]);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  // Each item shows for people with its permission; SEO pages need Super Admin
  // (they run through Super-Admin-only edge functions).
  const mainItems = [
    { title: 'Dashboard',        url: '/admin',            icon: LayoutDashboard, count: 0, perms: ['website.dashboard.view'] },
    { title: 'Contact Forms',    url: '/admin/contacts',   icon: FileText,        count: counts.contacts, perms: ['website.contacts.view'] },
    { title: 'Job Applications', url: '/admin/jobs',       icon: Briefcase,       count: counts.jobs, perms: ['website.jobs.view'] },
    { title: 'Resume Folders',   url: '/admin/resumes',    icon: FolderOpen,      count: 0, perms: ['website.jobs.download'] },
    { title: 'Download Leads',   url: '/admin/downloads',  icon: Download,        count: counts.downloads, perms: ['website.downloads.view'] },
    { title: 'Newsletter',       url: '/admin/newsletter', icon: Mail,            count: counts.newsletter, perms: ['website.newsletter.view'] },
    { title: 'Search Console',   url: '/admin/search-console', icon: Search,     count: 0, perms: [] as string[] },
    { title: 'Index Coverage',   url: '/admin/ar-indexing', icon: Globe,          count: 0, perms: ['website.indexing.view'] },
    { title: 'AR vs EN SEO',     url: '/admin/seo-languages', icon: Languages,    count: 0, perms: [] as string[] },
  ].filter((i) => isSuper || i.perms.some((p) => can(access, p)));

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <div className="p-4 border-b border-border/50">
        <Link to="/admin" className="flex items-center gap-3">
          <img src={gcLogo} alt="Global Chemicals Admin" width={32} height={32} className="h-8 w-8" />
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="font-bold text-sm">Global Chemicals</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      <SidebarContent className="px-2 py-4">
        {mainItems.length > 0 && (<>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Lead Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="h-10 rounded-lg transition-all duration-200"
                    tooltip={item.count > 0 ? `${item.count} new this week` : item.title}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium flex-1">{item.title}</span>
                      {item.count > 0 && (
                        <Badge
                          variant="default"
                          className="text-[10px] px-1.5 py-0 h-4 min-w-[18px] justify-center group-data-[collapsible=icon]:hidden"
                        >
                          {item.count}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />
        </>)}

        {visible(peopleItems).length > 0 && (<>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Employee Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {visible(peopleItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(item.url)}
                    className="h-10 rounded-lg transition-all duration-200"
                    tooltip={item.title}
                  >
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

        <SidebarSeparator className="my-4" />
        </>)}

        {visible(adminItems).length > 0 && (<>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {visible(adminItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname.startsWith(item.url)}
                    className="h-10 rounded-lg transition-all duration-200"
                    tooltip={item.title}
                  >
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

        <SidebarSeparator className="my-4" />
        </>)}

        {isSuper && (<>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Proposal Tracker
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {trackerItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === TRACKER ? location.pathname === TRACKER : location.pathname.startsWith(item.url)}
                    className="h-10 rounded-lg transition-all duration-200"
                    tooltip={item.title}
                  >
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

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Analytics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10 rounded-lg transition-all duration-200">
                  <Link to="/admin" className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Website Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />
        </>)}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Quick Links
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {quickLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-lg transition-all duration-200">
                    {item.external ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    ) : (
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <Button
          variant="default"
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
          asChild
        >
          <Link to="/">
            <Home className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Back to Website</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
