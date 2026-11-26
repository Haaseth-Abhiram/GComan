import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMyAccess } from '@/portal/lib/useMyAccess';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading: authLoading } = useAuth();
  // Super Admins, or anyone whose roles give an admin-area permission (see Settings).
  const { data: access, isLoading: roleLoading } = useMyAccess();
  const isAdmin = !!access?.admin_pages;

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
