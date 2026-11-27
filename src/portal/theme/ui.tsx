/** Shared pieces of the signed-in area's design: full screens, banner, number cards, role chips. */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, type LucideIcon } from 'lucide-react';
import { usePortalTheme } from './usePortalTheme';

/** Soft background with two brand-colour glows, content centred. */
export const FullScreen = ({ children }: { children: ReactNode }) => {
  usePortalTheme();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f7fb] p-4 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f1592a]/15 blur-[90px]" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#223f96]/15 blur-[90px]" />
      </div>
      <div className="relative w-full">{children}</div>
    </div>
  );
};

export const LoadingScreen = ({ label = 'Loading…' }: { label?: string }) => (
  <FullScreen>
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground" role="status">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-[#e7e9ee]">
        <Loader2 className="h-6 w-6 animate-spin text-[#223f96]" aria-hidden="true" />
      </span>
      {label}
    </div>
  </FullScreen>
);

/** Navy banner at the top of a dashboard. */
export const Hero = ({ eyebrow, title, subtitle, children }: {
  eyebrow?: ReactNode; title: ReactNode; subtitle?: ReactNode; children?: ReactNode;
}) => (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101a3a] via-[#182a68] to-[#223f96] px-6 py-6 text-white shadow-[0_20px_40px_-20px_rgba(16,26,58,0.6)] sm:px-8 sm:py-7">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-[#f1592a]/40 blur-[70px]" />
      <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[#4f74e0]/40 blur-[70px]" />
    </div>
    <div className="relative flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/75">{subtitle}</p>}
      </div>
      {children}
    </div>
  </div>
);

const ACCENTS = {
  orange: 'from-[#f1762a] to-[#f1592a] shadow-[#f1592a]/40',
  navy: 'from-[#223f96] to-[#3f63c9] shadow-[#223f96]/40',
  green: 'from-[#10b981] to-[#059669] shadow-[#059669]/40',
  violet: 'from-[#8b5cf6] to-[#6d28d9] shadow-[#6d28d9]/40',
} as const;

export const KpiCard = ({ icon: Icon, label, value, hint, accent = 'navy', to }: {
  icon: LucideIcon; label: string; value: ReactNode; hint?: ReactNode; accent?: keyof typeof ACCENTS; to?: string;
}) => {
  const body = (
    <div className="flex h-full items-start gap-3.5 rounded-2xl border border-[#e7e9ee] bg-white p-4 shadow-[0_1px_2px_rgba(16,26,58,0.04),0_8px_24px_-12px_rgba(16,26,58,0.12)] transition-transform group-hover:-translate-y-0.5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${ACCENTS[accent]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="block truncate text-2xl font-bold tracking-tight text-[#101a3a]">{value}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
    </div>
  );
  return to ? <Link to={to} className="group block rounded-2xl">{body}</Link> : body;
};

const ROLE_STYLE: Record<string, string> = {
  super_admin: 'bg-[#223f96] text-white ring-transparent',
  admin: 'bg-[#fff1eb] text-[#c2410c] ring-[#f1592a]/30',
  manager: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  employee: 'bg-[#eef2fb] text-[#223f96] ring-[#223f96]/15',
};

/** One of the four roles as a coloured chip. */
export const RoleChip = ({ role }: { role: { key: string; name: string } }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${ROLE_STYLE[role.key] ?? ROLE_STYLE.employee}`}>
    {role.name}
  </span>
);
