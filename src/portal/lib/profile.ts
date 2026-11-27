/** Personal details, emergency contacts and documents (migration 20261127140000_profile_documents.sql). */
import { supabase } from '@/integrations/supabase/client';
import { rpc } from '@/portal/lib/rpc';

export const GENDERS = [['male', 'Male'], ['female', 'Female'], ['other', 'Other'], ['prefer_not_to_say', 'Prefer not to say']] as const;
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const MARITAL = [['single', 'Single'], ['married', 'Married'], ['divorced', 'Divorced'], ['widowed', 'Widowed'], ['prefer_not_to_say', 'Prefer not to say']] as const;

export const PERSONAL_FIELDS = ['phone', 'alternate_phone', 'personal_email', 'date_of_birth', 'gender', 'blood_group',
  'marital_status', 'nationality', 'current_address', 'permanent_address'] as const;
export type Personal = Partial<Record<(typeof PERSONAL_FIELDS)[number], string | null>>;
export interface Contact { name: string; relationship: string; phone: string; alternate_phone: string | null }

export type DocCategory = 'certificate' | 'education' | 'experience' | 'id_proof' | 'address_proof' | 'photo' | 'other';
export const DOC_CATEGORIES: [DocCategory, string][] = [
  ['certificate', 'Certificate'], ['education', 'Education'], ['experience', 'Experience letter'], ['id_proof', 'ID proof'],
  ['address_proof', 'Address proof'], ['photo', 'Photo'], ['other', 'Other'],
];
export interface EmployeeDocument {
  id: string; category: DocCategory; title: string; storage_path: string; file_name: string; file_size: number;
  by_company: boolean; uploaded_at: string; can_delete: boolean;
}
export interface Profile {
  employee_id: string;
  can_see_personal: boolean;
  work: {
    full_name: string; employee_code: string; email: string; department: string | null; designation: string | null;
    joined_on: string | null; employment_type: string | null; work_location: string | null; manager: string | null;
  };
  personal: Personal | null;
  contacts: Contact[];
  can_see_documents: boolean;
  documents: EmployeeDocument[];
}

export const PROFILE_KEY = ['profile'];
export const fetchProfile = (employeeId: string | null) => rpc<Profile>('profile_get', { _emp: employeeId });
export const savePersonal = (p: Personal) => rpc<Profile>('profile_save', { _p: p });
export const saveContacts = (list: Contact[]) => rpc<Profile>('profile_save_contacts', { _list: list });

// ---- documents -------------------------------------------------------------------
const BUCKET = 'employee-documents';
const TYPES: Record<string, string> = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };
export const DOC_ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp';
const extension = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

export const fileSize = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/** Why a chosen file can't be uploaded, or "". */
export const fileProblem = (file: File | null) => {
  if (!file) return 'Choose a file.';
  if (!TYPES[extension(file.name)]) return 'Use a PDF, PNG, JPG or WEBP file.';
  if (file.size === 0) return 'The file is empty.';
  if (file.size > 10 * 1024 * 1024) return 'The file must be 10 MB or smaller.';
  return '';
};

/** Uploads into the employee's private folder, then records it. */
export async function uploadDocument(employeeId: string, file: File, category: DocCategory, title: string) {
  const problem = fileProblem(file);
  if (problem) throw new Error(problem);
  const path = `${employeeId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]+/g, '_').slice(-120)}`;
  const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: TYPES[extension(file.name)], upsert: false });
  if (up.error) throw new Error('Could not upload the file. Please try again.');
  try {
    await rpc('doc_add', { _emp: employeeId, _category: category, _title: title, _path: path, _name: file.name.slice(0, 255), _size: file.size });
  } catch (e) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw e;
  }
}

export async function removeDocument(id: string) {
  const path = await rpc<string>('doc_delete', { _id: id });
  await supabase.storage.from(BUCKET).remove([path]);
}

/** A link that works for 5 minutes and downloads the file under its name. */
export async function documentLink(doc: EmployeeDocument) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(doc.storage_path, 300, { download: doc.file_name });
  if (error || !data?.signedUrl) throw new Error('Could not open the file.');
  return data.signedUrl;
}
