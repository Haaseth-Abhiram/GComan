/** Showing and reviewing one daily report (used by managers and the admin). */
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fmtDate, fmtMinutes } from '@/portal/lib/attendance';
import { REPORTS_KEY, REPORT_STATUS_STYLE, REPORT_STATUS_TEXT, reviewReport, type ReportStatus, type WorkReport } from '@/portal/lib/reports';

export const ReportBadge = ({ status }: { status: ReportStatus }) => (
  <Badge variant="outline" className={REPORT_STATUS_STYLE[status]}>{REPORT_STATUS_TEXT[status]}</Badge>
);

const Text = ({ label, value }: { label: string; value: string | null }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 whitespace-pre-wrap break-words text-sm">{value || '—'}</p>
  </div>
);

export const ReportBody = ({ report }: { report: WorkReport }) => (
  <div className="space-y-4">
    {(report.summary || !report.items?.length) && <Text label="What they worked on" value={report.summary} />}
    {!!report.items?.length && (
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Projects</p>
        <ul className="mt-1 space-y-2">
          {report.items.map((i) => (
            <li key={i.project_id} className="rounded-xl border p-3 text-sm">
              <p className="font-semibold">{i.name} <span className="font-normal text-muted-foreground">· {Number(i.hours)} h</span></p>
              <p className="whitespace-pre-wrap break-words">{i.work}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
    <Text label="Pending work or blockers" value={report.pending} />
    {report.review_comment && <Text label={`Comment from ${report.reviewed_by ?? 'the reviewer'}`} value={report.review_comment} />}
  </div>
);

/** Pop-up with the report; reviewers get "Mark reviewed" and "Send back". */
export const ReportDialog = ({ report, onClose }: { report: WorkReport | null; onClose: () => void }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const close = () => { setComment(''); onClose(); };

  const review = useMutation({
    mutationFn: (action: 'reviewed' | 'returned') => reviewReport(report!.id, action, comment),
    onSuccess: (_d, action) => {
      toast({ title: action === 'reviewed' ? 'Report marked reviewed' : 'Report sent back' });
      close();
    },
    onError: (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' }),
    onSettled: () => Promise.all([
      qc.invalidateQueries({ queryKey: REPORTS_KEY }),
      qc.invalidateQueries({ queryKey: ['admin', 'reports'] }),
    ]),
  });

  return (
    <Dialog open={!!report} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        {report && (
          <>
            <DialogHeader>
              <DialogTitle>{report.employee.full_name}</DialogTitle>
              <DialogDescription>
                {fmtDate(report.report_date)} · {report.employee.employee_code}
                {report.worked_minutes != null && ` · worked ${fmtMinutes(report.worked_minutes)}`}
              </DialogDescription>
            </DialogHeader>
            <div><ReportBadge status={report.status} /></div>
            <ReportBody report={report} />
            {report.can_review && (
              <>
                <Textarea aria-label="Review comment" maxLength={1000} placeholder="Comment (needed to send back)" value={comment} onChange={(e) => setComment(e.target.value)} />
                <DialogFooter className="gap-2">
                  <Button variant="outline" disabled={review.isPending || !comment.trim()} onClick={() => review.mutate('returned')}>
                    <Undo2 className="mr-2 h-4 w-4" />Send back
                  </Button>
                  <Button disabled={review.isPending} onClick={() => review.mutate('reviewed')}>
                    {review.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}Mark reviewed
                  </Button>
                </DialogFooter>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
