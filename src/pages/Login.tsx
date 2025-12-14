import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import logo from '@/assets/global-chemicals-logo.svg';
import { supabase } from '@/integrations/supabase/client';

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

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

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
        console.error('Supabase login error', error);

        const rawMessage = error.message || '';
        const lowerMessage = rawMessage.toLowerCase();
        const isNetworkError =
          lowerMessage.includes('load failed') ||
          lowerMessage.includes('failed to fetch') ||
          lowerMessage.includes('network error');

        if (rawMessage.includes('Invalid login credentials')) {
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
        toast({
          title: "Login successful!",
          description: "Welcome back to Global Chemicals LLC",
        });
        navigate('/');
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
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: signupData.name,
          }
        }
      });

      if (error) {
        console.error('Supabase signup error', error);

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
        navigate('/');
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-4">
      <Helmet>
        <title>Login | Global Chemicals LLC</title>
        <meta name="description" content="Login to Global Chemicals LLC customer portal. Access orders, invoices, technical docs & account info securely. Manage your chemical supply needs online." />
        <meta name="keywords" content="login, customer portal, Global Chemicals LLC, account access" />
        <meta property="og:title" content="Login | Global Chemicals LLC" />
        <meta property="og:description" content="Login to Global Chemicals LLC customer portal for secure account access." />
        <meta property="og:url" content="https://www.gcoman.com/login" />
        <meta property="og:image" content="https://www.gcoman.com/og-image.jpg" />
        <link rel="canonical" href="https://www.gcoman.com/login" />
      </Helmet>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 group mb-8">
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <div className="space-y-6">
            <img
              src={logo}
              alt="Global Chemicals LLC"
              width={200}
              height={64}
              className="h-16 w-auto"
            />
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Welcome to Global Chemicals LLC
              </h1>
              <p className="text-lg text-muted-foreground">
                Your trusted partner for premium chemical solutions across Oman
              </p>
            </div>
            
            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Secure Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data is protected with enterprise-grade security
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Customer Portal</h3>
                  <p className="text-sm text-muted-foreground">
                    Access orders, invoices, and technical documentation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-4">
              <div className="lg:hidden flex justify-center mb-4">
                <img
                  src={logo}
                  alt="Global Chemicals LLC"
                  width={150}
                  height={48}
                  className="h-12 w-auto"
                />
              </div>
              <CardTitle className="text-2xl text-center">
                {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Sign up to get started with Global Chemicals LLC'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLogin ? (
                // Login Form
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 text-xs"
                        onClick={() => setShowResetDialog(true)}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              ) : (
                // Signup Form
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              )}

              <Separator />

              <div className="text-center text-sm">
                {isLogin ? (
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="px-1"
                      onClick={() => setIsLogin(false)}
                    >
                      Sign up
                    </Button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="px-1"
                      onClick={() => setIsLogin(true)}
                    >
                      Sign in
                    </Button>
                  </p>
                )}
              </div>

              <div className="lg:hidden pt-4">
                <Link to="/" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6 px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
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
    </div>
  );
};

export default Login;