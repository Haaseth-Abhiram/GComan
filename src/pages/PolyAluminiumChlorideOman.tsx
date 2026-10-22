import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Droplets } from 'lucide-react';
import waterTreatment from '@/data/products/water-treatment.json';
import inorganic from '@/data/products/inorganic.json';

/**
 * Poly aluminium chloride hub — Phase 2.4 of docs/seo/MASTER-PLAN.md.
 *
 * Lower demand than the other hubs (PAC queries ~9 impressions / 90 days to
 * 2026-10-13; the PAC blog 73 impressions, 2 clicks), built last for that
 * reason. PAC sits on three product pages and a blog; "poly aluminium chloride
 * supplier oman" is held by omanchem, soharchemical and muscatchemical.
 *
 * Both tables are generated at build time from the product JSON. The coagulant
 * comparison shows only the specification lines each product page already
 * publishes; a cell is "—" where that page has no figure, rather than a number
 * typed in here. The PAC liquid page's claim about named municipal plants is
 * deliberately not repeated.
 */

type P = { id: string; category: string; title: string; details: { technicalSpecs?: string[]; canonicalOverride?: string } };

const find = (list: P[], id: string) => list.find((p) => p.id === id);
const wt = waterTreatment as P[];
const inorg = inorganic as P[];

const pacLiquid = find(wt, 'pac-liquid');
const pacPowder = find(wt, 'pac-powder');
const pacGeneral = find(inorg, 'poly-aluminum-chloride');
const alum = find(wt, 'aluminium-sulphate-liquid');
const ferric = find(wt, 'ferric-chloride-liquid');

const line = (p: P | undefined, re: RegExp) =>
  (p?.details.technicalSpecs ?? []).find((l) => re.test(l))?.replace(/^[^:]+:\s*/, '') ?? '—';

// Pack formats: the liquid and powder pages state them in their descriptions
// (IBC / bulk; 25 kg bags), not in a spec line, so they are mapped here from
// those pages. The general PAC page carries a spec line and is read directly.
const PACKS: Record<string, string> = {
  'pac-liquid': '1,000 L IBC, bulk',
  'pac-powder': '25 kg bags',
};

const pacRows = [pacLiquid, pacPowder].filter((p): p is P => Boolean(p)).map((p) => ({
  p,
  al2o3: line(p, /Al2O3/i),
  basicity: line(p, /basicity/i),
  form: line(p, /appearance/i),
  packs: PACKS[p.id] ?? line(p, /^(packaging|available)/i),
}));

const compare = [
  { name: 'PAC liquid', p: pacLiquid, active: line(pacLiquid, /Al2O3/i), ph: line(pacLiquid, /effective ph/i) },
  { name: 'PAC powder', p: pacPowder, active: line(pacPowder, /Al2O3/i), ph: line(pacGeneral, /effective ph/i) },
  { name: 'Aluminium sulphate (alum) liquid', p: alum, active: line(alum, /Al2O3/i), ph: line(alum, /effective ph/i) },
  { name: 'Ferric chloride liquid', p: ferric, active: line(ferric, /FeCl3/i), ph: line(ferric, /effective ph/i) },
].filter((r) => r.p);

const faqs = [
  {
    question: 'Where can I buy poly aluminium chloride (PAC) in Oman?',
    answer: 'Global Chemicals LLC supplies poly aluminium chloride (PAC, CAS 1327-41-9) from Muscat stock as a liquid (10–11% Al2O3) in IBCs and bulk, and as a powder (28–30% Al2O3) in 25 kg bags, for drinking water, wastewater and industrial effluent treatment across Oman and the GCC.',
  },
  {
    question: 'Should I use PAC liquid or PAC powder?',
    answer: 'PAC liquid is dosed directly and suits plants with storage tanks and continuous dosing. PAC powder carries about three times the aluminium per kilogram, ships and stores more cheaply, keeps for about two years, and is dissolved on site — which suits smaller or remote plants and sites without liquid chemical storage.',
  },
  {
    question: 'How does PAC compare with alum and ferric chloride?',
    answer: 'PAC is pre-polymerised, so it works over a wider pH range than alum and consumes less of the water\'s alkalinity, typically with less sludge. Ferric chloride works over an even wider pH range and is strong on phosphorus and heavy-metal removal, but it is very acidic and stains. The comparison table on this page lists the active content and effective pH range each product page publishes. A jar test on your own water is the reliable way to choose and to set the dose.',
  },
  {
    question: 'What dose of PAC is typical?',
    answer: 'For water treatment the usual range is 5–50 ppm, depending on turbidity, colour and alkalinity. Confirm the dose with a jar test on the actual raw water; we can provide jar-test guidance with the order.',
  },
  {
    question: 'Do you deliver PAC across Oman and the GCC?',
    answer: 'Yes. Orders ship from Muscat the same day within Muscat, next day to Sohar, and in two to three days to Salalah and Duqm. We also supply the UAE, Saudi Arabia, Qatar, Kuwait and Bahrain by road with a Certificate of Origin.',
  },
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers in Oman', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'Poly Aluminium Chloride Supplier Oman', url: 'https://gcoman.com/chemical-supplier/poly-aluminium-chloride-oman' },
];

const PolyAluminiumChlorideOman = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PAC Supplier Oman | Poly Aluminium Chloride Liquid & Powder"
        description="Poly aluminium chloride (PAC) from Muscat stock: liquid 10–11% Al2O3 in IBCs and bulk, powder 28–30% in 25 kg bags. Compared with alum and ferric chloride."
        keywords="PAC supplier Oman, poly aluminium chloride Oman, poly aluminium chloride supplier Muscat, PAC powder Oman, PAC liquid Oman, coagulant supplier Oman, water treatment coagulant Oman, PAC vs alum, PAC supplier UAE"
        ogTitle="Poly Aluminium Chloride (PAC) Supplier in Oman | Global Chemicals LLC"
        ogDescription="PAC liquid and powder from Muscat stock, with a comparison against alum and ferric chloride, and delivery across Oman and the GCC."
        ogUrl="https://gcoman.com/chemical-supplier/poly-aluminium-chloride-oman"
        canonical="https://gcoman.com/chemical-supplier/poly-aluminium-chloride-oman"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-supplier/poly-aluminium-chloride-oman"
        cssSelector={['h1', 'h2', '.speakable']}
      />
      <Navigation />

      <main id="main-content">
        <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">Muscat stock • Liquid &amp; powder • ISO 9001:2015 • JSRS</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Poly Aluminium Chloride (PAC) Supplier in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed speakable">
                Poly aluminium chloride (PAC, CAS 1327-41-9) is a pre-polymerised aluminium coagulant used to clarify
                drinking water, wastewater and industrial effluent. Global Chemicals LLC supplies it from stock in Muscat
                as a liquid with 10–11% Al2O3 in IBCs and bulk, and as a powder with 28–30% Al2O3 in 25 kg bags, with
                delivery across Oman and the GCC.
              </p>
              <p className="text-base text-muted-foreground mb-8">
                <strong>CAS No.:</strong> 1327-41-9 &nbsp;|&nbsp; <strong>Basicity:</strong> 40–90% &nbsp;|&nbsp; <strong>Typical dose:</strong> 5–50 ppm
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'pac_quote')}>
                  <Link to="/contact?product=Poly+Aluminium+Chloride" rel="nofollow">
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
                <Droplets className="w-6 h-6 text-primary" /> Which PAC grades are in stock in Oman?
              </h2>
              <div className="overflow-x-auto rounded-lg border border-border mt-6">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Grade</th>
                      <th className="px-4 py-2 font-semibold">Al2O3</th>
                      <th className="px-4 py-2 font-semibold">Basicity</th>
                      <th className="px-4 py-2 font-semibold">Appearance</th>
                      <th className="px-4 py-2 font-semibold">Pack sizes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacRows.map((r) => (
                      <tr key={r.p.id} className="border-t border-border align-top">
                        <td className="px-4 py-2">
                          <Link to={`/products/${r.p.category}/${r.p.id}`} className="text-primary hover:underline font-medium">{r.p.title}</Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{r.al2o3}</td>
                        <td className="px-4 py-2 text-muted-foreground">{r.basicity}</td>
                        <td className="px-4 py-2 text-muted-foreground">{r.form}</td>
                        <td className="px-4 py-2 text-muted-foreground">{r.packs}</td>
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">PAC, alum or ferric chloride?</h2>
              <p className="text-muted-foreground mb-6 max-w-3xl">
                Figures are taken from each product's own specification; a dash means that page does not publish one.
                A jar test on your raw water decides the product and the dose.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Coagulant</th>
                      <th className="px-4 py-2 font-semibold">Active content</th>
                      <th className="px-4 py-2 font-semibold">Effective pH range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compare.map((r) => (
                      <tr key={r.name} className="border-t border-border align-top">
                        <td className="px-4 py-2">
                          <Link to={`/products/${r.p!.category}/${r.p!.id}`} className="text-primary hover:underline font-medium">{r.name}</Link>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{r.active}</td>
                        <td className="px-4 py-2 text-muted-foreground">{r.ph}</td>
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
              <h2 className="text-2xl font-bold text-foreground mb-3">Delivery and further reading</h2>
              <p className="text-muted-foreground leading-relaxed">
                Same day within Muscat, next day to Sohar, two to three days to Salalah and Duqm, and by road to the
                UAE, Saudi Arabia, Qatar, Kuwait and Bahrain with a Certificate of Origin. For dosing tables and a
                fuller PAC-versus-alum comparison, read our{' '}
                <Link to="/blog/pac-poly-aluminium-chloride-oman" className="text-primary hover:underline">PAC guide</Link>,
                or see{' '}
                <Link to="/chemical-supplier/sodium-hypochlorite-oman" className="text-primary hover:underline">sodium hypochlorite</Link>{' '}
                and the full{' '}
                <Link to="/products/water-treatment" className="text-primary hover:underline">water treatment range</Link>.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} heading="Poly aluminium chloride in Oman — frequently asked questions" />
      </main>

      <Footer />
    </div>
  );
};

export default PolyAluminiumChlorideOman;
