import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchMyAccess } from '@/portal/lib/access';

/** The signed-in user's roles and permissions (rbac_my_access), cached per user. */
export const MY_ACCESS_QUERY = 'my-access';
export const useMyAccess = () => {
  const { user, isLoading: authLoading } = useAuth();
  const q = useQuery({
    queryKey: [MY_ACCESS_QUERY, user?.id],
    queryFn: fetchMyAccess,
    enabled: !!user,
    // Permission changes made by an admin show up within 30 s (or on focus);
    // the database itself enforces them immediately.
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
  return { ...q, isLoading: authLoading || (!!user && q.isLoading), user };
};
