/** Notifications: inbox, urgent banner, writing messages and what you sent (also used by the admin). */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertTriangle, Bell, BellRing, CalendarCheck, CheckCheck, ClipboardList, Clock, FolderKanban, Inbox, Loader2, Mail,
  PenSquare, Send, type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  KIND_TEXT, NOTICES_KEY, fetchMessageOptions, fetchNotices, markRead, sendMessage, timeAgo, type Notice, type NoticeKind,
} from '@/portal/lib/notifications';

const Spinner = () => <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
const OPTIONS_KEY = [...NOTICES_KEY, 'options'];

const LOOK: Record<NoticeKind, { icon: LucideIcon; tile: string }> = {
  message: { icon: Mail, tile: 'bg-[#eef2fb] text-[#223f96]' },
  report: { icon: ClipboardList, tile: 'bg-amber-50 text-amber-600' },
  leave: { icon: CalendarCheck, tile: 'bg-violet-50 text-violet-600' },
  attendance: { icon: Clock, tile: 'bg-emerald-50 text-emerald-600' },
  project: { icon: FolderKanban, tile: 'bg-sky-50 text-sky-600' },
};

/** My notifications; checked every minute. */
export const useNotices = () => useQuery({ queryKey: NOTICES_KEY, queryFn: fetchNotices, refetchInterval: 60_000 });
const useMessageOptions = () => useQuery({ queryKey: OPTIONS_KEY, queryFn: fetchMessageOptions });

const useOpenNotice = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async (n: Notice, follow = true) => {
    if (!n.read_at) await markRead([n.id]).catch(() => {});
    await qc.invalidateQueries({ queryKey: NOTICES_KEY });
    if (follow && n.link) navigate(n.link);
  };
};

export const UrgentBanner = () => {
  const { data } = useNotices();
  const open = useOpenNotice();
  if (!data?.urgent.length) return null;
  return (
    <div className="mb-4 space-y-2">
      {data.urgent.map((n) => (
        <div key={n.id} role="alert" className="flex flex-wrap items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">{n.title}{n.sender_label && <span className="font-normal text-red-700"> · from {n.sender_label}</span>}</p>
            {n.body && <p className="mt-0.5 whitespace-pre-line break-words">{n.body}</p>}
          </div>
          {n.link && <Button size="sm" variant="destructive" onClick={() => void open(n)}>Open</Button>}
          <Button size="sm" variant="outline" onClick={() => void open({ ...n, read_at: null }, false)}>Mark as read</Button>
        </div>
      ))}
    </div>
  );
};

export const NoticeList = ({ limit }: { limit?: number }) => {
  const qc = useQueryClient();
  const { data, isLoading, error } = useNotices();
  const open = useOpenNotice();
  const [kind, setKind] = useState<NoticeKind | 'all' | 'unread'>('all');
  const all = useMutation({ mutationFn: () => markRead(null), onSettled: () => qc.invalidateQueries({ queryKey: NOTICES_KEY }) });
  if (isLoading) return <Spinner />;
  if (error || !data) return <p className="text-sm text-destructive">Could not load notifications: {(error as Error)?.message}</p>;
  const shown = data.items.filter((n) => kind === 'all' || (kind === 'unread' ? !n.read_at : n.kind === kind)).slice(0, limit);
  const list = (
    <>
      {!shown.length ? (
        <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground"><Bell className="h-6 w-6" />{kind === 'unread' ? "You're all caught up." : 'No notifications yet.'}</div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {shown.map((n) => {
            const unread = !n.read_at;
            const urgent = n.priority === 'urgent';
            const Icon = urgent ? BellRing : LOOK[n.kind].icon;
            return (
              <li key={n.id}>
                <button type="button" onClick={() => void open(n)}
                  className={`relative flex w-full gap-3 rounded-xl border px-3 py-3 text-left transition-all ${unread
                    ? urgent ? 'border-red-200 bg-red-50/60 hover:bg-red-50' : 'border-[#dce6f7] bg-[#f7f9ff] hover:bg-[#eef4ff]'
                    : 'border-transparent hover:border-[#eef1f7] hover:bg-[#f8fafd]'}`}>
                  {unread && <span className="sr-only">Unread.</span>}
                  {unread && <span aria-hidden="true" className={`absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full ${urgent ? 'bg-red-500' : 'bg-[#223f96]'}`} />}
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${urgent ? 'bg-red-50 text-red-600' : LOOK[n.kind].tile}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline">{KIND_TEXT[n.kind]}</Badge>
                      {urgent && <Badge variant="outline" className="border-red-300 text-red-700">Urgent</Badge>}
                      <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</span>
                    </span>
                    <span className={`mt-1 block text-sm ${unread ? 'font-bold text-[#101a3a]' : 'font-medium'}`}>{n.title}</span>
                    {n.body && <span className="mt-0.5 block whitespace-pre-line break-words text-sm text-muted-foreground">{n.body}</span>}
                    {n.sender_label && <span className="mt-1 block text-xs text-muted-foreground">From {n.sender_label}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
  if (limit) return list;
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <div><CardTitle className="text-base">Inbox</CardTitle><CardDescription>{data.unread ? `${data.unread} unread` : 'No unread notifications'}</CardDescription></div>
        <Button size="sm" variant="outline" disabled={!data.unread || all.isPending} onClick={() => all.mutate()}><CheckCheck className="mr-1 h-4 w-4" />Mark all as read</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Show">
          {(['all', 'unread', ...Object.keys(KIND_TEXT)] as (NoticeKind | 'all' | 'unread')[]).map((k) => (
            <Button key={k} size="sm" variant={kind === k ? 'default' : 'outline'} aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k === 'all' ? 'All' : k === 'unread' ? `Unread${data.unread ? ` (${data.unread})` : ''}` : KIND_TEXT[k]}
            </Button>
          ))}
        </div>
        {list}
      </CardContent>
    </Card>
  );
};

export const MessageComposer = () => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, error } = useMessageOptions();
  const [form, setForm] = useState({ audience: '' as '' | 'people' | 'team' | 'all', to: [] as string[], title: '', body: '', priority: 'normal' as 'normal' | 'urgent' });
  const [search, setSearch] = useState('');
  const audience = form.audience || 'people';

  const send = useMutation({
    mutationFn: () => sendMessage({ ...form, audience }),
    onSuccess: (n) => {
      toast({ title: 'Message sent', description: `To ${n} ${n === 1 ? 'person' : 'people'}.` });
      setForm((f) => ({ ...f, to: [], title: '', body: '', priority: 'normal' }));
      void qc.invalidateQueries({ queryKey: OPTIONS_KEY });
    },
    onError: (e: Error) => toast({ title: 'Could not send', description: e.message, variant: 'destructive' }),
  });

  if (isLoading) return <Spinner />;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;
  if (!data.can_send) return <p className="text-sm text-muted-foreground">You can't send messages.</p>;

  const audiences = ([['people', 'Choose people', true], ['team', 'My team', data.can_team], ['all', 'Everyone', data.can_all]] as const).filter((a) => a[2]);
  const found = data.people.filter((p) => `${p.full_name} ${p.employee_code} ${p.designation ?? ''}`.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Send a message</CardTitle><CardDescription>Notify colleagues in the portal. Urgent ones show as a banner until read.</CardDescription></CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); send.mutate(); }}>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Send to">
            {audiences.map(([value, text]) => (
              <Button key={value} type="button" size="sm" variant={audience === value ? 'default' : 'outline'} aria-pressed={audience === value}
                onClick={() => setForm({ ...form, audience: value })}>{text}</Button>
            ))}
          </div>
          {audience === 'people' && (
            <div className="space-y-2 rounded-xl border p-3">
              <Input aria-label="Search people" placeholder="Search people…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <div className="grid max-h-52 gap-2 overflow-y-auto sm:grid-cols-2">
                {found.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={form.to.includes(p.id)} onCheckedChange={(c) => setForm({ ...form, to: c === true ? [...form.to, p.id] : form.to.filter((x) => x !== p.id) })} />
                    {p.full_name} <span className="text-xs text-muted-foreground">{p.employee_code}</span>
                  </label>
                ))}
                {!found.length && <p className="text-sm text-muted-foreground">Nobody to choose.</p>}
              </div>
              {!!form.to.length && <p className="text-xs text-muted-foreground">{form.to.length} chosen</p>}
            </div>
          )}
          <div className="space-y-1.5"><Label htmlFor="msg-title">Subject</Label>
            <Input id="msg-title" required maxLength={150} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="space-y-1.5"><Label htmlFor="msg-body">Message</Label>
            <Textarea id="msg-body" rows={4} maxLength={2000} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.priority === 'urgent'} onCheckedChange={(c) => setForm({ ...form, priority: c === true ? 'urgent' : 'normal' })} />Urgent
            </label>
            <Button type="submit" disabled={send.isPending || !form.title.trim() || (audience === 'people' && !form.to.length)}>
              {send.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Send message
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export const SentList = () => {
  const { data, isLoading, error } = useMessageOptions();
  if (isLoading) return <Spinner />;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Messages you sent</CardTitle><CardDescription>The last 90 days.</CardDescription></CardHeader>
      <CardContent>
        {!data.sent.length ? <p className="py-4 text-center text-sm text-muted-foreground">You have not sent any messages in the last 90 days.</p> : (
          <ul className="flex flex-col gap-2">
            {data.sent.map((s) => (
              <li key={s.id} className="flex gap-3 rounded-xl border border-[#eef1f7] bg-[#fbfcfe] px-4 py-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.priority === 'urgent' ? 'bg-red-50 text-red-600' : 'bg-[#eef2fb] text-[#223f96]'}`}><Send className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {s.priority === 'urgent' && <Badge variant="outline" className="border-red-300 text-red-700">Urgent</Badge>}
                    <span className="text-sm font-bold text-[#101a3a]">{s.title}</span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(s.created_at)}</span>
                  </div>
                  {s.body && <p className="mt-0.5 whitespace-pre-line break-words text-sm text-muted-foreground">{s.body}</p>}
                  <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>To {(s.to ?? []).join(', ')}{s.recipients > (s.to?.length ?? 0) ? ` and ${s.recipients - (s.to?.length ?? 0)} more` : ''}</span>
                    <Badge variant="outline" className={s.read >= s.recipients ? 'border-emerald-300 text-emerald-700' : ''}><CheckCheck className="mr-1 h-3 w-3" />Read by {s.read} of {s.recipients}</Badge>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export const NotificationsPage = () => {
  const { data } = useMessageOptions();
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="flex items-center gap-2 text-2xl font-bold"><Bell className="h-5 w-5" />Notifications</h1>
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox"><Inbox className="mr-1.5 h-4 w-4" />Inbox</TabsTrigger>
          {data?.can_send && <TabsTrigger value="send"><PenSquare className="mr-1.5 h-4 w-4" />Send message</TabsTrigger>}
          {data?.can_send && <TabsTrigger value="sent"><Send className="mr-1.5 h-4 w-4" />Sent</TabsTrigger>}
        </TabsList>
        <TabsContent value="inbox"><NoticeList /></TabsContent>
        <TabsContent value="send"><MessageComposer /></TabsContent>
        <TabsContent value="sent"><SentList /></TabsContent>
      </Tabs>
    </div>
  );
};
