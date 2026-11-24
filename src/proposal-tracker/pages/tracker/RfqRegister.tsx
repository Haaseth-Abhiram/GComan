import { useEffect, useMemo, useState } from 'react';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Plus, Paperclip, Loader2, Eye, Pencil, Trash2, Download, Building2, Inbox, FilePlus2, ClipboardList, Banknote, Upload, Hash, User, Mail, Phone, CalendarDays, CalendarClock, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { createRfq, updateRfq, deleteRfq, setCosting, nextRfqRef, useDb, todayStr, RFQ_STATUSES, RFQ_SOURCES, type RfqSource, type NewRfq, type Priority } from '@/proposal-tracker/lib/db';
import { can, visibleRfqs } from '@/proposal-tracker/lib/permissions';
import {
  DataTable, FieldError, PageHeader, PriorityBadge, StatusBadge, daysUntil, fmtDate, fmtSize, isOverdue, run, useActor, useEmployeeName, type Column,
} from '@/proposal-tracker/components/tracker/common';
import type { Doc, Rfq } from '@/proposal-tracker/lib/db';
import { DialogBanner, FormSection } from '@/proposal-tracker/components/tracker/FormSection';
import { DocPreview } from '@/proposal-tracker/components/tracker/DocPreview';

const blank = (): NewRfq => ({
  customerRef: '', customerName: '', contact: '', email: '', phone: '', project: '',
  receivedDate: todayStr(), deadline: '', priority: 'Medium', source: 'Email',
});

function validate(v: NewRfq): Record<string, string> {
  const e: Record<string, string> = {};
  if (v.customerName.trim().length < 2) e.customerName = 'Customer name is required.';
  if (v.project.trim().length < 3) e.project = 'Project / description is required.';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address.';
  if (v.phone && !/^[+\d][\d\s()-]{5,}$/.test(v.phone)) e.phone = 'Enter a valid phone number.';
  if (!v.receivedDate) e.receivedDate = 'Received date is required.';
  if (!v.deadline) e.deadline = 'Submission deadline is required.';
  else if (v.receivedDate && v.deadline < v.receivedDate) e.deadline = 'Deadline cannot be before the received date.';
  return e;
}

function CostingPanel({ rfq, canEdit, onSave }: { rfq: Rfq; canEdit: boolean; onSave: (c: { estimatedCost: number; quotedPrice: number }) => Promise<boolean> }) {
  const [est, setEst] = useState(String(rfq.costing?.estimatedCost ?? ''));
  const [quo, setQuo] = useState(String(rfq.costing?.quotedPrice ?? ''));
  useEffect(() => { setEst(String(rfq.costing?.estimatedCost ?? '')); setQuo(String(rfq.costing?.quotedPrice ?? '')); }, [rfq.id, rfq.costing?.estimatedCost, rfq.costing?.quotedPrice]);
  const margin = rfq.costing && rfq.costing.quotedPrice > 0 ? Math.round(((rfq.costing.quotedPrice - rfq.costing.estimatedCost) / rfq.costing.quotedPrice) * 100) : null;
  return (
    <div className="rounded-md border p-3 bg-muted/30" data-testid="costing-panel">
      <p className="text-sm font-medium mb-2">Commercial costing <span className="text-xs font-normal text-muted-foreground">(restricted)</span></p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label htmlFor="ec">Estimated cost (OMR)</Label><Input id="ec" type="number" min={0} disabled={!canEdit} value={est} onChange={(e) => setEst(e.target.value)} /></div>
        <div><Label htmlFor="qp">Quoted price (OMR)</Label><Input id="qp" type="number" min={0} disabled={!canEdit} value={quo} onChange={(e) => setQuo(e.target.value)} /></div>
        <div><p className="text-xs text-muted-foreground">Margin</p><p className="text-sm mt-2">{margin === null ? '—' : `${margin}%`}</p></div>
      </div>
      {canEdit && <Button size="sm" className="mt-3" onClick={() => onSave({ estimatedCost: Number(est), quotedPrice: Number(quo) })}>Save costing</Button>}
    </div>
  );
}

const RfqRegister = () => {
  const actor = useActor();
  const { user } = useAuth();
  const db = useDb();
  const name = useEmployeeName();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState<NewRfq>(blank());
  const [files, setFiles] = useState<File[]>([]);
  const [previewDoc, setPreviewDoc] = useState<Doc | null>(null);
  const [estCost, setEstCost] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState(params.get('status') ?? 'all');
  const [editing, setEditing] = useState<Rfq | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const viewing = db.rfqs.find((x) => x.id === viewingId) ?? null; // always the live, permission-scoped record
  const setViewing = (r: Rfq | null) => setViewingId(r?.id ?? null);
  const [del, setDel] = useState<Rfq | null>(null);

  const rows = useMemo(
    () => visibleRfqs(user!, db.rfqs).filter((r) => status === 'all' || (status === 'Overdue' ? isOverdue(r) : r.status === status)),
    [db.rfqs, user, status],
  );
  // Dashboard links: ?status=... filters the list, ?view=<id> opens that RFQ's details.
  useEffect(() => {
    const s = params.get('status');
    if (s) setStatus(s);
    if (params.get('new') && can(actor, 'rfq.create')) {
      setEditing(null); setV(blank()); setFiles([]); setEstCost(''); setQuotedPrice(''); setErrors({}); setOpen(true);
      params.delete('new');
      setParams(params, { replace: true });
    }
    const v = params.get('view');
    if (v) {
      const r = db.rfqs.find((x) => x.id === v);
      if (r) setViewing(r);
      else setTimeout(() => toast({ title: 'RFQ not found', description: 'It does not exist or you do not have access to it.', variant: 'destructive' }), 0); // after the Toaster has mounted
      params.delete('view');
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  const set = <K extends keyof NewRfq>(k: K, val: NewRfq[K]) => { setV((p) => ({ ...p, [k]: val })); setErrors((p) => ({ ...p, [k]: '' })); };

  const submit = async () => {
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    const ok = editing
      ? await run(() => updateRfq(actor, editing.id, v), 'RFQ updated')
      : await run(() => createRfq(actor, v, files, can(actor, 'costing.view') && (estCost !== '' || quotedPrice !== '') ? { estimatedCost: Number(estCost || 0), quotedPrice: Number(quotedPrice || 0) } : undefined), 'RFQ registered');
    setBusy(false);
    if (ok) { setOpen(false); setEditing(null); setV(blank()); setFiles([]); setEstCost(''); setQuotedPrice(''); }
  };

  const startEdit = (r: Rfq) => {
    setEditing(r); setErrors({});
    setV({ customerRef: r.customerRef, customerName: r.customer.name, contact: r.customer.contact, email: r.customer.email, phone: r.customer.phone,
      project: r.project, receivedDate: r.receivedDate, deadline: r.deadline, priority: r.priority, source: r.source ?? 'Other' });
    setOpen(true);
  };
  const columns: Column<Rfq>[] = [
    { header: 'RFQ Ref', cell: (r) => <span className="font-medium whitespace-nowrap">{r.ref}</span> },
    { header: 'Customer', cell: (r) => <div><p>{r.customer.name}</p><p className="text-xs text-muted-foreground">{r.customer.contact}</p></div> },
    { header: 'Project', cell: (r) => r.project, hideOnMobile: true },
    { header: 'Source', cell: (r) => r.source ?? '—', hideOnMobile: true, className: 'whitespace-nowrap' },
    { header: 'Received', cell: (r) => fmtDate(r.receivedDate), hideOnMobile: true, className: 'whitespace-nowrap' },
    { header: 'Deadline', cell: (r) => fmtDate(r.deadline), className: 'whitespace-nowrap' },
    { header: 'Priority', cell: (r) => <PriorityBadge priority={r.priority} />, hideOnMobile: true },
    { header: 'Engineer', cell: (r) => <EngineerName id={r.primaryEngineerId} />, hideOnMobile: true },
    { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      cell: (r) => (
        <div className="flex gap-1">
          <Button size="icon" variant="outline" title="View" aria-label="View" onClick={() => setViewing(r)}><Eye className="h-4 w-4" /></Button>
          {can(actor, 'rfq.manage') && (
            <>
              <Button size="icon" variant="outline" title="Edit" aria-label="Edit" onClick={() => startEdit(r)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" className="text-red-600" title="Delete" aria-label="Delete" onClick={() => setDel(r)}><Trash2 className="h-4 w-4" /></Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="RFQ Register" description="Register incoming requests for quotation and keep their customer details and attachments."
        actions={can(actor, 'rfq.create') && <Button onClick={() => { setEditing(null); setV(blank()); setFiles([]); setEstCost(''); setQuotedPrice(''); setErrors({}); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />New RFQ</Button>} />
      <Card><CardContent className="p-4 md:p-6">
        <DataTable rows={rows} columns={columns} emptyTitle="No RFQs registered"
          emptyHint={can(actor, 'rfq.create') ? 'Click "New RFQ" to register the first one.' : 'RFQs assigned to you will appear here.'}
          searchText={(r) => `${r.ref} ${r.customerRef} ${r.customer.name} ${r.project}`}
          filters={
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger aria-label="Filter by status" className="w-full sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Overdue">Overdue</SelectItem>{RFQ_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          } />
      </CardContent></Card>

      <Dialog open={open} onOpenChange={(o) => !busy && (setOpen(o), !o && setEditing(null))}>
        <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          <DialogBanner icon={editing ? Pencil : FilePlus2}>
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-xl">{editing ? `Edit ${editing.ref}` : 'New RFQ'}</DialogTitle>
              <DialogDescription>{editing ? 'The RFQ reference number cannot be changed.' : <>Reference number <b className="text-foreground">{nextRfqRef()}</b> is assigned automatically.</>}</DialogDescription>
            </DialogHeader>
          </DialogBanner>
          <div className="p-6 space-y-4">
            <FormSection icon={Building2} title="Customer">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="cn">Customer name *</Label><Input id="cn" value={v.customerName} onChange={(e) => set('customerName', e.target.value)} /><FieldError msg={errors.customerName} /></div>
                <div><Label htmlFor="cr">Customer RFQ reference</Label><Input id="cr" value={v.customerRef} onChange={(e) => set('customerRef', e.target.value)} placeholder="Optional, must be unique" /><FieldError msg={errors.customerRef} /></div>
                <div><Label htmlFor="ct">Contact person</Label><Input id="ct" value={v.contact} onChange={(e) => set('contact', e.target.value)} /></div>
                <div><Label htmlFor="ph">Phone</Label><Input id="ph" value={v.phone} onChange={(e) => set('phone', e.target.value)} /><FieldError msg={errors.phone} /></div>
                <div className="sm:col-span-2"><Label htmlFor="em">Email</Label><Input id="em" type="email" value={v.email} onChange={(e) => set('email', e.target.value)} /><FieldError msg={errors.email} /></div>
              </div>
            </FormSection>

            <FormSection icon={ClipboardList} title="Proposal">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Label htmlFor="pj">Project / description *</Label><Input id="pj" value={v.project} onChange={(e) => set('project', e.target.value)} /><FieldError msg={errors.project} /></div>
                <div><Label htmlFor="rd">Received date *</Label><Input id="rd" type="date" value={v.receivedDate} onChange={(e) => set('receivedDate', e.target.value)} /><FieldError msg={errors.receivedDate} /></div>
                <div><Label htmlFor="dl">Submission deadline *</Label><Input id="dl" type="date" value={v.deadline} onChange={(e) => set('deadline', e.target.value)} /><FieldError msg={errors.deadline} /></div>
                <div>
                  <Label>Request source</Label>
                  <Select value={v.source} onValueChange={(x) => set('source', x as RfqSource)}>
                    <SelectTrigger aria-label="Request source"><SelectValue /></SelectTrigger>
                    <SelectContent>{RFQ_SOURCES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={v.priority} onValueChange={(p) => set('priority', p as Priority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{['High', 'Medium', 'Low'].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </FormSection>

            {!editing && can(actor, 'costing.view') && (
              <FormSection icon={Banknote} title="Commercial (optional)">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label htmlFor="nec">Estimated cost (OMR)</Label><Input id="nec" type="number" min={0} placeholder="What it costs us" value={estCost} onChange={(e) => setEstCost(e.target.value)} /></div>
                  <div><Label htmlFor="nqp">Quoted price (OMR)</Label><Input id="nqp" type="number" min={0} placeholder="What we charge the customer" value={quotedPrice} onChange={(e) => setQuotedPrice(e.target.value)} /></div>
                </div>
              </FormSection>
            )}

            {!editing && (
              <FormSection icon={Paperclip} title="Attachments">
                <label htmlFor="att" className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-6 text-center cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-colors">
                  <Upload className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Click to choose files</span>
                  <span className="text-xs text-muted-foreground">Max 1 MB each in this prototype</span>
                </label>
                <Input id="att" type="file" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
                {files.length > 0 && <ul className="mt-3 space-y-1">{files.map((f) => <li key={f.name} className="flex items-center gap-2 text-sm rounded-md border px-3 py-1.5"><Paperclip className="h-3.5 w-3.5 text-muted-foreground" /><span className="break-all">{f.name}</span><span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">{fmtSize(f.size)}</span></li>)}</ul>}
              </FormSection>
            )}
          </div>
          <DialogFooter className="sticky bottom-0 z-10 px-6 py-4 border-t bg-muted">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
            <Button onClick={submit} disabled={busy}>{busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}{editing ? 'Save changes' : 'Register RFQ'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {viewing && (() => {
            const attachments = db.documents.filter((d) => d.rfqId === viewing.id);
            const d = daysUntil(viewing.deadline);
            const done = viewing.status === 'Submitted';
            const tone = done ? 'bg-purple-100 text-purple-700 border-purple-200'
              : d < 0 ? 'bg-red-100 text-red-700 border-red-200'
              : d <= 5 ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-emerald-100 text-emerald-700 border-emerald-200';
            const deadlineText = done ? 'Submitted' : d < 0 ? `${-d} day${d === -1 ? '' : 's'} overdue` : d === 0 ? 'Due today' : `${d} day${d === 1 ? '' : 's'} left`;
            const Field = ({ icon: Icon, label, children }: { icon: typeof Building2; label: string; children: React.ReactNode }) => (
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon className="h-4 w-4" /></div>
                <div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><div className="text-sm font-medium break-words">{children || '—'}</div></div>
              </div>
            );
            const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
              <section className="rounded-xl border bg-card p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{title}</h3>
                {children}
              </section>
            );
            return (
              <>
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-5 border-b">
                  <DialogHeader className="space-y-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <DialogTitle className="text-xl">{viewing.ref}</DialogTitle>
                      <StatusBadge status={viewing.status} />
                      <PriorityBadge priority={viewing.priority} />
                      <Badge variant="outline" className={tone}><Clock className="h-3 w-3 mr-1" />{deadlineText}</Badge>
                    </div>
                    <DialogDescription className="text-sm">{viewing.project} · {viewing.customer.name}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Progress</span><span className="font-semibold text-foreground">{viewing.progress}%</span></div>
                    <Progress value={viewing.progress} className="h-2" />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Section title="Customer">
                      <div className="grid gap-3">
                        <Field icon={Building2} label="Customer">{viewing.customer.name}</Field>
                        <Field icon={Hash} label="Customer RFQ reference">{viewing.customerRef}</Field>
                        <Field icon={User} label="Contact person">{viewing.customer.contact}</Field>
                        <Field icon={Mail} label="Email">{viewing.customer.email}</Field>
                        <Field icon={Phone} label="Phone">{viewing.customer.phone}</Field>
                      </div>
                    </Section>
                    <div className="space-y-4">
                      <Section title="Timeline">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field icon={CalendarDays} label="Received">{fmtDate(viewing.receivedDate)}</Field>
                          <Field icon={CalendarClock} label="Submission deadline">{fmtDate(viewing.deadline)}</Field>
                          <Field icon={Inbox} label="Request source">{viewing.source}</Field>
                        </div>
                      </Section>
                      <Section title="Team">
                        <div className="grid gap-3">
                          <Field icon={User} label="Primary engineer">{viewing.primaryEngineerId && <EngineerName id={viewing.primaryEngineerId} />}</Field>
                          <Field icon={Users} label="Supporting engineers">{viewing.supportingIds.length ? viewing.supportingIds.map((id, i) => <span key={id}>{i > 0 && ', '}<EngineerName id={id} /></span>) : ''}</Field>
                        </div>
                      </Section>
                      {viewing.pendingActions && (
                        <Section title="Pending actions"><p className="text-sm">{viewing.pendingActions}</p></Section>
                      )}
                    </div>
                  </div>

                  {can(actor, 'costing.view') && <CostingPanel rfq={viewing} canEdit={can(actor, 'proposal.update', viewing)} onSave={(c) => run(() => setCosting(actor, viewing.id, c), 'Costing saved')} />}

                  <Section title={`Attachments & documents (${attachments.length})`}>
                    {attachments.length === 0 && <p className="text-sm text-muted-foreground">None uploaded.</p>}
                    <ul className="space-y-2">
                      {attachments.map((a) => (
                        <li key={a.id} className="flex items-center justify-between gap-3 text-sm rounded-lg border px-3 py-2 hover:bg-muted/50 transition-colors">
                          <span className="flex items-center gap-2 min-w-0"><Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" /><span className="break-all">{a.name}</span><span className="text-xs text-muted-foreground whitespace-nowrap">{a.category} · {fmtSize(a.size)}</span></span>
                          <span className="flex items-center gap-3 shrink-0">
                            <button type="button" aria-label={`Preview ${a.name}`} title="Preview" onClick={() => setPreviewDoc(a)} className="text-primary hover:opacity-70"><Eye className="h-4 w-4" /></button>
                            <a href={a.dataUrl} download={a.name} aria-label={`Download ${a.name}`} title="Download" className="text-primary hover:opacity-70"><Download className="h-4 w-4" /></a>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <DocPreview doc={previewDoc} onClose={() => setPreviewDoc(null)} />

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
    </>
  );
};

export default RfqRegister;
