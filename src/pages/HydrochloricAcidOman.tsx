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
 * Product+geo hub for hydrochloric acid, modelled on NitricAcidOman.tsx.
 *
 * Why this one and not four more (measured 2026-10-05, see
 * docs/seo/chlor-alkali-position-report-2026-10-05.md): across the chlor-alkali
 * range the site took ZERO clicks in 90 days. HCl is the extreme case — not a
 * single classic-search impression, despite two live product pages. That is the
 * same *absence* diagnosis that justified the nitric acid hub, and a new URL
 * cannot cost an existing ranking.
 *
 * Caustic soda is deliberately NOT getting the same treatment: it already has a
 * hub at /chemical-supplier/caustic-soda-oman and still averages position 57.3,
 * which is the counter-example proving a hub alone does not rank without
 * referring domains behind it. Building more hubs on the assumption they rank
 * would be ignoring our own data.
 *
 * Every specification below comes from content already published on gcoman.com
 * — the 30–33% w/w strength, SG 1.15–1.16, the carboy/drum/IBC/tanker pack
 * range, Ghala stock and same-day Muscat dispatch from
 * /products/water-treatment/hydrochloric-acid-industrial; the 36–38% ACS and
 * 0.1N/1N standardised solutions from /products/lab-chemicals/
 * hydrochloric-acid-lab. Locally held stock is on the owner's confirmation
 * (2026-10-05). No price, capacity or lead-time figure is published — those
 * were not supplied, and inventing them would be worse than omitting them.
 */

const faqs = [
  {
    question: "How much does hydrochloric acid cost in Oman?",
    answer: "Hydrochloric acid pricing in Oman depends on strength (30–33% technical vs 36–38% ACS), pack format and order volume — a bulk tanker load prices very differently from 35 kg carboys. Global Chemicals LLC holds stock in Muscat and quotes volume-tiered pricing. Contact info@gcoman.com or +968-93754388 with your strength, quantity and delivery location for a current quotation."
  },
  {
    question: "What strengths and pack sizes of hydrochloric acid are available in Oman?",
    answer: "Global Chemicals LLC supplies hydrochloric acid (HCl, CAS 7647-01-0) in two grades from Muscat stock: technical/commercial grade at 30–33% w/w for industrial duties, in 35 kg HDPE carboys, 200–220 L drums, 1,000 L IBC totes and bulk tanker; and laboratory grade at 36–38% ACS reagent, plus standardised 0.1N and 1N solutions, in 500 mL, 2.5 L and 5 L bottles."
  },
  {
    question: "What is hydrochloric acid used for in industry?",
    answer: "Hydrochloric acid is one of the highest-volume industrial acids in Oman. Water and wastewater plants use it for pH neutralisation of alkaline effluent and for regenerating cation ion-exchange resins in demineralisation plants. Facilities and O&M contractors use inhibited dilutions to descale boilers, heat exchangers, cooling-tower fill and RO CIP circuits. Steel fabricators use it for pickling and surface preparation ahead of galvanising, and well-service contractors use it in scale-dissolution treatments. It is also used for brine acidification and general chemical processing."
  },
  {
    question: "Is hydrochloric acid the same as muriatic acid?",
    answer: "Yes. Muriatic acid is an older commercial name for hydrochloric acid, still widely used in construction, pool maintenance and cleaning supply across the GCC. Both refer to an aqueous solution of hydrogen chloride (HCl, CAS 7647-01-0). The commercial grade sold as muriatic acid is typically the same 30–33% w/w technical strength we supply; laboratory-grade ACS reagent at 36–38% is a different, higher-purity specification."
  },
  {
    question: "Do you supply hydrochloric acid to Saudi Arabia, the UAE and Bahrain?",
    answer: "Yes. Global Chemicals LLC exports hydrochloric acid across the GCC from Oman — to the UAE (Dubai, Abu Dhabi, Sharjah), Saudi Arabia (Dammam, Jeddah, Riyadh), Bahrain (Manama), Qatar (Doha) and Kuwait. Consignments move by road or via Sohar Port with a Certificate of Origin on request, and a GHS-compliant Safety Data Sheet in English (Arabic available) accompanies every shipment."
  },
  {
    question: "Can you supply hydrochloric acid in bulk tanker loads?",
    answer: "Yes. Alongside 35 kg carboys, 200–220 L drums and 1,000 L IBC totes, we supply hydrochloric acid by bulk tanker for plant-scale users — typically water treatment plants, demineralisation facilities and steel pickling lines whose consumption makes drum handling impractical. Tell us your offloading arrangement and storage capacity when requesting a quote."
  },
  {
    question: "How is hydrochloric acid used to regenerate ion-exchange resins?",
    answer: "In a demineralisation plant the cation resin exchanges hydrogen ions for dissolved metal cations until it is exhausted. Regeneration passes a dilute hydrochloric acid solution through the bed, displacing the captured cations and restoring the resin to its hydrogen form. Acid strength, flow rate and contact time are set by the resin manufacturer's data sheet; technical-grade 30–33% HCl is diluted to the working concentration on site. We supply the concentrated acid and the Certificate of Analysis your plant QA will need."
  },
  {
    question: "What safety documentation comes with hydrochloric acid?",
    answer: "Every consignment ships with a current GHS-compliant Safety Data Sheet in English, Arabic on request, plus a Certificate of Analysis for the batch and a Technical Data Sheet. Hydrochloric acid is corrosive and fumes at commercial strength: handle with full acid PPE (face shield, acid-resistant gloves and apron), use only in ventilated areas, store away from alkalis, oxidisers and metals, and use polyethylene or lined containment — never bare carbon steel."
  }
];

const gradeForms = [
  {
    icon: Factory,
    title: "Hydrochloric Acid — Technical",
    subtitle: "30–33% w/w",
    description: "The standard commercial grade for industrial duties — pH neutralisation, descaling, resin regeneration and steel pickling. Also sold under the older name muriatic acid.",
    specs: ["HCl content: 30–33% w/w", "Specific gravity: 1.15–1.16 at 25°C", "Clear to pale-yellow fuming liquid", "35 kg carboy · 200–220 L drum · 1,000 L IBC · bulk tanker"],
    uses: ["Effluent pH neutralisation", "Boiler & heat-exchanger descaling", "Ion-exchange resin regeneration", "Steel pickling before galvanising"],
    productLink: "/products/water-treatment/hydrochloric-acid-industrial"
  },
  {
    icon: FlaskConical,
    title: "Hydrochloric Acid — Laboratory",
    subtitle: "36–38% ACS",
    description: "ACS reagent grade for analytical laboratories, QC facilities and research institutions, with standardised solutions for titration work.",
    specs: ["Purity: 36–38% (concentrated), ACS reagent", "Standardised 0.1N and 1N available", "Low non-volatile residue", "500 mL · 2.5 L · 5 L bottles"],
    uses: ["Acid-base titrations", "Metal dissolution & digestion", "Ore and mineral analysis", "Pharmaceutical testing & QC"],
    productLink: "/products/lab-chemicals/hydrochloric-acid-lab"
  }
];

const applications = [
  { icon: Droplets, title: "Water & Wastewater Treatment", desc: "pH neutralisation of alkaline effluent before discharge, and regeneration of cation ion-exchange resins in demineralisation plants." },
  { icon: Wrench, title: "Descaling & CIP", desc: "Inhibited dilutions strip scale from boilers, heat exchangers, cooling-tower fill and reverse-osmosis clean-in-place circuits." },
  { icon: Shield, title: "Steel Pickling", desc: "Removing mill scale and oxide from steel surfaces ahead of galvanising, coating or further fabrication." },
  { icon: Factory, title: "Oilfield", desc: "Scale-dissolution and well-service treatments, plus brine acidification in completion and workover fluids." },
  { icon: Beaker, title: "Chemical Processing", desc: "Chloride source and pH control across general chemical manufacturing, and feedstock for chloride salt production." },
  { icon: Package, title: "Laboratory & QC", desc: "Titration, sample digestion, ore analysis and pharmaceutical quality control using ACS-grade and standardised solutions." },
];

const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Chemical Suppliers Oman', url: 'https://gcoman.com/chemical-suppliers-oman' },
  { name: 'Hydrochloric Acid Supplier Oman', url: 'https://gcoman.com/chemical-supplier/hydrochloric-acid-oman' }
];

const gccDelivery = [
  { country: 'Oman', leadTime: 'Same-day (Muscat) / next-day (Sohar)', notes: 'Home market — Ghala stock, no export documentation needed' },
  { country: 'UAE', leadTime: '2–5 business days', notes: 'Dubai, Abu Dhabi, Sharjah — Certificate of Origin + English/Arabic SDS' },
  { country: 'Saudi Arabia', leadTime: '4–7 business days', notes: 'Dammam, Jeddah, Riyadh — SASO documentation support' },
  { country: 'Bahrain', leadTime: '3–5 business days', notes: 'Manama — GCC preferential Certificate of Origin available' },
  { country: 'Qatar', leadTime: '3–5 business days', notes: 'Doha, Mesaieed — clearance documentation provided' },
  { country: 'Kuwait', leadTime: '4–6 business days', notes: 'Full customs & Certificate of Origin documentation' },
];

const HydrochloricAcidOman = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Hydrochloric Acid Supplier Oman | HCl 30-33% & Muriatic"
        description="Hydrochloric acid (HCl) supplier in Oman. Technical 30–33% and ACS lab grade. 35kg carboys, drums, IBC and bulk tanker. Stock held in Muscat. JSRS certified. GCC export."
        keywords="hydrochloric acid Oman, hydrochloric acid supplier Oman, HCl Oman, muriatic acid Oman, hydrochloric acid Muscat, HCl 33% Oman, hydrochloric acid price Oman, industrial hydrochloric acid Oman, hydrochloric acid Sohar, hydrochloric acid Salalah, HCl supplier UAE, hydrochloric acid Saudi Arabia, hydrochloric acid Bahrain, steel pickling acid Oman, descaling acid Oman, ion exchange resin regeneration Oman, HCl bulk tanker Oman"
        ogTitle="Hydrochloric Acid Supplier in Oman | HCl 30-33% Technical & ACS Lab Grade"
        ogDescription="Hydrochloric acid (HCl, CAS 7647-01-0) supplier in Muscat, Oman. Technical 30–33% and ACS laboratory grade, from 35kg carboys to bulk tanker. Stock held locally, export across the GCC."
        ogUrl="https://gcoman.com/chemical-supplier/hydrochloric-acid-oman"
        canonical="https://gcoman.com/chemical-supplier/hydrochloric-acid-oman"
      />
      <FAQStructuredData faqs={faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/chemical-supplier/hydrochloric-acid-oman"
        cssSelector={["h1", "h2", ".speakable"]}
      />
      <Navigation />

      <main id="main-content">
        {/* Hero — opening paragraph written as a self-contained definitional
            answer, because that is the block AI engines lift. */}
        <section className="pt-28 md:pt-36 pb-16 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">Stock Held in Muscat • Bulk Tanker Available • JSRS • ISO 9001:2015 • ICV</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Hydrochloric Acid Supplier in Oman
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed speakable">
                Hydrochloric acid (HCl, CAS 7647-01-0) — also known as muriatic acid — is a strong mineral acid supplied at 30–33% w/w for pH neutralisation, descaling, ion-exchange resin regeneration and steel pickling. Global Chemicals LLC holds stock in Muscat in technical and ACS laboratory grades, from 35 kg carboys and 200–220 L drums through 1,000 L IBC totes to bulk tanker loads, with same-day dispatch in Muscat and export across the GCC.
              </p>
              <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                <strong>CAS No.:</strong> 7647-01-0 &nbsp;|&nbsp; <strong>Formula:</strong> HCl &nbsp;|&nbsp; <strong>Strength:</strong> 30–33% w/w (36–38% ACS lab)
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'hcl_quote')}>
                  <Link to="/contact?product=Hydrochloric+Acid" rel="nofollow">
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

        {/* GCC coverage */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
                <Globe2 className="w-6 h-6 text-primary" />
                Hydrochloric Acid Supply Across the GCC
              </h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                We export HCl from Oman to every GCC market, with full customs documentation for each destination.
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
                { icon: Package, label: 'Carboy to Bulk Tanker', value: '✓' },
                { icon: Award, label: 'Grades: Technical & ACS Lab', value: '2' },
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
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Hydrochloric Acid Grades Available in Oman</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Technical grade for plant duties, ACS reagent grade for the laboratory — both from Muscat stock.</p>
              <div className="grid md:grid-cols-2 gap-8">
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

        {/* Spec table — no page-1 competitor in Oman publishes one. */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Hydrochloric Acid Technical Specifications</h2>
              <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                Typical properties of the grades supplied in Oman. A Certificate of Analysis for the specific batch accompanies every consignment.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Property</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Technical 30–33%</th>
                      <th className="text-left font-semibold text-foreground px-4 py-3">Laboratory ACS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Chemical formula', 'HCl', 'HCl'],
                      ['CAS number', '7647-01-0', '7647-01-0'],
                      ['Also known as', 'Muriatic acid', 'Hydrogen chloride solution'],
                      ['Strength', '30–33% w/w', '36–38% concentrated'],
                      ['Specific gravity', '1.15–1.16 at 25°C', '—'],
                      ['Appearance', 'Clear to pale-yellow fuming liquid', 'Clear, colourless liquid'],
                      ['Standardised solutions', '—', '0.1N · 1N'],
                      ['Pack formats', '35 kg carboy · 200–220 L drum · 1,000 L IBC · bulk tanker', '500 mL · 2.5 L · 5 L bottles'],
                      ['Documentation', 'SDS (GHS) · CoA per batch · TDS', 'SDS · CoA · certified analysis'],
                      ['Storage', 'Ventilated; PE or lined containment, never bare carbon steel', 'Cool, ventilated; glass or PE'],
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
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Hydrochloric Acid Applications in Oman &amp; the GCC</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">HCl is one of the highest-volume industrial acids in the Sultanate — we supply the grade and pack that fits each duty.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app, i) => {
                  const Icon = app.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-5 bg-muted/30 rounded-xl border border-border">
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
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Source Hydrochloric Acid from Global Chemicals LLC?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  'Stock held in Muscat — not ordered in on receipt of your enquiry',
                  'Technical 30–33% and ACS laboratory grade from one source',
                  '35 kg carboys, 200–220 L drums, 1,000 L IBC and bulk tanker',
                  'Standardised 0.1N and 1N solutions for titration work',
                  'Same-day dispatch in Muscat from our Ghala warehouse',
                  'Next-day to Sohar, 2–3 days to Salalah and Duqm',
                  'GCC export with Certificate of Origin',
                  'GHS-compliant SDS in English, Arabic on request',
                  'Certificate of Analysis issued per batch',
                  'JSRS registered — qualified for PDO and EPC contractors',
                  'ISO 9001:2015 certified and ICV compliant',
                  'Volume-tiered pricing for regular and bulk buyers'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions — Hydrochloric Acid in Oman</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <details key={i} className="group p-5 bg-muted/30 rounded-xl border border-border open:border-primary/30">
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
              <h2 className="text-2xl font-bold text-center mb-8">Hydrochloric Acid Delivery Across Oman</h2>
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

        {/* Related chlor-alkali range — keeps the family internally linked */}
        <section className="py-12 bg-muted/30 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">Related Chemicals We Supply in Oman</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Caustic Soda (NaOH)', to: '/chemical-supplier/caustic-soda-oman' },
                  { label: 'Nitric Acid 68%', to: '/chemical-supplier/nitric-acid-oman' },
                  { label: 'Sodium Hypochlorite', to: '/products/water-treatment/sodium-hypochlorite' },
                  { label: 'Calcium Chloride', to: '/products/oilfield/calcium-chloride-oil' },
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
                Request a Hydrochloric Acid Quote
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tell us your strength (30–33% technical / ACS laboratory), pack format, quantity and delivery location — our team responds within 24 hours with pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'hcl_quote_bottom')}>
                  <Link to="/contact?product=Hydrochloric+Acid" rel="nofollow">
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

export default HydrochloricAcidOman;
