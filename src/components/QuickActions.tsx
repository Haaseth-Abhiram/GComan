import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { FileText, MessageSquare, Search, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const { t } = useTranslation();

  const actions = [
    { icon: Search, title: t('quickActions.productFinder'), description: t('quickActions.productFinderDesc'), link: '/products', gradient: 'from-secondary to-secondary/80' },
    { icon: MessageSquare, title: t('quickActions.requestQuote'), description: t('quickActions.requestQuoteDesc'), link: '/contact', gradient: 'from-primary to-accent' },
    { icon: Download, title: t('quickActions.technicalResources'), description: t('quickActions.technicalResourcesDesc'), link: '/resources', gradient: 'from-tertiary to-tertiary/80' },
    { icon: FileText, title: t('quickActions.sampleRequest'), description: t('quickActions.sampleRequestDesc'), link: '/contact', gradient: 'from-accent to-primary' },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/97 to-secondary/90" />
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14 animate-fade-in">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Get Started</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.link}>
                <Card
                  className="group relative p-6 bg-white/[0.07] backdrop-blur-sm border-white/10 hover:bg-white/[0.14] hover:border-white/25 transition-all duration-300 cursor-pointer animate-scale-in h-full overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Hover glow */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${action.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className="relative space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg">{action.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{action.description}</p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
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

export default QuickActions;
