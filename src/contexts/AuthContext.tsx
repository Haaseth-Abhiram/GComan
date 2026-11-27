import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// Type-only: erased at build time, so it does not pull the SDK into the bundle.
import type { User, Session } from '@supabase/supabase-js';
import { safeImport } from '@/lib/lazyRetry';
import { signOutAndReload } from '@/lib/signOut';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // The Supabase SDK is ~150 KB and used to sit in the entry bundle because
    // this provider wraps the whole app — so every one of the 657 routes paid
    // for it before first paint, including the 275 product pages and every
    // location/blog page, where no visitor is ever signed in. Importing it
    // here moves it off the critical path: auth still initialises on mount,
    // just after the page has painted. `isLoading` stays true until the SDK
    // has answered, so ProtectedRoute/AdminRoute never see a premature
    // "signed out" and redirect a real session away.
    let active = true;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      let supabase;
      try {
        ({ supabase } = await safeImport(() => import('@/integrations/supabase/client')));
      } catch {
        // The SDK never answered — resolve to signed-out rather than hang
        // ProtectedRoute/AdminRoute on isLoading forever.
        if (active) setIsLoading(false);
        return;
      }
      if (!active) return;

      // Listener FIRST, then the existing-session read (order matters: a token
      // refresh landing between the two would otherwise be missed).
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, nextSession) => {
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
          setIsLoading(false);
        }
      );
      unsubscribe = () => subscription.unsubscribe();

      const { data: { session: existingSession } } = await supabase.auth.getSession();
      if (!active) return;
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setIsLoading(false);
    })();

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  // The admin panel goes to the sign-in page; the public website to the home page.
  const signOut = () => signOutAndReload(window.location.pathname.startsWith('/admin') ? '/login' : '/');

  return (
    <AuthContext.Provider value={{ user, session, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
