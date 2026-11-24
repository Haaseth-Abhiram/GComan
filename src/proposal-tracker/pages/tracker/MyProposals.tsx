import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { matchesFilter } from '@/proposal-tracker/lib/metrics';
import { Bell, CalendarClock, Eye, Loader2, Pencil, Plus, ListChecks, Gauge, StickyNote, SendHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { deleteRfq, emailDeadlineAlert, sendForReview, setDeadlineAlert, updateProgress, useDb, EDIT_STATUSES, PROGRESS_STEPS, type EmailLog, type Rfq, type RfqStatus } from '@/proposal-tracker/lib/db';
import { Input } from '@/components/ui/input';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { can, visibleRfqs } from '@/proposal-tracker/lib/permissions';
import { DialogBanner, FormSection } from '@/proposal-tracker/components/tracker/FormSection';
import { DataTable, PageHeader, PriorityBadge, StatusBadge, fmtDate, fmtDateTime, isOverdue, run, useActor, type Column } from '@/proposal-tracker/components/tracker/common';


const MyProposals = () => {
  const actor = useActor();
  const { user } = useAuth();
  const db = useDb();
  const [edit, setEdit] = useState<Rfq | null>(null);
  const [review, setReview] = useState<Rfq | null>(null);
  const [del, setDel] = useState<Rfq | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<RfqStatus>('In Progress');
  const [pending, setPending] = useState('');
  const [busy, setBusy] = useState(false);
  const [alertOn, setAlertOn] = useState(true);
  const [alertDays, setAlertDays] = useState(5);

  const [params] = useSearchParams();
  const [filter, setFilter] = useState(params.get('status') ?? 'all');
  useEffect(() => { const s = params.get('status'); if (s) setFilter(s); }, [params]);
  const rows = visibleRfqs(user!, db.rfqs).filter((r) => (r.primaryEngineerId || r.supportingIds.length) && matchesFilter(r, filter));
  const open = (r: Rfq) => { setEdit(r); setProgress(r.progress >= 25 ? r.progress : 25); setStatus((EDIT_STATUSES as readonly string[]).includes(r.status) ? r.status : 'In Progress'); setPending(r.pendingActions); setAlertOn(r.alertEnabled ?? true); setAlertDays(r.alertDaysBefore ?? 5); };
  const sendAlert = (r: Rfq) => {
    try {
      const names = emailDeadlineAlert(actor, r.id);
      toast({ title: 'Email has been sent', description: `Deadline alert for ${r.ref} sent to ${names.join(', ')}.` });
    } catch (e) {
      toast({ title: 'Could not send', description: e instanceof Error ? e.message : 'Unexpected error', variant: 'destructive' });
    }
  };
  const save = async () => {
    if (alertOn && (!Number.isInteger(alertDays) || alertDays < 1 || alertDays > 60)) {
      toast({ title: 'Check the alert days', description: 'Alert days must be between 1 and 60.', variant: 'destructive' });
      return;
    }
    setBusy(true);
    const ok = await run(() => {
      updateProgress(actor, edit!.id, { progress, status, pendingActions: pending });
      setDeadlineAlert(actor, edit!.id, { alertEnabled: alertOn, alertDaysBefore: alertDays });
    }, 'Progress updated');
    setBusy(false);
    if (ok) setEdit(null);
  };

  const actions = (r: Rfq) => (
    <>
      <Button asChild size="icon" variant="outline" title="View" aria-label={`View ${r.ref}`}>
        <Link to={`/proposal-tracker/rfqs?view=${r.id}`}><Eye className="h-4 w-4" /></Link>
      </Button>
      {can(actor, 'proposal.update', r) && (
        <>
          {actor.role === 'engineer' && (<Button size="icon" variant="outline" title="Email deadline alert" aria-label={`Email deadline alert for ${r.ref}`} onClick={() => sendAlert(r)}><Bell className="h-4 w-4" /></Button>)}
          <Button size="icon" variant="outline" title="Edit" aria-label={`Edit ${r.ref}`} onClick={() => open(r)}><Pencil className="h-4 w-4" /></Button>
          {actor.role === 'engineer' && (<Button size="icon" variant="outline" title="Send for review" aria-label={`Send ${r.ref} for review`} onClick={() => setReview(r)} disabled={r.status === 'Under Review'}><SendHorizontal className="h-4 w-4" /></Button>)}
        </>
      )}
      {can(actor, 'rfq.manage') && (
        <Button size="icon" variant="outline" className="text-red-600" title="Delete" aria-label={`Delete ${r.ref}`} onClick={() => setDel(r)}><Trash2 className="h-4 w-4" /></Button>
      )}
    </>
  );

  const columns: Column<Rfq>[] = [
    { header: 'RFQ', cell: (r) => <div><p className="font-medium whitespace-nowrap">{r.ref}</p><p className="text-xs text-muted-foreground">{r.customer.name}</p><div className="md:hidden mt-2 flex flex-wrap gap-1">{actions(r)}</div></div> },
    { header: 'Project', cell: (r) => r.project, hideOnMobile: true },
    { header: 'Deadline', cell: (r) => <span className={isOverdue(r) ? 'text-red-600 font-medium' : ''}>{fmtDate(r.deadline)}</span>, className: 'whitespace-nowrap' },
    { header: 'Priority', cell: (r) => <PriorityBadge priority={r.priority} />, hideOnMobile: true },
    { header: 'Progress', cell: (r) => <div className="min-w-24"><Progress value={r.progress} className="h-2" /><span className="text-xs text-muted-foreground">{r.progress}%</span></div> },
    { header: 'Pending actions', cell: (r) => r.pendingActions || '—', hideOnMobile: true, className: 'max-w-56' },
    { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
    { header: 'Actions', hideOnMobile: true, cell: (r) => <div className="flex gap-1 items-center flex-wrap">{actions(r)}</div> },
  ];

  const mailCols: Column<EmailLog>[] = [
    { header: 'Sent', cell: (m) => fmtDateTime(m.at), className: 'whitespace-nowrap' },
    { header: 'RFQ', cell: (m) => db.rfqs.find((r) => r.id === m.rfqId)?.ref ?? '—', className: 'whitespace-nowrap' },
    { header: 'To', cell: (m) => m.toIds.map((id) => db.employees.find((e) => e.id === id)?.name ?? '—').join(', '), hideOnMobile: true },
    { header: 'Type', cell: (m) => (m.kind === 'daily' ? 'Daily (automatic)' : 'Manual'), hideOnMobile: true },
    { header: 'Message', cell: (m) => m.subject },
  ];

  // Admins monitor proposals from the RFQ Register, Engineer Assignment and Engineers pages.
  if (actor.role === 'admin') return <PageHeader title="My Proposals" description="This page is for Engineers. Use the RFQ Register, Engineer Assignment or Engineers pages to follow proposals." />;

  return (
    <>
      <PageHeader title="My Proposals" actions={can(actor, 'rfq.create') && <Button asChild><Link to="/proposal-tracker/rfqs?new=1"><Plus className="h-4 w-4 mr-1" />Add proposal</Link></Button>} description={'Proposals assigned to you. Update progress, record pending actions and send for admin review.'} />
      <Card><CardContent className="p-4 md:p-6">
        <DataTable rows={rows} columns={columns} emptyTitle="No proposals assigned to you" emptyHint="Your admin will assign RFQs to you."
          searchText={(r) => `${r.ref} ${r.customer.name} ${r.project}`}
          filters={
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger aria-label="Filter proposals" className="w-full sm:w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['all', 'In Progress', 'Pending', 'Submitted', 'Overdue'].map((k) => <SelectItem key={k} value={k}>{k === 'all' ? 'All proposals' : k}</SelectItem>)}
              </SelectContent>
            </Select>
          } />
      </CardContent></Card>

      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Alert emails</CardTitle>
          <CardDescription>Sent automatically once a day from {'5'} days (or the number you set) before the deadline, or when you click Email alert. Prototype: emails are recorded here; a real mail server is needed for delivery to inboxes.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable rows={db.emailLog} columns={mailCols} emptyTitle="No alert emails yet" pageSize={5} />
        </CardContent>
      </Card>

      <Dialog open={!!edit} onOpenChange={(o) => !busy && !o && setEdit(null)}>
        <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          <DialogBanner icon={Pencil}>
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-xl">Update progress — {edit?.ref}</DialogTitle>
              <DialogDescription>{edit ? `${edit.project} · ${edit.customer.name}` : ''}</DialogDescription>
            </DialogHeader>
            {edit && <p className="mt-2 inline-flex items-center gap-1 text-xs rounded-full border bg-background/70 px-2.5 py-1"><CalendarClock className="h-3 w-3" />Deadline {fmtDate(edit.deadline)}</p>}
          </DialogBanner>
          <div className="p-6 space-y-4">
            <FormSection icon={Gauge} title="Progress">
              <div className="flex items-baseline justify-between"><Label htmlFor="pg">Completion</Label><span className="text-2xl font-bold text-primary">{progress}%</span></div>
              <input
                id="pg" type="range" min={25} max={100} step={25} value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full mt-2 accent-primary cursor-pointer"
                aria-valuetext={`${progress} percent`}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                {PROGRESS_STEPS.map((p) => <span key={p}>{p}%</span>)}
              </div>
              <Progress value={progress} className="h-2 mt-3" />
            </FormSection>
            <FormSection icon={ListChecks} title="Status">
              <Select value={status} onValueChange={(s) => setStatus(s as RfqStatus)}>
                <SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger>
                <SelectContent>{EDIT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </FormSection>
            <FormSection icon={StickyNote} title="Pending actions">
              <Textarea id="pa" aria-label="Pending actions" rows={3} value={pending} onChange={(e) => setPending(e.target.value)} placeholder="e.g. Waiting for vendor price" />
            </FormSection>
            <FormSection icon={Bell} title="Deadline alert">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" checked={alertOn} onChange={(ev) => setAlertOn(ev.target.checked)} />
                Email me a deadline alert
              </label>
              {alertOn && (
                <div className="flex items-center gap-2 text-sm mt-3">
                  Start alerting
                  <Input aria-label="Alert days before deadline" className="w-20" type="number" min={1} max={60} value={alertDays} onChange={(e) => setAlertDays(Number(e.target.value))} />
                  days before the deadline
                </div>
              )}
            </FormSection>
          </div>
          <DialogFooter className="sticky bottom-0 z-10 px-6 py-4 border-t bg-muted">
            <Button variant="outline" onClick={() => setEdit(null)} disabled={busy}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {del?.ref}?</AlertDialogTitle>
            <AlertDialogDescription>This also deletes its tasks, follow-ups, documents, approval and submission history. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => run(() => deleteRfq(actor, del!.id), 'RFQ deleted')}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!review} onOpenChange={(o) => !o && setReview(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send {review?.ref} for admin review?</AlertDialogTitle>
            <AlertDialogDescription>The proposal will be locked for editing until the admin approves it or returns it.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => run(() => sendForReview(actor, review!.id), 'Sent for review')}>Send for review</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyProposals;
