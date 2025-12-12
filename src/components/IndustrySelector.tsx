import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Apple, Pill, Factory, Fuel, Waves, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndustrySelector = () => {
  const { t } = useTranslation();

  const industries = [
    {
      icon: Fuel,
      name: t('industries.oilGas'),
      description: t('home.industrySelector.oilGasDesc'),
      color: 'from-accent/10 to-accent/20',
      iconColor: 'text-accent',
    },
    {
      icon: Waves,
      name: t('industries.waterTreatment'),
      description: t('home.industrySelector.waterTreatmentDesc'),
      color: 'from-tertiary/10 to-tertiary/20',
      iconColor: 'text-tertiary',
    },
    {
      icon: Factory,
      name: t('industries.manufacturing'),
      description: t('home.industrySelector.manufacturingDesc'),
      color: 'from-secondary/10 to-secondary/20',
      iconColor: 'text-secondary',
    },
    {
      icon: Apple,
      name: t('industries.foodBeverage'),
      description: t('home.industrySelector.foodBeverageDesc'),
      color: 'from-tertiary/10 to-tertiary/20',
      iconColor: 'text-tertiary',
    },
    {
      icon: Pill,
      name: t('industries.pharmaceutical'),
      description: t('home.industrySelector.pharmaceuticalDesc'),
      color: 'from-secondary/10 to-secondary/20',
      iconColor: 'text-secondary',
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('home.industriesTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.industriesDesc')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <Link
                  key={index}
                  to="/industries"
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                >
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
