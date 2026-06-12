import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Apple, Pill, Factory, Fuel, Waves, ArrowRight } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';

const IndustrySelector = () => {
  const { t } = useTranslation();

  const industries = [
    { icon: Fuel, name: t('industries.oilGas'), description: t('home.industrySelector.oilGasDesc'), gradient: 'from-accent to-primary', bg: 'from-accent/10 to-accent/5' },
    { icon: Waves, name: t('industries.waterTreatment'), description: t('home.industrySelector.waterTreatmentDesc'), gradient: 'from-tertiary to-secondary', bg: 'from-tertiary/10 to-tertiary/5' },
    { icon: Factory, name: t('industries.manufacturing'), description: t('home.industrySelector.manufacturingDesc'), gradient: 'from-secondary to-primary', bg: 'from-secondary/10 to-secondary/5' },
    { icon: Apple, name: t('industries.foodBeverage'), description: t('home.industrySelector.foodBeverageDesc'), gradient: 'from-primary to-accent', bg: 'from-primary/10 to-primary/5' },
    { icon: Pill, name: t('industries.pharmaceutical'), description: t('home.industrySelector.pharmaceuticalDesc'), gradient: 'from-secondary to-tertiary', bg: 'from-secondary/10 to-tertiary/5' },
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 animate-fade-in">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Sectors We Serve</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('home.industriesTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.industriesDesc')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <Link
                key={index}
                to="/industries"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
              >
                <Card
                  className={`group relative p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer animate-scale-in h-full overflow-hidden bg-gradient-to-b ${industry.bg} logo-gradient-border`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${industry.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative space-y-3">
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${industry.gradient} flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-md`}>
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      {industry.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{industry.description}</p>
                    <ArrowRight className="w-4 h-4 mx-auto text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
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
