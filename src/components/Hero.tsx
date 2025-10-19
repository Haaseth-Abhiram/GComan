import heroImage from '@/assets/hero-lab.jpg';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Award, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 mix-blend-multiply" />
        <img
          src={heroImage}
          alt="Laboratory with blue chemical test tubes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-secondary rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in">
            <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              ISO 9001 Certified
            </Badge>
            <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              15+ Years Excellence
            </Badge>
            <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              50+ Countries
            </Badge>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-6 animate-fade-in-up">
            {/* Pre-heading */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="h-px w-12 bg-primary" />
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">
                Industry-Leading Chemical Solutions
              </span>
              <div className="h-px w-12 bg-primary" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Transforming Industries with
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Premium Chemicals
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Delivering high-quality specialty chemicals and innovative solutions to 500+ trusted clients worldwide
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <a
                href="/products"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Explore Our Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border-2 border-white/30 backdrop-blur-sm transition-all transform hover:scale-105"
              >
                Request a Quote
              </a>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm">
              <a href="/resources" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Download SDS
              </a>
              <a href="/contact" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                Technical Support
              </a>
              <a href="/blog" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Industry News
              </a>
            </div>
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
