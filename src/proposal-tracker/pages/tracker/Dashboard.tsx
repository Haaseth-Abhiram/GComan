import { useMemo } from 'react';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { Link, useNavigate } from 'react-router-dom';
import { Reveal, useReveal } from '@/proposal-tracker/components/tracker/motion';
import { engineerMetrics } from '@/proposal-tracker/lib/metrics';
import { formatDistanceToNow } from 'date-fns';
import {
  FileStack, Users, UserCheck, FileText, Send, AlarmClock, Inbox, FilePlus2, ListChecks, PhoneCall, FolderOpen, ShieldCheck,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { useDb, RFQ_STATUSES, type Activity } from '@/proposal-tracker/lib/db';
import { visibleRfqs } from '@/proposal-tracker/lib/permissions';
import { EmptyState, PriorityBadge, StatusBadge, daysUntil, fmtDate, isOverdue, useEmployeeName } from '@/proposal-tracker/components/tracker/common';

const COLORS: Record<string, string> = {
  New: 'hsl(199, 89%, 48%)', Assigned: 'hsl(239, 84%, 67%)', 'In Progress': 'hsl(221, 83%, 53%)', 'Under Review': 'hsl(38, 92%, 50%)',
  Returned: 'hsl(25, 95%, 53%)', Approved: 'hsl(173, 80%, 40%)', Submitted: 'hsl(262, 83%, 58%)',
};
const actIcon: Record<Activity['kind'], typeof Inbox> = {
  rfq: Inbox, assign: UserCheck, progress: FilePlus2, task: ListChecks, followup: PhoneCall, doc: FolderOpen, review: ShieldCheck, submit: Send,
};

const Dashboard = () => {
  const { user } = useAuth();
  const db = useDb();
  const name = useEmployeeName();
  const me = { id: user!.id, role: user!.role };
  const rfqs = useMemo(() => visibleRfqs(me, db.rfqs), [db.rfqs, me.id, me.role]);
  const ids = new Set(rfqs.map((r) => r.id));
  const scoped = me.role === 'admin';
  const navigate = useNavigate();
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const rfqLink = (id: string) => `/proposal-tracker/rfqs?view=${id}`;

  const count = (s: string) => rfqs.filter((r) => r.status === s).length;
  const cards = [
    { label: 'Total RFQs', value: rfqs.length, icon: FileStack, tone: 'bg-blue-500/10 text-blue-600', hint: scoped ? 'All registered RFQs' : 'RFQs assigned to you', to: '/proposal-tracker/rfqs' },
    { label: 'Engineers', value: db.employees.filter((e) => e.role === 'engineer').length, icon: Users, tone: 'bg-teal-500/10 text-teal-600', hint: 'Proposal engineers', to: '/proposal-tracker/engineers' },
    { label: 'Assigned RFQs', value: rfqs.filter((r) => r.primaryEngineerId).length, icon: UserCheck, tone: 'bg-indigo-500/10 text-indigo-600', hint: 'With a primary engineer', to: scoped ? '/proposal-tracker/assignment' : '/proposal-tracker/my-proposals' },
    { label: 'In Progress', value: count('In Progress'), icon: FileText, tone: 'bg-sky-500/10 text-sky-600', hint: 'Proposals being prepared', to: '/proposal-tracker/rfqs?status=In%20Progress' },
    { label: 'Submitted', value: count('Submitted'), icon: Send, tone: 'bg-purple-500/10 text-purple-600', hint: 'Awaiting customer decision', to: '/proposal-tracker/rfqs?status=Submitted' },
    { label: 'Overdue', value: rfqs.filter(isOverdue).length, icon: AlarmClock, tone: 'bg-orange-500/10 text-orange-600', hint: 'Past deadline, not submitted', to: '/proposal-tracker/rfqs?status=Overdue' },
  ];
  const chart = RFQ_STATUSES.map((s) => ({ name: s, value: count(s) })).filter((x) => x.value > 0);
  const recent = [...rfqs].sort((a, b) => b.receivedDate.localeCompare(a.receivedDate)).slice(0, 6);
  const upcoming = rfqs.filter((r) => r.status !== 'Submitted').sort((a, b) => a.deadline.localeCompare(b.deadline)).slice(0, 5);
  const activities = db.activities.filter((a) => !a.rfqId || ids.has(a.rfqId)).slice(0, 6);
  const workload = db.employees.filter((e) => e.role === 'engineer').map((e) => ({
    id: e.id, name: e.name, code: e.code,
    m: engineerMetrics(db.rfqs.filter((r) => r.primaryEngineerId === e.id || r.supportingIds.includes(e.id))),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 70} className="h-full"><Link to={c.to} aria-label={`${c.label}: ${c.value}. Open`} className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Card className="h-full cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40">
            <CardContent className="p-5">
              <div className={`p-2.5 rounded-lg w-fit mb-3 ${c.tone}`}><c.icon className="h-5 w-5" /></div>
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
              <p className="text-3xl font-bold mt-1" data-testid={`kpi-${c.label}`}>{c.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{c.hint}</p>
            </CardContent>
          </Card>
          </Link></Reveal>
        ))}
      </div>

      <div ref={r1.ref} className={`grid gap-6 lg:grid-cols-5 ${r1.cls}`}>
        <Card className="lg:col-span-2 min-w-0">
          <CardHeader className="pb-2"><CardTitle>Proposal Status</CardTitle><CardDescription>{rfqs.length} RFQs by status</CardDescription></CardHeader>
          <CardContent>
            {chart.length === 0 ? <EmptyState title="No RFQs yet" /> : (
              <ResponsiveContainer width="100%" height={290}>
                <PieChart>
                  <Pie data={chart} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={3} className="cursor-pointer"
                    onClick={(d: { name: string }) => navigate(`/proposal-tracker/rfqs?status=${encodeURIComponent(d.name)}`)}>
                    {chart.map((s) => <Cell key={s.name} fill={COLORS[s.name]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 min-w-0">
          <CardHeader className="pb-2"><CardTitle>Upcoming Deadlines</CardTitle><CardDescription>Open RFQs, nearest first</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 && <EmptyState title="No open deadlines" />}
            {upcoming.map((r) => {
              const d = daysUntil(r.deadline);
              return (
                <Link key={r.id} to={rfqLink(r.id)} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border p-3 hover:bg-muted/50 hover:border-primary/40 transition-colors">
                  <div className="min-w-0 flex-1 basis-48">
                    <p className="font-medium text-sm truncate">{r.ref} — {r.project}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.customer.name} · {fmtDate(r.deadline)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-sm font-semibold ${d <= 3 ? 'text-red-600' : ''}`}>
                      {d < 0 ? `${-d}d overdue` : d === 0 ? 'Today' : `${d} day${d === 1 ? '' : 's'}`}
                    </span>
                    <PriorityBadge priority={r.priority} />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div ref={r2.ref} className={`grid gap-6 lg:grid-cols-3 ${r2.cls}`}>
        <Card className="lg:col-span-2 min-w-0">
          <CardHeader className="pb-2"><CardTitle>Recent RFQs</CardTitle><CardDescription>Latest requests for quotation</CardDescription></CardHeader>
          <CardContent>
            {recent.length === 0 ? <EmptyState title="No RFQs yet" /> : (
              <Table>
                <TableHeader><TableRow>
                  <TableHead>RFQ</TableHead><TableHead>Client</TableHead><TableHead className="hidden md:table-cell">Project</TableHead>
                  <TableHead className="hidden sm:table-cell">Received</TableHead><TableHead>Deadline</TableHead><TableHead className="hidden sm:table-cell">Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {recent.map((r) => (
                    <TableRow key={r.id} tabIndex={0} role="link" aria-label={`Open ${r.ref}`} className="cursor-pointer"
                      onClick={() => navigate(rfqLink(r.id))} onKeyDown={(e) => e.key === 'Enter' && navigate(rfqLink(r.id))}>
                      <TableCell className="font-medium whitespace-nowrap">{r.ref}<span className="sm:hidden block mt-1"><StatusBadge status={r.status} /></span></TableCell>
                      <TableCell>{r.customer.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{r.project}</TableCell>
                      <TableCell className="hidden sm:table-cell whitespace-nowrap">{fmtDate(r.receivedDate)}</TableCell>
                      <TableCell className="whitespace-nowrap">{fmtDate(r.deadline)}</TableCell>
                      <TableCell className="hidden sm:table-cell"><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="pb-2"><CardTitle>Recent Activities</CardTitle><CardDescription>What changed lately</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {activities.length === 0 && <EmptyState title="No activity yet" />}
            {activities.map((a) => {
              const Icon = actIcon[a.kind];
              const linked = !!a.rfqId && db.rfqs.some((r) => r.id === a.rfqId);
              const Row: any = linked ? Link : 'div';
              return (
                <Row key={a.id} {...(linked ? { to: rfqLink(a.rfqId!) } : {})} className={`flex gap-3 ${linked ? 'rounded-md hover:bg-muted/50 -mx-2 px-2 py-1 transition-colors' : ''}`}>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0">
                    <p className="text-sm">{a.text}</p>
                    <p className="text-xs text-muted-foreground"><EngineerName id={a.by} /> · {formatDistanceToNow(new Date(a.at), { addSuffix: true })}</p>
                  </div>
                </Row>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {scoped && (
        <Card ref={r3.ref as never} className={r3.cls}>
          <CardHeader className="pb-2"><CardTitle>Engineer Workload</CardTitle><CardDescription>Open proposals and tasks per engineer</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Engineer</TableHead><TableHead>Assigned</TableHead><TableHead className="hidden sm:table-cell">In progress</TableHead><TableHead className="hidden sm:table-cell">Pending</TableHead><TableHead className="hidden sm:table-cell">Submitted</TableHead><TableHead>Overdue</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {workload.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium"><EngineerName id={w.id} /> <span className="text-xs text-muted-foreground">{w.code}</span></TableCell>
                    <TableCell>{w.m.assigned}</TableCell>
                    <TableCell className="hidden sm:table-cell">{w.m.inProgress}</TableCell>
                    <TableCell className="hidden sm:table-cell">{w.m.pending}</TableCell>
                    <TableCell className="hidden sm:table-cell">{w.m.submitted}</TableCell>
                    <TableCell>{w.m.overdue > 0 ? <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">{w.m.overdue}</Badge> : 0}</TableCell>
                    <TableCell><Link to={`/proposal-tracker/engineers/${w.id}`} className="text-primary underline text-sm">View</Link></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
