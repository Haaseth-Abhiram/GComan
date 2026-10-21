import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Sprout } from 'lucide-react';
import agroProducts from '@/data/products/agro.json';

/**
 * Fertilizer hub — Phase 2.2 of docs/seo/MASTER-PLAN.md.
 *
 * Why: agro is the second-best-converting product family (39 clicks in 90 days
 * to 2026-10-13; urea alone 25 clicks at position 5.8). Local producers
 * (omanagrifertilizer, OMIFCO) hold the generic "fertilizer supplier oman"
 * term, but no page answers "where do I buy urea / DAP / MOP / calcium nitrate
 * in Oman, in what analysis and pack, and what can I mix in my drip tank".
 *
 * The product table is generated at build time from src/data/products/agro.json
 * (static import, so it is in the prerendered HTML). Nutrient analysis is the
 * first two specification lines of each product and the pack sizes are its
 * "Packaging:" line, so this page cannot drift from the product pages. The
 * fertigation table restates the compatibility rules written on those same
 * product pages (2026-10-16).
 */

type AgroProduct = {
  id: string;
  title: string;
  details: { technicalSpecs?: string[]; canonicalOverride?: string };
};

const specs = (p: AgroProduct) => p.details.technicalSpecs ?? [];
const analysisOf = (p: AgroProduct) =>
  specs(p).filter((l) => !/^packaging/i.test(l)).slice(0, 2).join(' · ');
const packsOf = (p: AgroProduct) =>
  (specs(p).find((l) => /^packaging/i.test(l)) ?? 'Packaging: on request').replace(/^packaging:\s*/i, '');

const products = (agroProducts as AgroProduct[]).filter((p) => !p.details.canonicalOverride);

const FERTIGATION = [
  { product: 'Calcium nitrate', tank: 'A tank only', rule: 'Never with phosphates or sulphates: forms calcium phosphate or gypsum that blocks emitters.' },
  { product: 'Water-soluble NPK, MAP, sulphate fertilizers', tank: 'B tank', rule: 'Keep away from calcium; meet the A tank only in the dilute irrigation line.' },
  { product: 'Urea', tank: 'A or B', rule: 'Fully soluble; cools the tank as it dissolves. Do not dry-blend with calcium nitrate.' },
  { product: 'Potassium chloride (standard grade)', tank: 'A or B', rule: 'Fully soluble; adds chloride, so prefer SOP where irrigation water is saline.' },
  { product: 'Zinc sulphate', tank: 'Not with phosphate', rule: 'Precipitates as zinc phosphate; inject separately or use as a foliar spray.' },
  { product: 'Humic acid', tank: 'Separate, premixed', rule: 'Flocculates in acid or very hard water; dissolve first and jar-test.' },
  { product: 'DAP', tank: 'Not for drip', rule: 'Use as a banded base dressing; for fertigation use MAP or water-soluble NPK.' },
];

const faqs = [
  {
    question: 'Where can I buy urea, DAP and potash fertilizer in Oman?',
    answer: 'Global Chemicals LLC supplies urea 46% N, DAP 18-46-0, potassium chloride (MOP 60% K2O), calcium nitrate, water-soluble and granular NPK grades, zinc sulphate, agricultural gypsum and humic acid from Muscat stock, in 25 kg and 50 kg bags and 1,000 kg big bags. The table on this page lists the analysis and pack sizes for each product.',
  },
  {
    question: 'Which fertilizers can be mixed in the same fertigation tank?',
    answer: 'Calcium nitrate must go in its own tank (the A tank), because with phosphates it forms calcium phosphate and with sulphates it forms gypsum, both of which block drip emitters. Phosphate- and sulphate-bearing products such as water-soluble NPK and MAP go in the B tank. Urea and standard-grade potassium chloride are compatible with either. Zinc sulphate should not be mixed with phosphate, and DAP is not suitable for drip lines.',
  },
  {
    question: 'Should I use potassium chloride (MOP) or sulphate of potash (SOP)?',
    answer: 'MOP is the lowest-cost source of potassium, but it adds chloride. Where irrigation water is already saline, or for chloride-sensitive crops such as citrus, avocado and strawberries, sulphate of potash is the safer choice. We supply MOP from stock and SOP on request.',
  },
  {
    question: 'How do I reclaim saline or sodic soil?',
    answer: 'Agricultural gypsum supplies soluble calcium that displaces sodium from the soil, but it only works if the sodium is then leached below the root zone. Apply it before an irrigation that drains through the profile and follow with leaching using the best water available. The dose depends on the soil\'s exchangeable sodium percentage, so test the soil first.',
  },
  {
    question: 'Do you deliver fertilizer outside Muscat and to the GCC?',
    answer: 'Yes. Orders ship from Muscat the same day within Muscat, next day to Sohar and Al Batinah, and in two to three days to Salalah and Duqm. We also supply the UAE, Saudi Arabia, Qatar, Kuwait and Bahrain by road with a Certificate of Origin.',
  },
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers in Oman', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'Fertilizer Supplier Oman', url: 'https://gcoman.com/chemical-supplier/fertilizers-oman' },
];

const FertilizersOman = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Fertilizer Supplier Oman | Urea, DAP, MOP, Calcium Nitrate"
        description="Urea 46%, DAP 18-46-0, MOP 60%, calcium nitrate, NPK, zinc sulphate, gypsum and humic acid from Muscat stock. 25–50 kg bags and big bags, GCC delivery."
        keywords="fertilizer supplier Oman, urea supplier Oman, DAP fertilizer Oman, potash fertilizer Oman, calcium nitrate Oman, NPK fertilizer Muscat, agricultural gypsum Oman, zinc sulphate fertilizer Oman, humic acid Oman, date palm fertilizer Oman, fertigation fertilizer Oman"
        ogTitle="Fertilizer Supplier in Oman | Global Chemicals LLC"
        ogDescription="Urea, DAP, MOP, calcium nitrate, NPK, zinc sulphate, gypsum and humic acid from Muscat stock, with fertigation compatibility guidance and delivery across Oman and the GCC."
        ogUrl="https://gcoman.com/chemical-supplier/fertilizers-oman"
        canonical="https://gcoman.com/chemical-supplier/fertilizers-oman"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-supplier/fertilizers-oman"
        cssSelector={['h1', 'h2', '.speakable']}
      />
      <Navigation />

      <main id="main-content">
        <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">Muscat stock • 25 kg bags to 1,000 kg big bags • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Fertilizer Supplier in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                Global Chemicals LLC supplies urea, DAP, potassium chloride, calcium nitrate, NPK compound fertilizers,
                zinc sulphate, agricultural gypsum and humic acid from stock in Muscat to date palm plantations, vegetable
                and greenhouse growers, forage farms and landscaping contractors across Oman and the GCC, in 25 kg and
                50 kg bags and 1,000 kg big bags.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'fertilizers_quote')}>
                  <Link to="/contact?product=Fertilizers" rel="nofollow">
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
                <Sprout className="w-6 h-6 text-primary" /> Fertilizers in stock: analysis and pack sizes
              </h2>
              <p className="text-muted-foreground mb-6 max-w-3xl">
                Each product links to its own page with the full specification, application rates and handling notes.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Fertilizer</th>
                      <th className="px-4 py-2 font-semibold">Analysis</th>
                      <th className="px-4 py-2 font-semibold">Pack sizes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-border align-top">
                        <td className="px-4 py-2">
                          <Link to={`/products/agro/${p.id}`} className="text-primary hover:underline font-medium">{p.title}</Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{analysisOf(p)}</td>
                        <td className="px-4 py-2 text-muted-foreground">{packsOf(p)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Fertigation: what can go in the same tank</h2>
              <p className="text-muted-foreground mb-6 max-w-3xl">
                Most drip-system blockages in Oman's hard irrigation water come from mixing calcium with phosphate or
                sulphate in the same stock tank. Use a two-tank system and keep these rules.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Product</th>
                      <th className="px-4 py-2 font-semibold">Stock tank</th>
                      <th className="px-4 py-2 font-semibold">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FERTIGATION.map((r) => (
                      <tr key={r.product} className="border-t border-border align-top">
                        <td className="px-4 py-2 font-medium text-foreground">{r.product}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{r.tank}</td>
                        <td className="px-4 py-2 text-muted-foreground">{r.rule}</td>
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
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">Delivery across Oman and the GCC</h2>
              <p className="text-muted-foreground leading-relaxed">
                Same day within Muscat, next day to Sohar and Al Batinah, two to three days to Salalah and Duqm, and by
                road to the UAE, Saudi Arabia, Qatar, Kuwait and Bahrain with a Certificate of Origin. See the pages for{' '}
                <Link to="/chemicals/muscat" className="text-primary hover:underline">Muscat</Link>,{' '}
                <Link to="/chemicals/sohar" className="text-primary hover:underline">Sohar</Link>,{' '}
                <Link to="/chemicals/salalah" className="text-primary hover:underline">Salalah</Link> and{' '}
                <Link to="/chemicals/uae" className="text-primary hover:underline">the UAE</Link>, or the full{' '}
                <Link to="/products/agro" className="text-primary hover:underline">agricultural chemicals catalogue</Link>.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} heading="Fertilizers in Oman — frequently asked questions" />
      </main>

      <Footer />
    </div>
  );
};

export default FertilizersOman;
