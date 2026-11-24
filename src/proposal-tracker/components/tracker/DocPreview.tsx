import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Doc } from '@/proposal-tracker/lib/db';

/** Converts a data: URL to a blob: URL (browsers block data: URLs for PDFs in iframes). */
function toBlobUrl(dataUrl: string, mime: string): string | null {
  try {
    const [head, b64 = ''] = dataUrl.split(',');
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: mime || head.match(/data:([^;]+)/)?.[1] || 'application/octet-stream' }));
  } catch { return null; }
}

/** In-browser preview of an attached file: PDFs and images show inline, others offer a download. */
export function DocPreview({ doc, onClose }: { doc: Doc | null; onClose: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!doc) { setUrl(null); return; }
    const u = toBlobUrl(doc.dataUrl, doc.mime);
    setUrl(u);
    return () => { if (u) URL.revokeObjectURL(u); };
  }, [doc]);
  const isPdf = !!doc && (doc.mime === 'application/pdf' || /\.pdf$/i.test(doc.name));
  const isImage = !!doc && doc.mime.startsWith('image/');
  return (
    <Dialog open={!!doc} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="break-all pr-6">{doc?.name}</DialogTitle><DialogDescription>{doc?.category}</DialogDescription></DialogHeader>
        {doc && (
          <div className="space-y-3">
            {isPdf && url ? <iframe src={url} title={doc.name} className="w-full h-[70vh] rounded border" />
              : isImage ? <img src={doc.dataUrl} alt={doc.name} className="max-h-[70vh] mx-auto rounded border" />
              : <p className="text-sm text-muted-foreground">No in-browser preview for this file type. Use Download to open it.</p>}
            <Button variant="outline" asChild><a href={doc.dataUrl} download={doc.name}><Download className="h-4 w-4 mr-1" />Download</a></Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
