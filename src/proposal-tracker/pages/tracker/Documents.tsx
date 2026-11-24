import { useRef, useState } from 'react';
import { EngineerName } from '@/proposal-tracker/components/tracker/common';
import { Download, Eye, Loader2, Trash2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import { addDocument, deleteDocument, useDb, DOC_CATEGORIES, type Doc, type DocCategory } from '@/proposal-tracker/lib/db';
import { can, visibleRfqs } from '@/proposal-tracker/lib/permissions';
import { DataTable, FieldError, PageHeader, fmtDateTime, fmtSize, run, useActor, useEmployeeName, type Column } from '@/proposal-tracker/components/tracker/common';
import { RfqPicker } from '@/proposal-tracker/components/tracker/RfqPicker';

const Documents = () => {
  const actor = useActor();
  const { user } = useAuth();
  const db = useDb();
  const name = useEmployeeName();
  const rfqs = visibleRfqs(user!, db.rfqs);
  const ids = new Set(rfqs.map((r) => r.id));
  const uploadable = rfqs.filter((r) => can(actor, 'doc.upload', r));
  const [filter, setFilter] = useState('all');
  const [cat, setCat] = useState<'all' | DocCategory>('all');
  const [upRfq, setUpRfq] = useState('');
  const [upCat, setUpCat] = useState<DocCategory>('Specification');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState<Doc | null>(null);
  const [view, setView] = useState<Doc | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = db.documents.filter((d) => ids.has(d.rfqId) && (filter === 'all' || d.rfqId === filter) && (cat === 'all' || d.category === cat));
  const rfqOf = (id: string) => db.rfqs.find((r) => r.id === id);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!upRfq) return setErr('Select the RFQ this document belongs to.');
    if (!file) return setErr('Choose a file.');
    setErr(''); setBusy(true);
    const ok = await run(() => addDocument(actor, { rfqId: upRfq, category: upCat, file }), 'Document uploaded');
    setBusy(false);
    if (ok && fileRef.current) fileRef.current.value = '';
  };
  const download = (d: Doc) => { const a = document.createElement('a'); a.href = d.dataUrl; a.download = d.name; a.click(); };

  const columns: Column<Doc>[] = [
    { header: 'Document', cell: (d) => <div><p className="font-medium break-all">{d.name}</p><p className="text-xs text-muted-foreground">{fmtSize(d.size)}</p></div> },
    { header: 'Category', cell: (d) => <Badge variant="outline">{d.category}</Badge> },
    { header: 'RFQ', cell: (d) => rfqOf(d.rfqId)?.ref, className: 'whitespace-nowrap' },
    { header: 'Uploaded', cell: (d) => <div><p><EngineerName id={d.uploadedBy} /></p><p className="text-xs text-muted-foreground">{fmtDateTime(d.createdAt)}</p></div>, hideOnMobile: true },
    {
      header: 'Actions',
      cell: (d) => (
        <div className="flex gap-1">
          <Button size="icon" variant="outline" title="View" aria-label={`View ${d.name}`} onClick={() => setView(d)}><Eye className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" aria-label={`Download ${d.name}`} onClick={() => download(d)}><Download className="h-4 w-4" /></Button>
          {can(actor, 'doc.delete', rfqOf(d.rfqId)) && <Button size="icon" variant="ghost" aria-label={`Delete ${d.name}`} onClick={() => setDel(d)}><Trash2 className="h-4 w-4 text-red-600" /></Button>}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Document Management" description="Upload RFQs, specifications, BOQs, vendor offers and submitted proposals — each linked to its RFQ. Authorized users can view and download them." />
      {uploadable.length > 0 && (
        <Card className="mb-6"><CardContent className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-4 items-end">
            <div><Label>RFQ</Label><RfqPicker rfqs={uploadable} value={upRfq} onChange={setUpRfq} /></div>
            <div>
              <Label>Category</Label>
              <Select value={upCat} onValueChange={(c) => setUpCat(c as DocCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DOC_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label htmlFor="file">File (max 1 MB, prototype)</Label><Input id="file" type="file" ref={fileRef} /></div>
            <Button onClick={upload} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}Upload</Button>
          </div>
          <FieldError msg={err} />
        </CardContent></Card>
      )}
      <Card><CardContent className="p-4 md:p-6">
        <DataTable rows={rows} columns={columns} emptyTitle="No documents" emptyHint="Uploaded documents will appear here."
          searchText={(d) => `${d.name} ${d.category} ${rfqOf(d.rfqId)?.ref ?? ''}`}
          filters={
            <>
              <RfqPicker rfqs={rfqs} value={filter} onChange={setFilter} allowAll placeholder="Filter by RFQ" />
              <Select value={cat} onValueChange={(c) => setCat(c as 'all' | DocCategory)}>
                <SelectTrigger aria-label="Filter by category" className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All categories</SelectItem>{DOC_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </>
          } />
      </CardContent></Card>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {view && (
            <>
              <DialogHeader>
                <DialogTitle className="break-all">{view.name}</DialogTitle>
                <DialogDescription>{view.category} · {rfqOf(view.rfqId)?.ref} · {fmtSize(view.size)} · uploaded by {name(view.uploadedBy)}</DialogDescription>
              </DialogHeader>
              {view.mime.startsWith('image/') ? (
                <img src={view.dataUrl} alt={view.name} className="max-h-[60vh] mx-auto rounded border" />
              ) : view.mime === 'application/pdf' ? (
                <iframe src={view.dataUrl} title={view.name} className="w-full h-[60vh] rounded border" />
              ) : view.mime.startsWith('text/') ? (
                <pre className="text-xs whitespace-pre-wrap rounded border p-3 max-h-[60vh] overflow-auto">{decodeURIComponent(escape(atob(view.dataUrl.split(',')[1] ?? '')))}</pre>
              ) : (
                <p className="text-sm text-muted-foreground">No in-browser preview for this file type. Use Download to open it.</p>
              )}
              <div><Button variant="outline" onClick={() => { const a = document.createElement('a'); a.href = view.dataUrl; a.download = view.name; a.click(); }}><Download className="h-4 w-4 mr-1" />Download</Button></div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete document?</AlertDialogTitle><AlertDialogDescription>{del?.name} will be removed permanently.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => run(() => deleteDocument(actor, del!.id), 'Document deleted')}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Documents;
