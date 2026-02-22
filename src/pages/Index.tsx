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

// Homepage FAQs for rich snippets
const homepageFAQs = [
  {
    question: "What chemicals does Global Chemicals LLC supply in Oman?",
    answer: "Global Chemicals LLC supplies a comprehensive range of industrial and specialty chemicals including water treatment chemicals (PAC, caustic soda, calcium hypochlorite), industrial lubricants (Shell, Mobil, Castrol), laboratory chemicals (AR grade, HPLC solvents), oil & gas chemicals, food grade chemicals, and swimming pool chemicals. We serve all major industries in Oman."
  },
  {
    question: "Which areas in Oman does Global Chemicals LLC deliver to?",
    answer: "We deliver chemicals across all major cities and industrial areas in Oman including Muscat, Salalah, Sohar (SOHAR Port & Freezone), Sur, Duqm, Nizwa, Rusayl Industrial Area, Barka, and surrounding regions. Most deliveries are completed within 1-3 business days."
  },
  {
    question: "Is Global Chemicals LLC ISO certified?",
    answer: "Yes, Global Chemicals LLC is ISO 9001:2015 certified, ensuring the highest quality standards in chemical supply, storage, and distribution. We are also JSRS Certified (Joint Supplier Registration System) for Oman's oil & gas sector and ICV compliant."
  },
  {
    question: "How can I request a quote for chemicals?",
    answer: "You can request a quote by calling us at +968-93754388, emailing info@gcoman.com, using our WhatsApp chat, or filling out the contact form on our website. Our team typically responds within 24 hours with competitive pricing."
  },
  {
    question: "Does Global Chemicals provide technical support?",
    answer: "Yes, we provide comprehensive technical support including product selection guidance, application recommendations, Safety Data Sheets (SDS), and on-site technical consultation for complex chemical requirements. Our experienced team has 10+ years of expertise in the chemical industry."
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Suppliers in Oman | Global Chemicals LLC | gcoman.com"
        description="Global Chemicals LLC — Oman's trusted chemical supplier. We supply industrial, agricultural, construction & water treatment chemicals across Oman and the GCC. ISO 9001 certified. Get a quote today."
        keywords="chemical suppliers in oman, chemical company oman, industrial chemicals muscat, chemical distributor oman, chemical supplier GCC, water treatment chemicals oman, PAC Oman, caustic soda Oman, lubricants Oman, laboratory chemicals Muscat, Shell lubricants Oman, calcium hypochlorite Oman, Sohar chemicals, Salalah chemicals, Duqm chemicals, agricultural chemicals oman"
        ogTitle="Chemical Suppliers in Oman | Global Chemicals LLC | gcoman.com"
        ogDescription="Global Chemicals LLC — Oman's trusted chemical supplier. Industrial, agricultural, construction & water treatment chemicals. ISO 9001 certified. Serving Muscat, Sohar, Salalah & GCC."
        ogUrl="https://www.gcoman.com/"
        canonical="https://www.gcoman.com/"
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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
