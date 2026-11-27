import { Suspense, useEffect, useState } from 'react';
import { lazyRetry } from '@/lib/lazyRetry';

// Lazy: keeps the tracker prototype out of the main admin bundle.
const ProposalTrackerAdmin = lazyRetry(() => import('@/components/admin/ProposalTrackerAdmin'));
const EmployeesAdmin = lazyRetry(() => import('@/components/admin/EmployeesAdmin'));
const AttendanceAdmin = lazyRetry(() => import('@/components/admin/AttendanceAdmin'));
const LeaveAdmin = lazyRetry(() => import('@/components/admin/LeaveAdmin'));
const SettingsAdmin = lazyRetry(() => import('@/components/admin/SettingsAdmin'));
const ReportsAdmin = lazyRetry(() => import('@/components/admin/ReportsAdmin'));
const ProjectsAdmin = lazyRetry(() => import('@/components/admin/ProjectsAdmin'));
const NotificationsAdmin = lazyRetry(() => import('@/components/admin/NotificationsAdmin'));
const TeamOverview = lazyRetry(() => import('@/portal/components/TeamOverview').then((m) => ({ default: m.TeamOverview })));

/** Shown when someone opens an admin page their roles don't allow. */
const NoAccess = () => (
  <div className="py-16 text-center text-sm text-muted-foreground">You don't have permission to open this page. Ask a Super Admin.</div>
);

/** First admin page this person may open (for people who aren't Super Admins). */
const ADMIN_PAGES: [string, string][] = [
  ['website.contacts.view', '/admin/contacts'], ['website.jobs.view', '/admin/jobs'],
  ['website.downloads.view', '/admin/downloads'], ['website.newsletter.view', '/admin/newsletter'],
  ['website.indexing.view', '/admin/ar-indexing'], ['portal.employees.view', '/admin/employees'],
  ['portal.attendance.view', '/admin/attendance'], ['portal.leave.view', '/admin/leave'],
  ['portal.reports.view', '/admin/reports'], ['portal.projects.view', '/admin/projects'],
  ['portal.notifications.create', '/admin/notifications'],
];
const firstAdminPage = (a: MyAccess | undefined) =>
  ADMIN_PAGES.find(([p]) => can(a, p))?.[1] ?? '/admin/settings';

/**
 * Dashboard for people who aren't Super Admins but may see lead counts: only
 * the lead types they can open (the full dashboard also needs Search Console,
 * which is Super Admin only).
 */
const LeadsOverview = ({ access }: { access: MyAccess | undefined }) => {
  const [counts, setCounts] = useState<Record<string, { total: number; week: number }>>({});
  const items = [
    { perm: 'website.contacts.view', table: 'contact_submissions', label: 'Contact Forms', url: '/admin/contacts', icon: FileText },
    { perm: 'website.jobs.view', table: 'job_applications', label: 'Job Applications', url: '/admin/jobs', icon: Briefcase },
    { perm: 'website.downloads.view', table: 'download_leads', label: 'Download Leads', url: '/admin/downloads', icon: Download },
  ] as const;
  const shown = items.filter((i) => can(access, i.perm));
  useEffect(() => {
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
    void Promise.all(shown.map(async (i) => {
      const [t, w] = await Promise.all([
        supabase.from(i.table).select('*', { count: 'exact', head: true }),
        supabase.from(i.table).select('*', { count: 'exact', head: true }).gte('created_at', since),
      ]);
      return [i.table, { total: t.count ?? 0, week: w.count ?? 0 }] as const;
    })).then((rows) => setCounts(Object.fromEntries(rows)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the permission set is fixed for this render
  }, [shown.length]);
  return (
    <div className="space-y-6">
      <Hero eyebrow="Admin" title="Leads overview" subtitle="New enquiries and applications your role can open" />
      {!shown.length ? <p className="text-sm text-muted-foreground">You can't open any lead pages yet.</p> : (
        <div className="grid gap-4 md:grid-cols-3">
          {shown.map((i) => (
            <Link key={i.table} to={i.url}>
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <i.icon className="h-5 w-5 text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">{i.label}</p>
                  <p className="text-3xl font-bold">{counts[i.table]?.total ?? '—'}</p>
                  <p className="text-xs text-muted-foreground">{counts[i.table]?.week ?? 0} in the last 7 days</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
import { useNavigate, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useMyAccess } from '@/portal/lib/useMyAccess';
import { can, type MyAccess } from '@/portal/lib/access';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { DatabaseNotice } from '@/portal/components/DatabaseNotice';
import { Hero, LoadingScreen } from '@/portal/theme/ui';
import { usePortalTheme } from '@/portal/theme/usePortalTheme';
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
  RefreshCw, Calendar, Clock,
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
      <Hero
        eyebrow="Admin"
        title="Dashboard Overview"
        subtitle={<span className="inline-flex items-center gap-2"><Clock className="h-3 w-3" />Last updated: {format(lastUpdated, 'MMM d, yyyy h:mm a')}</span>}
      >
        <Button size="sm" onClick={fetchStats} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </Hero>

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
  // Super Admins (website admins) see everything; anyone else whose roles give an
  // admin-area permission sees only the pages those permissions allow.
  const { data: access, isLoading } = useMyAccess();
  const isAdmin = !!access?.admin_pages;
  const isSuper = !!access?.is_super_admin;
  usePortalTheme();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) return <LoadingScreen label="Loading admin panel…" />;

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
        <div className="min-h-screen flex w-full bg-[#f6f7fb]">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminTopbar access={access} />
            <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
              <DatabaseNotice />
              <Routes>
                {/* Every page is checked against its own permission (the database checks again). */}
                <Route path="/" element={isSuper ? <AdminOverview />
                  : can(access, 'website.dashboard.view') ? <LeadsOverview access={access} />
                    : <Navigate to={firstAdminPage(access)} replace />} />
                <Route path="/contacts" element={can(access, 'website.contacts.view') ? <ContactSubmissionsTable /> : <NoAccess />} />
                <Route path="/jobs" element={can(access, 'website.jobs.view') ? <ResumesWorkspace /> : <NoAccess />} />
                <Route path="/resumes" element={can(access, 'website.jobs.view') ? <ResumesWorkspace /> : <NoAccess />} />
                <Route path="/downloads" element={can(access, 'website.downloads.view') ? <DownloadLeadsTable /> : <NoAccess />} />
                <Route path="/newsletter" element={can(access, 'website.newsletter.view') ? <NewsletterSubscribersTable /> : <NoAccess />} />
                <Route path="/ar-indexing" element={can(access, 'website.indexing.view') ? <ArabicIndexingMonitor /> : <NoAccess />} />
                {/* Search Console pages and the tracker admin run through Super-Admin-only edge functions / browser data. */}
                {isSuper && (<>
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
                </>)}
                <Route
                  path="/employee-portal"
                  element={access && can(access, 'portal.attendance.view') ? (
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <TeamOverview access={access} />
                    </Suspense>
                  ) : <NoAccess />}
                />
                <Route
                  path="/employees"
                  element={can(access, 'portal.employees.view') ? (
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <EmployeesAdmin />
                    </Suspense>
                  ) : <NoAccess />}
                />
                <Route
                  path="/attendance"
                  element={can(access, 'portal.attendance.view') ? (
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <AttendanceAdmin />
                    </Suspense>
                  ) : <NoAccess />}
                />
                <Route
                  path="/leave"
                  element={can(access, 'portal.leave.view') ? (
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <LeaveAdmin />
                    </Suspense>
                  ) : <NoAccess />}
                />
                <Route
                  path="/reports"
                  element={can(access, 'portal.reports.view') ? (
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <ReportsAdmin />
                    </Suspense>
                  ) : <NoAccess />}
                />
                <Route
                  path="/projects/*"
                  element={can(access, 'portal.projects.view') ? (
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <ProjectsAdmin />
                    </Suspense>
                  ) : <NoAccess />}
                />
                <Route
                  path="/notifications"
                  element={can(access, 'portal.notifications.create') ? (
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <NotificationsAdmin />
                    </Suspense>
                  ) : <NoAccess />}
                />
                <Route
                  path="/settings/*"
                  element={can(access, 'settings.users.view') || can(access, 'settings.roles.view') || can(access, 'settings.audit.view') ? (
                    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-primary" />}>
                      <SettingsAdmin />
                    </Suspense>
                  ) : <NoAccess />}
                />
                <Route path="*" element={<NoAccess />} />


              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Admin;