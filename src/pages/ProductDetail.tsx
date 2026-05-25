import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Phone, Mail, Beaker, Info, MessageCircle, Truck, Shield, Globe } from 'lucide-react';
import { loadProductsByCategory } from '@/data/productLoader';
import { ProductStructuredData, BreadcrumbStructuredData, FAQStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SEO } from '@/components/SEO';
import { trackProductView, trackSelectContent, trackContactClick } from '@/components/GoogleAnalytics';
import { ProductCard } from '@/components/products/ProductCard';
import { ChemistryHero } from '@/components/products/ChemistryHero';
import { ProductDetailTabs } from '@/components/products/ProductDetailTabs';

const ProductDetail = () => {
  const { category, productSlug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  // Track loader settlement separately from the array — an unknown category
  // (e.g. /products/acids/...) resolves to [], which is indistinguishable from
  // "still fetching" without this flag. Without it, ProductDetail would stick on
  // the "Loading…" branch forever and Google's crawler would see a Soft 404.
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setProductsLoading(false);
      return;
    }
    let cancelled = false;
    setProductsLoading(true);
    loadProductsByCategory(category)
      .then((data) => {
        if (cancelled) return;
        setCategoryProducts(data);
        setProductsLoading(false);
      })
      .catch((err) => {
        console.error('[ProductDetail] Failed to load category products:', err);
        if (cancelled) return;
        setCategoryProducts([]);
        setProductsLoading(false);
      });
    return () => { cancelled = true; };
  }, [category]);

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

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

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
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('products.backToProducts', { defaultValue: 'Back to Products' })}
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

  // Generate SEO-optimized description — includes GCC cities.
  // Truncate at ~155 chars (Google SERP limit) at a word boundary; longDescription
  // is the full article body and was leaking 1.6KB+ into the meta description.
  const rawDescription = product.details?.longDescription ||
    `${product.title} supplier in Oman & GCC. ${product.description} High-quality ${product.title.toLowerCase()} for water treatment, industrial, and commercial applications. Exporting to Dubai, Riyadh, Doha, Kuwait, Bahrain. Serving Muscat, Sohar, Salalah. Contact Global Chemicals LLC for pricing and technical specifications.`;
  const seoDescription = rawDescription.length <= 155
    ? rawDescription
    : rawDescription.slice(0, 154).replace(/\s+\S*$/, '') + '…';

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
        description={seoDescription}
        keywords={keywords}
        ogTitle={`${product.title} - ${catLabel} Chemical Supplier | Oman & GCC | Global Chemicals LLC`}
        ogDescription={seoDescription}
        ogUrl={`https://gcoman.com/products/${category}/${productSlug}`}
        canonical={`https://gcoman.com/products/${category}/${productSlug}`}
      />
      
      <ProductStructuredData
        product={product}
        url={`https://gcoman.com/products/${category}/${productSlug}`}
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
      <WhatsAppButton />

      <main id="main-content">
        <section className="pt-32 pb-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary transition-colors">{t('nav.products')}</Link>
              <span>/</span>
              <Link to={`/products/${category}`} className="hover:text-primary transition-colors capitalize">
                {category?.replace(/-/g, ' ')}
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium line-clamp-1">{translatedTitle}</span>
            </nav>
          </div>
        </section>

        {/* Product Header */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/products')}
                className="mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('products.backToProducts', { defaultValue: 'Back to Products' })}
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
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
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

              {/* Product Overview — first thing buyers read after the hero. */}
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" />
                  {t('products.productOverview', { defaultValue: 'Product Overview' })}
                </h2>
                {/* When the hero shows the description inline, skip the duplicate;
                    legacy products still show it here. */}
                {!product.details?.molecule && (
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
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
                  <div className="space-y-3">
                    {translatedTechnicalSpecs.map((spec, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{spec}</span>
                      </div>
                    ))}
                  </div>
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

              {/* CTA Section */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{t('products.needMoreInfo', { defaultValue: 'Request a Quote' })}</h2>
                  <p className="text-muted-foreground mb-6">
                    Get pricing, availability, and technical specifications for <strong>{translatedTitle}</strong>. Our team responds within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'get_quote')}>
                      <Link to={`/contact?product=${encodeURIComponent(product.title)}`}>
                        <Mail className="w-4 h-4" />
                        Request a Quote
                      </Link>
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

              {/* Related Products */}
              {(() => {
                const relatedProducts = categoryProducts
                  .filter(p => p.category === product.category && p.id !== product.id)
                  .slice(0, 3);
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
