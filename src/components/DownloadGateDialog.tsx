import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Download, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface DownloadGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceTitle: string;
  downloadUrl: string;
  onDownloadSuccess: () => void;
}

const downloadLeadSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  phone: z.string().trim().min(8, { message: "Please enter a valid phone number" }).max(20, { message: "Phone number must be less than 20 characters" }),
  company: z.string().trim().min(2, { message: "Company name must be at least 2 characters" }).max(150, { message: "Company name must be less than 150 characters" }),
  country: z.string().trim().min(2, { message: "Please select your country" }).max(100),
  industry: z.string().optional(),
  marketingConsent: z.boolean(),
});

export const DownloadGateDialog = ({ 
  open, 
  onOpenChange, 
  resourceTitle, 
  downloadUrl,
  onDownloadSuccess 
}: DownloadGateDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    industry: '',
    marketingConsent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDirectDownload = () => {
    // Trigger download for authenticated users
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = resourceTitle.replace(/\s+/g, '-') + '.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: `${resourceTitle} is being downloaded.`,
    });

    onDownloadSuccess();
    onOpenChange(false);
  };

  // If user is authenticated, show simple download confirmation
  if (user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Download Resource
            </DialogTitle>
            <DialogDescription>
              You're about to download <strong>{resourceTitle}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDirectDownload}
              className="flex-1 gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    try {
      downloadLeadSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Submit lead through secured edge function (handles validation, rate limiting, and DB insert)
      const { data, error } = await supabase.functions.invoke("notify-download", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          country: formData.country,
          industry: formData.industry,
          resourceTitle: resourceTitle,
          marketingConsent: formData.marketingConsent,
        },
      });

      if (error) throw error;
      
      // Check for error response from the function
      if (data?.error) {
        throw new Error(data.error);
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resourceTitle.replace(/\s+/g, '-') + '.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `${resourceTitle} is being downloaded. Thank you for your interest!`,
      });

      // Reset form and close dialog
      setFormData({ name: '', email: '', phone: '', company: '', country: '', industry: '', marketingConsent: false });
      onDownloadSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting download lead:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // For non-authenticated users, show the full form
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Download className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Download Resource
          </DialogTitle>
          <DialogDescription className="text-sm">
            Please provide your details to download <strong>{resourceTitle}</strong>. 
            We respect your privacy and will only use this information to assist you with product inquiries.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-destructive' : ''}
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+968 12345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? 'border-destructive' : ''}
                required
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                type="text"
                placeholder="Company LLC"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className={errors.company ? 'border-destructive' : ''}
                required
              />
              {errors.company && (
                <p className="text-sm text-destructive">{errors.company}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
                required
              >
                <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oman">Oman</SelectItem>
                  <SelectItem value="UAE">United Arab Emirates</SelectItem>
                  <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                  <SelectItem value="Qatar">Qatar</SelectItem>
                  <SelectItem value="Kuwait">Kuwait</SelectItem>
                  <SelectItem value="Bahrain">Bahrain</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry (Optional)</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                  <SelectItem value="Water Treatment">Water Treatment</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                  <SelectItem value="Pharmaceutical">Pharmaceutical</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Swimming Pool">Swimming Pool</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-start space-x-3 bg-muted/50 p-3 rounded-md">
            <Checkbox
              id="consent"
              checked={formData.marketingConsent}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, marketingConsent: checked as boolean })
              }
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Keep me updated
              </label>
              <p className="text-xs text-muted-foreground">
                I agree to receive product updates and industry insights from Global Chemicals LLC. 
                You can unsubscribe at any time. View our{' '}
                <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};