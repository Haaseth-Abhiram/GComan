/**
 * Tracker identity for the ENGINEER side (/proposal-tracker).
 *
 * Sign-in happens on the website's single /login page (Supabase auth). This
 * provider reads that session and the engineer's own row in
 * proposal_engineers; only an ACTIVE engineer gets a tracker identity. The
 * admin side uses TrackerAuthBridge below instead.
 *
 * Proposal data is still browser-local (lib/db.ts), so the engineer's record
 * is copied into it and the data layer's session key is set to their id.
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Role } from '@/proposal-tracker/lib/permissions';
import { syncEngineers, type LoginIdentity } from '@/proposal-tracker/lib/db';
import { fetchMyEngineer } from '@/proposal-tracker/lib/accounts';
import { SESSION_KEY } from '@/proposal-tracker/lib/session';

export interface TrackerUser {
  id: string;
  email: string;
  name: string;
  code: string;
  role: Role;
  user_metadata: { name: string };
}
const toUser = (a: LoginIdentity): TrackerUser => ({ ...a, user_metadata: { name: a.name } });

interface AuthContextType {
  user: TrackerUser | null;
  isLoading: boolean;
  /** Signed in with a temporary (admin-set) password: must choose their own first. */
  mustChangePassword: boolean;
  /** Call after the engineer has changed their password. */
  passwordChanged: () => void;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setSessionKey = (id: string | null) => {
  try {
    if (id) sessionStorage.setItem(SESSION_KEY, id);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
};

export const TrackerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TrackerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      let identity: LoginIdentity | null = null;
      let mustChange = false;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const row = session ? await fetchMyEngineer() : null;
        if (row?.active) {
          identity = { id: row.id, email: row.email, name: row.name, code: row.code, role: 'engineer' };
          mustChange = row.must_change_password;
          syncEngineers([identity], 'upsert');
        }
      } catch (e) {
        console.error('Proposal tracker sign-in check failed', e);
      }
      setSessionKey(identity?.id ?? null);
      if (alive) {
        setUser(identity ? toUser(identity) : null);
        setMustChangePassword(mustChange);
        setIsLoading(false);
      }
    })();

    // Signed out elsewhere (another tab, or the session expired): drop the identity.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setSessionKey(null);
        setUser(null);
      }
    });
    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setSessionKey(null);
    setUser(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, mustChangePassword, passwordChanged: () => setMustChangePassword(false), signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Supplies a fixed tracker identity. Used only by the website admin, which has
 * already verified the user is a real admin.
 */
export const TrackerAuthBridge = ({ user, children }: { user: LoginIdentity; children: ReactNode }) => (
  <AuthContext.Provider value={{ user: toUser(user), isLoading: false, mustChangePassword: false, passwordChanged: () => {}, signOut: async () => {} }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
