import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Rfq } from '@/proposal-tracker/lib/db';

export const RfqPicker = ({ rfqs, value, onChange, placeholder = 'Select RFQ', allowAll }: {
  rfqs: Rfq[]; value: string; onChange: (id: string) => void; placeholder?: string; allowAll?: boolean;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger aria-label={placeholder} className="w-full sm:w-72"><SelectValue placeholder={placeholder} /></SelectTrigger>
    <SelectContent>
      {allowAll && <SelectItem value="all">All RFQs</SelectItem>}
      {rfqs.map((r) => <SelectItem key={r.id} value={r.id}>{r.ref} — {r.customer.name}</SelectItem>)}
    </SelectContent>
  </Select>
);
