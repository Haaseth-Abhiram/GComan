import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import TrustBadges from '@/components/TrustBadges';
import StatsSection from '@/components/StatsSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import IndustrySelector from '@/components/IndustrySelector';
import WhyChooseUs from '@/components/WhyChooseUs';
import QuickActions from '@/components/QuickActions';
import { SEO } from '@/components/SEO';
import { OrganizationStructuredData, FAQStructuredData, LocalBusinessStructuredData } from '@/components/StructuredData';

// Homepage FAQs for rich snippets — GCC-wide coverage
const homepageFAQs = [
  {
    question: "What chemicals does Global Chemicals LLC supply across Oman and the GCC?",
    answer: "Global Chemicals LLC supplies a comprehensive range of industrial and specialty chemicals including water treatment chemicals (PAC, caustic soda, calcium hypochlorite, antiscalants), industrial lubricants (Shell, Mobil, Castrol), laboratory chemicals (AR grade, HPLC solvents), oil & gas chemicals, food grade chemicals, and swimming pool chemicals. We serve all major industries in Oman (Muscat, Sohar, Salalah, Duqm) and export to UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain."
  },
  {
    question: "Does Global Chemicals LLC supply chemicals to the UAE, Saudi Arabia, Qatar, Kuwait and Bahrain?",
    answer: "Yes. Global Chemicals LLC exports chemicals to all GCC countries including UAE (Dubai, Abu Dhabi, Sharjah), Saudi Arabia (Riyadh, Jeddah, Dammam), Qatar (Doha, Ras Laffan), Kuwait (Kuwait City, Shuaiba), and Bahrain (Manama). Standard GCC delivery lead times are 3-7 business days. Contact our export team at sales@gcoman.com for pricing and availability."
  },
  {
    question: "Is Global Chemicals LLC ISO certified and qualified for GCC supply?",
    answer: "Yes, Global Chemicals LLC is ISO 9001:2015 certified, JSRS (Joint Supplier Registration System) certified for Oman's oil & gas sector, and ICV compliant. We provide full export documentation including Safety Data Sheets (SDS/MSDS), Certificates of Analysis (CoA), Technical Data Sheets (TDS), and Certificate of Origin — all required for GCC import clearance and customs."
  },
  {
    question: "How can I request a quote for chemical supply to Oman or GCC countries?",
    answer: "You can request a quote by calling us at +968-93754388, emailing info@gcoman.com (or sales@gcoman.com for export), using our WhatsApp chat, or filling out the contact form on our website. Include the chemical name, quantity, and destination country. Our team typically responds within 24 hours with competitive pricing for both domestic Oman supply and GCC export orders."
  },
  {
    question: "Does Global Chemicals provide technical support for chemical applications?",
    answer: "Yes, we provide comprehensive technical support including product selection guidance for water treatment, oilfield, and industrial applications, Safety Data Sheets (SDS), Certificates of Analysis (CoA), and on-site technical consultation. Our experienced team has 10+ years of expertise serving industries across Oman and the Middle East."
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Suppliers in Oman & GCC | Global Chemicals LLC"
        description="Global Chemicals LLC — Leading chemical supplier in Oman exporting to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Industrial, water treatment & oilfield chemicals. ISO 9001 certified. Get a quote."
        keywords="chemical suppliers Oman GCC, chemical company oman UAE, industrial chemicals muscat dubai, chemical distributor GCC, chemical supplier UAE Saudi Arabia Qatar, water treatment chemicals GCC, PAC Oman UAE, caustic soda GCC, lubricants Middle East, laboratory chemicals GCC, Shell lubricants UAE, calcium hypochlorite GCC, agricultural chemicals oman, chemical exporter Oman"
        ogTitle="Chemical Suppliers in Oman & GCC | Global Chemicals LLC"
        ogDescription="Global Chemicals LLC — Oman-based chemical supplier exporting to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Industrial, water treatment & oilfield chemicals. ISO 9001 certified."
        ogUrl="https://gcoman.com/"
        canonical="https://gcoman.com/"
      />
      <OrganizationStructuredData includeService={true} />
      <LocalBusinessStructuredData />
      <FAQStructuredData faqs={homepageFAQs} />
      <Navigation />
      <WhatsAppButton />
      <main id="main-content">
        <Hero />
        <TrustBadges />
        <StatsSection />
        <FeaturedProducts />
        <IndustrySelector />
        <WhyChooseUs />
        <QuickActions />

        {/* Internal Links Hub — location pages + product categories */}
        <section className="py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
                Chemical Supply Across Oman &amp; the Middle East
              </h2>
              <div className="grid md:grid-cols-2 gap-10">

                {/* Oman Locations */}
                <div>
                  <h3 className="text-base font-semibold text-primary uppercase tracking-wide mb-4">Oman — Chemical Supplier by City</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Muscat', path: '/chemicals/muscat' },
                      { label: 'Sohar', path: '/chemicals/sohar' },
                      { label: 'Salalah', path: '/chemicals/salalah' },
                      { label: 'Duqm', path: '/chemicals/duqm' },
                      { label: 'Rusayl Industrial Estate', path: '/chemicals/rusayl' },
                      { label: 'Rustaq', path: '/chemicals/rustaq' },
                    ].map((loc) => (
                      <li key={loc.path}>
                        <Link to={loc.path} className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors">
                          {loc.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-base font-semibold text-primary uppercase tracking-wide mb-4 mt-8">GCC &amp; Middle East Export</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Dubai, UAE', path: '/chemicals/dubai' },
                      { label: 'Abu Dhabi, UAE', path: '/chemicals/abu-dhabi' },
                      { label: 'Sharjah, UAE', path: '/chemicals/sharjah' },
                      { label: 'Fujairah, UAE', path: '/chemicals/fujairah' },
                      { label: 'Ras Al Khaimah, UAE', path: '/chemicals/ras-al-khaimah' },
                      { label: 'Riyadh, Saudi Arabia', path: '/chemicals/riyadh' },
                      { label: 'Jeddah, Saudi Arabia', path: '/chemicals/jeddah' },
                      { label: 'Dammam, Saudi Arabia', path: '/chemicals/dammam' },
                      { label: 'Doha, Qatar', path: '/chemicals/doha' },
                      { label: 'Kuwait City, Kuwait', path: '/chemicals/kuwait-city' },
                      { label: 'Manama, Bahrain', path: '/chemicals/bahrain' },
                      { label: 'Baghdad, Iraq', path: '/chemicals/baghdad' },
                      { label: 'Amman, Jordan', path: '/chemicals/amman' },
                      { label: 'Cairo, Egypt', path: '/chemicals/cairo' },
                    ].map((loc) => (
                      <li key={loc.path}>
                        <Link to={loc.path} className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors">
                          {loc.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Product Categories */}
                <div>
                  <h3 className="text-base font-semibold text-primary uppercase tracking-wide mb-4">Chemical Products by Category</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Water Treatment Chemicals', path: '/products/water-treatment' },
                      { label: 'Industrial Lubricants', path: '/products/lubricants' },
                      { label: 'Laboratory Chemicals', path: '/products/lab-chemicals' },
                      { label: 'Oilfield Chemicals', path: '/products/oilfield' },
                      { label: 'Swimming Pool Chemicals', path: '/products/swimming-pool' },
                      { label: 'RO Membrane Chemicals', path: '/products/ro-chemicals' },
                      { label: 'Food & Beverage Chemicals', path: '/products/food-beverage' },
                      { label: 'Cooling Water Chemicals', path: '/products/cooling-water' },
                      { label: 'Corrosion Inhibitors', path: '/products/corrosion-inhibitor' },
                      { label: 'Soap & Detergent Raw Materials', path: '/products/soap-detergent' },
                      { label: 'Solvents', path: '/products/solvents' },
                      { label: 'Construction Chemicals', path: '/products/construction' },
                      { label: 'Tank Cleaners', path: '/products/tank-cleaners' },
                      { label: 'Inorganic Chemicals', path: '/products/inorganic' },
                      { label: 'Alcohols', path: '/products/alcohols' },
                      { label: 'Glycols', path: '/products/glycols' },
                      { label: 'Ethanolamines', path: '/products/ethanolamines' },
                      { label: 'Chlorinated Solvents', path: '/products/chlorinated' },
                      { label: 'Agricultural Chemicals', path: '/products/agro' },
                      { label: 'Lab Equipment', path: '/products/lab-equipment' },
                    ].map((cat) => (
                      <li key={cat.path}>
                        <Link to={cat.path} className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors">
                          {cat.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-base font-semibold text-primary uppercase tracking-wide mb-4 mt-8">SEO Landing Pages</h3>
                  <ul className="space-y-2">
                    {[
                      { label: 'Chemical Suppliers in Oman', path: '/chemical-suppliers-oman' },
                      { label: 'Chemical Suppliers in Middle East', path: '/chemical-suppliers-middle-east' },
                      { label: 'Caustic Soda Supplier Oman', path: '/chemical-supplier/caustic-soda-oman' },
                    ].map((lp) => (
                      <li key={lp.path}>
                        <Link to={lp.path} className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors">
                          {lp.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
