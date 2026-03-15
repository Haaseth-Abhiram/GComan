import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Phone, Mail, Beaker, Info } from 'lucide-react';
import { loadProductsByCategory, hydrateProduct } from '@/data/productLoader';
import { ProductStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { SEO } from '@/components/SEO';
import { trackProductView, trackSelectContent, trackContactClick } from '@/components/GoogleAnalytics';
import { ProductCard } from '@/components/products/ProductCard';

const ProductDetail = () => {
  const { category, productSlug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);

  useEffect(() => {
    if (category) {
      loadProductsByCategory(category).then(setCategoryProducts);
    }
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

  if (!product && categoryProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
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

  // Generate SEO-optimized description
  const seoDescription = product.details?.longDescription || 
    `${product.title} supplier in Oman. ${product.description} High-quality ${product.title.toLowerCase()} for water treatment, industrial, and commercial applications. Serving Muscat, Sohar, Salalah, Duqm. Contact Global Chemicals LLC for pricing and technical specifications.`;

  // Generate keywords
  const keywords = [
    product.title,
    `${product.title} Oman`,
    `${product.title} Muscat`,
    `${product.title} supplier`,
    `buy ${product.title} Oman`,
    ...(product.details?.alternativeNames || []),
    ...(product.details?.seoKeywords || []),
    'chemical supplier Oman',
    category === 'water-treatment' ? 'water treatment chemicals Oman' : '',
  ].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${product.title} Supplier Oman | Buy ${product.title} | Global Chemicals`}
        description={seoDescription}
        keywords={keywords}
        ogTitle={`${product.title} - Chemical Supplier Oman | Global Chemicals LLC`}
        ogDescription={seoDescription}
        ogUrl={`https://gcoman.com/products/${category}/${productSlug}`}
        canonical={`https://gcoman.com/products/${category}/${productSlug}`}
      />
      
      <ProductStructuredData product={product} />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://gcoman.com' },
        { name: 'Products', url: 'https://gcoman.com/products' },
        { name: product.title, url: `https://gcoman.com/products/${category}/${productSlug}` }
      ]} />
      
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
        {/* Breadcrumb */}
        <section className="pt-32 pb-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary transition-colors">{t('nav.products')}</Link>
              <span>/</span>
              <span className="text-foreground font-medium">{translatedTitle}</span>
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

              <div className="flex items-start gap-6 mb-8">
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

              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" />
                  {t('products.productOverview', { defaultValue: 'Product Overview' })}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {translatedDescription}
                </p>
                
                {translatedLongDescription && (
                  <>
                    <h3 className="text-xl font-semibold mb-3 mt-6">{t('products.detailedDescription', { defaultValue: 'Detailed Description' })}</h3>
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

              {/* CTA Section */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">{t('products.needMoreInfo', { defaultValue: 'Need More Information?' })}</h2>
                  <p className="text-muted-foreground mb-6">
                    {t('products.needMoreInfoDesc', { defaultValue: 'Our team is ready to help you with technical specifications, pricing, and delivery options.' })}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2" onClick={() => trackSelectContent('cta_button', 'get_quote')}>
                      <Link to={`/contact?product=${encodeURIComponent(product.title)}`}>
                        <Mail className="w-4 h-4" />
                        {t('common.contactUs')}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2" onClick={() => trackContactClick('phone')}>
                      <a href="tel:+96893754388">
                        <Phone className="w-4 h-4" />
                        {t('products.callPhone', { defaultValue: 'Call +968 93754388' })}
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
