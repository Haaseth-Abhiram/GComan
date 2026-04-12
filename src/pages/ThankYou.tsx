import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Phone, Mail, ArrowRight, Package, FileText } from 'lucide-react';
import { trackSelectContent } from '@/components/GoogleAnalytics';

const ThankYou = () => {
  useEffect(() => {
    // Fire conversion event for Google Analytics goal tracking
    trackSelectContent('conversion', 'enquiry_submitted');
    // Google Ads conversion snippet placeholder — add gtag conversion event here
    // when Google Ads is configured
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Thank You — Enquiry Received | Global Chemicals LLC"
        description="Thank you for contacting Global Chemicals LLC. Your enquiry has been received and our team will respond within 24 hours."
        ogTitle="Thank You — Global Chemicals LLC"
        ogDescription="Your chemical enquiry has been received. Our team will respond within 24 hours."
        ogUrl="https://gcoman.com/thank-you"
        canonical="https://gcoman.com/thank-you"
        keywords=""
      />
      <Navigation />

      <main id="main-content" className="min-h-[80vh] flex items-center justify-center py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Thank You!
            </h1>

            <p className="text-xl text-muted-foreground mb-3 leading-relaxed">
              Your enquiry has been received by Global Chemicals LLC.
            </p>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Our team will review your requirements and respond within <strong>24 hours</strong> (same business day for urgent requests). If you need immediate assistance, please call or WhatsApp us directly.
            </p>

            {/* Contact options */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <a
                href="tel:+96893754388"
                className="flex items-center justify-center gap-3 p-5 rounded-xl border border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all"
                onClick={() => trackSelectContent('contact_click', 'phone_thankyou')}
              >
                <Phone className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-semibold text-foreground text-sm">Call Us</p>
                  <p className="text-muted-foreground text-sm">+968 93754388</p>
                </div>
              </a>
              <a
                href="https://wa.me/96893754388"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-5 rounded-xl border border-border bg-muted/30 hover:border-green-500/40 hover:bg-green-500/5 transition-all"
                onClick={() => trackSelectContent('contact_click', 'whatsapp_thankyou')}
              >
                <Mail className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <p className="font-semibold text-foreground text-sm">WhatsApp</p>
                  <p className="text-muted-foreground text-sm">Instant response</p>
                </div>
              </a>
            </div>

            {/* Next steps */}
            <div className="p-6 bg-primary/5 rounded-xl border border-primary/20 mb-8 text-left">
              <h2 className="font-semibold text-foreground mb-3">What happens next?</h2>
              <ul className="space-y-2">
                {[
                  'Our sales team reviews your product requirements',
                  'We prepare a competitive quotation with current pricing',
                  'We confirm product availability and delivery timeframe',
                  'You receive a detailed quote by email within 24 hours'
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful links */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline" className="gap-2" onClick={() => trackSelectContent('navigation', 'products_from_thankyou')}>
                <Link to="/products">
                  <Package className="w-4 h-4" /> Browse Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2" onClick={() => trackSelectContent('navigation', 'resources_from_thankyou')}>
                <Link to="/resources">
                  <FileText className="w-4 h-4" /> Download SDS / Brochures
                </Link>
              </Button>
              <Button asChild className="gap-2" onClick={() => trackSelectContent('navigation', 'home_from_thankyou')}>
                <Link to="/">
                  Home <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
