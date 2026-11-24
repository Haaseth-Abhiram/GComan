import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { setGrant, useDb } from '@/proposal-tracker/lib/db';
import { can, effectiveGrants, PERMISSIONS, PERMISSION_INFO, ROLE_LABEL, type Permission } from '@/proposal-tracker/lib/permissions';
import { DataTable, PageHeader, fmtDateTime, run, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';
import type { AuditEntry, Employee } from '@/proposal-tracker/lib/db';

/** Admin-only: grant or revoke the configurable permissions, with the audit trail underneath. */
const Permissions = () => {
  const actor = useActor();
  const db = useDb();
  const name = useEmployeeName();

  if (!can(actor, 'permissions.manage')) {
    return <PageHeader title="Permissions" description="Only Admins can manage permissions." />;
  }

  const columns: Column<Employee>[] = [
    { header: 'Employee', cell: (e) => <div><p className="font-medium">{e.name}</p><p className="text-xs text-muted-foreground">{e.email}</p></div> },
    { header: 'Role', cell: (e) => <Badge variant="outline">{ROLE_LABEL[e.role]}</Badge> },
    ...PERMISSIONS.map((p: Permission) => ({
      header: PERMISSION_INFO[p].label,
      cell: (e: Employee) => {
        if (!PERMISSION_INFO[p].roles.includes(e.role)) {
          // Admins and Engineers already create RFQs, and Admins export all reports, by role; Engineers can never approve.
          const inherent = (p === 'rfq.create' || p === 'report.export_limited');
          return <span className="text-xs text-muted-foreground">{inherent ? 'Included in role' : 'Not available'}</span>;
        }
        const on = effectiveGrants(e.role, db.grants[e.id]).includes(p);
        return (
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={on} aria-label={`${PERMISSION_INFO[p].label} for ${e.name}`}
              onChange={(ev) => run(() => setGrant(actor, e.id, p, ev.target.checked), `${ev.target.checked ? 'Granted' : 'Revoked'}: ${PERMISSION_INFO[p].label} — ${e.name}`)} />
            <span className="text-xs">{on ? 'Granted' : 'Off'}</span>
          </label>
        );
      },
    })),
  ];

  const auditCols: Column<AuditEntry>[] = [
    { header: 'When', cell: (a) => fmtDateTime(a.at), className: 'whitespace-nowrap' },
    { header: 'By', cell: (a) => name(a.actorId), hideOnMobile: true },
    { header: 'Action', cell: (a) => <Badge variant="outline">{a.action}</Badge> },
    { header: 'Detail', cell: (a) => a.detail },
  ];

  return (
    <>
      <PageHeader title="Permissions" description="Approval and commercial costing are never implied by role: grant them here. Every change is recorded in the audit log." />
      <Card className="mb-6">
        <CardHeader className="pb-2"><CardTitle>User permissions</CardTitle><CardDescription>Roles: Admin, Engineer.</CardDescription></CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground mb-4 space-y-1">
            {PERMISSIONS.map((p) => <li key={p}><b className="text-foreground">{PERMISSION_INFO[p].label}</b> — {PERMISSION_INFO[p].description}</li>)}
          </ul>
          <DataTable rows={db.employees} columns={columns} emptyTitle="No employees" pageSize={10} searchText={(e) => `${e.name} ${e.email} ${e.role}`} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle>Audit log</CardTitle><CardDescription>Permission changes and important proposal actions.</CardDescription></CardHeader>
        <CardContent><DataTable rows={db.audit} columns={auditCols} emptyTitle="No audit entries yet" pageSize={8} searchText={(a) => `${a.action} ${a.detail}`} /></CardContent>
      </Card>
    </>
  );
};

export default Permissions;
