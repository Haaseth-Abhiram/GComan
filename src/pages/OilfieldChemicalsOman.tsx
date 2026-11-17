import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Factory } from 'lucide-react';
import oilfieldProducts from '@/data/products/oilfield.json';

/**
 * Oilfield chemicals hub — Phase 2.6 of docs/seo/MASTER-PLAN.md.
 *
 * Why: oilfield is the largest product family (47 live pages, 1,335 impressions
 * in 90 days to 2026-10-13) and "oilfield chemicals supplier oman" is held by
 * muscatchemical and soharchemical, with us outside the top 8. Buyers here search
 * by job — drilling fluid, completion brine, gas treating — so the hub groups the
 * catalogue that way.
 *
 * Every row is generated at build time from src/data/products/oilfield.json:
 * the product's own one-line description and its "Packaging" / "Available …"
 * line. The grouping is the only editorial input; unknown ids fall into "Other
 * oilfield chemicals" so new products are never silently dropped.
 */

type P = { id: string; title: string; description: string; details: { technicalSpecs?: string[] | Record<string, string>; canonicalOverride?: string } };

const specList = (p: P): string[] => {
  const s = p.details.technicalSpecs;
  if (!s) return [];
  return Array.isArray(s) ? s : Object.entries(s).map(([k, v]) => `${k}: ${v}`);
};
const supplyOf = (p: P) =>
  (specList(p).find((l) => /^(packaging|available)/i.test(l)) ?? 'On request').replace(/^(packaging|available(?: in| forms| concentrations| grades| types)?):?\s*/i, '');

const GROUPS: { title: string; ids: string[] }[] = [
  { title: 'Drilling fluid chemicals', ids: ['bentonite-powder', 'cmc', 'potassium-chloride', 'soda-ash-dense', 'potassium-hydroxide', 'ammonium-chloride', 'formic-acid', 'surfactant-sodium-silicate', 'magnesium-oxide'] },
  { title: 'Completion and workover brines', ids: ['calcium-chloride-oil', 'calcium-bromide'] },
  { title: 'Well stimulation and scale removal', ids: ['citric-acid-liquid', 'citric-acid-powder', 'acetic-acid', 'ammonium-bifluoride', 'descalant'] },
  { title: 'Gas treating, dehydration and odorisation', ids: ['mea', 'dea', 'mdea', 'potassium-carbonate', 'meg', 'deg', 'methanol-tech', 'tht-gas-odorant', 'activated-alumina-desiccant', 'silica-gel-white', 'silica-gel-blue', 'silica-gel-orange'] },
  { title: 'Production chemicals', ids: ['corrosion-inhibitor', 'demulsifier-oilfield', 'reverse-demulsifier', 'ammonium-bisulphite', 'sodium-nitrite'] },
  { title: 'Water, boiler and dechlorination', ids: ['hydrazine-hydrate', 'sodium-thiosulphate-liquid', 'activated-carbon', 'barium-chloride'] },
  { title: 'Cleaning and solvents', ids: ['degreaser-hd', 'solvent-naphtha', 'butyl-glycol'] },
];

const products = (oilfieldProducts as P[]).filter((p) => !p.details.canonicalOverride);
const grouped = GROUPS.map((g) => ({
  title: g.title,
  items: g.ids.map((id) => products.find((p) => p.id === id)).filter((p): p is P => Boolean(p)),
})).filter((g) => g.items.length);
const listed = new Set(GROUPS.flatMap((g) => g.ids));
const others = products.filter((p) => !listed.has(p.id));
if (others.length) grouped.push({ title: 'Other oilfield chemicals', items: others });
const COUNT = products.length;

const faqs = [
  {
    question: 'Which oilfield chemicals do you supply in Oman?',
    answer: `Global Chemicals LLC supplies ${COUNT} oilfield chemicals from Muscat stock: drilling fluid additives (bentonite, CMC, potassium chloride, soda ash, caustic potash), completion and workover brines (calcium chloride and calcium bromide), stimulation and scale-removal acids, gas-treating amines (MEA, DEA, MDEA), glycols and methanol for dehydration and hydrate control, THT gas odorant, corrosion inhibitors, demulsifiers, oxygen scavengers and cleaning solvents. The tables on this page list each product with its pack or form.`,
  },
  {
    question: 'Are you JSRS registered for PDO and other operators?',
    answer: 'Yes. Global Chemicals LLC is registered on JSRS, the Joint Supplier Registration System used by oil and gas operators in Oman, and is ISO 9001:2015 certified. Every delivery ships with a batch certificate of analysis and a GHS safety data sheet.',
  },
  {
    question: 'What is the difference between MEA, DEA and MDEA for gas treating?',
    answer: 'All three are amines that remove acid gas from natural gas. MEA is the most reactive and removes both CO2 and H2S; DEA does the same with lower energy for regeneration; MDEA is selective, absorbing H2S faster than CO2, which suits plants that need to remove H2S while letting some CO2 pass. We supply all three in drums, IBCs, ISO tanks and bulk.',
  },
  {
    question: 'Which completion brines do you stock?',
    answer: 'Calcium chloride in oilfield brine grade at 30%, 38% and 42% concentrations, and calcium bromide as anhydrous powder or 52% liquid for higher-density completion and workover fluids.',
  },
  {
    question: 'How quickly can you deliver to oilfield locations?',
    answer: 'Orders ship from Muscat the same day within Muscat, next day to Sohar, and in two to three days to Duqm and Salalah. Remote concession deliveries are scheduled with the site. We also supply the UAE, Saudi Arabia, Qatar, Kuwait and Bahrain by road with a Certificate of Origin.',
  },
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers in Oman', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'Oilfield Chemicals Supplier Oman', url: 'https://gcoman.com/chemical-supplier/oilfield-chemicals-oman' },
];

const OilfieldChemicalsOman = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Oilfield Chemicals Supplier Oman | Drilling, Brines, Gas"
        description={`${COUNT} oilfield chemicals from Muscat stock: drilling fluids, completion brines, amines, glycols, demulsifiers, corrosion inhibitors. JSRS registered.`}
        keywords="oilfield chemicals supplier Oman, drilling fluid chemicals Oman, completion brine Oman, calcium bromide Oman, calcium chloride brine Oman, MDEA supplier Oman, MEG hydrate inhibitor Oman, demulsifier Oman, corrosion inhibitor oilfield Oman, JSRS chemical supplier Oman, PDO chemical supplier"
        ogTitle="Oilfield Chemicals Supplier in Oman | Global Chemicals LLC"
        ogDescription={`${COUNT} oilfield chemicals from Muscat stock, grouped by job: drilling fluids, completion brines, stimulation, gas treating, production chemicals. JSRS registered, ISO 9001:2015.`}
        ogUrl="https://gcoman.com/chemical-supplier/oilfield-chemicals-oman"
        canonical="https://gcoman.com/chemical-supplier/oilfield-chemicals-oman"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-supplier/oilfield-chemicals-oman"
        cssSelector={['h1', 'h2', '.speakable']}
      />
      <Navigation />

      <main id="main-content">
        <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">JSRS registered • ISO 9001:2015 • Muscat stock • CoA &amp; SDS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Oilfield Chemicals Supplier in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                Global Chemicals LLC supplies {COUNT} oilfield chemicals from stock in Muscat to drilling, completion,
                production and gas-processing operations across Oman and the GCC: drilling fluid additives, calcium
                chloride and calcium bromide brines, stimulation acids, gas-treating amines, glycols and methanol,
                demulsifiers, corrosion inhibitors and oxygen scavengers. We are JSRS registered and ISO 9001:2015
                certified, and every delivery ships with a certificate of analysis and safety data sheet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'oilfield_quote')}>
                  <Link to="/contact?product=Oilfield+Chemicals" rel="nofollow">
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
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Factory className="w-6 h-6 text-primary" /> Which oilfield chemicals are used for each job?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-3xl">
                Each product links to its own page with the full specification.
              </p>
              <div className="space-y-10">
                {grouped.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{group.title}</h3>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                          <tr>
                            <th className="px-4 py-2 font-semibold">Product</th>
                            <th className="px-4 py-2 font-semibold">What it does</th>
                            <th className="px-4 py-2 font-semibold">Supplied as</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((p) => (
                            <tr key={p.id} className="border-t border-border align-top">
                              <td className="px-4 py-2">
                                <Link to={`/products/oilfield/${p.id}`} className="text-primary hover:underline font-medium">{p.title}</Link>
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">{p.description}</td>
                              <td className="px-4 py-2 text-muted-foreground">{supplyOf(p)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">What registration and documents come with oilfield chemicals?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Oil and gas operators in Oman buy through JSRS-registered suppliers; we are registered and ISO
                9001:2015 certified, and supply certificates of analysis and GHS safety data sheets with every batch.
                See{' '}
                <Link to="/blog/jsrs-chemical-supplier-pdo-oman" className="text-primary hover:underline">what JSRS registration means for chemical buyers</Link>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Same day within Muscat, next day to Sohar, two to three days to Duqm and Salalah, with remote
                concession deliveries scheduled with the site, and by road to the UAE, Saudi Arabia, Qatar, Kuwait and
                Bahrain. Related guides:{' '}
                <Link to="/chemicals/duqm" className="text-primary hover:underline">Duqm</Link>,{' '}
                <Link to="/chemicals/sohar" className="text-primary hover:underline">Sohar</Link>,{' '}
                <Link to="/chemical-supplier/hydrochloric-acid-oman" className="text-primary hover:underline">hydrochloric acid</Link>,{' '}
                <Link to="/chemical-supplier/caustic-soda-oman" className="text-primary hover:underline">caustic soda</Link> and the full{' '}
                <Link to="/products/oilfield" className="text-primary hover:underline">oilfield catalogue</Link>.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} heading="Oilfield chemicals in Oman — frequently asked questions" />
      </main>

      <Footer />
    </div>
  );
};

export default OilfieldChemicalsOman;
