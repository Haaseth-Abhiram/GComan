import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Shield, Zap, Headphones, TrendingUp, Award, Leaf } from 'lucide-react';

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const reasons = [
    { icon: Shield, title: t('home.whyChoose.qualityAssurance'), description: t('home.whyChoose.qualityAssuranceDesc'), gradient: 'from-primary to-accent' },
    { icon: Zap, title: t('home.whyChoose.fastDelivery'), description: t('home.whyChoose.fastDeliveryDesc'), gradient: 'from-accent to-primary' },
    { icon: Headphones, title: t('home.whyChoose.expertSupport'), description: t('home.whyChoose.expertSupportDesc'), gradient: 'from-secondary to-tertiary' },
    { icon: TrendingUp, title: t('home.whyChoose.innovationDriven'), description: t('home.whyChoose.innovationDrivenDesc'), gradient: 'from-tertiary to-secondary' },
    { icon: Award, title: t('home.whyChoose.industryLeader'), description: t('home.whyChoose.industryLeaderDesc'), gradient: 'from-primary to-secondary' },
    { icon: Leaf, title: t('home.whyChoose.sustainability'), description: t('home.whyChoose.sustainabilityDesc'), gradient: 'from-accent to-tertiary' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 animate-fade-in">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Our Advantages</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('home.whyChooseUs')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.whyChooseUsDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card
                key={index}
                className="relative p-8 hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 group animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Top gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-md`}>
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{reason.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
