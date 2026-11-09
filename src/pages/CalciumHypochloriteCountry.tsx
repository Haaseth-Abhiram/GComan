import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Truck, FileCheck2, Factory, Scale } from 'lucide-react';

/**
 * Calcium hypochlorite, one page per GCC market where we already sell it (2026-11-09).
 *
 * Why: invoice-line analysis of Zoho Books for the 12 months to 2026-11-08
 * puts calcium hypochlorite 65–70% (45 kg drums) second by revenue after
 * nitric acid, and it is the only product exported repeatedly: about three
 * quarters of it to Bahrain and the UAE. An earlier invoice-level reading
 * filed this revenue under "hypochlorite" and led to sodium hypochlorite pages
 * for these two countries; sodium hypochlorite in fact sold only in Oman, so
 * those unpublished pages were replaced by this one. "calcium hypochlorite
 * suppliers in uae" is a GCC autocomplete phrasing (PoolChlorineGcc.tsx).
 *
 * Scope is deliberately closed: one product, the two markets with repeat
 * invoices. Add a country only on the same evidence, never as a product ×
 * city template (HANDOFF / number-one-plan hard limits). Customers and the
 * brands we resell are never named.
 *
 * Grades, packs and handling restate the calcium hypochlorite product JSON
 * (swimming-pool granules, water-treatment grade) and PoolChlorineGcc.tsx;
 * lanes restate NitricAcidCountry.tsx. The product is imported, so the page
 * promises duty-paid entry documents, not a GCC Certificate of Origin.
 */

export type CalHypoCountryKey = 'uae' | 'bahrain';

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
  faqs: { question: string; answer: string }[];
  locationPage: string;
  alsoShipped: { label: string; to: string }[];
};

const DOCUMENTS =
  'Each load travels with a Certificate of Analysis giving the available chlorine, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and the dangerous-goods transport documents. The product is imported into the GCC; it travels with the first-entry customs declaration showing duty paid, and import VAT is accounted for by the importer.';

const COUNTRIES: Record<CalHypoCountryKey, CountryData> = {
  uae: {
    name: 'UAE',
    inName: 'the UAE',
    title: 'Calcium Hypochlorite Supplier UAE | 65–70% Chlorine Granules',
    description:
      'Calcium hypochlorite 65–70% granules in 45 kg drums for Dubai, Abu Dhabi, Sharjah & Fujairah from Muscat stock. Dubai 3–5 days. Pools, water tanks, disinfection.',
    intro:
      'Global Chemicals LLC supplies calcium hypochlorite (cal-hypo, Ca(OCl)2) granules with 65–70% available chlorine to buyers across the United Arab Emirates from stock in Muscat, in 45 kg and 25 kg drums and smaller packs: for pool shock and sanitising, water-tank and drinking-water disinfection, and wastewater. The east coast is the same or next day by road, and Abu Dhabi, Dubai and Sharjah three to five business days.',
    leadTime: 'Fujairah same or next day · Abu Dhabi, Dubai, Sharjah 3–5 business days',
    route: 'By road from Muscat, mainly through the Al Wajajah–Hatta crossing, and cleared at the UAE border under GCC customs procedures.',
    points: [
      { place: 'Fujairah & east coast', time: 'same or next day by road' },
      { place: 'Dubai & Sharjah', time: '3–5 business days' },
      { place: 'Abu Dhabi & Al Ain', time: '3–5 business days' },
      { place: 'Ras Al Khaimah & northern emirates', time: '3–5 business days' },
    ],
    zones: ['Dubai Investments Park', 'Al Quoz', 'Sharjah Industrial Area', 'Mussafah', 'KEZAD', 'Fujairah Free Zone', 'RAKEZ'],
    industries: [
      'Pool maintenance and facility-management companies — weekly shock and sanitising',
      'Hotels, residential communities and clubs — pool chlorination without a dosing pump',
      'Water-tank cleaning and disinfection contractors',
      'Pool-chemical distributors and retailers — 45 kg drums for repacking',
      'Utilities and wastewater operators — backup and emergency disinfection',
    ],
    faqs: [
      {
        question: 'How fast can you deliver calcium hypochlorite to Dubai or Abu Dhabi?',
        answer:
          'Dubai, Sharjah and Abu Dhabi are three to five business days from Muscat on scheduled departures, with a dedicated truck quoted for urgent loads. Fujairah and the east coast are the same or next day by road.',
      },
      {
        question: 'Do you supply calcium hypochlorite in 45 kg drums to UAE distributors?',
        answer:
          'Yes. The 65–70% product ships in 45 kg drums, the usual pack for distributors, pool companies and tank-cleaning contractors, and also in 25 kg drums; pool granules also come in 1 to 50 kg packs. Other pool chemicals can share the delivery, but TCCA tablets and acidic products such as pH reducer never travel in the same load as calcium hypochlorite.',
      },
      {
        question: 'Is there customs duty on calcium hypochlorite shipped from Oman to the UAE?',
        answer:
          'No further customs duty is due, provided the load travels with the first-entry customs declaration showing duty paid when the product was imported into the GCC; the UAE importer still accounts for import VAT, and free-zone deliveries follow the zone’s own procedure. We prepare the commercial invoice and the entry documents with each load.',
      },
    ],
    locationPage: '/chemicals/uae',
    alsoShipped: [
      { label: 'caustic soda', to: '/chemical-supplier/caustic-soda-uae' },
      { label: 'hydrochloric acid', to: '/chemical-supplier/hydrochloric-acid-uae' },
      { label: 'nitric acid 68%', to: '/chemical-supplier/nitric-acid-uae' },
    ],
  },
  bahrain: {
    name: 'Bahrain',
    inName: 'Bahrain',
    title: 'Calcium Hypochlorite Supplier Bahrain | 65–70%, 3–5 Days',
    description:
      'Calcium hypochlorite 65–70% granules in 45 kg drums for Manama, Sitra & Amwaj from Muscat stock, 3–5 business days via the King Fahd Causeway. CoA and Arabic SDS.',
    intro:
      'Global Chemicals LLC supplies calcium hypochlorite (cal-hypo, Ca(OCl)2) granules with 65–70% available chlorine to Bahrain from stock in Muscat, three to five business days to Manama, Sitra and the islands: in 45 kg and 25 kg drums for pools, water tanks and disinfection. Trucks cross Saudi Arabia under GCC customs transit and enter Bahrain over the King Fahd Causeway.',
    leadTime: 'Manama, Sitra & Amwaj 3–5 business days',
    route: 'By road from Muscat through Saudi Arabia under GCC customs transit, entering Bahrain over the King Fahd Causeway.',
    points: [
      { place: 'Manama & Juffair', time: '3–5 business days' },
      { place: 'Sitra & Salman Industrial City', time: '3–5 business days' },
      { place: 'Amwaj, Muharraq & Riffa', time: '3–5 business days' },
    ],
    zones: ['Sitra Industrial Area', 'Bahrain International Investment Park (Hidd)', 'Salman Industrial City', 'Mina Salman', 'Askar'],
    industries: [
      'Hotels, resorts and residential towers — pool shock and sanitising',
      'Pool maintenance and facility-management companies',
      'Pool-chemical distributors — 45 kg drums for repacking',
      'Water-tank cleaning and disinfection contractors',
      'Wastewater and utility operators — backup disinfection',
    ],
    faqs: [
      {
        question: 'How long does calcium hypochlorite take from Oman to Bahrain?',
        answer:
          'Three to five business days by road from Muscat to Manama, Sitra and the islands, crossing Saudi Arabia under GCC customs transit and entering over the King Fahd Causeway.',
      },
      {
        question: 'Which chlorine do Bahrain hotel pools use: calcium hypochlorite or TCCA tablets?',
        answer:
          'Many use both. TCCA tablets in a feeder sanitise daily, because their cyanuric acid stabiliser slows chlorine loss in sunlight; calcium hypochlorite granules shock the pool weekly or after heavy use, because they add no stabiliser. Pools with a dosing pump often run on sodium hypochlorite instead.',
      },
      {
        question: 'Which documents come with calcium hypochlorite shipped to Bahrain?',
        answer:
          'A Certificate of Analysis giving the available chlorine, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice, the dangerous-goods transport documents, and the documents showing customs duty paid at first entry into the GCC.',
      },
    ],
    locationPage: '/chemicals/bahrain',
    alsoShipped: [
      { label: 'nitric acid 68%', to: '/chemical-supplier/nitric-acid-bahrain' },
    ],
  },
};

const CALHYPO_COUNTRY_SLUGS = Object.keys(COUNTRIES) as CalHypoCountryKey[];

const COMMON_FAQS = (inName: string) => [
  {
    question: `What calcium hypochlorite grades can you supply to ${inName}?`,
    answer:
      'Calcium hypochlorite granules at 65–70% available chlorine, unstabilised, for pool shock and disinfection, and a water-treatment grade at 65–75% available chlorine with moisture below 10%. CAS 7778-54-3. The Certificate of Analysis states the available chlorine of each batch.',
  },
  {
    question: `How is calcium hypochlorite transported to ${inName}?`,
    answer:
      'As a Class 5.1 oxidiser, under UN 2880 (hydrated) or UN 1748 (dry), or UN 3487 / UN 3485 where it is also classed corrosive (Class 8), as stated in section 14 of its Safety Data Sheet, in sealed UN-approved drums kept dry and shaded. It reacts violently with acids, TCCA, ammonia, fuels and organic matter, so on a mixed load it is stowed apart from all of them.',
  },
];

const PACKS = [
  { grade: 'Granules (pool shock & disinfection)', strength: '65–70% available chlorine', packs: '1, 5, 25 and 50 kg', link: '/products/swimming-pool/calcium-hypochlorite-granules' },
  { grade: 'Water-treatment grade', strength: '65–75% available chlorine', packs: '25 kg and 45 kg drums', link: '/products/water-treatment/calcium-hypochlorite-water' },
  { grade: 'TCCA tablets (daily sanitising)', strength: '90% available chlorine, stabilised', packs: '20 g and 200 g tablets in buckets and drums', link: '/products/swimming-pool/tcca-tablet-pool' },
];

const OTHER_LABEL: Record<CalHypoCountryKey, string> = { uae: 'the UAE', bahrain: 'Bahrain' };

const CalciumHypochloriteCountry = ({ country }: { country: CalHypoCountryKey }) => {
  const c = COUNTRIES[country];
  const url = `https://gcoman.com/chemical-supplier/calcium-hypochlorite-${country}`;
  const faqs = [...c.faqs, ...COMMON_FAQS(c.inName)];
  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: 'Pool Chlorine & Calcium Hypochlorite GCC', url: 'https://gcoman.com/chemical-supplier/pool-chlorine-gcc' },
    { name: `Calcium Hypochlorite Supplier ${c.name}`, url },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={c.title}
        description={c.description}
        keywords={`calcium hypochlorite supplier ${c.name}, calcium hypochlorite ${c.name}, cal hypo ${c.name}, calcium hypochlorite 70% ${c.name}, pool chlorine granules ${c.name}, chlorine powder ${c.name}, calcium hypochlorite price ${c.name}`}
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
              <Badge className="mb-4 text-sm px-4 py-1.5">Ca(OCl)2 65–70% • {c.leadTime} • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Calcium Hypochlorite Supplier in {c.inName}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                {c.intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', `calhypo_${country}_quote`)}>
                  <Link to={`/contact?product=${encodeURIComponent(`Calcium Hypochlorite (${c.name})`)}`} rel="nofollow">
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
                  <Truck className="w-6 h-6 text-primary" /> How is calcium hypochlorite delivered to {c.inName}?
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
                  Areas served: {c.zones.join(', ')}.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Factory className="w-6 h-6 text-primary" /> Who buys calcium hypochlorite in {c.inName}?
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">What calcium hypochlorite grades and packs are available for {c.inName}?</h2>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Product</th>
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
                <Scale className="w-6 h-6 text-primary" /> Why calcium hypochlorite instead of liquid hypochlorite for an export load?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl speakable">
                A kilogram of 65–70% calcium hypochlorite carries about five times the available chlorine of a kilogram of
                12–15% sodium hypochlorite, so a truck moves far more chlorine per tonne. As a dry solid in sealed drums it
                also keeps its strength much longer than liquid hypochlorite, which loses strength within weeks in Gulf summer
                heat. The trade-off is handling: it is an oxidiser that must be kept sealed, dry, shaded and apart from acids,
                TCCA, fuels and organic matter, and it is always added to water, never water to the product.
              </p>
              <h2 className="text-2xl font-bold text-foreground mt-10 mb-3 flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-primary" /> What documents come with every consignment?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl">{DOCUMENTS}</p>
            </div>
          </div>
        </section>

        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">Pool chlorine, dosing and pricing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Shock doses, which chlorine suits which pool, and the full GCC delivery table are on the{' '}
                <Link to="/chemical-supplier/pool-chlorine-gcc" className="text-primary hover:underline">pool chlorine and calcium hypochlorite GCC</Link>{' '}
                page; liquid chlorine is on the{' '}
                <Link to="/chemical-supplier/sodium-hypochlorite-oman" className="text-primary hover:underline">sodium hypochlorite</Link>{' '}
                page. For the rest of the catalogue shipped to {c.inName}, see{' '}
                <Link to={c.locationPage} className="text-primary hover:underline">chemical supply to {c.inName}</Link>.{' '}
                Calcium hypochlorite to{' '}
                {CALHYPO_COUNTRY_SLUGS.filter((k) => k !== country).map((k) => (
                  <Link key={k} to={`/chemical-supplier/calcium-hypochlorite-${k}`} className="text-primary hover:underline">{OTHER_LABEL[k]}</Link>
                ))}
                . Also shipped to {c.inName}:{' '}
                {c.alsoShipped.map((s, i) => (
                  <span key={s.to}>
                    {i > 0 && ', '}
                    <Link to={s.to} className="text-primary hover:underline">{s.label}</Link>
                  </span>
                ))}
                .
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} heading={`Calcium hypochlorite in ${c.inName} — frequently asked questions`} />
      </main>

      <Footer />
    </div>
  );
};

export default CalciumHypochloriteCountry;
