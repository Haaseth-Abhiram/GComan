import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar, X } from 'lucide-react';

export interface DateRange {
  from: string; // yyyy-mm-dd
  to: string;   // yyyy-mm-dd
}

interface Props {
  storageKey: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const empty: DateRange = { from: '', to: '' };

export const useDateRange = (storageKey: string): [DateRange, (r: DateRange) => void] => {
  const initial: DateRange = (() => {
    try {
      const raw = localStorage.getItem(`admin.dateRange.${storageKey}`);
      if (!raw) return empty;
      const parsed = JSON.parse(raw);
      return { from: parsed.from || '', to: parsed.to || '' };
    } catch { return empty; }
  })();

  // Hook returns a stateful tuple; consumer wraps with React state
  return [initial, (r) => {
    try { localStorage.setItem(`admin.dateRange.${storageKey}`, JSON.stringify(r)); } catch { /* localStorage unavailable */ }
  }];
};

export const DateRangeFilter = ({ storageKey, value, onChange }: Props) => {
  useEffect(() => {
    try { localStorage.setItem(`admin.dateRange.${storageKey}`, JSON.stringify(value)); } catch { /* localStorage unavailable */ }
  }, [storageKey, value]);

  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${storageKey}-from`} className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" /> From
        </Label>
        <Input
          id={`${storageKey}-from`}
          type="date"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className="h-9 w-[150px]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${storageKey}-to`} className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" /> To
        </Label>
        <Input
          id={`${storageKey}-to`}
          type="date"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="h-9 w-[150px]"
        />
      </div>
      {(value.from || value.to) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(empty)}
          className="h-9 px-2"
          aria-label="Clear date range"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const inDateRange = (iso: string, range: DateRange): boolean => {
  if (!range.from && !range.to) return true;
  const t = new Date(iso).getTime();
  if (range.from) {
    const f = new Date(range.from + 'T00:00:00').getTime();
    if (t < f) return false;
  }
  if (range.to) {
    const to = new Date(range.to + 'T23:59:59').getTime();
    if (t > to) return false;
  }
  return true;
};

export const loadDateRange = (storageKey: string): DateRange => {
  try {
    const raw = localStorage.getItem(`admin.dateRange.${storageKey}`);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { from: parsed.from || '', to: parsed.to || '' };
  } catch { return empty; }
};
