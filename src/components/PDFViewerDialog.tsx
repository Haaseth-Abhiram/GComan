import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, ExternalLink, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

interface PDFViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
  title: string;
  onDownloadClick: () => void;
}

export const PDFViewerDialog = ({
  open,
  onOpenChange,
  pdfUrl,
  title,
  onDownloadClick
}: PDFViewerDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-[92vh] p-0 gap-0 border-t-4 border-t-primary overflow-hidden">
        {/* Minimal Header with Brand Accent */}
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/5 to-transparent border-b flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-1 h-5 bg-primary rounded-full flex-shrink-0" />
            <span className="text-sm font-medium truncate">{title}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenInNewTab}
              className="h-7 px-2 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onDownloadClick();
              }}
              className="h-7 px-3 text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 relative bg-muted/30 min-h-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading document...</p>
              </div>
            </div>
          )}
          
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Unable to preview this document.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleOpenInNewTab} variant="outline" size="sm" className="gap-1.5 h-8">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open in New Tab
                  </Button>
                  <Button onClick={() => {
                    onOpenChange(false);
                    onDownloadClick();
                  }} size="sm" className="gap-1.5 h-8">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full border-0"
              title={title}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </div>

        {/* Mobile Footer - Minimal */}
        <div className="px-3 py-1.5 border-t bg-muted/30 flex-shrink-0 sm:hidden">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenInNewTab}
              className="flex-1 h-7 text-xs gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              New Tab
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onDownloadClick();
              }}
              className="flex-1 h-7 text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
