import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

export const ConnectionStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [supabaseUrl, setSupabaseUrl] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      setSupabaseUrl(url || 'Not configured');

      // Check if env vars are set
      if (!url || !key || url === 'your_supabase_url_here' || key === 'your_publishable_key_here') {
        setStatus('disconnected');
        setErrorDetails('Environment variables not configured. Running with placeholder values.');
        return;
      }

      try {
        // Test basic connectivity with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url + '/rest/v1/', {
          method: 'HEAD',
          headers: {
            'apikey': key,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok || response.status === 404) {
          // 404 is actually fine - it means we reached the server
          setStatus('connected');
          setErrorDetails('');
        } else {
          setStatus('disconnected');
          setErrorDetails(`Server returned status ${response.status}: ${response.statusText}`);
        }
      } catch (error: any) {
        setStatus('disconnected');

        if (error.name === 'AbortError') {
          setErrorDetails('Connection timeout - unable to reach backend server within 5 seconds. This suggests a network or firewall issue.');
        } else if (error.message?.includes('Failed to fetch') || error.message?.includes('Load failed')) {
          setErrorDetails('Network request blocked. This is typically caused by:\n• Corporate firewall blocking the domain\n• ISP filtering\n• Browser security extensions\n• CORS configuration issue\n• VPN or proxy interference');
        } else {
          setErrorDetails(`${error.name}: ${error.message}`);
        }
      }
    };

    checkConnection();

    // Re-check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'checking') {
    return null; // Don't show anything while checking
  }

  if (status === 'connected') {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Backend Connected</AlertTitle>
        <AlertDescription className="text-green-700 text-xs">
          Successfully connected to authentication server
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <WifiOff className="h-4 w-4" />
      <AlertTitle>Backend Connection Failed</AlertTitle>
      <AlertDescription className="space-y-2">
        <p className="font-semibold">Unable to reach authentication server</p>
        <p className="text-xs">Backend URL: {supabaseUrl}</p>
        <details className="text-xs mt-2">
          <summary className="cursor-pointer font-medium">Technical Details</summary>
          <pre className="mt-2 whitespace-pre-wrap bg-destructive/10 p-2 rounded text-xs">
            {errorDetails}
          </pre>
          <div className="mt-2 space-y-1">
            <p className="font-medium">Possible solutions:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Check your internet connection</li>
              <li>Disable VPN or proxy temporarily</li>
              <li>Try from a different network (mobile hotspot)</li>
              <li>Ask your IT team to whitelist: {supabaseUrl}</li>
              <li>Check browser console (F12) for detailed errors</li>
            </ul>
          </div>
        </details>
      </AlertDescription>
    </Alert>
  );
};
