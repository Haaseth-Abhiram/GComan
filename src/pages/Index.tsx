import { useEffect } from 'react';
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Supplier in Oman | Water Treatment, Industrial Chemicals | Global Chemicals LLC Muscat"
        description="Leading chemical supplier in Oman. ISO 9001 certified. Serving Muscat, Salalah, Sohar. Water treatment chemicals, industrial lubricants, lab chemicals. 10+ years expertise. Request quote today!"
        keywords="chemicals Oman, chemical supplier Muscat, industrial chemicals Oman, water treatment Oman, PAC Oman, caustic soda Oman, lubricants Oman, laboratory chemicals Muscat, chemical distributor Oman, Shell lubricants Oman, Mobil oils Oman, calcium hypochlorite Oman, Sohar chemicals, Salalah chemicals"
        ogTitle="Chemical Supplier in Oman | Global Chemicals LLC Muscat"
        ogDescription="Leading B2B chemical supplier in Oman. ISO certified. Specialty & industrial chemicals for oil & gas, water treatment, manufacturing. Serving Muscat, Sohar, Salalah."
        ogUrl="https://www.gcoman.com/"
        canonical="https://www.gcoman.com/"
      />
      <Navigation />
      <WhatsAppButton />
      <Hero />
      <TrustBadges />
      <StatsSection />
      <FeaturedProducts />
      <IndustrySelector />
      <WhyChooseUs />
      <QuickActions />
      <Footer />
    </div>
  );
};

export default Index;
