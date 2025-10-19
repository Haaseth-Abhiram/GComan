import { Card } from '@/components/ui/card';
import { Apple, Pill, Sprout, Factory, Fuel, Waves, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndustrySelector = () => {
  const industries = [
    {
      icon: Apple,
      name: 'Food & Beverage',
      description: 'Food-grade chemicals meeting the highest safety standards',
      color: 'from-green-500/10 to-green-600/10',
      iconColor: 'text-green-600',
    },
    {
      icon: Pill,
      name: 'Pharmaceutical',
      description: 'Precision solutions for pharmaceutical applications',
      color: 'from-blue-500/10 to-blue-600/10',
      iconColor: 'text-blue-600',
    },
    {
      icon: Sprout,
      name: 'Agriculture',
      description: 'Sustainable solutions for modern farming',
      color: 'from-lime-500/10 to-lime-600/10',
      iconColor: 'text-lime-600',
    },
    {
      icon: Factory,
      name: 'Manufacturing',
      description: 'Industrial chemicals for peak performance',
      color: 'from-gray-500/10 to-gray-600/10',
      iconColor: 'text-gray-600',
    },
    {
      icon: Fuel,
      name: 'Oil & Gas',
      description: 'Specialized solutions for energy sector',
      color: 'from-orange-500/10 to-orange-600/10',
      iconColor: 'text-orange-600',
    },
    {
      icon: Waves,
      name: 'Water Treatment',
      description: 'Advanced water purification solutions',
      color: 'from-cyan-500/10 to-cyan-600/10',
      iconColor: 'text-cyan-600',
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
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
