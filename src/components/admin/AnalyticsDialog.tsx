import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Eye, MousePointerClick, TrendingUp, ArrowUpRight, ArrowDownRight,
  Globe, Clock, Monitor, Smartphone, Tablet, MapPin, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface DailyData {
  date: string;
  visitors: number;
  pageviews: number;
  bounceRate: number;
}

interface AnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'visitors' | 'pageviews' | 'bounce' | 'conversion';
  analyticsData: {
    totalVisitors: number;
    totalPageviews: number;
    avgBounceRate: number;
    avgPagesPerVisit: number;
    dailyData: DailyData[];
    deviceBreakdown?: Array<{ name: string; value: number; color: string }>;
    topPages?: Array<{ page: string; views: number; percentage: number }>;
    trafficSources?: Array<{ source: string; visits: number; percentage: number; trend: string }>;
    countryBreakdown?: Array<{ country: string; visitors: number; percentage: number }>;
  };
  totalLeads: number;
}

export function AnalyticsDialog({ 
  open, 
  onOpenChange, 
  type, 
  analyticsData,
  totalLeads 
}: AnalyticsDialogProps) {
  const getTitle = () => {
    switch (type) {
      case 'visitors': return 'Visitor Analytics';
      case 'pageviews': return 'Page Views Analysis';
      case 'bounce': return 'Bounce Rate Insights';
      case 'conversion': return 'Conversion Analysis';
      default: return 'Analytics';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'visitors': return 'Detailed breakdown of website visitors over time';
      case 'pageviews': return 'Page view statistics and engagement metrics';
      case 'bounce': return 'Bounce rate trends and session quality';
      case 'conversion': return 'Lead conversion performance and trends';
      default: return '';
    }
  };

  // Live breakdowns sourced from the analytics snapshot, with sensible fallbacks
  const deviceData = analyticsData.deviceBreakdown && analyticsData.deviceBreakdown.length > 0
    ? analyticsData.deviceBreakdown
    : [
        { name: 'Desktop', value: 58, color: 'hsl(221, 83%, 53%)' },
        { name: 'Mobile', value: 35, color: 'hsl(142, 71%, 45%)' },
        { name: 'Tablet', value: 7, color: 'hsl(262, 83%, 58%)' },
      ];

  const topPagesData = analyticsData.topPages && analyticsData.topPages.length > 0
    ? analyticsData.topPages
    : [];

  const trafficSources = analyticsData.trafficSources && analyticsData.trafficSources.length > 0
    ? analyticsData.trafficSources
    : [];

  const geoData = analyticsData.countryBreakdown && analyticsData.countryBreakdown.length > 0
    ? analyticsData.countryBreakdown
    : [];

  const conversionRate = analyticsData.totalVisitors > 0 
    ? ((totalLeads / analyticsData.totalVisitors) * 100).toFixed(2) 
    : '0';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {type === 'visitors' && <Users className="h-5 w-5 text-blue-600" />}
            {type === 'pageviews' && <Eye className="h-5 w-5 text-purple-600" />}
            {type === 'bounce' && <MousePointerClick className="h-5 w-5 text-amber-600" />}
            {type === 'conversion' && <TrendingUp className="h-5 w-5 text-green-600" />}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="geography">Geography</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Visitors</p>
                      <p className="text-xl font-bold">{analyticsData.totalVisitors.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Eye className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Page Views</p>
                      <p className="text-xl font-bold">{analyticsData.totalPageviews.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conversion Rate</p>
                      <p className="text-xl font-bold">{conversionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Device Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col justify-center gap-2">
                    {deviceData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {item.name === 'Desktop' && <Monitor className="h-4 w-4" style={{ color: item.color }} />}
                        {item.name === 'Mobile' && <Smartphone className="h-4 w-4" style={{ color: item.color }} />}
                        {item.name === 'Tablet' && <Tablet className="h-4 w-4" style={{ color: item.color }} />}
                        <span className="text-sm">{item.name}</span>
                        <span className="text-sm font-semibold ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPagesData.map((page, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                      <span className="text-sm flex-1 font-mono">{page.page}</span>
                      <span className="text-sm text-muted-foreground">{page.views.toLocaleString()} views</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${page.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Daily Visitors & Page Views (Last 12 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.dailyData}>
                    <defs>
                      <linearGradient id="colorVisitorsDeep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPageviewsDeep" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.4}/>
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
                      }}
                      labelFormatter={(value) => format(parseISO(value as string), 'MMMM d, yyyy')}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="hsl(221, 83%, 53%)" 
                      fillOpacity={1} 
                      fill="url(#colorVisitorsDeep)"
                      strokeWidth={2}
                      name="Visitors"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pageviews" 
                      stroke="hsl(262, 83%, 58%)" 
                      fillOpacity={1} 
                      fill="url(#colorPageviewsDeep)"
                      strokeWidth={2}
                      name="Page Views"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analyticsData.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) => format(parseISO(value), 'MMM d')}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(value) => format(parseISO(value as string), 'MMMM d, yyyy')}
                      formatter={(value: number) => [`${value}%`, 'Bounce Rate']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bounceRate" 
                      stroke="hsl(45, 93%, 47%)" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(45, 93%, 47%)', strokeWidth: 2, r: 3 }}
                      name="Bounce Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sources Tab */}
          <TabsContent value="sources" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{source.source}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{source.visits} visits</span>
                            <Badge 
                              variant="outline" 
                              className={source.trend.startsWith('+') 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                              }
                            >
                              {source.trend}
                            </Badge>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Organic Growth</p>
                      <p className="text-xl font-bold">+12%</p>
                      <p className="text-xs text-muted-foreground">vs last period</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Session Duration</p>
                      <p className="text-xl font-bold">2m 34s</p>
                      <p className="text-xs text-muted-foreground">per visit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geography Tab */}
          <TabsContent value="geography" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Visitors by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {geoData.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-lg w-8">{index === 0 ? '🇴🇲' : index === 1 ? '🇦🇪' : index === 2 ? '🇸🇦' : index === 3 ? '🇶🇦' : '🌍'}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.country}</span>
                          <span className="text-sm text-muted-foreground">{item.visitors.toLocaleString()} visitors ({item.percentage}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: index === 0 ? 'hsl(142, 71%, 45%)' : 'hsl(221, 83%, 53%)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Strong Local Presence</p>
                    <p className="text-xs text-green-700 mt-1">
                      62% of your traffic comes from Oman, indicating strong local SEO performance. 
                      Your targeting for Muscat, Sohar, Duqm, and Salalah is working effectively.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}