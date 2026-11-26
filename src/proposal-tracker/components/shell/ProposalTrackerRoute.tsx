import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { ForcedPasswordChange } from '@/portal/components/ForcedPasswordChange';

/**
 * Engineers sign in on the website's single /login page. One signed in with a
 * temporary (admin-set) password must choose their own before the tracker opens.
 * Signed in but not a proposal engineer → back to the Employee Portal.
 */
export const ProposalTrackerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isSignedIn, mustChangePassword, passwordChanged, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to={isSignedIn ? '/portal' : '/login'} replace />;

  if (mustChangePassword) {
    return <ForcedPasswordChange name={user.name} onDone={passwordChanged} onSignOut={() => void signOut()} />;
  }

  return <>{children}</>;
};
