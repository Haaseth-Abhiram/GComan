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
      id: 'activated-carbon-water',
      title: 'Activated Carbon',
      description: 'High-performance adsorbent for removing impurities, odors, and contaminants from water.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'aluminium-sulphate-liquid',
      title: 'Aluminium Sulphate - Liquid',
      description: 'Liquid coagulant for efficient flocculation in water and wastewater treatment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'aluminium-sulphate-powder',
      title: 'Aluminium Sulphate - Powder',
      description: 'Powder form coagulant for water clarification and purification processes.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'antifoam-water',
      title: 'Antifoam',
      description: 'Controls foam in water treatment processes and industrial applications.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'antiscalant-water',
      title: 'Antiscalant',
      description: 'Prevents scale formation in RO systems, boilers, and cooling towers.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'biocide-water',
      title: 'Biocide',
      description: 'Antimicrobial agent for controlling bacteria, algae, and fungi in water systems.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'calcium-carbonate-water',
      title: 'Calcium Carbonate',
      description: 'Mineral supplement for pH adjustment and alkalinity control in water treatment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'calcium-chloride-water',
      title: 'Calcium Chloride',
      description: 'Desiccant and de-icing agent used in wastewater treatment and concrete acceleration.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'calcium-hypochlorite-water',
      title: 'Calcium Hypochlorite 65–75%',
      description: 'Powerful oxidizing agent and disinfectant for water sanitization and bleaching.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'caustic-soda-flakes',
      title: 'Caustic Soda Flakes',
      description: 'Sodium hydroxide in flake form for pH adjustment and neutralization.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'caustic-soda-liquid',
      title: 'Caustic Soda Liquid',
      description: 'Liquid sodium hydroxide for industrial cleaning and chemical processing.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'caustic-soda-prills',
      title: 'Caustic Soda Prills',
      description: 'High-purity sodium hydroxide beads for precise dosing and handling.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'chlorine-tablets',
      title: 'Chlorine Tablets TCCA or TICA',
      description: 'Stabilized chlorine tablets for continuous water disinfection and sanitation.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'citric-acid-anhydrous',
      title: 'Citric Acid Anhydrous',
      description: 'Water-free citric acid for descaling, cleaning, and pH control.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'citric-acid-monohydrate',
      title: 'Citric Acid Monohydrate',
      description: 'Hydrated citric acid for chelating metals and preventing scale buildup.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'copper-sulphate-liquid',
      title: 'Copper Sulphate Liquid',
      description: 'Algaecide and fungicide for controlling algae growth in water bodies.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'corrosion-inhibitor-water',
      title: 'Corrosion Inhibitor',
      description: 'Protects metal surfaces from corrosion in water systems and pipelines.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'deg-water',
      title: 'DEG (Diethylene Glycol)',
      description: 'Solvent and humectant for industrial water treatment applications.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'edta-powder-water',
      title: 'EDTA Powder',
      description: 'Chelating agent for metal ion sequestration and water softening.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'ethanol-99',
      title: 'Ethanol 99%',
      description: 'High-purity ethanol for disinfection and chemical synthesis.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'ferric-chloride-liquid',
      title: 'Ferric Chloride Liquid 40%',
      description: 'Powerful coagulant for wastewater treatment and phosphorus removal.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'ferrous-sulphate',
      title: 'Ferrous Sulphate',
      description: 'Flocculant and reducing agent for industrial wastewater treatment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'glycerine-water',
      title: 'Glycerine',
      description: 'Humectant and solvent used in various water treatment formulations.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'hydrated-lime',
      title: 'Hydrated Lime Tech Grade',
      description: 'Calcium hydroxide for pH adjustment and water softening.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'hydrazine-hydrate-water',
      title: 'Hydrazine Hydrate',
      description: 'Oxygen scavenger for boiler water treatment and corrosion prevention.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'meg-water',
      title: 'MEG (Monoethanol Glycol)',
      description: 'Antifreeze and heat transfer fluid for cooling systems.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'mpg-water',
      title: 'MPG (Monopropylene Glycol)',
      description: 'Food-grade antifreeze and coolant for water systems.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'paraffin-wax',
      title: 'Paraffin Wax',
      description: 'Hydrocarbon wax used in water treatment and industrial applications.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'petroleum-jelly',
      title: 'Petroleum Jelly',
      description: 'Protective coating and lubricant for water treatment equipment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'pac-liquid',
      title: 'Poly Aluminium Chloride Liquid',
      description: 'Advanced liquid coagulant for superior water clarification.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'pac-powder',
      title: 'Poly Aluminium Chloride Powder',
      description: 'High-efficiency powder coagulant for municipal and industrial water treatment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'polyelectrolyte',
      title: 'Polyelectrolyte',
      description: 'Polymer flocculant for solid-liquid separation and sludge dewatering.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'potassium-hydroxide-water',
      title: 'Potassium Hydroxide',
      description: 'Strong alkali for pH adjustment and neutralization processes.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'soda-ash-water',
      title: 'Soda Ash',
      description: 'Sodium carbonate for water softening and pH control.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'sodium-bicarbonate-water',
      title: 'Sodium Bicarbonate',
      description: 'Alkalinity builder and pH buffer for water treatment systems.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'sodium-bisulphate-bisulphite',
      title: 'Sodium Bisulphate / Bisulphite',
      description: 'Reducing agent and dechlorination chemical for water treatment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'sodium-hexametaphosphate',
      title: 'Sodium Hexametaphosphate',
      description: 'Sequestering agent for preventing scale and corrosion in water systems.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'sodium-hypochlorite',
      title: 'Sodium Hypochlorite',
      description: 'Liquid bleach and disinfectant for water purification.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'sodium-meta-silicate',
      title: 'Sodium Meta Silicate',
      description: 'Alkaline builder and detergent for industrial cleaning and water treatment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'sodium-metabisulphite',
      title: 'Sodium Metabisulphite',
      description: 'Preservative and dechlorination agent for water treatment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'sodium-sulphite',
      title: 'Sodium Sulphite',
      description: 'Oxygen scavenger and preservative for boiler water treatment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'sulphamic-acid',
      title: 'Sulphamic Acid',
      description: 'Descaling agent for removing mineral deposits from equipment.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'tri-ethanol-amine',
      title: 'Tri Ethanol Amine',
      description: 'Corrosion inhibitor and pH adjuster for water systems.',
      category: 'water-treatment',
      icon: Droplets,
    },
    {
      id: 'tsp-water',
      title: 'TSP (Tri Sodium Phosphate)',
      description: 'Heavy-duty cleaner and degreaser for industrial water treatment.',
      category: 'water-treatment',
      icon: Droplets,
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
      id: 'algacide-liquid',
      title: 'Algacide Liquid',
      description: 'Effective liquid algaecide for preventing and treating algae growth in swimming pools.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'chlorine-tablet-pool',
      title: 'Chlorine Tablet',
      description: 'Standard chlorine tablets for continuous pool water disinfection and sanitation.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'swimming-pool-chemical',
      title: 'Swimming Pool Chemical',
      description: 'Complete range of specialized chemicals for comprehensive pool maintenance.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'sodium-hypochlorite-pool',
      title: 'Sodium Hypochlorite',
      description: 'Liquid chlorine solution for pool sanitization and shock treatment.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'chlorine-tablet-jumbo',
      title: 'Chlorine Tablet Jumbo Size (3 Inch)',
      description: 'Large 3-inch slow-dissolving chlorine tablets for extended pool protection.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'calcium-hypochlorite-granules',
      title: 'Calcium Hypochlorite Granules',
      description: 'Fast-dissolving granular chlorine for quick pool sanitization and shock treatment.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'sodium-hypo-chlorite-12-15',
      title: 'Sodium Hypo Chlorite 12-15%',
      description: 'Concentrated liquid chlorine solution for effective pool water treatment.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'chlorine-liquid-pool',
      title: 'Chlorine Liquid',
      description: 'Ready-to-use liquid chlorine for immediate pool disinfection.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'sodium-bi-sulphite-liquid-pool',
      title: 'Sodium Bi Sulphite Liquid',
      description: 'Liquid dechlorination agent for reducing excess chlorine levels in pools.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'sodium-bi-sulphite-monohydrate',
      title: 'Sodium Bi Sulphite Monohydrate',
      description: 'Powder form for neutralizing chlorine and adjusting pool chemistry.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'tcca-tablet-pool',
      title: 'Trichloroisocyanuric Acid Tablet',
      description: 'Stabilized chlorine tablets with built-in cyanuric acid for UV protection.',
      category: 'swimming-pool',
      icon: Droplets,
    },
    {
      id: 'chlorine-powder-pool',
      title: 'Chlorine Powder',
      description: 'Powdered chlorine for rapid pool treatment and shock applications.',
      category: 'swimming-pool',
      icon: Droplets,
    },

    // Oilfield & Refinery
    {
      id: 'acetic-acid',
      title: 'Acetic Acid',
      description: 'Organic acid used in chemical synthesis and industrial processes.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'activated-alumina-desiccant',
      title: 'Activated Alumina Desiccant',
      description: 'High-capacity desiccant for moisture removal and gas drying.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'activated-carbon',
      title: 'Activated Carbon',
      description: 'Highly porous carbon for adsorption and purification applications.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'ammonium-bifluoride',
      title: 'Ammonium Bifluoride',
      description: 'Etching and cleaning agent for industrial applications.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'ammonium-bisulphite',
      title: 'Ammonium Bisulphite',
      description: 'Reducing agent and oxygen scavenger for industrial processes.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'ammonium-chloride',
      title: 'Ammonium Chloride',
      description: 'Inorganic compound used in drilling fluids and metal treatment.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'barium-chloride',
      title: 'Barium Chloride',
      description: 'Heavy metal salt for brine formulation and drilling applications.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'bentonite-powder',
      title: 'Bentonite Powder',
      description: 'Clay-based drilling mud additive for viscosity control.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'borax-powder',
      title: 'Borax Powder',
      description: 'Multipurpose boron compound for industrial applications.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'boric-acid',
      title: 'Boric Acid',
      description: 'Weak acid used in chemical synthesis and industrial processes.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'butyl-glycol',
      title: 'Butyl Glycol',
      description: 'Solvent for paints, coatings, and cleaning formulations.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'calcium-bromide',
      title: 'Calcium Bromide Powder/Liquid',
      description: 'High-density brine for drilling and completion fluids.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'citric-acid-food',
      title: 'Citric Acid Food Grade',
      description: 'Food-grade organic acid for cleaning and pH control.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'calcium-chloride-oil',
      title: 'Calcium Chloride',
      description: 'Dense brine solution for well completion and workover operations.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'citric-acid-liquid',
      title: 'Citric Acid Liquid',
      description: 'Liquid acidizing agent for well stimulation and scale removal.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'citric-acid-powder',
      title: 'Citric Acid Powder',
      description: 'Powder form for scale removal and well acidizing.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'cmc',
      title: 'CMC Carboxymethylcellulose',
      description: 'Fluid loss control agent and viscosifier for drilling fluids.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'diesel-exhaust-fluid',
      title: 'Diesel Exhaust Fluid',
      description: 'Emission control solution for diesel engines.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'corrosion-inhibitor',
      title: 'Corrosion Inhibitor',
      description: 'Protective chemicals for pipelines and equipment.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'dea',
      title: 'DEA (Diethanolamine)',
      description: 'Gas sweetening agent for acid gas removal.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'deg',
      title: 'DEG (Diethylene Glycol)',
      description: 'Dehydration agent and inhibitor for gas processing.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'degreaser-hd',
      title: 'Degreaser HD',
      description: 'Heavy-duty industrial degreaser for equipment cleaning.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'descalant',
      title: 'Descalant',
      description: 'Chemical for removing mineral scale deposits.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'edta-liquid',
      title: 'EDTA Liquid',
      description: 'Chelating agent for scale removal and metal control.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'edta-powder',
      title: 'EDTA Powder',
      description: 'Powder chelating agent for industrial applications.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'formic-acid',
      title: 'Formic Acid',
      description: 'Organic acid for drilling fluids and acidizing.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'hydrazine-hydrate',
      title: 'Hydrazine Hydrate',
      description: 'Oxygen scavenger for boiler water treatment.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'magnesium-oxide',
      title: 'Magnesium Oxide',
      description: 'Refractory material and chemical intermediate.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'mdea',
      title: 'MDEA (Methyl Diethanolamine)',
      description: 'Selective gas treating solvent for acid gas removal.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'mea',
      title: 'MEA (Monoethanolamine)',
      description: 'Amine for CO2 and H2S removal from gas streams.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'meg',
      title: 'MEG (Monoethylene Glycol)',
      description: 'Hydrate inhibitor and dehydration agent.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'methanol-tech',
      title: 'Methanol Tech Grade',
      description: 'Hydrate inhibitor and antifreeze for gas systems.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'potassium-carbonate',
      title: 'Potassium Carbonate',
      description: 'Alkaline salt for gas treating and chemical processes.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'potassium-chloride',
      title: 'Potassium Chloride',
      description: 'Shale inhibitor for water-based drilling fluids.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'potassium-hydroxide',
      title: 'Potassium Hydroxide',
      description: 'Strong base for pH control and chemical synthesis.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'potassium-iodide',
      title: 'Potassium Iodide',
      description: 'Chemical intermediate and analytical reagent.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'silica-gel-blue',
      title: 'Silica Gel Blue',
      description: 'Indicating desiccant for moisture control.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'silica-gel-orange',
      title: 'Silica Gel Orange',
      description: 'Color-changing desiccant for humidity monitoring.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'silica-gel-white',
      title: 'Silica Gel White',
      description: 'Non-indicating desiccant for moisture absorption.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'soda-ash-dense',
      title: 'Soda Ash Dense',
      description: 'Sodium carbonate for pH control and water treatment.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'soda-ash-light',
      title: 'Soda Ash Light',
      description: 'Light density sodium carbonate for various applications.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'sodium-nitrate',
      title: 'Sodium Nitrate',
      description: 'Oxidizing agent for industrial processes.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'sodium-nitrite',
      title: 'Sodium Nitrite',
      description: 'Corrosion inhibitor and oxidizing agent.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'sodium-thiosulphate-liquid',
      title: 'Sodium Thiosulphate Liquid',
      description: 'Dechlorination agent and neutralizer.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'sodium-thiosulphate-powder',
      title: 'Sodium Thiosulphate Powder',
      description: 'Powder form for neutralization and treatment.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'solvent-naphtha',
      title: 'Solvent Naphtha',
      description: 'Petroleum solvent for industrial cleaning and processing.',
      category: 'oilfield',
      icon: Factory,
    },
    {
      id: 'surfactant-sodium-silicate',
      title: 'Surfactant, Sodium Silicate Alkaline and Neutral',
      description: 'Surface active agents and silicates for drilling applications.',
      category: 'oilfield',
      icon: Factory,
    },

    // Construction
    {
      id: 'epoxy-coating',
      title: 'Epoxy Coating',
      description: 'High-performance protective coating for concrete surfaces and structural elements.',
      category: 'construction',
      icon: Building2,
    },
    {
      id: 'paraffin-oil-construction',
      title: 'Paraffin Oil',
      description: 'Industrial grade paraffin oil for construction applications and formulations.',
      category: 'construction',
      icon: Building2,
    },
    {
      id: 'polymer-bonding-agent',
      title: 'Polymer Bonding Agent',
      description: 'Advanced bonding agent for enhanced adhesion between concrete layers.',
      category: 'construction',
      icon: Building2,
    },
    {
      id: 'polymer-modified-mortar',
      title: 'Polymer Modified Mortar',
      description: 'High-strength mortar with polymer additives for superior bonding and flexibility.',
      category: 'construction',
      icon: Building2,
    },
    {
      id: 'mould-releasing-agents',
      title: 'Mould Releasing Agents',
      description: 'Formwork release agents for easy concrete demolding and smooth finishes.',
      category: 'construction',
      icon: Building2,
    },

    // Food & Beverage
    {
      id: 'ascorbic-acid',
      title: 'Ascorbic Acid',
      description: 'Vitamin C antioxidant and preservative for food and beverage applications.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'calcium-carbonate-food',
      title: 'Calcium Carbonate',
      description: 'Food-grade calcium supplement and pH regulator for food products.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'calcium-lactate',
      title: 'Calcium Lactate',
      description: 'Calcium fortification agent and firming agent for food processing.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'citric-acid-anhydrous-food',
      title: 'Citric Acid Anhydrous',
      description: 'Food-grade acidulant and preservative for flavoring and pH control.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'ethanol-70',
      title: 'Ethanol 70%',
      description: 'Food-grade ethanol for sanitization and extraction processes.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'formaldehyde-40',
      title: 'Formaldehyde 40%',
      description: 'Industrial preservative and disinfectant for food processing equipment.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'hand-sanitizer',
      title: 'Hand Sanitizer',
      description: 'Alcohol-based hand sanitizer for food handling and hygiene compliance.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'lime-stone',
      title: 'Lime Stone',
      description: 'Calcium source and pH adjuster for food and beverage processing.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'caustic-soda-liquid-food',
      title: 'Caustic Soda Liquid',
      description: 'Food-grade alkali for cleaning and pH adjustment in food processing.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'nitric-acid-68',
      title: 'Nitric Acid 68%',
      description: 'Industrial acid for equipment cleaning and CIP systems in food facilities.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'potassium-sorbate',
      title: 'Potassium Sorbate',
      description: 'Preservative for preventing mold and yeast growth in food and beverages.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'propylene-glycol-food',
      title: 'Propylene Glycol',
      description: 'Food-grade humectant and solvent for flavors and food processing.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'sodium-bicarbonate-food',
      title: 'Sodium Bicarbonate',
      description: 'Baking soda for leavening, pH control, and food processing applications.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'sodium-hypochlorite-food',
      title: 'Sodium Hypochlorite',
      description: 'Sanitizing agent for food contact surfaces and equipment disinfection.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'urea-food',
      title: 'Urea',
      description: 'Nitrogen source and processing aid for certain food applications.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'white-salt',
      title: 'White Salt',
      description: 'Food-grade sodium chloride for seasoning and preservation.',
      category: 'food-beverage',
      icon: Wine,
    },
    {
      id: 'xanthan-gum',
      title: 'Xanthan Gum',
      description: 'Thickening and stabilizing agent for food and beverage formulations.',
      category: 'food-beverage',
      icon: Wine,
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
      id: 'caustic-soda-flakes-soap',
      title: 'Caustic Soda Flakes',
      description: 'Sodium hydroxide flakes for saponification in soap and detergent manufacturing.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'caustic-soda-liquid-soap',
      title: 'Caustic Soda Liquid',
      description: 'Liquid sodium hydroxide for industrial cleaning and detergent formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'caustic-soda-prills-soap',
      title: 'Caustic Soda Prills',
      description: 'High-purity sodium hydroxide beads for precise detergent formulation.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'edta-powder-soap',
      title: 'EDTA Powder',
      description: 'Chelating agent for water hardness control in detergent products.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'glycerine-soap',
      title: 'Glycerine',
      description: 'Humectant and moisturizer for soap and personal care formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'hydrogen-peroxide-3',
      title: 'Hydrogen Peroxide 3%',
      description: 'Low concentration bleaching agent for mild cleaning applications.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'hydrogen-peroxide-35',
      title: 'Hydrogen Peroxide 35%',
      description: 'Medium strength oxidizing agent for industrial detergent formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'hydrogen-peroxide-50',
      title: 'Hydrogen Peroxide 50%',
      description: 'High concentration bleaching agent for heavy-duty cleaning products.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'hydrogen-peroxide-6',
      title: 'Hydrogen Peroxide 6%',
      description: 'Moderate concentration for bleaching and sanitizing applications.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'labsa',
      title: 'LABSA',
      description: 'Linear Alkylbenzene Sulphonic Acid - primary surfactant for detergent production.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'nonyl-phenol-ethoxylate',
      title: 'Nonyl Phenol Ethoxylate',
      description: 'Non-ionic surfactant for industrial and household cleaning products.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'perchloroethylene',
      title: 'Perchloroethylene',
      description: 'Solvent for dry cleaning and degreasing applications.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'sles-70',
      title: 'SLES 70%',
      description: 'Sodium Lauryl Ether Sulfate - foaming agent and surfactant for detergents.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'soda-ash-dense-soap',
      title: 'Soda Ash Dense',
      description: 'Sodium carbonate for pH adjustment and water softening in detergents.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'soda-ash-light-soap',
      title: 'Soda Ash Light',
      description: 'Light density sodium carbonate for soap and detergent formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'sodium-hypochlorite-12-15-soap',
      title: 'Sodium Hypochlorite 12-15%',
      description: 'Bleaching and disinfecting agent for cleaning product formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'sodium-meta-silicate-pentahydrate',
      title: 'Sodium Meta Silicate Pentahydrate',
      description: 'Alkaline builder and corrosion inhibitor for heavy-duty detergents.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'sodium-tripolyphosphate',
      title: 'Sodium Tripolyphosphate',
      description: 'Sequestering agent and detergency builder for laundry detergents.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'surfactants-soap',
      title: 'Surfactants',
      description: 'Range of surface active agents for cleaning and emulsifying applications.',
      category: 'soap-detergent',
      icon: Sparkles,
    },
    {
      id: 'trisodium-phosphate-soap',
      title: 'Trisodium Phosphate',
      description: 'Heavy-duty cleaning agent and degreaser for industrial applications.',
      category: 'soap-detergent',
      icon: Sparkles,
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
    { id: 'oilfield', name: 'Oilfield & Refinery', icon: Factory },
    { id: 'water-treatment', name: 'Water Treatment Chemicals', icon: Droplets },
    { id: 'lubricants', name: 'Lubricants & Greases', icon: Wrench },
    { id: 'calcium-carbonate', name: 'Calcium Carbonate', icon: FlaskConical },
    { id: 'additives', name: 'Additives', icon: Zap },
    { id: 'lab-equipment', name: 'Lab Equipment', icon: TestTube },
    { id: 'lab-chemicals', name: 'Lab Chemicals', icon: Beaker },
    { id: 'swimming-pool', name: 'Swimming Pool Chemicals', icon: Droplets },
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
      {/* SEO Meta Tags */}
      <head>
        <title>Water Treatment Chemicals & Industrial Solutions | Global Chemicals LLC</title>
        <meta 
          name="description" 
          content="Global Chemicals LLC supplies premium water treatment chemicals including coagulants, flocculants, pH adjusters, oxidizing agents, and disinfectants trusted across oil & gas, industrial, and municipal sectors." 
        />
      </head>
      
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
