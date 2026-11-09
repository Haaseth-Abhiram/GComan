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
 * Caustic soda, one page per GCC market buyers search by name (2026-11-09).
 *
 * Why: "caustic soda suppliers in uae" and "... in saudi arabia" are GCC
 * autocomplete phrasings (gcc-keyword-demand-2026-10-27.md), the caustic hub
 * covers each country in one card, and the user confirmed on 2026-11-08 that
 * we supply caustic to both markets (P9.3 / P10.15). Same condition as
 * NitricAcidCountry.tsx: absent for the country query, not outranked.
 *
 * Scope is deliberately closed: one product, two markets. No more countries
 * without the same evidence, never a product × city template (HANDOFF /
 * number-one-plan hard limits). Customers are never named.
 *
 * Lead times, routes and documents restate NitricAcidCountry.tsx (same trucks,
 * same lanes), except origin: caustic grades may be imported, so the page
 * promises a GCC Certificate of Origin only for GCC-made product (fact-check
 * 2026-11-09). Grades, strengths and packs restate the caustic product JSON
 * (water-treatment + food-beverage); where the hub disagreed with the product
 * pages, the product pages' figures are used (liquid 32/48/50%, prills
 * 0.5–1.0 mm). The Saudi page says plainly that Saudi Arabia makes its own
 * caustic: our case there is packed forms, food grade and mixed loads.
 */

export type CausticCountryKey = 'uae' | 'saudi-arabia';

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
  locationPage: string;
  alsoShipped: { label: string; to: string }[];
};

const COUNTRIES: Record<CausticCountryKey, CountryData> = {
  uae: {
    name: 'UAE',
    inName: 'the UAE',
    title: 'Caustic Soda Supplier UAE | NaOH Flakes & Liquid from Oman',
    description:
      'Caustic soda flakes 98–99%, prills and liquid 32–50% for Abu Dhabi, Dubai, Sharjah & Fujairah from Muscat. Dubai 3–5 days. Food grade E524. CoA, SDS, GCC CoO.',
    intro:
      'Global Chemicals LLC supplies caustic soda (sodium hydroxide, NaOH) to buyers across the United Arab Emirates from stock in Muscat: flakes and prills for plants that dissolve their own solution, liquid 32–50% for continuous dosing, in technical and food grade (E524). The east coast is the same or next day by road, and Abu Dhabi, Dubai and Sharjah three to five business days.',
    leadTime: 'Fujairah same or next day · Abu Dhabi, Dubai, Sharjah 3–5 business days',
    route: 'By road from Muscat, mainly through the Al Wajajah–Hatta crossing, and cleared at the UAE border under GCC customs procedures.',
    points: [
      { place: 'Fujairah & east coast', time: 'same or next day by road' },
      { place: 'Dubai & Sharjah', time: '3–5 business days' },
      { place: 'Abu Dhabi & ICAD', time: '3–5 business days' },
      { place: 'Ras Al Khaimah & northern emirates', time: '3–5 business days' },
    ],
    zones: ['KEZAD (incl. ICAD)', 'JAFZA', 'Dubai Industrial City', 'Sharjah SAIF Zone', 'Fujairah Free Zone', 'RAKEZ'],
    industries: [
      'Soap and detergent makers — saponifying fats and oils and neutralising LABSA',
      'Water, desalination and sewage plants — pH correction of permeate and effluent neutralisation',
      'Aluminium extrusion and anodising lines — etching and cleaning',
      'Dairy, juice and beverage plants — the alkaline stage of CIP with food grade',
      'Facility management and tank-cleaning contractors — heavy-duty degreasing',
    ],
    documents:
      'Each load travels with a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and the origin documents for the grade (a GCC Certificate of Origin for GCC-made product). For free-zone delivery, send the zone and company licence details and the gate paperwork is prepared before dispatch.',
    faqs: [
      {
        question: 'How fast can you deliver caustic soda to Dubai or Abu Dhabi?',
        answer:
          'Dubai, Sharjah and Abu Dhabi are three to five business days from Muscat on scheduled departures, with a dedicated truck quoted for urgent loads. Fujairah and the east coast are the same or next day by road.',
      },
      {
        question: 'Do you supply caustic soda flakes in 25 kg bags to UAE soap and detergent makers?',
        answer:
          'Yes. Flakes (98–99% NaOH) ship in 25 kg bags and 1,000 kg big bags, and prills (99%) in 25 kg bags and 500 kg big bags. Soap makers use them for saponification and detergent makers to neutralise LABSA; a mixed load with other raw materials can travel on the same truck.',
      },
      {
        question: 'Is there customs duty on caustic soda shipped from Oman to the UAE?',
        answer:
          'Oman and the UAE are both in the GCC customs union. Goods of GCC origin travel with a GCC Certificate of Origin and clear free of customs duty; imported grades on which duty was paid at first entry into the GCC travel with the duty-paid entry documents. Import VAT is accounted for by the importer either way.',
      },
      {
        question: 'Can you supply food-grade caustic soda for CIP in UAE dairy and beverage plants?',
        answer:
          'Yes. Food-grade liquid caustic (E524, 30–50% NaOH, heavy metals below 5 ppm) is supplied in 25 L jerricans, 200 L drums and 1,000 L IBCs for the alkaline stage of clean-in-place, typically dosed at 0.5–2%. Each batch carries its Certificate of Analysis.',
      },
    ],
    locationPage: '/chemicals/uae',
    alsoShipped: [
      { label: 'hydrochloric acid', to: '/chemical-supplier/hydrochloric-acid-uae' },
      { label: 'sodium hypochlorite', to: '/chemical-supplier/sodium-hypochlorite-uae' },
      { label: 'nitric acid 68%', to: '/chemical-supplier/nitric-acid-uae' },
    ],
  },
  'saudi-arabia': {
    name: 'Saudi Arabia',
    inName: 'Saudi Arabia',
    title: 'Caustic Soda Supplier Saudi Arabia | NaOH from Oman',
    description:
      'Caustic soda flakes, prills and liquid 32–50% for Dammam, Jubail & Riyadh from Muscat: Eastern Province 4–6 days by road. Food grade E524. CoA, SDS, GCC CoO.',
    intro:
      'Global Chemicals LLC exports caustic soda (sodium hydroxide, NaOH) to Saudi Arabia from stock in Muscat: flakes, prills and packed liquid in technical and food grade (E524). The Eastern Province is four to six business days by road and Riyadh five to seven. Saudi Arabia produces its own caustic soda; we serve buyers who want a second GCC source, packed forms, food grade, or caustic on the same truck as their other chemicals.',
    leadTime: 'Dammam & Jubail 4–6 business days · Riyadh 5–7',
    route: 'By road from Muscat for the Eastern Province and Riyadh; Jeddah and Yanbu by sea from Sohar Port, with transit quoted per sailing.',
    points: [
      { place: 'Dammam, Khobar & Jubail', time: '4–6 business days by road' },
      { place: 'Riyadh', time: '5–7 business days by road' },
      { place: 'Jeddah & Yanbu', time: 'by sea via Sohar Port, quoted per sailing' },
    ],
    zones: ['Jubail Industrial City', 'Dammam 2nd & 3rd Industrial Cities', 'Riyadh 2nd Industrial City', 'Al Kharj', 'Jeddah Industrial City', 'Yanbu Industrial City'],
    industries: [
      'Food, dairy and date-processing plants — food-grade caustic for CIP, and lye peeling of fruit and vegetables',
      'Soap, detergent and cleaning-product makers — flakes and prills for saponification and neutralisation',
      'Water and wastewater plants — pH correction and effluent neutralisation',
      'Refinery and petrochemical maintenance — caustic washing and line cleaning',
      'Metal finishing and aluminium plants — etching and degreasing',
    ],
    documents:
      'Each consignment carries a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and the origin documents for the grade (a GCC Certificate of Origin for GCC-made product), and we support the conformity documentation your importer files. Tell us the end use and the consignee details when you enquire.',
    faqs: [
      {
        question: 'How long does caustic soda take from Oman to Dammam or Riyadh?',
        answer:
          'Dammam, Khobar and Jubail are four to six business days by road from Muscat, and Riyadh five to seven. Jeddah and Yanbu are served by sea from Sohar Port, with the transit time quoted for each sailing.',
      },
      {
        question: 'Saudi Arabia makes its own caustic soda. Why buy from Oman?',
        answer:
          'Saudi producers supply caustic soda in liquid and solid form, mostly to large contract buyers. We give plants a second GCC source: flakes and prills in 25 kg bags, packed liquid in jerricans, drums and IBCs, food grade (E524) with batch certificates, and mixed loads that put caustic on the same truck as acids, hypochlorite or other raw materials.',
      },
      {
        question: 'Do I need a Saudi agent to import caustic soda from Oman?',
        answer:
          'For most industrial chemicals moving between GCC states, no: goods move between GCC states under the customs union. Your company is the importer of record; we prepare the commercial documents and support the conformity paperwork your importer files.',
      },
    ],
    locationPage: '/chemicals/saudi-arabia',
    alsoShipped: [
      { label: 'hydrochloric acid', to: '/chemical-supplier/hydrochloric-acid-saudi-arabia' },
      { label: 'nitric acid 68%', to: '/chemical-supplier/nitric-acid-saudi-arabia' },
    ],
  },
};

const CAUSTIC_COUNTRY_SLUGS = Object.keys(COUNTRIES) as CausticCountryKey[];

const COMMON_FAQS = (inName: string) => [
  {
    question: `What caustic soda grades can you supply to ${inName}?`,
    answer:
      'Flakes 98–99% NaOH (moisture below 1%, sodium carbonate below 0.8%); prills 99% minimum as 0.5–1.0 mm beads; liquid at 32%, 48% or 50% (specific gravity about 1.35–1.52); each in technical grade, with flakes and liquid also in food grade (E524). CAS 1310-73-2.',
  },
  {
    question: `How is caustic soda transported to ${inName}?`,
    answer:
      'Solid caustic (flakes, prills) is UN 1823 and caustic solution UN 1824, both Class 8 (corrosive), packing group as stated on the Safety Data Sheet. Bags travel sealed and dry, because caustic absorbs moisture and carbon dioxide from air; liquid travels in UN-approved HDPE jerricans, drums and IBCs. Caustic is kept apart from acids and from aluminium, zinc and tin, which it attacks.',
  },
];

const PACKS = [
  { grade: 'Flakes (technical & food E524)', strength: '98–99% NaOH', packs: '25 kg bag · 1,000 kg big bag', link: '/products/water-treatment/caustic-soda-flakes' },
  { grade: 'Prills (technical)', strength: '99% min, 0.5–1.0 mm', packs: '25 kg PP bag · 500 kg big bag', link: '/products/water-treatment/caustic-soda-prills' },
  { grade: 'Liquid (technical)', strength: '32% · 48% · 50%', packs: '25 L · 200 L drum · 1,000 L IBC · bulk on request', link: '/products/water-treatment/caustic-soda-liquid' },
  { grade: 'Liquid (food grade, E524)', strength: '30–50%', packs: '25 L · 200 L drum · 1,000 L IBC', link: '/products/food-beverage/caustic-soda-liquid-food' },
];

const OTHER_LABEL: Record<CausticCountryKey, string> = { uae: 'the UAE', 'saudi-arabia': 'Saudi Arabia' };

const CausticSodaCountry = ({ country }: { country: CausticCountryKey }) => {
  const c = COUNTRIES[country];
  const url = `https://gcoman.com/chemical-supplier/caustic-soda-${country}`;
  const faqs = [...c.faqs, ...COMMON_FAQS(c.inName)];
  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: 'Caustic Soda Supplier Oman', url: 'https://gcoman.com/chemical-supplier/caustic-soda-oman' },
    { name: `Caustic Soda Supplier ${c.name}`, url },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={c.title}
        description={c.description}
        keywords={`caustic soda supplier ${c.name}, caustic soda ${c.name}, sodium hydroxide supplier ${c.name}, caustic soda flakes ${c.name}, liquid caustic soda ${c.name}, caustic soda price ${c.name}, NaOH ${c.name}`}
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
              <Badge className="mb-4 text-sm px-4 py-1.5">NaOH flakes · prills · liquid • {c.leadTime} • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Caustic Soda Supplier in {c.inName}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                {c.intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', `caustic_${country}_quote`)}>
                  <Link to={`/contact?product=${encodeURIComponent(`Caustic Soda (${c.name})`)}`} rel="nofollow">
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
                  <Truck className="w-6 h-6 text-primary" /> How is caustic soda delivered to {c.inName}?
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
                  <Factory className="w-6 h-6 text-primary" /> Who uses caustic soda in {c.inName}?
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">What caustic soda forms and pack sizes are available for {c.inName}?</h2>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Form</th>
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
                <Scale className="w-6 h-6 text-primary" /> Flakes or liquid for an export load?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl speakable">
                One kilogram of flakes or prills makes two kilograms of 50% solution, so a truck of solid caustic carries
                about twice the sodium hydroxide of the same weight of 50% liquid, and three times that of 32%. Solids
                suit plants with a dissolving tank and buyers who want stock that keeps for months when sealed and dry.
                Liquid suits continuous dosing by metering pump: no bags and no dissolving tank, though diluting 48–50% liquid
                still releases heat. Dissolving sodium hydroxide releases enough heat to boil a small volume of water, so add
                solids slowly to cold water and caustic to water, never water to caustic.
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
                The full comparison of flakes, prills and liquid, with uses by industry, is on the{' '}
                <Link to="/chemical-supplier/caustic-soda-oman" className="text-primary hover:underline">caustic soda supplier Oman</Link>{' '}
                page. For the rest of the catalogue shipped to {c.inName}, see{' '}
                <Link to={c.locationPage} className="text-primary hover:underline">chemical supply to {c.inName}</Link>.{' '}
                Caustic soda to{' '}
                {CAUSTIC_COUNTRY_SLUGS.filter((k) => k !== country).map((k) => (
                  <Link key={k} to={`/chemical-supplier/caustic-soda-${k}`} className="text-primary hover:underline">{OTHER_LABEL[k]}</Link>
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

        <FAQSection faqs={faqs} heading={`Caustic soda in ${c.inName} — frequently asked questions`} />
      </main>

      <Footer />
    </div>
  );
};

export default CausticSodaCountry;
