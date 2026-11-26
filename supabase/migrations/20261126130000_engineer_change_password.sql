-- Proposal engineers change their own password.
--
-- The password the admin creates (or resets) is TEMPORARY: must_change_password
-- is true, and the tracker makes the engineer choose their own password before
-- they can use it. They can also change it any time from their profile menu.

ALTER TABLE public.proposal_engineers
  ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT true;

-- Admin reset → the new password is temporary again.
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
  UPDATE public.proposal_engineers SET must_change_password = true WHERE id = _engineer_id;
END;
$$;

-- The signed-in engineer changes THEIR OWN password (current password required).
CREATE OR REPLACE FUNCTION public.engineer_change_password(_current text, _new text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE _hash text;
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.proposal_engineers WHERE user_id = auth.uid() AND active
  ) THEN
    RAISE EXCEPTION 'Only an active proposal engineer can change their password here.' USING ERRCODE = '42501';
  END IF;

  SELECT encrypted_password INTO _hash FROM auth.users WHERE id = auth.uid();
  IF _hash IS NULL OR extensions.crypt(coalesce(_current, ''), _hash) <> _hash THEN
    RAISE EXCEPTION 'Your current password is incorrect.';
  END IF;
  PERFORM public._assert_engineer_password(_new);
  IF _new = _current THEN
    RAISE EXCEPTION 'Choose a new password that is different from the current one.';
  END IF;

  UPDATE auth.users
     SET encrypted_password = extensions.crypt(_new, extensions.gen_salt('bf', 10)), updated_at = now()
   WHERE id = auth.uid();
  UPDATE public.proposal_engineers SET must_change_password = false WHERE user_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.engineer_change_password(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.engineer_change_password(text, text) TO authenticated;
