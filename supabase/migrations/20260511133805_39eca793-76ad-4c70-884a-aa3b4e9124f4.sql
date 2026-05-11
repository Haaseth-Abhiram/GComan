-- Grant EXECUTE on has_role to authenticated so RLS policies that call it succeed
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

-- The restrictive ALL policy on user_roles inadvertently blocks non-admin users
-- from SELECTing their own role row (restrictive policies apply to every command,
-- including SELECT). Replace it with a write-only restrictive policy so the
-- existing permissive "Users can view their own roles" policy works as intended.
DROP POLICY IF EXISTS "Only admins can modify roles (restrictive)" ON public.user_roles;

CREATE POLICY "Only admins can insert roles (restrictive)"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can update roles (restrictive)"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Only admins can delete roles (restrictive)"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));