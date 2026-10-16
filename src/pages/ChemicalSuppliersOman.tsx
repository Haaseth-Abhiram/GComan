import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
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
  },
  {
    question: "Where is Global Chemicals LLC located in Muscat?",
    answer: "Our head office and main warehouse is located at Office-3, Building Number 1737, Near Oman LNG, Ghala, Muscat, Sultanate of Oman. We offer same-day delivery throughout Muscat including Rusayl Industrial Area, Wadi Kabir, Azaiba, Madinat Sultan Qaboos, and Seeb. Our office is open Sunday–Thursday, 8:00 AM – 6:00 PM."
  },
  {
    question: "Do you supply caustic soda (sodium hydroxide) in Oman?",
    answer: "Yes, Global Chemicals LLC is a leading caustic soda supplier in Oman. We supply caustic soda in all forms — flakes (98–99% NaOH), prills (99% NaOH), and liquid caustic (30–50%) — in packaging from 25 kg bags to 200-litre drums and bulk quantities. We stock both food-grade and technical-grade caustic soda with CoA and SDS documentation. Same-day delivery in Muscat."
  },
  {
    question: "Do you supply Shell, Mobil, and Castrol lubricants in Oman?",
    answer: "Yes, Global Chemicals LLC is an authorised lubricants distributor in Oman stocking Shell Rimula, Shell Tellus hydraulic oils, Shell Gadus greases, Mobil Delvac, Mobil DTE, Castrol RX Super, and Castrol Hyspin. All branded lubricants are genuine products supplied with original CoA. Same-day delivery in Muscat; next-day delivery to Sohar, Rusayl, and Salalah."
  },
  {
    question: "Can Global Chemicals supply chemicals to PDO and OQ oil field operations in Oman?",
    answer: "Yes. Global Chemicals LLC is JSRS (Joint Supplier Registration System) registered, which is the mandatory pre-qualification for chemical supply to PDO, OQ, OPAL, Occidental Petroleum (Oxy), and their approved contractors in Oman. We supply oilfield production chemicals (corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers), drilling chemicals, water treatment chemicals, and lubricants to oil & gas operations across South Oman, including Marmul, Nimr, and Qarn Alam field areas."
  },
  {
    question: "What is the minimum order quantity for chemicals from Global Chemicals LLC in Oman?",
    answer: "There is no minimum order quantity for most products — we supply from single units (1-litre bottles, 25 kg bags) up to full truck loads. We serve both SMEs needing small quantities and large industrial clients requiring bulk supply. For specialty chemicals, minimum order may apply depending on the supplier — contact our team for specific product minimums at info@gcoman.com or +968-93754388."
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
        title="Chemical Suppliers in Oman | 275+ Chemicals, ISO 9001"
        description="ISO 9001 & JSRS certified chemical supplier in Oman with 275+ chemicals. Same-day delivery in Muscat, 1–2 days to Sohar. Water treatment, oilfield & lab grades."
        keywords="chemical supplier muscat oman, chemical suppliers in oman, chemical company muscat, industrial chemicals muscat, chemical distributor oman, water treatment chemicals muscat oman, caustic soda oman, caustic soda supplier muscat, PAC supplier muscat oman, poly aluminium chloride oman, oil gas chemicals oman, JSRS chemical supplier oman, PDO chemical supplier oman, Shell lubricants oman, Mobil lubricants muscat, Castrol oman, laboratory chemicals muscat oman, chemical supplier GCC, calcium hypochlorite oman, antiscalant supplier oman, swimming pool chemicals muscat, food grade chemicals oman, RO chemicals oman, chemical supplier sohar, chemical supplier salalah, chemical supplier duqm"
        ogTitle="Chemical Suppliers in Oman | Global Chemicals LLC"
        ogDescription="Leading chemical suppliers in Oman — ISO 9001 & JSRS certified. Nationwide delivery from Muscat: water treatment, oilfield, industrial & laboratory chemicals."
        ogUrl="https://gcoman.com/chemical-suppliers-oman"
        canonical="https://gcoman.com/chemical-suppliers-oman"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-suppliers-oman"
        cssSelector={["h1", "h2", ".speakable"]}
      />
      <Navigation />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-28 md:pt-36 pb-16 md:pb-24 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">ISO 9001:2015 Certified • JSRS Registered • ICV Compliant</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Chemical Supplier in Muscat, Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                Global Chemicals LLC is Muscat's trusted chemical supplier, providing water treatment chemicals, industrial lubricants, oilfield chemicals, laboratory reagents, and specialty chemicals across Muscat, Sohar, Salalah, Duqm, and the wider GCC region. ISO 9001:2015 certified, JSRS registered, and ICV compliant — with same-day delivery in Muscat and 1,000+ products in stock.
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

        {/* Muscat & Sohar distribution */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Local Distribution from Muscat to Sohar</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Muscat: stock held in Ghala</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our head office and main warehouse are in Ghala, near Oman LNG, so orders in Muscat ship from stock on the same day. That covers Rusayl Industrial Area, Wadi Kabir, Azaiba, Madinat Sultan Qaboos and Seeb. Caustic soda, PAC, calcium hypochlorite, antiscalants and branded Shell, Mobil and Castrol lubricants go out with their CoA and SDS.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Sohar: 1–2 day delivery up the Batinah coast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sohar Industrial Zone, SOHAR Port and Freezone are served by road from Muscat in 1–2 days, and lubricants are usually delivered the next day. Sohar customers order water-treatment, cooling-water, industrial and oilfield chemicals from the same catalogue of 275+ products, with the same documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Locations */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">Chemical Delivery Across Oman</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { city: 'Muscat', path: '/chemicals/muscat', note: 'Same-day delivery' },
                  { city: 'Sohar', path: '/chemicals/sohar', note: '1-2 day delivery' },
                  { city: 'Salalah', path: '/chemicals/salalah', note: '2-3 day delivery' },
                  { city: 'Duqm', path: '/chemicals/duqm', note: '2-3 day delivery' },
                  { city: 'Rusayl', path: '/chemicals/rusayl', note: 'Same-day delivery' },
                ].map((loc) => (
                  <Link key={loc.city} to={loc.path} className="p-4 logo-gradient-border rounded-lg text-center hover:shadow-sm transition-all group">
                    <p className="font-semibold text-foreground group-hover:text-primary">{loc.city}</p>
                    <p className="text-xs text-muted-foreground mt-1">{loc.note}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Product-Specific Landing Pages */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-4">Product-Specific Chemical Guides in Oman</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Caustic Soda Supplier Oman', path: '/chemical-supplier/caustic-soda-oman', note: 'Flakes, Prills & Liquid NaOH' },
                  { label: 'Nitric Acid Supplier Oman', path: '/chemical-supplier/nitric-acid-oman', note: '68% HNO3 — Industrial, Food & Lab' },
                  { label: 'Hydrochloric Acid Supplier Oman', path: '/chemical-supplier/hydrochloric-acid-oman', note: 'HCl 30–33% — Carboy to Bulk Tanker' },
                  { label: 'Laboratory Chemicals Supplier Oman', path: '/chemical-supplier/laboratory-chemicals-oman', note: 'ACS, HPLC & Molecular-Biology Reagents' },
                  { label: 'Fertilizer Supplier Oman', path: '/chemical-supplier/fertilizers-oman', note: 'Urea, DAP, MOP, Calcium Nitrate, NPK' },
                  { label: 'Sodium Hypochlorite Supplier Oman', path: '/chemical-supplier/sodium-hypochlorite-oman', note: 'Municipal, Food, Bleach & Pool Grades' },
                  { label: 'Oilfield Chemicals Supplier Oman', path: '/chemical-supplier/oilfield-chemicals-oman', note: 'Drilling, Brines, Gas Treating — JSRS' },
                  { label: 'Chemical Suppliers Middle East', path: '/chemical-suppliers-middle-east', note: 'Export to UAE, KSA, Qatar & GCC' },
                  { label: 'Water Treatment Chemicals', path: '/products/water-treatment', note: 'PAC, Hypochlorite, Antiscalants' },
                  { label: 'Shell / Mobil / Castrol Lubricants', path: '/products/lubricants', note: 'Authorised Oman Distributor' },
                  { label: 'Oilfield Chemicals — JSRS Certified', path: '/products/oilfield', note: 'PDO, OQ, OPAL Approved' },
                  { label: 'Swimming Pool Chemicals Oman', path: '/products/swimming-pool', note: 'Muscat Hotel & Villa Pools' },
                ].map((item) => (
                  <Link key={item.path} to={item.path} className="p-4 logo-gradient-border rounded-lg hover:shadow-sm transition-all group">
                    <p className="font-semibold text-foreground group-hover:text-primary text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                  </Link>
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
