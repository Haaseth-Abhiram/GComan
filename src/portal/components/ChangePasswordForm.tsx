import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changeMyPassword, isValidPassword, PASSWORD_RULE } from '@/portal/lib/access';

/** Current + new + confirm. Used for the forced first-login change and from the profile menu. */
export const ChangePasswordForm = ({ currentLabel = 'Current password', submitLabel = 'Change password', onDone }: {
  currentLabel?: string;
  submitLabel?: string;
  onDone: () => void;
}) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidPassword(next)) return setError(`The new password needs ${PASSWORD_RULE}.`);
    if (next !== confirm) return setError("The new passwords don't match.");
    if (next === current) return setError('Choose a new password that is different from the current one.');
    setSaving(true);
    try {
      await changeMyPassword(current, next);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change the password.');
    } finally {
      setSaving(false);
    }
  };

  const field = (id: string, label: string, value: string, set: (v: string) => void, autoComplete: string) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} required value={value}
        onChange={(e) => { set(e.target.value); setError(null); }} />
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      {field('pw-current', currentLabel, current, setCurrent, 'current-password')}
      {field('pw-new', 'New password', next, setNext, 'new-password')}
      {field('pw-confirm', 'Confirm new password', confirm, setConfirm, 'new-password')}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{PASSWORD_RULE}</p>
        <button type="button" onClick={() => setShow(!show)} className="text-xs text-muted-foreground inline-flex items-center gap-1 shrink-0">
          {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}{show ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={saving}>
        {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
};
