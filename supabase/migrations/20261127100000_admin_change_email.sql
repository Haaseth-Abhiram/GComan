-- Settings → Users & Roles → "Change email": a Super Admin changes the email a
-- person signs in with.
--
--   * Super Admin only (changing a login email is a way to take an account over).
--   * Not your own email.
--   * The password stays the same. The person is signed out, and password-reset
--     links already sent to the old address stop working.
--   * Written to the Settings audit log.
-- Run after 20261127090000_four_roles.sql.
-- Rollback: DROP FUNCTION public.rbac_admin_change_email(uuid, text);

CREATE OR REPLACE FUNCTION public.rbac_admin_change_email(_user uuid, _email text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _new text := lower(trim(coalesce(_email, '')));
  _old text;
BEGIN
  IF NOT coalesce(public.has_role(auth.uid(), 'admin'), false) THEN
    RAISE EXCEPTION 'Only a Super Admin can change a sign-in email.' USING ERRCODE = '42501';
  END IF;
  IF _user = auth.uid() THEN
    RAISE EXCEPTION 'You cannot change your own email here. Ask another Super Admin.' USING ERRCODE = '42501';
  END IF;
  IF _new !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR length(_new) > 254 THEN
    RAISE EXCEPTION 'Enter a valid email address.' USING ERRCODE = '22023';
  END IF;
  SELECT lower(email) INTO _old FROM auth.users WHERE id = _user;
  IF NOT FOUND THEN RAISE EXCEPTION 'User not found.' USING ERRCODE = 'P0002'; END IF;
  IF _new = _old THEN
    RAISE EXCEPTION 'That is already their email.' USING ERRCODE = '22023';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('portal-email:' || _new));
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = _new AND id <> _user)
     OR EXISTS (SELECT 1 FROM public.employees WHERE email = _new AND user_id IS DISTINCT FROM _user) THEN
    RAISE EXCEPTION 'This email already belongs to another person.' USING ERRCODE = '23505';
  END IF;

  UPDATE auth.users
     SET email = _new, recovery_token = '', confirmation_token = '', email_change = '', email_change_token_new = '',
         updated_at = now()
   WHERE id = _user;
  UPDATE auth.identities
     SET identity_data = identity_data || jsonb_build_object('email', _new), updated_at = now()
   WHERE user_id = _user AND provider = 'email';
  -- Newer auth servers also keep pending reset / confirm tokens here.
  IF to_regclass('auth.one_time_tokens') IS NOT NULL THEN
    EXECUTE 'DELETE FROM auth.one_time_tokens WHERE user_id = $1' USING _user;
  END IF;
  DELETE FROM auth.sessions WHERE user_id = _user;
  UPDATE public.employees SET email = _new, updated_at = now() WHERE user_id = _user;

  INSERT INTO public.rbac_audit_log (actor, actor_name, entity, action, user_id, user_name, old_value, new_value)
  VALUES (auth.uid(),
          (SELECT coalesce(e.full_name, u.raw_user_meta_data->>'name', u.email) FROM auth.users u
             LEFT JOIN public.employees e ON e.user_id = u.id WHERE u.id = auth.uid()),
          'user_email', 'changed', _user,
          (SELECT coalesce(e.full_name, u.email) FROM auth.users u LEFT JOIN public.employees e ON e.user_id = u.id WHERE u.id = _user),
          jsonb_build_object('email', _old), jsonb_build_object('email', _new));
  RETURN _new;
END;
$$;

REVOKE ALL ON FUNCTION public.rbac_admin_change_email(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rbac_admin_change_email(uuid, text) TO authenticated;
