import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import heroLab from '@/assets/hero-lab.jpg';
import waterTreatment from '@/assets/hero-water-treatment.webp';
import oilGas from '@/assets/products/oil-gas.jpg';
import industrialLubricants from '@/assets/products/industrial-lubricants.jpg';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Award, Sparkles } from 'lucide-react';
import { LocalizedLink } from '@/components/LocalizedLink';

const slides = [
  {
    image: waterTreatment,
    alt: "Water Treatment Chemicals",
    preheading: "B2B Water Treatment Excellence",
    title: "Advanced Water Treatment",
    highlight: "Solutions",
    description: "B2B supplier of cutting-edge water treatment chemicals for municipal, industrial, and commercial enterprises. Request a quote for bulk orders."
  },
  {
    image: oilGas,
    alt: "Oil & Gas Industry Chemicals",
    preheading: "B2B Oil & Gas Solutions",
    title: "Premium Chemicals for",
    highlight: "Oil & Gas Industry",
    description: "Specialized B2B chemical solutions for drilling, production, and refining operations. Volume discounts available for enterprise clients."
  },
  {
    image: industrialLubricants,
    alt: "Industrial Lubricants",
    preheading: "B2B Industrial Performance",
    title: "High-Performance",
    highlight: "Industrial Lubricants",
    description: "Superior B2B lubrication solutions for industrial enterprises with technical consultation and bulk supply agreements."
  },
  {
    image: heroLab,
    alt: "Laboratory Chemical Solutions",
    preheading: "Your Trusted B2B Chemical Partner",
    title: "Transforming Industries with",
    highlight: "Premium Chemicals",
    description: "Leading B2B supplier delivering specialty chemicals and enterprise solutions to 200+ business clients in Oman with ISO 9001 certification."
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Visible, descriptive H1 for SEO and accessibility */}
      <h1 className="absolute left-1/2 -translate-x-1/2 top-24 z-20 text-center text-white/95 text-base sm:text-lg md:text-xl font-semibold tracking-wide px-4 max-w-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        Leading Industrial Chemical Supplier in Oman & the GCC
      </h1>
      {/* Background with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-multiply z-10" />
        {slides.map((s, index) => {
          // Only render slides that have been viewed (or are next), keep first eager for LCP
          const shouldRender = index === 0 || index <= currentSlide + 1;
          if (!shouldRender) return null;
          return (
            <img
              key={index}
              src={s.image}
              alt={s.alt}
              width={1920}
              height={1080}
              loading={index === 0 ? "eager" : "lazy"}
              decoding={index === 0 ? "sync" : "async"}
              fetchPriority={index === 0 ? "high" : "low"}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/75 z-10" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-30 z-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-secondary rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
            <Badge variant="outline" className="bg-emerald-500/20 backdrop-blur-sm border-emerald-400/50 text-white px-4 py-2">
              <Shield className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-emerald-400" />
              {t('certifications.jsrs')}
            </Badge>
            <Badge variant="outline" className="bg-blue-500/20 backdrop-blur-sm border-blue-400/50 text-white px-4 py-2">
              <Award className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-blue-400" />
              {t('certifications.icv')}
            </Badge>
            <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white px-4 py-2">
              <Shield className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
              {t('certifications.iso')}
            </Badge>
            <Badge variant="outline" className="bg-primary/20 backdrop-blur-sm border-primary/50 text-white px-4 py-2">
              <Sparkles className="w-4 h-4 ltr:mr-2 rtl:ml-2 text-primary" />
              {t('locations.muscat')}
            </Badge>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-6 animate-fade-in-up">
            {/* Pre-heading */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-px w-12 bg-primary" />
              <span 
                key={`preheading-${currentSlide}`}
                className="text-primary text-sm font-semibold tracking-widest uppercase animate-fade-in"
              >
                {slide.preheading}
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>

            {/* Main Visual Heading (H2 since H1 is for SEO) */}
            <h2
              key={`title-${currentSlide}`}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight px-4 animate-fade-in"
              aria-label={`${slide.title} ${slide.highlight}`}
            >
              {slide.title}
              <br />
              <span className="text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                {slide.highlight}
              </span>
            </h2>

            {/* Value Proposition */}
            <p 
              key={`description-${currentSlide}`}
              className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4 animate-fade-in"
            >
              {slide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-6 px-4">
              <LocalizedLink
                to="/products"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-center"
              >
                {t('hero.ctaSecondary')}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              </LocalizedLink>
              <LocalizedLink
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-white/90 text-secondary font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-center"
              >
                {t('hero.cta')}
              </LocalizedLink>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm">
              <LocalizedLink to="/resources" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Download SDS
              </LocalizedLink>
              <LocalizedLink to="/contact" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                Technical Support
              </LocalizedLink>
              <LocalizedLink to="/blog" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Industry News
              </LocalizedLink>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex items-center justify-center gap-2 pt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
