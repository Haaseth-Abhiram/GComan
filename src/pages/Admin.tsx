import { Suspense, useEffect, useState } from 'react';
import { lazyRetry } from '@/lib/lazyRetry';

// Lazy: keeps the tracker prototype out of the main admin bundle.
const ProposalTrackerAdmin = lazyRetry(() => import('@/components/admin/ProposalTrackerAdmin'));
const EmployeesAdmin = lazyRetry(() => import('@/components/admin/EmployeesAdmin'));
const AttendanceAdmin = lazyRetry(() => import('@/components/admin/AttendanceAdmin'));
const LeaveAdmin = lazyRetry(() => import('@/components/admin/LeaveAdmin'));
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ContactSubmissionsTable } from '@/components/admin/ContactSubmissionsTable';
import { DownloadLeadsTable } from '@/components/admin/DownloadLeadsTable';
import { ResumesWorkspace } from '@/components/admin/ResumesWorkspace';
import { NewsletterSubscribersTable } from '@/components/admin/NewsletterSubscribersTable';
import { ActivityFeed } from '@/components/admin/ActivityFeed';
import { ArabicIndexingMonitor } from '@/components/admin/ArabicIndexingMonitor';
import { SearchConsoleDashboard } from '@/components/admin/SearchConsoleDashboard';
import { LanguageSeoComparison } from '@/components/admin/LanguageSeoComparison';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Loader2, FileText, Briefcase, Download, TrendingUp, Users, Eye, 
  RefreshCw, Calendar, Clock, Globe,
  BarChart3, Activity, MousePointerClick
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface Stats {
  contacts: number;
  jobs: number;
  downloads: number;
  recentContacts: number;
  recentJobs: number;
  recentDownloads: number;
  categoryData: Array<{ name: string; value: number; color: string }>;
}

/**
 * Real Google Search Console figures, via the `search-console` edge function.
 *
 * These replaced a synthetic analytics layer: `refresh-analytics` derived
 * "Total Visitors" from `submissions * 2.5`, computed bounce rate as
 * `45 + ((i * 17) % 25)`, and hardcoded the traffic-source split and device
 * donut — trend arrows included. Those numbers were plausible enough to be
 * read as measurements and acted on, so the cards now show figures Google
 * actually reports. The submission counts below them were always real and are
 * unchanged.
 *
 * Lovable Analytics (More -> Analytics) separately measures real visits and
 * referrers; it has no public API, so it stays a manual read for now.
 */
interface GscTotals {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}
interface GscSeriesPoint {
  date: string;
  clicks: number;
  impressions: number;
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
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [gsc, setGsc] = useState<GscTotals | null>(null);
  const [gscSeries, setGscSeries] = useState<GscSeriesPoint[]>([]);
  const [gscError, setGscError] = useState<string | null>(null);

  /** Real Search Console figures for the headline cards and traffic chart. */
  const fetchGsc = async () => {
    try {
      const { data: res, error } = await supabase.functions.invoke('search-console', {
        body: { days: 28, rowLimit: 50 },
      });
      if (error) throw error;
      if ((res as any)?.error) throw new Error((res as any).details || (res as any).error);
      const payload = res as { totals?: GscTotals; byDate?: Array<{ keys: string[]; clicks: number; impressions: number }> };
      setGsc(payload?.totals ?? null);
      setGscSeries(
        (payload?.byDate ?? [])
          .slice()
          .sort((a, b) => a.keys[0].localeCompare(b.keys[0]))
          .map((r) => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions })),
      );
      setGscError(null);
    } catch (err: any) {
      // Surfaced in the UI rather than silently falling back to a made-up
      // number — an empty card is honest, an invented one is not.
      setGsc(null);
      setGscSeries([]);
      setGscError(err?.message ?? 'Search Console data unavailable');
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    void fetchGsc();
    try {
      const now = new Date();
      const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date(now); sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const [
        contactsTotal,
        jobsTotal,
        downloadsTotal,
        recentContactsData,
        recentJobsData,
        recentDownloadsData,
        last30Contacts,
        last30Jobs,
        last30Downloads,
        prev30Contacts,
        prev30Jobs,
        prev30Downloads,
      ] = await Promise.all([
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }),
        supabase.from('download_leads').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('download_leads').select('*', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('download_leads').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo.toISOString()).lt('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo.toISOString()).lt('created_at', thirtyDaysAgo.toISOString()),
        supabase.from('download_leads').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo.toISOString()).lt('created_at', thirtyDaysAgo.toISOString()),
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

      // The synthetic `refresh-analytics` snapshot that used to populate the
      // headline cards is deliberately no longer read — it invented visitors,
      // bounce rate, traffic sources and devices. Real figures now come from
      // Search Console via fetchGsc(); lead counts above are real rows.

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

      {/* Primary stats — Google Search Console (real) + real submission counts */}
      {gscError && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Search Console data unavailable: {gscError}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Search Console · 28d</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Search Clicks</p>
            <p className="text-3xl font-bold mt-1">{gsc ? gsc.clicks.toLocaleString() : '—'}</p>
            <p className="mt-2 text-xs text-muted-foreground">Visitors Google sent to the site</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-purple-500/10 rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">Search Console · 28d</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Impressions</p>
            <p className="text-3xl font-bold mt-1">{gsc ? gsc.impressions.toLocaleString() : '—'}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {gsc ? `${(gsc.ctr * 100).toFixed(1)}% click-through rate` : 'Times a page was shown'}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-amber-500/10 rounded-lg">
                <MousePointerClick className="h-5 w-5 text-amber-600" />
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">Search Console · 28d</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Average Position</p>
            <p className="text-3xl font-bold mt-1">{gsc ? gsc.position.toFixed(1) : '—'}</p>
            <p className="mt-2 text-xs text-muted-foreground">Lower is better</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">All time</Badge>
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
            <p className="text-3xl font-bold mt-1">{totalLeads.toLocaleString()}</p>
            <p className="mt-2 text-xs text-muted-foreground">{recentTotal} in the last 7 days</p>
          </CardContent>
        </Card>
      </div>

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
                  Search Traffic
                </CardTitle>
                <CardDescription>Daily clicks and impressions from Google Search (last 28 days)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={gscSeries}>
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
                  dataKey="clicks" 
                  stroke="hsl(221, 83%, 53%)" 
                  fillOpacity={1} 
                  fill="url(#colorVisitors)"
                  strokeWidth={2}
                  name="Clicks"
                />
                <Area 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="hsl(262, 83%, 58%)" 
                  fillOpacity={1} 
                  fill="url(#colorPageviews)"
                  strokeWidth={2}
                  name="Impressions"
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

      {/* Recent Activity */}
      <ActivityFeed />

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
                <Route path="/jobs" element={<ResumesWorkspace />} />
                <Route path="/resumes" element={<ResumesWorkspace />} />
                <Route path="/downloads" element={<DownloadLeadsTable />} />
                <Route path="/newsletter" element={<NewsletterSubscribersTable />} />
                <Route path="/ar-indexing" element={<ArabicIndexingMonitor />} />
                <Route path="/search-console" element={<SearchConsoleDashboard />} />
                <Route path="/seo-languages" element={<LanguageSeoComparison />} />
                <Route
                  path="/proposal-tracker/*"
                  element={
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <ProposalTrackerAdmin />
                    </Suspense>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <EmployeesAdmin />
                    </Suspense>
                  }
                />
                <Route
                  path="/attendance"
                  element={
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <AttendanceAdmin />
                    </Suspense>
                  }
                />
                <Route
                  path="/leave"
                  element={
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <LeaveAdmin />
                    </Suspense>
                  }
                />


              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Admin;