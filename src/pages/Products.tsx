import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube, Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound, Flame, Wind, Wine, ChevronRight, Shield, SprayCan } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductCard } from '@/components/products/ProductCard';
import { SEO } from '@/components/SEO';
import { OrganizationStructuredData } from '@/components/StructuredData';

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

// Products data - exported for use in ProductDetail page
export const products: Product[] = [
  // Water Treatment Chemicals
  {
    id: 'activated-carbon-water',
    title: 'Activated Carbon',
    description: 'High-performance adsorbent for removing impurities, odors, and contaminants from water.',
    category: 'water-treatment',
    icon: Droplets,
    details: {
      casNumber: '64365-11-3',
      alternativeNames: ['Active carbon', 'Activated charcoal', 'AC filter media', 'Carbon adsorbent'],
      seoKeywords: ['activated carbon Oman', 'water filter carbon Muscat', 'activated charcoal Oman', 'carbon adsorbent supplier'],
      longDescription: 'Premium Activated Carbon supplier in Oman - Global Chemicals LLC provides high-quality activated carbon for water treatment, air purification, and industrial applications in Muscat, Sohar, Salalah. Our activated carbon offers superior adsorption capacity for removing organic compounds, chlorine, odors, and contaminants from water and air. Available in granular, powder, and pellet forms.',
      applications: [
        'Drinking water purification',
        'Wastewater treatment',
        'Air purification and odor control',
        'Industrial effluent treatment',
        'Gold recovery and mining',
        'Food and beverage decolorization',
        'Solvent recovery'
      ],
      technicalSpecs: [
        'Iodine number: >900 mg/g',
        'Surface area: 900-1200 m²/g',
        'Available in granular (8x30 mesh) and powder forms',
        'Moisture content: <5%',
        'Bulk density: 0.40-0.55 g/cm³'
      ]
    }
  },
    {
      id: 'aluminium-sulphate-liquid',
      title: 'Aluminium Sulphate - Liquid',
      description: 'Liquid coagulant for efficient flocculation in water and wastewater treatment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Al2(SO4)3',
        casNumber: '10043-01-3',
        alternativeNames: ['Liquid alum', 'Aluminum sulfate solution', 'Alum liquid', 'Al2(SO4)3 liquid'],
        seoKeywords: ['aluminum sulfate Oman', 'liquid alum Oman', 'alum coagulant Muscat', 'water treatment alum Oman'],
        longDescription: 'Buy Aluminum Sulphate Liquid in Oman from Global Chemicals LLC. Liquid alum is a widely used coagulant for municipal water treatment, wastewater treatment, and industrial effluent treatment in Muscat, Sohar, Salalah. Our aluminum sulfate liquid offers excellent flocculation performance for turbidity removal and phosphorus precipitation.',
        applications: [
          'Municipal water treatment plants',
          'Wastewater treatment coagulation',
          'Industrial effluent clarification',
          'Paper manufacturing',
          'Textile wastewater treatment',
          'Phosphorus removal'
        ],
        technicalSpecs: [
          'Al2O3 content: 8-9%',
          'Appearance: Clear to light yellow liquid',
          'pH (1% solution): 3.0-4.0',
          'Specific gravity: 1.25-1.35',
          'Available in bulk and IBC tanks'
        ]
      }
    },
    {
      id: 'aluminium-sulphate-powder',
      title: 'Aluminium Sulphate - Powder',
      description: 'Powder form coagulant for water clarification and purification processes.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Al2(SO4)3',
        casNumber: '10043-01-3',
        alternativeNames: ['Alum powder', 'Aluminum sulfate powder', 'Powdered alum', 'Filter alum'],
        seoKeywords: ['aluminum sulfate powder Oman', 'alum powder Muscat', 'powdered alum Oman', 'water treatment chemicals Oman'],
        longDescription: 'Aluminum Sulphate Powder supplier in Oman - Global Chemicals LLC. Buy high-grade alum powder for water treatment plants in Muscat, Sohar, Salalah. Our aluminum sulfate powder offers excellent solubility and coagulation performance for turbidity removal, color reduction, and phosphorus removal in water and wastewater treatment.',
        applications: [
          'Drinking water clarification',
          'Wastewater treatment',
          'Industrial water treatment',
          'Swimming pool clarification',
          'Paper sizing agent',
          'Soil pH adjustment'
        ],
        technicalSpecs: [
          'Al2O3 content: 17-18%',
          'Appearance: White to off-white powder',
          'Water insoluble: <0.5%',
          'Iron (Fe) content: <0.5%',
          'Available in 25kg, 50kg bags'
        ]
      }
    },
    {
      id: 'antifoam-water',
      title: 'Antifoam',
      description: 'Controls foam in water treatment processes and industrial applications.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        alternativeNames: ['Defoamer', 'Foam control agent', 'Antifoaming agent', 'Foam suppressant'],
        seoKeywords: ['antifoam Oman', 'defoamer Oman', 'foam control water treatment Oman', 'antifoaming agent Muscat'],
        longDescription: 'Antifoam and Defoamer supplier in Oman - Global Chemicals LLC provides industrial antifoam agents for water treatment, wastewater treatment, and industrial processes in Muscat, Sohar, Salalah. Our antifoam products effectively control and eliminate foam in various applications, improving process efficiency.',
        applications: [
          'Wastewater treatment plants',
          'Pulp and paper manufacturing',
          'Textile processing',
          'Food and beverage processing',
          'Chemical manufacturing',
          'Fermentation processes',
          'Cooling tower water treatment'
        ],
        technicalSpecs: [
          'Active content: 10-100%',
          'Appearance: White to off-white emulsion',
          'Silicone or non-silicone based',
          'Low dosage requirement: 10-100 ppm',
          'Compatible with various water chemistries'
        ]
      }
    },
    {
      id: 'antiscalant-water',
      title: 'Antiscalant',
      description: 'Prevents scale formation in RO systems, boilers, and cooling towers.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        alternativeNames: ['Scale inhibitor', 'Antiscale', 'RO antiscalant', 'Scale prevention chemical'],
        seoKeywords: ['antiscalant Oman', 'scale inhibitor Oman', 'RO antiscalant Muscat', 'membrane antiscalant Oman'],
        longDescription: 'Antiscalant supplier in Oman - Global Chemicals LLC provides high-performance antiscalants for reverse osmosis (RO) systems, boilers, and cooling towers in Muscat, Sohar, Salalah. Our antiscalant products prevent calcium carbonate, calcium sulfate, barium sulfate, and silica scale formation, extending membrane life and system efficiency.',
        applications: [
          'Reverse osmosis (RO) desalination plants',
          'Ultrafiltration (UF) systems',
          'Boiler feed water treatment',
          'Cooling tower scale prevention',
          'Industrial water systems',
          'Membrane protection',
          'Geothermal systems'
        ],
        technicalSpecs: [
          'Effective dosage: 2-5 ppm',
          'pH range: 3-10',
          'Compatible with all RO membrane types',
          'Non-toxic and biodegradable',
          'Liquid form for easy dosing',
          'Wide operating temperature range'
        ]
      }
    },
    {
      id: 'biocide-water',
      title: 'Biocide',
      description: 'Antimicrobial agent for controlling bacteria, algae, and fungi in water systems.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        alternativeNames: ['Bactericide', 'Antimicrobial', 'Water disinfectant', 'Microbiocide'],
        seoKeywords: ['biocide Oman', 'water biocide Muscat', 'bactericide Oman', 'cooling tower biocide Oman'],
        longDescription: 'Industrial Biocide supplier in Oman - Global Chemicals LLC supplies broad-spectrum biocides for water treatment, cooling towers, and industrial water systems in Muscat, Sohar, Salalah. Our biocide products effectively control bacteria, algae, fungi, and biofilm formation in water systems, ensuring microbiological control.',
        applications: [
          'Cooling tower water treatment',
          'Wastewater treatment biocide',
          'RO feed water disinfection',
          'Industrial process water',
          'Swimming pool water treatment',
          'Oil and gas water systems',
          'Paper mill slime control'
        ],
        technicalSpecs: [
          'Broad-spectrum antimicrobial activity',
          'Non-oxidizing and oxidizing types available',
          'Effective dosage: 10-50 ppm',
          'Fast-acting formulation',
          'Compatible with water treatment chemicals',
          'Low environmental impact'
        ]
      }
    },
    {
      id: 'calcium-carbonate-water',
      title: 'Calcium Carbonate',
      description: 'Mineral supplement for pH adjustment and alkalinity control in water treatment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'CaCO3',
        casNumber: '471-34-1',
        alternativeNames: ['Limestone', 'Calcite', 'Chalk', 'Calcium carbonate powder'],
        seoKeywords: ['calcium carbonate Oman', 'limestone powder Oman', 'pH adjustment chemical Oman', 'water treatment minerals Muscat'],
        longDescription: 'Calcium Carbonate supplier in Oman - Global Chemicals LLC provides high-purity calcium carbonate for water treatment, pH adjustment, and alkalinity control in Muscat, Sohar, Salalah. Our calcium carbonate is ideal for remineralization of RO water, pH buffering, and water softening applications.',
        applications: [
          'RO water remineralization',
          'pH adjustment in water treatment',
          'Alkalinity control',
          'Water hardness adjustment',
          'Neutralization of acidic water',
          'Industrial wastewater treatment',
          'Aquaculture water conditioning'
        ],
        technicalSpecs: [
          'CaCO3 purity: 95-98%',
          'Appearance: White powder',
          'Particle size: 200-325 mesh',
          'pH (10% slurry): 8-10',
          'Available in 25kg, 50kg bags'
        ]
      }
    },
    {
      id: 'calcium-chloride-water',
      title: 'Calcium Chloride',
      description: 'Desiccant and de-icing agent used in wastewater treatment and concrete acceleration.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'CaCl2',
        casNumber: '10043-52-4',
        alternativeNames: ['Calcium chloride dihydrate', 'CaCl2', 'Calcium dichloride', 'Ice melt'],
        seoKeywords: ['calcium chloride Oman', 'CaCl2 Oman', 'desiccant Oman', 'calcium chloride supplier Muscat'],
        longDescription: 'Calcium Chloride supplier in Oman - Global Chemicals LLC provides calcium chloride in various forms (liquid, flakes, pellets, powder) for desiccation, de-icing, wastewater treatment, concrete acceleration, and dust control in Muscat, Sohar, Salalah. Our calcium chloride offers excellent moisture absorption and freezing point depression.',
        applications: [
          'Desiccant and moisture control',
          'De-icing and snow melting',
          'Concrete acceleration',
          'Wastewater treatment',
          'Dust control on roads',
          'Oil and gas drilling fluids',
          'Food processing (firming agent)'
        ],
        technicalSpecs: [
          'CaCl2 content: 77-94%',
          'Available forms: Liquid (32%), Flakes, Pellets, Powder',
          'Appearance: White granules/liquid',
          'Moisture absorption: Excellent hygroscopic properties',
          'Available in 25kg bags and bulk'
        ]
      }
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
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Sodium hydroxide flakes', 'NaOH flakes', 'Caustic flakes', 'Lye flakes'],
        seoKeywords: ['caustic soda flakes Oman', 'sodium hydroxide flakes Muscat', 'NaOH flakes Oman', 'caustic flakes supplier Oman'],
        longDescription: 'Caustic Soda Flakes supplier in Oman - Global Chemicals LLC provides high-purity sodium hydroxide flakes for pH adjustment, chemical processing, soap manufacturing, and water treatment in Muscat, Sohar, Salalah. Our caustic soda flakes offer 98-99% purity, easy handling, and reliable performance across industries.',
        applications: [
          'pH adjustment in water treatment',
          'Soap and detergent manufacturing',
          'Pulp and paper processing',
          'Chemical manufacturing',
          'Textile mercerization',
          'Aluminum refining (Bayer process)',
          'Food processing (peeling, pH control)'
        ],
        technicalSpecs: [
          'NaOH purity: 98-99%',
          'Appearance: White flakes',
          'Moisture content: <1%',
          'Na2CO3: <0.8%',
          'Available in 25kg bags',
          'Long shelf life in dry conditions'
        ]
      }
    },
  {
    id: 'caustic-soda-liquid',
    title: 'Caustic Soda Liquid',
    description: 'Liquid sodium hydroxide for industrial cleaning and chemical processing.',
    category: 'water-treatment',
    icon: Droplets,
    details: {
      formula: 'NaOH',
      casNumber: '1310-73-2',
      alternativeNames: ['Sodium hydroxide liquid', 'Liquid caustic', 'NaOH solution', 'Lye liquid'],
      seoKeywords: ['caustic soda Oman', 'sodium hydroxide Muscat', 'caustic soda supplier Oman', 'NaOH Oman'],
      fullDescription: 'Caustic Soda Liquid (Sodium Hydroxide) is a strong alkaline solution widely used across Oman for pH adjustment, neutralization, and chemical processing. Our high-purity caustic soda liquid ensures consistent quality for water treatment, chemical manufacturing, and industrial cleaning applications.',
      longDescription: 'Buy Caustic Soda Liquid in Oman from Global Chemicals LLC - the leading supplier of sodium hydroxide in Muscat, Sohar, and Salalah. Our caustic soda liquid is ideal for water treatment, pH control, pulp and paper manufacturing, and industrial cleaning. Available in various concentrations with safe handling and delivery across Oman.',
      applications: [
        'Water treatment pH adjustment',
        'Wastewater neutralization',
        'Pulp and paper manufacturing',
        'Chemical manufacturing',
        'Industrial cleaning and degreasing',
        'Soap and detergent production',
        'Oil refining processes'
      ],
      technicalSpecs: [
        'NaOH concentration: 32%, 48%, or 50%',
        'Appearance: Clear colorless liquid',
        'Specific gravity: 1.33-1.52',
        'Available in IBC tanks and bulk',
        'High purity grade available'
      ]
    },
  },
  {
    id: 'calcium-hypochlorite-water',
    title: 'Calcium Hypochlorite 65–75%',
    description: 'Powerful oxidizing agent and disinfectant for water sanitization and bleaching.',
    category: 'water-treatment',
    icon: Droplets,
    details: {
      formula: 'Ca(ClO)2',
      casNumber: '7778-54-3',
      alternativeNames: ['Cal hypo', 'Calcium hypochlorite granules', 'Chlorine powder', 'HTH'],
      seoKeywords: ['calcium hypochlorite Oman', 'chlorine powder Oman', 'water disinfectant Oman', 'HTH Oman'],
      fullDescription: 'Calcium Hypochlorite is a highly effective chlorine-based disinfectant containing 65-75% available chlorine. Widely used throughout Oman for water disinfection, swimming pool sanitation, and wastewater treatment. More stable and easier to handle than liquid chlorine.',
      longDescription: 'Premium Calcium Hypochlorite supplier in Oman - Global Chemicals LLC. Buy calcium hypochlorite 65-75% for swimming pools, drinking water treatment, and industrial water disinfection in Muscat, Sohar, and across Oman. High available chlorine content ensures effective disinfection. Technical support and bulk delivery available.',
      applications: [
        'Swimming pool disinfection',
        'Drinking water chlorination',
        'Wastewater treatment disinfection',
        'Industrial water sanitization',
        'Emergency water purification',
        'Bleaching applications',
        'Odor control in wastewater'
      ],
      technicalSpecs: [
        'Available chlorine: 65-75%',
        'Appearance: White granular powder',
        'Moisture content: <10%',
        'Available in 25kg, 45kg drums',
        'Stable dry storage',
        'Longer shelf life than liquid chlorine'
      ]
    },
  },
  {
    id: 'sodium-hypochlorite',
    title: 'Sodium Hypochlorite',
    description: 'Liquid bleach and disinfectant for water purification.',
    category: 'water-treatment',
    icon: Droplets,
    details: {
      formula: 'NaClO',
      casNumber: '7681-52-9',
      alternativeNames: ['Liquid chlorine', 'Bleach', 'Hypo', 'Liquid bleach', 'Chlorine bleach'],
      seoKeywords: ['sodium hypochlorite Oman', 'liquid chlorine Oman', 'bleach Oman', 'water disinfection Oman'],
      fullDescription: 'Sodium Hypochlorite is a liquid chlorine solution used extensively for water disinfection and sanitization across Oman. Available in various concentrations, it provides reliable and cost-effective disinfection for municipal water treatment, swimming pools, and industrial applications.',
      longDescription: 'Sodium Hypochlorite supplier in Oman - Global Chemicals LLC provides high-quality liquid chlorine for water treatment plants, swimming pools, and industrial facilities in Muscat, Sohar, Salalah. Our sodium hypochlorite ensures effective disinfection with reliable delivery and technical support throughout Oman.',
      applications: [
        'Municipal water treatment',
        'Swimming pool chlorination',
        'Wastewater disinfection',
        'Food and beverage sanitation',
        'Hospital and healthcare disinfection',
        'Industrial water systems',
        'Cooling tower biocide'
      ],
      technicalSpecs: [
        'Available chlorine: 12-15%',
        'Appearance: Pale yellow liquid',
        'pH: 11-13',
        'Specific gravity: 1.20-1.25',
        'Available in drums and bulk',
        'On-site generation available'
      ]
    },
  },
    {
      id: 'caustic-soda-prills',
      title: 'Caustic Soda Prills',
      description: 'High-purity sodium hydroxide beads for precise dosing and handling.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Sodium hydroxide prills', 'NaOH prills', 'Caustic prills', 'Caustic pearls', 'Caustic beads'],
        seoKeywords: ['caustic soda prills Oman', 'sodium hydroxide prills Muscat', 'NaOH prills Oman', 'caustic pearls supplier Oman'],
        longDescription: 'Caustic Soda Prills (Pearls) supplier in Oman - Global Chemicals LLC provides premium sodium hydroxide prills for industrial applications in Muscat, Sohar, Salalah. Our caustic soda prills offer superior flowability, low dust formation, easy dissolution, and precise dosing for chemical processing and water treatment.',
        applications: [
          'pH control in water treatment',
          'Chemical manufacturing',
          'Soap and detergent production',
          'Textile processing',
          'Petroleum refining',
          'Aluminum processing',
          'Food processing industry'
        ],
        technicalSpecs: [
          'NaOH purity: 99%+',
          'Appearance: White spherical beads',
          'Particle size: 0.5-1.0 mm',
          'Low dust formation',
          'Excellent flowability',
          'Available in 25kg bags'
        ]
      }
    },
    {
      id: 'chlorine-tablets',
      title: 'Chlorine Tablets TCCA or TICA',
      description: 'Stabilized chlorine tablets for continuous water disinfection and sanitation.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C3Cl3N3O3',
        casNumber: '87-90-1',
        alternativeNames: ['TCCA tablets', 'Trichloroisocyanuric acid tablets', 'Stabilized chlorine tablets', 'Slow dissolving chlorine'],
        seoKeywords: ['TCCA tablets Oman', 'chlorine tablets Oman', 'stabilized chlorine Muscat', 'TCCA supplier Oman'],
        longDescription: 'TCCA Chlorine Tablets supplier in Oman - Global Chemicals LLC provides high-quality Trichloroisocyanuric Acid (TCCA) tablets for swimming pools, water treatment, and disinfection in Muscat, Sohar, Salalah. Our TCCA tablets contain 90% available chlorine with built-in stabilizer (cyanuric acid) for longer-lasting disinfection.',
        applications: [
          'Swimming pool disinfection',
          'Drinking water chlorination',
          'Industrial water treatment',
          'Cooling tower disinfection',
          'Wastewater treatment',
          'Spa and hot tub sanitation',
          'Emergency water purification'
        ],
        technicalSpecs: [
          'Available chlorine: 90%',
          'Tablet size: 20g, 200g',
          'Contains cyanuric acid stabilizer',
          'Slow-dissolving for sustained release',
          'Appearance: White tablets',
          'Available in 5kg, 25kg, 50kg drums'
        ]
      }
    },
    {
      id: 'citric-acid-anhydrous',
      title: 'Citric Acid Anhydrous',
      description: 'Water-free citric acid for descaling, cleaning, and pH control.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C6H8O7',
        casNumber: '77-92-9',
        alternativeNames: ['Anhydrous citric acid', '2-Hydroxypropane-1,2,3-tricarboxylic acid', 'Citric acid anhydrous'],
        seoKeywords: ['citric acid anhydrous Oman', 'citric acid Muscat', 'descaling agent Oman', 'citric acid supplier Oman'],
        longDescription: 'Citric Acid Anhydrous supplier in Oman - Global Chemicals LLC provides food grade and technical grade anhydrous citric acid for descaling, cleaning, pH control, and food processing in Muscat, Sohar, Salalah. Our water-free citric acid offers higher purity, longer shelf life, and effective chelating properties for diverse applications.',
        applications: [
          'Descaling boilers and equipment',
          'pH adjustment in water treatment',
          'Food and beverage acidulant',
          'Pharmaceutical formulations',
          'Cosmetics and personal care',
          'Cleaning product manufacturing',
          'Metal cleaning and passivation'
        ],
        technicalSpecs: [
          'Purity: 99.5% min',
          'Appearance: White crystalline powder',
          'Moisture content: <0.5%',
          'pH (1% solution): 2.2',
          'Available in 25kg bags',
          'Food grade (E330) and technical grade'
        ]
      }
    },
    {
      id: 'citric-acid-monohydrate',
      title: 'Citric Acid Monohydrate',
      description: 'Hydrated citric acid for chelating metals and preventing scale buildup.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C6H8O7·H2O',
        casNumber: '5949-29-1',
        alternativeNames: ['Citric acid monohydrate', 'Hydrated citric acid', 'Citric acid 1-hydrate'],
        seoKeywords: ['citric acid monohydrate Oman', 'hydrated citric acid Muscat', 'citric acid food grade Oman', 'chelating agent Oman'],
        longDescription: 'Citric Acid Monohydrate supplier in Oman - Global Chemicals LLC provides food grade and technical grade citric acid monohydrate for food processing, beverages, water treatment, and industrial applications in Muscat, Sohar, Salalah. Our monohydrate form offers excellent metal chelation, pH control, and antioxidant properties.',
        applications: [
          'Food and beverage industry',
          'Soft drink acidulant',
          'Pharmaceutical formulations',
          'Water treatment chelating agent',
          'Cosmetics and toiletries',
          'Industrial cleaning',
          'Detergent builder'
        ],
        technicalSpecs: [
          'Purity: 99.5% min (anhydrous basis)',
          'Appearance: White crystalline powder',
          'Water of crystallization: 7.5-9.0%',
          'pH (1% solution): 2.2',
          'Available in 25kg bags',
          'Food grade (E330) certified'
        ]
      }
    },
    {
      id: 'copper-sulphate-liquid',
      title: 'Copper Sulphate Liquid',
      description: 'Algaecide and fungicide for controlling algae growth in water bodies.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'CuSO4',
        casNumber: '7758-98-7',
        alternativeNames: ['Copper sulfate solution', 'Cupric sulfate liquid', 'Blue vitriol solution', 'Copper sulphate pentahydrate liquid'],
        seoKeywords: ['copper sulfate Oman', 'algaecide Oman', 'copper sulphate liquid Muscat', 'pond algae control Oman'],
        longDescription: 'Copper Sulphate Liquid supplier in Oman - Global Chemicals LLC provides copper sulfate solution for algae control, fungicide applications, and industrial uses in Muscat, Sohar, Salalah. Our liquid copper sulphate offers easy application, effective algae treatment, and controlled dosing for ponds, lakes, and industrial water systems.',
        applications: [
          'Algae control in ponds and lakes',
          'Swimming pool algaecide',
          'Irrigation water treatment',
          'Root killer in sewer lines',
          'Fungicide in agriculture',
          'Leather tanning',
          'Electroplating solutions'
        ],
        technicalSpecs: [
          'CuSO4 concentration: 25-30%',
          'Appearance: Blue liquid',
          'Copper (Cu) content: 6-8%',
          'pH: 3-4',
          'Available in drums and IBC tanks',
          'Easy dosing and application'
        ]
      }
    },
    {
      id: 'corrosion-inhibitor-water',
      title: 'Corrosion Inhibitor',
      description: 'Protects metal surfaces from corrosion in water systems and pipelines.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        alternativeNames: ['Corrosion control chemical', 'Rust inhibitor', 'Anti-corrosion additive', 'Metal protector'],
        seoKeywords: ['corrosion inhibitor Oman', 'rust prevention Oman', 'corrosion control Muscat', 'water system protection Oman'],
        longDescription: 'Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides advanced corrosion control chemicals for cooling systems, boilers, pipelines, and industrial water systems in Muscat, Sohar, Salalah. Our corrosion inhibitors form protective films on metal surfaces, preventing rust, pitting, and galvanic corrosion while extending equipment life.',
        applications: [
          'Cooling water systems',
          'Boiler feedwater treatment',
          'Closed loop heating systems',
          'Chilled water systems',
          'Oil and gas pipelines',
          'Industrial process water',
          'HVAC systems protection'
        ],
        technicalSpecs: [
          'Types: Phosphate, molybdate, organic inhibitors',
          'Appearance: Clear to amber liquid',
          'pH: 6-9 (as supplied)',
          'Dosage: 10-50 ppm (depends on system)',
          'Available in drums and IBC tanks',
          'Compatible with all metals'
        ]
      }
    },
    {
      id: 'deg-water',
      title: 'DEG (Diethylene Glycol)',
      description: 'Solvent and humectant for industrial water treatment applications.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C4H10O3',
        casNumber: '111-46-6',
        alternativeNames: ['Diethylene glycol', 'DEG', '2,2-Oxydiethanol', 'Diglycol'],
        seoKeywords: ['DEG Oman', 'diethylene glycol Oman', 'DEG solvent Muscat', 'diethylene glycol supplier Oman'],
        longDescription: 'Diethylene Glycol (DEG) supplier in Oman - Global Chemicals LLC provides high-purity DEG for solvent, humectant, antifreeze, and industrial applications in Muscat, Sohar, Salalah. Our DEG offers excellent solvency, hygroscopic properties, and freeze point depression for diverse chemical processes.',
        applications: [
          'Natural gas dehydration',
          'Solvent for resins and dyes',
          'Humectant in products',
          'Antifreeze formulations',
          'Polyester fiber production',
          'Brake fluid component',
          'Textile processing'
        ],
        technicalSpecs: [
          'Purity: 99.5% min',
          'Appearance: Clear colorless liquid',
          'Boiling point: 245°C',
          'Freezing point: -8°C',
          'Specific gravity: 1.118',
          'Available in drums and IBC tanks'
        ]
      }
    },
    {
      id: 'edta-powder-water',
      title: 'EDTA Powder',
      description: 'Chelating agent for metal ion sequestration and water softening.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C10H16N2O8',
        casNumber: '60-00-4',
        alternativeNames: ['Ethylenediaminetetraacetic acid', 'EDTA disodium', 'EDTA tetrasodium', 'Chelating agent'],
        seoKeywords: ['EDTA powder Oman', 'chelating agent Oman', 'EDTA Muscat', 'metal sequestrant Oman'],
        longDescription: 'EDTA Powder supplier in Oman - Global Chemicals LLC provides pharmaceutical and technical grade EDTA for water treatment, metal chelation, and industrial applications in Muscat, Sohar, Salalah. Our EDTA powder binds calcium, magnesium, iron, and heavy metals, preventing scale and improving process efficiency.',
        applications: [
          'Water softening',
          'Boiler scale prevention',
          'Metal cleaning and pickling',
          'Pharmaceutical formulations',
          'Food preservation',
          'Textile processing',
          'Pulp and paper industry'
        ],
        technicalSpecs: [
          'Purity: 99% min',
          'Appearance: White crystalline powder',
          'pH (1% solution): 4.5-5.5',
          'Forms: Disodium, tetrasodium salts',
          'Available in 25kg bags',
          'Excellent chelating capacity'
        ]
      }
    },
    {
      id: 'ethanol-99',
      title: 'Ethanol 99%',
      description: 'High-purity ethanol for disinfection and chemical synthesis.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C2H5OH',
        casNumber: '64-17-5',
        alternativeNames: ['Ethyl alcohol', 'Absolute ethanol', 'Pure alcohol', 'Grain alcohol 99%'],
        seoKeywords: ['ethanol 99 Oman', 'ethyl alcohol Oman', 'absolute ethanol Muscat', 'ethanol supplier Oman'],
        longDescription: 'Ethanol 99% supplier in Oman - Global Chemicals LLC provides USP and technical grade ethanol for pharmaceutical, laboratory, disinfection, and industrial applications in Muscat, Sohar, Salalah. Our 99% ethanol meets international quality standards for sanitizers, solvents, and chemical synthesis.',
        applications: [
          'Hand sanitizer manufacturing',
          'Pharmaceutical production',
          'Laboratory reagent',
          'Chemical synthesis',
          'Solvent extraction',
          'Disinfection and sterilization',
          'Cosmetics manufacturing'
        ],
        technicalSpecs: [
          'Purity: 99% min',
          'Appearance: Clear colorless liquid',
          'Specific gravity: 0.789',
          'Boiling point: 78°C',
          'Available in drums and IBC tanks',
          'USP/BP and technical grades'
        ]
      }
    },
    {
      id: 'ferric-chloride-liquid',
      title: 'Ferric Chloride Liquid 40%',
      description: 'Powerful coagulant for wastewater treatment and phosphorus removal.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'FeCl3',
        casNumber: '7705-08-0',
        alternativeNames: ['Iron(III) chloride', 'Ferric chloride solution', 'Iron trichloride', 'FeCl3 40%'],
        seoKeywords: ['ferric chloride Oman', 'iron chloride Oman', 'ferric chloride wastewater Muscat', 'coagulant Oman'],
        longDescription: 'Ferric Chloride Liquid 40% supplier in Oman - Global Chemicals LLC provides industrial grade ferric chloride for wastewater treatment, phosphorus removal, and PCB etching in Muscat, Sohar, Salalah. Our FeCl3 offers superior coagulation, wide pH range effectiveness, and excellent phosphorus precipitation for municipal and industrial applications.',
        applications: [
          'Wastewater coagulation',
          'Phosphorus removal',
          'Industrial effluent treatment',
          'Sludge conditioning',
          'PCB manufacturing (etching)',
          'Drinking water treatment',
          'Metal surface treatment'
        ],
        technicalSpecs: [
          'FeCl3 concentration: 38-42%',
          'Appearance: Dark brown liquid',
          'Specific gravity: 1.40-1.50',
          'pH (1% solution): <2',
          'Available in IBC tanks and bulk',
          'Effective pH range: 4-11'
        ]
      }
    },
    {
      id: 'ferrous-sulphate',
      title: 'Ferrous Sulphate',
      description: 'Flocculant and reducing agent for industrial wastewater treatment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'FeSO4·7H2O',
        casNumber: '7782-63-0',
        alternativeNames: ['Iron(II) sulfate', 'Ferrous sulfate heptahydrate', 'Copperas', 'Green vitriol'],
        seoKeywords: ['ferrous sulfate Oman', 'iron sulfate Oman', 'ferrous sulphate Muscat', 'copperas Oman'],
        longDescription: 'Ferrous Sulphate supplier in Oman - Global Chemicals LLC provides technical and agricultural grade ferrous sulfate for wastewater treatment, chromium reduction, hydrogen sulfide control, and fertilizer applications in Muscat, Sohar, Salalah. Our ferrous sulfate offers effective reducing power and flocculant properties.',
        applications: [
          'Chromium reduction in wastewater',
          'Hydrogen sulfide odor control',
          'Phosphate precipitation',
          'Iron supplement in fertilizers',
          'Pigment manufacturing',
          'Water treatment flocculant',
          'Concrete coloring'
        ],
        technicalSpecs: [
          'FeSO4·7H2O purity: 98% min',
          'Appearance: Light green crystals',
          'Iron (Fe) content: 19-20%',
          'Water insoluble: <0.05%',
          'Available in 25kg, 50kg bags',
          'pH (5% solution): 3-4'
        ]
      }
    },
    {
      id: 'glycerine-water',
      title: 'Glycerine',
      description: 'Humectant and solvent used in various water treatment formulations.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C3H8O3',
        casNumber: '56-81-5',
        alternativeNames: ['Glycerol', 'Glycerin', '1,2,3-Propanetriol', 'Glycerine USP'],
        seoKeywords: ['glycerine Oman', 'glycerol Oman', 'glycerin Muscat', 'glycerine USP Oman'],
        longDescription: 'Glycerine supplier in Oman - Global Chemicals LLC provides USP, BP, and technical grade glycerine for pharmaceutical, food, cosmetic, and industrial applications in Muscat, Sohar, Salalah. Our glycerine offers excellent humectant, solvent, and sweetening properties for diverse formulations.',
        applications: [
          'Pharmaceutical formulations',
          'Food and beverage sweetener',
          'Cosmetics and skincare',
          'Antifreeze formulations',
          'Humectant in tobacco',
          'Explosives (nitroglycerin)',
          'Personal care products'
        ],
        technicalSpecs: [
          'Purity: 99.5% min (USP grade)',
          'Appearance: Clear viscous liquid',
          'Specific gravity: 1.26',
          'Boiling point: 290°C',
          'Available in drums and IBC tanks',
          'USP, BP, Food grade available'
        ]
      }
    },
    {
      id: 'hydrated-lime',
      title: 'Hydrated Lime Tech Grade',
      description: 'Calcium hydroxide for pH adjustment and water softening.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Ca(OH)2',
        casNumber: '1305-62-0',
        alternativeNames: ['Calcium hydroxide', 'Slaked lime', 'Hydrated lime powder', 'Lime hydrate'],
        seoKeywords: ['hydrated lime Oman', 'calcium hydroxide Oman', 'slaked lime Muscat', 'lime water treatment Oman'],
        longDescription: 'Hydrated Lime Technical Grade supplier in Oman - Global Chemicals LLC provides high-reactivity calcium hydroxide for pH adjustment, water softening, wastewater neutralization, and construction applications in Muscat, Sohar, Salalah. Our hydrated lime offers excellent alkali strength and neutralization capacity.',
        applications: [
          'pH adjustment in water treatment',
          'Wastewater neutralization',
          'Flue gas desulfurization',
          'Water softening',
          'Soil stabilization',
          'Construction mortar and plaster',
          'Sugar refining'
        ],
        technicalSpecs: [
          'Ca(OH)2 purity: 90-96%',
          'Appearance: White fine powder',
          'Available calcium oxide: 68-74%',
          'pH (1% suspension): 12.4',
          'Available in 25kg, 50kg bags',
          'Bulk delivery available'
        ]
      }
    },
    {
      id: 'hydrazine-hydrate-water',
      title: 'Hydrazine Hydrate',
      description: 'Oxygen scavenger for boiler water treatment and corrosion prevention.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'N2H4·H2O',
        casNumber: '7803-57-8',
        alternativeNames: ['Hydrazine monohydrate', 'Hydrazine solution', 'Hydrazinium hydroxide', 'N2H4 hydrate'],
        seoKeywords: ['hydrazine hydrate Oman', 'oxygen scavenger Oman', 'hydrazine boiler treatment Muscat', 'N2H4 Oman'],
        longDescription: 'Hydrazine Hydrate supplier in Oman - Global Chemicals LLC provides hydrazine hydrate for boiler oxygen scavenging, corrosion prevention, and chemical synthesis in Muscat, Sohar, Salalah. Our hydrazine hydrate effectively removes dissolved oxygen from feedwater, preventing corrosion in high-pressure boilers and steam systems.',
        applications: [
          'Boiler oxygen scavenging',
          'Steam system corrosion control',
          'Power plant water treatment',
          'Chemical synthesis intermediate',
          'Pharmaceutical manufacturing',
          'Polymer production',
          'Rocket fuel component'
        ],
        technicalSpecs: [
          'Concentration: 35%, 64%, 80%',
          'Appearance: Clear colorless liquid',
          'Effective oxygen removal',
          'Dosage: 1-2 ppm per ppm O2',
          'Available in drums',
          'Requires careful handling'
        ]
      }
    },
    {
      id: 'meg-water',
      title: 'MEG (Monoethylene Glycol)',
      description: 'Antifreeze and heat transfer fluid for cooling systems.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C2H6O2',
        casNumber: '107-21-1',
        alternativeNames: ['Monoethylene glycol', 'Ethylene glycol', 'MEG', '1,2-Ethanediol'],
        seoKeywords: ['MEG Oman', 'monoethylene glycol Oman', 'ethylene glycol Muscat', 'MEG antifreeze Oman'],
        longDescription: 'Monoethylene Glycol (MEG) supplier in Oman - Global Chemicals LLC provides industrial grade MEG for antifreeze, coolant, HVAC, and gas dehydration applications in Muscat, Sohar, Salalah. Our MEG offers excellent freeze protection, heat transfer properties, and hydrate inhibition for diverse industrial systems.',
        applications: [
          'Automotive antifreeze and coolant',
          'HVAC chilled water systems',
          'Heat transfer fluid',
          'Natural gas dehydration',
          'Polyester and polyethylene production',
          'Aircraft de-icing',
          'Industrial cooling systems'
        ],
        technicalSpecs: [
          'Purity: 99.9% min',
          'Appearance: Clear colorless liquid',
          'Freezing point: -13°C',
          'Boiling point: 197°C',
          'Specific gravity: 1.115',
          'Available in drums and IBC tanks'
        ]
      }
    },
    {
      id: 'mpg-water',
      title: 'MPG (Monopropylene Glycol)',
      description: 'Food-grade antifreeze and coolant for water systems.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C3H8O2',
        casNumber: '57-55-6',
        alternativeNames: ['Monopropylene glycol', 'Propylene glycol', 'MPG', '1,2-Propanediol'],
        seoKeywords: ['MPG Oman', 'propylene glycol Oman', 'food grade antifreeze Muscat', 'MPG USP Oman'],
        longDescription: 'Monopropylene Glycol (MPG) supplier in Oman - Global Chemicals LLC provides USP and food-grade MPG for pharmaceutical, food, cosmetic, and HVAC applications in Muscat, Sohar, Salalah. Our MPG is non-toxic, making it ideal for food processing plants, breweries, and potable water contact systems.',
        applications: [
          'Food-grade antifreeze systems',
          'Pharmaceutical formulations',
          'Cosmetics and personal care',
          'Food processing cooling',
          'Brewery glycol chillers',
          'E-liquid for vaping',
          'Aircraft de-icing fluid'
        ],
        technicalSpecs: [
          'Purity: 99.8% min (USP grade)',
          'Appearance: Clear colorless liquid',
          'Food grade (FDA approved)',
          'Boiling point: 188°C',
          'Specific gravity: 1.036',
          'Available in drums and IBC tanks'
        ]
      }
    },
    {
      id: 'paraffin-wax',
      title: 'Paraffin Wax',
      description: 'Hydrocarbon wax used in water treatment and industrial applications.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        alternativeNames: ['Paraffin', 'Petroleum wax', 'Mineral wax', 'Hydrocarbon wax'],
        seoKeywords: ['paraffin wax Oman', 'petroleum wax Oman', 'paraffin Muscat', 'candle wax Oman'],
        longDescription: 'Paraffin Wax supplier in Oman - Global Chemicals LLC provides fully refined and semi-refined paraffin wax for candles, packaging, coatings, and industrial applications in Muscat, Sohar, Salalah. Our paraffin wax offers various melting points (54-68°C) to suit diverse manufacturing requirements.',
        applications: [
          'Candle manufacturing',
          'Wax coating for paper and board',
          'Rubber compounding',
          'Hot melt adhesives',
          'Cosmetics and personal care',
          'Waterproofing applications',
          'Matches and fireworks'
        ],
        technicalSpecs: [
          'Melting point: 54-68°C (various grades)',
          'Appearance: White solid blocks',
          'Oil content: <0.5% (fully refined)',
          'Congealing point: 52-70°C',
          'Available in 5kg slabs, 25kg cartons',
          'Grades: Fully refined, semi-refined'
        ]
      }
    },
    {
      id: 'petroleum-jelly',
      title: 'Petroleum Jelly',
      description: 'Protective coating and lubricant for water treatment equipment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        alternativeNames: ['Petrolatum', 'Vaseline', 'White petrolatum', 'Soft paraffin'],
        seoKeywords: ['petroleum jelly Oman', 'petrolatum Oman', 'white petrolatum Muscat', 'petroleum jelly USP Oman'],
        longDescription: 'Petroleum Jelly supplier in Oman - Global Chemicals LLC provides USP and technical grade petroleum jelly for pharmaceutical, cosmetic, and industrial applications in Muscat, Sohar, Salalah. Our petroleum jelly offers excellent moisture barrier, skin protection, and lubrication properties.',
        applications: [
          'Pharmaceutical ointments',
          'Cosmetics and skincare',
          'Skin moisturizer and protectant',
          'Rust prevention coating',
          'Equipment lubrication',
          'Electrical insulation',
          'Leather conditioning'
        ],
        technicalSpecs: [
          'Grade: USP, BP, Technical',
          'Appearance: White to yellow semi-solid',
          'Melting point: 38-60°C',
          'Viscosity: 8-9 cSt @ 100°C',
          'Available in drums and pails',
          'Non-toxic (USP grade)'
        ]
      }
    },
  {
    id: 'pac-liquid',
    title: 'Poly Aluminium Chloride Liquid',
    description: 'Advanced liquid coagulant for superior water clarification.',
    category: 'water-treatment',
    icon: Droplets,
    details: {
      formula: 'Al2(OH)nCl6-n',
      casNumber: '1327-41-9',
      alternativeNames: ['PAC', 'Polyaluminium chloride', 'Aluminium chlorohydrate', 'PAC liquid'],
      seoKeywords: ['PAC Oman', 'poly aluminium chloride Muscat', 'water coagulant Oman', 'PAC supplier Oman'],
      fullDescription: 'Poly Aluminium Chloride (PAC) is a highly effective water treatment chemical used as a coagulant in municipal and industrial water treatment plants across Oman. PAC liquid offers superior performance compared to traditional aluminum sulfate, providing better coagulation efficiency, lower dosage requirements, and wider pH range effectiveness.',
      longDescription: 'Buy Poly Aluminium Chloride (PAC) liquid in Oman from Global Chemicals LLC. PAC is the leading coagulant for water treatment plants in Muscat, Sohar, and Salalah. Our high-quality PAC ensures optimal water clarification for drinking water treatment, wastewater treatment, and industrial effluent treatment. Available in bulk quantities with technical support.',
      applications: [
        'Drinking water treatment plants',
        'Wastewater treatment facilities',
        'Industrial effluent treatment',
        'Swimming pool water treatment',
        'Paper manufacturing',
        'Textile industry wastewater'
      ],
      technicalSpecs: [
        'Al2O3 content: 10-11%',
        'Basicity: 40-90%',
        'pH (1% aqueous solution): 3.5-5.0',
        'Appearance: Clear to light yellow liquid',
        'Effective pH range: 5.0-9.0'
      ]
    },
  },
  {
    id: 'pac-powder',
    title: 'Poly Aluminium Chloride Powder',
    description: 'High-efficiency powder coagulant for municipal and industrial water treatment.',
    category: 'water-treatment',
    icon: Droplets,
    details: {
      formula: 'Al2(OH)nCl6-n',
      casNumber: '1327-41-9',
      alternativeNames: ['PAC powder', 'Polyaluminium chloride powder', 'PAC granules'],
      seoKeywords: ['PAC powder Oman', 'poly aluminium chloride powder', 'water treatment powder Oman'],
      fullDescription: 'Poly Aluminium Chloride powder is a concentrated form of PAC offering easy storage, handling, and dosing for water treatment applications. The powder form provides longer shelf life and reduced transportation costs.',
      applications: [
        'Municipal water treatment',
        'Industrial water clarification',
        'Wastewater treatment',
        'Paper and pulp industry',
        'Mining wastewater treatment'
      ],
      technicalSpecs: [
        'Al2O3 content: 28-30%',
        'Basicity: 40-90%',
        'Water insoluble: <0.6%',
        'Appearance: White to yellow powder',
        'Shelf life: 2 years'
      ]
    },
  },
    {
      id: 'polyelectrolyte',
      title: 'Polyelectrolyte',
      description: 'Polymer flocculant for solid-liquid separation and sludge dewatering.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        alternativeNames: ['Polymer flocculant', 'Polyacrylamide', 'PAM', 'Anionic/cationic polymer'],
        seoKeywords: ['polyelectrolyte Oman', 'polymer flocculant Oman', 'polyacrylamide Muscat', 'sludge dewatering Oman'],
        longDescription: 'Polyelectrolyte supplier in Oman - Global Chemicals LLC provides anionic, cationic, and non-ionic polyelectrolytes for wastewater treatment, sludge dewatering, and solid-liquid separation in Muscat, Sohar, Salalah. Our polymers enhance flocculation, improve settling, and reduce sludge volume across diverse industries.',
        applications: [
          'Wastewater treatment flocculation',
          'Sludge dewatering',
          'Mining and mineral processing',
          'Papermaking retention aid',
          'Drinking water clarification',
          'Oil field water treatment',
          'Industrial effluent treatment'
        ],
        technicalSpecs: [
          'Types: Anionic, Cationic, Non-ionic',
          'Molecular weight: 5-20 million',
          'Appearance: White powder or emulsion',
          'Dosage: 0.1-10 ppm',
          'Available in 25kg bags',
          'Powder and liquid forms'
        ]
      }
    },
    {
      id: 'potassium-hydroxide-water',
      title: 'Potassium Hydroxide',
      description: 'Strong alkali for pH adjustment and neutralization processes.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'KOH',
        casNumber: '1310-58-3',
        alternativeNames: ['Caustic potash', 'Potassium hydrate', 'KOH', 'Potash lye'],
        seoKeywords: ['potassium hydroxide Oman', 'caustic potash Oman', 'KOH Muscat', 'potassium hydroxide flakes Oman'],
        longDescription: 'Potassium Hydroxide supplier in Oman - Global Chemicals LLC provides high-purity KOH flakes and liquid for pH adjustment, chemical processing, battery manufacturing, and industrial applications in Muscat, Sohar, Salalah. Our potassium hydroxide offers strong alkalinity and excellent solubility.',
        applications: [
          'pH adjustment in water treatment',
          'Alkaline battery electrolyte',
          'Biodiesel production',
          'Soap and detergent manufacturing',
          'Chemical synthesis',
          'Food processing (food grade)',
          'Fertilizer production'
        ],
        technicalSpecs: [
          'KOH purity: 85-90% (flakes), 45-50% (liquid)',
          'Appearance: White flakes or clear liquid',
          'pH (1% solution): 13-14',
          'Available in 25kg bags, drums',
          'Technical and food grade',
          'Highly hygroscopic'
        ]
      }
    },
    {
      id: 'soda-ash-water',
      title: 'Soda Ash',
      description: 'Sodium carbonate for water softening and pH control.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Na2CO3',
        casNumber: '497-19-8',
        alternativeNames: ['Sodium carbonate', 'Washing soda', 'Soda crystals', 'Soda ash dense/light'],
        seoKeywords: ['soda ash Oman', 'sodium carbonate Oman', 'soda ash dense Muscat', 'soda ash light Oman'],
        longDescription: 'Soda Ash supplier in Oman - Global Chemicals LLC provides dense and light soda ash for water treatment, glass manufacturing, detergent production, and industrial processes in Muscat, Sohar, Salalah. Our sodium carbonate offers effective pH adjustment, water softening, and alkalinity building.',
        applications: [
          'Water softening',
          'pH adjustment',
          'Glass manufacturing',
          'Detergent and soap production',
          'Paper and pulp industry',
          'Chemical manufacturing',
          'Swimming pool pH balance'
        ],
        technicalSpecs: [
          'Na2CO3 purity: 99.2% min',
          'Grades: Dense (heavy), Light',
          'Appearance: White powder/granules',
          'Bulk density: 900-1100 kg/m³ (dense)',
          'pH (1% solution): 11.3-11.7',
          'Available in 25kg, 50kg bags'
        ]
      }
    },
    {
      id: 'sodium-bicarbonate-water',
      title: 'Sodium Bicarbonate',
      description: 'Alkalinity builder and pH buffer for water treatment systems.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'NaHCO3',
        casNumber: '144-55-8',
        alternativeNames: ['Baking soda', 'Bicarbonate of soda', 'Sodium hydrogen carbonate', 'NaHCO3'],
        seoKeywords: ['sodium bicarbonate Oman', 'baking soda industrial Oman', 'sodium bicarbonate Muscat', 'bicarbonate supplier Oman'],
        longDescription: 'Sodium Bicarbonate supplier in Oman - Global Chemicals LLC provides food grade and technical grade sodium bicarbonate for water treatment, food processing, fire extinguishers, and industrial applications in Muscat, Sohar, Salalah. Our sodium bicarbonate offers pH buffering, alkalinity control, and neutralization.',
        applications: [
          'pH buffering in water treatment',
          'Alkalinity adjustment',
          'Flue gas desulfurization',
          'Food processing and baking',
          'Fire extinguisher powder',
          'Pharmaceutical manufacturing',
          'Animal feed supplement'
        ],
        technicalSpecs: [
          'NaHCO3 purity: 99% min',
          'Appearance: White crystalline powder',
          'pH (1% solution): 8.3',
          'Available in 25kg bags',
          'Food grade and technical grade',
          'Excellent buffering capacity'
        ]
      }
    },
    {
      id: 'sodium-bisulphate-bisulphite',
      title: 'Sodium Bisulphate / Bisulphite',
      description: 'Reducing agent and dechlorination chemical for water treatment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'NaHSO4 / NaHSO3',
        alternativeNames: ['Sodium bisulfate', 'Sodium bisulfite', 'Dry acid', 'Sodium hydrogen sulfate/sulfite'],
        seoKeywords: ['sodium bisulfate Oman', 'sodium bisulfite Oman', 'dechlorination Muscat', 'dry acid Oman'],
        longDescription: 'Sodium Bisulphate/Bisulphite supplier in Oman - Global Chemicals LLC provides sodium bisulfate (dry acid) and sodium bisulfite (reducing agent) for pH control, dechlorination, and industrial applications in Muscat, Sohar, Salalah. Safe alternatives to mineral acids for various water treatment needs.',
        applications: [
          'Swimming pool pH reduction',
          'Dechlorination of water',
          'Wastewater neutralization',
          'Food preservation',
          'Textile bleaching',
          'Cleaning compound manufacturing',
          'Boiler water treatment'
        ],
        technicalSpecs: [
          'Bisulfate purity: 93% min',
          'Bisulfite: 38-40% solution',
          'Appearance: White granules / liquid',
          'Safer than mineral acids',
          'Available in 25kg bags, drums',
          'Effective pH control'
        ]
      }
    },
    {
      id: 'sodium-hexametaphosphate',
      title: 'Sodium Hexametaphosphate',
      description: 'Sequestering agent for preventing scale and corrosion in water systems.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: '(NaPO3)6',
        casNumber: '68915-31-1',
        alternativeNames: ['SHMP', 'Sodium polyphosphate', 'Grahams salt', 'Calgon'],
        seoKeywords: ['sodium hexametaphosphate Oman', 'SHMP Oman', 'water softener Muscat', 'scale inhibitor Oman'],
        longDescription: 'Sodium Hexametaphosphate (SHMP) supplier in Oman - Global Chemicals LLC provides food grade and technical grade SHMP for water softening, scale prevention, detergent formulation, and food processing in Muscat, Sohar, Salalah. Our SHMP chelates hardness ions, preventing scale in water systems.',
        applications: [
          'Water softening',
          'Scale and corrosion inhibition',
          'Detergent builder',
          'Food processing emulsifier',
          'Ceramic industry',
          'Metal surface treatment',
          'Drilling mud dispersant'
        ],
        technicalSpecs: [
          'P2O5 content: 68% min',
          'Appearance: White powder/granules',
          'pH (1% solution): 5.8-7.3',
          'Available in 25kg bags',
          'Food grade and technical grade',
          'Excellent chelating properties'
        ]
      }
    },
    {
      id: 'sodium-hypochlorite-2',
      title: 'Sodium Hypochlorite Solution',
      description: 'Liquid bleach and disinfectant for water purification.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'NaOCl',
        casNumber: '7681-52-9',
        alternativeNames: ['Liquid chlorine', 'Bleach solution', 'Hypo', 'Sodium hypochlorite 12-15%'],
        seoKeywords: ['sodium hypochlorite solution Oman', 'liquid bleach Oman', 'hypo Muscat', 'liquid chlorine Oman'],
        longDescription: 'Sodium Hypochlorite Solution supplier in Oman - Global Chemicals LLC provides bulk sodium hypochlorite for water treatment, disinfection, and industrial applications in Muscat, Sohar, Salalah. Our liquid chlorine offers reliable disinfection with on-site generation options available.',
        applications: [
          'Municipal water disinfection',
          'Wastewater treatment',
          'Swimming pool chlorination',
          'Industrial bleaching',
          'Surface sanitation',
          'Odor control',
          'CIP cleaning'
        ],
        technicalSpecs: [
          'Available chlorine: 12-15%',
          'Appearance: Pale yellow liquid',
          'pH: 11-13',
          'Specific gravity: 1.20-1.25',
          'Available in IBC tanks and bulk',
          'On-site generation available'
        ]
      }
    },
    {
      id: 'sodium-meta-silicate',
      title: 'Sodium Meta Silicate',
      description: 'Alkaline builder and detergent for industrial cleaning and water treatment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Na2SiO3',
        casNumber: '6834-92-0',
        alternativeNames: ['Sodium metasilicate', 'Sodium silicate', 'Waterglass', 'Liquid glass'],
        seoKeywords: ['sodium metasilicate Oman', 'sodium silicate Oman', 'waterglass Muscat', 'alkaline cleaner Oman'],
        longDescription: 'Sodium Meta Silicate supplier in Oman - Global Chemicals LLC provides sodium metasilicate pentahydrate and anhydrous forms for detergent manufacturing, metal cleaning, and industrial applications in Muscat, Sohar, Salalah. Our sodium silicate offers alkalinity, deflocculation, and corrosion inhibition.',
        applications: [
          'Detergent and soap manufacturing',
          'Metal cleaning and degreasing',
          'Concrete surface treatment',
          'Pulp and paper processing',
          'Ore flotation',
          'Adhesive production',
          'Fireproofing agent'
        ],
        technicalSpecs: [
          'Forms: Pentahydrate, Anhydrous',
          'Appearance: White crystalline powder',
          'pH (1% solution): 12-13',
          'Available in 25kg bags',
          'Strong alkaline properties',
          'Excellent dispersing action'
        ]
      }
    },
    {
      id: 'sodium-metabisulphite',
      title: 'Sodium Metabisulphite',
      description: 'Preservative and dechlorination agent for water treatment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Na2S2O5',
        casNumber: '7681-57-4',
        alternativeNames: ['Sodium metabisulfite', 'SMBS', 'Disodium metabisulfite', 'Sodium pyrosulfite'],
        seoKeywords: ['sodium metabisulfite Oman', 'SMBS Oman', 'dechlorination Muscat', 'sodium metabisulphite Oman'],
        longDescription: 'Sodium Metabisulphite supplier in Oman - Global Chemicals LLC provides food grade and technical grade SMBS for dechlorination, food preservation, and industrial applications in Muscat, Sohar, Salalah. Our sodium metabisulfite effectively removes residual chlorine and serves as antioxidant.',
        applications: [
          'Dechlorination of water',
          'Food and beverage preservation',
          'Wine and beer making',
          'Textile bleaching',
          'Photography chemicals',
          'Boiler water oxygen scavenging',
          'Gold extraction in mining'
        ],
        technicalSpecs: [
          'Na2S2O5 purity: 96% min',
          'Appearance: White crystalline powder',
          'SO2 content: 65% min',
          'pH (1% solution): 4.0-5.5',
          'Available in 25kg bags',
          'Food grade and technical grade'
        ]
      }
    },
    {
      id: 'sodium-sulphite',
      title: 'Sodium Sulphite',
      description: 'Oxygen scavenger and preservative for boiler water treatment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Na2SO3',
        casNumber: '7757-83-7',
        alternativeNames: ['Sodium sulfite', 'Disodium sulfite', 'Sulfurous acid disodium salt'],
        seoKeywords: ['sodium sulfite Oman', 'oxygen scavenger Oman', 'sodium sulphite Muscat', 'boiler treatment Oman'],
        longDescription: 'Sodium Sulphite supplier in Oman - Global Chemicals LLC provides sodium sulfite for boiler oxygen scavenging, dechlorination, and food preservation in Muscat, Sohar, Salalah. Our sodium sulfite removes dissolved oxygen from feedwater, preventing corrosion in boiler systems.',
        applications: [
          'Boiler oxygen scavenging',
          'Dechlorination',
          'Food preservation',
          'Photographic development',
          'Textile processing',
          'Pulp and paper bleaching',
          'Water treatment'
        ],
        technicalSpecs: [
          'Na2SO3 purity: 96% min',
          'Appearance: White crystalline powder',
          'pH (1% solution): 9-10',
          'Available in 25kg bags',
          'Reacts with dissolved oxygen',
          'Food grade and technical grade'
        ]
      }
    },
    {
      id: 'sulphamic-acid',
      title: 'Sulphamic Acid',
      description: 'Descaling agent for removing mineral deposits from equipment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'H3NSO3',
        casNumber: '5329-14-6',
        alternativeNames: ['Sulfamic acid', 'Amidosulfonic acid', 'Aminosulfonic acid'],
        seoKeywords: ['sulfamic acid Oman', 'descaling agent Oman', 'sulphamic acid Muscat', 'scale remover Oman'],
        longDescription: 'Sulphamic Acid supplier in Oman - Global Chemicals LLC provides high-purity sulfamic acid for descaling, cleaning, and industrial applications in Muscat, Sohar, Salalah. Our sulfamic acid effectively removes calcium carbonate, rust, and scale from boilers, heat exchangers, and equipment.',
        applications: [
          'Descaling boilers and heat exchangers',
          'Cleaning industrial equipment',
          'Bathroom and kitchen cleaners',
          'Pulp and paper industry',
          'Catalyst preparation',
          'Electroplating baths',
          'Herbicide formulation'
        ],
        technicalSpecs: [
          'Purity: 99.5% min',
          'Appearance: White crystalline powder',
          'pH (1% solution): <1',
          'Non-volatile and stable',
          'Available in 25kg bags',
          'Safer than mineral acids'
        ]
      }
    },
    {
      id: 'tri-ethanol-amine',
      title: 'Tri Ethanol Amine',
      description: 'Corrosion inhibitor and pH adjuster for water systems.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'C6H15NO3',
        casNumber: '102-71-6',
        alternativeNames: ['Triethanolamine', 'TEA', 'Trolamine', 'Nitrilotriethanol'],
        seoKeywords: ['triethanolamine Oman', 'TEA Oman', 'triethanolamine Muscat', 'TEA supplier Oman'],
        longDescription: 'Triethanolamine (TEA) supplier in Oman - Global Chemicals LLC provides TEA for corrosion inhibition, pH adjustment, emulsifier, and industrial applications in Muscat, Sohar, Salalah. Our TEA serves as pH adjuster, surfactant, and corrosion inhibitor in diverse formulations.',
        applications: [
          'Corrosion inhibitor in coolants',
          'pH adjuster in water treatment',
          'Emulsifier in cosmetics',
          'Cement grinding aid',
          'Metalworking fluids',
          'Gas treating (CO2 removal)',
          'Textile processing'
        ],
        technicalSpecs: [
          'Purity: 99% min',
          'Appearance: Colorless viscous liquid',
          'pH (1% solution): 10-11',
          'Boiling point: 335°C',
          'Available in drums and IBC tanks',
          'Fully water soluble'
        ]
      }
    },
    {
      id: 'tsp-water',
      title: 'TSP (Tri Sodium Phosphate)',
      description: 'Heavy-duty cleaner and degreaser for industrial water treatment.',
      category: 'water-treatment',
      icon: Droplets,
      details: {
        formula: 'Na3PO4',
        casNumber: '7601-54-9',
        alternativeNames: ['Trisodium phosphate', 'Sodium phosphate tribasic', 'TSP cleaner', 'Na3PO4'],
        seoKeywords: ['trisodium phosphate Oman', 'TSP Oman', 'heavy duty cleaner Muscat', 'TSP degreaser Oman'],
        longDescription: 'Trisodium Phosphate (TSP) supplier in Oman - Global Chemicals LLC provides TSP for heavy-duty cleaning, degreasing, water softening, and industrial applications in Muscat, Sohar, Salalah. Our TSP offers powerful alkaline cleaning and pH adjustment properties.',
        applications: [
          'Heavy-duty industrial cleaning',
          'Paint preparation and removal',
          'Metal surface degreasing',
          'Water softening',
          'Boiler water treatment',
          'Food processing equipment cleaning',
          'Concrete etching and preparation'
        ],
        technicalSpecs: [
          'Na3PO4 purity: 98% min',
          'Appearance: White crystalline powder',
          'pH (1% solution): 11.5-12',
          'Available in 25kg bags',
          'Strong alkaline cleaner',
          'Excellent grease cutting power'
        ]
      }
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

    // Corrosion Inhibitor
    {
      id: 'corrosion-inhibitor-multi-metal',
      title: 'Corrosion Inhibitor For Multi Metal Cooling Water',
      description: 'Specialized corrosion protection for multi-metal cooling water systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'corrosion-inhibitor-2000',
      title: 'Corrosion Inhibitor 2000',
      description: 'Advanced formula for comprehensive metal protection in industrial systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'corrosion-inhibitor-rust-preventive',
      title: 'Corrosion Inhibitor For Metal Rust Preventive',
      description: 'Rust prevention solution for metal surfaces and equipment.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'corrosion-inhibitor-molybdate',
      title: 'Corrosion Inhibitor Closed Cooling System Molybdate',
      description: 'Molybdate-based corrosion protection for closed cooling systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'corrosion-inhibitor-general',
      title: 'Corrosion Inhibitor',
      description: 'General-purpose corrosion prevention chemical for industrial applications.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'corrosion-inhibitor-gas-compressor',
      title: 'Corrosion Inhibitor For Gas Compressor',
      description: 'Specialized protection for gas compressor systems and components.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'sodium-molybdate',
      title: 'Sodium Molybdate',
      description: 'Anodic corrosion inhibitor for cooling water treatment systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'oxygen-scavenger',
      title: 'Oxygen Scavenger',
      description: 'Removes dissolved oxygen to prevent corrosion in water systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'ph-booster-corrosion-inhibitor',
      title: 'Ph Booster Cum Corrosion Inhibitor',
      description: 'Dual-action formula for pH control and corrosion prevention.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },
    {
      id: 'corrosion-inhibitor-closed-system',
      title: 'Corrosion Inhibitor Closed Cooling System',
      description: 'Comprehensive protection for closed-loop cooling systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
    },

    // Tank Cleaners
    {
      id: 'hcf-remover',
      title: 'HCF Remover',
      description: 'Heavy carbon and fouling remover for industrial tank cleaning.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'resin-clean',
      title: 'Resin Clean',
      description: 'Specialized cleaner for resin and polymer residue removal.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'universal-wash',
      title: 'Universal Wash',
      description: 'Multi-purpose cleaning solution for various tank applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'methanol-tech-grade-cleaner',
      title: 'Methanol Tech Grade',
      description: 'Technical grade methanol for industrial cleaning and degreasing.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'tank-degreaser-heavy-duty',
      title: 'Tank Degreaser Heavy Duty',
      description: 'Industrial-strength degreaser for heavy oil and grease removal.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'lye-sodium-hydroxide-liquid',
      title: 'Lye Sodium Hydroxide Liquid',
      description: 'Alkaline cleaning solution for industrial tank maintenance.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'tank-cleaner-general',
      title: 'Tank Cleaner',
      description: 'General-purpose tank cleaning formulation for industrial use.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'sewage-deformer',
      title: 'Sewage Deformer',
      description: 'Foam control agent for sewage and wastewater tank systems.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'alkaleen-cleaner-safety',
      title: 'Alkaleen Cleaner Safety Liquid',
      description: 'Safe alkaline cleaner for various industrial cleaning applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'emulsion-sludge-breaker',
      title: 'Emulsion Sludge Breaker',
      description: 'Breaks down emulsions and sludge in storage tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'oil-spill-dispersent-type-3',
      title: 'Oil Spill Dispersent Type 3',
      description: 'Type 3 dispersant for oil spill response and tank cleaning.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'aqua-clean-hd',
      title: 'Aqua Clean HD',
      description: 'Heavy-duty aqueous cleaning solution for industrial tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'cold-washer-hd',
      title: 'Cold Washer HD',
      description: 'Cold-water heavy-duty cleaner for efficient tank washing.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'passivation-liquid',
      title: 'Passivation Liquid',
      description: 'Chemical passivation treatment for stainless steel tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'edge-sol-cleaner',
      title: 'Edge Sol Cleaner',
      description: 'Solvent-based edge and seam cleaning solution.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'enviro-soft-2000',
      title: 'Enviro Soft 2000',
      description: 'Environmentally friendly softening and cleaning agent.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'dual-hd-cleaner',
      title: 'Dual HD Cleaner',
      description: 'Dual-action heavy-duty cleaner for versatile tank applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'metal-bright',
      title: 'Metal Bright',
      description: 'Metal brightening and cleaning solution for tank surfaces.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'p-xylene-pure',
      title: 'P Xylene Pure',
      description: 'Pure p-xylene solvent for industrial cleaning applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'ctc-volc-cleaner',
      title: 'CTC Volc Cleaner',
      description: 'Volcanic ash and carbon cleaner for specialized tank cleaning.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },
    {
      id: 'aquatuff-ship-hold-cleaner',
      title: 'Aquatuff Ship Hold Cleaner',
      description: 'Marine-grade cleaner for ship holds and cargo tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
    },

    // RO Chemicals
    {
      id: 'ro-passivation',
      title: 'RO Passivation',
      description: 'Passivation treatment for reverse osmosis membrane protection and preservation.',
      category: 'ro-chemicals',
      icon: Droplets,
    },
    {
      id: 'citric-acid-liquid-ro',
      title: 'Citric Acid Liquid',
      description: 'Organic acid cleaner for RO membrane descaling and fouling removal.',
      category: 'ro-chemicals',
      icon: Droplets,
    },
    {
      id: 'ro-222-descaler',
      title: 'RO 222 Descaler',
      description: 'Specialized descaling solution for reverse osmosis membrane systems.',
      category: 'ro-chemicals',
      icon: Droplets,
    },
    {
      id: 'sodium-hydroxide-alkaleen',
      title: 'Sodium Hydroxide Based Alkaleen Cleaner',
      description: 'Alkaline cleaner for organic fouling and biological growth removal from RO membranes.',
      category: 'ro-chemicals',
      icon: Droplets,
    },
    {
      id: 'membrane-cleaner-ro',
      title: 'Membrane Cleaner',
      description: 'Comprehensive cleaning solution for RO membrane maintenance and restoration.',
      category: 'ro-chemicals',
      icon: Droplets,
    },
    {
      id: 'antiscalant-ro',
      title: 'Antiscalant RO',
      description: 'Scale inhibitor for preventing mineral deposits on reverse osmosis membranes.',
      category: 'ro-chemicals',
      icon: Droplets,
    },
    {
      id: 'membrane-alka-cleaner',
      title: 'Membrane Alka Cleaner',
      description: 'Alkaline formulation for removing organic and biological fouling from membranes.',
      category: 'ro-chemicals',
      icon: Droplets,
    },
    {
      id: 'membrane-antiscalant-ro',
      title: 'Membrane Antiscalant RO',
      description: 'Advanced antiscalant for comprehensive membrane scale prevention.',
      category: 'ro-chemicals',
      icon: Droplets,
    },

    // Cooling Water Chemicals
    {
      id: 'corrosion-inhibitor-closed-loop',
      title: 'Corrosion Inhibitor Closed Loop',
      description: 'Corrosion protection for closed-loop cooling water systems.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'algae-control',
      title: 'Algae Control',
      description: 'Algaecide for preventing algae growth in cooling towers and water systems.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'biological-guard-antifouling',
      title: 'Biological Guard Antifouling',
      description: 'Biocide for controlling biological fouling in cooling water systems.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'micro-biocid-cooling-water',
      title: 'Micro Biocid Cooling Water',
      description: 'Microbiocide for microbial control in cooling tower applications.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'biocide-cooling',
      title: 'Biocide',
      description: 'Broad-spectrum biocide for cooling water treatment and microbial control.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'hardness-control-boiler',
      title: 'Hardness Control Boiler Treatment',
      description: 'Chemical treatment for controlling water hardness in boiler systems.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'biocide-closed-loop-chiller',
      title: 'Biocide For Closed Loop Chiller Water',
      description: 'Specialized biocide for closed-loop chiller water systems.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'cool-water-treat-corrosion',
      title: 'Cool Water Treat Corrosion Inhibitor',
      description: 'Corrosion inhibitor formulated for cooling water treatment applications.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'altreat-4000',
      title: 'Altreat 4000',
      description: 'All-in-one cooling water treatment chemical for comprehensive system protection.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'corro-guard-antifoulant',
      title: 'Corro Guard For Antifoulant for Cooling Water',
      description: 'Dual-action corrosion inhibitor and antifoulant for cooling water systems.',
      category: 'cooling-water',
      icon: Droplets,
    },
    {
      id: 'antifouling-liquid',
      title: 'Antifouling Liquid',
      description: 'Liquid antifoulant for preventing deposits and fouling in cooling systems.',
      category: 'cooling-water',
      icon: Droplets,
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

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const isMobile = useIsMobile();

  const categories = [
    { id: 'all', name: 'All Products', icon: FlaskConical },
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

  const getFilteredProducts = (categoryId: string) => {
    if (categoryId === 'all') return products;
    return products.filter((product) => product.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Chemical Products Catalog | Water Treatment & Industrial Chemicals | Global Chemicals Oman"
        description="Comprehensive catalog of water treatment chemicals, industrial lubricants, laboratory chemicals, and specialty chemicals in Oman. PAC, caustic soda, calcium hypochlorite, Shell & Mobil lubricants. Serving Muscat, Sohar, Salalah, Duqm. ISO certified supplier."
        keywords="water treatment chemicals Oman, PAC Oman, caustic soda Oman, calcium hypochlorite Oman, industrial chemicals Muscat, laboratory chemicals Oman, Shell lubricants Oman, Mobil oils Oman, chemical supplier Muscat, chemicals Sohar, Salalah chemicals, industrial lubricants Oman, RO chemicals Oman, cooling tower chemicals, swimming pool chemicals Oman"
        ogTitle="Chemical Products | Water Treatment & Industrial Chemicals Oman"
        ogDescription="Leading chemical supplier in Oman. Browse our complete catalog of water treatment chemicals, industrial lubricants, and specialty chemicals. Serving Muscat, Sohar, Salalah."
        ogUrl="https://www.gcoman.com/products"
        canonical="https://www.gcoman.com/products"
      />
      <OrganizationStructuredData includeService={true} />
      
      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Premium Chemical Products for Oman
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive range of water treatment chemicals, industrial lubricants, laboratory chemicals, and specialty products. 
              Serving industries across Muscat, Sohar, Duqm, Salalah, and Rusayl Industrial Area with ISO-certified quality and technical excellence.
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">ISO 9001 Certified</span>
              <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full font-medium">10+ Years Experience</span>
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full font-medium">1000+ Products</span>
              <span className="px-4 py-2 bg-tertiary/10 text-tertiary rounded-full font-medium">Technical Support</span>
            </div>
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
                <div className="lg:sticky lg:top-24 space-y-2">
                  <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-xs sm:text-sm uppercase tracking-wide px-2 sm:px-3">
                    Product Categories
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
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {categories.find((c) => c.id === activeCategory)?.name || 'All Products'}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {getFilteredProducts(activeCategory).length} products available · Tap any product to view details
                  </p>
                </div>

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
                      No products available in this category at the moment.
                    </p>
                  </div>
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
                      <h4 className="font-semibold text-foreground mb-2 text-sm">Chemical Formula</h4>
                      <p className="text-muted-foreground font-mono text-base">{selectedProduct.details.formula}</p>
                    </div>
                  )}

                  {selectedProduct.details?.fullDescription && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">Description</h4>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {selectedProduct.details.fullDescription}
                      </p>
                    </div>
                  )}

                  {selectedProduct.details?.applications && selectedProduct.details.applications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 text-sm">Applications</h4>
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
              Leading chemical supplier in Oman with proven track record serving oil & gas, manufacturing, water treatment, and industrial sectors across Muscat, Sohar, Salalah, and Duqm.
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
    </div>
  );
};

export default Products;
