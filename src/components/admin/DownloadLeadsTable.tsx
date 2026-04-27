import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Loader2, FileSpreadsheet, Search } from 'lucide-react';
import { exportToExcel } from '@/lib/exportToExcel';
import { DateRangeFilter, inDateRange, loadDateRange, DateRange } from './DateRangeFilter';

type DownloadLead = Tables<'download_leads'>;

export const DownloadLeadsTable = () => {
  const [leads, setLeads] = useState<DownloadLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [consentFilter, setConsentFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange>(loadDateRange('downloads'));

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('download_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching download leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resources = useMemo(
    () => Array.from(new Set(leads.map((l) => l.resource_title).filter(Boolean))),
    [leads]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (resourceFilter !== 'all' && l.resource_title !== resourceFilter) return false;
      if (consentFilter === 'yes' && !l.marketing_consent) return false;
      if (consentFilter === 'no' && l.marketing_consent) return false;
      if (!inDateRange(l.created_at, dateRange)) return false;
      if (!q) return true;
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.phone || '').toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q) ||
        (l.country || '').toLowerCase().includes(q)
      );
    });
  }, [leads, search, resourceFilter, consentFilter, dateRange]);

  const handleExport = () => {
    if (!filtered.length) return;
    exportToExcel(
      filtered.map((l) => ({
        Date: format(new Date(l.created_at), 'yyyy-MM-dd HH:mm'),
        Name: l.name,
        Email: l.email,
        Phone: l.phone,
        Company: l.company,
        Country: l.country,
        Industry: l.industry || '',
        Resource: l.resource_title,
        'Marketing Consent': l.marketing_consent ? 'Yes' : 'No',
      })),
      'download_leads',
      'Leads'
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle>Download Leads</CardTitle>
            <CardDescription>Users who downloaded brochures and resources</CardDescription>
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
              placeholder="Search name, email, company, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={resourceFilter} onValueChange={setResourceFilter}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Resource" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All resources</SelectItem>
              {resources.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={consentFilter} onValueChange={setConsentFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Marketing consent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All consent</SelectItem>
              <SelectItem value="yes">Consent: Yes</SelectItem>
              <SelectItem value="no">Consent: No</SelectItem>
            </SelectContent>
          </Select>
          <DateRangeFilter storageKey="downloads" value={dateRange} onChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Marketing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No download leads match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(lead.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.country}</TableCell>
                    <TableCell className="max-w-xs truncate">{lead.resource_title}</TableCell>
                    <TableCell>
                      <Badge variant={lead.marketing_consent ? 'default' : 'secondary'}>
                        {lead.marketing_consent ? 'Yes' : 'No'}
                      </Badge>
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
