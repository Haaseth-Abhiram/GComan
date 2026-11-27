import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChangePasswordForm } from '@/portal/components/ChangePasswordForm';
import { FullScreen } from '@/portal/theme/ui';
import logo from '@/assets/global-chemicals-logo.svg';

/**
 * Full-page "choose your own password" screen. Shown instead of the portal or
 * the tracker while the employee is still on the temporary password the admin
 * gave them (employees.must_change_password).
 */
export const ForcedPasswordChange = ({ name, onDone, onSignOut }: {
  name: string;
  onDone: () => void;
  onSignOut: () => void;
}) => {
  const { toast } = useToast();
  return (
    <FullScreen>
      <Card className="mx-auto w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1.5 bg-gradient-to-r from-[#f1762a] via-[#f1592a] to-[#223f96]" aria-hidden="true" />
        <CardHeader className="space-y-3 text-center">
          <img src={logo} alt="Global Chemicals LLC" width={150} height={48} className="h-12 w-auto mx-auto" />
          <CardTitle className="text-2xl">Choose your own password</CardTitle>
          <CardDescription>
            Welcome, {name}. You signed in with a temporary password. Set your own password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChangePasswordForm
            currentLabel="Temporary password"
            submitLabel="Set password and continue"
            onDone={() => {
              onDone();
              toast({ title: 'Password set', description: 'Use your new password next time you sign in.' });
            }}
          />
          <Button variant="ghost" className="w-full" onClick={onSignOut}>Sign out</Button>
        </CardContent>
      </Card>
    </FullScreen>
  );
};
