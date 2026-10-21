import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, FlaskConical } from 'lucide-react';
import labProducts from '@/data/products/lab-chemicals.json';

/**
 * Laboratory chemicals hub — Phase 2.1 of docs/seo/MASTER-PLAN.md.
 *
 * Why this page: lab chemicals are the highest-impression product family on
 * the site (2,123 impressions in 90 days to 2026-10-13) and gcoman.com already
 * ranks #2 for "laboratory chemicals supplier oman" behind omanchem.com — but
 * with 34 separate product pages and no single page that answers "who stocks
 * lab reagents in Oman, in what grade and pack". This is that page.
 *
 * Every fact in the reagent table is read from src/data/products/lab-chemicals.json
 * at build time (static import, so it is in the prerendered HTML — see the
 * "Product routes" note in CLAUDE.md on why dynamic loading broke prerender).
 * Grades, purities and pack sizes therefore cannot drift from the product pages.
 * Nothing on this page is typed in separately except the prose.
 */

type LabProduct = {
  id: string;
  title: string;
  details: {
    casNumber?: string;
    technicalSpecs?: string[] | Record<string, string>;
    canonicalOverride?: string;
  };
};

const specList = (p: LabProduct): string[] => {
  const s = p.details.technicalSpecs;
  if (!s) return [];
  return Array.isArray(s) ? s : Object.entries(s).map(([k, v]) => `${k}: ${v}`);
};

// "Purity: 99.5% minimum (ACS grade)" → "99.5% min · ACS"
const gradeOf = (p: LabProduct): string => {
  const line = specList(p).find((l) => /purity|assay|grade|concentration|meets|type:/i.test(l)) ?? '';
  return line.replace(/^[^:]+:\s*/, '').replace(/minimum/i, 'min');
};

const packsOf = (p: LabProduct): string => {
  const line = specList(p).find((l) => /^available:/i.test(l));
  return line ? line.replace(/^available:\s*/i, '') : 'On request';
};

// Grouping is the only editorial input; unknown ids fall into "Other reagents".
const GROUPS: { title: string; ids: string[] }[] = [
  { title: 'Acids and bases', ids: ['sulfuric-acid-lab', 'hydrochloric-acid-lab', 'nitric-acid-lab', 'acetic-acid-lab', 'phosphoric-acid-lab', 'sodium-hydroxide-pellets-lab', 'potassium-hydroxide-pellets-lab', 'ammonia-solution-lab'] },
  { title: 'Solvents', ids: ['acetone-lab', 'ethanol-absolute-lab', 'methanol-lab', 'isopropanol-lab', 'hexane-lab', 'toluene-lab', 'xylene-lab', 'chloroform-lab', 'dichloromethane-lab', 'ethyl-acetate-lab', 'diethyl-ether-lab', 'petroleum-ether-lab'] },
  { title: 'Salts and analytical reagents', ids: ['sodium-chloride-lab', 'potassium-chloride-lab', 'calcium-chloride-lab', 'magnesium-sulfate-lab', 'sodium-thiosulfate-lab', 'potassium-permanganate-lab', 'silver-nitrate-lab'] },
  { title: 'Molecular biology and microbiology', ids: ['tris-base-lab', 'edta-disodium-lab', 'glucose-anhydrous-lab', 'agar-bacteriological'] },
  { title: 'Indicators', ids: ['phenolphthalein-indicator', 'methyl-orange-indicator', 'bromothymol-blue-indicator'] },
];

const products = (labProducts as LabProduct[]).filter((p) => !p.details.canonicalOverride);
const grouped = GROUPS.map((g) => ({
  title: g.title,
  items: g.ids.map((id) => products.find((p) => p.id === id)).filter((p): p is LabProduct => Boolean(p)),
}));
const listed = new Set(GROUPS.flatMap((g) => g.ids));
const others = products.filter((p) => !listed.has(p.id));
if (others.length) grouped.push({ title: 'Other reagents', items: others });

const REAGENT_COUNT = products.length;

const faqs = [
  {
    question: 'Which laboratory chemicals do you stock in Oman?',
    answer: `Global Chemicals LLC holds ${REAGENT_COUNT} laboratory reagents in Muscat: mineral acids and bases (sulphuric, hydrochloric, nitric, acetic and phosphoric acid, sodium and potassium hydroxide, ammonia solution), solvents (acetone, absolute ethanol, methanol, isopropanol, hexane, toluene, xylene, chloroform, dichloromethane, ethyl acetate, diethyl ether, petroleum ether), analytical salts (sodium, potassium and calcium chloride, magnesium sulphate, sodium thiosulphate, potassium permanganate, silver nitrate), molecular-biology reagents (Tris base, disodium EDTA, anhydrous glucose, bacteriological agar) and pH indicators. The full list with CAS numbers, grades and pack sizes is in the table on this page.`,
  },
  {
    question: 'What grades are available — ACS, HPLC or molecular biology?',
    answer: 'Most reagents are supplied to ACS reagent specifications. Methanol, acetone, hexane, dichloromethane and ethyl acetate are also available in HPLC grade for chromatography. Tris base, disodium EDTA, calcium chloride and absolute ethanol are supplied in molecular-biology grade, nitric acid in ACS / trace-metal grade for ICP and digestion work, glucose in cell-culture grade and agar in bacteriological grade. The grade and purity for each reagent are listed in the table.',
  },
  {
    question: 'What pack sizes do laboratory chemicals come in?',
    answer: 'Liquids are supplied in bottles from 500 mL to 5 L depending on the reagent, typically 500 mL, 1 L, 2.5 L and 4 L for solvents and 500 mL, 2.5 L and 5 L for concentrated acids. Solids come in 100 g, 500 g, 1 kg and 5 kg containers. Larger quantities for teaching laboratories or production QC are quoted on request.',
  },
  {
    question: 'Do you supply a certificate of analysis and safety data sheet?',
    answer: 'Yes. Every laboratory reagent is supplied with a batch certificate of analysis and a GHS safety data sheet in English, with Arabic SDS available. Global Chemicals LLC is ISO 9001:2015 certified and JSRS registered, which oil and gas and government laboratories in Oman typically require from a supplier.',
  },
  {
    question: 'How fast can you deliver laboratory chemicals in Oman and the GCC?',
    answer: 'Orders ship from the Muscat warehouse the same day within Muscat, next day to Sohar, and in two to three days to Salalah and Duqm. Laboratories in the UAE, Saudi Arabia, Qatar, Kuwait and Bahrain are supplied by road with a Certificate of Origin. Flammable and toxic solvents travel as dangerous goods, so tell us the destination when you order and we will confirm the lead time.',
  },
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers in Oman', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'Laboratory Chemicals Supplier Oman', url: 'https://gcoman.com/chemical-supplier/laboratory-chemicals-oman' },
];

const LaboratoryChemicalsOman = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Laboratory Chemicals Supplier Oman | ACS & HPLC Reagents"
        description={`${REAGENT_COUNT} lab reagents stocked in Muscat: ACS, HPLC and molecular-biology grades. Acids, solvents, Tris, EDTA, agar. CoA & SDS, GCC delivery.`}
        keywords="laboratory chemicals supplier Oman, lab chemicals Muscat, laboratory reagents Oman, ACS reagent Oman, HPLC solvents Oman, molecular biology reagents Oman, Tris base Oman, lab chemicals UAE, laboratory chemicals GCC, analytical reagents supplier Oman"
        ogTitle="Laboratory Chemicals Supplier in Oman | Global Chemicals LLC"
        ogDescription={`${REAGENT_COUNT} laboratory reagents in Muscat stock — ACS, HPLC and molecular-biology grades, 500 mL to 5 L, with CoA and SDS. Delivery across Oman and the GCC.`}
        ogUrl="https://gcoman.com/chemical-supplier/laboratory-chemicals-oman"
        canonical="https://gcoman.com/chemical-supplier/laboratory-chemicals-oman"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-supplier/laboratory-chemicals-oman"
        cssSelector={['h1', 'h2', '.speakable']}
      />
      <Navigation />

      <main id="main-content">
        <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">Muscat stock • ISO 9001:2015 • JSRS • CoA &amp; SDS with every batch</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Laboratory Chemicals Supplier in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                Global Chemicals LLC supplies {REAGENT_COUNT} laboratory reagents from stock in Muscat for university,
                hospital, oil and gas, water and food-testing laboratories across Oman and the GCC. Most are supplied
                to ACS reagent specifications, with HPLC-grade solvents for chromatography and molecular-biology grades
                for life-science work, in bottles from 500 mL to 5 L and containers from 100 g to 5 kg, each with a
                batch certificate of analysis and safety data sheet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'lab_chemicals_quote')}>
                  <Link to="/contact?product=Laboratory+Chemicals" rel="nofollow">
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
                <FlaskConical className="w-6 h-6 text-primary" /> Reagents in stock: grade, purity and pack sizes
              </h2>
              <p className="text-muted-foreground mb-8 max-w-3xl">
                Each reagent links to its own page with the full specification. Grades and packs below are read
                directly from those pages.
              </p>
              <div className="space-y-10">
                {grouped.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{group.title}</h3>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left">
                          <tr>
                            <th className="px-4 py-2 font-semibold">Reagent</th>
                            <th className="px-4 py-2 font-semibold">CAS No.</th>
                            <th className="px-4 py-2 font-semibold">Grade / purity</th>
                            <th className="px-4 py-2 font-semibold">Pack sizes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((p) => (
                            <tr key={p.id} className="border-t border-border align-top">
                              <td className="px-4 py-2">
                                <Link to={`/products/lab-chemicals/${p.id}`} className="text-primary hover:underline font-medium">
                                  {p.title}
                                </Link>
                              </td>
                              <td className="px-4 py-2 font-mono whitespace-nowrap">{p.details.casNumber ?? '—'}</td>
                              <td className="px-4 py-2 text-muted-foreground">{gradeOf(p) || '—'}</td>
                              <td className="px-4 py-2 text-muted-foreground">{packsOf(p)}</td>
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
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Who the range is for</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Teaching and research laboratories, hospital and clinical labs, oil and gas QC and production
                  chemistry labs, desalination and water-quality labs, and food and beverage QC. Oilfield and
                  government buyers can order under our JSRS registration and ISO 9001:2015 quality system, from a
                  single bottle upward.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Documentation and storage</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every batch ships with a certificate of analysis and a GHS safety data sheet. Light-sensitive
                  reagents such as silver nitrate are supplied in amber bottles, and stabilised solvents such as
                  chloroform and diethyl ether carry their stabiliser on the label. Flammable and toxic solvents are
                  packed and moved as dangerous goods.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">Delivery across Oman and the GCC</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Same day within Muscat, next day to Sohar, two to three days to Salalah and Duqm, and by road to the
                UAE, Saudi Arabia, Qatar, Kuwait and Bahrain with a Certificate of Origin. See the city pages for{' '}
                <Link to="/chemicals/muscat" className="text-primary hover:underline">Muscat</Link>,{' '}
                <Link to="/chemicals/sohar" className="text-primary hover:underline">Sohar</Link>,{' '}
                <Link to="/chemicals/uae" className="text-primary hover:underline">the UAE</Link> and{' '}
                <Link to="/chemicals/saudi-arabia" className="text-primary hover:underline">Saudi Arabia</Link>.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Need the same acids in industrial volumes? See{' '}
                <Link to="/chemical-supplier/nitric-acid-oman" className="text-primary hover:underline">nitric acid</Link> and{' '}
                <Link to="/chemical-supplier/hydrochloric-acid-oman" className="text-primary hover:underline">hydrochloric acid</Link>{' '}
                in carboys to bulk tanker, or the full{' '}
                <Link to="/products/lab-chemicals" className="text-primary hover:underline">laboratory chemicals catalogue</Link>.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} heading="Laboratory chemicals in Oman — frequently asked questions" />
      </main>

      <Footer />
    </div>
  );
};

export default LaboratoryChemicalsOman;
