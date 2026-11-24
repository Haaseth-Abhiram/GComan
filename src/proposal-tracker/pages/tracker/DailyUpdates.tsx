import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDb, type DailyUpdate } from '@/proposal-tracker/lib/db';
import { can } from '@/proposal-tracker/lib/permissions';
import { DailyUpdateForm } from '@/proposal-tracker/components/tracker/DailyUpdateForm';
import { DataTable, PageHeader, fmtDate, fmtDateTime, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';

/** Engineers see and add their own daily updates; Admin can browse everyone's. */
const DailyUpdates = () => {
  const actor = useActor();
  const db = useDb();
  const name = useEmployeeName();
  const [params] = useSearchParams();
  const [eng, setEng] = useState(params.get('engineer') ?? 'all');
  useEffect(() => { const e = params.get('engineer'); if (e) setEng(e); }, [params]);
  const all = can(actor, 'rfq.viewAll');
  const rows = db.dailyUpdates.filter((d) => eng === 'all' || d.engineerId === eng).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const rfqRef = (id: string | null) => db.rfqs.find((r) => r.id === id)?.ref ?? '—';

  const columns: Column<DailyUpdate>[] = [
    { header: 'Date', cell: (d) => fmtDate(d.date), className: 'whitespace-nowrap' },
    ...(all ? [{ header: 'Engineer', cell: (d: DailyUpdate) => <EngineerName id={d.engineerId} /> }] : []),
    { header: 'Update', cell: (d) => d.note },
    { header: 'Proposal', cell: (d) => rfqRef(d.rfqId), hideOnMobile: true, className: 'whitespace-nowrap' },
    { header: 'Logged', cell: (d) => fmtDateTime(d.createdAt), hideOnMobile: true, className: 'whitespace-nowrap' },
  ];

  return (
    <>
      <PageHeader title="Daily Updates" description={all ? 'Daily work updates from all engineers.' : 'Your daily work updates. Only you and admins can see them.'} />
      {can(actor, 'dailyupdate.add') && (
        <Card className="mb-6">
          <CardHeader className="pb-2"><CardTitle>Add today's update</CardTitle><CardDescription>Saved against your account automatically.</CardDescription></CardHeader>
          <CardContent><DailyUpdateForm /></CardContent>
        </Card>
      )}
      <Card><CardContent className="p-4 md:p-6">
        <DataTable rows={rows} columns={columns} emptyTitle="No daily updates yet" emptyHint="Updates you add will appear here."
          searchText={(d) => `${d.note} ${rfqRef(d.rfqId)} ${name(d.engineerId)}`}
          filters={all ? (
            <Select value={eng} onValueChange={setEng}>
              <SelectTrigger aria-label="Filter by engineer" className="w-full sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All engineers</SelectItem>
                {db.employees.filter((e) => e.role === 'engineer').map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : undefined} />
      </CardContent></Card>
    </>
  );
};

export default DailyUpdates;
