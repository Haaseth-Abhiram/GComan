import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData, FAQStructuredData } from '@/components/StructuredData';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Droplets, Snowflake, Wind, Waves, Calculator } from 'lucide-react';

// The site's first linkable tool (Sprint 4 of the Aug 2026 gap analysis):
// working dosing calculators with the formulas shown, because transparent
// engineering content is what water-treatment forums, consultants and trade
// publications actually link to. Every result block ends in a quote CTA that
// feeds the prefilled contact funnel.

const num = (v: string): number => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const fmt = (n: number, dp = 2): string =>
  Number.isFinite(n) ? n.toLocaleString('en-US', { maximumFractionDigits: dp }) : '—';

// ── Chlorination ─────────────────────────────────────────────────────────────
const CHLORINE_PRODUCTS: Record<string, { label: string; available: number; quote: string }> = {
  'cal-hypo-65': { label: 'Calcium hypochlorite granules (65% av. Cl)', available: 0.65, quote: 'Calcium Hypochlorite' },
  'cal-hypo-70': { label: 'Calcium hypochlorite granules (70% av. Cl)', available: 0.70, quote: 'Calcium Hypochlorite' },
  'na-hypo-12': { label: 'Sodium hypochlorite solution (12.5% av. Cl)', available: 0.125, quote: 'Sodium Hypochlorite Solution' },
  'na-hypo-15': { label: 'Sodium hypochlorite solution (15% av. Cl)', available: 0.15, quote: 'Sodium Hypochlorite Solution' },
  'tcca-90': { label: 'TCCA tablets/granules (90% av. Cl)', available: 0.90, quote: 'TCCA' },
};

// ── Glycol freeze protection (approx. ASHRAE-style tables, vol %) ────────────
const GLYCOL_TABLE: Record<'meg' | 'pg', { pct: number; freezeC: number }[]> = {
  meg: [
    { pct: 10, freezeC: -3.4 }, { pct: 20, freezeC: -7.9 }, { pct: 30, freezeC: -14.1 },
    { pct: 40, freezeC: -22.3 }, { pct: 50, freezeC: -33.8 }, { pct: 60, freezeC: -48.3 },
  ],
  pg: [
    { pct: 10, freezeC: -2.9 }, { pct: 20, freezeC: -7.1 }, { pct: 30, freezeC: -12.7 },
    { pct: 40, freezeC: -21.1 }, { pct: 50, freezeC: -33.5 }, { pct: 60, freezeC: -51.1 },
  ],
};

const calculatorFAQs = [
  {
    question: 'How do you calculate chlorine dosing for water treatment?',
    answer:
      'Product feed (kg/day) = target dose (mg/L) × flow (m³/day) ÷ (1000 × available chlorine fraction). Example: dosing 2 mg/L into 500 m³/day using 65% calcium hypochlorite needs 2 × 500 ÷ (1000 × 0.65) ≈ 1.54 kg/day of product. For liquid sodium hypochlorite the same formula gives kg/day of solution; divide by its density (~1.2 kg/L) for litres.',
  },
  {
    question: 'What glycol concentration is needed for freeze protection?',
    answer:
      'For chilled-water and process loops, typical protection targets map to approximate volume concentrations: -8 °C ≈ 20%, -14 °C ≈ 30%, -22 °C ≈ 40% for MEG (propylene glycol runs slightly higher for the same protection). Glycol volume = system volume × concentration. Always verify the final mixture with a refractometer, and use inhibited glycol matched to the system metallurgy.',
  },
  {
    question: 'How is cooling tower blowdown calculated from cycles of concentration?',
    answer:
      'Evaporation E (m³/h) ≈ 0.00153 × recirculation rate (m³/h) × ΔT (°C). Blowdown B = E ÷ (C − 1), where C is cycles of concentration. Make-up = E + B (drift neglected). Example: 500 m³/h recirculation with a 6 °C range at 5 cycles gives E ≈ 4.6 m³/h and B ≈ 1.15 m³/h. Inhibitor feed (kg/day) = target residual (mg/L) × blowdown (m³/day) ÷ 1000.',
  },
  {
    question: 'What is the typical antiscalant dose for an RO plant?',
    answer:
      'Most RO antiscalants dose at 2–4 mg/L into the membrane feed stream — the exact figure comes from a projection run against your feed-water analysis. Feed rate (g/h) = dose (mg/L) × feed flow (m³/h). A 100 m³/h train at 3 mg/L consumes 300 g/h ≈ 7.2 kg/day ≈ 216 kg/month. We run projections free of charge against your water analysis.',
  },
];

const DosingCalculator = () => {
  // Chlorination state
  const [clFlow, setClFlow] = useState('500');
  const [clDose, setClDose] = useState('2');
  const [clProduct, setClProduct] = useState('cal-hypo-65');
  const chlorine = useMemo(() => {
    const p = CHLORINE_PRODUCTS[clProduct];
    const kgDay = (num(clDose) * num(clFlow)) / (1000 * p.available);
    return { kgDay, kgMonth: kgDay * 30, product: p };
  }, [clFlow, clDose, clProduct]);

  // Glycol state
  const [glVolume, setGlVolume] = useState('5000');
  const [glType, setGlType] = useState<'meg' | 'pg'>('meg');
  const [glTarget, setGlTarget] = useState('-15');
  const glycol = useMemo(() => {
    const target = parseFloat(glTarget);
    const row = GLYCOL_TABLE[glType].find((r) => r.freezeC <= target) ?? GLYCOL_TABLE[glType][GLYCOL_TABLE[glType].length - 1];
    const vol = num(glVolume);
    const glycolL = (vol * row.pct) / 100;
    return { pct: row.pct, freezeC: row.freezeC, glycolL, waterL: vol - glycolL };
  }, [glVolume, glType, glTarget]);

  // Cooling tower state
  const [ctRecirc, setCtRecirc] = useState('500');
  const [ctDeltaT, setCtDeltaT] = useState('6');
  const [ctCycles, setCtCycles] = useState('5');
  const [ctPpm, setCtPpm] = useState('100');
  const tower = useMemo(() => {
    const R = num(ctRecirc);
    const dT = num(ctDeltaT);
    const C = Math.max(num(ctCycles), 1.01);
    const evap = 0.00153 * R * dT; // m³/h
    const blowdown = evap / (C - 1); // m³/h
    const makeup = evap + blowdown;
    const inhibitorKgDay = (num(ctPpm) * blowdown * 24) / 1000;
    return { evap, blowdown, makeup, inhibitorKgDay };
  }, [ctRecirc, ctDeltaT, ctCycles, ctPpm]);

  // RO antiscalant state
  const [roFlow, setRoFlow] = useState('100');
  const [roDose, setRoDose] = useState('3');
  const ro = useMemo(() => {
    const gH = num(roDose) * num(roFlow);
    return { gH, kgDay: (gH * 24) / 1000, kgMonth: (gH * 24 * 30) / 1000 };
  }, [roFlow, roDose]);

  // Carry the sized requirement into the quote form. Previously only the
  // product name travelled, so a buyer who had just computed "1,540 kg/month"
  // landed on a form with an empty "Quantity required:" line and had to retype
  // it — turning a qualified, sized RFQ back into a blank enquiry.
  const quoteHref = (product: string, quantity?: string) =>
    `/contact?product=${encodeURIComponent(product)}` +
    (quantity ? `&qty=${encodeURIComponent(quantity)}` : '');
  const canonical = 'https://gcoman.com/tools/dosing-calculator';

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Water Treatment Dosing Calculators — Chlorine, Glycol, RO"
        description="Free dosing calculators for water treatment engineers: chlorination feed rates, glycol freeze protection, cooling-tower cycles & blowdown, and RO antiscalant consumption — with the formulas shown."
        keywords="chlorine dosing calculator, glycol concentration calculator, cooling tower blowdown calculator, antiscalant dosing calculator, water treatment calculator Oman"
        ogUrl={canonical}
        canonical={canonical}
      />
      <Helmet defer={false}>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Water Treatment Dosing Calculators',
            url: canonical,
            applicationCategory: 'EngineeringApplication',
            operatingSystem: 'Any (web browser)',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            provider: { '@id': 'https://gcoman.com/#organization' },
            description:
              'Chlorination feed rate, glycol freeze protection, cooling tower cycles and blowdown, and RO antiscalant dosing calculators for water treatment professionals.',
          })}
        </script>
      </Helmet>
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: 'https://gcoman.com/' },
          { name: 'Dosing Calculators', url: canonical },
        ]}
      />
      <FAQStructuredData faqs={calculatorFAQs} />

      <Navigation />

      <main id="main-content">
        <section className="pt-32 pb-10 bg-muted/30">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <span className="text-foreground">Dosing Calculators</span>
            </nav>
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="p-3 rounded-lg bg-primary/10 shrink-0 mt-1">
                <Calculator className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Water Treatment Dosing Calculators
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  Four working calculators our technical team uses every day — with the formulas in the open so you
                  can check the arithmetic. Results are planning estimates; for a dosing programme matched to your
                  water analysis, send it over and we&apos;ll run it properly, free of charge.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-2 max-w-6xl">

            {/* ── 1. Chlorination ── */}
            <Card className="p-6" data-calc="chlorination">
              <div className="flex items-center gap-3 mb-1">
                <Droplets className="w-6 h-6 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-bold text-foreground">Chlorination Feed Rate</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                How much product to feed for a target free-chlorine dose.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cl-flow">Water flow (m³/day)</Label>
                  <Input id="cl-flow" type="number" inputMode="decimal" min="0" value={clFlow} onChange={(e) => setClFlow(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cl-dose">Target dose (mg/L)</Label>
                  <Input id="cl-dose" type="number" inputMode="decimal" min="0" step="0.1" value={clDose} onChange={(e) => setClDose(e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Product</Label>
                  <Select value={clProduct} onValueChange={setClProduct}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CHLORINE_PRODUCTS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-primary/5 border border-primary/20 p-4" data-result="chlorination">
                <div className="flex flex-wrap gap-x-8 gap-y-1">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{fmt(chlorine.kgDay)} kg/day</div>
                    <div className="text-xs text-muted-foreground">product feed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{fmt(chlorine.kgMonth, 0)} kg/month</div>
                    <div className="text-xs text-muted-foreground">≈ 30-day consumption</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-mono">
                kg/day = dose × flow ÷ (1000 × available-Cl fraction)
              </p>
              <Button asChild size="sm" className="mt-4" onClick={() => trackSelectContent('cta_button', 'calc_quote_chlorine')}>
                <Link to={quoteHref(chlorine.product.quote, `${fmt(chlorine.kgMonth)} kg/month (${clFlow} m³/day at ${clDose} mg/L, ${chlorine.product.label}) — sized with your dosing calculator`)} rel="nofollow">Get a {chlorine.product.quote} quote</Link>
              </Button>
            </Card>

            {/* ── 2. Glycol ── */}
            <Card className="p-6" data-calc="glycol">
              <div className="flex items-center gap-3 mb-1">
                <Snowflake className="w-6 h-6 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-bold text-foreground">Glycol Freeze Protection</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Concentration and glycol volume for a target freeze point.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="gl-vol">System volume (litres)</Label>
                  <Input id="gl-vol" type="number" inputMode="decimal" min="0" value={glVolume} onChange={(e) => setGlVolume(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Glycol type</Label>
                  <Select value={glType} onValueChange={(v) => setGlType(v as 'meg' | 'pg')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meg">MEG (inhibited ethylene glycol)</SelectItem>
                      <SelectItem value="pg">Propylene glycol (low-tox)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Freeze protection to</Label>
                  <Select value={glTarget} onValueChange={setGlTarget}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[-5, -10, -15, -20, -25, -30].map((t) => (
                        <SelectItem key={t} value={String(t)}>{t} °C</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-primary/5 border border-primary/20 p-4" data-result="glycol">
                <div className="flex flex-wrap gap-x-8 gap-y-1">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{glycol.pct}% v/v</div>
                    <div className="text-xs text-muted-foreground">freezes at ≈ {glycol.freezeC} °C</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{fmt(glycol.glycolL, 0)} L glycol</div>
                    <div className="text-xs text-muted-foreground">+ {fmt(glycol.waterL, 0)} L water</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Approximate table values — verify the final mix with a refractometer. Use inhibited glycol matched to system metallurgy.
              </p>
              <Button asChild size="sm" className="mt-4" onClick={() => trackSelectContent('cta_button', 'calc_quote_glycol')}>
                <Link to={quoteHref(glType === 'meg' ? 'MEG (Monoethylene Glycol)' : 'Propylene Glycol (USP/Industrial)', `${fmt(glycol.glycolL)} L glycol for a ${fmt(num(glVolume))} L system at ${glycol.pct}% (freeze point ${glycol.freezeC} °C) — sized with your dosing calculator`)} rel="nofollow">
                  Get a glycol quote
                </Link>
              </Button>
            </Card>

            {/* ── 3. Cooling tower ── */}
            <Card className="p-6" data-calc="tower">
              <div className="flex items-center gap-3 mb-1">
                <Wind className="w-6 h-6 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-bold text-foreground">Cooling Tower Cycles &amp; Blowdown</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Evaporation, blowdown, make-up and inhibitor feed from cycles of concentration.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ct-recirc">Recirculation (m³/h)</Label>
                  <Input id="ct-recirc" type="number" inputMode="decimal" min="0" value={ctRecirc} onChange={(e) => setCtRecirc(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ct-dt">ΔT across tower (°C)</Label>
                  <Input id="ct-dt" type="number" inputMode="decimal" min="0" step="0.5" value={ctDeltaT} onChange={(e) => setCtDeltaT(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ct-cycles">Cycles of concentration</Label>
                  <Input id="ct-cycles" type="number" inputMode="decimal" min="1.1" step="0.5" value={ctCycles} onChange={(e) => setCtCycles(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ct-ppm">Inhibitor residual (mg/L)</Label>
                  <Input id="ct-ppm" type="number" inputMode="decimal" min="0" value={ctPpm} onChange={(e) => setCtPpm(e.target.value)} />
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-primary/5 border border-primary/20 p-4" data-result="tower">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <div className="text-lg font-bold text-foreground">{fmt(tower.evap)} m³/h</div>
                    <div className="text-xs text-muted-foreground">evaporation</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{fmt(tower.blowdown)} m³/h</div>
                    <div className="text-xs text-muted-foreground">blowdown</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{fmt(tower.makeup)} m³/h</div>
                    <div className="text-xs text-muted-foreground">make-up</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{fmt(tower.inhibitorKgDay)} kg/day</div>
                    <div className="text-xs text-muted-foreground">inhibitor feed</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-mono">
                E ≈ 0.00153 × R × ΔT · B = E ÷ (C − 1) · feed = ppm × B ÷ 1000
              </p>
              <Button asChild size="sm" className="mt-4" onClick={() => trackSelectContent('cta_button', 'calc_quote_tower')}>
                <Link to={quoteHref('Cool Water Treat Corrosion Inhibitor', `${fmt(tower.inhibitorKgDay * 30)} kg/month inhibitor (blowdown ${fmt(tower.blowdown)} m³/h at ${ctCycles} cycles, ${ctPpm} mg/L residual) — sized with your dosing calculator`)} rel="nofollow">Get a cooling-water programme quote</Link>
              </Button>
            </Card>

            {/* ── 4. RO antiscalant ── */}
            <Card className="p-6" data-calc="ro">
              <div className="flex items-center gap-3 mb-1">
                <Waves className="w-6 h-6 text-primary" aria-hidden="true" />
                <h2 className="text-xl font-bold text-foreground">RO Antiscalant Consumption</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Feed rate and monthly consumption from dose and feed flow.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ro-flow">RO feed flow (m³/h)</Label>
                  <Input id="ro-flow" type="number" inputMode="decimal" min="0" value={roFlow} onChange={(e) => setRoFlow(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ro-dose">Antiscalant dose (mg/L)</Label>
                  <Input id="ro-dose" type="number" inputMode="decimal" min="0" step="0.5" value={roDose} onChange={(e) => setRoDose(e.target.value)} />
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-primary/5 border border-primary/20 p-4" data-result="ro">
                <div className="flex flex-wrap gap-x-8 gap-y-1">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{fmt(ro.gH, 0)} g/h</div>
                    <div className="text-xs text-muted-foreground">feed rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{fmt(ro.kgDay, 1)} kg/day</div>
                    <div className="text-xs text-muted-foreground">daily</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{fmt(ro.kgMonth, 0)} kg/month</div>
                    <div className="text-xs text-muted-foreground">≈ 30 days</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 font-mono">
                g/h = dose (mg/L) × feed flow (m³/h) — dose from a projection against your water analysis (typ. 2–4 mg/L)
              </p>
              <Button asChild size="sm" className="mt-4" onClick={() => trackSelectContent('cta_button', 'calc_quote_ro')}>
                <Link to={quoteHref('Antiscalant RO', `${fmt(ro.kgMonth)} kg/month (${roFlow} m³/h feed at ${roDose} mg/L) — sized with your dosing calculator`)} rel="nofollow">Get an antiscalant quote + free projection</Link>
              </Button>
            </Card>
          </div>

          <div className="container mx-auto px-4 max-w-6xl mt-10">
            <div className="rounded-lg border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
              <strong className="text-foreground">Engineering note.</strong> These calculators give planning-grade
              estimates using industry-standard formulas (shown under each tool). Actual dosing depends on your water
              analysis, temperature, materials and control regime — Global Chemicals LLC&apos;s technical team reviews
              all of that at no cost when you request a programme. Formulas may be reproduced with attribution and a
              link to this page.
            </div>
          </div>

          {/* These FAQs were previously passed to FAQStructuredData only, with
              no visible counterpart — FAQ markup must correspond to content on
              the page, and this is ~700 words of the exact "how do you
              calculate X" copy the page is meant to rank for. */}
          <div className="container mx-auto px-4 max-w-3xl mt-14">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {calculatorFAQs.map((faq, i) => (
                <AccordionItem key={i} value={`calc-faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DosingCalculator;
