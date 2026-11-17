import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Truck, FileCheck2, Droplets, MessageCircle, Factory } from 'lucide-react';

/**
 * Water treatment chemicals, one hub for the GCC export markets (2026-10-27,
 * MASTER-PLAN P9.4).
 *
 * Why: the 2026-10-27 demand study (docs/seo/gcc-keyword-demand-2026-10-27.md)
 * found "water treatment chemicals suppliers in uae" is Google's FIRST
 * suggestion at gl=ae and appears in all six GCC countries, with "water
 * treatment chemicals price list" beside it. The same day's baseline read
 * (location-ledger 2026-10-27): for "water treatment chemicals supplier oman"
 * the HOMEPAGE ranks #2 and the category page /products/water-treatment is
 * absent; for the UAE phrasing gcoman.com is absent from the top 9 entirely.
 * We are absent, not outranked: the condition NitricAcidOman.tsx sets for
 * building a page. The category page is a product grid with one intro
 * paragraph; the GCC desalination blog post is editorial. Neither names a
 * lead time, a pack, a spec or a country in a form a buyer (or an AI engine)
 * can lift.
 *
 * Scope is closed: ONE page for the six GCC markets. No per-country copies
 * until the nitric country pages (P8.F) show Google impressions; no product x
 * city pages (HANDOFF). Every spec restates the product page it links to
 * (src/data/products/water-treatment.json, ro-chemicals.json); every lead
 * time and crossing restates the /chemicals/<market> pages and
 * NitricAcidCountry.tsx; the Gulf feedwater figures restate the GCC
 * desalination post. No price is stated (P8.C2 is the user's decision).
 */

const URL = 'https://gcoman.com/chemical-supplier/water-treatment-chemicals-gcc';

type ProductRow = { name: string; spec: string; packs: string; link: string };

// Links go to the canonical SKU only. aluminium-sulphate-powder,
// chlorine-tablets and sodium-hypochlorite-2 carry a canonicalOverride and must
// never be linked from a hub (caustic-soda-hub.spec.ts explains why).
const PRODUCTS: ProductRow[] = [
  { name: 'Poly aluminium chloride (PAC) liquid', spec: '10–11% Al2O3, basicity 40–90%, effective pH 5–9', packs: '1,000 L IBC · bulk', link: '/products/water-treatment/pac-liquid' },
  { name: 'Poly aluminium chloride (PAC) powder', spec: '28–30% Al2O3', packs: '25 kg bags', link: '/products/water-treatment/pac-powder' },
  { name: 'Aluminium sulphate (alum)', spec: 'Liquid 8–9% Al2O3; powder 17–18% Al2O3', packs: 'IBC · bulk; 25 kg and 50 kg bags', link: '/products/water-treatment/aluminium-sulphate-liquid' },
  { name: 'Ferric chloride 40%', spec: '38–42% FeCl3, effective pH 4–11', packs: 'IBC · bulk', link: '/products/water-treatment/ferric-chloride-liquid' },
  { name: 'Polyelectrolyte (flocculant)', spec: 'Anionic, cationic and non-ionic; 0.1–10 ppm', packs: '25 kg bags · emulsion', link: '/products/water-treatment/polyelectrolyte' },
  { name: 'Sodium hypochlorite', spec: '12–15% available chlorine', packs: 'Drums · 1,000 L IBC · bulk', link: '/products/water-treatment/sodium-hypochlorite' },
  { name: 'Calcium hypochlorite', spec: '65–75% available chlorine, granular', packs: '25 kg and 45 kg drums', link: '/products/water-treatment/calcium-hypochlorite-water' },
  { name: 'RO antiscalant', spec: '2–5 ppm in RO feed; membrane grade 3–8 ppm, LSI to +3.0', packs: '25 kg · 200 kg drums · IBC', link: '/products/ro-chemicals/antiscalant-ro' },
  { name: 'RO membrane cleaners', spec: 'Citric (acid), alkaline and general-fouling cleaners, 1–3% solutions', packs: '25 kg · 200 kg drums · IBC', link: '/products/ro-chemicals/membrane-cleaner-ro' },
  { name: 'Sodium metabisulphite (dechlorination)', spec: '96% min Na2S2O5', packs: '25 kg bags', link: '/products/water-treatment/sodium-metabisulphite' },
  { name: 'Caustic soda (lye and flakes)', spec: 'Liquid 32%, 48% or 50% NaOH; flakes 98–99%', packs: 'IBC · bulk; 25 kg bags', link: '/products/water-treatment/caustic-soda-liquid' },
  { name: 'Hydrated lime', spec: '90–96% Ca(OH)2', packs: '25 kg and 50 kg bags · bulk', link: '/products/water-treatment/hydrated-lime' },
  { name: 'Soda ash', spec: '99.2% min Na2CO3, dense and light', packs: '25 kg and 50 kg bags', link: '/products/water-treatment/soda-ash-water' },
  { name: 'Corrosion inhibitor (boiler and cooling)', spec: 'Phosphate, molybdate and organic programmes; 10–50 ppm', packs: 'Drums · IBC', link: '/products/water-treatment/corrosion-inhibitor-water' },
  { name: 'Biocide (water treatment grade)', spec: 'Oxidising and non-oxidising; 10–50 ppm', packs: 'Drums', link: '/products/water-treatment/biocide-water' },
  { name: 'Antifoam', spec: 'Silicone and non-silicone; 10–100 ppm', packs: 'Drums', link: '/products/water-treatment/antifoam-water' },
];

// The rest of the water-treatment range, so every live SKU in these four
// categories has a hub link (360° audit 2026-11-17: 50 products had none).
// Canonical SKUs only; regenerate from the category JSON files when products
// are added or canonicalised.
type RangeGroup = { title: string; category: string; items: { name: string; link: string }[] };
const RANGE: RangeGroup[] = [
  {
    title: 'Water treatment',
    category: '/products/water-treatment',
    items: [
      { name: "Activated Carbon (Water Treatment Grade)", link: '/products/water-treatment/activated-carbon-water' },
      { name: "Antiscalant", link: '/products/water-treatment/antiscalant-water' },
      { name: "Calcium Carbonate (Water Treatment Grade)", link: '/products/water-treatment/calcium-carbonate-water' },
      { name: "Caustic Soda Flakes", link: '/products/water-treatment/caustic-soda-flakes' },
      { name: "Caustic Soda Prills", link: '/products/water-treatment/caustic-soda-prills' },
      { name: "Citric Acid Monohydrate", link: '/products/water-treatment/citric-acid-monohydrate' },
      { name: "Copper Sulphate Liquid", link: '/products/water-treatment/copper-sulphate-liquid' },
      { name: "DEG (Diethylene Glycol) — Industrial Solvent Grade", link: '/products/water-treatment/deg-water' },
      { name: "Ethanol 99%", link: '/products/water-treatment/ethanol-99' },
      { name: "Ferrous Sulphate", link: '/products/water-treatment/ferrous-sulphate' },
      { name: "Glycerine (Pharmaceutical & Food Grade)", link: '/products/water-treatment/glycerine-water' },
      { name: "Hydrochloric Acid (HCl 30-33%)", link: '/products/water-treatment/hydrochloric-acid-industrial' },
      { name: "Industrial Salt (Sodium Chloride)", link: '/products/water-treatment/sodium-chloride-industrial' },
      { name: "MPG (Monopropylene Glycol)", link: '/products/water-treatment/mpg-water' },
      { name: "Paraffin Wax", link: '/products/water-treatment/paraffin-wax' },
      { name: "Petroleum Jelly", link: '/products/water-treatment/petroleum-jelly' },
      { name: "Potassium Hydroxide (Water Treatment Grade)", link: '/products/water-treatment/potassium-hydroxide-water' },
      { name: "Sodium Bicarbonate", link: '/products/water-treatment/sodium-bicarbonate-water' },
      { name: "Sodium Bisulphate / Bisulphite", link: '/products/water-treatment/sodium-bisulphate-bisulphite' },
      { name: "Sodium Hexametaphosphate", link: '/products/water-treatment/sodium-hexametaphosphate' },
      { name: "Sodium Meta Silicate", link: '/products/water-treatment/sodium-meta-silicate' },
      { name: "Sodium Sulphite", link: '/products/water-treatment/sodium-sulphite' },
      { name: "Sulphamic Acid", link: '/products/water-treatment/sulphamic-acid' },
      { name: "TSP (Tri Sodium Phosphate)", link: '/products/water-treatment/tsp-water' },
    ],
  },
  {
    title: 'RO membrane chemicals',
    category: '/products/ro-chemicals',
    items: [
      { name: "Citric Acid Liquid (RO Membrane Cleaning Grade)", link: '/products/ro-chemicals/citric-acid-liquid-ro' },
      { name: "Membrane Alka Cleaner", link: '/products/ro-chemicals/membrane-alka-cleaner' },
      { name: "Membrane Antiscalant RO", link: '/products/ro-chemicals/membrane-antiscalant-ro' },
      { name: "RO Membrane Descaler (RO 222)", link: '/products/ro-chemicals/ro-222-descaler' },
      { name: "RO Passivation", link: '/products/ro-chemicals/ro-passivation' },
      { name: "Sodium Hydroxide Based Alkaleen Cleaner", link: '/products/ro-chemicals/sodium-hydroxide-alkaleen' },
    ],
  },
  {
    title: 'Cooling water and boiler treatment',
    category: '/products/cooling-water',
    items: [
      { name: "Algae Control", link: '/products/cooling-water/algae-control' },
      { name: "Altreat 4000", link: '/products/cooling-water/altreat-4000' },
      { name: "Antifouling Liquid", link: '/products/cooling-water/antifouling-liquid' },
      { name: "Biocide (Cooling Tower Grade)", link: '/products/cooling-water/biocide-cooling' },
      { name: "Biocide For Closed Loop Chiller Water", link: '/products/cooling-water/biocide-closed-loop-chiller' },
      { name: "Biofilm & Legionella Control Biocide (Biological Guard)", link: '/products/cooling-water/biological-guard-antifouling' },
      { name: "Boiler & Cooling Tower Scale Inhibitor (Hardness Control Treatment)", link: '/products/cooling-water/hardness-control-boiler' },
      { name: "Cool Water Treat Corrosion Inhibitor", link: '/products/cooling-water/cool-water-treat-corrosion' },
      { name: "Corro Guard For Antifoulant for Cooling Water", link: '/products/cooling-water/corro-guard-antifoulant' },
      { name: "Corrosion Inhibitor Closed Loop", link: '/products/cooling-water/corrosion-inhibitor-closed-loop' },
      { name: "Microbiological Control for Cooling Towers (Micro Biocid)", link: '/products/cooling-water/micro-biocid-cooling-water' },
    ],
  },
  {
    title: 'Corrosion inhibitors and oxygen scavengers',
    category: '/products/corrosion-inhibitor',
    items: [
      { name: "Corrosion Inhibitor (General Industrial Grade)", link: '/products/corrosion-inhibitor/corrosion-inhibitor-general' },
      { name: "Corrosion Inhibitor Closed Cooling System", link: '/products/corrosion-inhibitor/corrosion-inhibitor-closed-system' },
      { name: "Corrosion Inhibitor Closed Cooling System Molybdate", link: '/products/corrosion-inhibitor/corrosion-inhibitor-molybdate' },
      { name: "Corrosion Inhibitor For Gas Compressor", link: '/products/corrosion-inhibitor/corrosion-inhibitor-gas-compressor' },
      { name: "Corrosion Inhibitor For Metal Rust Preventive", link: '/products/corrosion-inhibitor/corrosion-inhibitor-rust-preventive' },
      { name: "Corrosion Inhibitor For Multi Metal Cooling Water", link: '/products/corrosion-inhibitor/corrosion-inhibitor-multi-metal' },
      { name: "High-Temperature Corrosion Inhibitor (Corrosion Inhibitor 2000)", link: '/products/corrosion-inhibitor/corrosion-inhibitor-2000' },
      { name: "Oxygen Scavenger", link: '/products/corrosion-inhibitor/oxygen-scavenger' },
      { name: "Ph Booster Cum Corrosion Inhibitor", link: '/products/corrosion-inhibitor/ph-booster-corrosion-inhibitor' },
      { name: "Sodium Molybdate", link: '/products/corrosion-inhibitor/sodium-molybdate' },
    ],
  }
];

type Market = { market: string; points: string; leadTime: string; route: string; link: string };

const MARKETS: Market[] = [
  { market: 'UAE', points: 'Dubai, Sharjah, Abu Dhabi, Ras Al Khaimah', leadTime: '3–5 business days; Fujairah and the east coast 2–4 hours', route: 'Road from Muscat via the Hatta and Al Ain lanes under GCC customs transit', link: '/chemicals/uae' },
  { market: 'Saudi Arabia', points: 'Dammam, Khobar, Jubail; Riyadh; Jeddah, Yanbu', leadTime: 'Eastern Province 4–6 business days; Riyadh 5–7; Jeddah and Yanbu by sea, quoted per sailing', route: 'Road via the Batha crossing; sea from Sohar Port for the Red Sea coast', link: '/chemicals/saudi-arabia' },
  { market: 'Qatar', points: 'Doha, Mesaieed, Ras Laffan', leadTime: '3–5 business days; Ras Laffan quoted per load', route: 'Road through Saudi Arabia, entering at Abu Samra', link: '/chemicals/doha' },
  { market: 'Kuwait', points: 'Kuwait City, Shuaiba, Ahmadi', leadTime: '4–6 business days', route: 'Road through Saudi Arabia, entering at Nuwaiseeb', link: '/chemicals/kuwait-city' },
  { market: 'Bahrain', points: 'Manama, Sitra, Salman Industrial City', leadTime: '3–5 business days', route: 'Road through Saudi Arabia over the King Fahd Causeway', link: '/chemicals/bahrain' },
  { market: 'Oman', points: 'Muscat, Sohar, Salalah, Duqm', leadTime: 'Muscat same day; Sohar next day; Salalah and Duqm 2–3 days', route: 'Own fleet from the Muscat warehouse', link: '/chemicals/muscat' },
];

type Stage = { stage: string; purpose: string; chemicals: string };

const TRAIN: Stage[] = [
  { stage: 'Seawater intake', purpose: 'Control marine biofouling on screens and pretreatment filters', chemicals: 'Sodium hypochlorite (oxidising biocide), non-oxidising biocide' },
  { stage: 'Coagulation and clarification', purpose: 'Remove suspended solids and colloids ahead of filters and membranes', chemicals: 'PAC, aluminium sulphate, ferric chloride, polyelectrolyte' },
  { stage: 'Dechlorination before RO', purpose: 'Remove free chlorine, which damages polyamide membranes', chemicals: 'Sodium metabisulphite, sodium bisulphite' },
  { stage: 'RO feed', purpose: 'Hold calcium, magnesium, sulphate and carbonate scale in solution', chemicals: 'Antiscalant at 2–5 ppm (membrane grade 3–8 ppm)' },
  { stage: 'Membrane cleaning (CIP)', purpose: 'Remove scale, biofilm and organics on the maintenance cycle', chemicals: 'Citric acid cleaner, alkaline cleaner, general membrane cleaner, RO descaler' },
  { stage: 'Post-treatment and pH', purpose: 'Correct pH and alkalinity before distribution', chemicals: 'Caustic soda, hydrated lime, soda ash, sodium bicarbonate' },
  { stage: 'Cooling towers and boilers', purpose: 'Protect metal and control growth where product water is reused', chemicals: 'Corrosion inhibitor, biocide, antifoam, sodium hexametaphosphate' },
];

const FAQS = [
  {
    question: 'Do you supply water treatment chemicals to the UAE?',
    answer:
      'Yes. Dubai, Sharjah, Abu Dhabi and Ras Al Khaimah are three to five business days by road from Muscat through the Hatta and Al Ain lanes under GCC customs transit, and Fujairah and the east coast are two to four hours. For free-zone sites (JAFZA, Dubai Industrial City, ICAD, SAIF Zone, RAKEZ) send the zone and company licence details with the order and the gate paperwork is prepared before dispatch.',
  },
  {
    question: 'Which coagulant do GCC desalination and municipal plants use, PAC or alum?',
    answer:
      'Poly aluminium chloride is the standard pretreatment coagulant across GCC trains: it works over an effective pH range of 5 to 9 and is supplied as a 10–11% Al2O3 liquid in IBCs or a 28–30% powder. Aluminium sulphate stays in use at plants whose dosing systems were built around it, and ferric chloride 40% is chosen where phosphorus removal or sludge conditioning is the goal.',
  },
  {
    question: 'Can sodium hypochlorite be delivered from Oman to Saudi Arabia?',
    answer:
      'Yes. Sodium hypochlorite 12–15% ships in drums and 1,000 L IBCs: Dammam, Khobar and Jubail are four to six business days by road and Riyadh five to seven. Hypochlorite loses strength in heat, so loads are dispatched from fresh stock and the available chlorine is dated on the Certificate of Analysis. Sites that hold chlorine for months usually take calcium hypochlorite 65–75% granules instead.',
  },
  {
    question: 'Is there import duty on water treatment chemicals shipped from Oman within the GCC?',
    answer:
      'Goods of GCC origin travelling with a GCC Certificate of Origin cross under the customs union without import duty; goods we stock from outside the GCC are declared by their origin and duty follows the HS code. Every consignment carries a Certificate of Origin attested by the Oman Chamber of Commerce and an HS-coded commercial invoice, and your company is the importer of record.',
  },
  {
    question: 'Do you have a water treatment chemicals price list?',
    answer:
      'There is no fixed public price list, because coagulant, hypochlorite and caustic prices move with raw-material markets and depend on pack and volume. Send the product and specification, monthly volume, pack format and delivery city, and a quotation per tonne or per pack follows within 24 hours. Add a water analysis if you want a dose recommendation with it.',
  },
  {
    question: 'Are your RO antiscalants certified for drinking water?',
    answer:
      'Ask for the NSF/ANSI 60 certificate with the quotation: certification is held per product grade, so the grade quoted for a potable-water plant is confirmed against its certificate before supply. The RO antiscalant is dosed at 2–5 ppm in the RO feed; the membrane antiscalant grade runs 3–8 ppm, inhibits silica up to 200 ppm and holds an LSI of up to +3.0. Each batch ships with its Certificate of Analysis and Safety Data Sheet.',
  },
];

const bulkWhatsApp =
  'https://wa.me/96892772305?text=' +
  encodeURIComponent(
    'Water treatment chemicals enquiry (gcoman.com). Products: ___. Monthly volume: ___. Pack: IBC / drums / bags / bulk. Delivery city and country: ___. Company: ___'
  );

const WaterTreatmentChemicalsGcc = () => {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: 'Chemical Suppliers Middle East', url: 'https://gcoman.com/chemical-suppliers-middle-east' },
    { name: 'Water Treatment Chemicals Supplier GCC', url: URL },
  ];
  const title = 'Water Treatment Chemicals Supplier UAE, Saudi Arabia & GCC';
  const description =
    'PAC, ferric chloride, sodium & calcium hypochlorite, RO antiscalants, membrane cleaners and caustic soda from Muscat stock: Dubai 3–5 days, Dammam 4–6, Doha 3–5. CoA, SDS, GCC CoO.';

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={title}
        description={description}
        keywords="water treatment chemicals suppliers in UAE, water treatment chemicals supplier Saudi Arabia, water treatment chemicals GCC, desalination chemicals supplier, RO antiscalant supplier UAE, PAC coagulant supplier GCC, sodium hypochlorite supplier UAE, water treatment chemicals price list, water treatment chemicals supplier Oman"
        ogTitle={title}
        ogDescription={description}
        ogUrl={URL}
        canonical={URL}
      />
      <FAQStructuredData faqs={FAQS} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData url={URL} cssSelector={['h1', 'h2', '.speakable']} />
      <Navigation />

      <main id="main-content">
        <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">Coagulants • Hypochlorite • RO antiscalants • Muscat stock • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Water Treatment Chemicals Supplier for the UAE, Saudi Arabia and the GCC
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                Global Chemicals LLC supplies water treatment chemicals from Muscat stock to desalination plants, water
                utilities, district cooling operators, hotels and industrial sites across the UAE, Saudi Arabia, Qatar,
                Kuwait, Bahrain and Oman: PAC and ferric chloride coagulants, polyelectrolyte flocculants, sodium and
                calcium hypochlorite, RO antiscalants and membrane cleaners, sodium metabisulphite, caustic soda, lime and
                corrosion inhibitors. Dubai is three to five business days by road and the Eastern Province of Saudi Arabia
                four to six, and every load carries a Certificate of Analysis, a GHS Safety Data Sheet in English and
                Arabic and a GCC Certificate of Origin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'wt_gcc_quote')}>
                  <Link to={`/contact?product=${encodeURIComponent('Water Treatment Chemicals (GCC)')}`} rel="nofollow">
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
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Droplets className="w-6 h-6 text-primary" /> Which water treatment chemicals do you supply to the GCC?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
                The full range is on the{' '}
                <Link to="/products/water-treatment" className="text-primary hover:underline">water treatment chemicals</Link>{' '}
                and{' '}
                <Link to="/products/ro-chemicals" className="text-primary hover:underline">RO membrane chemicals</Link>{' '}
                category pages; these are the products GCC plants order in volume. Specifications restate each product page.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Chemical</th>
                      <th className="px-4 py-2 font-semibold">Specification</th>
                      <th className="px-4 py-2 font-semibold">Packs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map((p) => (
                      <tr key={p.link + p.name} className="border-t border-border align-top">
                        <td className="px-4 py-2">
                          <Link to={p.link} className="text-primary hover:underline font-medium">{p.name}</Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{p.spec}</td>
                        <td className="px-4 py-2 text-muted-foreground">{p.packs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Product hubs with handling, dosing and price guidance:{' '}
                <Link to="/chemical-supplier/poly-aluminium-chloride-oman" className="text-primary hover:underline">PAC coagulant</Link>,{' '}
                <Link to="/chemical-supplier/sodium-hypochlorite-oman" className="text-primary hover:underline">sodium hypochlorite</Link>,{' '}
                <Link to="/chemical-supplier/caustic-soda-oman" className="text-primary hover:underline">caustic soda</Link>,{' '}
                <Link to="/chemical-supplier/hydrochloric-acid-oman" className="text-primary hover:underline">hydrochloric acid</Link>.
                Dosing: <Link to="/tools/dosing-calculator" className="text-primary hover:underline">chlorine and dechlorination calculator</Link>.
              </p>
              <h3 className="text-xl font-semibold text-foreground mt-10 mb-3">The full water treatment range</h3>
              <p className="text-muted-foreground mb-4">
                Every other water treatment, RO, cooling-water and corrosion-control product we supply from Muscat stock, by category.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {RANGE.map((g) => (
                  <div key={g.title}>
                    <h4 className="font-semibold text-foreground mb-2">
                      <Link to={g.category} className="hover:underline">{g.title}</Link>
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {g.items.map((i) => (
                        <li key={i.link}>
                          <Link to={i.link} className="text-primary hover:underline">{i.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-6 h-6 text-primary" /> Where do you deliver water treatment chemicals in the GCC?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6 speakable">
                Every market is served from the Muscat warehouse on scheduled weekly departures, with drum, IBC and
                full-container loads consolidated per destination and a dedicated truck quoted for urgent plant loads.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Market</th>
                      <th className="px-4 py-2 font-semibold">Delivery points</th>
                      <th className="px-4 py-2 font-semibold">Lead time from Muscat</th>
                      <th className="px-4 py-2 font-semibold">Route</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MARKETS.map((m) => (
                      <tr key={m.market} className="border-t border-border align-top">
                        <td className="px-4 py-2">
                          <Link to={m.link} className="text-primary hover:underline font-medium">{m.market}</Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{m.points}</td>
                        <td className="px-4 py-2 text-muted-foreground">{m.leadTime}</td>
                        <td className="px-4 py-2 text-muted-foreground">{m.route}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Factory className="w-6 h-6 text-primary" /> Which chemical goes where in a GCC desalination train?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
                Arabian Gulf feedwater runs at 45,000–50,000 ppm total dissolved solids, above the global seawater
                average, and summer feed temperatures regularly exceed 35°C, so scaling and biological growth are faster
                than the design assumptions of programmes written for Atlantic or Mediterranean plants. Antiscalant and
                biocide dosing is sized accordingly. The stages below apply to reverse osmosis plants; multi-stage flash
                and multi-effect distillation plants use the same intake, coagulation and antiscalant chemistry at
                higher temperatures.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Stage</th>
                      <th className="px-4 py-2 font-semibold">What it does</th>
                      <th className="px-4 py-2 font-semibold">Chemicals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRAIN.map((s) => (
                      <tr key={s.stage} className="border-t border-border align-top">
                        <td className="px-4 py-2 font-medium text-foreground">{s.stage}</td>
                        <td className="px-4 py-2 text-muted-foreground">{s.purpose}</td>
                        <td className="px-4 py-2 text-muted-foreground">{s.chemicals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Background on the region's plants and chemistry:{' '}
                <Link to="/blog/gcc-desalination-water-treatment-chemicals" className="text-primary hover:underline">
                  desalination and water treatment chemicals across the GCC
                </Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileCheck2 className="w-6 h-6 text-primary" /> What documents come with each consignment?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  A batch Certificate of Analysis, a GHS Safety Data Sheet in English and Arabic, a Technical Data Sheet,
                  a Certificate of Origin attested by the Oman Chamber of Commerce and an HS-coded commercial invoice.
                  For potable-water plants, the NSF/ANSI 60 certificate of the antiscalant grade quoted is provided on request. For Saudi Arabia we support the
                  SASO conformity paperwork your importer files, and for every regulated product (hypochlorite, caustic
                  soda, ferric chloride) permit guidance is given per destination before shipment. ISO 9001:2015 and JSRS
                  registration documents are available for vendor qualification.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Who buys water treatment chemicals from us in the GCC?</h2>
                <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                  <li>Seawater and brackish-water desalination plants (RO, MSF and MED) and their O&amp;M contractors</li>
                  <li>Municipal water and wastewater utilities and their treatment-plant operators</li>
                  <li>District cooling, HVAC and facilities-management companies in Dubai, Abu Dhabi, Doha and Muscat</li>
                  <li>Power, petrochemical and refinery utilities running boilers and cooling towers</li>
                  <li>Hotels, resorts and water parks treating pools and cooling loops</li>
                  <li>Food, beverage and dairy plants treating boiler feed and process water</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t" id="bulk-supply">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Do you publish a water treatment chemicals price list?</h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6 speakable">
                No fixed list: coagulant, hypochlorite and caustic prices move with raw-material markets and depend on the
                pack and the monthly volume. A quotation per tonne or per pack follows within 24 hours of an enquiry that
                names the product and specification, the monthly volume, the pack format and the delivery city. Standing
                monthly orders for plant programmes are priced on a volume tier.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-lg border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-2">Bulk formats</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    PAC liquid, ferric chloride, caustic lye and sodium hypochlorite in 1,000 L IBCs or bulk; powders and
                    granules in 25 kg and 50 kg bags on pallets; antiscalants and membrane cleaners in 25 kg and 200 kg
                    drums or IBCs. Mixed loads across the range travel on the same truck.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-2">What to send for a dose recommendation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The feedwater analysis (TDS, hardness, alkalinity, silica, pH), the plant capacity and the membrane
                    or system type. Our technical team returns the dose rate with the quotation.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'wt_gcc_bulk_whatsapp')}>
                  <a href={bulkWhatsApp} target="_blank" rel="noopener noreferrer nofollow">
                    <MessageCircle className="w-5 h-5" /> WhatsApp an enquiry
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'wt_gcc_bulk_quote')}>
                  <Link to={`/contact?product=${encodeURIComponent('Water Treatment Chemicals bulk (GCC)')}`} rel="nofollow">
                    Request a bulk quotation <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">Chemical supply across the Middle East</h2>
              <p className="text-muted-foreground leading-relaxed">
                Lead times, documents and the rest of the catalogue for each market are on the{' '}
                <Link to="/chemical-suppliers-middle-east" className="text-primary hover:underline">chemical suppliers Middle East</Link>{' '}
                page and the country pages for{' '}
                <Link to="/chemicals/uae" className="text-primary hover:underline">the UAE</Link> and{' '}
                <Link to="/chemicals/saudi-arabia" className="text-primary hover:underline">Saudi Arabia</Link>. Supply inside
                Oman is covered on{' '}
                <Link to="/chemical-suppliers-oman" className="text-primary hover:underline">chemical suppliers Oman</Link>.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={FAQS} heading="Water treatment chemicals in the GCC — frequently asked questions" />
      </main>

      <Footer />
    </div>
  );
};

export default WaterTreatmentChemicalsGcc;
