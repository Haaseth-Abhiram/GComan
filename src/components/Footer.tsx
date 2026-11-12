// Locale-aware Link: keeps /ar visitors on the Arabic tree for every footer link.
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send, Loader2, Star, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { trackContactClick } from '@/components/GoogleAnalytics';
import { openCookieSettings } from '@/lib/consent';
import { safeImport } from '@/lib/lazyRetry';
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
    { icon: Linkedin, href: 'https://www.linkedin.com/company/global-chemicals-llc/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/globalchemicalsllc/', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@GlobalChemicalsLLC', label: 'YouTube' },
    { icon: ThreadsIcon, href: 'https://www.threads.com/@globalchemicalsllc', label: 'Threads' },
  ];

  const companyLinks = [
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.products', path: '/products' },
    { labelKey: 'nav.industries', path: '/industries' },
    { labelKey: 'nav.certifications', path: '/certifications' },
    { labelKey: 'nav.resources', path: '/resources' },
    { label: 'Dosing Calculators', path: '/tools/dosing-calculator' },
    { labelKey: 'nav.careers', path: '/career' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];

  const services = [
    { labelKey: 'footer.services.waterTreatment', path: '/industries#water-treatment' },
    { labelKey: 'footer.services.oilGasChemicals', path: '/industries#oil-gas' },
    { labelKey: 'footer.services.lubricants', path: '/products/lubricants' },
    { labelKey: 'footer.services.laboratoryChemicals', path: '/industries#laboratory' },
    { labelKey: 'footer.services.poolChemicals', path: '/industries#swimming-pool' },
    { labelKey: 'footer.services.constructionChemicals', path: '/industries#construction' },
    { label: 'Chemical Suppliers Oman', path: '/chemical-suppliers-oman' },
    { label: 'Chemical Suppliers Middle East', path: '/chemical-suppliers-middle-east' },
  ];

  // Product+geo hubs (/chemical-supplier/*). Added 2026-10-19: for "nitric
  // acid supplier oman" Google ranked the HOMEPAGE at 18 and the nitric hub
  // nowhere, because the hubs were reachable only from location pages and each
  // other. The footer gives every hub a site-wide internal link with a
  // descriptive anchor (keep the "Supplier" wording: it is the anchor text
  // the hubs rank for). Keep in sync with PRODUCT_HUBS in LocationLanding.tsx.
  const supplyGuides = [
    { label: 'Nitric Acid Supplier Oman', path: '/chemical-supplier/nitric-acid-oman' },
    { label: 'Hydrochloric Acid Supplier Oman', path: '/chemical-supplier/hydrochloric-acid-oman' },
    { label: 'Caustic Soda Supplier Oman', path: '/chemical-supplier/caustic-soda-oman' },
    { label: 'Sodium Hypochlorite Supplier Oman', path: '/chemical-supplier/sodium-hypochlorite-oman' },
    { label: 'PAC Coagulant Supplier Oman', path: '/chemical-supplier/poly-aluminium-chloride-oman' },
    { label: 'Laboratory Chemicals Oman', path: '/chemical-supplier/laboratory-chemicals-oman' },
    { label: 'Fertilizer Supplier Oman', path: '/chemical-supplier/fertilizers-oman' },
    { label: 'Oilfield Chemicals Oman', path: '/chemical-supplier/oilfield-chemicals-oman' },
    { label: 'Water Treatment Chemicals GCC', path: '/chemical-supplier/water-treatment-chemicals-gcc' },
    { label: 'Pool Chlorine Supplier GCC', path: '/chemical-supplier/pool-chlorine-gcc' },
  ];

  // Every city page (/chemicals/<city>) keeps one site-wide link: the Oman
  // ones since 2026-10-20 (the homepage was outranking the city pages), the
  // GCC ones since the Aug 2026 audit (Sharjah/Fujairah/RAK were orphaned;
  // pinned by internal-linking.spec.ts). Until 2026-11-13 the Oman cities were
  // listed twice; grouped by country here so the column stays short.
  const deliveryGroups: { label: string; cities: { label: string; path: string }[] }[] = [
    {
      label: 'Oman',
      // "Chemical Supplier <City>" anchors (2026-10-20): the homepage was
      // outranking the city pages for exactly these queries.
      cities: ['muscat', 'sohar', 'salalah', 'duqm', 'rusayl', 'rustaq'].map((slug) => ({
        label: `${t('footer.chemicalSupplier', 'Chemical Supplier')} ${t(`locations.${slug}`)}`,
        path: `/chemicals/${slug}`,
      })),
    },
    {
      label: 'UAE',
      cities: [
        { label: 'Dubai', path: '/chemicals/dubai' },
        { label: 'Abu Dhabi', path: '/chemicals/abu-dhabi' },
        { label: 'Sharjah', path: '/chemicals/sharjah' },
        { label: 'Fujairah', path: '/chemicals/fujairah' },
        { label: 'Ras Al Khaimah', path: '/chemicals/ras-al-khaimah' },
      ],
    },
    {
      label: 'Saudi Arabia',
      cities: [
        { label: 'Riyadh', path: '/chemicals/riyadh' },
        { label: 'Jeddah', path: '/chemicals/jeddah' },
        { label: 'Dammam', path: '/chemicals/dammam' },
        { label: 'Jubail', path: '/chemicals/jubail' },
        { label: 'Yanbu', path: '/chemicals/yanbu' },
      ],
    },
    {
      label: 'Qatar · Kuwait · Bahrain',
      cities: [
        { label: 'Doha', path: '/chemicals/doha' },
        { label: 'Kuwait City', path: '/chemicals/kuwait-city' },
        { label: 'Bahrain', path: '/chemicals/bahrain' },
      ],
    },
  ];

  const linkClass = 'text-white/75 hover:text-primary transition-colors text-sm';
  const headingClass = 'text-sm font-semibold uppercase tracking-wider text-white mb-4';

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
      // Loaded on submit, not on mount: the Footer renders on every page but
      // only needs the SDK when someone actually subscribes.
      const { supabase } = await safeImport(() => import('@/integrations/supabase/client'));
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
    <footer className="relative bg-[hsl(var(--footer))] text-white pt-16 pb-8 overflow-hidden">
      {/* Gradient hairline ties the footer back to the navbar CTA */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[hsl(var(--logo-blue))] via-[hsl(var(--logo-orange))] to-[hsl(var(--logo-blue))]"
      />
      {/* Dot-grid texture, same treatment as StatsSection */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 10%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 10%, transparent 100%)',
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        {/* Conversion band: the footer previously offered no way to ask for a
            quote, despite being where a visitor lands after a long scroll. */}
        <div className="mb-12 pb-12 border-b border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-5 text-center md:text-left">
          <div>
            <p className="text-lg font-bold text-white">
              Need pricing on a specific chemical?
            </p>
            <p className="text-sm text-white/70 mt-1">
              Send us the product and quantity — our team replies within 24 hours.
            </p>
          </div>
          <Link
            to="/contact"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))] shadow-md hover:shadow-lg transition-all hover:scale-[1.03] motion-reduce:transform-none flex-shrink-0 self-center"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer motion-reduce:hidden"
            />
            Request a Quote
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
          </Link>
        </div>

        {/* Five even columns (2026-11-13: the Services column used to stack
            Services + Supply Guides + a duplicate city list, three times the
            height of its neighbours). Contact now sits under the brand. */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-[1.35fr_0.75fr_1fr_1.15fr_1.35fr] gap-x-8 gap-y-10 mb-12">
          {/* Company info + contact */}
          <div className="col-span-2 md:col-span-4 xl:col-span-1 space-y-5">
            <Link
              to="/"
              aria-label="Global Chemicals LLC – Home"
              className="inline-block bg-white rounded-lg p-3 hover:shadow-lg transition-all"
            >
              <img
                src={logo}
                alt="Global Chemicals LLC Logo"
                width={180}
                height={48}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-white/75 text-sm leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/75 text-sm leading-relaxed">
                  {t('contact.info.address')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+96892772305" onClick={() => trackContactClick('phone')} className={`${linkClass} ltr-preserve`}>
                  +968 9277 2305
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:info@gcoman.com" onClick={() => trackContactClick('email')} className={linkClass}>
                  info@gcoman.com
                </a>
              </li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://wa.me/96892772305"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('whatsapp')}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('footer.whatsappCta')}
              </a>
              <a
                href="https://g.page/r/CWLBtunkhjqlEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/20"
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                Google Review
              </a>
            </div>
            <div className="flex gap-2" aria-label={t('footer.followUs')}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Company */}
          <nav aria-label={t('footer.company')}>
            <h3 className={headingClass}>{t('footer.company')}</h3>
            <ul className="space-y-2">
              {companyLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={linkClass}>
                    {'labelKey' in item ? t(item.labelKey) : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label={t('footer.ourServices')}>
            <h3 className={headingClass}>{t('footer.ourServices')}</h3>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={linkClass}>
                    {'labelKey' in item ? t(item.labelKey) : item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Supply guides (product+geo hubs) */}
          <nav className="col-span-2 md:col-span-1" aria-label={t('footer.supplyGuides', 'Supply Guides')}>
            <h3 className={headingClass}>{t('footer.supplyGuides', 'Supply Guides')}</h3>
            <ul className="space-y-2">
              {supplyGuides.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Locations, grouped by country */}
          <nav className="col-span-2 md:col-span-1" aria-label={t('footer.weDeliverTo')}>
            <h3 className={headingClass}>
              <Link to="/chemicals" className="hover:text-primary transition-colors">{t('footer.weDeliverTo')}</Link>
            </h3>
            <div className="space-y-3">
              {deliveryGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{group.label}</p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {group.cities.map((item) => (
                      <li key={item.path}>
                        <Link to={item.path} className={linkClass}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Newsletter + certifications on one row */}
        <div className="mb-8 pb-8 border-y border-white/10 pt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="lg:max-w-md w-full">
            <h3 className="text-base font-semibold mb-1">{t('footer.newsletter')}</h3>
            <p className="text-white/70 text-sm mb-3">
              {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                {t('footer.newsletterPlaceholder')}
              </label>
              <Input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletterPlaceholder')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-primary"
                disabled={isSubmitting}
                required
              />
              <Button
                type="submit"
                className="flex-shrink-0 text-white bg-gradient-to-r from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))] hover:opacity-90 shadow-md"
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

          {/* Each badge links to /certifications. Without these the page has no
              inbound internal link at all — it is the strongest trust asset on
              the site (JSRS gates PDO tenders) and was orphaned. */}
          <div className="flex flex-wrap items-center gap-3">
            {[
              { abbr: 'JSRS', key: 'jsrs', tone: 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20', text: 'text-emerald-300' },
              { abbr: 'ICV', key: 'icv', tone: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20', text: 'text-blue-300' },
              { abbr: 'ISO', key: 'iso', tone: 'bg-white/10 border-white/20 hover:bg-white/20', text: 'text-white' },
            ].map((badge) => (
              <Link
                key={badge.key}
                to="/certifications"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${badge.tone}`}
              >
                <span className={`font-bold text-xs ${badge.text}`}>{badge.abbr}</span>
                <span className="text-start">
                  <span className="block text-white text-sm font-semibold">{t(`certifications.${badge.key}`)}</span>
                  <span className="block text-white/70 text-xs">{t(`certifications.${badge.key}Desc`)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-white/60 text-sm pb-20 md:pb-4 relative z-50 text-center md:text-start">
          <div>
            <p>© {currentYear} {t('footer.companyName')}. {t('footer.copyright')}</p>
            <p className="text-white/50 text-xs mt-1">{t('footer.tagline')}</p>
          </div>
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
            <button
              type="button"
              onClick={openCookieSettings}
              className="hover:text-primary transition-colors relative z-50"
            >
              {t('footer.cookieSettings', 'Cookie Settings')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
