/** Fake-session storage, shared by the fake AuthContext and the data layer (which must know who is calling). */
export const SESSION_KEY = 'gc-portal-fake-session';

/**
 * Set by the website admin (/admin/proposal-tracker) while its tracker modules
 * are on screen: the real, Supabase-verified admin acts as a tracker admin
 * employee without going through the demo login. Null everywhere else.
 */
let sessionOverride: string | null = null;
export const setSessionOverride = (employeeId: string | null) => {
  sessionOverride = employeeId;
};

export const getSessionUserId = (): string | null => {
  if (sessionOverride) return sessionOverride;
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};
