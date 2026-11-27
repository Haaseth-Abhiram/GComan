/**
 * Employee Portal → Daily report: pick today or one of the last 7 days, write,
 * save a draft or submit. Managers also see "Team reports".
 */
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Eye, Loader2, Plus, Save, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fmtDate, fmtMinutes } from '@/portal/lib/attendance';
import {
  REPORTS_KEY, REPORT_DAYS_BACK, REPORT_STATUS_TEXT, REPORT_TEXT_MAX, fetchMyReport, fetchTeamReports, saveMyReport,
  shiftDay, type MyReportDay,
} from '@/portal/lib/reports';
import { ReportBadge, ReportBody, ReportDialog } from '@/portal/components/ReportView';

const Spinner = () => <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

/** The writing form for one day. Remounted (key) whenever the day changes. */
const Editor = ({ day, onDirty }: { day: MyReportDay; onDirty: (dirty: boolean) => void }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const report = day.report;
  const [summary, setSummary] = useState(report?.summary ?? '');
  const [pending, setPending] = useState(report?.pending ?? '');
  const [items, setItems] = useState((report?.items ?? []).map((i) => ({ project_id: i.project_id, name: i.name ?? '', work: i.work, hours: String(Number(i.hours)) })));
  const addable = (day.projects ?? []).filter((p) => !items.some((i) => i.project_id === p.id));
  const setItem = (id: string, patch: { work?: string; hours?: string }) => { setItems(items.map((i) => (i.project_id === id ? { ...i, ...patch } : i))); onDirty(true); };
  const nothing = !summary.trim() && !items.length;
  const [confirm, setConfirm] = useState(false);
  const editable = day.date_allowed && (!report || report.status === 'draft' || report.status === 'returned');

  const change = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLTextAreaElement>) => { set(e.target.value); onDirty(true); };

  const save = useMutation({
    mutationFn: (submit: boolean) => saveMyReport({ date: day.date, summary, pending, submit, items }),
    onSuccess: (fresh, submit) => {
      onDirty(false);
      setConfirm(false);
      qc.setQueryData([...REPORTS_KEY, 'mine', day.date], fresh);
      void qc.invalidateQueries({ queryKey: REPORTS_KEY });
      toast({
        title: submit ? 'Report submitted' : 'Draft saved',
        description: submit ? `Sent to ${fresh.report?.submitted_to ?? 'the administrator'}.` : undefined,
      });
    },
    onError: (e: Error) => { setConfirm(false); toast({ title: 'Could not save', description: e.message, variant: 'destructive' }); },
  });

  if (!editable) {
    return report ? (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {report.status === 'submitted' && `Waiting for ${report.submitted_to ?? 'the administrator'} to review it.`}
          {report.status === 'reviewed' && `Reviewed by ${report.reviewed_by ?? 'the reviewer'}.`}
          {(report.status === 'draft' || report.status === 'returned') && 'This day is too old to change.'}
        </p>
        <ReportBody report={report} />
      </div>
    ) : <p className="text-sm text-muted-foreground">Reports can be written for today and the last {REPORT_DAYS_BACK} days.</p>;
  }

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setConfirm(true); }}>
      {report?.status === 'returned' && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Sent back by {report.reviewed_by ?? 'the reviewer'}: “{report.review_comment}”. Change it and submit again.</span>
        </p>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="rep-summary">What did you work on {day.date === day.today ? 'today' : 'that day'}?</Label>
        <Textarea id="rep-summary" rows={6} maxLength={REPORT_TEXT_MAX} value={summary} onChange={change(setSummary)} />
        <p className="text-right text-xs text-muted-foreground">{summary.length} / {REPORT_TEXT_MAX}</p>
      </div>
      {(!!day.projects?.length || !!items.length) && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Projects (optional)</p>
          {items.map((i) => (
            <div key={i.project_id} className="space-y-2 rounded-xl border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{i.name}</span>
                <Button type="button" size="sm" variant="ghost" className="text-destructive" aria-label={`Remove ${i.name}`}
                  onClick={() => { setItems(items.filter((x) => x.project_id !== i.project_id)); onDirty(true); }}>Remove</Button>
              </div>
              <Textarea aria-label={`Work on ${i.name}`} placeholder="What you did on this project" maxLength={REPORT_TEXT_MAX} value={i.work} onChange={(e) => setItem(i.project_id, { work: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">Hours
                <Input type="number" aria-label={`Hours on ${i.name}`} className="w-24" min="0.25" max="24" step="0.25" value={i.hours} onChange={(e) => setItem(i.project_id, { hours: e.target.value })} />
              </label>
            </div>
          ))}
          {!!addable.length && (
            <div className="flex flex-wrap gap-2">
              {addable.map((p) => (
                <Button key={p.id} type="button" size="sm" variant="outline" onClick={() => { setItems([...items, { project_id: p.id, name: p.name, work: '', hours: '' }]); onDirty(true); }}>
                  <Plus className="mr-1 h-4 w-4" />{p.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="rep-pending">Pending work or blockers (optional)</Label>
        <Textarea id="rep-pending" rows={3} maxLength={REPORT_TEXT_MAX} value={pending} onChange={change(setPending)} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Goes to {day.manager ?? 'the administrator'}.</span>
        <div className="flex gap-2">
          <Button type="button" variant="outline" disabled={save.isPending} onClick={() => save.mutate(false)}>
            <Save className="mr-2 h-4 w-4" />Save draft
          </Button>
          <Button type="submit" disabled={save.isPending || nothing}><Send className="mr-2 h-4 w-4" />Submit report</Button>
        </div>
      </div>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit the report for {fmtDate(day.date)}?</DialogTitle>
            <DialogDescription>You can't change it after submitting, unless it is sent back to you.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirm(false)}>Not yet</Button>
            <Button type="button" disabled={save.isPending} onClick={() => save.mutate(true)}>
              {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Yes, submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

const MyReports = () => {
  const [params, setParams] = useSearchParams();
  const asked = params.get('date');
  const date = asked && /^\d{4}-\d{2}-\d{2}$/.test(asked) ? asked : null;  // null = today (company date)
  const [dirty, setDirty] = useState(false);
  const [leaving, setLeaving] = useState<string | null>(null);
  // The day's data is not refetched while the page is open, so typing is never overwritten.
  const { data, isLoading, error } = useQuery({
    queryKey: [...REPORTS_KEY, 'mine', date],
    queryFn: () => fetchMyReport(date),
    refetchOnWindowFocus: false,
  });

  const go = (iso: string) => { setDirty(false); setLeaving(null); setParams({ date: iso }); };
  const choose = (iso: string) => { if (iso !== data?.date) { if (dirty) setLeaving(iso); else go(iso); } };

  if (isLoading) return <Spinner />;
  if (error || !data) return <p className="text-sm text-destructive">Could not load the report: {(error as Error)?.message}</p>;

  const status = new Map(data.history.map((h) => [h.report_date, h.status]));
  const days = Array.from({ length: REPORT_DAYS_BACK + 1 }, (_, i) => shiftDay(data.today, -i));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose the day">
        {days.map((iso, i) => {
          const on = iso === data.date;
          const s = status.get(iso);
          return (
            <button key={iso} type="button" aria-pressed={on} onClick={() => choose(iso)}
              className={`flex min-w-[6.5rem] flex-col items-start rounded-xl border px-3 py-2 text-left transition-all ${on
                ? 'border-transparent bg-gradient-to-r from-[#223f96] to-[#3f63c9] text-white shadow-md'
                : 'border-[#e3e9f5] bg-white hover:border-[#223f96]/30'}`}>
              <span className="text-xs font-bold">{i === 0 ? 'Today' : i === 1 ? 'Yesterday' : fmtDate(iso, { weekday: 'short' })}</span>
              <span className={`text-[11px] ${on ? 'text-white/80' : 'text-muted-foreground'}`}>
                {fmtDate(iso, { day: 'numeric', month: 'short' })}{s ? ` · ${REPORT_STATUS_TEXT[s].toLowerCase()}` : ''}
              </span>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Report for {fmtDate(data.date)}</CardTitle>
            <CardDescription>{data.worked_minutes != null ? `Attendance: ${fmtMinutes(data.worked_minutes)} worked` : 'No punch-in on this day'}</CardDescription>
          </div>
          {data.report ? <ReportBadge status={data.report.status} /> : <span className="text-xs font-semibold text-muted-foreground">Not started</span>}
        </CardHeader>
        <CardContent>
          <Editor key={`${data.date}-${data.report?.status ?? 'new'}`} day={data} onDirty={setDirty} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">My reports</CardTitle><CardDescription>The last 60 days.</CardDescription></CardHeader>
        <CardContent>
          {!data.history.length ? <p className="text-sm text-muted-foreground">No reports yet.</p> : (
            <ul className="divide-y">
              {data.history.map((h) => (
                <li key={h.report_date}>
                  <button type="button" onClick={() => choose(h.report_date)} className="flex w-full items-center gap-3 py-2.5 text-left hover:bg-muted/50">
                    <span className="w-28 shrink-0 text-sm font-medium">{fmtDate(h.report_date)}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{h.summary ?? '—'}</span>
                    <ReportBadge status={h.status} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!leaving} onOpenChange={(o) => !o && setLeaving(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>You haven't saved this report.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeaving(null)}>Stay</Button>
            <Button variant="destructive" onClick={() => leaving && go(leaving)}>Discard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TeamReports = () => {
  const { data = [], isLoading, error } = useQuery({ queryKey: [...REPORTS_KEY, 'team'], queryFn: fetchTeamReports });
  const [openId, setOpenId] = useState<string | null>(null);
  if (isLoading) return <Spinner />;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Team reports</CardTitle><CardDescription>Reports waiting for you come first. The last 60 days.</CardDescription></CardHeader>
      <CardContent>
        {!data.length ? <p className="py-6 text-center text-sm text-muted-foreground">No team reports yet.</p> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Employee</TableHead><TableHead>Work</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {data.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap">{fmtDate(r.report_date)}</TableCell>
                    <TableCell className="font-medium">{r.employee.full_name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">{r.summary}</TableCell>
                    <TableCell><ReportBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant={r.can_review ? 'default' : 'outline'} onClick={() => setOpenId(r.id)}>
                        <Eye className="mr-1 h-4 w-4" />{r.can_review ? 'Review' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <ReportDialog report={data.find((r) => r.id === openId) ?? null} onClose={() => setOpenId(null)} />
    </Card>
  );
};

export const DailyReportPage = ({ canWrite, isManager }: { canWrite: boolean; isManager: boolean }) => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Daily report</h1>
    {canWrite && isManager ? (
      <Tabs defaultValue="mine" className="space-y-4">
        <TabsList><TabsTrigger value="mine">My reports</TabsTrigger><TabsTrigger value="team">Team reports</TabsTrigger></TabsList>
        <TabsContent value="mine"><MyReports /></TabsContent>
        <TabsContent value="team"><TeamReports /></TabsContent>
      </Tabs>
    ) : canWrite ? <MyReports /> : <TeamReports />}
  </div>
);
