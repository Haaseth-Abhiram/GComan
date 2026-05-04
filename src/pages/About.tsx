import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Target, Eye, Shield, Award, Users, TrendingUp, Globe2, Leaf, Lightbulb, Heart, Factory } from 'lucide-react';
import heroImage from '@/assets/about-hero.jpg';
import facilityImage from '@/assets/about-facility.jpg';
import teamImage from '@/assets/about-team.jpg';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData, OrganizationStructuredData } from '@/components/StructuredData';

// Breadcrumb items for About page
const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'About Us', url: 'https://gcoman.com/about' }
];

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Award, value: '10+', label: t('home.statsYears'), color: 'text-primary' },
    { icon: Factory, value: '1000+', label: t('home.statsProducts'), color: 'text-secondary' },
    { icon: Users, value: '200+', label: t('home.statsClients'), color: 'text-primary' },
    { icon: Globe2, value: '98%', label: t('home.statsSatisfaction'), color: 'text-secondary' },
  ];

  const values = [
    {
      icon: Shield,
      title: t('about.qualityAssurance'),
      description: t('about.qualityAssuranceDesc'),
    },
    {
      icon: Lightbulb,
      title: t('about.innovation'),
      description: t('about.innovationDesc'),
    },
    {
      icon: Leaf,
      title: t('about.sustainability'),
      description: t('about.sustainabilityDesc'),
    },
    {
      icon: Heart,
      title: t('about.customerFocus'),
      description: t('about.customerFocusDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Us | Chemical Supplier Oman & GCC | Global Chemicals LLC"
        description="ISO 9001 certified chemical supplier in Oman exporting to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. 10+ years excellence, 200+ clients across the GCC. Quality chemicals, expert service."
        keywords="about global chemicals, chemical supplier Oman GCC, ISO 9001 certified Middle East, chemical company Muscat, specialty chemicals GCC, industrial chemicals supplier UAE, JSRS certified Oman, chemical exporter Middle East, Saudi Arabia chemical supplier, Dubai chemical company"
        ogTitle="About Global Chemicals LLC - Leading Chemical Supplier in Oman & GCC"
        ogDescription="ISO 9001 certified with 10+ years of excellence. Trusted by 200+ clients across Oman, UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Quality chemicals & expert service."
        ogUrl="https://gcoman.com/about"
        canonical="https://gcoman.com/about"
      />
      <OrganizationStructuredData />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
      {/* Hero Section with Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Global Chemicals Laboratory"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-secondary/80 to-primary/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-4 sm:mb-6 text-sm sm:text-base px-5 sm:px-7 py-2 sm:py-2.5 bg-primary text-primary-foreground shadow-lg border-0 font-semibold tracking-wide">{t('about.title')}</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-secondary-foreground mb-4 sm:mb-6 leading-tight px-4">
              {t('about.heroTitle')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-secondary-foreground/85 max-w-3xl mx-auto leading-relaxed px-4">
              {t('about.heroSubtitle')}
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex flex-col items-center gap-2 text-secondary-foreground/70">
            <span className="text-xs uppercase tracking-widest font-medium">{t('about.discoverStory')}</span>
            <div className="w-6 h-10 border-2 border-secondary-foreground/40 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-secondary-foreground/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center space-y-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                  <div className={stat.color}>
                    <span className="text-4xl md:text-5xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Overview with Image */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <Badge variant="outline" className="text-primary border-primary/30">{t('about.whoWeAre')}</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {t('about.trustedPartner')}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.whoWeAreText')}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">{t('about.isoCertified')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">{t('about.yearsExperience')}</span>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={facilityImage}
                    alt="Fine Chemical Synthesis Laboratory"
                    width={800}
                    height={500}
                    className="w-full h-[500px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <Badge variant="outline" className="text-primary border-primary/30 mb-4">{t('about.ourPurpose')}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t('about.missionVision')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('about.drivingExcellence')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 hover:shadow-2xl transition-all hover:-translate-y-1 animate-fade-in logo-gradient-border logo-gradient-top relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">{t('about.mission')}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t('about.missionText')}
                </p>
              </Card>

              <Card className="p-8 hover:shadow-2xl transition-all hover:-translate-y-1 animate-fade-in logo-gradient-border logo-gradient-top relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">{t('about.vision')}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {t('about.visionText')}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <Badge variant="outline" className="text-primary border-primary/30 mb-4">{t('about.whatDrivesUs')}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t('about.coreValues')}</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('about.coreValuesDesc')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 group animate-fade-in logo-gradient-border relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative animate-fade-in order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={teamImage}
                    alt="Global Chemicals Team"
                    className="w-full h-[500px] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 ltr:left-6 ltr:right-6 rtl:right-6 rtl:left-6">
                    <p className="text-white font-semibold text-lg">{t('about.expertTeam')}</p>
                    <p className="text-white/80 text-sm">{t('about.dedicatedProfessionals')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 animate-fade-in order-1 lg:order-2" style={{ animationDelay: '0.2s' }}>
                <Badge variant="outline" className="text-primary border-primary/30">{t('about.ourPeople')}</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {t('about.meetTeam')}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('about.teamDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('about.readyToPartner')}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t('about.joinClients')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                {t('about.getInTouch')}
              </a>
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-white/90 text-secondary font-semibold rounded-lg border-2 border-secondary shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {t('about.exploreProducts')}
              </a>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
