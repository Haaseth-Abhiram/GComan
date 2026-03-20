import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Award, Users, TrendingUp } from 'lucide-react';
import oqLogo from '@/assets/customers/oq-logo.png';
import oxyLogo from '@/assets/customers/oxy-logo.png';
import pdoLogo from '@/assets/customers/pdo-logo.png';
import arabianFoodLogo from '@/assets/customers/arabian-food-logo.jpg';
import napcoLogo from '@/assets/customers/napco-logo.jpg';
import mohLogo from '@/assets/customers/moh-logo.png';
import dalilPetroleumLogo from '@/assets/customers/dalil-petroleum-logo.png';
import oswsLogo from '@/assets/customers/osws-logo.jpg';
import soharAluminiumLogo from '@/assets/customers/sohar-aluminium-logo.png';
import omanLngLogo from '@/assets/customers/oman-lng-logo.png';
import omifcoLogo from '@/assets/customers/omifco-logo.png';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

// Breadcrumb items
const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Customers', url: 'https://gcoman.com/customers' }
];

interface Customer {
  name: string;
  logo: string;
  industry: string;
  description: string;
  featured?: boolean;
}

const Customers = () => {
  const customers: Customer[] = [
    {
      name: 'OQ',
      logo: oqLogo,
      industry: 'Oil & Gas',
      description: 'Oman\'s integrated energy company operating across the hydrocarbon value chain',
      featured: true
    },
    {
      name: 'Petroleum Development Oman (PDO)',
      logo: pdoLogo,
      industry: 'Oil & Gas',
      description: 'Leading oil and gas exploration and production company in Oman',
      featured: true
      featured: true
    },
    {
      name: 'Occidental Petroleum (Oxy)',
      logo: oxyLogo,
      industry: 'Oil & Gas',
      description: 'International oil and gas exploration and production company operating in Oman'
    },
    {
      name: 'Dalil Petroleum',
      logo: dalilPetroleumLogo,
      industry: 'Oil & Gas',
      description: 'Oil and gas services company providing specialized solutions in Oman'
    },
    {
      name: 'NAPCO',
      logo: napcoLogo,
      industry: 'Manufacturing',
      description: 'National Aluminum Products Company - leading manufacturer in Oman'
    },
    {
      name: 'Arabian Food Industries',
      logo: arabianFoodLogo,
      industry: 'Food & Beverage',
      description: 'Premium food and beverage manufacturing company in Oman'
    },
    {
      name: 'Ministry of Health Oman',
      logo: mohLogo,
      industry: 'Healthcare',
      description: 'Government healthcare provider ensuring quality medical services across Oman'
    },
    {
      name: 'OSWS',
      logo: oswsLogo,
      industry: 'Services',
      description: 'Oman Sails and Water Sports - marine and recreational services'
    },
    {
      name: 'Sohar Aluminium',
      logo: soharAluminiumLogo,
      industry: 'Manufacturing',
      description: 'Leading aluminum smelter and one of Oman\'s largest industrial companies'
    },
    {
      name: 'Oman LNG',
      logo: omanLngLogo,
      industry: 'Oil & Gas',
      description: 'Liquefied natural gas producer and exporter in Oman',
      testimonial: 'Excellent water treatment chemicals and technical support. Their PAC and calcium hypochlorite products perform consistently well in our desalination operations.',
      contactPerson: 'Plant Manager'
    },
    {
      name: 'Omifco',
      logo: omifcoLogo,
      industry: 'Manufacturing',
      description: 'Oman India Fertiliser Company - ammonia and urea production'
    }
  ];

  const industries = [
    'All Industries',
    'Oil & Gas',
    'Manufacturing',
    'Food & Beverage',
    'Healthcare',
    'Construction',
    'Water & Beverages',
    'Services'
  ];

  const stats = [
    { icon: Building2, value: '200+', label: 'Active Clients' },
    { icon: Award, value: '10+', label: 'Years Experience' },
    { icon: Users, value: '98%', label: 'Client Retention' },
    { icon: TrendingUp, value: '500+', label: 'Projects Completed' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Our Customers | Trusted by 200+ | Global Chemicals"
        description="Trusted chemical supplier for 200+ clients in Oman including oil & gas, water treatment, manufacturing & construction. ISO 9001 certified. 10+ years."
        keywords="chemical customers Oman, OQ supplier, PDO supplier, oil gas chemical supplier, industrial clients Oman, chemical testimonials, Oman LNG supplier"
        ogTitle="Our Valued Customers | Leading Organizations Trust Us | Global Chemicals"
        ogDescription="200+ active clients, 98% retention rate, 10+ years serving Oman's key industries. Join our growing family of satisfied customers."
        ogUrl="https://gcoman.com/customers"
        canonical="https://gcoman.com/customers"
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-4" variant="secondary">Trusted by Industry Leaders</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Our Valued Customers
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Proud to serve leading organizations across Oman with premium chemical solutions and exceptional service
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Customer Logos */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Featured Clients
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Proud partners with leading organizations in Oman's key industries
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {customers.filter(c => c.featured).map((customer, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all hover:-translate-y-1 group animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="h-24 bg-background rounded-lg border-2 border-border flex items-center justify-center p-4 mb-4 group-hover:border-primary/50 transition-colors">
                          <img
                            src={customer.logo}
                            alt={`${customer.name} logo`}
                            width={200}
                            height={80}
                            className="max-h-full max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <Badge variant="secondary" className="mb-2">{customer.industry}</Badge>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {customer.name}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="mt-3 text-base">
                      {customer.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Customer Logos Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Our Valued Customers
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Serving excellence across multiple industries throughout Oman
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {customers.map((customer, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all hover:-translate-y-1 group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="aspect-square bg-background border-2 border-border rounded-lg flex items-center justify-center p-4 mb-4 group-hover:border-primary/50 transition-colors">
                      <img
                        src={customer.logo}
                        alt={`${customer.name} logo`}
                        width={120}
                        height={120}
                        className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h3 className="font-semibold text-center text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      {customer.industry}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Serving Multiple Industries
            </h2>
            <p className="text-muted-foreground mb-8">
              Our diverse customer base spans across key sectors of Oman's economy
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {industries.filter(i => i !== 'All Industries').map((industry, index) => (
                <Badge key={index} variant="outline" className="text-base py-2 px-4">
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center border-2">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Join Our Growing Family of Satisfied Customers
              </CardTitle>
              <CardDescription className="text-base md:text-lg">
                Experience the difference that quality products, expert service, and reliable partnerships can make for your business. 
                Let's discuss how we can support your chemical supply needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">Get in Touch</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/products">View Our Products</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Customers;