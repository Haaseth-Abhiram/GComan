/**
 * Employee administration (admin side). Every call goes through a database
 * function that checks the caller's permission (portal.employees.*).
 */
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface EmployeeRow {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  designation: string | null;
  joined_on: string | null;
  reporting_manager_id: string | null;
  manager_name: string | null;
  reports_count: number;
  proposal_code: string | null;
  active: boolean;
  must_change_password: boolean;
  user_id: string | null;
  roles: string[];
  created_at: string;
}

export interface EmployeeInput {
  employee_code: string;
  full_name: string;
  phone: string;
  department: string;
  designation: string;
  joined_on: string;
  reporting_manager_id: string;
  proposal_code: string;
  roles: string[];
}

export const EMPLOYEES_QUERY = ['employees'];

const friendly = (msg: string) => {
  if (msg.includes('employees_employee_code_key')) return 'That Employee ID is already in use.';
  if (msg.includes('employees_proposal_code_key')) return 'That tracker code (P#) is already in use.';
  if (msg.includes('employees_email_key')) return 'An employee with this email already exists.';
  return msg;
};
const check = (error: { message: string } | null) => {
  if (error) throw new Error(friendly(error.message));
};

export async function listEmployees(): Promise<EmployeeRow[]> {
  const { data, error } = await supabase.rpc('admin_list_employees');
  check(error);
  return (data as unknown as EmployeeRow[]) ?? [];
}

const nextNumber = (codes: (string | null)[], re: RegExp) =>
  codes.reduce((m, c) => Math.max(m, Number(c?.match(re)?.[1] ?? 0)), 0) + 1;

/** GC001, GC002 … (based on the highest existing GC number). */
export const nextEmployeeCode = (list: EmployeeRow[]) =>
  `GC${String(nextNumber(list.map((e) => e.employee_code), /^GC(\d+)$/)).padStart(3, '0')}`;

export const nextProposalCode = (list: EmployeeRow[]) =>
  `P${nextNumber(list.map((e) => e.proposal_code), /^P(\d+)$/)}`;

export async function createEmployee(v: EmployeeInput & { email: string; password: string }) {
  const { error } = await supabase.rpc('admin_create_employee', { _p: v as unknown as Json });
  check(error);
}

export async function updateEmployee(id: string, v: EmployeeInput) {
  const { error } = await supabase.rpc('admin_update_employee', { _id: id, _p: v as unknown as Json });
  check(error);
}

export async function setEmployeePassword(id: string, password: string) {
  const { error } = await supabase.rpc('admin_set_employee_password', { _id: id, _password: password });
  check(error);
}

export async function setEmployeeActive(id: string, active: boolean) {
  const { error } = await supabase.rpc('admin_set_employee_active', { _id: id, _active: active });
  check(error);
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase.rpc('admin_delete_employee', { _id: id });
  check(error);
}
