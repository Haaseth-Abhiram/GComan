import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

// Import images
import oilGasImg from '@/assets/products/oil-gas.jpg';
import waterTreatmentImg from '@/assets/products/water-treatment.jpg';
import manufacturingImg from '@/assets/industries/manufacturing.jpg';
import foodBeverageImg from '@/assets/industries/food-beverage.jpg';
import pharmaceuticalImg from '@/assets/industries/pharmaceutical.jpg';
import constructionImg from '@/assets/industries/construction.jpg';
import swimmingPoolImg from '@/assets/industries/swimming-pool.jpg';
import laboratoryImg from '@/assets/industries/laboratory.jpg';

const Industries = () => {
  const industries = [
    {
      id: 'oil-gas',
      title: 'Oil & Gas',
      image: oilGasImg,
      intro: 'Powering the energy sector with specialized chemicals for upstream, midstream, and downstream operations.',
      content: 'The oil and gas industry demands chemicals that perform under extreme conditions while maintaining safety and environmental standards. Global Chemicals LLC provides a comprehensive range of oilfield and refinery chemicals that enhance production efficiency, protect equipment, and ensure operational excellence.',
      products: [
        { category: 'Drilling Fluids', items: 'Bentonite (API/OCMA Grade), Barite (4.2 SG), CMC (High/Low Viscosity), Xanthan Gum, Caustic Soda' },
        { category: 'Production Chemicals', items: 'Demulsifiers, Corrosion Inhibitors, Scale Inhibitors, Biocides, H2S Scavengers' },
        { category: 'Enhanced Oil Recovery', items: 'Surfactants, Polymers (PHPA), Alkaline Agents' },
        { category: 'Refinery Chemicals', items: 'Catalysts, Antifoaming Agents, Neutralizing Amines, Antifoulants' },
        { category: 'Pipeline Protection', items: 'Drag Reducing Agents, Paraffin Inhibitors, Pour Point Depressants' },
      ],
      applications: [
        'Drilling and completion operations',
        'Well stimulation and workover',
        'Crude oil treatment and processing',
        'Refinery operations',
        'Pipeline maintenance and protection',
        'Gas sweetening and dehydration',
      ],
    },
    {
      id: 'water-treatment',
      title: 'Water Treatment',
      image: waterTreatmentImg,
      intro: 'Comprehensive chemical solutions for municipal water treatment, industrial wastewater, and desalination plants.',
      content: 'Water is our most precious resource, and its treatment requires precision, reliability, and expertise. Global Chemicals LLC offers a complete portfolio of water treatment chemicals that ensure clean, safe water for communities and industries while meeting stringent environmental regulations.',
      products: [
        { category: 'Coagulants & Flocculants', items: 'Poly Aluminium Chloride (PAC 18%, 30%), Aluminum Sulfate, Ferric Chloride, Polyacrylamide (Anionic/Cationic)' },
        { category: 'Disinfection', items: 'Calcium Hypochlorite (65-70%), TCCA (90%), Sodium Hypochlorite (12%), Chlorine Dioxide' },
        { category: 'RO Plant Chemicals', items: 'Antiscalants (Phosphonate/Polymer based), Membrane Cleaners (Acidic/Alkaline), Biocides' },
        { category: 'pH Control', items: 'Caustic Soda, Sulfuric Acid, Hydrochloric Acid, Sodium Carbonate' },
        { category: 'Specialty Chemicals', items: 'Activated Carbon, Ion Exchange Resins, Defoamers, Oxygen Scavengers' },
      ],
      applications: [
        'Drinking water treatment plants',
        'Sewage treatment plants (STP)',
        'Effluent treatment plants (ETP)',
        'Reverse osmosis (RO) systems',
        'Cooling tower treatment',
        'Boiler water treatment',
        'Industrial process water',
      ],
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      image: manufacturingImg,
      intro: 'Supporting manufacturing excellence with industrial chemicals that enhance productivity and product quality.',
      content: 'Manufacturing industries require consistent, high-quality chemicals to maintain production efficiency and product standards. Global Chemicals LLC delivers reliable industrial chemicals that support various manufacturing processes, from metal treatment to textile production.',
      products: [
        { category: 'Metal Treatment', items: 'Phosphating Chemicals, Degreasing Agents, Rust Inhibitors, Pickling Acids, Passivation Chemicals' },
        { category: 'Process Chemicals', items: 'Sulfuric Acid, Hydrochloric Acid, Nitric Acid, Caustic Soda, Ammonia Solution' },
        { category: 'Solvents', items: 'Acetone, MEK, IPA, Toluene, Xylene, Ethanol, Methanol' },
        { category: 'Surface Treatment', items: 'Chromating Agents, Anodizing Chemicals, Electroplating Chemicals' },
        { category: 'Specialty Additives', items: 'Antifoaming Agents, Dispersants, Emulsifiers, Stabilizers' },
      ],
      applications: [
        'Metal fabrication and finishing',
        'Automotive manufacturing',
        'Electronics production',
        'Textile and leather processing',
        'Plastic and rubber manufacturing',
        'Paint and coating production',
        'Paper and pulp industry',
      ],
    },
    {
      id: 'food-beverage',
      title: 'Food & Beverage',
      image: foodBeverageImg,
      intro: 'Food-grade chemicals that ensure safety, quality, and compliance in food and beverage production.',
      content: 'The food and beverage industry demands the highest standards of purity and safety. Global Chemicals LLC provides food-grade chemicals that meet international food safety standards, helping manufacturers maintain product quality while ensuring consumer safety.',
      products: [
        { category: 'Food Grade Acids', items: 'Citric Acid (Anhydrous/Monohydrate), Acetic Acid (Glacial), Phosphoric Acid (85%), Lactic Acid (80%)' },
        { category: 'Preservatives', items: 'Sodium Benzoate, Potassium Sorbate, Calcium Propionate, Sodium Metabisulfite' },
        { category: 'pH Regulators', items: 'Sodium Bicarbonate, Sodium Citrate, Potassium Citrate, Tartaric Acid' },
        { category: 'Processing Aids', items: 'Calcium Chloride, Magnesium Sulfate, Ammonium Bicarbonate' },
        { category: 'Cleaning & Sanitization', items: 'Peracetic Acid, Quaternary Ammonium Compounds, Sodium Hypochlorite (Food Grade)' },
      ],
      applications: [
        'Beverage production (soft drinks, juices, dairy)',
        'Bakery and confectionery',
        'Meat and seafood processing',
        'Fruit and vegetable preservation',
        'Brewery and distillery operations',
        'Food packaging and bottling lines',
        'CIP (Clean-In-Place) systems',
      ],
    },
    {
      id: 'pharmaceutical',
      title: 'Pharmaceuticals',
      image: pharmaceuticalImg,
      intro: 'USP/BP grade chemicals supporting pharmaceutical manufacturing and research with uncompromising quality.',
      content: 'The pharmaceutical industry requires chemicals of exceptional purity and consistency. Global Chemicals LLC supplies pharmaceutical-grade chemicals that meet USP, BP, and EP standards, supporting both drug manufacturing and research applications with complete documentation and traceability.',
      products: [
        { category: 'APIs and Excipients', items: 'USP/BP grade acids, bases, and salts' },
        { category: 'Solvents (Pharma Grade)', items: 'Acetone, Ethanol, IPA, Methanol, Chloroform' },
        { category: 'Buffer Solutions', items: 'Phosphate Buffers, Citrate Buffers, Acetate Buffers' },
        { category: 'Laboratory Reagents', items: 'ACS grade chemicals for analysis and testing' },
        { category: 'Process Chemicals', items: 'Purified water treatment chemicals, Clean room disinfectants' },
      ],
      applications: [
        'Drug formulation and manufacturing',
        'Quality control laboratories',
        'Research and development',
        'Tablet coating and granulation',
        'Injectable preparation',
        'Clean room maintenance',
        'Validation and testing',
      ],
    },
    {
      id: 'construction',
      title: 'Construction',
      image: constructionImg,
      intro: 'Building the future with specialized construction chemicals that enhance strength, durability, and performance.',
      content: 'Modern construction demands chemicals that improve concrete performance, protect structures, and accelerate project completion. Global Chemicals LLC provides a comprehensive range of construction chemicals that meet international building standards and enhance construction quality.',
      products: [
        { category: 'Concrete Admixtures', items: 'Superplasticizers, Retarders, Accelerators, Air Entraining Agents' },
        { category: 'Waterproofing', items: 'Integral Waterproofing Compounds, Crystalline Admixtures, Acrylic Polymers' },
        { category: 'Surface Treatment', items: 'Curing Compounds, Form Release Agents, Concrete Sealers' },
        { category: 'Repair & Protection', items: 'Epoxy Resins, Bonding Agents, Corrosion Inhibitors' },
        { category: 'Industrial Flooring', items: 'Self-Leveling Compounds, Hardeners, Anti-Slip Additives' },
      ],
      applications: [
        'Ready-mix concrete production',
        'Precast concrete manufacturing',
        'Infrastructure projects',
        'Marine construction',
        'Industrial flooring',
        'Repair and rehabilitation',
        'Tunneling and mining',
      ],
    },
    {
      id: 'swimming-pool',
      title: 'Swimming Pool',
      image: swimmingPoolImg,
      intro: 'Crystal clear, safe water for swimming pools, spas, and recreational facilities.',
      content: 'Maintaining pristine pool water requires the right chemical balance and consistent treatment. Global Chemicals LLC offers a complete range of pool chemicals that ensure safe, clear, and inviting water for commercial pools, resorts, and recreational facilities.',
      products: [
        { category: 'Sanitizers', items: 'Calcium Hypochlorite (HTH) 65-70%, TCCA Tablets (200g), Sodium Hypochlorite 12%' },
        { category: 'pH Control', items: 'pH Plus (Sodium Carbonate), pH Minus (Sodium Bisulfate), Muriatic Acid' },
        { category: 'Algaecides', items: 'Copper Sulfate, Quaternary Algaecides, Polyquat Algaecides' },
        { category: 'Water Balance', items: 'Calcium Chloride, Sodium Bicarbonate, Cyanuric Acid' },
        { category: 'Specialty Products', items: 'Clarifiers, Flocculants, Stain Removers, Enzyme Products' },
      ],
      applications: [
        'Hotel and resort pools',
        'Public swimming pools',
        'Water parks and aquatic centers',
        'Spa and wellness centers',
        'Residential complexes',
        'Sports facilities',
        'Fountain maintenance',
      ],
    },
    {
      id: 'laboratory',
      title: 'Laboratories',
      image: laboratoryImg,
      intro: 'High-purity chemicals and reagents for research, testing, and analytical laboratories.',
      content: 'Laboratories demand chemicals of exceptional purity and consistency for accurate analysis and research. Global Chemicals LLC supplies laboratory-grade chemicals that meet ACS, AR, and HPLC standards, supporting analytical, research, and quality control laboratories across industries.',
      products: [
        { category: 'Analytical Reagents (AR Grade)', items: 'Acids, Bases, Salts, Indicators' },
        { category: 'HPLC Solvents', items: 'Acetonitrile, Methanol, Water, Hexane' },
        { category: 'ACS Grade Chemicals', items: 'Meeting American Chemical Society specifications' },
        { category: 'Buffer Solutions', items: 'Pre-made and custom pH buffers' },
        { category: 'Specialty Reagents', items: 'Karl Fischer reagents, Complexometric titrants, Chromatography solvents' },
      ],
      applications: [
        'Quality control laboratories',
        'Research and development',
        'Environmental testing',
        'Food and water analysis',
        'Petrochemical testing',
        'Clinical laboratories',
        'Educational institutions',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Industry Chemicals Oman | Global Chemicals LLC</title>
        <meta name="description" content="Chemical solutions for water treatment, oil & gas, manufacturing, food, pharma & construction in Oman. Trusted by 200+ companies." />
        <meta name="keywords" content="oil gas chemicals Oman, water treatment Oman, industrial chemicals Muscat, food grade chemicals Oman, pharmaceutical chemicals Oman, construction chemicals Oman, pool chemicals Oman, laboratory chemicals Oman, chemical solutions Oman, Sohar industrial chemicals, PDO chemical supplier, Oman LNG chemicals" />
        <meta property="og:title" content="Chemical Solutions for Oman Industries | Global Chemicals LLC" />
        <meta property="og:description" content="Specialized chemicals for Oman's Oil & Gas, Water Treatment, Manufacturing, and more. ISO certified. Serving major industries across Oman." />
        <meta property="og:url" content="https://www.gcoman.com/industries" />
        <meta property="og:image" content="https://www.gcoman.com/og-image.jpg" />
        <link rel="canonical" href="https://www.gcoman.com/industries" />
      </Helmet>
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Industries We Serve
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Specialized chemical solutions for Oil & Gas, Water Treatment, Manufacturing, Food & Beverage, Pharmaceuticals, Construction, Pools, and Laboratories. 500+ products. ISO certified.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Tabs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="oil-gas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-12 h-auto gap-2 bg-transparent">
              {industries.map((industry) => (
                <TabsTrigger
                  key={industry.id}
                  value={industry.id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-3 px-4 text-sm"
                >
                  {industry.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {industries.map((industry) => (
              <TabsContent key={industry.id} value={industry.id} className="animate-fade-in">
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                  {/* Image */}
                  <div className="relative rounded-xl overflow-hidden shadow-2xl group">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-3xl font-bold text-white mb-2">{industry.title}</h2>
                      <p className="text-white/90 text-lg">{industry.intro}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <Card className="p-6 border-l-4 border-l-primary">
                      <p className="text-muted-foreground leading-relaxed">{industry.content}</p>
                    </Card>
                  </div>
                </div>

                {/* Key Products */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Key Products We Supply</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {industry.products.map((product, idx) => (
                      <Card key={idx} className="p-6 hover:shadow-lg transition-shadow border-border">
                        <h4 className="font-bold text-primary mb-3 text-lg">{product.category}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{product.items}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Applications */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-6">Applications</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {industry.applications.map((app, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Need a Custom Solution?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our technical team is ready to help you find the perfect chemical solution for your specific industry needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Contact Our Experts
              </a>
              <a
                href="/products"
                className="px-8 py-4 bg-card text-foreground border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Browse Products
              </a>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Industries;
