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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Loader2, Eye, Mail, MailCheck, MailX, AlertCircle, FileSpreadsheet, Search } from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';

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
  email_sent: boolean | null;
  email_sent_at: string | null;
  email_error: string | null;
}

export const ContactSubmissionsTable = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter((s) => {
      if (statusFilter === 'sent' && s.email_sent !== true) return false;
      if (statusFilter === 'failed' && !(s.email_sent === false && s.email_error)) return false;
      if (statusFilter === 'pending' && (s.email_sent === true || s.email_error)) return false;
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
  }, [submissions, search, statusFilter]);

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
      })),
      'contact_submissions',
      'Contacts'
    );
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contact Submissions</CardTitle>
              <CardDescription>All contact form submissions from your website with email notification status</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MailCheck className="h-3 w-3 text-green-600" />
                <span>Email Sent</span>
              </div>
              <div className="flex items-center gap-1">
                <MailX className="h-3 w-3 text-destructive" />
                <span>Failed</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span>Pending</span>
              </div>
            </div>
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
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No contact submissions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((submission) => (
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
