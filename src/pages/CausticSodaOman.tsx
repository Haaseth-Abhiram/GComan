import { Link, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import {
  CheckCircle2, Phone, Mail, ArrowRight, Shield, Award, Globe2, Package,
  Beaker, Factory, Droplets, FlaskConical
} from 'lucide-react';
import hubAr from '@/i18n/locales/hub-pages-ar.json';
import CausticSodaOmanAr from './CausticSodaOmanAr';

const faqs = [
  {
    question: "What forms of caustic soda does Global Chemicals LLC supply in Oman?",
    answer: "Global Chemicals LLC supplies caustic soda in three forms in Oman: (1) Caustic Soda Flakes — 98–99% NaOH, in 25kg bags and 1,000kg super sacks; (2) Caustic Soda Prills — 99% NaOH, low-dust spherical beads in 25kg bags; (3) Caustic Soda Liquid — 32%, 48%, and 50% NaOH solution in 25L jerricans, 200L drums, and 1,000L IBC containers. Both technical-grade and food-grade (E524) caustic soda are available."
  },
  {
    question: "What is the price of caustic soda in Oman?",
    answer: "Caustic soda pricing in Oman depends on grade (technical vs food-grade), form (flakes, prills, liquid), concentration, and volume. Global Chemicals LLC offers competitive pricing with volume discounts for regular buyers. Contact our sales team at info@gcoman.com or +968 9277 2305 for a current price list and bulk quotation."
  },
  {
    question: "Can you supply food-grade caustic soda in Oman?",
    answer: "Yes. Global Chemicals LLC supplies food-grade caustic soda (E524 — Sodium Hydroxide) that meets food safety requirements for direct and indirect food contact applications. Food-grade caustic soda is used for olive curing, pretzel glazing, noodle production, and CIP (Clean-in-Place) cleaning of food processing equipment. Halal-compatible. Certificate of Analysis and food safety documentation provided."
  },
  {
    question: "Do you supply caustic soda to water treatment plants in Oman?",
    answer: "Yes, caustic soda (sodium hydroxide) is one of the most widely used chemicals in Oman's water treatment sector — for pH adjustment in municipal drinking water plants, desalination pH correction, industrial effluent neutralization, and swimming pool alkalinity control. We supply water treatment grade caustic soda to municipal utilities, industrial water treatment plants, and hotel facilities across Oman. Technical data sheets and SDS in English and Arabic are available."
  },
  {
    question: "What industries use caustic soda in Oman?",
    answer: "Caustic soda (NaOH) is used across virtually all of Oman's industrial sectors: water treatment (pH adjustment, desalination post-treatment), soap and detergent manufacturing (saponification), food processing (olive curing, CIP cleaning), oil & gas (H2S neutralization, drilling mud pH control), textile industries (scouring, mercerization), pulp and paper, aluminium surface treatment, chemical synthesis, and pharmaceutical manufacturing."
  },
  {
    question: "What is the minimum order quantity for caustic soda in Oman?",
    answer: "There is no minimum order quantity for caustic soda from Global Chemicals LLC. We supply from single 25kg bags up to full truck loads (20 tonnes or more). Volume pricing is available for regular buyers. For liquid caustic soda, standard minimum is one 200L drum or one 1,000L IBC."
  },
  {
    question: "Do you deliver caustic soda to Sohar, Salalah, and Duqm?",
    answer: "Yes. Global Chemicals LLC delivers caustic soda across all of Oman: same-day delivery in Muscat and Rusayl Industrial Area (orders before 12 PM); next-day delivery to Sohar, Sohar Industrial Port, and Sohar Freezone; 2–3 business day delivery to Salalah, Duqm Special Economic Zone, Nizwa, Sur, Barka, and other locations. Export to UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain also available."
  },
  {
    question: "Is GHS-compliant Safety Data Sheet provided for caustic soda?",
    answer: "Yes. All caustic soda supplied by Global Chemicals LLC comes with a current GHS-compliant Safety Data Sheet (SDS/MSDS) in English. Arabic-language SDS is available on request. Certificate of Analysis (CoA) and Technical Data Sheet (TDS) are provided with every batch. Caustic soda is classified as a corrosive substance — proper PPE (gloves, goggles, face shield) must be worn when handling."
  }
];

const gradeForms = [
  {
    icon: Package,
    title: "Caustic Soda Flakes",
    subtitle: "98–99% NaOH",
    description: "Most widely used form for soap making, water treatment, and industrial pH adjustment. Easy to weigh and dissolve. Available in technical grade and food grade (E524).",
    specs: ["Purity: 98–99% NaOH", "Na2CO3: ≤0.8%", "NaCl: ≤0.03%", "Packaging: 25kg bag, 1,000kg super sack"],
    uses: ["Soap & detergent manufacturing", "Water treatment pH adjustment", "Food processing (E524)", "Industrial chemical synthesis"],
    // Points at the water-treatment SKU, which is the canonical one. The
    // soap-detergent twin carries a canonicalOverride to exactly this URL, so
    // linking there sent both users and link equity into a page that tells
    // Google to look somewhere else.
    productLink: "/products/water-treatment/caustic-soda-flakes"
  },
  {
    icon: Beaker,
    title: "Caustic Soda Liquid",
    subtitle: "32% / 48% / 50% NaOH",
    description: "Preferred for continuous-dosing applications, automated chemical feed systems, and large industrial operations. Ideal for municipal water treatment plants and food processing CIP systems.",
    specs: ["Concentration: 32%, 48%, or 50%", "Appearance: Clear, colourless liquid", "SG (50%): 1.52 g/cm³", "Packaging: 25L, 200L, 1000L IBC, bulk"],
    uses: ["Municipal water treatment", "Swimming pool pH control", "Food processing CIP cleaning", "Pulp & paper manufacturing"],
    productLink: "/products/water-treatment/caustic-soda-liquid"
  },
  {
    icon: FlaskConical,
    title: "Caustic Soda Prills",
    subtitle: "99% NaOH",
    description: "Low-dust spherical beads with superior flow characteristics. Preferred for automated dispensing, pharmaceutical-adjacent, and precision formulation applications requiring exact NaOH quantities.",
    specs: ["Purity: 99% NaOH", "Na2CO3: ≤0.4%", "Form: Spherical beads 0.5–1.0 mm", "Packaging: 25kg PP bag, 500kg big bag"],
    uses: ["Industrial detergent formulation", "Pharmaceutical applications", "Automated dosing systems", "High-purity chemical synthesis"],
    productLink: "/products/water-treatment/caustic-soda-prills"
  }
];

const applications = [
  { icon: Droplets, title: "Water Treatment", desc: "pH adjustment in municipal plants, desalination post-treatment, swimming pool alkalinity control, and industrial effluent neutralization." },
  { icon: Factory, title: "Oil & Gas", desc: "H2S neutralization in sour gas operations, drilling mud pH control, produced water treatment, and pipeline decontamination." },
  { icon: FlaskConical, title: "Soap & Detergent", desc: "Saponification of fats and oils for soap production, and as an alkaline builder in heavy-duty industrial and domestic detergents." },
  { icon: Package, title: "Food Processing", desc: "Olive curing, pretzel glazing, noodle production, food equipment CIP cleaning, and pH adjustment in food manufacturing (E524 grade)." },
  { icon: Beaker, title: "Chemical Manufacturing", desc: "Base chemical for synthesis of sodium compounds, pH regulation in chemical reactions, and catalyst preparation." },
  { icon: Shield, title: "Aluminium & Textile", desc: "Aluminium etching and surface preparation, textile scouring and mercerization, paper pulp (Kraft) cooking." },
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers Oman', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'Caustic Soda Supplier Oman', url: 'https://gcoman.com/chemical-supplier/caustic-soda-oman' }
];

// GCC delivery coverage — lead times match the figures already used on the
// corresponding /chemicals/<city> location pages, kept consistent site-wide.
const gccDelivery = [
  { country: 'Oman', leadTime: 'Same-day (Muscat) / next-day (Sohar)', notes: 'Home market — full stock, no export documentation needed' },
  { country: 'UAE', leadTime: '3–5 business days', notes: 'Certificate of Origin + Arabic/English SDS provided', page: '/chemical-supplier/caustic-soda-uae' },
  { country: 'Saudi Arabia', leadTime: '4–7 business days (region-dependent)', notes: 'SASO-compliant documentation support for regulated grades', page: '/chemical-supplier/caustic-soda-saudi-arabia' },
  { country: 'Qatar', leadTime: '3–5 business days', notes: 'Ras Laffan/Mesaieed delivery clearance documentation available' },
  { country: 'Kuwait', leadTime: '4–6 business days', notes: 'Full customs & Certificate of Origin documentation' },
  { country: 'Bahrain', leadTime: '3–5 business days', notes: 'GCC preferential Certificate of Origin available' },
];

const CausticSodaOman = () => {
  // /ar renders the full Arabic body (CausticSodaOmanAr.tsx, MASTER-PLAN P10.15); see its header.
  const { pathname } = useLocation();
  if (pathname.startsWith('/ar/')) return <CausticSodaOmanAr />;
  const arMeta = hubAr.hubPages['caustic-soda-oman'];
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Caustic Soda Supplier Oman | NaOH Flakes, Prills & Liquid | Global Chemicals LLC"
        description="Caustic soda (sodium hydroxide) supplier in Oman. Flakes 98–99%, prills 99%, liquid 32–50%. Food-grade & technical. Same-day Muscat delivery. JSRS certified."
        keywords="caustic soda Oman, caustic soda supplier Muscat, sodium hydroxide Oman, NaOH Oman, caustic soda flakes Oman, caustic soda liquid Oman, caustic soda prills Oman, caustic soda price Oman, food grade caustic soda Oman, caustic soda water treatment Oman, sodium hydroxide supplier Muscat, buy caustic soda Oman, caustic soda 50% Oman, caustic soda Sohar, caustic soda Salalah, lye Oman"
        ogTitle="Caustic Soda Supplier Oman | Flakes, Prills & Liquid NaOH | Global Chemicals LLC"
        ogDescription="Caustic soda (sodium hydroxide) supplier in Muscat, Oman. Flakes 98–99%, prills 99%, liquid 32–50%. Food-grade & technical. Same-day delivery. JSRS certified."
        ogUrl="https://gcoman.com/chemical-supplier/caustic-soda-oman"
        canonical="https://gcoman.com/chemical-supplier/caustic-soda-oman"
        arTitle={arMeta.metaTitle}
        arDescription={arMeta.metaDescription}
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-supplier/caustic-soda-oman"
        cssSelector={["h1", "h2", ".speakable"]}
      />
      <Navigation />

      <main id="main-content">
        {/* Hero */}
        <section className="pt-28 md:pt-36 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">JSRS Certified • ISO 9001:2015 • Food-Grade Available</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Caustic Soda Supplier in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed speakable">
                Global Chemicals LLC is a leading caustic soda (sodium hydroxide — NaOH) supplier in Muscat, Oman, stocking flakes (98–99%), prills (99%), and liquid (32–50%) in both technical and food-grade (E524). Same-day delivery in Muscat. Bulk supply for water treatment, oil & gas, food processing, soap manufacturing, and industrial applications across Oman and the GCC.
              </p>
              <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                <strong>CAS No.:</strong> 1310-73-2 &nbsp;|&nbsp; <strong>Formula:</strong> NaOH &nbsp;|&nbsp; <strong>E Number:</strong> E524 (food-grade)
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'caustic_soda_quote')}>
                  <Link to="/contact?product=Caustic+Soda" rel="nofollow">
                    Get a Quote <ArrowRight className="w-5 h-5" />
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

        {/* GCC Delivery & Export Coverage — surfaced above the fold so
            non-Oman GCC buyers see export capability immediately rather
            than finding it buried in FAQ prose. */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
                <Globe2 className="w-6 h-6 text-primary" />
                GCC Delivery &amp; Export Coverage
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                We export caustic soda across the entire GCC, not just Oman — with full customs documentation for every destination.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gccDelivery.map((d, i) => (
                  <Card key={i} className="p-4 border-border">
                    <p className="font-semibold text-foreground mb-1">{d.country}</p>
                    <p className="text-sm text-primary font-medium mb-2">{d.leadTime}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{d.notes}</p>
                    {d.page && (
                      <Link to={d.page} className="text-xs text-primary hover:underline mt-2 inline-block">
                        Caustic soda supply to {d.country === 'UAE' ? 'the UAE' : d.country} →
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust stats */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              {[
                { icon: Award, label: 'Years Supplying NaOH in Oman', value: '10+' },
                { icon: Package, label: 'NaOH Forms Stocked', value: '3' },
                { icon: Shield, label: 'Grades: Technical & Food (E524)', value: '2' },
                { icon: Globe2, label: 'Muscat Same-Day Delivery', value: '✓' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="space-y-2">
                    <Icon className="w-8 h-8 text-primary mx-auto" />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Three forms */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Which Forms of Caustic Soda Are Available in Oman?</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">We stock all three commercial forms of sodium hydroxide — choose the grade and form that matches your process requirements.</p>
              <div className="grid md:grid-cols-3 gap-8">
                {gradeForms.map((form, i) => {
                  const Icon = form.icon;
                  return (
                    <Card key={i} className="p-6 hover:shadow-md transition-shadow border-border hover:border-primary/30">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{form.title}</h3>
                      <Badge variant="secondary" className="mb-3 text-xs">{form.subtitle}</Badge>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{form.description}</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">Key Specs</p>
                          <ul className="space-y-1">
                            {form.specs.map((s, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">Applications</p>
                          <ul className="space-y-1">
                            {form.uses.map((u, j) => (
                              <li key={j} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                                {u}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button asChild variant="outline" size="sm" className="w-full text-xs">
                          <Link to={form.productLink}>View Product Details</Link>
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Technical specification table.
            Added 2026-10-05 for parity with the nitric acid and hydrochloric
            acid hubs, which both carry one. No page-1 competitor in Oman
            publishes a specification table for caustic soda (checked against
            omanchlorine, omanchem, uvwater, muscatchemical, hakimwater), and a
            table is the format AI answer engines lift wholesale. Every figure
            below is taken from the gradeForms array above, which in turn
            mirrors the published product pages. */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Caustic Soda Technical Specifications</h2>
              <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                Typical properties of the three forms supplied in Oman. A Certificate of Analysis for the specific batch accompanies every consignment.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Property</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Flakes</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Liquid (Lye)</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Prills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Chemical formula', 'NaOH', 'NaOH', 'NaOH'],
                      ['CAS number', '1310-73-2', '1310-73-2', '1310-73-2'],
                      ['Concentration', '98–99%', '32% · 48% · 50%', '99%'],
                      ['Appearance', 'White flakes', 'Clear, colourless liquid', 'Spherical beads 0.5–1.0 mm'],
                      ['Na2CO3', '≤0.8%', '—', '≤0.4%'],
                      ['NaCl', '≤0.03%', '—', '—'],
                      ['Specific gravity', '—', '1.52 g/cm³ (50%)', '—'],
                      ['Food grade (E524)', 'Available', 'Available', '—'],
                      ['Pack formats', '25 kg bag · 1,000 kg super sack', '25 L · 200 L · 1,000 L IBC · bulk', '25 kg PP bag · 500 kg big bag'],
                      ['Documentation', 'SDS (GHS) · CoA per batch', 'SDS · CoA · TDS', 'SDS · CoA per batch'],
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 ? 'bg-muted/20' : ''}>
                        <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What Is Caustic Soda Used for in Oman?</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Sodium hydroxide (NaOH) is used across virtually every industrial sector in Oman. Global Chemicals LLC supplies the right grade for every application.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app, i) => {
                  const Icon = app.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-5 bg-background rounded-xl border border-border">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{app.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{app.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Why section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Source Caustic Soda from Global Chemicals LLC in Oman?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  'Stock of all 3 forms: flakes, prills, liquid — in one location in Muscat',
                  'Technical-grade and food-grade (E524) available',
                  'GHS-compliant SDS in English and Arabic with every batch',
                  'Certificate of Analysis (CoA) for every lot supplied',
                  'Same-day delivery across Muscat & Rusayl Industrial Area',
                  'Next-day delivery to Sohar, 2–3 days to Salalah & Duqm',
                  'No minimum order — 25kg bag to full truck loads',
                  'Competitive volume pricing for regular buyers',
                  'JSRS registered — qualified to supply oil & gas operators',
                  'ISO 9001:2015 certified quality management',
                  'Export documentation for GCC-wide supply',
                  '10+ years experience supplying NaOH in Oman'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-muted/40 rounded-lg border border-border">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions — Caustic Soda in Oman</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className="group p-5 bg-background rounded-xl border border-border open:border-primary/30">
                    <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between gap-3">
                      {faq.question}
                      <span className="text-primary text-lg flex-shrink-0">+</span>
                    </summary>
                    <p className="mt-4 text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Delivery */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">How Fast Is Caustic Soda Delivered Across Oman?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { city: 'Muscat', note: 'Same-day' },
                  { city: 'Rusayl', note: 'Same-day' },
                  { city: 'Sohar', note: '1–2 days' },
                  { city: 'Salalah', note: '2–3 days' },
                  { city: 'Duqm', note: '2–3 days' },
                  { city: 'Nizwa / Sur', note: '2–3 days' },
                ].map((loc) => (
                  <div key={loc.city} className="p-4 border rounded-lg text-center bg-muted/20">
                    <p className="font-semibold text-foreground text-sm">{loc.city}</p>
                    <p className="text-xs text-muted-foreground mt-1">{loc.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related range — parity with the hydrochloric and nitric hubs
            (2026-10-19). Hub-to-hub links are the only internal links the
            acid hubs receive from pages of equal depth. */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Related Chemicals We Supply in Oman</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Hydrochloric Acid 30–33%', to: '/chemical-supplier/hydrochloric-acid-oman' },
                  { label: 'Nitric Acid 68%', to: '/chemical-supplier/nitric-acid-oman' },
                  { label: 'Sodium Hypochlorite', to: '/chemical-supplier/sodium-hypochlorite-oman' },
                  { label: 'Laboratory Chemicals', to: '/chemical-supplier/laboratory-chemicals-oman' },
                ].map((l) => (
                  <Button key={l.to} asChild variant="outline" size="sm">
                    <Link to={l.to}>{l.label}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Request a Caustic Soda Quote in Oman
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tell us your required form (flakes / prills / liquid), grade (technical / food), quantity, and delivery location — our team will respond within 24 hours with pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'caustic_soda_quote_bottom')}>
                  <Link to="/contact?product=Caustic+Soda" rel="nofollow">
                    <Mail className="w-5 h-5" /> Get a Free Quote
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a href="tel:+96892772305">
                    <Phone className="w-5 h-5" /> Call +968 9277 2305
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CausticSodaOman;
