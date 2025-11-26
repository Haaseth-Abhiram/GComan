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
        alternativeNames: ['Sodium borate', 'Sodium tetraborate decahydrate', 'Borax decahydrate'],
        seoKeywords: ['borax Oman', 'sodium borate Muscat', 'borax powder Oman'],
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
        alternativeNames: ['Boracic acid', 'Hydrogen borate', 'Orthoboric acid'],
        seoKeywords: ['boric acid Oman', 'boracic acid Muscat', 'boric acid powder Oman'],
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
        alternativeNames: ['2-Butoxyethanol', 'Butyl cellosolve', 'Ethylene glycol monobutyl ether'],
        seoKeywords: ['butyl glycol Oman', 'butyl cellosolve Muscat', 'solvent Oman'],
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
        alternativeNames: ['Calcium dibromide', 'CaBr2 brine'],
        seoKeywords: ['calcium bromide Oman', 'completion fluid Muscat', 'drilling brine Oman'],
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
        alternativeNames: ['Citric acid monohydrate', 'Food grade citric acid'],
        seoKeywords: ['citric acid food grade Oman', 'citric acid Muscat', 'acidizing agent Oman'],
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
        alternativeNames: ['Calcium dichloride', 'CaCl2 brine'],
        seoKeywords: ['calcium chloride Oman', 'completion brine Muscat', 'CaCl2 Oman'],
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
        alternativeNames: ['Citric acid solution', 'Liquid citric acid'],
        seoKeywords: ['citric acid liquid Oman', 'acidizing agent Muscat', 'well stimulation Oman'],
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
        alternativeNames: ['Citric acid anhydrous', 'Citric acid crystals'],
        seoKeywords: ['citric acid powder Oman', 'scale remover Muscat', 'acidizing powder Oman'],
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
        alternativeNames: ['Carboxymethyl cellulose', 'CMC', 'Sodium CMC'],
        seoKeywords: ['CMC Oman', 'carboxymethylcellulose Muscat', 'drilling fluid additive Oman'],
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
        alternativeNames: ['DEF', 'AdBlue', 'Urea solution 32.5%'],
        seoKeywords: ['DEF Oman', 'diesel exhaust fluid Muscat', 'AdBlue Oman'],
      },
    },
    {
      id: 'corrosion-inhibitor',
      title: 'Corrosion Inhibitor',
      description: 'Protective chemicals for pipelines and equipment.',
      category: 'oilfield',
      icon: Factory,
      details: {
        alternativeNames: ['Corrosion preventive', 'Inhibitor', 'Anti-corrosion chemical'],
        seoKeywords: ['corrosion inhibitor Oman', 'pipeline protection Muscat', 'corrosion prevention Oman'],
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
        alternativeNames: ['Diethanolamine', 'DEA', '2,2-Iminodiethanol'],
        seoKeywords: ['DEA Oman', 'diethanolamine Muscat', 'gas sweetening Oman', 'acid gas removal Oman'],
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
        alternativeNames: ['Diethylene glycol', 'DEG', '2,2-Oxydiethanol'],
        seoKeywords: ['DEG Oman', 'diethylene glycol Muscat', 'dehydration agent Oman', 'gas dehydration Oman'],
      },
    },
    {
      id: 'degreaser-hd',
      title: 'Degreaser HD',
      description: 'Heavy-duty industrial degreaser for equipment cleaning.',
      category: 'oilfield',
      icon: Factory,
      details: {
        alternativeNames: ['Heavy duty degreaser', 'Industrial degreaser', 'HD degreaser'],
        seoKeywords: ['degreaser Oman', 'heavy duty degreaser Muscat', 'industrial degreaser Oman'],
      },
    },
    {
      id: 'descalant',
      title: 'Descalant',
      description: 'Chemical for removing mineral scale deposits.',
      category: 'oilfield',
      icon: Factory,
      details: {
        alternativeNames: ['Descaling agent', 'Scale remover', 'Mineral scale cleaner'],
        seoKeywords: ['descalant Oman', 'scale remover Muscat', 'descaling agent Oman'],
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
        alternativeNames: ['EDTA solution', 'Ethylenediaminetetraacetic acid liquid'],
        seoKeywords: ['EDTA liquid Oman', 'chelating agent Muscat', 'scale remover Oman'],
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
        alternativeNames: ['EDTA powder', 'Ethylenediaminetetraacetic acid'],
        seoKeywords: ['EDTA powder Oman', 'chelating agent powder Muscat', 'EDTA Oman'],
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
        alternativeNames: ['Methanoic acid', 'Formic acid 85%'],
        seoKeywords: ['formic acid Oman', 'methanoic acid Muscat', 'acidizing agent Oman'],
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
        alternativeNames: ['Hydrazine monohydrate', 'Hydrazine solution'],
        seoKeywords: ['hydrazine hydrate Oman', 'oxygen scavenger Muscat', 'hydrazine Oman'],
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
        alternativeNames: ['Magnesia', 'Calcined magnesite', 'MgO'],
        seoKeywords: ['magnesium oxide Oman', 'magnesia Muscat', 'MgO Oman'],
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
        alternativeNames: ['Potash carbonate', 'Pearl ash', 'K2CO3'],
        seoKeywords: ['potassium carbonate Oman', 'potash carbonate Muscat', 'K2CO3 Oman'],
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
        alternativeNames: ['Potassium chloride', 'KCl', 'Muriate of potash'],
        seoKeywords: ['potassium chloride Oman', 'KCl drilling Muscat', 'shale inhibitor Oman'],
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
        alternativeNames: ['Caustic potash', 'KOH', 'Potassium hydrate'],
        seoKeywords: ['potassium hydroxide Oman', 'caustic potash Muscat', 'KOH Oman'],
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
        alternativeNames: ['Potassium iodide', 'KI'],
        seoKeywords: ['potassium iodide Oman', 'KI Muscat', 'reagent Oman'],
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
        alternativeNames: ['Blue silica gel', 'Indicating silica gel', 'Cobalt silica gel'],
        seoKeywords: ['silica gel blue Oman', 'indicating desiccant Muscat', 'moisture control Oman'],
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
        alternativeNames: ['Orange silica gel', 'Indicating silica gel'],
        seoKeywords: ['silica gel orange Oman', 'desiccant Muscat', 'humidity control Oman'],
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
        alternativeNames: ['White silica gel', 'Silica gel desiccant'],
        seoKeywords: ['silica gel white Oman', 'desiccant white Muscat', 'moisture absorber Oman'],
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
        alternativeNames: ['Sodium carbonate dense', 'Soda ash heavy', 'Na2CO3'],
        seoKeywords: ['soda ash dense Oman', 'sodium carbonate Muscat', 'soda ash Oman'],
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
        alternativeNames: ['Sodium carbonate light', 'Soda ash light'],
        seoKeywords: ['soda ash light Oman', 'sodium carbonate light Muscat', 'Na2CO3 Oman'],
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
        alternativeNames: ['Chile saltpeter', 'Sodium nitrate', 'NaNO3'],
        seoKeywords: ['sodium nitrate Oman', 'NaNO3 Muscat', 'oxidizing agent Oman'],
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
        alternativeNames: ['Sodium nitrite', 'NaNO2'],
        seoKeywords: ['sodium nitrite Oman', 'corrosion inhibitor Muscat', 'NaNO2 Oman'],
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
        alternativeNames: ['Sodium thiosulfate liquid', 'Hypo solution'],
        seoKeywords: ['sodium thiosulfate liquid Oman', 'dechlorination Muscat', 'neutralizer Oman'],
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
        alternativeNames: ['Sodium thiosulfate powder', 'Hypo powder'],
        seoKeywords: ['sodium thiosulfate powder Oman', 'dechlorinator Muscat', 'Na2S2O3 Oman'],
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
        alternativeNames: ['Petroleum naphtha', 'Solvent naphtha', 'VM&P naphtha'],
        seoKeywords: ['solvent naphtha Oman', 'petroleum naphtha Muscat', 'industrial solvent Oman'],
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
        alternativeNames: ['Sodium silicate', 'Water glass', 'Liquid glass'],
        seoKeywords: ['surfactant Oman', 'sodium silicate Muscat', 'drilling chemical Oman'],
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
        alternativeNames: ['Multi-metal inhibitor', 'Mixed metal inhibitor', 'Universal corrosion inhibitor'],
        seoKeywords: ['multi-metal corrosion inhibitor Oman', 'mixed metal protection Muscat', 'cooling water inhibitor Oman'],
      },
    },
    {
      id: 'corrosion-inhibitor-2000',
      title: 'Corrosion Inhibitor 2000',
      description: 'Advanced formula for comprehensive metal protection in industrial systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['CI 2000', 'Advanced corrosion inhibitor', 'Industrial inhibitor'],
        seoKeywords: ['corrosion inhibitor 2000 Oman', 'CI 2000 Muscat', 'industrial protection Oman'],
      },
    },
    {
      id: 'corrosion-inhibitor-rust-preventive',
      title: 'Corrosion Inhibitor For Metal Rust Preventive',
      description: 'Rust prevention solution for metal surfaces and equipment.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Rust preventive', 'Rust inhibitor', 'Metal protection'],
        seoKeywords: ['rust preventive Oman', 'rust inhibitor Muscat', 'metal protection Oman'],
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
        alternativeNames: ['Molybdate inhibitor', 'Sodium molybdate based', 'Closed system inhibitor'],
        seoKeywords: ['molybdate inhibitor Oman', 'closed system protection Muscat', 'molybdate corrosion Oman'],
      },
    },
    {
      id: 'corrosion-inhibitor-general',
      title: 'Corrosion Inhibitor',
      description: 'General-purpose corrosion prevention chemical for industrial applications.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['General inhibitor', 'Corrosion preventive', 'Metal protector'],
        seoKeywords: ['corrosion inhibitor Oman', 'corrosion prevention Muscat', 'metal protector Oman'],
      },
    },
    {
      id: 'corrosion-inhibitor-gas-compressor',
      title: 'Corrosion Inhibitor For Gas Compressor',
      description: 'Specialized protection for gas compressor systems and components.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Compressor inhibitor', 'Gas system inhibitor', 'Compressor protection'],
        seoKeywords: ['gas compressor inhibitor Oman', 'compressor protection Muscat', 'gas system Oman'],
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
        alternativeNames: ['Sodium molybdate dihydrate', 'Molybdate', 'Na2MoO4'],
        seoKeywords: ['sodium molybdate Oman', 'molybdate inhibitor Muscat', 'anodic inhibitor Oman'],
      },
    },
    {
      id: 'oxygen-scavenger',
      title: 'Oxygen Scavenger',
      description: 'Removes dissolved oxygen to prevent corrosion in water systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Oxygen remover', 'Oxygen scavenger', 'Deoxidizer'],
        seoKeywords: ['oxygen scavenger Oman', 'deoxidizer Muscat', 'oxygen remover Oman'],
      },
    },
    {
      id: 'ph-booster-corrosion-inhibitor',
      title: 'Ph Booster Cum Corrosion Inhibitor',
      description: 'Dual-action formula for pH control and corrosion prevention.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['pH booster inhibitor', 'Dual action inhibitor', 'pH control inhibitor'],
        seoKeywords: ['pH booster Oman', 'dual action inhibitor Muscat', 'pH control Oman'],
      },
    },
    {
      id: 'corrosion-inhibitor-closed-system',
      title: 'Corrosion Inhibitor Closed Cooling System',
      description: 'Comprehensive protection for closed-loop cooling systems.',
      category: 'corrosion-inhibitor',
      icon: Shield,
      details: {
        alternativeNames: ['Closed system inhibitor', 'Closed loop protection', 'Chiller inhibitor'],
        seoKeywords: ['closed system inhibitor Oman', 'closed loop protection Muscat', 'chiller inhibitor Oman'],
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
        alternativeNames: ['Heavy carbon remover', 'Fouling remover', 'Carbon cleaner'],
        seoKeywords: ['HCF remover Oman', 'carbon remover Muscat', 'fouling cleaner Oman'],
      },
    },
    {
      id: 'resin-clean',
      title: 'Resin Clean',
      description: 'Specialized cleaner for resin and polymer residue removal.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Resin cleaner', 'Polymer remover', 'Resin residue cleaner'],
        seoKeywords: ['resin cleaner Oman', 'polymer remover Muscat', 'resin clean Oman'],
      },
    },
    {
      id: 'universal-wash',
      title: 'Universal Wash',
      description: 'Multi-purpose cleaning solution for various tank applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Universal cleaner', 'Multi-purpose wash', 'Tank wash'],
        seoKeywords: ['universal wash Oman', 'tank cleaner Muscat', 'multi-purpose cleaner Oman'],
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
        alternativeNames: ['Methyl alcohol', 'Wood alcohol', 'Technical methanol'],
        seoKeywords: ['methanol tech grade Oman', 'methyl alcohol Muscat', 'industrial methanol Oman'],
      },
    },
    {
      id: 'tank-degreaser-heavy-duty',
      title: 'Tank Degreaser Heavy Duty',
      description: 'Industrial-strength degreaser for heavy oil and grease removal.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Heavy duty degreaser', 'Industrial degreaser', 'Tank degreaser'],
        seoKeywords: ['tank degreaser Oman', 'heavy duty degreaser Muscat', 'oil remover Oman'],
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
        alternativeNames: ['Lye', 'Caustic soda liquid', 'Sodium hydroxide solution'],
        seoKeywords: ['lye Oman', 'caustic soda liquid Muscat', 'sodium hydroxide cleaner Oman'],
      },
    },
    {
      id: 'tank-cleaner-general',
      title: 'Tank Cleaner',
      description: 'General-purpose tank cleaning formulation for industrial use.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['General tank cleaner', 'Industrial tank cleaner', 'Tank cleaning solution'],
        seoKeywords: ['tank cleaner Oman', 'industrial cleaner Muscat', 'tank cleaning Oman'],
      },
    },
    {
      id: 'sewage-deformer',
      title: 'Sewage Deformer',
      description: 'Foam control agent for sewage and wastewater tank systems.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Defoamer', 'Foam control', 'Antifoam sewage'],
        seoKeywords: ['sewage defoamer Oman', 'foam control Muscat', 'wastewater defoamer Oman'],
      },
    },
    {
      id: 'alkaleen-cleaner-safety',
      title: 'Alkaleen Cleaner Safety Liquid',
      description: 'Safe alkaline cleaner for various industrial cleaning applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Safe alkaline cleaner', 'Alkaline safety cleaner', 'Industrial alkali cleaner'],
        seoKeywords: ['alkaleen cleaner Oman', 'safe alkaline cleaner Muscat', 'industrial cleaner Oman'],
      },
    },
    {
      id: 'emulsion-sludge-breaker',
      title: 'Emulsion Sludge Breaker',
      description: 'Breaks down emulsions and sludge in storage tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Sludge breaker', 'Emulsion breaker', 'Demulsifier'],
        seoKeywords: ['emulsion breaker Oman', 'sludge breaker Muscat', 'demulsifier Oman'],
      },
    },
    {
      id: 'oil-spill-dispersent-type-3',
      title: 'Oil Spill Dispersent Type 3',
      description: 'Type 3 dispersant for oil spill response and tank cleaning.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Oil dispersant', 'Spill dispersant type 3', 'Oil spill cleaner'],
        seoKeywords: ['oil spill dispersant Oman', 'dispersant type 3 Muscat', 'oil spill cleaner Oman'],
      },
    },
    {
      id: 'aqua-clean-hd',
      title: 'Aqua Clean HD',
      description: 'Heavy-duty aqueous cleaning solution for industrial tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Aqueous cleaner', 'Heavy duty aqua cleaner', 'Water-based cleaner HD'],
        seoKeywords: ['aqua clean HD Oman', 'aqueous cleaner Muscat', 'tank cleaning solution Oman'],
      },
    },
    {
      id: 'cold-washer-hd',
      title: 'Cold Washer HD',
      description: 'Cold-water heavy-duty cleaner for efficient tank washing.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Cold water cleaner', 'HD cold wash', 'Cold cleaning solution'],
        seoKeywords: ['cold washer HD Oman', 'cold water cleaner Muscat', 'tank wash Oman'],
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
        alternativeNames: ['Passivation solution', 'Stainless steel passivation', 'Metal passivation'],
        seoKeywords: ['passivation liquid Oman', 'stainless steel treatment Muscat', 'tank passivation Oman'],
      },
    },
    {
      id: 'edge-sol-cleaner',
      title: 'Edge Sol Cleaner',
      description: 'Solvent-based edge and seam cleaning solution.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Solvent cleaner', 'Edge cleaner', 'Seam cleaning solution'],
        seoKeywords: ['edge sol cleaner Oman', 'solvent cleaner Muscat', 'seam cleaner Oman'],
      },
    },
    {
      id: 'enviro-soft-2000',
      title: 'Enviro Soft 2000',
      description: 'Environmentally friendly softening and cleaning agent.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Eco-friendly cleaner', 'Soft cleaner 2000', 'Environmental cleaner'],
        seoKeywords: ['enviro soft 2000 Oman', 'eco-friendly cleaner Muscat', 'green cleaner Oman'],
      },
    },
    {
      id: 'dual-hd-cleaner',
      title: 'Dual HD Cleaner',
      description: 'Dual-action heavy-duty cleaner for versatile tank applications.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Dual action cleaner', 'Heavy duty dual cleaner', 'Versatile tank cleaner'],
        seoKeywords: ['dual HD cleaner Oman', 'dual action cleaner Muscat', 'versatile cleaner Oman'],
      },
    },
    {
      id: 'metal-bright',
      title: 'Metal Bright',
      description: 'Metal brightening and cleaning solution for tank surfaces.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Metal brightener', 'Metal polish cleaner', 'Brightening solution'],
        seoKeywords: ['metal bright Oman', 'metal brightener Muscat', 'metal polish Oman'],
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
        alternativeNames: ['Para-xylene', 'p-Xylene', '1,4-Dimethylbenzene'],
        seoKeywords: ['p-xylene Oman', 'para-xylene Muscat', 'industrial solvent Oman'],
      },
    },
    {
      id: 'ctc-volc-cleaner',
      title: 'CTC Volc Cleaner',
      description: 'Volcanic ash and carbon cleaner for specialized tank cleaning.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Carbon cleaner', 'Volcanic ash remover', 'CTC cleaner'],
        seoKeywords: ['CTC volc cleaner Oman', 'carbon cleaner Muscat', 'volcanic ash remover Oman'],
      },
    },
    {
      id: 'aquatuff-ship-hold-cleaner',
      title: 'Aquatuff Ship Hold Cleaner',
      description: 'Marine-grade cleaner for ship holds and cargo tanks.',
      category: 'tank-cleaners',
      icon: SprayCan,
      details: {
        alternativeNames: ['Ship hold cleaner', 'Marine tank cleaner', 'Cargo hold cleaner'],
        seoKeywords: ['ship hold cleaner Oman', 'marine cleaner Muscat', 'cargo tank cleaner Oman'],
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
        alternativeNames: ['Membrane passivation', 'RO membrane preservative', 'Membrane storage solution'],
        seoKeywords: ['RO passivation Oman', 'membrane protection Muscat', 'RO preservation Oman'],
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
        alternativeNames: ['Citric acid solution', 'Membrane descaler', 'RO cleaner'],
        seoKeywords: ['citric acid RO Oman', 'membrane descaler Muscat', 'RO cleaning Oman'],
      },
    },
    {
      id: 'ro-222-descaler',
      title: 'RO 222 Descaler',
      description: 'Specialized descaling solution for reverse osmosis membrane systems.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['RO descaler', 'Membrane descaling solution', 'Scale remover RO'],
        seoKeywords: ['RO 222 descaler Oman', 'RO membrane cleaner Muscat', 'scale remover Oman'],
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
        alternativeNames: ['Alkaline RO cleaner', 'Caustic membrane cleaner', 'Sodium hydroxide cleaner'],
        seoKeywords: ['alkaline RO cleaner Oman', 'membrane cleaner Muscat', 'caustic cleaner Oman'],
      },
    },
    {
      id: 'membrane-cleaner-ro',
      title: 'Membrane Cleaner',
      description: 'Comprehensive cleaning solution for RO membrane maintenance and restoration.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['RO membrane cleaner', 'Membrane cleaning solution', 'RO maintenance chemical'],
        seoKeywords: ['membrane cleaner Oman', 'RO cleaning Muscat', 'membrane maintenance Oman'],
      },
    },
    {
      id: 'antiscalant-ro',
      title: 'Antiscalant RO',
      description: 'Scale inhibitor for preventing mineral deposits on reverse osmosis membranes.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['RO antiscalant', 'Scale inhibitor', 'Membrane antiscalant'],
        seoKeywords: ['antiscalant RO Oman', 'scale inhibitor Muscat', 'RO antiscalant Oman'],
      },
    },
    {
      id: 'membrane-alka-cleaner',
      title: 'Membrane Alka Cleaner',
      description: 'Alkaline formulation for removing organic and biological fouling from membranes.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['Alkaline membrane cleaner', 'Alka cleaner', 'Organic fouling remover'],
        seoKeywords: ['membrane alka cleaner Oman', 'alkaline cleaner Muscat', 'fouling remover Oman'],
      },
    },
    {
      id: 'membrane-antiscalant-ro',
      title: 'Membrane Antiscalant RO',
      description: 'Advanced antiscalant for comprehensive membrane scale prevention.',
      category: 'ro-chemicals',
      icon: Droplets,
      details: {
        alternativeNames: ['Advanced antiscalant', 'Scale preventive', 'RO scale inhibitor'],
        seoKeywords: ['membrane antiscalant Oman', 'advanced antiscalant Muscat', 'scale prevention Oman'],
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
        alternativeNames: ['Closed loop inhibitor', 'Chiller corrosion inhibitor', 'Closed system treatment'],
        seoKeywords: ['corrosion inhibitor closed loop Oman', 'chiller treatment Muscat', 'closed system Oman'],
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
        alternativeNames: ['Algaecide', 'Algae inhibitor', 'Cooling tower algaecide'],
        seoKeywords: ['algae control Oman', 'algaecide cooling tower Muscat', 'algae prevention Oman'],
      },
    },
    {
      id: 'biological-guard-antifouling',
      title: 'Biological Guard Antifouling',
      description: 'Biocide for controlling biological fouling in cooling water systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Biofouling control', 'Biological inhibitor', 'Antifouling biocide'],
        seoKeywords: ['biological guard Oman', 'antifouling Muscat', 'biofouling control Oman'],
      },
    },
    {
      id: 'micro-biocid-cooling-water',
      title: 'Micro Biocid Cooling Water',
      description: 'Microbiocide for microbial control in cooling tower applications.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Microbiocide', 'Microbial control', 'Cooling tower biocide'],
        seoKeywords: ['microbiocide Oman', 'cooling tower biocide Muscat', 'microbial control Oman'],
      },
    },
    {
      id: 'biocide-cooling',
      title: 'Biocide',
      description: 'Broad-spectrum biocide for cooling water treatment and microbial control.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Broad spectrum biocide', 'Cooling water biocide', 'Antimicrobial agent'],
        seoKeywords: ['biocide cooling water Oman', 'antimicrobial Muscat', 'cooling tower biocide Oman'],
      },
    },
    {
      id: 'hardness-control-boiler',
      title: 'Hardness Control Boiler Treatment',
      description: 'Chemical treatment for controlling water hardness in boiler systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Boiler hardness control', 'Scale inhibitor boiler', 'Water hardness treatment'],
        seoKeywords: ['hardness control Oman', 'boiler treatment Muscat', 'scale control Oman'],
      },
    },
    {
      id: 'biocide-closed-loop-chiller',
      title: 'Biocide For Closed Loop Chiller Water',
      description: 'Specialized biocide for closed-loop chiller water systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Chiller biocide', 'Closed loop biocide', 'Chiller water treatment'],
        seoKeywords: ['chiller biocide Oman', 'closed loop treatment Muscat', 'chiller water biocide Oman'],
      },
    },
    {
      id: 'cool-water-treat-corrosion',
      title: 'Cool Water Treat Corrosion Inhibitor',
      description: 'Corrosion inhibitor formulated for cooling water treatment applications.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Cooling water inhibitor', 'Corrosion treatment', 'Cooling tower inhibitor'],
        seoKeywords: ['cooling water corrosion inhibitor Oman', 'corrosion treatment Muscat', 'cooling tower Oman'],
      },
    },
    {
      id: 'altreat-4000',
      title: 'Altreat 4000',
      description: 'All-in-one cooling water treatment chemical for comprehensive system protection.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['All-in-one treatment', 'Cooling water treatment', 'Complete water treatment'],
        seoKeywords: ['Altreat 4000 Oman', 'cooling water treatment Muscat', 'all-in-one treatment Oman'],
      },
    },
    {
      id: 'corro-guard-antifoulant',
      title: 'Corro Guard For Antifoulant for Cooling Water',
      description: 'Dual-action corrosion inhibitor and antifoulant for cooling water systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Corrosion guard', 'Dual action inhibitor', 'Antifouling inhibitor'],
        seoKeywords: ['corro guard Oman', 'antifoulant Muscat', 'corrosion inhibitor Oman'],
      },
    },
    {
      id: 'antifouling-liquid',
      title: 'Antifouling Liquid',
      description: 'Liquid antifoulant for preventing deposits and fouling in cooling systems.',
      category: 'cooling-water',
      icon: Droplets,
      details: {
        alternativeNames: ['Antifoulant liquid', 'Fouling inhibitor', 'Scale dispersant'],
        seoKeywords: ['antifouling liquid Oman', 'fouling control Muscat', 'scale dispersant Oman'],
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
