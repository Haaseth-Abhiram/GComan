import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loadProductsByCategory, loadAllProducts } from '@/data/productLoader';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube, Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound, Flame, Wind, Wine, ChevronRight, Shield, SprayCan, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'react-router-dom';
import { AISearchDialog } from '@/components/AISearchDialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductCard } from '@/components/products/ProductCard';
import { SEO } from '@/components/SEO';
import { OrganizationStructuredData, LocalBusinessStructuredData, BreadcrumbStructuredData, FAQStructuredData } from '@/components/StructuredData';

// FAQ structured data for products page — targets high-intent procurement queries
const productsFAQs = [
  {
    question: "What chemical products does Global Chemicals LLC supply in Oman?",
    answer: "Global Chemicals LLC supplies 1,000+ industrial and specialty chemicals in Oman including water treatment chemicals (PAC, caustic soda, calcium hypochlorite, antiscalants), industrial lubricants (Shell, Mobil, Castrol), laboratory chemicals (AR grade, HPLC solvents), oilfield chemicals (corrosion inhibitors, demulsifiers, H2S scavengers), swimming pool chemicals, food-grade chemicals, RO chemicals, and construction chemicals."
  },
  {
    question: "Can I buy chemicals in bulk from Global Chemicals LLC in Muscat?",
    answer: "Yes, Global Chemicals LLC offers bulk chemical supply in Muscat and across Oman. We supply in packaging from 1-litre bottles to 25-litre jerricans, 200-litre drums, and 1,000-litre IBC containers. Volume pricing is available for regular bulk buyers. Contact our sales team at info@gcoman.com or +968-93754388 for bulk quotations."
  },
  {
    question: "Are Global Chemicals LLC products supplied with Safety Data Sheets (SDS)?",
    answer: "Yes. All chemical products supplied by Global Chemicals LLC come with current GHS-compliant Safety Data Sheets (SDS/MSDS) in English. Arabic SDS is available for most products. We also provide Certificates of Analysis (CoA) and Technical Data Sheets (TDS) on request for every batch supplied."
  },
  {
    question: "Does Global Chemicals LLC supply Shell, Mobil, and Castrol lubricants in Oman?",
    answer: "Yes, Global Chemicals LLC is an authorised distributor of Shell, Mobil, and Castrol lubricants in Oman. We stock Shell Rimula, Shell Tellus, Shell Gadus, Mobil Delvac, Mobil DTE, Castrol RX Super, and many other grades in Muscat with same-day delivery. All lubricants are genuine branded products supplied with original CoA."
  },
  {
    question: "What is the delivery time for chemical orders in Oman?",
    answer: "For Muscat and Rusayl Industrial Area: same-day delivery for orders before 12:00 PM. For Sohar and surrounding areas: next-day delivery. For Salalah, Duqm, Nizwa, Sur: 2–3 business days. Emergency and weekend deliveries can be arranged. Contact us at +968-93754388 for urgent requirements."
  }
];
import { trackSearch } from '@/components/GoogleAnalytics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  image?: string;
  details?: {
    formula?: string;
    fullDescription?: string;
    applications?: string[];
    casNumber?: string;
    alternativeNames?: string[];
    technicalSpecs?: string[];
    seoKeywords?: string[];
    longDescription?: string;
  };
}


const Products = () => {
  const { t } = useTranslation();
  const { category: categoryParam } = useParams<{ category?: string }>();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Sync URL category param → active filter when navigating between category routes
  useEffect(() => {
    setActiveCategory(categoryParam || 'all');
  }, [categoryParam]);

  // Lazy-load products: only the active category (or all if no filter)
  useEffect(() => {
    setProductsLoading(true);
    const loader = categoryParam
      ? loadProductsByCategory(categoryParam)
      : loadAllProducts();
    loader.then((data) => {
      setProducts(data as Product[]);
      setProductsLoading(false);
    });
  }, [categoryParam]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 3) {
      trackSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const categories = [
    { id: 'all', name: t('products.allProducts'), icon: FlaskConical },
    { id: 'oilfield', name: 'Oilfield & Refinery', icon: Factory },
    { id: 'water-treatment', name: 'Water Treatment Chemicals', icon: Droplets },
    { id: 'lubricants', name: 'Lubricants & Greases', icon: Wrench },
    { id: 'corrosion-inhibitor', name: 'Corrosion Inhibitor', icon: Shield },
    { id: 'tank-cleaners', name: 'Tank Cleaners', icon: SprayCan },
    { id: 'ro-chemicals', name: 'RO Chemicals', icon: Droplets },
    { id: 'cooling-water', name: 'Cooling Water Chemicals', icon: Droplets },
    { id: 'swimming-pool', name: 'Swimming Pool Chemicals', icon: Droplets },
    { id: 'construction', name: 'Construction', icon: Building2 },
    { id: 'food-beverage', name: 'Food & Beverage', icon: Wine },
    { id: 'soap-detergent', name: 'Soap & Detergent', icon: Sparkles },
    { id: 'calcium-carbonate', name: 'Calcium Carbonate', icon: FlaskConical },
    { id: 'additives', name: 'Additives', icon: Zap },
    { id: 'lab-equipment', name: 'Lab Equipment', icon: TestTube },
    { id: 'lab-chemicals', name: 'Lab Chemicals', icon: Beaker },
    { id: 'agro', name: 'Agro Products', icon: Wheat },
    { id: 'solvents', name: 'Solvents', icon: FlaskRound },
    { id: 'inorganic', name: 'Inorganic Chemicals', icon: Microscope },
    { id: 'chlorinated', name: 'Chlorinated Solvents', icon: Flame },
    { id: 'ethanolamines', name: 'Ethanolamines', icon: Beaker },
    { id: 'glycols', name: 'Glycols', icon: Wind },
    { id: 'alcohols', name: 'Alcohols', icon: FlaskRound },
  ];

  // Memoize filtered products to prevent recalculating on every render
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        // Search in title
        if (product.title.toLowerCase().includes(query)) return true;

        // Search in description
        if (product.description.toLowerCase().includes(query)) return true;

        // Search in details
        if (product.details) {
          // Search in formula
          if (product.details.formula?.toLowerCase().includes(query)) return true;

          // Search in CAS number
          if (product.details.casNumber?.toLowerCase().includes(query)) return true;

          // Search in alternative names
          if (product.details.alternativeNames?.some(name =>
            name.toLowerCase().includes(query)
          )) return true;

          // Search in SEO keywords
          if (product.details.seoKeywords?.some(keyword =>
            keyword.toLowerCase().includes(query)
          )) return true;

          // Search in applications
          if (product.details.applications?.some(app =>
            app.toLowerCase().includes(query)
          )) return true;
        }

        return false;
      });
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  // Keep getFilteredProducts for backward compatibility with existing code
  const getFilteredProducts = (categoryId: string) => {
    if (categoryId === activeCategory) return filteredProducts;
    if (categoryId === 'all') return products;
    return products.filter((product) => product.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={(() => {
          const categoryTitles: Record<string, string> = {
            'water-treatment': 'Water Treatment Chemicals Supplier | Oman & GCC | Global Chemicals LLC',
            'lubricants': 'Industrial Lubricants Supplier in Oman & Middle East | Global Chemicals LLC',
            'swimming-pool': 'Swimming Pool Chemicals | Oman & GCC | Global Chemicals LLC',
            'lab-chemicals': 'Laboratory Chemicals Supplier | Oman & Middle East | Global Chemicals LLC',
            'oilfield': 'Oilfield & Refinery Chemicals | Oman & GCC | Global Chemicals LLC',
            'tank-cleaners': 'Marine & Industrial Tank Cleaners | Oman & Middle East | Global Chemicals',
            'soap-detergent': 'Soap & Detergent Chemicals | Oman & GCC | Global Chemicals LLC',
            'food-beverage': 'Food & Beverage Grade Chemicals | Oman & GCC | Global Chemicals LLC',
            'cooling-water': 'Cooling Water Treatment Chemicals | Oman & GCC | Global Chemicals LLC',
            'corrosion-inhibitor': 'Corrosion Inhibitors Supplier | Oman & Middle East | Global Chemicals LLC',
            'ro-chemicals': 'RO Plant Chemicals Supplier | Oman & GCC | Global Chemicals LLC',
            'solvents': 'Industrial Solvents Supplier | Oman & Middle East | Global Chemicals LLC',
            'inorganic': 'Inorganic Chemicals Supplier | Oman & GCC | Global Chemicals LLC',
            'construction': 'Construction Chemicals | Oman & GCC | Global Chemicals LLC',
            'alcohols': 'Industrial Alcohols Supplier | Oman & GCC | Global Chemicals LLC',
            'glycols': 'Glycols Supplier | Oman & GCC | Global Chemicals LLC',
            'ethanolamines': 'Ethanolamines Supplier | Oman & GCC | Global Chemicals LLC',
            'chlorinated': 'Chlorinated Solvents | Oman & GCC | Global Chemicals LLC',
            'lab-equipment': 'Laboratory Equipment Supplier | Oman & GCC | Global Chemicals LLC',
            'calcium-carbonate': 'Calcium Carbonate Supplier | Oman & GCC | Global Chemicals LLC',
            'agro': 'Agricultural Chemicals | Oman & GCC | Global Chemicals LLC',
            'additives': 'Chemical Additives Supplier | Oman & GCC | Global Chemicals LLC'
          };
          return categoryTitles[activeCategory] || 'Industrial Chemicals Supplier Oman & Middle East | Global Chemicals LLC';
        })()}
        description={(() => {
          const categoryDescs: Record<string, string> = {
            'water-treatment': 'Buy water treatment chemicals in Oman & GCC — PAC, caustic soda, calcium hypochlorite, antiscalants & more. Serving Muscat, Dubai, Riyadh, Doha. Request a quote today.',
            'lubricants': 'Shell, Mobil, Castrol & GP lubricants supplier in Oman & Middle East. Industrial and automotive lubricants for all applications. Fast delivery across Muscat, Dubai, Riyadh, Doha.',
            'swimming-pool': 'Swimming pool chemicals in Oman & GCC — chlorine tablets, algaecides, TCCA, sodium hypochlorite & more. Serving Muscat, Dubai, Riyadh, Doha. Request a quote today.',
            'lab-chemicals': 'Laboratory chemicals and reagents supplier in Oman & Middle East. AR grade acids, solvents, and analytical reagents for research labs. Request a quote today.',
            'oilfield': 'Oilfield and refinery chemicals in Oman & GCC — drilling fluids, production chemicals, corrosion inhibitors. Trusted by oil & gas companies across the Middle East.',
            'tank-cleaners': 'Heavy duty alkaline, acidic and neutral tank cleaners for marine and industrial applications in Oman & GCC. Environmentally friendly sludge breakers.',
            'soap-detergent': 'Raw materials for soap and detergent manufacturing in Oman & GCC including LABSA, SLES, Caustic Soda, Soda Ash & more. Request a quote today.',
            'food-beverage': 'Food-grade chemicals in Oman & GCC — Citric Acid, Ascorbic Acid, Calcium Carbonate, Sodium Bicarbonate. Certified high-purity ingredients for F&B industry.',
            'cooling-water': 'Microbiocides, corrosion inhibitors & scale inhibitors for cooling towers and chilled water systems in Oman & GCC. Increase HVAC efficiency.',
            'corrosion-inhibitor': 'Protect metals with our premium corrosion inhibitors in Oman & GCC. Suitable for closed loop systems, boilers, cooling towers, and oilfield applications.',
            'ro-chemicals': 'Reverse osmosis chemicals in Oman & GCC — antiscalants, membrane cleaners, and biocides for water desalination plants. Ensure optimal RO performance.',
            'solvents': 'Premium industrial solvents provider in Oman & Middle East. High purity Toluene, Xylene, Acetone, Hexane, MEK, and other chemical solvents.',
            'inorganic': 'Wholesale supplier of inorganic chemicals in Oman & GCC including Sodium Nitrite, Potassium Chloride, Borax, and Silica Gel.',
            'construction': 'Construction chemicals, concrete additives, and epoxy solutions in Oman & GCC for civil engineering and infrastructure projects.',
            'alcohols': 'Industrial grade alcohols in Oman & GCC — Methanol, Ethanol, Isopropanol (IPA), Butanol. Available in bulk & drums for immediate delivery.',
            'glycols': 'Supplier of Monoethylene Glycol (MEG), Diethylene Glycol (DEG) and Propylene Glycol in Oman & GCC. Available in industrial and food grades.',
            'ethanolamines': 'Monoethanolamine (MEA), Diethanolamine (DEA), and Triethanolamine (TEA) supplier in Oman & GCC for gas sweetening and industrial uses.',
            'chlorinated': 'Methylene Chloride, Perchloroethylene, Trichloroethylene supplier in Oman & GCC. High grade chlorinated solvents for industrial degreasing.',
            'lab-equipment': 'High precision laboratory equipment and apparatus for analytical and research laboratories across Oman & Middle East.',
            'calcium-carbonate': 'High purity Calcium Carbonate for industrial, food, and pharmaceutical applications in Oman & GCC.',
            'agro': 'Specialty agricultural chemicals and fertilizers for farming and greenhouse applications in Oman & GCC.',
            'additives': 'Performance-enhancing chemical additives for coatings, plastics, and industrial manufacturing in Oman & GCC.'
          };
          return categoryDescs[activeCategory] || 'Comprehensive catalog of industrial chemicals in Oman & GCC — water treatment, lubricants, lab chemicals, oilfield & swimming pool products. ISO certified. Exporting to UAE, Saudi Arabia, Qatar, Kuwait, Bahrain.';
        })()}
        keywords="water treatment chemicals Oman UAE, PAC Oman, caustic soda GCC, calcium hypochlorite Middle East, industrial chemicals Muscat Dubai Riyadh, laboratory chemicals Oman, Shell lubricants UAE, Mobil oils Saudi Arabia, chemical supplier GCC, chemicals Dubai, Riyadh chemicals, industrial lubricants Oman, RO chemicals UAE, cooling tower chemicals Middle East, swimming pool chemicals GCC, chemical exporter Oman"
        ogTitle={activeCategory !== 'all' ? `${activeCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Global Chemicals LLC Oman & GCC` : 'Chemical Products | Industrial Chemicals Oman & Middle East | Global Chemicals LLC'}
        ogDescription="Leading chemical supplier in Oman exporting to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Browse our complete catalog of water treatment chemicals, industrial lubricants, and specialty chemicals."
        ogUrl={categoryParam ? `https://gcoman.com/products/${categoryParam}` : 'https://gcoman.com/products'}
        canonical={categoryParam ? `https://gcoman.com/products/${categoryParam}` : 'https://gcoman.com/products'}
      />
      <OrganizationStructuredData includeService={true} />
      <LocalBusinessStructuredData />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://gcoman.com/' },
        { name: 'Products', url: 'https://gcoman.com/products' },
        ...(categoryParam ? [{ name: categoryParam.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), url: `https://gcoman.com/products/${categoryParam}` }] : [])
      ]} />
      <FAQStructuredData faqs={productsFAQs} />

      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {t('products.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('products.heroDesc')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">{t('products.badges.isoCertified')}</span>
              <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full font-medium">{t('products.badges.yearsExperience')}</span>
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full font-medium">{t('products.badges.productsCount')}</span>
              <span className="px-4 py-2 bg-tertiary/10 text-tertiary rounded-full font-medium">{t('products.badges.technicalSupport')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section with Sidebar */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12 animate-fade-in-up">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('products.browseDesc')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by product name, CAS number, formula, or category..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-12 h-14 text-base shadow-lg border-2 focus:border-primary"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAISearchOpen(true)}
                className="gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary"
              >
                <Sparkles className="h-4 w-4" />
                Ask AI about our products
              </Button>
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {searchQuery.trim() && ` matching "${searchQuery}"`}
              </p>
            )}
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Category Navigation */}
              <aside className="lg:w-72 flex-shrink-0">
                <div className="lg:sticky lg:top-24 space-y-2">
                  <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide px-2 sm:px-3">
                    {t('products.productCategories')}
                  </h3>
                  <nav className="space-y-1 max-h-[60vh] lg:max-h-none overflow-y-auto">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isActive = activeCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={cn(
                            'w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all group',
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-card hover:bg-accent text-foreground border border-border hover:border-primary/50'
                          )}
                        >
                          <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0', isActive ? 'text-primary-foreground' : 'text-primary')} />
                          <span className="flex-1 text-xs sm:text-sm font-medium">{category.name}</span>
                          <ChevronRight className={cn('w-3 h-3 sm:w-4 sm:h-4 transition-transform', isActive ? 'translate-x-0' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100')} />
                        </button>
                      );
                    })}
                  </nav>
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground">
                      {t('products.cantFind')}{' '}
                      <a href="/contact" className="text-primary hover:underline font-semibold">
                        {t('common.contactUs')}
                      </a>{' '}
                      {t('products.contactForCustom')}
                    </p>
                  </div>
                </div>
              </aside>

              {/* Main Content - Product Grid */}
              <main className="flex-1 min-w-0">
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {categories.find((c) => c.id === activeCategory)?.name || t('products.allProducts')}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {getFilteredProducts(activeCategory).length} {t('products.productsAvailable')} · {t('products.tapToViewDetails')}
                  </p>
                </div>

                {productsLoading ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">{t('common.loading') || 'Loading products…'}</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {getFilteredProducts(activeCategory).map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>

                    {getFilteredProducts(activeCategory).length === 0 && (
                      <div className="text-center py-16">
                        <p className="text-muted-foreground text-lg">
                          {t('products.noProductsAvailable')}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </main>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details - Responsive Drawer/Dialog */}
      {isMobile ? (
        <Drawer open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DrawerContent className="max-h-[85vh] overflow-y-auto">
            {selectedProduct && (
              <>
                <DrawerHeader>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const Icon = selectedProduct.icon;
                        return <Icon className="w-6 h-6 text-primary" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <DrawerTitle className="text-lg font-bold text-foreground leading-tight">
                        {selectedProduct.title}
                      </DrawerTitle>
                      <DrawerDescription className="mt-1 text-sm">
                        {selectedProduct.description}
                      </DrawerDescription>
                    </div>
                  </div>
                </DrawerHeader>

                <div className="px-4 pb-4 space-y-4">
                  {selectedProduct.details?.formula && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">{t('products.chemicalFormula')}</h4>
                      <p className="text-muted-foreground font-mono text-base">{selectedProduct.details.formula}</p>
                    </div>
                  )}

                  {selectedProduct.details?.fullDescription && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">{t('products.description')}</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {selectedProduct.details.fullDescription}
                      </p>
                    </div>
                  )}

                  {selectedProduct.details?.applications && selectedProduct.details.applications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 text-sm">{t('products.applications')}</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {selectedProduct.details.applications.map((app, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1 flex-shrink-0 text-lg">•</span>
                            <span className="text-muted-foreground text-xs">{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      {t('products.moreInfoContact')}{' '}
                      <a href="/contact" className="text-primary hover:underline font-semibold">
                        {t('common.contactUs').toLowerCase()}
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const Icon = selectedProduct.icon;
                        return <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                        {selectedProduct.title}
                      </DialogTitle>
                      <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">{selectedProduct.description}</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6">
                  {selectedProduct.details?.formula && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Chemical Formula</h4>
                      <p className="text-muted-foreground font-mono text-base sm:text-lg">{selectedProduct.details.formula}</p>
                    </div>
                  )}

                  {selectedProduct.details?.fullDescription && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Description</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {selectedProduct.details.fullDescription}
                      </p>
                    </div>
                  )}

                  {selectedProduct.details?.applications && selectedProduct.details.applications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Applications</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {selectedProduct.details.applications.map((app, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-1 flex-shrink-0 text-lg">•</span>
                            <span className="text-muted-foreground text-xs sm:text-sm">{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-3 sm:pt-4 border-t border-border">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      For more information about this product, pricing, or technical specifications, please{' '}
                      <a href="/contact" className="text-primary hover:underline font-semibold">
                        contact us
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">Why Choose Our Chemical Products</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Leading chemical supplier in Oman & Middle East with proven track record serving oil &amp; gas, manufacturing, water treatment, and industrial sectors across Muscat, Dubai, Riyadh, Doha, and the wider GCC region.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Comprehensive Range',
                  description: 'Over 1000+ water treatment chemicals, industrial lubricants, and specialty products from trusted global manufacturers.',
                },
                {
                  title: 'ISO Quality Assured',
                  description:
                    'ISO 9001 certified operations. Every product meets international standards with complete technical documentation and safety data sheets.',
                },
                {
                  title: 'Expert Technical Support',
                  description:
                    '10+ years expertise in chemical supply. Our team provides product selection guidance, application support, and after-sales technical assistance.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-card rounded-lg border border-border animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
      <AISearchDialog open={isAISearchOpen} onOpenChange={setIsAISearchOpen} />
    </div>
  );
};

export default Products;
