import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, FileText, AlertTriangle, Mail, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export interface ProductDetailTabsProps {
  productTitle: string;
  hazard?: {
    ghs?: string[];
    unNumber?: string;
    hazardClass?: string;
    signalWord?: 'Danger' | 'Warning';
    storage?: string;
  };
  documents?: {
    sdsUrl?: string;
    tdsUrl?: string;
    uoaUrl?: string;
  };
}

// `label` is the English default; the Arabic comes from products.ghs.<code>
// in ar.json (hazard / storage text itself is per product, translated by the caller).
const GHS_PICTOGRAM: Record<string, { src: string; label: string }> = {
  GHS01: { src: '/icons/ghs/ghs01-explosive.svg',  label: 'Explosive' },
  GHS02: { src: '/icons/ghs/ghs02-flammable.svg',  label: 'Flammable' },
  GHS03: { src: '/icons/ghs/ghs03-oxidising.svg',  label: 'Oxidising' },
  GHS04: { src: '/icons/ghs/ghs04-gas-pressure.svg', label: 'Gas under pressure' },
  GHS05: { src: '/icons/ghs/ghs05-corrosive.svg', label: 'Corrosive' },
  GHS06: { src: '/icons/ghs/ghs06-toxic.svg',     label: 'Acute toxicity' },
  GHS07: { src: '/icons/ghs/ghs07-irritant.svg',  label: 'Health irritant' },
  GHS08: { src: '/icons/ghs/ghs08-health-hazard.svg', label: 'Serious health hazard' },
  GHS09: { src: '/icons/ghs/ghs09-environment.svg', label: 'Environmental hazard' },
};

const DOCS = [
  { key: 'sds' as const, label: 'SDS', intent: 'sds-request' },
  { key: 'tds' as const, label: 'TDS', intent: 'tds-request' },
  { key: 'uoa' as const, label: 'UOA', intent: 'uoa-request' },
];

export const ProductDetailTabs = ({
  productTitle,
  hazard,
  documents,
}: ProductDetailTabsProps) => {
  const { t } = useTranslation();
  const hasHazard =
    !!hazard &&
    ((hazard.ghs && hazard.ghs.length > 0) ||
      hazard.unNumber ||
      hazard.hazardClass ||
      hazard.signalWord ||
      hazard.storage);
  // Documentation tab always renders if we're showing this widget at all —
  // the request-via-email buttons are universal.
  const hasDocs = true;

  if (!hasHazard && !hasDocs) return null;

  const firstTab = hasHazard ? 'safety' : 'docs';

  return (
    <div className="mb-8">
      <Tabs defaultValue={firstTab} className="w-full">
        <TabsList className="w-full justify-start rounded-lg">
          {hasHazard && (
            <TabsTrigger value="safety" className="gap-1.5">
              <ShieldAlert className="h-4 w-4" />
              <span>{t('products.tabSafety', 'Safety')}</span>
            </TabsTrigger>
          )}
          {hasDocs && (
            <TabsTrigger value="docs" className="gap-1.5">
              <FileText className="h-4 w-4" />
              <span>{t('products.tabDocuments', 'Documents')}</span>
            </TabsTrigger>
          )}
        </TabsList>

        {hasHazard && hazard && (
          <TabsContent value="safety" className="mt-4 data-[state=inactive]:hidden" forceMount>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-4">
                {hazard.ghs && hazard.ghs.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {hazard.ghs.map((code) => {
                      const p = GHS_PICTOGRAM[code];
                      if (!p) return null;
                      return (
                        <figure key={code} className="text-center">
                          <img
                            src={p.src}
                            alt={`${code} — ${t(`products.ghs.${code}`, p.label)}`}
                            width={56}
                            height={56}
                            className="h-14 w-14"
                            loading="lazy"
                          />
                          <figcaption className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                            {code}
                          </figcaption>
                        </figure>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {hazard.signalWord && (
                    <Chip
                      tone={hazard.signalWord === 'Danger' ? 'danger' : 'warning'}
                      icon={<AlertTriangle className="h-3.5 w-3.5" />}
                    >
                      {t('products.signalLabel', 'Signal:')}{' '}
                      {hazard.signalWord === 'Danger' ? t('products.signalDanger', 'Danger') : t('products.signalWarning', 'Warning')}
                    </Chip>
                  )}
                  {hazard.hazardClass && <Chip tone="muted">{hazard.hazardClass}</Chip>}
                  {hazard.unNumber && <Chip tone="muted">UN {hazard.unNumber}</Chip>}
                </div>
              </div>
              {hazard.storage && (
                <p className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                  <strong className="text-foreground">{t('products.storageLabel', 'Storage & handling:')}</strong> {hazard.storage}
                </p>
              )}
            </div>
          </TabsContent>
        )}

        {hasDocs && (
          <TabsContent value="docs" className="mt-4 data-[state=inactive]:hidden" forceMount>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {DOCS.map(({ key, label, intent }) => {
                  const url = documents?.[`${key}Url` as 'sdsUrl' | 'tdsUrl' | 'uoaUrl'];
                  if (url) {
                    return (
                      <Button key={key} asChild variant="outline" className="h-auto py-3">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <span className="flex items-center gap-2 text-sm font-semibold">
                            <Download className="h-4 w-4" />
                            {t('products.downloadDoc', { label, defaultValue: 'Download {{label}}' })}
                          </span>
                        </a>
                      </Button>
                    );
                  }
                  const href = `/contact?product=${encodeURIComponent(productTitle)}&intent=${intent}`;
                  return (
                    <Button
                      key={key}
                      asChild
                      variant="outline"
                      className="h-auto py-3 border-primary/30 hover:bg-primary/5"
                    >
                      <Link to={href} rel="nofollow">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <Mail className="h-4 w-4" />
                          {t('products.requestDoc', { label, defaultValue: 'Request {{label}}' })}
                        </span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

const Chip = ({
  tone,
  icon,
  children,
}: {
  tone: 'danger' | 'warning' | 'muted';
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const cls =
    tone === 'danger'
      ? 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400'
      : tone === 'warning'
      ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400'
      : 'border-border bg-muted/40 text-foreground';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {icon}
      {children}
    </span>
  );
};
