import { Link } from 'react-router-dom';
import { Bell, ClipboardCheck, FileText, Hourglass, Mail, Send, AlarmClock, UserCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDb } from '@/proposal-tracker/lib/db';
import { can, ROLE_LABEL } from '@/proposal-tracker/lib/permissions';
import { engineerMetrics } from '@/proposal-tracker/lib/metrics';
import { useNotices } from '@/proposal-tracker/lib/notifications';
import { DailyUpdateForm } from '@/proposal-tracker/components/tracker/DailyUpdateForm';
import { EmptyState, PriorityBadge, StatusBadge, daysUntil, fmtDate, fmtDateTime, isOverdue, useActor } from '@/proposal-tracker/components/tracker/common';

/**
 * Everything for ONE engineer, driven purely by the engineer id.
 * An engineer is always shown their own id (taken from the signed-in identity, never chosen);
 * Admin can open any engineer. The data layer returns only what the viewer may see.
 */
const EngineerDashboard = ({ engineerId }: { engineerId: string }) => {
  const actor = useActor();
  const db = useDb();
  const notices = useNotices(engineerId);
  const mine = engineerId === actor.id;
  const emp = db.employees.find((e) => e.id === engineerId);

  const rfqs = db.rfqs.filter((r) => r.primaryEngineerId === engineerId || r.supportingIds.includes(engineerId));
  const m = engineerMetrics(rfqs);
  const upcoming = rfqs.filter((r) => r.status !== 'Submitted').sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 5);
  const tasks = db.tasks.filter((t) => t.ownerId === engineerId && t.status !== 'Submitted').sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 6);
  const updates = db.dailyUpdates.filter((d) => d.engineerId === engineerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const followups = db.followups.filter((f) => f.createdBy === engineerId && !f.done).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5);
  const rfqOf = (id: string | null) => db.rfqs.find((r) => r.id === id);

  if (!emp) return <EmptyState title="Engineer not found" hint="They may not exist or you may not have access." />;

  const kpis = [
    { key: 'all', label: 'Assigned proposals', value: m.assigned, icon: FileText, tone: 'bg-blue-500/10 text-blue-600', hint: 'Primary or supporting' },
    { key: 'In Progress', label: 'In progress', value: m.inProgress, icon: ClipboardCheck, tone: 'bg-sky-500/10 text-sky-600', hint: 'Being prepared' },
    { key: 'Pending', label: 'Pending', value: m.pending, icon: Hourglass, tone: 'bg-amber-500/10 text-amber-600', hint: 'Not started, in review or returned' },
    { key: 'Submitted', label: 'Submitted', value: m.submitted, icon: Send, tone: 'bg-purple-500/10 text-purple-600', hint: 'Sent to the customer' },
    { key: 'Overdue', label: 'Overdue', value: m.overdue, icon: AlarmClock, tone: 'bg-orange-500/10 text-orange-600', hint: 'Past deadline, not submitted' },
  ];

  return (
    <div className="space-y-6" data-testid="engineer-dashboard" data-engineer-id={engineerId}>
      {/* Profile */}
      <Card>
        <CardContent className="p-5 flex flex-wrap items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><UserCircle2 className="h-8 w-8" /></div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold truncate" data-testid="profile-name">{emp.name}</h2>
            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
              <Badge variant="outline">{emp.code}</Badge>
              <span>{ROLE_LABEL[emp.role]}</span>
              {emp.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{emp.email}</span>}
            </div>
          </div>
          {!mine && <Badge variant="secondary">Viewing as {ROLE_LABEL[actor.role]}</Badge>}
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((c) => {
          const body = (
            <Card className={`h-full transition-all duration-200 ${mine ? 'hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer' : ''}`}>
              <CardContent className="p-5">
                <div className={`p-2.5 rounded-lg w-fit mb-3 ${c.tone}`}><c.icon className="h-5 w-5" /></div>
                <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                <p className="text-3xl font-bold mt-1" data-testid={`kpi-${c.label}`}>{c.value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{c.hint}</p>
              </CardContent>
            </Card>
          );
          return mine
            ? <Link key={c.label} to={`/proposal-tracker/my-proposals?status=${encodeURIComponent(c.key)}`} aria-label={`${c.label}: ${c.value}. Open`} className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">{body}</Link>
            : <div key={c.label}>{body}</div>;
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Deadlines */}
        <Card className="min-w-0">
          <CardHeader className="pb-2"><CardTitle>Upcoming deadlines</CardTitle><CardDescription>Open proposals, nearest first</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 && <EmptyState title="No open deadlines" />}
            {upcoming.map((r) => {
              const d = daysUntil(r.deadline);
              return (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border p-3">
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="font-medium text-sm truncate">{r.ref} — {r.project}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.customer.name} · {fmtDate(r.deadline)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-semibold ${isOverdue(r) || d <= 3 ? 'text-red-600' : ''}`}>
                      {isOverdue(r) ? `${-d}d overdue` : d === 0 ? 'Today' : `${d} day${d === 1 ? '' : 's'}`}
                    </span>
                    <StatusBadge status={r.status} /><PriorityBadge priority={r.priority} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="min-w-0">
          <CardHeader className="pb-2"><CardTitle>Assigned tasks</CardTitle><CardDescription>Open tasks owned by {mine ? 'you' : emp.name}</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 && <EmptyState title="No open tasks" />}
            {tasks.map((t) => (
              <div key={t.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">{t.title}</p>
                  <span className={`text-xs whitespace-nowrap ${daysUntil(t.dueDate) < 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                    {daysUntil(t.dueDate) < 0 ? 'Overdue · ' : 'Due '}{fmtDate(t.dueDate)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{rfqOf(t.rfqId)?.ref}</p>
                <Progress value={t.completion} className="h-1.5 mt-2" />
              </div>
            ))}
            {mine && tasks.length > 0 && <Link to="/proposal-tracker/tasks" className="text-xs text-primary underline">Open Task Tracker</Link>}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily updates */}
        <Card className="min-w-0">
          <CardHeader className="pb-2"><CardTitle>Daily work updates</CardTitle><CardDescription>{mine ? 'Log what you worked on today' : `Recent updates from ${emp.name}`}</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {mine && can(actor, 'dailyupdate.add') && <DailyUpdateForm />}
            <div className="space-y-3">
              {updates.length === 0 && <EmptyState title="No daily updates yet" />}
              {updates.map((u) => (
                <div key={u.id} className="border-l-2 border-primary/40 pl-3">
                  <p className="text-sm">{u.note}</p>
                  <p className="text-xs text-muted-foreground">{fmtDate(u.date)}{u.rfqId ? ` · ${rfqOf(u.rfqId)?.ref ?? ''}` : ''} · logged {fmtDateTime(u.createdAt)}</p>
                </div>
              ))}
              {mine && <Link to="/proposal-tracker/daily-updates" className="text-xs text-primary underline">View all updates</Link>}
            </div>
          </CardContent>
        </Card>

        {/* Follow-ups + notifications */}
        <div className="space-y-6 min-w-0">
          <Card>
            <CardHeader className="pb-2"><CardTitle>Follow-ups</CardTitle><CardDescription>Open customer and vendor follow-ups</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {followups.length === 0 && <EmptyState title="No open follow-ups" />}
              {followups.map((f) => (
                <div key={f.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm">{f.type}</p>
                    <span className={`text-xs whitespace-nowrap ${daysUntil(f.dueDate) < 0 ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                      {daysUntil(f.dueDate) < 0 ? 'Overdue · ' : 'Due '}{fmtDate(f.dueDate)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rfqOf(f.rfqId)?.ref} — {f.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {notices.length === 0 && <EmptyState title="You're all caught up" />}
              {notices.slice(0, 6).map((n, i) => (
                <Link key={i} to={n.to} className={`block text-sm rounded-md px-2 py-1.5 hover:bg-muted/50 ${mine ? '' : 'pointer-events-none'}`}>{n.text}</Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;
