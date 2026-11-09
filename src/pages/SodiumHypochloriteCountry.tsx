import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Truck, FileCheck2, Factory, ThermometerSun } from 'lucide-react';

/**
 * Sodium hypochlorite, one page per GCC market where we already sell it (2026-11-08).
 *
 * Why: Zoho Books for the 12 months to 2026-11-08 puts sodium hypochlorite
 * second by revenue (after nitric acid), with roughly three quarters of it
 * invoiced to buyers in the UAE and Bahrain, yet the site had no page naming
 * either country for the product, and "sodium hypochlorite suppliers in uae"
 * is a GCC autocomplete phrasing (gcc-keyword-demand-2026-10-27.md). Same
 * condition as NitricAcidCountry.tsx: absent, not outranked.
 *
 * Scope is deliberately closed: one product, the two markets with proven
 * sales. Add a country only on the same evidence (invoiced demand), never as a
 * product × city template (HANDOFF / number-one-plan hard limits). Customers
 * are never named; industries are named as markets.
 *
 * Every lead time, route and document restates what the site already publishes
 * (NitricAcidCountry.tsx lanes, which use the same trucks); grades, strengths
 * and packs restate the product JSON files and the SodiumHypochloriteOman hub.
 * Strength loss in heat is the one export-specific fact, and the page states
 * it as advice plus the dispatch CoA, not as a strength-on-arrival promise.
 */

export type HypoCountryKey = 'uae' | 'bahrain';

type CountryData = {
  name: string;
  inName: string;
  title: string;
  description: string;
  intro: string;
  leadTime: string;
  route: string;
  points: { place: string; time: string }[];
  zones: string[];
  industries: string[];
  documents: string;
  faqs: { question: string; answer: string }[];
  locationPage?: string;
};

const COUNTRIES: Record<HypoCountryKey, CountryData> = {
  uae: {
    name: 'UAE',
    inName: 'the UAE',
    title: 'Sodium Hypochlorite Supplier UAE | NaOCl 12–15% from Oman',
    description:
      'Sodium hypochlorite 12–15% for Abu Dhabi, Dubai, Sharjah & Fujairah from Muscat: jerricans, drums & IBCs. Fujairah next day, Dubai 3–5 days. CoA, SDS, GCC CoO.',
    intro:
      'Global Chemicals LLC supplies sodium hypochlorite (NaOCl) to buyers across the United Arab Emirates from Muscat: 12–15% for water treatment, bleach manufacturing and pools, and food-contact grade for sanitation. The UAE is our shortest export lane: the east coast is the same or next day by road and Abu Dhabi, Dubai and Sharjah three to five business days, short enough to move a product that loses strength in storage.',
    leadTime: 'Fujairah same or next day · Abu Dhabi, Dubai, Sharjah 3–5 business days',
    route: 'By road from Muscat, mainly through the Al Wajajah–Hatta crossing, and cleared at the UAE border under GCC customs procedures.',
    points: [
      { place: 'Fujairah & east coast', time: 'same or next day by road' },
      { place: 'Abu Dhabi & ICAD', time: '3–5 business days' },
      { place: 'Dubai & Sharjah', time: '3–5 business days' },
      { place: 'Ras Al Khaimah & northern emirates', time: '3–5 business days' },
    ],
    zones: ['KEZAD (incl. ICAD)', 'JAFZA', 'Dubai Industrial City', 'Sharjah SAIF Zone', 'Fujairah Free Zone', 'RAKEZ'],
    industries: [
      'Bleach and detergent manufacturers — 12–15% concentrate diluted to household strength',
      'Water, desalination and sewage treatment plants — disinfection and residual chlorine',
      'District cooling and cooling towers — biofouling and Legionella control',
      'Hotels, pools and facility management — pool and water-tank chlorination',
      'Food and beverage plants — sanitising surfaces and equipment with food-contact grade',
    ],
    documents:
      'Each load travels with a Certificate of Analysis giving the available chlorine at dispatch, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC Certificate of Origin. For free-zone delivery, send the zone and company licence details and the gate paperwork is prepared before dispatch.',
    faqs: [
      {
        question: 'How fast can you deliver sodium hypochlorite to Abu Dhabi or Dubai?',
        answer:
          'Abu Dhabi, Dubai and Sharjah are three to five business days from Muscat on scheduled departures, with a dedicated truck quoted for urgent loads. Fujairah and the east coast are the same or next day by road.',
      },
      {
        question: 'Does sodium hypochlorite lose strength on the way to the UAE?',
        answer:
          'Hypochlorite decomposes faster when warm, so time and heat matter more than distance. The 12–15% grade loses strength gradually over roughly three to six months at 15–20 °C, and within a few weeks in summer heat. The Certificate of Analysis states the available chlorine at dispatch; store the containers closed, shaded or indoors on arrival, and order quantities you will use within weeks rather than months.',
      },
      {
        question: 'Can you supply 12–15% sodium hypochlorite for bleach manufacturing in the UAE?',
        answer:
          'Yes. The bleach-manufacturing grade is 12–15% w/v available chlorine (120–150 g/L as Cl2) with 0.5–1.5% free caustic as stabiliser, in 25 L jerricans, 200 L HDPE drums and 1,000 L IBCs. Repackers dilute it with clean water to household strength.',
      },
      {
        question: 'Is there customs duty on sodium hypochlorite shipped from Oman to the UAE?',
        answer:
          'Oman and the UAE are both in the GCC customs union, so goods of GCC origin accompanied by a GCC Certificate of Origin are cleared free of customs duty; import VAT is still accounted for by the importer. We arrange the GCC Certificate of Origin with every consignment.',
      },
    ],
    locationPage: '/chemicals/uae',
  },
  bahrain: {
    name: 'Bahrain',
    inName: 'Bahrain',
    title: 'Sodium Hypochlorite Supplier Bahrain | NaOCl 12–15%, 3–5 Days',
    description:
      'Sodium hypochlorite 12–15% for Manama, Sitra & Salman Industrial City from Muscat, 3–5 business days via the King Fahd Causeway. Drums, IBCs. CoA, SDS, GCC CoO.',
    intro:
      'Global Chemicals LLC supplies sodium hypochlorite (NaOCl) to Bahrain from Muscat, three to five business days to Manama, Sitra and Salman Industrial City: 12–15% for water treatment, pools and bleach production, and food-contact grade for sanitation. Trucks cross Saudi Arabia under GCC customs transit and enter Bahrain over the King Fahd Causeway with a GCC preferential Certificate of Origin.',
    leadTime: 'Manama, Sitra & Salman Industrial City 3–5 business days',
    route: 'By road from Muscat through Saudi Arabia under GCC customs transit, entering Bahrain over the King Fahd Causeway.',
    points: [
      { place: 'Manama', time: '3–5 business days' },
      { place: 'Sitra', time: '3–5 business days' },
      { place: 'Salman Industrial City (Hidd, BIIP)', time: '3–5 business days' },
    ],
    zones: ['Sitra Industrial Area', 'Bahrain International Investment Park (Hidd)', 'Salman Industrial City', 'Mina Salman', 'Askar'],
    industries: [
      'Water, desalination and power plants — disinfection and residual chlorine',
      'Sewage treatment plants — effluent disinfection',
      'Hotels, pools and facility management — pool and water-tank chlorination',
      'Bleach and cleaning-product makers — 12–15% concentrate',
      'Food and beverage plants — sanitising with food-contact grade',
    ],
    documents:
      'Every load carries a Certificate of Analysis giving the available chlorine at dispatch, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC preferential Certificate of Origin for clearance at the King Fahd Causeway.',
    faqs: [
      {
        question: 'How long does sodium hypochlorite take from Oman to Bahrain?',
        answer:
          'Three to five business days by road from Muscat to Manama, Sitra and Salman Industrial City, crossing Saudi Arabia under GCC customs transit and entering over the King Fahd Causeway.',
      },
      {
        question: 'Which sodium hypochlorite grade do Bahrain hotels and pools use?',
        answer:
          'The 12–15% pool grade, dosed to hold free chlorine in the usual pool range, in 25 L, 60 L or 200 L containers or 1,000 L IBCs for larger sites. Water and sewage plants use the same 12–15% strength in IBCs, with bulk tanker loads quoted on request; food plants use the food-contact grade (5–12.5% available chlorine).',
      },
      {
        question: 'Do you issue a GCC preferential Certificate of Origin for Bahrain?',
        answer:
          'Yes. Every consignment to Bahrain carries a GCC preferential Certificate of Origin, together with the Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, and an HS-coded commercial invoice.',
      },
    ],
  },
};

const HYPO_COUNTRY_SLUGS = Object.keys(COUNTRIES) as HypoCountryKey[];

const COMMON_FAQS = (inName: string) => [
  {
    question: `What sodium hypochlorite grades can you supply to ${inName}?`,
    answer:
      'Municipal / water-treatment, bleach-manufacturing and pool grades at 12–15% w/v available chlorine (120–150 g/L as Cl2), and food-contact grade at 5–12.5% available chlorine, all at pH 11–13. CAS 7681-52-9.',
  },
  {
    question: `How is sodium hypochlorite transported to ${inName}?`,
    answer:
      'As UN 1791 hypochlorite solution, Class 8 (corrosive), packing group as stated on the Safety Data Sheet, in UN-approved HDPE jerricans, drums and IBCs with vented closures, kept out of direct sun. It must travel and be stored apart from acids, which release chlorine gas on contact, and from ammonia and ammonium compounds, which form chloramines.',
  },
];

const PACKS = [
  { grade: 'Water treatment (municipal)', strength: '12–15% w/v available chlorine', packs: 'Drums · 1,000 L IBC · bulk on request', link: '/products/water-treatment/sodium-hypochlorite' },
  { grade: 'Bleach manufacturing', strength: '12–15% w/v (120–150 g/L Cl2)', packs: '25 L jerrican · 200 L drum · 1,000 L IBC', link: '/products/soap-detergent/sodium-hypochlorite-12-15-soap' },
  { grade: 'Swimming pool', strength: '12–15% w/v', packs: '25 L · 60 L · 200 L · 1,000 L IBC', link: '/products/swimming-pool/sodium-hypo-chlorite-12-15' },
  { grade: 'Food contact', strength: '5–12.5% available chlorine', packs: '25 L · 60 L · 200 L', link: '/products/food-beverage/sodium-hypochlorite-food' },
];

const OTHER_LABEL: Record<HypoCountryKey, string> = { uae: 'UAE', bahrain: 'Bahrain' };

const SodiumHypochloriteCountry = ({ country }: { country: HypoCountryKey }) => {
  const c = COUNTRIES[country];
  const url = `https://gcoman.com/chemical-supplier/sodium-hypochlorite-${country}`;
  const faqs = [...c.faqs, ...COMMON_FAQS(c.inName)];
  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: 'Sodium Hypochlorite Supplier Oman & GCC', url: 'https://gcoman.com/chemical-supplier/sodium-hypochlorite-oman' },
    { name: `Sodium Hypochlorite Supplier ${c.name}`, url },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={c.title}
        description={c.description}
        keywords={`sodium hypochlorite supplier ${c.name}, sodium hypochlorite ${c.name}, NaOCl supplier ${c.name}, sodium hypochlorite 12% ${c.name}, sodium hypochlorite 15% ${c.name}, sodium hypochlorite price ${c.name}, bleach raw material ${c.name}`}
        ogTitle={c.title}
        ogDescription={c.description}
        ogUrl={url}
        canonical={url}
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData url={url} cssSelector={['h1', 'h2', '.speakable']} />
      <Navigation />

      <main id="main-content">
        <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">NaOCl 12–15% • {c.leadTime} • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Sodium Hypochlorite Supplier in {c.inName}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                {c.intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', `hypo_${country}_quote`)}>
                  <Link to={`/contact?product=${encodeURIComponent(`Sodium Hypochlorite (${c.name})`)}`} rel="nofollow">
                    Request a quote <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 text-lg px-8">
                  <a href="tel:+96892772305">
                    <Phone className="w-5 h-5" /> Call +968 9277 2305
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-primary" /> How is sodium hypochlorite delivered to {c.inName}?
                </h2>
                <p className="text-muted-foreground mb-4">{c.route}</p>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-left">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Delivery point</th>
                        <th className="px-4 py-2 font-semibold">Lead time from Muscat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.points.map((p) => (
                        <tr key={p.place} className="border-t border-border">
                          <td className="px-4 py-2 font-medium text-foreground">{p.place}</td>
                          <td className="px-4 py-2 text-muted-foreground">{p.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Industrial areas served: {c.zones.join(', ')}.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Factory className="w-6 h-6 text-primary" /> Who uses sodium hypochlorite in {c.inName}?
                </h2>
                <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                  {c.industries.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">What sodium hypochlorite grades and pack sizes are available for {c.inName}?</h2>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Grade</th>
                      <th className="px-4 py-2 font-semibold">Strength</th>
                      <th className="px-4 py-2 font-semibold">Packs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PACKS.map((p) => (
                      <tr key={p.grade} className="border-t border-border align-top">
                        <td className="px-4 py-2">
                          <Link to={p.link} className="text-primary hover:underline font-medium">{p.grade}</Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{p.strength}</td>
                        <td className="px-4 py-2 text-muted-foreground">{p.packs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-10 mb-3 flex items-center gap-2">
                <ThermometerSun className="w-6 h-6 text-primary" /> How do you keep hypochlorite strength on an export load?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl speakable">
                Sodium hypochlorite slowly breaks down, mainly to salt and sodium chlorate with some oxygen, and faster in heat,
                light and contact with metals. The 12–15% grade loses strength gradually over roughly three to six months at
                15–20 °C, and within a few weeks in Gulf summer heat, so the practical rules are:
                ship in closed containers out of direct sun, check the available chlorine on the dispatch Certificate of
                Analysis, store indoors or shaded on arrival, and size orders to what you use in a few weeks. For
                {c.inName} we recommend smaller, more frequent loads rather than one large stock.
              </p>
              <h2 className="text-2xl font-bold text-foreground mt-10 mb-3 flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-primary" /> What documents come with every consignment?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl">{c.documents}</p>
            </div>
          </div>
        </section>

        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">Specifications, grades and pricing</h2>
              <p className="text-muted-foreground leading-relaxed">
                The grade-by-grade comparison and storage advice are on the{' '}
                <Link to="/chemical-supplier/sodium-hypochlorite-oman" className="text-primary hover:underline">sodium hypochlorite supplier Oman &amp; GCC</Link>{' '}
                page.
                {c.locationPage && (
                  <>
                    {' '}For the rest of the catalogue shipped to {c.inName}, see{' '}
                    <Link to={c.locationPage} className="text-primary hover:underline">chemical supply to {c.inName}</Link>.
                  </>
                )}{' '}
                Sodium hypochlorite to{' '}
                {HYPO_COUNTRY_SLUGS.filter((k) => k !== country).map((k) => (
                  <Link key={k} to={`/chemical-supplier/sodium-hypochlorite-${k}`} className="text-primary hover:underline">{OTHER_LABEL[k]}</Link>
                ))}
                . Also shipped to {c.inName}:{' '}
                <Link to={`/chemical-supplier/nitric-acid-${country}`} className="text-primary hover:underline">nitric acid 68%</Link>
                {country === 'uae' && (
                  <>
                    ,{' '}
                    <Link to="/chemical-supplier/caustic-soda-uae" className="text-primary hover:underline">caustic soda</Link> and{' '}
                    <Link to="/chemical-supplier/hydrochloric-acid-uae" className="text-primary hover:underline">hydrochloric acid</Link>
                  </>
                )}
                .
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} heading={`Sodium hypochlorite in ${c.inName} — frequently asked questions`} />
      </main>

      <Footer />
    </div>
  );
};

export default SodiumHypochloriteCountry;
