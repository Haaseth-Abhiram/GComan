/** Projects and tasks (migration 20261127130000_projects.sql). */
import { rpc } from '@/portal/lib/rpc';

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export const PROJECT_STATUS_TEXT: Record<ProjectStatus, string> = {
  planning: 'Planning', in_progress: 'In progress', on_hold: 'On hold', completed: 'Completed', cancelled: 'Cancelled',
};
export const PROJECT_STATUS_STYLE: Record<ProjectStatus, string> = {
  planning: 'border-slate-300 bg-slate-50 text-slate-700',
  in_progress: 'border-sky-300 bg-sky-50 text-sky-800',
  on_hold: 'border-amber-300 bg-amber-50 text-amber-800',
  completed: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  cancelled: 'border-red-300 bg-red-50 text-red-700',
};
export const PRIORITY_TEXT: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' };
export const PRIORITY_STYLE: Record<Priority, string> = {
  low: 'border-slate-300 text-slate-600', medium: 'border-amber-300 text-amber-700', high: 'border-red-300 text-red-700',
};
export const TASK_STATUS_TEXT: Record<TaskStatus, string> = { todo: 'To do', in_progress: 'In progress', done: 'Done' };

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  start_date: string | null;
  end_date: string | null;
  manager_id: string | null;
  manager: string | null;
  overdue: boolean;
  members: number;
  tasks_total: number;
  tasks_done: number;
}
export interface Task {
  id: string;
  project_id: string;
  project?: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: Priority;
  status: TaskStatus;
  delay_reason: string | null;
  completed_at: string | null;
  overdue: boolean;
}
export interface ProjectDetail extends Omit<Project, 'members'> {
  members: number;
  team: { id: string; full_name: string; employee_code: string; designation: string | null }[];
  tasks: Task[];
  updates: { id: string; body: string; author: string; created_at: string }[];
  can_add_task: boolean;
  can_work: boolean;
  can_manage: boolean;
}
export interface ProjectInput {
  code: string; name: string; description: string; status: ProjectStatus; priority: Priority;
  start_date: string; end_date: string; manager_id: string; members: string[];
}

export const PROJECTS_KEY = ['projects'];
export const fetchMyProjects = () => rpc<{ projects: Project[]; tasks: Task[] }>('proj_mine');
export const fetchProject = (id: string) => rpc<ProjectDetail>('proj_get', { _id: id });
export const addTask = (project: string, t: { title: string; description: string; assignee_id: string; due_date: string; priority: Priority }) =>
  rpc<ProjectDetail>('proj_add_task', { _project: project, _p: t });
export const setTaskStatus = (task: string, status: TaskStatus, reason: string | null) =>
  rpc<ProjectDetail>('proj_set_task_status', { _task: task, _status: status, _reason: reason });
export const postUpdate = (project: string, body: string) => rpc<ProjectDetail>('proj_post_update', { _project: project, _body: body });
export const fetchAdminProjects = () =>
  rpc<{ can_edit: boolean; projects: Project[]; people: { id: string; full_name: string; employee_code: string }[] }>('proj_admin_list');
export const saveProject = (id: string | null, p: ProjectInput) => rpc<string>('proj_admin_save', { _id: id, _p: p });
export const deleteProject = (id: string) => rpc<void>('proj_admin_delete', { _id: id });
export const deleteTask = (id: string) => rpc<void>('proj_admin_delete_task', { _task: id });
