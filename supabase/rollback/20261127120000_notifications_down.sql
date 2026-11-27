-- Undo 20261127120000_notifications.sql. THIS DELETES all notifications and
-- messages. Back up first. Run the profile (140000) and projects (130000)
-- rollbacks before this one.
BEGIN;
DROP TRIGGER IF EXISTS notify_report ON public.work_reports;
DROP TRIGGER IF EXISTS notify_leave_new ON public.leave_requests;
DROP TRIGGER IF EXISTS notify_leave_change ON public.leave_requests;
DROP TRIGGER IF EXISTS notify_correction ON public.attendance_corrections;
DROP FUNCTION IF EXISTS public._trg_notify_report(), public._trg_notify_leave(), public._trg_notify_correction(),
  public.notif_mine(), public.notif_read(uuid[]), public.notif_options(), public.notif_send(text, uuid[], text, text, text),
  public._notify(uuid, text, text, text, text, text), public._notify_admins(uuid, text, text, text, text);
DROP TABLE IF EXISTS public.notifications;
DELETE FROM public.rbac_permissions WHERE key IN ('portal.notifications.create', 'team.messages.create');
COMMIT;
