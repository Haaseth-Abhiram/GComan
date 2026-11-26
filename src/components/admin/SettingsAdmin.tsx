/**
 * Admin → Settings: the centralized Roles & Permissions module.
 *   /admin/settings?tab=users|roles|audit   lists
 *   /admin/settings/roles/:roleKey          role editor (permissions + data access)
 *   /admin/settings/users/:userId           one person (roles, exceptions, effective access)
 * Every rule is enforced by the database (rbac_* functions and table policies).
 */
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { can } from '@/portal/lib/access';
import { useMyAccess } from '@/portal/lib/useMyAccess';
import { RBAC_KEY, fetchRbacOverview } from '@/portal/lib/rbac';
import RolesTab from '@/components/admin/settings/RolesTab';
import UsersTab from '@/components/admin/settings/UsersTab';
import AuditTab from '@/components/admin/settings/AuditTab';
import RoleEditor from '@/components/admin/settings/RoleEditor';
import UserDetail from '@/components/admin/settings/UserDetail';

const NoAccess = () => <p className="py-16 text-center text-sm text-muted-foreground">You don't have permission to open this page.</p>;

const SettingsHome = () => {
  const { data: me } = useMyAccess();
  const [params, setParams] = useSearchParams();
  const { data: ov, isLoading, error } = useQuery({ queryKey: [...RBAC_KEY, 'overview'], queryFn: fetchRbacOverview });
  const tabs = [
    can(me, 'settings.users.view') && 'users',
    can(me, 'settings.roles.view') && 'roles',
    can(me, 'settings.audit.view') && 'audit',
  ].filter(Boolean) as string[];
  const tab = tabs.includes(params.get('tab') ?? '') ? params.get('tab')! : tabs[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings · Roles &amp; Permissions</h1>
        <p className="text-sm text-muted-foreground">
          Who can open which pages, use which actions and see whose records — across the admin panel and the Employee Portal.
          Anything not granted is denied.
        </p>
      </div>
      {isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        : error || !ov ? <p className="text-sm text-destructive">{(error as Error)?.message}</p> : (
          <Tabs value={tab} onValueChange={(t) => setParams({ tab: t }, { replace: true })}>
            <TabsList>
              {tabs.includes('users') && <TabsTrigger value="users">People</TabsTrigger>}
              {tabs.includes('roles') && <TabsTrigger value="roles">Roles</TabsTrigger>}
              {tabs.includes('audit') && <TabsTrigger value="audit">Audit log</TabsTrigger>}
            </TabsList>
            {tabs.includes('users') && <TabsContent value="users"><UsersTab ov={ov} /></TabsContent>}
            {tabs.includes('roles') && <TabsContent value="roles"><RolesTab ov={ov} /></TabsContent>}
            {tabs.includes('audit') && <TabsContent value="audit"><AuditTab ov={ov} /></TabsContent>}
          </Tabs>
        )}
    </div>
  );
};

const SettingsAdmin = () => {
  const { data: me } = useMyAccess();
  return (
    <Routes>
      <Route index element={<SettingsHome />} />
      <Route path="roles/:roleKey" element={can(me, 'settings.roles.view') ? <RoleEditor /> : <NoAccess />} />
      <Route path="users/:userId" element={can(me, 'settings.users.view') ? <UserDetail /> : <NoAccess />} />
      <Route path="*" element={<SettingsHome />} />
    </Routes>
  );
};

export default SettingsAdmin;
