import type { ReactNode } from 'react';

/** Gradient header at the top of the larger dialogs; stays pinned while the form scrolls. */
export function DialogBanner({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: ReactNode }) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-6 pb-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm"><Icon className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

/** A titled card that groups related form fields. */
export function FormSection({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"><Icon className="h-4 w-4 text-primary" />{title}</h3>
      {children}
    </section>
  );
}
