import heroImage from '@/assets/hero-lab.jpg';

const Hero = () => {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Laboratory with blue chemical test tubes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          {/* Welcome Text with Decorative Lines */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-0.5 w-16 bg-primary" />
            <h2 className="text-white text-xl md:text-2xl font-light tracking-[0.3em] uppercase">
              Welcome To
            </h2>
            <div className="h-0.5 w-16 bg-primary" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Global Chemicals LLC
          </h1>

          {/* Description */}
          <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm p-8 md:p-10 rounded-lg border border-white/10">
            <p className="text-white text-base md:text-lg lg:text-xl leading-relaxed">
              At Global Chemicals LLC, we are a leading provider of specialty chemicals, dedicated to delivering 
              high-quality products and innovative solutions to meet the diverse needs of our customers. With a strong 
              reputation for reliability, excellence, and customer satisfaction, we strive to be your preferred partner in 
              the chemical industry.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="/about"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Learn More About Us
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border-2 border-white/30 backdrop-blur-sm transition-all transform hover:scale-105"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
