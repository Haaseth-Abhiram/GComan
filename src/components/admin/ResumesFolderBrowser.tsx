import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderOpen, FileText, Download, ChevronRight, Home, Loader2, RefreshCw } from 'lucide-react';

interface StorageEntry {
  name: string;
  id: string | null;
  metadata?: { size?: number; mimetype?: string } | null;
  updated_at?: string | null;
  created_at?: string | null;
}

const formatBytes = (bytes?: number) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export const ResumesFolderBrowser = () => {
  const [path, setPath] = useState<string>('');
  const [entries, setEntries] = useState<StorageEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async (p: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage.from('resumes').list(p, {
        limit: 1000,
        sortBy: { column: 'name', order: 'desc' },
      });
      if (error) throw error;
      setEntries(data || []);
    } catch (e) {
      console.error('Error listing folder:', e);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(path);
  }, [path]);

  const folders = entries.filter((e) => e.id === null);
  const files = entries.filter((e) => e.id !== null);

  const segments = path ? path.split('/').filter(Boolean) : [];

  const downloadFile = async (name: string) => {
    const fullPath = path ? `${path}/${name}` : name;
    try {
      const { data, error } = await supabase.storage.from('resumes').download(fullPath);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>Resume Folders</CardTitle>
            <CardDescription>
              Browse organized resumes by position and month. HR can download files directly.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => load(path)} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 text-sm flex-wrap mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => setPath('')}
          >
            <Home className="h-3 w-3 mr-1" />
            resumes
          </Button>
          {segments.map((seg, idx) => {
            const next = segments.slice(0, idx + 1).join('/');
            return (
              <span key={next} className="flex items-center">
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setPath(next)}
                >
                  {seg}
                </Button>
              </span>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            This folder is empty.
          </div>
        ) : (
          <div className="space-y-2">
            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setPath(path ? `${path}/${folder.name}` : folder.name)}
                className="w-full flex items-center gap-3 p-3 rounded-md border hover:bg-muted transition-colors text-left"
              >
                <Folder className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <span className="font-medium flex-1 truncate">{folder.name}</span>
                <Badge variant="secondary" className="text-xs">Folder</Badge>
              </button>
            ))}
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
              >
                <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.metadata?.size)}
                    {file.created_at && ` · ${new Date(file.created_at).toLocaleDateString()}`}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => downloadFile(file.name)}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (folders.length > 0 || files.length > 0) && (
          <p className="text-xs text-muted-foreground mt-4">
            {folders.length} folder{folders.length !== 1 ? 's' : ''} · {files.length} file{files.length !== 1 ? 's' : ''}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
