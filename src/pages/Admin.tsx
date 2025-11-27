import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ContactSubmissionsTable } from '@/components/admin/ContactSubmissionsTable';
import { JobApplicationsTable } from '@/components/admin/JobApplicationsTable';
import { DownloadLeadsTable } from '@/components/admin/DownloadLeadsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Briefcase, Download, TrendingUp, Users, Eye } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    contacts: 0,
    jobs: 0,
    downloads: 0,
    recentContacts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [contacts, jobs, downloads] = await Promise.all([
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('download_leads').select('*', { count: 'exact', head: true }),
      ]);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentContacts = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      setStats({
        contacts: contacts.count || 0,
        jobs: jobs.count || 0,
        downloads: downloads.count || 0,
        recentContacts: recentContacts.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage contact submissions, job applications, and download leads
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/admin/contacts">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contacts}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.recentContacts} in last 7 days
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/jobs">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.jobs}</div>
              <p className="text-xs text-muted-foreground">Career page applications</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/downloads">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Download Leads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.downloads}</div>
              <p className="text-xs text-muted-foreground">Brochure downloads</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Performance Dashboard</CardTitle>
          <CardDescription>Monitor your website's search engine optimization metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Indexed Pages</p>
              </div>
              <p className="text-2xl font-bold">200+</p>
              <p className="text-xs text-muted-foreground">Product pages with SEO data</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Target Keywords</p>
              </div>
              <p className="text-2xl font-bold">2000+</p>
              <p className="text-xs text-muted-foreground">Oman-targeted search phrases</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Lead Conversion</p>
              </div>
              <p className="text-2xl font-bold">
                {stats.downloads > 0 ? ((stats.contacts / stats.downloads) * 100).toFixed(1) : '0'}%
              </p>
              <p className="text-xs text-muted-foreground">Contact to download ratio</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Content Quality</p>
              </div>
              <p className="text-2xl font-bold">High</p>
              <p className="text-xs text-muted-foreground">150-250 words per product</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">SEO Recommendations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ All products have comprehensive descriptions with Oman keywords</li>
              <li>✓ CAS numbers added for chemical product identification</li>
              <li>✓ Local SEO targeting Muscat, Sohar, Duqm, Salalah, Rusayl</li>
              <li>⚠️ Consider enabling server-side rendering for better Google indexing</li>
              <li>⚠️ Monitor Google Search Console for ranking improvements</li>
            </ul>
          </div>
        </CardContent>
      </Card>
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
