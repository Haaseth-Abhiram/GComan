import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ContactSubmissionsTable } from '@/components/admin/ContactSubmissionsTable';
import { JobApplicationsTable } from '@/components/admin/JobApplicationsTable';
import { DownloadLeadsTable } from '@/components/admin/DownloadLeadsTable';
import { ResumesFolderBrowser } from '@/components/admin/ResumesFolderBrowser';
import { AnalyticsDialog } from '@/components/admin/AnalyticsDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, FileText, Briefcase, Download, TrendingUp, Users, Eye, 
  ArrowUpRight, ArrowDownRight, RefreshCw, Calendar, Clock, Globe,
  BarChart3, Activity, MousePointerClick, Timer, ExternalLink
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

interface DailyData {
  date: string;
  visitors: number;
  pageviews: number;
  bounceRate: number;
}

interface Stats {
  contacts: number;
  jobs: number;
  downloads: number;
  recentContacts: number;
  recentJobs: number;
  recentDownloads: number;
  categoryData: Array<{ name: string; value: number; color: string }>;
}

interface AnalyticsData {
  totalVisitors: number;
  totalPageviews: number;
  avgBounceRate: number;
  avgPagesPerVisit: number;
  dailyData: DailyData[];
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    contacts: 0,
    jobs: 0,
    downloads: 0,
    recentContacts: 0,
    recentJobs: 0,
    recentDownloads: 0,
    categoryData: [],
  });
  
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisitors: 0,
    totalPageviews: 0,
    avgBounceRate: 0,
    avgPagesPerVisit: 0,
    dailyData: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [analyticsDialogType, setAnalyticsDialogType] = useState<'visitors' | 'pageviews' | 'bounce' | 'conversion'>('visitors');

  const openAnalyticsDialog = (type: 'visitors' | 'pageviews' | 'bounce' | 'conversion') => {
    setAnalyticsDialogType(type);
    setAnalyticsDialogOpen(true);
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [
        contactsTotal,
        jobsTotal,
        downloadsTotal,
        recentContactsData,
        recentJobsData,
        recentDownloadsData
      ] = await Promise.all([
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('download_leads').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('job_applications')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('download_leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString()),
      ]);

      const categoryData = [
        { name: 'Contact Forms', value: contactsTotal.count || 0, color: 'hsl(221, 83%, 53%)' },
        { name: 'Job Applications', value: jobsTotal.count || 0, color: 'hsl(142, 71%, 45%)' },
        { name: 'Downloads', value: downloadsTotal.count || 0, color: 'hsl(262, 83%, 58%)' },
      ];

      setStats({
        contacts: contactsTotal.count || 0,
        jobs: jobsTotal.count || 0,
        downloads: downloadsTotal.count || 0,
        recentContacts: recentContactsData.count || 0,
        recentJobs: recentJobsData.count || 0,
        recentDownloads: recentDownloadsData.count || 0,
        categoryData,
      });

      // Fetch live analytics from database
      const { data: analyticsSnapshot } = await supabase
        .from('site_analytics_snapshots')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (analyticsSnapshot) {
        const dailyData: DailyData[] = (analyticsSnapshot.daily_data as any[]).map((d: any) => ({
          date: d.date,
          visitors: d.visitors,
          pageviews: d.pageviews,
          bounceRate: d.bounceRate,
        }));

        setAnalytics({
          totalVisitors: analyticsSnapshot.total_visitors,
          totalPageviews: analyticsSnapshot.total_pageviews,
          avgBounceRate: Number(analyticsSnapshot.avg_bounce_rate),
          avgPagesPerVisit: Number(analyticsSnapshot.avg_pages_per_visit),
          dailyData,
        });
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalLeads = stats.contacts + stats.jobs + stats.downloads;
  const conversionRate = analytics.totalVisitors > 0 
    ? ((totalLeads / analytics.totalVisitors) * 100).toFixed(1) 
    : '0';

  const recentTotal = stats.recentContacts + stats.recentJobs + stats.recentDownloads;

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3" />
            Last updated: {format(lastUpdated, 'MMM d, yyyy h:mm a')}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchStats}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Primary Stats - Website Analytics (Clickable) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={() => openAnalyticsDialog('visitors')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs flex items-center gap-1">
                Last 30 days
                <ExternalLink className="h-2.5 w-2.5" />
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
            <p className="text-3xl font-bold mt-1">{analytics.totalVisitors.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12.5% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={() => openAnalyticsDialog('pageviews')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-purple-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs flex items-center gap-1">
                Last 30 days
                <ExternalLink className="h-2.5 w-2.5" />
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Page Views</p>
            <p className="text-3xl font-bold mt-1">{analytics.totalPageviews.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>{analytics.avgPagesPerVisit} pages/visit</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={() => openAnalyticsDialog('bounce')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-amber-500/10 rounded-lg">
                <MousePointerClick className="h-5 w-5 text-amber-600" />
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs flex items-center gap-1">
                Avg Rate
                <ExternalLink className="h-2.5 w-2.5" />
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
            <p className="text-3xl font-bold mt-1">{analytics.avgBounceRate}%</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
              <ArrowDownRight className="h-3 w-3" />
              <span>-5% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
          onClick={() => openAnalyticsDialog('conversion')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs flex items-center gap-1">
                All Time
                <ExternalLink className="h-2.5 w-2.5" />
              </Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
            <p className="text-3xl font-bold mt-1">{conversionRate}%</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>{totalLeads} leads from {analytics.totalVisitors} visitors</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Deep Dive Dialog */}
      <AnalyticsDialog 
        open={analyticsDialogOpen}
        onOpenChange={setAnalyticsDialogOpen}
        type={analyticsDialogType}
        analyticsData={analytics}
        totalLeads={totalLeads}
      />

      {/* Lead Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {}}>
          <Link to="/admin/contacts" className="block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Forms</p>
                    <p className="text-2xl font-bold">{stats.contacts}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    +{stats.recentContacts} this week
                  </Badge>
                </div>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalLeads > 0 ? (stats.contacts / totalLeads) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/admin/jobs" className="block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Job Applications</p>
                    <p className="text-2xl font-bold">{stats.jobs}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    +{stats.recentJobs} this week
                  </Badge>
                </div>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalLeads > 0 ? (stats.jobs / totalLeads) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link to="/admin/downloads" className="block">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500 rounded-xl">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Download Leads</p>
                    <p className="text-2xl font-bold">{stats.downloads}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    +{stats.recentDownloads} this week
                  </Badge>
                </div>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalLeads > 0 ? (stats.downloads / totalLeads) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Traffic Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Website Traffic
                </CardTitle>
                <CardDescription>Daily visitors and pageviews (Last 30 days)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={analytics.dailyData}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(value) => format(parseISO(value), 'MMM d')}
                  tick={{ fontSize: 11 }}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelFormatter={(value) => format(parseISO(value as string), 'MMMM d, yyyy')}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="hsl(221, 83%, 53%)" 
                  fillOpacity={1} 
                  fill="url(#colorVisitors)"
                  strokeWidth={2}
                  name="Visitors"
                />
                <Area 
                  type="monotone" 
                  dataKey="pageviews" 
                  stroke="hsl(262, 83%, 58%)" 
                  fillOpacity={1} 
                  fill="url(#colorPageviews)"
                  strokeWidth={2}
                  name="Page Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Lead Distribution
            </CardTitle>
            <CardDescription>Breakdown by submission type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {stats.categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate to specific sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link to="/admin/contacts">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Contact Forms</p>
                    <p className="text-xs text-muted-foreground">{stats.contacts} total submissions</p>
                  </div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link to="/admin/jobs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Briefcase className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Job Applications</p>
                    <p className="text-xs text-muted-foreground">{stats.jobs} total applications</p>
                  </div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link to="/admin/downloads">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Download className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Download Leads</p>
                    <p className="text-xs text-muted-foreground">{stats.downloads} total downloads</p>
                  </div>
                </div>
              </Link>
            </Button>
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
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
        noIndex={true}
      />
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-muted/30">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 border-b bg-background flex items-center px-4 sticky top-0 z-10">
              <SidebarTrigger />
              <div className="ml-4 flex items-center gap-3">
                <h2 className="text-base font-semibold">Admin Dashboard</h2>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  <Globe className="h-3 w-3 mr-1" />
                  gcoman.com
                </Badge>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <Routes>
                <Route path="/" element={<AdminOverview />} />
                <Route path="/contacts" element={<ContactSubmissionsTable />} />
                <Route path="/jobs" element={<JobApplicationsTable />} />
                <Route path="/resumes" element={<ResumesFolderBrowser />} />
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