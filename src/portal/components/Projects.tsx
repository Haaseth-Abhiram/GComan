/** Projects: "My projects" and one project (tasks, team, updates). The admin uses the same project view. */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, Loader2, Plus, Send, Trash2, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fmtDate } from '@/portal/lib/attendance';
import { whenText } from '@/portal/lib/notifications';
import {
  PRIORITY_STYLE, PRIORITY_TEXT, PROJECTS_KEY, PROJECT_STATUS_STYLE, PROJECT_STATUS_TEXT, TASK_STATUS_TEXT, addTask,
  deleteTask, fetchMyProjects, fetchProject, postUpdate, setTaskStatus, type Priority, type Project, type ProjectDetail,
  type Task, type TaskStatus,
} from '@/portal/lib/projects';

const Spinner = () => <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
const NOBODY = '__nobody__';

export const ProjectBadge = ({ status }: { status: Project['status'] }) => (
  <Badge variant="outline" className={PROJECT_STATUS_STYLE[status]}>{PROJECT_STATUS_TEXT[status]}</Badge>
);

export const Progress = ({ done, total }: { done: number; total: number }) => (
  <div>
    <div className="h-2 overflow-hidden rounded-full bg-[#e9edf7]">
      <div className="h-full rounded-full bg-gradient-to-r from-[#223f96] to-[#3f63c9]" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
    </div>
    <p className="mt-1 text-xs text-muted-foreground">{total ? `${done} of ${total} tasks done` : 'No tasks yet'}</p>
  </div>
);

export const ProjectCard = ({ p, to }: { p: Project; to: string }) => (
  <Link to={to} className="block rounded-2xl border border-[#e7e9ee] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#223f96]/30">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="font-mono text-[11px] text-muted-foreground">{p.code}</p>
        <p className="truncate font-bold text-[#101a3a]">{p.name}</p>
      </div>
      <ProjectBadge status={p.status} />
    </div>
    <div className="my-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{p.members}</span>
      {p.end_date && <span className={`inline-flex items-center gap-1 ${p.overdue ? 'font-semibold text-red-600' : ''}`}><CalendarDays className="h-3.5 w-3.5" />Due {fmtDate(p.end_date)}</span>}
      <Badge variant="outline" className={PRIORITY_STYLE[p.priority]}>{PRIORITY_TEXT[p.priority]}</Badge>
    </div>
    <Progress done={p.tasks_done} total={p.tasks_total} />
  </Link>
);

export const TaskLine = ({ t }: { t: Task }) => (
  <span className="text-xs text-muted-foreground">
    {t.project ? `${t.project} · ` : ''}{t.assignee ?? 'Unassigned'}
    {t.due_date && <span className={t.overdue ? 'font-semibold text-red-600' : ''}> · due {fmtDate(t.due_date)}{t.overdue ? ' (late)' : ''}</span>}
  </span>
);

export const MyProjectsPage = () => {
  const { data, isLoading, error } = useQuery({ queryKey: [...PROJECTS_KEY, 'mine'], queryFn: fetchMyProjects });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My projects</h1>
      {isLoading ? <Spinner /> : error || !data ? <p className="text-sm text-destructive">{(error as Error)?.message}</p> : (
        <>
          {!data.projects.length
            ? <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No projects assigned yet. The admin adds you to projects.</CardContent></Card>
            : <div className="grid gap-4 md:grid-cols-2">{data.projects.map((p) => <ProjectCard key={p.id} p={p} to={`/portal/projects/${p.id}`} />)}</div>}
          <Card>
            <CardHeader><CardTitle className="text-base">My open tasks</CardTitle></CardHeader>
            <CardContent>
              {!data.tasks.length ? <p className="text-sm text-muted-foreground">No open tasks.</p> : (
                <ul className="divide-y">
                  {data.tasks.map((t) => (
                    <li key={t.id}>
                      <Link to={`/portal/projects/${t.project_id}`} className="flex items-center justify-between gap-3 py-2.5 hover:bg-muted/50">
                        <span><span className="block text-sm font-medium">{t.title}</span><TaskLine t={t} /></span>
                        <Badge variant="outline">{TASK_STATUS_TEXT[t.status]}</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

const emptyTask = { title: '', description: '', assignee_id: '', due_date: '', priority: 'medium' as Priority };

export const ProjectView = ({ id, back }: { id: string; back: string }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const key = [...PROJECTS_KEY, 'one', id];
  const { data: p, isLoading, error } = useQuery({ queryKey: key, queryFn: () => fetchProject(id) });
  const [task, setTask] = useState<typeof emptyTask | null>(null);
  const [late, setLate] = useState<{ task: Task; reason: string } | null>(null);
  const [update, setUpdate] = useState('');
  const [removing, setRemoving] = useState<Task | null>(null);

  const done = (fresh: ProjectDetail) => { qc.setQueryData(key, fresh); void qc.invalidateQueries({ queryKey: PROJECTS_KEY }); };
  const fail = (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' });
  const add = useMutation({ mutationFn: () => addTask(id, task!), onSuccess: (f) => { done(f); setTask(null); toast({ title: 'Task added' }); }, onError: fail });
  const status = useMutation({
    mutationFn: (v: { task: string; status: TaskStatus; reason: string | null }) => setTaskStatus(v.task, v.status, v.reason),
    onSuccess: (f) => { done(f); setLate(null); }, onError: fail,
  });
  const post = useMutation({ mutationFn: () => postUpdate(id, update), onSuccess: (f) => { done(f); setUpdate(''); }, onError: fail });
  const remove = useMutation({
    mutationFn: (t: Task) => deleteTask(t.id),
    onSuccess: () => { setRemoving(null); void qc.invalidateQueries({ queryKey: PROJECTS_KEY }); }, onError: fail,
  });

  if (isLoading) return <Spinner />;
  if (error || !p) return <p className="text-sm text-muted-foreground">{(error as Error)?.message} <Link className="underline" to={back}>Back</Link></p>;

  const change = (t: Task, next: TaskStatus) => {
    // Finishing a late task needs a reason first.
    if (next === 'done' && t.overdue && !t.delay_reason) setLate({ task: t, reason: '' });
    else status.mutate({ task: t.id, status: next, reason: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" className="-ml-2 mb-1" asChild><Link to={back}><ArrowLeft className="mr-1 h-4 w-4" />Projects</Link></Button>
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold">{p.name}<ProjectBadge status={p.status} /></h1>
        <p className="text-sm text-muted-foreground">
          {p.code} · Manager: {p.manager ?? '—'}{p.start_date && ` · Start ${fmtDate(p.start_date)}`}{p.end_date && ` · Deadline ${fmtDate(p.end_date)}`}
          {p.overdue && <span className="font-semibold text-red-600"> (past the deadline)</span>}
        </p>
        {p.description && <p className="mt-2 whitespace-pre-wrap text-sm">{p.description}</p>}
        <div className="mt-3 max-w-md"><Progress done={p.tasks_done} total={p.tasks_total} /></div>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base">Tasks &amp; deadlines</CardTitle>
          {p.can_add_task && <Button size="sm" onClick={() => setTask(emptyTask)}><Plus className="mr-1 h-4 w-4" />Add task</Button>}
        </CardHeader>
        <CardContent>
          {!p.tasks.length ? <p className="text-sm text-muted-foreground">No tasks yet.</p> : (
            <ul className="divide-y">
              {p.tasks.map((t) => (
                <li key={t.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${t.status === 'done' ? 'text-muted-foreground line-through' : ''}`}>{t.title}</p>
                    <TaskLine t={t} />
                    {t.description && <p className="whitespace-pre-wrap text-xs text-muted-foreground">{t.description}</p>}
                    {t.delay_reason && <p className="text-xs text-amber-700">Late because: {t.delay_reason}</p>}
                  </div>
                  <Badge variant="outline" className={PRIORITY_STYLE[t.priority]}>{PRIORITY_TEXT[t.priority]}</Badge>
                  <Select value={t.status} disabled={!p.can_work || status.isPending} onValueChange={(v) => change(t, v as TaskStatus)}>
                    <SelectTrigger className="w-36" aria-label={`Status of ${t.title}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{(Object.keys(TASK_STATUS_TEXT) as TaskStatus[]).map((s) => <SelectItem key={s} value={s}>{TASK_STATUS_TEXT[s]}</SelectItem>)}</SelectContent>
                  </Select>
                  {p.can_manage && <Button size="icon" variant="ghost" className="text-destructive" aria-label={`Delete ${t.title}`} onClick={() => setRemoving(t)}><Trash2 className="h-4 w-4" /></Button>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Team</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {p.team.map((m) => <li key={m.id} className="text-sm"><span className="font-medium">{m.full_name}</span><span className="block text-xs text-muted-foreground">{[m.designation, m.employee_code].filter(Boolean).join(' · ')}</span></li>)}
              {!p.team.length && <li className="text-sm text-muted-foreground">No members yet.</li>}
            </ul>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Project updates</CardTitle><CardDescription>Seen by everyone on the project.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {p.can_work && (
              <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); post.mutate(); }}>
                <Textarea aria-label="New update" placeholder="What changed?" maxLength={2000} value={update} onChange={(e) => setUpdate(e.target.value)} />
                <div className="flex justify-end"><Button type="submit" size="sm" disabled={post.isPending || !update.trim()}><Send className="mr-1 h-4 w-4" />Post update</Button></div>
              </form>
            )}
            <ul className="space-y-3">
              {p.updates.map((u) => <li key={u.id} className="rounded-xl border p-3"><p className="whitespace-pre-wrap break-words text-sm">{u.body}</p><p className="mt-1 text-xs text-muted-foreground">{u.author} · {whenText(u.created_at)}</p></li>)}
              {!p.updates.length && <li className="text-sm text-muted-foreground">No updates yet.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!task} onOpenChange={(o) => !o && setTask(null)}>
        <DialogContent>
          {task && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
              <DialogHeader><DialogTitle>Add task</DialogTitle><DialogDescription>{p.name}</DialogDescription></DialogHeader>
              <div className="space-y-1.5"><Label htmlFor="t-title">Task</Label><Input id="t-title" required maxLength={200} value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label htmlFor="t-desc">Details (optional)</Label><Textarea id="t-desc" maxLength={2000} value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} /></div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5"><Label>Assign to</Label>
                  <Select value={task.assignee_id || NOBODY} onValueChange={(v) => setTask({ ...task, assignee_id: v === NOBODY ? '' : v })}>
                    <SelectTrigger aria-label="Assign to"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value={NOBODY}>Nobody</SelectItem>{p.team.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>)}</SelectContent>
                  </Select></div>
                <div className="space-y-1.5"><Label htmlFor="t-due">Due date</Label><Input id="t-due" type="date" value={task.due_date} onChange={(e) => setTask({ ...task, due_date: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Priority</Label>
                  <Select value={task.priority} onValueChange={(v) => setTask({ ...task, priority: v as Priority })}>
                    <SelectTrigger aria-label="Priority"><SelectValue /></SelectTrigger>
                    <SelectContent>{(Object.keys(PRIORITY_TEXT) as Priority[]).map((k) => <SelectItem key={k} value={k}>{PRIORITY_TEXT[k]}</SelectItem>)}</SelectContent>
                  </Select></div>
              </div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setTask(null)}>Cancel</Button><Button type="submit" disabled={add.isPending || !task.title.trim()}>Add task</Button></DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!late} onOpenChange={(o) => !o && setLate(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Why was this task late?</DialogTitle><DialogDescription>{late?.task.title}</DialogDescription></DialogHeader>
          <Textarea aria-label="Reason" maxLength={1000} value={late?.reason ?? ''} onChange={(e) => late && setLate({ ...late, reason: e.target.value })} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setLate(null)}>Cancel</Button>
            <Button disabled={status.isPending || !late?.reason.trim()} onClick={() => late && status.mutate({ task: late.task.id, status: 'done', reason: late.reason })}>Mark done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete this task?</DialogTitle><DialogDescription>{removing?.title}</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setRemoving(null)}>Cancel</Button><Button variant="destructive" disabled={remove.isPending} onClick={() => removing && remove.mutate(removing)}>Delete task</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const ProjectPage = () => <ProjectView id={useParams().projectId ?? ''} back="/portal/projects" />;
