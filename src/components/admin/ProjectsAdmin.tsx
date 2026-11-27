/** Admin → Projects: create projects and teams; open one for its tasks and updates. */
import { useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarRange, ClipboardList, FolderPlus, Loader2, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChoiceBar, FormBody, FormDialogContent, FormFooter, FormHeader, FormSection, Required } from '@/components/admin/FormDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fmtDate } from '@/portal/lib/attendance';
import {
  PRIORITY_TEXT, PROJECTS_KEY, PROJECT_STATUS_TEXT, deleteProject, fetchAdminProjects, fetchProject, saveProject,
  type Priority, type Project, type ProjectInput, type ProjectStatus,
} from '@/portal/lib/projects';
import { ProjectBadge, ProjectView } from '@/portal/components/Projects';

const NOBODY = '__nobody__';
const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
const empty: ProjectInput = { code: '', name: '', description: '', status: 'planning', priority: 'medium', start_date: '', end_date: '', manager_id: '', members: [] };

const List = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({ queryKey: [...PROJECTS_KEY, 'admin'], queryFn: fetchAdminProjects });
  const [editing, setEditing] = useState<{ id: string | null; form: ProjectInput } | null>(null);
  const [removing, setRemoving] = useState<Project | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: PROJECTS_KEY });
  const fail = (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' });

  const save = useMutation({
    mutationFn: () => saveProject(editing!.id, editing!.form),
    onSuccess: () => { toast({ title: 'Project saved' }); setEditing(null); void refresh(); }, onError: fail,
  });
  const remove = useMutation({ mutationFn: (p: Project) => deleteProject(p.id), onSuccess: () => { setRemoving(null); void refresh(); }, onError: fail });

  // Editing needs the current team, which the list doesn't carry.
  const edit = async (p: Project) => {
    try {
      const d = await fetchProject(p.id);
      setEditing({ id: p.id, form: {
        code: d.code, name: d.name, description: d.description ?? '', status: d.status, priority: d.priority,
        start_date: d.start_date ?? '', end_date: d.end_date ?? '', manager_id: d.manager_id ?? '', members: d.team.map((m) => m.id),
      } });
    } catch (e) { fail(e as Error); }
  };

  const f = editing?.form;
  const set = (patch: Partial<ProjectInput>) => setEditing((x) => x && { ...x, form: { ...x.form, ...patch } });
  // The manager is always on the team.
  const onTeam = (id: string) => !!f && (f.members.includes(id) || f.manager_id === id);
  const teamSize = data?.people.filter((m) => onTeam(m.id)).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="text-2xl font-bold">Projects</h1><p className="text-sm text-muted-foreground">Projects, their teams, tasks and updates.</p></div>
        {data?.can_edit && <Button onClick={() => setEditing({ id: null, form: empty })}><Plus className="mr-2 h-4 w-4" />New project</Button>}
      </div>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            : error || !data ? <p className="text-sm text-destructive">{(error as Error)?.message}</p>
              : !data.projects.length ? <p className="py-8 text-center text-sm text-muted-foreground">No projects yet.</p> : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Manager</TableHead><TableHead>Team</TableHead><TableHead>Tasks</TableHead><TableHead>Deadline</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
                    <TableBody>
                      {data.projects.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell><div className="font-medium">{p.name}</div><div className="font-mono text-xs text-muted-foreground">{p.code}</div></TableCell>
                          <TableCell>{p.manager ?? '—'}</TableCell>
                          <TableCell>{p.members}</TableCell>
                          <TableCell>{p.tasks_done} / {p.tasks_total}</TableCell>
                          <TableCell className={`whitespace-nowrap ${p.overdue ? 'font-semibold text-red-600' : ''}`}>{p.end_date ? fmtDate(p.end_date) : '—'}</TableCell>
                          <TableCell><ProjectBadge status={p.status} /></TableCell>
                          <TableCell className="whitespace-nowrap text-right">
                            <Button size="sm" variant="outline" aria-label={`Open ${p.name}`} onClick={() => navigate(`/admin/projects/${p.id}`)}>Open</Button>
                            {data.can_edit && <>
                              <Button size="icon" variant="ghost" aria-label={`Edit ${p.name}`} onClick={() => void edit(p)}><Pencil className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" className="text-destructive" aria-label={`Delete ${p.name}`} onClick={() => setRemoving(p)}><Trash2 className="h-4 w-4" /></Button>
                            </>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <FormDialogContent>
          {f && data && (
            <form className="flex min-h-0 flex-1 flex-col" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
              <FormHeader icon={editing.id ? Pencil : FolderPlus} title={editing.id ? 'Edit project' : 'New project'} description="Team members see it under My projects." />
              <FormBody>
                <FormSection icon={ClipboardList} title="Project details" hint="What the project is about.">
                  <div className="space-y-2"><Label htmlFor="pj-name">Name<Required /></Label><Input id="pj-name" required maxLength={120} placeholder="e.g. Warehouse upgrade" value={f.name} onChange={(e) => set({ name: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="pj-code">Project code<Required /></Label><Input id="pj-code" required maxLength={20} placeholder="e.g. PRJ-001" className="font-mono" value={f.code} onChange={(e) => set({ code: e.target.value })} /></div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="pj-desc">Description</Label>
                    <Textarea id="pj-desc" rows={3} maxLength={2000} placeholder="Goals, scope and anything the team should know" value={f.description} onChange={(e) => set({ description: e.target.value })} />
                    <p className="text-right text-xs text-muted-foreground">{f.description.length} / 2000</p>
                  </div>
                </FormSection>

                <FormSection icon={CalendarRange} title="Plan" hint="Progress, priority and dates.">
                  <div className="space-y-2 sm:col-span-2"><Label>Status</Label>
                    <ChoiceBar label="Status" options={PROJECT_STATUS_TEXT} value={f.status} columns="grid-cols-2 sm:grid-cols-5" onPick={(v) => set({ status: v as ProjectStatus })} /></div>
                  <div className="space-y-2 sm:col-span-2"><Label>Priority</Label>
                    <ChoiceBar label="Priority" options={PRIORITY_TEXT} value={f.priority} columns="grid-cols-3" onPick={(v) => set({ priority: v as Priority })} /></div>
                  <div className="space-y-2"><Label htmlFor="pj-start">Start date</Label><Input id="pj-start" type="date" value={f.start_date} onChange={(e) => set({ start_date: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="pj-end">Deadline</Label><Input id="pj-end" type="date" min={f.start_date || undefined} value={f.end_date} onChange={(e) => set({ end_date: e.target.value })} /></div>
                </FormSection>

                <FormSection icon={Users} title="Team" hint="Who leads it and who works on it."
                  aside={<span className="shrink-0 rounded-full bg-[#fff1eb] px-2.5 py-1 text-xs font-bold text-[#c2410c]">{teamSize} selected</span>}>
                  <div className="space-y-2 sm:col-span-2"><Label>Project manager</Label>
                    <Select value={f.manager_id || NOBODY} onValueChange={(v) => set({ manager_id: v === NOBODY ? '' : v })}><SelectTrigger aria-label="Project manager"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value={NOBODY}>No manager</SelectItem>{data.people.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2 sm:col-span-2">
                    <p className="text-sm font-medium">Team members</p>
                    {!data.people.length ? <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">No employees to add yet.</p> : (
                      <div className="grid max-h-56 gap-2 overflow-y-auto p-0.5 sm:grid-cols-2">
                        {data.people.map((m) => (
                          <label key={m.id} className={`flex items-center gap-3 rounded-xl border p-2.5 transition-colors ${onTeam(m.id) ? 'border-[#f1592a] bg-[#fff7f3]' : 'hover:border-[#223f96]/40'} ${f.manager_id === m.id ? 'cursor-default' : 'cursor-pointer'}`}>
                            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#223f96] to-[#3f63c9] text-xs font-bold text-white">{initials(m.full_name)}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{m.full_name}</span>
                              <span className="block text-xs text-muted-foreground">{m.employee_code}{f.manager_id === m.id && ' · Manager'}</span>
                            </span>
                            <Checkbox checked={onTeam(m.id)} disabled={f.manager_id === m.id}
                              onCheckedChange={(c) => set({ members: c === true ? [...f.members, m.id] : f.members.filter((x) => x !== m.id) })} />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </FormSection>
              </FormBody>
              <FormFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={save.isPending}>{save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderPlus className="mr-2 h-4 w-4" />}Save project</Button>
              </FormFooter>
            </form>
          )}
        </FormDialogContent>
      </Dialog>

      <Dialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete {removing?.name}?</DialogTitle><DialogDescription>Its tasks, updates and the daily report entries for it are deleted too. This can't be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setRemoving(null)}>Cancel</Button><Button variant="destructive" disabled={remove.isPending} onClick={() => removing && remove.mutate(removing)}>Delete project</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const One = () => <ProjectView id={useParams().projectId ?? ''} back="/admin/projects" />;

const ProjectsAdmin = () => (
  <Routes>
    <Route index element={<List />} />
    <Route path=":projectId" element={<One />} />
  </Routes>
);

export default ProjectsAdmin;
