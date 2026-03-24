import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send, Loader2, ArrowRight } from 'lucide-react';
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

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/people/Global-Chemicals-LLC/61552652407210/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/LlcChemica92705', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/global-chemicals-llc/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/globalchemicalsllc/?next=%2F', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@GlobalChemicalsLLC', label: 'YouTube' },
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
    { labelKey: 'footer.services.lubricants', path: '/products?category=lubricants' },
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

      if (error) throw error;

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
    <footer className="relative overflow-hidden">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-[hsl(var(--logo-blue))] via-[hsl(var(--logo-orange))] to-[hsl(var(--logo-blue))]" />

      {/* Newsletter Section - Elevated above main footer */}
      <div className="bg-gradient-to-br from-[hsl(var(--logo-blue))] to-[hsl(220,65%,25%)] py-12 relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--logo-orange)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--logo-blue)) 0%, transparent 50%)' }} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{t('footer.newsletter')}</h3>
            <p className="text-white/70 text-sm mb-6">
              {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder')}
                className="bg-white/15 border-white/25 text-white placeholder:text-white/50 focus:border-[hsl(var(--logo-orange))] focus:ring-[hsl(var(--logo-orange))]/30 h-12 rounded-xl"
                disabled={isSubmitting}
                required
              />
              <Button 
                type="submit"
                className="bg-[hsl(var(--logo-orange))] hover:bg-[hsl(var(--logo-orange))]/90 text-white flex-shrink-0 h-12 px-6 rounded-xl font-semibold shadow-lg shadow-[hsl(var(--logo-orange))]/30"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                )}
                {t('footer.subscribe')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#1e2530] text-white pt-14 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10 lg:gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-5 md:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-block bg-white rounded-xl p-4 hover:shadow-lg hover:shadow-[hsl(var(--logo-orange))]/20 transition-all duration-300 group">
                <img
                  src={logo}
                  alt="Global Chemicals LLC Logo"
                  width={180}
                  height={48}
                  className="h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <p className="text-white/60 text-sm leading-relaxed">
                {t('footer.description')}
              </p>

              {/* Social Media Links */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest">{t('footer.followUs')}</h4>
                <div className="flex gap-2.5">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-[hsl(var(--logo-orange))]/50 hover:bg-gradient-to-br hover:from-[hsl(var(--logo-blue))]/20 hover:to-[hsl(var(--logo-orange))]/20 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                      >
                        <Icon className="w-4.5 h-4.5 text-white/60 group-hover:text-[hsl(var(--logo-orange))] transition-colors duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold mb-5 text-white uppercase tracking-wider relative inline-block">
                {t('footer.quickLinks')}
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--logo-orange))] to-transparent rounded-full" />
              </h3>
              <ul className="space-y-2.5 mt-4">
                {quickLinks.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-white/55 hover:text-[hsl(var(--logo-orange))] transition-all duration-300 text-sm flex items-center gap-1.5 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 rtl:rotate-180" />
                      <span>{'labelKey' in item ? t(item.labelKey) : item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div>
              <h3 className="text-sm font-bold mb-5 text-white uppercase tracking-wider relative inline-block">
                {t('footer.weDeliverTo')}
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--logo-orange))] to-transparent rounded-full" />
              </h3>
              <div className="mt-4">
                <p className="text-[hsl(var(--logo-orange))]/70 text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">Oman</p>
                <ul className="space-y-2 mb-5">
                  {[
                    { labelKey: 'locations.muscat', path: '/chemicals/muscat' },
                    { labelKey: 'locations.sohar', path: '/chemicals/sohar' },
                    { labelKey: 'locations.salalah', path: '/chemicals/salalah' },
                    { labelKey: 'locations.duqm', path: '/chemicals/duqm' },
                    { labelKey: 'locations.rusayl', path: '/chemicals/rusayl' },
                  ].map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} className="text-white/55 hover:text-[hsl(var(--logo-orange))] transition-all duration-300 text-sm flex items-center gap-1.5 group">
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 rtl:rotate-180" />
                        <span>{t(item.labelKey)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-[hsl(var(--logo-blue))]/70 text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: 'hsl(224 65% 66%)' }}>GCC Export</p>
                <ul className="space-y-2">
                  {[
                    { label: 'Dubai, UAE', path: '/chemicals/dubai' },
                    { label: 'Abu Dhabi, UAE', path: '/chemicals/abu-dhabi' },
                    { label: 'Riyadh, Saudi Arabia', path: '/chemicals/riyadh' },
                    { label: 'Doha, Qatar', path: '/chemicals/doha' },
                    { label: 'Kuwait City', path: '/chemicals/kuwait-city' },
                    { label: 'Bahrain', path: '/chemicals/bahrain' },
                  ].map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} className="text-white/55 hover:text-[hsl(var(--logo-orange))] transition-all duration-300 text-sm flex items-center gap-1.5 group">
                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 rtl:rotate-180" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-bold mb-5 text-white uppercase tracking-wider relative inline-block">
                {t('footer.ourServices')}
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--logo-orange))] to-transparent rounded-full" />
              </h3>
              <ul className="space-y-2.5 mt-4">
                {services.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-white/55 hover:text-[hsl(var(--logo-orange))] transition-all duration-300 text-sm flex items-center gap-1.5 group">
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 rtl:rotate-180" />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-bold mb-5 text-white uppercase tracking-wider relative inline-block">
                {t('nav.contact')}
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-[hsl(var(--logo-orange))] to-transparent rounded-full" />
              </h3>
              <ul className="space-y-4 mt-4">
                <li className="flex items-start gap-3 rtl:flex-row-reverse group">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--logo-orange))]/10 border border-[hsl(var(--logo-orange))]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[hsl(var(--logo-orange))]/20 transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-[hsl(var(--logo-orange))]" />
                  </div>
                  <span className="text-white/55 text-sm leading-relaxed">
                    {t('contact.info.address')}
                  </span>
                </li>
                <li className="flex items-center gap-3 rtl:flex-row-reverse group">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--logo-orange))]/10 border border-[hsl(var(--logo-orange))]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(var(--logo-orange))]/20 transition-colors duration-300">
                    <Phone className="w-4 h-4 text-[hsl(var(--logo-orange))]" />
                  </div>
                  <a href="tel:+96893754388" onClick={() => trackContactClick('phone')} className="text-white/55 hover:text-[hsl(var(--logo-orange))] transition-colors duration-300 text-sm ltr-preserve">
                    +968 93754388
                  </a>
                </li>
                <li className="flex items-center gap-3 rtl:flex-row-reverse group">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--logo-orange))]/10 border border-[hsl(var(--logo-orange))]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[hsl(var(--logo-orange))]/20 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-[hsl(var(--logo-orange))]" />
                  </div>
                  <a
                    href="mailto:info@gcoman.com"
                    onClick={() => trackContactClick('email')}
                    className="text-white/55 hover:text-[hsl(var(--logo-orange))] transition-colors duration-300 text-sm"
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
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-500/40 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('footer.whatsappCta')}
              </a>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-8 pt-8 border-t border-white/[0.06]">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-5">
              <div className="flex items-center gap-3 bg-white/[0.03] px-5 py-3 rounded-xl border border-white/[0.08] hover:border-[hsl(var(--logo-orange))]/30 transition-all duration-300 logo-gradient-border relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-xs">JSRS</span>
                </div>
                <div className="text-start">
                  <p className="text-white text-sm font-semibold">{t('certifications.jsrs')}</p>
                  <p className="text-white/40 text-xs">{t('certifications.jsrsDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] px-5 py-3 rounded-xl border border-white/[0.08] hover:border-[hsl(var(--logo-blue))]/30 transition-all duration-300 logo-gradient-border relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-xs">ICV</span>
                </div>
                <div className="text-start">
                  <p className="text-white text-sm font-semibold">{t('certifications.icv')}</p>
                  <p className="text-white/40 text-xs">{t('certifications.icvDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/[0.03] px-5 py-3 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 logo-gradient-border relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">ISO</span>
                </div>
                <div className="text-start">
                  <p className="text-white text-sm font-semibold">{t('certifications.iso')}</p>
                  <p className="text-white/40 text-xs">{t('certifications.isoDesc')}</p>
                </div>
              </div>
            </div>
            <p className="text-white/40 text-sm text-center">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/[0.06]">
            <div className="flex flex-col items-center gap-4 text-white/40 text-sm pb-20 md:pb-4 relative z-50">
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link to="/terms" className="hover:text-[hsl(var(--logo-orange))] transition-colors duration-300 relative z-50">
                  {t('footer.terms')}
                </Link>
                <Link to="/privacy" className="hover:text-[hsl(var(--logo-orange))] transition-colors duration-300 relative z-50">
                  {t('footer.privacyPolicy')}
                </Link>
                <Link to="/sitemap" className="hover:text-[hsl(var(--logo-orange))] transition-colors duration-300 relative z-50">
                  {t('footer.sitemap')}
                </Link>
              </div>
              <p className="text-center text-white/30">
                © {currentYear} {t('footer.companyName')}. {t('footer.copyright')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
