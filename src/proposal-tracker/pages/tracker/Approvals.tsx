import { useState } from 'react';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { Check, CornerUpLeft, Loader2, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { reviewRfq, sendForReview, useDb, type Approval, type Rfq } from '@/proposal-tracker/lib/db';
import { can, visibleRfqs } from '@/proposal-tracker/lib/permissions';
import { DataTable, FieldError, PageHeader, PriorityBadge, StatusBadge, fmtDate, fmtDateTime, run, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';

const Approvals = () => {
  const actor = useActor();
  const { user } = useAuth();
  const db = useDb();
  const name = useEmployeeName();
  const rfqs = visibleRfqs(user!, db.rfqs);
  const ids = new Set(rfqs.map((r) => r.id));
  const canReview = can(actor, 'proposal.review');
  const [target, setTarget] = useState<{ rfq: Rfq; action: 'Approved' | 'Returned' } | null>(null);
  const [comment, setComment] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [sendTarget, setSendTarget] = useState<Rfq | null>(null);

  const waiting = rfqs.filter((r) => r.status === 'Under Review');
  const sendable = rfqs.filter((r) => r.status !== 'Under Review' && r.primaryEngineerId && can(actor, 'proposal.update', r));
  const history = db.approvals.filter((a) => ids.has(a.rfqId)).sort((a, b) => b.at.localeCompare(a.at));
  const rfqRef = (id: string) => db.rfqs.find((r) => r.id === id)?.ref;

  const confirm = async () => {
    if (target!.action === 'Returned' && !comment.trim()) return setErr('A comment is required when returning a proposal.');
    setBusy(true);
    const ok = await run(() => reviewRfq(actor, target!.rfq.id, target!.action, comment), target!.action === 'Approved' ? 'Proposal approved' : 'Proposal returned');
    setBusy(false);
    if (ok) { setTarget(null); setComment(''); setErr(''); }
  };

  const waitingCols: Column<Rfq>[] = [
    { header: 'RFQ', cell: (r) => <div><p className="font-medium whitespace-nowrap">{r.ref}</p><p className="text-xs text-muted-foreground">{r.customer.name}</p></div> },
    { header: 'Engineer', cell: (r) => <EngineerName id={r.primaryEngineerId} />, hideOnMobile: true },
    { header: 'Deadline', cell: (r) => fmtDate(r.deadline), className: 'whitespace-nowrap' },
    { header: 'Priority', cell: (r) => <PriorityBadge priority={r.priority} />, hideOnMobile: true },
    {
      header: 'Actions',
      cell: (r) => canReview ? (
        <div className="flex gap-2">
          <Button size="icon" variant="outline" title="Approve" aria-label="Approve" onClick={() => { setTarget({ rfq: r, action: 'Approved' }); setComment(''); setErr(''); }}><Check className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" title="Return for corrections" aria-label="Return for corrections" onClick={() => { setTarget({ rfq: r, action: 'Returned' }); setComment(''); setErr(''); }}><CornerUpLeft className="h-4 w-4" /></Button>
        </div>
      ) : <span className="text-xs text-muted-foreground">{actor.role === 'engineer' ? 'Awaiting approver' : 'Needs approver permission'}</span>,
    },
  ];
  const sendCols: Column<Rfq>[] = [
    { header: 'RFQ', cell: (r) => <div><p className="font-medium whitespace-nowrap">{r.ref}</p><p className="text-xs text-muted-foreground">{r.customer.name}</p></div> },
    { header: 'Progress', cell: (r) => `${r.progress}%` },
    { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
    { header: 'Actions', cell: (r) => <Button size="icon" variant="outline" title="Send for admin review" aria-label="Send for admin review" onClick={() => setSendTarget(r)}><SendHorizontal className="h-4 w-4" /></Button> },
  ];
  const histCols: Column<Approval>[] = [
    { header: 'When', cell: (a) => fmtDateTime(a.at), className: 'whitespace-nowrap' },
    { header: 'RFQ', cell: (a) => rfqRef(a.rfqId), className: 'whitespace-nowrap' },
    { header: 'Action', cell: (a) => <StatusBadge status={a.action} /> },
    { header: 'Reviewer / sender', cell: (a) => <EngineerName id={a.reviewerId} />, hideOnMobile: true },
    { header: 'Comments', cell: (a) => a.comment || '—' },
  ];


  return (
    <>
      <PageHeader title="Review & Approval" description="Admins approve proposals or return them for corrections. Every step is recorded." />
      {actor.role === 'engineer' && sendable.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2"><CardTitle>Send for admin review</CardTitle><CardDescription>Proposals you can send to the admin</CardDescription></CardHeader>
          <CardContent><DataTable rows={sendable} columns={sendCols} emptyTitle="Nothing to send" /></CardContent>
        </Card>
      )}
      <Card className="mb-6">
        <CardHeader className="pb-2"><CardTitle>Awaiting review</CardTitle><CardDescription>{waiting.length} proposal{waiting.length === 1 ? '' : 's'}</CardDescription></CardHeader>
        <CardContent><DataTable rows={waiting} columns={waitingCols} emptyTitle="Nothing awaiting review" /></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle>Approval history</CardTitle></CardHeader>
        <CardContent>
          <DataTable rows={history} columns={histCols} emptyTitle="No approval history yet" searchText={(a) => `${rfqRef(a.rfqId) ?? ''} ${a.action} ${a.comment} ${name(a.reviewerId)}`} />
        </CardContent>
      </Card>

      <AlertDialog open={!!sendTarget} onOpenChange={(o) => !o && setSendTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send {sendTarget?.ref} for admin review?</AlertDialogTitle>
            <AlertDialogDescription>The admin can then approve it or return it for corrections.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => run(() => sendForReview(actor, sendTarget!.id), 'Sent for admin review')}>Send for admin review</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!target} onOpenChange={(o) => !busy && !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target?.action === 'Approved' ? 'Approve' : 'Return'} {target?.rfq.ref}</DialogTitle>
            <DialogDescription>{target?.action === 'Approved' ? 'Optionally add a comment.' : 'Explain what needs to be corrected.'}</DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="cm">Comment{target?.action === 'Returned' ? ' *' : ''}</Label>
            <Textarea id="cm" rows={3} value={comment} onChange={(e) => { setComment(e.target.value); setErr(''); }} />
            <FieldError msg={err} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)} disabled={busy}>Cancel</Button>
            <Button onClick={confirm} disabled={busy}>{busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}{target?.action === 'Approved' ? 'Approve' : 'Return for corrections'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Approvals;
