import { useEffect, useState } from 'react';
import { FileText, Briefcase, Download, LayoutDashboard, Home, BarChart3, Mail, FolderOpen } from 'lucide-react';
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

interface NewCounts {
  contacts: number;
  jobs: number;
  downloads: number;
  newsletter: number;
}

const quickLinks = [
  { title: 'View Website', url: '/', icon: Home, external: false },
  { title: 'Zoho Mail', url: 'https://mail.zoho.com', icon: Mail, external: true },
];

export function AdminSidebar() {
  const location = useLocation();
  const [counts, setCounts] = useState<NewCounts>({ contacts: 0, jobs: 0, downloads: 0, newsletter: 0 });

  useEffect(() => {
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
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const mainItems = [
    { title: 'Dashboard',        url: '/admin',            icon: LayoutDashboard, count: 0 },
    { title: 'Contact Forms',    url: '/admin/contacts',   icon: FileText,        count: counts.contacts },
    { title: 'Job Applications', url: '/admin/jobs',       icon: Briefcase,       count: counts.jobs },
    { title: 'Resume Folders',   url: '/admin/resumes',    icon: FolderOpen,      count: 0 },
    { title: 'Download Leads',   url: '/admin/downloads',  icon: Download,        count: counts.downloads },
    { title: 'Newsletter',       url: '/admin/newsletter', icon: Mail,            count: counts.newsletter },
  ];

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
