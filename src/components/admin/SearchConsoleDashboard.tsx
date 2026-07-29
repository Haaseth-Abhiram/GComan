import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, MousePointerClick, Eye, Percent, TrendingUp, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Row {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GscData {
  siteUrl: string;
  startDate: string;
  endDate: string;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  byDate: Row[];
  byQuery: Row[];
  byPage: Row[];
  byCountry: Row[];
  byDevice: Row[];
  sitemaps: any[];
}

const RANGES = [
  { label: '7 days', days: 7 },
  { label: '28 days', days: 28 },
  { label: '3 months', days: 90 },
  { label: '12 months', days: 365 },
];

export function SearchConsoleDashboard() {
  const [data, setData] = useState<GscData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(28);
  const { toast } = useToast();

  const load = useCallback(async (rangeDays: number) => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke('search-console', {
        body: { days: rangeDays, rowLimit: 50 },
      });
      if (error) throw error;
      if ((res as any)?.error) throw new Error((res as any).details || (res as any).error);
      setData(res as GscData);
    } catch (err: any) {
      toast({
        title: 'Could not load Search Console data',
        description: err?.message ?? 'unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(days); }, [load, days]);

  const t = data?.totals;
  const chart = (data?.byDate ?? [])
    .slice()
    .sort((a, b) => a.keys[0].localeCompare(b.keys[0]))
    .map((r) => ({
      date: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
    }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6" /> Google Search Console
          </h2>
          <p className="text-sm text-muted-foreground">
            {data
              ? `${data.siteUrl} · ${data.startDate} → ${data.endDate}`
              : 'Live search performance from Google.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <Button
              key={r.days}
              size="sm"
              variant={days === r.days ? 'default' : 'outline'}
              onClick={() => setDays(r.days)}
            >
              {r.label}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => load(days)} disabled={loading} aria-label="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total clicks" value={t ? t.clicks.toLocaleString() : '—'} icon={MousePointerClick} />
        <Stat label="Total impressions" value={t ? t.impressions.toLocaleString() : '—'} icon={Eye} />
        <Stat label="Average CTR" value={t ? `${(t.ctr * 100).toFixed(2)}%` : '—'} icon={Percent} />
        <Stat label="Average position" value={t ? t.position.toFixed(1) : '—'} icon={TrendingUp} />
      </div>

      <Card className="logo-gradient-border">
        <CardHeader>
          <CardTitle className="text-base">Clicks &amp; impressions</CardTitle>
          <CardDescription>Daily performance in Google Search</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : chart.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data for this period.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="gscClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gscImpr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="hsl(var(--accent-foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => format(new Date(d), 'dd MMM')}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <RTooltip
                  labelFormatter={(d) => format(new Date(d as string), 'dd MMM yyyy')}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="impressions" stroke="hsl(var(--accent-foreground))" fill="url(#gscImpr)" />
                <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fill="url(#gscClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="logo-gradient-border">
        <CardHeader>
          <CardTitle className="text-base">Breakdown</CardTitle>
          <CardDescription>Top queries, pages, countries and devices</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="queries">
            <TabsList>
              <TabsTrigger value="queries">Queries</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="countries">Countries</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="sitemaps">Sitemaps</TabsTrigger>
            </TabsList>

            <TabsContent value="queries"><RowTable rows={data?.byQuery} label="Query" loading={loading} /></TabsContent>
            <TabsContent value="pages">
              <RowTable rows={data?.byPage} label="Page" loading={loading} strip />
            </TabsContent>
            <TabsContent value="countries"><RowTable rows={data?.byCountry} label="Country" loading={loading} /></TabsContent>
            <TabsContent value="devices"><RowTable rows={data?.byDevice} label="Device" loading={loading} /></TabsContent>
            <TabsContent value="sitemaps">
              {(data?.sitemaps ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No sitemaps reported.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sitemap</TableHead>
                      <TableHead className="text-right">Submitted URLs</TableHead>
                      <TableHead className="text-right">Last downloaded</TableHead>
                      <TableHead className="text-right">Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(data?.sitemaps ?? []).map((s: any) => (
                      <TableRow key={s.path}>
                        <TableCell className="max-w-[320px] truncate">{s.path}</TableCell>
                        <TableCell className="text-right">
                          {(s.contents ?? []).reduce((n: number, c: any) => n + Number(c.submitted || 0), 0) || '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {s.lastDownloaded ? format(new Date(s.lastDownloaded), 'dd MMM yyyy') : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {Number(s.errors || 0) > 0
                            ? <Badge variant="destructive">{s.errors}</Badge>
                            : <Badge variant="secondary">0</Badge>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function RowTable({ rows, label, loading, strip }: { rows?: Row[]; label: string; loading: boolean; strip?: boolean }) {
  if (loading) return <p className="text-sm text-muted-foreground py-4">Loading…</p>;
  if (!rows || rows.length === 0) return <p className="text-sm text-muted-foreground py-4">No data for this period.</p>;
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{label}</TableHead>
            <TableHead className="text-right">Clicks</TableHead>
            <TableHead className="text-right">Impressions</TableHead>
            <TableHead className="text-right">CTR</TableHead>
            <TableHead className="text-right">Position</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.keys.join('|')}>
              <TableCell className="max-w-[360px] truncate">
                {strip ? r.keys[0].replace('https://gcoman.com', '') || '/' : r.keys[0]}
              </TableCell>
              <TableCell className="text-right">{r.clicks.toLocaleString()}</TableCell>
              <TableCell className="text-right">{r.impressions.toLocaleString()}</TableCell>
              <TableCell className="text-right">{(r.ctr * 100).toFixed(2)}%</TableCell>
              <TableCell className="text-right">{r.position.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <Card className="logo-gradient-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
