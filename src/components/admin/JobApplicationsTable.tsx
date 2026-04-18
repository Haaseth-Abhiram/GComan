import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Download, Loader2, FileSpreadsheet, Search, FolderOpen } from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';

type JobApplication = Tables<'job_applications'>;

export const JobApplicationsTable = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const positions = useMemo(
    () => Array.from(new Set(applications.map((a) => a.position).filter(Boolean))),
    [applications]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (positionFilter !== 'all' && a.position !== positionFilter) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.phone || '').toLowerCase().includes(q) ||
        (a.position || '').toLowerCase().includes(q)
      );
    });
  }, [applications, search, positionFilter]);

  const downloadResume = async (resumePath: string, applicantName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      const ext = resumePath.split('.').pop() || 'pdf';
      a.download = `${applicantName}_resume.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const handleExport = () => {
    if (!filtered.length) return;
    exportToExcel(
      filtered.map((a) => ({
        Date: format(new Date(a.created_at), 'yyyy-MM-dd HH:mm'),
        Name: a.name,
        Email: a.email,
        Phone: a.phone,
        Position: a.position,
        Experience: a.experience,
        LinkedIn: a.linkedin_url || '',
        'Cover Letter': a.cover_letter,
        'Resume Folder': a.resume_path.split('/').slice(0, -1).join('/') || '/',
        'Resume File': a.resume_path.split('/').pop() || a.resume_path,
      })),
      'job_applications',
      'Applications'
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>
              All applications. Resumes are organized in storage by position and month for HR.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!filtered.length}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel ({filtered.length})
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, phone, position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All positions</SelectItem>
              {positions.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                <TableHead>Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Folder</TableHead>
                <TableHead>Resume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No job applications match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((application) => {
                  const folder = application.resume_path.split('/').slice(0, -1).join('/') || '/';
                  return (
                    <TableRow key={application.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(application.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{application.name}</TableCell>
                      <TableCell>{application.email}</TableCell>
                      <TableCell>{application.phone}</TableCell>
                      <TableCell>{application.position}</TableCell>
                      <TableCell>{application.experience}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate" title={folder}>
                        <FolderOpen className="h-3 w-3 inline mr-1" />
                        {folder}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadResume(application.resume_path, application.name)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
