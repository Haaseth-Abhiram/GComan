/** Attendance calendar: choose a month, month totals, and one box per day. */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fmtDate, fmtMinutes, isoWeekday, type AttendanceDay } from '@/portal/lib/attendance';

export type CalendarStatus = 'present' | 'half_day' | 'absent' | 'working' | 'holiday' | 'weekly_off' | 'leave';

const LOOK: Record<CalendarStatus, { label: string; chip: string; dot: string }> = {
  present: { label: 'Present', chip: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  half_day: { label: 'Half day', chip: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  absent: { label: 'Absent', chip: 'bg-rose-100 text-rose-800', dot: 'bg-rose-500' },
  working: { label: 'Working', chip: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' },
  leave: { label: 'On leave', chip: 'bg-violet-100 text-violet-800', dot: 'bg-violet-500' },
  holiday: { label: 'Holiday', chip: 'bg-teal-100 text-teal-800', dot: 'bg-teal-500' },
  weekly_off: { label: 'Weekly off', chip: 'bg-slate-100 text-slate-600', dot: 'bg-slate-300' },
};

export interface CalendarDay { date: string; day: number; status: CalendarStatus | null; note: string | null; row: AttendanceDay | null }

/** One entry per day of the month 'YYYY-MM'. Absent is only marked from `since` to yesterday. */
export function calendarDays(v: {
  month: string; today: string; since: string | null; weeklyOff: number[]; rows: AttendanceDay[];
  holidays: { date: string; name: string }[]; leave: { start_date: string; end_date: string; half_day: boolean; name: string }[];
}): CalendarDay[] {
  const [y, m] = v.month.split('-').map(Number);
  const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => {
    const date = `${v.month}-${String(i + 1).padStart(2, '0')}`;
    const row = v.rows.find((r) => r.work_date === date) ?? null;
    const holiday = v.holidays.find((h) => h.date === date);
    const leave = v.leave.find((l) => l.start_date <= date && date <= l.end_date);
    const off = v.weeklyOff.includes(isoWeekday(date));
    let status: CalendarStatus | null = row?.status ?? null;
    if (!row) {
      if (holiday) status = 'holiday';
      else if (off) status = 'weekly_off';
      else if (leave) status = 'leave';
      else if (v.since && date >= v.since && date < v.today) status = 'absent';
    }
    const note = holiday ? holiday.name : leave ? `${leave.name}${leave.half_day ? ' (half day)' : ''}` : null;
    return { date, day: i + 1, status, note, row };
  });
}

const shiftMonth = (month: string, n: number) => {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7);
};

export const MonthChooser = ({ month, today, onChange }: { month: string; today: string; onChange: (m: string) => void }) => {
  const now = today.slice(0, 7);
  const year = Number(month.slice(0, 4));
  const go = (m: string) => onChange(m > now ? now : m);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant={month === now ? 'default' : 'outline'} onClick={() => go(now)}>This month</Button>
        <Button size="sm" variant={month === shiftMonth(now, -1) ? 'default' : 'outline'} onClick={() => go(shiftMonth(now, -1))}>Last month</Button>
        <span className="ml-auto flex items-center gap-1" role="group" aria-label="Year">
          <Button size="icon" variant="outline" aria-label="Previous year" onClick={() => go(`${year - 1}-${month.slice(5)}`)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="w-14 text-center text-sm font-bold">{year}</span>
          <Button size="icon" variant="outline" aria-label="Next year" disabled={year >= Number(now.slice(0, 4))} onClick={() => go(`${year + 1}-${month.slice(5)}`)}><ChevronRight className="h-4 w-4" /></Button>
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12" role="group" aria-label="Month">
        {Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`).map((m) => (
          <Button key={m} size="sm" variant={m === month ? 'default' : 'outline'} aria-pressed={m === month} disabled={m > now} onClick={() => go(m)}>
            {fmtDate(`${m}-01`, { month: 'short' })}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const MonthTotals = ({ days }: { days: CalendarDay[] }) => {
  const n = (s: CalendarStatus) => days.filter((d) => d.status === s).length;
  const items: [string, string | number, string][] = [
    ['Present', n('present'), '#059669'], ['Half day', n('half_day'), '#d97706'], ['Absent', n('absent'), '#e11d48'],
    ['On leave', n('leave'), '#7c3aed'], ['Late', days.filter((d) => d.row?.is_late).length, '#ea580c'],
    ['Hours worked', fmtMinutes(days.reduce((s, d) => s + (d.row?.worked_minutes ?? 0), 0)), '#223f96'],
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map(([name, value, color]) => (
        <div key={name} className="relative overflow-hidden rounded-xl border border-[#e7e9ee] bg-white px-4 pb-3 pt-3.5">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px]" style={{ background: color }} />
          <p className="truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{name}</p>
          <p className="mt-1 text-xl font-black tabular-nums" style={{ color }}>{value}</p>
        </div>
      ))}
    </div>
  );
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarGrid = ({ days, today, selected, onSelect }: {
  days: CalendarDay[]; today: string; selected: string | null; onSelect: (date: string) => void;
}) => (
  <div>
    <div className="grid grid-cols-7 gap-1 rounded-lg bg-[#223f96] text-center text-[10.5px] font-bold uppercase tracking-widest text-white/90 sm:gap-2">
      {WEEKDAYS.map((w) => <div key={w} className="py-2">{w}</div>)}
    </div>
    <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
      {/* The week starts on Sunday: ISO weekday 7 needs no blank boxes. */}
      {Array.from({ length: days.length ? isoWeekday(days[0].date) % 7 : 0 }, (_, i) => <div key={`blank-${i}`} aria-hidden="true" />)}
      {days.map((d) => {
        const look = d.status ? LOOK[d.status] : null;
        const isToday = d.date === today;
        return (
          <button
            key={d.date}
            type="button"
            onClick={() => onSelect(d.date)}
            aria-pressed={selected === d.date}
            aria-label={[fmtDate(d.date), look?.label, d.note, d.row?.is_late ? 'Late' : null, d.row ? fmtMinutes(d.row.worked_minutes) : null].filter(Boolean).join(', ')}
            className={`flex min-h-[3.6rem] min-w-0 flex-col rounded-xl border p-1 text-left transition-colors sm:min-h-[5rem] sm:p-2 ${
              selected === d.date ? 'border-[#f1592a] ring-2 ring-[#f1592a]/30' : isToday ? 'border-[#223f96] bg-[#f4f7ff]' : d.status === 'weekly_off' ? 'border-[#eef0f5] bg-[#f8fafd]' : 'border-[#eef0f5] bg-white hover:border-[#223f96]/30'}`}
          >
            <span className="flex items-center justify-between">
              <span className={`flex h-5 min-w-[1.25rem] items-center justify-center rounded-full text-xs font-bold sm:h-6 sm:min-w-[1.5rem] sm:text-sm ${isToday ? 'bg-gradient-to-br from-[#f1762a] to-[#f1592a] px-1 text-white' : ''}`}>{d.day}</span>
              {d.row?.is_late && <span className="h-2 w-2 rounded-full bg-orange-500" aria-hidden="true" />}
            </span>
            {look && (
              <>
                <span className={`mt-auto hidden truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold sm:block ${look.chip}`}>{look.label}</span>
                <span className={`mt-auto h-1.5 w-full rounded-full sm:hidden ${look.dot}`} aria-hidden="true" />
              </>
            )}
            {d.note && !d.row && <span className="mt-0.5 hidden truncate text-[10px] text-muted-foreground sm:block">{d.note}</span>}
            {d.row && <span className="mt-0.5 hidden text-[10px] font-semibold tabular-nums text-muted-foreground sm:block">{fmtMinutes(d.row.worked_minutes)}</span>}
          </button>
        );
      })}
    </div>
    <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
      {[...Object.values(LOOK), { label: 'Late', dot: 'bg-orange-500' }].map((s) => (
        <span key={s.label} className="inline-flex items-center gap-1.5 rounded-full bg-[#f8fafd] px-2.5 py-1 ring-1 ring-inset ring-[#eef1f7]">
          <span className={`h-2 w-2 rounded-full ${s.dot}`} aria-hidden="true" />{s.label}
        </span>
      ))}
    </div>
  </div>
);
