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

const Index = () => {
  useEffect(() => {
    // Enhanced SEO Meta Tags for Oman Chemical Searches
    document.title = 'Chemical Supplier in Oman | Water Treatment, Industrial Chemicals | Global Chemicals LLC Muscat';
    
    const updateOrCreateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta('description', 'Leading chemical supplier in Oman. ISO 9001 certified. Serving Muscat, Salalah, Sohar. Water treatment chemicals, industrial lubricants, lab chemicals. 10+ years expertise. Request quote today!');
    updateOrCreateMeta('keywords', 'chemicals Oman, chemical supplier Muscat, industrial chemicals Oman, water treatment Oman, PAC Oman, caustic soda Oman, lubricants Oman, laboratory chemicals Muscat, chemical distributor Oman, Shell lubricants Oman, Mobil oils Oman, calcium hypochlorite Oman, Sohar chemicals, Salalah chemicals');
    
    // Open Graph
    updateOrCreateMeta('og:title', 'Chemical Supplier in Oman | Global Chemicals LLC Muscat', true);
    updateOrCreateMeta('og:description', 'Leading B2B chemical supplier in Oman. ISO certified. Specialty & industrial chemicals for oil & gas, water treatment, manufacturing. Serving Muscat, Sohar, Salalah.', true);
    updateOrCreateMeta('og:url', 'https://www.gcoman.com/', true);
    
    // Twitter
    updateOrCreateMeta('twitter:title', 'Chemical Supplier in Oman | Global Chemicals LLC Muscat');
    updateOrCreateMeta('twitter:description', 'Leading B2B chemical supplier in Oman. ISO certified. Specialty & industrial chemicals for oil & gas, water treatment, manufacturing. Serving Muscat, Sohar, Salalah.');
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
