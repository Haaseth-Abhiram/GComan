import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Target, Eye, Shield, Award, Users, TrendingUp, Globe2, Leaf, Lightbulb, Heart, Factory } from 'lucide-react';
import heroImage from '@/assets/about-hero.jpg';
import facilityImage from '@/assets/about-facility.jpg';
import teamImage from '@/assets/about-team.jpg';

const About = () => {
  useEffect(() => {
    // SEO Meta Tags
    document.title = 'About Us | 10+ Years Excellence | Global Chemicals LLC Oman';
    
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

    updateOrCreateMeta('description', 'Learn about Global Chemicals LLC - ISO 9001 certified chemical supplier in Oman with 10+ years excellence. Our mission, vision, values, and commitment to quality serving 200+ clients across diverse industries.');
    updateOrCreateMeta('keywords', 'about global chemicals, chemical supplier Oman, ISO 9001 certified, chemical company Muscat, specialty chemicals Oman, industrial chemicals supplier');
    
    // Open Graph
    updateOrCreateMeta('og:title', 'About Global Chemicals LLC - Leading Chemical Supplier in Oman', true);
    updateOrCreateMeta('og:description', 'ISO 9001 certified with 10+ years of excellence. Trusted by 200+ clients. Quality chemicals, expert service, sustainable practices.', true);
    updateOrCreateMeta('og:url', 'https://www.gcoman.com/about', true);
    
    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://www.gcoman.com/about');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://www.gcoman.com/about');
      document.head.appendChild(canonical);
    }
  }, []);
  const stats = [
    { icon: Award, value: '10+', label: 'Years of Excellence', color: 'text-primary' },
    { icon: Factory, value: '1000+', label: 'Quality Products', color: 'text-secondary' },
    { icon: Users, value: '200+', label: 'Trusted Clients', color: 'text-primary' },
    { icon: Globe2, value: '98%', label: 'Customer Satisfaction', color: 'text-secondary' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'ISO 9001 certified with rigorous testing and quality control ensuring reliability and excellence in every product.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Cutting-edge research and development delivering innovative chemical solutions for evolving industry needs.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and products that protect our environment for future generations.',
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'Personalized service and tailored solutions that exceed expectations and drive your success.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      {/* Hero Section with Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Global Chemicals Laboratory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 text-base px-6 py-2">About Global Chemicals LLC</Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Leading the Chemical Industry with Excellence
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              10+ years of delivering high-quality specialty chemicals and innovative solutions to industries across Oman
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs uppercase tracking-wider">Discover Our Story</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center space-y-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className={stat.color}>
                    <span className="text-4xl md:text-5xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Overview with Image */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <Badge variant="outline" className="text-primary border-primary/30">Who We Are</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Your Trusted Partner in Chemical Solutions
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Global Chemicals LLC is a leading provider of specialty chemicals in Oman, delivering high-quality products 
                  and innovative solutions across diverse industries. With ISO 9001 certification and 10+ years of expertise, 
                  we combine technical excellence with personalized service to be your trusted chemical supply partner.
                </p>
                <div className="flex gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">ISO 9001 Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">10+ Years Experience</span>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={facilityImage}
                    alt="Fine Chemical Synthesis Laboratory"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <Badge variant="outline" className="text-primary border-primary/30 mb-4">Our Purpose</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Mission & Vision
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Driving excellence and innovation in the chemical industry
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-2 hover:shadow-2xl transition-all hover:-translate-y-1 animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To deliver exceptional chemical solutions through high-quality products, personalized service, and 
                  innovative practices while fostering sustainable partnerships that drive customer success.
                </p>
              </Card>

              <Card className="p-8 border-2 hover:shadow-2xl transition-all hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To be recognized as the leading chemical supplier in the region, setting industry standards for 
                  excellence, innovation, and environmental responsibility.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <Badge variant="outline" className="text-primary border-primary/30 mb-4">What Drives Us</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Core Values</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our commitment to excellence, sustainability, and customer satisfaction drives everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative animate-fade-in order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={teamImage}
                    alt="Global Chemicals Team"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-semibold text-lg">Expert Team</p>
                    <p className="text-white/80 text-sm">Dedicated professionals committed to your success</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
                <Badge variant="outline" className="text-primary border-primary/30">Our People</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Meet the Team Behind Our Success
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our team of chemical engineers, technical experts, and customer service professionals combines 
                  decades of industry knowledge with a commitment to excellence. We provide expert technical guidance, 
                  24/7 support, and deep understanding of industry-specific requirements to ensure your success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Partner With Us?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Join 200+ satisfied clients in Oman and the region
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Get in Touch
              </a>
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-white/90 text-secondary font-semibold rounded-lg border-2 border-secondary shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Explore Our Products
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
