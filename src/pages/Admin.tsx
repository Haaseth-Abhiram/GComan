import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ContactSubmissionsTable } from '@/components/admin/ContactSubmissionsTable';
import { JobApplicationsTable } from '@/components/admin/JobApplicationsTable';
import { DownloadLeadsTable } from '@/components/admin/DownloadLeadsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Briefcase, Download } from 'lucide-react';
import { SEO } from '@/components/SEO';

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage contact submissions, job applications, and download leads
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View All</div>
            <p className="text-xs text-muted-foreground">Contact form submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View All</div>
            <p className="text-xs text-muted-foreground">Career page applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Download Leads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View All</div>
            <p className="text-xs text-muted-foreground">Brochure downloads</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <SEO
        title="Admin Dashboard | Global Chemicals LLC"
        description="Admin dashboard for managing Global Chemicals website"
      />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-16 border-b flex items-center px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger />
              <div className="ml-4 flex items-center gap-2">
                <h2 className="text-lg font-semibold">Global Chemicals Admin</h2>
              </div>
            </header>
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/" element={<AdminOverview />} />
                <Route path="/contacts" element={<ContactSubmissionsTable />} />
                <Route path="/jobs" element={<JobApplicationsTable />} />
                <Route path="/downloads" element={<DownloadLeadsTable />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Admin;
