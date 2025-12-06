import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/global-chemicals-logo-optimized.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/people/Global-Chemicals-LLC/61552652407210/', label: 'Facebook' },
    { icon: Twitter, href: 'https://x.com/LlcChemica92705', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/global-chemicals-llc/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/globalchemicalsllc/?next=%2F', label: 'Instagram' },
    { icon: Youtube, href: 'https://www.youtube.com/@GlobalChemicalsLLC', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#3a4453] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Company Info */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block bg-white rounded-lg p-4 hover:shadow-lg transition-all">
              <img
                src={logo}
                alt="Global Chemicals LLC Logo"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Leading provider of specialty chemicals, delivering high-quality products and innovative solutions across Oman.
            </p>

            {/* Social Media Links */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Follow Us</h4>
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
              {[
                { label: 'About', path: '/about' },
                { label: 'Products', path: '/products' },
                { label: 'Industries', path: '/industries' },
                { label: 'Resources', path: '/resources' },
                { label: 'Blog', path: '/blog' },
                { label: 'Contact', path: '/contact' },
                { label: 'Careers', path: '/career' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-white/80 hover:text-primary transition-colors text-sm inline-block hover:translate-x-1 transition-all"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations - We Deliver To */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.weDeliverTo')}</h3>
            <ul className="space-y-2">
              {[
                { label: t('locations.muscat'), path: '/chemicals/muscat' },
                { label: t('locations.sohar'), path: '/chemicals/sohar' },
                { label: t('locations.salalah'), path: '/chemicals/salalah' },
                { label: t('locations.duqm'), path: '/chemicals/duqm' },
                { label: t('locations.rusayl'), path: '/chemicals/rusayl' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-white/80 hover:text-primary transition-colors text-sm inline-block hover:translate-x-1 transition-all">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('footer.ourServices')}</h3>
            <ul className="space-y-2">
              {[
                { label: 'Water Treatment', path: '/industries#water-treatment' },
                { label: 'Oil & Gas Chemicals', path: '/industries#oil-gas' },
                { label: 'Lubricants & Greases', path: '/products?category=lubricants' },
                { label: 'Laboratory Chemicals', path: '/industries#laboratory' },
                { label: 'Swimming Pool Chemicals', path: '/industries#swimming-pool' },
                { label: 'Construction Chemicals', path: '/industries#construction' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-white/80 hover:text-primary transition-colors text-sm inline-block hover:translate-x-1 transition-all">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">{t('nav.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-relaxed">
                  Office-3, Building Number 1737, Near Oman LNG, Ghala, Muscat, Oman
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+96893754388" className="text-white/80 hover:text-primary transition-colors text-sm">
                  +968 93754388
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@gcoman.com"
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
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t('footer.whatsappCta')}
            </a>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-white/10">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-3">{t('footer.newsletter')}</h3>
            <p className="text-white/70 text-sm mb-6">
              Subscribe to our newsletter for the latest products, industry insights, and special offers
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t('footer.newsletterPlaceholder')}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white flex-shrink-0">
                <Send className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                {t('footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>

        {/* Certifications & Trust Badges */}
        <div className="mb-8 pb-8 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/30">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-xs">JSRS</span>
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">JSRS Certified</p>
                <p className="text-white/60 text-xs">Joint Supplier Registration System</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/30">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold text-xs">ICV</span>
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">ICV Compliant</p>
                <p className="text-white/60 text-xs">In-Country Value Program</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-xs">ISO</span>
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">ISO 9001:2015</p>
                <p className="text-white/60 text-xs">Quality Management</p>
              </div>
            </div>
          </div>
          <p className="text-white/70 text-sm text-center">
            Leading Chemical Supplier serving Muscat, Sohar, Duqm, Salalah, and the Rusayl Industrial Area.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
          <p>
            © {currentYear} {t('footer.companyName')}. {t('footer.copyright')}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/terms" className="hover:text-primary transition-colors">
              {t('footer.terms')}
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/sitemap" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
