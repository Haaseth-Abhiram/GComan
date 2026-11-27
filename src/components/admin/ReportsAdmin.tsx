/** Admin → Daily Reports: who submitted on a day, and everything waiting for review. */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Eye, FileX, Loader2, Undo2, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fmtDate, fmtMinutes } from '@/portal/lib/attendance';
import { fetchAdminReports, shiftDay, type ReportPerson, type WorkReport } from '@/portal/lib/reports';
import { ReportBadge, ReportDialog } from '@/portal/components/ReportView';
import { KpiCard } from '@/portal/theme/ui';

const ReportsTable = ({ rows, showDate, onOpen }: {
  rows: { employee: ReportPerson; report: WorkReport | null }[]; showDate?: boolean; onOpen: (id: string) => void;
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          {showDate && <TableHead>Date</TableHead>}
          <TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Work</TableHead><TableHead>Worked</TableHead><TableHead>Status</TableHead><TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ employee, report }) => (
          <TableRow key={report?.id ?? employee.id}>
            {showDate && <TableCell className="whitespace-nowrap">{report && fmtDate(report.report_date)}</TableCell>}
            <TableCell>
              <div className="font-medium">{employee.full_name}</div>
              <div className="text-xs text-muted-foreground">{employee.employee_code}</div>
            </TableCell>
            <TableCell>{employee.department ?? '—'}</TableCell>
            <TableCell className="max-w-xs truncate text-muted-foreground">{report?.summary ?? '—'}</TableCell>
            <TableCell className="whitespace-nowrap">{report?.worked_minutes != null ? fmtMinutes(report.worked_minutes) : '—'}</TableCell>
            <TableCell>{report ? <ReportBadge status={report.status} /> : <span className="text-xs text-muted-foreground">Not submitted</span>}</TableCell>
            <TableCell className="text-right">
              {report && (
                <Button size="sm" variant={report.can_review ? 'default' : 'outline'} aria-label={`${report.can_review ? 'Review' : 'View'} report of ${employee.full_name}`} onClick={() => onOpen(report.id)}>
                  <Eye className="mr-1 h-4 w-4" />{report.can_review ? 'Review' : 'View'}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const ReportsAdmin = () => {
  const [date, setDate] = useState<string | null>(null);   // null = today (company date)
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'reports', date],
    queryFn: () => fetchAdminReports(date),
    placeholderData: (previous) => previous,
  });

  const count = (fn: (r: WorkReport | null) => boolean) => data?.rows.filter((x) => fn(x.report)).length ?? 0;
  const open = data ? [...data.rows.map((r) => r.report), ...data.waiting].find((r) => r?.id === openId) ?? null : null;
  const numbers: [string, number, LucideIcon, 'navy' | 'green' | 'orange' | 'violet'][] = [
    ['Submitted, waiting', count((r) => r?.status === 'submitted'), Clock, 'navy'],
    ['Reviewed', count((r) => r?.status === 'reviewed'), CheckCircle2, 'green'],
    ['Sent back', count((r) => r?.status === 'returned'), Undo2, 'violet'],
    ['Not submitted', count((r) => !r), FileX, 'orange'],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Reports</h1>
          <p className="text-sm text-muted-foreground">What each employee worked on, and reports waiting for review.</p>
        </div>
        {data && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" aria-label="Previous day" onClick={() => setDate(shiftDay(data.date, -1))}><ChevronLeft className="h-4 w-4" /></Button>
            <Input type="date" aria-label="Report date" className="w-40" value={data.date} max={data.today} onChange={(e) => e.target.value && setDate(e.target.value)} />
            <Button variant="outline" size="icon" aria-label="Next day" disabled={data.date >= data.today} onClick={() => setDate(shiftDay(data.date, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>

      {isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        : error || !data ? <p className="text-sm text-destructive">Could not load reports: {(error as Error)?.message}</p> : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {numbers.map(([label, value, icon, accent]) => <KpiCard key={label} icon={icon} accent={accent} label={label} value={value} />)}
            </div>
            <Tabs defaultValue="day" className="space-y-4">
              <TabsList>
                <TabsTrigger value="day">{fmtDate(data.date)}</TabsTrigger>
                <TabsTrigger value="waiting">Waiting for review ({data.waiting.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="day">
                <Card>
                  <CardHeader><CardTitle className="text-base">Reports of the day</CardTitle><CardDescription>Drafts are not shown until they are submitted.</CardDescription></CardHeader>
                  <CardContent>
                    {data.rows.length ? <ReportsTable rows={data.rows} onOpen={setOpenId} /> : <p className="py-8 text-center text-sm text-muted-foreground">No employees to show.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="waiting">
                <Card>
                  <CardContent className="pt-6">
                    {data.waiting.length
                      ? <ReportsTable showDate rows={data.waiting.map((r) => ({ employee: r.employee, report: r }))} onOpen={setOpenId} />
                      : <p className="py-8 text-center text-sm text-muted-foreground">Nothing is waiting.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      <ReportDialog report={open} onClose={() => setOpenId(null)} />
    </div>
  );
};

export default ReportsAdmin;
