import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Briefcase, Download, Mail, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

type EventType = 'contact' | 'job' | 'download' | 'newsletter';
interface Event {
  id: string;
  type: EventType;
  title: string;
  subtitle: string;
  created_at: string;
  href: string;
}

const meta: Record<EventType, { icon: any; color: string; bg: string; label: string }> = {
  contact:    { icon: FileText,  color: 'text-blue-600',   bg: 'bg-blue-500/10',   label: 'Contact'   },
  job:        { icon: Briefcase, color: 'text-green-600',  bg: 'bg-green-500/10',  label: 'Job'       },
  download:   { icon: Download,  color: 'text-purple-600', bg: 'bg-purple-500/10', label: 'Download'  },
  newsletter: { icon: Mail,      color: 'text-amber-600',  bg: 'bg-amber-500/10',  label: 'Newsletter'},
};

export const ActivityFeed = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, j, d, n] = await Promise.all([
          supabase.from('contact_submissions').select('id,name,subject,created_at').order('created_at', { ascending: false }).limit(10),
          supabase.from('job_applications').select('id,name,position,created_at').order('created_at', { ascending: false }).limit(10),
          supabase.from('download_leads').select('id,name,resource_title,created_at').order('created_at', { ascending: false }).limit(10),
          supabase.from('newsletter_subscribers').select('id,email,subscribed_at').order('subscribed_at', { ascending: false }).limit(10),
        ]);
        const merged: Event[] = [
          ...(c.data || []).map((r: any) => ({ id: `c-${r.id}`, type: 'contact' as const,    title: r.name,  subtitle: r.subject || 'Contact form',     created_at: r.created_at,     href: '/admin/contacts' })),
          ...(j.data || []).map((r: any) => ({ id: `j-${r.id}`, type: 'job' as const,        title: r.name,  subtitle: r.position || 'Job application', created_at: r.created_at,     href: '/admin/jobs' })),
          ...(d.data || []).map((r: any) => ({ id: `d-${r.id}`, type: 'download' as const,   title: r.name,  subtitle: r.resource_title || 'Download',  created_at: r.created_at,     href: '/admin/downloads' })),
          ...(n.data || []).map((r: any) => ({ id: `n-${r.id}`, type: 'newsletter' as const, title: r.email, subtitle: 'Subscribed',                    created_at: r.subscribed_at,  href: '/admin/newsletter' })),
        ];
        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setEvents(merged.slice(0, 10));
      } catch (e) {
        console.error('Activity feed error', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest 10 events across all submission types</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No activity yet.</p>
        ) : (
          <ul className="divide-y">
            {events.map((ev) => {
              const m = meta[ev.type];
              const Icon = m.icon;
              return (
                <li key={ev.id}>
                  <Link to={ev.href} className="flex items-center gap-3 py-2.5 hover:bg-muted/50 rounded-md px-2 -mx-2 transition-colors">
                    <div className={`p-2 rounded-lg ${m.bg}`}>
                      <Icon className={`h-4 w-4 ${m.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{ev.title}</p>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{m.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{ev.subtitle}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(ev.created_at), { addSuffix: true })}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
