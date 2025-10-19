import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground/95 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <div className="text-primary font-bold text-base leading-tight">GLOBAL</div>
                <div className="text-secondary font-bold text-xs leading-tight">CHEMICALS LLC</div>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Leading provider of specialty chemicals, delivering high-quality products and innovative solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Products', 'Industries', 'Resources', 'Blog/News', 'Supports'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace('/', '-')}`}
                    className="text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {item}
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
                'Water Treatment',
                'Lab Equipment',
                'Lab Chemicals',
                'Lubricants & Greases',
                'Specialty Chemicals',
                'Food & Beverages',
              ].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-white/70 hover:text-primary transition-colors text-sm">
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
                <span className="text-white/70 text-sm">
                  123 Chemical Street, Industrial Zone, City, Country
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+1234567890" className="text-white/70 hover:text-primary transition-colors text-sm">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@gcoman.com"
                  className="text-white/70 hover:text-primary transition-colors text-sm"
                >
                  info@gcoman.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} Global Chemicals LLC. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/terms" className="text-white/60 hover:text-primary transition-colors text-sm">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-white/60 hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
