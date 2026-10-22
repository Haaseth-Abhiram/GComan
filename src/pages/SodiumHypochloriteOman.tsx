import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData, VideoStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { YouTubeFacade } from '@/components/YouTubeFacade';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Droplets } from 'lucide-react';
import waterTreatment from '@/data/products/water-treatment.json';
import foodBeverage from '@/data/products/food-beverage.json';
import soapDetergent from '@/data/products/soap-detergent.json';
import swimmingPool from '@/data/products/swimming-pool.json';

/**
 * Sodium hypochlorite hub — Phase 2.5 of docs/seo/MASTER-PLAN.md.
 *
 * Why: hypochlorite is spread over six product pages in four categories and
 * no single page carries "sodium hypochlorite supplier oman" (Google, 2026-10-13:
 * not in the top 8; omanchem, Oman Chlorine and muscatchemical hold it). The
 * pages that do earn demand are the food-grade (122 impressions, 3 clicks) and
 * 12–15% bleach-manufacturing (101 impressions, 2 clicks) grades, which is why
 * the 2026-10-13 consolidation into the municipal page was reverted on
 * 2026-10-16: this hub is the canonical "which grade do I need" answer instead,
 * and each grade keeps its own page.
 *
 * The grade table is generated at build time from the product JSON files:
 * strength is each product's "Available chlorine" line and packs its
 * "Available in" / "Packaging" line. Nothing else from the product specs is
 * repeated here.
 */

type P = { id: string; category: string; title: string; details: { casNumber?: string; technicalSpecs?: string[]; canonicalOverride?: string } };

const NAOCL = '7681-52-9';
const ORDER = ['water-treatment', 'food-beverage', 'soap-detergent', 'swimming-pool'];
const USE: Record<string, string> = {
  'water-treatment': 'Drinking water, wastewater and cooling-water disinfection',
  'food-beverage': 'Food-contact surface and equipment sanitising, produce washing',
  'soap-detergent': 'Bleach and cleaning-product manufacturing',
  'swimming-pool': 'Pool chlorination, shock dosing and automatic feeders',
};

const all = [...waterTreatment, ...foodBeverage, ...soapDetergent, ...swimmingPool] as P[];
const grades = all
  .filter((p) => !p.details.canonicalOverride)
  .filter((p) => p.details.casNumber === NAOCL || /sodium-hypo/.test(p.id))
  .sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category));

const specs = (p: P) => p.details.technicalSpecs ?? [];
const strengthOf = (p: P) =>
  (specs(p).find((l) => /available chlorine/i.test(l)) ?? '').replace(/^available chlorine:\s*/i, '');
const packsOf = (p: P) =>
  (specs(p).find((l) => /^(available in|packaging)/i.test(l)) ?? 'On request').replace(/^(available in|packaging):?\s*/i, '');

const faqs = [
  {
    question: 'Where can I buy sodium hypochlorite in Oman?',
    answer: 'Global Chemicals LLC supplies sodium hypochlorite (NaOCl, CAS 7681-52-9) from Muscat stock in municipal water-treatment, food-contact, 12–15% bleach-manufacturing and swimming-pool grades, in containers from 5 L and 25 L up to 200 L drums, 1,000 L IBCs and bulk. The table on this page lists the available chlorine and pack sizes of each grade.',
  },
  {
    question: 'Which strength of sodium hypochlorite do I need?',
    answer: 'For water and wastewater disinfection, bleach manufacturing and commercial pools, the 12–15% grades give the most active chlorine per litre delivered. For sanitising food-contact surfaces and equipment, use the food grade diluted to the concentration your sanitation procedure specifies. Ready-to-use 10–12% chlorine liquid suits small pools and manual dosing.',
  },
  {
    question: 'How should sodium hypochlorite be stored in Oman\'s heat?',
    answer: 'Sodium hypochlorite loses strength over time, and faster when it is warm or exposed to light. The 12–15% grade holds for roughly three to six months at 15–20 °C, so in Oman store it in the shade or indoors, keep containers closed, and order in quantities you will use within weeks rather than months.',
  },
  {
    question: 'What must never be mixed with sodium hypochlorite?',
    answer: 'Never mix sodium hypochlorite with acids, including acidic cleaners and descalers, because this releases chlorine gas. Do not mix it with ammonia or ammonium compounds, which form toxic chloramines. Keep it apart from these in storage, and rinse equipment between products.',
  },
  {
    question: 'Do you deliver sodium hypochlorite across Oman and the GCC?',
    answer: 'Yes. Orders ship from Muscat the same day within Muscat, next day to Sohar, and in two to three days to Salalah and Duqm. We also supply the UAE, Saudi Arabia, Qatar, Kuwait and Bahrain by road with a Certificate of Origin; as a corrosive liquid it travels as dangerous goods.',
  },
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers in Oman', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'Sodium Hypochlorite Supplier Oman', url: 'https://gcoman.com/chemical-supplier/sodium-hypochlorite-oman' },
];

// youtube.com/@GlobalChemicalsLLC — "Global Chemicals LLC_ Chlorine", 18 s,
// published 2023-11-18 (read from the watch page on 2026-10-20).
const CHLORINE_VIDEO = {
  id: 'nxa3kbxMbOs',
  title: 'Global Chemicals LLC: Chlorine',
  description:
    'Short clip from the Global Chemicals LLC YouTube channel on chlorine supply in Oman. Global Chemicals LLC supplies sodium hypochlorite (liquid chlorine) from stock in Muscat in municipal, food-contact, bleach-manufacturing and pool grades.',
  uploadDate: '2023-11-18',
  durationSeconds: 18,
};

const SodiumHypochloriteOman = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sodium Hypochlorite Supplier Oman | NaOCl 10–15%, All Grades"
        description="Sodium hypochlorite (NaOCl) from Muscat stock: municipal, food, 12–15% bleach and pool grades. 25 L to 1,000 L IBC and bulk, delivery across Oman and GCC."
        keywords="sodium hypochlorite supplier Oman, sodium hypochlorite Muscat, NaOCl Oman, hypochlorite 12% Oman, hypochlorite 15% Oman, liquid chlorine Oman, bleach raw material Oman, food grade sodium hypochlorite Oman, pool chlorine liquid Muscat, sodium hypochlorite UAE"
        ogTitle="Sodium Hypochlorite Supplier in Oman | Global Chemicals LLC"
        ogDescription="Municipal, food-contact, bleach-manufacturing and pool grades of sodium hypochlorite from Muscat stock, 25 L to bulk, with delivery across Oman and the GCC."
        ogUrl="https://gcoman.com/chemical-supplier/sodium-hypochlorite-oman"
        canonical="https://gcoman.com/chemical-supplier/sodium-hypochlorite-oman"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-supplier/sodium-hypochlorite-oman"
        cssSelector={['h1', 'h2', '.speakable']}
      />
      <VideoStructuredData
        videoId={CHLORINE_VIDEO.id}
        name={CHLORINE_VIDEO.title}
        description={CHLORINE_VIDEO.description}
        uploadDate={CHLORINE_VIDEO.uploadDate}
        durationSeconds={CHLORINE_VIDEO.durationSeconds}
        pageUrl="https://gcoman.com/chemical-supplier/sodium-hypochlorite-oman"
      />
      <Navigation />

      <main id="main-content">
        <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">Muscat stock • 25 L to bulk • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Sodium Hypochlorite Supplier in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed speakable">
                Sodium hypochlorite (NaOCl, CAS 7681-52-9) is the liquid chlorine used to disinfect drinking water,
                wastewater and swimming pools, to sanitise food-processing equipment, and as the raw material for
                household and industrial bleach. Global Chemicals LLC supplies it from stock in Muscat in municipal,
                food-contact, 12–15% bleach-manufacturing and pool grades, from 25 L containers to 1,000 L IBCs and
                bulk, across Oman and the GCC.
              </p>
              <p className="text-base text-muted-foreground mb-8">
                <strong>CAS No.:</strong> 7681-52-9 &nbsp;|&nbsp; <strong>Formula:</strong> NaOCl &nbsp;|&nbsp; <strong>Available chlorine:</strong> 10–15% by grade
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'hypochlorite_quote')}>
                  <Link to="/contact?product=Sodium+Hypochlorite" rel="nofollow">
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
                <Droplets className="w-6 h-6 text-primary" /> Grades in stock: strength, use and pack sizes
              </h2>
              <p className="text-muted-foreground mb-6 max-w-3xl">
                Each grade links to its own page with the full specification and dosing guidance.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Grade</th>
                      <th className="px-4 py-2 font-semibold">Available chlorine</th>
                      <th className="px-4 py-2 font-semibold">Main use</th>
                      <th className="px-4 py-2 font-semibold">Pack sizes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((p) => (
                      <tr key={`${p.category}/${p.id}`} className="border-t border-border align-top">
                        <td className="px-4 py-2">
                          <Link to={`/products/${p.category}/${p.id}`} className="text-primary hover:underline font-medium">{p.title}</Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{strengthOf(p) || '—'}</td>
                        <td className="px-4 py-2 text-muted-foreground">{USE[p.category] ?? ''}</td>
                        <td className="px-4 py-2 text-muted-foreground">{packsOf(p)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* The one clip on the company's YouTube channel (2026-10-20 GEO re-score:
            every production hub shipped zero images and no video; multi-modal was
            the lowest-scoring dimension). Click-to-load, so nothing third-party
            runs until the visitor presses play. */}
        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-foreground mb-3">Chlorine supply from Muscat, on video</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A short clip from the Global Chemicals LLC YouTube channel on chlorine supply in Oman. Sodium
                  hypochlorite is the liquid form of that chlorine: the same stock, the same Muscat warehouse,
                  delivered in 25 L containers, 1,000 L IBCs or bulk.
                </p>
              </div>
              <div className="md:col-span-3">
                <YouTubeFacade videoId={CHLORINE_VIDEO.id} title={CHLORINE_VIDEO.title} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Storage in a hot climate</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Hypochlorite slowly breaks down into salt and oxygen, and heat and sunlight speed that up. The 12–15%
                  grade keeps roughly three to six months at 15–20 °C; in an Omani yard in summer it loses strength
                  much faster. Store drums and IBCs in the shade or indoors, keep them closed, and order in quantities
                  you will use within weeks. Check available chlorine before dosing stock that has been stored a while.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Safe handling</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Never mix hypochlorite with acids or acidic cleaners, which releases chlorine gas, or with ammonia,
                  which forms chloramines. Store it away from both, use dedicated pumps and lines, and wear eye and
                  skin protection. Every delivery comes with a GHS safety data sheet and batch certificate of analysis.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-3">Delivery across Oman and the GCC</h2>
              <p className="text-muted-foreground leading-relaxed">
                Same day within Muscat, next day to Sohar, two to three days to Salalah and Duqm, and by road to the
                UAE, Saudi Arabia, Qatar, Kuwait and Bahrain with a Certificate of Origin. Related supply guides:{' '}
                <Link to="/chemical-supplier/caustic-soda-oman" className="text-primary hover:underline">caustic soda</Link>,{' '}
                <Link to="/chemical-supplier/hydrochloric-acid-oman" className="text-primary hover:underline">hydrochloric acid</Link>,{' '}
                <Link to="/products/swimming-pool" className="text-primary hover:underline">swimming pool chemicals</Link> and{' '}
                <Link to="/products/water-treatment" className="text-primary hover:underline">water treatment chemicals</Link>.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} heading="Sodium hypochlorite in Oman — frequently asked questions" />
      </main>

      <Footer />
    </div>
  );
};

export default SodiumHypochloriteOman;
