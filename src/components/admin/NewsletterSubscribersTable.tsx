import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Loader2, FileSpreadsheet, Search, MailX, MailCheck } from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';
import { useToast } from '@/hooks/use-toast';
import { DateRangeFilter, inDateRange, loadDateRange, DateRange } from './DateRangeFilter';

type Subscriber = Tables<'newsletter_subscribers'>;

export const NewsletterSubscribersTable = () => {
  const { toast } = useToast();
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all');
  const [dateRange, setDateRange] = useState<DateRange>(loadDateRange('newsletter'));
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => { fetchSubs(); }, []);

  const fetchSubs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      if (error) throw error;
      setSubs(data || []);
    } catch (e) {
      console.error('Error fetching subscribers:', e);
      toast({ title: 'Failed to load subscribers', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subs.filter((s) => {
      if (statusFilter === 'active' && !s.is_active) return false;
      if (statusFilter === 'unsubscribed' && s.is_active) return false;
      if (!inDateRange(s.subscribed_at, dateRange)) return false;
      if (!q) return true;
      return (
        s.email.toLowerCase().includes(q) ||
        (s.source || '').toLowerCase().includes(q)
      );
    });
  }, [subs, search, statusFilter, dateRange]);

  const handleExport = () => {
    if (!filtered.length) return;
    exportToExcel(
      filtered.map((s) => ({
        Email: s.email,
        Status: s.is_active ? 'Active' : 'Unsubscribed',
        Source: s.source || '',
        'Subscribed At': format(new Date(s.subscribed_at), 'yyyy-MM-dd HH:mm'),
        'Unsubscribed At': s.unsubscribed_at ? format(new Date(s.unsubscribed_at), 'yyyy-MM-dd HH:mm') : '',
      })),
      'newsletter_subscribers',
      'Subscribers'
    );
  };

  const toggleActive = async (s: Subscriber) => {
    setBusyId(s.id);
    try {
      const next = !s.is_active;
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          is_active: next,
          unsubscribed_at: next ? null : new Date().toISOString(),
        })
        .eq('id', s.id);
      if (error) throw error;
      setSubs((prev) => prev.map((x) => x.id === s.id ? { ...x, is_active: next, unsubscribed_at: next ? null : new Date().toISOString() } : x));
      toast({ title: next ? 'Re-subscribed' : 'Unsubscribed', description: s.email });
    } catch (e: any) {
      toast({ title: 'Update failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeCount = subs.filter((s) => s.is_active).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle>Newsletter Subscribers</CardTitle>
            <CardDescription>
              {activeCount} active · {subs.length - activeCount} unsubscribed · {subs.length} total
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={!filtered.length}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel ({filtered.length})
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:items-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search email or source..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
            </SelectContent>
          </Select>
          <DateRangeFilter storageKey="newsletter" value={dateRange} onChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscribed</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No subscribers match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(s.subscribed_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{s.email}</TableCell>
                    <TableCell className="text-muted-foreground">{s.source || '-'}</TableCell>
                    <TableCell>
                      {s.is_active ? (
                        <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 gap-1">
                          <MailCheck className="h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <MailX className="h-3 w-3" /> Unsubscribed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyId === s.id}
                        onClick={() => toggleActive(s)}
                      >
                        {busyId === s.id && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                        {s.is_active ? 'Unsubscribe' : 'Re-subscribe'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
