import { useState } from 'react';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { Check, ClipboardList, RotateCcw, Loader2, PhoneCall, Plus, StickyNote, Tag } from 'lucide-react';
import { DialogBanner, FormSection } from '@/proposal-tracker/components/tracker/FormSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { addFollowup, toggleFollowup, todayStr, useDb, FOLLOWUP_TYPES, type Followup, type FollowupType } from '@/proposal-tracker/lib/db';
import { can, visibleRfqs } from '@/proposal-tracker/lib/permissions';
import { DataTable, FieldError, PageHeader, StatusBadge, daysUntil, fmtDate, fmtDateTime, run, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';
import { RfqPicker } from '@/proposal-tracker/components/tracker/RfqPicker';

const Followups = () => {
  const actor = useActor();
  const { user } = useAuth();
  const db = useDb();
  const name = useEmployeeName();
  const rfqs = visibleRfqs(user!, db.rfqs);
  const ids = new Set(rfqs.map((r) => r.id));
  const writable = rfqs.filter((r) => can(actor, 'followup.manage', r));
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ rfqId: '', type: 'Customer Clarification' as FollowupType, note: '', dueDate: todayStr() });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const rows = db.followups.filter((x) => ids.has(x.rfqId) && (filter === 'all' || x.rfqId === filter) && (typeFilter === 'all' || x.type === typeFilter))
    .sort((a, b) => Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate));
  const rfqRef = (id: string) => db.rfqs.find((r) => r.id === id)?.ref;

  const save = async () => {
    const e: Record<string, string> = {};
    if (!f.rfqId) e.rfqId = 'Select an RFQ.';
    if (f.note.trim().length < 3) e.note = 'Add a note.';
    if (!f.dueDate) e.dueDate = 'Due date is required.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const ok = await run(() => addFollowup(actor, f), 'Follow-up added');
    setBusy(false);
    if (ok) { setOpen(false); setF({ ...f, note: '' }); }
  };

  const columns: Column<Followup>[] = [
    { header: 'Type', cell: (x) => <div><p className="font-medium">{x.type}</p><p className="text-xs text-muted-foreground">{rfqRef(x.rfqId)}</p></div> },
    { header: 'Note', cell: (x) => x.note },
    { header: 'Due', cell: (x) => <span className={!x.done && daysUntil(x.dueDate) < 0 ? 'text-red-600 font-medium' : ''}>{fmtDate(x.dueDate)}</span>, className: 'whitespace-nowrap' },
    { header: 'Added by', cell: (x) => <div><p><EngineerName id={x.createdBy} /></p><p className="text-xs text-muted-foreground">{fmtDateTime(x.createdAt)}</p></div>, hideOnMobile: true },
    { header: 'Status', cell: (x) => <StatusBadge status={x.done ? 'Done' : !x.done && daysUntil(x.dueDate) < 0 ? 'Overdue' : 'Open'} /> },
    {
      header: 'Actions',
      cell: (x) => can(actor, 'followup.manage', db.rfqs.find((r) => r.id === x.rfqId)) && (
        <Button size="icon" variant="outline" title={x.done ? 'Re-open' : 'Mark done'} aria-label={x.done ? 'Re-open' : 'Mark done'} onClick={() => run(() => toggleFollowup(actor, x.id), x.done ? 'Re-opened' : 'Marked done')}>{x.done ? <RotateCcw className="h-4 w-4" /> : <Check className="h-4 w-4" />}</Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Follow-ups" description="Customer clarifications, vendor responses, next actions and reminders — with history and due dates."
        actions={writable.length > 0 && <Button onClick={() => { setOpen(true); setErrors({}); }}><Plus className="h-4 w-4 mr-1" />Add follow-up</Button>} />
      <Card><CardContent className="p-4 md:p-6">
        <DataTable rows={rows} columns={columns} emptyTitle="No follow-ups" emptyHint="Add one to track a customer or vendor response."
          searchText={(x) => `${x.type} ${x.note} ${rfqRef(x.rfqId) ?? ''}`}
          filters={
            <>
              <RfqPicker rfqs={rfqs} value={filter} onChange={setFilter} allowAll placeholder="Filter by RFQ" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger aria-label="Filter by type" className="w-full sm:w-56"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All types</SelectItem>{FOLLOWUP_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </>
          } />
      </CardContent></Card>

      <Dialog open={open} onOpenChange={(o) => !busy && setOpen(o)}>
        <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          <DialogBanner icon={PhoneCall}>
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-xl">Add follow-up</DialogTitle>
              <DialogDescription>Track a customer or vendor response and set a reminder date.</DialogDescription>
            </DialogHeader>
          </DialogBanner>
          <div className="p-6 space-y-4">
            <FormSection icon={ClipboardList} title="Proposal">
              <Label className="sr-only">RFQ *</Label>
              <RfqPicker rfqs={writable} value={f.rfqId} onChange={(id) => setF({ ...f, rfqId: id })} />
              <FieldError msg={errors.rfqId} />
            </FormSection>

            <FormSection icon={Tag} title="Follow-up type">
              <div className="grid gap-2 sm:grid-cols-2">
                {FOLLOWUP_TYPES.map((t) => {
                  const on = f.type === t;
                  return (
                    <button key={t} type="button" onClick={() => setF({ ...f, type: t })} aria-pressed={on}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-left transition-colors ${on ? 'border-primary bg-primary/10 font-medium' : 'hover:bg-muted/50'}`}>
                      <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${on ? 'bg-primary border-primary text-primary-foreground' : ''}`}>{on && <Check className="h-3 w-3" />}</span>
                      <span className="truncate">{t}</span>
                    </button>
                  );
                })}
              </div>
            </FormSection>

            <FormSection icon={StickyNote} title="Details">
              <div className="space-y-4">
                <div><Label htmlFor="fn">Note *</Label><Textarea id="fn" rows={3} placeholder="What needs to be followed up?" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /><FieldError msg={errors.note} /></div>
                <div><Label htmlFor="fd">Due / reminder date *</Label><Input id="fd" type="date" value={f.dueDate} onChange={(e) => setF({ ...f, dueDate: e.target.value })} /><FieldError msg={errors.dueDate} /></div>
              </div>
            </FormSection>
          </div>
          <DialogFooter className="sticky bottom-0 z-10 px-6 py-4 border-t bg-muted">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Add follow-up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Followups;
