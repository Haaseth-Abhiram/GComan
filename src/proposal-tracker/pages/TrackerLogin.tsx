import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/proposal-tracker/contexts/TrackerAuthContext';
import logo from '@/assets/global-chemicals-logo.svg';

const Login = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (user) return <Navigate to="/proposal-tracker" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = signIn(email, password);
    if (res.ok) navigate('/proposal-tracker', { replace: true });
    else setError(res.error ?? 'Login failed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 group mb-8">
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="space-y-6">
            <img src={logo} alt="Global Chemicals LLC" width={200} height={64} className="h-16 w-auto" />
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to Global Chemicals LLC</h1>
              <p className="text-lg text-muted-foreground">Proposal Engineer Tracker for our admin and engineering team</p>
            </div>
            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Proposal Tracking</h3>
                  <p className="text-sm text-muted-foreground">Follow RFQs, assignments, deadlines and submissions in one place</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Access</h3>
                  <p className="text-sm text-muted-foreground">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign in */}
        <div className="w-full max-w-md mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
        <Card className="logo-gradient-border shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <img src={logo} alt="Global Chemicals LLC" width={150} height={48} className="h-12 w-auto mx-auto lg:hidden" />
            <CardTitle className="text-2xl">Proposal Engineer Tracker</CardTitle>
            <CardDescription>Sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="Enter your email address" autoComplete="username" className="pl-10" value={email} required
                    onChange={(e) => { setEmail(e.target.value); setError(null); }} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" className="pl-10" value={password} required
                    onChange={(e) => { setPassword(e.target.value); setError(null); }} />
                </div>
              </div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" size="lg">Sign In</Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
