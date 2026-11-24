import { useState } from 'react';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { CalendarClock, CalendarDays, ClipboardList, Eye, Gauge, ListChecks, Loader2, Pencil, Plus, StickyNote, Trash2, User } from 'lucide-react';
import { DialogBanner, FormSection } from '@/proposal-tracker/components/tracker/FormSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { deleteTask, saveTask, todayStr, useDb, TASK_STATUSES, PROGRESS_STEPS, type Priority, type Task, type TaskStatus } from '@/proposal-tracker/lib/db';
import { can, visibleRfqs } from '@/proposal-tracker/lib/permissions';
import { DataTable, FieldError, PageHeader, PriorityBadge, StatusBadge, daysUntil, fmtDate, run, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';
import { RfqPicker } from '@/proposal-tracker/components/tracker/RfqPicker';

type Form = { id?: string; rfqId: string; title: string; description: string; ownerId: string; startDate: string; dueDate: string; priority: Priority; status: TaskStatus; completion: number };
const blank = (rfqId = ''): Form => ({ rfqId, title: '', description: '', ownerId: '', startDate: todayStr(), dueDate: '', priority: 'Medium', status: 'In Progress', completion: 25 });

const Tasks = () => {
  const actor = useActor();
  const { user } = useAuth();
  const db = useDb();
  const name = useEmployeeName();
  const rfqs = visibleRfqs(user!, db.rfqs);
  const ids = new Set(rfqs.map((r) => r.id));
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState<Form | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [del, setDel] = useState<Task | null>(null);
  const [viewing, setViewing] = useState<Task | null>(null);
  const [busy, setBusy] = useState(false);

  const rows = db.tasks.filter((t) => ids.has(t.rfqId) && (filter === 'all' || t.rfqId === filter));
  const rfqOf = (id: string) => db.rfqs.find((r) => r.id === id);
  // A task needs an owner, and owners come from the RFQ's assigned engineers — so only offer assigned RFQs.
  const creatable = rfqs.filter((r) => can(actor, 'task.manage', r) && !!r.primaryEngineerId);
  const rowsEditable = (t: Task) => can(actor, 'task.manage', rfqOf(t.rfqId)) || t.ownerId === actor.id;
  const ownerOptions = (rfqId: string) => {
    const r = rfqOf(rfqId);
    return db.employees.filter((e) => r && (e.id === r.primaryEngineerId || r.supportingIds.includes(e.id)));
  };

  const save = async () => {
    const f = form!;
    const e: Record<string, string> = {};
    if (!f.rfqId) e.rfqId = 'Select an RFQ.';
    if (f.title.trim().length < 3) e.title = 'Task title is required.';
    if (!f.ownerId) e.ownerId = 'Assign an engineer.';
    if (!f.dueDate) e.dueDate = 'Due date is required.';
    else if (f.dueDate < f.startDate) e.dueDate = 'Due date cannot be before start date.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const ok = await run(() => saveTask(actor, f), f.id ? 'Task updated' : 'Task created');
    setBusy(false);
    if (ok) setForm(null);
  };
  const ownerOnly = !!form?.id && !can(actor, 'task.manage', rfqOf(form.rfqId)); // may only change status/completion

  const actions = (t: Task) => (
    <>
      <Button size="icon" variant="outline" title="View" aria-label={`View task ${t.title}`} onClick={() => setViewing(t)}><Eye className="h-4 w-4" /></Button>
      {rowsEditable(t) && <Button size="icon" variant="outline" title="Edit" aria-label={`Edit task ${t.title}`} onClick={() => { setForm({ ...t }); setErrors({}); }}><Pencil className="h-4 w-4" /></Button>}
      {can(actor, 'task.manage', rfqOf(t.rfqId)) && <Button size="icon" variant="outline" className="text-red-600" title="Delete" aria-label={`Delete task ${t.title}`} onClick={() => setDel(t)}><Trash2 className="h-4 w-4" /></Button>}
    </>
  );

  const columns: Column<Task>[] = [
    { header: 'Task', cell: (t) => <div><p className="font-medium">{t.title}</p><p className="text-xs text-muted-foreground">{rfqOf(t.rfqId)?.ref}</p><div className="md:hidden mt-2 flex flex-wrap gap-1">{actions(t)}</div></div> },
    { header: 'Engineer', cell: (t) => <EngineerName id={t.ownerId} />, hideOnMobile: true },
    { header: 'Start', cell: (t) => fmtDate(t.startDate), hideOnMobile: true, className: 'whitespace-nowrap' },
    { header: 'Due', cell: (t) => <span className={t.status !== 'Submitted' && daysUntil(t.dueDate) < 0 ? 'text-red-600 font-medium' : ''}>{fmtDate(t.dueDate)}</span>, className: 'whitespace-nowrap' },
    { header: 'Priority', cell: (t) => <PriorityBadge priority={t.priority} />, hideOnMobile: true },
    { header: 'Completion', cell: (t) => <div className="min-w-20"><Progress value={t.completion} className="h-2" /><span className="text-xs text-muted-foreground">{t.completion}%</span></div> },
    { header: 'Status', cell: (t) => <StatusBadge status={t.status} /> },
    {
      header: 'Actions',
      hideOnMobile: true, // on phones the same buttons appear under the task title
      cell: (t) => <div className="flex gap-1 items-center">{actions(t)}</div>,
    },
  ];

  return (
    <>
      <PageHeader title="Task Tracker" description="Break proposals into tasks, assign engineers and track completion."
        actions={creatable.length > 0 && <Button onClick={() => { setForm(blank(filter !== 'all' ? filter : '')); setErrors({}); }}><Plus className="h-4 w-4 mr-1" />New task</Button>} />
      <Card><CardContent className="p-4 md:p-6">
        <DataTable rows={rows} columns={columns} emptyTitle="No tasks" emptyHint="Create a task to break a proposal into steps."
          searchText={(t) => `${t.title} ${name(t.ownerId)} ${rfqOf(t.rfqId)?.ref ?? ''}`}
          filters={<RfqPicker rfqs={rfqs} value={filter} onChange={setFilter} allowAll placeholder="Filter by RFQ" />} />
      </CardContent></Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          {viewing && (() => {
            const t = db.tasks.find((x) => x.id === viewing.id) ?? viewing; // live copy
            const r = rfqOf(t.rfqId);
            const late = t.status !== 'Submitted' && daysUntil(t.dueDate) < 0;
            const Field = ({ icon: Icon, label, children }: { icon: typeof User; label: string; children: React.ReactNode }) => (
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Icon className="h-4 w-4" /></div>
                <div className="min-w-0"><p className="text-xs text-muted-foreground">{label}</p><div className="text-sm font-medium break-words">{children || '—'}</div></div>
              </div>
            );
            return (
              <>
                <DialogBanner icon={ListChecks}>
                  <DialogHeader className="space-y-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <DialogTitle className="text-xl">{t.title}</DialogTitle>
                      <StatusBadge status={t.status} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <DialogDescription>{r ? `${r.ref} — ${r.customer.name}` : ''}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Completion</span><span className="font-semibold text-foreground">{t.completion}%</span></div>
                    <Progress value={t.completion} className="h-2" />
                  </div>
                </DialogBanner>
                <div className="p-6 space-y-4">
                  <FormSection icon={User} title="Details">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field icon={User} label="Engineer"><EngineerName id={t.ownerId} /></Field>
                      <Field icon={CalendarDays} label="Start date">{fmtDate(t.startDate)}</Field>
                      <Field icon={CalendarClock} label="Due date"><span className={late ? 'text-red-600' : ''}>{fmtDate(t.dueDate)}{late ? ' (overdue)' : ''}</span></Field>
                    </div>
                  </FormSection>
                  <FormSection icon={StickyNote} title="Description">
                    {t.description ? <p className="text-sm whitespace-pre-wrap">{t.description}</p> : <p className="text-sm text-muted-foreground">No description.</p>}
                  </FormSection>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={!!form} onOpenChange={(o) => !busy && !o && setForm(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          <DialogBanner icon={form?.id ? Pencil : Plus}>
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="text-xl">{form?.id ? 'Update task' : 'New task'}</DialogTitle>
              <DialogDescription>{form?.rfqId ? `${rfqOf(form.rfqId)?.ref ?? ''} — ${rfqOf(form.rfqId)?.customer.name ?? ''}` : 'Break a proposal into a step and assign an engineer.'}</DialogDescription>
            </DialogHeader>
          </DialogBanner>
          {form && (
            <div className="p-6 space-y-4">
              <FormSection icon={ClipboardList} title="Task">
                <div className="space-y-4">
                  <div>
                    <Label>RFQ *</Label>
                    <RfqPicker rfqs={ownerOnly ? rfqs : creatable} value={form.rfqId} onChange={(id) => setForm({ ...form, rfqId: id, ownerId: '' })} />
                    <FieldError msg={errors.rfqId} />
                  </div>
                  <div><Label htmlFor="tt">Title *</Label><Input id="tt" disabled={ownerOnly} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><FieldError msg={errors.title} /></div>
                  <div><Label htmlFor="td">Description</Label><Textarea id="td" rows={2} disabled={ownerOnly} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                  <div>
                    <Label>Engineer *</Label>
                    <Select disabled={ownerOnly || !form.rfqId || ownerOptions(form.rfqId).length === 0} value={form.ownerId} onValueChange={(v) => setForm({ ...form, ownerId: v })}>
                      <SelectTrigger><SelectValue placeholder={form.rfqId ? 'Select engineer' : 'Select an RFQ first'} /></SelectTrigger>
                      <SelectContent>{ownerOptions(form.rfqId).map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                    </Select>
                    {form.rfqId && ownerOptions(form.rfqId).length === 0 && (
                      <p className="text-xs text-muted-foreground mt-1">No engineers are assigned to this RFQ yet. Assign them in Engineer Assignment first.</p>
                    )}
                    <FieldError msg={errors.ownerId} />
                  </div>
                </div>
              </FormSection>

              <FormSection icon={CalendarDays} title="Schedule & priority">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label htmlFor="ts">Start date</Label><Input id="ts" type="date" disabled={ownerOnly} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                  <div><Label htmlFor="tdd">Due date *</Label><Input id="tdd" type="date" disabled={ownerOnly} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /><FieldError msg={errors.dueDate} /></div>
                  <div>
                    <Label>Priority</Label>
                    <Select disabled={ownerOnly} value={form.priority} onValueChange={(p) => setForm({ ...form, priority: p as Priority })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{['High', 'Medium', 'Low'].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(s) => setForm({ ...form, status: s as TaskStatus, completion: s === 'Submitted' ? 100 : form.completion < 25 || form.completion === 100 ? 75 : form.completion })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{TASK_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </FormSection>

              <FormSection icon={Gauge} title="Completion">
                <div className="flex items-baseline justify-between"><Label htmlFor="tc">Progress</Label><span className="text-2xl font-bold text-primary">{form.completion}%</span></div>
                <input
                  id="tc" type="range" min={25} max={100} step={25} value={form.completion}
                  onChange={(e) => {
                    const p = Number(e.target.value);
                    setForm({ ...form, completion: p, status: p === 100 ? 'Submitted' : form.status === 'Submitted' ? 'In Progress' : form.status });
                  }}
                  className="w-full mt-2 accent-primary cursor-pointer"
                  aria-valuetext={`${form.completion} percent`}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                  {PROGRESS_STEPS.map((p) => <span key={p}>{p}%</span>)}
                </div>
                <Progress value={form.completion} className="h-2 mt-3" />
              </FormSection>
            </div>
          )}
          <DialogFooter className="sticky bottom-0 z-10 px-6 py-4 border-t bg-muted">
            <Button variant="outline" onClick={() => setForm(null)} disabled={busy}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Save task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete task?</AlertDialogTitle><AlertDialogDescription>"{del?.title}" will be removed permanently.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => run(() => deleteTask(actor, del!.id), 'Task deleted')}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Tasks;
