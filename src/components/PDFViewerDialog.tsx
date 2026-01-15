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
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-[90vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-muted/50 flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base sm:text-lg truncate pr-4">
                {title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm mt-1">
                Preview the document below. Click Download to save a copy.
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="gap-2 hidden sm:flex"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onDownloadClick();
                }}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* PDF Viewer */}
        <div className="flex-1 relative bg-muted min-h-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading document...</p>
              </div>
            </div>
          )}
          
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center p-6">
                <p className="text-muted-foreground mb-4">
                  Unable to preview this document in your browser.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleOpenInNewTab} variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </Button>
                  <Button onClick={() => {
                    onOpenChange(false);
                    onDownloadClick();
                  }} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
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

        {/* Mobile Footer Actions */}
        <div className="p-3 border-t bg-muted/50 flex-shrink-0 sm:hidden">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInNewTab}
              className="flex-1 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onDownloadClick();
              }}
              className="flex-1 gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
