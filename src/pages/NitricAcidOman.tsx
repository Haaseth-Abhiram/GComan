import { Link } from 'react-router-dom';
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
  Beaker, Factory, Droplets, FlaskConical, Wrench
} from 'lucide-react';

/**
 * Product+geo hub for nitric acid, modelled on CausticSodaOman.tsx.
 *
 * Why this page exists (measured 2026-10-05): across 90 days the site
 * registered only 7 nitric-acid queries and 43 impressions, every one of them
 * a *food-grade* or *lab-grade* variant — because those were the only two
 * nitric acid pages we had. Meanwhile page 1 of `nitric acid supplier oman`
 * (gl=om) is occupied entirely by INDUSTRIAL-grade sellers (omanchem,
 * uvwater.biz, Muscat Chemical, Sohar Chemicals, rx-sol), and gcoman.com does
 * not appear at all. We were absent from the commercial market, not beaten in
 * it.
 *
 * What those winners publish in their snippets, and we did not: grade,
 * concentration, pack format, cities served, and an answer to the price
 * question that the SERP's own "People also ask" box raises twice. This page
 * carries all of them.
 *
 * Every specification below is taken from content already published on
 * gcoman.com — the 68% concentration, the 35 kg carboy / 60 kg drum / 1,000 L
 * IBC pack range, Ghala stock, same-day Muscat dispatch and the 2–7 day GCC
 * export window all come from the existing
 * /products/food-beverage/nitric-acid-68 long description; the 68–70% ACS and
 * SG 1.42 figures from /products/lab-chemicals/nitric-acid-lab.
 *
 * Own-manufacturing, locally held stock and competitive pricing are stated on
 * the business owner's confirmation (2026-10-05). A specific plant capacity,
 * a lead-time figure in days and a price number are deliberately still NOT
 * published: they were not supplied, and a hub page that invents them is
 * worse than one that omits them.
 *
 * Competitive position (checked 2026-10-05, gl=om / gl=ae). The Oman #1,
 * omanchem.com, runs ~250 words with no price, no pack sizes, no FAQ, no
 * specification table and no certifications — it ranks on domain authority,
 * not on the page. The UAE #1, chemstock.ae, runs ~2,200 words with 6 FAQs
 * but still no packs, no price and no specs. So the content gap is ours to
 * take: nobody in either market publishes a specification table or a pack
 * range, and nobody but us holds JSRS + ISO 9001 + ICV. What they have that
 * we do not is referring domains — which is why the six citations remain the
 * binding constraint on this page outranking them.
 */

const faqs = [
  {
    // Lifted from the live "People also ask" box on `nitric acid supplier oman`.
    question: "How much does nitric acid cost in Oman?",
    answer: "Nitric acid pricing in Oman depends on concentration (68% technical vs 68–70% analytical), grade, pack format, and order volume. Competitors list indicative figures around OMR 70 for a 35 kg can, but real pricing moves with volume — a 1,000 L IBC or bulk tanker lands very differently from single carboys. Global Chemicals LLC quotes volume-tiered pricing and supplies locally in Oman rather than importing, which shortens the supply chain. Contact info@gcoman.com or +968-93754388 with your concentration, quantity and delivery location for a current quotation."
  },
  {
    question: "What grades and pack sizes of nitric acid are available in Oman?",
    answer: "Global Chemicals LLC supplies nitric acid (HNO3, CAS 7697-37-2) in three grades from Muscat stock: industrial/technical grade at 68% for metal treatment and process duties; food-contact grade at 68% for CIP cleaning in dairies, breweries and beverage plants; and laboratory grade at 68–70% (ACS / trace-metal) for analytical work. Pack formats are 35 kg HDPE carboys, 60 kg drums and 1,000 L IBC totes, with bulk arrangements for plant-scale users. Laboratory grade is supplied in 500 mL and 2.5 L amber glass bottles."
  },
  {
    question: "What is nitric acid used for in industry?",
    answer: "Nitric acid (HNO3) is a strong mineral acid used across industry for metal pickling and passivation — particularly stainless steel surface treatment ahead of galvanising — for descaling and mineral deposit removal, as a nitration feedstock in chemical synthesis, as an intermediate in fertilizer production, for pH correction and effluent neutralisation in water treatment, in electronics etching, and as the acid step in food and beverage CIP (clean-in-place) programmes, where it removes milk stone and beer stone and re-passivates stainless steel after caustic cleaning."
  },
  {
    question: "Do you supply nitric acid to Saudi Arabia, the UAE and Bahrain?",
    answer: "Yes. Global Chemicals LLC exports nitric acid across the GCC from Oman, typically within 2–7 days depending on destination — to the UAE (Dubai, Abu Dhabi, Sharjah), Saudi Arabia (Dammam, Jeddah, Riyadh), Bahrain (Manama), Qatar (Doha) and Kuwait. Consignments move by road or via Sohar Port with a Certificate of Origin on request, and a GHS-compliant Safety Data Sheet in English (Arabic available) accompanies every shipment."
  },
  {
    question: "What concentration of nitric acid do you supply?",
    answer: "Our standard commercial concentration is 68% HNO3, which is the concentrated azeotrope and the grade used for the large majority of industrial duties — metal pickling, passivation, descaling and CIP acid cycles. Laboratory grade is supplied at 68–70% concentrated (specific gravity 1.42), including ACS and trace-metal grades for ICP-MS and AAS digestion work. If your process requires a diluted working strength, we can advise on dilution ratios rather than shipping water."
  },
  {
    question: "Is Global Chemicals LLC approved to supply nitric acid to PDO and oil & gas operators in Oman?",
    answer: "Global Chemicals LLC is registered in the Joint Supplier Registration System (JSRS), Oman's mandatory pre-qualification system for oil and gas procurement, and is ISO 9001:2015 certified and ICV compliant. That documentation set is accepted for vendor qualification with PDO and its approved EPC contractors, as well as with the major dairy and beverage groups for food-contact supply. A Certificate of Analysis is issued per batch."
  },
  {
    question: "How is nitric acid used for stainless steel passivation?",
    answer: "Passivation uses nitric acid to dissolve free iron from a stainless steel surface and restore the chromium-oxide layer that gives the steel its corrosion resistance. In practice this follows pickling or fabrication work, and in food and beverage plants it follows the caustic stage of a CIP cycle — a typical CIP acid wash runs a 0.5–2% nitric solution at 60–70°C. The result is a passive, corrosion-resistant surface and, in process plant, one that will not taint product."
  },
  {
    question: "What safety documentation comes with nitric acid?",
    answer: "Every consignment is supplied with a current GHS-compliant Safety Data Sheet (SDS) in English, Arabic on request, plus a Certificate of Analysis for the batch and a Technical Data Sheet. Nitric acid is a strongly corrosive oxidiser: handle with full acid PPE (face shield, acid-resistant gloves and apron), store vented and cool, keep it away from organics, reducing agents and metals, and use polyethylene or stainless containment. Never store it next to combustible material."
  }
];

const gradeForms = [
  {
    icon: Factory,
    title: "Nitric Acid — Industrial / Technical",
    subtitle: "68% HNO3",
    description: "The standard commercial grade for metal treatment and process duties. Used for pickling and passivation of stainless steel, descaling, effluent neutralisation and as a nitration feedstock.",
    specs: ["Concentration: 68% HNO3", "CAS 7697-37-2 · Formula HNO3", "Clear to pale yellow liquid", "35 kg carboy · 60 kg drum · 1,000 L IBC · bulk"],
    uses: ["Metal pickling & passivation", "Stainless steel surface treatment", "Descaling & deposit removal", "Nitration / chemical synthesis"],
    productLink: "/products/food-beverage/nitric-acid-68"
  },
  {
    icon: Droplets,
    title: "Nitric Acid — Food Contact",
    subtitle: "68% HNO3",
    description: "Food-contact grade for the acid step of CIP (clean-in-place) programmes in dairies, breweries and beverage plants — removing milk stone, beer stone and hard-water scale, then re-passivating the steel.",
    specs: ["Concentration: 68% HNO3", "Typical CIP dose: 0.5–2% at 60–70°C", "CoA per batch · GHS SDS", "35 kg carboy · 60 kg drum · 1,000 L IBC"],
    uses: ["CIP acid cleaning cycles", "Milk stone & beer stone removal", "Plate heat exchanger cleaning", "Post-caustic passivation"],
    productLink: "/products/food-beverage/nitric-acid-68"
  },
  {
    icon: FlaskConical,
    title: "Nitric Acid — Laboratory",
    subtitle: "68–70% ACS / trace metal",
    description: "High-purity grade for analytical laboratories, QC facilities and research institutions — metal digestion, trace analysis and oxidation reactions.",
    specs: ["Concentration: 68–70% (concentrated)", "Specific gravity: 1.42", "ACS / trace-metal grade available", "500 mL & 2.5 L amber glass bottles"],
    uses: ["ICP-MS & AAS sample digestion", "Trace metal analysis", "Petroleum product testing", "Oxidation in organic synthesis"],
    productLink: "/products/lab-chemicals/nitric-acid-lab"
  }
];

const applications = [
  { icon: Wrench, title: "Metal Pickling & Passivation", desc: "Removing scale and free iron from stainless steel, restoring the chromium-oxide passive layer ahead of galvanising, fabrication handover or food-contact service." },
  { icon: Droplets, title: "Water Treatment", desc: "pH correction, acid cleaning of membranes and heat exchangers, and neutralisation of alkaline industrial effluent before discharge." },
  { icon: Factory, title: "Oil & Gas", desc: "Acidising and descaling duties, process-line cleaning, and laboratory digestion for petroleum product testing across Oman's upstream and downstream operations." },
  { icon: Package, title: "Food & Beverage CIP", desc: "The acid stage of clean-in-place programmes in dairies, breweries and juice plants — milk stone and beer stone removal, then stainless passivation." },
  { icon: Beaker, title: "Chemical Synthesis", desc: "Nitration feedstock, oxidising agent, and intermediate in the manufacture of nitrates, fertilizer precursors and specialty chemicals." },
  { icon: Shield, title: "Electronics & Laboratory", desc: "Etching and substrate cleaning in electronics, and ICP-MS/AAS sample digestion and trace-metal analysis in QC and research laboratories." },
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers Oman', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'Nitric Acid Supplier Oman', url: 'https://gcoman.com/chemical-supplier/nitric-acid-oman' }
];

// Lead times mirror the figures already published on the /chemicals/<city>
// location pages and the nitric-acid product description, kept consistent
// site-wide so a buyer never sees two different promises.
const gccDelivery = [
  { country: 'Oman', leadTime: 'Same-day (Muscat) / next-day (Sohar)', notes: 'Home market — Ghala stock, no export documentation needed' },
  { country: 'UAE', leadTime: '2–5 business days', notes: 'Dubai, Abu Dhabi, Sharjah — Certificate of Origin + English/Arabic SDS' },
  { country: 'Saudi Arabia', leadTime: '4–7 business days', notes: 'Dammam, Jeddah, Riyadh — SASO documentation support' },
  { country: 'Bahrain', leadTime: '3–5 business days', notes: 'Manama — GCC preferential Certificate of Origin available' },
  { country: 'Qatar', leadTime: '3–5 business days', notes: 'Doha, Mesaieed — clearance documentation provided' },
  { country: 'Kuwait', leadTime: '4–6 business days', notes: 'Full customs & Certificate of Origin documentation' },
];

const NitricAcidOman = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Nitric Acid Supplier Oman & GCC | 68% HNO3 Manufacturer"
        description="Nitric acid 68% (HNO3) manufacturer in Oman, exporting to the UAE, Saudi Arabia, Qatar, Kuwait & Bahrain in 2–7 days. Industrial, food & lab grades, 35 kg carboys to bulk tanker. JSRS certified."
        keywords="nitric acid Oman, nitric acid supplier Oman, nitric acid supplier UAE, nitric acid supplier Dubai, nitric acid supplier Saudi Arabia, nitric acid supplier Qatar, nitric acid supplier Kuwait, nitric acid supplier Bahrain, nitric acid exporter Middle East, HNO3 supplier GCC, nitric acid 68% Oman, HNO3 Oman, nitric acid Muscat, nitric acid price Oman, industrial nitric acid Oman, nitric acid manufacturer Oman, nitric acid Sohar, nitric acid Salalah, nitric acid UAE, nitric acid Saudi Arabia, nitric acid Bahrain, nitric acid Abu Dhabi, stainless steel passivation acid Oman, metal pickling acid Oman, CIP acid Oman, nitric acid supplier GCC"
        ogTitle="Nitric Acid Manufacturer & Supplier in Oman | 68% HNO3 | GCC Export"
        ogDescription="Nitric acid 68% (HNO3) manufacturer and supplier in Muscat, Oman. Own production unit, stock held locally. Industrial, food-contact and laboratory grades, 35kg carboys to bulk. Export across the GCC."
        ogUrl="https://gcoman.com/chemical-supplier/nitric-acid-oman"
        canonical="https://gcoman.com/chemical-supplier/nitric-acid-oman"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-supplier/nitric-acid-oman"
        cssSelector={["h1", "h2", ".speakable"]}
      />
      <Navigation />

      <main id="main-content">
        {/* Hero — the opening paragraph is written as a self-contained
            definitional answer, because that is the block AI engines lift. */}
        <section className="pt-28 md:pt-36 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">Own Manufacturing Unit • Stock Held in Oman • JSRS • ISO 9001:2015 • ICV</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Nitric Acid Manufacturer &amp; Supplier in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed speakable">
                Nitric acid (HNO3, CAS 7697-37-2) is a strong mineral acid supplied at 68% concentration for metal pickling and passivation, descaling, nitration and CIP cleaning. Global Chemicals LLC manufactures and supplies it from our own production unit in Oman, holding stock in Muscat across industrial, food-contact and laboratory grades — in 35 kg carboys, 60 kg drums, 1,000 L IBC totes and bulk. Producing locally rather than importing means shorter lead times and competitive pricing, with export across the GCC to the UAE, Saudi Arabia, Bahrain, Qatar and Kuwait.
              </p>
              <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                <strong>CAS No.:</strong> 7697-37-2 &nbsp;|&nbsp; <strong>Formula:</strong> HNO3 &nbsp;|&nbsp; <strong>Concentration:</strong> 68% (68–70% lab)
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'nitric_acid_quote')}>
                  <Link to="/contact?product=Nitric+Acid" rel="nofollow">
                    Get a Quote <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 text-lg px-8">
                  <a href="tel:+96893754388">
                    <Phone className="w-5 h-5" /> Call +968 93754388
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* GCC coverage — above the fold, because UAE and Saudi buyers are
            the markets where we currently register impressions but no clicks. */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
                <Globe2 className="w-6 h-6 text-primary" />
                Nitric Acid Supply Across the GCC
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                We export nitric acid from Oman to every GCC market, with full customs documentation for each destination.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gccDelivery.map((d, i) => (
                  <Card key={i} className="p-4 border-border">
                    <p className="font-semibold text-foreground mb-1">{d.country}</p>
                    <p className="text-sm text-primary font-medium mb-2">{d.leadTime}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{d.notes}</p>
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
                { icon: Factory, label: 'Own Manufacturing Unit in Oman', value: '✓' },
                { icon: Package, label: 'Grades: Industrial, Food, Lab', value: '3' },
                { icon: Shield, label: 'JSRS · ISO 9001 · ICV', value: '✓' },
                { icon: Globe2, label: 'Muscat Same-Day Dispatch', value: '✓' },
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

        {/* Grades */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Nitric Acid Grades Available in Oman</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Three grades from one supplier — choose the one that matches your process, pack format and documentation requirements.</p>
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
            None of the page-1 competitors in either Oman or the UAE publishes
            one (checked 2026-10-05: omanchem ~250 words with no specs at all;
            chemstock.ae ~2,200 words, also none). A real table is both the
            thing a procurement engineer needs and the format AI answer engines
            lift wholesale — the same reason the MEG-vs-DEG guide outperforms. */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Nitric Acid Technical Specifications</h2>
              <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                Typical properties of the 68% HNO3 grade supplied in Oman. A Certificate of Analysis for the specific batch accompanies every consignment.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Property</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Industrial / Food 68%</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Laboratory</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Chemical formula', 'HNO3', 'HNO3'],
                      ['CAS number', '7697-37-2', '7697-37-2'],
                      ['Concentration', '68%', '68–70% (concentrated)'],
                      ['Appearance', 'Clear to pale yellow liquid', 'Clear, colourless to pale yellow'],
                      ['Specific gravity', '≈1.41 at 20°C', '1.42'],
                      ['Grade', 'Technical / food-contact', 'ACS · trace-metal (<10 ppb)'],
                      ['Pack formats', '35 kg carboy · 60 kg drum · 1,000 L IBC · bulk', '500 mL · 2.5 L amber glass'],
                      ['Typical CIP dose', '0.5–2% at 60–70°C', '—'],
                      ['Documentation', 'SDS (GHS) · CoA per batch · TDS', 'SDS · CoA · UN-compliant packaging'],
                      ['Storage', 'Vented, cool; PE or stainless containment', 'Glass, cool environment'],
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 ? 'bg-muted/20' : ''}>
                        <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
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
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Nitric Acid Applications in Oman &amp; the GCC</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">HNO3 serves metal treatment, water treatment, oil &amp; gas, food processing and laboratory duties — we supply the grade and pack that fits each.</p>
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

        {/* Why */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Source Nitric Acid from Global Chemicals LLC?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  'Manufactured in Oman at our own production unit — not imported stock',
                  '68% HNO3 — the concentrated grade most industrial duties require',
                  '35 kg carboys, 60 kg drums, 1,000 L IBC totes and bulk',
                  'Three grades from one source: industrial, food-contact and laboratory',
                  'Same-day dispatch in Muscat from our Ghala warehouse',
                  'Next-day to Sohar, 2–3 days to Salalah and Duqm',
                  'GCC export in 2–7 days with Certificate of Origin',
                  'GHS-compliant SDS in English, Arabic on request',
                  'Certificate of Analysis issued per batch',
                  'JSRS registered — qualified for PDO and EPC contractors',
                  'ISO 9001:2015 certified and ICV compliant',
                  'Competitive, volume-tiered pricing — local production, no import markup'
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
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions — Nitric Acid in Oman</h2>
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
              <h2 className="text-2xl font-bold text-center mb-8">Nitric Acid Delivery Across Oman</h2>
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

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Request a Nitric Acid Quote
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tell us your grade (industrial / food-contact / laboratory), concentration, quantity and delivery location — our team responds within 24 hours with pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'nitric_acid_quote_bottom')}>
                  <Link to="/contact?product=Nitric+Acid" rel="nofollow">
                    <Mail className="w-5 h-5" /> Get a Free Quote
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a href="tel:+96893754388">
                    <Phone className="w-5 h-5" /> Call +968 93754388
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

export default NitricAcidOman;
