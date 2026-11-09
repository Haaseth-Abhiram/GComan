import { Link, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Phone, ArrowRight, Truck, FileCheck2, Waves, MessageCircle, Sun } from 'lucide-react';
import hubAr from '@/i18n/locales/hub-pages-ar.json';
import PoolChlorineGccAr from './PoolChlorineGccAr';

/**
 * Pool chlorine and calcium hypochlorite, one hub for the GCC export markets
 * (2026-11-05, MASTER-PLAN P9.9). /ar renders PoolChlorineGccAr.tsx, a full
 * Arabic body, so both versions carry reciprocal hreflang.
 *
 * Why: the 2026-10-27 demand study (docs/seo/gcc-keyword-demand-2026-10-27.md)
 * lists "calcium hypochlorite suppliers in uae", "... in saudi arabia",
 * "calcium hypochlorite supplier in dubai" and "chlorine tablets suppliers in
 * dubai" as Google autocomplete phrases, plus the Arabic pool-chlorine
 * phrases for Kuwait. The site had the Oman pool category, an Oman pool blog
 * and the sodium hypochlorite Oman hub, and no page naming the GCC markets
 * for calcium hypochlorite or chlorine tablets: absent, not outranked (the
 * NitricAcidOman.tsx condition for a new page). The 10-27 baseline read
 * (location-ledger) found gcoman.com absent from the top 9 for calcium
 * hypochlorite in the UAE.
 *
 * Scope is closed: one page for six markets, no per-country copies, no
 * product x city pages (HANDOFF). Every spec restates the product page it
 * links to (swimming-pool.json, water-treatment.json); lead times restate the
 * /chemicals/<market> pages and WaterTreatmentChemicalsGcc.tsx; no price.
 * Dangerous-goods entries are the UN Model Regulations entries for dry
 * calcium hypochlorite, TCCA and hypochlorite solution.
 */

const URL = 'https://gcoman.com/chemical-supplier/pool-chlorine-gcc';

type ProductRow = { name: string; spec: string; packs: string; link: string };

// Canonical SKUs only. /products/water-treatment/chlorine-tablets carries a
// canonicalOverride to the swimming-pool tablet and must never be linked.
const PRODUCTS: ProductRow[] = [
  { name: 'Calcium hypochlorite granules (pool shock)', spec: '65–70% available chlorine, unstabilised; shock 150–300 g per 10,000 L, dissolves in 2–4 h', packs: '1, 5, 25 and 50 kg', link: '/products/swimming-pool/calcium-hypochlorite-granules' },
  { name: 'Calcium hypochlorite 65–75% (water treatment grade)', spec: '65–75% available chlorine, moisture <10%', packs: '25 kg and 45 kg drums', link: '/products/water-treatment/calcium-hypochlorite-water' },
  { name: 'Chlorine powder', spec: '65–70% available chlorine, fine powder, no stabiliser', packs: '500 g to 50 kg', link: '/products/swimming-pool/chlorine-powder-pool' },
  { name: 'TCCA tablets (trichloroisocyanuric acid)', spec: '90% available chlorine, cyanuric-acid stabilised; 20 g and 200 g; 3–7 days dissolution', packs: '1, 5, 10 and 25 kg buckets', link: '/products/swimming-pool/tcca-tablet-pool' },
  { name: 'Chlorine tablets 200 g', spec: '90% available chlorine, 2–3 tablets per 10,000 L weekly in a feeder or skimmer', packs: 'Buckets', link: '/products/swimming-pool/chlorine-tablet-pool' },
  { name: 'Jumbo 3-inch chlorine tablets', spec: '200 g, 90% available chlorine, 5–7 days dissolution', packs: '5, 10 and 25 kg buckets', link: '/products/swimming-pool/chlorine-tablet-jumbo' },
  { name: 'Sodium hypochlorite 12–15% (pool grade)', spec: '12–15% available chlorine, 0.8–1.5 L per 10,000 L, for dosing pumps and feeders', packs: '25 L, 60 L, 200 L, 1,000 L IBC', link: '/products/swimming-pool/sodium-hypo-chlorite-12-15' },
  { name: 'Chlorine liquid 10–12%', spec: 'Ready to use, 1–2 L per 10,000 L', packs: '5 L, 20 L, 25 L', link: '/products/swimming-pool/chlorine-liquid-pool' },
  { name: 'Algaecide', spec: 'Quaternary ammonium 10–15%, non-foaming; 100–200 mL per 10,000 L initially, 50 mL weekly', packs: '1 L, 5 L, 20 L', link: '/products/swimming-pool/algacide-liquid' },
  { name: 'Sodium bisulphite liquid (dechlorination)', spec: '38–40%; 100 mL removes 1 ppm chlorine in 10,000 L', packs: '5 L, 20 L, 60 L', link: '/products/swimming-pool/sodium-bi-sulphite-liquid-pool' },
  { name: 'Sodium bisulphite monohydrate', spec: '95% min; 70–100 g removes 1 ppm chlorine in 10,000 L', packs: '1, 5 and 25 kg bags', link: '/products/swimming-pool/sodium-bi-sulphite-monohydrate' },
  { name: 'pH reducer (sodium bisulphate) and pH raiser (soda ash)', spec: 'Bisulphate 93% min granules; soda ash 99.2% min', packs: '25 kg bags', link: '/products/water-treatment/sodium-bisulphate-bisulphite' },
];

type Market = { market: string; points: string; leadTime: string; link: string };

const MARKETS: Market[] = [
  { market: 'UAE', points: 'Dubai, Sharjah, Abu Dhabi, Ras Al Khaimah; Fujairah and the east coast', leadTime: '3–5 business days by road; Fujairah same or next day', link: '/chemicals/uae' },
  { market: 'Saudi Arabia', points: 'Dammam, Khobar, Jubail; Riyadh; Jeddah, Yanbu', leadTime: 'Eastern Province 4–6 business days; Riyadh 5–7; Jeddah and Yanbu 4–6 days by sea via Sohar', link: '/chemicals/saudi-arabia' },
  { market: 'Qatar', points: 'Doha, Mesaieed, Lusail and the Pearl', leadTime: '3–5 business days by road', link: '/chemicals/doha' },
  { market: 'Kuwait', points: 'Kuwait City, Salmiya, Shuaiba', leadTime: '4–6 business days by road', link: '/chemicals/kuwait-city' },
  { market: 'Bahrain', points: 'Manama, Sitra, Amwaj', leadTime: '3–5 business days via the King Fahd Causeway', link: '/chemicals/bahrain' },
  { market: 'Oman', points: 'Muscat, Sohar, Salalah, Duqm', leadTime: 'Muscat same day; Sohar next day; Salalah and Duqm 2–3 days', link: '/chemicals/muscat' },
];

type Choice = { pool: string; chlorine: string; why: string };

const CHOICE: Choice[] = [
  { pool: 'Hotel, resort and club pools with a dosing pump', chlorine: 'Sodium hypochlorite 12–15% in 200 L drums or 1,000 L IBCs', why: 'Continuous dosing from a pump holds 1–3 ppm free chlorine without handling solids; the IBC is the cheapest chlorine per litre delivered' },
  { pool: 'Villa and residential pools', chlorine: 'TCCA tablets in a floating feeder or skimmer', why: 'Slow release over 3–7 days; the cyanuric acid stabiliser protects chlorine from Gulf sunlight' },
  { pool: 'Weekly shock, algae bloom, after a sandstorm', chlorine: 'Calcium hypochlorite granules 65–70%', why: 'Unstabilised, so the shock dose clears without raising cyanuric acid; dissolves in 2–4 hours' },
  { pool: 'Water parks and large-volume pools', chlorine: 'Calcium hypochlorite powder in 50 kg bags or hypochlorite in bulk', why: 'Lowest cost per kilogram of chlorine at tonnage volumes' },
  { pool: 'Indoor and covered pools', chlorine: 'Calcium hypochlorite or sodium hypochlorite', why: 'No UV loss, so a stabiliser is unnecessary and cyanuric acid build-up is avoided' },
  { pool: 'Draining or backwash to drain', chlorine: 'Sodium bisulphite liquid or monohydrate', why: 'Dechlorinates to the discharge limit; 100 mL of liquid removes 1 ppm in 10,000 L' },
];

const FAQS = [
  {
    question: 'Do you supply calcium hypochlorite to the UAE?',
    answer:
      'Yes. Calcium hypochlorite 65–70% granules in 1 to 50 kg packs and the 65–75% water-treatment grade in 25 kg and 45 kg drums ship from Muscat stock: Dubai, Sharjah, Abu Dhabi and Ras Al Khaimah are three to five business days by road under GCC customs transit, and Fujairah and the east coast two to four hours. Free-zone and hotel deliveries need the consignee and gate details with the order.',
  },
  {
    question: 'Which pool chlorine should a hotel in Dubai or Doha use: TCCA tablets, calcium hypochlorite or liquid chlorine?',
    answer:
      'A pool with a dosing pump runs on sodium hypochlorite 12–15% from drums or IBCs. A pool without one uses TCCA tablets in a feeder for daily sanitising, because the cyanuric acid stabiliser slows chlorine loss in Gulf sunlight. Calcium hypochlorite granules are the shock product for both, used weekly or after an algae bloom, since they carry no stabiliser and do not push cyanuric acid up.',
  },
  {
    question: 'How much calcium hypochlorite does it take to shock a 10,000 litre pool?',
    answer:
      'For 65–70% granules, 150 to 300 g per 10,000 litres, dissolved in a bucket of pool water and added with the pump running; the dose clears in two to four hours. Sodium hypochlorite 12–15% shocks at 1 to 2 litres per 10,000 litres. Our dosing calculator gives the figure for any pool volume and target residual.',
  },
  {
    question: 'How is pool chlorine shipped from Oman to the GCC?',
    answer:
      'Dry calcium hypochlorite travels as UN 1748 and TCCA as UN 2468, both Class 5.1 oxidisers, and sodium hypochlorite solution as UN 1791, Class 8. Loads are segregated from acids, organics and fuels, kept dry and shaded, and carry the GHS Safety Data Sheet in English and Arabic. Calcium hypochlorite and TCCA are never stored or loaded together, because the two react violently when mixed.',
  },
  {
    question: 'Do you have a price list for pool chlorine in bulk?',
    answer:
      'There is no fixed public list, because calcium hypochlorite and hypochlorite prices move with raw-material markets and the pack size. Send the product, the monthly volume, the pack format and the delivery city, and a quotation per kilogram, per bucket or per IBC follows within 24 hours. Pallet and container prices are given for hotel groups, pool contractors and distributors.',
  },
  {
    question: 'Can I buy chlorine tablets in Kuwait or Saudi Arabia from you?',
    answer:
      'Yes. TCCA 200 g and jumbo 3-inch tablets in 5 to 25 kg buckets reach Kuwait City in four to six business days by road, Dammam, Khobar and Jubail in four to six, Riyadh in five to seven, and Jeddah in four to six days by sea via Sohar Port. Every consignment carries a GCC Certificate of Origin, a Certificate of Analysis and the Safety Data Sheet.',
  },
];

const bulkWhatsApp =
  'https://wa.me/96892772305?text=' +
  encodeURIComponent(
    'Pool chlorine enquiry (gcoman.com). Product: calcium hypochlorite / TCCA tablets / sodium hypochlorite ___. Monthly volume: ___. Pack: ___. Delivery city and country: ___. Company: ___'
  );

const PoolChlorineGcc = () => {
  // /ar renders the full Arabic body (PoolChlorineGccAr.tsx); see its header.
  const { pathname } = useLocation();
  if (pathname.startsWith('/ar/')) return <PoolChlorineGccAr />;
  const arMeta = hubAr.hubPages['pool-chlorine-gcc'];
  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: 'Chemical Suppliers Middle East', url: 'https://gcoman.com/chemical-suppliers-middle-east' },
    { name: 'Pool Chlorine Supplier GCC', url: URL },
  ];
  const title = 'Pool Chlorine & Calcium Hypochlorite Supplier UAE & GCC';
  const description =
    'Calcium hypochlorite 65–70%, TCCA 90% tablets, sodium hypochlorite 12–15% and algaecide from Muscat stock: Dubai 3–5 days, Kuwait 4–6, Dammam 4–6, Doha 3–5. CoA, SDS, GCC CoO.';

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={title}
        description={description}
        keywords="calcium hypochlorite suppliers in UAE, calcium hypochlorite supplier in Dubai, calcium hypochlorite suppliers in Saudi Arabia, chlorine tablets suppliers in Dubai, pool chlorine supplier Kuwait, pool chlorine GCC, TCCA tablets supplier UAE, swimming pool chemicals supplier GCC, pool chlorine price, pool chemicals supplier Oman"
        ogTitle={title}
        ogDescription={description}
        ogUrl={URL}
        canonical={URL}
        arTitle={arMeta.metaTitle}
        arDescription={arMeta.metaDescription}
      />
      <FAQStructuredData faqs={FAQS} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData url={URL} cssSelector={['h1', 'h2', '.speakable']} />
      <Navigation />

      <main id="main-content">
        <section className="pt-28 md:pt-36 pb-14 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 text-sm px-4 py-1.5">Calcium hypochlorite 65–70% • TCCA 90% • Hypochlorite 12–15% • Muscat stock • ISO 9001:2015</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Pool Chlorine and Calcium Hypochlorite Supplier for the UAE, Saudi Arabia, Kuwait and the GCC
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed speakable">
                Global Chemicals LLC supplies pool chlorine from Muscat stock to hotels, resorts, water parks, pool
                contractors, facilities-management companies and distributors across the UAE, Saudi Arabia, Qatar,
                Kuwait, Bahrain and Oman: calcium hypochlorite granules and powder, TCCA tablets in 20 g, 200 g and jumbo
                sizes, sodium hypochlorite 12–15%, algaecide, pH balancers and dechlorinators. Dubai is three to five
                business days by road and Kuwait four to six, and every load carries a Certificate of Analysis, a GHS
                Safety Data Sheet in English and Arabic and a GCC Certificate of Origin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2 text-lg px-8" onClick={() => trackSelectContent('cta_button', 'pool_gcc_quote')}>
                  <Link to={`/contact?product=${encodeURIComponent('Pool Chlorine (GCC)')}`} rel="nofollow">
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
                <Waves className="w-6 h-6 text-primary" /> Which pool chlorine and pool chemicals do you supply to the GCC?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
                The full range is on the{' '}
                <Link to="/products/swimming-pool" className="text-primary hover:underline">swimming pool chemicals</Link>{' '}
                category page. Specifications and dose rates restate each product page.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Product</th>
                      <th className="px-4 py-2 font-semibold">Specification and dose</th>
                      <th className="px-4 py-2 font-semibold">Packs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCTS.map((p) => (
                      <tr key={p.link} className="border-t border-border align-top">
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
                Liquid chlorine grades, handling and bulk supply:{' '}
                <Link to="/chemical-supplier/sodium-hypochlorite-oman" className="text-primary hover:underline">sodium hypochlorite supplier Oman</Link>.
                Dose for any pool volume:{' '}
                <Link to="/tools/dosing-calculator" className="text-primary hover:underline">chlorine and dechlorination calculator</Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Sun className="w-6 h-6 text-primary" /> Which chlorine for which pool in the Gulf?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6 speakable">
                Gulf pools lose chlorine faster than the product labels assume: water temperatures above 30°C through
                the summer, strong UV for most of the year and dust loading after shamal winds all raise the dose. The
                usual answer is a stabilised product for daily sanitising and an unstabilised one for shock, so
                cyanuric acid does not climb past the point where chlorine stops working.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Pool</th>
                      <th className="px-4 py-2 font-semibold">Chlorine</th>
                      <th className="px-4 py-2 font-semibold">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHOICE.map((c) => (
                      <tr key={c.pool} className="border-t border-border align-top">
                        <td className="px-4 py-2 font-medium text-foreground">{c.pool}</td>
                        <td className="px-4 py-2 text-muted-foreground">{c.chlorine}</td>
                        <td className="px-4 py-2 text-muted-foreground">{c.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Water balance, testing and the Oman season by month:{' '}
                <Link to="/blog/swimming-pool-chemicals-oman-muscat" className="text-primary hover:underline">
                  swimming pool chemicals in Oman, the guide for hotels, villas and facilities
                </Link>.
              </p>
            </div>
          </div>
        </section>

        <section className="py-14 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-6 h-6 text-primary" /> Where do you deliver pool chlorine in the GCC?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
                Every market is served from the Muscat warehouse on scheduled weekly departures, with pallets, drums and
                IBCs consolidated per destination. Hotel groups and pool contractors can hold a standing monthly order.
              </p>
              <div className="overflow-x-auto rounded-lg border border-border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Market</th>
                      <th className="px-4 py-2 font-semibold">Delivery points</th>
                      <th className="px-4 py-2 font-semibold">Lead time from Muscat</th>
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
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileCheck2 className="w-6 h-6 text-primary" /> What documents and transport rules apply?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  A batch Certificate of Analysis stating available chlorine, a GHS Safety Data Sheet in English and
                  Arabic, a Technical Data Sheet, a Certificate of Origin attested by the Oman Chamber of Commerce and an
                  HS-coded commercial invoice. Dry calcium hypochlorite (UN 1748) and TCCA (UN 2468) are Class 5.1
                  oxidisers and sodium hypochlorite solution (UN 1791) is Class 8, so loads are segregated from acids,
                  organics and fuels and kept dry and shaded in transit and in your store.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Who buys pool chlorine from us in the GCC?</h2>
                <ul className="space-y-2 text-muted-foreground list-disc pl-5">
                  <li>Hotel and resort groups and their facilities-management contractors</li>
                  <li>Pool construction and maintenance companies</li>
                  <li>Water parks, sports clubs, schools and municipal pools</li>
                  <li>Residential compounds and villa communities</li>
                  <li>Pool-chemical distributors and retailers restocking by the pallet</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 border-t" id="bulk-supply">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Do you publish a pool chlorine price list?</h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6 speakable">
                No fixed list: calcium hypochlorite and hypochlorite prices move with raw-material markets and depend on
                the pack size and monthly volume. A quotation per kilogram, per bucket or per IBC follows within 24 hours
                of an enquiry that names the product, the monthly volume, the pack format and the delivery city. Pallet
                and container prices are given to hotel groups, pool contractors and distributors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'pool_gcc_bulk_whatsapp')}>
                  <a href={bulkWhatsApp} target="_blank" rel="noopener noreferrer nofollow">
                    <MessageCircle className="w-5 h-5" /> WhatsApp an enquiry
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'pool_gcc_bulk_quote')}>
                  <Link to={`/contact?product=${encodeURIComponent('Pool Chlorine bulk (GCC)')}`} rel="nofollow">
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
              <h2 className="text-2xl font-bold text-foreground mb-3">Related supply pages</h2>
              <p className="text-muted-foreground leading-relaxed">
                Coagulants, antiscalants and the municipal chlorine range for plants are on the{' '}
                <Link to="/chemical-supplier/water-treatment-chemicals-gcc" className="text-primary hover:underline">water treatment chemicals supplier for the GCC</Link>{' '}
                page. Lead times and documents for every market are on{' '}
                <Link to="/chemical-suppliers-middle-east" className="text-primary hover:underline">chemical suppliers Middle East</Link>; supply
                inside Oman is on{' '}
                <Link to="/chemical-suppliers-oman" className="text-primary hover:underline">chemical suppliers Oman</Link>.
              </p>
            </div>
          </div>
        </section>

        <FAQSection faqs={FAQS} heading="Pool chlorine in the GCC — frequently asked questions" />
      </main>

      <Footer />
    </div>
  );
};

export default PoolChlorineGcc;
