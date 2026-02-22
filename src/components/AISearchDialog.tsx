import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Loader2, Send, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AISearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AISearchDialog = ({ open, onOpenChange }: AISearchDialogProps) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setAnswer('');
    }
  }, [open]);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setAnswer('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query: trimmed },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setAnswer(data.answer || 'No results found.');
    } catch (err: any) {
      const msg = err?.message || 'Search failed. Please try again.';
      toast({ title: 'Search Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Search
          </DialogTitle>
          <DialogDescription className="text-sm">
            Ask anything about our products, services, or company in any language.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-5 pb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., What chemicals do you have for water treatment?"
                className="pl-9 pr-8"
                disabled={isLoading}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="icon" disabled={!query.trim() || isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>

        {/* Answer Area */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 min-h-[100px]">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          )}

          {answer && !isLoading && (
            <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {answer}
            </div>
          )}

          {!answer && !isLoading && (
            <div className="text-center py-8 space-y-3">
              <div className="text-muted-foreground text-sm">
                <p className="font-medium mb-2">Try asking:</p>
                <div className="space-y-1.5">
                  {[
                    'What water treatment chemicals do you supply?',
                    'ما هي المواد الكيميائية المتوفرة لمعالجة المياه؟',
                    'Do you have lubricants for oil & gas?',
                    'How can I contact you?',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setQuery(suggestion);
                        setTimeout(() => handleSearch(), 0);
                      }}
                      className="block w-full text-left px-3 py-1.5 rounded-md hover:bg-muted transition-colors text-xs"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
