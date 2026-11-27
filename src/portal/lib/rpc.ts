import { supabase } from '@/integrations/supabase/client';

/** Shown when the website is newer than the database (a function isn't there yet). */
export const DATABASE_UPDATE_NEEDED =
  'The database needs an update: run supabase/APPLY_ALL_2026-11-27.sql in the Supabase SQL editor.';

/** Calls a database function; throws its message on error. */
export const rpc = async <T,>(fn: string, args?: Record<string, unknown>): Promise<T> => {
  const { data, error } = await (supabase.rpc as unknown as (f: string, a?: Record<string, unknown>) =>
    Promise<{ data: unknown; error: { message: string; code?: string } | null }>)(fn, args);
  if (error) throw new Error(error.code === 'PGRST202' ? DATABASE_UPDATE_NEEDED : error.message);
  return data as T;
};
