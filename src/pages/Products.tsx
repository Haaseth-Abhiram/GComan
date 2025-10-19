import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube, Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound, Flame, Wind, Wine, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  };
}

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const products: Product[] = [
    // Water Treatment Chemicals
    {
      id: 'aluminium-sulphate',
      title: 'Aluminium Sulphate',
      description: 'Inorganic salt used as a flocculant and coagulant in water treatment applications.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Al2(SO4)3',
        fullDescription: 'Aluminium Sulphate is an inorganic salt that, in its liquid form, is an aqueous solution of the compound. It is widely used across various industries due to its effectiveness as a flocculant and coagulant.',
        applications: ['Water purification', 'Wastewater treatment', 'Paper manufacturing', 'Textile processing'],
      },
    },
    {
      id: 'calcium-chloride',
      title: 'Calcium Chloride',
      description: 'Highly hygroscopic salt used for de-icing, dust control, and industrial applications.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'CaCl2',
        fullDescription: "It's an inorganic compound, a salt of calcium and chlorine. Highly hygroscopic, meaning it readily absorbs moisture from the air.",
        applications: ['De-icing', 'Dust control', 'Food processing', 'Concrete acceleration', 'Wastewater treatment'],
      },
    },
    {
      id: 'calcium-hypochlorite',
      title: 'Calcium Hypochlorite',
      description: 'Powerful disinfectant and bleaching agent for water treatment and sanitation.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Ca(ClO)2',
        fullDescription: 'Calcium hypochlorite is a white, solid disinfectant and bleaching agent commonly known as "bleaching powder" that is widely used to sanitize swimming pools and drinking water.',
        applications: ['Water purification', 'Pool sanitation', 'Bleaching', 'Disinfection', 'Algae control'],
      },
    },
    {
      id: 'caustic-soda',
      title: 'Caustic Soda',
      description: 'Strong alkaline compound used in manufacturing, cleaning, and chemical processing.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'NaOH',
        fullDescription: 'Caustic soda is an inorganic compound that, in its pure form, is a white, odorless, crystalline solid. Highly hygroscopic and forms a highly alkaline solution with pH of 14.',
        applications: ['Paper production', 'Water treatment', 'Cleaning agents', 'Soap making', 'Aluminum extraction'],
      },
    },
    {
      id: 'antifoam',
      title: 'Antifoam',
      description: 'Chemical agents that prevent foam formation in industrial processes.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C18H30O6',
        fullDescription: 'Antifoam agents work by lowering the surface tension of the liquid, which destabilizes the walls of the foam bubbles and causes them to collapse.',
        applications: ['Food processing', 'Wastewater treatment', 'Pulp and paper', 'Petrochemicals'],
      },
    },
    {
      id: 'antiscalant',
      title: 'Antiscalant',
      description: 'Prevents scale formation in water treatment systems and RO membranes.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        fullDescription: 'Antiscalant is a chemical additive used to prevent the formation of scale—hard mineral deposits—on surfaces in water treatment systems.',
        applications: ['RO membrane protection', 'Desalination', 'Cooling systems', 'Boiler efficiency', 'Maintenance reduction'],
      },
    },
    {
      id: 'biocides',
      title: 'Biocides',
      description: 'Antimicrobial agents for controlling bacteria, viruses, and fungi.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        fullDescription: 'Biocides work by disrupting the cellular functions of harmful organisms like bacteria, viruses, fungi, and algae.',
        applications: ['Water treatment', 'Healthcare', 'Agriculture', 'Consumer products', 'Microbial contamination prevention'],
      },
    },
    {
      id: 'tcca',
      title: 'Trichloroisocyanuric Acid (TCCA)',
      description: 'Stabilized chlorine compound for long-lasting disinfection and sanitation.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C3Cl3N3O3',
        fullDescription: 'Trichloroisocyanuric Acid (TCCA) is a stabilized form of organic chlorine, commonly found as white, crystalline powder, granules, or tablets.',
        applications: ['Water treatment', 'Pool sanitation', 'Disinfection', 'Cleaning', 'Agriculture', 'Bleaching'],
      },
    },

    // Lubricants & Greases
    {
      id: 'shell-lubricants',
      title: 'Shell Lubricants',
      description: 'Comprehensive range of Shell automotive and industrial lubricants for optimal performance.',
      category: 'lubricants',
      icon: Wrench,
      details: {
        fullDescription: "Shell's portfolio includes Shell Helix engine oils, Shell Advance for motorcycles, Shell Rimula for heavy-duty diesel, Shell Gadus greases, Shell Tellus hydraulic fluids, and Shell Omala gear oils.",
        applications: ['Engine protection', 'Hydraulic systems', 'Gear systems', 'Compressors', 'Turbines', 'Machine tools'],
      },
    },
    {
      id: 'mobil-lubricants',
      title: 'Mobil Lubricants',
      description: 'Advanced synthetic and conventional lubricants including Mobil 1 and Mobil Delvac.',
      category: 'lubricants',
      icon: Wrench,
      details: {
        fullDescription: 'Mobil offers Mobil 1 synthetic engine oils, Mobil Super conventional oils, Mobil Delvac for heavy-duty diesel, Mobil DTE hydraulic fluids, Mobilgear, and Mobil SHC synthetic lubricants.',
        applications: ['Automotive protection', 'Commercial vehicles', 'Industrial machinery', 'Hydraulic systems', 'Extreme conditions'],
      },
    },
    {
      id: 'castrol-lubricants',
      title: 'Castrol Lubricants',
      description: 'Premium "Liquid Engineering" solutions with Castrol EDGE and MAGNATEC technologies.',
      category: 'lubricants',
      icon: Wrench,
      details: {
        fullDescription: "Castrol's range includes Castrol EDGE full-synthetic, Castrol MAGNATEC with intelligent molecules, Castrol GTX, Castrol VECTON for heavy-duty diesel, and industrial fluids.",
        applications: ['Maximum engine performance', 'Start-up protection', 'Sludge prevention', 'Heavy-duty vehicles', 'Industrial equipment'],
      },
    },
    {
      id: 'gp-lubricants',
      title: 'GP (IPOL) Lubricants',
      description: 'IPOL brand automotive and industrial lubricants including metal working fluids.',
      category: 'lubricants',
      icon: Wrench,
      details: {
        fullDescription: "GP Petroleums' IPOL range includes automotive engine oils, hydraulic oils, gear oils, spindle oils, turbine oils, metal working fluids, and specialty greases.",
        applications: ['Automotive engines', 'Industrial machinery', 'Metal working', 'Rubber processing', 'Sugar industry'],
      },
    },

    // Calcium Carbonate
    {
      id: 'calcium-carbonate',
      title: 'Calcium Carbonate',
      description: 'High-purity calcium carbonate for construction, plastics, and industrial applications.',
      category: 'calcium-carbonate',
      icon: FlaskConical,
      details: {
        formula: 'CaCO3',
        fullDescription: 'Calcium carbonate is a common chemical compound that is the main component of substances like chalk, limestone, marble, and shells of marine organisms.',
        applications: ['Construction materials', 'Plastics filler', 'Paper manufacturing', 'Paint industry', 'Calcium supplements'],
      },
    },

    // Additives
    {
      id: 'additives',
      title: 'Industrial Additives',
      description: 'Specialized additives to enhance product performance across multiple industries.',
      category: 'additives',
      icon: Zap,
      details: {
        fullDescription: 'Comprehensive range of additives designed to improve performance, stability, and quality of industrial products and processes.',
        applications: ['Performance enhancement', 'Stability improvement', 'Process optimization', 'Quality control'],
      },
    },

    // Lab Equipment
    {
      id: 'lab-equipment',
      title: 'Laboratory Handling Equipment',
      description: 'Premium laboratory equipment including beakers, flasks, and specialized vessels.',
      category: 'lab-equipment',
      icon: TestTube,
      details: {
        fullDescription: 'Our product range includes borosilicate glass beakers, crucibles, Erlenmeyer flasks, volumetric flasks, and distillation flasks, expertly crafted for specific laboratory processes.',
        applications: ['Chemical reactions', 'Titrations', 'Solution preparation', 'Distillation', 'Laboratory testing'],
      },
    },

    // Lab Chemicals
    {
      id: 'citric-acid',
      title: 'Citric Acid',
      description: 'High-purity citric acid for food, pharmaceutical, and industrial applications.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C6H8O7',
        fullDescription: 'Citric acid is a white, crystalline, odorless solid with a strong sour taste. Highly soluble in water and key intermediate in the citric acid cycle.',
        applications: ['Food preservative', 'Flavoring agent', 'Cleaning', 'pH adjustment', 'Buffer solutions'],
      },
    },

    // Swimming Pool Chemicals
    {
      id: 'pool-chlorine',
      title: 'Pool Chlorination Products',
      description: 'Complete range of chlorine-based sanitizers for swimming pool maintenance.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        fullDescription: 'Comprehensive pool chemical solutions including calcium hypochlorite, TCCA tablets, and liquid chlorine for effective pool sanitation.',
        applications: ['Water sanitization', 'Algae prevention', 'pH balance', 'Shock treatment', 'Regular maintenance'],
      },
    },

    // Oilfield & Refinery
    {
      id: 'oilfield-chemicals',
      title: 'Oilfield & Refinery Chemicals',
      description: 'Specialized chemicals for oil extraction, drilling, and refinery operations.',
      category: 'oilfield',
      icon: Factory,
      details: {
        fullDescription: 'Range of chemicals designed for the oil and gas industry including drilling fluids, production chemicals, and refinery additives.',
        applications: ['Drilling operations', 'Production enhancement', 'Refinery processes', 'Pipeline maintenance'],
      },
    },

    // Construction
    {
      id: 'construction-chemicals',
      title: 'Construction Chemicals',
      description: 'Advanced chemicals for construction projects including concrete additives and sealants.',
      category: 'construction',
      icon: Building2,
      details: {
        fullDescription: 'Reliable products and innovative technologies that enhance efficiency, safety, and quality in construction from infrastructure to specialized building solutions.',
        applications: ['Concrete acceleration', 'Waterproofing', 'Structural strengthening', 'Surface treatment'],
      },
    },

    // Food & Beverage
    {
      id: 'food-beverage-chemicals',
      title: 'Food & Beverage Grade Chemicals',
      description: 'Food-safe chemicals ensuring quality and safety in food processing.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        fullDescription: 'Innovative solutions that ensure quality, safety, and efficiency in food and beverage production from strict hygiene standards to consistent product quality.',
        applications: ['Food processing', 'Beverage production', 'Sanitation', 'Quality control', 'Preservation'],
      },
    },

    // Agro Products
    {
      id: 'agro-products',
      title: 'Agricultural Products',
      description: 'Agricultural chemicals and solutions for crop protection and enhancement.',
      category: 'agro',
      icon: Wheat,
      details: {
        fullDescription: 'Comprehensive range of agricultural chemicals designed to support modern farming practices and enhance crop yields.',
        applications: ['Crop protection', 'Soil treatment', 'Fertilizers', 'Growth enhancers'],
      },
    },

    // Soap & Detergent Chemicals
    {
      id: 'soap-detergent',
      title: 'Soap & Detergent Chemicals',
      description: 'Complete range of raw materials for soap and detergent manufacturing.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        fullDescription: 'Reliable source for a comprehensive range of chemicals specifically designed for the detergent and soap industry.',
        applications: ['Soap manufacturing', 'Detergent production', 'Cleaning products', 'Surface active agents'],
      },
    },

    // Solvents
    {
      id: 'industrial-solvents',
      title: 'Industrial Solvents',
      description: 'High-quality solvents for industrial cleaning, processing, and manufacturing.',
      category: 'solvents',
      icon: FlaskRound,
      details: {
        fullDescription: 'Comprehensive range of solvents for various industrial applications including cleaning, extraction, and processing.',
        applications: ['Industrial cleaning', 'Chemical processing', 'Extraction', 'Manufacturing'],
      },
    },

    // Inorganic Chemicals
    {
      id: 'inorganic-chemicals',
      title: 'Inorganic Chemicals',
      description: 'Wide range of inorganic compounds for industrial processes.',
      category: 'inorganic',
      icon: Microscope,
      details: {
        fullDescription: 'Diverse portfolio of inorganic chemicals supporting various industrial manufacturing and processing needs.',
        applications: ['Chemical manufacturing', 'Industrial processes', 'Water treatment', 'Metal processing'],
      },
    },

    // Chlorinated Solvents
    {
      id: 'chlorinated-solvents',
      title: 'Chlorinated Solvents',
      description: 'Specialized chlorinated solvents for degreasing and industrial cleaning.',
      category: 'chlorinated',
      icon: Flame,
      details: {
        fullDescription: 'Range of chlorinated solvents designed for demanding industrial cleaning and degreasing applications.',
        applications: ['Metal degreasing', 'Industrial cleaning', 'Dry cleaning', 'Chemical intermediates'],
      },
    },

    // Ethanolamines
    {
      id: 'ethanolamines',
      title: 'Ethanolamines',
      description: 'Versatile ethanolamines for gas treatment, detergents, and chemical synthesis.',
      category: 'ethanolamines',
      icon: Beaker,
      details: {
        fullDescription: 'Family of organic compounds used in various industrial applications from gas sweetening to surfactant production.',
        applications: ['Gas treatment', 'Surfactant production', 'Chemical synthesis', 'Metalworking fluids'],
      },
    },

    // Glycols
    {
      id: 'glycols',
      title: 'Glycols',
      description: 'Industrial glycols for antifreeze, coolants, and chemical manufacturing.',
      category: 'glycols',
      icon: Wind,
      details: {
        fullDescription: 'Range of glycols including ethylene glycol and propylene glycol for diverse industrial applications.',
        applications: ['Antifreeze', 'Coolants', 'Chemical intermediates', 'De-icing', 'Heat transfer'],
      },
    },

    // Alcohols
    {
      id: 'industrial-alcohols',
      title: 'Industrial Alcohols',
      description: 'High-purity alcohols for solvents, sanitizers, and chemical processing.',
      category: 'alcohols',
      icon: FlaskRound,
      details: {
        fullDescription: 'Comprehensive range of industrial-grade alcohols for various manufacturing and processing applications.',
        applications: ['Solvents', 'Sanitizers', 'Chemical synthesis', 'Fuel additives', 'Cleaning agents'],
      },
    },
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: FlaskConical },
    { id: 'water-treatment', name: 'Water Treatment Chemicals', icon: Droplets },
    { id: 'lubricants', name: 'Lubricants & Greases', icon: Wrench },
    { id: 'calcium-carbonate', name: 'Calcium Carbonate', icon: FlaskConical },
    { id: 'additives', name: 'Additives', icon: Zap },
    { id: 'lab-equipment', name: 'Lab Equipment', icon: TestTube },
    { id: 'lab-chemicals', name: 'Lab Chemicals', icon: Beaker },
    { id: 'swimming-pool', name: 'Swimming Pool Chemicals', icon: Droplets },
    { id: 'oilfield', name: 'Oilfield & Refinery', icon: Factory },
    { id: 'construction', name: 'Construction', icon: Building2 },
    { id: 'food-beverage', name: 'Food & Beverage', icon: Wine },
    { id: 'agro', name: 'Agro Products', icon: Wheat },
    { id: 'soap-detergent', name: 'Soap & Detergent', icon: Sparkles },
    { id: 'solvents', name: 'Solvents', icon: FlaskRound },
    { id: 'inorganic', name: 'Inorganic Chemicals', icon: Microscope },
    { id: 'chlorinated', name: 'Chlorinated Solvents', icon: Flame },
    { id: 'ethanolamines', name: 'Ethanolamines', icon: Beaker },
    { id: 'glycols', name: 'Glycols', icon: Wind },
    { id: 'alcohols', name: 'Alcohols', icon: FlaskRound },
  ];

  const getFilteredProducts = (categoryId: string) => {
    if (categoryId === 'all') return products;
    return products.filter((product) => product.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Products</h1>
            <p className="text-lg text-muted-foreground">
              High-quality chemical solutions for diverse industrial needs
            </p>
          </div>
        </div>
      </section>

      {/* Products Section with Sidebar */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12 animate-fade-in-up">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Global Chemicals LLC specializes in supplying a wide range of high-quality chemicals for various
              industries. Browse our comprehensive product portfolio by category.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Category Navigation */}
              <aside className="lg:w-72 flex-shrink-0">
                <div className="sticky top-24 space-y-2">
                  <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide px-3">
                    Product Categories
                  </h3>
                  <nav className="space-y-1">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isActive = activeCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all group',
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : 'bg-card hover:bg-accent text-foreground border border-border hover:border-primary/50'
                          )}
                        >
                          <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary-foreground' : 'text-primary')} />
                          <span className="flex-1 text-sm font-medium">{category.name}</span>
                          <ChevronRight className={cn('w-4 h-4 transition-transform', isActive ? 'translate-x-0' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100')} />
                        </button>
                      );
                    })}
                  </nav>
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground">
                      Can't find what you're looking for?{' '}
                      <a href="/contact" className="text-primary hover:underline font-semibold">
                        Contact us
                      </a>{' '}
                      for custom solutions.
                    </p>
                  </div>
                </div>
              </aside>

              {/* Main Content - Product Grid */}
              <main className="flex-1 min-w-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    {categories.find((c) => c.id === activeCategory)?.name || 'All Products'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getFilteredProducts(activeCategory).length} products available
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {getFilteredProducts(activeCategory).map((product, index) => {
                    const Icon = product.icon;
                    return (
                      <Card
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="group p-6 hover:shadow-xl transition-all animate-fade-in border-border hover:border-primary/50 cursor-pointer"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="space-y-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                            {product.description}
                          </p>
                          <button className="text-primary font-semibold text-sm hover:underline flex items-center gap-2 group/btn">
                            View Details
                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {getFilteredProducts(activeCategory).length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">
                      No products available in this category at the moment.
                    </p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const Icon = selectedProduct.icon;
                      return <Icon className="w-8 h-8 text-primary" />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {selectedProduct.title}
                    </DialogTitle>
                    <p className="text-muted-foreground mt-1">{selectedProduct.description}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {selectedProduct.details?.formula && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Chemical Formula</h4>
                    <p className="text-muted-foreground font-mono text-lg">{selectedProduct.details.formula}</p>
                  </div>
                )}


                {selectedProduct.details?.fullDescription && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedProduct.details.fullDescription}
                    </p>
                  </div>
                )}

                {selectedProduct.details?.applications && selectedProduct.details.applications.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Applications</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedProduct.details.applications.map((app, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1 flex-shrink-0">•</span>
                          <span className="text-muted-foreground text-sm">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
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

      {/* Product Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">Why Choose Our Products</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We continuously strive to expand our product offerings, staying at the forefront of industry trends and
              innovations.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Comprehensive Range',
                  description: 'Wide selection of specialty and commodity chemicals for all your industrial needs.',
                },
                {
                  title: 'Quality Assured',
                  description:
                    'Every product meets stringent quality standards and undergoes rigorous testing procedures.',
                },
                {
                  title: 'Expert Support',
                  description:
                    'Technical support and guidance from our team of experienced chemical industry professionals.',
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

      <Footer />
    </div>
  );
};

export default Products;
