import { Card } from '@/components/ui/card';
import { Apple, Pill, Factory, Fuel, Waves, ArrowRight, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import oilGasBg from '@/assets/oil-gas-card-bg.jpg';

const IndustrySelector = () => {
  const industries = [
    {
      icon: Fuel,
      name: 'Oil & Gas',
      description: 'Specialized solutions for energy sector',
      color: 'from-accent/10 to-accent/20',
      iconColor: 'text-accent',
    },
    {
      icon: Waves,
      name: 'Water Treatment',
      description: 'Advanced water purification solutions',
      color: 'from-tertiary/10 to-tertiary/20',
      iconColor: 'text-tertiary',
    },
    {
      icon: Factory,
      name: 'Manufacturing',
      description: 'Industrial chemicals for peak performance',
      color: 'from-secondary/10 to-secondary/20',
      iconColor: 'text-secondary',
    },
    {
      icon: Apple,
      name: 'Food & Beverage',
      description: 'Food-grade chemicals meeting the highest safety standards',
      color: 'from-tertiary/10 to-tertiary/20',
      iconColor: 'text-tertiary',
    },
    {
      icon: Pill,
      name: 'Pharmaceutical',
      description: 'Precision solutions for pharmaceutical applications',
      color: 'from-secondary/10 to-secondary/20',
      iconColor: 'text-secondary',
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solutions for Every Industry
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your industry to discover tailored chemical solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            
            // Special design for Oil & Gas
            if (industry.name === 'Oil & Gas') {
              return (
                <Link key={index} to="/industries" className="md:col-span-2 lg:col-span-2">
                  <Card
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-border hover:border-primary/50 animate-scale-in h-full"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={oilGasBg} 
                        alt="Oil & Gas Industry" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Droplet className="w-7 h-7 text-primary" />
                      </div>
                      <div className="absolute top-4 left-24">
                        <Badge variant="secondary" className="bg-white/90 text-foreground font-semibold px-4 py-1">
                          Energy
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                        Oil & Gas Solutions
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Specialized chemicals for drilling, production, and refining operations in the oil and gas industry.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">Performance Proven</Badge>
                        <Badge variant="outline" className="text-xs">Industry Standard</Badge>
                        <Badge variant="outline" className="text-xs">Technical Support</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-semibold pt-2">
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            }
            
            // Standard design for other industries
            return (
              <Link key={index} to="/industries">
                <Card
                  className="group p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer border-border hover:border-primary/50 animate-scale-in h-full"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="space-y-3">
                    <div
                      className={`w-16 h-16 mx-auto rounded-lg bg-gradient-to-br ${industry.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-8 h-8 ${industry.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      {industry.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{industry.description}</p>
                    <ArrowRight className="w-4 h-4 mx-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustrySelector;
