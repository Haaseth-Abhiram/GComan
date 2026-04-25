import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { AlertCircle, Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface ResumePdfPreviewProps {
  url: string;
}

export const ResumePdfPreview = ({ url }: ResumePdfPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !url) return;

    let cancelled = false;
    let task: pdfjsLib.PDFDocumentLoadingTask | null = null;

    const renderPdf = async () => {
      setIsRendering(true);
      setError(null);
      container.replaceChildren();

      try {
        task = pdfjsLib.getDocument({ url });
        const pdf = await task.promise;
        const width = Math.max(container.clientWidth - 24, 320);

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) break;

          const page = await pdf.getPage(pageNumber);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = Math.min(2, width / baseViewport.width);
          const viewport = page.getViewport({ scale });
          const outputScale = window.devicePixelRatio || 1;

          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(viewport.width * outputScale);
          canvas.height = Math.floor(viewport.height * outputScale);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          canvas.className = 'mx-auto rounded-sm border bg-background shadow-sm';

          const pageWrap = document.createElement('div');
          pageWrap.className = 'py-3';
          pageWrap.appendChild(canvas);
          container.appendChild(pageWrap);

          const context = canvas.getContext('2d');
          if (!context) throw new Error('PDF canvas is unavailable');

          await page.render({
            canvasContext: context,
            viewport,
            transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
          }).promise;
        }
      } catch (err) {
        if (!cancelled) {
          console.error('PDF render error:', err);
          setError('Resume preview could not be rendered in the browser. Please use Open or Download.');
        }
      } finally {
        if (!cancelled) setIsRendering(false);
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
      task?.destroy();
      container.replaceChildren();
    };
  }, [url]);

  return (
    <div className="relative flex-1 min-h-0 overflow-auto bg-muted/20">
      {isRendering && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      {error ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <p>{error}</p>
        </div>
      ) : (
        <div ref={containerRef} className="min-h-full p-3" />
      )}
    </div>
  );
};