/**
 * The permission tree used by the role editor and the person screen:
 *   Module → Page → (Tab ›) Action / Field / Widget
 * Each module and page can be expanded or collapsed; the caller supplies the
 * control for every permission and (optionally) the bulk controls.
 */
import { useEffect, type ReactNode } from 'react';
import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { KIND_LABEL, type ModuleGroup, type PageGroup, type RbacPermission } from '@/portal/lib/rbac';

export const matches = (p: RbacPermission, q: string) => {
  const s = q.trim().toLowerCase();
  return !s || [p.module, p.page, p.tab ?? '', p.action, p.description, p.key].some((v) => v.toLowerCase().includes(s));
};

export const PermissionTree = ({ modules, expanded, toggle, control, moduleBulk, pageBulk, moduleSummary }: {
  modules: ModuleGroup[];
  expanded: Set<string>;
  toggle: (module: string) => void;
  control: (p: RbacPermission) => ReactNode;
  moduleBulk?: (m: ModuleGroup) => ReactNode;
  pageBulk?: (m: ModuleGroup, pg: PageGroup) => ReactNode;
  moduleSummary?: (m: ModuleGroup) => ReactNode;
}) => (
  <div className="divide-y rounded-md border">
    {modules.map((m) => {
      const open = expanded.has(m.module);
      return (
        <div key={m.module}>
          <div className="flex items-center gap-3 bg-muted/40 px-3 py-2">
            {moduleBulk?.(m)}
            <button type="button" className="flex flex-1 items-center gap-2 text-left" onClick={() => toggle(m.module)} aria-expanded={open}>
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="font-semibold">{m.module}</span>
              <Badge variant="outline" className="text-[10px] uppercase">{m.area === 'admin' ? 'Admin panel' : 'Employee Portal'}</Badge>
            </button>
            <span className="text-xs text-muted-foreground">{moduleSummary?.(m)}</span>
          </div>
          {open && (
            <div className="divide-y">
              {m.pages.map((pg) => (
                <div key={pg.page} className="px-3 py-2">
                  <div className="mb-1 flex items-center gap-3">
                    {pageBulk?.(m, pg)}
                    <span className="text-sm font-medium">{pg.page}</span>
                  </div>
                  <ul className="ml-1 space-y-1">
                    {pg.items.map((p) => (
                      <li key={p.key} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded px-2 py-1 hover:bg-muted/40">
                        <span className="shrink-0">{control(p)}</span>
                        <span className="text-sm">
                          {p.tab && <span className="text-muted-foreground">{p.tab} › </span>}
                          {p.action}
                        </span>
                        {p.kind !== 'action' && <Badge variant="secondary" className="text-[10px]">{KIND_LABEL[p.kind]}</Badge>}
                        {p.sensitive && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700" title="Sensitive: changes ask for confirmation">
                            <AlertTriangle className="h-3 w-3" />Sensitive
                          </span>
                        )}
                        <span className="basis-full text-xs text-muted-foreground sm:pl-7">{p.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

/** Warns before closing or reloading the tab while there are unsaved changes. */
export const useUnsavedWarning = (dirty: boolean) => {
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);
};
