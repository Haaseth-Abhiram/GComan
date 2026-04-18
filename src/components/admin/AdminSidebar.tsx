import { FileText, Briefcase, Download, LayoutDashboard, Home, BarChart3, Settings, HelpCircle, Mail, FolderOpen } from 'lucide-react';
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
import gcLogo from '@/assets/gc-icon.png';

const mainItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Contact Forms', url: '/admin/contacts', icon: FileText, badge: 'Email Status' },
  { title: 'Job Applications', url: '/admin/jobs', icon: Briefcase },
  { title: 'Resume Folders', url: '/admin/resumes', icon: FolderOpen, badge: 'HR' },
  { title: 'Download Leads', url: '/admin/downloads', icon: Download },
];

const analyticsItems = [
  { title: 'Website Analytics', url: '/admin', icon: BarChart3, hint: 'View on Dashboard' },
];

const quickLinks = [
  { title: 'View Website', url: '/', icon: Home, external: false },
  { title: 'Zoho Mail', url: 'https://mail.zoho.com', icon: Mail, external: true },
];

export function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

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
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 group-data-[collapsible=icon]:hidden">
                          {item.badge}
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
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={false}
                    className="h-10 rounded-lg transition-all duration-200"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
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
            Quick Links
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {quickLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="h-10 rounded-lg transition-all duration-200"
                  >
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