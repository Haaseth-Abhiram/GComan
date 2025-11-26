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
      id: 'sulfuric-acid-lab',
      title: 'Sulfuric Acid (Laboratory Grade)',
      description: 'High-purity sulfuric acid for laboratory analysis, research, and industrial applications.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'H2SO4',
        casNumber: '7664-93-9',
        alternativeNames: ['Sulphuric acid', 'Oil of vitriol', 'Battery acid', 'Hydrogen sulfate', 'Dihydrogen sulfate'],
        seoKeywords: ['sulfuric acid Oman', 'lab grade sulfuric acid Muscat', 'H2SO4 Oman', 'laboratory acid Muscat', 'sulfuric acid Sohar', 'analytical grade acid Oman'],
        longDescription: 'Laboratory Grade Sulfuric Acid supplier in Oman - Global Chemicals LLC provides high-purity sulfuric acid for research laboratories, universities, and industrial quality control in Muscat, Sohar, Duqm, Salalah. Our lab-grade H2SO4 meets ACS specifications for analytical work, titrations, and chemical synthesis. Available in various concentrations (95-98%, diluted grades) for different laboratory applications. Essential for pH adjustment, digestion procedures, battery electrolyte preparation, and organic synthesis. Widely used in Sultan Qaboos University labs, PDO research facilities, OPAL labs, and industrial QC laboratories across Oman. The strong mineral acid is critical for analytical chemistry, petroleum testing, and materials analysis.',
        applications: [
          'Analytical chemistry and titrations',
          'pH adjustment and buffer preparation',
          'Sample digestion for metal analysis',
          'Organic synthesis and esterification',
          'Battery electrolyte preparation',
          'Petroleum product testing',
          'Textile and dye chemistry',
          'University research and teaching labs'
        ],
        technicalSpecs: [
          'Purity: 95-98% (concentrated), ACS reagent grade',
          'Appearance: Clear, colorless, viscous liquid',
          'Specific gravity: 1.84',
          'Assay: Meets ACS specifications',
          'Low in heavy metals and impurities',
          'Available: 500ml, 2.5L, 5L bottles',
          'Storage: Glass or PP containers'
        ]
      },
    },
    {
      id: 'hydrochloric-acid-lab',
      title: 'Hydrochloric Acid (Laboratory Grade)',
      description: 'High-purity hydrochloric acid for laboratory and analytical applications.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'HCl',
        casNumber: '7647-01-0',
        alternativeNames: ['Muriatic acid', 'Hydrogen chloride solution', 'HCl', 'Hydrochloric acid solution'],
        seoKeywords: ['hydrochloric acid Oman', 'HCl lab grade Muscat', 'muriatic acid laboratory Oman', 'analytical HCl Sohar', 'lab acid Muscat'],
        longDescription: 'Laboratory Grade Hydrochloric Acid supplier in Oman - Global Chemicals LLC provides ACS-grade hydrochloric acid for research, analysis, and quality control laboratories in Muscat, Sohar, Duqm, Salalah. Our high-purity HCl is essential for pH adjustment, titrations, sample digestion, and chemical synthesis. Available in various concentrations (32-37% concentrated, 1N, 0.1N standardized solutions) to meet specific laboratory requirements. Widely used in university labs, oilfield laboratories, pharmaceutical QC, and industrial testing facilities across Oman. Essential for metal dissolution, ore analysis, and routine analytical procedures in research institutions.',
        applications: [
          'pH adjustment and standardization',
          'Acid-base titrations',
          'Metal dissolution and digestion',
          'Ore and mineral analysis',
          'Pharmaceutical testing and QC',
          'Protein extraction and precipitation',
          'Chloride determination',
          'Educational laboratory experiments'
        ],
        technicalSpecs: [
          'Purity: 36-38% (concentrated), ACS reagent grade',
          'Standardized solutions: 0.1N, 1N available',
          'Appearance: Clear, colorless liquid',
          'Assay: Meets ACS specifications',
          'Low non-volatile residue',
          'Available: 500ml, 2.5L, 5L bottles',
          'Certified analysis provided'
        ]
      },
    },
    {
      id: 'nitric-acid-lab',
      title: 'Nitric Acid (Laboratory Grade)',
      description: 'High-purity nitric acid for laboratory analysis and oxidation reactions.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'HNO3',
        casNumber: '7697-37-2',
        alternativeNames: ['Aqua fortis', 'Hydrogen nitrate', 'HNO3', 'Nitrogen acid'],
        seoKeywords: ['nitric acid Oman', 'HNO3 lab grade Muscat', 'laboratory nitric acid Sohar', 'analytical nitric acid Oman', 'aqua fortis Muscat'],
        longDescription: 'Laboratory Grade Nitric Acid supplier in Oman - Global Chemicals LLC provides high-purity nitric acid for analytical laboratories, research institutions, and industrial QC facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade HNO3 is essential for metal digestion, trace analysis, and oxidation reactions. Available in various concentrations (68-70% concentrated, diluted grades, trace metal grade for ICP-MS). Critical for petroleum testing, environmental analysis, and materials characterization. Widely used in PDO labs, university research facilities, OPAL analytical services, and oilfield testing laboratories across Oman for sample preparation and quantitative analysis.',
        applications: [
          'Metal digestion for ICP and AAS analysis',
          'Trace metal analysis preparation',
          'Oxidation reactions in organic synthesis',
          'Petroleum product analysis',
          'Environmental sample preparation',
          'Nitration reactions',
          'Passivation of stainless steel',
          'Explosive and propellant manufacture'
        ],
        technicalSpecs: [
          'Purity: 68-70% (concentrated), ACS/trace metal grade',
          'Appearance: Clear, colorless to pale yellow liquid',
          'Specific gravity: 1.42',
          'Trace metal grade: <10 ppb impurities',
          'Assay: Meets ACS specifications',
          'Available: 500ml, 2.5L bottles',
          'Storage: Glass containers, cool environment'
        ]
      },
    },
    {
      id: 'acetic-acid-lab',
      title: 'Acetic Acid (Glacial, Laboratory Grade)',
      description: 'High-purity glacial acetic acid for laboratory synthesis and analytical work.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'CH3COOH',
        casNumber: '64-19-7',
        alternativeNames: ['Glacial acetic acid', 'Ethanoic acid', 'Vinegar acid', 'Methanecarboxylic acid'],
        seoKeywords: ['glacial acetic acid Oman', 'acetic acid laboratory Muscat', 'ethanoic acid Oman', 'lab acetic acid Sohar', 'CH3COOH Muscat'],
        longDescription: 'Glacial Acetic Acid supplier in Oman - Global Chemicals LLC provides laboratory-grade glacial acetic acid (99.5%+ purity) for research, synthesis, and analytical applications in Muscat, Sohar, Duqm, Salalah. Our high-purity acetic acid is essential for buffer preparation, esterification reactions, chromatography, and organic synthesis. The "glacial" designation indicates anhydrous acetic acid that crystallizes at 16.6°C. Widely used in university laboratories, pharmaceutical research, chemical synthesis, and industrial QC facilities across Oman. Essential for HPLC mobile phase preparation, pH adjustment, and acetylation reactions in research institutions.',
        applications: [
          'HPLC and chromatography mobile phases',
          'Buffer preparation and pH control',
          'Esterification and acetylation reactions',
          'Organic synthesis and chemical reactions',
          'Pharmaceutical formulation',
          'Histology tissue fixation',
          'Protein precipitation',
          'Educational chemistry experiments'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (glacial)',
          'Appearance: Clear, colorless liquid',
          'Melting point: 16.6°C (crystallizes when pure)',
          'Assay: Meets ACS reagent specifications',
          'Water content: <0.5%',
          'Available: 500ml, 2.5L, 5L bottles',
          'Suitable for HPLC and analytical work'
        ]
      },
    },
    {
      id: 'phosphoric-acid-lab',
      title: 'Phosphoric Acid (Laboratory Grade)',
      description: 'High-purity phosphoric acid for laboratory analysis and buffer preparation.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'H3PO4',
        casNumber: '7664-38-2',
        alternativeNames: ['Orthophosphoric acid', 'H3PO4', 'Phosphoric(V) acid'],
        seoKeywords: ['phosphoric acid Oman', 'H3PO4 laboratory Muscat', 'orthophosphoric acid Oman', 'lab phosphoric acid Sohar', 'buffer acid Muscat'],
        longDescription: 'Laboratory Grade Phosphoric Acid supplier in Oman - Global Chemicals LLC provides high-purity phosphoric acid for analytical laboratories and research facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade H3PO4 (85% concentrated) is essential for buffer preparation, pH adjustment, and HPLC applications. The triprotic acid offers excellent buffering capacity in the pH 2-8 range. Widely used in university labs, pharmaceutical QC, food testing laboratories, and industrial analysis across Oman. Essential for phosphate buffer systems, chromatography, and molecular biology applications in research institutions.',
        applications: [
          'Phosphate buffer preparation',
          'HPLC mobile phase acidification',
          'pH adjustment in analytical methods',
          'Rust removal and metal treatment',
          'Molecular biology and biochemistry',
          'Food analysis and beverage testing',
          'Fertilizer analysis',
          'Pharmaceutical formulation'
        ],
        technicalSpecs: [
          'Purity: 85% minimum (concentrated), ACS grade',
          'Appearance: Clear, colorless, syrupy liquid',
          'Specific gravity: 1.69',
          'Assay: Meets ACS specifications',
          'Suitable for HPLC applications',
          'Available: 500ml, 2.5L, 5L bottles',
          'Excellent buffering properties'
        ]
      },
    },
    {
      id: 'sodium-hydroxide-pellets-lab',
      title: 'Sodium Hydroxide Pellets (Laboratory Grade)',
      description: 'High-purity sodium hydroxide pellets for laboratory use and analysis.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Caustic soda', 'Lye', 'Sodium hydrate', 'NaOH pellets', 'Soda lye'],
        seoKeywords: ['sodium hydroxide pellets Oman', 'NaOH laboratory Muscat', 'caustic soda pellets Oman', 'lab grade NaOH Sohar', 'analytical caustic Muscat'],
        longDescription: 'Laboratory Grade Sodium Hydroxide Pellets supplier in Oman - Global Chemicals LLC provides high-purity NaOH pellets for analytical laboratories, research institutions, and quality control facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade sodium hydroxide pellets are essential for pH adjustment, titrations, saponification, and base standardization. The pellet form ensures easy handling, precise weighing, and minimal dust exposure. Widely used in university labs, oilfield laboratories, pharmaceutical testing, and industrial analysis across Oman. Essential for preparing standard base solutions, neutralization reactions, and chemical synthesis in research facilities.',
        applications: [
          'pH adjustment and neutralization',
          'Base standardization and titrations',
          'Saponification reactions',
          'Soap and detergent manufacture',
          'Protein extraction and DNA isolation',
          'Petroleum product analysis',
          'Standard solution preparation',
          'Chemical synthesis and reactions'
        ],
        technicalSpecs: [
          'Purity: 97-99% (ACS reagent grade)',
          'Form: White pellets/prills',
          'Assay: Meets ACS specifications',
          'Low in carbonate and heavy metals',
          'Easy to weigh and dissolve',
          'Hygroscopic - store in sealed container',
          'Available: 500g, 1kg, 5kg bottles'
        ]
      },
    },
    {
      id: 'potassium-hydroxide-pellets-lab',
      title: 'Potassium Hydroxide Pellets (Laboratory Grade)',
      description: 'High-purity potassium hydroxide pellets for laboratory and analytical use.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'KOH',
        casNumber: '1310-58-3',
        alternativeNames: ['Caustic potash', 'KOH', 'Potassium hydrate', 'Potash lye'],
        seoKeywords: ['potassium hydroxide Oman', 'KOH laboratory Muscat', 'caustic potash pellets Oman', 'analytical KOH Sohar', 'lab potassium hydroxide Muscat'],
        longDescription: 'Laboratory Grade Potassium Hydroxide Pellets supplier in Oman - Global Chemicals LLC provides high-purity KOH pellets for research laboratories and analytical facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade potassium hydroxide is essential for biodiesel production research, saponification values, pH adjustment, and electrochemistry. KOH offers higher solubility than NaOH and produces liquid soaps. Widely used in university research labs, petroleum testing facilities, and industrial QC laboratories across Oman. Essential for preparing alcoholic KOH solutions, biodiesel catalysis, and analytical titrations.',
        applications: [
          'Biodiesel production and research',
          'Saponification value determination',
          'pH adjustment in aqueous and alcoholic solutions',
          'Electrochemistry and battery research',
          'Protein digestion',
          'Liquid soap manufacture',
          'Mercerization of cotton',
          'Standard base solution preparation'
        ],
        technicalSpecs: [
          'Purity: 85-90% (ACS reagent grade)',
          'Form: White pellets',
          'Assay: Meets ACS specifications',
          'Highly hygroscopic',
          'Soluble in water and ethanol',
          'Low carbonate content',
          'Available: 500g, 1kg, 5kg bottles'
        ]
      },
    },
    {
      id: 'ammonia-solution-lab',
      title: 'Ammonia Solution (Laboratory Grade)',
      description: 'High-purity aqueous ammonia for laboratory analysis and pH adjustment.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'NH4OH',
        casNumber: '1336-21-6',
        alternativeNames: ['Ammonium hydroxide', 'Aqueous ammonia', 'NH3 solution', 'Ammonia water', 'Liquor ammonia'],
        seoKeywords: ['ammonia solution Oman', 'ammonium hydroxide Muscat', 'aqueous ammonia laboratory Oman', 'NH4OH Sohar', 'lab ammonia Muscat'],
        longDescription: 'Laboratory Grade Ammonia Solution supplier in Oman - Global Chemicals LLC provides high-purity aqueous ammonia for analytical laboratories and research facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade ammonium hydroxide (28-30% NH3) is essential for pH adjustment, metal complexation, precipitation reactions, and buffer preparation. The weak base is critical for colorimetric analysis, Nessler\'s reagent preparation, and ammonia titrations. Widely used in university labs, environmental testing facilities, water quality laboratories, and industrial QC across Oman. Essential for protein precipitation, cleaning glassware, and complexometric titrations.',
        applications: [
          'pH adjustment and buffer preparation',
          'Metal complexation and precipitation',
          'Colorimetric analysis procedures',
          'Nitrogen determination (Kjeldahl method)',
          'Glassware cleaning and preparation',
          'Protein precipitation',
          'Environmental water testing',
          'Complexometric titrations'
        ],
        technicalSpecs: [
          'Concentration: 28-30% NH3 (ACS grade)',
          'Appearance: Clear, colorless liquid',
          'Specific gravity: 0.90',
          'Assay: Meets ACS specifications',
          'Low in heavy metals',
          'Available: 500ml, 2.5L bottles',
          'Store in tightly sealed bottles'
        ]
      },
    },
    {
      id: 'acetone-lab',
      title: 'Acetone (Laboratory Grade)',
      description: 'High-purity acetone for laboratory extractions, cleaning, and synthesis.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'CH3COCH3',
        casNumber: '67-64-1',
        alternativeNames: ['Propanone', '2-Propanone', 'Dimethyl ketone', 'Acetone ACS'],
        seoKeywords: ['acetone laboratory Oman', 'HPLC acetone Muscat', 'analytical acetone Oman', 'lab solvent Sohar', 'acetone ACS Muscat'],
        longDescription: 'Laboratory Grade Acetone supplier in Oman - Global Chemicals LLC provides high-purity acetone for analytical laboratories, research institutions, and industrial QC facilities in Muscat, Sohar, Duqm, Salalah. Our ACS/HPLC-grade acetone is essential for sample extraction, glassware cleaning, chromatography, and organic synthesis. The fast-drying solvent is compatible with most plastics and leaves no residue. Available in various grades (ACS, HPLC, spectroscopy) to meet specific analytical requirements. Widely used in university labs, pharmaceutical research, oilfield laboratories, and testing facilities across Oman. Essential for lipid extraction, thin-layer chromatography, and routine laboratory operations.',
        applications: [
          'HPLC mobile phase and sample preparation',
          'Laboratory glassware cleaning',
          'Lipid and organic compound extraction',
          'Thin-layer chromatography (TLC)',
          'Organic synthesis and reactions',
          'Nail polish remover (cosmetic grade)',
          'Spectroscopy sample preparation',
          'Fast-drying cleaning solvent'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (ACS/HPLC grade)',
          'Appearance: Clear, colorless liquid',
          'Assay: Meets ACS specifications',
          'Water content: <0.5%',
          'Low UV absorbance (HPLC grade)',
          'Available: 500ml, 2.5L, 4L bottles',
          'Flammable - store properly'
        ]
      },
    },
    {
      id: 'ethanol-absolute-lab',
      title: 'Ethanol Absolute (Laboratory Grade)',
      description: 'High-purity absolute ethanol for laboratory synthesis and extraction.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C2H5OH',
        casNumber: '64-17-5',
        alternativeNames: ['Absolute ethanol', 'Anhydrous ethanol', 'Ethyl alcohol', 'Dehydrated alcohol', 'EtOH'],
        seoKeywords: ['absolute ethanol Oman', 'ethanol laboratory Muscat', 'anhydrous ethanol Oman', 'lab ethanol Sohar', 'ethyl alcohol 99.9% Muscat'],
        longDescription: 'Absolute Ethanol supplier in Oman - Global Chemicals LLC provides high-purity anhydrous ethanol (99.5-99.9%) for laboratory research, DNA extraction, and organic synthesis in Muscat, Sohar, Duqm, Salalah. Our absolute ethanol contains <0.5% water, making it ideal for molecular biology, pharmaceutical research, and chemical synthesis. Essential for DNA/RNA precipitation, histology, chromatography, and solvent extraction. Available in various grades (ACS, molecular biology, HPLC) to meet specific research requirements. Widely used in university labs, pharmaceutical companies, research institutions, and industrial QC facilities across Oman.',
        applications: [
          'DNA and RNA precipitation',
          'Molecular biology and genetics research',
          'Histology tissue dehydration',
          'HPLC mobile phase preparation',
          'Organic synthesis and reactions',
          'Plant extraction and phytochemistry',
          'Pharmaceutical formulation',
          'Analytical chemistry and spectroscopy'
        ],
        technicalSpecs: [
          'Purity: 99.5-99.9% (absolute)',
          'Water content: <0.5%',
          'Appearance: Clear, colorless liquid',
          'Assay: Meets ACS/molecular biology specs',
          'DNase/RNase-free (molecular biology grade)',
          'Available: 500ml, 1L, 2.5L bottles',
          'Flammable - proper storage required'
        ]
      },
    },
    {
      id: 'methanol-lab',
      title: 'Methanol (Laboratory Grade)',
      description: 'High-purity methanol for HPLC, extraction, and laboratory synthesis.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'CH3OH',
        casNumber: '67-56-1',
        alternativeNames: ['Methyl alcohol', 'Wood alcohol', 'Carbinol', 'MeOH'],
        seoKeywords: ['methanol HPLC Oman', 'methanol laboratory Muscat', 'HPLC methanol Oman', 'analytical methanol Sohar', 'methyl alcohol Muscat'],
        longDescription: 'HPLC Grade Methanol supplier in Oman - Global Chemicals LLC provides high-purity methanol for analytical laboratories and research facilities in Muscat, Sohar, Duqm, Salalah. Our HPLC/ACS-grade methanol is essential for chromatography mobile phases, sample extraction, and organic synthesis. The low UV cutoff and high purity make it ideal for HPLC, UV spectroscopy, and trace analysis. Available in various grades (HPLC, ACS, spectroscopy) for different analytical requirements. Widely used in pharmaceutical labs, university research facilities, oilfield laboratories, and testing centers across Oman. Essential for reversed-phase HPLC and lipid extraction applications.',
        applications: [
          'HPLC and UHPLC mobile phases',
          'Sample extraction and preparation',
          'UV-Vis spectroscopy',
          'Organic synthesis reactions',
          'Biodiesel production',
          'Protein precipitation',
          'Formaldehyde production',
          'Gas chromatography headspace analysis'
        ],
        technicalSpecs: [
          'Purity: 99.9% (HPLC/ACS grade)',
          'Appearance: Clear, colorless liquid',
          'Water content: <0.1%',
          'UV cutoff: 205 nm (HPLC grade)',
          'Assay: Meets ACS specifications',
          'Available: 1L, 2.5L, 4L bottles',
          'Toxic - handle with care'
        ]
      },
    },
    {
      id: 'isopropanol-lab',
      title: 'Isopropanol (Laboratory Grade)',
      description: 'High-purity isopropyl alcohol for laboratory cleaning and DNA extraction.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C3H7OH',
        casNumber: '67-63-0',
        alternativeNames: ['Isopropyl alcohol', 'IPA', '2-Propanol', 'Rubbing alcohol', 'Isopropanol ACS'],
        seoKeywords: ['isopropanol laboratory Oman', 'IPA Muscat', 'isopropyl alcohol lab Oman', 'analytical IPA Sohar', '2-propanol Muscat'],
        longDescription: 'Laboratory Grade Isopropanol supplier in Oman - Global Chemicals LLC provides high-purity isopropyl alcohol for research laboratories and analytical facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade IPA (99.5%+) is essential for DNA precipitation, equipment cleaning, and as a solvent in chromatography. The rapid evaporation and low toxicity make it ideal for cleaning optical equipment and electronics. Available in various grades (ACS, HPLC, molecular biology) for specific applications. Widely used in molecular biology labs, pharmaceutical research, university facilities, and industrial QC laboratories across Oman.',
        applications: [
          'DNA and RNA precipitation',
          'Laboratory equipment cleaning',
          'Optical instrument cleaning',
          'Electronics and PCB cleaning',
          'HPLC sample preparation',
          'Disinfection and sterilization',
          'Histology tissue processing',
          'Extraction solvent'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (ACS grade)',
          'Appearance: Clear, colorless liquid',
          'Water content: <0.5%',
          'Assay: Meets ACS specifications',
          'DNase/RNase-free (molecular biology grade)',
          'Available: 500ml, 2.5L, 4L bottles',
          'Flammable - proper ventilation required'
        ]
      },
    },
    {
      id: 'hexane-lab',
      title: 'Hexane (Laboratory Grade)',
      description: 'High-purity n-hexane for extraction, chromatography, and organic synthesis.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C6H14',
        casNumber: '110-54-3',
        alternativeNames: ['n-Hexane', 'Normal hexane', 'Hexanes', 'Hexane ACS'],
        seoKeywords: ['hexane laboratory Oman', 'n-hexane Muscat', 'HPLC hexane Oman', 'extraction solvent Sohar', 'hexane ACS Muscat'],
        longDescription: 'Laboratory Grade n-Hexane supplier in Oman - Global Chemicals LLC provides high-purity hexane for analytical laboratories and research institutions in Muscat, Sohar, Duqm, Salalah. Our ACS/HPLC-grade hexane is essential for lipid extraction, oil and grease determination, chromatography, and polymer reactions. The non-polar solvent is ideal for extracting non-polar compounds from plant materials, food samples, and environmental matrices. Widely used in food testing labs, environmental laboratories, petroleum research facilities, and university chemistry departments across Oman. Essential for Soxhlet extraction and normal-phase HPLC applications.',
        applications: [
          'Lipid and fat extraction (Soxhlet)',
          'Oil and grease analysis',
          'Normal-phase HPLC mobile phase',
          'Polymerization reactions',
          'Plant extraction and phytochemistry',
          'Cleaning and degreasing',
          'Thin-layer chromatography',
          'Rubber and adhesive formulation'
        ],
        technicalSpecs: [
          'Purity: 95-99% (ACS/HPLC grade)',
          'Appearance: Clear, colorless liquid',
          'Boiling range: 68-70°C',
          'Assay: Meets ACS specifications',
          'Low UV absorbance (HPLC grade)',
          'Available: 1L, 2.5L, 4L bottles',
          'Highly flammable - use proper ventilation'
        ]
      },
    },
    {
      id: 'toluene-lab',
      title: 'Toluene (Laboratory Grade)',
      description: 'High-purity toluene for extraction, synthesis, and chromatography.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C7H8',
        casNumber: '108-88-3',
        alternativeNames: ['Methylbenzene', 'Toluol', 'Phenylmethane', 'Toluene ACS'],
        seoKeywords: ['toluene laboratory Oman', 'toluene ACS Muscat', 'methylbenzene Oman', 'lab toluene Sohar', 'HPLC toluene Muscat'],
        longDescription: 'Laboratory Grade Toluene supplier in Oman - Global Chemicals LLC provides high-purity toluene for research laboratories and analytical facilities in Muscat, Sohar, Duqm, Salalah. Our ACS/HPLC-grade toluene is essential for organic synthesis, chromatography, and as a reaction medium. The aromatic solvent is ideal for polymer chemistry, pharmaceutical synthesis, and extracting aromatic compounds. Available in various grades (ACS, HPLC, spectroscopy) for specific analytical requirements. Widely used in university chemistry labs, pharmaceutical research, materials science facilities, and industrial R&D centers across Oman.',
        applications: [
          'Organic synthesis and reactions',
          'HPLC and chromatography',
          'Paint and coating formulation',
          'Polymer dissolution and reactions',
          'Pharmaceutical synthesis',
          'Extraction of aromatic compounds',
          'NMR spectroscopy solvent',
          'Cleaning and degreasing'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (ACS grade)',
          'Appearance: Clear, colorless liquid',
          'Assay: Meets ACS specifications',
          'Water content: <0.03%',
          'Low UV absorbance (HPLC grade)',
          'Available: 1L, 2.5L, 4L bottles',
          'Flammable - use in fume hood'
        ]
      },
    },
    {
      id: 'xylene-lab',
      title: 'Xylene (Laboratory Grade)',
      description: 'High-purity xylene for histology, microscopy, and extraction applications.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C8H10',
        casNumber: '1330-20-7',
        alternativeNames: ['Xylol', 'Dimethylbenzene', 'Xylene isomers', 'Xylene ACS'],
        seoKeywords: ['xylene laboratory Oman', 'xylol histology Muscat', 'xylene ACS Oman', 'microscopy xylene Sohar', 'lab xylene Muscat'],
        longDescription: 'Laboratory Grade Xylene supplier in Oman - Global Chemicals LLC provides high-purity xylene for histology, microscopy, and research applications in Muscat, Sohar, Duqm, Salalah. Our ACS-grade xylene (mixed isomers) is essential for tissue clearing, microscope slide preparation, and deparaffinization. The aromatic solvent is ideal for removing paraffin wax from histological sections and clearing tissues before microscopic examination. Widely used in hospital pathology labs, university histology departments, veterinary laboratories, and research institutions across Oman. Essential for routine histopathology and immunohistochemistry procedures.',
        applications: [
          'Histology tissue clearing and processing',
          'Deparaffinization of tissue sections',
          'Microscope slide preparation',
          'Immunohistochemistry procedures',
          'Paint and resin thinning',
          'Cleaning and degreasing',
          'Chromatography',
          'Pharmaceutical synthesis'
        ],
        technicalSpecs: [
          'Purity: 98.5% (mixed isomers, ACS grade)',
          'Appearance: Clear, colorless liquid',
          'Assay: Meets ACS specifications',
          'Composition: Mix of o-, m-, p-xylene',
          'Suitable for histology applications',
          'Available: 500ml, 2.5L, 4L bottles',
          'Flammable - use with adequate ventilation'
        ]
      },
    },
    {
      id: 'chloroform-lab',
      title: 'Chloroform (Laboratory Grade)',
      description: 'High-purity chloroform for extraction, NMR spectroscopy, and organic synthesis.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'CHCl3',
        casNumber: '67-66-3',
        alternativeNames: ['Trichloromethane', 'Chloroform stabilized', 'CHCl3', 'Chloroform ACS'],
        seoKeywords: ['chloroform laboratory Oman', 'chloroform NMR Muscat', 'trichloromethane Oman', 'chloroform ACS Sohar', 'extraction chloroform Muscat'],
        longDescription: 'Laboratory Grade Chloroform supplier in Oman - Global Chemicals LLC provides high-purity stabilized chloroform for molecular biology, NMR spectroscopy, and organic synthesis in Muscat, Sohar, Duqm, Salalah. Our ACS-grade chloroform (stabilized with ethanol/amylene) is essential for DNA/RNA extraction, lipid extraction, and as NMR solvent. The dense, non-flammable solvent is ideal for liquid-liquid extraction and phase separation. Widely used in molecular biology labs, pharmaceutical research, university chemistry departments, and analytical facilities across Oman. Essential for phenol-chloroform DNA extraction and routine organic synthesis.',
        applications: [
          'DNA and RNA extraction (phenol-chloroform method)',
          'NMR spectroscopy solvent',
          'Lipid and fat extraction',
          'Liquid-liquid extraction',
          'Organic synthesis and reactions',
          'Pharmaceutical extraction',
          'Alkaloid extraction from plants',
          'Anesthetic research (historical)'
        ],
        technicalSpecs: [
          'Purity: 99% minimum (ACS grade, stabilized)',
          'Stabilizer: 0.5-1% ethanol or amylene',
          'Appearance: Clear, colorless liquid',
          'Specific gravity: 1.48',
          'Assay: Meets ACS specifications',
          'Available: 500ml, 1L, 2.5L bottles',
          'Store in amber bottles away from light'
        ]
      },
    },
    {
      id: 'dichloromethane-lab',
      title: 'Dichloromethane (Laboratory Grade)',
      description: 'High-purity dichloromethane for extraction, chromatography, and synthesis.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'CH2Cl2',
        casNumber: '75-09-2',
        alternativeNames: ['Methylene chloride', 'DCM', 'Methylene dichloride', 'Dichloromethane ACS'],
        seoKeywords: ['dichloromethane Oman', 'DCM laboratory Muscat', 'methylene chloride Oman', 'DCM ACS Sohar', 'extraction DCM Muscat'],
        longDescription: 'Laboratory Grade Dichloromethane supplier in Oman - Global Chemicals LLC provides high-purity DCM for analytical laboratories and research facilities in Muscat, Sohar, Duqm, Salalah. Our ACS/HPLC-grade dichloromethane is essential for liquid-liquid extraction, chromatography, and organic synthesis. The volatile solvent offers excellent dissolving power and low boiling point for easy removal. Widely used in pharmaceutical labs, environmental testing facilities, food analysis laboratories, and university chemistry departments across Oman. Essential for pesticide residue analysis, caffeine extraction, and paint stripping research.',
        applications: [
          'Liquid-liquid extraction',
          'HPLC mobile phase preparation',
          'Pharmaceutical extraction and synthesis',
          'Pesticide residue analysis',
          'Caffeine and alkaloid extraction',
          'Paint and coating removal',
          'Foam blowing agent research',
          'Aerosol propellant studies'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (ACS/HPLC grade)',
          'Appearance: Clear, colorless liquid',
          'Boiling point: 39.6°C',
          'Assay: Meets ACS specifications',
          'Low UV absorbance (HPLC grade)',
          'Available: 1L, 2.5L, 4L bottles',
          'Use with adequate ventilation'
        ]
      },
    },
    {
      id: 'ethyl-acetate-lab',
      title: 'Ethyl Acetate (Laboratory Grade)',
      description: 'High-purity ethyl acetate for extraction, chromatography, and organic synthesis.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C4H8O2',
        casNumber: '141-78-6',
        alternativeNames: ['Ethyl ethanoate', 'Acetic acid ethyl ester', 'EtOAc', 'Ethyl acetate ACS'],
        seoKeywords: ['ethyl acetate Oman', 'EtOAc laboratory Muscat', 'ethyl acetate ACS Oman', 'HPLC ethyl acetate Sohar', 'extraction solvent Muscat'],
        longDescription: 'Laboratory Grade Ethyl Acetate supplier in Oman - Global Chemicals LLC provides high-purity ethyl acetate for analytical laboratories and research institutions in Muscat, Sohar, Duqm, Salalah. Our ACS/HPLC-grade EtOAc is essential for chromatography, extraction, and organic synthesis. The pleasant-smelling solvent offers excellent dissolving power with moderate polarity. Ideal for thin-layer chromatography, column chromatography, and extracting moderately polar compounds. Widely used in pharmaceutical labs, natural product chemistry, university research facilities, and industrial QC laboratories across Oman. Essential for plant extraction and routine organic chemistry applications.',
        applications: [
          'Thin-layer chromatography (TLC)',
          'Column chromatography mobile phase',
          'HPLC sample preparation',
          'Natural product extraction',
          'Pharmaceutical synthesis',
          'Flavoring and fragrance extraction',
          'Decaffeination processes',
          'Nail polish and coating formulation'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (ACS/HPLC grade)',
          'Appearance: Clear, colorless liquid',
          'Assay: Meets ACS specifications',
          'Water content: <0.1%',
          'Low UV absorbance (HPLC grade)',
          'Available: 1L, 2.5L, 4L bottles',
          'Flammable - use with proper ventilation'
        ]
      },
    },
    {
      id: 'diethyl-ether-lab',
      title: 'Diethyl Ether (Laboratory Grade)',
      description: 'High-purity diethyl ether for extraction and organic synthesis.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C4H10O',
        casNumber: '60-29-7',
        alternativeNames: ['Ethyl ether', 'Ether', 'Ethoxyethane', 'Diethyl ether stabilized'],
        seoKeywords: ['diethyl ether Oman', 'ether laboratory Muscat', 'ethyl ether ACS Oman', 'extraction ether Sohar', 'diethyl ether Muscat'],
        longDescription: 'Laboratory Grade Diethyl Ether supplier in Oman - Global Chemicals LLC provides high-purity stabilized diethyl ether for research laboratories and analytical facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade ether (stabilized with BHT) is essential for liquid-liquid extraction, Grignard reactions, and organic synthesis. The highly volatile solvent offers excellent extraction efficiency for lipophilic compounds. Stabilizers prevent dangerous peroxide formation during storage. Widely used in university organic chemistry labs, pharmaceutical research, natural product extraction, and industrial R&D facilities across Oman. Essential for extracting alkaloids, fats, and oils from various matrices.',
        applications: [
          'Liquid-liquid extraction',
          'Grignard reagent preparation',
          'Organic synthesis reactions',
          'Fat and oil extraction',
          'Alkaloid extraction',
          'Recrystallization solvent',
          'Anesthetic research (historical)',
          'Cellulose nitrate preparation'
        ],
        technicalSpecs: [
          'Purity: 99% minimum (ACS grade, stabilized)',
          'Stabilizer: BHT to prevent peroxides',
          'Appearance: Clear, colorless liquid',
          'Boiling point: 34.6°C',
          'Assay: Meets ACS specifications',
          'Available: 500ml, 1L, 2.5L bottles',
          'Extremely flammable - handle with extreme care'
        ]
      },
    },
    {
      id: 'petroleum-ether-lab',
      title: 'Petroleum Ether (Laboratory Grade)',
      description: 'High-purity petroleum ether for extraction and chromatography.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C5-C7 alkanes',
        casNumber: '8032-32-4',
        alternativeNames: ['Pet ether', 'Benzine', 'Ligroin', 'Light petroleum'],
        seoKeywords: ['petroleum ether Oman', 'pet ether laboratory Muscat', 'ligroin Oman', 'extraction petroleum ether Sohar', 'benzine Muscat'],
        longDescription: 'Laboratory Grade Petroleum Ether supplier in Oman - Global Chemicals LLC provides high-purity petroleum ether for analytical laboratories and research institutions in Muscat, Sohar, Duqm, Salalah. Our petroleum ether (40-60°C, 60-80°C boiling ranges) is essential for non-polar extractions, chromatography, and recrystallization. The mixture of light aliphatic hydrocarbons offers excellent dissolving power for lipids, oils, and non-polar compounds. Available in various boiling ranges to suit different applications. Widely used in food testing labs, natural product chemistry, university research facilities, and pharmaceutical laboratories across Oman. Essential for Soxhlet extraction and column chromatography.',
        applications: [
          'Non-polar compound extraction',
          'Chromatography mobile phase',
          'Fat and oil analysis',
          'Recrystallization solvent',
          'Plant lipid extraction',
          'Cleaning and degreasing',
          'Wax extraction',
          'Rubber and adhesive dissolution'
        ],
        technicalSpecs: [
          'Boiling range: 40-60°C or 60-80°C',
          'Appearance: Clear, colorless liquid',
          'Composition: C5-C7 aliphatic hydrocarbons',
          'Low aromatic content',
          'Meets ACS specifications',
          'Available: 1L, 2.5L, 4L bottles',
          'Highly flammable - proper ventilation required'
        ]
      },
    },
    {
      id: 'sodium-chloride-lab',
      title: 'Sodium Chloride (Laboratory Grade)',
      description: 'High-purity sodium chloride for buffer preparation and molecular biology.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'NaCl',
        casNumber: '7647-14-5',
        alternativeNames: ['Table salt', 'Common salt', 'NaCl', 'Sodium chloride ACS'],
        seoKeywords: ['sodium chloride laboratory Oman', 'NaCl ACS Muscat', 'molecular biology salt Oman', 'buffer salt Sohar', 'lab grade NaCl Muscat'],
        longDescription: 'Laboratory Grade Sodium Chloride supplier in Oman - Global Chemicals LLC provides high-purity NaCl for research laboratories and analytical facilities in Muscat, Sohar, Duqm, Salalah. Our ACS/molecular biology-grade sodium chloride is essential for buffer preparation, cell culture, DNA precipitation, and protein crystallization. The ultra-pure salt is free from DNase, RNase, and heavy metal contamination. Widely used in molecular biology labs, biochemistry research, pharmaceutical development, and university facilities across Oman. Essential for preparing PBS buffers, saline solutions, and maintaining ionic strength in biochemical reactions.',
        applications: [
          'Buffer preparation (PBS, TBS)',
          'Cell culture media formulation',
          'DNA and protein precipitation',
          'Protein crystallization',
          'Ionic strength adjustment',
          'Electrophoresis running buffers',
          'Microbiology media preparation',
          'Osmotic pressure regulation'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (ACS grade)',
          'Appearance: White crystalline powder',
          'Assay: Meets ACS specifications',
          'DNase/RNase-free (molecular biology grade)',
          'Low in heavy metals',
          'Available: 500g, 1kg, 5kg',
          'Suitable for cell culture applications'
        ]
      },
    },
    {
      id: 'potassium-chloride-lab',
      title: 'Potassium Chloride (Laboratory Grade)',
      description: 'High-purity potassium chloride for buffer preparation and electrophysiology.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'KCl',
        casNumber: '7447-40-7',
        alternativeNames: ['Potassium chloride', 'KCl', 'Muriate of potash', 'Potassium chloride ACS'],
        seoKeywords: ['potassium chloride laboratory Oman', 'KCl ACS Muscat', 'buffer KCl Oman', 'electrophysiology KCl Sohar', 'lab potassium chloride Muscat'],
        longDescription: 'Laboratory Grade Potassium Chloride supplier in Oman - Global Chemicals LLC provides high-purity KCl for research laboratories and analytical facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade potassium chloride is essential for buffer preparation, electrophysiology, and maintaining ionic balance in biological systems. The ultra-pure salt is critical for preparing physiological solutions, calibrating pH meters, and cell culture applications. Widely used in neuroscience labs, biochemistry research, pharmaceutical development, and university facilities across Oman. Essential for preparing Ringer\'s solution and maintaining potassium homeostasis in biological experiments.',
        applications: [
          'Buffer preparation (phosphate, Tris)',
          'pH meter calibration',
          'Electrophysiology experiments',
          'Cell culture media supplements',
          'Ringer\'s solution preparation',
          'Ion-selective electrode calibration',
          'Protein purification buffers',
          'Microbiology media'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (ACS grade)',
          'Appearance: White crystalline powder',
          'Assay: Meets ACS specifications',
          'Low in sodium and heavy metals',
          'Suitable for cell culture',
          'Available: 500g, 1kg, 5kg',
          'Soluble in water'
        ]
      },
    },
    {
      id: 'calcium-chloride-lab',
      title: 'Calcium Chloride (Laboratory Grade)',
      description: 'High-purity calcium chloride for molecular biology and cell culture.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'CaCl2',
        casNumber: '10043-52-4',
        alternativeNames: ['Calcium chloride dihydrate', 'CaCl2', 'Calcium dichloride'],
        seoKeywords: ['calcium chloride laboratory Oman', 'CaCl2 molecular biology Muscat', 'competent cells calcium Oman', 'lab CaCl2 Sohar', 'calcium chloride ACS Muscat'],
        longDescription: 'Laboratory Grade Calcium Chloride supplier in Oman - Global Chemicals LLC provides high-purity CaCl2 for molecular biology and cell culture in Muscat, Sohar, Duqm, Salalah. Our molecular biology-grade calcium chloride is essential for preparing competent cells, DNA transformation, and cell culture applications. The anhydrous and dihydrate forms are available for different applications. Critical for heat-shock transformation protocols and maintaining calcium homeostasis in cell culture media. Widely used in molecular biology labs, biotechnology research, pharmaceutical development, and university facilities across Oman. Essential for bacterial transformation and protein expression studies.',
        applications: [
          'Competent cell preparation for transformation',
          'DNA transformation (heat-shock method)',
          'Cell culture media supplement',
          'Protein precipitation',
          'Coagulation factor in cheese making',
          'Desiccant and drying agent',
          'Calcium signaling studies',
          'Buffer component'
        ],
        technicalSpecs: [
          'Forms: Anhydrous, dihydrate',
          'Purity: 99% minimum (ACS/molecular biology grade)',
          'Appearance: White granules/powder',
          'DNase/RNase-free (molecular biology grade)',
          'Assay: Meets specifications',
          'Hygroscopic - store dry',
          'Available: 100g, 500g, 1kg'
        ]
      },
    },
    {
      id: 'magnesium-sulfate-lab',
      title: 'Magnesium Sulfate (Laboratory Grade)',
      description: 'High-purity magnesium sulfate for drying, cell culture, and molecular biology.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'MgSO4',
        casNumber: '7487-88-9',
        alternativeNames: ['Epsom salt', 'MgSO4', 'Magnesium sulfate heptahydrate', 'Magnesium sulphate'],
        seoKeywords: ['magnesium sulfate laboratory Oman', 'MgSO4 ACS Muscat', 'drying agent Oman', 'Epsom salt lab Sohar', 'magnesium sulfate Muscat'],
        longDescription: 'Laboratory Grade Magnesium Sulfate supplier in Oman - Global Chemicals LLC provides high-purity MgSO4 for research laboratories and analytical facilities in Muscat, Sohar, Duqm, Salalah. Our ACS/molecular biology-grade magnesium sulfate is essential as a drying agent, in cell culture media, and for molecular biology applications. The anhydrous form is an excellent desiccant for organic solvents. The heptahydrate is used in growth media and protein expression. Widely used in organic chemistry labs, molecular biology facilities, pharmaceutical research, and university departments across Oman. Essential for drying organic extracts and supplementing bacterial growth media.',
        applications: [
          'Drying agent for organic solvents',
          'Cell culture media supplement',
          'Bacterial growth media (LB, TB)',
          'Protein expression optimization',
          'PCR reaction buffer component',
          'Enzyme cofactor in biochemical assays',
          'Soil treatment in agriculture',
          'Bath salts and cosmetic formulations'
        ],
        technicalSpecs: [
          'Forms: Anhydrous, heptahydrate (7H2O)',
          'Purity: 99% minimum (ACS grade)',
          'Appearance: White powder/crystals',
          'Assay: Meets ACS specifications',
          'DNase/RNase-free (molecular biology grade)',
          'Available: 500g, 1kg, 5kg',
          'Effective drying capacity'
        ]
      },
    },
    {
      id: 'edta-disodium-lab',
      title: 'EDTA Disodium Salt (Laboratory Grade)',
      description: 'High-purity EDTA for chelation, buffer preparation, and molecular biology.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C10H14N2Na2O8',
        casNumber: '6381-92-6',
        alternativeNames: ['EDTA Na2', 'Disodium EDTA', 'Ethylenediaminetetraacetic acid disodium salt', 'EDTA dihydrate'],
        seoKeywords: ['EDTA disodium Oman', 'EDTA laboratory Muscat', 'chelating agent lab Oman', 'EDTA molecular biology Sohar', 'disodium EDTA Muscat'],
        longDescription: 'Laboratory Grade EDTA Disodium Salt supplier in Oman - Global Chemicals LLC provides high-purity EDTA for molecular biology and analytical laboratories in Muscat, Sohar, Duqm, Salalah. Our molecular biology-grade disodium EDTA is essential for chelating metal ions, inhibiting DNases, and preparing buffers (TE, TAE, TBE). The dihydrate form dissolves readily in water and maintains pH around 4-6. Critical for protecting DNA/RNA from degradation and preventing metal-catalyzed oxidation. Widely used in molecular biology labs, biochemistry research, pharmaceutical QC, and university facilities across Oman. Essential for DNA extraction, gel electrophoresis, and enzyme stabilization.',
        applications: [
          'DNA and RNA protection (inhibits DNases)',
          'Buffer preparation (TE, TAE, TBE)',
          'Metal ion chelation and sequestration',
          'Gel electrophoresis running buffers',
          'Enzyme stabilization',
          'Blood anticoagulant',
          'Water hardness determination',
          'Protein purification'
        ],
        technicalSpecs: [
          'Form: Disodium salt dihydrate',
          'Purity: 99% minimum (molecular biology grade)',
          'Appearance: White crystalline powder',
          'DNase/RNase-free',
          'pH: 4-6 (1% solution)',
          'Assay: Meets specifications',
          'Available: 100g, 500g, 1kg'
        ]
      },
    },
    {
      id: 'tris-base-lab',
      title: 'Tris Base (Laboratory Grade)',
      description: 'High-purity Tris for buffer preparation and molecular biology applications.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C4H11NO3',
        casNumber: '77-86-1',
        alternativeNames: ['Tris', 'Trizma base', 'Tromethamine', 'THAM', '2-Amino-2-(hydroxymethyl)propane-1,3-diol'],
        seoKeywords: ['Tris base Oman', 'Tris buffer Muscat', 'Trizma Oman', 'molecular biology buffer Sohar', 'Tris HCl Muscat'],
        longDescription: 'Laboratory Grade Tris Base supplier in Oman - Global Chemicals LLC provides high-purity Tris for molecular biology and biochemistry laboratories in Muscat, Sohar, Duqm, Salalah. Our molecular biology-grade Tris (tromethamine) is the gold standard buffering agent for biological systems with optimal buffering range pH 7-9. Essential for preparing Tris-HCl, Tris-EDTA (TE), Tris-Acetate-EDTA (TAE), and Tris-Borate-EDTA (TBE) buffers. Critical for DNA/RNA work, protein electrophoresis, and enzyme assays. Widely used in molecular biology labs, biochemistry research, pharmaceutical development, and university facilities across Oman. Essential for Western blotting, gel electrophoresis, and PCR applications.',
        applications: [
          'Buffer preparation (Tris-HCl, TE, TAE, TBE)',
          'DNA and RNA extraction buffers',
          'Protein electrophoresis (PAGE)',
          'Western blotting transfer buffers',
          'PCR and qPCR buffers',
          'Enzyme assay buffers',
          'Cell lysis buffers',
          'Biochemical research applications'
        ],
        technicalSpecs: [
          'Purity: 99.9% minimum (molecular biology grade)',
          'Appearance: White crystalline powder',
          'Molecular weight: 121.14 g/mol',
          'pKa: 8.06 at 25°C',
          'DNase/RNase/Protease-free',
          'Assay: Meets specifications',
          'Available: 100g, 500g, 1kg, 5kg'
        ]
      },
    },
    {
      id: 'sodium-thiosulfate-lab',
      title: 'Sodium Thiosulfate (Laboratory Grade)',
      description: 'High-purity sodium thiosulfate for titrations and analytical chemistry.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'Na2S2O3',
        casNumber: '7772-98-7',
        alternativeNames: ['Sodium thiosulphate', 'Hypo', 'Na2S2O3', 'Sodium thiosulfate pentahydrate'],
        seoKeywords: ['sodium thiosulfate laboratory Oman', 'hypo Muscat', 'titration sodium thiosulfate Oman', 'Na2S2O3 ACS Sohar', 'iodometric titration Muscat'],
        longDescription: 'Laboratory Grade Sodium Thiosulfate supplier in Oman - Global Chemicals LLC provides high-purity sodium thiosulfate for analytical laboratories and quality control facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade Na2S2O3 pentahydrate is essential for iodometric titrations, chlorine neutralization, and analytical chemistry. The standard reducing agent is used for determining iodine, bromine, and oxidizing agents. Available as pentahydrate crystals and standardized solutions (0.1N, 0.01N). Widely used in water testing labs, pharmaceutical QC, oilfield laboratories, and university chemistry departments across Oman. Essential for determining dissolved oxygen (Winkler method) and chlorine residuals.',
        applications: [
          'Iodometric titrations',
          'Chlorine and bleach analysis',
          'Dissolved oxygen determination (Winkler)',
          'Standardizing iodine solutions',
          'Dechlorination of water samples',
          'Silver recovery in photography',
          'Volumetric analysis',
          'Reducing agent in chemical reactions'
        ],
        technicalSpecs: [
          'Form: Pentahydrate (Na2S2O3·5H2O)',
          'Purity: 99.5% minimum (ACS grade)',
          'Appearance: Colorless crystals',
          'Assay: Meets ACS specifications',
          'Standardized solutions: 0.1N, 0.01N available',
          'Available: 500g, 1kg, 5kg',
          'Store in tightly closed container'
        ]
      },
    },
    {
      id: 'potassium-permanganate-lab',
      title: 'Potassium Permanganate (Laboratory Grade)',
      description: 'High-purity potassium permanganate for oxidation and titrations.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'KMnO4',
        casNumber: '7722-64-7',
        alternativeNames: ['Permanganate of potash', 'KMnO4', 'Condy\'s crystals'],
        seoKeywords: ['potassium permanganate Oman', 'KMnO4 laboratory Muscat', 'permanganate titration Oman', 'oxidizing agent Sohar', 'KMnO4 ACS Muscat'],
        longDescription: 'Laboratory Grade Potassium Permanganate supplier in Oman - Global Chemicals LLC provides high-purity KMnO4 for analytical laboratories and quality control facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade potassium permanganate is a powerful oxidizing agent essential for redox titrations, COD determination, and organic synthesis. The distinctive purple crystals dissolve to form intensely colored solutions used in volumetric analysis. Available as crystals and standardized solutions (0.1N, 0.02N). Widely used in water testing labs, environmental analysis, petroleum testing, and university chemistry departments across Oman. Essential for determining COD, iron, and other reducing substances.',
        applications: [
          'Chemical oxygen demand (COD) testing',
          'Redox titrations',
          'Iron determination in water',
          'Oxidation reactions in organic synthesis',
          'Water treatment and disinfection',
          'Permanganate value of oils',
          'Analytical reagent',
          'Laboratory demonstrations'
        ],
        technicalSpecs: [
          'Purity: 99% minimum (ACS grade)',
          'Appearance: Dark purple crystals',
          'Assay: Meets ACS specifications',
          'Strong oxidizing agent',
          'Standardized solutions: 0.1N, 0.02N available',
          'Available: 100g, 500g, 1kg',
          'Store away from organic materials'
        ]
      },
    },
    {
      id: 'silver-nitrate-lab',
      title: 'Silver Nitrate (Laboratory Grade)',
      description: 'High-purity silver nitrate for titrations, silver staining, and analytical chemistry.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'AgNO3',
        casNumber: '7761-88-8',
        alternativeNames: ['Silver nitrate', 'AgNO3', 'Lunar caustic', 'Silver(I) nitrate'],
        seoKeywords: ['silver nitrate laboratory Oman', 'AgNO3 Muscat', 'silver staining Oman', 'chloride titration Sohar', 'silver nitrate ACS Muscat'],
        longDescription: 'Laboratory Grade Silver Nitrate supplier in Oman - Global Chemicals LLC provides high-purity AgNO3 for analytical laboratories and research facilities in Muscat, Sohar, Duqm, Salalah. Our ACS-grade silver nitrate is essential for chloride determination (Mohr\'s method), silver staining of proteins/gels, and as a reagent in organic synthesis. The light-sensitive crystals must be stored in amber bottles. Available as crystals and standardized solutions (0.1N). Widely used in university labs, pharmaceutical testing, water analysis laboratories, and research institutions across Oman. Essential for argentometric titrations and histological silver staining techniques.',
        applications: [
          'Chloride determination (Mohr\'s, Volhard methods)',
          'Silver staining of proteins and nucleic acids',
          'Argentometric titrations',
          'Organic synthesis reactions',
          'Mirror silvering',
          'Antiseptic preparations',
          'Photography and film development',
          'Analytical reagent for halides'
        ],
        technicalSpecs: [
          'Purity: 99.8% minimum (ACS grade)',
          'Appearance: Colorless crystals',
          'Light-sensitive: store in amber bottles',
          'Assay: Meets ACS specifications',
          'Standardized solutions: 0.1N, 0.01N available',
          'Available: 25g, 100g, 500g',
          'Handle with care - stains skin'
        ]
      },
    },
    {
      id: 'phenolphthalein-indicator',
      title: 'Phenolphthalein Indicator',
      description: 'High-purity phenolphthalein indicator for acid-base titrations.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C20H14O4',
        casNumber: '77-09-8',
        alternativeNames: ['Phenolphthalein', 'pH indicator', 'Phenolphthalein solution'],
        seoKeywords: ['phenolphthalein Oman', 'pH indicator Muscat', 'titration indicator Oman', 'phenolphthalein solution Sohar', 'acid-base indicator Muscat'],
        longDescription: 'Phenolphthalein Indicator supplier in Oman - Global Chemicals LLC provides high-quality phenolphthalein solution for analytical laboratories and educational facilities in Muscat, Sohar, Duqm, Salalah. Our phenolphthalein indicator changes from colorless (pH <8.2) to pink/magenta (pH >10) making it ideal for strong acid-strong base titrations. The 1% alcoholic solution is ready to use with just 2-3 drops per titration. Widely used in university chemistry labs, water testing facilities, pharmaceutical QC, and industrial analysis across Oman. Essential for teaching acid-base concepts and performing volumetric analysis.',
        applications: [
          'Strong acid-strong base titrations',
          'pH indicator in alkaline range',
          'Educational chemistry experiments',
          'Quality control titrations',
          'Alkalinity determination',
          'Pharmaceutical testing',
          'Water analysis',
          'Food analysis'
        ],
        technicalSpecs: [
          'Concentration: 1% in ethanol (typical)',
          'pH transition: 8.2 (colorless) to 10.0 (pink)',
          'Appearance: Clear solution',
          'Usage: 2-3 drops per 50ml titration',
          'Meets ACS indicator specifications',
          'Available: 100ml, 500ml bottles',
          'Store away from light'
        ]
      },
    },
    {
      id: 'methyl-orange-indicator',
      title: 'Methyl Orange Indicator',
      description: 'High-purity methyl orange indicator for acid-base titrations.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C14H14N3NaO3S',
        casNumber: '547-58-0',
        alternativeNames: ['Methyl orange', 'Sodium salt', 'Orange III', 'pH indicator'],
        seoKeywords: ['methyl orange Oman', 'acid indicator Muscat', 'titration indicator Oman', 'methyl orange solution Sohar', 'pH indicator Muscat'],
        longDescription: 'Methyl Orange Indicator supplier in Oman - Global Chemicals LLC provides high-quality methyl orange solution for analytical laboratories and educational facilities in Muscat, Sohar, Duqm, Salalah. Our methyl orange indicator changes from red (pH <3.1) to yellow (pH >4.4) making it ideal for strong acid-weak base titrations. The 0.1% aqueous solution provides sharp color change at endpoint. Widely used in university chemistry labs, water analysis facilities, pharmaceutical testing, and industrial QC across Oman. Essential for teaching acid-base chemistry and performing quantitative analysis.',
        applications: [
          'Strong acid-weak base titrations',
          'pH indicator in acidic range',
          'Water quality testing',
          'Educational chemistry experiments',
          'Pharmaceutical analysis',
          'Alkalinity/acidity measurements',
          'Quality control procedures',
          'Colorimetric pH determination'
        ],
        technicalSpecs: [
          'Concentration: 0.1% in water (typical)',
          'pH transition: 3.1 (red) to 4.4 (yellow)',
          'Appearance: Orange solution',
          'Usage: 1-2 drops per titration',
          'Meets ACS indicator specifications',
          'Available: 100ml, 500ml bottles',
          'Stable at room temperature'
        ]
      },
    },
    {
      id: 'bromothymol-blue-indicator',
      title: 'Bromothymol Blue Indicator',
      description: 'High-purity bromothymol blue indicator for neutral pH range titrations.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C27H28Br2O5S',
        casNumber: '76-59-5',
        alternativeNames: ['BTB', 'Bromthymol blue', 'pH indicator', 'Bromothymol blue solution'],
        seoKeywords: ['bromothymol blue Oman', 'BTB indicator Muscat', 'neutral pH indicator Oman', 'bromothymol blue Sohar', 'pH 7 indicator Muscat'],
        longDescription: 'Bromothymol Blue Indicator supplier in Oman - Global Chemicals LLC provides high-quality BTB indicator for analytical laboratories and biological research in Muscat, Sohar, Duqm, Salalah. Our bromothymol blue indicator changes from yellow (pH <6.0) to blue (pH >7.6) making it ideal for near-neutral pH titrations and cell culture monitoring. The 0.1% solution provides excellent color transition for weak acid-weak base titrations. Widely used in university labs, cell culture facilities, microbiology laboratories, and environmental testing across Oman. Essential for monitoring cell culture pH and biological buffer systems.',
        applications: [
          'Weak acid-weak base titrations',
          'Cell culture pH monitoring',
          'Neutral pH range indication (pH 6-7.6)',
          'Microbiology media pH indicator',
          'Biological buffer system monitoring',
          'Aquarium water testing',
          'Soil pH testing',
          'Educational experiments'
        ],
        technicalSpecs: [
          'Concentration: 0.1% in ethanol/water',
          'pH transition: 6.0 (yellow) to 7.6 (blue)',
          'Appearance: Green/blue solution',
          'pKa: ~7.0',
          'Meets indicator specifications',
          'Available: 100ml, 500ml bottles',
          'Suitable for biological applications'
        ]
      },
    },
    {
      id: 'agar-bacteriological',
      title: 'Agar Bacteriological (Laboratory Grade)',
      description: 'High-purity bacteriological agar for microbiology culture media.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        casNumber: '9002-18-0',
        alternativeNames: ['Agar-agar', 'Bacteriological agar', 'Agar powder', 'Microbiological agar'],
        seoKeywords: ['agar bacteriological Oman', 'microbiological agar Muscat', 'culture media agar Oman', 'lab agar Sohar', 'bacteriology agar Muscat'],
        longDescription: 'Bacteriological Grade Agar supplier in Oman - Global Chemicals LLC provides high-quality agar for microbiology laboratories and research facilities in Muscat, Sohar, Duqm, Salalah. Our bacteriological agar is purified from red seaweeds and meets specifications for microbial culture. The gelling agent solidifies at ~40°C and melts at ~85°C, ideal for preparing petri dishes and slants. Low in salts and nitrogen to minimize interference with bacterial growth. Widely used in university microbiology labs, hospital laboratories, pharmaceutical QC, food testing facilities, and research institutions across Oman. Essential for preparing LB agar, nutrient agar, and specialized growth media.',
        applications: [
          'Bacterial culture media preparation',
          'Petri dish and slant preparation',
          'Antibiotic sensitivity testing',
          'Colony isolation and enumeration',
          'Food microbiology testing',
          'Water quality microbial analysis',
          'Pharmaceutical sterility testing',
          'Research microbiology applications'
        ],
        technicalSpecs: [
          'Type: Bacteriological grade',
          'Gel strength: 600-700 g/cm²',
          'Gelling temperature: ~40°C',
          'Melting temperature: ~85°C',
          'Typical usage: 15g/L (1.5%)',
          'Low in salts and nutrients',
          'Available: 100g, 500g, 1kg',
          'Store in dry conditions'
        ]
      },
    },
    {
      id: 'glucose-anhydrous-lab',
      title: 'Glucose Anhydrous (Laboratory Grade)',
      description: 'High-purity anhydrous glucose for cell culture and microbiology.',
      category: 'lab-chemicals',
      icon: Beaker,
      details: {
        formula: 'C6H12O6',
        casNumber: '50-99-7',
        alternativeNames: ['Dextrose anhydrous', 'D-Glucose', 'Grape sugar', 'Anhydrous dextrose'],
        seoKeywords: ['glucose anhydrous Oman', 'dextrose laboratory Muscat', 'cell culture glucose Oman', 'D-glucose Sohar', 'anhydrous glucose Muscat'],
        longDescription: 'Laboratory Grade Anhydrous Glucose supplier in Oman - Global Chemicals LLC provides high-purity glucose for cell culture, microbiology, and biochemistry in Muscat, Sohar, Duqm, Salalah. Our anhydrous glucose (dextrose) meets cell culture specifications with low endotoxin levels. Essential for supplementing cell culture media (DMEM, RPMI), bacterial growth media, and biochemical assays. The anhydrous form provides accurate concentration without water content variation. Widely used in biotechnology labs, pharmaceutical cell culture, university research facilities, and microbiology departments across Oman. Essential for mammalian cell culture and fermentation processes.',
        applications: [
          'Cell culture media formulation (DMEM, RPMI)',
          'Bacterial growth media supplement',
          'Fermentation and bioreactor feeds',
          'Glucose tolerance testing',
          'Biochemical assays and enzyme studies',
          'Energy source in biological systems',
          'Cryopreservation solutions',
          'Pharmaceutical formulations'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum (cell culture grade)',
          'Form: Anhydrous (no water of crystallization)',
          'Appearance: White crystalline powder',
          'Endotoxin: <1 EU/g (cell culture grade)',
          'Molecular weight: 180.16 g/mol',
          'Suitable for cell culture',
          'Available: 500g, 1kg, 5kg'
        ]
      },
    },

    // Swimming Pool Chemicals
    {
      id: 'algacide-liquid',
      title: 'Algacide Liquid',
      description: 'Effective liquid algaecide for preventing and treating algae growth in swimming pools.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '7173-51-5',
        alternativeNames: ['Quaternary ammonium algaecide', 'Pool algaecide', 'Algae killer', 'Quat algaecide'],
        seoKeywords: ['algaecide Oman', 'pool algaecide Muscat', 'algae control Oman', 'swimming pool algaecide', 'quaternary ammonium algaecide Oman'],
        longDescription: 'Premium Algaecide Liquid supplier in Oman - Global Chemicals LLC provides high-quality quaternary ammonium algaecide for swimming pool maintenance in Muscat, Sohar, Salalah. Our liquid algaecide effectively prevents and eliminates all types of algae including green, black, and mustard algae. The fast-acting formula creates a protective barrier that prevents algae spores from developing into visible growth. Non-foaming and compatible with all sanitizer systems. Ideal for residential pools, hotel pools, water parks, and public swimming facilities across Oman.',
        applications: [
          'Swimming pool algae prevention and treatment',
          'Hotel and resort pool maintenance',
          'Public swimming pool sanitation',
          'Water park and recreational facility treatment',
          'Green algae elimination',
          'Black and mustard algae control',
          'Year-round pool protection',
          'Chlorine shock enhancement'
        ],
        technicalSpecs: [
          'Active ingredient: Quaternary ammonium compound 10-15%',
          'Non-foaming formula',
          'Compatible with chlorine, bromine, and salt systems',
          'Dosage: 100-200ml per 10,000 liters initially, 50ml weekly maintenance',
          'pH stability: Effective at pH 7.2-7.8',
          'Available in 1L, 5L, and 20L containers'
        ]
      },
    },
    {
      id: 'chlorine-tablet-pool',
      title: 'Chlorine Tablet',
      description: 'Standard chlorine tablets for continuous pool water disinfection and sanitation.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '87-90-1',
        alternativeNames: ['TCCA tablets', 'Trichlor tablets', 'Chlorine tabs', 'Trichloroisocyanuric acid tablets'],
        seoKeywords: ['chlorine tablets Oman', 'pool chlorine Muscat', 'TCCA tablets Oman', 'swimming pool tablets Muscat', 'trichlor Oman'],
        longDescription: 'Buy Premium Chlorine Tablets in Oman from Global Chemicals LLC. TCCA (Trichloroisocyanuric Acid) chlorine tablets provide slow-dissolving, stabilized chlorine for continuous pool disinfection in Muscat, Sohar, Salalah. Our chlorine tablets contain built-in stabilizer (cyanuric acid) that protects chlorine from UV degradation, making them ideal for outdoor pools in Oman\'s sunny climate. Each tablet delivers 90% available chlorine for powerful sanitization. Perfect for automatic feeders and floating dispensers. Widely used in residential pools, hotel pools, and swimming clubs throughout Oman.',
        applications: [
          'Continuous swimming pool sanitization',
          'Automatic chlorine feeder systems',
          'Floating chlorine dispensers',
          'Residential pool maintenance',
          'Hotel and resort pool treatment',
          'Commercial pool disinfection',
          'Outdoor pool UV protection',
          'Weekly pool maintenance programs'
        ],
        technicalSpecs: [
          'Available chlorine: 90% minimum',
          'Tablet size: 200g standard',
          'Stabilizer content: Contains cyanuric acid',
          'Slow-dissolving formula: 3-7 days dissolution time',
          'Dosage: 2-3 tablets per 10,000 liters weekly',
          'Ideal for feeders and skimmers',
          'Storage: Keep dry, away from moisture'
        ]
      },
    },
    {
      id: 'swimming-pool-chemical',
      title: 'Swimming Pool Chemical',
      description: 'Complete range of specialized chemicals for comprehensive pool maintenance.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        alternativeNames: ['Pool chemicals', 'Swimming pool maintenance', 'Pool treatment chemicals', 'Complete pool care'],
        seoKeywords: ['swimming pool chemicals Oman', 'pool chemicals Muscat', 'pool maintenance Oman', 'pool treatment Muscat', 'pool care Oman'],
        longDescription: 'Complete Swimming Pool Chemicals supplier in Oman - Global Chemicals LLC offers comprehensive range of pool maintenance chemicals for residential, commercial, and public pools in Muscat, Sohar, Salalah. Our complete pool chemical program includes sanitizers (chlorine, bromine), pH adjusters (acid, soda ash), algaecides, clarifiers, shock treatments, and specialty products. We provide technical support and dosing guidance to maintain crystal-clear, safe swimming water. Serving hotels, resorts, private villas, swimming clubs, water parks, and public pools across Oman with quality chemicals and expert advice.',
        applications: [
          'Complete pool water treatment programs',
          'pH and alkalinity balancing',
          'Water sanitization and disinfection',
          'Algae prevention and control',
          'Water clarification and filtration',
          'Shock treatment and oxidation',
          'Calcium hardness adjustment',
          'Stain and scale prevention'
        ],
        technicalSpecs: [
          'Complete range: Sanitizers, balancers, algaecides, clarifiers',
          'Professional-grade formulations',
          'Compatible product lines',
          'Technical support included',
          'Custom treatment programs available',
          'Available in retail and bulk quantities',
          'Comprehensive water testing services'
        ]
      },
    },
    {
      id: 'sodium-hypochlorite-pool',
      title: 'Sodium Hypochlorite',
      description: 'Liquid chlorine solution for pool sanitization and shock treatment.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '7681-52-9',
        alternativeNames: ['Liquid chlorine', 'Bleach', 'Pool bleach', 'Sodium hypochlorite solution'],
        seoKeywords: ['sodium hypochlorite Oman', 'liquid chlorine pool Muscat', 'pool bleach Oman', 'swimming pool bleach Muscat', 'liquid chlorine Oman'],
        longDescription: 'Premium Sodium Hypochlorite supplier in Oman - Global Chemicals LLC provides high-quality liquid chlorine for swimming pool sanitization in Muscat, Sohar, Salalah. Our sodium hypochlorite solution (12-15% available chlorine) offers fast-acting disinfection and shock treatment for pools. Ideal for eliminating bacteria, viruses, and organic contaminants. Liquid chlorine is economical for large-volume applications and dissolves instantly without residue. Perfect for automatic dosing systems and shock treatments. Available in bulk quantities for hotels, resorts, and pool maintenance companies throughout Oman.',
        applications: [
          'Swimming pool shock treatment',
          'Regular pool sanitization',
          'Algae bloom elimination',
          'Emergency pool disinfection',
          'Automatic chlorination systems',
          'Large commercial pool treatment',
          'Hotel and resort pool maintenance',
          'Public pool sanitation'
        ],
        technicalSpecs: [
          'Available chlorine: 12-15%',
          'pH: 11-13',
          'Appearance: Clear yellow-green liquid',
          'Fast-acting disinfection',
          'Dosage: 1-2 liters per 10,000 liters for shock',
          'Compatible with automated dosing systems',
          'Available in 25L, 60L drums, and bulk'
        ]
      },
    },
    {
      id: 'chlorine-tablet-jumbo',
      title: 'Chlorine Tablet Jumbo Size (3 Inch)',
      description: 'Large 3-inch slow-dissolving chlorine tablets for extended pool protection.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '87-90-1',
        alternativeNames: ['3 inch chlorine tablets', 'Jumbo trichlor', 'Large chlorine tablets', 'Jumbo TCCA tablets'],
        seoKeywords: ['jumbo chlorine tablets Oman', '3 inch chlorine Muscat', 'large pool tablets Oman', 'jumbo TCCA Oman', '3 inch trichlor Muscat'],
        longDescription: 'Buy Jumbo 3-Inch Chlorine Tablets in Oman from Global Chemicals LLC. Our large-format TCCA tablets provide extended-release sanitization for swimming pools in Muscat, Sohar, Salalah. Each jumbo tablet weighs 200g and dissolves slowly over 5-7 days, making them ideal for automatic feeders and floating dispensers. The 3-inch size is perfect for large residential pools, hotel pools, and commercial facilities requiring consistent chlorine levels. Contains 90% available chlorine with built-in stabilizer for UV protection. Reduces maintenance frequency and ensures continuous water quality throughout Oman\'s hot climate.',
        applications: [
          'Large swimming pool maintenance',
          'Automatic chlorine feeder systems',
          'Floating chlorinator dispensers',
          'Hotel and resort pools',
          'Commercial swimming facilities',
          'Extended-release sanitization',
          'Low-maintenance pool programs',
          'Outdoor pool protection in hot climates'
        ],
        technicalSpecs: [
          'Tablet size: 3 inch (76mm) diameter',
          'Weight: 200g per tablet',
          'Available chlorine: 90% minimum',
          'Dissolution time: 5-7 days in standard conditions',
          'Contains cyanuric acid stabilizer',
          'Dosage: 1-2 tablets per 10,000 liters weekly',
          'Packaging: 5kg, 10kg, 25kg buckets'
        ]
      },
    },
    {
      id: 'calcium-hypochlorite-granules',
      title: 'Calcium Hypochlorite Granules',
      description: 'Fast-dissolving granular chlorine for quick pool sanitization and shock treatment.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '7778-54-3',
        alternativeNames: ['Cal-hypo granules', 'Pool shock', 'Calcium chlorine', 'HTH granules', 'Pool shock powder'],
        seoKeywords: ['calcium hypochlorite Oman', 'pool shock granules Muscat', 'cal-hypo Oman', 'HTH Oman', 'pool shock treatment Muscat'],
        longDescription: 'Premium Calcium Hypochlorite Granules supplier in Oman - Global Chemicals LLC provides high-strength cal-hypo for swimming pool shock treatment in Muscat, Sohar, Salalah. Our granular chlorine contains 65-70% available chlorine for powerful oxidation and sanitization. Fast-dissolving formula works within hours to eliminate algae, bacteria, organic contaminants, and chloramines. Ideal for emergency shock treatments, algae blooms, cloudy water, and opening/closing pools. The granular form allows precise dosing and rapid water recovery. Essential for maintaining pool hygiene in hotels, resorts, public pools, and residential pools throughout Oman.',
        applications: [
          'Swimming pool shock treatment',
          'Algae bloom elimination',
          'Cloudy water clarification',
          'Chloramine breakpoint chlorination',
          'Emergency pool disinfection',
          'Pool opening and closing',
          'Super chlorination after heavy use',
          'Organic contamination treatment'
        ],
        technicalSpecs: [
          'Available chlorine: 65-70%',
          'Fast-dissolving granular form',
          'pH: 11-12',
          'Shock dosage: 150-300g per 10,000 liters',
          'Dissolves in 2-4 hours',
          'No chlorine stabilizer - ideal for shock',
          'Packaging: 1kg, 5kg, 25kg, 50kg bags'
        ]
      },
    },
    {
      id: 'sodium-hypo-chlorite-12-15',
      title: 'Sodium Hypo Chlorite 12-15%',
      description: 'Concentrated liquid chlorine solution for effective pool water treatment.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '7681-52-9',
        alternativeNames: ['Liquid chlorine 12%', 'Sodium hypochlorite solution', 'Pool bleach 15%', 'Liquid pool chlorine'],
        seoKeywords: ['sodium hypochlorite 12% Oman', 'liquid chlorine 15% Muscat', 'pool bleach solution Oman', 'concentrated chlorine Muscat', 'liquid sanitizer Oman'],
        longDescription: 'High-Strength Sodium Hypochlorite 12-15% supplier in Oman - Global Chemicals LLC provides concentrated liquid chlorine for professional pool treatment in Muscat, Sohar, Salalah. Our premium-grade sodium hypochlorite solution delivers consistent 12-15% available chlorine for reliable pool sanitization and shock treatment. Ideal for automatic dosing systems, large commercial pools, and bulk chlorination requirements. The liquid format ensures rapid distribution and no undissolved residue. Perfect for hotels, resorts, water parks, and pool maintenance companies requiring high-volume chlorination. Cost-effective solution for large-scale pool operations throughout Oman.',
        applications: [
          'Automatic pool chlorination systems',
          'Large commercial pool treatment',
          'Hotel and resort pool programs',
          'Water park sanitization',
          'Shock treatment and super chlorination',
          'Bulk pool maintenance contracts',
          'Municipal pool facilities',
          'Swimming club water treatment'
        ],
        technicalSpecs: [
          'Available chlorine: 12-15% (120,000-150,000 ppm)',
          'pH: 12-13',
          'Specific gravity: 1.19-1.21',
          'Appearance: Light yellow-green liquid',
          'Dosage: 0.8-1.5 liters per 10,000 liters',
          'Compatible with dosing pumps and feeders',
          'Available in 25L, 60L, 200L, 1000L IBC'
        ]
      },
    },
    {
      id: 'chlorine-liquid-pool',
      title: 'Chlorine Liquid',
      description: 'Ready-to-use liquid chlorine for immediate pool disinfection.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '7681-52-9',
        alternativeNames: ['Liquid chlorine', 'Pool chlorine solution', 'Sodium hypochlorite liquid', 'Liquid pool sanitizer'],
        seoKeywords: ['liquid chlorine Oman', 'pool chlorine liquid Muscat', 'swimming pool disinfectant Oman', 'liquid sanitizer Muscat', 'chlorine solution Oman'],
        longDescription: 'Ready-to-Use Liquid Chlorine supplier in Oman - Global Chemicals LLC offers instant-acting liquid chlorine for swimming pool disinfection in Muscat, Sohar, Salalah. Our liquid chlorine solution provides immediate sanitization without mixing or dissolving. Perfect for emergency treatments, rapid chlorine boost, and automated dosing systems. The liquid format ensures even distribution throughout the pool water and eliminates the risk of undissolved granules. Ideal for residential pools, hotel pools, and commercial facilities requiring quick chlorine response. Convenient and safe handling with no dust or powder residue.',
        applications: [
          'Immediate pool disinfection',
          'Emergency chlorine boost',
          'Automated dosing and feed systems',
          'Residential pool maintenance',
          'Hotel and resort pools',
          'Quick water sanitization',
          'Post-storm or heavy rain treatment',
          'Regular maintenance programs'
        ],
        technicalSpecs: [
          'Ready-to-use liquid formulation',
          'Available chlorine: 10-12%',
          'pH: 11-13',
          'Instant dissolution - no residue',
          'Dosage: 1-2 liters per 10,000 liters',
          'Compatible with all pool types',
          'Available in 5L, 20L, 25L containers'
        ]
      },
    },
    {
      id: 'sodium-bi-sulphite-liquid-pool',
      title: 'Sodium Bi Sulphite Liquid',
      description: 'Liquid dechlorination agent for reducing excess chlorine levels in pools.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '7631-90-5',
        alternativeNames: ['Sodium bisulfite', 'Dechlorinator liquid', 'Chlorine reducer', 'Chlorine neutralizer liquid'],
        seoKeywords: ['sodium bisulfite Oman', 'dechlorinator Muscat', 'chlorine reducer pool Oman', 'chlorine neutralizer Muscat', 'dechlorination Oman'],
        longDescription: 'Sodium Bisulfite Liquid supplier in Oman - Global Chemicals LLC provides effective dechlorination solution for swimming pools in Muscat, Sohar, Salalah. Our liquid sodium bisulfite rapidly reduces excess chlorine levels after shock treatments or over-chlorination incidents. Essential for preventing skin and eye irritation, bleaching of swimwear, and corrosion of pool equipment. The liquid format allows precise dosing and fast action to quickly restore safe chlorine levels. Perfect for pools that have been over-treated, after shock chlorination, or before drain-down. Widely used by hotels, resorts, and pool service companies throughout Oman.',
        applications: [
          'Excess chlorine neutralization',
          'Post-shock treatment adjustment',
          'Over-chlorination correction',
          'Pre-drain water treatment',
          'Swimmer comfort restoration',
          'Equipment protection from high chlorine',
          'Emergency chlorine reduction',
          'Water rebalancing after treatment'
        ],
        technicalSpecs: [
          'Active ingredient: Sodium bisulfite 38-40%',
          'Appearance: Clear to yellow liquid',
          'pH: 3.5-5.0',
          'Fast-acting formula',
          'Dosage: 100ml reduces 1ppm chlorine in 10,000L',
          'Complete reaction in 15-30 minutes',
          'Available in 5L, 20L, 60L containers'
        ]
      },
    },
    {
      id: 'sodium-bi-sulphite-monohydrate',
      title: 'Sodium Bi Sulphite Monohydrate',
      description: 'Powder form for neutralizing chlorine and adjusting pool chemistry.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '7631-90-5',
        alternativeNames: ['Sodium bisulfite powder', 'Dechlorinator powder', 'Chlorine neutralizer', 'Sodium bisulfite monohydrate'],
        seoKeywords: ['sodium bisulfite powder Oman', 'dechlorinator powder Muscat', 'chlorine neutralizer Oman', 'sodium bisulfite monohydrate Muscat'],
        longDescription: 'Sodium Bisulfite Monohydrate powder supplier in Oman - Global Chemicals LLC provides high-purity dechlorination powder for swimming pools in Muscat, Sohar, Salalah. Our powder sodium bisulfite offers precise chlorine reduction with easy measurement and storage. Ideal for neutralizing excess chlorine after shock treatments, over-chlorination correction, and water chemistry balancing. The powder form provides longer shelf life and economical handling for pool service companies and facilities managers. Dissolves quickly to reduce chlorine levels safely and effectively. Essential for maintaining optimal water balance in hotels, resorts, and commercial pools across Oman.',
        applications: [
          'Powder form chlorine neutralization',
          'Post-shock chlorine reduction',
          'Over-chlorination emergency treatment',
          'Precise chlorine level adjustment',
          'Long-term storage applications',
          'Bulk pool service operations',
          'Water chemistry balancing',
          'Pre-drain water treatment'
        ],
        technicalSpecs: [
          'Chemical form: Sodium bisulfite monohydrate (NaHSO3·H2O)',
          'Purity: 95% minimum',
          'Appearance: White to off-white crystalline powder',
          'Dosage: 70-100g reduces 1ppm chlorine in 10,000L',
          'Dissolves rapidly in water',
          'Stable powder with long shelf life',
          'Packaging: 1kg, 5kg, 25kg bags'
        ]
      },
    },
    {
      id: 'tcca-tablet-pool',
      title: 'Trichloroisocyanuric Acid Tablet',
      description: 'Stabilized chlorine tablets with built-in cyanuric acid for UV protection.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '87-90-1',
        alternativeNames: ['TCCA tablets', 'Trichlor', 'Stabilized chlorine tablets', 'Trichloroisocyanuric acid', 'Symclosene tablets'],
        seoKeywords: ['TCCA tablets Oman', 'trichloroisocyanuric acid Muscat', 'stabilized chlorine Oman', 'trichlor tablets Muscat', 'symclosene Oman'],
        longDescription: 'Premium TCCA Tablets (Trichloroisocyanuric Acid) supplier in Oman - Global Chemicals LLC provides stabilized chlorine tablets for swimming pools in Muscat, Sohar, Salalah. Our TCCA tablets contain 90% available chlorine with built-in stabilizer (cyanuric acid) that protects chlorine from UV degradation in Oman\'s intense sunlight. The slow-dissolving tablets provide continuous sanitization for 3-7 days, reducing maintenance frequency. Ideal for automatic feeders, floating dispensers, and skimmers. Available in multiple sizes (20g, 200g) for different pool types. Widely used in residential pools, hotels, resorts, and commercial facilities throughout Oman for reliable, long-lasting pool sanitation.',
        applications: [
          'Continuous pool chlorination',
          'UV-protected outdoor pools',
          'Automatic chlorine feeder systems',
          'Floating chlorine dispensers',
          'Skimmer basket treatment',
          'Residential and commercial pools',
          'Hotel and resort maintenance',
          'Low-maintenance pool programs'
        ],
        technicalSpecs: [
          'Available chlorine: 90% minimum',
          'Contains cyanuric acid stabilizer',
          'Tablet sizes: 20g (small), 200g (jumbo)',
          'Dissolution time: 3-7 days depending on size',
          'pH: 2.8-3.2 (1% solution)',
          'Dosage: 1-3 tablets per 10,000 liters weekly',
          'Packaging: 1kg, 5kg, 10kg, 25kg buckets'
        ]
      },
    },
    {
      id: 'chlorine-powder-pool',
      title: 'Chlorine Powder',
      description: 'Powdered chlorine for rapid pool treatment and shock applications.',
      category: 'swimming-pool',
      icon: Droplets,
      details: {
        casNumber: '7778-54-3',
        alternativeNames: ['Chlorine shock powder', 'Pool shock', 'Cal-hypo powder', 'Calcium hypochlorite powder', 'HTH powder'],
        seoKeywords: ['chlorine powder Oman', 'pool shock powder Muscat', 'chlorine shock Oman', 'calcium hypochlorite powder Muscat', 'HTH powder Oman'],
        longDescription: 'High-Strength Chlorine Powder supplier in Oman - Global Chemicals LLC provides fast-acting chlorine shock powder for swimming pools in Muscat, Sohar, Salalah. Our calcium hypochlorite powder contains 65-70% available chlorine for powerful oxidation and shock treatment. The fine powder format dissolves rapidly for quick pool recovery after algae blooms, cloudy water, or contamination events. Ideal for emergency treatments, weekly shock programs, and super chlorination. The powder form allows precise measurement and even distribution. Essential for pool opening, closing, and maintaining water clarity in hotels, resorts, public pools, and residential pools throughout Oman.',
        applications: [
          'Weekly shock treatment programs',
          'Rapid algae elimination',
          'Cloudy water clarification',
          'Emergency pool disinfection',
          'Chloramine breakpoint treatment',
          'Pool opening and closing procedures',
          'Post-heavy usage super chlorination',
          'Organic contamination oxidation'
        ],
        technicalSpecs: [
          'Available chlorine: 65-70%',
          'Fine powder - rapid dissolution',
          'pH: 11-12',
          'Shock dosage: 150-300g per 10,000 liters',
          'Dissolves in 2-4 hours',
          'No built-in stabilizer',
          'Packaging: 500g, 1kg, 5kg, 25kg, 50kg'
        ]
      },
    },

    // Oilfield & Refinery
    {
      id: 'acetic-acid',
      title: 'Acetic Acid',
      description: 'Organic acid used in chemical synthesis and industrial processes.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'CH3COOH',
        casNumber: '64-19-7',
        alternativeNames: ['Ethanoic acid', 'Glacial acetic acid', 'Vinegar acid', 'Acetic acid glacial'],
        seoKeywords: ['acetic acid Oman', 'ethanoic acid Muscat', 'glacial acetic acid Oman', 'acetic acid oilfield Sohar', 'acidizing agent Oman'],
        longDescription: 'Premium Acetic Acid supplier in Oman - Global Chemicals LLC provides high-purity glacial acetic acid for oilfield, refinery, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our acetic acid (CH3COOH) is widely used in well stimulation, acidizing operations, scale removal, and chemical synthesis. The glacial grade offers 99%+ purity for demanding applications. Essential for petroleum production enhancement, pipeline cleaning, and drilling fluid additives. Acetic acid effectively dissolves carbonate scales and enhances well productivity. Serving major oil & gas companies, refineries, and industrial facilities across Oman with reliable supply and technical support.',
        applications: [
          'Well acidizing and stimulation treatments',
          'Carbonate scale removal in oilfield operations',
          'Drilling fluid pH control and additives',
          'Pipeline and equipment cleaning',
          'Chemical synthesis and intermediate production',
          'Refinery process applications',
          'Industrial solvent and reagent',
          'Production enhancement in oil wells'
        ],
        technicalSpecs: [
          'Purity: 99-100% (glacial grade)',
          'Appearance: Clear colorless liquid',
          'Specific gravity: 1.049 at 20°C',
          'Freezing point: 16-17°C',
          'Available in drums, IBCs, and bulk tankers'
        ]
      },
    },
    {
      id: 'activated-alumina-desiccant',
      title: 'Activated Alumina Desiccant',
      description: 'High-capacity desiccant for moisture removal and gas drying.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '1344-28-1',
        alternativeNames: ['Alumina desiccant', 'Activated aluminum oxide', 'Gas drying agent', 'Al2O3 desiccant', 'Activated alumina balls'],
        seoKeywords: ['activated alumina Oman', 'desiccant Oman', 'gas drying Muscat', 'moisture remover Oman', 'gas dehydration Sohar', 'alumina desiccant oilfield Oman'],
        longDescription: 'Activated Alumina Desiccant supplier in Oman - Global Chemicals LLC provides high-performance activated alumina for gas dehydration, moisture removal, and drying applications in Muscat, Sohar, Duqm. Our activated alumina offers superior moisture adsorption capacity for natural gas processing, compressed air drying, and instrument air systems. The porous structure provides excellent water vapor adsorption at high temperatures and can be regenerated multiple times. Essential for protecting equipment and processes from moisture damage in oil & gas facilities, refineries, and petrochemical plants. Available in various bead sizes (3-5mm, 4-6mm) for different applications across Oman.',
        applications: [
          'Natural gas dehydration and processing',
          'Compressed air and instrument air drying',
          'Hydrocarbon stream drying in refineries',
          'Process gas moisture removal',
          'Catalyst support and protection',
          'Hydrogen peroxide stabilization',
          'Transformer oil drying',
          'Refrigerant and solvent drying'
        ],
        technicalSpecs: [
          'Surface area: 300-400 m²/g',
          'Bulk density: 0.70-0.85 kg/L',
          'Water adsorption capacity: 17-20% at 60% RH',
          'Bead sizes: 3-5mm, 4-6mm, 5-8mm',
          'Regeneration temperature: 150-300°C',
          'Crush strength: >50N'
        ]
      },
    },
    {
      id: 'activated-carbon',
      title: 'Activated Carbon',
      description: 'Highly porous carbon for adsorption and purification applications.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '7440-44-0',
        alternativeNames: ['Activated charcoal', 'Active carbon', 'Carbon adsorbent', 'Activated carbon granular', 'AC media'],
        seoKeywords: ['activated carbon Oman', 'activated charcoal Muscat', 'carbon adsorbent Oman', 'activated carbon oilfield Sohar', 'granular carbon Oman'],
        longDescription: 'Industrial Activated Carbon supplier in Oman - Global Chemicals LLC provides high-quality activated carbon for oil & gas, refinery, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our activated carbon offers exceptional adsorption capacity for removing organic contaminants, H2S, mercaptans, and impurities from hydrocarbon streams. Available in granular, pellet, and powder forms to suit different applications. Essential for gas purification, solvent recovery, produced water treatment, and emissions control. The high surface area (900-1200 m²/g) ensures maximum contaminant removal efficiency. Widely used in refineries, petrochemical plants, and oilfield operations across Oman.',
        applications: [
          'Gas purification and H2S removal',
          'Solvent recovery in refineries',
          'Produced water treatment',
          'Mercury removal from natural gas',
          'VOC emissions control',
          'Condensate polishing',
          'Odor control in facilities',
          'Catalyst support applications'
        ],
        technicalSpecs: [
          'Surface area: 900-1200 m²/g',
          'Iodine number: >900 mg/g',
          'Available forms: Granular (8x30 mesh), pellets, powder',
          'Bulk density: 0.40-0.55 g/cm³',
          'Moisture content: <5%',
          'Hardness: >95%'
        ]
      },
    },
    {
      id: 'ammonium-bifluoride',
      title: 'Ammonium Bifluoride',
      description: 'Etching and cleaning agent for industrial applications.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'NH4HF2',
        casNumber: '1341-49-7',
        alternativeNames: ['Ammonium hydrogen fluoride', 'ABF', 'Ammonium acid fluoride', 'Ammonium bifluoride powder'],
        seoKeywords: ['ammonium bifluoride Oman', 'ABF Muscat', 'cleaning agent Oman', 'ammonium hydrogen fluoride Sohar', 'acidizing agent Oman'],
        longDescription: 'Ammonium Bifluoride (ABF) supplier in Oman - Global Chemicals LLC provides industrial-grade ammonium hydrogen fluoride for oilfield acidizing, metal treatment, and surface cleaning in Muscat, Sohar, Duqm. Our ABF is highly effective for dissolving siliceous scales, cleaning metal surfaces, and well stimulation treatments. Safer to handle than hydrofluoric acid while providing similar fluoride reactivity. Widely used in sandstone acidizing, scale removal from heat exchangers and vessels, and surface preparation. Essential for maintaining equipment efficiency in refineries, oilfields, and industrial facilities across Oman. Available in powder and solution forms with technical support.',
        applications: [
          'Sandstone matrix acidizing treatments',
          'Silica and silicate scale removal',
          'Heat exchanger and vessel cleaning',
          'Well stimulation in oilfields',
          'Metal surface etching and cleaning',
          'Glass frosting and etching',
          'Aluminum and stainless steel brightening',
          'Rust and scale removal'
        ],
        technicalSpecs: [
          'Chemical formula: NH4HF2',
          'Purity: 95-98%',
          'Appearance: White crystalline powder',
          'pH (1% solution): 3.5-4.5',
          'Solubility: Highly soluble in water',
          'Available in 25kg bags, drums'
        ]
      },
    },
    {
      id: 'ammonium-bisulphite',
      title: 'Ammonium Bisulphite',
      description: 'Reducing agent and oxygen scavenger for industrial processes.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'NH4HSO3',
        casNumber: '10192-30-0',
        alternativeNames: ['Ammonium bisulfite', 'Ammonium hydrogen sulfite', 'ABS solution', 'Ammonium bisulfite liquid'],
        seoKeywords: ['ammonium bisulfite Oman', 'oxygen scavenger Muscat', 'reducing agent Oman', 'ammonium bisulphite oilfield Sohar', 'deoxygenation chemical Oman'],
        longDescription: 'Ammonium Bisulfite supplier in Oman - Global Chemicals LLC provides high-quality ammonium bisulfite solution for oxygen scavenging, chlorine neutralization, and reducing applications in Muscat, Sohar, Duqm. Our ammonium bisulfite (NH4HSO3) effectively removes dissolved oxygen from water systems, preventing corrosion in boilers, pipelines, and oilfield operations. The solution acts as a powerful reducing agent and dechlorination chemical. Essential for protecting equipment and enhancing operational efficiency in refineries, power plants, and industrial facilities. Available in various concentrations (40%, 60%) for different applications across Oman with technical dosing support.',
        applications: [
          'Oxygen scavenging in boiler water',
          'Corrosion prevention in oilfield water systems',
          'Chlorine neutralization and dechlorination',
          'Reducing agent in chemical processes',
          'Pipeline corrosion control',
          'Water treatment applications',
          'Flue gas desulfurization',
          'Photography and textile processing'
        ],
        technicalSpecs: [
          'Concentration: 40-60% NH4HSO3',
          'Appearance: Clear to pale yellow liquid',
          'pH: 3.5-5.0',
          'Specific gravity: 1.12-1.18',
          'Dosage: 10-50 ppm for oxygen scavenging',
          'Available in drums, IBCs, and bulk'
        ]
      },
    },
    {
      id: 'ammonium-chloride',
      title: 'Ammonium Chloride',
      description: 'Inorganic compound used in drilling fluids and metal treatment.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'NH4Cl',
        casNumber: '12125-02-9',
        alternativeNames: ['Sal ammoniac', 'Ammonium muriate', 'Ammonium chloride powder', 'NH4Cl'],
        seoKeywords: ['ammonium chloride Oman', 'sal ammoniac Muscat', 'drilling fluid Oman', 'ammonium chloride oilfield Sohar', 'NH4Cl Oman'],
        longDescription: 'Ammonium Chloride supplier in Oman - Global Chemicals LLC provides industrial-grade ammonium chloride for drilling fluids, completion fluids, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our ammonium chloride (NH4Cl) is widely used as a shale stabilizer in water-based drilling muds, preventing clay swelling and wellbore instability. The compound also serves as a source of nitrogen in fertilizers and as a flux in metal soldering and galvanizing operations. Essential for oil & gas drilling operations, metal treatment, and chemical synthesis. Available in powder and granular forms with consistent quality for demanding applications across Oman.',
        applications: [
          'Shale stabilizer in drilling fluids',
          'Completion and workover fluids',
          'Clay swelling inhibitor',
          'Wellbore stabilization',
          'Flux for metal soldering and galvanizing',
          'Nitrogen source in fertilizers',
          'Textile printing and dyeing',
          'Battery electrolyte additive'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum',
          'Appearance: White crystalline powder',
          'Solubility: 37g/100ml water at 20°C',
          'pH (10% solution): 4.5-6.0',
          'Moisture content: <0.5%',
          'Packaging: 25kg, 50kg bags'
        ]
      },
    },
    {
      id: 'barium-chloride',
      title: 'Barium Chloride',
      description: 'Heavy metal salt for brine formulation and drilling applications.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'BaCl2',
        casNumber: '10361-37-2',
        alternativeNames: ['Barium dichloride', 'Barium chloride dihydrate', 'BaCl2 brine', 'Barium chloride solution'],
        seoKeywords: ['barium chloride Oman', 'brine formulation Muscat', 'drilling chemical Oman', 'completion fluid Sohar', 'BaCl2 Oman'],
        longDescription: 'Barium Chloride supplier in Oman - Global Chemicals LLC provides high-purity barium chloride for high-density brine formulations and drilling applications in Muscat, Sohar, Duqm. Our barium chloride (BaCl2) is essential for creating clear,  high-density completion and workover fluids in oil & gas wells. The compound provides excellent density control (up to 1.70 sg) while maintaining low solids content. Widely used in well control operations, pressure control, and as a component in specialized drilling fluids. Barium chloride also serves in wastewater treatment for sulfate removal. Available in dihydrate form with consistent quality for demanding oilfield applications across Oman.',
        applications: [
          'High-density completion and workover fluids',
          'Well control and pressure management',
          'Clear brine formulations for drilling',
          'Packer fluids in oil & gas wells',
          'Sulfate removal in produced water',
          'Wastewater treatment',
          'Chemical synthesis and laboratory reagent',
          'Heat treatment salt baths'
        ],
        technicalSpecs: [
          'Purity: 99% minimum (dihydrate)',
          'Specific gravity: Up to 1.70 with concentrated solutions',
          'Appearance: White crystalline solid',
          'Solubility: 37g/100ml water at 25°C',
          'Available in powder and solution forms',
          'Packaging: 25kg bags, drums, bulk'
        ]
      },
    },
    {
      id: 'bentonite-powder',
      title: 'Bentonite Powder',
      description: 'Clay-based drilling mud additive for viscosity control.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '1302-78-9',
        alternativeNames: ['Bentonite clay', 'Drilling clay', 'Montmorillonite', 'Sodium bentonite', 'Drilling grade bentonite'],
        seoKeywords: ['bentonite Oman', 'drilling mud Muscat', 'bentonite clay Oman', 'viscosity control Oman', 'drilling grade bentonite Sohar', 'API bentonite Oman'],
        longDescription: 'Premium Bentonite Powder supplier in Oman - Global Chemicals LLC provides API-grade bentonite for drilling mud formulations and industrial applications in Muscat, Sohar, Duqm, Salalah. Our sodium bentonite offers excellent viscosity building, fluid loss control, and wellbore stability in water-based drilling fluids. The swelling clay properties create effective filter cakes that prevent fluid invasion into formations. Essential for all rotary drilling operations, geotechnical applications, and civil engineering projects. API 13A specification bentonite ensures consistent performance in demanding oilfield conditions. Widely used by drilling contractors, oilfield service companies, and construction firms across Oman.',
        applications: [
          'Water-based drilling mud formulations',
          'Viscosity and gel strength control',
          'Fluid loss control in drilling',
          'Wellbore stabilization and support',
          'Filter cake formation',
          'Geotechnical drilling and grouting',
          'Civil engineering applications',
          'Pond and lagoon sealing'
        ],
        technicalSpecs: [
          'API 13A specification grade',
          'Yield: 15-17 bbl/ton (API standard)',
          'Viscosity: 30-35 cP at 600 RPM',
          'Fluid loss: <15 ml/30min',
          'Moisture content: <12%',
          'Mesh size: 200 mesh minimum',
          'Packaging: 25kg bags, bulk bags'
        ]
      },
    },
    {
      id: 'borax-powder',
      title: 'Borax Powder',
      description: 'Multipurpose boron compound for industrial applications.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'Na2B4O7·10H2O',
        casNumber: '1303-96-4',
        alternativeNames: ['Sodium borate', 'Sodium tetraborate decahydrate', 'Borax decahydrate', 'Borax 10-mol', 'Sodium borate decahydrate'],
        seoKeywords: ['borax Oman', 'sodium borate Muscat', 'borax powder Oman', 'borax oilfield Sohar', 'sodium tetraborate Oman'],
        longDescription: 'Borax Powder supplier in Oman - Global Chemicals LLC provides high-quality borax (sodium borate decahydrate) for oilfield, industrial, and chemical applications in Muscat, Sohar, Duqm, Salalah. Our borax powder serves as a crosslinking agent in fracturing fluids, pH buffer in drilling muds, and corrosion inhibitor in completion fluids. Essential for gelling guar-based fracturing fluids, providing thermal stability, and controlling rheology in high-temperature wells. Borax also finds use in glass manufacturing, ceramic glazes, welding fluxes, and as a precursor for boron compounds. The versatile compound offers excellent buffering capacity and is compatible with most drilling and completion fluid systems. Widely used across Oman\'s oil & gas industry for hydraulic fracturing and drilling operations.',
        applications: [
          'Crosslinking agent in fracturing fluids',
          'pH buffer in drilling muds',
          'Corrosion inhibitor in completion fluids',
          'Guar gum crosslinker for high-temp fracturing',
          'Glass and ceramic manufacturing',
          'Welding flux and brazing',
          'Boron compound production',
          'Fire retardant formulations'
        ],
        technicalSpecs: [
          'Chemical form: Sodium tetraborate decahydrate',
          'Boron content: 11.3%',
          'Appearance: White crystalline powder',
          'Solubility: 5g/100ml water at 20°C',
          'pH (1% solution): 9.0-9.5',
          'Typical dosage: 0.5-2 lb/1000 gal in fracturing',
          'Packaging: 25kg, 50kg bags, bulk'
        ]
      },
    },
    {
      id: 'boric-acid',
      title: 'Boric Acid',
      description: 'Weak acid used in chemical synthesis and industrial processes.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'H3BO3',
        casNumber: '10043-35-3',
        alternativeNames: ['Boracic acid', 'Hydrogen borate', 'Orthoboric acid', 'Acidum boricum'],
        seoKeywords: ['boric acid Oman', 'boracic acid Muscat', 'boric acid powder Oman', 'H3BO3 Sohar', 'boric acid industrial Oman'],
        longDescription: 'Boric Acid supplier in Oman - Global Chemicals LLC provides high-purity boric acid for oilfield, chemical, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our boric acid (H3BO3) serves as a pH buffer in drilling fluids, corrosion inhibitor in completion fluids, and temperature-stable additive for high-temperature wells. Essential for controlling pH in water-based drilling muds, reducing friction in drilling operations, and inhibiting bacterial growth. Boric acid also finds extensive use in nuclear applications, glass and ceramic production, flame retardants, and as a precursor for boron compounds. The weak acid properties provide effective buffering without aggressive corrosion. Widely used in oilfield operations, refineries, and chemical processing facilities across Oman.',
        applications: [
          'pH control in drilling fluids',
          'Corrosion inhibitor in completion fluids',
          'High-temperature wellbore stabilizer',
          'Biocide in drilling mud systems',
          'Nuclear coolant and moderator',
          'Glass and ceramic manufacturing',
          'Flame retardant production',
          'Chemical intermediate and catalyst'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum',
          'Appearance: White crystalline powder or flakes',
          'Molecular weight: 61.83 g/mol',
          'Solubility: 5.7g/100ml water at 25°C',
          'pH (saturated solution): 5.1',
          'Temperature stable - ideal for high-temp wells',
          'Packaging: 25kg bags, drums, bulk'
        ]
      },
    },
    {
      id: 'butyl-glycol',
      title: 'Butyl Glycol',
      description: 'Solvent for paints, coatings, and cleaning formulations.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C6H14O2',
        casNumber: '111-76-2',
        alternativeNames: ['2-Butoxyethanol', 'Butyl cellosolve', 'Ethylene glycol monobutyl ether', 'EGBE', 'Butyl oxitol'],
        seoKeywords: ['butyl glycol Oman', 'butyl cellosolve Muscat', 'solvent Oman', '2-butoxyethanol Sohar', 'EGBE Oman', 'glycol ether Oman'],
        longDescription: 'Butyl Glycol (2-Butoxyethanol) supplier in Oman - Global Chemicals LLC provides high-quality butyl glycol for oilfield, coatings, and industrial cleaning applications in Muscat, Sohar, Duqm, Salalah. Our butyl glycol serves as an excellent solvent for oils, resins, greases, and dirt, making it essential for oilfield cleaning operations and industrial degreasers. The compound effectively dissolves both water-soluble and oil-soluble contaminants. Widely used in paint and coating formulations, well stimulation treatments, and production chemical additives. Butyl glycol provides superior coupling and solvency in cleaning formulations for wellhead equipment, pipelines, and industrial facilities. The slow evaporation rate and good water miscibility make it ideal for heavy-duty cleaning applications across Oman.',
        applications: [
          'Industrial degreaser formulations',
          'Oilfield equipment cleaning',
          'Paint and coating solvent',
          'Well stimulation fluid additive',
          'Drilling mud surfactant',
          'Production chemical formulations',
          'Household and institutional cleaners',
          'Ink and printing industry'
        ],
        technicalSpecs: [
          'Purity: 99% minimum',
          'Appearance: Clear colorless liquid',
          'Boiling point: 171°C',
          'Flash point: 61°C',
          'Miscible with water and most organic solvents',
          'Specific gravity: 0.902 at 20°C',
          'Slow evaporation - extended working time',
          'Available in drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'calcium-bromide',
      title: 'Calcium Bromide Powder/Liquid',
      description: 'High-density brine for drilling and completion fluids.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'CaBr2',
        casNumber: '7789-41-5',
        alternativeNames: ['Calcium dibromide', 'CaBr2 brine', 'Calcium bromide solution', 'CaBr2 completion fluid'],
        seoKeywords: ['calcium bromide Oman', 'completion fluid Muscat', 'drilling brine Oman', 'CaBr2 Sohar', 'high density brine Oman', 'workover fluid Oman'],
        longDescription: 'Calcium Bromide supplier in Oman - Global Chemicals LLC provides premium calcium bromide in powder and liquid forms for high-density clear brine fluids in Muscat, Sohar, Duqm. Our CaBr2 creates solids-free, high-density (up to 1.84 sg) completion and workover fluids that minimize formation damage. Calcium bromide brines provide excellent wellbore stability, pressure control, and formation compatibility. The clear fluid allows better visibility during operations and reduces solids-related problems. Essential for completion, workover, packer fluids, and well control operations in oil & gas wells. Compatible with formate brines for ultra-high density applications. Widely used across Oman\'s oilfields for maintaining well integrity and maximizing production.',
        applications: [
          'High-density completion fluids (up to 1.84 sg)',
          'Clear workover and kill fluids',
          'Packer fluids in production wells',
          'Well control and pressure management',
          'Solids-free reservoir drilling',
          'Horizontal well completions',
          'Underbalanced drilling fluids',
          'Formation-friendly well interventions'
        ],
        technicalSpecs: [
          'Density range: 1.20-1.84 sg (powder dissolved)',
          'Available forms: Powder (anhydrous) and liquid (52%)',
          'Appearance: White powder or clear liquid',
          'Solubility: Highly soluble in water',
          'Low corrosion with proper inhibitors',
          'Temperature stable up to 200°C',
          'Available in bags, drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'citric-acid-food',
      title: 'Citric Acid Food Grade',
      description: 'Food-grade organic acid for cleaning and pH control.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C6H8O7',
        casNumber: '77-92-9',
        alternativeNames: ['Citric acid monohydrate', 'Food grade citric acid', 'Citric acid powder food grade'],
        seoKeywords: ['citric acid food grade Oman', 'citric acid Muscat', 'acidizing agent Oman', 'food grade acid Sohar', 'citric acid cleaning Oman'],
        longDescription: 'Food Grade Citric Acid supplier in Oman - Global Chemicals LLC provides USP/food-grade citric acid for oilfield, food processing, and industrial cleaning in Muscat, Sohar, Duqm, Salalah. Our food-grade citric acid meets the highest purity standards for well stimulation treatments where environmental concerns require non-toxic, biodegradable acids. Essential for offshore operations, environmentally sensitive areas, and food-contact surface cleaning. Citric acid provides effective scale removal and pH adjustment with excellent safety profile. The biodegradable organic acid is preferred for applications requiring minimal environmental impact. Widely used in food processing equipment cleaning, beverage production, pharmaceutical applications, and eco-friendly well treatments across Oman.',
        applications: [
          'Environmentally-friendly well acidizing',
          'Offshore platform cleaning operations',
          'Food processing equipment cleaning',
          'Beverage industry pH control',
          'Pharmaceutical cleaning applications',
          'Scale removal in sensitive areas',
          'Biodegradable acidizing treatments',
          'Water treatment pH adjustment'
        ],
        technicalSpecs: [
          'Purity: USP/Food Grade 99.5%+',
          'Form: Monohydrate powder',
          'Appearance: White crystalline powder',
          'pH (5% solution): 2.2',
          'Biodegradable organic acid',
          'Non-toxic - safe for food contact',
          'Meets FDA/USP specifications',
          'Packaging: 25kg bags, drums'
        ]
      },
    },
    {
      id: 'calcium-chloride-oil',
      title: 'Calcium Chloride',
      description: 'Dense brine solution for well completion and workover operations.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'CaCl2',
        casNumber: '10043-52-4',
        alternativeNames: ['Calcium dichloride', 'CaCl2 brine', 'Calcium chloride solution', 'Completion brine CaCl2'],
        seoKeywords: ['calcium chloride Oman', 'completion brine Muscat', 'CaCl2 Oman', 'calcium chloride oilfield Sohar', 'completion fluid Oman', 'CaCl2 workover Oman'],
        longDescription: 'Calcium Chloride brine supplier in Oman - Global Chemicals LLC provides high-quality CaCl2 for completion, workover, and drilling fluids in Muscat, Sohar, Duqm, Salalah. Our calcium chloride creates economical, high-density clear brines (up to 1.39 sg) for well control and completion operations. CaCl2 brines are cost-effective, readily available, and compatible with most downhole tools and formations. The clear fluid minimizes formation damage while providing excellent pressure control. Essential for completion, workover, packer fluids, and well servicing operations across Oman\'s oil & gas fields. Available in multiple concentrations to meet specific density requirements with corrosion inhibitor packages.',
        applications: [
          'Well completion and workover fluids',
          'Clear brine packer fluids',
          'Drilling and completion fluid weighting',
          'Well control and kill operations',
          'Horizontal well completions',
          'Coiled tubing operations',
          'Snubbing and well intervention',
          'Formation-compatible completion fluids'
        ],
        technicalSpecs: [
          'Density range: 1.08-1.39 sg',
          'Available concentrations: 30%, 38%, 42%',
          'Appearance: Clear colorless liquid',
          'Freezing point: -55°C (42% solution)',
          'pH: 8-10',
          'Compatible with corrosion inhibitors',
          'Available in drums, IBCs, bulk tankers'
        ]
      },
    },
    {
      id: 'citric-acid-liquid',
      title: 'Citric Acid Liquid',
      description: 'Liquid acidizing agent for well stimulation and scale removal.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C6H8O7',
        casNumber: '77-92-9',
        alternativeNames: ['Citric acid solution', 'Liquid citric acid', 'Citric acid 50%', 'Citric acid aqueous'],
        seoKeywords: ['citric acid liquid Oman', 'acidizing agent Muscat', 'well stimulation Oman', 'liquid acid Sohar', 'citric acid solution Oman'],
        longDescription: 'Liquid Citric Acid supplier in Oman - Global Chemicals LLC provides concentrated citric acid solution for well stimulation, scale removal, and industrial cleaning in Muscat, Sohar, Duqm, Salalah. Our liquid citric acid offers convenient handling and precise dosing for oilfield acidizing treatments. The pre-dissolved solution provides immediate activity without mixing requirements. Essential for matrix acidizing in carbonate formations, scale dissolution, and equipment cleaning. Citric acid is biodegradable and environmentally friendly, making it ideal for offshore operations and sensitive areas. The liquid format ensures uniform distribution and consistent treatment results. Widely used for well productivity enhancement, scale removal, and surface facility cleaning across Oman\'s oil & gas industry.',
        applications: [
          'Matrix acidizing in carbonate reservoirs',
          'Iron scale and rust removal',
          'Calcium carbonate scale dissolution',
          'Equipment and pipeline cleaning',
          'Environmentally-friendly well treatments',
          'Offshore platform acidizing operations',
          'Downhole tool cleaning',
          'Surface facility descaling'
        ],
        technicalSpecs: [
          'Concentration: 50% typical (can vary)',
          'Appearance: Clear colorless to pale yellow liquid',
          'pH: <2 (concentrated solution)',
          'Ready-to-use or dilutable',
          'Biodegradable organic acid',
          'Low corrosion compared to mineral acids',
          'Chelating properties for iron control',
          'Available in drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'citric-acid-powder',
      title: 'Citric Acid Powder',
      description: 'Powder form for scale removal and well acidizing.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C6H8O7',
        casNumber: '77-92-9',
        alternativeNames: ['Citric acid anhydrous', 'Citric acid crystals', 'Anhydrous citric acid powder'],
        seoKeywords: ['citric acid powder Oman', 'scale remover Muscat', 'acidizing powder Oman', 'citric acid anhydrous Sohar', 'acid powder oilfield Oman'],
        longDescription: 'Citric Acid Powder supplier in Oman - Global Chemicals LLC provides anhydrous citric acid powder for well acidizing, scale removal, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our citric acid powder offers economical storage, long shelf life, and flexible field preparation for acidizing treatments. The anhydrous form provides maximum citric acid content per weight for cost-effective transportation and handling. Essential for field-mixed acidizing treatments, batch operations, and remote locations. The powder dissolves readily to create treating solutions at desired concentrations. Widely used by oilfield service companies for well stimulation, scale removal, and equipment cleaning across Oman. The biodegradable nature makes it suitable for environmentally sensitive operations.',
        applications: [
          'Field-prepared acidizing solutions',
          'Matrix acidizing treatments',
          'Scale removal in wellbores',
          'Equipment descaling operations',
          'Batch chemical preparation',
          'Remote location well treatments',
          'Chelating agent for iron control',
          'Environmentally-friendly stimulation'
        ],
        technicalSpecs: [
          'Form: Anhydrous powder (no water of crystallization)',
          'Purity: 99.5% minimum',
          'Appearance: White crystalline powder',
          'Solubility: 133g/100ml water at 20°C',
          'Dissolves rapidly for solution preparation',
          'Long shelf life when stored dry',
          'Maximum citric acid content',
          'Packaging: 25kg bags, drums, bulk'
        ]
      },
    },
    {
      id: 'cmc',
      title: 'CMC Carboxymethylcellulose',
      description: 'Fluid loss control agent and viscosifier for drilling fluids.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '9000-11-7',
        alternativeNames: ['Carboxymethyl cellulose', 'CMC', 'Sodium CMC', 'Drilling grade CMC', 'Cellulose gum'],
        seoKeywords: ['CMC Oman', 'carboxymethylcellulose Muscat', 'drilling fluid additive Oman', 'CMC drilling Sohar', 'fluid loss control Oman', 'PAC alternative Oman'],
        longDescription: 'CMC (Carboxymethylcellulose) supplier in Oman - Global Chemicals LLC provides API-grade CMC for drilling fluid applications in Muscat, Sohar, Duqm, Salalah. Our sodium CMC is a highly effective fluid loss control additive and viscosifier for water-based drilling muds. CMC reduces filtration rates, stabilizes rheology, and improves hole cleaning efficiency. The polymer provides excellent performance in fresh, brackish, and saltwater systems. Available in various viscosity grades (LV, HV) to meet specific drilling requirements. Essential for all water-based drilling operations, workover fluids, and completion applications. CMC offers cost-effective fluid loss control compared to PAC polymers. Widely used by drilling contractors and oilfield service companies across Oman.',
        applications: [
          'Fluid loss control in water-based drilling muds',
          'Viscosity building and rheology control',
          'Shale stabilization and wellbore support',
          'Filtration rate reduction',
          'Workover and completion fluid additive',
          'Drilling in freshwater and saltwater systems',
          'Polymer mud formulations',
          'Hole cleaning enhancement'
        ],
        technicalSpecs: [
          'API 13A specification grade',
          'Available grades: Low Viscosity (LV), High Viscosity (HV)',
          'Degree of substitution: 0.65-0.95',
          'Typical dosage: 1-5 lb/bbl',
          'Compatible with most drilling fluid additives',
          'Effective in pH 7-11 range',
          'Packaging: 25kg bags, bulk bags'
        ]
      },
    },
    {
      id: 'diesel-exhaust-fluid',
      title: 'Diesel Exhaust Fluid',
      description: 'Emission control solution for diesel engines.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '57-13-6',
        alternativeNames: ['DEF', 'AdBlue', 'Urea solution 32.5%', 'AUS 32', 'Diesel exhaust fluid'],
        seoKeywords: ['DEF Oman', 'diesel exhaust fluid Muscat', 'AdBlue Oman', 'DEF oilfield Sohar', 'SCR fluid Oman', 'urea solution Oman'],
        longDescription: 'Diesel Exhaust Fluid (DEF/AdBlue) supplier in Oman - Global Chemicals LLC provides high-purity DEF for SCR emission control systems in Muscat, Sohar, Duqm, Salalah. Our DEF is a precisely formulated 32.5% urea solution that reduces nitrogen oxide (NOx) emissions from diesel engines by up to 90%. Essential for modern diesel vehicles, trucks, heavy equipment, and oilfield machinery equipped with Selective Catalytic Reduction (SCR) technology. DEF meets ISO 22241 standards for purity and ensures optimal SCR system performance. The non-toxic, non-flammable solution is required for EPA Tier 4 and Euro 6 compliant diesel engines. Widely used by oilfield operators, trucking companies, and industrial facilities across Oman to meet environmental regulations.',
        applications: [
          'SCR emission control in diesel vehicles',
          'Oilfield equipment and drilling rigs',
          'Heavy-duty trucks and transport',
          'Construction and mining equipment',
          'Power generation diesel engines',
          'Marine diesel engines',
          'Agricultural machinery',
          'Industrial diesel equipment'
        ],
        technicalSpecs: [
          'Urea content: 32.5% ± 0.5% (by weight)',
          'Meets ISO 22241 / AUS 32 standards',
          'Appearance: Clear colorless liquid',
          'Freezing point: -11°C',
          'pH: 9-10',
          'Non-toxic, non-flammable',
          'Purity: >99.5% reagent grade urea',
          'Available in 10L, 20L, 200L drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'corrosion-inhibitor',
      title: 'Corrosion Inhibitor',
      description: 'Protective chemicals for pipelines and equipment.',
      category: 'oilfield',
      icon: Factory,
      details: {
        alternativeNames: ['Corrosion preventive', 'Inhibitor', 'Anti-corrosion chemical', 'Pipeline corrosion inhibitor', 'Corrosion control agent'],
        seoKeywords: ['corrosion inhibitor Oman', 'pipeline protection Muscat', 'corrosion prevention Oman', 'anti-corrosion chemical Sohar', 'corrosion control oilfield Oman'],
        longDescription: 'Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides advanced corrosion protection chemicals for oilfield pipelines, equipment, and production systems in Muscat, Sohar, Duqm, Salalah. Our corrosion inhibitors form protective films on metal surfaces, preventing corrosive attack from H2S, CO2, oxygen, and organic acids. Essential for protecting production tubing, flowlines, gathering systems, and processing equipment from sweet and sour corrosion. Available in various formulations including filming amines, phosphate esters, and imidazoline-based inhibitors for different operating conditions. The inhibitors provide cost-effective asset protection, reduce maintenance costs, and extend equipment life. Widely used in oil & gas production, water injection systems, and gathering pipelines across Oman for continuous corrosion control.',
        applications: [
          'Production tubing and casing protection',
          'Flowline and gathering system corrosion control',
          'Sweet and sour corrosion prevention',
          'Water injection system treatment',
          'Gas transmission pipeline protection',
          'Processing equipment corrosion prevention',
          'Downhole corrosion inhibition',
          'Storage tank internal coating'
        ],
        technicalSpecs: [
          'Types: Filming amine, phosphate ester, imidazoline',
          'Typical dosage: 10-100 ppm continuous injection',
          'Effective in sweet (CO2) and sour (H2S) environments',
          'Temperature range: -20°C to 150°C',
          'Compatible with most production chemicals',
          'Available concentrated or pre-diluted',
          'Packaging: 20L, 200L drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'dea',
      title: 'DEA (Diethanolamine)',
      description: 'Gas sweetening agent for acid gas removal.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C4H11NO2',
        casNumber: '111-42-2',
        alternativeNames: ['Diethanolamine', 'DEA', '2,2-Iminodiethanol', 'Bis(2-hydroxyethyl)amine', 'Diethylolamine'],
        seoKeywords: ['DEA Oman', 'diethanolamine Muscat', 'gas sweetening Oman', 'acid gas removal Oman', 'DEA gas treatment Sohar', 'amine gas treating Oman'],
        longDescription: 'Diethanolamine (DEA) supplier in Oman - Global Chemicals LLC provides high-purity DEA for gas treating and acid gas removal in Muscat, Sohar, Duqm, Salalah. Our diethanolamine is a secondary amine that effectively removes H2S and CO2 from natural gas, refinery gases, and synthesis gas streams. DEA offers balanced performance between MEA and MDEA with moderate selectivity for H2S over CO2. Essential for gas processing plants, refineries, and petrochemical facilities requiring reliable acid gas removal. DEA provides lower corrosion rates than MEA while offering better CO2 absorption than MDEA. The compound is regenerable with moderate heat requirements. Widely used across Oman\'s oil & gas industry for meeting gas specifications and protecting equipment from acid gas corrosion.',
        applications: [
          'Natural gas H2S and CO2 removal',
          'Refinery sour gas treatment',
          'Synthesis gas purification',
          'LPG and NGL sweetening',
          'Ammonia plant CO2 capture',
          'Mixed amine systems',
          'Tail gas treating',
          'Gas dehydration applications'
        ],
        technicalSpecs: [
          'Purity: 99% minimum',
          'Appearance: Clear colorless to pale yellow viscous liquid',
          'Molecular weight: 105.14 g/mol',
          'Boiling point: 268°C',
          'Specific gravity: 1.097 at 20°C',
          'Typical solution strength: 25-30% DEA',
          'Moderate heat of regeneration',
          'Available in drums, IBCs, ISO tanks, bulk'
        ]
      },
    },
    {
      id: 'deg',
      title: 'DEG (Diethylene Glycol)',
      description: 'Dehydration agent and inhibitor for gas processing.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C4H10O3',
        casNumber: '111-46-6',
        alternativeNames: ['Diethylene glycol', 'DEG', '2,2-Oxydiethanol', 'Diglycol'],
        seoKeywords: ['DEG Oman', 'diethylene glycol Muscat', 'dehydration agent Oman', 'gas dehydration Oman', 'DEG oilfield Sohar', 'diglycol Oman'],
        longDescription: 'Diethylene Glycol (DEG) supplier in Oman - Global Chemicals LLC provides high-purity DEG for gas dehydration, hydrate inhibition, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our diethylene glycol serves as a desiccant in natural gas dehydration systems and as a thermodynamic hydrate inhibitor. DEG offers lower volatility than MEG, reducing losses in high-temperature applications. The compound is also used as a solvent, antifreeze, and chemical intermediate. Essential for gas processing facilities, dehydration units, and industrial operations requiring moisture control. DEG provides cost-effective performance in glycol dehydration systems across Oman\'s oil & gas industry with regeneration capabilities.',
        applications: [
          'Natural gas dehydration systems',
          'Hydrate inhibition in gas pipelines',
          'Triethylene glycol (TEG) production',
          'Solvent for industrial applications',
          'Antifreeze and coolant formulations',
          'Chemical intermediate production',
          'Humectant and moisture control',
          'Heat transfer fluid applications'
        ],
        technicalSpecs: [
          'Purity: 99% minimum',
          'Appearance: Clear colorless liquid',
          'Boiling point: 245°C',
          'Freezing point: -10°C',
          'Specific gravity: 1.118 at 20°C',
          'Lower volatility than MEG',
          'Regenerable in glycol units',
          'Available in drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'degreaser-hd',
      title: 'Degreaser HD',
      description: 'Heavy-duty industrial degreaser for equipment cleaning.',
      category: 'oilfield',
      icon: Factory,
      details: {
        alternativeNames: ['Heavy duty degreaser', 'Industrial degreaser', 'HD degreaser', 'Heavy-duty cleaner', 'Industrial strength degreaser'],
        seoKeywords: ['degreaser Oman', 'heavy duty degreaser Muscat', 'industrial degreaser Oman', 'HD degreaser Sohar', 'oilfield degreaser Oman'],
        longDescription: 'Heavy-Duty Degreaser supplier in Oman - Global Chemicals LLC provides industrial-strength degreasers for oilfield equipment, machinery, and facility cleaning in Muscat, Sohar, Duqm, Salalah. Our HD degreaser formulations effectively remove heavy oil, grease, carbon deposits, and stubborn contaminants from drilling rigs, wellheads, pipelines, and production equipment. The concentrated formula provides superior cleaning power with quick penetration and emulsification of oils and greases. Essential for maintenance operations, equipment overhauls, and facility housekeeping in oil & gas operations. Available in solvent-based and water-based formulations to meet specific application requirements. The heavy-duty cleaning action reduces downtime and extends equipment life. Widely used across Oman\'s oil & gas, marine, and industrial sectors.',
        applications: [
          'Drilling rig and equipment cleaning',
          'Wellhead and production equipment degreasing',
          'Pipeline and valve cleaning',
          'Engine and machinery degreasing',
          'Warehouse and facility floor cleaning',
          'Parts washing before maintenance',
          'Marine equipment cleaning',
          'Industrial facility housekeeping'
        ],
        technicalSpecs: [
          'Available types: Solvent-based, water-based',
          'Concentrated formula - dilutable',
          'pH: 12-14 (alkaline formulations)',
          'Rapid emulsification of oils and greases',
          'Low foam for pressure washing',
          'Biodegradable formulations available',
          'Typical dilution: 1:5 to 1:20',
          'Available in 5L, 20L, 200L drums'
        ]
      },
    },
    {
      id: 'descalant',
      title: 'Descalant',
      description: 'Chemical for removing mineral scale deposits.',
      category: 'oilfield',
      icon: Factory,
      details: {
        alternativeNames: ['Descaling agent', 'Scale remover', 'Mineral scale cleaner', 'Descaler', 'Scale dissolver'],
        seoKeywords: ['descalant Oman', 'scale remover Muscat', 'descaling agent Oman', 'mineral scale cleaner Sohar', 'descaler oilfield Oman'],
        longDescription: 'Industrial Descalant supplier in Oman - Global Chemicals LLC provides effective descaling chemicals for removing mineral scale from wellbores, pipelines, and equipment in Muscat, Sohar, Duqm, Salalah. Our descalants dissolve carbonate scales (calcium/magnesium carbonate), sulfate scales (barium/strontium/calcium sulfate), and iron deposits from production systems. The formulated blends contain acids, chelants, and surfactants for maximum scale removal efficiency. Essential for restoring flow capacity in scaled wells, cleaning heat exchangers, and removing deposits from production equipment. Descalants improve equipment efficiency, reduce energy consumption, and extend asset life. Available in various formulations for specific scale types and applications. Widely used across Oman\'s oil & gas, desalination, and industrial water treatment sectors.',
        applications: [
          'Wellbore scale removal and stimulation',
          'Pipeline and tubing descaling',
          'Heat exchanger cleaning',
          'Equipment and vessel descaling',
          'Desalination plant maintenance',
          'Cooling tower cleaning',
          'Boiler scale removal',
          'Production equipment restoration'
        ],
        technicalSpecs: [
          'Types: Acid-based, chelant-based, combination',
          'Effective on: Carbonate, sulfate, iron scales',
          'pH: Varies by formulation (acidic to neutral)',
          'Biodegradable formulations available',
          'Corrosion inhibited for equipment protection',
          'Typical treatment time: 2-24 hours',
          'Available concentrated or ready-to-use',
          'Packaging: 20L, 200L drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'edta-liquid',
      title: 'EDTA Liquid',
      description: 'Chelating agent for scale removal and metal control.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C10H16N2O8',
        casNumber: '60-00-4',
        alternativeNames: ['EDTA solution', 'Ethylenediaminetetraacetic acid liquid', 'EDTA tetrasodium salt', 'Chelating agent liquid'],
        seoKeywords: ['EDTA liquid Oman', 'chelating agent Muscat', 'scale remover Oman', 'EDTA solution Sohar', 'metal chelator Oman'],
        longDescription: 'EDTA Liquid supplier in Oman - Global Chemicals LLC provides liquid ethylenediaminetetraacetic acid for scale removal, metal chelation, and oilfield applications in Muscat, Sohar, Duqm, Salalah. Our EDTA liquid solution effectively chelates calcium, magnesium, iron, and heavy metals, making it ideal for scale dissolution and metal ion control. Essential for removing calcium carbonate scale, iron deposits, and preventing scale formation in production systems. The liquid format provides convenient handling and precise dosing for field operations. EDTA offers environmentally-friendly scale removal without the corrosive effects of strong mineral acids. Widely used in well stimulation, pipeline cleaning, and water treatment across Oman\'s oil & gas industry. The chelating action also prevents metal-catalyzed degradation of polymers and chemicals.',
        applications: [
          'Carbonate scale removal from wellbores',
          'Iron deposit chelation and removal',
          'Heavy metal control in water systems',
          'Pipeline and equipment descaling',
          'Polymer stability enhancement',
          'Water treatment metal sequestration',
          'Well stimulation fluid additive',
          'Environmentally-friendly acidizing'
        ],
        technicalSpecs: [
          'Form: Tetrasodium EDTA solution (typical)',
          'Concentration: 38-40% typical',
          'Appearance: Clear to pale yellow liquid',
          'pH: 11-12 (tetrasodium salt)',
          'Strong chelating properties',
          'Environmentally biodegradable',
          'Less corrosive than mineral acids',
          'Available in drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'edta-powder',
      title: 'EDTA Powder',
      description: 'Powder chelating agent for industrial applications.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C10H16N2O8',
        casNumber: '60-00-4',
        alternativeNames: ['EDTA powder', 'Ethylenediaminetetraacetic acid', 'EDTA disodium salt', 'Chelating powder'],
        seoKeywords: ['EDTA powder Oman', 'chelating agent powder Muscat', 'EDTA Oman', 'EDTA disodium Sohar', 'metal chelator Oman'],
        longDescription: 'EDTA Powder supplier in Oman - Global Chemicals LLC provides ethylenediaminetetraacetic acid powder for oilfield, water treatment, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our EDTA powder offers economical storage, long shelf life, and flexible field preparation for chelating and descaling operations. The powder form provides easy measurement and mixing for batch operations. Essential for creating acidizing solutions, scale removal treatments, and metal control formulations on-site. EDTA powder effectively chelates calcium, magnesium, iron, and heavy metals without the corrosive effects of mineral acids. The powder dissolves readily to prepare treating solutions at desired concentrations. Widely used by oilfield service companies and water treatment operations across Oman for scale control and metal sequestration.',
        applications: [
          'Field-prepared scale removal solutions',
          'Metal ion sequestration in water systems',
          'Analytical laboratory applications',
          'Acidizing fluid preparation',
          'Cleaning chemical formulations',
          'Water softening treatments',
          'Boiler scale prevention',
          'Textile and dyeing operations'
        ],
        technicalSpecs: [
          'Available forms: Disodium, tetrasodium salts',
          'Purity: 99% minimum',
          'Appearance: White crystalline powder',
          'Solubility: Variable by salt form',
          'Strong chelating capacity',
          'pH (1% solution): 4-5 (disodium), 11-12 (tetrasodium)',
          'Long shelf life when stored dry',
          'Packaging: 25kg bags, drums, bulk'
        ]
      },
    },
    {
      id: 'formic-acid',
      title: 'Formic Acid',
      description: 'Organic acid for drilling fluids and acidizing.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'HCOOH',
        casNumber: '64-18-6',
        alternativeNames: ['Methanoic acid', 'Formic acid 85%', 'Formic acid 94%', 'HCOOH solution'],
        seoKeywords: ['formic acid Oman', 'methanoic acid Muscat', 'acidizing agent Oman', 'formic acid oilfield Sohar', 'well stimulation Oman', 'HCOOH Oman'],
        longDescription: 'Formic Acid supplier in Oman - Global Chemicals LLC provides high-purity formic acid for oilfield acidizing, drilling fluids, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our formic acid (HCOOH) is widely used in well stimulation treatments, particularly for carbonate reservoirs and sandstone formations. Formic acid provides effective scale removal with less corrosion than hydrochloric acid. The compound is also used in formate-based drilling and completion fluids for high-density, low-corrosion applications. Essential for matrix acidizing, scale dissolution, and high-performance brine systems. Formic acid offers environmental advantages with better biodegradability. Widely used across Oman\'s oil & gas industry for production enhancement and well servicing.',
        applications: [
          'Matrix acidizing of carbonate formations',
          'Sandstone acidizing treatments',
          'Scale removal from wellbores and equipment',
          'Formate brine formulations (potassium/cesium formate)',
          'Drilling fluid pH control',
          'Completion fluid weighting agent',
          'Less corrosive alternative to HCl',
          'Environmentally-friendly acidizing'
        ],
        technicalSpecs: [
          'Available concentrations: 85%, 94%',
          'Appearance: Clear colorless liquid',
          'pH: <2 (concentrated solution)',
          'Specific gravity: 1.22 at 20°C (94%)',
          'Typical dosage: 3-15% in acidizing',
          'Lower corrosion rate than HCl',
          'Biodegradable organic acid',
          'Available in drums, IBCs, ISO tanks'
        ]
      },
    },
    {
      id: 'hydrazine-hydrate',
      title: 'Hydrazine Hydrate',
      description: 'Oxygen scavenger for boiler water treatment.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'N2H4·H2O',
        casNumber: '7803-57-8',
        alternativeNames: ['Hydrazine monohydrate', 'Hydrazine solution', 'Hydrazine hydrate 80%', 'Oxygen scavenger'],
        seoKeywords: ['hydrazine hydrate Oman', 'oxygen scavenger Muscat', 'hydrazine Oman', 'boiler treatment Sohar', 'corrosion control Oman', 'oxygen remover Oman'],
        longDescription: 'Hydrazine Hydrate supplier in Oman - Global Chemicals LLC provides high-purity hydrazine hydrate for oxygen scavenging and corrosion control in Muscat, Sohar, Duqm. Our hydrazine hydrate (N2H4·H2O) is the most effective chemical oxygen scavenger for boiler water, steam systems, and high-pressure applications. Hydrazine reacts rapidly with dissolved oxygen, forming nitrogen and water with no solid byproducts. Essential for preventing corrosion in boilers, steam generators, and closed-loop systems. The compound also serves as a reducing agent and chemical intermediate. Widely used in power plants, refineries, and industrial facilities across Oman requiring ultra-low oxygen levels. Available in 35%, 55%, and 80% concentrations.',
        applications: [
          'Boiler water oxygen scavenging',
          'High-pressure steam system treatment',
          'Closed-loop cooling water protection',
          'Condensate system corrosion control',
          'Heat recovery steam generator (HRSG) treatment',
          'Reducing agent in chemical processes',
          'Pharmaceutical intermediate production',
          'Rocket fuel component'
        ],
        technicalSpecs: [
          'Available concentrations: 35%, 55%, 80%',
          'Appearance: Clear colorless liquid',
          'Boiling point: 118°C (monohydrate)',
          'Specific gravity: 1.03 at 20°C',
          'Dosage: 1-2 ppm per 1 ppm oxygen',
          'Complete reaction to N2 and H2O',
          'No solid residue formation',
          'Available in drums, IBCs with safety packaging'
        ]
      },
    },
    {
      id: 'magnesium-oxide',
      title: 'Magnesium Oxide',
      description: 'Refractory material and chemical intermediate.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'MgO',
        casNumber: '1309-48-4',
        alternativeNames: ['Magnesia', 'Calcined magnesite', 'MgO', 'Magnesium oxide powder', 'Periclase'],
        seoKeywords: ['magnesium oxide Oman', 'magnesia Muscat', 'MgO Oman', 'refractory material Sohar', 'magnesium oxide oilfield Oman'],
        longDescription: 'Magnesium Oxide supplier in Oman - Global Chemicals LLC provides high-quality magnesia for drilling fluids, cementing, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our magnesium oxide (MgO) serves as a cement additive for controlling thickening time, high-temperature stabilizer in drilling fluids, and alkalinity source. Essential for high-temperature well cementing operations where extended thickening time is required. MgO reacts slowly with water to provide sustained pH control and prevents premature setting of cement. Also used in refractory materials, chemical processing, and environmental applications. The product is available in various grades including light-burned and dead-burned magnesia. Widely used across Oman\'s oil & gas industry for cementing deep wells and high-temperature applications.',
        applications: [
          'Oil well cement thickening time extender',
          'High-temperature drilling fluid stabilizer',
          'pH buffer in drilling muds',
          'Refractory material production',
          'Chemical intermediate and catalyst',
          'Wastewater neutralization',
          'Magnesium compound manufacturing',
          'Animal feed supplement'
        ],
        technicalSpecs: [
          'Purity: 85-98% MgO (grade dependent)',
          'Appearance: White to off-white powder',
          'Available grades: Light-burned, dead-burned',
          'Reactivity: Variable by grade',
          'pH (slurry): 10-12',
          'Cement additive dosage: 0.5-3% BWOC',
          'High temperature stability',
          'Packaging: 25kg bags, bulk bags'
        ]
      },
    },
    {
      id: 'mdea',
      title: 'MDEA (Methyl Diethanolamine)',
      description: 'Selective gas treating solvent for acid gas removal.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C5H13NO2',
        casNumber: '105-59-9',
        alternativeNames: ['Methyldiethanolamine', 'MDEA', 'N-Methyldiethanolamine', 'MDEA solution', 'Methyl DEA'],
        seoKeywords: ['MDEA Oman', 'methyldiethanolamine Muscat', 'gas treating Oman', 'acid gas removal Oman', 'selective amine Sohar', 'MDEA sweetening Oman'],
        longDescription: 'Premium MDEA (Methyldiethanolamine) supplier in Oman - Global Chemicals LLC provides high-purity MDEA for selective gas treating in Muscat, Sohar, Duqm, Salalah. Our methyldiethanolamine offers superior selectivity for H2S over CO2, making it the preferred choice for selective acid gas removal. MDEA requires significantly less regeneration energy compared to MEA and DEA, reducing operating costs by 30-40%. The tertiary amine structure provides excellent thermal stability and resistance to degradation. Essential for modern gas processing plants, LNG facilities, and refineries requiring efficient acid gas removal. Widely used across Oman\'s oil & gas industry for meeting strict gas specifications.',
        applications: [
          'Highly selective H2S removal',
          'Bulk CO2 removal from natural gas',
          'LNG plant gas sweetening',
          'Syngas and hydrogen purification',
          'Tail gas treating in Claus units',
          'Selective gas treating in refineries',
          'CO2 capture for EOR applications',
          'Natural gas deacidification'
        ],
        technicalSpecs: [
          'Purity: 99.5% minimum',
          'Appearance: Clear colorless to pale yellow liquid',
          'Molecular weight: 119.16 g/mol',
          'Boiling point: 247°C',
          'Specific gravity: 1.042 at 20°C',
          'Typical solution strength: 40-50% MDEA',
          'Low heat of regeneration',
          'Available in drums, IBCs, ISO tanks, bulk'
        ]
      },
    },
    {
      id: 'mea',
      title: 'MEA (Monoethanolamine)',
      description: 'Amine for CO2 and H2S removal from gas streams.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C2H7NO',
        casNumber: '141-43-5',
        alternativeNames: ['Monoethanolamine', 'MEA', 'Ethanolamine', 'MEA solution', '2-Aminoethanol'],
        seoKeywords: ['MEA Oman', 'monoethanolamine Muscat', 'CO2 removal Oman', 'gas sweetening Oman', 'acid gas removal Sohar', 'MEA gas treatment Oman'],
        longDescription: 'Monoethanolamine (MEA) supplier in Oman - Global Chemicals LLC provides high-purity MEA for gas treating and acid gas removal in Muscat, Sohar, Duqm. Our monoethanolamine is the most widely used amine for CO2 and H2S removal from natural gas, refinery gases, and synthesis gas streams. MEA offers excellent absorption capacity and fast reaction kinetics for effective gas sweetening. Essential for meeting natural gas specifications, reducing emissions, and protecting downstream equipment from corrosion. Widely used in gas processing plants, LNG facilities, refineries, and petrochemical complexes across Oman. Available in 99%+ purity with technical support for system optimization.',
        applications: [
          'Natural gas sweetening and CO2 removal',
          'H2S removal from gas streams',
          'LNG plant gas treating',
          'Refinery sour gas treatment',
          'Synthesis gas purification',
          'Biogas upgrading',
          'Ammonia plant CO2 capture',
          'Flue gas CO2 absorption'
        ],
        technicalSpecs: [
          'Purity: 99% minimum',
          'Appearance: Clear colorless liquid',
          'Molecular weight: 61.08 g/mol',
          'Boiling point: 170°C',
          'Specific gravity: 1.018 at 20°C',
          'Typical solution strength: 15-20% MEA',
          'Available in drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'meg',
      title: 'MEG (Monoethylene Glycol)',
      description: 'Hydrate inhibitor and dehydration agent.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'C2H6O2',
        casNumber: '107-21-1',
        alternativeNames: ['Monoethylene glycol', 'Ethylene glycol', 'MEG', 'Mono ethylene glycol', 'EG'],
        seoKeywords: ['MEG Oman', 'monoethylene glycol Muscat', 'hydrate inhibitor Oman', 'gas dehydration Oman', 'ethylene glycol Sohar', 'MEG oilfield Oman'],
        longDescription: 'Monoethylene Glycol (MEG) supplier in Oman - Global Chemicals LLC provides high-purity MEG for gas dehydration, hydrate inhibition, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our MEG is the industry-standard thermodynamic hydrate inhibitor used to prevent gas hydrate formation in pipelines, wellheads, and processing equipment. The regenerable glycol system allows for cost-effective long-term hydrate control. MEG also serves as a desiccant for natural gas dehydration, antifreeze, and heat transfer fluid. Essential for offshore platforms, subsea pipelines, gas processing facilities, and cold climate operations across Oman. Available in technical and high-purity grades with complete regeneration support.',
        applications: [
          'Gas hydrate inhibition in pipelines',
          'Subsea pipeline hydrate control',
          'Natural gas dehydration systems',
          'Wellhead hydrate prevention',
          'Antifreeze and coolant formulations',
          'Heat transfer fluid applications',
          'De-icing fluids',
          'Polyester and plastic production'
        ],
        technicalSpecs: [
          'Purity: 99% minimum (technical grade)',
          'Appearance: Clear colorless liquid',
          'Freezing point: -13°C',
          'Boiling point: 197°C',
          'Specific gravity: 1.113 at 20°C',
          'Typical injection rate: 0.5-2 gal/MMSCF',
          'Regenerable in glycol regeneration units',
          'Available in drums, IBCs, ISO tanks, bulk'
        ]
      },
    },
    {
      id: 'methanol-tech',
      title: 'Methanol Tech Grade',
      description: 'Hydrate inhibitor and antifreeze for gas systems.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'CH3OH',
        casNumber: '67-56-1',
        alternativeNames: ['Methyl alcohol', 'Wood alcohol', 'Methanol', 'Technical methanol', 'MeOH'],
        seoKeywords: ['methanol Oman', 'methyl alcohol Muscat', 'hydrate inhibitor Oman', 'methanol oilfield Sohar', 'technical methanol Oman', 'MeOH Oman'],
        longDescription: 'Technical Grade Methanol supplier in Oman - Global Chemicals LLC provides high-quality methanol for hydrate inhibition, gas dehydration, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our technical methanol (CH3OH) is widely used as a thermodynamic hydrate inhibitor in gas pipelines, wellheads, and offshore platforms. Methanol provides rapid hydrate inhibition and is particularly effective in emergency situations and short-term applications. The compound also serves as a solvent, antifreeze, and fuel additive. Essential for winter operations, cold climate facilities, and emergency hydrate prevention across Oman\'s oil & gas industry. Available in technical grade (99%+) with bulk supply capabilities.',
        applications: [
          'Gas hydrate inhibition in pipelines',
          'Emergency hydrate prevention',
          'Gas dehydration applications',
          'Wellhead antifreeze injection',
          'Solvent for industrial cleaning',
          'Fuel additive and blending',
          'Chemical synthesis intermediate',
          'Denaturant for ethanol'
        ],
        technicalSpecs: [
          'Purity: 99% minimum (technical grade)',
          'Appearance: Clear colorless liquid',
          'Boiling point: 64.7°C',
          'Freezing point: -97.6°C',
          'Specific gravity: 0.792 at 20°C',
          'Typical injection rate: 1-3 gal/MMSCF',
          'Non-regenerable (single-use inhibitor)',
          'Available in drums, IBCs, ISO tanks, bulk'
        ]
      },
    },
    {
      id: 'potassium-carbonate',
      title: 'Potassium Carbonate',
      description: 'Alkaline salt for gas treating and chemical processes.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'K2CO3',
        casNumber: '584-08-7',
        alternativeNames: ['Potash carbonate', 'Pearl ash', 'K2CO3', 'Potassium carbonate anhydrous', 'Salt of tartar'],
        seoKeywords: ['potassium carbonate Oman', 'potash carbonate Muscat', 'K2CO3 Oman', 'pearl ash Sohar', 'potassium carbonate gas treating Oman'],
        longDescription: 'Potassium Carbonate supplier in Oman - Global Chemicals LLC provides high-purity potassium carbonate for gas treating, chemical processing, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our K2CO3 is used in hot potassium carbonate (hot pot) processes for CO2 removal from natural gas and synthesis gas streams. Essential for high-pressure CO2 removal systems in ammonia plants, hydrogen production, and gas processing facilities. Potassium carbonate offers selective CO2 absorption with lower energy requirements compared to amine systems at high CO2 partial pressures. The compound also serves in specialty glass manufacturing, soap production, and as a chemical intermediate. Widely used across Oman\'s petrochemical and chemical processing industries.',
        applications: [
          'Hot potassium carbonate CO2 removal process',
          'Synthesis gas CO2 scrubbing',
          'Ammonia plant CO2 capture',
          'Specialty glass manufacturing',
          'Chemical synthesis intermediate',
          'Soap and detergent production',
          'Food additive (acidity regulator)',
          'pH control in industrial processes'
        ],
        technicalSpecs: [
          'Purity: 99% minimum K2CO3',
          'Appearance: White granular powder',
          'Hygroscopic - absorbs moisture',
          'pH (1% solution): 11-12',
          'Solubility: 112g/100ml water at 25°C',
          'Hot pot solution: 20-40% K2CO3',
          'Lower regeneration energy vs amines',
          'Packaging: 25kg bags, bulk bags'
        ]
      },
    },
    {
      id: 'potassium-chloride',
      title: 'Potassium Chloride',
      description: 'Shale inhibitor for water-based drilling fluids.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'KCl',
        casNumber: '7447-40-7',
        alternativeNames: ['Potassium chloride', 'KCl', 'Muriate of potash', 'Drilling grade KCl'],
        seoKeywords: ['potassium chloride Oman', 'KCl drilling Muscat', 'shale inhibitor Oman', 'KCl oilfield Sohar', 'clay stabilizer Oman', 'KCl drilling mud Oman'],
        longDescription: 'Potassium Chloride (KCl) supplier in Oman - Global Chemicals LLC provides drilling-grade potassium chloride for water-based drilling fluids in Muscat, Sohar, Duqm, Salalah. Our KCl is the most widely used shale stabilizer and clay inhibitor in drilling operations. Potassium ions exchange with sodium and calcium in clays, preventing swelling and maintaining wellbore stability. KCl inhibits reactive shales, reduces torque and drag, and improves rate of penetration. Essential for drilling through troublesome shale formations, highly reactive clays, and water-sensitive zones. The compound is cost-effective, readily available, and compatible with all water-based drilling fluid systems. Widely used by drilling contractors across Oman for maintaining wellbore integrity.',
        applications: [
          'Shale inhibition in water-based drilling muds',
          'Clay swelling prevention',
          'Wellbore stability in reactive formations',
          'Torque and drag reduction',
          'Rate of penetration improvement',
          'Inhibitive drilling fluid formulations',
          'Horizontal and directional drilling',
          'Workover and completion fluids'
        ],
        technicalSpecs: [
          'Purity: 99% minimum (drilling grade)',
          'Typical concentration: 3-10% in drilling fluids',
          'Appearance: White crystalline powder',
          'Solubility: 34g/100ml water at 20°C',
          'Compatible with all water-based systems',
          'Cost-effective shale inhibitor',
          'Packaging: 25kg, 50kg bags, bulk'
        ]
      },
    },
    {
      id: 'potassium-hydroxide',
      title: 'Potassium Hydroxide',
      description: 'Strong base for pH control and chemical synthesis.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'KOH',
        casNumber: '1310-58-3',
        alternativeNames: ['Caustic potash', 'KOH', 'Potassium hydrate', 'Potassium hydroxide solution', 'Lye potassium'],
        seoKeywords: ['potassium hydroxide Oman', 'caustic potash Muscat', 'KOH Oman', 'potassium hydroxide industrial Sohar', 'caustic potash oilfield Oman'],
        longDescription: 'Potassium Hydroxide (Caustic Potash) supplier in Oman - Global Chemicals LLC provides KOH in liquid and flake forms for oilfield, chemical, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our potassium hydroxide serves as a strong alkali for pH control, chemical synthesis, and neutralization operations. Essential for manufacturing potassium compounds, producing biodiesel, and alkaline cleaning formulations. KOH offers higher solubility than sodium hydroxide and is preferred for applications requiring potassium salts. Used in drilling fluids for pH adjustment, battery electrolyte production, and specialty chemical manufacturing. The strong base effectively neutralizes acids and removes acidic contaminants. Widely used across Oman\'s chemical processing, petroleum, and manufacturing sectors.',
        applications: [
          'pH control in drilling and production fluids',
          'Potassium salt manufacturing',
          'Biodiesel production catalyst',
          'Alkaline battery electrolyte',
          'Chemical synthesis and processing',
          'Specialty cleaner formulations',
          'Food processing (pH adjustment)',
          'Pharmaceutical manufacturing'
        ],
        technicalSpecs: [
          'Available forms: Flakes (90%), liquid (45-50%)',
          'Purity: 90% minimum (flakes)',
          'Appearance: White flakes or clear liquid',
          'pH (1% solution): 13-14',
          'Highly hygroscopic - absorbs moisture',
          'Corrosive - handle with care',
          'Higher solubility than NaOH',
          'Available in drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'potassium-iodide',
      title: 'Potassium Iodide',
      description: 'Chemical intermediate and analytical reagent.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'KI',
        casNumber: '7681-11-0',
        alternativeNames: ['Potassium iodide', 'KI', 'Potassium iodide reagent', 'KI crystals'],
        seoKeywords: ['potassium iodide Oman', 'KI Muscat', 'reagent Oman', 'potassium iodide oilfield Sohar', 'analytical reagent Oman'],
        longDescription: 'Potassium Iodide supplier in Oman - Global Chemicals LLC provides high-purity potassium iodide for analytical, pharmaceutical, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our KI serves as an essential analytical reagent for iodometric titrations, redox reactions, and chemical analysis. Essential for laboratory testing, quality control, and oilfield fluid analysis. Potassium iodide is used to detect oxidizing agents, measure dissolved oxygen, and in various chemical synthesis operations. The compound also finds pharmaceutical applications as an expectorant and thyroid protectant. In oilfield operations, KI is used in analytical testing of biocides, oxidizers, and for detecting contamination. Widely used by laboratories, pharmaceutical companies, and quality control facilities across Oman.',
        applications: [
          'Analytical chemistry and iodometric titrations',
          'Oilfield fluid analysis and testing',
          'Oxidizer detection and measurement',
          'Pharmaceutical formulations',
          'Laboratory reagent applications',
          'Photography and imaging',
          'Chemical synthesis intermediate',
          'Nutritional supplements'
        ],
        technicalSpecs: [
          'Purity: 99% minimum (reagent grade)',
          'Appearance: White crystalline powder',
          'Molecular weight: 166.00 g/mol',
          'Solubility: 140g/100ml water at 25°C',
          'Light-sensitive - store in amber containers',
          'Analytical grade available',
          'USP/pharmaceutical grade available',
          'Packaging: 100g, 500g, 1kg bottles, 25kg drums'
        ]
      },
    },
    {
      id: 'silica-gel-blue',
      title: 'Silica Gel Blue',
      description: 'Indicating desiccant for moisture control.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '112926-00-8',
        alternativeNames: ['Blue silica gel', 'Indicating silica gel', 'Cobalt silica gel', 'Self-indicating silica gel'],
        seoKeywords: ['silica gel blue Oman', 'indicating desiccant Muscat', 'moisture control Oman', 'blue desiccant Sohar', 'silica gel oilfield Oman'],
        longDescription: 'Blue Silica Gel supplier in Oman - Global Chemicals LLC provides indicating silica gel for moisture control and gas dehydration in Muscat, Sohar, Duqm, Salalah. Our blue silica gel contains moisture indicators that change color from blue (dry) to pink (saturated), providing visual indication of moisture absorption status. The high-capacity desiccant protects sensitive equipment, instruments, and stored materials from moisture damage. Essential for instrument air systems, compressed air drying, natural gas dehydration, and equipment protection in humid environments. Silica gel is regenerable by heating, offering cost-effective long-term moisture control. Widely used in refineries, gas processing plants, and industrial facilities across Oman.',
        applications: [
          'Instrument air and compressed air drying',
          'Natural gas moisture removal',
          'Equipment and spare parts protection',
          'Electrical control panel moisture control',
          'Transformer breather applications',
          'Container and packaging desiccant',
          'Laboratory humidity control',
          'Hydrocarbon stream drying'
        ],
        technicalSpecs: [
          'Color indication: Blue (dry) to Pink (saturated)',
          'Moisture capacity: 35-40% by weight',
          'Bead sizes: 2-4mm, 3-5mm, 4-8mm',
          'Bulk density: 0.70-0.75 kg/L',
          'Regeneration temperature: 120-180°C',
          'Reusable after regeneration',
          'Packaging: 1kg, 5kg, 25kg bags, drums'
        ]
      },
    },
    {
      id: 'silica-gel-orange',
      title: 'Silica Gel Orange',
      description: 'Color-changing desiccant for humidity monitoring.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '112926-00-8',
        alternativeNames: ['Orange silica gel', 'Indicating silica gel', 'Orange indicating desiccant', 'Self-indicating silica gel'],
        seoKeywords: ['silica gel orange Oman', 'desiccant Muscat', 'humidity control Oman', 'indicating desiccant Sohar', 'orange silica gel oilfield Oman'],
        longDescription: 'Orange Silica Gel supplier in Oman - Global Chemicals LLC provides color-indicating silica gel for moisture control and humidity monitoring in Muscat, Sohar, Duqm, Salalah. Our orange silica gel changes color from orange (dry) to dark green/black (saturated), providing clear visual indication of moisture absorption status without cobalt chloride concerns. The environmentally-safer alternative to blue indicating silica gel offers the same high-capacity moisture adsorption. Essential for protecting sensitive equipment, instruments, and stored materials from moisture damage while providing easy moisture status monitoring. The gel is regenerable by heating, offering cost-effective long-term humidity control. Widely used in oil & gas facilities, electronics, pharmaceuticals, and industrial operations across Oman.',
        applications: [
          'Instrument air and compressed air systems',
          'Equipment and spare parts protection',
          'Electrical control panels and switchgear',
          'Pharmaceutical and chemical storage',
          'Electronics and precision instrument protection',
          'Container and packaging desiccant',
          'Laboratory humidity control',
          'Transformer breather applications'
        ],
        technicalSpecs: [
          'Color indication: Orange (dry) to Dark green/black (saturated)',
          'Moisture capacity: 35-40% by weight',
          'Bead sizes: 2-4mm, 3-5mm, 4-8mm',
          'Cobalt-free - environmentally safer',
          'Regeneration temperature: 120-180°C',
          'Reusable after regeneration',
          'EU compliant - safer alternative to blue gel',
          'Packaging: 1kg, 5kg, 25kg bags, drums'
        ]
      },
    },
    {
      id: 'silica-gel-white',
      title: 'Silica Gel White',
      description: 'Non-indicating desiccant for moisture absorption.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '112926-00-8',
        alternativeNames: ['White silica gel', 'Silica gel desiccant', 'Non-indicating silica gel', 'Standard silica gel'],
        seoKeywords: ['silica gel white Oman', 'desiccant white Muscat', 'moisture absorber Oman', 'silica gel industrial Sohar', 'standard silica gel Oman'],
        longDescription: 'White Silica Gel supplier in Oman - Global Chemicals LLC provides non-indicating silica gel for industrial moisture control and gas dehydration in Muscat, Sohar, Duqm, Salalah. Our white silica gel offers maximum moisture absorption capacity without color indicators, making it ideal for large-scale applications and bulk drying. The amorphous silica structure provides exceptional water vapor adsorption across a wide humidity range. Essential for compressed air systems, gas dehydration, packaging, and equipment protection. White silica gel is regenerable by heating (120-180°C), offering economical long-term moisture control. Widely used in refineries, petrochemical plants, gas processing facilities, and industrial operations across Oman for protecting processes and equipment from moisture damage.',
        applications: [
          'Industrial compressed air drying',
          'Natural gas and process gas dehydration',
          'Bulk packaging and container desiccant',
          'Equipment and machinery protection',
          'Transformer and switchgear moisture control',
          'Storage area humidity control',
          'Pharmaceutical and food packaging',
          'Chromatography and laboratory applications'
        ],
        technicalSpecs: [
          'Appearance: White translucent beads',
          'Moisture capacity: 40% by weight at 90% RH',
          'Bead sizes: 1-3mm, 2-5mm, 3-6mm, 4-8mm',
          'Surface area: 650-800 m²/g',
          'Bulk density: 0.68-0.72 kg/L',
          'Regeneration temperature: 120-180°C',
          'Reusable multiple times',
          'Packaging: 25kg bags, drums, bulk bags'
        ]
      },
    },
    {
      id: 'soda-ash-dense',
      title: 'Soda Ash Dense',
      description: 'Sodium carbonate for pH control and water treatment.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'Na2CO3',
        casNumber: '497-19-8',
        alternativeNames: ['Sodium carbonate dense', 'Soda ash heavy', 'Na2CO3', 'Sodium carbonate heavy', 'Dense soda ash'],
        seoKeywords: ['soda ash dense Oman', 'sodium carbonate Muscat', 'soda ash Oman', 'Na2CO3 oilfield Sohar', 'drilling fluid pH control Oman'],
        longDescription: 'Soda Ash Dense supplier in Oman - Global Chemicals LLC provides high-quality dense sodium carbonate for oilfield, water treatment, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our soda ash dense (Na2CO3) is widely used in drilling fluids for pH control, hardness precipitation, and alkalinity adjustment. The dense grade offers better handling, less dust, and improved dissolution compared to light soda ash. Essential for maintaining proper pH in water-based drilling muds, removing calcium and magnesium hardness, and neutralizing acid gases. Soda ash also serves in water treatment, glass manufacturing, and chemical processing. Widely used by drilling contractors, oilfield service companies, and industrial facilities across Oman.',
        applications: [
          'pH control in drilling fluids',
          'Calcium and magnesium precipitation',
          'Alkalinity adjustment in muds',
          'Water softening and treatment',
          'Acid gas neutralization',
          'Cement contamination treatment',
          'Chemical manufacturing intermediate',
          'Glass and detergent production'
        ],
        technicalSpecs: [
          'Purity: 99.2% minimum Na2CO3',
          'Appearance: White granular powder',
          'Bulk density: 1.0-1.2 kg/L (dense grade)',
          'pH (1% solution): 11.5-12.0',
          'Typical dosage: 0.5-2 lb/bbl in drilling fluids',
          'Low dust, easy handling',
          'Packaging: 25kg, 50kg bags, bulk bags'
        ]
      },
    },
    {
      id: 'soda-ash-light',
      title: 'Soda Ash Light',
      description: 'Light density sodium carbonate for various applications.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'Na2CO3',
        casNumber: '497-19-8',
        alternativeNames: ['Sodium carbonate light', 'Soda ash light', 'Light ash', 'Na2CO3 light grade'],
        seoKeywords: ['soda ash light Oman', 'sodium carbonate light Muscat', 'Na2CO3 Oman', 'soda ash drilling Sohar', 'light sodium carbonate Oman'],
        longDescription: 'Soda Ash Light supplier in Oman - Global Chemicals LLC provides light-grade sodium carbonate for detergent manufacturing, chemical processing, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our soda ash light (Na2CO3) features low bulk density and excellent dissolution properties, making it ideal for applications requiring rapid mixing and high surface area. The light grade provides superior performance in detergent formulations, glass manufacturing, and chemical synthesis. Essential for soap and detergent production, water treatment chemicals, and as a pH buffer in various industrial processes. The fine particle size ensures quick dissolution and even distribution. Widely used by chemical manufacturers, detergent producers, and industrial facilities across Oman.',
        applications: [
          'Detergent and soap manufacturing',
          'Chemical synthesis and processing',
          'Glass manufacturing',
          'Textile processing and dyeing',
          'Water treatment chemical production',
          'pH buffering in industrial processes',
          'Paper and pulp processing',
          'Sodium compound production'
        ],
        technicalSpecs: [
          'Purity: 99.2% minimum Na2CO3',
          'Appearance: White fine powder',
          'Bulk density: 0.5-0.6 kg/L (light grade)',
          'pH (1% solution): 11.5-12.0',
          'Particle size: Fine - rapid dissolution',
          'High surface area for fast mixing',
          'Packaging: 25kg, 50kg bags, bulk bags'
        ]
      },
    },
    {
      id: 'sodium-nitrate',
      title: 'Sodium Nitrate',
      description: 'Oxidizing agent for industrial processes.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'NaNO3',
        casNumber: '7631-99-4',
        alternativeNames: ['Chile saltpeter', 'Sodium nitrate', 'NaNO3', 'Nitrate of soda', 'Soda niter'],
        seoKeywords: ['sodium nitrate Oman', 'NaNO3 Muscat', 'oxidizing agent Oman', 'chile saltpeter Sohar', 'sodium nitrate industrial Oman'],
        longDescription: 'Sodium Nitrate supplier in Oman - Global Chemicals LLC provides industrial-grade sodium nitrate for oilfield, explosives, and chemical applications in Muscat, Sohar, Duqm, Salalah. Our sodium nitrate (NaNO3) serves as a powerful oxidizing agent in various industrial processes including drilling fluid additives, explosives manufacturing, and chemical synthesis. Essential for oil & gas operations as a corrosion inhibitor additive, cement accelerator, and nitrate source for specialty formulations. Sodium nitrate also finds use in glass manufacturing, heat transfer salts, and fertilizer production. The compound provides reliable oxidizing properties for industrial applications. Widely used across Oman\'s oil & gas, chemical, and manufacturing industries.',
        applications: [
          'Drilling fluid corrosion inhibitor component',
          'Explosives and pyrotechnics manufacturing',
          'Cement set accelerator',
          'Chemical synthesis oxidizing agent',
          'Glass manufacturing flux',
          'Heat transfer salt formulations',
          'Metal treatment processes',
          'Fertilizer production'
        ],
        technicalSpecs: [
          'Purity: 99% minimum',
          'Appearance: White crystalline powder',
          'Solubility: 91g/100ml water at 25°C',
          'Melting point: 308°C',
          'Strong oxidizer - handle with care',
          'Packaging: 25kg, 50kg bags, bulk'
        ]
      },
    },
    {
      id: 'sodium-nitrite',
      title: 'Sodium Nitrite',
      description: 'Corrosion inhibitor and oxidizing agent.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'NaNO2',
        casNumber: '7632-00-0',
        alternativeNames: ['Sodium nitrite', 'NaNO2', 'Nitrite of soda', 'Diazotizing salt'],
        seoKeywords: ['sodium nitrite Oman', 'corrosion inhibitor Muscat', 'NaNO2 Oman', 'sodium nitrite oilfield Sohar', 'corrosion prevention Oman'],
        longDescription: 'Sodium Nitrite supplier in Oman - Global Chemicals LLC provides high-quality sodium nitrite for corrosion inhibition, drilling fluids, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our sodium nitrite (NaNO2) is a highly effective corrosion inhibitor for closed-loop systems, completion fluids, and oilfield applications. The compound forms a protective passive film on metal surfaces, preventing oxygen corrosion in pipelines, well systems, and equipment. Essential for corrosion control in drilling fluids, completion brines, packer fluids, and workover operations. Sodium nitrite also serves in heat transfer systems, as a chemical intermediate, and in dye manufacturing. Widely used across Oman\'s oil & gas industry for protecting valuable assets from corrosion damage.',
        applications: [
          'Corrosion inhibitor in drilling and completion fluids',
          'Packer fluid corrosion protection',
          'Closed-loop system corrosion control',
          'Pipeline and equipment protection',
          'Workover fluid additive',
          'Heat transfer fluid inhibitor',
          'Chemical intermediate production',
          'Dye and pharmaceutical synthesis'
        ],
        technicalSpecs: [
          'Purity: 98% minimum',
          'Appearance: White to slightly yellow powder',
          'Solubility: 82g/100ml water at 25°C',
          'Typical dosage: 500-2000 ppm for corrosion inhibition',
          'Forms protective passive film on metals',
          'Effective in pH 7-10 range',
          'Packaging: 25kg bags, drums, bulk'
        ]
      },
    },
    {
      id: 'sodium-thiosulphate-liquid',
      title: 'Sodium Thiosulphate Liquid',
      description: 'Dechlorination agent and neutralizer.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'Na2S2O3',
        casNumber: '7772-98-7',
        alternativeNames: ['Sodium thiosulfate liquid', 'Hypo solution', 'Thiosulfate liquid', 'Na2S2O3 solution'],
        seoKeywords: ['sodium thiosulfate liquid Oman', 'dechlorination Muscat', 'neutralizer Oman', 'chlorine remover Sohar', 'hypo solution Oman'],
        longDescription: 'Sodium Thiosulfate Liquid supplier in Oman - Global Chemicals LLC provides liquid sodium thiosulfate for dechlorination, neutralization, and oilfield applications in Muscat, Sohar, Duqm, Salalah. Our sodium thiosulfate solution (Na2S2O3) effectively neutralizes chlorine, chlorine dioxide, and oxidizing biocides in water systems and industrial processes. Essential for treating produced water, neutralizing well treatment chemicals, and dechlorinating process streams. The liquid format allows precise dosing and rapid reaction for fast neutralization. Widely used in oilfield operations to remove residual oxidizers before re-injection, protect reservoirs from oxidizing damage, and in completion fluid treatments. Also serves in analytical chemistry and gold recovery operations across Oman.',
        applications: [
          'Chlorine and oxidizer neutralization in oilfields',
          'Produced water treatment before re-injection',
          'Well treatment chemical neutralization',
          'Biocide residual removal',
          'Analytical reagent in laboratories',
          'Gold and silver recovery processes',
          'Wastewater dechlorination',
          'Photographic fixing agent'
        ],
        technicalSpecs: [
          'Concentration: 25-50% Na2S2O3',
          'Appearance: Clear colorless to pale yellow liquid',
          'pH: 8-10',
          'Rapid reaction with chlorine and oxidizers',
          'Dosage: 2-3 parts per 1 part chlorine',
          'Complete neutralization in minutes',
          'Available in 25L, 60L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'sodium-thiosulphate-powder',
      title: 'Sodium Thiosulphate Powder',
      description: 'Powder form for neutralization and treatment.',
      category: 'oilfield',
      icon: Factory,
      details: {
        formula: 'Na2S2O3',
        casNumber: '7772-98-7',
        alternativeNames: ['Sodium thiosulfate powder', 'Hypo powder', 'Sodium thiosulfate pentahydrate', 'Na2S2O3·5H2O'],
        seoKeywords: ['sodium thiosulfate powder Oman', 'dechlorinator Muscat', 'Na2S2O3 Oman', 'hypo powder Sohar', 'chlorine neutralizer Oman'],
        longDescription: 'Sodium Thiosulfate Powder supplier in Oman - Global Chemicals LLC provides crystalline sodium thiosulfate for dechlorination, neutralization, and analytical applications in Muscat, Sohar, Duqm, Salalah. Our sodium thiosulfate pentahydrate powder (Na2S2O3·5H2O) offers convenient storage, precise measurement, and long shelf life for neutralizing chlorine and oxidizing biocides. Essential for oilfield operations requiring chlorine removal from produced water, well treatment chemical neutralization, and laboratory analysis. The powder form provides economical handling for large-scale applications and field operations. Dissolves rapidly in water to create neutralizing solutions on demand. Widely used by oilfield service companies, water treatment operations, and analytical laboratories across Oman.',
        applications: [
          'Field preparation of dechlorination solutions',
          'Chlorine neutralization in oilfield operations',
          'Produced water treatment',
          'Laboratory analytical reagent',
          'Gold leaching and recovery',
          'Iodometric titrations',
          'Photographic fixing',
          'Wastewater dechlorination'
        ],
        technicalSpecs: [
          'Form: Sodium thiosulfate pentahydrate (Na2S2O3·5H2O)',
          'Purity: 99% minimum',
          'Appearance: White crystalline powder',
          'Solubility: 70g/100ml water at 25°C',
          'Dissolves rapidly - ready to use',
          'Long shelf life when stored properly',
          'Packaging: 1kg, 5kg, 25kg bags'
        ]
      },
    },
    {
      id: 'solvent-naphtha',
      title: 'Solvent Naphtha',
      description: 'Petroleum solvent for industrial cleaning and processing.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '64742-89-8',
        alternativeNames: ['Petroleum naphtha', 'Solvent naphtha', 'VM&P naphtha', 'Light aromatic naphtha', 'Industrial naphtha'],
        seoKeywords: ['solvent naphtha Oman', 'petroleum naphtha Muscat', 'industrial solvent Oman', 'aromatic naphtha Sohar', 'naphtha oilfield Oman'],
        longDescription: 'Solvent Naphtha supplier in Oman - Global Chemicals LLC provides petroleum naphtha for industrial cleaning, degreasing, and oilfield applications in Muscat, Sohar, Duqm, Salalah. Our solvent naphtha is a refined petroleum distillate with excellent solvency for oils, greases, and organic contaminants. Essential for equipment cleaning, parts degreasing, paint thinning, and as a base for specialty formulations. Widely used in oilfield operations for wellhead cleaning, equipment maintenance, and as a solvent carrier for treating chemicals. The fast-evaporating characteristics ensure quick drying with minimal residue. Available in various grades to meet specific application requirements across Oman\'s industrial and petroleum sectors.',
        applications: [
          'Industrial equipment degreasing and cleaning',
          'Oilfield equipment maintenance',
          'Paint thinner and dilution',
          'Specialty formulation solvent carrier',
          'Parts washing and cleaning',
          'Adhesive and coating removal',
          'Printing ink manufacturing',
          'Chemical intermediate and extraction solvent'
        ],
        technicalSpecs: [
          'Flash point: 38-45°C (varies by grade)',
          'Appearance: Clear colorless to pale yellow liquid',
          'Aromatic content: 15-20% typical',
          'Evaporation rate: Fast',
          'Excellent solvency for oils and greases',
          'Available grades: Light, medium, heavy',
          'Packaging: 20L, 200L drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'surfactant-sodium-silicate',
      title: 'Surfactant, Sodium Silicate Alkaline and Neutral',
      description: 'Surface active agents and silicates for drilling applications.',
      category: 'oilfield',
      icon: Factory,
      details: {
        casNumber: '1344-09-8',
        alternativeNames: ['Sodium silicate', 'Water glass', 'Liquid glass', 'Soluble silicate', 'Alkaline sodium silicate'],
        seoKeywords: ['surfactant Oman', 'sodium silicate Muscat', 'drilling chemical Oman', 'water glass Sohar', 'silicate drilling Oman'],
        longDescription: 'Sodium Silicate & Surfactants supplier in Oman - Global Chemicals LLC provides sodium silicate solutions and specialty surfactants for drilling, cementing, and industrial applications in Muscat, Sohar, Duqm, Salalah. Our sodium silicate (water glass) serves as a cement accelerator, shale stabilizer, and lost circulation material in drilling operations. Available in alkaline and neutral grades to meet specific pH requirements. Surfactants enhance drilling fluid performance by reducing surface tension, improving wetting properties, and stabilizing foam systems. Essential for water-based drilling muds, cement slurries, and wellbore stabilization. The versatile chemicals also find use in soil stabilization, grouting, and industrial applications across Oman\'s oil & gas and construction sectors.',
        applications: [
          'Cement accelerator in oil well cementing',
          'Shale stabilization in drilling fluids',
          'Lost circulation material for severe losses',
          'Drilling fluid surfactant and wetting agent',
          'Soil grouting and stabilization',
          'Wellbore strengthening applications',
          'Foam drilling fluid stabilization',
          'Industrial cleaning formulations'
        ],
        technicalSpecs: [
          'Sodium silicate grades: Alkaline (pH 11-13), Neutral (pH 7-9)',
          'SiO2/Na2O ratio: 2.0-3.3 typical',
          'Appearance: Clear to cloudy liquid',
          'Surfactant types: Anionic, nonionic, cationic',
          'Compatible with most drilling fluid systems',
          'Available in drums, IBCs, bulk'
        ]
      },
    },

    // Construction
    {
      id: 'epoxy-coating',
      title: 'Epoxy Coating',
      description: 'High-performance protective coating for concrete surfaces and structural elements.',
      category: 'construction',
      icon: Building2,
      details: {
        alternativeNames: ['Epoxy resin coating', 'Concrete epoxy', 'Floor epoxy coating'],
        seoKeywords: ['epoxy coating Oman', 'concrete coating Muscat', 'floor coating Oman'],
      },
    },
    {
      id: 'paraffin-oil-construction',
      title: 'Paraffin Oil',
      description: 'Industrial grade paraffin oil for construction applications and formulations.',
      category: 'construction',
      icon: Building2,
      details: {
        casNumber: '8012-95-1',
        alternativeNames: ['Paraffin oil', 'Liquid paraffin', 'Mineral oil'],
        seoKeywords: ['paraffin oil Oman', 'liquid paraffin Muscat', 'mineral oil construction Oman'],
      },
    },
    {
      id: 'polymer-bonding-agent',
      title: 'Polymer Bonding Agent',
      description: 'Advanced bonding agent for enhanced adhesion between concrete layers.',
      category: 'construction',
      icon: Building2,
      details: {
        alternativeNames: ['Bonding agent', 'Concrete bonding agent', 'Polymer adhesive'],
        seoKeywords: ['bonding agent Oman', 'concrete bonding Muscat', 'polymer adhesive Oman'],
      },
    },
    {
      id: 'polymer-modified-mortar',
      title: 'Polymer Modified Mortar',
      description: 'High-strength mortar with polymer additives for superior bonding and flexibility.',
      category: 'construction',
      icon: Building2,
      details: {
        alternativeNames: ['Modified mortar', 'Polymer mortar', 'Flexible mortar'],
        seoKeywords: ['polymer mortar Oman', 'modified mortar Muscat', 'flexible mortar Oman'],
      },
    },
    {
      id: 'mould-releasing-agents',
      title: 'Mould Releasing Agents',
      description: 'Formwork release agents for easy concrete demolding and smooth finishes.',
      category: 'construction',
      icon: Building2,
      details: {
        alternativeNames: ['Release agent', 'Formwork release', 'Concrete release agent'],
        seoKeywords: ['mold release agent Oman', 'formwork release Muscat', 'concrete release Oman'],
      },
    },

    // Food & Beverage
    {
      id: 'ascorbic-acid',
      title: 'Ascorbic Acid',
      description: 'Vitamin C antioxidant and preservative for food and beverage applications.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'C6H8O6',
        casNumber: '50-81-7',
        alternativeNames: ['Vitamin C', 'L-Ascorbic acid', 'Ascorbate'],
        seoKeywords: ['ascorbic acid Oman', 'vitamin C Muscat', 'food preservative Oman'],
      },
    },
    {
      id: 'calcium-carbonate-food',
      title: 'Calcium Carbonate',
      description: 'Food-grade calcium supplement and pH regulator for food products.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'CaCO3',
        casNumber: '471-34-1',
        alternativeNames: ['Calcium carbonate food grade', 'Limestone powder', 'Chalk'],
        seoKeywords: ['calcium carbonate food grade Oman', 'food additive Muscat', 'CaCO3 Oman'],
      },
    },
    {
      id: 'calcium-lactate',
      title: 'Calcium Lactate',
      description: 'Calcium fortification agent and firming agent for food processing.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'C6H10CaO6',
        casNumber: '814-80-2',
        alternativeNames: ['Calcium lactate pentahydrate', 'Calcium dilactate'],
        seoKeywords: ['calcium lactate Oman', 'calcium fortification Muscat', 'food additive Oman'],
      },
    },
    {
      id: 'citric-acid-anhydrous-food',
      title: 'Citric Acid Anhydrous',
      description: 'Food-grade acidulant and preservative for flavoring and pH control.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'C6H8O7',
        casNumber: '77-92-9',
        alternativeNames: ['Citric acid anhydrous', 'Food grade citric acid'],
        seoKeywords: ['citric acid food grade Oman', 'acidulant Muscat', 'food preservative Oman'],
      },
    },
    {
      id: 'ethanol-70',
      title: 'Ethanol 70%',
      description: 'Food-grade ethanol for sanitization and extraction processes.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'C2H5OH',
        casNumber: '64-17-5',
        alternativeNames: ['Ethyl alcohol 70%', 'Ethanol 70%', 'Food grade alcohol'],
        seoKeywords: ['ethanol 70% Oman', 'food grade alcohol Muscat', 'ethyl alcohol Oman'],
      },
    },
    {
      id: 'formaldehyde-40',
      title: 'Formaldehyde 40%',
      description: 'Industrial preservative and disinfectant for food processing equipment.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'CH2O',
        casNumber: '50-00-0',
        alternativeNames: ['Formalin 40%', 'Methanal', 'Formaldehyde solution'],
        seoKeywords: ['formaldehyde 40% Oman', 'formalin Muscat', 'disinfectant Oman'],
      },
    },
    {
      id: 'hand-sanitizer',
      title: 'Hand Sanitizer',
      description: 'Alcohol-based hand sanitizer for food handling and hygiene compliance.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        alternativeNames: ['Hand sanitizer gel', 'Alcohol sanitizer', 'Hand disinfectant'],
        seoKeywords: ['hand sanitizer Oman', 'alcohol sanitizer Muscat', 'hand hygiene Oman'],
      },
    },
    {
      id: 'lime-stone',
      title: 'Lime Stone',
      description: 'Calcium source and pH adjuster for food and beverage processing.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'CaCO3',
        casNumber: '471-34-1',
        alternativeNames: ['Limestone', 'Calcium carbonate', 'Calcite'],
        seoKeywords: ['limestone Oman', 'calcium source Muscat', 'food grade limestone Oman'],
      },
    },
    {
      id: 'caustic-soda-liquid-food',
      title: 'Caustic Soda Liquid',
      description: 'Food-grade alkali for cleaning and pH adjustment in food processing.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Sodium hydroxide liquid', 'Food grade caustic', 'Lye'],
        seoKeywords: ['caustic soda food grade Oman', 'sodium hydroxide Muscat', 'food processing chemical Oman'],
      },
    },
    {
      id: 'nitric-acid-68',
      title: 'Nitric Acid 68%',
      description: 'Industrial acid for equipment cleaning and CIP systems in food facilities.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'HNO3',
        casNumber: '7697-37-2',
        alternativeNames: ['Nitric acid 68%', 'HNO3', 'Aqua fortis'],
        seoKeywords: ['nitric acid 68% Oman', 'CIP cleaning Muscat', 'HNO3 Oman'],
      },
    },
    {
      id: 'potassium-sorbate',
      title: 'Potassium Sorbate',
      description: 'Preservative for preventing mold and yeast growth in food and beverages.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'C6H7KO2',
        casNumber: '24634-61-5',
        alternativeNames: ['Potassium sorbate', 'E202', 'Sorbic acid potassium salt'],
        seoKeywords: ['potassium sorbate Oman', 'food preservative Muscat', 'E202 Oman'],
      },
    },
    {
      id: 'propylene-glycol-food',
      title: 'Propylene Glycol',
      description: 'Food-grade humectant and solvent for flavors and food processing.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'C3H8O2',
        casNumber: '57-55-6',
        alternativeNames: ['Propylene glycol USP', 'MPG food grade', '1,2-Propanediol'],
        seoKeywords: ['propylene glycol food grade Oman', 'MPG Muscat', 'food additive Oman'],
      },
    },
    {
      id: 'sodium-bicarbonate-food',
      title: 'Sodium Bicarbonate',
      description: 'Baking soda for leavening, pH control, and food processing applications.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'NaHCO3',
        casNumber: '144-55-8',
        alternativeNames: ['Baking soda', 'Sodium hydrogen carbonate', 'Bicarbonate of soda'],
        seoKeywords: ['sodium bicarbonate food grade Oman', 'baking soda Muscat', 'NaHCO3 Oman'],
      },
    },
    {
      id: 'sodium-hypochlorite-food',
      title: 'Sodium Hypochlorite',
      description: 'Sanitizing agent for food contact surfaces and equipment disinfection.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'NaOCl',
        casNumber: '7681-52-9',
        alternativeNames: ['Food grade bleach', 'Sodium hypochlorite solution', 'Chlorine solution'],
        seoKeywords: ['sodium hypochlorite food grade Oman', 'food sanitizer Muscat', 'disinfectant Oman'],
      },
    },
    {
      id: 'urea-food',
      title: 'Urea',
      description: 'Nitrogen source and processing aid for certain food applications.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'CH4N2O',
        casNumber: '57-13-6',
        alternativeNames: ['Carbamide', 'Urea food grade'],
        seoKeywords: ['urea food grade Oman', 'carbamide Muscat', 'food additive Oman'],
      },
    },
    {
      id: 'white-salt',
      title: 'White Salt',
      description: 'Food-grade sodium chloride for seasoning and preservation.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        formula: 'NaCl',
        casNumber: '7647-14-5',
        alternativeNames: ['Table salt', 'Sodium chloride', 'Refined salt'],
        seoKeywords: ['white salt Oman', 'food grade salt Muscat', 'sodium chloride food Oman'],
      },
    },
    {
      id: 'xanthan-gum',
      title: 'Xanthan Gum',
      description: 'Thickening and stabilizing agent for food and beverage formulations.',
      category: 'food-beverage',
      icon: Wine,
      details: {
        casNumber: '11138-66-2',
        alternativeNames: ['Xanthan gum', 'E415', 'Xanthomonas gum'],
        seoKeywords: ['xanthan gum Oman', 'food thickener Muscat', 'E415 Oman'],
      },
    },

    // Corrosion Inhibitor
    {
      id: 'corrosion-inhibitor-multi-metal',
      title: 'Corrosion Inhibitor For Multi Metal Cooling Water',
      description: 'Specialized corrosion protection for multi-metal cooling water systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Multi-metal inhibitor', 'Mixed metal inhibitor', 'Universal corrosion inhibitor', 'Multi-metal protection', 'Mixed metallurgy inhibitor'],
        seoKeywords: ['multi-metal corrosion inhibitor Oman', 'mixed metal protection Muscat', 'cooling water inhibitor Oman', 'universal inhibitor Sohar', 'multi-metal treatment Oman'],
        longDescription: 'Multi-Metal Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides specialized protection for cooling water systems with mixed metallurgy in Muscat, Sohar, Duqm, Salalah. Our multi-metal inhibitor is specifically formulated to protect systems containing carbon steel, stainless steel, copper alloys (brass, bronze), aluminum, and galvanized steel simultaneously. The balanced formulation prevents galvanic corrosion between dissimilar metals while protecting each metal type. Essential for modern cooling systems with heat exchangers, piping, and equipment made from various metals. The inhibitor forms compatible protective films on all metal surfaces, eliminating selective corrosion. Widely used in power plants, refineries, HVAC systems, and industrial facilities with mixed-metal cooling equipment across Oman. Reduces corrosion-related failures and extends equipment life.',
        applications: [
          'Mixed-metal cooling tower treatment',
          'Heat exchangers with multiple metals',
          'HVAC systems with various metallurgy',
          'Galvanic corrosion prevention',
          'Copper and steel system protection',
          'Aluminum cooling system treatment',
          'Industrial multi-metal equipment',
          'Commercial building cooling systems'
        ],
        technicalSpecs: [
          'Balanced multi-metal formulation',
          'Protects: Carbon steel, copper, aluminum, SS',
          'Dosage: 50-150 ppm',
          'pH range: 7.5-9.5',
          'Prevents galvanic corrosion',
          'Forms compatible films on all metals',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'corrosion-inhibitor-2000',
      title: 'Corrosion Inhibitor 2000',
      description: 'Advanced formula for comprehensive metal protection in industrial systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['CI 2000', 'Advanced corrosion inhibitor', 'Industrial inhibitor', 'High-performance inhibitor', 'Premium corrosion control'],
        seoKeywords: ['corrosion inhibitor 2000 Oman', 'CI 2000 Muscat', 'industrial protection Oman', 'advanced inhibitor Sohar', 'premium corrosion control Oman'],
        longDescription: 'Corrosion Inhibitor 2000 supplier in Oman - Global Chemicals LLC provides advanced corrosion protection formulations for demanding industrial applications in Muscat, Sohar, Duqm, Salalah. Our CI 2000 represents next-generation corrosion inhibitor technology, combining multiple inhibitor mechanisms for superior metal protection. The synergistic blend provides anodic, cathodic, and filming corrosion inhibition for comprehensive asset protection. Essential for harsh operating conditions, high-temperature applications, and systems requiring maximum corrosion control. The formulation offers improved performance in challenging water chemistries with high chlorides, sulfates, or dissolved solids. Reduces corrosion rates to minimal levels, extends equipment life, and minimizes maintenance costs. Compatible with scale inhibitors and biocides for complete water treatment programs. Widely used in industrial cooling, process water, and critical equipment protection across Oman.',
        applications: [
          'High-temperature cooling systems',
          'Harsh water chemistry applications',
          'Critical equipment corrosion protection',
          'Industrial process cooling water',
          'High-chloride water systems',
          'Demanding operating conditions',
          'Maximum corrosion control requirements',
          'Long equipment life programs'
        ],
        technicalSpecs: [
          'Advanced multi-mechanism inhibitor blend',
          'Dosage: 25-100 ppm',
          'Temperature range: Up to 70°C',
          'High-performance formulation',
          'Effective in aggressive water chemistry',
          'Corrosion rate reduction: >95%',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'corrosion-inhibitor-rust-preventive',
      title: 'Corrosion Inhibitor For Metal Rust Preventive',
      description: 'Rust prevention solution for metal surfaces and equipment.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Rust preventive', 'Rust inhibitor', 'Metal protection', 'Rust prevention coating', 'Corrosion preventive oil'],
        seoKeywords: ['rust preventive Oman', 'rust inhibitor Muscat', 'metal protection Oman', 'rust prevention Sohar', 'corrosion preventive Oman'],
        longDescription: 'Rust Preventive Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides protective coatings and rust prevention solutions for metal surfaces and equipment in Muscat, Sohar, Duqm, Salalah. Our rust preventive formulation forms a protective barrier on metal surfaces, preventing atmospheric corrosion, moisture attack, and oxidation. The hydrophobic film repels water and excludes oxygen, stopping the rust formation process. Essential for protecting stored equipment, spare parts, machinery during shutdown periods, and metal products during transportation or storage. Available in solvent-based and water-based formulations for different applications. Provides short-term (indoor storage) to long-term (outdoor) protection. The film is easily removable when equipment returns to service. Widely used in marine, industrial, oilfield, and manufacturing sectors across Oman for protecting valuable assets.',
        applications: [
          'Equipment storage rust prevention',
          'Spare parts protection during storage',
          'Machinery protection during shutdowns',
          'Metal product shipping protection',
          'Outdoor equipment rust prevention',
          'Pipeline and valve protection',
          'Marine equipment corrosion prevention',
          'Manufacturing inventory protection'
        ],
        technicalSpecs: [
          'Types: Solvent-based, water-based formulations',
          'Protection duration: 3-24 months depending on type',
          'Application: Spray, dip, or brush',
          'Forms hydrophobic protective film',
          'Easily removable with solvent or detergent',
          'Indoor and outdoor protection grades',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'corrosion-inhibitor-molybdate',
      title: 'Corrosion Inhibitor Closed Cooling System Molybdate',
      description: 'Molybdate-based corrosion protection for closed cooling systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        casNumber: '7631-95-0',
        alternativeNames: ['Molybdate inhibitor', 'Sodium molybdate based', 'Closed system inhibitor', 'Molybdate treatment', 'Molybdate corrosion control'],
        seoKeywords: ['molybdate inhibitor Oman', 'closed system protection Muscat', 'molybdate corrosion Oman', 'sodium molybdate inhibitor Sohar', 'closed cooling treatment Oman'],
        longDescription: 'Molybdate-Based Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides sodium molybdate corrosion inhibitors for closed cooling systems and chillers in Muscat, Sohar, Duqm, Salalah. Our molybdate formulation offers environmentally-friendly, non-toxic corrosion protection for closed-loop systems. Molybdate is an anodic inhibitor that forms protective films on metal surfaces, providing excellent corrosion control for steel, copper, and aluminum. Essential for closed chilled water systems, district cooling, HVAC applications, and process cooling circuits. The nitrite-free formulation eliminates health and environmental concerns associated with traditional nitrite-based inhibitors. Provides long-term protection with minimal maintenance requirements. Compatible with glycol-based systems. Widely used in hospitals, commercial buildings, food facilities, and environmentally-conscious operations across Oman.',
        applications: [
          'Closed chilled water system protection',
          'District cooling corrosion control',
          'HVAC closed-loop treatment',
          'Food-grade system protection',
          'Hospital and healthcare cooling',
          'Environmentally-sensitive applications',
          'Nitrite-free corrosion protection',
          'Glycol system compatible treatment'
        ],
        technicalSpecs: [
          'Active: Sodium molybdate (Na2MoO4)',
          'Dosage: 300-1000 ppm',
          'pH range: 8.5-10.5',
          'Non-toxic, environmentally-friendly',
          'Anodic corrosion inhibitor',
          'Long-term protection (multi-year)',
          'Compatible with glycols',
          'Available in 25kg drums, IBCs'
        ]
      },
    },
    {
      id: 'corrosion-inhibitor-general',
      title: 'Corrosion Inhibitor',
      description: 'General-purpose corrosion prevention chemical for industrial applications.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['General inhibitor', 'Corrosion preventive', 'Metal protector', 'Universal inhibitor', 'All-purpose corrosion control'],
        seoKeywords: ['corrosion inhibitor Oman', 'corrosion prevention Muscat', 'metal protector Oman', 'general inhibitor Sohar', 'industrial corrosion control Oman'],
        longDescription: 'General Purpose Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides versatile corrosion protection chemicals for various industrial water systems in Muscat, Sohar, Duqm, Salalah. Our general corrosion inhibitor offers effective protection for carbon steel and common metals in cooling towers, boilers, and process water applications. The formulation provides reliable corrosion control through film-forming and passivation mechanisms. Essential for standard industrial water treatment programs requiring economical, dependable corrosion protection. The product maintains system integrity, prevents leaks, and extends equipment operational life. Compatible with scale inhibitors, dispersants, and biocides in comprehensive water treatment programs. Suitable for a wide range of water qualities and operating conditions. Widely used across manufacturing, process industries, and facility operations throughout Oman.',
        applications: [
          'General cooling water corrosion protection',
          'Industrial water system treatment',
          'Boiler corrosion prevention',
          'Process water corrosion control',
          'Carbon steel protection',
          'Standard water treatment programs',
          'Equipment life extension',
          'Cost-effective corrosion prevention'
        ],
        technicalSpecs: [
          'General purpose inhibitor formulation',
          'Dosage: 20-80 ppm',
          'Effective pH: 7.0-9.5',
          'Carbon steel primary protection',
          'Compatible with treatment chemicals',
          'Economical corrosion control',
          'Available in 25kg, 200kg drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'corrosion-inhibitor-gas-compressor',
      title: 'Corrosion Inhibitor For Gas Compressor',
      description: 'Specialized protection for gas compressor systems and components.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Compressor inhibitor', 'Gas system inhibitor', 'Compressor protection', 'Gas compressor treatment', 'Compressor corrosion control'],
        seoKeywords: ['gas compressor inhibitor Oman', 'compressor protection Muscat', 'gas system Oman', 'compressor corrosion Sohar', 'gas compressor treatment Oman'],
        longDescription: 'Gas Compressor Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides specialized corrosion protection for gas compressor systems, cooling water, and associated equipment in Muscat, Sohar, Duqm, Salalah. Our compressor inhibitor is formulated to protect compressor cooling jackets, intercoolers, aftercoolers, and associated piping from corrosion. The product prevents corrosive attack from condensed moisture, acid gases, and aggressive conditions in gas compression systems. Essential for natural gas compressors, air compressors, refrigeration compressors, and process gas compression equipment. The inhibitor maintains heat transfer efficiency, prevents leaks, and extends compressor operational life. Compatible with high-temperature operation and minimal impact on lubrication systems. Reduces maintenance costs and unplanned shutdowns. Widely used in gas processing plants, LNG facilities, refineries, and industrial compression operations across Oman.',
        applications: [
          'Gas compressor cooling water treatment',
          'Compressor jacket water protection',
          'Intercooler corrosion prevention',
          'Aftercooler protection',
          'Natural gas compressor treatment',
          'Air compressor systems',
          'Refrigeration compressor cooling',
          'Process gas compression equipment'
        ],
        technicalSpecs: [
          'Specialized compressor formulation',
          'Dosage: 100-300 ppm',
          'High-temperature stable',
          'pH range: 8.0-9.5',
          'Low foam - compatible with compressors',
          'Protects jackets, coolers, piping',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'sodium-molybdate',
      title: 'Sodium Molybdate',
      description: 'Anodic corrosion inhibitor for cooling water treatment systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        formula: 'Na2MoO4',
        casNumber: '7631-95-0',
        alternativeNames: ['Sodium molybdate dihydrate', 'Molybdate', 'Na2MoO4', 'Molybdenum corrosion inhibitor', 'Molybdate salt'],
        seoKeywords: ['sodium molybdate Oman', 'molybdate inhibitor Muscat', 'anodic inhibitor Oman', 'Na2MoO4 Sohar', 'molybdate corrosion control Oman'],
        longDescription: 'Sodium Molybdate supplier in Oman - Global Chemicals LLC provides anodic corrosion inhibitors for environmentally-friendly cooling water treatment in Muscat, Sohar, Duqm, Salalah. Our sodium molybdate (Na2MoO4) is a non-toxic, non-hazardous corrosion inhibitor that forms protective oxide films on metal surfaces. Essential for applications requiring safe, environmentally-acceptable corrosion control without chromates, nitrites, or phosphates. The molybdate inhibitor provides excellent protection for steel and copper in closed and open cooling systems. Particularly valuable in food processing, pharmaceutical, and potable water applications where toxicity is a concern. The compound offers anodic inhibition, requiring sufficient dosage to prevent pitting. Compatible with other treatment chemicals and provides long-term corrosion control. Widely used in environmentally-conscious facilities across Oman.',
        applications: [
          'Environmentally-friendly corrosion inhibition',
          'Food-grade cooling water treatment',
          'Pharmaceutical water system protection',
          'Potable water system corrosion control',
          'Chromate-free cooling water programs',
          'Closed-loop chiller treatment',
          'Non-toxic corrosion prevention',
          'Green chemistry water treatment'
        ],
        technicalSpecs: [
          'Purity: 99% sodium molybdate dihydrate',
          'Dosage: 100-500 ppm in closed systems',
          'Anodic corrosion inhibitor',
          'pH range: 8.0-10.0',
          'Non-toxic, non-hazardous',
          'Environmentally acceptable',
          'Appearance: White crystalline powder',
          'Available in 25kg bags, drums'
        ]
      },
    },
    {
      id: 'oxygen-scavenger',
      title: 'Oxygen Scavenger',
      description: 'Removes dissolved oxygen to prevent corrosion in water systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Oxygen remover', 'Oxygen scavenger', 'Deoxidizer', 'Oxygen scavenging chemical', 'DO remover'],
        seoKeywords: ['oxygen scavenger Oman', 'deoxidizer Muscat', 'oxygen remover Oman', 'oxygen scavenging Sohar', 'DO remover Oman'],
        longDescription: 'Oxygen Scavenger supplier in Oman - Global Chemicals LLC provides chemical oxygen removal solutions for boiler water, closed systems, and corrosion prevention in Muscat, Sohar, Duqm, Salalah. Our oxygen scavengers rapidly react with dissolved oxygen, eliminating it from water systems before it can cause corrosion. Available in catalyzed sodium sulfite, DEHA, and hydrazine-alternative formulations for different applications. Essential for boiler feedwater treatment, closed-loop systems, and any application where dissolved oxygen causes corrosion problems. Oxygen scavenging prevents pitting corrosion, extends equipment life, and protects boiler tubes and piping. The chemical reaction produces non-corrosive byproducts. Provides supplementary protection to mechanical deaeration. Widely used in power plants, industrial boilers, and process water systems across Oman.',
        applications: [
          'Boiler feedwater oxygen removal',
          'Closed cooling system oxygen scavenging',
          'Steam system corrosion prevention',
          'Condensate system protection',
          'High-pressure boiler treatment',
          'Supplementary to mechanical deaeration',
          'Pitting corrosion prevention',
          'Process water oxygen removal'
        ],
        technicalSpecs: [
          'Types: Catalyzed sulfite, DEHA, organic scavengers',
          'Dosage: 10 ppm per 1 ppm dissolved oxygen',
          'Reaction speed: Rapid (seconds to minutes)',
          'No corrosive residues',
          'Effective in boiler and closed systems',
          'Temperature range: Up to 250°C',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'ph-booster-corrosion-inhibitor',
      title: 'Ph Booster Cum Corrosion Inhibitor',
      description: 'Dual-action formula for pH control and corrosion prevention.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['pH booster inhibitor', 'Dual action inhibitor', 'pH control inhibitor', 'Alkalinity booster with inhibitor', 'Combined pH-corrosion control'],
        seoKeywords: ['pH booster Oman', 'dual action inhibitor Muscat', 'pH control Oman', 'alkalinity booster Sohar', 'pH corrosion control Oman'],
        longDescription: 'pH Booster Cum Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides dual-action chemicals for simultaneous pH control and corrosion protection in Muscat, Sohar, Duqm, Salalah. Our pH booster inhibitor combines alkalinity adjustment with corrosion inhibition in a single product. The formulation raises pH to optimal corrosion control range (8-9) while providing protective filming and passivation. Essential for systems with acidic makeup water or acid-generating processes requiring pH elevation. The dual-action approach simplifies chemical feed, reduces inventory, and ensures balanced treatment. Prevents low-pH corrosion while establishing protective conditions. Particularly useful for systems using softened water or condensate with low alkalinity. Widely used in industrial cooling, boiler makeup, and process water treatment across Oman where pH control and corrosion prevention are both needed.',
        applications: [
          'Low-alkalinity water pH adjustment',
          'Simultaneous pH control and corrosion protection',
          'Softened water treatment',
          'Condensate system pH boosting',
          'Acidic water neutralization',
          'Boiler feedwater conditioning',
          'Simplified dual-action treatment',
          'Industrial water pH and corrosion control'
        ],
        technicalSpecs: [
          'Dual function: pH boost + corrosion inhibition',
          'Dosage: 50-200 ppm',
          'Target pH: 8.0-9.5',
          'Raises alkalinity',
          'Forms corrosion protective films',
          'Simplifies chemical feed',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'corrosion-inhibitor-closed-system',
      title: 'Corrosion Inhibitor Closed Cooling System',
      description: 'Comprehensive protection for closed-loop cooling systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Closed system inhibitor', 'Closed loop protection', 'Chiller inhibitor', 'Closed circuit corrosion control', 'HVAC system inhibitor'],
        seoKeywords: ['closed system inhibitor Oman', 'closed loop protection Muscat', 'chiller inhibitor Oman', 'HVAC corrosion control Sohar', 'closed cooling treatment Oman'],
        longDescription: 'Closed Cooling System Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides long-term corrosion protection for closed-loop cooling and chiller systems in Muscat, Sohar, Duqm, Salalah. Our closed system inhibitor is specifically formulated for recirculating systems with minimal makeup water, providing multi-year protection with single treatment. The product protects steel, copper, aluminum, and stainless steel in mixed-metal systems. Essential for chilled water systems, district cooling networks, HVAC closed loops, and process cooling circuits. The inhibitor maintains stable alkalinity, prevents scale formation, and eliminates oxygen corrosion. One-time charge provides comprehensive protection for 1-3 years. Reduces water consumption, eliminates continuous chemical feed, and simplifies system maintenance. Widely used in commercial buildings, data centers, hospitals, and industrial facilities across Oman.',
        applications: [
          'Chilled water closed-loop systems',
          'District cooling network protection',
          'HVAC closed circuit treatment',
          'Process cooling loop corrosion control',
          'Data center cooling protection',
          'Hospital and healthcare cooling',
          'Commercial building chillers',
          'Long-term closed system protection'
        ],
        technicalSpecs: [
          'Multi-metal closed system formulation',
          'Initial dosage: 2-5% system volume',
          'Protection duration: 1-3 years',
          'pH maintenance: 9.0-10.5',
          'Includes scale inhibitor and pH buffer',
          'Minimal makeup requirements',
          'Compatible with glycols',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },

    // Tank Cleaners
    {
      id: 'hcf-remover',
      title: 'HCF Remover',
      description: 'Heavy carbon and fouling remover for industrial tank cleaning.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Heavy carbon remover', 'Fouling remover', 'Carbon cleaner', 'HCF cleaner', 'Heavy carbon fouling remover'],
        seoKeywords: ['HCF remover Oman', 'carbon remover Muscat', 'fouling cleaner Oman', 'heavy carbon cleaner Sohar', 'tank carbon remover Oman'],
        longDescription: 'HCF (Heavy Carbon Fouling) Remover supplier in Oman - Global Chemicals LLC provides powerful cleaning solutions for removing heavy carbon deposits, coke, and fouling from storage tanks, vessels, and industrial equipment in Muscat, Sohar, Duqm, Salalah. Our HCF remover effectively dissolves stubborn carbon buildup, polymerized residues, and baked-on deposits from crude oil tanks, fuel storage tanks, and process vessels. The specialized formulation penetrates deeply into carbon layers, breaking molecular bonds for complete removal. Essential for tank maintenance, turnaround operations, and restoring equipment efficiency. Reduces manual labor, shortens cleaning time, and eliminates the need for high-pressure jetting in many applications. Widely used in refineries, petrochemical plants, terminals, and marine operations across Oman.',
        applications: [
          'Crude oil storage tank carbon removal',
          'Fuel tank heavy deposit cleaning',
          'Process vessel fouling removal',
          'Heat exchanger carbon cleaning',
          'Refinery turnaround maintenance',
          'Marine cargo tank cleaning',
          'Bunker tank carbon removal',
          'Industrial equipment decontamination'
        ],
        technicalSpecs: [
          'Appearance: Amber to brown liquid',
          'pH: 11-13 (alkaline formulation)',
          'Penetration time: 2-24 hours depending on deposit',
          'Dilution: Use concentrated or dilute 1:3',
          'Effective temperature: 40-80°C for best results',
          'Biodegradable components',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'resin-clean',
      title: 'Resin Clean',
      description: 'Specialized cleaner for resin and polymer residue removal.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Resin cleaner', 'Polymer remover', 'Resin residue cleaner', 'Resin dissolving agent', 'Polymerization remover'],
        seoKeywords: ['resin cleaner Oman', 'polymer remover Muscat', 'resin clean Oman', 'resin residue cleaner Sohar', 'polymer tank cleaner Oman'],
        longDescription: 'Resin Clean supplier in Oman - Global Chemicals LLC provides specialized cleaning solutions for removing resin, polymer residues, and polymerized materials from tanks and equipment in Muscat, Sohar, Duqm, Salalah. Our Resin Clean formulation effectively dissolves cured resins, hardened polymers, epoxy residues, and polymerization deposits from storage vessels, mixing tanks, and process equipment. The powerful solvent blend penetrates and softens polymerized materials, allowing easy removal without damaging tank surfaces. Essential for chemical manufacturing plants, coating facilities, composite production, and polymer storage operations. Reduces downtime during tank changeovers and eliminates costly mechanical cleaning. Widely used in chemical plants, paint manufacturers, and industrial facilities across Oman.',
        applications: [
          'Resin storage tank cleaning',
          'Polymer mixing vessel decontamination',
          'Epoxy residue removal',
          'Coating equipment cleaning',
          'Composite manufacturing tank maintenance',
          'Polymerization reactor cleaning',
          'Paint and adhesive tank cleaning',
          'Chemical storage vessel changeover'
        ],
        technicalSpecs: [
          'Solvent-based formulation',
          'Effective on: Epoxy, polyester, acrylic, vinyl resins',
          'Soak time: 4-24 hours for cured resins',
          'Application: Spray, circulation, or soak method',
          'Flash point: >60°C',
          'Low vapor pressure for safety',
          'Available in 20L, 200L drums'
        ]
      },
    },
    {
      id: 'universal-wash',
      title: 'Universal Wash',
      description: 'Multi-purpose cleaning solution for various tank applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Universal cleaner', 'Multi-purpose wash', 'Tank wash', 'All-purpose tank cleaner', 'General purpose wash'],
        seoKeywords: ['universal wash Oman', 'tank cleaner Muscat', 'multi-purpose cleaner Oman', 'universal tank wash Sohar', 'general purpose cleaner Oman'],
        longDescription: 'Universal Wash supplier in Oman - Global Chemicals LLC provides versatile all-purpose tank cleaning solutions for various industrial applications in Muscat, Sohar, Duqm, Salalah. Our Universal Wash is a multi-purpose cleaning formulation effective on oils, greases, sludges, scale, and general contaminants in storage tanks, vessels, and equipment. The balanced formulation combines surfactants, solvents, and alkaline builders for comprehensive cleaning power. Essential for tank changeovers, routine maintenance cleaning, and decontamination between different cargo types. Suitable for crude oil tanks, chemical storage, food-grade tanks, and marine applications. The economical concentrate reduces inventory needs by replacing multiple specialized cleaners. Widely used in refineries, terminals, marine operations, and industrial facilities across Oman.',
        applications: [
          'Multi-cargo tank cleaning and changeover',
          'General storage tank maintenance',
          'Marine cargo hold cleaning',
          'Chemical tank decontamination',
          'Oil and grease removal',
          'Sludge dissolution',
          'Equipment washing',
          'Pre-inspection tank cleaning'
        ],
        technicalSpecs: [
          'Versatile formulation - multiple contaminant types',
          'pH: 10-12 (mildly alkaline)',
          'Dilution ratio: 1:10 to 1:50 depending on application',
          'Biodegradable surfactant base',
          'Safe on most tank coatings',
          'Hot or cold water application',
          'Available in 20L, 200L drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'methanol-tech-grade-cleaner',
      title: 'Methanol Tech Grade',
      description: 'Technical grade methanol for industrial cleaning and degreasing.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        formula: 'CH3OH',
        casNumber: '67-56-1',
        alternativeNames: ['Methyl alcohol', 'Wood alcohol', 'Technical methanol', 'MeOH cleaner', 'Methanol industrial grade'],
        seoKeywords: ['methanol tech grade Oman', 'methyl alcohol Muscat', 'industrial methanol Oman', 'technical methanol cleaner Sohar', 'MeOH tank cleaner Oman'],
        longDescription: 'Technical Grade Methanol supplier in Oman - Global Chemicals LLC provides industrial methanol for tank cleaning, degreasing, and solvent applications in Muscat, Sohar, Duqm, Salalah. Our technical methanol (CH3OH) is an effective solvent for dissolving oils, greases, waxes, and organic residues from storage tanks and equipment. The fast-evaporating properties ensure rapid drying with no residue, making it ideal for tank changeovers and equipment cleaning. Essential for removing paraffinic deposits, cleaning process vessels, and solvent flushing operations. Methanol provides excellent solvency with complete miscibility in water and most organic solvents. Widely used in refineries, chemical plants, terminals, and industrial maintenance operations across Oman. Available in technical grade meeting industrial specifications.',
        applications: [
          'Tank cleaning and residue removal',
          'Paraffin and wax dissolution',
          'Equipment degreasing and cleaning',
          'Solvent flushing operations',
          'Tank pre-entry preparation',
          'Pipeline cleaning',
          'Process vessel maintenance',
          'Parts washing and decontamination'
        ],
        technicalSpecs: [
          'Purity: 99%+ technical grade',
          'Appearance: Clear colorless liquid',
          'Boiling point: 64.7°C',
          'Flash point: 11°C (highly flammable)',
          'Rapid evaporation rate',
          'Complete water miscibility',
          'Excellent solvent properties',
          'Available in drums, IBCs, ISO tanks, bulk'
        ]
      },
    },
    {
      id: 'tank-degreaser-heavy-duty',
      title: 'Tank Degreaser Heavy Duty',
      description: 'Industrial-strength degreaser for heavy oil and grease removal.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Heavy duty degreaser', 'Industrial degreaser', 'Tank degreaser', 'HD tank degreaser', 'Heavy-duty tank cleaner'],
        seoKeywords: ['tank degreaser Oman', 'heavy duty degreaser Muscat', 'oil remover Oman', 'industrial tank degreaser Sohar', 'heavy grease remover Oman'],
        longDescription: 'Heavy-Duty Tank Degreaser supplier in Oman - Global Chemicals LLC provides industrial-strength degreasers for removing heavy oils, greases, and hydrocarbon residues from storage tanks in Muscat, Sohar, Duqm, Salalah. Our HD tank degreaser formulation combines powerful surfactants, emulsifiers, and alkaline builders to break down and emulsify the toughest oil and grease deposits. Essential for cleaning crude oil tanks, fuel storage vessels, lubricant tanks, and heavy residue accumulations. The concentrated formula provides superior cleaning efficiency, reducing chemical consumption and cleaning time. Safe on most tank coatings and materials when used as directed. Eliminates heavy manual scrubbing and reduces worker exposure. Widely used in refineries, terminals, marine operations, and industrial tank farms across Oman.',
        applications: [
          'Crude oil storage tank degreasing',
          'Lubricant and heavy oil tank cleaning',
          'Fuel tank residue removal',
          'Bunker tank cleaning',
          'Grease trap and separator cleaning',
          'Marine cargo tank degreasing',
          'Industrial equipment washing',
          'Refinery maintenance cleaning'
        ],
        technicalSpecs: [
          'Extra-heavy duty alkaline formulation',
          'pH: 12-14',
          'Dilution: 1:5 to 1:20 depending on soil level',
          'Application temperature: 50-80°C for best results',
          'Low foam for circulation cleaning',
          'Emulsifies heavy oils and greases',
          'Biodegradable surfactants',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'lye-sodium-hydroxide-liquid',
      title: 'Lye Sodium Hydroxide Liquid',
      description: 'Alkaline cleaning solution for industrial tank maintenance.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Lye', 'Caustic soda liquid', 'Sodium hydroxide solution', 'Liquid caustic', 'NaOH solution'],
        seoKeywords: ['lye Oman', 'caustic soda liquid Muscat', 'sodium hydroxide cleaner Oman', 'liquid caustic Sohar', 'NaOH tank cleaner Oman'],
        longDescription: 'Lye (Sodium Hydroxide Liquid) supplier in Oman - Global Chemicals LLC provides industrial-strength caustic soda liquid for tank cleaning and alkaline treatment in Muscat, Sohar, Duqm, Salalah. Our liquid sodium hydroxide (NaOH) is a powerful alkaline cleaner effective against organic materials, oils, greases, and stubborn tank deposits. The high pH solution saponifies fats and oils, dissolves organic residues, and neutralizes acidic contaminants in storage tanks. Essential for heavy-duty tank cleaning, CIP systems, and preparing tanks for inspection or product changeover. Available in various concentrations (typically 25%, 32%, 50%) to meet specific cleaning requirements. Caustic soda provides cost-effective cleaning power for the toughest industrial applications. Widely used in refineries, chemical plants, food processing, and industrial facilities across Oman.',
        applications: [
          'Heavy alkaline tank cleaning',
          'Organic residue dissolution',
          'Fat and oil saponification',
          'Tank degreasing operations',
          'CIP (Clean-in-Place) systems',
          'Food processing tank cleaning',
          'Neutralization of acid residues',
          'Preparation for tank inspection'
        ],
        technicalSpecs: [
          'Available concentrations: 25%, 32%, 50% NaOH',
          'pH: 14 (50% solution)',
          'Appearance: Clear colorless to pale liquid',
          'Specific gravity: 1.33 (32% solution)',
          'Highly corrosive - requires PPE',
          'Dilutable to working strength',
          'Exothermic when mixed with water',
          'Available in drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'tank-cleaner-general',
      title: 'Tank Cleaner',
      description: 'General-purpose tank cleaning formulation for industrial use.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['General tank cleaner', 'Industrial tank cleaner', 'Tank cleaning solution', 'All-purpose tank wash', 'Standard tank cleaner'],
        seoKeywords: ['tank cleaner Oman', 'industrial cleaner Muscat', 'tank cleaning Oman', 'general purpose tank cleaner Sohar', 'tank wash solution Oman'],
        longDescription: 'General Purpose Tank Cleaner supplier in Oman - Global Chemicals LLC provides reliable tank cleaning solutions for routine maintenance and standard cleaning applications in Muscat, Sohar, Duqm, Salalah. Our tank cleaner formulation effectively removes light to moderate oils, sludges, scale deposits, and general contaminants from storage tanks and vessels. The balanced surfactant and solvent system provides good cleaning performance across a wide range of soils. Essential for routine tank maintenance, scheduled cleaning programs, and standard decontamination operations. Cost-effective solution for regular tank cleaning without requiring specialized products. Compatible with most tank coatings and materials. Easy to apply via circulation, spraying, or manual washing methods. Widely used across industrial sectors in Oman including petroleum, chemical, marine, and manufacturing facilities.',
        applications: [
          'Routine storage tank cleaning',
          'Light to moderate oil removal',
          'Sludge and sediment cleaning',
          'Tank maintenance programs',
          'Pre-inspection cleaning',
          'Between-cargo tank washing',
          'Industrial vessel cleaning',
          'General equipment decontamination'
        ],
        technicalSpecs: [
          'General purpose formulation',
          'pH: 9-11 (mildly alkaline)',
          'Dilution: 1:10 to 1:30 with water',
          'Application methods: Spray, circulation, manual',
          'Biodegradable components',
          'Safe on most tank surfaces',
          'Effective in hot or cold water',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'sewage-deformer',
      title: 'Sewage Deformer',
      description: 'Foam control agent for sewage and wastewater tank systems.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Defoamer', 'Foam control', 'Antifoam sewage', 'Sewage antifoam', 'Wastewater defoamer'],
        seoKeywords: ['sewage defoamer Oman', 'foam control Muscat', 'wastewater defoamer Oman', 'antifoam sewage Sohar', 'foam breaker Oman'],
        longDescription: 'Sewage Defoamer supplier in Oman - Global Chemicals LLC provides effective foam control solutions for sewage treatment tanks, wastewater systems, and biological treatment facilities in Muscat, Sohar, Duqm, Salalah. Our sewage defoamer rapidly collapses foam and prevents foam formation in aeration tanks, digesters, holding tanks, and effluent systems. The silicone-based or mineral oil formulations provide instant foam knockdown and long-lasting foam prevention. Essential for maintaining operational efficiency, preventing overflows, and ensuring proper aeration in biological treatment processes. Foam control improves treatment capacity, reduces odors, and prevents equipment contamination. The defoamer is compatible with biological treatment systems and does not inhibit bacterial activity. Widely used in municipal wastewater treatment plants, industrial effluent systems, and sewage facilities across Oman.',
        applications: [
          'Sewage treatment plant foam control',
          'Aeration tank foam suppression',
          'Anaerobic digester defoaming',
          'Wastewater holding tank treatment',
          'Biological treatment foam prevention',
          'Effluent system foam control',
          'Industrial wastewater foam breaking',
          'Municipal sewage treatment'
        ],
        technicalSpecs: [
          'Types: Silicone-based, mineral oil-based',
          'Instant foam knockdown action',
          'Long-lasting foam prevention',
          'Dosage: 10-100 ppm depending on foam severity',
          'Compatible with biological treatment',
          'Non-toxic to bacteria',
          'Continuous or slug dosing',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'alkaleen-cleaner-safety',
      title: 'Alkaleen Cleaner Safety Liquid',
      description: 'Safe alkaline cleaner for various industrial cleaning applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Safe alkaline cleaner', 'Alkaline safety cleaner', 'Industrial alkali cleaner', 'Alkaleen safe cleaner', 'Low-hazard alkaline cleaner'],
        seoKeywords: ['alkaleen cleaner Oman', 'safe alkaline cleaner Muscat', 'industrial cleaner Oman', 'safety cleaner Sohar', 'low-hazard cleaner Oman'],
        longDescription: 'Alkaleen Safety Cleaner supplier in Oman - Global Chemicals LLC provides safer alkaline cleaning solutions for tank cleaning and industrial maintenance in Muscat, Sohar, Duqm, Salalah. Our Alkaleen Safety Liquid offers effective alkaline cleaning power with reduced hazards compared to traditional caustic cleaners. The formulation provides good degreasing and cleaning performance while minimizing worker exposure risks and equipment corrosion concerns. Essential for operations requiring alkaline cleaning but with enhanced safety profiles for workers. Ideal for confined space tank cleaning, manual washing operations, and facilities prioritizing worker safety. The safer formulation reduces PPE requirements while maintaining cleaning effectiveness. Widely used in food processing, pharmaceutical facilities, and industries with strict safety requirements across Oman.',
        applications: [
          'Safe tank cleaning operations',
          'Confined space cleaning with reduced hazards',
          'Manual cleaning operations',
          'Food processing equipment cleaning',
          'Pharmaceutical facility cleaning',
          'General degreasing with safety focus',
          'Industrial equipment washing',
          'Routine maintenance cleaning'
        ],
        technicalSpecs: [
          'Safer alkaline formulation',
          'pH: 10-12 (moderate alkaline)',
          'Reduced skin and eye irritation vs caustic',
          'Effective degreasing power',
          'Dilution: 1:10 to 1:20 with water',
          'Biodegradable surfactant system',
          'Lower corrosion on metals vs high pH cleaners',
          'Available in 20L, 200L drums'
        ]
      },
    },
    {
      id: 'emulsion-sludge-breaker',
      title: 'Emulsion Sludge Breaker',
      description: 'Breaks down emulsions and sludge in storage tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Sludge breaker', 'Emulsion breaker', 'Demulsifier', 'Sludge conditioner', 'Emulsion separator'],
        seoKeywords: ['emulsion breaker Oman', 'sludge breaker Muscat', 'demulsifier Oman', 'tank sludge treatment Sohar', 'emulsion separator Oman'],
        longDescription: 'Emulsion Sludge Breaker supplier in Oman - Global Chemicals LLC provides specialized demulsifiers for breaking oil-water emulsions and conditioning tank sludges in Muscat, Sohar, Duqm, Salalah. Our emulsion breaker formulation destabilizes stable emulsions, allowing oil and water phases to separate for easier removal. The product conditions bottom sludges, making them pumpable and reducing the volume requiring disposal. Essential for crude oil tank bottoms cleaning, slop oil recovery, and reducing waste volumes during tank cleaning operations. The demulsifier accelerates phase separation, improves oil recovery, and minimizes disposal costs. Works effectively on aged emulsions and heavy sludges. Widely used in refineries, terminals, production facilities, and oil storage operations across Oman for economical tank cleaning.',
        applications: [
          'Crude oil tank bottom sludge treatment',
          'Slop oil emulsion breaking',
          'Tank cleaning waste volume reduction',
          'Oil recovery from tank bottoms',
          'Refinery slop system treatment',
          'Terminal tank sludge conditioning',
          'Production separator sludge treatment',
          'Waste oil reclamation'
        ],
        technicalSpecs: [
          'Powerful demulsification action',
          'Dosage: 100-1000 ppm on sludge volume',
          'Separation time: 2-24 hours',
          'Works on aged and stable emulsions',
          'Reduces sludge viscosity',
          'Improves oil recovery',
          'Application: Mix into sludge or inject',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'oil-spill-dispersent-type-3',
      title: 'Oil Spill Dispersent Type 3',
      description: 'Type 3 dispersant for oil spill response and tank cleaning.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Oil dispersant', 'Spill dispersant type 3', 'Oil spill cleaner', 'Marine oil dispersant', 'Type III dispersant'],
        seoKeywords: ['oil spill dispersant Oman', 'dispersant type 3 Muscat', 'oil spill cleaner Oman', 'marine dispersant Sohar', 'oil spill response Oman'],
        longDescription: 'Oil Spill Dispersant Type 3 supplier in Oman - Global Chemicals LLC provides approved oil spill dispersants for emergency response and tank cleaning in Muscat, Sohar, Duqm, Salalah. Our Type 3 dispersant effectively breaks down and disperses oil slicks, facilitating natural biodegradation and reducing environmental impact. The surfactant-based formulation emulsifies oil into fine droplets that disperse throughout the water column where bacteria can degrade them. Essential for marine oil spill response, harbor cleanup, and tank cleaning operations where oil residues must be dispersed. Meets international specifications for oil spill dispersants. Also used in tank cleaning to emulsify and remove stubborn oil films and residues. Widely used by marine operators, port authorities, and emergency response teams across Oman\'s coastal areas.',
        applications: [
          'Marine oil spill emergency response',
          'Harbor and coastal oil slick treatment',
          'Tank cleaning oil emulsification',
          'Bilge oil dispersal',
          'Oily wastewater treatment',
          'Beach cleanup operations',
          'Vessel tank washing',
          'Oil residue removal from surfaces'
        ],
        technicalSpecs: [
          'Type III dispersant classification',
          'Meets IMO/MEPC standards',
          'Application ratio: 1:10 to 1:25 (dispersant:oil)',
          'Effective on: Crude oil, fuel oils, refined products',
          'Biodegradable formulation',
          'Application: Spray or circulation',
          'Approved for marine use',
          'Available in 20L, 200L drums'
        ]
      },
    },
    {
      id: 'aqua-clean-hd',
      title: 'Aqua Clean HD',
      description: 'Heavy-duty aqueous cleaning solution for industrial tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Aqueous cleaner', 'Heavy duty aqua cleaner', 'Water-based cleaner HD', 'Aqua wash HD', 'Water-based degreaser'],
        seoKeywords: ['aqua clean HD Oman', 'aqueous cleaner Muscat', 'tank cleaning solution Oman', 'water-based cleaner Sohar', 'HD aqueous cleaner Oman'],
        longDescription: 'Aqua Clean HD supplier in Oman - Global Chemicals LLC provides heavy-duty water-based cleaning solutions for industrial tank and equipment cleaning in Muscat, Sohar, Duqm, Salalah. Our Aqua Clean HD is an environmentally-preferred aqueous cleaner that effectively removes oils, greases, carbon deposits, and industrial soils without harsh solvents. The water-based formulation provides powerful cleaning while eliminating solvent-related hazards and environmental concerns. Essential for tank cleaning operations in food processing, pharmaceuticals, and facilities requiring solvent-free cleaning. The concentrated formula provides economical dilution ratios and excellent performance in spray, circulation, or manual applications. Low VOC content complies with environmental regulations. Widely used across industries in Oman requiring effective, environmentally-responsible tank cleaning solutions.',
        applications: [
          'Water-based tank cleaning',
          'Food processing equipment cleaning',
          'Pharmaceutical tank decontamination',
          'Solvent-free degreasing',
          'Environmental compliance cleaning',
          'Low-VOC cleaning applications',
          'Industrial equipment washing',
          'Heavy soil removal without solvents'
        ],
        technicalSpecs: [
          'Aqueous (water-based) formulation',
          'pH: 11-13 (alkaline)',
          'Low VOC - environmental compliance',
          'Dilution: 1:10 to 1:30 with water',
          'Effective hot or cold',
          'Heavy-duty cleaning power',
          'Biodegradable surfactants',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'cold-washer-hd',
      title: 'Cold Washer HD',
      description: 'Cold-water heavy-duty cleaner for efficient tank washing.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Cold water cleaner', 'HD cold wash', 'Cold cleaning solution', 'Ambient temperature cleaner', 'Cold-water degreaser'],
        seoKeywords: ['cold washer HD Oman', 'cold water cleaner Muscat', 'tank wash Oman', 'ambient cleaner Sohar', 'cold cleaning solution Oman'],
        longDescription: 'Cold Washer HD supplier in Oman - Global Chemicals LLC provides heavy-duty cold-water tank cleaning solutions for operations without heating capabilities in Muscat, Sohar, Duqm, Salalah. Our Cold Washer HD formulation delivers powerful cleaning performance at ambient temperatures, eliminating energy costs for water heating. The specialized surfactant system activates effectively in cold water, providing excellent degreasing and emulsification. Essential for field operations, mobile tank cleaning, and facilities without hot water systems. The cold-active formula saves energy costs while maintaining cleaning efficiency. Particularly valuable for tropical climates like Oman where ambient water temperatures support effective cleaning. Reduces operational costs and simplifies cleaning logistics. Widely used in marine operations, field services, and remote locations across Oman.',
        applications: [
          'Cold-water tank cleaning operations',
          'Mobile tank cleaning services',
          'Field cleaning without heating',
          'Energy-saving cleaning programs',
          'Marine tank washing at ambient temp',
          'Remote location tank cleaning',
          'Tropical climate applications',
          'Cost-effective cleaning operations'
        ],
        technicalSpecs: [
          'Effective at ambient/cold water temperatures',
          'pH: 11-13 (alkaline)',
          'No heating required - energy savings',
          'Dilution: 1:10 to 1:20 with water',
          'Rapid penetration and emulsification',
          'Heavy-duty cleaning power',
          'Suitable for spray or circulation',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'passivation-liquid',
      title: 'Passivation Liquid',
      description: 'Chemical passivation treatment for stainless steel tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        casNumber: '7697-37-2',
        alternativeNames: ['Passivation solution', 'Stainless steel passivation', 'Metal passivation', 'Nitric acid passivation', 'SS passivation treatment'],
        seoKeywords: ['passivation liquid Oman', 'stainless steel treatment Muscat', 'tank passivation Oman', 'SS passivation Sohar', 'metal passivation Oman'],
        longDescription: 'Passivation Liquid supplier in Oman - Global Chemicals LLC provides nitric acid-based passivation solutions for stainless steel tank treatment in Muscat, Sohar, Duqm, Salalah. Our passivation liquid removes free iron contamination from stainless steel surfaces and restores the protective chromium oxide passive layer. Essential for new tank commissioning, post-fabrication treatment, and restoring corrosion resistance after cleaning or repairs. The passivation process prevents flash rusting, improves corrosion resistance, and ensures optimal performance of stainless steel tanks. Critical for pharmaceutical, food processing, and high-purity applications requiring maximum corrosion protection. The treatment also validates cleanliness and prepares tanks for product contact. Widely used in pharmaceutical, food & beverage, and high-purity chemical facilities across Oman.',
        applications: [
          'New stainless steel tank passivation',
          'Post-fabrication surface treatment',
          'Restoration after cleaning or repairs',
          'Pharmaceutical tank commissioning',
          'Food-grade tank preparation',
          'High-purity system passivation',
          'Free iron removal from SS',
          'Corrosion resistance enhancement'
        ],
        technicalSpecs: [
          'Base: Nitric acid (HNO3) 20-25% typical',
          'Treatment time: 30 minutes to 2 hours',
          'Temperature: Ambient to 50°C',
          'Removes free iron contamination',
          'Restores chromium oxide passive layer',
          'Meets ASTM A380/A967 standards',
          'pH test kit verification available',
          'Available in 20L, 200L drums'
        ]
      },
    },
    {
      id: 'edge-sol-cleaner',
      title: 'Edge Sol Cleaner',
      description: 'Solvent-based edge and seam cleaning solution.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Solvent cleaner', 'Edge cleaner', 'Seam cleaning solution', 'Weld seam cleaner', 'Edge and corner cleaner'],
        seoKeywords: ['edge sol cleaner Oman', 'solvent cleaner Muscat', 'seam cleaner Oman', 'weld cleaner Sohar', 'edge cleaning solution Oman'],
        longDescription: 'Edge Sol Cleaner supplier in Oman - Global Chemicals LLC provides specialized solvent-based cleaners for tank edges, seams, welds, and hard-to-reach areas in Muscat, Sohar, Duqm, Salalah. Our Edge Sol formulation effectively penetrates and dissolves residues in crevices, weld seams, corners, and edge areas where general cleaners struggle. The low-viscosity solvent system reaches tight spaces, dissolving oils, tars, and accumulated deposits. Essential for thorough tank cleaning before inspection, ensuring all areas including challenging seams and edges are properly decontaminated. The fast-evaporating formula leaves no residue and allows quick drying. Critical for meeting inspection standards and ensuring complete tank cleanliness. Widely used in refineries, chemical plants, and terminals across Oman for detailed tank cleaning operations.',
        applications: [
          'Tank edge and seam cleaning',
          'Weld seam residue removal',
          'Corner and crevice decontamination',
          'Pre-inspection thorough cleaning',
          'Hard-to-reach area treatment',
          'Detailed tank cleaning',
          'Flange and gasket area cleaning',
          'Complete decontamination programs'
        ],
        technicalSpecs: [
          'Low-viscosity solvent formulation',
          'Penetrates tight spaces and crevices',
          'Dissolves oils, tars, and residues',
          'Fast evaporation - quick drying',
          'No residue after evaporation',
          'Flash point: >40°C',
          'Application: Spray or brush',
          'Available in 20L drums'
        ]
      },
    },
    {
      id: 'enviro-soft-2000',
      title: 'Enviro Soft 2000',
      description: 'Environmentally friendly softening and cleaning agent.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Eco-friendly cleaner', 'Soft cleaner 2000', 'Environmental cleaner', 'Green tank cleaner', 'Biodegradable cleaner'],
        seoKeywords: ['enviro soft 2000 Oman', 'eco-friendly cleaner Muscat', 'green cleaner Oman', 'biodegradable tank cleaner Sohar', 'environmental cleaner Oman'],
        longDescription: 'Enviro Soft 2000 supplier in Oman - Global Chemicals LLC provides environmentally-responsible cleaning solutions for tank and equipment cleaning in Muscat, Sohar, Duqm, Salalah. Our Enviro Soft 2000 is a biodegradable, low-toxicity cleaner designed for operations prioritizing environmental protection. The formulation softens and removes deposits while minimizing environmental impact through biodegradable surfactants and eco-friendly solvents. Essential for operations in environmentally-sensitive areas, marine protected zones, and facilities with strict environmental compliance requirements. The green chemistry approach provides effective cleaning without harsh chemicals or persistent environmental residues. Reduces disposal concerns and supports sustainability goals. Widely used in marine operations, coastal facilities, and environmentally-conscious industrial operations across Oman.',
        applications: [
          'Environmentally-sensitive area cleaning',
          'Marine protected zone operations',
          'Green chemistry compliance programs',
          'Sustainable tank cleaning operations',
          'Low-impact degreasing',
          'Eco-certified facility cleaning',
          'Biodegradable residue removal',
          'Environmental compliance cleaning'
        ],
        technicalSpecs: [
          'Biodegradable formulation',
          'Low aquatic toxicity',
          'Non-bioaccumulative',
          'pH: 9-11 (mildly alkaline)',
          'Dilution: 1:10 to 1:30 with water',
          'Effective cleaning with lower environmental impact',
          'Meets green chemistry standards',
          'Available in 20L, 200L drums'
        ]
      },
    },
    {
      id: 'dual-hd-cleaner',
      title: 'Dual HD Cleaner',
      description: 'Dual-action heavy-duty cleaner for versatile tank applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Dual action cleaner', 'Heavy duty dual cleaner', 'Versatile tank cleaner', '2-in-1 cleaner', 'Multipurpose HD cleaner'],
        seoKeywords: ['dual HD cleaner Oman', 'dual action cleaner Muscat', 'versatile cleaner Oman', '2-in-1 tank cleaner Sohar', 'multipurpose cleaner Oman'],
        longDescription: 'Dual HD Cleaner supplier in Oman - Global Chemicals LLC provides dual-action heavy-duty cleaning solutions for versatile tank applications in Muscat, Sohar, Duqm, Salalah. Our Dual HD Cleaner combines powerful alkaline cleaning with solvent action in a single formulation, effectively tackling both water-soluble and oil-soluble contaminants. The dual-action chemistry provides comprehensive cleaning without requiring multiple products or treatment stages. Essential for complex contamination scenarios involving mixed soils, reducing chemical inventory and simplifying cleaning procedures. The versatile formulation handles oils, greases, scale, carbon deposits, and organic materials. One-step cleaning saves time and labor costs while delivering thorough results. Widely used across refineries, chemical plants, and multi-product terminals in Oman requiring versatile tank cleaning capability.',
        applications: [
          'Mixed contamination tank cleaning',
          'One-step comprehensive cleaning',
          'Oil and water-soluble soil removal',
          'Multi-product tank facilities',
          'Complex residue cleaning',
          'Simplified cleaning programs',
          'Heavy-duty versatile applications',
          'Inventory reduction initiatives'
        ],
        technicalSpecs: [
          'Dual-action: Alkaline + solvent combination',
          'Handles oil and water-soluble contaminants',
          'pH: 12-13 (strongly alkaline)',
          'Dilution: 1:5 to 1:20 depending on application',
          'One-step cleaning reduces labor',
          'Hot or cold water compatible',
          'Concentrated formula',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },
    {
      id: 'metal-bright',
      title: 'Metal Bright',
      description: 'Metal brightening and cleaning solution for tank surfaces.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Metal brightener', 'Metal polish cleaner', 'Brightening solution', 'Stainless steel brightener', 'Metal shine cleaner'],
        seoKeywords: ['metal bright Oman', 'metal brightener Muscat', 'metal polish Oman', 'stainless steel brightener Sohar', 'metal shine Oman'],
        longDescription: 'Metal Bright supplier in Oman - Global Chemicals LLC provides metal brightening and polishing solutions for tank and equipment surfaces in Muscat, Sohar, Duqm, Salalah. Our Metal Bright formulation removes oxidation, staining, discoloration, and light rust from metal surfaces while restoring shine and luster. The acid-based cleaner is particularly effective on stainless steel, aluminum, and other metals requiring bright, clean finishes. Essential for food-grade tanks, pharmaceutical vessels, and applications requiring visually clean, bright metal surfaces. The product removes water spots, heat tint, weld discoloration, and surface oxidation. Prepares metal surfaces for inspection and validates cleanliness. Widely used in food processing, pharmaceutical, beverage, and high-purity chemical facilities across Oman requiring pristine metal surfaces.',
        applications: [
          'Stainless steel tank brightening',
          'Oxidation and stain removal',
          'Heat tint and weld discoloration removal',
          'Food-grade tank surface preparation',
          'Pharmaceutical vessel cleaning',
          'Metal surface restoration',
          'Pre-inspection brightening',
          'Aluminum and metal polishing'
        ],
        technicalSpecs: [
          'Acid-based brightening formulation',
          'Effective on: Stainless steel, aluminum, metals',
          'Removes: Oxidation, stains, heat tint, light rust',
          'Application time: 5-30 minutes',
          'pH: 1-3 (acidic)',
          'Dilution: Use concentrated or dilute 1:5',
          'Rinse thoroughly after treatment',
          'Available in 20L, 200L drums'
        ]
      },
    },
    {
      id: 'p-xylene-pure',
      title: 'P Xylene Pure',
      description: 'Pure p-xylene solvent for industrial cleaning applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        formula: 'C8H10',
        casNumber: '106-42-3',
        alternativeNames: ['Para-xylene', 'p-Xylene', '1,4-Dimethylbenzene', 'PX solvent', 'Paraxylene'],
        seoKeywords: ['p-xylene Oman', 'para-xylene Muscat', 'industrial solvent Oman', 'PX solvent Sohar', 'xylene tank cleaner Oman'],
        longDescription: 'Pure P-Xylene supplier in Oman - Global Chemicals LLC provides high-purity para-xylene solvent for industrial tank cleaning and degreasing in Muscat, Sohar, Duqm, Salalah. Our p-xylene (1,4-dimethylbenzene) offers excellent solvency for oils, greases, tars, and hydrocarbon residues in storage tanks and equipment. The aromatic hydrocarbon solvent effectively dissolves stubborn deposits that water-based cleaners cannot remove. Essential for heavy residue removal, tar and bitumen dissolution, and degreasing operations in refineries and petrochemical facilities. P-xylene provides superior cleaning power for the most challenging tank cleaning applications. The pure grade ensures consistent performance and minimal impurities. Widely used in refineries, chemical plants, and industrial maintenance operations across Oman.',
        applications: [
          'Heavy residue tank cleaning',
          'Tar and bitumen dissolution',
          'Aromatic solvent degreasing',
          'Petrochemical tank cleaning',
          'Resin and polymer removal',
          'Industrial equipment degreasing',
          'Paint and coating removal',
          'Heavy oil residue dissolution'
        ],
        technicalSpecs: [
          'Purity: 99% minimum p-xylene',
          'Molecular weight: 106.17 g/mol',
          'Boiling point: 138°C',
          'Flash point: 27°C (flammable)',
          'Appearance: Clear colorless liquid',
          'Excellent aromatic solvency',
          'Lower toxicity vs mixed xylenes',
          'Available in drums, IBCs'
        ]
      },
    },
    {
      id: 'ctc-volc-cleaner',
      title: 'CTC Volc Cleaner',
      description: 'Volcanic ash and carbon cleaner for specialized tank cleaning.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Carbon cleaner', 'Volcanic ash remover', 'CTC cleaner', 'Carbon tetrachloride alternative', 'Heavy carbon cleaner'],
        seoKeywords: ['CTC volc cleaner Oman', 'carbon cleaner Muscat', 'volcanic ash remover Oman', 'heavy carbon remover Sohar', 'specialized tank cleaner Oman'],
        longDescription: 'CTC Volc Cleaner supplier in Oman - Global Chemicals LLC provides specialized cleaning solutions for removing volcanic ash, heavy carbon deposits, and mineral-based contaminants from tanks in Muscat, Sohar, Duqm, Salalah. Our CTC Volc Cleaner formulation is specifically designed for challenging mineral and carbon deposits that standard cleaners cannot handle. The powerful solvent and dispersant system breaks down baked-on carbon, volcanic ash residues, and similar mineral-based contaminants. Essential for tanks exposed to combustion products, furnace operations, or specialized industrial processes creating mineral deposits. The cleaner penetrates deeply into porous carbon and ash layers, facilitating complete removal. Provides a safer alternative to traditional carbon tetrachloride-based cleaners. Widely used in power plants, industrial furnace operations, and specialized tank cleaning across Oman.',
        applications: [
          'Volcanic ash deposit removal',
          'Heavy carbon deposit cleaning',
          'Combustion residue removal',
          'Furnace tank cleaning',
          'Mineral-based contamination',
          'Baked-on carbon dissolution',
          'Specialized industrial tank cleaning',
          'Power plant tank maintenance'
        ],
        technicalSpecs: [
          'Specialized formulation for mineral/carbon deposits',
          'Solvent and dispersant system',
          'Penetrates porous deposits',
          'Application: Soak, spray, or circulation',
          'Contact time: 4-24 hours for heavy deposits',
          'Temperature: Warm application improves performance',
          'Safer alternative to carbon tetrachloride',
          'Available in 20L, 200L drums'
        ]
      },
    },
    {
      id: 'aquatuff-ship-hold-cleaner',
      title: 'Aquatuff Ship Hold Cleaner',
      description: 'Marine-grade cleaner for ship holds and cargo tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Ship hold cleaner', 'Marine tank cleaner', 'Cargo hold cleaner', 'Vessel tank wash', 'Marine cargo cleaner'],
        seoKeywords: ['ship hold cleaner Oman', 'marine cleaner Muscat', 'cargo tank cleaner Oman', 'vessel cleaner Sohar', 'marine tank wash Oman'],
        longDescription: 'Aquatuff Ship Hold Cleaner supplier in Oman - Global Chemicals LLC provides marine-grade cleaning solutions for ship holds, cargo tanks, and vessel spaces in Muscat, Sohar, Duqm, Salalah. Our Aquatuff formulation is specifically designed for maritime applications, effectively removing cargo residues, oils, animal fats, vegetable oils, and general marine soils. The powerful yet biodegradable cleaner meets marine environmental standards while delivering exceptional cleaning performance. Essential for cargo changeovers, hold cleaning between different cargoes, and vessel tank maintenance. The product prevents cargo contamination, ensures clean holds for inspection, and supports vessel operational efficiency. Safe for use in confined spaces with proper ventilation. Widely used by shipping companies, port services, and marine tank cleaning contractors across Oman\'s major ports.',
        applications: [
          'Ship cargo hold cleaning',
          'Marine cargo tank washing',
          'Vessel tank changeover cleaning',
          'Dry bulk hold cleaning',
          'Liquid cargo tank decontamination',
          'Marine oil and grease removal',
          'Port tank cleaning services',
          'Pre-inspection hold cleaning'
        ],
        technicalSpecs: [
          'Marine-grade formulation',
          'pH: 10-12 (alkaline)',
          'Biodegradable - marine environment safe',
          'Effective on: Oils, fats, cargo residues',
          'Dilution: 1:20 to 1:50 with seawater or freshwater',
          'Low foam for circulation systems',
          'Meets IMO environmental standards',
          'Available in 20L, 200L drums, IBCs'
        ]
      },
    },

    // RO Chemicals
    {
      id: 'ro-passivation',
      title: 'RO Passivation',
      description: 'Passivation treatment for reverse osmosis membrane protection and preservation.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['Membrane passivation', 'RO membrane preservative', 'Membrane storage solution', 'RO preservation chemical', 'Membrane protection treatment'],
        seoKeywords: ['RO passivation Oman', 'membrane protection Muscat', 'RO preservation Oman', 'membrane passivation Sohar', 'RO storage solution Oman'],
        longDescription: 'RO Passivation solution supplier in Oman - Global Chemicals LLC provides membrane passivation and preservation chemicals for reverse osmosis systems in Muscat, Sohar, Duqm, Salalah. Our RO passivation treatment protects membranes during short-term shutdown periods, preventing biological growth, scaling, and fouling. The specialized formulation creates a protective barrier on membrane surfaces, maintaining wet storage conditions and preventing oxidation. Essential for extended plant shutdowns, seasonal operations, and membrane preservation during transportation or storage. Prevents membrane drying, bacterial colonization, and irreversible damage that reduces performance. The passivation solution is easy to apply and drain, ensuring membranes restart quickly with full capacity. Widely used in desalination plants, industrial RO systems, and water treatment facilities across Oman.',
        applications: [
          'RO membrane shutdown protection',
          'Short-term membrane storage (up to 30 days)',
          'Seasonal plant shutdown preservation',
          'Prevention of biological growth during idle periods',
          'Membrane transportation protection',
          'Emergency shutdown membrane protection',
          'Desalination plant standby mode',
          'Industrial RO system preservation'
        ],
        technicalSpecs: [
          'Preservative concentration: 1-2% solution',
          'Protection duration: Up to 30 days',
          'Prevents biological growth and scaling',
          'pH: 3-5 (slightly acidic)',
          'Food-grade formulation available',
          'Easy drain and restart procedure',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'citric-acid-liquid-ro',
      title: 'Citric Acid Liquid',
      description: 'Organic acid cleaner for RO membrane descaling and fouling removal.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        formula: 'C6H8O7',
        casNumber: '77-92-9',
        alternativeNames: ['Citric acid solution', 'Membrane descaler', 'RO cleaner', 'Organic acid RO cleaner', 'Citric acid membrane cleaner'],
        seoKeywords: ['citric acid RO Oman', 'membrane descaler Muscat', 'RO cleaning Oman', 'citric acid membrane cleaner Sohar', 'RO descaling Oman'],
        longDescription: 'Citric Acid Liquid for RO Membranes supplier in Oman - Global Chemicals LLC provides organic acid cleaning solutions for reverse osmosis membrane descaling in Muscat, Sohar, Duqm, Salalah. Our citric acid formulation effectively removes carbonate scale, calcium deposits, iron fouling, and mineral buildup from RO and NF membranes. The biodegradable organic acid provides safer, environmentally-friendly cleaning compared to mineral acids. Essential for maintaining membrane performance, restoring flux rates, and extending membrane life. Citric acid offers excellent chelating properties for iron and calcium removal without aggressive corrosion. The pH-buffered formulation ensures gentle yet effective cleaning. Ideal for food & beverage, pharmaceutical, and environmentally-sensitive applications. Widely used in desalination plants, industrial water treatment, and RO facilities across Oman.',
        applications: [
          'RO membrane carbonate scale removal',
          'Calcium and magnesium deposit cleaning',
          'Iron fouling removal from membranes',
          'NF membrane descaling',
          'Food-grade RO system cleaning',
          'Pharmaceutical water system maintenance',
          'Environmentally-friendly membrane cleaning',
          'Flux restoration treatments'
        ],
        technicalSpecs: [
          'Citric acid concentration: 2-3%',
          'pH: 3-4 (buffered formulation)',
          'Biodegradable organic acid',
          'Cleaning cycle: 1-4 hours circulation',
          'Temperature: 35-40°C for best results',
          'Food-grade formulation available',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'ro-222-descaler',
      title: 'RO 222 Descaler',
      description: 'Specialized descaling solution for reverse osmosis membrane systems.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['RO descaler', 'Membrane descaling solution', 'Scale remover RO', 'RO 222 cleaner', 'Membrane scale remover'],
        seoKeywords: ['RO 222 descaler Oman', 'RO membrane cleaner Muscat', 'scale remover Oman', 'membrane descaling Sohar', 'RO 222 Oman'],
        longDescription: 'RO 222 Descaler supplier in Oman - Global Chemicals LLC provides specialized RO membrane descaling solutions for reverse osmosis and nanofiltration systems in Muscat, Sohar, Duqm, Salalah. Our RO 222 formulation is specifically designed to remove stubborn scale deposits including calcium carbonate, calcium sulfate, barium sulfate, and silica from membrane surfaces. The balanced acid formulation provides effective cleaning without damaging membrane integrity. Essential for restoring flux rates, improving salt rejection, and extending membrane operational life. The descaler penetrates scale layers, dissolving deposits and restoring membrane permeability. Suitable for all polyamide and composite membranes. Regular descaling maintenance prevents permanent fouling and ensures optimal RO system performance. Widely used across Oman\'s desalination, industrial water treatment, and beverage production facilities.',
        applications: [
          'Heavy scale removal from RO membranes',
          'Calcium carbonate and sulfate scale dissolution',
          'Barium sulfate and silica scale removal',
          'Membrane flux restoration',
          'Salt rejection improvement',
          'Preventive descaling maintenance',
          'Desalination plant membrane cleaning',
          'Industrial RO system maintenance'
        ],
        technicalSpecs: [
          'Formulation: Balanced acid blend with inhibitors',
          'Typical dosage: 2-5% solution',
          'pH: 2-3 (acidic formulation)',
          'Cleaning time: 2-6 hours circulation',
          'Temperature: Ambient to 40°C',
          'Safe for polyamide membranes',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'sodium-hydroxide-alkaleen',
      title: 'Sodium Hydroxide Based Alkaleen Cleaner',
      description: 'Alkaline cleaner for organic fouling and biological growth removal from RO membranes.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Alkaline RO cleaner', 'Caustic membrane cleaner', 'Sodium hydroxide cleaner', 'Alkaline membrane wash', 'High pH RO cleaner'],
        seoKeywords: ['alkaline RO cleaner Oman', 'membrane cleaner Muscat', 'caustic cleaner Oman', 'sodium hydroxide RO Sohar', 'alkaline membrane cleaner Oman'],
        longDescription: 'Alkaline RO Membrane Cleaner supplier in Oman - Global Chemicals LLC provides sodium hydroxide-based cleaning solutions for removing organic fouling and biological growth from RO membranes in Muscat, Sohar, Duqm, Salalah. Our alkaline cleaner effectively removes oils, greases, biological slimes, organic matter, and silica deposits from membrane surfaces. The high pH formulation saponifies fats and oils, disperses biofilms, and solubilizes organic foulants that acid cleaners cannot remove. Essential for comprehensive two-stage cleaning (alkaline followed by acid) to restore membrane performance. The formulation includes surfactants and dispersants to enhance cleaning efficiency. Safe for polyamide membranes when used according to specifications. Widely used in desalination plants, wastewater RO, and industrial membrane systems across Oman.',
        applications: [
          'Organic fouling removal from RO membranes',
          'Biological slime and biofilm cleaning',
          'Oil and grease deposit removal',
          'Silica fouling treatment',
          'Two-stage membrane cleaning programs',
          'Wastewater RO membrane maintenance',
          'Industrial RO organic fouling control',
          'Desalination membrane cleaning'
        ],
        technicalSpecs: [
          'Active ingredient: Sodium hydroxide 0.1-0.5%',
          'pH: 11-12 (highly alkaline)',
          'Cleaning cycle: 1-2 hours',
          'Temperature: 30-35°C maximum',
          'Compatible with polyamide membranes',
          'Includes surfactants and dispersants',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'membrane-cleaner-ro',
      title: 'Membrane Cleaner',
      description: 'Comprehensive cleaning solution for RO membrane maintenance and restoration.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['RO membrane cleaner', 'Membrane cleaning solution', 'RO maintenance chemical', 'All-purpose membrane cleaner', 'Universal RO cleaner'],
        seoKeywords: ['membrane cleaner Oman', 'RO cleaning Muscat', 'membrane maintenance Oman', 'RO cleaner Sohar', 'membrane restoration Oman'],
        longDescription: 'Universal Membrane Cleaner supplier in Oman - Global Chemicals LLC provides comprehensive RO membrane cleaning solutions for reverse osmosis and ultrafiltration systems in Muscat, Sohar, Duqm, Salalah. Our all-purpose membrane cleaner effectively removes mixed fouling including scale, organics, biofilms, and particulate matter in a single cleaning step. The balanced formulation combines chelating agents, surfactants, and pH buffers for versatile cleaning performance. Essential for routine preventive maintenance, emergency flux restoration, and general membrane care. The cleaner penetrates fouling layers, lifts deposits, and disperses contaminants for easy removal. Reduces downtime by eliminating multi-step cleaning procedures. Safe for all thin-film composite membranes. Widely used in municipal water treatment, industrial RO, and desalination facilities across Oman for maintaining optimal membrane performance.',
        applications: [
          'Routine RO membrane cleaning',
          'Mixed fouling removal',
          'Preventive maintenance programs',
          'Flux restoration treatments',
          'Emergency membrane cleaning',
          'UF and MF membrane maintenance',
          'Desalination system cleaning',
          'Industrial water treatment RO care'
        ],
        technicalSpecs: [
          'All-in-one cleaning formulation',
          'Typical dosage: 1-3% solution',
          'pH: 4-10 (neutral to mildly alkaline)',
          'Cleaning cycle: 1-3 hours',
          'Temperature: Ambient to 40°C',
          'Compatible with all composite membranes',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'antiscalant-ro',
      title: 'Antiscalant RO',
      description: 'Scale inhibitor for preventing mineral deposits on reverse osmosis membranes.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['RO antiscalant', 'Scale inhibitor', 'Membrane antiscalant', 'RO scale preventive', 'Membrane scale inhibitor'],
        seoKeywords: ['antiscalant RO Oman', 'scale inhibitor Muscat', 'RO antiscalant Oman', 'membrane antiscalant Sohar', 'scale prevention RO Oman'],
        longDescription: 'RO Antiscalant supplier in Oman - Global Chemicals LLC provides high-performance scale inhibitors for reverse osmosis membrane protection in Muscat, Sohar, Duqm, Salalah. Our RO antiscalant prevents formation of calcium carbonate, calcium sulfate, barium sulfate, strontium sulfate, and silica scales on membrane surfaces. The advanced polymer formulation controls scale formation, extends cleaning intervals, and maintains consistent membrane performance. Essential for high-recovery RO systems, brackish water treatment, and challenging feed water conditions. The antiscalant disperses particles, inhibits crystal growth, and prevents membrane scaling. Reduces chemical cleaning frequency, lowers operating costs, and extends membrane life. Suitable for all standard polyamide membranes. Widely used in desalination, industrial water treatment, and municipal RO facilities across Oman.',
        applications: [
          'RO membrane scale prevention',
          'High-recovery desalination systems',
          'Brackish water RO treatment',
          'Sea water RO pretreatment',
          'Industrial process water RO',
          'Municipal drinking water RO',
          'Wastewater RO systems',
          'Membrane life extension programs'
        ],
        technicalSpecs: [
          'Active ingredients: Phosphonates and polymers',
          'Dosage: 2-5 ppm in RO feed water',
          'Effective pH range: 3-10',
          'Maximum scaling index: LSI +2.8',
          'Compatible with chlorine and coagulants',
          'NSF/ANSI 60 certified (drinking water)',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'membrane-alka-cleaner',
      title: 'Membrane Alka Cleaner',
      description: 'Alkaline formulation for removing organic and biological fouling from membranes.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['Alkaline membrane cleaner', 'Alka cleaner', 'Organic fouling remover', 'High pH membrane cleaner', 'Biological fouling cleaner'],
        seoKeywords: ['membrane alka cleaner Oman', 'alkaline cleaner Muscat', 'fouling remover Oman', 'alka cleaner RO Sohar', 'organic fouling removal Oman'],
        longDescription: 'Membrane Alka Cleaner supplier in Oman - Global Chemicals LLC provides alkaline cleaning formulations for RO and UF membrane organic fouling removal in Muscat, Sohar, Duqm, Salalah. Our Alka Cleaner targets stubborn organic deposits, biofilms, natural organic matter (NOM), humic substances, and proteinaceous fouling on membrane surfaces. The optimized alkaline blend includes surfactants, chelating agents, and dispersants for maximum cleaning efficiency. Essential for surface water RO systems, wastewater treatment membranes, and applications with high organic loading. The formulation penetrates biofilm matrices, solubilizes organic compounds, and prevents redeposition. Regular alkaline cleaning maintains membrane permeability and prevents irreversible fouling. Safe for thin-film composite membranes when used properly. Widely used in municipal water treatment, industrial process water, and wastewater RO facilities across Oman.',
        applications: [
          'Organic fouling removal from RO membranes',
          'Biofilm and biological slime cleaning',
          'Natural organic matter (NOM) removal',
          'Proteinaceous fouling treatment',
          'Surface water RO membrane maintenance',
          'Wastewater RO membrane cleaning',
          'UF and MF membrane organic fouling control',
          'Two-stage cleaning alkaline phase'
        ],
        technicalSpecs: [
          'pH: 11-12 (alkaline formulation)',
          'Typical dosage: 0.5-2% solution',
          'Cleaning time: 30-60 minutes',
          'Temperature: 25-35°C',
          'Contains surfactants and chelating agents',
          'Safe for polyamide membranes',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'membrane-antiscalant-ro',
      title: 'Membrane Antiscalant RO',
      description: 'Advanced antiscalant for comprehensive membrane scale prevention.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['Advanced antiscalant', 'Scale preventive', 'RO scale inhibitor', 'Premium antiscalant', 'High-performance scale inhibitor'],
        seoKeywords: ['membrane antiscalant Oman', 'advanced antiscalant Muscat', 'scale prevention Oman', 'premium antiscalant Sohar', 'RO scale inhibitor Oman'],
        longDescription: 'Advanced Membrane Antiscalant supplier in Oman - Global Chemicals LLC provides premium scale inhibitors for demanding RO membrane applications in Muscat, Sohar, Duqm, Salalah. Our advanced antiscalant formulation offers superior protection against calcium carbonate, calcium sulfate, barium sulfate, strontium sulfate, silica, and iron deposits. The state-of-the-art polymer technology provides maximum scale inhibition even in high-recovery systems and challenging water chemistry. Essential for sea water desalination, high-hardness brackish water, and extreme operating conditions. The formulation includes dispersants to prevent particle agglomeration and fouling. Enables higher system recovery rates, reduces chemical cleaning frequency, and maximizes membrane life. Compatible with all major membrane brands. Widely used in large-scale desalination, industrial RO, and high-performance water treatment systems across Oman.',
        applications: [
          'Sea water reverse osmosis (SWRO)',
          'High-recovery RO systems (>85%)',
          'High-hardness brackish water treatment',
          'Difficult water chemistry applications',
          'Large-scale desalination plants',
          'Industrial high-TDS water treatment',
          'Maximum recovery RO operations',
          'Challenging scale-forming conditions'
        ],
        technicalSpecs: [
          'Advanced polymer and phosphonate blend',
          'Dosage: 3-8 ppm depending on water quality',
          'Effective pH range: 3-11',
          'Maximum LSI: +3.0',
          'Silica scale inhibition up to 200 ppm',
          'NSF/ANSI 60 certified',
          'Available in 25kg, 200kg drums, IBCs, bulk'
        ]
      },
    },

    // Cooling Water Chemicals
    {
      id: 'corrosion-inhibitor-closed-loop',
      title: 'Corrosion Inhibitor Closed Loop',
      description: 'Corrosion protection for closed-loop cooling water systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Closed loop inhibitor', 'Chiller corrosion inhibitor', 'Closed system treatment', 'Closed circuit inhibitor', 'Chiller protection chemical'],
        seoKeywords: ['corrosion inhibitor closed loop Oman', 'chiller treatment Muscat', 'closed system Oman', 'closed circuit inhibitor Sohar', 'chiller corrosion Oman'],
        longDescription: 'Closed Loop Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides specialized corrosion protection for closed-loop cooling systems, chillers, and HVAC applications in Muscat, Sohar, Duqm, Salalah. Our closed loop inhibitor formulation provides long-term corrosion protection for multi-metal systems including steel, copper, aluminum, and stainless steel. The product forms protective films on metal surfaces, prevents galvanic corrosion, and maintains system efficiency. Essential for chilled water systems, district cooling, process cooling loops, and heat pump applications. The inhibitor maintains stable pH, prevents scale formation, and eliminates the need for frequent makeup water. One-time charge provides season-long or multi-year protection. Widely used in commercial buildings, data centers, manufacturing facilities, and district cooling plants across Oman.',
        applications: [
          'Chilled water system protection',
          'District cooling corrosion control',
          'HVAC closed-loop treatment',
          'Process cooling loop protection',
          'Heat pump systems',
          'Data center cooling systems',
          'Multi-metal system protection',
          'Long-term corrosion prevention'
        ],
        technicalSpecs: [
          'Multi-metal corrosion inhibitor blend',
          'Dosage: 1-5% initial charge',
          'pH control: Maintains 8.5-10.0',
          'Protection duration: 1-3 years',
          'Prevents galvanic corrosion',
          'Includes scale inhibitor',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'algae-control',
      title: 'Algae Control',
      description: 'Algaecide for preventing algae growth in cooling towers and water systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        casNumber: '7173-51-5',
        alternativeNames: ['Algaecide', 'Algae inhibitor', 'Cooling tower algaecide', 'Algae prevention chemical', 'Non-oxidizing algaecide'],
        seoKeywords: ['algae control Oman', 'algaecide cooling tower Muscat', 'algae prevention Oman', 'cooling tower algaecide Sohar', 'algae inhibitor Oman'],
        longDescription: 'Algae Control solution supplier in Oman - Global Chemicals LLC provides effective algaecides for cooling towers, open recirculating systems, and industrial water systems in Muscat, Sohar, Duqm, Salalah. Our algae control formulation prevents and eliminates green algae, blue-green algae (cyanobacteria), and other photosynthetic organisms that reduce heat transfer efficiency and promote fouling. The non-oxidizing algaecide provides long-lasting protection without contributing to corrosion or scale formation. Essential for maintaining clean heat transfer surfaces, preventing slime formation, and ensuring optimal cooling tower performance. Algae control improves system efficiency, reduces biofouling, and extends equipment life. Particularly important in Oman\'s sunny climate where algae growth is accelerated. Widely used in power plants, refineries, industrial facilities, and commercial cooling systems.',
        applications: [
          'Cooling tower algae prevention',
          'Open recirculating system treatment',
          'Heat exchanger fouling prevention',
          'Green algae elimination',
          'Blue-green algae (cyanobacteria) control',
          'Fill media algae prevention',
          'Basin and sump algae treatment',
          'Slime and biofilm prevention'
        ],
        technicalSpecs: [
          'Type: Non-oxidizing quaternary compound',
          'Dosage: 10-50 ppm initial, 5-10 ppm maintenance',
          'Effective against: Green and blue-green algae',
          'pH range: 6-9',
          'Compatible with corrosion inhibitors',
          'Long-lasting residual activity',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'biological-guard-antifouling',
      title: 'Biological Guard Antifouling',
      description: 'Biocide for controlling biological fouling in cooling water systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Biofouling control', 'Biological inhibitor', 'Antifouling biocide', 'Biofilm control', 'Microbial fouling prevention'],
        seoKeywords: ['biological guard Oman', 'antifouling Muscat', 'biofouling control Oman', 'biofilm control Sohar', 'microbial prevention Oman'],
        longDescription: 'Biological Guard Antifouling supplier in Oman - Global Chemicals LLC provides broad-spectrum biocides for controlling biological fouling in cooling water systems in Muscat, Sohar, Duqm, Salalah. Our Biological Guard formulation prevents and eliminates bacteria, algae, fungi, and biofilm formation in cooling towers, heat exchangers, and recirculating water systems. The powerful biocide maintains clean heat transfer surfaces, prevents microbiologically-influenced corrosion (MIC), and ensures optimal system efficiency. Essential for protecting against Legionella bacteria, controlling slime-forming organisms, and preventing biofouling in warm water conditions. The product provides rapid kill rates and residual protection. Suitable for oxidizing and non-oxidizing biocide programs. Widely used in power plants, refineries, petrochemical facilities, and commercial cooling systems across Oman.',
        applications: [
          'Cooling tower biological control',
          'Biofilm prevention in heat exchangers',
          'Legionella bacteria control',
          'Slime-forming organism elimination',
          'Microbiologically-influenced corrosion (MIC) prevention',
          'Open recirculating system biocide',
          'Process cooling water treatment',
          'Industrial cooling system protection'
        ],
        technicalSpecs: [
          'Broad-spectrum biocide formulation',
          'Dosage: 25-100 ppm shock, 10-25 ppm continuous',
          'Rapid kill rate: <30 minutes',
          'Effective against: Bacteria, algae, fungi',
          'pH range: 6-9',
          'Residual activity: 3-7 days',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'micro-biocid-cooling-water',
      title: 'Micro Biocid Cooling Water',
      description: 'Microbiocide for microbial control in cooling tower applications.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Microbiocide', 'Microbial control', 'Cooling tower biocide', 'Bacteria killer', 'Microbial inhibitor'],
        seoKeywords: ['microbiocide Oman', 'cooling tower biocide Muscat', 'microbial control Oman', 'bacteria control cooling tower Sohar', 'micro biocide Oman'],
        longDescription: 'Micro Biocide for Cooling Water supplier in Oman - Global Chemicals LLC provides powerful microbiocides for microbial control in cooling tower systems in Muscat, Sohar, Duqm, Salalah. Our Micro Biocid formulation delivers rapid kill of bacteria, algae, and fungi in cooling water, preventing biofilm formation and maintaining system cleanliness. The broad-spectrum biocide is effective against aerobic and anaerobic bacteria, controlling microbial growth that causes fouling, corrosion, and efficiency losses. Essential for preventing Legionella proliferation, eliminating slime deposits, and maintaining heat transfer efficiency. The fast-acting formula provides quick microorganism knockdown with residual protection. Compatible with most cooling water treatment programs. Widely used in refineries, power generation, petrochemical plants, and industrial cooling applications across Oman.',
        applications: [
          'Cooling tower microbiological control',
          'Bacteria and algae elimination',
          'Legionella control and prevention',
          'Biofilm removal and prevention',
          'Slime deposit control',
          'Heat exchanger biofouling prevention',
          'Recirculating water microbial treatment',
          'Cooling system efficiency maintenance'
        ],
        technicalSpecs: [
          'Broad-spectrum non-oxidizing biocide',
          'Dosage: 50-150 ppm shock treatment',
          'Maintenance: 15-30 ppm',
          'Kill time: 15-30 minutes',
          'Effective pH range: 6-9.5',
          'Compatible with inhibitor programs',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'biocide-cooling',
      title: 'Biocide',
      description: 'Broad-spectrum biocide for cooling water treatment and microbial control.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Broad spectrum biocide', 'Cooling water biocide', 'Antimicrobial agent', 'Universal biocide', 'Multi-target biocide'],
        seoKeywords: ['biocide cooling water Oman', 'antimicrobial Muscat', 'cooling tower biocide Oman', 'broad spectrum biocide Sohar', 'water treatment biocide Oman'],
        longDescription: 'Broad-Spectrum Biocide for Cooling Water supplier in Oman - Global Chemicals LLC provides comprehensive antimicrobial solutions for cooling tower and recirculating water systems in Muscat, Sohar, Duqm, Salalah. Our broad-spectrum biocide effectively controls bacteria, algae, fungi, and slime-forming organisms in cooling water applications. The multi-target formulation provides rapid microorganism kill, prevents biofilm formation, and maintains system cleanliness. Essential for controlling microbial-induced fouling, preventing microbiologically-influenced corrosion (MIC), and ensuring optimal heat transfer. The biocide works synergistically with oxidizing treatments for comprehensive biological control. Suitable for industrial, commercial, and power generation cooling systems. Provides residual antimicrobial protection between treatments. Widely used across all industries in Oman requiring reliable cooling water microbial control.',
        applications: [
          'Cooling tower comprehensive microbial control',
          'Broad-spectrum bacteria elimination',
          'Algae and fungi control',
          'Biofilm prevention and removal',
          'MIC (microbiologically-influenced corrosion) prevention',
          'Industrial cooling water treatment',
          'Power plant cooling systems',
          'Process cooling water biocide programs'
        ],
        technicalSpecs: [
          'Multi-target broad-spectrum activity',
          'Dosage: 30-100 ppm depending on contamination',
          'Rapid kill action',
          'Effective pH: 6-9',
          'Residual activity: 3-5 days',
          'Compatible with oxidizing biocides',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'hardness-control-boiler',
      title: 'Hardness Control Boiler Treatment',
      description: 'Chemical treatment for controlling water hardness in boiler systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Boiler hardness control', 'Scale inhibitor boiler', 'Water hardness treatment', 'Boiler water softener', 'Hardness precipitation chemical'],
        seoKeywords: ['hardness control Oman', 'boiler treatment Muscat', 'scale control Oman', 'boiler water treatment Sohar', 'hardness inhibitor Oman'],
        longDescription: 'Hardness Control Boiler Treatment supplier in Oman - Global Chemicals LLC provides water hardness control chemicals for boiler and cooling systems in Muscat, Sohar, Duqm, Salalah. Our hardness control formulation prevents scale formation by sequestering calcium and magnesium ions, preventing their precipitation as hard scale deposits. The chelating and dispersing agents keep hardness minerals suspended in solution, allowing blowdown removal. Essential for boilers, cooling towers, and industrial water systems with high hardness feed water. Prevents scale buildup on heat transfer surfaces, maintains thermal efficiency, and extends equipment life. The treatment reduces energy consumption, prevents tube failures, and minimizes maintenance. Compatible with corrosion inhibitors and biocides. Widely used in power plants, industrial boilers, and process water systems across Oman.',
        applications: [
          'Boiler water scale prevention',
          'Cooling tower hardness control',
          'Industrial water system treatment',
          'Calcium and magnesium sequestration',
          'Heat transfer surface protection',
          'Energy efficiency maintenance',
          'Tube and pipe scale prevention',
          'Process water hardness control'
        ],
        technicalSpecs: [
          'Active ingredients: Phosphonates and polymers',
          'Dosage: 5-20 ppm depending on hardness',
          'Effective pH: 7-10',
          'Prevents CaCO3 and CaSO4 scale',
          'Disperses calcium and magnesium',
          'Compatible with boiler treatment programs',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'biocide-closed-loop-chiller',
      title: 'Biocide For Closed Loop Chiller Water',
      description: 'Specialized biocide for closed-loop chiller water systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Chiller biocide', 'Closed loop biocide', 'Chiller water treatment', 'Closed system biocide', 'Chiller antimicrobial'],
        seoKeywords: ['chiller biocide Oman', 'closed loop treatment Muscat', 'chiller water biocide Oman', 'closed system biocide Sohar', 'chiller antimicrobial Oman'],
        longDescription: 'Closed Loop Chiller Biocide supplier in Oman - Global Chemicals LLC provides specialized biocides for microbiological control in closed-loop chiller systems in Muscat, Sohar, Duqm, Salalah. Our chiller biocide formulation prevents bacterial contamination, biofilm formation, and microbial-induced fouling in closed chilled water circuits. Even in closed systems, bacteria can proliferate from makeup water introduction and create slime, reduce heat transfer, and cause microbiologically-influenced corrosion. Essential for maintaining system efficiency, preventing biological contamination, and ensuring long-term system reliability. The biocide provides season-long protection with minimal dosing requirements. Particularly important for systems with poor makeup water quality or outdoor cooling towers. Widely used in HVAC systems, data centers, process cooling, and district cooling facilities across Oman.',
        applications: [
          'Closed chilled water system treatment',
          'HVAC chiller biological control',
          'Data center cooling system protection',
          'Process chiller biocide treatment',
          'District cooling closed-loop control',
          'Biofilm prevention in chillers',
          'MIC prevention in closed circuits',
          'Long-term microbial control'
        ],
        technicalSpecs: [
          'Non-oxidizing biocide formulation',
          'Dosage: 50-100 ppm initial, 10-25 ppm maintenance',
          'Protection duration: 90-180 days',
          'pH range: 8-10',
          'Compatible with corrosion inhibitors',
          'Low toxicity formulation',
          'Available in 25kg drums, IBCs'
        ]
      },
    },
    {
      id: 'cool-water-treat-corrosion',
      title: 'Cool Water Treat Corrosion Inhibitor',
      description: 'Corrosion inhibitor formulated for cooling water treatment applications.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Cooling water inhibitor', 'Corrosion treatment', 'Cooling tower inhibitor', 'CWT corrosion inhibitor', 'Open system inhibitor'],
        seoKeywords: ['cooling water corrosion inhibitor Oman', 'corrosion treatment Muscat', 'cooling tower Oman', 'open system inhibitor Sohar', 'CWT inhibitor Oman'],
        longDescription: 'Cooling Water Corrosion Inhibitor supplier in Oman - Global Chemicals LLC provides specialized corrosion control chemicals for open recirculating cooling systems in Muscat, Sohar, Duqm, Salalah. Our Cool Water Treat formulation protects multi-metal systems including carbon steel, stainless steel, copper alloys, and aluminum from corrosion in cooling towers and heat exchangers. The balanced inhibitor package forms protective films, passivates metal surfaces, and prevents galvanic corrosion in mixed-metal systems. Essential for maintaining system integrity, preventing leaks, and extending equipment life. The formulation includes scale and deposit control agents for comprehensive water treatment. Reduces corrosion rates by 90%+ when properly applied. Compatible with biocides and dispersants. Widely used in refineries, power plants, petrochemical facilities, and industrial cooling systems across Oman.',
        applications: [
          'Cooling tower corrosion protection',
          'Multi-metal system corrosion control',
          'Heat exchanger protection',
          'Open recirculating system treatment',
          'Carbon steel corrosion prevention',
          'Copper and brass protection',
          'Galvanic corrosion prevention',
          'Industrial cooling water treatment'
        ],
        technicalSpecs: [
          'Multi-metal corrosion inhibitor blend',
          'Dosage: 20-100 ppm depending on system',
          'pH control range: 7.5-9.0',
          'Includes scale and deposit control',
          'Reduces corrosion rates >90%',
          'Compatible with oxidizing biocides',
          'Available in 25kg, 200kg drums, IBCs, bulk'
        ]
      },
    },
    {
      id: 'altreat-4000',
      title: 'Altreat 4000',
      description: 'All-in-one cooling water treatment chemical for comprehensive system protection.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['All-in-one treatment', 'Cooling water treatment', 'Complete water treatment', 'Altreat program', 'Single-product treatment'],
        seoKeywords: ['Altreat 4000 Oman', 'cooling water treatment Muscat', 'all-in-one treatment Oman', 'complete cooling treatment Sohar', 'single product treatment Oman'],
        longDescription: 'Altreat 4000 supplier in Oman - Global Chemicals LLC provides all-in-one cooling water treatment programs for comprehensive system protection in Muscat, Sohar, Duqm, Salalah. Our Altreat 4000 combines corrosion inhibition, scale control, and deposit prevention in a single product, simplifying chemical feed and reducing inventory. The advanced formulation protects multi-metal systems, prevents scale formation, disperses suspended solids, and maintains system cleanliness. Essential for small to medium cooling systems requiring simplified treatment without multiple chemical feeds. The all-in-one approach reduces operator complexity, minimizes chemical handling, and ensures balanced treatment. Provides cost-effective protection for cooling towers, closed loops, and once-through systems. Ideal for commercial buildings, manufacturing facilities, and operations preferring simplified chemical programs. Widely used across Oman for efficient, economical cooling water treatment.',
        applications: [
          'Simplified cooling tower treatment',
          'Single-product cooling water programs',
          'Small to medium cooling system protection',
          'Commercial building HVAC treatment',
          'Manufacturing facility cooling',
          'Reduced inventory operations',
          'Operator-friendly treatment programs',
          'Cost-effective comprehensive protection'
        ],
        technicalSpecs: [
          'All-in-one: Corrosion + scale + deposit control',
          'Dosage: 50-150 ppm',
          'Multi-metal protection',
          'pH control: 7.5-9.0',
          'Single feed point simplicity',
          'Reduces chemical inventory',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'corro-guard-antifoulant',
      title: 'Corro Guard For Antifoulant for Cooling Water',
      description: 'Dual-action corrosion inhibitor and antifoulant for cooling water systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Corrosion guard', 'Dual action inhibitor', 'Antifouling inhibitor', 'Corro guard treatment', 'Combined inhibitor-dispersant'],
        seoKeywords: ['corro guard Oman', 'antifoulant Muscat', 'corrosion inhibitor Oman', 'dual action treatment Sohar', 'antifouling cooling water Oman'],
        longDescription: 'Corro Guard Antifoulant supplier in Oman - Global Chemicals LLC provides dual-action corrosion and fouling control for cooling water systems in Muscat, Sohar, Duqm, Salalah. Our Corro Guard formulation combines corrosion inhibition with antifouling properties, providing comprehensive protection in a single chemical. The product prevents metal corrosion while dispersing suspended solids, preventing scale formation, and controlling deposit buildup. Essential for cooling towers operating with challenging water quality, high particulate loading, or scaling conditions. The dual-action technology reduces chemical feed complexity and ensures balanced system protection. Provides cost-effective treatment by eliminating separate dispersant products. Maintains heat transfer efficiency and protects equipment integrity. Widely used in refineries, petrochemical plants, power generation, and industrial cooling applications across Oman.',
        applications: [
          'Cooling tower dual-action protection',
          'Corrosion and fouling prevention',
          'High-solids water treatment',
          'Deposit control in cooling systems',
          'Scale and silt dispersal',
          'Multi-metal corrosion protection',
          'Heat transfer efficiency maintenance',
          'Simplified treatment programs'
        ],
        technicalSpecs: [
          'Dual-action: Corrosion inhibitor + dispersant',
          'Dosage: 30-100 ppm',
          'Multi-metal protection',
          'Disperses suspended solids',
          'pH range: 7.0-9.0',
          'Compatible with biocides',
          'Available in 25kg, 200kg drums, IBCs'
        ]
      },
    },
    {
      id: 'antifouling-liquid',
      title: 'Antifouling Liquid',
      description: 'Liquid antifoulant for preventing deposits and fouling in cooling systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Antifoulant liquid', 'Fouling inhibitor', 'Scale dispersant', 'Deposit control chemical', 'Sludge dispersant'],
        seoKeywords: ['antifouling liquid Oman', 'fouling control Muscat', 'scale dispersant Oman', 'deposit prevention Sohar', 'cooling tower antifoulant Oman'],
        longDescription: 'Antifouling Liquid supplier in Oman - Global Chemicals LLC provides deposit control and fouling prevention chemicals for cooling water systems in Muscat, Sohar, Duqm, Salalah. Our antifouling liquid disperses suspended solids, prevents deposition on heat transfer surfaces, and keeps particulates in suspension for blowdown removal. The polymer and surfactant formulation prevents scale formation, controls silt and mud deposition, and maintains system cleanliness. Essential for cooling towers with high makeup water turbidity, industrial process cooling, or systems prone to fouling. The liquid format provides easy feed and consistent dosing. Antifouling treatment maintains heat transfer efficiency, reduces cleaning frequency, and prevents under-deposit corrosion. Widely used in power plants, refineries, and industrial facilities across Oman with challenging water quality.',
        applications: [
          'Cooling tower deposit prevention',
          'Heat exchanger fouling control',
          'Suspended solids dispersion',
          'Silt and mud prevention',
          'Particulate fouling control',
          'Scale crystal dispersion',
          'Under-deposit corrosion prevention',
          'High-turbidity water treatment'
        ],
        technicalSpecs: [
          'Dispersant and antifoulant formulation',
          'Dosage: 10-50 ppm',
          'Prevents scale and deposit formation',
          'Disperses suspended solids',
          'pH range: 6-9',
          'Compatible with inhibitors and biocides',
          'Available in 25kg, 200kg drums, IBCs'
        ]
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
      id: 'caustic-soda-flakes-soap',
      title: 'Caustic Soda Flakes',
      description: 'Sodium hydroxide flakes for saponification in soap and detergent manufacturing.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Sodium hydroxide flakes', 'NaOH flakes', 'Caustic soda'],
        seoKeywords: ['caustic soda flakes Oman', 'sodium hydroxide Muscat', 'NaOH Oman'],
      },
    },
    {
      id: 'caustic-soda-liquid-soap',
      title: 'Caustic Soda Liquid',
      description: 'Liquid sodium hydroxide for industrial cleaning and detergent formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Sodium hydroxide liquid', 'Caustic soda solution', 'Lye'],
        seoKeywords: ['caustic soda liquid Oman', 'sodium hydroxide solution Muscat', 'lye Oman'],
      },
    },
    {
      id: 'caustic-soda-prills-soap',
      title: 'Caustic Soda Prills',
      description: 'High-purity sodium hydroxide beads for precise detergent formulation.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'NaOH',
        casNumber: '1310-73-2',
        alternativeNames: ['Sodium hydroxide prills', 'NaOH beads', 'Caustic soda pearls'],
        seoKeywords: ['caustic soda prills Oman', 'NaOH prills Muscat', 'sodium hydroxide beads Oman'],
      },
    },
    {
      id: 'edta-powder-soap',
      title: 'EDTA Powder',
      description: 'Chelating agent for water hardness control in detergent products.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'C10H16N2O8',
        casNumber: '60-00-4',
        alternativeNames: ['Ethylenediaminetetraacetic acid', 'EDTA', 'Chelating agent'],
        seoKeywords: ['EDTA powder Oman', 'chelating agent Muscat', 'water softener Oman'],
      },
    },
    {
      id: 'glycerine-soap',
      title: 'Glycerine',
      description: 'Humectant and moisturizer for soap and personal care formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'C3H8O3',
        casNumber: '56-81-5',
        alternativeNames: ['Glycerol', 'Glycerin', 'Propane-1,2,3-triol'],
        seoKeywords: ['glycerine soap Oman', 'glycerol Muscat', 'humectant Oman'],
      },
    },
    {
      id: 'hydrogen-peroxide-3',
      title: 'Hydrogen Peroxide 3%',
      description: 'Low concentration bleaching agent for mild cleaning applications.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'H2O2',
        casNumber: '7722-84-1',
        alternativeNames: ['Hydrogen peroxide 3%', 'H2O2 3%'],
        seoKeywords: ['hydrogen peroxide 3% Oman', 'H2O2 Muscat', 'bleaching agent Oman'],
      },
    },
    {
      id: 'hydrogen-peroxide-35',
      title: 'Hydrogen Peroxide 35%',
      description: 'Medium strength oxidizing agent for industrial detergent formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'H2O2',
        casNumber: '7722-84-1',
        alternativeNames: ['Hydrogen peroxide 35%', 'H2O2 35%'],
        seoKeywords: ['hydrogen peroxide 35% Oman', 'H2O2 35% Muscat', 'oxidizing agent Oman'],
      },
    },
    {
      id: 'hydrogen-peroxide-50',
      title: 'Hydrogen Peroxide 50%',
      description: 'High concentration bleaching agent for heavy-duty cleaning products.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'H2O2',
        casNumber: '7722-84-1',
        alternativeNames: ['Hydrogen peroxide 50%', 'H2O2 50%'],
        seoKeywords: ['hydrogen peroxide 50% Oman', 'H2O2 50% Muscat', 'bleach Oman'],
      },
    },
    {
      id: 'hydrogen-peroxide-6',
      title: 'Hydrogen Peroxide 6%',
      description: 'Moderate concentration for bleaching and sanitizing applications.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'H2O2',
        casNumber: '7722-84-1',
        alternativeNames: ['Hydrogen peroxide 6%', 'H2O2 6%'],
        seoKeywords: ['hydrogen peroxide 6% Oman', 'H2O2 6% Muscat', 'sanitizer Oman'],
      },
    },
    {
      id: 'labsa',
      title: 'LABSA',
      description: 'Linear Alkylbenzene Sulphonic Acid - primary surfactant for detergent production.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        casNumber: '27176-87-0',
        alternativeNames: ['Linear alkylbenzene sulfonic acid', 'LABSA', 'Dodecylbenzenesulfonic acid'],
        seoKeywords: ['LABSA Oman', 'surfactant Muscat', 'detergent raw material Oman'],
      },
    },
    {
      id: 'nonyl-phenol-ethoxylate',
      title: 'Nonyl Phenol Ethoxylate',
      description: 'Non-ionic surfactant for industrial and household cleaning products.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        casNumber: '9016-45-9',
        alternativeNames: ['NPE', 'Nonyl phenol ethoxylate', 'NP ethoxylate'],
        seoKeywords: ['nonyl phenol ethoxylate Oman', 'NPE Muscat', 'surfactant Oman'],
      },
    },
    {
      id: 'perchloroethylene',
      title: 'Perchloroethylene',
      description: 'Solvent for dry cleaning and degreasing applications.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'C2Cl4',
        casNumber: '127-18-4',
        alternativeNames: ['Tetrachloroethylene', 'PERC', 'PCE'],
        seoKeywords: ['perchloroethylene Oman', 'dry cleaning solvent Muscat', 'PERC Oman'],
      },
    },
    {
      id: 'sles-70',
      title: 'SLES 70%',
      description: 'Sodium Lauryl Ether Sulfate - foaming agent and surfactant for detergents.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        casNumber: '68585-34-2',
        alternativeNames: ['Sodium laureth sulfate', 'SLES', 'Sodium lauryl ether sulfate'],
        seoKeywords: ['SLES 70% Oman', 'sodium laureth sulfate Muscat', 'foaming agent Oman'],
      },
    },
    {
      id: 'soda-ash-dense-soap',
      title: 'Soda Ash Dense',
      description: 'Sodium carbonate for pH adjustment and water softening in detergents.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'Na2CO3',
        casNumber: '497-19-8',
        alternativeNames: ['Sodium carbonate dense', 'Washing soda dense'],
        seoKeywords: ['soda ash dense Oman', 'sodium carbonate Muscat', 'washing soda Oman'],
      },
    },
    {
      id: 'soda-ash-light-soap',
      title: 'Soda Ash Light',
      description: 'Light density sodium carbonate for soap and detergent formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'Na2CO3',
        casNumber: '497-19-8',
        alternativeNames: ['Sodium carbonate light', 'Washing soda light'],
        seoKeywords: ['soda ash light Oman', 'sodium carbonate light Muscat', 'detergent raw material Oman'],
      },
    },
    {
      id: 'sodium-hypochlorite-12-15-soap',
      title: 'Sodium Hypochlorite 12-15%',
      description: 'Bleaching and disinfecting agent for cleaning product formulations.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'NaOCl',
        casNumber: '7681-52-9',
        alternativeNames: ['Liquid chlorine', 'Bleach', 'Sodium hypochlorite solution'],
        seoKeywords: ['sodium hypochlorite Oman', 'bleach Muscat', 'disinfectant Oman'],
      },
    },
    {
      id: 'sodium-meta-silicate-pentahydrate',
      title: 'Sodium Meta Silicate Pentahydrate',
      description: 'Alkaline builder and corrosion inhibitor for heavy-duty detergents.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'Na2SiO3·5H2O',
        casNumber: '6834-92-0',
        alternativeNames: ['Sodium metasilicate pentahydrate', 'SMS pentahydrate'],
        seoKeywords: ['sodium metasilicate Oman', 'detergent builder Muscat', 'SMS Oman'],
      },
    },
    {
      id: 'sodium-tripolyphosphate',
      title: 'Sodium Tripolyphosphate',
      description: 'Sequestering agent and detergency builder for laundry detergents.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'Na5P3O10',
        casNumber: '7758-29-4',
        alternativeNames: ['STPP', 'Sodium triphosphate', 'Pentasodium triphosphate'],
        seoKeywords: ['STPP Oman', 'sodium tripolyphosphate Muscat', 'detergent builder Oman'],
      },
    },
    {
      id: 'surfactants-soap',
      title: 'Surfactants',
      description: 'Range of surface active agents for cleaning and emulsifying applications.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        alternativeNames: ['Surface active agents', 'Surfactants', 'Wetting agents'],
        seoKeywords: ['surfactants Oman', 'surface active agents Muscat', 'emulsifiers Oman'],
      },
    },
    {
      id: 'trisodium-phosphate-soap',
      title: 'Trisodium Phosphate',
      description: 'Heavy-duty cleaning agent and degreaser for industrial applications.',
      category: 'soap-detergent',
      icon: Sparkles,
      details: {
        formula: 'Na3PO4',
        casNumber: '7601-54-9',
        alternativeNames: ['TSP', 'Trisodium orthophosphate', 'Na3PO4'],
        seoKeywords: ['trisodium phosphate Oman', 'TSP Muscat', 'heavy duty cleaner Oman'],
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
