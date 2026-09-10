import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LocalizedLink } from '@/components/LocalizedLink';
import { GradientCTA } from '@/components/ui/gradient-cta';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Phone, Mail, Beaker, Info, MessageCircle, Truck, Shield, Globe } from 'lucide-react';
import { hydrateProduct } from '@/data/productLoader';
import { ProductStructuredData, BreadcrumbStructuredData, FAQStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SEO } from '@/components/SEO';
import { trackProductView, trackSelectContent, trackContactClick } from '@/components/GoogleAnalytics';
import { ProductCard } from '@/components/products/ProductCard';
import { ChemistryHero } from '@/components/products/ChemistryHero';
import { ProductDetailTabs } from '@/components/products/ProductDetailTabs';

interface ProductDetailProps {
  /** Category slug, supplied by the per-category route entry (see src/pages/productDetail/) —
   * not read from useParams so each category's JSON stays in its own route chunk. */
  category: string;
  /** Raw (unhydrated) product JSON for this category, statically imported by the route entry. */
  rawCategoryProducts: any[];
}

const ProductDetail = ({ category, rawCategoryProducts }: ProductDetailProps) => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Synchronous: the route entry statically imported only this category's JSON,
  // so data is available on the first render with no async gap. This guarantees
  // the <SEO> component mounts with the correct per-product title immediately —
  // no window where the prerenderer or Lovable's bot renderer can snapshot a
  // loading state that has no Helmet and therefore shows the index.html fallback title.
  const categoryProducts = rawCategoryProducts.map(hydrateProduct);

  // Find product by slug
  const product = categoryProducts.find(p =>
    p.id === productSlug && p.category === category
  );

  // Track product view
  useEffect(() => {
    if (product) {
      trackProductView(product.id, product.title, product.category);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        {/* noIndex prevents unknown product URLs from being indexed as Soft 404s.
            Canonical points to /products so crawlers follow it to a valid page. */}
        <SEO
          noIndex={true}
          title="Product Not Found | Global Chemicals LLC"
          description="The requested product page could not be found. Browse our full chemical product catalogue."
          canonical="https://gcoman.com/products"
        />
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('products.productNotFound', { defaultValue: 'Product Not Found' })}</h2>
          <p className="text-muted-foreground mb-8">{t('products.productNotFoundDesc', { defaultValue: "The product you're looking for doesn't exist." })}</p>
          <Button asChild>
            <LocalizedLink to="/products">
              <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2 rtl:rotate-180" />
              {t('products.backToProducts', { defaultValue: 'Back to Products' })}
            </LocalizedLink>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get translated product data if available
  const translatedTitle = i18n.language === 'ar' 
    ? t(`products.${product.id}.title`, { defaultValue: product.title })
    : product.title;
  
  const translatedDescription = i18n.language === 'ar'
    ? t(`products.${product.id}.description`, { defaultValue: product.description })
    : product.description;

  const translatedLongDescription = i18n.language === 'ar'
    ? t(`products.${product.id}.longDescription`, { defaultValue: product.details?.longDescription || product.details?.fullDescription || '' })
    : (product.details?.longDescription || product.details?.fullDescription || '');

  const translatedApplications = i18n.language === 'ar'
    ? (t(`products.${product.id}.applications`, { returnObjects: true, defaultValue: product.details?.applications }) as string[])
    : product.details?.applications;

  const translatedTechnicalSpecs = i18n.language === 'ar'
    ? (t(`products.${product.id}.technicalSpecs`, { returnObjects: true, defaultValue: product.details?.technicalSpecs }) as string[])
    : product.details?.technicalSpecs;

  const translatedAlternativeNames = i18n.language === 'ar'
    ? (t(`products.${product.id}.alternativeNames`, { returnObjects: true, defaultValue: product.details?.alternativeNames }) as string[])
    : product.details?.alternativeNames;

  const Icon = product.icon;

  // Arabic SEO meta — only when a real translation exists in products-ar.json
  // (261 of ~768 products). Passing arTitle/arDescription to <SEO> makes the
  // /ar twin indexable with a localized meta layer and emits hreflang pairs on
  // both language versions; products without a translation stay noindex on /ar.
  // getFixedT('ar') so the English render also knows its Arabic twin exists.
  const tAr = i18n.getFixedT('ar');
  const hasArabicSeo =
    i18n.exists(`products.${product.id}.title`, { lng: 'ar' }) &&
    i18n.exists(`products.${product.id}.description`, { lng: 'ar' });
  const arSeoTitle = hasArabicSeo
    ? `${tAr(`products.${product.id}.title`)} | مورّد كيماويات في عُمان والخليج`
    : undefined;
  const arRawDescription = hasArabicSeo ? String(tAr(`products.${product.id}.description`)) : '';
  const arSeoDescription = hasArabicSeo
    ? (arRawDescription.length <= 155
        ? arRawDescription
        : arRawDescription.slice(0, 154).replace(/\s+\S*$/, '') + '…')
    : undefined;

  // SERP snippet.
  // details.seoDescription is a hand-written snippet and always wins (16 products).
  // For the rest we COMPOSE a complete sentence from structured fields instead of
  // truncating longDescription at 154 chars. That truncation shipped an article
  // opening cut mid-thought as the meta description on 259 of 275 products, and
  // GSC (3 months to 2026-09-05) shows exactly the CTR damage you would expect
  // from it: a family of page-1 rankings with zero clicks — tris-base-lab 342
  // impressions at position 12.4 → 1 click, acetic-acid-lab 306 → 0,
  // "chemical supplier in muscat" position 3.4 → 0 clicks. Position was never the
  // problem on those; the snippet was.
  // Composed form answers the three things a B2B buyer scans for — is it the right
  // substance (CAS), does it do my job (application), can I actually get it
  // (stock + export + CTA) — and always terminates cleanly under the 155-char cap.
  const buildSnippet = () => {
    const LIMIT = 155;
    const TAIL = 'Ex-stock Muscat, export GCC. Request a quote.';
    const cas = product.details?.casNumber;
    const withCas = `${product.title} (CAS ${cas}) supplier in Oman & GCC.`;
    const plain = `${product.title} supplier in Oman & GCC.`;
    // Drop the CAS rather than the call to action when the title is long.
    const lead = cas && withCas.length + 1 + TAIL.length <= LIMIT ? withCas : plain;

    const budget = LIMIT - lead.length - 1 - TAIL.length;
    const chosen: string[] = [];
    for (const raw of product.details?.applications ?? []) {
      const app = String(raw).trim().replace(/\.+$/, '');
      if (!app || chosen.length >= 2) break;
      // Lower-case follow-on items so the joined clause reads as one sentence
      // ("Pharmaceutical ointments, cosmetics and skincare.") rather than a
      // run of capitalised fragments.
      const next = chosen.length === 0 ? app : app.charAt(0).toLowerCase() + app.slice(1);
      if ([...chosen, next].join(', ').length + 2 > budget) break;
      chosen.push(next);
    }

    const composed = [lead, chosen.length ? `${chosen.join(', ')}.` : '', TAIL]
      .filter(Boolean)
      .join(' ');
    return composed.length <= LIMIT ? composed : `${lead} ${TAIL}`;
  };
  const seoDescription = product.details?.seoDescription ?? buildSnippet();

  // Generate keywords — auto-adds UAE/Saudi/Qatar variants for every product
  const keywords = [
    product.title,
    `${product.title} Oman`,
    `${product.title} UAE`,
    `${product.title} Dubai`,
    `${product.title} Saudi Arabia`,
    `${product.title} Qatar`,
    `${product.title} GCC`,
    `${product.title} Middle East`,
    `${product.title} supplier`,
    `buy ${product.title} Oman`,
    `buy ${product.title} UAE`,
    ...(product.details?.alternativeNames || []),
    ...(product.details?.seoKeywords || []),
    'chemical supplier Oman',
    'chemical supplier UAE',
    'chemical exporter Oman GCC',
    category === 'water-treatment' ? 'water treatment chemicals Oman UAE' : '',
    category === 'oilfield' ? 'oilfield chemicals Oman GCC' : '',
    category === 'lab-chemicals' ? 'laboratory chemicals Oman Middle East' : '',
  ].filter(Boolean).join(', ');

  // WhatsApp message pre-filled with product name
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${product.title}. Please send me pricing and availability.`);
  const whatsappUrl = `https://wa.me/96893754388?text=${whatsappMessage}`;

  // Short category qualifier appended to the SEO title so that cross-category
  // products (e.g. EDTA Powder appearing in oilfield, soap-detergent, and
  // water-treatment) each get a unique <title> tag instead of colliding on
  // "EDTA Powder Supplier | Oman & GCC | Global Chemicals LLC".
  const CATEGORY_LABEL: Record<string, string> = {
    'water-treatment': 'Water Treatment',
    'oilfield': 'Oilfield',
    'soap-detergent': 'Soap & Detergent',
    'ro-chemicals': 'RO Plant',
    'cooling-water': 'Cooling Tower',
    'tank-cleaners': 'Tank Cleaning',
    'glycols': 'Glycol',
    'ethanolamines': 'Ethanolamine',
    'corrosion-inhibitor': 'Corrosion Inhibitor',
    'calcium-carbonate': 'Industrial Filler',
    'swimming-pool': 'Pool Treatment',
    'lubricants': 'Lubricant',
    'lab-chemicals': 'Laboratory',
    'lab-equipment': 'Lab Equipment',
    'food-beverage': 'Food Grade',
    'construction': 'Construction',
    'inorganic': 'Inorganic',
    'additives': 'Industrial Additive',
    'agro': 'Agricultural',
    'alcohols': 'Industrial Alcohol',
    'chlorinated': 'Chlorinated',
    'solvents': 'Industrial Solvent',
  };
  const catLabel = CATEGORY_LABEL[category || ''] ?? (category || '').replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.title} | ${catLabel} Supplier | Oman & GCC | Global Chemicals LLC`}
        seoTitle={product.details?.seoTitle}
        description={seoDescription}
        arTitle={arSeoTitle}
        arDescription={arSeoDescription}
        keywords={keywords}
        ogTitle={`${product.title} - ${catLabel} Chemical Supplier | Oman & GCC | Global Chemicals LLC`}
        ogDescription={seoDescription}
        ogUrl={`https://gcoman.com/products/${category}/${productSlug}`}
        ogImage={product.image}
        canonical={product.details?.canonicalOverride || `https://gcoman.com/products/${category}/${productSlug}`}
      />
      
      <ProductStructuredData
        product={product}
        url={product.details?.canonicalOverride || `https://gcoman.com/products/${category}/${productSlug}`}
      />
      {product.details?.faqs && product.details.faqs.length > 0 && (
        <FAQStructuredData faqs={product.details.faqs} />
      )}
      <SpeakableStructuredData
        url={`https://gcoman.com/products/${category}/${productSlug}`}
        cssSelector={["h1", "h2", ".product-description", ".speakable"]}
      />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://gcoman.com' },
        { name: 'Products', url: 'https://gcoman.com/products' },
        { name: category ? category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Category', url: `https://gcoman.com/products/${category}` },
        { name: product.title, url: `https://gcoman.com/products/${category}/${productSlug}` }
      ]} />
      
      <Navigation />

      <main id="main-content">
        <section className="pt-32 pb-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <nav className="flex flex-nowrap items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
              <LocalizedLink to="/" className="hover:text-primary transition-colors">{t('nav.home')}</LocalizedLink>
              <span>/</span>
              <LocalizedLink to="/products" className="hover:text-primary transition-colors">{t('nav.products')}</LocalizedLink>
              <span>/</span>
              <LocalizedLink to={`/products/${category}`} className="hover:text-primary transition-colors capitalize whitespace-nowrap">
                {category?.replace(/-/g, ' ')}
              </LocalizedLink>
              <span>/</span>
              <span className="text-foreground font-medium truncate max-w-[45vw] sm:max-w-none">{translatedTitle}</span>
            </nav>
          </div>
        </section>

        {/* Product Header */}
        <section className="pt-6 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Button asChild variant="ghost" className="mb-6">
                <LocalizedLink to="/products">
                  <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2 rtl:rotate-180" />
                  {t('products.backToProducts', { defaultValue: 'Back to Products' })}
                </LocalizedLink>
              </Button>

              {/* Hero: title block + 3D molecule side-by-side on desktop, stacked on mobile.
                  Products without a curated molecule keep the original icon header. */}
              {product.details?.molecule && product.details?.formula ? (
                <div className="grid gap-6 mb-10 md:grid-cols-[1fr_minmax(0,1.05fr)] md:items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-sm font-mono px-3 py-1">
                        {product.details.formula}
                      </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                      {translatedTitle}
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed product-description">
                      {translatedDescription}
                    </p>
                  </div>
                  <ChemistryHero
                    formula={product.details.formula}
                    molecule={product.details.molecule}
                    productTitle={translatedTitle}
                  />
                </div>
              ) : (
                <div className="flex items-start gap-6 mb-10">
                  <div className="flex-shrink-0 p-4 rounded-xl bg-primary/10">
                    <Icon className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                      {translatedTitle}
                    </h1>
                    {product.details?.formula && (
                      <Badge variant="outline" className="text-base px-4 py-1">
                        {product.details.formula}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Identity + ask, above the fold.
                  CAS number is the first thing a chemical buyer looks for and
                  it used to sit as one inline line at the bottom of the
                  Overview card; the quote CTA sat six cards further down, so a
                  visitor arriving from search had to scroll past Overview,
                  Applications, Specs and FAQs before finding a way to ask for
                  a price. Both are surfaced here instead. */}
              <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  {product.details?.casNumber && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1.5 text-xs font-semibold">
                      <span className="text-muted-foreground">CAS</span>
                      <span className="font-mono text-foreground select-all">{product.details.casNumber}</span>
                    </span>
                  )}
                  {product.details?.formula && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1.5 text-xs font-semibold">
                      <span className="text-muted-foreground">Formula</span>
                      <span className="font-mono text-foreground select-all">{product.details.formula}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    Same-day Muscat · next-day Sohar, Salalah, Duqm
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    SDS + CoA with every batch
                  </span>
                </div>
                <GradientCTA
                  to={`/contact?product=${encodeURIComponent(product.title)}&ref=${encodeURIComponent(`${category}/${productSlug}`)}`}
                  onClick={() => trackSelectContent('cta_button', 'get_quote_above_fold')}
                  className="flex-shrink-0 self-start sm:self-center"
                >
                  Request a Quote
                </GradientCTA>
              </div>

              {/* Product Overview — first thing buyers read after the hero. */}
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" />
                  {t('products.productOverview', { defaultValue: 'Product Overview' })}
                </h2>
                {/* When the hero shows the description inline, skip the duplicate;
                    legacy products still show it here. */}
                {!product.details?.molecule && (
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6 product-description">
                    {translatedDescription}
                  </p>
                )}

                {translatedLongDescription && (
                  <>
                    <h3 className="text-xl font-semibold mb-3 mt-2">{t('products.detailedDescription', { defaultValue: 'Detailed Description' })}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {translatedLongDescription}
                    </p>
                  </>
                )}

                {translatedAlternativeNames && Array.isArray(translatedAlternativeNames) && translatedAlternativeNames.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">{t('products.alsoKnownAs', { defaultValue: 'Also Known As:' })}</h3>
                    <p className="text-sm text-muted-foreground">
                      {translatedAlternativeNames.join(', ')}
                    </p>
                  </div>
                )}

                {product.details?.casNumber && (
                  <div className="mt-4 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{t('products.casNumber', { defaultValue: 'CAS Number:' })}</span>
                    <span className="text-sm text-muted-foreground font-mono">{product.details.casNumber}</span>
                  </div>
                )}
              </Card>

              {translatedApplications && Array.isArray(translatedApplications) && translatedApplications.length > 0 && (
                <Card className="p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">{t('products.applicationsAndUses', { defaultValue: 'Applications & Uses' })}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {translatedApplications.map((app, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{app}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {translatedTechnicalSpecs && Array.isArray(translatedTechnicalSpecs) && translatedTechnicalSpecs.length > 0 && (
                <Card className="p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">{t('products.technicalSpecs')}</h2>
                  {/* Specs are stored as "Purity: 99%" strings. Rendering them as
                      ✓ bullets (identical to the Applications list above) gave no
                      key/value alignment and nothing to scan or copy into a spec
                      sheet — split on the first colon into a real definition
                      table, and fall back to a plain row when there is no colon. */}
                  <dl className="divide-y divide-border">
                    {translatedTechnicalSpecs.map((spec, index) => {
                      const splitAt = spec.indexOf(':');
                      const hasPair = splitAt > 0 && splitAt < spec.length - 1;
                      const term = hasPair ? spec.slice(0, splitAt).trim() : '';
                      const value = hasPair ? spec.slice(splitAt + 1).trim() : spec;
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4"
                        >
                          {hasPair && (
                            <dt className="text-sm font-semibold text-foreground">{term}</dt>
                          )}
                          <dd
                            className={`text-sm text-muted-foreground tabular-nums select-all ${
                              hasPair ? '' : 'sm:col-span-2'
                            }`}
                          >
                            {value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </Card>
              )}

              {product.details?.faqs && product.details.faqs.length > 0 && (
                <Card className="p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Frequently Asked Questions — {translatedTitle}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {product.details.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left font-semibold text-base">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              )}

              {/* Compact tabbed strip — Safety · Documents.
                  Replaces the cards we had before. */}
              {product.details?.hazard && (
                <ProductDetailTabs
                  productTitle={translatedTitle}
                  hazard={product.details?.hazard}
                  documents={product.details?.documents}
                />
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-medium border border-green-500/20">
                  <Shield className="w-4 h-4" /> ISO 9001 Certified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-medium border border-blue-500/20">
                  <Truck className="w-4 h-4" /> Fast Delivery
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  <Globe className="w-4 h-4" /> Oman & GCC Export
                </span>
              </div>

              {/* Buying guide link.
                  Opt-in per product via details.guideUrl / details.guideLabel.
                  Exists because the geo landing pages (e.g.
                  /chemical-supplier/caustic-soda-oman) target the high-intent
                  "<product> supplier oman" queries but were almost orphaned —
                  the caustic-soda hub had exactly ONE inbound link in the whole
                  site, from ChemicalSuppliersOman, and none from the four
                  caustic-soda product pages themselves. A hub with no internal
                  links behind it cannot outrank competitors on the query it was
                  built for. This gives every product a way to point at its guide. */}
              {product.details?.guideUrl && (
                <Card className="p-6 mb-8 border-primary/20 bg-primary/[0.03]">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-muted-foreground">
                        {t('products.guideIntro', { defaultValue: 'Comparing grades, pack sizes and delivery options?' })}{' '}
                        <span className="text-foreground font-medium">
                          {product.details.guideLabel || 'Read the full buying guide'}
                        </span>
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
                      <LocalizedLink to={product.details.guideUrl}>
                        {t('products.readGuide', { defaultValue: 'Read the guide' })}
                        <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
                      </LocalizedLink>
                    </Button>
                  </div>
                </Card>
              )}

              {/* CTA Section */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{t('products.needMoreInfo', { defaultValue: 'Request a Quote' })}</h2>
                  <p className="text-muted-foreground mb-6">
                    Get pricing, availability, and technical specifications for <strong>{translatedTitle}</strong>. Our team responds within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'get_quote')}>
                      <LocalizedLink to={`/contact?product=${encodeURIComponent(product.title)}&ref=${encodeURIComponent(`${category}/${productSlug}`)}`}>
                        <Mail className="w-4 h-4" />
                        Request a Quote
                      </LocalizedLink>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="gap-2 border-green-500/50 text-green-700 dark:text-green-400 hover:bg-green-500/10" onClick={() => trackContactClick('whatsapp')}>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Inquiry
                      </a>
                    </Button>
                    <Button asChild variant="ghost" size="lg" className="gap-2" onClick={() => trackContactClick('phone')}>
                      <a href="tel:+96893754388">
                        <Phone className="w-4 h-4" />
                        Call +968 93754388
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Related Products.
                  Selection ROTATES by this product's index instead of taking the
                  first N of the category. `.slice(0, 3)` meant all 50 oilfield
                  pages linked to the same 3 products, so 201 of 275 products
                  received zero inbound links from a sibling page and lived on the
                  single link from their category index. GSC (2026-09-08) showed
                  89% of the "Discovered – currently not indexed" products in that
                  zero-inbound set vs 70% of indexed ones. A rotating window gives
                  every product in a category exactly RELATED_COUNT inbound links
                  (verified: zero-inbound 201 → 3, and those 3 are the
                  single-product categories that have no sibling to link from).
                  Stays inside categoryProducts on purpose — the route entry only
                  statically imports this category's JSON, so reaching across
                  categories here would pull every product chunk into the bundle. */}
              {(() => {
                const RELATED_COUNT = 6;
                const siblings = categoryProducts
                  .filter(p => p.category === product.category && p.id !== product.id)
                  // Never link to a SKU that canonicalises elsewhere: the page
                  // renders, so nothing 404s, but it tells Google the real page
                  // is somewhere else — so the click and the link equity both
                  // land in a dead end. A 2026-09-10 audit of the built output
                  // found 33 such links, mostly from this rotation and the
                  // category grid pointing at the three caustic-soda twins.
                  .filter(p => !p.details?.canonicalOverride);
                const selfIndex = Math.max(0, categoryProducts.findIndex(p => p.id === product.id));
                const relatedProducts = siblings.length === 0 ? [] : Array.from(
                  { length: Math.min(RELATED_COUNT, siblings.length) },
                  (_, k) => siblings[(selfIndex + k) % siblings.length],
                );
                if (relatedProducts.length === 0) return null;
                return (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">{t('products.relatedProducts', { defaultValue: 'Related Products' })}</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                      {relatedProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
