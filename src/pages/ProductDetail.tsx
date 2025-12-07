import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Phone, Mail, Beaker, Info } from 'lucide-react';
import { products } from '@/data/products';
import { ProductStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';
import { SEO } from '@/components/SEO';

const ProductDetail = () => {
  const { category, productSlug } = useParams();
  const navigate = useNavigate();

  // Find product by slug
  const product = products.find(p => 
    p.id === productSlug && p.category === category
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

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
        ogUrl={`https://www.gcoman.com/products/${category}/${productSlug}`}
        canonical={`https://www.gcoman.com/products/${category}/${productSlug}`}
      />
      
      <ProductStructuredData product={product} />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://www.gcoman.com' },
        { name: 'Products', url: 'https://www.gcoman.com/products' },
        { name: product.title, url: `https://www.gcoman.com/products/${category}/${productSlug}` }
      ]} />
      
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
        {/* Breadcrumb */}
        <section className="pt-32 pb-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <span>/</span>
              <span className="text-foreground font-medium">{product.title}</span>
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
                Back to Products
              </Button>

              <div className="flex items-start gap-6 mb-8">
                <div className="flex-shrink-0 p-4 rounded-xl bg-primary/10">
                  <Icon className="w-12 h-12 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                    {product.title}
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
                  Product Overview
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>
                
                {product.details?.fullDescription && (
                  <>
                    <h3 className="text-xl font-semibold mb-3 mt-6">Detailed Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.details.fullDescription}
                    </p>
                  </>
                )}

                {product.details?.alternativeNames && product.details.alternativeNames.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h3 className="text-sm font-semibold mb-2">Also Known As:</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.details.alternativeNames.join(', ')}
                    </p>
                  </div>
                )}

                {product.details?.casNumber && (
                  <div className="mt-4 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">CAS Number:</span>
                    <span className="text-sm text-muted-foreground font-mono">{product.details.casNumber}</span>
                  </div>
                )}
              </Card>

              {product.details?.applications && product.details.applications.length > 0 && (
                <Card className="p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">Applications & Uses</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {product.details.applications.map((app, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{app}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {product.details?.technicalSpecs && product.details.technicalSpecs.length > 0 && (
                <Card className="p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>
                  <div className="space-y-3">
                    {product.details.technicalSpecs.map((spec, index) => (
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
                  <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
                  <p className="text-muted-foreground mb-6">
                    Our team is ready to help you with technical specifications, pricing, and delivery options.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="gap-2">
                      <Link to="/contact">
                        <Mail className="w-4 h-4" />
                        Contact Us
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="gap-2">
                      <a href="tel:+96893754388">
                        <Phone className="w-4 h-4" />
                        Call +968 93754388
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
