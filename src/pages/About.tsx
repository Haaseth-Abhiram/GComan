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
  const stats = [
    { icon: Award, value: '15+', label: 'Years of Excellence', color: 'text-primary' },
    { icon: Globe2, value: '50+', label: 'Countries Served', color: 'text-secondary' },
    { icon: Factory, value: '1000+', label: 'Quality Products', color: 'text-primary' },
    { icon: Users, value: '500+', label: 'Trusted Clients', color: 'text-secondary' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Products',
      description: 'We maintain the highest standards in every product we deliver, ensuring reliability and excellence through rigorous testing and quality control.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation & Research',
      description: 'Continuously developing new solutions through cutting-edge research and development initiatives to stay ahead of industry trends.',
    },
    {
      icon: Leaf,
      title: 'Environmental Sustainability',
      description: 'Committed to sustainable practices that protect our environment for future generations through eco-friendly products and processes.',
    },
    {
      icon: Heart,
      title: 'Customer-Centric Approach',
      description: 'Your success is our priority. We listen, understand, and deliver tailored solutions that exceed expectations.',
    },
    {
      icon: Shield,
      title: 'Health and Safety',
      description: 'Ensuring the safety of our team, customers, and communities in all our operations with strict safety protocols.',
    },
    {
      icon: Award,
      title: 'Ethical Business Practices',
      description: 'Conducting business with integrity, transparency, and respect for all stakeholders in everything we do.',
    },
  ];

  const milestones = [
    { year: '2009', title: 'Company Founded', description: 'Global Chemicals LLC established in Muscat, Oman' },
    { year: '2012', title: 'ISO Certification', description: 'Achieved ISO 9001 certification for quality management' },
    { year: '2015', title: 'Regional Expansion', description: 'Extended operations across the Middle East region' },
    { year: '2018', title: '500+ Clients', description: 'Reached milestone of serving over 500 satisfied clients' },
    { year: '2020', title: 'Modern Facility', description: 'Opened state-of-the-art storage and distribution center' },
    { year: '2024', title: 'Industry Leader', description: 'Recognized as one of Oman\'s leading chemical suppliers' },
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
              15+ years of delivering high-quality specialty chemicals and innovative solutions to industries across Oman and beyond
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
                  At Global Chemicals LLC, we are a leading provider of specialty chemicals, dedicated to delivering
                  high-quality products and innovative solutions to meet the diverse needs of our customers.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  With a strong reputation for reliability, excellence, and customer satisfaction, we strive to be your
                  preferred partner in the chemical industry. Our comprehensive product portfolio includes specialty and
                  commodity chemicals that cater to various industries worldwide.
                </p>
                <div className="flex gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">ISO 9001 Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">15+ Years Experience</span>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={facilityImage}
                    alt="Chemical Manufacturing Facility"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-semibold text-lg">State-of-the-Art Facilities</p>
                    <p className="text-white/80 text-sm">Modern infrastructure ensuring quality and efficiency</p>
                  </div>
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
                  To be a trusted global provider of specialty and commodity chemicals, delivering exceptional solutions
                  that meet the diverse needs of our customers. We aim to achieve this by offering high-quality products,
                  personalized service, and innovative solutions, while fostering sustainable practices and long-lasting
                  partnerships.
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
                  To be a leader in the chemical industry, recognized for our commitment to excellence, customer
                  satisfaction, and environmental responsibility. We strive to continually expand our product portfolio,
                  leveraging cutting-edge technologies and industry expertise to provide innovative solutions that drive
                  our customers' success.
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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className="p-8 hover:shadow-2xl transition-all hover:-translate-y-1 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
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
                  Our experienced team of chemical engineers, technical experts, and customer service professionals
                  brings decades of combined industry knowledge to serve your needs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Technical Expertise</h4>
                      <p className="text-muted-foreground">Qualified chemical engineers providing expert guidance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Customer Support</h4>
                      <p className="text-muted-foreground">24/7 dedicated support team ready to assist you</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Industry Knowledge</h4>
                      <p className="text-muted-foreground">Deep understanding of diverse industry requirements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <Badge variant="outline" className="text-primary border-primary/30 mb-4">Our Journey</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">15+ Years of Excellence</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Key milestones in our journey to becoming Oman's leading chemical supplier
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {milestones.map((milestone, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-primary text-4xl font-bold mb-4">{milestone.year}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Partner With Us?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join 500+ satisfied clients who trust Global Chemicals LLC for their chemical supply needs
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
