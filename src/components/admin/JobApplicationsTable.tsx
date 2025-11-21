import { useEffect, useState } from 'react';
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
import { format } from 'date-fns';
import { Download, Loader2 } from 'lucide-react';

type JobApplication = Tables<'job_applications'>;

export const JobApplicationsTable = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const downloadResume = async (resumePath: string, applicantName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${applicantName}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
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
    <Card>
      <CardHeader>
        <CardTitle>Job Applications</CardTitle>
        <CardDescription>All job applications submitted through your careers page</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Resume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No job applications yet
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(application.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{application.name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.phone}</TableCell>
                    <TableCell>{application.position}</TableCell>
                    <TableCell>{application.experience}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
