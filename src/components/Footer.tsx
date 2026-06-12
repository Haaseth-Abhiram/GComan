// Locale-aware Link: keeps /ar visitors on the Arabic tree for every footer link.
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send, Loader2, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackContactClick } from '@/components/GoogleAnalytics';
import logo from '@/assets/global-chemicals-logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ThreadsIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.29 3.276-.865 1.076-2.034 1.708-3.476 1.88-1.077.129-2.14.017-3.073-.327-1.07-.396-1.894-1.062-2.381-1.927-.467-.83-.652-1.848-.536-2.946.2-1.893 1.29-3.396 2.993-4.127.94-.403 2.108-.588 3.476-.548 1.054.03 1.997.164 2.821.4.01-.483-.003-.96-.04-1.425-.132-1.628-.603-2.746-1.4-3.322-.868-.628-2.015-.793-3.407-.66l-.238-.935c1.592-.152 2.96.044 4.07.843 1.03.742 1.63 2.073 1.783 3.958.04.493.056 1.01.047 1.549.538.273 1.018.604 1.436.995 1.07 1.001 1.725 2.396 1.89 4.03.1.99-.02 3.14-1.76 4.9-1.695 1.712-3.81 2.42-6.845 2.443zM11.4 12.39c-1.274-.043-2.282.09-3.09.413-1.262.541-2.086 1.674-2.239 3.078-.09.85.037 1.625.378 2.232.357.632 1.01 1.138 1.883 1.462.754.28 1.637.374 2.553.262 1.127-.135 2.042-.624 2.723-1.471.563-.7.936-1.63 1.113-2.77-.468-.234-.988-.427-1.562-.578-.79-.208-1.658-.337-2.596-.368l-.105.002-.059-.001.001-.261z"/>
    </svg>
  );

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/people/Global-Chemicals-LLC/61552652407210/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/LlcChemica92705', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/global-chemicalls-llc/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/globalchemicalsllc/?next=%2F', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@GlobalChemicalsLLC', label: 'YouTube' },
    { icon: ThreadsIcon, href: 'https://www.threads.com/@globalchemicalsllc', label: 'Threads' },
  ];

  const quickLinks = [
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.products', path: '/products' },
    { labelKey: 'nav.industries', path: '/industries' },
    { labelKey: 'nav.resources', path: '/resources' },
    { labelKey: 'nav.contact', path: '/contact' },
    { labelKey: 'nav.careers', path: '/career' },
    { label: 'Chemical Suppliers Oman', path: '/chemical-suppliers-oman' },
    { label: 'Chemical Suppliers Middle East', path: '/chemical-suppliers-middle-east' },
  ];

  const services = [
    { labelKey: 'footer.services.waterTreatment', path: '/industries#water-treatment' },
    { labelKey: 'footer.services.oilGasChemicals', path: '/industries#oil-gas' },
    { labelKey: 'footer.services.lubricants', path: '/products/lubricants' },
    { labelKey: 'footer.services.laboratoryChemicals', path: '/industries#laboratory' },
    { labelKey: 'footer.services.poolChemicals', path: '/industries#swimming-pool' },
    { labelKey: 'footer.services.constructionChemicals', path: '/industries#construction' },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: t('footer.newsletterError', 'Error'),
        description: t('footer.newsletterEmailRequired', 'Please enter your email address'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email: email.trim() },
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: t('footer.newsletterSuccess', 'Success!'),
          description: data.message || t('footer.newsletterSuccessMessage', 'Thank you for subscribing!'),
        });
        setEmail('');
      } else {
        throw new Error(data?.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: t('footer.newsletterError', 'Error'),
        description: error instanceof Error ? error.message : t('footer.newsletterErrorMessage', 'Failed to subscribe. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#3a4453] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Company Info */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <Link
              to="/"
              aria-label="Global Chemicals LLC – Home"
              className="inline-block bg-white rounded-lg p-4 hover:shadow-lg transition-all"
            >
              <img
                src={logo}
                alt="Global Chemicals LLC Logo"
                width={180}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Social Media Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">{t('footer.followUs')}</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all hover:scale-110 group"
                    >
                      <Icon className="w-5 h-5 text-white group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-white/80 hover:text-primary transition-colors text-sm inline-block hover:translate-x-1 rtl:hover:-translate-x-1 transition-all"
                  >
                    {'labelKey' in item ? t(item.labelKey) : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations - We Deliver To */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.weDeliverTo')}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Oman</p>
                <ul className="space-y-2">
                  {[
                    { labelKey: 'locations.muscat', path: '/chemicals/muscat' },
                    { labelKey: 'locations.sohar', path: '/chemicals/sohar' },
                    { labelKey: 'locations.salalah', path: '/chemicals/salalah' },
                    { labelKey: 'locations.duqm', path: '/chemicals/duqm' },
                    { labelKey: 'locations.rusayl', path: '/chemicals/rusayl' },
                  ].map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} className="text-white/80 hover:text-primary transition-colors text-sm inline-block hover:translate-x-1 rtl:hover:-translate-x-1 transition-all">
                        {t(item.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">GCC Export</p>
                <ul className="space-y-2">
                  {[
                    { label: 'Dubai', path: '/chemicals/dubai' },
                    { label: 'Abu Dhabi', path: '/chemicals/abu-dhabi' },
                    { label: 'Riyadh', path: '/chemicals/riyadh' },
                    { label: 'Doha', path: '/chemicals/doha' },
                    { label: 'Kuwait City', path: '/chemicals/kuwait-city' },
                    { label: 'Bahrain', path: '/chemicals/bahrain' },
                  ].map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} className="text-white/80 hover:text-primary transition-colors text-sm inline-block hover:translate-x-1 rtl:hover:-translate-x-1 transition-all">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.ourServices')}</h3>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-white/80 hover:text-primary transition-colors text-sm inline-block hover:translate-x-1 rtl:hover:-translate-x-1 transition-all">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('nav.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 rtl:flex-row-reverse">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-relaxed">
                  {t('contact.info.address')}
                </span>
              </li>
              <li className="flex items-center gap-3 rtl:flex-row-reverse">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+96893754388" onClick={() => trackContactClick('phone')} className="text-white/80 hover:text-primary transition-colors text-sm ltr-preserve">
                  +968 93754388
                </a>
              </li>
              <li className="flex items-center gap-3 rtl:flex-row-reverse">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@gcoman.com"
                  onClick={() => trackContactClick('email')}
                  className="text-white/80 hover:text-primary transition-colors text-sm"
                >
                  info@gcoman.com
                </a>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/96893754388"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick('whatsapp')}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('footer.whatsappCta')}
            </a>

            {/* Google Reviews CTA */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Global+Chemicals+LLC+Ghala+Muscat+Oman"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/20"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Leave us a Google Review
            </a>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-white/10">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-3">{t('footer.newsletter')}</h3>
            <p className="text-white/70 text-sm mb-6">
              {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                disabled={isSubmitting}
                required
              />
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white flex-shrink-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin ltr:mr-2 rtl:ml-2" />
                ) : (
                  <Send className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                )}
                {t('footer.subscribe')}
              </Button>
            </form>
          </div>
        </div>

        {/* Certifications & Trust Badges */}
        <div className="mb-8 pb-8 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-xs">JSRS</span>
              </div>
              <div className="text-start">
                <p className="text-white text-sm font-semibold">{t('certifications.jsrs')}</p>
                <p className="text-white/60 text-xs">{t('certifications.jsrsDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-xs">ICV</span>
              </div>
              <div className="text-start">
                <p className="text-white text-sm font-semibold">{t('certifications.icv')}</p>
                <p className="text-white/60 text-xs">{t('certifications.icvDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-xs">ISO</span>
              </div>
              <div className="text-start">
                <p className="text-white text-sm font-semibold">{t('certifications.iso')}</p>
                <p className="text-white/60 text-xs">{t('certifications.isoDesc')}</p>
              </div>
            </div>
          </div>
          <p className="text-white/70 text-sm text-center">
            {t('footer.tagline')}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center gap-4 text-white/60 text-sm pb-20 md:pb-4 relative z-50">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link to="/terms" className="hover:text-primary transition-colors relative z-50">
              {t('footer.terms')}
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors relative z-50">
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/sitemap" className="hover:text-primary transition-colors relative z-50">
              {t('footer.sitemap')}
            </Link>
          </div>
          <p className="text-center">
            © {currentYear} {t('footer.companyName')}. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
