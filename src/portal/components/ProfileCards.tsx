/** My profile: personal details, emergency contacts and documents. The admin reuses the documents card. */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, FileText, Loader2, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fmtDate } from '@/portal/lib/attendance';
import { Checkbox } from '@/components/ui/checkbox';
import { EMPLOYMENT_TYPES } from '@/portal/lib/employees';
import { Hero, RoleChip } from '@/portal/theme/ui';
import {
  BLOOD_GROUPS, DOC_ACCEPT, DOC_CATEGORIES, GENDERS, MARITAL, PROFILE_KEY, documentLink, fetchProfile, fileProblem, fileSize,
  removeDocument, saveContacts, savePersonal, uploadDocument, PERSONAL_FIELDS, type Contact, type DocCategory, type EmployeeDocument, type Personal,
  type Profile,
} from '@/portal/lib/profile';

const useProfile = (employeeId: string | null) =>
  useQuery({ queryKey: [...PROFILE_KEY, employeeId ?? 'me'], queryFn: () => fetchProfile(employeeId) });

const label = (list: readonly (readonly [string, string])[], v: string | null | undefined) => list.find((x) => x[0] === v)?.[1] ?? v;

const Fact = ({ name, value }: { name: string; value: string | null | undefined }) => (
  <div><dt className="text-xs text-muted-foreground">{name}</dt><dd className="whitespace-pre-wrap break-words text-sm font-medium">{value || '—'}</dd></div>
);

export const PersonalFacts = ({ profile }: { profile: Profile }) => {
  const p = profile.personal ?? {};
  return (
    <dl className="grid grid-cols-2 gap-4">
      <Fact name="Mobile number" value={p.phone} /><Fact name="Alternate number" value={p.alternate_phone} />
      <Fact name="Personal email" value={p.personal_email} /><Fact name="Date of birth" value={p.date_of_birth ? fmtDate(p.date_of_birth) : null} />
      <Fact name="Gender" value={label(GENDERS, p.gender)} /><Fact name="Blood group" value={p.blood_group} />
      <Fact name="Marital status" value={label(MARITAL, p.marital_status)} /><Fact name="Nationality" value={p.nationality} />
      <Fact name="Current address" value={p.current_address} /><Fact name="Permanent address" value={p.permanent_address} />
    </dl>
  );
};

export const ContactFacts = ({ contacts }: { contacts: Contact[] }) => (
  <ul className="space-y-2">
    {contacts.map((c, i) => (
      <li key={i} className="rounded-xl border p-3 text-sm">
        <span className="font-semibold">{c.name}</span> <span className="text-muted-foreground">({c.relationship})</span>
        {i === 0 && <Badge variant="outline" className="ml-2 border-[#223f96]/40 text-[#223f96]">Primary</Badge>}
        <span className="block">{c.phone}{c.alternate_phone ? ` · ${c.alternate_phone}` : ''}</span>
      </li>
    ))}
    {!contacts.length && <li className="text-sm text-muted-foreground">None added yet.</li>}
  </ul>
);

export const DocumentsCard = ({ employeeId, canAdd, title = 'My documents' }: { employeeId: string; canAdd: boolean; title?: string }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, error } = useProfile(employeeId);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocCategory | ''>('');
  const [name, setName] = useState('');
  const [round, setRound] = useState(0);   // new file input after an upload
  const [removing, setRemoving] = useState<EmployeeDocument | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: PROFILE_KEY });
  const fail = (e: Error) => toast({ title: 'That did not work', description: e.message, variant: 'destructive' });

  const upload = useMutation({
    mutationFn: () => uploadDocument(employeeId, file!, category as DocCategory, name),
    onSuccess: () => { toast({ title: 'Document uploaded' }); setFile(null); setCategory(''); setName(''); setRound((r) => r + 1); void refresh(); },
    onError: fail,
  });
  const remove = useMutation({ mutationFn: (d: EmployeeDocument) => removeDocument(d.id), onSuccess: () => { setRemoving(null); void refresh(); }, onError: fail });
  const open = async (d: EmployeeDocument) => {
    try { window.location.assign(await documentLink(d)); } catch (e) { fail(e as Error); }
  };
  const problem = file ? fileProblem(file) : '';

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle><CardDescription>PDF or image, up to 10 MB. Visible to the employee and the admin only.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : error || !data ? <p className="text-sm text-destructive">{(error as Error)?.message}</p> : (
          <ul className="divide-y">
            {data.documents.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <FileText className="h-5 w-5 shrink-0 text-[#223f96]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{d.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{label(DOC_CATEGORIES, d.category)} · {fileSize(d.file_size)} · {fmtDate(d.uploaded_at.slice(0, 10))}</span>
                </span>
                {d.by_company && <Badge variant="outline" className="border-sky-300 text-sky-700">From the company</Badge>}
                <Button size="sm" variant="outline" aria-label={`Download ${d.title}`} onClick={() => void open(d)}><Download className="mr-1 h-4 w-4" />Download</Button>
                {d.can_delete && <Button size="icon" variant="ghost" className="text-destructive" aria-label={`Delete ${d.title}`} onClick={() => setRemoving(d)}><Trash2 className="h-4 w-4" /></Button>}
              </li>
            ))}
            {!data.documents.length && <li className="py-2 text-sm text-muted-foreground">No documents yet.</li>}
          </ul>
        )}
        {canAdd && (
          <form className="space-y-3 rounded-xl border p-3" onSubmit={(e) => { e.preventDefault(); upload.mutate(); }}>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Kind of document">
              {DOC_CATEGORIES.map(([k, text]) => <Button key={k} type="button" size="sm" variant={category === k ? 'default' : 'outline'} aria-pressed={category === k} onClick={() => setCategory(k)}>{text}</Button>)}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input key={round} type="file" aria-label="File" accept={DOC_ACCEPT} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              <Input aria-label="Title" placeholder="Title (optional)" maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {problem && <p className="text-xs text-destructive">{problem}</p>}
            <Button type="submit" disabled={upload.isPending || !file || !!problem || !category}>
              {upload.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}Upload document
            </Button>
          </form>
        )}
      </CardContent>
      <Dialog open={!!removing} onOpenChange={(o) => !o && setRemoving(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete this document?</DialogTitle><DialogDescription>{removing?.title}</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setRemoving(null)}>Cancel</Button><Button variant="destructive" disabled={remove.isPending} onClick={() => removing && remove.mutate(removing)}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

/** Buttons to pick one value (click again to clear). */
const Choice = ({ name, value, options, onChange }: {
  name: string; value: string; options: readonly (readonly [string, string])[]; onChange: (v: string) => void;
}) => (
  <div className="space-y-1.5 sm:col-span-2">
    <p className="text-sm font-medium">{name}</p>
    <div className="flex flex-wrap gap-2" role="group" aria-label={name}>
      {options.map(([k, t]) => (
        <Button key={k} type="button" size="sm" variant={value === k ? 'default' : 'outline'} aria-pressed={value === k} onClick={() => onChange(value === k ? '' : k)}>{t}</Button>
      ))}
    </div>
  </div>
);

/** How much of the profile is filled in (one point per field, one for a contact). */
const completeness = (p: Profile) => {
  const keys = ['date_of_birth', 'gender', 'blood_group', 'marital_status', 'nationality', 'phone', 'current_address', 'permanent_address'] as const;
  const filled = keys.filter((k) => p.personal?.[k]).length + (p.contacts.length ? 1 : 0);
  return Math.round((filled / (keys.length + 1)) * 100);
};

const EditButton = ({ label: name, onClick }: { label: string; onClick: () => void }) => (
  <Button size="sm" variant="outline" aria-label={name} onClick={onClick}><Pencil className="mr-1 h-4 w-4" />Edit</Button>
);
const HEAD = 'flex flex-row items-center justify-between gap-3 space-y-0';

/** The employee's own profile. */
export const MyProfileCards = ({ employeeId, roles, canEdit, canUpload }: {
  employeeId: string; roles: { key: string; name: string }[]; canEdit: boolean; canUpload: boolean;
}) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, error } = useProfile(employeeId);
  const [personal, setPersonal] = useState<Record<string, string> | null>(null);
  const [sameAddress, setSameAddress] = useState(false);
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const saved = (what: string) => { toast({ title: what }); setPersonal(null); setContacts(null); void qc.invalidateQueries({ queryKey: PROFILE_KEY }); };
  const fail = (e: Error) => toast({ title: 'Could not save', description: e.message, variant: 'destructive' });
  const save = useMutation({
    mutationFn: () => savePersonal((sameAddress ? { ...personal, permanent_address: personal!.current_address ?? '' } : personal) as Personal),
    onSuccess: () => saved('Your details were saved.'), onError: fail,
  });
  const saveList = useMutation({ mutationFn: () => saveContacts(contacts!), onSuccess: () => saved('Emergency contacts saved.'), onError: fail });

  if (isLoading) return <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (error || !data) return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Could not load your profile: {(error as Error)?.message}</p>;

  const w = data.work;
  const p = data.personal ?? {};
  const percent = completeness(data);
  const edit = () => {
    const form = Object.fromEntries(PERSONAL_FIELDS.map((k) => [k, p[k] ?? '']));
    setSameAddress(!!form.current_address && form.current_address === form.permanent_address);
    setPersonal(form);
  };
  const field = (key: string, name: string, type = 'text') => (
    <div className="space-y-1.5"><Label htmlFor={`p-${key}`}>{name}</Label>
      <Input id={`p-${key}`} type={type} value={personal?.[key] ?? ''} onChange={(e) => setPersonal({ ...personal!, [key]: e.target.value })} /></div>
  );
  const area = (key: string, name: string, disabled = false) => (
    <div className="space-y-1.5 sm:col-span-2"><Label htmlFor={`p-${key}`}>{name}</Label>
      <Textarea id={`p-${key}`} rows={2} maxLength={500} disabled={disabled} value={(disabled ? personal?.current_address : personal?.[key]) ?? ''}
        onChange={(e) => setPersonal({ ...personal!, [key]: e.target.value })} /></div>
  );
  const blank: Contact = { name: '', relationship: '', phone: '', alternate_phone: '' };
  const setContact = (i: number, k: keyof Contact, v: string) => setContacts(contacts!.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  return (
    <div className="space-y-6">
      <Hero eyebrow={w.employee_code} title={w.full_name} subtitle={[w.designation, w.department].filter(Boolean).join(' · ') || 'Designation not set'}>
        <div className="w-full rounded-xl bg-white/10 px-4 py-3 ring-1 ring-inset ring-white/15 sm:w-64">
          <div className="mb-2 flex flex-wrap gap-1.5">{roles.map((r) => <RoleChip key={r.key} role={r} />)}</div>
          <div className="flex justify-between text-xs font-semibold text-white/85"><span>Profile complete</span><span>{percent}%</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Profile complete" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-gradient-to-r from-[#f1592a] to-[#ffc3a8]" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </Hero>

      <Card>
        <CardHeader className={HEAD}><div><CardTitle className="text-base">Work details</CardTitle><CardDescription>Set by the company</CardDescription></div><Badge variant="outline">Read only</Badge></CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Fact name="Employee ID" value={w.employee_code} /><Fact name="Department" value={w.department} />
            <Fact name="Designation" value={w.designation} /><Fact name="Reporting manager" value={w.manager} />
            <Fact name="Date of joining" value={w.joined_on ? fmtDate(w.joined_on) : null} />
            <Fact name="Employment type" value={w.employment_type ? EMPLOYMENT_TYPES[w.employment_type] : null} />
            <Fact name="Work location" value={w.work_location} /><Fact name="Sign-in email" value={w.email} />
          </dl>
        </CardContent>
      </Card>

      {personal ? (
        <Card>
          <CardHeader><CardTitle className="text-base">Edit personal &amp; contact details</CardTitle><CardDescription>Your name, department and designation are set by the company.</CardDescription></CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
              {field('date_of_birth', 'Date of birth', 'date')}{field('nationality', 'Nationality')}
              <Choice name="Gender" options={GENDERS} value={personal.gender ?? ''} onChange={(v) => setPersonal({ ...personal, gender: v })} />
              <Choice name="Blood group" options={BLOOD_GROUPS.map((b) => [b, b] as const)} value={personal.blood_group ?? ''} onChange={(v) => setPersonal({ ...personal, blood_group: v })} />
              <Choice name="Marital status" options={MARITAL} value={personal.marital_status ?? ''} onChange={(v) => setPersonal({ ...personal, marital_status: v })} />
              {field('phone', 'Mobile number', 'tel')}{field('alternate_phone', 'Alternate number', 'tel')}
              {field('personal_email', 'Personal email', 'email')}<div className="hidden sm:block" />
              {area('current_address', 'Current address')}
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <Checkbox checked={sameAddress} onCheckedChange={(c) => setSameAddress(c === true)} />Permanent address is the same as current address
              </label>
              {area('permanent_address', 'Permanent address', sameAddress)}
              <div className="flex justify-end gap-2 sm:col-span-2">
                <Button type="button" variant="outline" onClick={() => setPersonal(null)}>Cancel</Button>
                <Button type="submit" disabled={save.isPending}>{save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save details</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className={HEAD}><CardTitle className="text-base">Personal details</CardTitle>{canEdit && <EditButton label="Edit personal details" onClick={edit} />}</CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <Fact name="Full name" value={w.full_name} /><Fact name="Date of birth" value={p.date_of_birth ? fmtDate(p.date_of_birth) : null} />
                <Fact name="Gender" value={label(GENDERS, p.gender)} /><Fact name="Blood group" value={p.blood_group} />
                <Fact name="Marital status" value={label(MARITAL, p.marital_status)} /><Fact name="Nationality" value={p.nationality} />
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className={HEAD}><CardTitle className="text-base">Contact information</CardTitle>{canEdit && <EditButton label="Edit contact information" onClick={edit} />}</CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <Fact name="Mobile number" value={p.phone} /><Fact name="Alternate number" value={p.alternate_phone} />
                <div className="col-span-2"><Fact name="Personal email" value={p.personal_email} /></div>
                <div className="col-span-2"><Fact name="Current address" value={p.current_address} /></div>
                <div className="col-span-2"><Fact name="Permanent address" value={p.permanent_address} /></div>
              </dl>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className={HEAD}>
          <div><CardTitle className="text-base">Emergency contacts</CardTitle>{contacts && <CardDescription>1 to 3 people</CardDescription>}</div>
          {canEdit && !contacts && <EditButton label="Edit emergency contacts" onClick={() => setContacts(data.contacts.length ? data.contacts.map((c) => ({ ...c, alternate_phone: c.alternate_phone ?? '' })) : [blank])} />}
        </CardHeader>
        <CardContent>
          {contacts ? (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveList.mutate(); }}>
              {contacts.map((c, i) => (
                <fieldset key={i} className="rounded-xl border p-4">
                  <legend className="px-1 text-[11px] font-bold uppercase tracking-wide text-[#223f96]">Contact {i + 1}{i === 0 ? ' (primary)' : ''}</legend>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {([['name', 'Name'], ['relationship', 'Relationship'], ['phone', 'Phone'], ['alternate_phone', 'Alternate phone']] as const).map(([k, t]) => (
                      <div key={k} className="space-y-1.5"><Label htmlFor={`c-${i}-${k}`}>{t}</Label>
                        <Input id={`c-${i}-${k}`} required={k !== 'alternate_phone'} value={c[k] ?? ''} onChange={(e) => setContact(i, k, e.target.value)} /></div>
                    ))}
                  </div>
                  {contacts.length > 1 && <Button type="button" size="sm" variant="ghost" className="mt-2 text-destructive" onClick={() => setContacts(contacts.filter((_, j) => j !== i))}><Trash2 className="mr-1 h-4 w-4" />Remove contact {i + 1}</Button>}
                </fieldset>
              ))}
              {contacts.length < 3 && <Button type="button" size="sm" variant="outline" onClick={() => setContacts([...contacts, blank])}><Plus className="mr-1 h-4 w-4" />Add another contact</Button>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setContacts(null)}>Cancel</Button>
                <Button type="submit" disabled={saveList.isPending}>Save contacts</Button>
              </div>
            </form>
          ) : <ContactFacts contacts={data.contacts} />}
        </CardContent>
      </Card>

      <DocumentsCard employeeId={employeeId} canAdd={canUpload} />
    </div>
  );
};

/** Admin → Employees → "Profile & documents" pop-up. */
export const EmployeeProfileDialog = ({ employee, canDocuments, onClose }: {
  employee: { id: string; full_name: string; employee_code: string } | null; canDocuments: boolean; onClose: () => void;
}) => {
  const { data, error } = useQuery({
    queryKey: [...PROFILE_KEY, employee?.id ?? 'none'], queryFn: () => fetchProfile(employee!.id), enabled: !!employee,
  });
  return (
    <Dialog open={!!employee} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle>{employee?.full_name}</DialogTitle><DialogDescription>{employee?.employee_code} · profile and documents</DialogDescription></DialogHeader>
        {error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : !data ? <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" /> : (
          <div className="space-y-5">
            {data.can_see_personal && (<>
              <PersonalFacts profile={data} />
              <div><p className="mb-2 text-sm font-semibold">Emergency contacts</p><ContactFacts contacts={data.contacts} /></div>
            </>)}
            {data.can_see_documents && <DocumentsCard employeeId={data.employee_id} canAdd={canDocuments} title="Documents" />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
