import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/global-chemicals-logo-optimized.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
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
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'About', path: '/about' },
                { label: 'Products', path: '/products' },
                { label: 'Industries', path: '/industries' },
                { label: 'Resources', path: '/resources' },
                { label: 'Blog', path: '/blog' },
                { label: 'Contact', path: '/contact' },
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

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2">
              {[
                'Water Treatment Chemicals',
                'Oil & Gas Chemicals',
                'Lubricants & Greases',
                'Construction Chemicals',
                'Specialty Chemicals',
              ].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-white/80 hover:text-primary transition-colors text-sm inline-block hover:translate-x-1 transition-all">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm leading-relaxed">
                  Office-3, Building Number 1737, Near Oman LNG, Ghala, Muscat, Sultanate of Oman
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
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-white/10">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
            <p className="text-white/70 text-sm mb-6">
              Subscribe to our newsletter for the latest products, industry insights, and special offers
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white flex-shrink-0">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
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
            © {currentYear} Global Chemicals LLC. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
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
