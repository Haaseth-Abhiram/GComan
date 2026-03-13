import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, LocalBusinessStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import {
  Droplets, Factory, Leaf, HardHat, Fuel, CheckCircle2, Phone, Mail,
  ArrowRight, Shield, Award, Globe2, Users, ChevronDown
} from 'lucide-react';

const faqs = [
  {
    question: "Who are the leading chemical suppliers in Oman?",
    answer: "Global Chemicals LLC is one of the leading chemical suppliers in Oman, serving industries across Muscat, Sohar, Salalah, Duqm, and the entire GCC region. We are ISO 9001:2015 certified, JSRS registered, and ICV compliant, with 10+ years of experience supplying water treatment chemicals, industrial lubricants, laboratory reagents, and oilfield chemicals."
  },
  {
    question: "What types of chemicals does Global Chemicals LLC supply in Oman?",
    answer: "We supply a comprehensive range including: water treatment chemicals (PAC, caustic soda, calcium hypochlorite, antiscalants), industrial lubricants (Shell, Mobil, Castrol), laboratory chemicals (AR grade reagents, HPLC solvents), oil & gas chemicals (corrosion inhibitors, demulsifiers, H2S scavengers), construction chemicals, agricultural chemicals, and swimming pool chemicals."
  },
  {
    question: "Does Global Chemicals LLC deliver chemicals across Oman?",
    answer: "Yes, we deliver to all major cities and industrial zones in Oman including Muscat, Sohar (SOHAR Port & Freezone), Salalah, Duqm Special Economic Zone, Nizwa, Sur, Rusayl Industrial Area, and Barka. Most deliveries are completed within 1-3 business days. We also export to UAE and other GCC countries."
  },
  {
    question: "How can I get a quote for chemicals in Oman?",
    answer: "You can request a quote by calling +968-93754388, emailing info@gcoman.com, using our WhatsApp chat, or filling out the contact form on our website at gcoman.com/contact. Our team typically responds within 24 hours with competitive pricing and technical recommendations."
  },
  {
    question: "What certifications does Global Chemicals LLC hold?",
    answer: "Global Chemicals LLC holds ISO 9001:2015 certification for quality management, JSRS (Joint Supplier Registration System) certification for Oman's oil & gas sector, and is ICV (In-Country Value) compliant. These certifications demonstrate our commitment to quality, safety, and contributing to Oman's local economy."
  },
  {
    question: "Can Global Chemicals provide technical support for chemical applications?",
    answer: "Absolutely. Our experienced technical team provides free consultation including product selection guidance, dosing optimization, application recommendations, Safety Data Sheets (SDS), and on-site technical support. We have 10+ years of expertise serving Oman's diverse industrial sectors."
  }
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers in Oman', url: 'https://gcoman.com/chemical-suppliers-oman' }
];

const sections = [
  {
    icon: Factory,
    title: "Industrial Chemical Supply in Oman",
    content: "As one of Oman's most established industrial chemical suppliers, Global Chemicals LLC provides a vast portfolio of chemicals for manufacturing, petrochemical, and heavy industry applications. Our industrial chemical range includes solvents, acids, alkalis, specialty chemicals, and process chemicals used across Muscat's Rusayl Industrial Area, Sohar Industrial Zone, and Duqm Special Economic Zone. We partner with leading global manufacturers to ensure consistent quality, competitive pricing, and reliable supply chains for Oman's growing industrial sector."
  },
  {
    icon: Leaf,
    title: "Agricultural Chemicals for Oman Farms",
    content: "Oman's agricultural sector is expanding rapidly under the nation's food security initiatives. Global Chemicals LLC supports this growth by supplying fertilizers, soil conditioners, plant nutrients, and crop protection chemicals to farms across Al Batinah, Dhofar, and Al Dakhiliyah regions. Our agricultural chemical solutions are designed for Oman's unique climate conditions, helping farmers maximize crop yields while maintaining soil health and sustainability."
  },
  {
    icon: Droplets,
    title: "Water Treatment Chemicals — Muscat & Oman",
    content: "Water treatment is critical in Oman, where desalination provides over 80% of potable water. Global Chemicals LLC is a premier supplier of water treatment chemicals including Poly Aluminium Chloride (PAC), caustic soda, calcium hypochlorite, sodium hypochlorite, antiscalants, and corrosion inhibitors. We serve desalination plants, wastewater treatment facilities, cooling towers, and swimming pools across Muscat, Sohar, Salalah, and Duqm. Our technical team provides dosing optimization and application support to ensure efficient water treatment operations."
  },
  {
    icon: HardHat,
    title: "Construction Chemicals Supplier Oman",
    content: "Oman's construction boom demands high-quality construction chemicals for concrete admixtures, waterproofing, sealants, adhesives, and surface treatments. Global Chemicals LLC supplies construction chemicals to major projects across Muscat, Sohar, Duqm, and Salalah. Our products meet international standards and are suitable for Oman's extreme temperature conditions, ensuring durability and performance in residential, commercial, and infrastructure projects."
  },
  {
    icon: Fuel,
    title: "Oil & Gas Chemical Solutions in Oman",
    content: "As a JSRS-certified chemical supplier, Global Chemicals LLC is qualified to serve Oman's oil and gas sector including PDO, OQ, and international operators. We supply corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers, drilling chemicals, and production chemicals. Our products are used in upstream exploration, midstream processing, and downstream refining operations. With strategic warehousing near key oil fields, we ensure rapid delivery and emergency supply capability across Oman's concession areas."
  }
];

const ChemicalSuppliersOman = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Suppliers in Oman | Global Chemicals LLC"
        description="Global Chemicals LLC — Leading chemical suppliers in Oman. ISO 9001 certified. Industrial, agricultural, water treatment & construction chemicals. Serving Muscat, Sohar, Salalah, Duqm & GCC. Get a free quote."
        keywords="chemical suppliers in oman, chemical company oman, industrial chemicals muscat, chemical distributor oman, chemical supplier GCC, oman chemical market, buy chemicals oman, water treatment chemicals oman, construction chemicals oman, oil gas chemicals oman, agricultural chemicals oman"
        ogTitle="Chemical Suppliers in Oman | Global Chemicals LLC"
        ogDescription="Leading chemical suppliers in Oman. ISO 9001 certified. Industrial, agricultural, water treatment & construction chemicals across Oman & GCC."
        ogUrl="https://gcoman.com/chemical-suppliers-oman"
        canonical="https://gcoman.com/chemical-suppliers-oman"
      />
      <LocalBusinessStructuredData />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-28 md:pt-36 pb-16 md:pb-24 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">ISO 9001:2015 Certified • JSRS Registered • ICV Compliant</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Leading Chemical Suppliers in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Global Chemicals LLC is Oman's trusted chemical supplier, providing industrial, agricultural, water treatment, construction, and oil & gas chemicals across Muscat, Sohar, Salalah, Duqm, and the GCC region. With 10+ years of expertise and 1,000+ products, we are your single-source chemical partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'get_quote_landing')}>
                  <Link to="/contact">
                    Get a Free Quote <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 text-lg px-8">
                  <Link to="/products">
                    Browse Products
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              {[
                { icon: Award, label: '10+ Years in Oman', value: 'Established' },
                { icon: Factory, label: 'Products Available', value: '1,000+' },
                { icon: Users, label: 'Satisfied Clients', value: '200+' },
                { icon: Globe2, label: 'Serving Oman & GCC', value: 'Regional' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="space-y-2">
                    <Icon className="w-8 h-8 text-primary mx-auto" />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Industry Sections */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-16">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <div key={index} className="grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-1">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <div className="md:col-span-11">
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{section.title}</h2>
                      <p className="text-muted-foreground leading-relaxed text-lg">{section.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Global Chemicals LLC as Your Chemical Supplier in Oman?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  'ISO 9001:2015 certified quality management',
                  'JSRS certified for oil & gas sector',
                  'ICV compliant — supporting Oman economy',
                  '1,000+ products from global manufacturers',
                  'Same-day delivery in Muscat area',
                  '1-3 day delivery across Oman',
                  'Free technical consultation & support',
                  'Competitive pricing with volume discounts',
                  'Complete documentation (SDS, CoA, TDS)',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-lg border">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Request a Free Quote Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you need water treatment chemicals, industrial lubricants, laboratory reagents, or oilfield chemicals — our team is ready to provide competitive pricing and technical support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'get_quote_landing_bottom')}>
                  <Link to="/contact">
                    <Mail className="w-5 h-5" /> Get a Free Quote
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a href="tel:+96893754388">
                    <Phone className="w-5 h-5" /> Call +968 93754388
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Frequently Asked Questions About Chemical Supply in Oman
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group border rounded-lg bg-card">
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-foreground hover:text-primary transition-colors">
                      <span className="pr-4">{faq.question}</span>
                      <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ChemicalSuppliersOman;
