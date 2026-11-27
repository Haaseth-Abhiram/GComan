/**
 * Sign out of this browser no matter what happens on the way.
 *
 * `supabase.auth.signOut()` keeps the stored session when the server replies
 * with an error or can't be reached, and it can wait a long time on another
 * tab, so a sign-out button could appear to do nothing. Here the server is
 * asked first (it ends the session there), then the stored session is removed
 * and the app reloads, whatever the answer was.
 */
import { safeImport } from '@/lib/lazyRetry';

const WAIT_MS = 5000;
const SESSION_ITEM = /^sb-.+-auth-token(-code-verifier|-user)?$/;

const forgetStoredSession = () => {
  try {
    Object.keys(localStorage).filter((k) => SESSION_ITEM.test(k)).forEach((k) => localStorage.removeItem(k));
  } catch { /* storage blocked: nothing was stored */ }
};

/** `to` is the page to load once signed out. */
export async function signOutAndReload(to: string): Promise<void> {
  try {
    const { supabase } = await safeImport(() => import('@/integrations/supabase/client'));
    const result = await Promise.race([
      supabase.auth.signOut(),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), WAIT_MS)),
    ]);
    if (result === 'timeout' || result.error) console.warn('Sign out: the server did not confirm', result);
  } catch (e) {
    console.warn('Sign out: the server could not be reached', e);
  } finally {
    forgetStoredSession();
    window.location.replace(to);
  }
}
