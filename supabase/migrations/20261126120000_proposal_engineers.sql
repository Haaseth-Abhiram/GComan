-- Proposal engineer accounts (Proposal Engineer Tracker).
--
-- The ADMIN creates each engineer from the website admin (Engineer Accounts):
-- code (P1, P2…), name, email and a password the admin chooses, and sends
-- those credentials to the engineer personally. No email is involved: the
-- login is created already confirmed. Sign-in on /login routes anyone with an
-- ACTIVE row here to /proposal-tracker.
--
-- Everything that touches auth.users goes through the admin_* functions
-- below (SECURITY DEFINER, admin-checked), because creating or changing
-- another user's login is otherwise only possible with the service-role key.

CREATE TABLE IF NOT EXISTS public.proposal_engineers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE CHECK (code ~ '^P[0-9]+$'),
  name        text NOT NULL CHECK (length(trim(name)) > 0),
  email       text NOT NULL UNIQUE CHECK (email = lower(trim(email)) AND email LIKE '%_@_%'),
  active      boolean NOT NULL DEFAULT true,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.proposal_engineers ENABLE ROW LEVEL SECURITY;

-- Admins read and edit every engineer (creating/deleting goes through the functions).
DROP POLICY IF EXISTS "Admins manage proposal engineers" ON public.proposal_engineers;
CREATE POLICY "Admins manage proposal engineers"
  ON public.proposal_engineers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- A signed-in engineer can read only their own row.
DROP POLICY IF EXISTS "Engineers read own record" ON public.proposal_engineers;
CREATE POLICY "Engineers read own record"
  ON public.proposal_engineers FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Link to the auth account on insert; the email is the login, so it is fixed
-- after creation (delete and re-add the engineer to change it).
CREATE OR REPLACE FUNCTION public.proposal_engineers_link_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  NEW.updated_at := now();
  IF TG_OP = 'INSERT' THEN
    SELECT u.id INTO NEW.user_id FROM auth.users u WHERE lower(u.email) = NEW.email LIMIT 1;
  ELSIF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'An engineer''s email cannot be changed. Delete the engineer and add them again.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS proposal_engineers_link_user ON public.proposal_engineers;
CREATE TRIGGER proposal_engineers_link_user
  BEFORE INSERT OR UPDATE ON public.proposal_engineers
  FOR EACH ROW EXECUTE FUNCTION public.proposal_engineers_link_user();

-- Superseded by admin-created accounts (an earlier draft let engineers sign themselves up).
DROP TRIGGER IF EXISTS proposal_engineers_on_auth_user ON auth.users;
DROP FUNCTION IF EXISTS public.proposal_engineers_on_auth_user();
DROP FUNCTION IF EXISTS public.can_activate_engineer(text);

-- ---------------------------------------------------------------------------
-- Admin functions
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public._assert_admin()
RETURNS void
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can manage engineer accounts.' USING ERRCODE = '42501';
  END IF;
END;
$$;

-- Same rule as the website sign-up form.
CREATE OR REPLACE FUNCTION public._assert_engineer_password(_password text)
RETURNS void
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF _password IS NULL OR length(_password) < 8 OR length(_password) > 72
     OR _password !~ '[A-Z]' OR _password !~ '[a-z]' OR _password !~ '[0-9]' THEN
    RAISE EXCEPTION 'Password must be 8-72 characters with an uppercase letter, a lowercase letter and a number.';
  END IF;
END;
$$;

-- Creates the engineer's login (already confirmed) and their engineer row.
CREATE OR REPLACE FUNCTION public.admin_create_engineer(_code text, _name text, _email text, _password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  _uid   uuid := gen_random_uuid();
  _em    text := lower(trim(_email));
  _id    uuid;
BEGIN
  PERFORM public._assert_admin();
  PERFORM public._assert_engineer_password(_password);
  IF _em !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Enter a valid email address.';
  END IF;
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = _em) THEN
    RAISE EXCEPTION 'A login with this email already exists. Use a different email.';
  END IF;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', _uid, 'authenticated', 'authenticated', _em,
    extensions.crypt(_password, extensions.gen_salt('bf', 10)), now(),
    '', '', '', '',
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object('name', trim(_name)), now(), now()
  );
  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
  VALUES (_uid::text, _uid,
          jsonb_build_object('sub', _uid::text, 'email', _em, 'email_verified', true, 'phone_verified', false),
          'email', now(), now());

  INSERT INTO public.proposal_engineers (code, name, email, created_by)
  VALUES (upper(trim(_code)), trim(_name), _em, auth.uid())
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

-- Sets a new password the admin will pass on to the engineer.
CREATE OR REPLACE FUNCTION public.admin_set_engineer_password(_engineer_id uuid, _password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE _uid uuid;
BEGIN
  PERFORM public._assert_admin();
  PERFORM public._assert_engineer_password(_password);
  SELECT user_id INTO _uid FROM public.proposal_engineers WHERE id = _engineer_id;
  IF _uid IS NULL THEN RAISE EXCEPTION 'Engineer not found.'; END IF;
  UPDATE auth.users
     SET encrypted_password = extensions.crypt(_password, extensions.gen_salt('bf', 10)), updated_at = now()
   WHERE id = _uid;
END;
$$;

-- Disable = blocked at the login itself (banned) as well as in the tracker.
CREATE OR REPLACE FUNCTION public.admin_set_engineer_active(_engineer_id uuid, _active boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE _uid uuid;
BEGIN
  PERFORM public._assert_admin();
  UPDATE public.proposal_engineers SET active = _active WHERE id = _engineer_id RETURNING user_id INTO _uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'Engineer not found.'; END IF;
  IF _uid IS NOT NULL THEN
    -- A real date, not 'infinity': the auth server cannot parse infinity and
    -- fails every sign-in for that user with "Database error querying schema".
    UPDATE auth.users SET banned_until = CASE WHEN _active THEN NULL ELSE '2999-12-31'::timestamptz END, updated_at = now()
     WHERE id = _uid;
    IF NOT _active THEN
      DELETE FROM auth.sessions WHERE user_id = _uid; -- sign them out everywhere
    END IF;
  END IF;
END;
$$;

-- Removes the engineer and their login. Never deletes an admin's login.
CREATE OR REPLACE FUNCTION public.admin_delete_engineer(_engineer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE _uid uuid;
BEGIN
  PERFORM public._assert_admin();
  DELETE FROM public.proposal_engineers WHERE id = _engineer_id RETURNING user_id INTO _uid;
  IF NOT FOUND THEN RAISE EXCEPTION 'Engineer not found.'; END IF;
  IF _uid IS NOT NULL AND NOT public.has_role(_uid, 'admin') THEN
    DELETE FROM auth.users WHERE id = _uid;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public._assert_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public._assert_engineer_password(text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_create_engineer(text, text, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_engineer_password(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_engineer_active(uuid, boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_delete_engineer(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_create_engineer(text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_engineer_password(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_engineer_active(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_engineer(uuid) TO authenticated;
