import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, FlaskConical, ShieldCheck, UserRound, ClipboardList } from 'lucide-react';
import { z } from 'zod';
import logo from '@/assets/global-chemicals-logo.svg';
import { supabase } from '@/integrations/supabase/client';
import { destinationForUser } from '@/portal/lib/access';
import { usePortalTheme } from '@/portal/theme/usePortalTheme';


const HIGHLIGHTS = [
  { icon: ShieldCheck, label: 'Secure access' },
  { icon: UserRound, label: 'Employee portal' },
  { icon: ClipboardList, label: 'Orders & documents' },
];

// Validation schemas
const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
});

const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const newPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Captured synchronously at module load — supabase-js consumes the recovery
// hash when it creates the session, so reading it later misses it.
const arrivedViaRecoveryLink =
  typeof window !== 'undefined' && window.location.hash.includes('type=recovery');

const Login = () => {
  usePortalTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(arrivedViaRecoveryLink);
  const [newPasswordData, setNewPasswordData] = useState({ password: '', confirmPassword: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Recovery links create a session too — without this listener (and the hash
  // check above) the redirect below would bounce the user to "/" silently
  // logged in with their OLD password, never showing the set-new-password form.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryMode(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Where to send the user after a successful auth. Populated by OAuth consent
  // flows via ?next=/.lovable/oauth/consent?authorization_id=... so external
  // MCP clients return to the consent screen instead of the homepage.
  // Validated as a same-origin relative path to prevent open-redirect abuse.
  const nextParam = searchParams.get('next');
  const safeNext = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/';

  // One login page for everyone: admins go to /admin, employees (including
  // proposal engineers) to the Employee Portal at /portal, everyone else to
  // ?next= or the homepage. A disabled employee is signed straight back out.
  const goAfterSignIn = async (userId: string, greet: boolean) => {
    const dest = await destinationForUser(userId).catch(() => null);
    if (dest === 'disabled') {
      await supabase.auth.signOut();
      toast({
        title: "Account disabled",
        description: "Your employee account has been disabled. Please contact your administrator.",
        variant: "destructive",
      });
      return;
    }
    if (greet) {
      toast({ title: "Login successful!", description: "Welcome back to Global Chemicals LLC" });
    }
    navigate(nextParam ? safeNext : (dest ?? safeNext));
  };

  // Check if user is already logged in
  useEffect(() => {
    if (isRecoveryMode) return;
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        void goAfterSignIn(session.user.id, false);
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per mode change; goAfterSignIn is recreated each render
  }, [isRecoveryMode]);

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    try {
      newPasswordSchema.parse(newPasswordData);

      const { error } = await supabase.auth.updateUser({ password: newPasswordData.password });
      if (error) throw error;

      toast({
        title: "Password updated!",
        description: "Your new password is now active.",
      });
      setIsRecoveryMode(false);
      setNewPasswordData({ password: '', confirmPassword: '' });
      navigate('/');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid password",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update password. The reset link may have expired — request a new one.",
          variant: "destructive"
        });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      loginSchema.parse(loginData);

      // Authenticate with backend
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        // Only log detailed errors in development
        if (import.meta.env.DEV) {
          console.error('Login error:', error.message);
        }

        const rawMessage = error.message || '';
        const lowerMessage = rawMessage.toLowerCase();
        const isNetworkError =
          lowerMessage.includes('load failed') ||
          lowerMessage.includes('failed to fetch') ||
          lowerMessage.includes('network error');

        if (lowerMessage.includes('banned')) {
          toast({
            title: "Account disabled",
            description: "Your account has been disabled. Please contact your administrator.",
            variant: "destructive"
          });
        } else if (rawMessage.includes('Invalid login credentials')) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        } else if (rawMessage.includes('Email not confirmed')) {
          toast({
            title: "Email not confirmed",
            description: "Please confirm your email before logging in.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login failed",
            description: isNetworkError
              ? "Unable to reach the login server. Please check your connection and try again shortly."
              : (rawMessage || "An unexpected error occurred. Please try again."),
            variant: "destructive"
          });
        }
        return;
      }

      if (data.session) {
        await goAfterSignIn(data.session.user.id, true);
      }

    } catch (error) {
      console.error('Unexpected login error', error);

      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      signupSchema.parse(signupData);


      // Create account with backend
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}${safeNext}`,
          data: {
            name: signupData.name,
          }
        }
      });

      if (error) {
        // Only log detailed errors in development
        if (import.meta.env.DEV) {
          console.error('Signup error:', error.message);
        }

        const rawMessage = error.message || '';
        const lowerMessage = rawMessage.toLowerCase();
        const isNetworkError =
          lowerMessage.includes('load failed') ||
          lowerMessage.includes('failed to fetch') ||
          lowerMessage.includes('network error');

        if (rawMessage.includes('User already registered')) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please login instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Signup failed",
            description: isNetworkError
              ? "Unable to reach the signup server. Please check your connection and try again shortly."
              : (rawMessage || "An unexpected error occurred. Please try again."),
            variant: "destructive"
          });
        }
        return;
      }

      if (data.session) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to Global Chemicals LLC",
        });
        await goAfterSignIn(data.session.user.id, false);
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account, then sign in.",
        });
        setIsLogin(true);
        setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signup failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);

    try {
      // Validate email
      const emailSchema = z.string().email("Please enter a valid email address");
      emailSchema.parse(resetEmail);

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent!",
        description: "Please check your email for a password reset link.",
      });

      setShowResetDialog(false);
      setResetEmail('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid email",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send password reset email. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a1029] px-4 py-20 sm:px-6">
      <Helmet defer={false}>
        <title>Login | Global Chemicals LLC</title>
        <meta name="description" content="Login to Global Chemicals LLC customer portal. Access orders, invoices, technical docs & account info securely." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://gcoman.com/login" />
      </Helmet>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#f1592a]/25 blur-[130px]" />
        <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#223f96]/60 blur-[130px]" />
      </div>

      <Link
        to="/"
        className="group absolute left-4 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10 sm:left-6"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
        Back to Home
      </Link>

      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-2xl bg-white px-5 py-3 shadow-2xl shadow-black/40">
            <img src={logo} alt="Global Chemicals LLC" width={180} height={52} className="h-12 w-auto" />
          </span>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#ff8a5c]">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
            Premium chemical solutions across Oman
          </span>
        </div>

        <div className="mt-7 rounded-[1.75rem] bg-gradient-to-br from-[#f1592a] via-[#ffb08f]/60 to-[#3f63c9] p-[2px] shadow-2xl shadow-black/60">
          <div className="rounded-[1.65rem] bg-[#0d1433] p-6 sm:p-8">
            <div className="mx-auto flex w-full max-w-[15rem] rounded-full border border-white/10 bg-white/5 p-1">
              {([[true, 'Sign In'], [false, 'Sign Up']] as const).map(([value, text]) => (
                <button
                  key={text}
                  type="button"
                  aria-pressed={isLogin === value}
                  onClick={() => setIsLogin(value)}
                  className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition-all ${isLogin === value ? 'bg-gradient-to-r from-[#f1592a] to-[#3f63c9] text-white' : 'text-white/55 hover:text-white'}`}
                >
                  {text}
                </button>
              ))}
            </div>

            <h1 className="mt-6 text-center text-2xl font-bold text-white">
              {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
            </h1>
            <p className="mt-1.5 text-center text-sm text-white/60">
              {isLogin ? 'Enter your credentials to access your account' : 'Sign up to get started with Global Chemicals LLC'}
            </p>

            {isLogin ? (
              // Login Form
              <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-white/80">Email Address</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" aria-hidden="true" />
                      <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10 border-white/20 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#f1592a]/60 focus-visible:ring-[#f1592a]/40 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-white/80">Password</Label>
                      <button type="button" className="text-xs font-semibold text-[#ff8a5c] hover:underline" onClick={() => setShowResetDialog(true)}>
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" aria-hidden="true" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10 pr-10 border-white/20 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#f1592a]/60 focus-visible:ring-[#f1592a]/40 focus-visible:ring-offset-0"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-[#f1762a] to-[#f1592a] font-semibold text-white shadow-[0_18px_28px_-12px_rgba(241,89,42,0.6)] transition-all hover:-translate-y-0.5" size="lg" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            ) : (
              // Signup Form
              <form onSubmit={handleSignupSubmit} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-white/80">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="signup-name"
                        type="text"
                        autoComplete="name"
                        placeholder="John Doe"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        className="border-white/20 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#f1592a]/60 focus-visible:ring-[#f1592a]/40 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-white/80">Email Address</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" aria-hidden="true" />
                      <Input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="pl-10 border-white/20 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#f1592a]/60 focus-visible:ring-[#f1592a]/40 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-white/80">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" aria-hidden="true" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="pl-10 pr-10 border-white/20 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#f1592a]/60 focus-visible:ring-[#f1592a]/40 focus-visible:ring-offset-0"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </div>
                    <p className="text-xs text-white/45">Must be at least 8 characters with uppercase, lowercase, and number</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-confirm" className="text-white/80">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" aria-hidden="true" />
                      <Input
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10 border-white/20 bg-white/[0.08] text-white placeholder:text-white/30 focus-visible:border-[#f1592a]/60 focus-visible:ring-[#f1592a]/40 focus-visible:ring-offset-0"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </div>
                  </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-[#f1762a] to-[#f1592a] font-semibold text-white shadow-[0_18px_28px_-12px_rgba(241,89,42,0.6)] transition-all hover:-translate-y-0.5" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 text-center">
                  <item.icon className="h-4 w-4 text-[#ff8a5c]" aria-hidden="true" />
                  <span className="text-[10.5px] font-medium leading-tight text-white/55">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-5 px-4 text-center text-xs text-white/40">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowResetDialog(false)}
                className="flex-1"
                disabled={isResetting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isResetting}>
                {isResetting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Set New Password Dialog — shown when arriving via a recovery link */}
      <Dialog open={isRecoveryMode} onOpenChange={(open) => !open && setIsRecoveryMode(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set a New Password</DialogTitle>
            <DialogDescription>
              You followed a password reset link. Choose a new password for your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPasswordData.password}
                  onChange={(e) => setNewPasswordData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPasswordData.confirmPassword}
                  onChange={(e) => setNewPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;