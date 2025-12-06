import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { FileText, MessageSquare, Search, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const { t } = useTranslation();

  const actions = [
    {
      icon: Search,
      title: t('quickActions.productFinder'),
      description: t('quickActions.productFinderDesc'),
      link: '/products',
      color: 'from-secondary to-secondary/80',
    },
    {
      icon: MessageSquare,
      title: t('quickActions.requestQuote'),
      description: t('quickActions.requestQuoteDesc'),
      link: '/contact',
      color: 'from-primary to-accent',
    },
    {
      icon: Download,
      title: t('quickActions.technicalResources'),
      description: t('quickActions.technicalResourcesDesc'),
      link: '/resources',
      color: 'from-tertiary to-tertiary/80',
    },
    {
      icon: FileText,
      title: t('quickActions.sampleRequest'),
      description: t('quickActions.sampleRequestDesc'),
      link: '/contact',
      color: 'from-accent to-primary',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-foreground to-foreground/95 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 ltr:left-10 rtl:right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 ltr:right-10 rtl:left-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.link}>
                <Card
                  className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer animate-scale-in h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div
                      className={`w-14 h-14 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg">{action.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{action.description}</p>
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
