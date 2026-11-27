/** A clear warning when the database hasn't had the latest scripts run on it. */
import { useQuery } from '@tanstack/react-query';
import { Database } from 'lucide-react';
import { DATABASE_UPDATE_NEEDED, rpc } from '@/portal/lib/rpc';

export const DatabaseNotice = () => {
  // att_my_since comes from the newest script; it is harmless for anyone signed in.
  const { error } = useQuery({
    queryKey: ['database-version'], queryFn: () => rpc<string | null>('att_my_since'), retry: false, staleTime: 60_000,
  });
  if ((error as Error | null)?.message !== DATABASE_UPDATE_NEEDED) return null;
  return (
    <div role="alert" className="mb-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Database className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span><strong>Some features will not work yet.</strong> {DATABASE_UPDATE_NEEDED}</span>
    </div>
  );
};
