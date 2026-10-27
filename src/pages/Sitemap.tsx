import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Map, ChevronRight } from 'lucide-react';

const Sitemap = () => {
  const siteStructure = [
    {
      title: 'Main Pages',
      links: [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about' },
        { label: 'Products', path: '/products' },
        { label: 'Industries We Serve', path: '/industries' },
        { label: 'Resources', path: '/resources' },
        { label: 'Blog', path: '/blog' },
        { label: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Our Customers', path: '/customers' },
        { label: 'Career Opportunities', path: '/career' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Login', path: '/login' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms & Conditions', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
      ],
    },
    {
      title: 'SEO Landing Pages',
      links: [
        { label: 'Chemical Suppliers Oman', path: '/chemical-suppliers-oman' },
        { label: 'Caustic Soda Supplier Oman', path: '/chemical-supplier/caustic-soda-oman' },
        { label: 'Nitric Acid Supplier Oman', path: '/chemical-supplier/nitric-acid-oman' },
        { label: 'Nitric Acid Supplier UAE', path: '/chemical-supplier/nitric-acid-uae' },
        { label: 'Nitric Acid Supplier Saudi Arabia', path: '/chemical-supplier/nitric-acid-saudi-arabia' },
        { label: 'Nitric Acid Supplier Qatar', path: '/chemical-supplier/nitric-acid-qatar' },
        { label: 'Nitric Acid Supplier Kuwait', path: '/chemical-supplier/nitric-acid-kuwait' },
        { label: 'Nitric Acid Supplier Bahrain', path: '/chemical-supplier/nitric-acid-bahrain' },
        { label: 'Laboratory Chemicals Supplier Oman', path: '/chemical-supplier/laboratory-chemicals-oman' },
        { label: 'Fertilizer Supplier Oman', path: '/chemical-supplier/fertilizers-oman' },
        { label: 'Sodium Hypochlorite Supplier Oman', path: '/chemical-supplier/sodium-hypochlorite-oman' },
        { label: 'Oilfield Chemicals Supplier Oman', path: '/chemical-supplier/oilfield-chemicals-oman' },
        { label: 'Poly Aluminium Chloride Supplier Oman', path: '/chemical-supplier/poly-aluminium-chloride-oman' },
        { label: 'Hydrochloric Acid Supplier Oman', path: '/chemical-supplier/hydrochloric-acid-oman' },
        { label: 'Water Treatment Chemicals Supplier GCC', path: '/chemical-supplier/water-treatment-chemicals-gcc' },
        { label: 'Chemical Suppliers Middle East', path: '/chemical-suppliers-middle-east' },
        { label: 'Chemicals Muscat', path: '/chemicals/muscat' },
        { label: 'Chemicals Sohar', path: '/chemicals/sohar' },
        { label: 'Chemicals Salalah', path: '/chemicals/salalah' },
        { label: 'Chemicals Duqm', path: '/chemicals/duqm' },
        { label: 'Chemicals Rusayl', path: '/chemicals/rusayl' },
        { label: 'Chemicals Rustaq', path: '/chemicals/rustaq' },
        { label: 'Chemicals Dubai (Export)', path: '/chemicals/dubai' },
        { label: 'Chemicals Abu Dhabi (Export)', path: '/chemicals/abu-dhabi' },
        { label: 'Chemicals Sharjah (Export)', path: '/chemicals/sharjah' },
        { label: 'Chemicals Fujairah (Export)', path: '/chemicals/fujairah' },
        { label: 'Chemicals Ras Al Khaimah (Export)', path: '/chemicals/ras-al-khaimah' },
        { label: 'Chemicals Riyadh / Saudi Arabia (Export)', path: '/chemicals/riyadh' },
        { label: 'Chemicals Jeddah (Export)', path: '/chemicals/jeddah' },
        { label: 'Chemicals Dammam / Eastern Province (Export)', path: '/chemicals/dammam' },
        { label: 'Chemicals Doha / Qatar (Export)', path: '/chemicals/doha' },
        { label: 'Chemicals Kuwait City (Export)', path: '/chemicals/kuwait-city' },
        { label: 'Chemicals Bahrain (Export)', path: '/chemicals/bahrain' },
        { label: 'Chemicals Baghdad / Iraq (Export)', path: '/chemicals/baghdad' },
        { label: 'Chemicals Amman / Jordan (Export)', path: '/chemicals/amman' },
        { label: 'Chemicals Cairo / Egypt (Export)', path: '/chemicals/cairo' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet defer={false}>
        <title>Sitemap | Global Chemicals LLC</title>
        <meta name="description" content="Complete sitemap for Global Chemicals LLC website. Navigate all pages including products, industries, resources, company info & contact details." />
        <meta name="keywords" content="sitemap, site navigation, Global Chemicals LLC, website map" />
        <meta property="og:title" content="Sitemap | Global Chemicals LLC" />
        <meta property="og:description" content="Complete sitemap for Global Chemicals LLC website navigation." />
        <meta property="og:url" content="https://gcoman.com/sitemap" />
        <meta property="og:image" content="https://gcoman.com/images/og-default.png" />
        <link rel="canonical" href="https://gcoman.com/sitemap" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Map className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sitemap</h1>
            <p className="text-muted-foreground text-lg">
              Complete navigation guide to all pages on our website
            </p>
          </div>
        </div>
      </section>

      {/* Sitemap Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {siteStructure.map((section, index) => (
                <div key={index} className="bg-card p-8 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-primary">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.path}
                          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          <span>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="mt-12 bg-primary/5 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Need Help Finding Something?</h3>
              <p className="text-muted-foreground mb-4">
                If you can't find what you're looking for, please don't hesitate to contact us. Our team is here to help you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+96892772305"
                  className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-primary"
                >
                  Call: +968 9277 2305
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sitemap;
