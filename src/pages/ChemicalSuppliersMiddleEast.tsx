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
  ArrowRight, Award, Globe2, Users, ChevronDown, MapPin
} from 'lucide-react';

const faqs = [
  {
    question: "Does Global Chemicals LLC supply chemicals to the UAE?",
    answer: "Yes, Global Chemicals LLC exports chemicals to all UAE Emirates — Dubai, Abu Dhabi, Sharjah, Fujairah, Ras Al Khaimah, and Ajman. We supply water treatment chemicals, industrial lubricants, laboratory reagents, and oilfield chemicals. Orders are typically fulfilled within 3-5 business days via road freight or air freight for urgent requirements. Fujairah is our fastest UAE delivery — same-day possible given the shared Oman-UAE border."
  },
  {
    question: "Can Global Chemicals supply chemicals to Saudi Arabia?",
    answer: "Absolutely. We supply chemicals to Saudi Arabia including Riyadh, Jeddah, Dammam, Al Khobar, Jubail Industrial City, and KAEC. Our portfolio covers water treatment chemicals, oil & gas production chemicals, industrial lubricants, and laboratory reagents suited for Saudi Arabia's petrochemical and manufacturing sectors. Standard lead time is 5-7 business days. Full SASO and Saudi customs documentation provided."
  },
  {
    question: "Do you export chemicals to Qatar, Kuwait, and Bahrain?",
    answer: "Yes, we serve the entire GCC region. We supply chemicals to Doha (Qatar), Kuwait City (Kuwait), and Manama (Bahrain) with lead times of 4-7 business days. We quote in USD, handle all export documentation including MSDS, Certificate of Origin, and commercial invoices, and can arrange both road freight and sea freight depending on order size and urgency."
  },
  {
    question: "Do you export chemicals to Iraq, Jordan, and Egypt?",
    answer: "Yes. Beyond the GCC, we export chemicals to Iraq (Baghdad, Basra — particularly oilfield chemicals for Iraq's upstream sector), Jordan (Amman, Zarqa, Aqaba — pharmaceutical and water treatment chemicals), and Egypt (Cairo, Alexandria — industrial, food-grade, and agricultural chemicals). Air freight is available for urgent requirements. Arabic SDS and documentation are provided for all non-GCC destinations."
  },
  {
    question: "What certifications make Global Chemicals LLC qualified for Middle East supply?",
    answer: "Global Chemicals LLC holds ISO 9001:2015 certification, JSRS (Joint Supplier Registration System) certification for oil & gas supply, and ICV compliance. We provide full documentation including Safety Data Sheets in Arabic and English, Certificates of Analysis, Technical Data Sheets, Halal certificates (where applicable), and Certificate of Origin attested by Oman Chamber of Commerce — all required for GCC and wider Middle East import clearance."
  },
  {
    question: "What chemicals does Global Chemicals supply across the Middle East?",
    answer: "Our Middle East export portfolio includes: water treatment chemicals (PAC, caustic soda, antiscalants, biocides, chlorine), industrial lubricants (Shell, Mobil, Castrol), laboratory chemicals (AR grade reagents, HPLC solvents), oilfield chemicals (corrosion inhibitors, demulsifiers, H2S scavengers, scale inhibitors), swimming pool chemicals, construction chemicals, agricultural fertilizers and crop protection chemicals, food-grade chemicals, and pharmaceutical reagents."
  },
  {
    question: "How do I get a quote for chemical export to the Middle East?",
    answer: "Contact our export team by email at sales@gcoman.com, call +968-93754388, or use WhatsApp for fast quotes. Include the chemical name or CAS number, required quantity, delivery country and city, and your preferred incoterms (FOB/CIF/DAP). We typically provide quotes within 24 hours with competitive pricing and lead times."
  }
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers in Middle East', url: 'https://gcoman.com/chemical-suppliers-middle-east' }
];

const gccCountries = [
  {
    flag: '🇴🇲',
    country: 'Oman (HQ)',
    cities: 'Muscat, Sohar, Salalah, Duqm',
    highlight: 'Head Office — Same-day delivery available',
    slug: 'muscat'
  },
  {
    flag: '🇦🇪',
    country: 'UAE',
    cities: 'Dubai, Abu Dhabi, Sharjah, Fujairah, RAK',
    highlight: 'Petrochemicals, Construction, Manufacturing',
    slug: 'dubai'
  },
  {
    flag: '🇸🇦',
    country: 'Saudi Arabia',
    cities: 'Riyadh, Jeddah, Dammam, Jubail',
    highlight: 'Oil & Gas, Refining, Petrochemicals',
    slug: 'riyadh'
  },
  {
    flag: '🇶🇦',
    country: 'Qatar',
    cities: 'Doha, Ras Laffan',
    highlight: 'LNG, Petrochemicals, Infrastructure',
    slug: 'doha'
  },
  {
    flag: '🇰🇼',
    country: 'Kuwait',
    cities: 'Kuwait City, Shuaiba',
    highlight: 'Oil Refining, Desalination, Manufacturing',
    slug: 'kuwait-city'
  },
  {
    flag: '🇧🇭',
    country: 'Bahrain',
    cities: 'Manama, Hidd, Sitra',
    highlight: 'Aluminium, Refining, Financial Services',
    slug: 'bahrain'
  },
  {
    flag: '🇮🇶',
    country: 'Iraq',
    cities: 'Baghdad, Basra, Kirkuk, Erbil',
    highlight: 'Oil & Gas Upstream, Infrastructure, Industry',
    slug: 'baghdad'
  },
  {
    flag: '🇯🇴',
    country: 'Jordan',
    cities: 'Amman, Zarqa, Aqaba',
    highlight: 'Pharma, Water Treatment, Mining, Agriculture',
    slug: 'amman'
  },
  {
    flag: '🇪🇬',
    country: 'Egypt',
    cities: 'Cairo, Alexandria, Suez, Port Said',
    highlight: 'Pharma, Food Industry, Petrochemicals, Agriculture',
    slug: 'cairo'
  }
];

const sections = [
  {
    icon: Droplets,
    title: "Water Treatment Chemicals — GCC & Middle East",
    content: "Water treatment is mission-critical across the GCC, where desalination provides the primary source of potable water. Global Chemicals LLC supplies a comprehensive range of water treatment chemicals including Poly Aluminium Chloride (PAC), caustic soda, sodium hypochlorite, antiscalants, scale inhibitors, biocides, and corrosion inhibitors. We serve desalination plants, wastewater treatment facilities, cooling towers, and industrial water systems in Oman, UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain."
  },
  {
    icon: Fuel,
    title: "Oil & Gas Chemical Solutions — Middle East",
    content: "The Middle East hosts some of the world's largest oil and gas operations. Global Chemicals LLC is an ISO 9001 and JSRS-certified supplier of oilfield chemicals including corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers, drilling chemicals, completion fluids, and production chemicals. We serve upstream exploration, midstream processing, and downstream refining operations across Oman (PDO, OQ), Saudi Arabia (Saudi Aramco contractors), Qatar (QatarEnergy contractors), and UAE (ADNOC contractors)."
  },
  {
    icon: Factory,
    title: "Industrial Chemicals — GCC Manufacturing Sector",
    content: "The GCC's ambitious industrial diversification — from Saudi Arabia's Vision 2030 to the UAE's industrial strategy — demands reliable chemical supply chains. Global Chemicals LLC supplies a wide portfolio of industrial chemicals including solvents, acids, alkalis, specialty chemicals, and process chemicals to manufacturing facilities, industrial zones, and free zones across the Middle East. We partner with leading global manufacturers to ensure consistent quality and competitive pricing."
  },
  {
    icon: HardHat,
    title: "Construction Chemicals — Middle East Projects",
    content: "The Middle East's infrastructure boom continues at pace, from Saudi Arabia's NEOM and Red Sea project to UAE's Abu Dhabi construction pipeline. Global Chemicals LLC supplies construction chemicals including concrete admixtures, waterproofing compounds, sealants, epoxy materials, and surface treatments. Our products meet international standards and are formulated for extreme Middle East temperature conditions."
  },
  {
    icon: Leaf,
    title: "Laboratory & Analytical Chemicals",
    content: "Research institutions, QC laboratories, pharmaceutical companies, and educational institutions across the Middle East rely on high-purity analytical-grade chemicals. Global Chemicals LLC supplies AR grade laboratory reagents, HPLC solvents, titration solutions, buffer solutions, indicators, and specialty analytical chemicals. We maintain proper cold-chain and packaging for temperature-sensitive materials across the GCC."
  }
];

const ChemicalSuppliersMiddleEast = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Supplier Middle East | Oman UAE Saudi Arabia Iraq Jordan Egypt | Global Chemicals LLC"
        description="Global Chemicals LLC — ISO 9001 certified chemical exporter from Oman supplying UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Iraq, Jordan & Egypt. Water treatment, industrial, oilfield & lab chemicals. Full Arabic documentation. Get a free export quote."
        keywords="chemical exporter Oman UAE, chemical supplier Middle East, chemical supplier Oman to Dubai, chemical exporter Oman Saudi Arabia, chemical supplier Oman Qatar Kuwait Bahrain, chemical supplier Iraq Baghdad Basra, chemical supplier Jordan Amman, chemical supplier Egypt Cairo Alexandria, chemical export from Oman GCC, water treatment chemicals Middle East, oilfield chemicals Middle East, industrial chemicals export Oman, caustic soda exporter Oman UAE"
        ogTitle="Chemical Supplier Middle East | UAE, Saudi Arabia, Iraq, Jordan, Egypt | Global Chemicals LLC"
        ogDescription="ISO 9001 certified chemical exporter from Oman supplying all Middle East markets — UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Iraq, Jordan & Egypt. Industrial, water treatment & oilfield chemicals with full Arabic documentation."
        ogUrl="https://gcoman.com/chemical-suppliers-middle-east"
        canonical="https://gcoman.com/chemical-suppliers-middle-east"
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
              <Badge className="mb-4 text-sm px-4 py-1.5">
                ISO 9001:2015 Certified • JSRS Registered • GCC Export Ready
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Chemical Exporter from Oman to the Middle East & GCC
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Global Chemicals LLC is a leading chemical exporter headquartered in Muscat, Oman, supplying industries across the entire Middle East — UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Iraq, Jordan, and Egypt. ISO 9001:2015 certified, JSRS registered, with 1,000+ products and full export documentation (CoA, SDS in Arabic & English, Certificate of Origin) ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'get_quote_me_landing')}>
                  <Link to="/contact">
                    Get a Free Export Quote <ArrowRight className="w-5 h-5" />
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
                { icon: Award, label: '10+ Years Experience', value: 'Established' },
                { icon: Factory, label: 'Products Available', value: '1,000+' },
                { icon: Users, label: 'GCC Clients Served', value: '200+' },
                { icon: Globe2, label: 'Countries Served', value: '9 ME' },
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

        {/* GCC Countries Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Countries We Serve
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                We supply chemicals to all GCC countries and key wider Middle East markets — with competitive pricing, full Arabic documentation, and reliable logistics
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gccCountries.map((country, i) => (
                  <Card key={i} className="p-6 hover:shadow-lg transition-shadow border hover:border-primary/30">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{country.flag}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{country.country}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {country.cities}
                        </p>
                        <p className="text-xs text-primary mt-2 font-medium">{country.highlight}</p>
                        <Link
                          to={`/chemicals/${country.slug}`}
                          className="text-sm text-primary hover:underline mt-3 inline-flex items-center gap-1"
                        >
                          View details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industry Sections */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-16">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Chemical Solutions for Middle East Industries
              </h2>
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
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{section.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">{section.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Global Chemicals LLC for Middle East Supply?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  'ISO 9001:2015 certified quality management',
                  'JSRS certified for oil & gas sector',
                  'ICV compliant — Oman-registered exporter',
                  '1,000+ products from global manufacturers',
                  'Export documentation: CoA, SDS, Certificate of Origin',
                  'FOB/CIF/DAP incoterms available',
                  'Free technical consultation & support',
                  'Competitive export pricing with volume discounts',
                  'Experienced GCC logistics & customs clearance support',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-muted/40 rounded-lg border">
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
                Request a Middle East Export Quote
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you need water treatment chemicals in Dubai, oilfield chemicals in Riyadh, or laboratory reagents in Doha — our team provides competitive pricing and reliable supply across the GCC.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'get_quote_me_bottom')}>
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
                Frequently Asked Questions — Chemical Supply Across the Middle East
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

export default ChemicalSuppliersMiddleEast;
