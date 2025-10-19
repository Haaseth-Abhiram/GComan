import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Users, Award, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />
      <Hero />

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-0.5 w-12 bg-primary" />
                <h2 className="text-sm text-primary font-semibold tracking-widest uppercase">About Us</h2>
                <div className="h-0.5 w-12 bg-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Leading Provider of Specialty Chemicals
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At Global Chemicals LLC, we are a leading provider of specialty chemicals, dedicated to delivering
                  high-quality products and innovative solutions to meet the diverse needs of our customers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With a strong reputation for reliability, excellence, and customer satisfaction, we strive to be your
                  preferred partner in the chemical industry. We continuously expand our product offerings, staying at
                  the forefront of industry trends and innovations.
                </p>
                <a
                  href="/about"
                  className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Read More About Us
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                {[
                  { icon: Users, label: 'Customer Focused', value: '100%' },
                  { icon: Award, label: 'Quality Products', value: 'Certified' },
                  { icon: TrendingUp, label: 'Industry Leader', value: '15+ Years' },
                  { icon: CheckCircle2, label: 'Trusted Partner', value: 'Global' },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="p-6 text-center hover:shadow-lg transition-all">
                      <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Commitment</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                At Global Chemicals LLC, we are committed to excellence, sustainability, and customer satisfaction.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quality Products',
                  description:
                    'We ensure every product meets the highest standards of quality, reliability, and performance for your business needs.',
                },
                {
                  title: 'Innovation & Research',
                  description:
                    'Continuously developing innovative solutions through cutting-edge research and advanced technologies.',
                },
                {
                  title: 'Environmental Sustainability',
                  description:
                    'Committed to sustainable practices that protect our environment while delivering exceptional results.',
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="p-8 text-center hover:shadow-xl transition-all animate-fade-in border-border hover:border-primary/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Partner With Us?</h2>
            <p className="text-lg mb-8 text-white/90">
              Let's discuss how our chemical solutions can drive your business forward
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-white text-primary hover:bg-white/90 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Get In Touch
              </a>
              <a
                href="/products"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border-2 border-white/30 backdrop-blur-sm transition-all transform hover:scale-105"
              >
                View Our Products
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
