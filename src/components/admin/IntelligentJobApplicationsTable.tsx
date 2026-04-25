import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import {
  Loader2, FileSpreadsheet, Search, Eye, Download, Star, Mail, Phone, Linkedin,
} from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';

type JobApplication = Tables<'job_applications'>;

const STATUS_OPTIONS = ['new','reviewed','shortlisted','interview','offer','hired','rejected'] as const;
const PROSPECT_OPTIONS = ['low','medium','high','top'] as const;

const statusColor: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  reviewed: 'bg-slate-100 text-slate-700 border-slate-200',
  shortlisted: 'bg-amber-100 text-amber-700 border-amber-200',
  interview: 'bg-purple-100 text-purple-700 border-purple-200',
  offer: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  hired: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const prospectStars: Record<string, number> = { low: 1, medium: 2, high: 3, top: 4 };

export const IntelligentJobApplicationsTable = () => {
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [prospectFilter, setProspectFilter] = useState('all');
  const [experienceFilter, setExperienceFilter] = useState('all');

  const [selected, setSelected] = useState<JobApplication | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [draftStatus, setDraftStatus] = useState<string>('new');
  const [draftProspect, setDraftProspect] = useState<string>('medium');
  const [draftNotes, setDraftNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setApps(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const positions = useMemo(
    () => Array.from(new Set(apps.map(a => a.position).filter(Boolean))).sort(),
    [apps]
  );
  const experiences = useMemo(
    () => Array.from(new Set(apps.map(a => a.experience).filter(Boolean))).sort(),
    [apps]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter(a => {
      if (positionFilter !== 'all' && a.position !== positionFilter) return false;
      if (statusFilter !== 'all' && (a as any).status !== statusFilter) return false;
      if (prospectFilter !== 'all' && (a as any).prospect !== prospectFilter) return false;
      if (experienceFilter !== 'all' && a.experience !== experienceFilter) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.phone || '').toLowerCase().includes(q) ||
        (a.position || '').toLowerCase().includes(q) ||
        (((a as any).hr_notes || '').toLowerCase().includes(q))
      );
    });
  }, [apps, search, positionFilter, statusFilter, prospectFilter, experienceFilter]);

  // Pipeline summary
  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of STATUS_OPTIONS) counts[s] = 0;
    for (const a of apps) counts[(a as any).status || 'new']++;
    return counts;
  }, [apps]);

  const openCandidate = async (a: JobApplication) => {
    setSelected(a);
    setDraftStatus((a as any).status || 'new');
    setDraftProspect((a as any).prospect || 'medium');
    setDraftNotes((a as any).hr_notes || '');
    setPreviewUrl(null);
    setPreviewLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(a.resume_path, 60 * 60);
      if (!error && data?.signedUrl) setPreviewUrl(data.signedUrl);
    } finally {
      setPreviewLoading(false);
    }
  };

  const saveDecision = async () => {
    if (!selected) return;
    setSaving(true);
    const { data: userRes } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('job_applications')
      .update({
        status: draftStatus as any,
        prospect: draftProspect as any,
        hr_notes: draftNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: userRes.user?.id ?? null,
      } as any)
      .eq('id', selected.id);
    setSaving(false);
    if (!error) {
      setApps(prev => prev.map(a => a.id === selected.id
        ? { ...a, status: draftStatus, prospect: draftProspect, hr_notes: draftNotes } as any
        : a));
      setSelected(null);
    }
  };

  const downloadResume = async (a: JobApplication) => {
    const { data, error } = await supabase.storage.from('resumes').download(a.resume_path);
    if (error || !data) return;
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    const ext = a.resume_path.split('.').pop() || 'pdf';
    link.download = `${a.name}_resume.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (!filtered.length) return;
    exportToExcel(
      filtered.map(a => ({
        Date: format(new Date(a.created_at), 'yyyy-MM-dd HH:mm'),
        Name: a.name,
        Position: a.position,
        Experience: a.experience,
        Status: (a as any).status || 'new',
        Prospect: (a as any).prospect || 'medium',
        Email: a.email,
        Phone: a.phone,
        LinkedIn: a.linkedin_url || '',
        'HR Notes': (a as any).hr_notes || '',
        'Cover Letter': a.cover_letter,
        'Resume Path': a.resume_path,
      })),
      'job_applications',
      'Applications'
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pipeline summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
            className={`p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
              statusFilter === s ? 'ring-2 ring-primary' : ''
            } ${statusColor[s]}`}
          >
            <p className="text-xs font-medium capitalize">{s}</p>
            <p className="text-xl font-bold">{summary[s]}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle>Intelligent Applications Table</CardTitle>
              <CardDescription>
                Filter by designation, experience, status, prospect rating. Click a row to read the resume and record HR decisions.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!filtered.length}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel ({filtered.length})
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger><SelectValue placeholder="Designation" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All designations</SelectItem>
                {positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger><SelectValue placeholder="Experience" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All experience</SelectItem>
                {experiences.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={prospectFilter} onValueChange={setProspectFilter}>
              <SelectTrigger><SelectValue placeholder="Prospect" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All prospects</SelectItem>
                {PROSPECT_OPTIONS.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prospect</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No applications match your filters
                    </TableCell>
                  </TableRow>
                ) : filtered.map(a => {
                  const status = (a as any).status || 'new';
                  const prospect = (a as any).prospect || 'medium';
                  return (
                    <TableRow
                      key={a.id}
                      className="cursor-pointer"
                      onClick={() => openCandidate(a)}
                    >
                      <TableCell>
                        <div className="font-medium">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.email}</div>
                      </TableCell>
                      <TableCell>{a.position}</TableCell>
                      <TableCell>{a.experience}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize ${statusColor[status]}`}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < (prospectStars[prospect] || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-xs capitalize text-muted-foreground">{prospect}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {format(new Date(a.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => { e.stopPropagation(); openCandidate(a); }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Review Dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name} — {selected.position}</DialogTitle>
                <DialogDescription className="flex flex-wrap gap-3 mt-1 text-xs">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selected.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selected.phone}</span>
                  {selected.linkedin_url && (
                    <a href={selected.linkedin_url} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1 text-primary hover:underline">
                      <Linkedin className="h-3 w-3" /> LinkedIn
                    </a>
                  )}
                  <span>· {selected.experience}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-4 flex-1 overflow-hidden min-h-0">
                {/* PDF Preview */}
                <div className="border rounded-md overflow-hidden bg-muted/30 flex flex-col min-h-[400px]">
                  <div className="px-3 py-2 border-b bg-background text-xs font-medium flex items-center justify-between">
                    <span>Resume Preview</span>
                    <Button variant="ghost" size="sm" onClick={() => downloadResume(selected)}>
                      <Download className="h-3 w-3 mr-1" /> Download
                    </Button>
                  </div>
                  {previewLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : previewUrl ? (
                    <iframe
                      src={previewUrl}
                      className="flex-1 w-full"
                      title="Resume PDF"
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                      Preview unavailable
                    </div>
                  )}
                </div>

                {/* Decision panel */}
                <div className="overflow-y-auto space-y-4 pr-1">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Cover Letter</label>
                    <p className="text-sm mt-1 whitespace-pre-wrap p-3 bg-muted/40 rounded-md max-h-40 overflow-y-auto">
                      {selected.cover_letter}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
                      <Select value={draftStatus} onValueChange={setDraftStatus}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map(s => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Prospect</label>
                      <Select value={draftProspect} onValueChange={setDraftProspect}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {PROSPECT_OPTIONS.map(p => (
                            <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">HR Decision Notes</label>
                    <Textarea
                      value={draftNotes}
                      onChange={e => setDraftNotes(e.target.value)}
                      rows={6}
                      placeholder="Strengths, concerns, interview feedback, next steps…"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
                <Button onClick={saveDecision} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Decision
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
