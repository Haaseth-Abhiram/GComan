import { useMemo, useState, type ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
import { Inbox, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { can } from '@/proposal-tracker/lib/permissions';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { useDb, type Permission, type Priority, type Role, type RfqStatus, type TaskStatus } from '@/proposal-tracker/lib/db';

export const fmtDate = (s?: string) => (s ? format(parseISO(s.length > 10 ? s : `${s}T00:00:00`), 'dd MMM yyyy') : '—');
export const fmtDateTime = (s: string) => format(new Date(s), 'dd MMM yyyy, HH:mm');
export const daysUntil = (s: string) => Math.round((new Date(`${s}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86_400_000);
export const isOverdue = (r: { deadline: string; status: RfqStatus }) =>
  r.status !== 'Submitted' && daysUntil(r.deadline) < 0;
export const fmtSize = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`);

/** The signed-in user plus the grants the data layer says they hold (used for UI hints; the data layer re-checks everything). */
export const useActor = (): { id: string; role: Role; name: string; grants: Permission[] } => {
  const { user } = useAuth();
  const db = useDb();
  return { id: user!.id, role: user!.role, name: user!.name, grants: db.me?.grants ?? [] };
};
/** An employee's name. For Admin, an engineer's name is a link to all of that engineer's projects. */
export const EngineerName = ({ id }: { id?: string | null }) => {
  const actor = useActor();
  const { employees } = useDb();
  const e = employees.find((x) => x.id === id);
  if (!e) return <>—</>;
  if (e.role === 'engineer' && can(actor, 'rfq.viewAll')) {
    return (
      <Link to={`/proposal-tracker/engineers/${e.id}`} title={`Open ${e.name}'s projects`} className="text-primary hover:underline underline-offset-2">
        {e.name}
      </Link>
    );
  }
  return <>{e.name}</>;
};
export const useEmployeeName = () => {
  const { employees } = useDb();
  return (id?: string | null) => employees.find((e) => e.id === id)?.name ?? '—';
};

/** Run a mutation; show a success toast or the error as a destructive toast. */
export async function run(fn: () => unknown | Promise<unknown>, success: string): Promise<boolean> {
  try {
    await fn();
    toast({ title: success });
    return true;
  } catch (e) {
    toast({ title: 'Could not save', description: e instanceof Error ? e.message : 'Unexpected error', variant: 'destructive' });
    return false;
  }
}

const statusTone: Record<string, string> = {
  New: 'bg-sky-100 text-sky-700 border-sky-200', Assigned: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200', 'Under Review': 'bg-amber-100 text-amber-700 border-amber-200',
  Returned: 'bg-orange-100 text-orange-700 border-orange-200', Approved: 'bg-teal-100 text-teal-700 border-teal-200',
  Submitted: 'bg-purple-100 text-purple-700 border-purple-200', Completed: 'bg-green-100 text-green-700 border-green-200',
  'Not Started': 'bg-slate-100 text-slate-700 border-slate-200', Blocked: 'bg-red-100 text-red-700 border-red-200',
  Sent: 'bg-amber-100 text-amber-700 border-amber-200', 'Sent for Review': 'bg-amber-100 text-amber-700 border-amber-200',
  Overdue: 'bg-red-100 text-red-700 border-red-200', Done: 'bg-green-100 text-green-700 border-green-200', Open: 'bg-blue-100 text-blue-700 border-blue-200',
};
export const StatusBadge = ({ status }: { status: RfqStatus | TaskStatus | string }) => (
  <Badge variant="outline" className={`whitespace-nowrap ${statusTone[status] ?? ''}`}>{status}</Badge>
);
const prTone: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700 border-red-200', Medium: 'bg-amber-100 text-amber-700 border-amber-200', Low: 'bg-slate-100 text-slate-700 border-slate-200',
};
export const PriorityBadge = ({ priority }: { priority: Priority }) => <Badge variant="outline" className={prTone[priority]}>{priority}</Badge>;

export const PageHeader = ({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) => (
  <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
    {actions}
  </div>
);

export const EmptyState = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
    <Inbox className="h-10 w-10 mb-3 opacity-50" />
    <p className="font-medium text-foreground">{title}</p>
    {hint && <p className="text-sm mt-1">{hint}</p>}
  </div>
);

export interface Column<T> { header: string; cell: (row: T) => ReactNode; className?: string; hideOnMobile?: boolean }

/** Searchable, paginated table. `searchText` builds the string the search box matches against. */
export function DataTable<T extends { id: string }>({
  rows, columns, searchText, filters, pageSize = 8, emptyTitle, emptyHint,
}: {
  rows: T[]; columns: Column<T>[]; searchText?: (r: T) => string; filters?: ReactNode;
  pageSize?: number; emptyTitle: string; emptyHint?: string;
}) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return needle && searchText ? rows.filter((r) => searchText(r).toLowerCase().includes(needle)) : rows;
  }, [rows, q, searchText]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const slice = filtered.slice(cur * pageSize, cur * pageSize + pageSize);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {searchText && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input aria-label="Search" placeholder="Search…" className="pl-9" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
          </div>
        )}
        {filters}
      </div>
      {filtered.length === 0 ? (
        <EmptyState title={emptyTitle} hint={q ? 'No results match your search.' : emptyHint} />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => <TableHead key={c.header} className={`${c.hideOnMobile ? 'hidden md:table-cell ' : ''}${c.className ?? ''}`}>{c.header}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {slice.map((r) => (
                <TableRow key={r.id}>
                  {columns.map((c) => <TableCell key={c.header} className={`${c.hideOnMobile ? 'hidden md:table-cell ' : ''}${c.className ?? ''}`}>{c.cell(r)}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filtered.length} record{filtered.length === 1 ? '' : 's'} · page {cur + 1} of {pages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={cur === 0} onClick={() => setPage(cur - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export const FieldError = ({ msg }: { msg?: string }) => (msg ? <p role="alert" className="text-xs text-destructive mt-1">{msg}</p> : null);

export function downloadCsv(filename: string, rows: Array<Record<string, string | number>>) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [cols.map(esc).join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
