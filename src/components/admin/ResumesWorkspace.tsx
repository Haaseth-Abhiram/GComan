import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumesFolderBrowser } from './ResumesFolderBrowser';
import { IntelligentJobApplicationsTable } from './IntelligentJobApplicationsTable';
import { Brain, FolderArchive } from 'lucide-react';
import { useCan } from '@/portal/lib/useCan';

export const ResumesWorkspace = () => {
  // The Resume Library lists the CV files themselves, so it needs the CV permission.
  const canFiles = useCan()('website.jobs.download');
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Resumes & Hiring</h1>
        <p className="text-sm text-muted-foreground">
          Review applications with PDF preview, record decisions and prospect ratings, or browse the raw resume library.
        </p>
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList>
          <TabsTrigger value="applications" className="gap-2">
            <Brain className="h-4 w-4" /> Applications
          </TabsTrigger>
          {canFiles && <TabsTrigger value="library" className="gap-2">
            <FolderArchive className="h-4 w-4" /> Resume Library
          </TabsTrigger>}
        </TabsList>
        <TabsContent value="applications" className="mt-4">
          <IntelligentJobApplicationsTable />
        </TabsContent>
        {canFiles && <TabsContent value="library" className="mt-4">
          <ResumesFolderBrowser />
        </TabsContent>}
      </Tabs>
    </div>
  );
};
