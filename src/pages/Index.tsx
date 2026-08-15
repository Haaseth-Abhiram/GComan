import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2 } from 'lucide-react';
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
import { FAQStructuredData, SpeakableStructuredData, ServiceStructuredData } from '@/components/StructuredData';
import heroLcp from '@/assets/hero-water-treatment.webp';

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
        description="Leading Oman chemical supplier exporting to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Industrial, water treatment & oilfield chemicals. ISO 9001 certified."
        keywords="chemical suppliers Oman GCC, chemical company oman UAE, industrial chemicals muscat dubai, chemical distributor GCC, chemical supplier UAE Saudi Arabia Qatar, water treatment chemicals GCC, PAC Oman UAE, caustic soda GCC, lubricants Middle East, laboratory chemicals GCC, Shell lubricants UAE, calcium hypochlorite GCC, agricultural chemicals oman, chemical exporter Oman"
        ogTitle="Chemical Suppliers in Oman & GCC | Global Chemicals LLC"
        ogDescription="Global Chemicals LLC — Oman-based chemical supplier exporting to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Industrial, water treatment & oilfield chemicals. ISO 9001 certified."
        ogUrl="https://gcoman.com/"
        canonical="https://gcoman.com/"
      />
      {/* WebSite (#website) and Organization (#organization) JSON-LD are the
          single source of truth in index.html — do NOT re-emit them here or
          Helmet appends duplicate-@id nodes. Service schema is page-specific. */}
      {/* Preload the LCP hero image so the browser starts fetching it during HTML parse
          instead of after the Hero chunk resolves. Uses the Vite-hashed asset URL. */}
      <Helmet defer={false}>
        <link rel="preload" as="image" href={heroLcp} fetchPriority="high" type="image/webp" />
      </Helmet>
      <ServiceStructuredData />
      <FAQStructuredData faqs={homepageFAQs} />
      <SpeakableStructuredData
        url="https://gcoman.com/"
        cssSelector={["h1", "h2", ".company-snapshot"]}
      />
      <Navigation />
      <WhatsAppButton />
      <main id="main-content">
        <Hero />

        {/* Company snapshot strip — fully visible prose for AI citation + GEO.
            Must not be hidden or aria-hidden; structured data depends on rendered text. */}
        <section className="company-snapshot border-y border-border/40 bg-slate-50/70 py-7">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 lg:items-center">

              {/* Prose */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  About the Company
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">Global Chemicals LLC</span> is
                  a B2B specialty and industrial chemical supplier headquartered in Ghala, Muscat,
                  Oman. We supply 263+ products across 22 categories — water treatment chemicals
                  (PAC, caustic soda, sodium hypochlorite, antiscalants), industrial lubricants
                  (Shell, Mobil, Castrol), oilfield and refinery chemicals, food-grade chemicals,
                  and laboratory reagents — to water treatment plants, PDO &amp; OQ contractors,
                  hotels, food processors, and manufacturers across Oman. Same-day delivery in
                  Muscat; next-day to Sohar, Salalah, and Duqm; exports to UAE, Saudi Arabia,
                  Qatar, Kuwait, and Bahrain.
                </p>
              </div>

              {/* Vertical divider */}
              <div className="hidden lg:block w-px bg-border/50 self-stretch" />

              {/* Certification badges + CTA */}
              <div className="flex flex-row lg:flex-col items-start gap-2 flex-shrink-0 flex-wrap">
                {(["ISO 9001:2015", "JSRS Certified", "ICV Compliant"] as const).map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/[0.07] border border-primary/20 text-xs font-semibold text-primary whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    {cert}
                  </span>
                ))}
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/70 transition-colors mt-1 lg:mt-2"
                >
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
