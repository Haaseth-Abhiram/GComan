import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Loader2, Eye, Mail, MailCheck, MailX, AlertCircle, FileSpreadsheet, Search, ExternalLink, CheckCircle2, XCircle, CircleDashed, Trash2, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { exportToExcel } from '@/lib/exportToExcel';
import { DateRangeFilter, inDateRange, loadDateRange, DateRange } from './DateRangeFilter';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  created_at: string;
  synced_to_zoho: boolean | null;
  zoho_lead_id: string | null;
  zoho_synced_at?: string | null;
  zoho_error?: string | null;
  email_sent: boolean | null;
  email_sent_at: string | null;
  email_error: string | null;
}

const ZOHO_LEAD_URL = (id: string) => `https://crm.zoho.com/crm/EntityInfo.do?module=Leads&id=${id}`;

export const ContactSubmissionsTable = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');
  const [dateRange, setDateRange] = useState<DateRange>(loadDateRange('contacts'));
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [resyncing, setResyncing] = useState(false);
  const [resyncPreview, setResyncPreview] = useState<{ wouldPush: number; skipped: number } | null>(null);

  /**
   * Re-push submissions that never reached Zoho. Two-step on purpose: the
   * first click is a dry run (writes nothing) and reports what would be sent;
   * the button then switches to "Push N to Zoho" and only that second click
   * creates Leads. The function itself skips anything that already has a
   * zoho_lead_id, so repeats cannot duplicate a Lead.
   */
  const handleResync = async () => {
    setResyncing(true);
    try {
      const execute = resyncPreview !== null;
      const { data, error } = await supabase.functions.invoke('resync-zoho-leads', {
        body: execute ? { execute: true, limit: 50 } : {},
      });
      if (error) throw error;

      if (!execute) {
        setResyncPreview({ wouldPush: data.wouldPush, skipped: data.skipped?.length ?? 0 });
        toast({
          title: `${data.wouldPush} submission(s) missing from Zoho`,
          description:
            data.wouldPush > 0
              ? `${data.skipped?.length ?? 0} test/internal/spam row(s) will be skipped. Click again to push.`
              : 'Nothing to re-push — every genuine enquiry is already in the CRM.',
        });
        if (data.wouldPush === 0) setResyncPreview(null);
      } else {
        setResyncPreview(null);
        toast({
          title: `Pushed ${data.pushedCount} lead(s) to Zoho`,
          description:
            data.failedCount > 0
              ? `${data.failedCount} failed — see the CRM Status column for the error.`
              : data.remaining > 0
                ? `${data.remaining} remaining — run again to continue.`
                : 'All caught up.',
          variant: data.failedCount > 0 ? 'destructive' : undefined,
        });
        fetchSubmissions();
      }
    } catch (err) {
      toast({
        title: 'CRM sync failed',
        description: err instanceof Error ? err.message : 'Unexpected error',
        variant: 'destructive',
      });
    } finally {
      setResyncing(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions((data as ContactSubmission[]) || []);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', deleteTarget.id);
      if (error) throw error;
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast({ title: 'Submission deleted', description: `Removed contact from ${deleteTarget.name}.` });
      setDeleteTarget(null);
      if (selectedSubmission?.id === deleteTarget.id) setSelectedSubmission(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      toast({ title: 'Delete failed', description: err.message || 'Could not delete submission.', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter((s) => {
      if (statusFilter === 'sent' && s.email_sent !== true) return false;
      if (statusFilter === 'failed' && !(s.email_sent === false && s.email_error)) return false;
      if (statusFilter === 'pending' && (s.email_sent === true || s.email_error)) return false;
      if (!inDateRange(s.created_at, dateRange)) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone || '').toLowerCase().includes(q) ||
        (s.company || '').toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q) ||
        s.message.toLowerCase().includes(q)
      );
    });
  }, [submissions, search, statusFilter, dateRange]);

  const handleExport = () => {
    if (!filtered.length) return;
    exportToExcel(
      filtered.map((s) => ({
        Date: format(new Date(s.created_at), 'yyyy-MM-dd HH:mm'),
        Name: s.name,
        Email: s.email,
        Phone: s.phone || '',
        Company: s.company || '',
        Subject: s.subject,
        Message: s.message,
        'Email Status': s.email_sent === true ? 'Sent' : s.email_error ? 'Failed' : 'Pending',
        'Email Sent At': s.email_sent_at ? format(new Date(s.email_sent_at), 'yyyy-MM-dd HH:mm') : '',
        'Email Error': s.email_error || '',
        'CRM Status': s.synced_to_zoho === true ? 'Synced' : s.zoho_error ? 'Failed' : 'Pending',
        'CRM Lead ID': s.zoho_lead_id || '',
        'CRM Synced At': s.zoho_synced_at ? format(new Date(s.zoho_synced_at), 'yyyy-MM-dd HH:mm') : '',
        'CRM Error': s.zoho_error || '',
      })),
      'contact_submissions',
      'Contacts'
    );
  };

  const getCrmStatusBadge = (submission: ContactSubmission) => {
    if (submission.synced_to_zoho === true && submission.zoho_lead_id) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={ZOHO_LEAD_URL(submission.zoho_lead_id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge variant="default" className="bg-blue-100 text-blue-700 border-blue-200 gap-1 hover:bg-blue-200 transition-colors">
                  <CheckCircle2 className="h-3 w-3" />
                  Synced
                  <ExternalLink className="h-3 w-3" />
                </Badge>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Lead {submission.zoho_lead_id} — open in Zoho CRM</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (submission.zoho_error) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Failed
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs break-words">{submission.zoho_error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <Badge variant="secondary" className="gap-1">
          <CircleDashed className="h-3 w-3" />
          Pending
        </Badge>
      );
    }
  };

  const getEmailStatusBadge = (submission: ContactSubmission) => {
    if (submission.email_sent === true) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 gap-1">
                <MailCheck className="h-3 w-3" />
                Sent
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Email sent at {submission.email_sent_at ? format(new Date(submission.email_sent_at), 'MMM d, yyyy h:mm a') : 'Unknown'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (submission.email_sent === false && submission.email_error) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="destructive" className="gap-1">
                <MailX className="h-3 w-3" />
                Failed
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{submission.email_error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <Badge variant="secondary" className="gap-1">
          <Mail className="h-3 w-3" />
          Pending
        </Badge>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>All contact form submissions with email notification status</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Backfill for submissions that never reached Zoho. Always runs a
                  dry run first — the second click is what actually writes. */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleResync}
                disabled={resyncing}
                title="Re-push contact submissions that never reached Zoho CRM"
              >
                {resyncing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {resyncPreview ? `Push ${resyncPreview.wouldPush} to Zoho` : 'Check CRM sync'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={!filtered.length}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel ({filtered.length})
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 mt-4 md:items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, company, subject, message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Email status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <DateRangeFilter storageKey="contacts" value={dateRange} onChange={setDateRange} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Email Status</TableHead>
                  <TableHead>CRM Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No submissions match your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(submission.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.phone || '-'}</TableCell>
                      <TableCell>{submission.company || '-'}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{submission.subject}</TableCell>
                      <TableCell>
                        {getEmailStatusBadge(submission)}
                      </TableCell>
                      <TableCell>
                        {getCrmStatusBadge(submission)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(submission)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
            <DialogDescription>
              From {selectedSubmission?.name} on {selectedSubmission && format(new Date(selectedSubmission.created_at), 'MMMM d, yyyy h:mm a')}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm">{selectedSubmission.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Company</p>
                  <p className="text-sm">{selectedSubmission.company || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Subject</p>
                <p className="text-sm">{selectedSubmission.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Message</p>
                <div className="bg-muted/50 rounded-md p-4">
                  <p className="text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>
              
              {/* Email Status Section */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Email Notification Status</p>
                <div className="flex items-center gap-3">
                  {getEmailStatusBadge(selectedSubmission)}
                  {selectedSubmission.email_sent_at && (
                    <span className="text-xs text-muted-foreground">
                      Sent at {format(new Date(selectedSubmission.email_sent_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  )}
                </div>
                {selectedSubmission.email_error && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <p className="text-xs text-destructive">{selectedSubmission.email_error}</p>
                  </div>
                )}
              </div>

              {/* CRM Sync Status Section */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">Zoho CRM Sync Status</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {getCrmStatusBadge(selectedSubmission)}
                  {selectedSubmission.zoho_synced_at && (
                    <span className="text-xs text-muted-foreground">
                      Synced at {format(new Date(selectedSubmission.zoho_synced_at), 'MMM d, yyyy h:mm a')}
                    </span>
                  )}
                  {selectedSubmission.zoho_lead_id && (
                    <a
                      href={ZOHO_LEAD_URL(selectedSubmission.zoho_lead_id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Open Lead {selectedSubmission.zoho_lead_id}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {selectedSubmission.zoho_error && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    <p className="text-xs text-destructive break-words">{selectedSubmission.zoho_error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedSubmission && (
            <div className="flex justify-end pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteTarget(selectedSubmission)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Submission
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the submission from {deleteTarget?.name} ({deleteTarget?.email}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete(); }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
