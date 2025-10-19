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
