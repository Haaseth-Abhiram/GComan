import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export interface TOCHeading {
  id: string;
  text: string;
}

/**
 * Sticky in-article table of contents with scroll-spy. Desktop shows a rail
 * beside the prose; below `lg` it collapses to a <details> summary so it costs
 * one line instead of a screenful.
 */
interface ArticleTOCProps {
  headings: TOCHeading[];
  /** 'inline' = the collapsed mobile summary; 'rail' = the sticky desktop aside. */
  variant: 'inline' | 'rail';
}

export const ArticleTOC = ({ headings, variant }: ArticleTOCProps) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Bias the band toward the top of the viewport so the highlighted entry
      // matches the section the reader is actually looking at.
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  const list = (
    <ul className="space-y-1.5 text-sm">
      {headings.map(({ id, text }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className={`block leading-snug transition-colors ltr:border-l-2 rtl:border-r-2 ltr:pl-3 rtl:pr-3 py-0.5 ${
              activeId === id
                ? 'border-primary text-primary font-semibold'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
            }`}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === 'inline') {
    return (
      <details className="lg:hidden mb-8 rounded-xl border border-border bg-muted/30 p-4">
        <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-foreground">
          <List className="w-4 h-4 text-primary" />
          In this article
        </summary>
        <nav className="mt-4" aria-label="Table of contents">{list}</nav>
      </details>
    );
  }

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto"
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        <List className="w-3.5 h-3.5 text-primary" />
        In this article
      </p>
      {list}
    </nav>
  );
};
