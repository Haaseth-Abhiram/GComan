import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { recordSubmission, todayStr, useDb, type Rfq, type Submission } from '@/proposal-tracker/lib/db';
import { can, visibleRfqs } from '@/proposal-tracker/lib/permissions';
import { DataTable, FieldError, PageHeader, StatusBadge, fmtDate, run, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';

const Submissions = () => {
  const actor = useActor();
  const { user } = useAuth();
  const db = useDb();
  const name = useEmployeeName();
  const rfqs = visibleRfqs(user!, db.rfqs);
  const ids = new Set(rfqs.map((r) => r.id));
  const [target, setTarget] = useState<Rfq | null>(null);
  const [date, setDate] = useState(todayStr());
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [docs, setDocs] = useState<string[]>([]);
  const [revision, setRevision] = useState(1);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const ready = rfqs.filter((r) => r.status === 'Approved' || r.status === 'Submitted');
  const history = db.submissions.filter((s) => ids.has(s.rfqId)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const rfqOf = (id: string) => db.rfqs.find((r) => r.id === id);
  const docsFor = (id: string) => db.documents.filter((d) => d.rfqId === id);
  const revisionsOf = (id: string) => db.submissions.filter((s) => s.rfqId === id).length;

  const open = (r: Rfq) => { setTarget(r); setDate(todayStr()); setReference(`SUB-${String(db.submissions.length + 1).padStart(3, '0')}`); setNotes(''); setDocs([]); setNewFiles([]); setRevision(revisionsOf(r.id) + 1); setErr(''); };
  const save = async () => {
    if (!reference.trim()) return setErr('Submission reference is required.');
    if (!date) return setErr('Submitted date is required.');
    if (!Number.isInteger(revision) || revision < 1) return setErr('Revision must be 1 or higher.');
    setBusy(true);
    const ok = await run(() => recordSubmission(actor, { rfqId: target!.id, submittedDate: date, reference: reference.trim(), notes, supportingDocs: docs, revision, newFiles }), 'Submission recorded');
    setBusy(false);
    if (ok) setTarget(null);
  };

  const readyCols: Column<Rfq>[] = [
    { header: 'RFQ', cell: (r) => <div><p className="font-medium whitespace-nowrap">{r.ref}</p><p className="text-xs text-muted-foreground">{r.customer.name}</p></div> },
    { header: 'Deadline', cell: (r) => fmtDate(r.deadline), className: 'whitespace-nowrap', hideOnMobile: true },
    { header: 'Revisions', cell: (r) => revisionsOf(r.id) },
    { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      cell: (r) => can(actor, 'proposal.submit', r) && (
        <div className="flex gap-2">
          <Button size="icon" variant="outline" title={r.status === 'Submitted' ? 'New revision' : 'Record submission'} aria-label={r.status === 'Submitted' ? 'New revision' : 'Record submission'} onClick={() => open(r)}><Send className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];
  const histCols: Column<Submission>[] = [
    { header: 'Reference', cell: (s) => <span className="font-medium">{s.reference}</span> },
    { header: 'RFQ', cell: (s) => rfqOf(s.rfqId)?.ref, className: 'whitespace-nowrap' },
    { header: 'Revision', cell: (s) => `Rev ${s.revision}` },
    { header: 'Submitted', cell: (s) => fmtDate(s.submittedDate), className: 'whitespace-nowrap' },
    { header: 'Recorded by', cell: (s) => name(s.recordedBy), hideOnMobile: true },
    { header: 'Supporting documents', cell: (s) => (s.supportingDocs.length ? s.supportingDocs.join(', ') : '—'), hideOnMobile: true },
  ];

  if (!can(actor, 'proposal.submit')) return <PageHeader title="Proposal Submission" description="Only Admins can record proposal submissions." />;

  return (
    <>
      <PageHeader title="Proposal Submission" description={'Record submitted date, revision and reference for approved proposals, with full history.'} />
      <Card className="mb-6">
        <CardHeader className="pb-2"><CardTitle>Ready to submit</CardTitle><CardDescription>Approved or already submitted proposals</CardDescription></CardHeader>
        <CardContent><DataTable rows={ready} columns={readyCols} emptyTitle="No approved proposals" emptyHint="Proposals appear here after admin approval." /></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle>Submission history</CardTitle></CardHeader>
        <CardContent><DataTable rows={history} columns={histCols} emptyTitle="No submissions recorded" searchText={(s) => `${s.reference} ${rfqOf(s.rfqId)?.ref ?? ''}`} /></CardContent>
      </Card>

      <Dialog open={!!target} onOpenChange={(o) => !busy && !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record submission — {target?.ref}</DialogTitle>
            <DialogDescription>This will be revision {target ? revisionsOf(target.id) + 1 : 1}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="sd">Submitted date *</Label><Input id="sd" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
              <div><Label htmlFor="sv">Revision *</Label><Input id="sv" type="number" min={1} value={revision} onChange={(e) => { setRevision(Number(e.target.value)); setErr(''); }} /></div>
              <div className="col-span-2"><Label htmlFor="sr">Submission reference *</Label><Input id="sr" value={reference} onChange={(e) => { setReference(e.target.value); setErr(''); }} /></div>
            </div>
            <div>
              <Label>Supporting documents already uploaded to this RFQ</Label>
              <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                {target && docsFor(target.id).length === 0 && <p className="text-xs text-muted-foreground">No documents uploaded for this RFQ yet.</p>}
                {target && docsFor(target.id).map((d) => (
                  <label key={d.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={docs.includes(d.name)} onChange={(e) => setDocs((x) => (e.target.checked ? [...x, d.name] : x.filter((n) => n !== d.name)))} />
                    {d.name} <span className="text-xs text-muted-foreground">({d.category})</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="sf">Upload supporting documents (max 1 MB each)</Label>
              <Input id="sf" type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files ?? []))} />
            </div>
            <div><Label htmlFor="sn">Notes</Label><Textarea id="sn" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <FieldError msg={err} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)} disabled={busy}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Record submission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default Submissions;
