import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { safeImport } from '@/lib/lazyRetry';

export const useUserRole = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAdminRole = async () => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }

      if (!user) {
        setIsAdmin(false);
        setCheckedUserId(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setCheckedUserId(null);

      try {
        // Imported here rather than at module scope: Navigation and AdminRoute
        // both call this hook on every page, which put the Supabase SDK in the
        // always-loaded bundle. Anonymous visitors return above without ever
        // reaching this line, so they now never download it.
        const { supabase } = await safeImport(() => import('@/integrations/supabase/client'));
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) throw error;
        if (isMounted) {
          setIsAdmin(!!data);
          setCheckedUserId(user.id);
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        if (isMounted) {
          setIsAdmin(false);
          setCheckedUserId(user.id);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAdminRole();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  const isRoleLoading = authLoading || isLoading || (!!user && checkedUserId !== user.id);

  return { isAdmin, isLoading: isRoleLoading };
};
