import { FileText, Briefcase, Download, LayoutDashboard, ExternalLink, Home } from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import gcLogo from '@/assets/gc-icon.png';

const items = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Contact Forms', url: '/admin/contacts', icon: FileText },
  { title: 'Job Applications', url: '/admin/jobs', icon: Briefcase },
  { title: 'Download Leads', url: '/admin/downloads', icon: Download },
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
          <img src={gcLogo} alt="GC" className="h-8 w-8" />
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="font-bold text-sm">Global Chemicals</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>
      
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
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
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <Button 
          variant="outline" 
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