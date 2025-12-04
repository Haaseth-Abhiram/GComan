import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Droplets, Shield, Award, CheckCircle, Factory, Building2, 
  Phone, ArrowRight, Beaker, Waves, Thermometer, Filter,
  Sparkles, MapPin, Clock, Users
} from 'lucide-react';
import { products } from './Products';

// Filter water treatment products
const waterTreatmentProducts = products.filter(p => p.category === 'water-treatment');

// Product categories for the hub
const productCategories = [
  {
    title: 'Coagulants & Flocculants',
    description: 'Essential chemicals for removing suspended particles and turbidity from water',
    icon: Filter,
    products: ['aluminium-sulphate-liquid', 'aluminium-sulphate-powder', 'ferric-chloride', 'poly-aluminium-chloride', 'polyelectrolyte']
  },
  {
    title: 'Disinfectants & Sanitizers',
    description: 'Powerful antimicrobial agents for water purification and sanitation',
    icon: Shield,
    products: ['calcium-hypochlorite-water', 'sodium-hypochlorite', 'biocide-water', 'chlorine-dioxide']
  },
  {
    title: 'pH Adjusters & Neutralizers',
    description: 'Chemicals for precise pH control in water treatment processes',
    icon: Beaker,
    products: ['caustic-soda-liquid', 'caustic-soda-flakes', 'hydrochloric-acid', 'sulphuric-acid', 'calcium-carbonate-water']
  },
  {
    title: 'Scale & Corrosion Inhibitors',
    description: 'Protection chemicals for membranes, pipes, and equipment',
    icon: Thermometer,
    products: ['antiscalant-water', 'corrosion-inhibitor', 'oxygen-scavenger']
  },
  {
    title: 'Specialty Water Treatment',
    description: 'Specialized chemicals for specific water treatment challenges',
    icon: Sparkles,
    products: ['activated-carbon-water', 'antifoam-water', 'chelating-agent', 'decolorant']
  }
];

// Service areas in Oman
const serviceAreas = [
  { name: 'Muscat', description: 'Municipal water treatment, industrial facilities, hotels' },
  { name: 'Sohar Industrial Zone', description: 'Petrochemical plants, refineries, heavy industry' },
  { name: 'Rusayl Industrial Estate', description: 'Manufacturing plants, food processing, pharmaceuticals' },
  { name: 'Duqm SEZ', description: 'Desalination plants, port facilities, industrial complex' },
  { name: 'Salalah', description: 'Port operations, cement industry, agricultural applications' },
  { name: 'Sur', description: 'LNG facilities, marine applications, municipal treatment' }
];

// FAQs for long-tail keywords
const faqs = [
  {
    question: 'What are the best water treatment chemicals for desalination plants in Oman?',
    answer: 'For desalination plants in Oman, we recommend a combination of antiscalants (to prevent membrane scaling), biocides (for microbiological control), and pH adjustment chemicals like caustic soda and sulphuric acid. Our technical team can design a customized chemical program for your specific desalination system, whether RO, MSF, or MED technology.'
  },
  {
    question: 'How do I choose the right coagulant for water treatment?',
    answer: 'The choice of coagulant depends on your water source characteristics, turbidity levels, and treatment objectives. Poly Aluminium Chloride (PAC) is effective for a wide pH range and produces less sludge. Aluminium Sulphate is cost-effective for general municipal applications. Ferric Chloride works well for high organic content water. Contact our technical team for jar testing and optimal coagulant selection.'
  },
  {
    question: 'What chemicals are needed for cooling tower water treatment in Oman?',
    answer: 'Cooling tower treatment in Oman\'s hot climate requires: scale inhibitors (to prevent calcium carbonate scaling), corrosion inhibitors (to protect metal components), biocides (to control Legionella and biofilm), and pH adjusters. Our cooling water treatment program includes regular monitoring and chemical optimization for maximum efficiency.'
  },
  {
    question: 'Are your water treatment chemicals approved for use in Oman?',
    answer: 'Yes, all our water treatment chemicals comply with Oman\'s regulatory requirements. We hold JSRS certification (Joint Supplier Registration System) for oil & gas applications and are ICV compliant. Our products meet international standards including NSF/ANSI certifications for drinking water applications.'
  },
  {
    question: 'Do you supply water treatment chemicals in bulk to industrial zones?',
    answer: 'Yes, we maintain local stock in our Ghala (Muscat) warehouse and provide bulk supply to all industrial zones including Sohar Industrial Zone, Rusayl Industrial Estate, Duqm SEZ, and Salalah. We offer flexible packaging from 25kg bags to IBC tanks and bulk tanker delivery.'
  },
  {
    question: 'What is the shelf life of water treatment chemicals?',
    answer: 'Shelf life varies by product: Caustic soda and acids have indefinite shelf life when stored properly. Calcium hypochlorite typically lasts 1-2 years in cool, dry conditions. Polymeric coagulants and flocculants last 6-12 months. We provide proper storage guidelines and ensure fresh stock delivery.'
  }
];

const WaterTreatmentHub = () => {
  // Generate slug for product links
  const getProductSlug = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : productId;
  };

  // FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // ItemList Schema for products
  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Water Treatment Chemicals in Oman",
    "description": "Complete range of water treatment chemicals from Global Chemicals LLC",
    "numberOfItems": waterTreatmentProducts.length,
    "itemListElement": waterTreatmentProducts.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.title,
        "description": product.description,
        "url": `https://www.gcoman.com/products/water-treatment/${getProductSlug(product.id)}`
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Water Treatment Chemicals Oman | JSRS Certified Supplier | Global Chemicals LLC"
        description="Leading water treatment chemicals supplier in Oman. JSRS certified, ICV compliant. Coagulants, disinfectants, antiscalants for desalination, municipal & industrial water treatment in Muscat, Sohar, Duqm."
        keywords="water treatment chemicals Oman, water treatment chemicals Muscat, PAC Oman, caustic soda Oman, calcium hypochlorite Oman, antiscalant Oman, desalination chemicals Oman, cooling tower chemicals Oman, wastewater treatment chemicals Oman, JSRS certified chemical supplier"
        canonical="https://www.gcoman.com/water-treatment"
        ogUrl="https://www.gcoman.com/water-treatment"
      />
      
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(productListSchema)}</script>
      </Helmet>

      <Navigation />
      <WhatsAppButton />
      
      <main id="main-content" className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 text-white py-20 lg:py-28">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge className="bg-emerald-500/20 border-emerald-400/50 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                JSRS Certified
              </Badge>
              <Badge className="bg-blue-500/20 border-blue-400/50 text-white px-4 py-2">
                <Award className="w-4 h-4 mr-2" />
                ICV Compliant
              </Badge>
              <Badge className="bg-white/10 border-white/30 text-white px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Local Stock in Ghala
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
              Water Treatment Chemicals
              <span className="block text-cyan-300 mt-2">Supplier in Oman</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-center text-white/90 max-w-4xl mx-auto mb-8">
              Your trusted partner for municipal, industrial, and desalination water treatment solutions. 
              Serving Muscat, Sohar, Duqm, Salalah, and all industrial zones across Oman.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-white/90">
                  <Phone className="w-5 h-5 mr-2" />
                  Request a Quote
                </Button>
              </Link>
              <Link to="/products?category=water-treatment">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View All Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-300">{waterTreatmentProducts.length}+</div>
                <div className="text-white/80 text-sm">Water Treatment Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-300">10+</div>
                <div className="text-white/80 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-300">200+</div>
                <div className="text-white/80 text-sm">Industrial Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-300">24/7</div>
                <div className="text-white/80 text-sm">Technical Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Oman&apos;s Leading Water Treatment Chemical Supplier
              </h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  Global Chemicals LLC is Oman&apos;s premier supplier of <strong>water treatment chemicals</strong>, 
                  serving municipal water treatment plants, industrial facilities, desalination plants, and 
                  commercial establishments across the Sultanate. With our <strong>JSRS certification</strong> and 
                  <strong>ICV compliance</strong>, we are the trusted partner for critical water treatment applications 
                  in the oil &amp; gas sector and beyond.
                </p>
                <p>
                  Based in <strong>Ghala, Muscat</strong>, our strategically located warehouse ensures rapid delivery 
                  to all major industrial zones including <strong>Sohar Industrial Zone</strong>, 
                  <strong>Rusayl Industrial Estate</strong>, <strong>Duqm Special Economic Zone</strong>, and 
                  <strong>Salalah</strong>. We maintain comprehensive stock of coagulants, flocculants, disinfectants, 
                  pH adjusters, scale inhibitors, and specialty water treatment chemicals.
                </p>
                <p>
                  Our technical team provides expert consultation for water treatment program design, jar testing, 
                  dosing optimization, and ongoing support to ensure optimal water quality and treatment efficiency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Water Treatment Chemical Categories
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Comprehensive range of water treatment solutions for every application
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productCategories.map((category, index) => {
                const Icon = category.icon;
                const categoryProducts = category.products
                  .map(id => products.find(p => p.id === id))
                  .filter(Boolean);

                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <ul className="space-y-2">
                        {categoryProducts.slice(0, 4).map((product) => (
                          product && (
                            <li key={product.id}>
                              <Link 
                                to={`/products/water-treatment/${getProductSlug(product.id)}`}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {product.title}
                              </Link>
                            </li>
                          )
                        ))}
                      </ul>
                      {categoryProducts.length > 4 && (
                        <Link 
                          to="/products?category=water-treatment"
                          className="text-sm text-muted-foreground hover:text-foreground mt-3 inline-flex items-center"
                        >
                          +{categoryProducts.length - 4} more products
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Water Treatment Products */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Complete Water Treatment Product Range
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Browse our full catalog of {waterTreatmentProducts.length}+ water treatment chemicals available in Oman
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {waterTreatmentProducts.map((product) => (
                <Link 
                  key={product.id}
                  to={`/products/water-treatment/${getProductSlug(product.id)}`}
                  className="p-4 rounded-lg border border-border hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <Droplets className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                        {product.title}
                      </h3>
                      {product.details?.casNumber && (
                        <p className="text-xs text-muted-foreground mt-1">
                          CAS: {product.details.casNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/products?category=water-treatment">
                <Button size="lg">
                  View Detailed Product Catalog
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Water Treatment Applications in Oman
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Tailored chemical solutions for every water treatment challenge
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Desalination Plants',
                  icon: Waves,
                  description: 'Antiscalants, biocides, and pH adjusters for RO, MSF, and MED desalination systems across Oman.',
                  chemicals: ['Antiscalant', 'Biocide', 'Sulphuric Acid', 'Caustic Soda']
                },
                {
                  title: 'Municipal Water Treatment',
                  icon: Building2,
                  description: 'Coagulants, flocculants, and disinfectants for municipal water treatment plants.',
                  chemicals: ['PAC', 'Aluminium Sulphate', 'Calcium Hypochlorite', 'Chlorine']
                },
                {
                  title: 'Industrial Wastewater',
                  icon: Factory,
                  description: 'Complete chemical programs for industrial effluent treatment and compliance.',
                  chemicals: ['Ferric Chloride', 'Polyelectrolyte', 'pH Adjusters', 'Defoamers']
                },
                {
                  title: 'Cooling Towers',
                  icon: Thermometer,
                  description: 'Scale inhibitors, corrosion inhibitors, and biocides for cooling water systems.',
                  chemicals: ['Scale Inhibitor', 'Corrosion Inhibitor', 'Biocide', 'Dispersant']
                },
                {
                  title: 'Boiler Water Treatment',
                  icon: Beaker,
                  description: 'Oxygen scavengers, phosphates, and polymers for boiler water conditioning.',
                  chemicals: ['Oxygen Scavenger', 'Phosphate', 'Polymer', 'Caustic Soda']
                },
                {
                  title: 'Swimming Pools',
                  icon: Droplets,
                  description: 'Sanitizers, pH adjusters, and algaecides for commercial swimming pools.',
                  chemicals: ['Calcium Hypochlorite', 'Hydrochloric Acid', 'Algaecide', 'Clarifier']
                }
              ].map((app, index) => {
                const Icon = app.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                          <Icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <CardTitle className="text-lg">{app.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4">{app.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {app.chemicals.map((chem, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {chem}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Service Areas Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Service Areas Across Oman
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Rapid delivery from our Ghala warehouse to all industrial zones
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceAreas.map((area, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{area.name}</h3>
                    <p className="text-sm text-muted-foreground">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gradient-to-br from-blue-900 to-cyan-900 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Global Chemicals for Water Treatment?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'JSRS Certified',
                  description: 'Approved supplier for Oman oil & gas sector with full regulatory compliance'
                },
                {
                  icon: MapPin,
                  title: 'Local Stock',
                  description: 'Warehouse in Ghala, Muscat for immediate availability and rapid delivery'
                },
                {
                  icon: Users,
                  title: 'Technical Support',
                  description: 'Expert consultation, jar testing, and dosing optimization services'
                },
                {
                  icon: Clock,
                  title: 'Reliable Supply',
                  description: '10+ years experience ensuring consistent quality and availability'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex p-4 rounded-full bg-white/10 mb-4">
                      <Icon className="w-8 h-8 text-cyan-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-white/80">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Common questions about water treatment chemicals in Oman
            </p>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Optimize Your Water Treatment?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our technical team for expert consultation, product recommendations, 
              and competitive pricing for your water treatment chemical requirements.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button size="lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Request a Quote
                </Button>
              </Link>
              <a href="tel:+96893754388">
                <Button size="lg" variant="outline">
                  Call +968 93754388
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WaterTreatmentHub;
