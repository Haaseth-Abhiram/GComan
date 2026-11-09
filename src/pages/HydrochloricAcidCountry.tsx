import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Truck, FileCheck2, Factory, ShieldAlert } from 'lucide-react';

/**
 * Hydrochloric acid, one page per GCC market buyers search by name (2026-11-09).
 *
 * Why: HCl is invoiced every month (Zoho Books, 12 months to 2026-11-08),
 * "hydrochloric acid supplier uae / saudi arabia" are GCC phrasings with no
 * page of ours naming the country, and the user confirmed on 2026-11-08 that
 * we supply both markets (P9.3 / P10.15). Same condition as
 * NitricAcidCountry.tsx: absent for the country query, not outranked.
 *
 * Scope is deliberately closed: one product, two markets, never a product ×
 * city template (HANDOFF / number-one-plan hard limits). Customers are never
 * named.
 *
 * Lead times, routes and documents restate NitricAcidCountry.tsx (same trucks,
 * same lanes); strengths, SG and packs restate
 * /products/water-treatment/hydrochloric-acid-industrial and the lab SKU. The
 * one export-specific section is segregation from hypochlorite and alkalis,
 * because HCl usually travels in mixed loads with both.
 */

export type HclCountryKey = 'uae' | 'saudi-arabia';

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

const COUNTRIES: Record<HclCountryKey, CountryData> = {
  uae: {
    name: 'UAE',
    inName: 'the UAE',
    title: 'Hydrochloric Acid Supplier UAE | HCl 30–33% from Oman',
    description:
      'Hydrochloric acid 30–33% for Abu Dhabi, Dubai, Sharjah & Fujairah from Muscat stock: carboys, drums, IBCs. Fujairah next day, Dubai 3–5 days. CoA, SDS, GCC CoO.',
    intro:
      'Global Chemicals LLC supplies hydrochloric acid (HCl, also sold as muriatic acid) to buyers across the United Arab Emirates from stock in Muscat: technical 30–33% w/w for descaling, resin regeneration, pickling and pH control, and 36–38% ACS laboratory grade. The east coast is the same or next day by road, and Abu Dhabi, Dubai and Sharjah three to five business days.',
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
      'District cooling and facility management — descaling chillers, heat exchangers and cooling towers',
      'Desalination and power plants — cation resin regeneration and RO cleaning',
      'Steel fabrication and galvanising — pickling before coating',
      'Water and wastewater plants — neutralising alkaline effluent',
      'Pool and building maintenance — pH reduction and masonry cleaning as muriatic acid',
    ],
    documents:
      'Each load travels with a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC Certificate of Origin. For free-zone delivery, send the zone and company licence details and the gate paperwork is prepared before dispatch.',
    faqs: [
      {
        question: 'How fast can you deliver hydrochloric acid to Dubai or Abu Dhabi?',
        answer:
          'Dubai, Sharjah and Abu Dhabi are three to five business days from Muscat on scheduled departures, with a dedicated truck quoted for urgent loads. Fujairah and the east coast are the same or next day by road.',
      },
      {
        question: 'Do you supply hydrochloric acid for chiller and cooling-tower descaling in the UAE?',
        answer:
          'Yes. Facility-management and district-cooling contractors buy the 30–33% technical grade in 35 kg carboys or 200–220 L drums and descale with inhibited 5–10% dilutions, where the inhibitor protects the steel while the acid dissolves carbonate scale. Follow the equipment maker’s compatibility limits.',
      },
      {
        question: 'Is there customs duty on hydrochloric acid shipped from Oman to the UAE?',
        answer:
          'Oman and the UAE are both in the GCC customs union, so goods of GCC origin accompanied by a GCC Certificate of Origin are cleared free of customs duty; import VAT is still accounted for by the importer. We arrange the GCC Certificate of Origin with every consignment.',
      },
    ],
    locationPage: '/chemicals/uae',
    alsoShipped: [
      { label: 'caustic soda', to: '/chemical-supplier/caustic-soda-uae' },
      { label: 'calcium hypochlorite', to: '/chemical-supplier/calcium-hypochlorite-uae' },
      { label: 'nitric acid 68%', to: '/chemical-supplier/nitric-acid-uae' },
    ],
  },
  'saudi-arabia': {
    name: 'Saudi Arabia',
    inName: 'Saudi Arabia',
    title: 'Hydrochloric Acid Supplier Saudi Arabia | HCl from Oman',
    description:
      'Hydrochloric acid 30–33% for Dammam, Jubail & Riyadh from Muscat stock: Eastern Province 4–6 days by road. Carboys, drums, IBCs, bulk. CoA, SDS, GCC CoO.',
    intro:
      'Global Chemicals LLC exports hydrochloric acid (HCl) to Saudi Arabia from stock in Muscat: technical 30–33% w/w in carboys, drums, IBCs and bulk, and 36–38% ACS laboratory grade. The Eastern Province is four to six business days by road and Riyadh five to seven, and HCl can share a truck, segregated in its own sealed containers, with the other chemicals a plant buys from us.',
    leadTime: 'Dammam & Jubail 4–6 business days · Riyadh 5–7',
    route: 'By road from Muscat for the Eastern Province and Riyadh; Jeddah and Yanbu by sea from Sohar Port, with transit quoted per sailing.',
    points: [
      { place: 'Dammam, Khobar & Jubail', time: '4–6 business days by road' },
      { place: 'Riyadh', time: '5–7 business days by road' },
      { place: 'Jeddah & Yanbu', time: 'by sea via Sohar Port, quoted per sailing' },
    ],
    zones: ['Jubail Industrial City', 'Dammam 2nd & 3rd Industrial Cities', 'Riyadh 2nd Industrial City', 'Jeddah Industrial City', 'Yanbu Industrial City'],
    industries: [
      'Power, desalination and demineralisation plants — cation resin regeneration',
      'Oilfield service contractors — scale-dissolution and well-service treatments',
      'Steel fabrication and galvanising — pickling before coating',
      'Refinery and petrochemical maintenance — descaling exchangers and lines',
      'Water and wastewater plants — neutralising alkaline effluent',
    ],
    documents:
      'Each consignment carries a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC Certificate of Origin, and we support the conformity documentation your importer files. Tell us the end use and the consignee details when you enquire.',
    faqs: [
      {
        question: 'How long does hydrochloric acid take from Oman to Dammam or Riyadh?',
        answer:
          'Dammam, Khobar and Jubail are four to six business days by road from Muscat, and Riyadh five to seven. Jeddah and Yanbu are served by sea from Sohar Port, with the transit time quoted for each sailing.',
      },
      {
        question: 'Do you supply 15% or 28% hydrochloric acid for well treatments?',
        answer:
          'We supply the 30–33% concentrate, which service contractors dilute on site to the strength their treatment design calls for, with the inhibitors and additives they specify. Shipping the concentrate moves more acid per truck than a pre-diluted blend.',
      },
      {
        question: 'Can you supply hydrochloric acid in IBCs or bulk to Jubail?',
        answer:
          'Yes. The technical grade ships in 35 kg carboys, 200–220 L drums and 1,000 L IBCs, and bulk tanker arrangements are quoted for plant-scale users in Jubail and the Eastern Province. Tell us your offloading arrangement and storage capacity with the enquiry.',
      },
    ],
    locationPage: '/chemicals/saudi-arabia',
    alsoShipped: [
      { label: 'caustic soda', to: '/chemical-supplier/caustic-soda-saudi-arabia' },
      { label: 'nitric acid 68%', to: '/chemical-supplier/nitric-acid-saudi-arabia' },
    ],
  },
};

const HCL_COUNTRY_SLUGS = Object.keys(COUNTRIES) as HclCountryKey[];

const COMMON_FAQS = (inName: string) => [
  {
    question: `What hydrochloric acid grades can you supply to ${inName}?`,
    answer:
      'Technical / commercial grade at 30–33% w/w (specific gravity 1.15–1.16 at 25 °C), also sold as muriatic acid, for industrial duties; and laboratory grade at 36–38% ACS reagent, with standardised 0.1N and 1N solutions, in bottles. CAS 7647-01-0.',
  },
  {
    question: `How is hydrochloric acid transported to ${inName}?`,
    answer:
      'As UN 1789 hydrochloric acid, Class 8 (corrosive), packing group as stated on the Safety Data Sheet, in UN-approved HDPE carboys, drums and IBCs with closures kept tight, because the acid fumes in humid air and the fumes corrode metal. On a mixed load it is stowed apart from alkalis, nitric acid and other oxidisers, and hypochlorite, each in its own sealed UN container.',
  },
];

const PACKS = [
  { grade: 'Technical / commercial', strength: '30–33% w/w, SG 1.15–1.16', packs: '35 kg carboy · 200–220 L drum · 1,000 L IBC · bulk tanker', link: '/products/water-treatment/hydrochloric-acid-industrial' },
  { grade: 'Laboratory (ACS)', strength: '36–38%; 0.1N & 1N solutions', packs: '500 mL · 2.5 L · 5 L bottles', link: '/products/lab-chemicals/hydrochloric-acid-lab' },
];

const OTHER_LABEL: Record<HclCountryKey, string> = { uae: 'the UAE', 'saudi-arabia': 'Saudi Arabia' };

const HydrochloricAcidCountry = ({ country }: { country: HclCountryKey }) => {
  const c = COUNTRIES[country];
  const url = `https://gcoman.com/chemical-supplier/hydrochloric-acid-${country}`;
  const faqs = [...c.faqs, ...COMMON_FAQS(c.inName)];
  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: 'Hydrochloric Acid Supplier Oman', url: 'https://gcoman.com/chemical-supplier/hydrochloric-acid-oman' },
    { name: `Hydrochloric Acid Supplier ${c.name}`, url },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={c.title}
        description={c.description}
        keywords={`hydrochloric acid supplier ${c.name}, hydrochloric acid ${c.name}, HCl supplier ${c.name}, muriatic acid ${c.name}, hydrochloric acid 33% ${c.name}, hydrochloric acid price ${c.name}, HCl ${c.name}`}
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
              <Badge className="mb-4 text-sm px-4 py-1.5">HCl 30–33% • {c.leadTime} • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Hydrochloric Acid Supplier in {c.inName}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                {c.intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', `hcl_${country}_quote`)}>
                  <Link to={`/contact?product=${encodeURIComponent(`Hydrochloric Acid (${c.name})`)}`} rel="nofollow">
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
                  <Truck className="w-6 h-6 text-primary" /> How is hydrochloric acid delivered to {c.inName}?
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
                  <Factory className="w-6 h-6 text-primary" /> Who uses hydrochloric acid in {c.inName}?
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">What hydrochloric acid grades and pack sizes are available for {c.inName}?</h2>
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
                <ShieldAlert className="w-6 h-6 text-primary" /> Can hydrochloric acid travel with caustic soda, nitric acid or hypochlorite?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl speakable">
                Yes, on the same truck, but never in contact. Hydrochloric acid and sodium hypochlorite release chlorine
                gas if they mix, hydrochloric and nitric acid together release chlorine and nitrosyl chloride, and acid
                meeting caustic soda reacts violently and gives off heat. On a mixed load each
                product stays in its own sealed UN container, stowed and segregated as its Safety Data Sheet requires,
                and the same rule applies in your store: separate bunds or containment, never a shared drain, pump or
                transfer hose. Keep hydrochloric acid in polyethylene, PVC, FRP or rubber-lined equipment, because it
                attacks mild and stainless steel and releases hydrogen.
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
                The grade table, industrial uses and resin-regeneration notes are on the{' '}
                <Link to="/chemical-supplier/hydrochloric-acid-oman" className="text-primary hover:underline">hydrochloric acid supplier Oman</Link>{' '}
                page. For the rest of the catalogue shipped to {c.inName}, see{' '}
                <Link to={c.locationPage} className="text-primary hover:underline">chemical supply to {c.inName}</Link>.{' '}
                Hydrochloric acid to{' '}
                {HCL_COUNTRY_SLUGS.filter((k) => k !== country).map((k) => (
                  <Link key={k} to={`/chemical-supplier/hydrochloric-acid-${k}`} className="text-primary hover:underline">{OTHER_LABEL[k]}</Link>
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

        <FAQSection faqs={faqs} heading={`Hydrochloric acid in ${c.inName} — frequently asked questions`} />
      </main>

      <Footer />
    </div>
  );
};

export default HydrochloricAcidCountry;
