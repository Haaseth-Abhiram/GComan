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
import { OrganizationStructuredData, FAQStructuredData } from '@/components/StructuredData';

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
      <FAQStructuredData faqs={homepageFAQs} />
      <Navigation />
      <WhatsAppButton />
      <main id="main-content">
        <Hero />

        {/* Company snapshot strip — thin, unobtrusive, fully visible prose for AI citation.
            Must not be hidden or aria-hidden; GEO value requires rendered text. */}
        <section className="border-y border-border/30 bg-muted/5 py-5">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-10">
              <p className="flex-1 text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Global Chemicals LLC</span> is
                a B2B specialty and industrial chemical supplier headquartered in Ghala, Muscat,
                Oman — ISO 9001:2015 certified, JSRS pre-qualified for Oman's oil and gas sector,
                and ICV compliant. The company supplies 263+ products across 21 categories including
                water treatment chemicals (PAC, caustic soda, sodium hypochlorite, antiscalants),
                industrial lubricants (Shell, Mobil, Castrol), oilfield and refinery chemicals,
                food-grade chemicals, and laboratory reagents. Customers include water treatment
                plants, PDO and OQ contractors, hotels, food processors, and manufacturing facilities
                across Oman. Same-day delivery in Muscat; next-day to Sohar, Salalah, and Duqm;
                exports to UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain.
              </p>
              <div className="flex md:flex-col items-center md:items-end gap-x-4 gap-y-1 text-xs text-muted-foreground/60 flex-shrink-0 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />
                  ISO 9001:2015
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />
                  JSRS Certified
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 inline-block" />
                  ICV Compliant
                </span>
                <Link to="/about" className="text-primary hover:underline font-medium md:mt-2 text-xs">
                  About us →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <TrustBadges />
        <StatsSection />
        <FeaturedProducts />
        <IndustrySelector />
        <WhyChooseUs />
        <QuickActions />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
