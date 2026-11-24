/**
 * FAKE AUTH — prototype only.
 *
 * No backend and no security: sign-in checks an email against the employee
 * records and one shared demo password, so anyone with the bundle can read it.
 * Identity comes from the employee record — there is no separate account list
 * and no engineer is hardcoded. The API (`user`, `isLoading`, `signOut`) mirrors
 * the real AuthContext in the main gcoman project, so this one file can be
 * swapped for Supabase auth + the user_roles table later.
 *
 * Do NOT deploy this to production.
 */
import { createContext, useContext, useState, ReactNode } from 'react';
import type { Role } from '@/proposal-tracker/lib/permissions';
import { findLoginByEmail, findLoginById, type LoginIdentity } from '@/proposal-tracker/lib/db';
import { SESSION_KEY } from '@/proposal-tracker/lib/session';

export const DEMO_PASSWORD = 'Demo@12345';
const KEY = SESSION_KEY;

export interface FakeUser {
  id: string;
  email: string;
  name: string;
  code: string;
  role: Role;
  user_metadata: { name: string };
}
const toUser = (a: LoginIdentity): FakeUser => ({ ...a, user_metadata: { name: a.name } });

interface AuthContextType {
  user: FakeUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readSession = (): FakeUser | null => {
  try {
    const a = findLoginById(sessionStorage.getItem(KEY));
    return a ? toUser(a) : null;
  } catch {
    return null;
  }
};

export const TrackerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FakeUser | null>(readSession);

  const signIn: AuthContextType['signIn'] = (email, password) => {
    const a = findLoginByEmail(email);
    if (a && password === DEMO_PASSWORD) {
      try { sessionStorage.setItem(KEY, a.id); } catch { /* ignore */ }
      setUser(toUser(a));
      return { ok: true };
    }
    return { ok: false, error: 'Invalid email or password.' };
  };
  const signOut = async () => {
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isLoading: false, signIn, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
