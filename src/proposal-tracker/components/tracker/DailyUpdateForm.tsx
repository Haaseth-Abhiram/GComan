import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDailyUpdate, useDb } from '@/proposal-tracker/lib/db';
import { FieldError, run, useActor } from '@/proposal-tracker/components/tracker/common';

/** Add a daily work update. Always saved against the signed-in engineer; optional link to one of their RFQs. */
export const DailyUpdateForm = () => {
  const actor = useActor();
  const db = useDb();
  const mine = db.rfqs.filter((r) => r.primaryEngineerId === actor.id || r.supportingIds.includes(actor.id));
  const [rfqId, setRfqId] = useState('none');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (note.trim().length < 3) return setErr('Write a short note about today\'s work.');
    setErr(''); setBusy(true);
    const ok = await run(() => addDailyUpdate(actor, { rfqId: rfqId === 'none' ? null : rfqId, note }), 'Daily update added');
    setBusy(false);
    if (ok) setNote('');
  };

  return (
    <div className="space-y-3" data-testid="daily-update-form">
      <div>
        <Label>Related proposal (optional)</Label>
        <Select value={rfqId} onValueChange={setRfqId}>
          <SelectTrigger aria-label="Related proposal"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">General update</SelectItem>
            {mine.map((r) => <SelectItem key={r.id} value={r.id}>{r.ref} — {r.customer.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="du-note">What did you work on today?</Label>
        <Textarea id="du-note" rows={3} value={note} maxLength={1000} onChange={(e) => { setNote(e.target.value); setErr(''); }} />
        <FieldError msg={err} />
      </div>
      <Button onClick={save} disabled={busy}>{busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}Add update</Button>
    </div>
  );
};
