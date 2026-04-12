import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Mail, Phone, MapPin, Clock, MessageSquare, Headphones, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, LocalBusinessStructuredData } from '@/components/StructuredData';
import { trackFormSubmission, trackContactClick } from '@/components/GoogleAnalytics';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

// Contact page FAQs for rich snippets
const contactFAQs = [
  {
    question: "What are Global Chemicals LLC's business hours?",
    answer: "Our office is open Sunday through Thursday from 8:00 AM to 6:00 PM (Gulf Standard Time). We are closed on Friday and Saturday. For urgent inquiries, you can reach us via WhatsApp at +968-93754388."
  },
  {
    question: "How quickly do you respond to inquiries?",
    answer: "We typically respond to all inquiries within 24 hours during business days. For urgent requests, we recommend calling our sales team directly at +968-93754388 or using our WhatsApp chat for immediate assistance."
  },
  {
    question: "Where is Global Chemicals LLC located?",
    answer: "Our office is located at Office-3, Building Number 1737, Near Oman LNG, Ghala, Muscat, Sultanate of Oman. Our warehouse is strategically located to serve all major cities in Oman."
  },
  {
    question: "How can I request a product quotation?",
    answer: "You can request a quotation by filling out our contact form, calling +968-93754388, emailing sales@gcoman.com, or messaging us on WhatsApp. Please include product names, quantities, and delivery location for accurate pricing."
  },
  {
    question: "Do you offer technical consultation?",
    answer: "Yes, our technical team provides free consultation for product selection, application recommendations, and chemical compatibility. Contact our technical support at support@gcoman.com or call us to schedule a consultation."
  }
];

// Breadcrumb items
const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Contact', url: 'https://gcoman.com/contact' }
];

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone number must be less than 20 characters").optional(),
  company: z.string().trim().max(100, "Company name must be less than 100 characters").optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message must be less than 5000 characters"),
});

const Contact = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Client-side validation for better UX
      contactSchema.parse(formData);

      // Call the Edge Function - use hardcoded URL as fallback (publishable URL is safe)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yawbaqdywfrmuajaiptw.supabase.co';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/submit-contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (result.code === 'RATE_LIMIT_EXCEEDED') {
          toast({
            title: "Too Many Requests",
            description: "You've submitted too many forms recently. Please try again in an hour.",
            variant: "destructive",
          });
        } else if (result.code === 'VALIDATION_ERROR') {
          toast({
            title: "Validation Error",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Submission Failed",
            description: result.error || "Please try again later.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
        return;
      }

      // Track successful form submission
      trackFormSubmission('contact');

      // Success
      toast({
        title: "Message sent successfully!",
        description: result.message || "Our team will get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);

    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        console.error('Contact form error:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please check your connection and try again.",
          variant: "destructive"
        });
      }
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  const handleSubjectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subject: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Us | Get Quote | Global Chemicals LLC Oman & GCC"
        description="Contact Global Chemicals LLC — Oman's leading chemical exporter to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Call +968-93754388 or email info@gcoman.com. 24-hour response."
        keywords="contact global chemicals, chemical supplier GCC, request quote chemicals Middle East, chemical inquiry Oman UAE, chemical distributor contact GCC, chemical exporter Oman contact, chemical supplier Dubai, chemical company Saudi Arabia, chemical quote Qatar Kuwait"
        ogTitle="Contact Global Chemicals LLC | Request Quote | Oman & GCC Export"
        ogDescription="Get in touch with a leading GCC chemical exporter based in Muscat, Oman. Phone, email, or WhatsApp. 24-hour response for UAE, Saudi Arabia, Qatar, Kuwait & Bahrain orders."
        ogUrl="https://gcoman.com/contact"
        canonical="https://gcoman.com/contact"
      />
      <LocalBusinessStructuredData />
      <FAQStructuredData faqs={contactFAQs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              {t('contact.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('contact.getInTouch')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  icon: Phone,
                  title: t('contact.callUs'),
                  content: '+968 93754388',
                  description: t('contact.info.hours'),
                  link: 'tel:+96893754388',
                },
                {
                  icon: Mail,
                  title: t('contact.emailUs'),
                  content: 'info@gcoman.com',
                  description: t('contact.responseTime'),
                  link: 'mailto:info@gcoman.com',
                },
                {
                  icon: MessageSquare,
                  title: t('contact.liveChat'),
                  content: t('contact.whatsappSupport'),
                  description: t('contact.instantAssistance'),
                  link: 'https://wa.me/96893754388',
                },
                {
                  icon: MapPin,
                  title: t('contact.visitUs'),
                  content: 'Office-3, Building Number 1737',
                  description: t('contact.info.address'),
                  link: null,
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="bg-card p-6 rounded-xl hover:shadow-lg transition-all group logo-gradient-border relative"
                  >
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    {item.link ? (
                      <a href={item.link} className="text-primary hover:text-primary/80 font-medium block mb-1 transition-colors">
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium mb-1">{item.content}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Contact Form and Info Grid */}
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-card p-8 rounded-xl logo-gradient-border logo-gradient-top relative">
                  <h2 className="text-2xl font-bold text-foreground mb-6">{t('contact.form.submit')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact.form.name')} *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.form.email')} *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('contact.form.phone')}</Label>
                        <PhoneInput
                          defaultCountry="om"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          placeholder="XXXX XXXX"
                          className="w-full"
                          inputClassName="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">{t('contact.form.company')}</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('contact.form.subject')} *</Label>
                      <Select name="subject" value={formData.subject} onValueChange={handleSubjectChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder={t('contact.form.selectSubject')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product-inquiry">{t('contact.form.subjects.productInquiry')}</SelectItem>
                          <SelectItem value="technical-support">{t('contact.form.subjects.technicalSupport')}</SelectItem>
                          <SelectItem value="quotation">{t('contact.form.subjects.quotation')}</SelectItem>
                          <SelectItem value="partnership">{t('contact.form.subjects.partnership')}</SelectItem>
                          <SelectItem value="complaint">{t('contact.form.subjects.complaint')}</SelectItem>
                          <SelectItem value="other">{t('contact.form.subjects.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.form.message')} *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.form.messagePlaceholder')}
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full md:w-auto px-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>{t('common.loading')}</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                          {t('contact.form.submit')}
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Support Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Business Hours */}
                <div className="bg-card p-6 rounded-xl logo-gradient-border relative">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">{t('contact.businessHours')}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">{t('contact.sundayThursday')}:</span>
                          <span className="font-medium ltr-preserve">8:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">{t('contact.fridaySaturday')}:</span>
                          <span className="font-medium">{t('contact.closed')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Support */}
                <div className="bg-card p-6 rounded-xl logo-gradient-border relative">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('contact.technicalSupport')}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t('contact.technicalSupportDesc')}
                      </p>
                      <a href="mailto:support@gcoman.com" className="text-sm text-primary hover:text-primary/80 font-medium ltr-preserve">
                        support@gcoman.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Sales Inquiry */}
                <div className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{t('contact.salesInquiry')}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t('contact.salesInquiryDesc')}
                      </p>
                      <a href="mailto:sales@gcoman.com" className="text-sm text-primary hover:text-primary/80 font-medium ltr-preserve">
                        sales@gcoman.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-card rounded-xl border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">We Respond Within 24 Hours</h3>
              <p className="text-sm text-muted-foreground">Fast, reliable communication for all inquiries</p>
            </div>
            <div className="p-6 bg-card rounded-xl border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">ISO</span>
              </div>
              <h3 className="font-semibold mb-1">ISO 9001:2015 Certified</h3>
              <p className="text-sm text-muted-foreground">Quality management you can trust</p>
            </div>
            <div className="p-6 bg-card rounded-xl border">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-xs">10+</span>
              </div>
              <h3 className="font-semibold mb-1">10+ Years in Business</h3>
              <p className="text-sm text-muted-foreground">Trusted by 200+ clients across Oman</p>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Our Location</h2>
            <div className="rounded-xl overflow-hidden border shadow-lg" style={{ height: '400px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.5!2d58.4!3d23.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa53a86e4e9b6c162%3A0xa53a86e4e9b6c162!2sGlobal%20Chemicals%20LLC!5e0!3m2!1sen!2som!4v1709000000000!5m2!1sen!2som"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Global Chemicals LLC Office Location - Ghala, Muscat, Oman"
              />
              <div className="mt-4 text-center">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Global+Chemicals+LLC+Ghala+Muscat+Oman"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('contact.needAssistance')}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('contact.needAssistanceDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild onClick={() => trackContactClick('phone')}>
                <a href="tel:+96893754388">
                  <Phone className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  {t('contact.callNow')}
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild onClick={() => trackContactClick('whatsapp')}>
                <a href="https://wa.me/96893754388" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  {t('contact.whatsappChat')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
