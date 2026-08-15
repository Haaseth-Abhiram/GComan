import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, CheckCircle2, Clock, AlertTriangle, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface StatusRow {
  id: string;
  url: string;
  verdict: string | null;
  coverage_state: string | null;
  is_indexed: boolean;
  last_crawl_time: string | null;
  last_checked_at: string;
  state_changed_at: string | null;
  error: string | null;
}

interface EventRow {
  id: string;
  url: string;
  from_state: string | null;
  to_state: string | null;
  became_indexed: boolean;
  acknowledged: boolean;
  created_at: string;
}

export function ArabicIndexingMonitor() {
  const [rows, setRows] = useState<StatusRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const [s, e] = await Promise.all([
      supabase.from('ar_index_status').select('*').order('is_indexed', { ascending: true }).order('url'),
      supabase.from('ar_index_events').select('*').order('created_at', { ascending: false }).limit(50),
    ]);
    setRows((s.data as StatusRow[]) || []);
    setEvents((e.data as EventRow[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const runCheck = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-ar-indexing', { body: {} });
      if (error) throw error;
      toast({ title: `Checked ${data?.checked ?? 0} Arabic URLs`, description: `${data?.indexed ?? 0} indexed` });
      await load();
    } catch (err: any) {
      toast({ title: 'Check failed', description: err?.message ?? 'unknown error', variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const acknowledge = async (id: string) => {
    await supabase.from('ar_index_events').update({ acknowledged: true }).eq('id', id);
    setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, acknowledged: true } : ev)));
  };

  const indexed = rows.filter((r) => r.is_indexed).length;
  const discovered = rows.filter((r) => !r.is_indexed && /discovered/i.test(r.coverage_state || '')).length;
  const errored = rows.filter((r) => r.error).length;
  const unacked = events.filter((e) => e.became_indexed && !e.acknowledged);
  const lastRun = rows.reduce<string | null>((acc, r) => (!acc || r.last_checked_at > acc ? r.last_checked_at : acc), null);

  const filtered = rows.filter((r) => r.url.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Globe className="h-6 w-6" /> Index Coverage Monitor</h2>
          <p className="text-sm text-muted-foreground">
            Weekly Search Console index check on every URL in the sitemap (English + Arabic).
            {lastRun && ` Last run ${format(new Date(lastRun), 'dd MMM yyyy HH:mm')}.`}
          </p>
        </div>
        <Button onClick={runCheck} disabled={running}>
          <RefreshCw className={`h-4 w-4 mr-2 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Checking…' : 'Run check now'}
        </Button>
      </div>

      {unacked.length > 0 && (
        <Card className="logo-gradient-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              {unacked.length} page{unacked.length > 1 ? 's' : ''} newly indexed
            </CardTitle>
            <CardDescription>These moved from “Discovered – not indexed” to Indexed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {unacked.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{ev.url}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-muted-foreground">{format(new Date(ev.created_at), 'dd MMM')}</span>
                  <Button size="sm" variant="ghost" onClick={() => acknowledge(ev.id)}>Dismiss</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Tracked URLs" value={rows.length} icon={Globe} />
        <StatCard label="Indexed" value={indexed} icon={CheckCircle2} />
        <StatCard label="Discovered – not indexed" value={discovered} icon={Clock} />
        <StatCard label="Check errors" value={errored} icon={AlertTriangle} />
      </div>

      <Card className="logo-gradient-border">
        <CardHeader>
          <CardTitle className="text-base">URL status</CardTitle>
          <CardDescription>
            <Input
              placeholder="Filter by URL…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-2 max-w-sm"
              aria-label="Filter URLs"
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No data yet — run the check to populate Search Console status for the Arabic pages.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Coverage state</TableHead>
                  <TableHead>Last crawl</TableHead>
                  <TableHead>Checked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[320px] truncate">{r.url.replace('https://gcoman.com', '')}</TableCell>
                    <TableCell>
                      {r.error ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : (
                        <Badge variant={r.is_indexed ? 'default' : 'secondary'}>
                          {r.coverage_state || 'Unknown'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{r.last_crawl_time ? format(new Date(r.last_crawl_time), 'dd MMM yyyy') : '—'}</TableCell>
                    <TableCell>{format(new Date(r.last_checked_at), 'dd MMM HH:mm')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {events.length > 0 && (
        <Card className="logo-gradient-border">
          <CardHeader>
            <CardTitle className="text-base">Recent status changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {events.map((ev) => (
              <div key={ev.id} className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground">{format(new Date(ev.created_at), 'dd MMM yyyy')}</span>
                <span className="truncate">{ev.url.replace('https://gcoman.com', '')}</span>
                <span className="text-muted-foreground">{ev.from_state || 'new'} → {ev.to_state || 'unknown'}</span>
                {ev.became_indexed && <Badge>Indexed</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: any }) {
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
