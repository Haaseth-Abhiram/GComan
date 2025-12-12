import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Shield, Zap, Headphones, TrendingUp, Award, Leaf } from 'lucide-react';

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const reasons = [
    {
      icon: Shield,
      title: t('home.whyChoose.qualityAssurance'),
      description: t('home.whyChoose.qualityAssuranceDesc'),
    },
    {
      icon: Zap,
      title: t('home.whyChoose.fastDelivery'),
      description: t('home.whyChoose.fastDeliveryDesc'),
    },
    {
      icon: Headphones,
      title: t('home.whyChoose.expertSupport'),
      description: t('home.whyChoose.expertSupportDesc'),
    },
    {
      icon: TrendingUp,
      title: t('home.whyChoose.innovationDriven'),
      description: t('home.whyChoose.innovationDrivenDesc'),
    },
    {
      icon: Award,
      title: t('home.whyChoose.industryLeader'),
      description: t('home.whyChoose.industryLeaderDesc'),
    },
    {
      icon: Leaf,
      title: t('home.whyChoose.sustainability'),
      description: t('home.whyChoose.sustainabilityDesc'),
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('home.whyChooseUs')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.whyChooseUsDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 border-border hover:border-primary/50 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
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
