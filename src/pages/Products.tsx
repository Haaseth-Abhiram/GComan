import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { loadProductsByCategory, loadAllProducts } from '@/data/productLoader';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube, Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound, Flame, Wind, Wine, ChevronRight, Shield, SprayCan, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'react-router-dom';
import { AISearchDialog } from '@/components/AISearchDialog';
import { ProductCard } from '@/components/products/ProductCard';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData, FAQStructuredData, SpeakableStructuredData, ItemListStructuredData } from '@/components/StructuredData';
import { trackSearch } from '@/components/GoogleAnalytics';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// FAQ structured data for products page — targets high-intent procurement queries
const productsFAQs = [
  {
    question: "What chemical products does Global Chemicals LLC supply in Oman?",
    answer: "Global Chemicals LLC supplies 263+ industrial and specialty chemicals in Oman including water treatment chemicals (PAC, caustic soda, calcium hypochlorite, antiscalants), industrial lubricants (Shell, Mobil, Castrol), laboratory chemicals (AR grade, HPLC solvents), oilfield chemicals (corrosion inhibitors, demulsifiers, H2S scavengers), swimming pool chemicals, food-grade chemicals, RO chemicals, and construction chemicals."
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

// Category-specific FAQ overrides — replaces the generic sitewide FAQ on
// category pages so structured-data is topically relevant (Google devalues
// duplicated FAQ markup reused across many URLs).
const categoryFAQs: Record<string, { question: string; answer: string }[]> = {
  agro: [
    {
      question: "What agricultural chemicals and fertilizers does Global Chemicals LLC supply in Oman?",
      answer: "We supply straight and compound fertilizers (urea 46% N, DAP 18-46-0, NPK 20-20-20 / 19-19-19 / 15-15-15, potassium chloride 60% K2O, calcium nitrate 15.5% N), micronutrients (zinc sulphate monohydrate 33% Zn, chelated iron, manganese, boron), soil amendments (agricultural gypsum, humic acid, leonardite extract), and irrigation water treatment chemicals for drip systems (acid pH correction, antiscalants, algaecides). Custom NPK blending, soil and irrigation water analysis, and Oman Ministry of Agriculture-approved import documentation available."
    },
    {
      question: "Which fertilizer is best for date palms in Oman?",
      answer: "Date palms in Oman require a balanced NPK program with heavy potassium emphasis. A typical annual program per mature tree: 2–3 kg urea (46% N) split across three applications, 1–2 kg DAP (18-46-0) at winter dormancy break, and 3–5 kg potassium chloride (60% K2O) split at fruit set and fruit development — potassium is critical for fruit sizing, sugar accumulation, and post-harvest storage quality. Add zinc sulphate (100–200 g/tree) every 2–3 years to correct the near-universal zinc deficiency in Oman's alkaline soils. Apply via basin flooding or fertigation through drip emitters."
    },
    {
      question: "How is calcium nitrate used to prevent blossom-end rot in greenhouse tomatoes?",
      answer: "Blossom-end rot in Oman greenhouse tomatoes is caused by localised calcium deficiency during rapid fruit expansion — often when high transpiration in summer greenhouses draws calcium to leaves instead of fruit. Continuous fertigation with calcium nitrate (15.5% N, 26.5% CaO) at 150–200 ppm Ca in the drip solution supplies steady calcium throughout the fruiting cycle. Weekly foliar sprays (0.3–0.5% calcium nitrate) supplement soil supply during peak fruit-set weeks. Calcium nitrate is the only widely-available calcium source fully compatible with fertigation — it dissolves clearly and delivers nitrate-nitrogen, which crops prefer over ammonium in alkaline substrates."
    },
    {
      question: "How does agricultural gypsum reclaim sodic soils in Oman?",
      answer: "Sodic soils are widespread in Oman where saline groundwater irrigation has raised exchangeable sodium above 15% of cation exchange capacity, destroying soil aggregate structure and reducing water infiltration to near zero. Agricultural gypsum (calcium sulphate dihydrate, 23% Ca) supplies soluble calcium that displaces adsorbed sodium from clay exchange sites; the displaced sodium is then leached out with excess irrigation water. Typical reclamation rate is 2–10 tonnes/ha depending on soil texture and sodium adsorption ratio, followed by heavy leaching irrigation. Structure and infiltration usually recover within one cropping season, and gypsum also supplies calcium and sulphur as a non-acidifying nutrient source."
    },
    {
      question: "Do you supply Ministry of Agriculture-approved fertilizers to Omani farms?",
      answer: "Yes. All fertilizers and agricultural chemicals supplied by Global Chemicals LLC carry Oman Ministry of Agriculture, Fisheries Wealth and Water Resources import approvals and are backed by Certificates of Analysis, Safety Data Sheets (GHS-compliant, English and Arabic), and, where applicable, food/feed-grade documentation. We deliver to farms across Al Batinah, Al Dakhiliyah, Al Sharqiyah, Dhofar, and Musandam, and offer soil and irrigation water analysis to match the fertilizer program to your specific field conditions."
    }
  ]
};

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

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Sync URL category param → active filter when navigating between category routes
  useEffect(() => {
    setActiveCategory(categoryParam || 'all');
  }, [categoryParam]);

  // Lazy-load products: only the active category (or all if no filter)
  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    const loader = categoryParam
      ? loadProductsByCategory(categoryParam)
      : loadAllProducts();
    loader
      .then((data) => {
        if (cancelled) return;
        setProducts(data as Product[]);
        setProductsLoading(false);
      })
      .catch((err) => {
        // safeImport already handles stale-chunk reloads; this just ensures we
        // don't get stuck on a spinner if the import fails for any other reason.
        console.error('[Products] Failed to load product data:', err);
        if (cancelled) return;
        setProducts([]);
        setProductsLoading(false);
      });
    return () => { cancelled = true; };
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
    const trimmedQuery = searchQuery.trim();
    // Search is global: when the user has typed a query, ignore the active
    // category so they don't get an empty page when their term lives in a
    // sibling category (e.g. searching "PAC" while on Oilfield).
    let filtered = products;
    if (!trimmedQuery && activeCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === activeCategory);
    }

    if (trimmedQuery) {
      const query = trimmedQuery.toLowerCase();
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
    // `products` MUST be in deps — otherwise the memo returns its initial empty
    // result after the lazy JSON loader resolves, and prerendered category pages
    // ship with "No products available" baked in.
  }, [activeCategory, searchQuery, products]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={(() => {
          const categoryTitles: Record<string, string> = {
            'water-treatment': 'Water Treatment Chemicals Oman & GCC | GC Oman',
            'lubricants': 'Industrial Lubricants Oman & Middle East | GC Oman',
            'swimming-pool': 'Swimming Pool Chemicals Oman & GCC | GC Oman',
            'lab-chemicals': 'Laboratory Chemicals Oman & Middle East | GC Oman',
            'oilfield': 'Oilfield & Refinery Chemicals Oman & GCC | GC Oman',
            'tank-cleaners': 'Marine & Industrial Tank Cleaners Oman | GC Oman',
            'soap-detergent': 'Soap & Detergent Chemicals Oman & GCC | GC Oman',
            'food-beverage': 'Food & Beverage Grade Chemicals Oman & GCC | GC Oman',
            'cooling-water': 'Cooling Water Chemicals Oman & GCC | GC Oman',
            'corrosion-inhibitor': 'Corrosion Inhibitors Oman & Middle East | GC Oman',
            'ro-chemicals': 'RO Plant Chemicals Oman & GCC | GC Oman',
            'solvents': 'Industrial Solvents Oman & Middle East | GC Oman',
            'inorganic': 'Inorganic Chemicals Oman & GCC | GC Oman',
            'construction': 'Construction Chemicals Oman & GCC | GC Oman',
            'alcohols': 'Industrial Alcohols Oman & GCC | GC Oman',
            'glycols': 'Glycols Supplier Oman & GCC | GC Oman',
            'ethanolamines': 'Ethanolamines Supplier Oman & GCC | GC Oman',
            'chlorinated': 'Chlorinated Solvents Oman & GCC | GC Oman',
            'lab-equipment': 'Laboratory Equipment Oman & GCC | GC Oman',
            'calcium-carbonate': 'Calcium Carbonate Supplier Oman & GCC | GC Oman',
            'agro': 'Agricultural Chemicals Oman & GCC | GC Oman',
            'additives': 'Chemical Additives Oman & GCC | GC Oman'
          };
          return categoryTitles[activeCategory] || 'Industrial Chemicals Supplier Oman & GCC | GC Oman';
        })()}
        description={(() => {
          const categoryDescs: Record<string, string> = {
            'water-treatment': 'Water treatment chemicals in Oman & GCC — PAC, caustic soda, calcium hypochlorite, antiscalants. Fast delivery across Muscat, Dubai & Riyadh.',
            'lubricants': 'Shell, Mobil, Castrol & GP lubricants supplier in Oman & Middle East. Industrial and automotive grades with same-day Muscat delivery.',
            'swimming-pool': 'Swimming pool chemicals in Oman & GCC — chlorine tablets, algaecides, TCCA, sodium hypochlorite. Fast delivery across Muscat, Dubai & Riyadh.',
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
        ogTitle={(() => {
          const categoryOgTitles: Record<string, string> = {
            'agro': 'Agricultural Chemicals & Fertilizers Supplier | Oman & GCC',
          };
          if (categoryOgTitles[activeCategory]) return categoryOgTitles[activeCategory];
          return activeCategory !== 'all'
            ? `${activeCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Global Chemicals LLC Oman & GCC`
            : 'Chemical Products | Industrial Chemicals Oman & Middle East | Global Chemicals LLC';
        })()}
        ogDescription={(() => {
          const categoryOgDescs: Record<string, string> = {
            'agro': 'Fertilizers, micronutrients, soil amendments and irrigation chemicals for Oman farms — urea, DAP, NPK, potassium chloride, calcium nitrate, zinc sulphate, gypsum, humic acid.',
          };
          return categoryOgDescs[activeCategory] ||
            'Leading chemical supplier in Oman exporting to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain. Browse our complete catalog of water treatment chemicals, industrial lubricants, and specialty chemicals.';
        })()}
        ogUrl={categoryParam ? `https://gcoman.com/products/${categoryParam}` : 'https://gcoman.com/products'}
        canonical={categoryParam ? `https://gcoman.com/products/${categoryParam}` : 'https://gcoman.com/products'}
      />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://gcoman.com/' },
        { name: 'Products', url: 'https://gcoman.com/products' },
        ...(categoryParam ? [{ name: categoryParam.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), url: `https://gcoman.com/products/${categoryParam}` }] : [])
      ]} />
      <FAQStructuredData faqs={categoryParam && categoryFAQs[categoryParam] ? categoryFAQs[categoryParam] : productsFAQs} />
      <SpeakableStructuredData url={categoryParam ? `https://gcoman.com/products/${categoryParam}` : 'https://gcoman.com/products'} cssSelector={["h1", "h2", ".speakable"]} />
      {categoryParam && filteredProducts.length > 0 && (
        <ItemListStructuredData
          name={(() => {
            const categoryTitles: Record<string, string> = {
              'water-treatment': 'Water Treatment Chemicals — Oman & GCC',
              'lubricants': 'Industrial Lubricants & Greases — Oman & GCC',
              'swimming-pool': 'Swimming Pool Chemicals — Oman & GCC',
              'lab-chemicals': 'Laboratory Chemicals & Reagents — Oman',
              'oilfield': 'Oilfield & Refinery Chemicals — Oman & GCC',
              'tank-cleaners': 'Marine & Industrial Tank Cleaners — Oman & GCC',
              'soap-detergent': 'Soap & Detergent Raw Materials — Oman & GCC',
              'food-beverage': 'Food & Beverage Grade Chemicals — Oman & GCC',
              'cooling-water': 'Cooling Water Treatment Chemicals — Oman & GCC',
              'corrosion-inhibitor': 'Corrosion Inhibitors — Oman & GCC',
              'ro-chemicals': 'RO Plant Chemicals — Oman & GCC',
              'solvents': 'Industrial Solvents — Oman & GCC',
              'inorganic': 'Inorganic Chemicals — Oman & GCC',
              'construction': 'Construction Chemicals — Oman & GCC',
              'alcohols': 'Industrial Alcohols — Oman & GCC',
              'glycols': 'Glycols — Oman & GCC',
              'ethanolamines': 'Ethanolamines — Oman & GCC',
              'chlorinated': 'Chlorinated Solvents — Oman & GCC',
              'lab-equipment': 'Laboratory Equipment — Oman & GCC',
              'calcium-carbonate': 'Calcium Carbonate — Oman & GCC',
              'agro': 'Agricultural Chemicals — Oman & GCC',
              'additives': 'Chemical Additives — Oman & GCC',
            };
            return categoryTitles[categoryParam] || `${categoryParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} — Global Chemicals LLC Oman`;
          })()}
          description={`Product catalogue for ${categoryParam.replace(/-/g, ' ')} chemicals supplied by Global Chemicals LLC in Oman and the GCC region.`}
          url={`https://gcoman.com/products/${categoryParam}`}
          items={filteredProducts.map(p => ({
            id: p.id,
            title: p.title,
            url: `https://gcoman.com/products/${p.category}/${p.id}`,
            description: p.description,
          }))}
        />
      )}

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

      {/* Category Intro Block — unique content per category for SEO */}
      {activeCategory !== 'all' && (() => {
        const categoryIntros: Record<string, { heading: string; body: string }> = {
          'water-treatment': {
            heading: 'Water Treatment Chemicals Supplier in Oman & GCC',
            body: 'Global Chemicals LLC supplies a comprehensive range of water treatment chemicals to municipal water utilities, industrial plants, hotels, and desalination facilities across Oman and the GCC. Our water treatment portfolio covers coagulants (PAC — Poly Aluminium Chloride, aluminium sulphate), disinfectants (calcium hypochlorite, sodium hypochlorite, chlorine tablets), pH adjustment chemicals (caustic soda flakes, soda ash, sulphuric acid), antiscalants for RO and desalination systems, corrosion inhibitors, biocides, antifoams, and flocculants. All products are supplied with GHS-compliant SDS and CoA. Same-day delivery in Muscat; next-day delivery to Sohar and Salalah. JSRS certified for supply to PDO and OQ water treatment operations.'
          },
          'lubricants': {
            heading: 'Shell, Mobil, Castrol & GP Lubricants Supplier in Oman',
            body: "Global Chemicals LLC is an authorised distributor of Shell, Mobil, Castrol, and GP (IPOL) lubricants in Muscat, Oman — stocking engine oils, hydraulic oils, gear oils, greases, compressor oils, and transmission fluids for automotive, industrial, and heavy-duty applications. All branded lubricants are 100% genuine, supplied with original Certificate of Analysis and GHS Safety Data Sheet. We serve oil & gas operators (PDO, OQ, Oman LNG), construction fleets, manufacturing plants, and logistics companies across Oman. Available in 1L, 20L, 208L drums, and IBC containers. Same-day delivery in Muscat."
          },
          'oilfield': {
            heading: 'Oilfield & Refinery Chemicals Supplier — JSRS Certified Oman',
            body: "Global Chemicals LLC is JSRS (Joint Supplier Registration System) certified, qualifying us to supply chemicals directly to Petroleum Development Oman (PDO), OQ, OPAL, Occidental (Oxy), and their approved contractors. Our oilfield chemicals range includes corrosion inhibitors, scale inhibitors, H2S scavengers, demulsifiers, wax inhibitors, biocides, drilling fluid additives (bentonite, CMC, barite), well stimulation chemicals, and production chemicals for Oman's upstream and midstream oil & gas sector. We supply field operations across South Oman (Marmul, Nimr, Qarn Alam), the Duqm Refinery zone, and Sohar Refinery. Rapid supply chain with emergency delivery capability."
          },
          'swimming-pool': {
            heading: 'Swimming Pool Chemicals Supplier in Oman — Muscat & Nationwide',
            body: "Global Chemicals LLC supplies swimming pool treatment chemicals across Oman, serving hotel pools, residential developments, water parks, school facilities, and public pools in Muscat, Sohar, Salalah, and Nizwa. Our pool chemicals range covers chlorine tablets (TCCA 90% — 200g and 500g), calcium hypochlorite granules, sodium hypochlorite 12–15%, algaecides (liquid and tablet), pH reducers (sodium bisulphate), pH raisers (soda ash), stabilisers (cyanuric acid), and complete pool starter kits. Oman's high UV and temperatures require frequent chemical dosing — our team provides free dosing guidance and technical support for all pool types."
          },
          'lab-chemicals': {
            heading: 'Laboratory Chemicals & Reagents Supplier in Oman',
            body: "Global Chemicals LLC supplies laboratory-grade chemicals, analytical reagents, and HPLC solvents to quality control laboratories, research facilities, university laboratories, and testing centres across Oman. Our lab chemicals range covers analytical reagent (AR) grade acids (sulphuric, hydrochloric, nitric, acetic, phosphoric), AR grade bases (sodium hydroxide, potassium hydroxide), organic solvents (acetone, methanol, ethanol absolute, IPA, hexane, toluene, dichloromethane, chloroform), inorganic salts and standards, indicators, buffers, culture media (agar, glucose, peptone), and microbiological reagents. SDS and CoA supplied with every batch. Minimum order from 500ml/100g."
          },
          'soap-detergent': {
            heading: 'Soap & Detergent Raw Materials Supplier in Oman & GCC',
            body: "Global Chemicals LLC supplies soap and detergent manufacturing raw materials to producers across Oman, UAE, and the wider GCC region. Our soap and detergent chemicals portfolio includes caustic soda (NaOH) in flakes, prills, and liquid forms — the primary raw material for saponification; LABSA (Linear Alkylbenzene Sulphonic Acid) and SLES 70% (Sodium Laureth Sulphate) for surfactant-based formulations; soda ash dense and light (sodium carbonate) for detergency building; glycerine, EDTA, STPP (sodium tripolyphosphate), sodium metasilicate, and hydrogen peroxide in various concentrations. Bulk pricing available for regular manufacturers. Technical formulation support available on request."
          },
          'food-beverage': {
            heading: 'Food-Grade Chemicals Supplier in Oman — HACCP & Halal Compatible',
            body: "Global Chemicals LLC supplies food-grade (food contact quality) chemicals to food manufacturers, beverage producers, bakeries, dairy facilities, and food processing plants across Oman. Our food-grade chemicals meet international food safety standards including HACCP, EU/FCC food chemical standards, and are Halal-compatible. Products include food-grade caustic soda (E524), citric acid anhydrous and monohydrate (E330), ascorbic acid (E300 Vitamin C), sodium bicarbonate (E500), propylene glycol food grade (E1520), xanthan gum (E415), potassium sorbate (E202), sodium hypochlorite food grade for CIP cleaning, and ethanol 70% (food equipment sanitiser). CoA, food safety datasheet, and HACCP compliance documentation available."
          },
          'ro-chemicals': {
            heading: 'RO Membrane Chemicals & Antiscalant Supplier in Oman',
            body: "Global Chemicals LLC supplies reverse osmosis (RO) membrane chemicals to desalination plants, industrial RO systems, and commercial water treatment facilities across Oman. Oman has one of the highest per-capita RO infrastructure densities in the world — and the country's specific water chemistry (high TDS brackish groundwater, high-TDS seawater) creates significant membrane fouling and scaling challenges. Our RO chemical range includes antiscalants (specifically formulated for Oman's high-sulphate brackish water), membrane cleaners (alkaline and acidic grades for biofouling, carbonate, and silica removal), passivation agents (for new membrane commissioning), and descalants. Technical dosing programmes and RO system optimisation support available."
          },
          'corrosion-inhibitor': {
            heading: 'Corrosion Inhibitors Supplier — Oman, UAE & GCC',
            body: "Global Chemicals LLC supplies a comprehensive range of corrosion inhibitors for closed-loop cooling systems, boilers, chilled water systems, oilfield pipelines, and industrial process equipment across Oman and the GCC. Oman's high-temperature environment and often aggressive water chemistry (high chlorides, high TDS) accelerate metal corrosion in plant and infrastructure — making effective corrosion inhibitor programmes critical for asset protection and operational efficiency. Our range includes molybdate-based, phosphonate-based, and azole-based inhibitors for ferrous and non-ferrous metals, oxygen scavengers for boiler systems, pH boosters, and multi-metal corrosion inhibitors for mixed-metallurgy systems."
          },
          'tank-cleaners': {
            heading: 'Marine & Industrial Tank Cleaners Supplier in Oman',
            body: "Global Chemicals LLC supplies heavy-duty tank cleaning chemicals for vessel cargo holds, marine fuel tanks, industrial storage tanks, and process vessels across Oman's ports (Muscat, Sohar, Duqm, Salalah). Our tank cleaner range covers alkaline degreasers for petroleum and hydrocarbon residues, acid descalants for scale and rust removal, neutral cleaners for food-grade tanks and sensitive linings, sludge emulsifiers for crude oil tank bottoms, passivation liquids for stainless steel and carbon steel tanks, and environmental discharge-safe formulations meeting MARPOL requirements. Technical data sheets and application guidance available for all products."
          },
          'cooling-water': {
            heading: 'Cooling Tower & Chilled Water Treatment Chemicals in Oman',
            body: "Cooling towers and chilled water systems operating in Oman's extreme climate — ambient temperatures above 45°C, high evaporation rates, and varying water quality — require robust chemical treatment programmes to prevent scale, corrosion, and biological fouling (including Legionella). Global Chemicals LLC supplies a complete range of cooling water treatment chemicals: broad-spectrum biocides and algaecides, corrosion and scale inhibitors, antifouling agents, drift eliminators, and pH control chemicals. We serve district cooling plants, HVAC systems in hotels and malls, process cooling in manufacturing, and power plant cooling water systems across Oman."
          },
          'construction': {
            heading: 'Construction Chemicals & Concrete Admixtures Supplier in Oman',
            body: "Global Chemicals LLC supplies construction chemicals and concrete admixtures to civil contractors, ready-mix concrete plants, precast yards, and infrastructure projects across Oman and the GCC. Our construction range covers superplasticisers and high-range water reducers for high-strength and self-compacting concrete, retarders and accelerators for hot-weather and cold-joint pours, air-entraining agents, integral waterproofing admixtures, curing compounds, bonding agents and epoxy adhesives, non-shrink grouts, tile adhesives, and concrete repair mortars. Oman's hot, arid climate makes admixture selection critical — our technical team advises on dosing for ambient temperatures above 40°C and aggressive sulphate-bearing groundwater commonly encountered in coastal and Batinah projects."
          },
          'solvents': {
            heading: 'Industrial Solvents Supplier in Oman, UAE & GCC',
            body: "Global Chemicals LLC is a leading industrial solvents supplier in Oman, stocking high-purity acetone, methanol, ethanol, isopropanol (IPA), toluene, xylene, n-hexane, methyl ethyl ketone (MEK), ethyl acetate, white spirit, and dichloromethane. We serve paints and coatings manufacturers, printing inks producers, pharmaceutical compounders, electronics assembly facilities, adhesive and sealant makers, and oilfield service companies across Oman, UAE, Saudi Arabia, and Qatar. All solvents come with batch-level Certificates of Analysis confirming purity (typically ≥99%), water content, and residue. Available in 20L jerricans, 200L drums, and IBCs; bulk road-tanker delivery available for repeat industrial buyers."
          },
          'inorganic': {
            heading: 'Inorganic Chemicals Supplier in Oman & GCC',
            body: "Global Chemicals LLC supplies a comprehensive range of inorganic chemicals — sodium nitrite, sodium nitrate, potassium chloride, potassium nitrate, borax (sodium tetraborate), boric acid, silica gel, sodium thiosulphate, ferrous sulphate, ferric chloride, copper sulphate, and zinc sulphate — to manufacturing, water treatment, metallurgy, and laboratory customers in Oman, UAE, and the wider GCC. Our inorganic salts and oxides are sourced from quality-audited producers and supplied with batch-level Certificates of Analysis. Available in 25kg bags, 50kg sacks, and 1-tonne jumbo bags. Technical-grade and AR-grade options stocked; food-grade and pharma-grade variants available on indent."
          },
          'chlorinated': {
            heading: 'Chlorinated Solvents Supplier — Methylene Chloride, Perc, TCE Oman',
            body: "Global Chemicals LLC supplies high-purity chlorinated solvents — methylene chloride (DCM/dichloromethane), perchloroethylene (PCE/perc/tetrachloroethylene), and trichloroethylene (TCE) — to industrial degreasing, dry cleaning, paint stripping, and pharmaceutical extraction customers in Oman, UAE, and across the GCC. Chlorinated solvents are aggressive cleaners with strict handling and disposal requirements; we supply only with current GHS-compliant SDS, exposure-control guidance, and full Certificate of Analysis confirming purity (≥99.5%) and stabiliser content. Packaging: 250kg drums and 1,100kg IBCs. Stocked in our Muscat warehouse for same-day Oman dispatch; export to GCC on documented end-use."
          },
          'ethanolamines': {
            heading: 'Ethanolamines Supplier — MEA, DEA, TEA Oman & GCC',
            body: "Global Chemicals LLC supplies the full ethanolamine series — monoethanolamine (MEA), diethanolamine (DEA), and triethanolamine (TEA) — to gas-sweetening operations, soap and personal-care manufacturers, cement grinding aid producers, metalworking fluid blenders, and corrosion-inhibitor formulators across Oman, UAE, Saudi Arabia, and Qatar. MEA and DEA are critical for amine gas treating in Oman's upstream gas plants and refineries (Sohar, Duqm); TEA serves cement industry grinding aids and personal-care formulations. Supplied at ≥99% purity with full CoA in 230kg drums and bulk IBCs. Long-term contract pricing available for industrial buyers."
          },
          'glycols': {
            heading: 'Glycols Supplier — MEG, DEG, MPG Oman & GCC',
            body: "Global Chemicals LLC supplies industrial and food-grade glycols — monoethylene glycol (MEG), diethylene glycol (DEG), and monopropylene glycol (MPG) — to refrigerant and antifreeze blenders, polyester and PET manufacturers, food and pharmaceutical formulators, and oilfield gas-dehydration operators across Oman and the GCC. MEG is the workhorse for HVAC chiller coolants and gas hydrate inhibition; DEG serves natural gas dehydration in Oman's upstream operations; MPG (USP/EP grade) is supplied for food, beverage, and pharmaceutical applications under HACCP-compatible documentation. Supplied in 230kg drums and 1,000L IBCs; bulk tanker delivery available for established users."
          },
          'alcohols': {
            heading: 'Industrial Alcohols Supplier — Methanol, Ethanol, IPA, Butanol Oman',
            body: "Global Chemicals LLC supplies industrial-grade alcohols — methanol, ethanol absolute (denatured and undenatured), isopropyl alcohol (IPA), n-butanol, and isobutanol — to oilfield service companies, pharmaceutical compounders, paint and coatings producers, hand sanitiser manufacturers, and laboratory users across Oman, UAE, Saudi Arabia, and Qatar. Methanol is widely used in Oman's gas industry for hydrate inhibition; IPA is critical for electronics cleaning, pharmaceutical formulation, and disinfectant production; n-butanol serves coatings and plasticiser manufacture. All alcohols supplied at ≥99.5% purity with batch CoA confirming water content and residue on evaporation. Available in 200L drums, IBCs, and bulk."
          },
          'calcium-carbonate': {
            heading: 'Calcium Carbonate Supplier — GCC, PCC, Coated Grades Oman',
            body: "Global Chemicals LLC supplies high-purity calcium carbonate (CaCO₃) — both ground calcium carbonate (GCC) and precipitated calcium carbonate (PCC), in coated and uncoated grades — to plastics compounders, PVC pipe manufacturers, paint and coatings producers, paper mills, rubber masterbatch makers, animal feed formulators, and food and pharmaceutical customers across Oman and the GCC. We stock multiple particle-size grades (from 10μm down to ultrafine sub-micron) with brightness and whiteness specifications suited to filler, extender, and functional uses. Food-grade (E170) and pharma-grade (USP/BP) variants available with full compliance documentation. Supplied in 25kg bags and 1-tonne jumbo bags; bulk silo delivery for high-volume manufacturers."
          },
          'additives': {
            heading: 'Chemical Additives Supplier — Coatings, Plastics, Industrial Oman',
            body: "Global Chemicals LLC supplies performance-enhancing chemical additives to plastics compounders, paint and coatings manufacturers, lubricant blenders, and adhesive producers across Oman and the GCC. Our additives portfolio covers UV stabilisers and antioxidants for polymer durability, slip and anti-blocking agents, dispersants and wetting agents, defoamers and surface levelling agents, rheology modifiers and thickeners, biocides and preservatives, viscosity index improvers and pour-point depressants for lubricant formulation, and compatibilisers for polymer alloys. Technical formulation support available — our team helps customers select the right additive package for ambient-temperature performance in Oman's hot climate, including elevated thermal-stability and UV-resistance requirements."
          },
          'lab-equipment': {
            heading: 'Laboratory Equipment & Apparatus Supplier in Oman',
            body: "Global Chemicals LLC supplies laboratory equipment, apparatus, and consumables to quality-control labs, university research labs, hospital pathology labs, water-testing laboratories, and industrial QC departments across Oman. Our lab equipment range covers analytical balances and precision balances, pH meters and conductivity meters, hot plates and magnetic stirrers, water baths and shaking incubators, drying ovens and muffle furnaces, centrifuges, spectrophotometers, glassware (volumetric, borosilicate, Pyrex), pipettes and micropipettes, filtration assemblies, and lab safety equipment (fume hoods, eye-wash stations, lab coats, PPE). Calibration certificates, traceable reference standards, and after-sales technical support available for all instruments."
          },
          'agro': {
            heading: 'Agricultural Chemicals & Fertilisers Supplier in Oman',
            body: "Global Chemicals LLC supplies agricultural chemicals, fertilisers, and crop-protection raw materials to farming operations, greenhouse growers, landscaping contractors, and date-palm cultivators across Oman. Our agro portfolio covers water-soluble NPK fertilisers (suitable for fertigation and drip-irrigation), urea and ammonium sulphate, potassium nitrate and potassium sulphate, micronutrient chelates (Fe, Zn, Mn, Cu, B, Mo), soil conditioners and humic-acid products, and substrate disinfectants. Oman's saline and calcareous soils require careful nutrient selection — our technical team advises on irrigation-water salinity tolerance, optimum fertigation programmes for tomato, cucumber, and capsicum greenhouse crops, and date-palm fertilisation schedules adapted to Oman's climate."
          },
        };
        const intro = categoryIntros[activeCategory];
        if (!intro) return null;
        return (
          <section className="py-10 border-b bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{intro.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{intro.body}</p>
              </div>
            </div>
          </section>
        );
      })()}

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
                aria-label="Search products by name, CAS number, formula, or category"
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
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
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
            {searchQuery.trim() && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {` matching "${searchQuery}" across all categories`}
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
                    {searchQuery.trim()
                      ? `Search results`
                      : (categories.find((c) => c.id === activeCategory)?.name || t('products.allProducts'))}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {filteredProducts.length} {t('products.productsAvailable')} · {t('products.tapToViewDetails')}
                  </p>
                </div>

                {productsLoading ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">{t('common.loading') || 'Loading products…'}</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>

                    {filteredProducts.length === 0 && (
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
                  description: '263+ water treatment chemicals, industrial lubricants, and specialty products from trusted global manufacturers.',
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
