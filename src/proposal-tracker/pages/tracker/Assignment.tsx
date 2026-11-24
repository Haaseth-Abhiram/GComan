import { useState } from 'react';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { Bell, CalendarClock, Check, Flag, Loader2, Mail, User, UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assignRfq, emailDeadlineAlert, useDb, type Priority, type EmailLog, type Rfq } from '@/proposal-tracker/lib/db';
import { can } from '@/proposal-tracker/lib/permissions';
import { DialogBanner, FormSection } from '@/proposal-tracker/components/tracker/FormSection';
import { toast } from '@/hooks/use-toast';
import { DataTable, FieldError, PageHeader, PriorityBadge, StatusBadge, fmtDate, fmtDateTime, run, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';

const Assignment = () => {
  const actor = useActor();
  const db = useDb();
  const name = useEmployeeName();
  const [target, setTarget] = useState<Rfq | null>(null);
  const [primary, setPrimary] = useState('');
  const [supporting, setSupporting] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [targetDate, setTargetDate] = useState('');
  const [alertOn, setAlertOn] = useState(true);
  const [alertDays, setAlertDays] = useState(5);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!can(actor, 'rfq.assign')) return <PageHeader title="Engineer Assignment" description="Only Admins can assign engineers." />;

  const open = (r: Rfq) => {
    setTarget(r); setPrimary(r.primaryEngineerId ?? ''); setSupporting(r.supportingIds); setPriority(r.priority);
    setTargetDate(r.targetDate); setAlertOn(r.alertEnabled ?? true); setAlertDays(r.alertDaysBefore ?? 5); setErr('');
  };
  const save = async () => {
    if (!primary) return setErr('Select a primary engineer.');
    if (!targetDate) return setErr('Set a target date.');
    if (alertOn && (!Number.isInteger(alertDays) || alertDays < 1 || alertDays > 60)) return setErr('Alert days must be between 1 and 60.');
    setBusy(true);
    const ok = await run(() => assignRfq(actor, target!.id, { primary, supporting, priority, targetDate, alertEnabled: alertOn, alertDaysBefore: alertDays }), 'Assignment saved');
    setBusy(false);
    if (ok) setTarget(null);
  };
  const sendAlert = (r: Rfq) => {
    try {
      const names = emailDeadlineAlert(actor, r.id);
      toast({ title: 'Email has been sent', description: `Deadline alert for ${r.ref} sent to ${names.join(', ')}.` });
    } catch (e) {
      toast({ title: 'Could not send', description: e instanceof Error ? e.message : 'Unexpected error', variant: 'destructive' });
    }
  };
  const engineers = db.employees.filter((e) => e.role === 'engineer');
  const open_ = db.rfqs.filter((r) => r.status !== 'Submitted');

  const columns: Column<Rfq>[] = [
    { header: 'RFQ', cell: (r) => <div><p className="font-medium whitespace-nowrap">{r.ref}</p><p className="text-xs text-muted-foreground">{r.customer.name}</p></div> },
    { header: 'Primary engineer', cell: (r) => <EngineerName id={r.primaryEngineerId} /> },
    { header: 'Supporting', cell: (r) => (r.supportingIds.length ? r.supportingIds.map((id, i) => <span key={id}>{i > 0 && ', '}<EngineerName id={id} /></span>) : '—'), hideOnMobile: true },
    { header: 'Priority', cell: (r) => <PriorityBadge priority={r.priority} />, hideOnMobile: true },
    { header: 'Deadline', cell: (r) => fmtDate(r.deadline), hideOnMobile: true, className: 'whitespace-nowrap' },
    { header: 'Target', cell: (r) => fmtDate(r.targetDate), hideOnMobile: true, className: 'whitespace-nowrap' },
    { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
    { header: 'Deadline alert', cell: (r) => (r.alertEnabled ?? true) ? `${r.alertDaysBefore ?? 5} days before` : 'Off', hideOnMobile: true, className: 'whitespace-nowrap' },
    { header: 'Actions', cell: (r) => (
      <div className="flex gap-2 flex-wrap">
        <Button size="icon" variant="outline" title={r.primaryEngineerId ? 'Reassign' : 'Assign'} aria-label={r.primaryEngineerId ? 'Reassign' : 'Assign'} onClick={() => open(r)}><UserPlus className="h-4 w-4" /></Button>
        {r.primaryEngineerId && <Button size="icon" variant="outline" title="Email alert" aria-label="Email alert" onClick={() => sendAlert(r)}><Mail className="h-4 w-4" /></Button>}
      </div>
    ) },
  ];

  const mailCols: Column<EmailLog>[] = [
    { header: 'Sent', cell: (m) => fmtDateTime(m.at), className: 'whitespace-nowrap' },
    { header: 'RFQ', cell: (m) => db.rfqs.find((r) => r.id === m.rfqId)?.ref ?? '—', className: 'whitespace-nowrap' },
    { header: 'To', cell: (m) => m.toIds.map((id) => name(id)).join(', ') },
    { header: 'Type', cell: (m) => (m.kind === 'daily' ? 'Daily (automatic)' : 'Manual'), hideOnMobile: true },
    { header: 'Message', cell: (m) => m.subject, hideOnMobile: true },
  ];

  return (
    <>
      <PageHeader title="Engineer Assignment" description="Assign a primary and supporting engineers, set priority and target date." />
      <Card><CardContent className="p-4 md:p-6">
        <DataTable rows={open_} columns={columns} emptyTitle="Nothing to assign" searchText={(r) => `${r.ref} ${r.customer.name} ${name(r.primaryEngineerId)}`} />
      </CardContent></Card>

      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Alert emails sent</CardTitle>
          <CardDescription>Sent automatically once a day from the alert start date until the deadline, or when you click Email alert. Prototype: emails are recorded here and shown to engineers in the portal; a real mail server is needed for delivery to inboxes.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable rows={db.emailLog} columns={mailCols} emptyTitle="No alert emails yet" pageSize={8} />
        </CardContent>
      </Card>

      <Dialog open={!!target} onOpenChange={(o) => !busy && !o && setTarget(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          <DialogBanner icon={UserPlus}>
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-xl">Assign engineers — {target?.ref}</DialogTitle>
              <DialogDescription>{target?.customer.name}{target ? ` · ${target.project}` : ''}</DialogDescription>
            </DialogHeader>
            {target && <p className="mt-2 inline-flex items-center gap-1 text-xs rounded-full border bg-background/70 px-2.5 py-1"><CalendarClock className="h-3 w-3" />Deadline {fmtDate(target.deadline)}</p>}
          </DialogBanner>
          <div className="p-6 space-y-4">
            <FormSection icon={User} title="Primary engineer">
              <Label className="sr-only">Primary engineer *</Label>
              <Select value={primary} onValueChange={(p) => { setPrimary(p); setSupporting((x) => x.filter((y) => y !== p)); setErr(''); }}>
                <SelectTrigger><SelectValue placeholder="Select engineer" /></SelectTrigger>
                <SelectContent>{engineers.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </FormSection>

            <FormSection icon={Users} title="Supporting engineers">
              <div className="grid gap-2 sm:grid-cols-2">
                {engineers.filter((e) => e.id !== primary).map((e) => {
                  const on = supporting.includes(e.id);
                  return (
                    <label key={e.id} className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${on ? 'border-primary bg-primary/10' : 'hover:bg-muted/50'}`}>
                      <input type="checkbox" className="sr-only" checked={on}
                        onChange={(ev) => setSupporting((x) => (ev.target.checked ? [...x, e.id] : x.filter((y) => y !== e.id)))} />
                      <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${on ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {on ? <Check className="h-4 w-4" /> : e.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('')}
                      </span>
                      <span className="truncate">{e.name}</span>
                    </label>
                  );
                })}
              </div>
            </FormSection>

            <FormSection icon={Flag} title="Priority & target">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(p) => setPriority(p as Priority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{['High', 'Medium', 'Low'].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="td">Target date *</Label><Input id="td" type="date" value={targetDate} onChange={(e) => { setTargetDate(e.target.value); setErr(''); }} /></div>
              </div>
            </FormSection>

            <FormSection icon={Bell} title="Deadline alert">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" checked={alertOn} onChange={(ev) => setAlertOn(ev.target.checked)} />
                Send deadline alert to the engineers
              </label>
              {alertOn && (
                <div className="flex items-center gap-2 text-sm mt-3">
                  Start alerting
                  <Input aria-label="Alert days before deadline" className="w-20" type="number" min={1} max={60} value={alertDays} onChange={(e) => setAlertDays(Number(e.target.value))} />
                  days before the deadline
                </div>
              )}
            </FormSection>
            <FieldError msg={err} />
          </div>
          <DialogFooter className="sticky bottom-0 z-10 px-6 py-4 border-t bg-muted">
            <Button variant="outline" onClick={() => setTarget(null)} disabled={busy}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Save assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Assignment;
