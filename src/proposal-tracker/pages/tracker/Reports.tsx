import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDb, RFQ_STATUSES } from '@/proposal-tracker/lib/db';
import { can } from '@/proposal-tracker/lib/permissions';
import { DataTable, PageHeader, StatusBadge, daysUntil, downloadCsv, fmtDate, isOverdue, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';

interface Row { id: string; [k: string]: string | number }

const STATUS_COLORS: Record<string, string> = {
  New: 'hsl(199, 89%, 48%)', Assigned: 'hsl(239, 84%, 67%)', 'In Progress': 'hsl(221, 83%, 53%)', 'Under Review': 'hsl(38, 92%, 50%)',
  Returned: 'hsl(25, 95%, 53%)', Approved: 'hsl(173, 80%, 40%)', Submitted: 'hsl(262, 83%, 58%)',
};
const tooltipStyle = { backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 8 };
const monthLabel = (k: string) => new Date(`${k}-01T00:00:00`).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

const Reports = () => {
  const actor = useActor();
  const db = useDb();
  const name = useEmployeeName();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [eng, setEng] = useState('all');

  const rfqs = useMemo(
    () => db.rfqs.filter((r) => (!from || r.receivedDate >= from) && (!to || r.receivedDate <= to) && (eng === 'all' || r.primaryEngineerId === eng)),
    [db.rfqs, from, to, eng],
  );
  if (!can(actor, 'report.view')) return <PageHeader title="Reports" description="You do not have access to reports. An Admin can grant limited report export to Engineers." />;

  const fullAccess = can(actor, 'report.exportAll');
  const showCosting = can(actor, 'costing.view');
  // Engineers with the limited-export permission only ever see themselves (their data is already scoped by the data layer).
  const engineers = db.employees.filter((e) => e.role === 'engineer' && (fullAccess || e.id === actor.id));
  const ids = new Set(rfqs.map((r) => r.id));

  const workload: Row[] = engineers.filter((e) => eng === 'all' || e.id === eng).map((e) => {
    const mine = rfqs.filter((r) => r.primaryEngineerId === e.id);
    const tasks = db.tasks.filter((t) => t.ownerId === e.id && ids.has(t.rfqId));
    return {
      id: e.id, Engineer: e.name, 'Active proposals': mine.filter((r) => r.status !== 'Submitted').length,
      'Total proposals': mine.length, Submitted: mine.filter((r) => r.status === 'Submitted').length,
      'On-time submissions': (() => {
        const subs = mine.map((r) => db.submissions.filter((x) => x.rfqId === r.id).sort((a, b) => a.submittedDate.localeCompare(b.submittedDate))[0] && { r, first: db.submissions.filter((x) => x.rfqId === r.id).sort((a, b) => a.submittedDate.localeCompare(b.submittedDate))[0] }).filter(Boolean) as Array<{ r: typeof mine[number]; first: { submittedDate: string } }>;
        return subs.length ? `${subs.filter((x) => x.first.submittedDate <= x.r.deadline).length}/${subs.length}` : '—';
      })(), 'Open tasks': tasks.filter((t) => t.status !== 'Submitted').length,
      'Overdue tasks': tasks.filter((t) => t.status !== 'Submitted' && daysUntil(t.dueDate) < 0).length,
    };
  });

  const submitted = rfqs.filter((r) => db.submissions.some((s) => s.rfqId === r.id));
  const performance: Row[] = submitted.map((r) => {
    const first = db.submissions.filter((s) => s.rfqId === r.id).sort((a, b) => a.submittedDate.localeCompare(b.submittedDate))[0];
    const daysEarly = Math.round((new Date(`${r.deadline}T00:00:00`).getTime() - new Date(`${first.submittedDate}T00:00:00`).getTime()) / 86_400_000);
    return {
      id: r.id, RFQ: r.ref, Customer: r.customer.name, Engineer: name(r.primaryEngineerId), Deadline: r.deadline,
      'First submitted': first.submittedDate, Revisions: db.submissions.filter((s) => s.rfqId === r.id).length,
      'On time': daysEarly >= 0 ? 'Yes' : 'No', 'Days vs deadline': daysEarly,
      ...(showCosting && r.costing ? { 'Estimated cost (OMR)': r.costing.estimatedCost, 'Quoted price (OMR)': r.costing.quotedPrice, 'Margin %': Math.round(((r.costing.quotedPrice - r.costing.estimatedCost) / r.costing.quotedPrice) * 100) } : {}),
    };
  });
  // Charts (admin): status pie + monthly revenue. Opened = quoted value of RFQs received that month;
  // Closed = quoted value of proposals first submitted that month. Only RFQs with costing count.
  const statusData = RFQ_STATUSES.map((st) => ({ name: st, value: rfqs.filter((x) => x.status === st).length })).filter((x) => x.value > 0);
  const byMonth = new Map<string, { month: string; opened: number; closed: number }>();
  const bucket = (k: string) => { if (!byMonth.has(k)) byMonth.set(k, { month: k, opened: 0, closed: 0 }); return byMonth.get(k)!; };
  rfqs.forEach((x) => {
    if (!x.costing) return;
    bucket(x.receivedDate.slice(0, 7)).opened += x.costing.quotedPrice;
    const first = db.submissions.filter((sb) => sb.rfqId === x.id).sort((a, b) => a.submittedDate.localeCompare(b.submittedDate))[0];
    if (first) bucket(first.submittedDate.slice(0, 7)).closed += x.costing.quotedPrice;
  });
  const revenueData = [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month)).map((m) => ({ ...m, label: monthLabel(m.month) }));
  const onTime = performance.filter((p) => p['On time'] === 'Yes').length;

  const outcomesCount = (s: string) => rfqs.filter((r) => r.status === s).length;
  const outcomes: Row[] = [
    ...(['Submitted', 'Under Review', 'In Progress', 'Assigned', 'New', 'Approved', 'Returned'] as const).map((s) => ({ id: s, Outcome: s, Count: outcomesCount(s) })),
    { id: 'rate', Outcome: 'Submitted (% of all RFQs)', Count: rfqs.length ? `${Math.round((outcomesCount('Submitted') / rfqs.length) * 100)}%` : '—' },
  ];

  const overdue: Row[] = rfqs.filter(isOverdue).map((r) => ({
    id: r.id, RFQ: r.ref, Customer: r.customer.name, Engineer: name(r.primaryEngineerId), Deadline: r.deadline,
    'Days overdue': -daysUntil(r.deadline), Status: r.status, Progress: `${r.progress}%`,
  }));

  const cols = (rows: Row[]): Column<Row>[] =>
    (rows[0] ? Object.keys(rows[0]).filter((k) => k !== 'id') : []).map((k) => ({
      header: k,
      cell: (r) => (k === 'Status' ? <StatusBadge status={String(r[k])} /> : /Deadline|submitted/i.test(k) && /^\d{4}-/.test(String(r[k])) ? fmtDate(String(r[k])) : String(r[k])),
    }));

  const tab = (key: string, rows: Row[], file: string, empty: string) => (
    <TabsContent value={key}>
      <Card><CardContent className="p-4 md:p-6 space-y-3">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" disabled={!rows.length} onClick={() => downloadCsv(file, rows.map(({ id, ...rest }) => rest))}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
        </div>
        <DataTable rows={rows} columns={cols(rows)} emptyTitle={empty} pageSize={10} />
      </CardContent></Card>
    </TabsContent>
  );

  return (
    <>
      <PageHeader title="Reports" description={fullAccess ? "Workload, submission performance, outcomes and overdue proposals. Filters apply to every report." : "Limited export: reports cover only the proposals assigned to you."} />
      <Card className="mb-6"><CardContent className="p-4 grid gap-4 sm:grid-cols-4 items-end">
        <div><Label htmlFor="rf">Received from</Label><Input id="rf" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><Label htmlFor="rt">Received to</Label><Input id="rt" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div>
          <Label>Engineer</Label>
          <Select value={eng} onValueChange={setEng}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All engineers</SelectItem>{engineers.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={() => { setFrom(''); setTo(''); setEng('all'); }}>Clear filters</Button>
      </CardContent></Card>
      <p className="text-sm text-muted-foreground mb-3">{rfqs.length} RFQs in range · on-time submissions: {performance.length ? `${onTime}/${performance.length}` : '—'}</p>
      {fullAccess && (
        <div className="grid gap-6 lg:grid-cols-5 mb-6">
          <Card className="lg:col-span-2 min-w-0">
            <CardHeader className="pb-2"><CardTitle>Proposal Status</CardTitle><CardDescription>{rfqs.length} RFQs by status</CardDescription></CardHeader>
            <CardContent>
              {statusData.length === 0 ? <p className="text-sm text-muted-foreground py-10 text-center">No RFQs in range</p> : (
                <ResponsiveContainer width="100%" height={290}>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={95} paddingAngle={3}>
                      {statusData.map((d) => <Cell key={d.name} fill={STATUS_COLORS[d.name]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 min-w-0">
            <CardHeader className="pb-2"><CardTitle>Monthly Closed vs Opened Revenue</CardTitle><CardDescription>Quoted price in OMR. Opened = RFQs received; Closed = proposals submitted.</CardDescription></CardHeader>
            <CardContent>
              {!showCosting ? <p className="text-sm text-muted-foreground py-10 text-center">Revenue needs the “View commercial costing” permission.</p>
                : revenueData.length === 0 ? <p className="text-sm text-muted-foreground py-10 text-center">No revenue data in range</p> : (
                <ResponsiveContainer width="100%" height={290}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" fontSize={12} />
                    <YAxis fontSize={12} tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `OMR ${v.toLocaleString()}`} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="opened" name="Opened revenue" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="closed" name="Closed revenue" fill="hsl(173, 80%, 40%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      <Tabs defaultValue="workload">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="workload">Engineer Workload</TabsTrigger>
          <TabsTrigger value="performance">Submission Performance</TabsTrigger>
          <TabsTrigger value="outcomes">Proposal Outcomes</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Reports</TabsTrigger>
        </TabsList>
        {tab('workload', workload, 'engineer-workload.csv', 'No engineers')}
        {tab('performance', performance, 'submission-performance.csv', 'No submissions in range')}
        {tab('outcomes', outcomes, 'proposal-outcomes.csv', 'No data')}
        {tab('overdue', overdue, 'overdue-proposals.csv', 'No overdue proposals')}
      </Tabs>
    </>
  );
};

export default Reports;
