/** Admin → Notifications → Reminders: which reminders go out, when, and what else is automatic. */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlarmClock, CalendarClock, ClipboardList, FolderKanban, Loader2, LogOut, Send, Zap, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { fetchReminders, saveReminder, sendReminderNow, type Reminder, type ReminderKind } from '@/portal/lib/notifications';

const KEY = ['admin', 'reminders'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TEXT: Record<ReminderKind, { icon: LucideIcon; title: string; who: string }> = {
  punch_in: { icon: AlarmClock, title: 'Punch-in reminder', who: 'Employees who have not punched in yet. Skips weekly off days, holidays and approved full-day leave.' },
  deadline: { icon: FolderKanban, title: 'Task deadline reminder', who: 'Employees with project tasks that are late or due by tomorrow.' },
  report: { icon: ClipboardList, title: 'Daily report reminder', who: 'Employees who punched in today but have not submitted the daily report.' },
  punch_out: { icon: LogOut, title: 'Punch-out reminder', who: 'Employees who are still punched in, before the automatic punch-out.' },
};
const ALWAYS = [
  'New employee: welcome message; the employee and the manager are told about a reporting manager change.',
  'Attendance: punch-in confirmation (a late punch-in also goes to Admins and the reporting manager), missed punch-out, and a correction approved or rejected.',
  'Leave: every approval step, to the person who has to act, and the final answer to the employee.',
  'Daily reports: submitted, reviewed or sent back (sent back is urgent).',
  'Projects: added to a project, new task, and company documents added to a profile.',
];

const ReminderRow = ({ r }: { r: Reminder }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [draft, setDraft] = useState({ enabled: r.enabled, send_at: r.send_at, days: r.days });
  const dirty = draft.enabled !== r.enabled || draft.send_at !== r.send_at || draft.days.join() !== r.days.join();
  const { icon: Icon, title, who } = TEXT[r.kind];
  const fail = (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' });
  const save = useMutation({
    mutationFn: () => saveReminder({ kind: r.kind, ...draft }),
    onSuccess: () => { toast({ title: `${title} saved` }); void qc.invalidateQueries({ queryKey: KEY }); },
    onError: fail,
  });
  const send = useMutation({
    mutationFn: () => sendReminderNow(r.kind),
    onSuccess: (n) => {
      toast({ title: n ? `Sent to ${n} ${n === 1 ? 'person' : 'people'}` : 'Nobody needs this reminder now', description: n ? title : 'Or they already got it today.' });
      void qc.invalidateQueries({ queryKey: KEY });
    },
    onError: fail,
  });
  return (
    <li className="space-y-3 py-4" aria-label={title}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef2fb] text-[#223f96]"><Icon className="h-5 w-5" aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#101a3a]">{title}</p>
          <p className="text-xs text-muted-foreground">{who}</p>
          <p className="mt-1 text-xs text-muted-foreground">Sent today: {r.sent_today}</p>
        </div>
        <Switch checked={draft.enabled} onCheckedChange={(enabled) => setDraft({ ...draft, enabled })} aria-label={`${title} on`} />
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:pl-[52px]">
        <Input type="time" required className="w-32" aria-label={`${title} time`} value={draft.send_at} onChange={(e) => setDraft({ ...draft, send_at: e.target.value })} />
        <div className="flex flex-wrap gap-1" role="group" aria-label={`${title} days`}>
          {DAYS.map((name, i) => {
            const on = draft.days.includes(i + 1);
            return (
              <Button key={name} type="button" size="sm" className="h-8 px-2.5" variant={on ? 'default' : 'outline'} aria-pressed={on}
                onClick={() => setDraft({ ...draft, days: on ? draft.days.filter((d) => d !== i + 1) : [...draft.days, i + 1].sort() })}>{name}</Button>
            );
          })}
        </div>
        <span className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" disabled={send.isPending} onClick={() => send.mutate()}><Send className="mr-1 h-4 w-4" />Send now</Button>
          <Button size="sm" disabled={!dirty || !draft.send_at || !draft.days.length || save.isPending} onClick={() => save.mutate()}>Save</Button>
        </span>
      </div>
    </li>
  );
};

const RemindersTab = () => {
  const { data, isLoading, error } = useQuery({ queryKey: KEY, queryFn: fetchReminders });
  if (isLoading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="h-4 w-4" />Scheduled reminders</CardTitle>
          <CardDescription>Oman time. Each person gets a reminder at most once a day.</CardDescription>
          <p className={`rounded-lg px-3 py-2 text-xs ${data.timer ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'}`}>
            {data.timer ? 'The timer is on: reminders are sent even when nobody is signed in.'
              : 'The background timer is off: reminders are sent when someone is using the Employee Portal. Enable “pg_cron” in the database to send them on time.'}
          </p>
        </CardHeader>
        <CardContent>
          {/* The key resets a row's unsaved fields once the stored values change. */}
          <ul className="divide-y">{data.items.map((r) => <ReminderRow key={`${r.kind}|${r.enabled}|${r.send_at}|${r.days.join()}`} r={r} />)}</ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4" />Always sent automatically</CardTitle></CardHeader>
        <CardContent><ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">{ALWAYS.map((t) => <li key={t}>{t}</li>)}</ul></CardContent>
      </Card>
    </div>
  );
};

export default RemindersTab;
