/**
 * Permission checks for screens. The database enforces every rule; these only
 * decide what to show. Use the same keys as Admin → Settings → Roles.
 *
 *   const can = useCan();  can('website.contacts.delete')
 *   <Can perm="portal.leave.approve">…</Can>
 */
import type { ReactNode } from 'react';
import { can as canFor, type Permission } from '@/portal/lib/access';
import { useMyAccess } from '@/portal/lib/useMyAccess';

export const useCan = () => {
  const { data } = useMyAccess();
  return (perm: Permission) => canFor(data, perm);
};

/** Renders children only if the signed-in user has the permission (any of them, if several). */
export const Can = ({ perm, children, fallback = null }: { perm: Permission | Permission[]; children: ReactNode; fallback?: ReactNode }) => {
  const can = useCan();
  const ok = (Array.isArray(perm) ? perm : [perm]).some((p) => can(p));
  return <>{ok ? children : fallback}</>;
};
