/**
 * Proposal engineer ACCOUNTS — real Supabase data (table proposal_engineers,
 * migration 20261126120000_proposal_engineers.sql).
 *
 * The admin creates each engineer with a password and sends the credentials
 * to them personally; the admin can reset the password, disable or delete
 * the engineer. Proposal data itself is still browser-local (see db.ts).
 */
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type EngineerAccount = Database['public']['Tables']['proposal_engineers']['Row'];

/** Same rule the database enforces (and the website sign-up form uses). */
export const PASSWORD_RULE = '8+ characters with an uppercase letter, a lowercase letter and a number';
export const isValidPassword = (p: string) => p.length >= 8 && p.length <= 72 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p);

/** A random password that satisfies the rule, for the admin to hand out. */
export function generatePassword(): string {
  const pick = (set: string, n: number) => Array.from(crypto.getRandomValues(new Uint32Array(n)), (x) => set[x % set.length]).join('');
  // No look-alike characters (0/O, 1/l/I) so it can be read out or typed from a message.
  const chars = pick('ABCDEFGHJKLMNPQRSTUVWXYZ', 2) + pick('abcdefghijkmnpqrstuvwxyz', 6) + pick('23456789', 3);
  return Array.from(chars).sort(() => (crypto.getRandomValues(new Uint8Array(1))[0] > 127 ? 1 : -1)).join('');
}

/** The signed-in user's own engineer record (RLS returns only theirs), or null. */
export async function fetchMyEngineer(): Promise<EngineerAccount | null> {
  const { data, error } = await supabase.from('proposal_engineers').select('*').maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Where a freshly signed-in user belongs: admins → /admin, active engineers →
 * /proposal-tracker, disabled engineers → 'disabled', anyone else → null.
 */
export async function destinationForUser(userId: string): Promise<'/admin' | '/proposal-tracker' | 'disabled' | null> {
  const { data: role } = await supabase
    .from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle();
  if (role) return '/admin';
  const eng = await fetchMyEngineer().catch(() => null);
  if (eng) return eng.active ? '/proposal-tracker' : 'disabled';
  return null;
}

// ---- Admin-only (the database rejects everyone else) -----------------------

export async function listEngineers(): Promise<EngineerAccount[]> {
  const { data, error } = await supabase.from('proposal_engineers').select('*');
  if (error) throw error;
  // P1, P2 … P10 in numeric order.
  return (data ?? []).sort((a, b) => Number(a.code.slice(1)) - Number(b.code.slice(1)));
}

export const nextEngineerCode = (list: EngineerAccount[]) =>
  `P${list.reduce((m, e) => Math.max(m, Number(e.code.slice(1)) || 0), 0) + 1}`;

const friendly = (msg: string) => {
  if (msg.includes('proposal_engineers_email_key')) return 'An engineer with this email already exists.';
  if (msg.includes('proposal_engineers_code_key')) return 'That engineer code is already in use.';
  if (msg.includes('proposal_engineers_code_check')) return 'The code must be P followed by a number, e.g. P4.';
  return msg;
};
const check = (error: { message: string } | null) => {
  if (error) throw new Error(friendly(error.message));
};

export async function addEngineer(v: { code: string; name: string; email: string; password: string }) {
  const { error } = await supabase.rpc('admin_create_engineer', {
    _code: v.code.trim().toUpperCase(), _name: v.name.trim(), _email: v.email.trim().toLowerCase(), _password: v.password,
  });
  check(error);
}

export async function renameEngineer(id: string, name: string) {
  const { error } = await supabase.from('proposal_engineers').update({ name: name.trim() }).eq('id', id);
  check(error);
}

export async function setEngineerPassword(id: string, password: string) {
  const { error } = await supabase.rpc('admin_set_engineer_password', { _engineer_id: id, _password: password });
  check(error);
}

export async function setEngineerActive(id: string, active: boolean) {
  const { error } = await supabase.rpc('admin_set_engineer_active', { _engineer_id: id, _active: active });
  check(error);
}

export async function deleteEngineer(id: string) {
  const { error } = await supabase.rpc('admin_delete_engineer', { _engineer_id: id });
  check(error);
}
