import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { Apple, Pill, Sprout, Factory, Fuel, Waves } from 'lucide-react';

const Industries = () => {
  const industries = [
    {
      icon: Apple,
      title: 'Food & Beverages',
      description:
        'Comprehensive range of food-grade chemicals and additives that meet the highest safety and quality standards for the food and beverage industry.',
    },
    {
      icon: Pill,
      title: 'Pharmaceutical',
      description:
        'Advanced solutions supporting research, production, and distribution while meeting the highest standards of safety, precision, and regulatory compliance.',
    },
    {
      icon: Sprout,
      title: 'Agriculture',
      description:
        'Innovative solutions that enhance productivity, reduce costs, and promote eco-friendly farming practices for sustainable agriculture.',
    },
    {
      icon: Factory,
      title: 'Manufacturing',
      description:
        'Cutting-edge solutions enhancing productivity, precision, and efficiency across every stage of the manufacturing process.',
    },
    {
      icon: Fuel,
      title: 'Oil & Gas',
      description:
        'Advanced solutions driving efficiency, safety, and reliability across the entire oil and gas value chain, from exploration to refining.',
    },
    {
      icon: Waves,
      title: 'Swimming Pool Chemicals',
      description:
        'Reliable source for comprehensive range of chemicals specifically designed for pool maintenance and water treatment.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Industries We Serve</h1>
            <p className="text-lg text-muted-foreground">
              Innovative solutions across diverse sectors with cutting-edge technology
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-up">
            <p className="text-lg text-muted-foreground leading-relaxed">
              At Global Chemicals LLC, we serve a diverse range of industries with innovative, reliable, and sustainable
              solutions. From agriculture, oil & gas, and water treatment to food & beverage and beyond, we combine
              expertise with cutting-edge technology to help our clients achieve efficiency, quality, and long-term
              success.
            </p>
          </div>

          {/* Industries Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <Card
                  key={index}
                  className="group p-8 hover:shadow-xl transition-all animate-fade-in border-border hover:border-primary/50 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {industry.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{industry.description}</p>
                    <button className="text-primary font-semibold text-sm hover:underline flex items-center gap-2 group/btn">
                      Explore Solutions
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Industries */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">And Many More Industries</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We also provide specialized solutions for numerous other sectors including:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                'Detergent & Soap',
                'Water Treatment',
                'Laundry Services',
                'Lubricants',
                'Construction',
                'Textile',
                'Cosmetics',
                'Mining',
              ].map((industry, index) => (
                <div
                  key={index}
                  className="px-6 py-3 bg-card border border-border rounded-full text-foreground font-medium hover:border-primary hover:text-primary transition-all cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {industry}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Industries;
