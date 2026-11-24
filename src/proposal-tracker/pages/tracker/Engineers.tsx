import { Link } from 'react-router-dom';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDb, type Employee } from '@/proposal-tracker/lib/db';
import { can } from '@/proposal-tracker/lib/permissions';
import { engineerMetrics } from '@/proposal-tracker/lib/metrics';
import { DataTable, PageHeader, daysUntil, fmtDate, useActor, type Column } from '@/proposal-tracker/components/tracker/common';

/** Admin: every proposal engineer with their workload at a glance. */
const Engineers = () => {
  const actor = useActor();
  const db = useDb();
  if (!can(actor, 'rfq.viewAll')) return <PageHeader title="Engineers" description="Only Admins can view all engineers." />;

  const engineers = db.employees.filter((e) => e.role === 'engineer');
  const stats = (e: Employee) => {
    const rfqs = db.rfqs.filter((r) => r.primaryEngineerId === e.id || r.supportingIds.includes(e.id));
    const openTasks = db.tasks.filter((t) => t.ownerId === e.id && t.status !== 'Submitted');
    const last = db.dailyUpdates.filter((d) => d.engineerId === e.id).sort((a, b) => b.date.localeCompare(a.date))[0];
    return { ...engineerMetrics(rfqs), openTasks: openTasks.length, overdueTasks: openTasks.filter((t) => daysUntil(t.dueDate) < 0).length, last };
  };
  const num = (n: number, bad = false) => (bad && n > 0 ? <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">{n}</Badge> : n);

  const columns: Column<Employee>[] = [
    { header: 'Engineer', cell: (e) => <div><p className="font-medium"><EngineerName id={e.id} /></p><p className="text-xs text-muted-foreground">{e.code} · {e.email}</p></div> },
    { header: 'Assigned', cell: (e) => num(stats(e).assigned) },
    { header: 'In progress', cell: (e) => num(stats(e).inProgress), hideOnMobile: true },
    { header: 'Pending', cell: (e) => num(stats(e).pending), hideOnMobile: true },
    { header: 'Submitted', cell: (e) => num(stats(e).submitted), hideOnMobile: true },
    { header: 'Overdue', cell: (e) => num(stats(e).overdue, true) },
    { header: 'Open tasks', cell: (e) => num(stats(e).openTasks), hideOnMobile: true },
    { header: 'Last daily update', cell: (e) => (stats(e).last ? fmtDate(stats(e).last!.date) : '—'), hideOnMobile: true, className: 'whitespace-nowrap' },
    { header: 'Actions', cell: (e) => <Button asChild size="icon" variant="outline" title="View" aria-label="View"><Link to={`/proposal-tracker/engineers/${e.id}`}><Eye className="h-4 w-4" /></Link></Button> },
  ];

  return (
    <>
      <PageHeader title="Engineers" description="Engineer-wise assigned proposals, progress, pending and overdue work. Open an engineer to see their dashboard." />
      <Card><CardContent className="p-4 md:p-6">
        <DataTable rows={engineers} columns={columns} pageSize={10} emptyTitle="No engineers" searchText={(e) => `${e.name} ${e.code} ${e.email}`} />
      </CardContent></Card>
    </>
  );
};

export default Engineers;
