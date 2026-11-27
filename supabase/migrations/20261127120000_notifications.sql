-- Employee Portal: Notifications.
--
-- Every employee has a list of notifications (bell, urgent banner, mark read).
-- They are created automatically (daily reports, leave, attendance corrections;
-- projects add theirs in the next migration) and by messages:
--   * Admins (portal.notifications.create) message people or everyone.
--   * Managers (team.messages.create) message their whole team.
--   * Employees (emp.messages.create) message colleagues they choose.
-- Everything is read and written through the functions below.
-- Run after 20261127110000_daily_reports.sql.
-- Rollback: supabase/rollback/20261127120000_notifications_down.sql

BEGIN;

CREATE TABLE IF NOT EXISTS public.notifications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id   uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  kind          text NOT NULL CHECK (kind IN ('message', 'report', 'leave', 'attendance', 'project')),
  priority      text NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent')),
  title         text NOT NULL CHECK (length(title) BETWEEN 1 AND 150),
  body          text CHECK (body IS NULL OR length(body) <= 2000),
  link          text,
  sender_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_label  text,
  message_id    uuid,          -- the same for every copy of one message
  read_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notifications_mine ON public.notifications (employee_id, read_at, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_sent ON public.notifications (sender_id, created_at DESC) WHERE message_id IS NOT NULL;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.notifications FROM anon, authenticated;

INSERT INTO public.rbac_permissions (key, area, label, description, sort_order, grp, page, tab, action_label, kind, sensitive) VALUES
  ('portal.notifications.create', 'admin',  'Notifications: Send',        'Send messages to employees, or to everyone.', 460, 'Notifications', 'Notifications', NULL,           'Send',         'page',   false),
  ('team.messages.create',        'portal', 'Notifications › Team: Send', 'Send messages to the people who report to you.', 720, 'Managers',   'Notifications', 'Team messages', 'Send',         'action', false),
  ('emp.messages.create',         'portal', 'Notifications: Send',        'Send messages to colleagues you choose.',          640, 'Employee Portal', 'Notifications', NULL,       'Send messages', 'action', false)
ON CONFLICT (key) DO NOTHING;
INSERT INTO public.rbac_role_permissions (role_key, permission_key) VALUES
  ('admin', 'portal.notifications.create'), ('manager', 'team.messages.create'), ('employee', 'emp.messages.create')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Creating notifications (internal)
-- ---------------------------------------------------------------------------
-- One notification for one active employee; never to the person who caused it.
CREATE OR REPLACE FUNCTION public._notify(_emp uuid, _kind text, _title text, _body text, _link text, _priority text DEFAULT 'normal')
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
  INSERT INTO public.notifications (employee_id, kind, priority, title, body, link, sender_id)
  SELECT e.id, _kind, _priority, left(_title, 150), nullif(left(_body, 2000), ''), _link, auth.uid()
    FROM public.employees e
   WHERE e.id = _emp AND e.active AND e.user_id IS DISTINCT FROM auth.uid();
$$;

-- Everyone with the Admin role, except the employee the news is about.
CREATE OR REPLACE FUNCTION public._notify_admins(_about uuid, _kind text, _title text, _body text, _link text)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = ''
AS $$
  SELECT public._notify(e.id, _kind, _title, _body, _link)
    FROM public.employees e JOIN public.rbac_user_roles ur ON ur.user_id = e.user_id AND ur.role_key = 'admin'
   WHERE e.active AND e.id IS DISTINCT FROM _about;
$$;

CREATE OR REPLACE FUNCTION public._trg_notify_report()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _name text := (SELECT full_name FROM public.employees WHERE id = NEW.employee_id);
        _day  text := to_char(NEW.report_date, 'DD Mon YYYY');
BEGIN
  IF NEW.status = 'submitted' THEN
    IF NEW.submitted_to IS NOT NULL THEN
      PERFORM public._notify(NEW.submitted_to, 'report', _name || ' submitted a daily report', 'For ' || _day, '/portal/reports?tab=team');
    ELSE
      PERFORM public._notify_admins(NEW.employee_id, 'report', _name || ' submitted a daily report', 'For ' || _day, '/admin/reports');
    END IF;
  ELSIF NEW.status = 'reviewed' THEN
    PERFORM public._notify(NEW.employee_id, 'report', 'Your daily report was reviewed', 'For ' || _day, '/portal/reports?date=' || NEW.report_date);
  ELSIF NEW.status = 'returned' THEN
    PERFORM public._notify(NEW.employee_id, 'report', 'Your daily report was sent back',
      'For ' || _day || ': ' || coalesce(NEW.review_comment, ''), '/portal/reports?date=' || NEW.report_date, 'urgent');
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_report ON public.work_reports;
CREATE TRIGGER notify_report AFTER UPDATE ON public.work_reports
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public._trg_notify_report();

CREATE OR REPLACE FUNCTION public._trg_notify_leave()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _name  text := (SELECT full_name FROM public.employees WHERE id = NEW.employee_id);
        _dates text := to_char(NEW.start_date, 'DD Mon') || CASE WHEN NEW.end_date <> NEW.start_date THEN ' – ' || to_char(NEW.end_date, 'DD Mon') ELSE '' END;
BEGIN
  IF NEW.status = 'manager_review' THEN
    PERFORM public._notify(NEW.manager_employee_id, 'leave', _name || ' applied for leave', _dates, '/portal/leave');
  ELSIF NEW.status = 'admin_review' THEN
    PERFORM public._notify_admins(NEW.employee_id, 'leave', 'Leave of ' || _name || ' needs your approval', _dates, '/admin/leave');
  ELSIF NEW.status = 'manager_final' THEN
    PERFORM public._notify(NEW.manager_employee_id, 'leave', 'Leave of ' || _name || ' needs your final approval', _dates, '/portal/leave');
  ELSIF NEW.status IN ('approved', 'rejected') THEN
    PERFORM public._notify(NEW.employee_id, 'leave', 'Your leave was ' || NEW.status,
      _dates || CASE WHEN NEW.status = 'rejected' THEN ': ' || coalesce(NEW.rejected_comment, '') ELSE '' END, '/portal/leave');
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_leave_new ON public.leave_requests;
CREATE TRIGGER notify_leave_new AFTER INSERT ON public.leave_requests
  FOR EACH ROW EXECUTE FUNCTION public._trg_notify_leave();
DROP TRIGGER IF EXISTS notify_leave_change ON public.leave_requests;
CREATE TRIGGER notify_leave_change AFTER UPDATE ON public.leave_requests
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public._trg_notify_leave();

CREATE OR REPLACE FUNCTION public._trg_notify_correction()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.status IN ('approved', 'rejected') THEN
    PERFORM public._notify(NEW.employee_id, 'attendance', 'Your attendance correction was ' || NEW.status,
      'For ' || to_char(NEW.work_date, 'DD Mon YYYY') || coalesce(': ' || NEW.decision_comment, ''), '/portal/attendance');
  END IF;
  RETURN NULL;
END;
$$;
DROP TRIGGER IF EXISTS notify_correction ON public.attendance_corrections;
CREATE TRIGGER notify_correction AFTER UPDATE ON public.attendance_corrections
  FOR EACH ROW WHEN (OLD.status IS DISTINCT FROM NEW.status) EXECUTE FUNCTION public._trg_notify_correction();

-- ---------------------------------------------------------------------------
-- Reading (own only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notif_mine()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  RETURN jsonb_build_object(
    'unread', (SELECT count(*) FROM public.notifications WHERE employee_id = _e.id AND read_at IS NULL),
    'urgent', coalesce((SELECT jsonb_agg(to_jsonb(u) ORDER BY u.created_at DESC) FROM (
                 SELECT id, title, body, link, sender_label, created_at FROM public.notifications
                  WHERE employee_id = _e.id AND read_at IS NULL AND priority = 'urgent' ORDER BY created_at DESC LIMIT 5) u), '[]'::jsonb),
    -- unread first, newest first
    'items', coalesce((SELECT jsonb_agg(to_jsonb(i) ORDER BY (i.read_at IS NULL) DESC, i.created_at DESC) FROM (
                 SELECT id, kind, priority, title, body, link, sender_label, read_at, created_at FROM public.notifications
                  WHERE employee_id = _e.id ORDER BY (read_at IS NULL) DESC, created_at DESC LIMIT 100) i), '[]'::jsonb));
END;
$$;

-- _ids = NULL marks everything read.
CREATE OR REPLACE FUNCTION public.notif_read(_ids uuid[] DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE _e public.employees := public._att_me();
BEGIN
  UPDATE public.notifications SET read_at = now()
   WHERE employee_id = _e.id AND read_at IS NULL AND (_ids IS NULL OR id = ANY (_ids));
END;
$$;

-- ---------------------------------------------------------------------------
-- Messages
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notif_options()
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _all  boolean := public.rbac_can('portal.notifications.create');
  _me   uuid := public.portal_my_employee_id();
  _team boolean;
  _own  boolean;
BEGIN
  _team := coalesce(public.rbac_can('team.messages.create') AND _me IS NOT NULL
             AND EXISTS (SELECT 1 FROM public.employees WHERE reporting_manager_id = _me AND active), false);
  _own := coalesce(public.rbac_can('emp.messages.create') AND _me IS NOT NULL, false);
  IF NOT _all AND NOT _team AND NOT _own THEN
    RETURN jsonb_build_object('can_send', false, 'can_all', false, 'can_team', false, 'people', '[]'::jsonb, 'sent', '[]'::jsonb);
  END IF;
  RETURN jsonb_build_object(
    'can_send', true,
    'can_all', _all,
    'can_team', _team,
    'people', coalesce((SELECT jsonb_agg(jsonb_build_object('id', e.id, 'full_name', e.full_name, 'employee_code', e.employee_code,
                 'designation', e.designation) ORDER BY e.full_name)
                 FROM public.employees e
                WHERE e.active AND e.id IS DISTINCT FROM _me
                  AND (_all OR _own OR (_team AND e.reporting_manager_id = _me))), '[]'::jsonb),
    -- my messages of the last 90 days
    'sent', coalesce((SELECT jsonb_agg(to_jsonb(s) ORDER BY s.created_at DESC) FROM (
                 SELECT n.message_id AS id, min(n.title) AS title, min(n.body) AS body, min(n.priority) AS priority,
                        min(n.created_at) AS created_at, count(*) AS recipients, count(n.read_at) AS read,
                        (array_agg(e.full_name ORDER BY e.full_name))[1:4] AS "to"
                   FROM public.notifications n JOIN public.employees e ON e.id = n.employee_id
                  WHERE n.sender_id = auth.uid() AND n.message_id IS NOT NULL AND n.created_at > now() - interval '90 days'
                  GROUP BY n.message_id ORDER BY min(n.created_at) DESC LIMIT 50) s), '[]'::jsonb));
END;
$$;

-- _audience: 'people' (_to required) | 'team' | 'all'. Returns how many got it.
CREATE OR REPLACE FUNCTION public.notif_send(_audience text, _to uuid[], _title text, _body text, _priority text)
RETURNS int
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _all   boolean := public.rbac_can('portal.notifications.create');
  _me    uuid := public.portal_my_employee_id();
  _team  boolean;
  _own   boolean;
  _t     text := btrim(coalesce(_title, ''), E' \t\r\n');
  _b     text := nullif(btrim(coalesce(_body, ''), E' \t\r\n'), '');
  _msg   uuid := gen_random_uuid();
  _n     int;
BEGIN
  _team := coalesce(public.rbac_can('team.messages.create') AND _me IS NOT NULL, false);
  _own := coalesce(public.rbac_can('emp.messages.create') AND _me IS NOT NULL, false);
  IF NOT _all AND NOT _team AND NOT _own THEN
    RAISE EXCEPTION 'You do not have permission to send messages.' USING ERRCODE = '42501';
  END IF;
  IF length(_t) NOT BETWEEN 1 AND 150 THEN RAISE EXCEPTION 'Subject must be 1 to 150 characters.' USING ERRCODE = '22023'; END IF;
  IF coalesce(length(_b), 0) > 2000 THEN RAISE EXCEPTION 'Message must be at most 2000 characters.' USING ERRCODE = '22023'; END IF;
  IF coalesce(_priority, '') NOT IN ('normal', 'urgent') THEN RAISE EXCEPTION 'Invalid priority.' USING ERRCODE = '22023'; END IF;
  IF coalesce(_audience, '') NOT IN ('people', 'team', 'all') THEN RAISE EXCEPTION 'Invalid audience.' USING ERRCODE = '22023'; END IF;
  IF _audience = 'all' AND NOT _all THEN RAISE EXCEPTION 'Only an admin can message everyone.' USING ERRCODE = '42501'; END IF;
  IF _audience = 'team' AND NOT _team THEN RAISE EXCEPTION 'You do not have a team to message.' USING ERRCODE = '42501'; END IF;
  IF _audience = 'people' AND coalesce(cardinality(_to), 0) = 0 THEN RAISE EXCEPTION 'Choose at least one person.' USING ERRCODE = '22023'; END IF;
  IF _audience = 'people' AND cardinality(_to) > 100 THEN RAISE EXCEPTION 'Choose at most 100 people.' USING ERRCODE = '22023'; END IF;
  -- Without the employee permission a manager may only choose their own team.
  IF _audience = 'people' AND NOT _all AND NOT _own AND EXISTS (
       SELECT 1 FROM unnest(_to) x WHERE NOT EXISTS (
         SELECT 1 FROM public.employees e WHERE e.id = x AND e.reporting_manager_id = _me)) THEN
    RAISE EXCEPTION 'You can only message people in your team.' USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.notifications (employee_id, kind, priority, title, body, link, sender_id, sender_label, message_id)
  SELECT e.id, 'message', _priority, _t, _b, NULL, auth.uid(), coalesce(public._user_name(auth.uid()), 'Admin'), _msg
    FROM public.employees e
   WHERE e.active AND e.user_id IS DISTINCT FROM auth.uid()
     AND CASE _audience WHEN 'all' THEN true WHEN 'team' THEN e.reporting_manager_id = _me ELSE e.id = ANY (_to) END;
  GET DIAGNOSTICS _n = ROW_COUNT;
  IF _n = 0 THEN RAISE EXCEPTION 'There is nobody to send this to.' USING ERRCODE = '22023'; END IF;
  RETURN _n;
END;
$$;

REVOKE ALL ON FUNCTION public._notify(uuid, text, text, text, text, text), public._notify_admins(uuid, text, text, text, text),
  public._trg_notify_report(), public._trg_notify_leave(), public._trg_notify_correction() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notif_mine(), public.notif_read(uuid[]), public.notif_options(),
  public.notif_send(text, uuid[], text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.notif_mine(), public.notif_read(uuid[]), public.notif_options(),
  public.notif_send(text, uuid[], text, text, text) TO authenticated;

COMMIT;
