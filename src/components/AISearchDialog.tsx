import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Loader2, Send, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import gcIcon from '@/assets/gc-icon.webp';

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

  const handleSearch = async (searchQuery?: string) => {
    const trimmed = (searchQuery || query).trim();
    if (!trimmed || isLoading) return;

    setQuery(trimmed);
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

  const suggestions = [
    'What water treatment chemicals do you supply?',
    'ما هي المواد الكيميائية المتوفرة لمعالجة المياه؟',
    'Do you have lubricants for oil & gas?',
    'How can I contact you?',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col gap-0 p-0 overflow-hidden border-2 border-primary/20 shadow-2xl rounded-xl">
        {/* Header with gradient */}
        <DialogHeader className="px-5 pt-5 pb-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50">
          <DialogTitle className="flex items-center gap-2.5 text-lg">
            <img src={gcIcon} alt="GC" className="h-7 w-7 rounded-md" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-bold">
              AI Search
            </span>
            <Sparkles className="h-4 w-4 text-primary/60" />
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Ask anything about our products, services, or company in any language.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-5 py-3 border-b border-border/30 bg-background">
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
                placeholder="e.g., What chemicals for water treatment?"
                className="pl-9 pr-8 border-primary/20 focus:border-primary"
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
            <Button
              type="submit"
              size="icon"
              disabled={!query.trim() || isLoading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>

        {/* Answer Area */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 min-h-[120px] bg-background">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 py-10">
              <div className="relative">
                <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="h-4 w-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-sm text-muted-foreground">Searching across our knowledge base...</p>
            </div>
          )}

          {answer && !isLoading && (
            <div className="mt-3 rounded-xl border border-primary/15 bg-gradient-to-br from-muted/60 to-muted/30 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/40">
                <img src={gcIcon} alt="GC" className="h-5 w-5 rounded" />
                <span className="text-xs font-semibold text-primary/80 uppercase tracking-wide">AI Response</span>
              </div>
              <div className="prose prose-sm max-w-none text-foreground leading-relaxed
                prose-headings:text-foreground prose-headings:font-bold
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-ul:my-2 prose-li:my-0.5
                prose-p:my-2 prose-p:text-sm">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </div>
          )}

          {!answer && !isLoading && (
            <div className="py-6 space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  <Sparkles className="h-3 w-3" />
                  Powered by AI
                </div>
                <p className="text-sm font-medium text-foreground mb-4">Try asking:</p>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="block w-full text-left px-4 py-2.5 rounded-lg border border-border/60 
                      hover:border-primary/30 hover:bg-primary/5 transition-all text-sm text-muted-foreground
                      hover:text-foreground group"
                  >
                    <span className="opacity-50 group-hover:opacity-100 mr-1.5">→</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2 border-t border-border/30 bg-muted/20">
          <p className="text-[10px] text-muted-foreground/60 text-center">
            Global Chemicals LLC · AI-powered search · Supports English, Arabic & more
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
