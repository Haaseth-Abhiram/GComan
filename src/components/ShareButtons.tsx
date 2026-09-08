import { useState } from 'react';
import { Linkedin, Mail, Link2, Check } from 'lucide-react';
import { trackSelectContent } from '@/components/GoogleAnalytics';

/**
 * Article sharing. Deliberately limited to the three channels a B2B chemicals
 * audience actually uses: LinkedIn, email to a colleague, and copy-link.
 */
export const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const [copied, setCopied] = useState(false);

  const share = (channel: string, href: string) => {
    trackSelectContent('article_share', channel);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      trackSelectContent('article_share', 'copy_link');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; fail quietly rather than
      // throwing an error at someone who just wanted a link.
    }
  };

  const base =
    'inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ltr:mr-1 rtl:ml-1">
        Share
      </span>
      <button
        type="button"
        className={base}
        onClick={() =>
          share('linkedin', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
        }
      >
        <Linkedin className="w-3.5 h-3.5" />
        LinkedIn
      </button>
      <a
        className={base}
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${url}`)}`}
        onClick={() => trackSelectContent('article_share', 'email')}
      >
        <Mail className="w-3.5 h-3.5" />
        Email
      </a>
      <button type="button" className={base} onClick={copy} aria-live="polite">
        {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? 'Link copied' : 'Copy link'}
      </button>
    </div>
  );
};
