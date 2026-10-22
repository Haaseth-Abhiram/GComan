import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Truck, FileCheck2, Factory } from 'lucide-react';

/**
 * Nitric acid, one page per GCC destination market (2026-10-16).
 *
 * Why: on Google and Bing, every #1 for "nitric acid supplier <country>" in
 * the UAE, Saudi Arabia, Qatar, Kuwait and Bahrain is a page whose title names
 * that country (chemstock.ae, deluxechemical.com, enviroblend-group.com,
 * chimisrl.com/<country>/nitric-acid.htm ...). Most run 190–260 words. The
 * nitric hub covered each country in one table row, so for those queries we
 * were absent, not outranked — the condition the NitricAcidOman.tsx header
 * sets for building a page.
 *
 * Scope is deliberately closed: one product, the five GCC export markets. This
 * is NOT the start of a product × city machine (HANDOFF / number-one-plan hard
 * limits). Each page must stay materially different — its own route, lead
 * times, delivery points, industries and FAQs — or it becomes a doorway page.
 *
 * Every lead time, crossing and document restates what the site already
 * publishes (the NitricAcidOman gccDelivery table and the /chemicals/uae and
 * /chemicals/saudi-arabia pages). Road routes for Qatar, Kuwait and Bahrain are
 * the only overland lanes (through Saudi Arabia); industries are named as
 * markets, never as customers. The dangerous-goods line is the UN Model
 * Regulations entry for 65–70% nitric acid.
 */

export type NitricCountryKey = 'uae' | 'saudi-arabia' | 'qatar' | 'kuwait' | 'bahrain';

type CountryData = {
  name: string;
  inName: string; // "the UAE" vs "Qatar"
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

const COUNTRIES: Record<NitricCountryKey, CountryData> = {
  uae: {
    name: 'UAE',
    inName: 'the UAE',
    title: 'Nitric Acid Supplier UAE | 68% HNO3 Delivered from Oman',
    description:
      'Nitric acid 68% for Dubai, Abu Dhabi, Sharjah & Fujairah from Muscat stock: Fujairah in 2–4 hours, Dubai in 3–5 days. Carboys, drums, IBCs. CoA, SDS, GCC CoO.',
    intro:
      'Global Chemicals LLC supplies 68% nitric acid (HNO3) to buyers across the United Arab Emirates from stock in Muscat. The UAE is our shortest export lane: the east coast is a few hours by road, and Dubai, Sharjah and Abu Dhabi are three to five business days under GCC customs transit, so UAE plants get a second source that does not depend on Jebel Ali lead times.',
    leadTime: 'Fujairah 2–4 hours · Dubai, Sharjah, Abu Dhabi 3–5 business days',
    route: 'By road from Muscat, crossing at Khatm Al Shikla / Hatta or via Al Ain, under GCC customs transit.',
    points: [
      { place: 'Fujairah & east coast', time: '2–4 hours by road' },
      { place: 'Dubai & Sharjah', time: '3–5 business days' },
      { place: 'Abu Dhabi & ICAD', time: '3–5 business days' },
      { place: 'Ras Al Khaimah & northern emirates', time: '3–5 business days' },
    ],
    zones: ['JAFZA', 'Dubai Industrial City', 'ICAD Abu Dhabi', 'Sharjah SAIF Zone', 'Fujairah Free Zone', 'RAKEZ'],
    industries: [
      'Stainless steel fabrication — pickling and passivation before handover',
      'Desalination and RO plants — acid cleaning of membranes and heat exchangers',
      'Dairy, juice and beverage plants — the acid stage of CIP',
      'Metal finishing and galvanising lines',
      'QC and testing laboratories — ICP and AAS sample digestion',
    ],
    documents:
      'Each load travels with a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC Certificate of Origin. For free-zone delivery, send the zone and company licence details and the gate paperwork is prepared before dispatch.',
    faqs: [
      {
        question: 'How fast can you deliver nitric acid to Dubai?',
        answer:
          'Dubai, Sharjah and Abu Dhabi are three to five business days from Muscat on scheduled departures, with a dedicated truck quoted for urgent loads. Fujairah and the east coast are two to four hours by road, so morning orders there can arrive the same day.',
      },
      {
        question: 'Do you deliver nitric acid into UAE free zones?',
        answer:
          'Yes: JAFZA, Dubai Industrial City, ICAD Abu Dhabi, SAIF Zone, RAKEZ and Fujairah Free Zone. Give us the zone and your company licence details with the enquiry and the free-zone gate documentation is prepared before the truck leaves Muscat.',
      },
      {
        question: 'Is there customs duty on nitric acid shipped from Oman to the UAE?',
        answer:
          'Oman and the UAE are both in the GCC customs union, so goods of GCC origin accompanied by a GCC Certificate of Origin cross under customs transit without import duty. We issue the certificate with every consignment.',
      },
      {
        question: 'Which nitric acid grade do UAE stainless steel fabricators use?',
        answer:
          'Industrial 68% nitric acid, diluted on site for pickling and passivation. Food and beverage plants use the food-contact 68% grade for CIP at 0.5–2% and 60–70°C, and laboratories use the 68–70% ACS or trace-metal grade in 500 mL or 2.5 L bottles.',
      },
    ],
    locationPage: '/chemicals/uae',
  },
  'saudi-arabia': {
    name: 'Saudi Arabia',
    inName: 'Saudi Arabia',
    title: 'Nitric Acid Supplier Saudi Arabia | 68% HNO3 from Oman',
    description:
      'Nitric acid 68% for Dammam, Jubail, Riyadh & Jeddah: Eastern Province in 4–6 days by road, Jeddah & Yanbu by sea via Sohar. CoA, SDS, GCC CoO, SASO support.',
    intro:
      'Global Chemicals LLC exports 68% nitric acid (HNO3) to Saudi Arabia from stock in Muscat. The Eastern Province is four to six business days by road and Riyadh five to seven; Red Sea buyers in Jeddah and Yanbu are served by sea through Sohar Port. Most industrial imports need no Saudi agent under the GCC customs union.',
    leadTime: 'Dammam & Jubail 4–6 business days · Riyadh 5–7 · Jeddah & Yanbu 4–6 by sea',
    route: 'By road from Muscat for the Eastern Province and Riyadh; by sea from Sohar Port for Jeddah and Yanbu.',
    points: [
      { place: 'Dammam, Khobar & Jubail', time: '4–6 business days by road' },
      { place: 'Riyadh', time: '5–7 business days by road' },
      { place: 'Jeddah', time: '4–6 days by sea via Sohar Port' },
      { place: 'Yanbu', time: '4–6 days by sea via Sohar Port' },
    ],
    zones: ['Jubail Industrial City', 'Yanbu Industrial City', 'Dammam 2nd & 3rd Industrial Cities', 'Riyadh 2nd Industrial City', 'Jeddah Industrial City'],
    industries: [
      'Petrochemical and refinery maintenance — descaling and line cleaning',
      'Metal fabrication and stainless steel passivation',
      'Water treatment and desalination — membrane and exchanger cleaning',
      'Food, dairy and beverage plants — CIP acid cycles',
      'Industrial and university laboratories — sample digestion',
    ],
    documents:
      'Each consignment carries a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC Certificate of Origin, and we support the SASO documentation your importer files. Tell us the end use and the consignee details when you enquire.',
    faqs: [
      {
        question: 'How long does nitric acid take from Oman to Dammam or Riyadh?',
        answer:
          'Dammam, Khobar and Jubail are four to six business days by road from Muscat, and Riyadh five to seven. Jeddah and Yanbu are four to six days by sea from Sohar Port.',
      },
      {
        question: 'Do I need a Saudi agent to import nitric acid from Oman?',
        answer:
          'For most industrial chemicals moving between GCC states, no: goods of GCC origin with a GCC Certificate of Origin enter under the customs union. Your company is the importer of record; we prepare the commercial documents and support the SASO paperwork.',
      },
      {
        question: 'Can you supply nitric acid in IBCs or bulk to Jubail?',
        answer:
          'Yes. Industrial 68% nitric acid ships in 35 kg carboys, 60 kg drums and 1,000 L IBCs, and bulk arrangements are quoted for plant-scale users in Jubail and the Eastern Province.',
      },
    ],
    locationPage: '/chemicals/saudi-arabia',
  },
  qatar: {
    name: 'Qatar',
    inName: 'Qatar',
    title: 'Nitric Acid Supplier Qatar | 68% HNO3, Doha in 3–5 Days',
    description:
      'Nitric acid 68% for Doha, Mesaieed & Ras Laffan from Muscat stock, 3–5 business days by road. Industrial, food-contact & lab grades. CoA, SDS, GCC CoO.',
    intro:
      'Global Chemicals LLC supplies 68% nitric acid (HNO3) to Qatar from stock in Muscat, three to five business days to Doha and Mesaieed. Loads travel overland through Saudi Arabia under GCC customs transit, entering Qatar at Abu Samra, so buyers in Qatar get a GCC-origin source with GCC-preferential documents.',
    leadTime: 'Doha & Mesaieed 3–5 business days',
    route: 'By road from Muscat through Saudi Arabia under GCC customs transit, entering Qatar at the Salwa / Abu Samra border.',
    points: [
      { place: 'Doha & Doha Industrial Area', time: '3–5 business days' },
      { place: 'Mesaieed Industrial City', time: '3–5 business days' },
      { place: 'Ras Laffan', time: 'quoted per load' },
    ],
    zones: ['Doha Industrial Area', 'Mesaieed Industrial City', 'Ras Laffan Industrial City', 'Qatar Free Zones'],
    industries: [
      'Gas processing and petrochemical maintenance — descaling and cleaning',
      'Steel and metal fabrication — pickling and passivation',
      'Desalination and district cooling — exchanger and membrane cleaning',
      'Food and beverage plants — CIP acid stage',
      'Laboratories — ICP and AAS digestion',
    ],
    documents:
      'Every load is supplied with a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC Certificate of Origin, plus the clearance documents for entry at Abu Samra.',
    faqs: [
      {
        question: 'How long does nitric acid take from Oman to Doha?',
        answer:
          'Three to five business days to Doha and Mesaieed by road through Saudi Arabia. Ras Laffan deliveries are quoted per load because site access arrangements vary.',
      },
      {
        question: 'Which documents come with nitric acid shipped to Qatar?',
        answer:
          'A Certificate of Analysis for the batch, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC Certificate of Origin, together with the paperwork for clearance at the Abu Samra border.',
      },
      {
        question: 'What pack sizes can be delivered to Qatar?',
        answer:
          'Industrial and food-contact 68% nitric acid in 35 kg carboys, 60 kg drums and 1,000 L IBCs; laboratory grade 68–70% in 500 mL and 2.5 L amber glass bottles. Mixed loads with other acids and water-treatment chemicals are common.',
      },
    ],
  },
  kuwait: {
    name: 'Kuwait',
    inName: 'Kuwait',
    title: 'Nitric Acid Supplier Kuwait | 68% HNO3 from Oman, 4–6 Days',
    description:
      'Nitric acid 68% for Kuwait City, Shuaiba & Ahmadi from Muscat stock, 4–6 business days by road. Carboys, drums, IBCs. CoA, GHS SDS, GCC Certificate of Origin.',
    intro:
      'Global Chemicals LLC supplies 68% nitric acid (HNO3) to Kuwait from stock in Muscat, four to six business days by road. Consignments cross Saudi Arabia under GCC customs transit and travel with full customs and Certificate of Origin documentation for clearance into Kuwait.',
    leadTime: 'Kuwait City, Shuaiba & Ahmadi 4–6 business days',
    route: 'By road from Muscat through Saudi Arabia under GCC customs transit, entering Kuwait at Nuwaiseeb.',
    points: [
      { place: 'Kuwait City & Shuwaikh', time: '4–6 business days' },
      { place: 'Shuaiba Industrial Area', time: '4–6 business days' },
      { place: 'Ahmadi & Mina Abdullah', time: '4–6 business days' },
    ],
    zones: ['Shuaiba Industrial Area', 'Mina Abdullah', 'Sabhan Industrial Area', 'Amghara', 'Shuwaikh Industrial Area'],
    industries: [
      'Refinery and oilfield maintenance — descaling and line cleaning',
      'Metal fabrication — stainless steel pickling and passivation',
      'Desalination and power plants — exchanger and membrane cleaning',
      'Dairy and beverage plants — CIP acid stage',
      'Testing laboratories — sample digestion',
    ],
    documents:
      'Each consignment carries a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC Certificate of Origin, with the full customs documentation for entry at Nuwaiseeb.',
    faqs: [
      {
        question: 'How long does nitric acid take from Oman to Kuwait?',
        answer:
          'Four to six business days by road from Muscat to Kuwait City, Shuaiba and Ahmadi, crossing Saudi Arabia under GCC customs transit.',
      },
      {
        question: 'Can you supply nitric acid for refinery maintenance in Kuwait?',
        answer:
          'Yes. Industrial 68% nitric acid for descaling, passivation and line cleaning ships in 60 kg drums and 1,000 L IBCs, with a Certificate of Analysis per batch and a GHS Safety Data Sheet. Our ISO 9001:2015 and JSRS documentation is available for vendor registration.',
      },
      {
        question: 'Is nitric acid from Oman duty-free in Kuwait?',
        answer:
          'Goods of GCC origin travelling with a GCC Certificate of Origin are treated under the GCC customs union. We issue the certificate with every consignment; your importer clears the goods in Kuwait.',
      },
    ],
  },
  bahrain: {
    name: 'Bahrain',
    inName: 'Bahrain',
    title: 'Nitric Acid Supplier Bahrain | 68% HNO3, Manama 3–5 Days',
    description:
      'Nitric acid 68% for Manama, Sitra & Salman Industrial City from Muscat stock, 3–5 business days via the King Fahd Causeway. CoA, SDS, GCC preferential CoO.',
    intro:
      'Global Chemicals LLC supplies 68% nitric acid (HNO3) to Bahrain from stock in Muscat, three to five business days to Manama and the industrial areas. Trucks cross Saudi Arabia under GCC customs transit and enter Bahrain over the King Fahd Causeway, with a GCC preferential Certificate of Origin.',
    leadTime: 'Manama, Sitra & Salman Industrial City 3–5 business days',
    route: 'By road from Muscat through Saudi Arabia under GCC customs transit, entering Bahrain over the King Fahd Causeway.',
    points: [
      { place: 'Manama', time: '3–5 business days' },
      { place: 'Sitra', time: '3–5 business days' },
      { place: 'Salman Industrial City (Hidd, BIIP)', time: '3–5 business days' },
    ],
    zones: ['Sitra Industrial Area', 'Bahrain International Investment Park (Hidd)', 'Salman Industrial City', 'Mina Salman', 'Askar'],
    industries: [
      'Aluminium and metal processing — cleaning and passivation',
      'Refinery maintenance — descaling and line cleaning',
      'Desalination and power plants — exchanger and membrane cleaning',
      'Food and beverage plants — CIP acid stage',
      'Laboratories — ICP and AAS digestion',
    ],
    documents:
      'Every load carries a Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, an HS-coded commercial invoice and a GCC preferential Certificate of Origin for clearance at the King Fahd Causeway.',
    faqs: [
      {
        question: 'How long does nitric acid take from Oman to Bahrain?',
        answer:
          'Three to five business days by road from Muscat to Manama, Sitra and Salman Industrial City, crossing Saudi Arabia under GCC customs transit and entering over the King Fahd Causeway.',
      },
      {
        question: 'Do you issue a GCC preferential Certificate of Origin for Bahrain?',
        answer:
          'Yes. Every consignment to Bahrain carries a GCC preferential Certificate of Origin, together with the Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, and an HS-coded commercial invoice.',
      },
      {
        question: 'Which nitric acid packs can be shipped to Bahrain?',
        answer:
          'Industrial and food-contact 68% nitric acid in 35 kg carboys, 60 kg drums and 1,000 L IBCs, and laboratory grade 68–70% in 500 mL and 2.5 L bottles. Smaller laboratory orders can travel in a mixed load.',
      },
    ],
  },
};

const NITRIC_COUNTRY_SLUGS = Object.keys(COUNTRIES) as NitricCountryKey[];

const COMMON_FAQS = (inName: string) => [
  {
    question: `What nitric acid grades can you supply to ${inName}?`,
    answer:
      'Industrial / technical 68% HNO3 for pickling, passivation, descaling and effluent neutralisation; food-contact 68% for CIP acid cycles in dairy, brewery and beverage plants; and laboratory 68–70% ACS or trace-metal grade (specific gravity 1.42) for ICP-MS and AAS digestion. CAS 7697-37-2.',
  },
  {
    question: `How is nitric acid transported to ${inName}?`,
    answer:
      '68% nitric acid is UN 2031, Class 8 with an oxidiser (5.1) subsidiary risk, Packing Group II. It travels in UN-approved HDPE carboys, drums and IBCs, segregated from organics, reducing agents and combustibles, with the Safety Data Sheet on board.',
  },
];

const PACKS = [
  { grade: 'Industrial / technical', strength: '68% HNO3', packs: '35 kg carboy · 60 kg drum · 1,000 L IBC · bulk on request', link: '/products/food-beverage/nitric-acid-68' },
  { grade: 'Food contact (CIP)', strength: '68% HNO3', packs: '35 kg carboy · 60 kg drum · 1,000 L IBC', link: '/products/food-beverage/nitric-acid-68' },
  { grade: 'Laboratory (ACS / trace metal)', strength: '68–70%, SG 1.42', packs: '500 mL & 2.5 L amber glass', link: '/products/lab-chemicals/nitric-acid-lab' },
];

const OTHER_LABEL: Record<NitricCountryKey, string> = {
  uae: 'UAE',
  'saudi-arabia': 'Saudi Arabia',
  qatar: 'Qatar',
  kuwait: 'Kuwait',
  bahrain: 'Bahrain',
};

const NitricAcidCountry = ({ country }: { country: NitricCountryKey }) => {
  const c = COUNTRIES[country];
  const url = `https://gcoman.com/chemical-supplier/nitric-acid-${country}`;
  const faqs = [...c.faqs, ...COMMON_FAQS(c.inName)];
  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: 'Nitric Acid Supplier Oman & GCC', url: 'https://gcoman.com/chemical-supplier/nitric-acid-oman' },
    { name: `Nitric Acid Supplier ${c.name}`, url },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={c.title}
        description={c.description}
        keywords={`nitric acid supplier ${c.name}, nitric acid ${c.name}, HNO3 supplier ${c.name}, nitric acid 68% ${c.name}, nitric acid price ${c.name}, nitric acid from Oman`}
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
              <Badge className="mb-4 text-sm px-4 py-1.5">68% HNO3 • {c.leadTime} • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Nitric Acid Supplier in {c.inName}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                {c.intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', `nitric_${country}_quote`)}>
                  <Link to={`/contact?product=${encodeURIComponent(`Nitric Acid (${c.name})`)}`} rel="nofollow">
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
                  <Truck className="w-6 h-6 text-primary" /> Delivery to {c.inName}
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
                  <Factory className="w-6 h-6 text-primary" /> Who uses nitric acid in {c.inName}
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Grades and pack sizes for {c.inName}</h2>
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
                        <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">{p.strength}</td>
                        <td className="px-4 py-2 text-muted-foreground">{p.packs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-10 mb-3 flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-primary" /> Documents with every consignment
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl">{c.documents}</p>
            </div>
          </div>
        </section>

        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">Specifications, applications and pricing</h2>
              <p className="text-muted-foreground leading-relaxed">
                The full specification table, applications and price guidance are on the{' '}
                <Link to="/chemical-supplier/nitric-acid-oman" className="text-primary hover:underline">nitric acid supplier Oman &amp; GCC</Link>{' '}
                page.
                {c.locationPage && (
                  <>
                    {' '}For the rest of the catalogue shipped to {c.inName}, see{' '}
                    <Link to={c.locationPage} className="text-primary hover:underline">chemical supply to {c.inName}</Link>.
                  </>
                )}{' '}
                Nitric acid to other GCC markets:{' '}
                {NITRIC_COUNTRY_SLUGS.filter((k) => k !== country).map((k, i, arr) => (
                  <span key={k}>
                    <Link to={`/chemical-supplier/nitric-acid-${k}`} className="text-primary hover:underline">{OTHER_LABEL[k]}</Link>
                    {i < arr.length - 1 ? ', ' : '.'}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} heading={`Nitric acid in ${c.inName} — frequently asked questions`} />
      </main>

      <Footer />
    </div>
  );
};

export default NitricAcidCountry;
