/** Fake-session storage, shared by the fake AuthContext and the data layer (which must know who is calling). */
export const SESSION_KEY = 'gc-portal-fake-session';

export const getSessionUserId = (): string | null => {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
};
