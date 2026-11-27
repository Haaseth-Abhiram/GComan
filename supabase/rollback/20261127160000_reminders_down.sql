-- Undo 20261127160000_reminders.sql (reminder settings are lost; notifications already sent stay).
BEGIN;

DO $$
BEGIN
  IF to_regclass('cron.job') IS NOT NULL THEN
    EXECUTE $q$ SELECT cron.unschedule(jobname) FROM cron.job WHERE jobname = 'portal-reminders' $q$;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS notify_auto_out ON public.attendance_sessions;
DROP TRIGGER IF EXISTS notify_punch_in ON public.attendance_sessions;
DROP TRIGGER IF EXISTS notify_employee_new ON public.employees;
DROP TRIGGER IF EXISTS notify_employee_manager ON public.employees;
DROP FUNCTION IF EXISTS public._trg_notify_auto_out(), public._trg_notify_employee(), public._trg_notify_punch_in(),
  public.notif_tick(), public.reminders_admin_send_now(text),
  public.reminders_admin_save(text, boolean, time, smallint[]), public.reminders_admin(), public._reminders_timer_on(),
  public.reminders_run_due(), public._reminder_send(text), public._clock_text(time),
  public._notify_system(uuid, text, text, text, text, text);
DROP TABLE IF EXISTS public.reminder_settings;
DROP INDEX IF EXISTS public.notifications_once;
ALTER TABLE public.notifications DROP COLUMN IF EXISTS dedupe_key;

COMMIT;

NOTIFY pgrst, 'reload schema';
