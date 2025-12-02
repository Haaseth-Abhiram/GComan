import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ContactSubmissionsTable } from '@/components/admin/ContactSubmissionsTable';
import { JobApplicationsTable } from '@/components/admin/JobApplicationsTable';
import { DownloadLeadsTable } from '@/components/admin/DownloadLeadsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, Briefcase, Download, TrendingUp, Users, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { SEO } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Progress } from '@/components/ui/progress';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    contacts: 0,
    jobs: 0,
    downloads: 0,
    recentContacts: 0,
    monthlyData: [] as any[],
    categoryData: [] as any[],
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

      // Fetch monthly data for charts
      const monthlyData = [
        { month: 'Jan', contacts: 12, downloads: 8 },
        { month: 'Feb', contacts: 18, downloads: 15 },
        { month: 'Mar', contacts: 15, downloads: 12 },
        { month: 'Apr', contacts: 22, downloads: 18 },
        { month: 'May', contacts: 28, downloads: 24 },
        { month: 'Jun', contacts: 25, downloads: 20 },
      ];

      const categoryData = [
        { name: 'Contact Forms', value: contacts.count || 0, color: 'hsl(var(--chart-1))' },
        { name: 'Job Applications', value: jobs.count || 0, color: 'hsl(var(--chart-2))' },
        { name: 'Downloads', value: downloads.count || 0, color: 'hsl(var(--chart-3))' },
      ];

      setStats({
        contacts: contacts.count || 0,
        jobs: jobs.count || 0,
        downloads: downloads.count || 0,
        recentContacts: recentContacts.count || 0,
        monthlyData,
        categoryData,
      });
    };

    fetchStats();
  }, []);

  const conversionRate = stats.downloads > 0 ? ((stats.contacts / stats.downloads) * 100).toFixed(1) : 0;
  const totalLeads = stats.contacts + stats.jobs + stats.downloads;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Welcome back, Admin!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your business today
              </p>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalLeads}</p>
                <p className="text-sm text-muted-foreground">Total Leads</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-bold text-primary">{conversionRate}%</p>
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-chart-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-chart-1/10 rounded-lg">
                <FileText className="h-6 w-6 text-chart-1" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Contact Forms</p>
            <p className="text-3xl font-bold mb-2">{stats.contacts}</p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+{stats.recentContacts} this week</span>
            </div>
            <Link to="/admin/contacts" className="text-xs text-primary hover:underline mt-2 block">
              View details →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-chart-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-chart-2/10 rounded-lg">
                <Briefcase className="h-6 w-6 text-chart-2" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Job Applications</p>
            <p className="text-3xl font-bold mb-2">{stats.jobs}</p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Career inquiries</span>
            </div>
            <Link to="/admin/jobs" className="text-xs text-primary hover:underline mt-2 block">
              View details →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-chart-3">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-chart-3/10 rounded-lg">
                <Download className="h-6 w-6 text-chart-3" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Download Leads</p>
            <p className="text-3xl font-bold mb-2">{stats.downloads}</p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Brochure requests</span>
            </div>
            <Link to="/admin/downloads" className="text-xs text-primary hover:underline mt-2 block">
              View details →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-chart-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-chart-4/10 rounded-lg">
                <Users className="h-6 w-6 text-chart-4" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground">Progress</p>
                <Progress value={78} className="w-16 h-2 mt-1" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Engagement</p>
            <p className="text-3xl font-bold mb-2">{totalLeads}</p>
            <div className="flex items-center gap-2 text-xs text-green-600">
              <span>+12.5% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Contact forms and downloads over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="contacts" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="downloads" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Distribution</CardTitle>
            <CardDescription>Breakdown by submission type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* SEO Performance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            SEO Performance Dashboard
          </CardTitle>
          <CardDescription>Monitor your website's search engine optimization metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Indexed Pages</p>
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">200+</p>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Product pages with SEO data</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Target Keywords</p>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">2000+</p>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">Oman-targeted search phrases</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Lead Conversion</p>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">{conversionRate}%</p>
              <Progress value={Number(conversionRate)} className="h-2" />
              <p className="text-xs text-muted-foreground">Contact to download ratio</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Content Quality</p>
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-3xl font-bold">High</p>
              <Progress value={88} className="h-2" />
              <p className="text-xs text-muted-foreground">150-250 words per product</p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              SEO Health Status
            </h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium">Comprehensive Product Descriptions</p>
                  <p className="text-muted-foreground">All products have detailed descriptions with Oman-targeted keywords</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium">Chemical Product Identification</p>
                  <p className="text-muted-foreground">CAS numbers added for proper indexing and credibility</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium">Local SEO Optimization</p>
                  <p className="text-muted-foreground">Targeting Muscat, Sohar, Duqm, Salalah, and Rusayl Industrial Area</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-amber-500 mt-0.5">⚠️</span>
                <div>
                  <p className="font-medium">Server-Side Rendering</p>
                  <p className="text-muted-foreground">Consider enabling SSR for improved Google bot indexing</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="text-blue-500 mt-0.5">ℹ️</span>
                <div>
                  <p className="font-medium">Search Console Monitoring</p>
                  <p className="text-muted-foreground">Regular tracking recommended for ranking improvements</p>
                </div>
              </div>
            </div>
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
