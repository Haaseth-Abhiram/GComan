import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { ChangePasswordForm } from '@/proposal-tracker/components/tracker/ChangePasswordForm';
import logo from '@/assets/global-chemicals-logo.svg';

/**
 * Engineers sign in on the website's single /login page. One signed in with a
 * temporary (admin-set) password must choose their own before the tracker opens.
 */
export const ProposalTrackerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, mustChangePassword, passwordChanged, signOut } = useAuth();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  if (mustChangePassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md logo-gradient-border shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <img src={logo} alt="Global Chemicals LLC" width={150} height={48} className="h-12 w-auto mx-auto" />
            <CardTitle className="text-2xl">Choose your own password</CardTitle>
            <CardDescription>
              Welcome, {user.name}. You signed in with a temporary password. Set your own password to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChangePasswordForm
              currentLabel="Temporary password"
              submitLabel="Set password and continue"
              onDone={() => {
                passwordChanged();
                toast({ title: 'Password set', description: 'Use your new password next time you sign in.' });
              }}
            />
            <Button variant="ghost" className="w-full" onClick={() => void signOut()}>Sign out</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
