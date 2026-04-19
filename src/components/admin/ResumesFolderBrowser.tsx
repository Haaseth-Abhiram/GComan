import { useEffect, useMemo, useState } from 'react';
import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Loader2,
  RefreshCw,
  Search,
  FolderArchive,
} from 'lucide-react';

interface ResumeFile {
  fullPath: string;
  fileName: string;
  position: string; // top-level folder (designation slug)
  month: string;    // YYYY-MM (or 'unknown')
  size?: number;
  createdAt?: string;
}

const formatBytes = (bytes?: number) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const prettifySlug = (slug: string) =>
  slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || 'Uncategorized';

// Recursively list every file under the resumes bucket.
async function listAllFiles(prefix = ''): Promise<ResumeFile[]> {
  const { data, error } = await supabase.storage.from('resumes').list(prefix, {
    limit: 1000,
    sortBy: { column: 'name', order: 'desc' },
  });
  if (error) throw error;
  if (!data) return [];

  const results: ResumeFile[] = [];
  for (const entry of data) {
    const fullPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.id === null) {
      // Folder — recurse
      const nested = await listAllFiles(fullPath);
      results.push(...nested);
    } else {
      const parts = fullPath.split('/');
      const position = parts.length > 1 ? parts[0] : 'uncategorized';
      const month = parts.length > 2 ? parts[1] : 'unknown';
      results.push({
        fullPath,
        fileName: entry.name,
        position,
        month,
        size: (entry.metadata as { size?: number } | null)?.size,
        createdAt: entry.created_at ?? undefined,
      });
    }
  }
  return results;
}

export const ResumesFolderBrowser = () => {
  const [files, setFiles] = useState<ResumeFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isZipping, setIsZipping] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setSelected(new Set());
    try {
      const all = await listAllFiles('');
      setFiles(all);
    } catch (e) {
      console.error('Error listing resumes:', e);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const positions = useMemo(() => {
    const set = new Set(files.map((f) => f.position));
    return Array.from(set).sort();
  }, [files]);

  const months = useMemo(() => {
    const set = new Set(files.map((f) => f.month));
    return Array.from(set).sort().reverse();
  }, [files]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return files.filter((f) => {
      if (positionFilter !== 'all' && f.position !== positionFilter) return false;
      if (monthFilter !== 'all' && f.month !== monthFilter) return false;
      if (q && !`${f.fileName} ${f.position} ${f.month}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [files, search, positionFilter, monthFilter]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((f) => selected.has(f.fullPath));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filtered.forEach((f) => next.delete(f.fullPath));
      } else {
        filtered.forEach((f) => next.add(f.fullPath));
      }
      return next;
    });
  };

  const toggleOne = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const downloadFile = async (file: ResumeFile) => {
    try {
      const { data, error } = await supabase.storage.from('resumes').download(file.fullPath);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  const downloadSelectedAsZip = async () => {
    const targets = filtered.filter((f) => selected.has(f.fullPath));
    if (targets.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const file of targets) {
        const { data, error } = await supabase.storage.from('resumes').download(file.fullPath);
        if (error || !data) continue;
        const folder = zip.folder(`${prettifySlug(file.position)}/${file.month}`);
        const buffer = await data.arrayBuffer();
        folder!.file(file.fileName, buffer);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const stamp = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `resumes_${stamp}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Zip error:', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>Resume Library</CardTitle>
            <CardDescription>
              Filter resumes by designation/month and download individually or as a ZIP.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={load} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={downloadSelectedAsZip}
              disabled={selected.size === 0 || isZipping}
            >
              {isZipping ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FolderArchive className="h-4 w-4 mr-2" />
              )}
              Download ZIP ({selected.size})
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search filename, position…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              {positions.map((p) => (
                <SelectItem key={p} value={p}>
                  {prettifySlug(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No resumes match the current filters.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-2 py-2 border-b mb-2">
              <Checkbox
                checked={allFilteredSelected}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
              <span className="text-xs text-muted-foreground">
                Select all ({filtered.length})
              </span>
            </div>
            <div className="space-y-2">
              {filtered.map((file) => (
                <div
                  key={file.fullPath}
                  className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={selected.has(file.fullPath)}
                    onCheckedChange={() => toggleOne(file.fullPath)}
                    aria-label={`Select ${file.fileName}`}
                  />
                  <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{file.fileName}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {prettifySlug(file.position)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {file.month}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatBytes(file.size)}
                        {file.createdAt && ` · ${new Date(file.createdAt).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => downloadFile(file)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Showing {filtered.length} of {files.length} resumes · {selected.size} selected
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
