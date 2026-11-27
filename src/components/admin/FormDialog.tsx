/**
 * The look of the large add / edit dialogs: navy banner on top, titled cards,
 * and buttons that stay in place while only the fields scroll.
 */
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const FormDialogContent = ({ children }: { children: ReactNode }) => (
  <DialogContent className="flex max-h-[92vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl [&>button]:text-white">
    {children}
  </DialogContent>
);

export const FormHeader = ({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: ReactNode }) => (
  <DialogHeader className="relative shrink-0 flex-row items-center gap-4 space-y-0 overflow-hidden bg-gradient-to-br from-[#101a3a] via-[#182a68] to-[#223f96] py-5 pl-5 pr-12 text-left sm:pl-6">
    <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full bg-[#f1592a]/40 blur-[60px]" />
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f1762a] to-[#f1592a] text-white shadow-lg shadow-[#f1592a]/40">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </span>
    <div className="relative min-w-0 space-y-1">
      <DialogTitle className="text-xl font-bold leading-tight text-white">{title}</DialogTitle>
      <DialogDescription className="text-sm text-white/75">{description}</DialogDescription>
    </div>
  </DialogHeader>
);

// `relative` keeps hidden absolute elements (screen-reader text, the inputs behind
// checkboxes and switches) inside this scroll area. Without it they stretch the
// whole dialog, which can then scroll the banner out of view.
export const FormBody = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#f6f7fb] p-3 sm:p-5">{children}</div>
);

export const FormFooter = ({ children }: { children: ReactNode }) => (
  <DialogFooter className="shrink-0 gap-2 border-t bg-white px-5 py-3 sm:gap-0">{children}</DialogFooter>
);

/** A titled white card that groups related fields. */
export const FormSection = ({ icon: Icon, title, hint, aside, children }: {
  icon: LucideIcon; title: string; hint: string; aside?: ReactNode; children: ReactNode;
}) => (
  <section className="rounded-2xl border border-[#e7e9ee] bg-white p-4 shadow-[0_1px_2px_rgba(16,26,58,0.04),0_8px_24px_-16px_rgba(16,26,58,0.16)] sm:p-5">
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eef2fb] text-[#223f96]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[#101a3a]">{title}</h3>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      {aside}
    </div>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </section>
);

export const Required = () => <span aria-hidden="true" className="ml-0.5 text-[#f1592a]">*</span>;

/** A bar of choices where one is picked. `columns` sets the layout. */
export const ChoiceBar = ({ label, options, value, onPick, columns }: {
  label: string; options: Record<string, string>; value: string; onPick: (key: string) => void; columns: string;
}) => (
  <div className={`grid gap-1 rounded-xl bg-[#eef2fb] p-1 ${columns}`} role="group" aria-label={label}>
    {Object.entries(options).map(([key, text]) => (
      <button key={key} type="button" aria-pressed={value === key} onClick={() => onPick(key)}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${value === key ? 'bg-[#223f96] text-white shadow' : 'text-[#223f96] hover:bg-white'}`}>
        {text}
      </button>
    ))}
  </div>
);
