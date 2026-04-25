-- Defense-in-depth: explicit RESTRICTIVE policy ensuring only admins can write to user_roles
-- Restrictive policies are ANDed with permissive ones, so this guarantees non-admins cannot insert/update/delete roles
CREATE POLICY "Only admins can modify roles (restrictive)"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));