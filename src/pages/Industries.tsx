import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/SEO';
import { FAQStructuredData, BreadcrumbStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Shield, Award, MapPin, Droplets, Filter, Beaker, Thermometer, Sparkles, Factory, Building2, Waves, Clock, Users, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Import images
import oilGasImg from '@/assets/products/oil-gas.jpg';
import waterTreatmentImg from '@/assets/products/water-treatment.jpg';
import manufacturingImg from '@/assets/industries/manufacturing.jpg';
import foodBeverageImg from '@/assets/industries/food-beverage.jpg';
import pharmaceuticalImg from '@/assets/industries/pharmaceutical.jpg';
import constructionImg from '@/assets/industries/construction.jpg';
import swimmingPoolImg from '@/assets/industries/swimming-pool.jpg';
import laboratoryImg from '@/assets/industries/laboratory.jpg';

// Water Treatment Product Categories
const waterTreatmentCategories = [
  {
    title: 'Coagulants & Flocculants',
    description: 'Essential chemicals for removing suspended particles and turbidity from water',
    icon: Filter,
    products: ['Poly Aluminium Chloride (PAC 18%, 30%)', 'Aluminum Sulfate', 'Ferric Chloride', 'Polyacrylamide (Anionic/Cationic)']
  },
  {
    title: 'Disinfectants & Sanitizers',
    description: 'Powerful antimicrobial agents for water purification and sanitation',
    icon: Shield,
    products: ['Calcium Hypochlorite (65-70%)', 'TCCA (90%)', 'Sodium Hypochlorite (12%)', 'Chlorine Dioxide']
  },
  {
    title: 'pH Adjusters & Neutralizers',
    description: 'Chemicals for precise pH control in water treatment processes',
    icon: Beaker,
    products: ['Caustic Soda', 'Sulfuric Acid', 'Hydrochloric Acid', 'Sodium Carbonate']
  },
  {
    title: 'Scale & Corrosion Inhibitors',
    description: 'Protection chemicals for membranes, pipes, and equipment',
    icon: Thermometer,
    products: ['Antiscalants (Phosphonate/Polymer)', 'Corrosion Inhibitors', 'Oxygen Scavengers']
  },
  {
    title: 'Specialty Water Treatment',
    description: 'Specialized chemicals for specific water treatment challenges',
    icon: Sparkles,
    products: ['Activated Carbon', 'Ion Exchange Resins', 'Defoamers', 'Chelating Agents']
  }
];

// Water Treatment Service Areas
const serviceAreas = [
  { name: 'Muscat', description: 'Municipal water treatment, industrial facilities, hotels' },
  { name: 'Sohar Industrial Zone', description: 'Petrochemical plants, refineries, heavy industry' },
  { name: 'Rusayl Industrial Estate', description: 'Manufacturing plants, food processing, pharmaceuticals' },
  { name: 'Duqm SEZ', description: 'Desalination plants, port facilities, industrial complex' },
  { name: 'Salalah', description: 'Port operations, cement industry, agricultural applications' },
  { name: 'Sur', description: 'LNG facilities, marine applications, municipal treatment' }
];

// Water Treatment FAQs
const waterTreatmentFaqs = [
  {
    question: 'What are the best water treatment chemicals for desalination plants in Oman?',
    answer: 'For desalination plants in Oman, we recommend a combination of antiscalants (to prevent membrane scaling), biocides (for microbiological control), and pH adjustment chemicals like caustic soda and sulphuric acid. Our technical team can design a customized chemical program for your specific desalination system, whether RO, MSF, or MED technology.'
  },
  {
    question: 'How do I choose the right coagulant for water treatment?',
    answer: 'The choice of coagulant depends on your water source characteristics, turbidity levels, and treatment objectives. Poly Aluminium Chloride (PAC) is effective for a wide pH range and produces less sludge. Aluminium Sulphate is cost-effective for general municipal applications. Ferric Chloride works well for high organic content water. Contact our technical team for jar testing and optimal coagulant selection.'
  },
  {
    question: 'What chemicals are needed for cooling tower water treatment in Oman?',
    answer: "Cooling tower treatment in Oman's hot climate requires: scale inhibitors (to prevent calcium carbonate scaling), corrosion inhibitors (to protect metal components), biocides (to control Legionella and biofilm), and pH adjusters. Our cooling water treatment program includes regular monitoring and chemical optimization for maximum efficiency."
  },
  {
    question: 'Are your water treatment chemicals approved for use in Oman?',
    answer: "Yes, all our water treatment chemicals comply with Oman's regulatory requirements. We hold JSRS certification (Joint Supplier Registration System) for oil & gas applications and are ICV compliant. Our products meet international standards including NSF/ANSI certifications for drinking water applications."
  },
  {
    question: 'Do you supply water treatment chemicals in bulk to industrial zones?',
    answer: 'Yes, we maintain local stock in our Ghala (Muscat) warehouse and provide bulk supply to all industrial zones including Sohar Industrial Zone, Rusayl Industrial Estate, Duqm SEZ, and Salalah. We offer flexible packaging from 25kg bags to IBC tanks and bulk tanker delivery.'
  }
];

// Water Treatment Applications
const waterTreatmentApplications = [
  {
    title: 'Desalination Plants',
    icon: Waves,
    description: 'Antiscalants, biocides, and pH adjusters for RO, MSF, and MED desalination systems across Oman.',
    chemicals: ['Antiscalant', 'Biocide', 'Sulphuric Acid', 'Caustic Soda']
  },
  {
    title: 'Municipal Water Treatment',
    icon: Building2,
    description: 'Coagulants, flocculants, and disinfectants for municipal water treatment plants.',
    chemicals: ['PAC', 'Aluminium Sulphate', 'Calcium Hypochlorite', 'Chlorine']
  },
  {
    title: 'Industrial Wastewater',
    icon: Factory,
    description: 'Complete chemical programs for industrial effluent treatment and compliance.',
    chemicals: ['Ferric Chloride', 'Polyelectrolyte', 'pH Adjusters', 'Defoamers']
  },
  {
    title: 'Cooling Towers',
    icon: Thermometer,
    description: 'Scale inhibitors, corrosion inhibitors, and biocides for cooling water systems.',
    chemicals: ['Scale Inhibitor', 'Corrosion Inhibitor', 'Biocide', 'Dispersant']
  },
  {
    title: 'Boiler Water Treatment',
    icon: Beaker,
    description: 'Oxygen scavengers, phosphates, and polymers for boiler water conditioning.',
    chemicals: ['Oxygen Scavenger', 'Phosphate', 'Polymer', 'Caustic Soda']
  },
  {
    title: 'Swimming Pools',
    icon: Droplets,
    description: 'Sanitizers, pH adjusters, and algaecides for commercial swimming pools.',
    chemicals: ['Calcium Hypochlorite', 'Hydrochloric Acid', 'Algaecide', 'Clarifier']
  }
];

const Industries = () => {
  const { t } = useTranslation();

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
      intro: 'Oman\'s leading water treatment chemicals supplier. JSRS certified, ICV compliant. Serving desalination, municipal & industrial water treatment.',
      content: 'Global Chemicals LLC is Oman\'s premier supplier of water treatment chemicals, serving municipal water treatment plants, industrial facilities, desalination plants, and commercial establishments across the Sultanate. With our JSRS certification and ICV compliance, we are the trusted partner for critical water treatment applications in the oil & gas sector and beyond.',
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
      isHub: true,
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
      <SEO
        title="Chemical Solutions by Industry | Oman & GCC | Global Chemicals LLC"
        description="Water treatment, oilfield, manufacturing, food & lab chemicals in Oman & GCC — UAE, Saudi Arabia, Qatar, Kuwait, Bahrain. JSRS certified, ISO 9001. Request a quote today."
        keywords="water treatment chemicals Oman UAE, water treatment chemicals GCC, oil gas chemicals Middle East, industrial chemicals Dubai Riyadh, food grade chemicals GCC, pharmaceutical chemicals Oman, construction chemicals Middle East, pool chemicals UAE, chemical solutions GCC, oilfield chemicals Saudi Arabia, PDO chemical supplier, caustic soda UAE, calcium hypochlorite GCC, antiscalant Middle East, desalination chemicals GCC, JSRS certified chemical supplier"
        ogTitle="Chemical Solutions for GCC Industries | Oman, UAE, Saudi Arabia | Global Chemicals"
        ogDescription="JSRS & ISO certified supplier of water treatment, oil & gas, and industrial chemicals serving Oman, UAE, Saudi Arabia, Qatar, Kuwait & Bahrain."
        ogUrl="https://gcoman.com/industries"
        canonical="https://gcoman.com/industries"
      />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://gcoman.com/' },
        { name: 'Industries', url: 'https://gcoman.com/industries' },
      ]} />
      <FAQStructuredData faqs={waterTreatmentFaqs} />
      <SpeakableStructuredData url="https://gcoman.com/industries" cssSelector={["h1", "h2", ".speakable"]} />
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-secondary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('industries.title')}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('industries.heroDesc')}
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
                {/* Standard Industry Content */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                  {/* Image */}
                  <div className="relative rounded-xl overflow-hidden shadow-2xl group">
                    <img
                      src={industry.image}
                      alt={industry.title}
                      width={800}
                      height={400}
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h2 className="text-3xl font-bold text-white mb-2">{industry.title}</h2>
                      <p className="text-white/90 text-lg">{industry.intro}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    {/* Trust Badges for Water Treatment */}
                    {industry.id === 'water-treatment' && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5">
                          <Shield className="w-3.5 h-3.5 mr-1.5" />
                          JSRS Certified
                        </Badge>
                        <Badge className="bg-primary/10 border-primary/30 text-primary px-3 py-1.5">
                          <Award className="w-3.5 h-3.5 mr-1.5" />
                          ICV Compliant
                        </Badge>
                        <Badge className="bg-secondary/10 border-secondary/30 text-secondary-foreground px-3 py-1.5">
                          <MapPin className="w-3.5 h-3.5 mr-1.5" />
                          Local Stock in Muscat
                        </Badge>
                      </div>
                    )}
                    <Card className="p-6 border-l-4 border-l-primary">
                      <p className="text-muted-foreground leading-relaxed">{industry.content}</p>
                    </Card>
                  </div>
                </div>

                {/* Key Products */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-foreground mb-6">{t('industries.keyProducts')}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {industry.products.map((product, idx) => (
                      <Card key={idx} className="p-6 hover:shadow-lg transition-shadow logo-gradient-border relative">
                        <h4 className="font-bold text-primary mb-3 text-lg">{product.category}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{product.items}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Applications */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-foreground mb-6">{t('industries.applications')}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {industry.applications.map((app, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{app}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Water Treatment Hub Content */}
                {industry.id === 'water-treatment' && (
                  <>
                    {/* Product Categories */}
                    <div className="mb-16">
                      <h3 className="text-2xl font-bold text-foreground mb-4">Water Treatment Chemical Categories</h3>
                      <p className="text-muted-foreground mb-8">Comprehensive range of water treatment solutions for every application</p>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {waterTreatmentCategories.map((category, index) => {
                          const Icon = category.icon;
                          return (
                            <Card key={index} className="hover:shadow-lg transition-shadow logo-gradient-border relative">
                              <CardHeader>
                                <div className="flex items-center gap-3">
                                  <div className="p-3 rounded-lg bg-primary/10">
                                    <Icon className="w-6 h-6 text-primary" />
                                  </div>
                                  <CardTitle className="text-xl">{category.title}</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-muted-foreground mb-4">{category.description}</p>
                                <ul className="space-y-2">
                                  {category.products.map((product, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                      {product}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Water Treatment Applications */}
                    <div className="mb-16 py-12 bg-muted/30 -mx-4 px-4 rounded-xl">
                      <h3 className="text-2xl font-bold text-foreground mb-4 text-center">Water Treatment Applications in Oman</h3>
                      <p className="text-muted-foreground mb-8 text-center">Tailored chemical solutions for every water treatment challenge</p>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {waterTreatmentApplications.map((app, index) => {
                          const Icon = app.icon;
                          return (
                            <Card key={index} className="logo-gradient-border relative">
                              <CardHeader>
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-primary/10">
                                    <Icon className="w-5 h-5 text-primary" />
                                  </div>
                                  <CardTitle className="text-lg">{app.title}</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <p className="text-muted-foreground text-sm mb-4">{app.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {app.chemicals.map((chem, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {chem}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    {/* Service Areas */}
                    <div className="mb-16">
                      <h3 className="text-2xl font-bold text-foreground mb-4">Service Areas Across Oman</h3>
                      <p className="text-muted-foreground mb-8">Rapid delivery from our Muscat warehouse to all industrial zones</p>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {serviceAreas.map((area, index) => (
                          <div 
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                          >
                            <div className="p-2 rounded-full bg-primary/10">
                              <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{area.name}</h4>
                              <p className="text-sm text-muted-foreground">{area.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="mb-16 py-12 bg-gradient-to-br from-primary/5 to-secondary/5 -mx-4 px-4 rounded-xl">
                      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Why Choose Global Chemicals for Water Treatment?</h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                          {
                            icon: Shield,
                            title: 'JSRS Certified',
                            description: 'Approved supplier for Oman oil & gas sector with full regulatory compliance'
                          },
                          {
                            icon: MapPin,
                            title: 'Local Stock',
                            description: 'Warehouse in Muscat for immediate availability and rapid delivery'
                          },
                          {
                            icon: Users,
                            title: 'Technical Support',
                            description: 'Expert consultation, jar testing, and dosing optimization services'
                          },
                          {
                            icon: Clock,
                            title: 'Reliable Supply',
                            description: '10+ years experience ensuring consistent quality and availability'
                          }
                        ].map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <div key={index} className="text-center">
                              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                                <Icon className="w-8 h-8 text-primary" />
                              </div>
                              <h4 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h4>
                              <p className="text-muted-foreground">{item.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* FAQs */}
                    <div className="mb-16">
                      <h3 className="text-2xl font-bold text-foreground mb-4 text-center">Frequently Asked Questions</h3>
                      <p className="text-muted-foreground mb-8 text-center">Common questions about water treatment chemicals in Oman</p>
                      <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4">
                          {waterTreatmentFaqs.map((faq, index) => (
                            <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                              <AccordionTrigger className="text-left hover:no-underline">
                                <span className="font-medium">{faq.question}</span>
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center py-8 bg-muted/30 rounded-xl">
                      <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Optimize Your Water Treatment?</h3>
                      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Contact our technical team for expert consultation, product recommendations, and competitive pricing for your water treatment chemical requirements.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/contact">
                          <Button size="lg">
                            <Phone className="w-5 h-5 mr-2" />
                            Request a Quote
                          </Button>
                        </Link>
                        <Link to="/products?category=water-treatment">
                          <Button size="lg" variant="outline">
                            View All Products
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('industries.needCustomSolution')}</h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t('industries.customSolutionDesc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                {t('industries.contactExperts')}
              </a>
              <a
                href="/products"
                className="px-8 py-4 bg-card text-foreground border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                {t('industries.browseProducts')}
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