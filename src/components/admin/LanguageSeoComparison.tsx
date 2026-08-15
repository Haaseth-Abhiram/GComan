import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, Languages, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Row { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }
interface Totals { clicks: number; impressions: number; ctr: number; position: number }
interface Side { totals: Totals; byQuery: Row[]; byDate: Row[]; byPage: Row[] }

const RANGES = [
  { label: '7 days', days: 7 },
  { label: '28 days', days: 28 },
  { label: '3 months', days: 90 },
  { label: '12 months', days: 365 },
];

const ZERO: Totals = { clicks: 0, impressions: 0, ctr: 0, position: 0 };

export function LanguageSeoComparison() {
  const [en, setEn] = useState<Side | null>(null);
  const [ar, setAr] = useState<Side | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(28);
  const { toast } = useToast();

  const load = useCallback(async (rangeDays: number) => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke('search-console', {
        body: { days: rangeDays, rowLimit: 25 },
      });
      if (error) throw error;
      if ((res as any)?.error) throw new Error((res as any).details || (res as any).error);
      setEn((res as any)?.comparison?.en ?? null);
      setAr((res as any)?.comparison?.ar ?? null);
    } catch (err: any) {
      toast({
        title: 'Could not load comparison data',
        description: err?.message ?? 'unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(days); }, [load, days]);

  const e = en?.totals ?? ZERO;
  const a = ar?.totals ?? ZERO;

  const insights = buildInsights(e, a, en, ar);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Languages className="h-6 w-6" /> Arabic vs English SEO
          </h2>
          <p className="text-sm text-muted-foreground">
            Side-by-side Search Console performance for /ar/* versus English pages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <Button key={r.days} size="sm" variant={days === r.days ? 'default' : 'outline'} onClick={() => setDays(r.days)}>
              {r.label}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => load(days)} disabled={loading} aria-label="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CompareStat label="Clicks" en={e.clicks} ar={a.clicks} format={(v) => v.toLocaleString()} loading={loading} />
        <CompareStat label="Impressions" en={e.impressions} ar={a.impressions} format={(v) => v.toLocaleString()} loading={loading} />
        <CompareStat label="CTR" en={e.ctr * 100} ar={a.ctr * 100} format={(v) => `${v.toFixed(2)}%`} loading={loading} />
        <CompareStat label="Avg. position" en={e.position} ar={a.position} format={(v) => v.toFixed(1)} lowerIsBetter loading={loading} />
      </div>

      <Card className="logo-gradient-border">
        <CardHeader>
          <CardTitle className="text-base">What to optimize next</CardTitle>
          <CardDescription>Automatic reading of the gap between the two languages</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : insights.length === 0 ? (
            <p className="text-sm text-muted-foreground">Not enough data yet for this period.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {insights.map((i, idx) => (
                <li key={idx} className="flex gap-2">
                  <Badge variant={i.tone === 'bad' ? 'destructive' : 'secondary'} className="shrink-0">{i.tag}</Badge>
                  <span>{i.text}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <QueryPanel title="Top English queries" rows={en?.byQuery} loading={loading} />
        <QueryPanel title="Top Arabic queries" rows={ar?.byQuery} loading={loading} rtl />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PagePanel title="Top English pages" rows={en?.byPage} loading={loading} />
        <PagePanel title="Top Arabic pages" rows={ar?.byPage} loading={loading} />
      </div>
    </div>
  );
}

function buildInsights(e: Totals, a: Totals, en: Side | null, ar: Side | null) {
  const out: { tag: string; text: string; tone: 'bad' | 'ok' }[] = [];
  if (!en || !ar) return out;

  const totalImpr = e.impressions + a.impressions;
  if (totalImpr === 0) return out;

  const arShare = (a.impressions / totalImpr) * 100;
  out.push({
    tag: 'Visibility',
    tone: arShare < 10 ? 'bad' : 'ok',
    text: `Arabic pages account for ${arShare.toFixed(1)}% of total impressions. ${
      arShare < 10 ? 'Arabic visibility is still thin — prioritise indexing and Arabic-language internal links.' : 'Arabic visibility is meaningful; keep expanding Arabic content.'
    }`,
  });

  if (a.ctr < e.ctr && a.impressions > 0) {
    out.push({
      tag: 'CTR gap',
      tone: 'bad',
      text: `Arabic CTR (${(a.ctr * 100).toFixed(2)}%) trails English (${(e.ctr * 100).toFixed(2)}%). Rewrite Arabic titles and meta descriptions to read natively rather than as translations.`,
    });
  }

  if (a.position > e.position && a.impressions > 0) {
    out.push({
      tag: 'Ranking gap',
      tone: 'bad',
      text: `Arabic average position is ${a.position.toFixed(1)} versus ${e.position.toFixed(1)} for English. Strengthen Arabic on-page copy and hreflang coverage on the weakest pages.`,
    });
  }

  const arNoClicks = (ar.byQuery ?? []).filter((r) => r.clicks === 0 && r.impressions >= 10).length;
  if (arNoClicks > 0) {
    out.push({
      tag: 'Quick win',
      tone: 'ok',
      text: `${arNoClicks} Arabic queries have impressions but zero clicks — these are the fastest wins for Arabic snippet rewrites.`,
    });
  }

  const enQ = new Set((en.byQuery ?? []).map((r) => r.keys[0]));
  const arQ = new Set((ar.byQuery ?? []).map((r) => r.keys[0]));
  if (enQ.size > 0 && arQ.size > 0) {
    out.push({
      tag: 'Coverage',
      tone: 'ok',
      text: `${enQ.size} English and ${arQ.size} Arabic top queries tracked with no overlap in wording — build dedicated Arabic keyword targeting instead of mirroring English terms.`,
    });
  }

  return out;
}

function CompareStat({
  label, en, ar, format, lowerIsBetter, loading,
}: { label: string; en: number; ar: number; format: (v: number) => string; lowerIsBetter?: boolean; loading: boolean }) {
  const better = lowerIsBetter ? ar < en : ar > en;
  const equal = ar === en;
  const Icon = equal ? Minus : better ? ArrowUpRight : ArrowDownRight;
  return (
    <Card className="logo-gradient-border">
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className={`h-4 w-4 ${equal ? 'text-muted-foreground' : better ? 'text-emerald-500' : 'text-destructive'}`} />
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">English</p>
            <p className="text-xl font-bold">{loading ? '—' : format(en)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Arabic</p>
            <p className="text-xl font-bold">{loading ? '—' : format(ar)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QueryPanel({ title, rows, loading, rtl }: { title: string; rows?: Row[]; loading: boolean; rtl?: boolean }) {
  return (
    <Card className="logo-gradient-border">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>Clicks, impressions, CTR and average position</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : !rows || rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No data for this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Pos.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 15).map((r) => (
                  <TableRow key={r.keys[0]}>
                    <TableCell className="max-w-[220px] truncate" dir={rtl ? 'rtl' : undefined}>{r.keys[0]}</TableCell>
                    <TableCell className="text-right">{r.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(r.ctr * 100).toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{r.position.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PagePanel({ title, rows, loading }: { title: string; rows?: Row[]; loading: boolean }) {
  return (
    <Card className="logo-gradient-border">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>Best performing URLs in this language</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : !rows || rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No data for this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">Pos.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 15).map((r) => (
                  <TableRow key={r.keys[0]}>
                    <TableCell className="max-w-[260px] truncate">
                      {r.keys[0].replace('https://gcoman.com', '') || '/'}
                    </TableCell>
                    <TableCell className="text-right">{r.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.position.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
