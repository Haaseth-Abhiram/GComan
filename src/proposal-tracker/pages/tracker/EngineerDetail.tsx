import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, NotebookPen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDb } from '@/proposal-tracker/lib/db';
import { can } from '@/proposal-tracker/lib/permissions';
import { engineerMetrics, matchesFilter } from '@/proposal-tracker/lib/metrics';
import { DataTable, PageHeader, PriorityBadge, StatusBadge, fmtDate, isOverdue, useActor, type Column } from '@/proposal-tracker/components/tracker/common';
import type { Rfq } from '@/proposal-tracker/lib/db';

/**
 * /engineers/:id — ONLY that engineer's projects.
 * Admin may open any engineer; an engineer may only open themselves. Anything else is refused,
 * and the data layer would not return another engineer's records to them anyway.
 */
const EngineerDetail = () => {
  const { id = '' } = useParams();
  const actor = useActor();
  const db = useDb();
  const [filter, setFilter] = useState('all');

  const allowed = can(actor, 'rfq.viewAll') || id === actor.id;
  if (!allowed) return <PageHeader title="Access denied" description="You can only view your own engineer details." />;

  const emp = db.employees.find((e) => e.id === id && e.role === 'engineer');
  if (!emp) return <PageHeader title="Engineer not found" description="They may not exist or you may not have access." />;

  const rfqs = db.rfqs.filter((r) => r.primaryEngineerId === id || r.supportingIds.includes(id));
  const m = engineerMetrics(rfqs);
  const shown = rfqs.filter((r) => matchesFilter(r, filter));
  const chips: Array<{ key: string; label: string; n: number; tone?: string }> = [
    { key: 'all', label: 'Total', n: m.assigned },
    { key: 'In Progress', label: 'In progress', n: m.inProgress },
    { key: 'Pending', label: 'Pending', n: m.pending },
    { key: 'Submitted', label: 'Submitted', n: m.submitted },
    { key: 'Overdue', label: 'Overdue', n: m.overdue, tone: 'text-red-700' },
  ];
  const columns: Column<Rfq>[] = [
    { header: 'RFQ', cell: (r) => <div><p className="font-medium whitespace-nowrap">{r.ref}</p><p className="text-xs text-muted-foreground">{r.customer.name}</p></div> },
    { header: 'Project', cell: (r) => r.project, hideOnMobile: true },
    { header: 'Role', cell: (r) => (r.primaryEngineerId === id ? 'Primary' : 'Supporting'), hideOnMobile: true },
    { header: 'Deadline', cell: (r) => <span className={isOverdue(r) ? 'text-red-600 font-medium' : ''}>{fmtDate(r.deadline)}</span>, className: 'whitespace-nowrap' },
    { header: 'Priority', cell: (r) => <PriorityBadge priority={r.priority} />, hideOnMobile: true },
    { header: 'Progress', cell: (r) => `${r.progress}%` },
    { header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      cell: (r) => <Button asChild size="icon" variant="outline" title="View" aria-label="View"><Link to={`/proposal-tracker/rfqs?view=${r.id}`}><Eye className="h-4 w-4" /></Link></Button>,
    },
  ];

  return (
    <>
      {can(actor, 'rfq.viewAll') && (
        <Link to="/proposal-tracker/engineers" className="inline-flex items-center gap-1 text-sm text-primary mb-4"><ArrowLeft className="h-4 w-4" />All engineers</Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-semibold" data-testid="profile-name">{emp.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{emp.code} · Projects this engineer is working on</p>
        </div>
        {can(actor, 'rfq.viewAll') && (
          <Button asChild variant="outline" size="sm"><Link to={`/proposal-tracker/daily-updates?engineer=${emp.id}`}><NotebookPen className="h-4 w-4 mr-1" />Daily updates</Link></Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4" data-testid="engineer-summary" role="group" aria-label="Filter projects">
        {chips.map((c) => (
          <button
            key={c.key} type="button" aria-pressed={filter === c.key} onClick={() => setFilter(c.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              filter === c.key ? 'bg-primary text-primary-foreground border-primary' : `bg-background hover:bg-primary/10 ${c.tone ?? ''}`}`}
          >
            {c.label} {c.n}
          </button>
        ))}
      </div>
      <Card>
        <CardContent className="p-4 md:p-6">
          <DataTable rows={shown} columns={columns} pageSize={10} emptyTitle={filter === 'all' ? 'No projects assigned' : 'No projects match this filter'} emptyHint={filter === 'all' ? `${emp.name} has no assigned proposals yet.` : 'Choose Total to see all projects.'}
            searchText={(r) => `${r.ref} ${r.customer.name} ${r.project}`} />
        </CardContent>
      </Card>
    </>
  );
};

export default EngineerDetail;
