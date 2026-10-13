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
  },
  {
    question: "Which regulatory registrations do imported chemicals need in GCC countries?",
    answer: "Each market has its own import-control regime, and we prepare the required documentation for all of them: SASO/SABER product registration for Saudi Arabia, MOIAT/ESMA conformity for the UAE, KUCAS verification for Kuwait, QatarEnergy vendor qualification for Qatar, and GOEIC/Nafeza pre-clearance for Egypt. Our export team supplies SABER-ready test reports, GCC preferential-origin certificates, and Arabic SDS packs so your consignment clears customs without delays."
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
        title="GCC Chemical Exporter Oman | UAE, Saudi & Middle East Supply"
        description="GCC chemical exporter from Oman to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. 3–7 day road freight, Arabic SDS, CoA, CoO & SASO/SABER documentation."
        keywords="GCC chemical exporter, industrial chemical supplier UAE Saudi Arabia, chemical exporter Oman UAE, chemical supplier Middle East, chemical supplier Oman to Dubai, chemical exporter Oman Saudi Arabia, chemical supplier Oman Qatar Kuwait Bahrain, chemical supplier Iraq Baghdad Basra, chemical supplier Jordan Amman, chemical supplier Egypt Cairo Alexandria, chemical export from Oman GCC, water treatment chemicals Middle East, oilfield chemicals Middle East, industrial chemicals export Oman, caustic soda exporter Oman UAE"
        ogTitle="Chemical Supplier & Exporter to the Middle East | Global Chemicals LLC"
        ogDescription="ISO 9001 & JSRS certified — Global Chemicals LLC exports water treatment, industrial, oilfield & lab chemicals from Oman across the Middle East, with full Arabic documentation."
        ogUrl="https://gcoman.com/chemical-suppliers-middle-east"
        canonical="https://gcoman.com/chemical-suppliers-middle-east"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-suppliers-middle-east"
        cssSelector={["h1", "h2", ".speakable"]}
      />
      <Navigation />

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
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
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

        {/* Procurement quick-reference: lead times, incoterms, documentation */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Export Lead Times, Incoterms &amp; Documentation
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto speakable">
                What a procurement team needs before raising a PO: typical road-freight transit
                from our Muscat warehouse, the incoterms we quote on, and the customs paperwork
                shipped with every consignment.
              </p>

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Chemical export lead times and documentation by Middle East destination
                  </caption>
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Destination</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Road freight lead time</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Incoterms quoted</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      ['UAE — Dubai, Abu Dhabi, Sharjah', '3–5 business days', 'FOB Muscat / CIF / DAP', 'Air freight to Dubai or Abu Dhabi within 24 hours for urgent orders; Fujairah can be same-day'],
                      ['Saudi Arabia — Riyadh, Jeddah, Dammam, Jubail', '5–7 business days', 'FOB Muscat / CIF / DAP', 'SASO compliance where applicable; CoO attested by Oman Chamber of Commerce'],
                      ['Qatar — Doha, Ras Laffan', '3–5 business days', 'FOB / CIF / DAP, QAR or USD', 'Experience with Ras Laffan Security Clearance and QatarEnergy vendor qualification'],
                      ['Kuwait — Kuwait City, Shuaiba, Ahmadi', '4–6 business days', 'FOB Muscat / CIF Shuwaikh, KWD or USD', 'KOC and KNPC contractor documentation supported'],
                      ['Bahrain — Manama, Hidd, Sitra', '4–7 business days', 'FOB / CIF / DAP, USD', 'Sea freight option for bulk volumes'],
                      ['Iraq, Jordan, Egypt', 'Quoted per consignment', 'FOB / CIF / DAP, USD', 'Air freight available for urgent requirements; Arabic SDS supplied'],
                    ].map(([dest, lead, incoterm, notes]) => (
                      <tr key={dest} className="align-top">
                        <th scope="row" className="px-4 py-3 font-medium text-foreground">{dest}</th>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{lead}</td>
                        <td className="px-4 py-3 text-muted-foreground">{incoterm}</td>
                        <td className="px-4 py-3 text-muted-foreground">{notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card className="p-6">
                  <h3 className="font-bold text-foreground mb-3">Documents shipped with every order</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      'Certificate of Analysis (CoA) per batch',
                      'Safety Data Sheet (SDS/MSDS) in Arabic and English',
                      'Technical Data Sheet (TDS)',
                      'Certificate of Origin attested by Oman Chamber of Commerce',
                      'Commercial invoice and packing list',
                      'Halal certificate where applicable',
                    ].map((doc) => (
                      <li key={doc} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-6">
                  <h3 className="font-bold text-foreground mb-3">Supplier qualification proofs</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {[
                      'ISO 9001:2015 certified quality management system',
                      'JSRS (Joint Supplier Registration System) registered for oil &amp; gas supply',
                      'ICV compliant for Oman in-country value scoring',
                      'Supplying PDO, OQ, Aramco, ADNOC and QatarEnergy contractors',
                    ].map((proof) => (
                      <li key={proof} className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{proof.replace('&amp;', '&')}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-5 gap-2 w-full">
                    <Link to="/contact">
                      Request a quote — reply within 24 hours <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Country-by-country customs & regulatory compliance */}
        <section className="py-16 md:py-20 bg-muted/30 border-y">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Customs &amp; Regulatory Compliance by Country
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                Every GCC and wider Middle East destination has its own import-control regime.
                We prepare the registration certificates and conformity paperwork each market
                requires so your consignment clears without delays.
              </p>
              <div className="overflow-x-auto rounded-xl border bg-background">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Chemical import compliance requirements by Middle East country
                  </caption>
                  <thead className="bg-muted/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Market</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Regulatory regime</th>
                      <th scope="col" className="px-4 py-3 font-semibold">How we support your import</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      ['UAE', 'MOIAT / ESMA conformity, Dubai Municipality registration for regulated chemicals', 'Emirates-compliant labeling, product certificates, and CoA packs prepared for JAFZA, KIZAD, and Sharjah industrial clearances'],
                      ['Saudi Arabia', 'SASO / SABER product registration, SFDA for applicable products', 'SABER-ready test reports and conformity documents; CoO attested by Oman Chamber of Commerce'],
                      ['Qatar', 'QatarEnergy vendor qualification, Ras Laffan Security Clearance (RLSC)', 'Pre-qualified documentation packs for Ras Laffan and Doha industrial deliveries'],
                      ['Kuwait', 'KUCAS conformity assessment, KOC / KNPC contractor documentation', 'Verification certificates and technical files formatted to KOC and KNPC requirements'],
                      ['Bahrain', 'Bahrain customs declaration via King Fahd Causeway, ALBA / BAPCO contractor qualification', 'GCC preferential-origin paperwork to reduce import duties where eligible'],
                      ['Egypt', 'GOEIC import registration, Nafeza single-window pre-clearance (ACID number)', 'Nafeza-compatible documentation and Halal certification for food-grade shipments'],
                      ['Jordan', 'JFDA requirements for pharma-grade materials, Aqaba free-zone processing', 'Full Arabic SDS and tariff-code guidance under the Jordan–GCC trade agreements'],
                      ['Iraq', 'Iraqi import licensing for hazardous and non-hazardous chemicals', 'LC (letter of credit) support and Arabic documentation packs for Baghdad and Basra consignees'],
                    ].map(([market, regime, support]) => (
                      <tr key={market} className="align-top">
                        <th scope="row" className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{market}</th>
                        <td className="px-4 py-3 text-muted-foreground">{regime}</td>
                        <td className="px-4 py-3 text-muted-foreground">{support}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

        {/* Country-Specific Supply Sections */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Chemical Supply by Country</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Dedicated chemical supply to each GCC market — with country-specific documentation, logistics, and technical support</p>
              </div>

              {/* Product+geo hubs: the pages with spec tables and pack ranges.
                  Linked here so the Middle East page vouches for them — on
                  2026-10-13 Google knew the nitric and HCl hubs only from the
                  sitemap. */}
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/chemical-supplier/nitric-acid-oman">Nitric acid 68% — GCC supply guide</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/chemical-supplier/hydrochloric-acid-oman">Hydrochloric acid 30–33% — GCC supply guide</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/chemical-supplier/caustic-soda-oman">Caustic soda — GCC supply guide</Link>
                </Button>
              </div>

              {/* UAE */}
              <div className="grid md:grid-cols-12 gap-8 items-start border-t pt-12">
                <div className="md:col-span-1 text-4xl">🇦🇪</div>
                <div className="md:col-span-11">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Chemical Supplier in Dubai &amp; Abu Dhabi, UAE</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Global Chemicals LLC is a trusted chemical supplier exporting to Dubai, Abu Dhabi, Sharjah, Fujairah, and all UAE Emirates. Our Muscat-to-UAE supply chain delivers water treatment chemicals, industrial lubricants (Shell, Mobil, Castrol), laboratory reagents, oilfield chemicals, and construction chemicals within 3–5 business days via road freight. For urgent requirements, air freight from Muscat delivers to Dubai or Abu Dhabi within 24 hours.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    We regularly supply to clients in Jebel Ali Free Zone (JAFZA), Dubai Industrial City, KIZAD (Khalifa Industrial Zone Abu Dhabi), Abu Dhabi Industrial City, and Sharjah industrial areas. Products are exported with full UAE customs documentation: Certificate of Analysis (CoA), Safety Data Sheet (SDS/MSDS), Certificate of Origin, commercial invoice, and packing list. FOB Muscat and CIF Dubai/Abu Dhabi pricing available.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <Link to="/chemicals/uae" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical supplier for UAE <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/chemicals/dubai" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical suppliers in Dubai <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/chemicals/abu-dhabi" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical suppliers in Abu Dhabi <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/chemicals/sharjah" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical suppliers in Sharjah <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Saudi Arabia */}
              <div className="grid md:grid-cols-12 gap-8 items-start border-t pt-12">
                <div className="md:col-span-1 text-4xl">🇸🇦</div>
                <div className="md:col-span-11">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Chemical Supplier in Saudi Arabia — Riyadh, Jeddah, Dammam</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    We export industrial and specialty chemicals to all regions of Saudi Arabia, including Riyadh, Jeddah, Dammam, Al Khobar, Jubail Industrial City, and KAEC. Our chemical portfolio serves Saudi Aramco-approved contractors, SABIC facilities, National Water Company (NWC) water treatment plants, pharmaceutical manufacturers, and general industry across the Kingdom. Saudi Arabia delivery typically takes 5–7 business days by road freight.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    We provide full Saudi import documentation: Certificate of Origin (attested by Oman Chamber of Commerce), Safety Data Sheet in Arabic and English, Certificate of Analysis, SASO compliance where applicable, commercial invoice, and packing list. Products include PAC, caustic soda, antiscalants, corrosion inhibitors, demulsifiers, H2S scavengers, and 1,000+ other chemicals.
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <Link to="/chemicals/saudi-arabia" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical supplier for Saudi Arabia <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/chemicals/riyadh" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical suppliers in Riyadh <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/chemicals/jeddah" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical suppliers in Jeddah <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/chemicals/dammam" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical suppliers in Dammam <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/chemicals/jubail" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                      Chemical suppliers in Jubail <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Qatar */}
              <div className="grid md:grid-cols-12 gap-8 items-start border-t pt-12">
                <div className="md:col-span-1 text-4xl">🇶🇦</div>
                <div className="md:col-span-11">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Chemical Supplier in Qatar — Doha &amp; Ras Laffan</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Qatar's LNG and petrochemical sector is among the world's largest, and Global Chemicals LLC is positioned to serve QatarEnergy contractors and industrial operators in Ras Laffan Industrial City, Doha, and across Qatar. We supply oilfield chemicals (corrosion inhibitors, hydrate inhibitors, scale inhibitors, demulsifiers), water treatment chemicals, industrial lubricants, and laboratory reagents. Road freight from Muscat to Doha takes 3–5 business days.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Our team has experience navigating Ras Laffan Security Clearance (RLSC) requirements and QatarEnergy vendor qualification documentation. We provide full CoA, SDS, TDS, and Certificate of Origin documentation for Qatar customs. Competitive QAR and USD pricing available with FOB, CIF, and DAP incoterms.
                  </p>
                  <Link to="/chemicals/doha" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                    Chemical suppliers in Doha &amp; Qatar <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Kuwait */}
              <div className="grid md:grid-cols-12 gap-8 items-start border-t pt-12">
                <div className="md:col-span-1 text-4xl">🇰🇼</div>
                <div className="md:col-span-11">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Chemical Supplier in Kuwait — Kuwait City &amp; Shuaiba</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Kuwait's oil refining (KNPC), desalination, and manufacturing sectors require a reliable chemical supply chain. Global Chemicals LLC exports water treatment chemicals, refinery production chemicals, industrial lubricants, and laboratory reagents to Kuwait City, Shuaiba Industrial Area, and Ahmadi. We have experience with Kuwait Oil Company (KOC) contractor documentation requirements and KNPC supply qualification processes. Road freight delivery is 4–6 business days.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Products available include Poly Aluminium Chloride (PAC), caustic soda, sodium hypochlorite, antiscalants for Kuwait's desalination plants, corrosion inhibitors for refinery operations, and Shell/Mobil lubricants. We offer FOB Muscat and CIF Shuwaikh Port pricing in KWD and USD. Full Arabic and English documentation provided for Kuwait customs clearance.
                  </p>
                  <Link to="/chemicals/kuwait-city" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                    Chemical suppliers in Kuwait City <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Bahrain */}
              <div className="grid md:grid-cols-12 gap-8 items-start border-t pt-12">
                <div className="md:col-span-1 text-4xl">🇧🇭</div>
                <div className="md:col-span-11">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Chemical Supplier in Bahrain — Manama, Hidd &amp; Sitra</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Bahrain's industrial sectors — led by ALBA (Aluminium Bahrain), BAPCO refinery, and Hidd/Sitra industrial areas — require high-quality specialty chemicals. Global Chemicals LLC exports aluminum processing chemicals, refinery chemicals, water treatment solutions, industrial lubricants, and laboratory reagents to Bahrain. Road freight via Saudi Arabia delivers within 3–5 business days to Manama and surrounding industrial zones.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    We support ALBA and BAPCO contractor qualification with full documentation: Certificate of Analysis, Safety Data Sheet (Arabic and English), Certificate of Origin, Halal certificates where applicable, and commercial documentation for Bahrain customs. GCC preferential origin applies where eligible, reducing import duties for Bahrain customers.
                  </p>
                  <Link to="/chemicals/bahrain" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                    Chemical suppliers in Bahrain <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Iraq */}
              <div className="grid md:grid-cols-12 gap-8 items-start border-t pt-12">
                <div className="md:col-span-1 text-4xl">🇮🇶</div>
                <div className="md:col-span-11">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Chemical Supplier in Iraq — Baghdad, Basra &amp; Kirkuk</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Iraq is one of the world's largest oil producers, and its upstream sector — centred around Basra, Kirkuk, and the southern oil fields — demands a reliable supply of oilfield chemicals. Global Chemicals LLC exports corrosion inhibitors, scale inhibitors, H2S scavengers, demulsifiers, and drilling chemicals to Iraq, alongside water treatment chemicals and industrial process chemicals for Baghdad and other urban centres. Air freight from Muscat or road freight via Kuwait provides flexible logistics options with lead times of 5–8 business days.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    We provide full Arabic-language documentation for Iraqi customs compliance: Safety Data Sheet in Arabic, Certificate of Origin attested by Oman Chamber of Commerce, Certificate of Analysis, and commercial invoice. USD pricing is standard; we can accommodate letters of credit (LC) for Iraqi importers. Our team is experienced in navigating Iraqi import procedures for hazardous and non-hazardous chemicals.
                  </p>
                  <Link to="/chemicals/baghdad" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                    Chemical suppliers in Baghdad &amp; Iraq <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Jordan */}
              <div className="grid md:grid-cols-12 gap-8 items-start border-t pt-12">
                <div className="md:col-span-1 text-4xl">🇯🇴</div>
                <div className="md:col-span-11">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Chemical Supplier in Jordan — Amman, Zarqa &amp; Aqaba</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Jordan's diverse industrial base — pharmaceutical manufacturing in Amman, heavy industry in Zarqa, and port-linked trade through Aqaba — creates demand for a broad range of specialty chemicals. Global Chemicals LLC exports pharmaceutical-grade reagents, water treatment chemicals (PAC, antiscalants, biocides), laboratory chemicals, agricultural chemicals, and mining process chemicals to Jordan. Aqaba's free zone offers efficient import processing, and road freight from Oman via Saudi Arabia delivers within 5–7 business days.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    We provide full documentation for Jordanian customs: Certificate of Origin, Safety Data Sheet in Arabic, Certificate of Analysis, and commercial invoice. Jordan has a Free Trade Agreement with several GCC states that may reduce duties for eligible Omani-origin goods. Our team can advise on applicable tariff codes and duty exemptions for your specific chemicals.
                  </p>
                  <Link to="/chemicals/amman" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                    Chemical suppliers in Amman, Jordan <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Egypt */}
              <div className="grid md:grid-cols-12 gap-8 items-start border-t pt-12">
                <div className="md:col-span-1 text-4xl">🇪🇬</div>
                <div className="md:col-span-11">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Chemical Supplier in Egypt — Cairo, Alexandria &amp; Suez</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    Egypt is the largest non-GCC chemical market in the Middle East, with strong demand from food and beverage manufacturing, pharmaceuticals, textiles, petrochemicals, and agriculture. Global Chemicals LLC exports food-grade chemicals, pharmaceutical API intermediates and excipients, water treatment chemicals, agricultural inputs (fertilizers and crop protection), and industrial process chemicals to Egypt. Sea freight from Salalah or air freight from Muscat to Cairo or Alexandria provides flexible delivery options, with typical lead times of 7–12 business days.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                    We provide full Arabic documentation for Egyptian customs and GOEIC (General Organization for Export and Import Control) clearance: Certificate of Analysis, Safety Data Sheet, Certificate of Origin attested by the Oman Chamber of Commerce, Halal certificates for food-grade products, and commercial invoice. We can arrange CIF Alexandria, CIF Port Said, or FOB Salalah/Muscat pricing in USD or EGP-equivalent quotes.
                  </p>
                  <Link to="/chemicals/cairo" className="inline-flex items-center gap-1 text-primary font-medium hover:underline">
                    Chemical suppliers in Cairo, Egypt <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
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
