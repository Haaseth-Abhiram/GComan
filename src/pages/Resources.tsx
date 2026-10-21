import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye } from 'lucide-react';
import {
  Download,
  FileText,
  ShieldCheck,
  BookOpen,
  Award,
  Beaker,
  Search,
  Calendar,
  Clock,
  User,
  ChevronRight,
  Tag,
  Droplets,
  Factory,
  FlaskConical,
  Waves,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ThermometerSun,
  Shield,
  Phone,
  MessageSquare
} from 'lucide-react';
import BrochureGlobal from '@/assets/brochures/Global-Chemicals-LLC-Brochure.pdf';
import BrochureCDC from '@/assets/brochures/CDC-Anti-Clog-Brochure.pdf';
import BrochureProducts from '@/assets/brochures/Global-Chemicals-Products-Brochure.pdf';
import BrochureProductsList from '@/assets/brochures/Global-Chemicals-Products-List.pdf';
import { DownloadGateDialog } from '@/components/DownloadGateDialog';
import { PDFViewerDialog } from '@/components/PDFViewerDialog';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData, ArticleStructuredData, FAQStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import { blogArticles, articleCategories as blogCategories, BlogArticle } from '@/data/blogArticles';
import { trackDownload } from '@/components/GoogleAnalytics';
import { LocalizedLink } from '@/components/LocalizedLink';

// Breadcrumb items
const breadcrumbItems = [
  { name: 'Home', url: 'https://gcoman.com/' },
  { name: 'Resources', url: 'https://gcoman.com/resources' }
];

// HowTo steps for downloading resources
// Industry Guides Data - Comprehensive SEO-optimized content
interface IndustryGuide {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  readTime: string;
  lastUpdated: string;
  sections: {
    title: string;
    content: string;
    tips?: string[];
  }[];
  keyProducts?: string[];
  faqs?: { question: string; answer: string }[];
}

const industryGuides: IndustryGuide[] = [
  {
    id: 'water-treatment-oman',
    title: 'Complete Guide to Water Treatment Chemicals in Oman',
    slug: 'water-treatment-guide-oman',
    excerpt: 'Learn about water treatment chemicals, their applications, and best practices for municipal, industrial, and desalination plants in Oman. Essential guide for water treatment professionals.',
    icon: Droplets,
    category: 'Water Treatment',
    readTime: '15 min read',
    lastUpdated: '2024-12-05',
    sections: [
      {
        title: 'Introduction to Water Treatment in Oman',
        content: 'Oman faces unique water challenges due to its arid climate and growing industrial sector. With limited freshwater resources, the Sultanate relies heavily on desalination and wastewater treatment. Understanding the right chemicals for water treatment is crucial for industries across Muscat, Sohar, Duqm, and Salalah. This guide covers essential chemicals, dosing guidelines, and best practices for Oman\'s water treatment needs.',
        tips: [
          'Oman processes over 500 million cubic meters of desalinated water annually',
          'Industrial water treatment accounts for 40% of total water chemical consumption',
          'Proper chemical selection can reduce operational costs by 20-30%'
        ]
      },
      {
        title: 'Essential Water Treatment Chemicals',
        content: 'The most commonly used water treatment chemicals in Oman include Poly Aluminium Chloride (PAC) for coagulation, Calcium Hypochlorite and Sodium Hypochlorite for disinfection, Caustic Soda for pH adjustment, Antiscalants for RO membrane protection, and Biocides for microbial control. Each chemical serves a specific purpose in the treatment process, from raw water intake to final distribution.',
        tips: [
          'PAC is 30% more effective than traditional alum in high-turbidity conditions',
          'Calcium Hypochlorite is preferred for municipal applications due to stability',
          'Antiscalants are critical for extending RO membrane life in desalination plants'
        ]
      },
      {
        title: 'Coagulation and Flocculation',
        content: 'Coagulation is the first step in conventional water treatment. Poly Aluminium Chloride (PAC) is the preferred coagulant in Oman due to its effectiveness across a wide pH range and in high-temperature conditions common in the Gulf region. For optimal results, PAC dosage typically ranges from 10-50 mg/L depending on raw water turbidity. Aluminium Sulphate (Alum) is an alternative for lower-turbidity applications. Polyelectrolyte flocculants help aggregate small particles for easier removal in sedimentation basins.',
        tips: [
          'Conduct jar tests to determine optimal coagulant dosage',
          'Summer temperatures require adjusted dosing due to faster reaction kinetics',
          'Monitor residual aluminium to meet WHO guidelines (<0.2 mg/L)'
        ]
      },
      {
        title: 'Disinfection Methods and Chemicals',
        content: 'Disinfection ensures drinking water safety by eliminating pathogenic microorganisms. In Oman, chlorine-based disinfection remains the standard. Calcium Hypochlorite (65-70% available chlorine) is widely used for municipal systems due to its stability and ease of storage. Sodium Hypochlorite (12.5% solution) is preferred for on-site generation systems. Maintain a residual chlorine level of 0.2-0.5 mg/L at the point of distribution to ensure water safety throughout the network.',
        tips: [
          'Store calcium hypochlorite in cool, dry areas away from direct sunlight',
          'Sodium hypochlorite degrades faster in Oman\'s heat—use within 60 days',
          'Consider chlorine dioxide for taste and odor control in challenging source waters'
        ]
      },
      {
        title: 'Desalination Plant Chemicals',
        content: 'Oman\'s desalination sector requires specialized chemicals for optimal performance. Antiscalants prevent mineral scale formation on RO membranes—critical for seawater containing high calcium and magnesium levels. Typical dosage is 2-5 ppm depending on water chemistry. Sodium Bisulfite removes residual chlorine before RO membranes (chlorine damages membrane material). Cleaning chemicals including citric acid and caustic soda are used for periodic membrane cleaning. pH adjustment chemicals optimize recovery rates and prevent corrosion.',
        tips: [
          'Test antiscalant compatibility with your specific membrane manufacturer',
          'Implement automated dosing systems for consistent chemical delivery',
          'Regular membrane autopsies help optimize chemical treatment programs'
        ]
      },
      {
        title: 'Industrial Wastewater Treatment',
        content: 'Industrial facilities in Oman must meet strict discharge standards set by the Environment Authority. Key chemicals include: Ferric Chloride for heavy metal precipitation and phosphorus removal, Hydrochloric Acid and Sulfuric Acid for pH neutralization, Polyelectrolytes for sludge dewatering, and specialized biocides for biological treatment systems. Oil and gas facilities require additional treatment for hydrocarbon removal using coagulants and activated carbon.',
        tips: [
          'Conduct regular effluent testing to ensure compliance with Oman discharge standards',
          'Consider chemical recovery systems for sustainable operations',
          'Partner with a reliable supplier for emergency chemical deliveries'
        ]
      }
    ],
    keyProducts: [
      'Poly Aluminium Chloride (PAC)',
      'Calcium Hypochlorite',
      'Sodium Hypochlorite',
      'Caustic Soda',
      'Antiscalants',
      'Ferric Chloride',
      'Hydrochloric Acid',
      'Sulfuric Acid'
    ],
    faqs: [
      {
        question: 'What is the best coagulant for water treatment in Oman?',
        answer: 'Poly Aluminium Chloride (PAC) is the most effective coagulant for Oman conditions. It works across a wide pH range (6.5-9.0) and performs well in high-temperature environments typical of the Gulf region. PAC also produces less sludge compared to traditional alum.'
      },
      {
        question: 'How often should RO membranes be chemically cleaned?',
        answer: 'RO membranes should be cleaned when normalized permeate flow decreases by 10-15% or salt passage increases by 10%. In Oman\'s challenging seawater conditions, this typically means cleaning every 3-6 months. Use citric acid for inorganic scaling and caustic solutions for organic fouling.'
      },
      {
        question: 'What chlorine residual should be maintained in distribution systems?',
        answer: 'Oman\'s water quality standards require a minimum free chlorine residual of 0.2 mg/L and maximum of 0.5 mg/L at consumer taps. Higher residuals (0.5-1.0 mg/L) are maintained at treatment plant outlets to account for decay in the distribution network.'
      }
    ]
  },
  {
    id: 'industrial-lubricants-selection',
    title: 'Industrial Lubricants Selection Guide for Oman Industries',
    slug: 'industrial-lubricants-guide-oman',
    excerpt: 'Comprehensive guide to selecting the right industrial lubricants for manufacturing, oil & gas, and heavy industries in Oman. Featuring Shell, Mobil, and Castrol products.',
    icon: Fuel,
    category: 'Lubricants',
    readTime: '12 min read',
    lastUpdated: '2024-12-05',
    sections: [
      {
        title: 'Understanding Industrial Lubricants',
        content: 'Industrial lubricants are essential for equipment longevity and operational efficiency in Oman\'s demanding industrial environment. With temperatures regularly exceeding 45°C in summer and exposure to dust and humidity, selecting the right lubricant is critical. This guide covers lubricant types, selection criteria, and maintenance best practices for industries in Muscat, Sohar Industrial Estate, Duqm SEZ, and Rusayl Industrial Area.',
        tips: [
          'Proper lubrication can extend equipment life by 300-500%',
          'Lubricant-related failures account for 50% of industrial equipment breakdowns',
          'Annual lubricant costs are typically 1-3% of maintenance budgets'
        ]
      },
      {
        title: 'Types of Industrial Lubricants',
        content: 'Industrial lubricants fall into several categories: Hydraulic Oils for power transmission systems, Gear Oils for gearboxes and transmissions, Compressor Oils for air and gas compressors, Turbine Oils for steam and gas turbines, Greases for bearings and open gears, and Specialty Oils for food-grade and extreme conditions. Each type is formulated with specific base oils and additives for their intended application.',
        tips: [
          'Synthetic lubricants offer 2-3x longer drain intervals in high-temperature applications',
          'Never mix different lubricant brands without compatibility testing',
          'Food-grade lubricants (NSF H1) are mandatory for food processing equipment'
        ]
      },
      {
        title: 'Hydraulic Oils for Oman Conditions',
        content: 'Hydraulic systems are the backbone of industrial machinery. For Oman\'s hot climate, choose hydraulic oils with high viscosity index (VI > 150) to maintain consistent performance across temperature ranges. Shell Tellus S2 V and Mobil DTE 10 Excel series are designed for wide temperature applications. Key specifications include ISO VG 32, 46, or 68 depending on system design, zinc-based anti-wear additives for pump protection, and oxidation stability for extended service life.',
        tips: [
          'Monitor oil temperature—every 10°C above 55°C halves oil life',
          'Maintain system cleanliness to ISO 16/14/11 or better for servo systems',
          'Check water content regularly—maximum 0.1% for optimal performance'
        ]
      },
      {
        title: 'Gear Oils and Transmission Fluids',
        content: 'Industrial gearboxes require specialized lubricants that can handle extreme pressure and shock loads. EP (Extreme Pressure) gear oils contain sulfur-phosphorus additives that form protective films under boundary lubrication conditions. For Oman\'s industries, select ISO VG 220 or 320 for enclosed gearboxes operating at elevated temperatures. Synthetic PAO-based gear oils like Shell Omala S4 GX offer superior performance for critical applications with 4x longer oil life than mineral oils.',
        tips: [
          'Use viscosity grade recommended by OEM—higher isn\'t always better',
          'Synthetic gear oils reduce operating temperatures by 10-20°C',
          'Implement oil analysis programs for predictive maintenance'
        ]
      },
      {
        title: 'Greases for Bearings and Open Gears',
        content: 'Greases provide lubrication for bearings, slides, and open gears where oil would run off. The NLGI grade indicates grease consistency—NLGI 2 is most common for industrial applications. For high-temperature applications above 120°C, use synthetic greases with polyurea or clay thickeners. Lithium complex greases offer good all-round performance for most industrial bearings. For food processing in Oman, NSF H1 registered greases are required for incidental food contact areas.',
        tips: [
          'Over-greasing causes 60% of bearing failures—follow relubrication schedules',
          'High-temperature greases are essential for outdoor equipment in Oman',
          'Use grease guns with calibrated output for accurate application'
        ]
      },
      {
        title: 'Lubricant Storage and Handling in Hot Climates',
        content: 'Proper lubricant storage is critical in Oman\'s climate. Store lubricants in covered, ventilated areas away from direct sunlight. Drum temperatures can exceed 70°C when exposed to sun, causing seal failures and contamination. Use proper dispensing equipment including dedicated transfer pumps, desiccant breathers, and filtration during transfers. Implement first-in-first-out (FIFO) inventory management to prevent lubricant degradation.',
        tips: [
          'Maximum lubricant shelf life in Oman: 2 years for mineral oils, 3 years for synthetics',
          'Store drums horizontally or with bungs at 3 and 9 o\'clock positions',
          'Install shade structures for outdoor lubricant storage areas'
        ]
      }
    ],
    keyProducts: [
      'Shell Tellus Hydraulic Oils',
      'Mobil DTE Series',
      'Castrol Hyspin AWS',
      'Shell Omala Gear Oils',
      'Mobil SHC Synthetic Lubricants',
      'Industrial Greases',
      'Compressor Oils'
    ],
    faqs: [
      {
        question: 'Which lubricant brand is best for Oman industries?',
        answer: 'Shell, Mobil, and Castrol all offer high-quality industrial lubricants suitable for Oman conditions. The best choice depends on your specific application, OEM recommendations, and support availability. Global Chemicals LLC is an authorized distributor for all three brands and can provide technical guidance for your requirements.'
      },
      {
        question: 'How often should hydraulic oil be changed in hot climates?',
        answer: 'In Oman\'s hot climate, mineral hydraulic oils typically require changing every 2,000-4,000 operating hours. Synthetic hydraulic oils can last 4,000-8,000 hours. However, oil analysis is the most reliable method to determine optimal change intervals based on actual oil condition.'
      },
      {
        question: 'Can I mix different brands of lubricants?',
        answer: 'Mixing different lubricant brands is not recommended without compatibility testing. While base oils may be compatible, additive packages can react adversely, reducing lubricant performance. If switching brands, perform a complete drain and flush of the system.'
      }
    ]
  },
  {
    id: 'swimming-pool-maintenance',
    title: 'Swimming Pool Chemical Maintenance Guide for Oman',
    slug: 'swimming-pool-chemicals-guide-oman',
    excerpt: 'Essential guide to swimming pool water treatment and chemical maintenance in Oman. Learn about chlorination, pH control, algae prevention, and water balance for hotels, resorts, and residential pools.',
    icon: Waves,
    category: 'Swimming Pool',
    readTime: '10 min read',
    lastUpdated: '2024-12-05',
    sections: [
      {
        title: 'Pool Water Chemistry Basics',
        content: 'Maintaining proper pool water chemistry in Oman\'s hot, sunny climate presents unique challenges. High temperatures accelerate chlorine consumption, while intense UV radiation degrades sanitizers rapidly. This guide covers essential parameters including free chlorine (1-3 ppm), pH (7.2-7.6), total alkalinity (80-120 ppm), calcium hardness (200-400 ppm), and cyanuric acid levels (30-50 ppm) for outdoor pools.',
        tips: [
          'Test pool water at least twice daily during peak summer',
          'Chlorine consumption can triple during Oman\'s hottest months',
          'Morning testing provides most accurate baseline readings'
        ]
      },
      {
        title: 'Chlorination and Sanitization',
        content: 'Chlorine is the primary sanitizer for pools in Oman. Calcium Hypochlorite (granular, 65-70% available chlorine) is ideal for shock treatment and daily dosing. Chlorine tablets (Trichloroisocyanuric Acid) provide slow-release chlorination through floating dispensers or inline feeders. Sodium Hypochlorite liquid is used in automated dosing systems. For salt chlorinator pools, maintain salt levels at 3,000-4,000 ppm for optimal chlorine generation.',
        tips: [
          'Add chlorine in the evening to reduce UV degradation',
          'Shock treat pools weekly with calcium hypochlorite at 10 ppm',
          'Use stabilized chlorine (with cyanuric acid) for outdoor pools'
        ]
      },
      {
        title: 'pH and Alkalinity Control',
        content: 'Maintaining proper pH is crucial for chlorine effectiveness and swimmer comfort. Oman\'s high-TDS water often causes pH to drift upward. Use hydrochloric acid (muriatic acid) or sodium bisulfate (dry acid) to lower pH. Sodium bicarbonate raises alkalinity without significantly affecting pH, while sodium carbonate (soda ash) raises both pH and alkalinity. Test and adjust pH before adding chlorine for maximum sanitizer efficiency.',
        tips: [
          'Never add acid and chlorine simultaneously—allow 4 hours between additions',
          'High alkalinity buffers pH swings but can cause cloudy water',
          'Acid should always be added to water, never water to acid'
        ]
      },
      {
        title: 'Algae Prevention and Treatment',
        content: 'Algae growth is accelerated by Oman\'s warm temperatures and intense sunlight. Prevention is easier than treatment—maintain proper chlorine levels and use algaecide weekly as a preventive measure. For green algae outbreaks, shock treat with high chlorine (20-30 ppm) and brush all surfaces. For stubborn mustard or black algae, use specialized algaecides containing copper or quaternary ammonium compounds. Maintain filter operation 24/7 during treatment.',
        tips: [
          'Phosphate removers eliminate algae nutrients for long-term prevention',
          'Brush pool surfaces weekly to remove algae spores',
          'Run pump continuously during and 24 hours after shock treatment'
        ]
      },
      {
        title: 'Water Balance for Oman Conditions',
        content: 'Balanced water prevents scale formation and equipment corrosion. Oman\'s high-calcium tap water requires careful management. The Langelier Saturation Index (LSI) should be maintained between -0.3 and +0.3. High calcium levels (>600 ppm) require partial drain and refill. Evaporation in summer can concentrate minerals—monitor TDS levels and dilute when exceeding 2,000 ppm. Use sequestering agents to prevent metal staining in pools filled with well water.',
        tips: [
          'Calculate LSI monthly using temperature, pH, calcium, and alkalinity',
          'Evaporation can exceed 10mm per day in summer—top up with fresh water',
          'Use pre-filters when filling pools to reduce source water contaminants'
        ]
      }
    ],
    keyProducts: [
      'Calcium Hypochlorite 65-70%',
      'Chlorine Tablets (TCCA)',
      'Hydrochloric Acid',
      'Sodium Bicarbonate',
      'Pool Algaecides',
      'pH Test Kits',
      'Cyanuric Acid (Stabilizer)'
    ],
    faqs: [
      {
        question: 'How much chlorine does a pool in Oman need daily?',
        answer: 'In Oman\'s hot climate, outdoor pools typically require 2-4 kg of calcium hypochlorite per 100,000 liters daily during summer to maintain 1-3 ppm free chlorine. Actual demand depends on bather load, temperature, and UV exposure. Use a stabilizer (cyanuric acid at 30-50 ppm) to reduce chlorine degradation.'
      },
      {
        question: 'Why does my pool turn green despite adding chlorine?',
        answer: 'Green water despite chlorine addition usually indicates: 1) pH too high (>7.8) reducing chlorine effectiveness, 2) cyanuric acid too high (>100 ppm) locking chlorine, or 3) insufficient free chlorine for the contamination level. Test all parameters and shock treat at night with 20+ ppm chlorine while running the pump continuously.'
      },
      {
        question: 'How often should pool water be completely changed in Oman?',
        answer: 'Complete pool water replacement is typically needed every 3-5 years or when TDS exceeds 3,000 ppm. Regular partial dilution (10-20% monthly) through backwashing and top-up can extend this interval. High evaporation in Oman concentrates minerals, so monitor TDS and calcium levels regularly.'
      }
    ]
  },
  {
    id: 'laboratory-chemicals-guide',
    title: 'Laboratory Chemicals Guide: Selection and Handling in Oman',
    slug: 'laboratory-chemicals-guide-oman',
    excerpt: 'Complete guide to laboratory chemicals, reagent grades, and proper handling procedures. Essential information for research laboratories, quality control labs, and educational institutions in Oman.',
    icon: FlaskConical,
    category: 'Laboratory',
    readTime: '12 min read',
    lastUpdated: '2024-12-05',
    sections: [
      {
        title: 'Understanding Laboratory Chemical Grades',
        content: 'Laboratory chemicals come in various purity grades suited for different applications. AR (Analytical Reagent) Grade chemicals meet stringent purity specifications for quantitative analysis. HPLC Grade solvents are specially purified for chromatography applications. LR (Laboratory Reagent) Grade is suitable for general laboratory use and educational purposes. ACS Grade meets American Chemical Society specifications. Understanding these grades ensures accurate results and cost-effective procurement for laboratories in Oman.',
        tips: [
          'Use AR or ACS grade for quantitative analytical procedures',
          'HPLC solvents must have UV cutoff specifications for chromatography',
          'Technical grade is acceptable for cleaning and non-analytical purposes'
        ]
      },
      {
        title: 'Essential Laboratory Reagents',
        content: 'Every laboratory requires a core set of reagents. Acids (hydrochloric, sulfuric, nitric, phosphoric) are fundamental for digestions, pH adjustment, and sample preparation. Bases (sodium hydroxide, potassium hydroxide, ammonia solution) serve neutralization and extraction needs. Organic solvents (methanol, ethanol, acetone, hexane) are essential for extraction and chromatography. Indicators (phenolphthalein, methyl orange, universal indicators) support titration and pH determination. Buffer solutions maintain pH stability during analysis.',
        tips: [
          'Maintain minimum stock of 6 months for critical reagents',
          'Date all chemicals upon receipt and opening',
          'Segregate incompatible chemicals according to SDS requirements'
        ]
      },
      {
        title: 'HPLC and Chromatography Solvents',
        content: 'High-performance liquid chromatography requires ultra-pure solvents with specific characteristics. HPLC-grade acetonitrile and methanol must have low UV absorbance for detection sensitivity. Water should be HPLC or Type 1 grade with resistivity >18 MΩ·cm. Mobile phase preparation requires proper filtration (0.22 μm) and degassing. Store HPLC solvents in amber glass to prevent photodegradation. For LC-MS applications, use LC-MS grade solvents with ultra-low metal content.',
        tips: [
          'Filter and degas mobile phases immediately before use',
          'Never reuse HPLC solvents—contamination affects reproducibility',
          'Gradient-grade solvents are essential for gradient elution methods'
        ]
      },
      {
        title: 'Chemical Storage in Oman Climate',
        content: 'Oman\'s hot climate poses challenges for laboratory chemical storage. Temperature-sensitive reagents require refrigeration (2-8°C) or cold storage. Air-conditioned chemical storage rooms should maintain 20-25°C. Light-sensitive chemicals need amber containers or dark storage. Flammable solvents require explosion-proof refrigerators and ventilated cabinets. Hygroscopic chemicals must be protected from humidity with desiccators or nitrogen blanketing. Implement regular inventory checks to identify degraded reagents.',
        tips: [
          'Never store chemicals above 30°C in Oman—reduces shelf life significantly',
          'Use temperature monitoring for refrigerated chemicals',
          'Oxidizers and flammables must be stored in separate cabinets'
        ]
      },
      {
        title: 'Safety and Handling Procedures',
        content: 'Laboratory chemical safety is paramount. Always wear appropriate PPE including lab coats, safety glasses, and chemical-resistant gloves. Work with volatile chemicals in fume hoods with adequate face velocity (0.4-0.5 m/s). Follow SDS guidelines for each chemical—available from Global Chemicals LLC for all products supplied. Implement proper waste segregation for halogenated solvents, acids, bases, and oxidizers. Emergency equipment including eyewash stations and safety showers must be tested weekly.',
        tips: [
          'Never work alone with hazardous chemicals',
          'Keep SDS accessible within 30 seconds of work area',
          'Label all secondary containers with chemical name and hazards'
        ]
      },
      {
        title: 'Quality Assurance for Laboratory Chemicals',
        content: 'Reliable results require verified reagent quality. Check certificates of analysis (CoA) for each lot against method requirements. Implement incoming inspection for critical reagents including appearance, label verification, and seal integrity. Standard solutions should be prepared from certified reference materials and verified against secondary standards. Establish reagent expiration protocols based on manufacturer recommendations and stability data. Document all reagent lots used in analytical reports for traceability.',
        tips: [
          'Maintain reagent logs with lot numbers and usage records',
          'Standardize volumetric solutions regularly against primary standards',
          'Discard expired reagents even if appearance is normal'
        ]
      }
    ],
    keyProducts: [
      'AR Grade Chemicals',
      'HPLC Solvents',
      'Volumetric Solutions',
      'pH Buffer Solutions',
      'Indicators and Reagents',
      'Reference Standards',
      'Lab Consumables'
    ],
    faqs: [
      {
        question: 'What is the difference between AR grade and LR grade chemicals?',
        answer: 'AR (Analytical Reagent) grade chemicals have certified purity levels meeting strict specifications for quantitative analysis—typically >99.5% purity with specified maximum impurity limits. LR (Laboratory Reagent) grade has lower purity requirements suitable for qualitative tests and general lab use. Use AR grade for precise analytical work where impurities could affect results.'
      },
      {
        question: 'How should HPLC solvents be stored in Oman?',
        answer: 'HPLC solvents should be stored in air-conditioned environments at 20-25°C, away from direct sunlight in original sealed containers. Opened bottles should be used within 3-6 months. For critical applications, consider single-use ampoules or bottles with septum caps to prevent contamination and evaporation. Never store near ammonia or amine sources which can contaminate solvents.'
      },
      {
        question: 'Do you provide Certificates of Analysis for laboratory chemicals?',
        answer: 'Yes, Global Chemicals LLC provides Certificates of Analysis (CoA) for all laboratory-grade chemicals. CoAs include lot-specific assay results, impurity profiles, and compliance with stated specifications. Request CoAs when placing your order or contact our technical team for existing inventory. We source from ISO 17034 accredited manufacturers for certified reference materials.'
      }
    ]
  },
  {
    id: 'oil-gas-chemicals',
    title: 'Oil & Gas Production Chemicals Guide for Oman Operations',
    slug: 'oil-gas-chemicals-guide-oman',
    excerpt: 'Technical guide to production chemicals for oil and gas operations in Oman. Covering corrosion inhibitors, scale inhibitors, demulsifiers, and H2S scavengers for PDO, OQ, and contractor operations.',
    icon: Factory,
    category: 'Oil & Gas',
    readTime: '14 min read',
    lastUpdated: '2024-12-05',
    sections: [
      {
        title: 'Overview of Oil & Gas Chemicals in Oman',
        content: 'Oman\'s oil and gas sector requires specialized production chemicals to maintain flow assurance, asset integrity, and operational efficiency. With major operators including PDO, OQ, and various international contractors, chemical treatment programs must meet stringent standards while addressing Oman-specific challenges including high H2S content, elevated reservoir temperatures, and challenging water chemistry. This guide covers essential chemical categories and selection criteria for upstream, midstream, and downstream operations.',
        tips: [
          'Oman produces over 1 million barrels of oil per day requiring extensive chemical treatment',
          'High H2S wells require specialized scavenger programs and material selection',
          'Chemical approval processes typically require 6-12 months for major operators'
        ]
      },
      {
        title: 'Corrosion Inhibitors',
        content: 'Corrosion is the leading cause of pipeline failures and equipment degradation in oil and gas operations. Film-forming corrosion inhibitors create a protective barrier on metal surfaces, preventing attack by CO2, H2S, and organic acids. Inhibitor selection depends on water cut, temperature, flow regime, and corrosive species present. Continuous injection is standard for wet gas and high-water-cut systems. Batch treatments are suitable for low-water producers. Monitor inhibitor performance through corrosion coupons, ER probes, and iron counts.',
        tips: [
          'Target corrosion rates below 0.1 mm/year for carbon steel systems',
          'Inhibitor residuals should maintain 50-200 ppm at system endpoints',
          'Biodegradable inhibitors are increasingly required for environmental compliance'
        ]
      },
      {
        title: 'Scale Inhibitors and Prevention',
        content: 'Scale deposition in wells, flowlines, and processing facilities reduces production and increases operating costs. Common scales in Oman operations include calcium carbonate, barium sulfate, and calcium sulfate. Scale inhibitors work by threshold inhibition, crystal modification, or dispersion. Squeeze treatments place inhibitor in the formation for gradual release—typical squeeze life is 3-12 months depending on water production. Continuous injection protects surface facilities. Scale prediction modeling using produced water analysis guides treatment programs.',
        tips: [
          'Water incompatibility causes severe barium sulfate scaling in commingled systems',
          'Perform scale prediction studies before any water injection project',
          'Phosphonate inhibitors are effective for carbonate scales at <150°C'
        ]
      },
      {
        title: 'Demulsifiers and Water Treatment',
        content: 'Crude oil-water emulsions must be separated for export-quality oil production. Demulsifiers are surface-active chemicals that destabilize emulsions by displacing natural surfactants from the oil-water interface. Demulsifier selection requires bottle testing with actual field samples as emulsion characteristics vary between wells. Typical dosage ranges from 20-200 ppm depending on crude properties and water cut. Produced water treatment chemicals including flotation aids, deoilers, and biocides ensure discharge compliance or injection water quality.',
        tips: [
          'Heavy crudes require more aggressive demulsifier formulations',
          'Bottle test temperature should match field separator conditions',
          'Overdosing demulsifier can create secondary "rag layer" problems'
        ]
      },
      {
        title: 'H2S Scavengers',
        content: 'Many Oman fields produce sour gas requiring H2S scavenger treatment for personnel safety and corrosion control. Triazine-based scavengers are most common for liquid-phase treatment, reacting irreversibly with H2S to form water-soluble byproducts. Solid scavengers using iron oxide are effective for vapor-phase treatment in low-pressure systems. Scavenger dosage depends on H2S concentration, contact time, and temperature. Monitor treated stream H2S levels to optimize dosing and prevent under-treatment.',
        tips: [
          'Triazine scavengers work best at pH 7-9 and temperatures below 80°C',
          'Size scavenger towers for minimum 15 seconds gas residence time',
          'Dispose of spent scavenger properly—it may contain iron sulfide'
        ]
      },
      {
        title: 'Drilling and Completion Chemicals',
        content: 'Drilling operations require specialized fluids and chemicals for wellbore stability, cuttings transport, and formation protection. Water-based mud systems use bentonite, polymers, and weighting agents. Oil-based muds provide superior performance in reactive shales and high-temperature wells. Completion fluids including brines and specialized pills minimize formation damage. Cementing additives control slurry properties and ensure zonal isolation. All chemicals must be compatible with Oman environmental regulations and operator specifications.',
        tips: [
          'Clear brine completion fluids should be filtered to <2 micron',
          'Calcium chloride brines are preferred for temperatures above 120°C',
          'Formation damage from incompatible fluids can reduce productivity by 50%+'
        ]
      }
    ],
    keyProducts: [
      'Corrosion Inhibitors',
      'Scale Inhibitors',
      'Demulsifiers',
      'H2S Scavengers',
      'Biocides',
      'Pour Point Depressants',
      'Drilling Chemicals'
    ],
    faqs: [
      {
        question: 'What corrosion inhibitor is best for high-H2S service in Oman?',
        answer: 'For high-H2S environments common in Oman, imidazoline-based corrosion inhibitors with sulfur scavenging properties are typically most effective. These provide both film-forming protection and active H2S neutralization. Selection should be based on laboratory testing with your specific produced fluids and operating conditions. Global Chemicals LLC can arrange testing and technical support for inhibitor selection.'
      },
      {
        question: 'How do I get chemicals approved for use with PDO or OQ?',
        answer: 'Major Oman operators maintain approved vendor lists and chemical approval processes. Requirements typically include product technical data sheets, SDS, third-party test reports, field trial proposals, and environmental assessments. Approval timelines range from 6-12 months. Global Chemicals LLC has experience navigating these processes and can support new product qualifications for PDO, OQ, and other operators.'
      },
      {
        question: 'What is the typical squeeze treatment life for scale inhibitors?',
        answer: 'Scale inhibitor squeeze treatment life in Oman wells typically ranges from 3-12 months depending on water production rate, formation permeability, and inhibitor type. Phosphonate inhibitors generally have shorter squeeze life but work across a wider temperature range. Polymer inhibitors provide longer protection in carbonate formations. Post-squeeze monitoring of inhibitor returns helps optimize retreatment timing.'
      }
    ]
  },
  {
    id: 'ro-desalination-chemicals',
    title: 'RO & Desalination Chemicals Complete Guide for Oman',
    slug: 'ro-desalination-chemicals-guide-oman',
    excerpt: 'Comprehensive guide to reverse osmosis and desalination chemicals in Oman. Learn about anti-scalants, membrane cleaners, and pre-treatment chemicals for seawater and brackish water RO plants in Muscat, Sohar, Duqm, and Salalah.',
    icon: Waves,
    category: 'Desalination',
    readTime: '18 min read',
    lastUpdated: '2024-12-16',
    sections: [
      {
        title: 'Introduction to RO & Desalination in Oman',
        content: 'Oman is one of the world\'s largest producers of desalinated water, with desalination plants accounting for over 85% of drinking water supply. From the massive Barka desalination plant to industrial RO units in Sohar and Duqm, reverse osmosis technology is critical to Oman\'s water security. The unique challenges of treating seawater with high TDS (45,000+ ppm), elevated temperatures year-round, and high calcium/magnesium content make proper chemical treatment essential. This comprehensive guide covers anti-scalants, membrane cleaning chemicals, and pre-treatment programs specifically designed for Oman\'s desalination operations.',
        tips: [
          'Oman operates over 30 desalination plants producing 500+ million m³ of water annually',
          'Seawater RO recovery rates typically range from 35-45% in Oman due to high salinity',
          'Proper chemical treatment can extend membrane life from 3 years to 7+ years, saving millions in replacement costs'
        ]
      },
      {
        title: 'Understanding Anti-Scalants: What They Are and Why Critical',
        content: '**What Are Anti-Scalants?** Anti-scalants are specialty chemicals that prevent mineral scale formation on RO membranes. In Oman\'s seawater, calcium sulfate, calcium carbonate, barium sulfate, and silica scales are the primary threats. Without anti-scalants, these minerals precipitate on membrane surfaces within hours, reducing permeate flow, increasing pressure drop, and causing irreversible membrane damage. **How Anti-Scalants Work:** They function through three mechanisms: (1) Threshold inhibition—preventing crystal nucleation at sub-stoichiometric dosages, (2) Crystal modification—distorting crystal growth to keep particles in suspension, and (3) Dispersion—keeping particles separated to prevent agglomeration. **Why Critical in Oman:** The Arabian Gulf has some of the world\'s most challenging seawater chemistry. Calcium levels exceed 600 ppm, sulfate reaches 3,000+ ppm, and warm inlet temperatures (25-35°C) accelerate scaling kinetics. A single day without anti-scalant can cause scaling that requires aggressive chemical cleaning or membrane replacement. Economic impact: Anti-scalant costs 0.02-0.05 OMR per cubic meter but prevents damage costing 10-20 OMR per cubic meter in membrane replacement.',
        tips: [
          'Anti-scalant dosing typically ranges from 2-5 ppm depending on feedwater chemistry',
          'Phosphonate-based anti-scalants are most common for carbonate and sulfate scales',
          'Green/biodegradable anti-scalants are increasingly required for environmental compliance',
          'Automated dosing systems ensure consistent protection across varying feedwater conditions'
        ]
      },
      {
        title: 'Types of Anti-Scalants and Selection Guide',
        content: '**Phosphonate-Based Anti-Scalants:** The most widely used type in Oman. HEDP (Hydroxyethylidene Diphosphonic Acid), ATMP (Amino Trimethylene Phosphonic Acid), and DTPMPA formulations effectively control calcium carbonate, calcium sulfate, and barium sulfate scales. Effective up to 150°C and across pH 5-10. Typical dosage: 2-4 ppm. Best for standard seawater RO applications in Muscat and Sohar plants. **Polymeric Anti-Scalants:** Polyacrylate and polymaleic acid formulations provide superior dispersion for silica and iron scales. Essential for brackish water RO and when feedwater contains colloidal silica. These work through dispersion rather than threshold inhibition. Dosage: 3-6 ppm. Preferred for Salalah\'s brackish water sources and industrial applications. **Green/Biodegradable Anti-Scalants:** Formulated without phosphonates for environmental sensitivity. Used in Zero Liquid Discharge (ZLD) systems and where concentrate discharge regulations are strict. Performance is comparable but cost is 20-30% higher. Required for some coastal discharge permits in Oman. **How to Select:** Consider feedwater analysis (calcium, sulfate, silica, pH, temperature), target recovery rate (higher recovery = more aggressive anti-scalant needed), membrane type (check manufacturer compatibility), and environmental regulations. Global Chemicals LLC provides free water analysis and anti-scalant selection consultation for Oman operations.',
        tips: [
          'Always conduct jar tests with your specific feedwater before selecting anti-scalant',
          'Check membrane manufacturer approval lists—some formulations void warranties',
          'Consider multi-component formulations for complex feedwater chemistry',
          'Store anti-scalants at 15-30°C; crystallization can occur if stored too cold'
        ]
      },
      {
        title: 'RO Membrane Cleaning Chemicals: Alkaline and Acidic Cleaners',
        content: '**Why Membrane Cleaning is Essential:** Despite anti-scalant treatment, membranes require periodic chemical cleaning when normalized permeate flow decreases by 10-15% or salt passage increases by 10%. In Oman\'s harsh conditions, cleaning is typically needed every 3-6 months. **Acidic Cleaners for Inorganic Fouling:** Citric acid (2-4% solution, pH 3-4) is the primary cleaner for calcium carbonate, calcium sulfate, and iron oxide scales. Hydrochloric acid (0.5-1%) is used for severe carbonate scaling but requires careful pH control to prevent membrane damage. Sulfamic acid provides gentler cleaning for temperature-sensitive membranes. Cleaning procedure: Recirculate at low pressure (3-4 bar) for 30-60 minutes at 30-40°C. **Alkaline Cleaners for Organic/Biological Fouling:** Caustic soda (NaOH) solutions at pH 11-12 remove organic matter, biofilms, and silica. Surfactant-enhanced formulations improve penetration into fouling layers. EDTA/citrate formulations chelate metals while maintaining alkaline pH. Critical for Oman plants experiencing biofouling from warm inlet temperatures. **Two-Step Cleaning Protocol:** For mixed fouling (common in Oman), perform alkaline cleaning first to remove organics and biofilm, followed by acidic cleaning for scale removal. This sequence prevents organic matter from being "baked on" by acidic conditions. **Cleaning Frequency:** Monitor normalized parameters weekly. Clean when differential pressure increases by 15% or permeate quality degrades. Delaying cleaning makes fouling more difficult to remove and can cause permanent damage.',
        tips: [
          'Always consult membrane manufacturer cleaning guidelines before selecting chemicals',
          'Warm cleaning solutions to 30-40°C for optimal performance (never exceed manufacturer limits)',
          'Rinse thoroughly with permeate water between acidic and alkaline cleaning steps',
          'Conduct membrane autopsy analysis annually to optimize cleaning programs',
          'Keep detailed cleaning logs to track normalized performance and predict cleaning intervals'
        ]
      },
      {
        title: 'Pre-Treatment Chemicals: Coagulation, Filtration, and Disinfection',
        content: '**Coagulation for Suspended Solids Removal:** Seawater contains suspended solids, colloidal materials, and organic matter that must be removed before RO membranes. Ferric chloride (5-10 ppm) is the preferred coagulant for seawater due to effective flocculation across a wide pH range and removal of dissolved organic carbon. Poly Aluminium Chloride (PAC) is an alternative for lower-turbidity applications. Coagulation pH should be maintained at 6.5-7.5 for optimal performance. **Multimedia Filtration:** After coagulation, dual media filters (anthracite + sand) or multimedia filters remove flocculated particles down to 10-20 microns. Backwashing frequency depends on inlet turbidity but typically occurs every 24-48 hours in Oman conditions. **Cartridge Filtration:** Final polishing through 5-micron cartridge filters protects RO membranes from particulate damage. Replace cartridges when differential pressure exceeds 1 bar or at least every 6 months. **Sodium Bisulfite for Dechlorination:** Chlorine irreversibly damages polyamide RO membranes. Sodium bisulfite (sodium metabisulfite) is dosed at 3:1 ratio to residual chlorine to ensure complete removal. Critical for plants using chlorinated seawater intake or when chlorine is used for pre-treatment biofouling control. Monitor ORP (oxidation-reduction potential) to confirm dechlorination—target below 200 mV. **Biocide Programs:** Warm seawater in Oman (25-35°C year-round) promotes rapid biological growth. Non-oxidizing biocides (DBNPA, isothiazolin) are dosed intermittently for biofilm control in intake systems and pre-treatment. Avoid oxidizing biocides before RO to prevent membrane oxidation.',
        tips: [
          'SDI (Silt Density Index) must be below 3.0 before RO membranes, preferably below 2.0',
          'Overdosing sodium bisulfite wastes chemical and can promote biological growth',
          'Install ORP sensors after bisulfite dosing to confirm complete dechlorination',
          'Pre-filter replacement frequency increases in summer due to higher biological activity',
          'Shock dose biocides during low-production periods for maximum contact time'
        ]
      },
      {
        title: 'Post-Treatment: pH Adjustment and Remineralization',
        content: '**Why Post-Treatment is Necessary:** RO permeate is aggressive (low pH 5.5-6.5, near-zero alkalinity) and will corrode distribution pipes if not stabilized. Oman\'s concrete and steel distribution infrastructure requires proper conditioning. **Caustic Soda for pH Adjustment:** Sodium hydroxide (caustic soda) is dosed to raise pH to 7.0-8.5 for distribution. Dosage typically 5-15 ppm depending on target pH and permeate alkalinity. Automated pH control systems maintain consistent quality. **Remineralization with Limestone/Calcite:** Some plants use limestone contactors to add calcium and alkalinity naturally, creating stable water that meets Langelier Saturation Index requirements. This reduces caustic consumption and provides beneficial minerals. **Sodium Hypochlorite for Residual Disinfection:** Chlorine dosing (0.2-0.5 ppm free chlorine) is required before storage and distribution to prevent microbial regrowth. Calcium hypochlorite or sodium hypochlorite can be used—calcium hypochlorite is preferred for large plants due to stability in Oman\'s heat. **Corrosion Inhibitors:** Blended phosphate/silicate inhibitors (2-5 ppm) protect distribution system from internal corrosion and reduce lead/copper leaching in plumbing. Particularly important for legacy infrastructure in Muscat and older areas. **Fluoridation (Optional):** Some municipal systems add fluoride (0.7-1.0 ppm) for dental health benefits. Sodium fluorosilicate or sodium fluoride are used depending on dosing system.',
        tips: [
          'Always adjust pH before chlorination—chlorine is more stable at higher pH',
          'Monitor Langelier Saturation Index to ensure water is neither corrosive nor scale-forming',
          'Caustic soda storage requires HDPE or FRP tanks—carbon steel will corrode',
          'Blend permeate with brackish/treated water for cost-effective remineralization in some applications',
          'Post-treatment costs typically 0.01-0.03 OMR per cubic meter but prevent millions in infrastructure corrosion'
        ]
      },
      {
        title: 'Troubleshooting Common RO Problems in Oman Operations',
        content: '**Problem: Rapid Pressure Drop Increase** - Causes: (1) Inadequate pre-treatment allowing particulate fouling, (2) Biological fouling from warm intake water, (3) Colloidal fouling from high silica/iron. Solutions: Check SDI < 3.0, inspect cartridge filters for premature plugging, increase biocide frequency, perform alkaline cleaning followed by acid cleaning if needed. **Problem: High Salt Passage (Low Rejection)** - Causes: (1) Membrane damage from oxidation or scaling, (2) O-ring leaks in pressure vessels, (3) Telescoping of membrane elements. Solutions: Verify zero chlorine residual at RO inlet, inspect for mechanical damage, conduct salt passage test on individual elements to isolate failures, replace damaged elements. **Problem: Excessive Anti-Scalant Consumption** - Causes: (1) Incorrect dosing pump calibration, (2) Recovery rate set too high for water chemistry, (3) Concentrate recycling causing super-saturation. Solutions: Verify dosing pump with graduated cylinder test, recalculate LSI/S&DSI indices, reduce recovery rate if operating beyond saturation limits, check for system leaks. **Problem: Frequent Membrane Cleaning Required** - Causes: (1) Inadequate pre-treatment, (2) Incorrect anti-scalant selection, (3) Operating beyond design flux rates. Solutions: Review and upgrade pre-treatment (coagulation, filtration), conduct jar tests for anti-scalant optimization, reduce flux to manufacturer recommendations (typically 15-20 LMH for seawater), install continuous monitoring for early intervention. **Problem: Biological Fouling Despite Biocide Treatment** - Causes: (1) Insufficient contact time for biocide, (2) Biofilm establishment in dead legs, (3) Nutrient accumulation in pre-treatment. Solutions: Increase biocide contact time to minimum 30 minutes, eliminate dead legs and low-flow zones, perform alkaline shock cleaning, consider continuous low-dose biocide rather than intermittent shock dosing. **When to Call for Help:** Global Chemicals LLC provides technical support for RO troubleshooting including water analysis, autopsy interpretation, and chemical program optimization. Contact our team for persistent performance issues or before major cleaning/membrane replacement decisions.',
        tips: [
          'Keep detailed operating logs—trends reveal problems before crisis develops',
          'Normalize all performance data to standard conditions (temperature, pressure, salinity)',
          'Conduct quarterly membrane autopsy on sacrificial elements to optimize programs',
          'Establish relationships with chemical suppliers BEFORE emergencies occur',
          'Train operators on normalized performance calculations and early warning signs'
        ]
      },
      {
        title: 'Chemical Dosing Best Practices and Safety',
        content: '**Automated Dosing Systems:** Use positive displacement metering pumps for precise anti-scalant and bisulfite dosing. Flow-proportional dosing adjusts chemical feed based on RO feed flow to maintain consistent concentration. Install pulsation dampeners to prevent pressure spikes. Calibrate pumps monthly using graduated cylinder method. **Chemical Storage and Handling:** Anti-scalants: Store in HDPE or FRP tanks at 15-30°C, shelf life 12-24 months. Sodium bisulfite: Store in opaque containers away from heat and oxidizers, use within 6 months as it degrades. Cleaning chemicals: Separate storage for acids and caustics, never mix incompatible chemicals. Ensure proper ventilation and containment. **Safety Equipment:** Acid/caustic handling requires PPE (goggles, face shield, rubber gloves, apron), emergency eyewash and safety showers within 10 meters, spill containment and neutralization kits. Staff training on SDS and emergency procedures is mandatory. **Injection Points:** Anti-scalant: Inject into RO feed before cartridge filters to allow adequate mixing. Sodium bisulfite: Inject after coagulation but before RO with minimum 30 seconds contact time. Post-treatment chemicals: Inject into permeate stream with static mixers for uniform blending. **Monitoring and Control:** Install online analyzers for critical parameters—ORP for dechlorination verification, conductivity for salt passage monitoring, pH for post-treatment. SCADA systems enable remote monitoring and automatic chemical dosing adjustments. Set alarms for out-of-range conditions. **Quality Assurance:** Purchase chemicals from reputable suppliers with consistent quality. Request Certificate of Analysis for critical chemicals. Conduct acceptance testing on new chemical batches before adding to main storage tanks. Maintain minimum 30-day chemical inventory to prevent supply disruptions.',
        tips: [
          'Never adjust multiple chemical dosages simultaneously—change one parameter at a time',
          'Label all chemical tanks, piping, and injection points clearly in English and Arabic',
          'Conduct monthly safety drills for chemical spill response',
          'Keep detailed chemical consumption records to identify unusual patterns',
          'Establish backup chemical suppliers for business continuity'
        ]
      }
    ],
    keyProducts: [
      'Anti-Scalants (Phosphonate & Polymeric)',
      'Citric Acid (Membrane Cleaner)',
      'Caustic Soda (Alkaline Cleaner)',
      'Sodium Bisulfite (Dechlorination)',
      'Ferric Chloride (Coagulant)',
      'Sodium Hypochlorite (Disinfection)',
      'Non-Oxidizing Biocides',
      'Corrosion Inhibitors'
    ],
    faqs: [
      {
        question: 'What is an anti-scalant and why is it essential for RO systems in Oman?',
        answer: 'Anti-scalants are specialty chemicals that prevent mineral scale (calcium sulfate, calcium carbonate, barium sulfate, silica) from forming on RO membranes. In Oman, seawater contains extremely high calcium (600+ ppm), sulfate (3,000+ ppm), and operates at warm temperatures that accelerate scaling. Without anti-scalants, membranes would scale within hours, causing irreversible damage. Proper anti-scalant treatment extends membrane life from 3 to 7+ years, saving millions of Rials in replacement costs. Typical dosing is 2-5 ppm, costing only 0.02-0.05 OMR per m³ produced.'
      },
      {
        question: 'How often should RO membranes be cleaned in Oman desalination plants?',
        answer: 'RO membranes in Oman typically require cleaning every 3-6 months due to challenging feedwater conditions (high salinity, warm temperatures, biological activity). Clean when normalized permeate flow decreases 10-15% or salt passage increases 10%. Use acidic cleaners (citric acid) for scale fouling and alkaline cleaners (caustic soda) for organic/biological fouling. A two-step cleaning (alkaline first, then acid) is recommended for mixed fouling. Delaying cleaning makes fouling harder to remove and can cause permanent membrane damage.'
      },
      {
        question: 'Which anti-scalant type should I use: phosphonate or polymeric?',
        answer: 'For standard seawater RO in Oman (Muscat, Sohar, Duqm), phosphonate-based anti-scalants (HEDP, ATMP, DTPMPA) are most effective for controlling calcium carbonate and calcium sulfate scales at 2-4 ppm dosing. Polymeric anti-scalants (polyacrylate, polymaleic acid) are better for brackish water or when silica/iron fouling is a concern—use 3-6 ppm. Selection depends on feedwater analysis. Global Chemicals LLC provides free water analysis and anti-scalant selection consultation. Always check membrane manufacturer compatibility before use.'
      },
      {
        question: 'How do I know if my RO system has scaling or fouling problems?',
        answer: 'Monitor normalized performance parameters weekly: (1) Declining permeate flow (>10% drop indicates fouling/scaling), (2) Increasing differential pressure (>15% rise signals particulate/biological fouling), (3) Increasing salt passage (>10% increase suggests membrane damage or scaling). Other signs include rapid cartridge filter plugging, visible deposits during membrane inspection, and higher cleaning frequency. Conduct membrane autopsy analysis annually to identify fouling type and optimize chemical treatment programs.'
      },
      {
        question: 'Do you provide technical support for RO chemical programs in Oman?',
        answer: 'Yes, Global Chemicals LLC provides comprehensive technical support for RO and desalination operations across Oman including: free feedwater analysis and anti-scalant selection, membrane cleaning protocol development, troubleshooting for performance issues, membrane autopsy interpretation, chemical dosing optimization, and operator training. Our technical team has extensive experience with Oman\'s seawater chemistry and can visit your site in Muscat, Sohar, Duqm, or Salalah. Contact us for consultation or emergency support.'
      }
    ]
  },
  {
    id: 'cooling-tower-chemicals',
    title: 'Cooling Tower Chemicals & Water Treatment Complete Guide for Oman',
    slug: 'cooling-tower-chemicals-guide-oman',
    excerpt: 'Complete guide to cooling tower water treatment in Oman. Learn about scale inhibitors, corrosion inhibitors, biocides, and water treatment programs for industrial cooling systems in Muscat, Sohar, Duqm, and Salalah.',
    icon: ThermometerSun,
    category: 'Cooling Water',
    readTime: '16 min read',
    lastUpdated: '2024-12-16',
    sections: [
      {
        title: 'Introduction to Cooling Tower Water Treatment in Oman',
        content: 'Cooling towers are the backbone of industrial operations across Oman—from refineries in Sohar to petrochemical complexes in Duqm, power plants in Muscat, and manufacturing facilities throughout the Sultanate. In Oman\'s extreme climate with ambient temperatures exceeding 45°C in summer, cooling towers face unique challenges: rapid evaporation concentrating minerals, warm makeup water promoting biological growth, and dusty conditions accelerating fouling. Without proper chemical treatment, cooling towers suffer from three critical problems: scale formation reducing heat transfer efficiency, corrosion destroying expensive equipment, and biofouling creating slime and health hazards. This comprehensive guide explains cooling tower chemistry, treatment programs, and best practices specifically for Oman\'s industrial operations.',
        tips: [
          'A single day without proper treatment can cause scaling that reduces heat transfer by 10-30%',
          'Untreated cooling towers in Oman can develop Legionella bacteria in 2-4 weeks',
          'Proper chemical treatment costs 0.5-2% of total cooling system operating costs but prevents 90% of failures',
          'Evaporation rates in Oman reach 1-2% of recirculation rate in summer, rapidly concentrating minerals'
        ]
      },
      {
        title: 'Understanding the Three Major Cooling Tower Problems',
        content: '**Scale Formation:** As water evaporates in the cooling tower, dissolved minerals (calcium, magnesium, silica) concentrate until they exceed solubility limits and precipitate as hard deposits on heat exchanger surfaces, fill media, and piping. Common scales in Oman include calcium carbonate, calcium sulfate, calcium phosphate, and silica. Scale acts as insulation—just 1mm of calcium carbonate scale reduces heat transfer efficiency by 25%, forcing increased energy consumption and reduced production capacity. **Corrosion:** Oxygen-rich cooling water combined with heat, flow velocities, and pH fluctuations causes aggressive corrosion of carbon steel, copper alloys, and galvanized components. Types include uniform corrosion (general metal loss), pitting corrosion (localized holes), galvanic corrosion (dissimilar metals), under-deposit corrosion, and microbiologically influenced corrosion (MIC). A single pinhole leak can shut down operations and cause millions in damage. **Biofouling and Biological Growth:** Warm water (30-45°C in Oman), nutrients, oxygen, and sunlight create ideal conditions for microorganisms. Bacteria form biofilms (slime), algae grows on tower surfaces, and fungi colonize wood components. Biofilms insulate heat transfer surfaces, accelerate under-deposit corrosion, plug distribution systems, and harbor Legionella bacteria creating health hazards. **Oman-Specific Challenges:** High-TDS makeup water (desalinated or brackish), extreme heat accelerating all three problems, dusty environment introducing particulates, and high biological oxygen demand from warm source water.',
        tips: [
          'Cycles of concentration typically limited to 3-5 in Oman vs 5-8 in cooler climates',
          'Langelier Saturation Index (LSI) predicts calcium carbonate scaling tendency',
          'Corrosion rates above 0.1 mm/year require program adjustment',
          'Heterotrophic plate counts above 100,000 CFU/mL indicate inadequate biocide treatment'
        ]
      },
      {
        title: 'Scale Inhibitors: Chemistry, Types, and Selection',
        content: '**What Are Scale Inhibitors?** Scale inhibitors (also called anti-scalants or dispersants) prevent mineral precipitation through threshold inhibition, crystal modification, and dispersion—the same mechanisms as RO anti-scalants but at higher dosages for harsher conditions. **Phosphonate-Based Inhibitors:** HEDP, ATMP, and PBTC are the workhorses of cooling tower treatment. They function by adsorbing onto crystal nucleation sites, distorting crystal growth, and keeping particles dispersed. Effective dosage: 5-20 ppm active ingredient. Temperature limit: up to 60°C for most formulations. Works across pH 6.5-9.5. Best for calcium carbonate and calcium phosphate control. **Polymeric Dispersants:** Polyacrylates, polymaleic acid, and terpolymers provide superior dispersion of iron oxide, silica, and calcium sulfate. Dosage: 3-10 ppm. Essential for high-silica makeup water common in some Oman regions. Often blended with phosphonates for synergistic performance. **Phosphate Programs (Traditional):** Orthophosphate provides both scale and corrosion control through protective film formation. Dosage: 5-15 ppm as PO4. Requires careful pH control (7.5-8.5) and monitoring to prevent calcium phosphate scaling. Less common in modern programs due to phosphate discharge restrictions. **All-Organic Programs (Green):** Formulated without phosphorus for environmental compliance. Use polymeric technology with organic corrosion inhibitors. Required where discharge to wadis or coastal areas is restricted. Performance comparable to phosphonates but 20-40% higher cost. **Selection Criteria:** Makeup water chemistry (calcium, alkalinity, pH, silica), cycles of concentration target, system metallurgy, operating temperature, and discharge regulations. Global Chemicals LLC provides free water analysis and scale inhibitor selection for Oman operations.',
        tips: [
          'Calcium hardness above 300 ppm requires aggressive scale inhibitor programs',
          'Silica control becomes critical above 150 ppm in makeup water',
          'Phosphonate inhibitors can feed biological growth—balance with adequate biocide',
          'Monitor inhibitor residuals weekly—depletion indicates dosing problems or biological consumption'
        ]
      },
      {
        title: 'Corrosion Inhibitors: Protecting Your Investment',
        content: '**Corrosion Control Fundamentals:** Effective corrosion control requires proper pH (7.5-9.0), adequate inhibitor residuals, controlled oxidizing biocide levels, and elimination of deposits that cause under-deposit corrosion. Target corrosion rates: <0.1 mm/year for carbon steel, <0.025 mm/year for copper alloys. **Azole Corrosion Inhibitors:** Tolyltriazole (TTA) and benzotriazole (BZT) are essential for copper and brass protection in heat exchangers and condensers. They form protective films on copper surfaces preventing oxidation. Dosage: 2-8 ppm. Critical for systems with copper alloys—without azoles, copper corrosion products deposit throughout the system causing galvanic corrosion of steel. **Zinc-Based Programs:** Zinc combined with phosphonates or phosphates provides excellent carbon steel protection through formation of protective zinc phosphate films. Dosage: 0.5-3 ppm as Zn. Effective across wide pH range. Caution: Zinc discharge is regulated—check local limits before use. Not suitable for discharge to marine environments. **Molybdate Inhibitors:** Sodium molybdate provides non-toxic, environmentally friendly corrosion protection. Dosage: 5-20 ppm as MoO4. Works synergistically with phosphonates. Preferred for systems with discharge restrictions. Higher cost but excellent performance. **Organic Corrosion Inhibitors:** Phosphonates (HEDP, AMP) provide both scale and corrosion control. Form protective films on metal surfaces. Part of most modern all-in-one formulations. **Nitrite Programs (Closed Systems):** Sodium nitrite is the gold standard for closed cooling systems (chilled water loops, process cooling). Dosage: 500-1500 ppm. Not suitable for open towers due to biological consumption. **Monitoring Corrosion:** Use corrosion coupons (mild steel, copper) with 90-day exposure, measure metal ion release (iron, copper in system water), and monitor pH and inhibitor residuals. Annual inspection of heat exchangers reveals actual corrosion patterns.',
        tips: [
          'Never use chromate inhibitors—banned in Oman due to toxicity and carcinogenicity',
          'Chlorine residuals above 0.5 ppm can overcome corrosion inhibitor protection',
          'Copper levels above 0.3 ppm indicate inadequate azole treatment',
          'Stagnant water during shutdowns causes severe corrosion—maintain treatment during outages'
        ]
      },
      {
        title: 'Biocides and Microbiological Control Programs',
        content: '**Why Biocide Treatment is Critical:** Oman\'s year-round warm water (30-45°C) creates ideal bacterial growth conditions. Without biocide control, biofilms develop within 7-14 days, reducing heat transfer, accelerating corrosion, and harboring Legionella bacteria. **Oxidizing Biocides:** Chlorine (sodium hypochlorite, calcium hypochlorite) is the most common oxidizing biocide. Dosage: maintain 0.2-0.5 ppm free chlorine residual continuously, or shock dose at 5-10 ppm for 2-4 hours daily. Advantages: broad-spectrum kill, low cost, easy to monitor. Disadvantages: corrosive at high levels, degrades in heat and sunlight, reacts with organics. Chlorine dioxide provides superior penetration into biofilms with less corrosion but requires on-site generation. Bromine (from BCDMH or hypobromite) is more stable than chlorine at high pH and temperature—preferred for some Oman applications. **Non-Oxidizing Biocides:** Essential for supplemental control and shock treatments. Isothiazolin (2-5 ppm, 2-3 times weekly), Glutaraldehyde (10-50 ppm weekly), DBNPA (5-15 ppm, 2-3 times weekly), and Quaternary ammonium compounds (20-50 ppm weekly). Non-oxidizers penetrate biofilms, kill chlorine-resistant bacteria, and target specific organisms. Rotate chemistries every 2-3 months to prevent resistance. **Legionella Control:** Particularly critical for cooling towers near occupied buildings or with drift potential. Maintain continuous chlorine residual OR use shock biocide programs proven effective against Legionella. Monitor with monthly Legionella testing (culture or PCR methods). Risk assessment and control plan required under Oman health regulations. **Algae Control:** Use copper-based algaecides (copper sulfate or chelated copper formulations) at 0.2-0.5 ppm Cu for algae prevention. Quaternary compounds also provide algae control. Physical removal (tower cleaning) required for severe infestations. **Biocide Program Design:** Most Oman systems use continuous chlorine (0.2-0.5 ppm) PLUS weekly non-oxidizing biocide shock treatment. This dual approach controls planktonic bacteria (chlorine) and biofilms (non-oxidizers). Automated feed systems ensure consistent treatment.',
        tips: [
          'Never mix oxidizing and non-oxidizing biocides—can create toxic reactions',
          'Dose non-oxidizers when chlorine residual is <0.2 ppm to avoid deactivation',
          'Biofilm already present? Perform alkaline cleaning before biocide program',
          'High organic loading depletes biocides—control with filtration and blowdown',
          'Dead legs and low-flow areas harbor biofilms—ensure circulation to all zones'
        ]
      },
      {
        title: 'Water Treatment Programs: All-in-One vs Multi-Product',
        content: '**All-in-One Programs:** Single formulation containing scale inhibitor, corrosion inhibitor, and dispersant in optimized ratio. Examples: Altreat series products combining phosphonates, polymers, azoles, and optional zinc or molybdate. Advantages: Simplified dosing (one pump, one tank), pre-optimized chemistry, reduced inventory, ideal for smaller systems or limited operator expertise. Dosage: typically 20-60 ppm of formulated product depending on makeup water quality and cycles of concentration. Most common approach in Oman for systems under 1,000 tons cooling capacity. **Multi-Product Programs:** Separate scale inhibitor, corrosion inhibitor, and biocide products dosed independently. Allows precise adjustment of each component based on system conditions. Advantages: Optimization for changing conditions, flexibility for unusual water chemistry, better performance for large or critical systems. Requires more sophisticated control and operator training. Common for refineries, petrochemical plants, power stations. **Program Selection Factors:** System size (all-in-one for <500 tons, multi-product for >1,000 tons), water chemistry complexity, operator expertise, criticality of operation, and automation available. **Cycles of Concentration:** Makeup water is concentrated by evaporation. Cycles = concentration factor (e.g., 4 cycles means dissolved solids are 4× makeup levels). Higher cycles reduce makeup water and blowdown costs but increase scaling and corrosion risk. Oman systems typically operate at 3-5 cycles (vs 5-8 in cooler climates) due to high scaling potential. Cycles limited by calcium saturation, silica solubility, chloride corrosion risk, or biocide demand. **Blowdown Control:** Controlled discharge of concentrated water to limit cycles. Can be continuous (constant small flow) or automated (conductivity-controlled). Proper blowdown is critical to program success—too little causes scaling, too much wastes water and chemicals. Monitor with conductivity ratio or calcium analysis.',
        tips: [
          'Calculate cycles from conductivity ratio: Cycles = (Recirculating conductivity) / (Makeup conductivity)',
          'Never operate below 2.5 cycles—wastes water and creates corrosion risk from low alkalinity',
          'Systems frequently offline need "idle" programs to prevent stagnation corrosion',
          'Automated blowdown control provides 15-25% chemical cost savings vs manual control',
          'Consider water recovery technologies (side-stream RO) to increase cycles above 6'
        ]
      },
      {
        title: 'Troubleshooting Common Cooling Tower Problems in Oman',
        content: '**Problem: White/Brown Scale on Fill or Heat Exchangers** - Causes: (1) Insufficient scale inhibitor dosage, (2) Cycles too high for water chemistry, (3) pH too high causing calcium carbonate precipitation. Solutions: Test scale deposit (acid test for carbonate, XRD for identification), reduce cycles of concentration, increase scale inhibitor dosage by 50-100%, lower pH to 7.5-8.0 with acid feed, verify inhibitor feed pump operation. For severe scaling, perform acid cleaning (5% hydrochloric acid recirculation). **Problem: Red/Brown Water and High Iron Levels** - Causes: (1) Corrosion of carbon steel components, (2) Inadequate corrosion inhibitor, (3) Low pH, (4) Chlorine overdosing. Solutions: Test corrosion rates with coupons, check pH (should be 7.5-8.5), verify corrosion inhibitor residuals, reduce chlorine to <0.5 ppm continuous, increase azole dosage if copper corrosion is present, inspect for under-deposit corrosion areas. **Problem: Slimy Biofilm on Surfaces** - Causes: (1) Inadequate biocide treatment, (2) Dead legs with poor circulation, (3) High nutrients from process contamination. Solutions: Increase biocide frequency and dosage, shock treat with 10 ppm chlorine for 4 hours OR non-oxidizer at 2× normal dose, perform mechanical cleaning of tower basin and fill, improve circulation to eliminate dead zones, test for Legionella if biofilm is heavy, implement continuous chlorine residual (0.3-0.5 ppm minimum). **Problem: High Makeup Water Consumption** - Causes: (1) Excessive blowdown, (2) System leaks, (3) Drift loss. Solutions: Verify cycles of concentration (should be 3-5), check blowdown valve not stuck open, inspect for leaks in makeup line or heat exchangers, install drift eliminators if drift is visible, use conductivity controller for automated blowdown. **Problem: Foaming in Tower Basin** - Causes: (1) Contamination from process leaks, (2) Excessive dispersant dosage, (3) High organic content. Solutions: Test for hydrocarbon contamination, reduce polymer dispersant dosage, increase blowdown temporarily, use antifoam agent if needed, repair process leaks. **Problem: Legionella Detection in Sampling** - Causes: (1) Inadequate biocide control, (2) Biofilm harboring bacteria, (3) Warm water and low flow areas. Solutions: IMMEDIATE: Increase biocide to maximum safe levels, perform hyperhalogenation (10-50 ppm chlorine), notify health authorities per Oman regulations. LONG-TERM: Implement continuous chlorine residual, weekly non-oxidizer shock, quarterly Legionella testing, mechanical cleaning to remove biofilm, eliminate dead legs and stagnant zones.',
        tips: [
          'Document all chemical dosages, residuals, and cycles—troubleshooting requires historical data',
          'Sudden changes indicate process leaks, equipment failure, or makeup water quality shifts',
          'Annual shutdown for complete tower cleaning prevents 70% of chronic problems',
          'Maintain spare pumps, chemicals, and test reagents to avoid treatment interruptions',
          'Partner with Global Chemicals LLC for emergency support and troubleshooting'
        ]
      },
      {
        title: 'Monitoring, Testing, and Best Practices for Oman Operations',
        content: '**Daily Testing:** Measure pH (target 7.5-8.5), conductivity (calculate cycles of concentration), chlorine residual (0.2-0.5 ppm if using continuous feed), and temperature. Quick tests take 5 minutes but prevent major problems. **Weekly Testing:** Total hardness, calcium hardness, total alkalinity (M-alkalinity), chlorides, scale inhibitor residual (if applicable), iron and copper levels, and heterotrophic plate count (HPC) for biological activity. These confirm program is performing and allow dosage adjustments. **Monthly Testing:** Corrosion coupon inspection (if 90-day program, inspect quarterly), Legionella testing (culture or qPCR), deposit analysis from heat exchangers, and comprehensive water analysis. Professional lab analysis recommended quarterly. **Chemical Feed Systems:** Use positive displacement metering pumps for accuracy. Install flow-proportional dosing to adjust chemical feed with makeup flow. Provide chemical day tanks with level alarms. Ensure proper mixing at injection points. Backup pumps for critical systems. Label all tanks in English and Arabic. **Automation and Control:** Conductivity controllers automate blowdown maintaining target cycles. ORP controllers manage chlorine feed. pH controllers add acid/caustic as needed. SCADA systems with remote monitoring enable 24/7 oversight. Automated systems reduce chemical costs 15-30% and prevent excursions. **Preventive Maintenance:** Clean tower basins quarterly, inspect fill media for damage and fouling, clean strainers and filters monthly, check drift eliminators annually, inspect heat exchangers during shutdowns, verify all sensors calibrated, and rotate biocide chemistries every 2-3 months. **Water Conservation:** Maximize cycles within scaling limits, consider side-stream filtration to remove suspended solids, implement rainwater harvesting for makeup (if quality suitable), use conductivity-based blowdown vs time-based, and evaluate water recovery technologies for high-value applications. **Safety and Compliance:** Maintain SDS for all chemicals accessible to operators, provide PPE (gloves, goggles, face shields), train operators on chemical handling and spill response, secondary containment for chemical storage, Legionella risk assessment and control plan per Oman Ministry of Health requirements, and discharge monitoring to meet Environment Authority limits (pH, temperature, TDS, metals, biocides).',
        tips: [
          'Never rely on single test—pH and conductivity together reveal 90% of problems',
          'Log all test results and chemical additions—trends are more valuable than snapshots',
          'Summer heat increases evaporation by 40-60%—adjust treatment accordingly',
          'Train multiple operators so knowledge isn\'t lost with personnel changes',
          'Emergency contact list should include chemical supplier, water treatment service, health authority',
          'Annual third-party audit of program performance identifies optimization opportunities'
        ]
      }
    ],
    keyProducts: [
      'Altreat All-in-One Programs',
      'Scale Inhibitors (Phosphonates, Polymers)',
      'Corrosion Inhibitors (Azoles, Molybdate, Zinc)',
      'Sodium Hypochlorite (Chlorine)',
      'Non-Oxidizing Biocides (Isothiazolin, Glutaraldehyde)',
      'pH Control Chemicals (Acid, Caustic)',
      'Algaecides',
      'Test Kits and Monitoring Equipment'
    ],
    faqs: [
      {
        question: 'What chemicals do I need for cooling tower water treatment in Oman?',
        answer: 'A complete cooling tower program requires: (1) Scale inhibitor to prevent mineral deposits, (2) Corrosion inhibitor to protect metal surfaces, (3) Biocide for microbiological control (typically chlorine plus non-oxidizing biocide), (4) pH control chemicals, and (5) optionally dispersants and antifoam. For simplified treatment, all-in-one programs like Altreat combine scale and corrosion control in a single product—just add biocide separately. Dosage depends on your makeup water chemistry and cycles of concentration. Global Chemicals LLC provides free water analysis and program recommendation for Oman operations.'
      },
      {
        question: 'How often should cooling tower water be tested in Oman?',
        answer: 'DAILY: pH, conductivity (cycles), and chlorine residual—5 minutes prevents major problems. WEEKLY: Hardness, alkalinity, inhibitor residuals, iron/copper, and bacteria count. MONTHLY: Corrosion coupon analysis and Legionella testing (required for systems near occupied areas). In Oman\'s extreme climate, consistent testing is critical—warm temperatures accelerate all problems (scaling, corrosion, biofouling). Automated monitoring systems provide continuous data and reduce labor while improving control.'
      },
      {
        question: 'What causes white scale buildup on my cooling tower fill and heat exchangers?',
        answer: 'White scale is typically calcium carbonate (limestone) precipitating from concentrated cooling water. Causes: (1) High calcium/alkalinity in makeup water common in Oman, (2) Too many cycles of concentration, (3) pH too high (above 8.5), (4) Insufficient scale inhibitor dosage. Solutions: Test deposit with acid (fizzes = carbonate scale), reduce cycles to 3-4, add/increase phosphonate-based scale inhibitor dosage, lower pH to 7.5-8.0, and for severe scaling perform acid cleaning. Prevention is easier than removal—proper chemical treatment costs a fraction of cleaning and lost production.'
      },
      {
        question: 'How do I control Legionella bacteria in my cooling tower?',
        answer: 'Legionella control requires multi-barrier approach: (1) Maintain continuous chlorine residual 0.2-0.5 ppm OR implement weekly non-oxidizing biocide shock proven against Legionella, (2) Perform monthly Legionella testing (culture or qPCR), (3) Eliminate biofilm through quarterly mechanical cleaning, (4) Maintain water temperature below 45°C where possible, (5) Eliminate dead legs and stagnant zones. Oman regulations require Legionella risk assessment and control plan for towers near occupied buildings. If Legionella detected: hyperhalogenate immediately (10-50 ppm chlorine), notify health authorities, and investigate root cause. Global Chemicals LLC assists with Legionella control programs and compliance.'
      },
      {
        question: 'Should I use an all-in-one cooling tower chemical or separate products?',
        answer: 'ALL-IN-ONE programs (like Altreat series): Best for systems under 500 tons cooling capacity, simpler dosing (one chemical feed pump), pre-optimized chemistry, ideal if operators have limited water treatment experience. Dosage typically 20-60 ppm. MULTI-PRODUCT programs: Better for large systems (>1,000 tons), unusual water chemistry, critical operations requiring precise control, facilities with experienced operators. Allows independent adjustment of scale control, corrosion control, and dispersants. For most Oman industrial applications, all-in-one provides excellent performance with simplified operation. Biocides are always dosed separately for both approaches.'
      }
    ]
  },
  {
    id: 'boiler-water-treatment',
    title: 'Boiler Water Treatment Complete Guide for Oman',
    slug: 'boiler-water-treatment-guide-oman',
    excerpt: 'Comprehensive guide to boiler water treatment chemicals in Oman. Learn about oxygen scavengers, scale control, pH management, and condensate treatment for industrial and power generation boilers in Muscat, Sohar, Duqm, and Salalah.',
    icon: Shield,
    category: 'Boiler Treatment',
    readTime: '15 min read',
    lastUpdated: '2024-12-16',
    sections: [
      {
        title: 'Introduction to Boiler Water Treatment in Oman',
        content: 'Industrial boilers are critical to Oman\'s economy—powering refineries in Sohar, generating electricity at power stations in Muscat, providing steam for petrochemical processes in Duqm, and supporting manufacturing throughout the Sultanate. Boiler failures cause catastrophic production losses, safety hazards, and multi-million Rial repair costs. The primary enemies of boiler systems are: oxygen corrosion (pitting that causes tube failures), scale formation (reducing heat transfer and causing overheating), caustic embrittlement (stress corrosion cracking), and carryover (contaminating steam and downstream equipment). Proper chemical treatment is not optional—it\'s essential insurance against boiler failure. This comprehensive guide covers boiler water chemistry fundamentals, oxygen scavengers, scale control, pH management, condensate treatment, and monitoring protocols specifically designed for Oman\'s industrial operations.',
        tips: [
          'A single boiler tube failure can cost 500,000-2,000,000 OMR in lost production and repairs',
          'Oxygen corrosion can cause pitting failure in days without proper scavenger treatment',
          'Just 1mm of scale on boiler tubes increases fuel consumption by 5-8%',
          'Condensate corrosion causes 60% of boiler system failures yet is often ignored'
        ]
      },
      {
        title: 'Understanding Boiler Water Chemistry Fundamentals',
        content: '**How Boilers Work and Why Chemistry Matters:** Boilers convert feedwater to high-pressure steam through intense heat. As water evaporates, dissolved solids remain and concentrate in boiler water—a 1,000-fold concentration factor is common. This concentration creates three critical problems: (1) Minerals exceed solubility and form hard scale on tubes, (2) High-temperature corrosion accelerates exponentially, (3) Contaminated steam damages turbines and process equipment. **Key Water Chemistry Parameters:** pH (alkalinity prevents corrosion), Total Dissolved Solids (TDS controls concentration and carryover), Phosphate/Polymer (prevents hardness scale), Sulfite/Hydrazine (removes oxygen), Alkalinity (buffers pH and neutralizes acids), and Conductivity (monitors TDS levels). Each parameter must be maintained within tight limits—deviation causes problems. **Boiler Pressure Categories:** Low pressure (<300 psi): Less demanding chemistry, phosphate programs common, moderate purity feedwater acceptable. Medium pressure (300-900 psi): Tighter chemistry control, coordinated phosphate or all-polymer programs, high-purity feedwater required. High pressure (>900 psi): Extremely pure feedwater (demineralized), all-volatile treatment or polymer programs, zero hardness tolerance. **Concentration Factor and Blowdown:** As steam leaves, dissolved solids concentrate in remaining water. Blowdown (controlled discharge) limits concentration. Continuous blowdown removes surface contaminants; bottom blowdown removes sludge. Proper blowdown balance: too little causes scaling/carryover, too much wastes heat and chemicals. Target: maintain boiler water TDS at 10-20× feedwater levels. **Oman-Specific Considerations:** High-TDS makeup water (desalinated or brackish) requires excellent pretreatment, warm ambient temperatures affect chemical stability, hard water sources (well water) need aggressive softening, and frequent startups/shutdowns in seasonal operations require layup protection.',
        tips: [
          'For every 15°C increase in temperature, corrosion rates double',
          'Hardness scale thermal conductivity is 1/30th of clean steel—causes tube overheating',
          'Steam purity for turbines requires <10 ppb silica and <20 ppb sodium',
          'Emergency feedwater bypassing treatment is the #1 cause of boiler scaling incidents'
        ]
      },
      {
        title: 'Oxygen Scavengers: Essential Corrosion Protection',
        content: '**Why Oxygen Scavengers are Critical:** Dissolved oxygen in feedwater causes pitting corrosion—localized holes that penetrate boiler tubes causing failures. Mechanical deaeration removes 99% of oxygen, but residual oxygen (5-40 ppb) requires chemical scavenging. Without scavengers, boiler tubes develop pinholes in weeks. **Sodium Sulfite (Most Common):** Reacts with oxygen to form sodium sulfate: 2 Na₂SO₃ + O₂ → 2 Na₂SO₄. Advantages: Low cost, effective, easy to test, safe to handle. Dosage: Theoretical 7.88 ppm per 1 ppm O₂, practical 10-20 ppm excess for safety margin. Temperature limit: Decomposes above 500°F (260°C)—not suitable for high-pressure boilers. Catalyzed formulations work faster at low temperatures. Typical residual: 20-40 ppm in boiler water. Best for low-medium pressure boilers (<600 psi). **Hydrazine (High-Pressure Systems):** N₂H₄ + O₂ → N₂ + 2 H₂O. Decomposes to nitrogen and water—no dissolved solids added. Advantages: Works at high temperatures (>500°F), no TDS increase, protects both boiler and condensate return. Disadvantages: Toxic/carcinogenic (requires careful handling), expensive, regulatory restrictions in some regions. Dosage: Theoretical 1 ppm per 1 ppm O₂, maintain 0.05-0.1 ppm residual in feedwater. Essential for boilers >900 psi. **Organic Oxygen Scavengers (Hydrazine Alternatives):** Diethylhydroxylamine (DEHA), Carbohydrazide, Erythorbate, and Methylethylketoxime (MEKO). Advantages: Non-toxic, environmentally acceptable, effective across wide pressure ranges. Performance comparable to hydrazine. DEHA is most popular—volatile compound providing both boiler and condensate protection. Dosage: 2-5 ppm per 1 ppm O₂. **Tannins (Auxiliary Treatment):** Natural organic compounds that passivate iron surfaces and scavenge trace oxygen. Used in combination with primary scavengers (sulfite/DEHA). Dosage: 10-50 ppm. Particularly effective during layup (idle periods). **Selection Guide:** Low pressure (<300 psi) = Catalyzed sodium sulfite. Medium pressure (300-900 psi) = Sodium sulfite or DEHA. High pressure (>900 psi) = Hydrazine or DEHA/carbohydrazide. Organic scavengers increasingly preferred due to safety and environmental benefits. **Critical Application Points:** Inject into deaerator storage tank or feedwater line before economizer. Never inject directly into boiler. Maintain continuous feed—interruption allows oxygen attack. Monitor residuals daily—depletion indicates oxygen ingress or dosing failure.',
        tips: [
          'Test for oxygen scavenger residual daily—it\'s your first defense against corrosion',
          'Catalyzed sulfite reacts 100× faster than uncatalyzed at low temperatures',
          'Hydrazine requires sealed storage, PPE, and proper ventilation—handle with care',
          'During shutdowns, increase scavenger dosing 3-5× for layup protection',
          'Oxygen ingress from pump seals and makeup water treatment bypasses is common—investigate low residuals'
        ]
      },
      {
        title: 'Scale and Deposit Control in Boilers',
        content: '**Types of Boiler Scale:** Calcium carbonate (most common from hard makeup water), calcium sulfate/gypsum (high-sulfate waters), calcium phosphate (from excess phosphate treatment), magnesium silicate (serpentine), and iron oxide (corrosion products). Each has different thermal conductivity—all are bad. **Phosphate Programs (Traditional Internal Treatment):** Add sodium phosphate (Na₃PO₄) to precipitate hardness as soft, removable calcium phosphate sludge rather than hard scale: 3 Ca²⁺ + 2 PO₄³⁻ → Ca₃(PO₄)₂. Dosage: Maintain 10-40 ppm PO₄ in boiler water depending on pressure. pH control critical: 10.5-11.5 prevents caustic attack while maintaining phosphate solubility. Coordinated phosphate control matches pH to phosphate concentration preventing free caustic. **Chelant Programs:** EDTA and NTA form soluble complexes with hardness ions preventing scale formation. Advantages: Keep minerals in solution (no sludge formation), clean existing deposits, effective for variable feedwater quality. Dosage: Stoichiometric to feedwater hardness (2-5 ppm typically). Temperature limit: EDTA to 450°F, NTA to 600°F—decomposition above these temperatures causes corrosion. Best for moderate-pressure boilers with occasional hardness ingress. **Polymer Programs (All-Polymer Treatment):** Synthetic polymers (polyacrylates, polymaleates, terpolymers) disperse particles preventing agglomeration and deposition. Advantages: No phosphate (eliminates phosphate hideout issues), effective for high-purity feedwater, superior deposit control. Dosage: 2-15 ppm active polymer. Suitable for all pressure ranges with proper feedwater quality. Increasingly common in modern boilers. **Combination Programs:** Phosphate + polymer provides synergistic performance—phosphate precipitates hardness, polymer disperses sludge. Most robust approach for variable conditions. **Feedwater Hardness Limits:** Low pressure: <1 ppm total hardness acceptable with proper internal treatment. Medium pressure: <0.3 ppm required. High pressure: <0.01 ppm (essentially zero hardness—requires softening or demineralization). **Sludge Conditioning:** Polymer dispersants keep precipitated solids suspended for removal via blowdown rather than baking onto tube surfaces. Regular bottom blowdown removes accumulated sludge. **Monitoring Scale Control:** Test for feedwater hardness (should be zero or trace), boiler water phosphate/polymer residuals, and suspended solids. Annual boiler inspection reveals actual deposit formation. Use borescope during operation to check tube cleanliness.',
        tips: [
          'Zero hardness in feedwater is the goal—internal treatment is backup, not primary defense',
          'Phosphate hideout (sudden disappearance) indicates scaling under deposits—investigate immediately',
          'Maintain phosphate residuals in boiler water—depletion allows scaling',
          'Bottom blowdown should be performed daily in low-pressure boilers, shift-wise in high-TDS systems',
          'Scale on tubes appears as white/gray deposits—causes hot spots and tube failures'
        ]
      },
      {
        title: 'pH Control and Alkalinity Management',
        content: '**Why pH Control is Critical:** pH affects corrosion rates, scale formation, and caustic attack. Too low (<9.0): Aggressive acidic corrosion of iron and copper. Too high (>12.0): Caustic embrittlement (stress corrosion cracking) and caustic gouging. Optimal range: 10.5-11.5 for most boilers. **Alkalinity and pH Buffering:** Alkalinity (primarily carbonates and hydroxides) buffers pH against acidic contamination and neutralizes acids formed by breakdown of organic matter or CO₂ ingress. Target alkalinity: 200-700 ppm as CaCO₃ for low-medium pressure boilers. Alkalinity must be balanced with phosphate to prevent free caustic. **Caustic Soda for pH Control:** Sodium hydroxide (NaOH) is the primary chemical for raising boiler water pH. Dosage adjusted to maintain target pH. Caution: Over-dosing creates free caustic causing embrittlement—especially dangerous at tube-to-tube sheet joints and stressed areas. Use coordinated phosphate-pH programs to prevent free caustic. **Neutralizing Amines for Condensate:** Condensate systems develop acidic conditions from CO₂ dissolution (forming carbonic acid). Filming amines (octadecylamine) form protective hydrophobic film on metal surfaces. Neutralizing amines (morpholine, cyclohexylamine, ammonia) raise condensate pH to 8.5-9.5 preventing corrosion. Dosage: Maintain condensate pH 8.5-9.0. Volatile amines distribute throughout steam and condensate system providing comprehensive protection. **Amine Selection:** Morpholine: Good distribution, moderate basicity, broad application. Cyclohexylamine: Higher basicity, faster neutralization, odor in steam. Diethylaminoethanol (DEAE): Lower basicity, longer reach in extended condensate systems. Blends optimize distribution and cost. **Coordinated Phosphate Control:** Matches phosphate concentration to pH preventing free caustic or acidic conditions. Congruent control (pH 9.2-9.6 range) prevents phosphate hideout. Eliminates caustic embrittlement risk while maintaining corrosion protection. **Monitoring pH:** Test boiler water pH daily (target 10.5-11.5), condensate return pH (target 8.5-9.5), and makeup water pH. Sudden pH changes indicate contamination, treatment failure, or chemical feed problems.',
        tips: [
          'Never let boiler water pH drop below 10.0—acidic corrosion accelerates exponentially',
          'Free caustic above 100 ppm causes embrittlement—use coordinated phosphate control',
          'Condensate pH below 7.5 indicates inadequate amine treatment or CO₂ ingress',
          'Emergency acid/caustic additions should be diluted and added slowly—shock changes cause stress',
          'High-pressure boilers (>900 psi) use all-volatile treatment (AVT) with no alkalinity chemicals'
        ]
      },
      {
        title: 'Condensate System Treatment and Return Line Protection',
        content: '**Why Condensate Treatment is Essential:** Condensate return lines suffer severe corrosion from dissolved oxygen and carbonic acid (CO₂ + H₂O → H₂CO₃). Condensate corrosion accounts for 60% of total boiler system failures—yet it\'s often neglected. Iron oxide from condensate corrosion deposits in boilers causing under-deposit corrosion and tube failures. **Dissolved Oxygen in Condensate:** Sources include air in-leakage through vacuum pumps, improper deaerator operation, and steam venting. Even trace oxygen (50 ppb) causes pitting. Control: Ensure deaerator operates properly (<7 ppb O₂ outlet), eliminate air in-leakage, use volatile oxygen scavengers (hydrazine, DEHA) that protect condensate, and monitor condensate oxygen levels. **Carbonic Acid Corrosion:** CO₂ from bicarbonate breakdown in boiler dissolves in condensate creating acidic conditions (pH 5.0-6.5). Results in uniform metal loss (wall thinning) and grooving. Worst in first return line sections where condensate is warmest (higher CO₂ solubility at lower temps). **Filming Amines:** Long-chain amines (octadecylamine, ODA) form hydrophobic monomolecular film on metal surfaces repelling water and preventing corrosion. Advantages: Protects against oxygen and acid corrosion, single treatment for entire system, effective at very low concentrations (0.5-2 ppm). Disadvantages: Can cause foaming if overdosed, may contaminate certain processes (food, pharmaceuticals). **Neutralizing Amines:** Volatile amines raise condensate pH neutralizing carbonic acid. Distribution ratio determines amine selection—match amine volatility to system layout. Morpholine (distribution ratio 1.0) for balanced systems, cyclohexylamine (ratio 3.0) for high pH preference, ammonia (ratio 0.5) for low preference. Blends optimize protection. Dosage: Maintain condensate pH 8.5-9.5. **All-Volatile Treatment (AVT):** For high-pressure boilers and critical applications—uses only volatile chemicals (ammonia, amines, volatile oxygen scavengers) that leave no residue in steam. Essential when steam contacts products or high-purity steam is required. **Condensate Polishing:** Ion exchange or filtration to remove corrosion products, contaminants, and hardness from returned condensate. Protects boiler from contamination and allows higher condensate return percentages. Common in power generation and large industrial systems. **Monitoring Condensate Quality:** Test condensate return: pH (target 8.5-9.5), iron content (<0.3 ppm indicates low corrosion), copper (<0.05 ppm), dissolved oxygen (<7 ppb), and conductivity (detects contamination). High iron = condensate corrosion requiring treatment adjustment.',
        tips: [
          'Condensate return pH below 7.5 means inadequate amine treatment—adjust immediately',
          'Iron levels above 0.3 ppm indicate active corrosion—investigate oxygen or acid attack',
          'First condensate receiver shows worst corrosion—inspect annually for wall thinning',
          'Steam-to-product contact applications may prohibit amines—consult process requirements',
          'Maximize condensate return (target 80-95%)—it\'s hot, pure, and chemically treated water'
        ]
      },
      {
        title: 'Troubleshooting Common Boiler Problems in Oman',
        content: '**Problem: Boiler Tube Pitting (Pin-Hole Leaks)** - Causes: (1) Oxygen corrosion from inadequate scavenger, (2) Low oxygen scavenger residual, (3) Air in-leakage. Solutions: Test oxygen scavenger residual (should be 20-40 ppm sulfite OR 0.05-0.1 ppm hydrazine in feedwater), check for air leaks at pump seals and deaerator, verify deaerator operation (<7 ppb O₂ outlet), increase scavenger dosage by 50-100%, inspect and repair leaking valves/seals. Pitting appears as small holes with crater-like depression—classic oxygen attack signature. **Problem: Hard Scale on Boiler Tubes** - Causes: (1) Hardness in feedwater from softener failure, (2) Inadequate phosphate/polymer residuals, (3) Emergency makeup water bypass. Solutions: Test feedwater hardness immediately (should be <0.3 ppm), verify water softener operation and salt levels, check phosphate/polymer residuals in boiler water, review recent operations for treatment bypasses, increase phosphate dosage temporarily, perform acid cleaning if scale is heavy. White/gray deposits = calcium/magnesium scale. **Problem: Foaming and Carryover (Water in Steam)** - Causes: (1) Excessive TDS in boiler water, (2) Oil/organic contamination, (3) Alkalinity too high, (4) Rapid load changes. Solutions: Increase blowdown to reduce TDS (check conductivity—should be <3,500 µS/cm for low pressure), test for oil contamination, reduce alkalinity if excessive, operate within design load range, use antifoam if contamination present. Carryover damages superheaters and turbines—immediate action required. **Problem: Caustic Embrittlement (Tube Cracking)** - Causes: (1) Free caustic (pH >12.0), (2) High stress areas (tube bends, welds), (3) Inadequate phosphate buffering. Solutions: Implement coordinated phosphate-pH control, reduce caustic soda feed, increase phosphate to buffer caustic, inspect stressed areas for cracking, replace tubes showing inter-granular cracking. Brittle failure can be catastrophic—pressure test after repairs. **Problem: Rapid Return Line Corrosion (Condensate)** - Causes: (1) Low condensate pH (carbonic acid attack), (2) Oxygen in condensate, (3) Inadequate amine treatment. Solutions: Test condensate pH (should be 8.5-9.5), increase neutralizing amine dosage, check for air in-leakage, verify deaerator operation, add filming amine for severe cases, inspect worst sections (first receivers) for wall thinning. Red/brown water = iron oxide from corrosion. **Problem: Priming (Boiler Water Level Surging)** - Causes: (1) Excessive alkalinity creating bubbles, (2) High TDS, (3) Contamination with organics. Solutions: Increase blowdown, reduce alkalinity chemicals, clean boiler if contamination present, check level controls operating correctly. **Problem: Low Steam Quality (High Moisture Content)** - Causes: (1) Carryover from foaming, (2) Mechanical damage to steam separators, (3) Operating above design capacity. Solutions: Address foaming causes, inspect steam drum internals, operate within design limits, improve steam-water separation equipment.',
        tips: [
          'Document all water test results and chemical dosages—trends reveal problems early',
          'Boiler tube failures occur at predictable locations—know your system weak points',
          'Emergency makeup water is the #1 cause of scaling—avoid treatment bypasses',
          'Annual boiler inspection reveals actual condition—budget for professional inspection',
          'Partner with Global Chemicals LLC for troubleshooting and emergency support'
        ]
      },
      {
        title: 'Monitoring, Testing, and Best Practices for Oman Boilers',
        content: '**Daily Testing:** Feedwater: pH, dissolved oxygen (<7 ppb), hardness (should be zero), oxygen scavenger residual. Boiler water: pH (10.5-11.5), phosphate/polymer residual, TDS/conductivity, alkalinity. Condensate: pH (8.5-9.5), iron (<0.3 ppm). These quick tests take 15 minutes but prevent failures. **Weekly Testing:** Boiler water: Silica (critical for turbine protection), chlorides (contamination indicator), suspended solids, sulfite residual verification. Feedwater: Conductivity, complete mineral analysis monthly. **Chemical Feed Systems:** Use positive displacement metering pumps for accuracy. Phosphate/polymer to feedwater line or boiler drum (check manufacturer specs). Oxygen scavenger to deaerator storage tank or feedwater. Amines to steam header or feedwater. Flow-proportional dosing adjusts chemical feed with steam load. Provide day tanks with level alarms. **Blowdown Protocols:** Continuous blowdown: Remove surface contaminants, control TDS, typically 2-8% of steam production. Install TDS/conductivity controller for automatic control. Bottom blowdown: Remove settled sludge, perform daily in low-pressure boilers, every shift in high-TDS systems, short frequent blows better than long infrequent. **Water Treatment System Maintenance:** Softeners: Regenerate on schedule, verify hardness leakage <1 ppm, check salt levels and brine concentration. Demineralizers: Monitor conductivity, regenerate before exhaustion, verify mixed bed performance. Deaerator: Maintain proper pressure/temperature, vent continuously, check spray nozzles, test outlet oxygen regularly. **Boiler Layup (Idle Protection):** Dry layup: Drain boiler, dry with warm air, use desiccant trays, seal all openings. Best for long shutdowns. Wet layup: Fill completely with treated water (high pH 10.5-11.0, high scavenger 200+ ppm sulfite, nitrogen blanket), maintain heat if possible, test monthly. For short shutdowns <30 days. **Safety and Compliance:** Maintain proper blowdown discharge cooling and treatment, test safety valves annually, log all water tests per Oman regulations, train operators on chemical handling, provide PPE (especially for hydrazine if used), secondary containment for bulk chemical storage, maintain SDS accessible. **Fuel Efficiency:** Clean tubes = efficient heat transfer—1mm scale = 5-8% fuel penalty. Proper blowdown control—excessive blowdown wastes heat. Optimize deaerator operation—reducing oxygen saves chemicals. Condensate return maximization—it\'s hot pure water. **Vendor Support:** Quarterly technical audit by water treatment specialist, annual boiler inspection by certified inspector, training programs for operators, emergency support availability 24/7, access to lab analysis for complex issues.',
        tips: [
          'Never skip daily testing—boiler chemistry must be monitored religiously',
          'Hardness in feedwater is a red flag—investigate immediately before scaling occurs',
          'Keep 30-day minimum inventory of all treatment chemicals to prevent outages',
          'Document all blowdown, chemical usage, and test results—required for compliance',
          'Train backup operators—boiler treatment cannot stop for sick days or vacations',
          'Annual boiler opening inspection reveals actual tube condition and deposit formation',
          'Establish written procedures for startups, shutdowns, and emergency operations'
        ]
      }
    ],
    keyProducts: [
      'Oxygen Scavengers (Sodium Sulfite, DEHA, Hydrazine)',
      'Phosphate Programs (Trisodium Phosphate, Coordinated Control)',
      'Scale Inhibitor Polymers',
      'Neutralizing Amines (Morpholine, Cyclohexylamine)',
      'Filming Amines (Octadecylamine)',
      'Caustic Soda (pH Control)',
      'Condensate Treatment Chemicals',
      'Antifoam Agents'
    ],
    faqs: [
      {
        question: 'What chemicals are essential for boiler water treatment in Oman?',
        answer: 'A complete boiler treatment program requires: (1) Oxygen scavenger to prevent corrosion—sodium sulfite for low-medium pressure or DEHA/hydrazine for high pressure, (2) Scale control—phosphate programs or polymers to prevent hardness deposits, (3) pH control—caustic soda to maintain alkaline conditions (pH 10.5-11.5), (4) Condensate treatment—neutralizing amines to prevent return line corrosion. Dosages depend on boiler pressure, feedwater quality, and operating conditions. Global Chemicals LLC provides customized boiler programs with technical support for Oman operations.'
      },
      {
        question: 'How do I choose between sodium sulfite and hydrazine for oxygen scavenging?',
        answer: 'LOW PRESSURE (<300 psi): Sodium sulfite is ideal—low cost, safe handling, effective performance. Use catalyzed formulation for faster reaction. MEDIUM PRESSURE (300-900 psi): Either sodium sulfite or DEHA (organic scavenger)—DEHA preferred for higher pressures. HIGH PRESSURE (>900 psi): Hydrazine or DEHA required—sulfite decomposes above 500°F. Hydrazine is toxic requiring special handling; DEHA is safer alternative with comparable performance. Environmental/safety trend favors organic scavengers (DEHA, carbohydrazide) over hydrazine.'
      },
      {
        question: 'What causes boiler tube pitting and how do I prevent it?',
        answer: 'Pitting is caused by oxygen corrosion—localized attack creating pinhole leaks. Sources: inadequate oxygen scavenger dosing, air in-leakage through pump seals or deaerator, low scavenger residual, or treatment interruption. PREVENTION: (1) Maintain proper oxygen scavenger residual (20-40 ppm sulfite OR 0.05-0.1 ppm hydrazine in feedwater), (2) Ensure deaerator operates correctly (<7 ppb O₂), (3) Eliminate air leaks, (4) Test residuals daily—depletion is early warning. Pitting develops in days without proper treatment—prevention is critical.'
      },
      {
        question: 'How often should I perform boiler blowdown?',
        answer: 'CONTINUOUS BLOWDOWN: 2-8% of steam production to control TDS. Use automatic conductivity controller for optimal efficiency. BOTTOM BLOWDOWN: Daily in low-pressure boilers, every shift (8 hours) in high-TDS systems, multiple short blows better than one long blow. FREQUENCY FACTORS: Makeup water quality (higher TDS = more blowdown), steam production rate, acceptable boiler water TDS limits. Monitor boiler water conductivity—increase blowdown if approaching limits (typically 3,000-3,500 µS/cm for low pressure, 1,000-1,500 for high pressure). Excessive blowdown wastes heat and chemicals; inadequate blowdown causes scaling and carryover.'
      },
      {
        question: 'Do you provide boiler water treatment programs and support in Oman?',
        answer: 'Yes, Global Chemicals LLC provides complete boiler water treatment programs for industrial and power generation facilities across Oman including: customized chemical programs (oxygen scavengers, scale control, pH management, condensate treatment), feedwater analysis and program design, automated chemical feed systems, operator training on testing and troubleshooting, monthly technical service visits, emergency support 24/7, compliance with Oman boiler regulations. Our programs serve refineries, petrochemical plants, power stations, and manufacturing facilities in Muscat, Sohar, Duqm, and Salalah. Contact us for consultation and water analysis.'
      }
    ]
  },
  {
    id: 'tank-cleaning-chemicals',
    title: 'Tank Cleaning Chemicals Complete Guide for Oman',
    slug: 'tank-cleaning-chemicals-guide-oman',
    excerpt: 'Comprehensive guide to industrial tank cleaning chemicals in Oman. Learn about crude oil tank cleaning, water storage tank maintenance, chemical tank cleaning procedures, and safety protocols for PDO, desalination plants, ports, and industrial facilities.',
    icon: Factory,
    category: 'Tank Cleaning',
    readTime: '8 min read',
    lastUpdated: '2024-12-16',
    sections: [
      {
        title: 'Introduction to Tank Cleaning in Oman Industries',
        content: 'Tank cleaning is critical across Oman\'s industrial sector—crude oil tanks (PDO, OQ), water storage (desalination plants), chemical storage (refineries), and marine fuel tanks (Sohar/Salalah ports).\n\n**Why Critical:** Improper cleaning causes contamination, corrosion, capacity loss, safety hazards, and regulatory violations.\n\n**Oman Challenges:** Extreme heat (45°C+) accelerates sludge formation, strict confined space protocols required, regulated waste disposal, high downtime costs ($100,000+/day).',
        tips: [
          'PDO operates 500+ crude tanks—cleaning every 3-5 years',
          'Improper cleaning causes 30% of tank failures',
          'Downtime costs can exceed $100,000 per day'
        ]
      },
      {
        title: 'Types of Tanks and Cleaning Requirements in Oman',
        content: '**Crude Oil Tanks:** PDO, OQ, ORPIC. Challenges: Heavy sludge (10-30 cm), paraffin wax, H2S hazards. Clean every 3-5 years. 10,000-100,000 barrels.\n\n**Water Storage:** Desalination plants, hotels, hospitals. Challenges: Biofilm, algae, scale, Legionella risk. Clean annually. 100-10,000 m³.\n\n**Chemical Storage:** OQ, ORPIC, water treatment plants. Challenges: Product residues, cross-contamination, corrosion. Clean before product changeover or every 2-3 years.\n\n**Marine Fuel Tanks:** Sohar/Salalah/Duqm ports. Challenges: Heavy fuel sludge, saltwater, microbial growth, IMO compliance. Clean before fuel grade changes.\n\n**Food-Grade Tanks:** Dairy, juice, edible oil, beverage. Requirements: Sanitary cleaning, no toxic residues, Halal compliance. Clean between batches.\n\n**LPG/Ammonia:** Refrigerated/pressurized vessels. Require inert gas purging, specialized procedures, cryogenic handling.\n\n**Underground Tanks (USTs):** Fuel stations. Focus: Leak detection, soil contamination prevention.',
        tips: [
          'Never use crude oil cleaners on food tanks—product-specific chemicals required',
          'Oman heat accelerates biofilm in water tanks and sludge hardening in oil tanks',
          'Document all procedures for ISO/regulatory compliance'
        ]
      },
      {
        title: 'Chemical Selection for Different Tank Types',
        content: '**Crude Oil/Hydrocarbon Tanks:**\n\nCaustic Soda 5-15% (50-150 kg/1,000 barrels) heated to 60-80°C, 24-48 hrs | Hydrocarbon Solvents (kerosene, naphtha) 10-20% for wax removal | Degreasers 1-5% for stubborn deposits\n\n**Water Storage Tanks:**\n\nAlkaline: Caustic Soda 2-5% or Sodium Hypochlorite 10-15%, 4-6 hrs | Acid: HCl 5-10% or Citric Acid 10-15% for scale | Disinfection: Chlorine 50-100 ppm, 2-4 hrs\n\n**Chemical Storage Tanks:**\n\nCheck compatibility charts—never mix incompatible chemicals | Acid tanks: alkaline wash | Caustic tanks: acid wash | Oxidizer tanks: reducing agents | Match solvents to product (polar/non-polar)\n\n**Marine Fuel Tanks:**\n\nCaustic Soda 5-10% at 60°C | Emulsifying degreasers 3-5% | Multiple freshwater rinses\n\n**Food-Grade Tanks:**\n\nFood-grade caustic or sodium carbonate (CIP compatible) | Hydrogen peroxide or peracetic acid sanitizer (Halal compliant) | Conductivity testing for verification',
        tips: [
          'NEVER mix caustic + acid—violent reaction risk',
          'Heating to 60-80°C improves efficiency by 50-70%',
          'Food-grade tanks require validated procedures and residue testing'
        ]
      },
      {
        title: 'Crude Oil Tank Cleaning Procedures',
        content: '**STEP 1: Preparation (1-2 days)** — Drain tank, gas test (LEL <1%, H2S, O2), install ventilation, obtain permits, lock-out/tag-out\n\n**STEP 2: Oil Recovery (1 day)** — Install slop pumps, recover 5-15% additional crude\n\n**STEP 3: Sludge Removal (2-3 days)** — Mechanical (shovels/vacuum), Automated (robots/jets), or Chemical (heated caustic 10-15% at 60-80°C, 24-48 hrs). Chemical most common in Oman.\n\n**STEP 4: Caustic Wash (1-2 days)** — 5-10% caustic at 60-80°C, 10-20% tank volume, recirculate 12-24 hrs\n\n**STEP 5: Solvent Wash (1 day)** — If needed for wax/asphaltene. Kerosene or hydrocarbon solvent.\n\n**STEP 6: Water Rinse (1 day)** — High-pressure 100-150 bar until clear\n\n**STEP 7: Inspection (1-2 days)** — Dry, visual check, ultrasonic testing\n\n**STEP 8: Waste Disposal** — Sludge to Be\'ah, neutralize wash water, recover crude\n\n**Total: 7-12 days | Cost: $5,000-15,000**',
        tips: [
          'Never enter without gas test—H2S kills instantly',
          'Heating caustic to 60°C reduces time by 50-70%',
          'Plan during scheduled shutdown to minimize downtime'
        ]
      },
      {
        title: 'Water Storage Tank Cleaning',
        content: '**1. Preparation** — Drain tank, inspect for sediment/biofilm/scale, check structural damage, sample water\n\n**2. Debris Removal** — Remove sediment (sand, silt, rust) via shovels or vacuum trucks. Containerize for disposal.\n\n**3. Alkaline Cleaning** — Caustic 2-5% or Hypochlorite 10-15%, scrub all surfaces, 4-6 hrs contact time\n\n**4. Acid Descaling** — HCl 5-10% or Citric 10-15% for scale removal, 2-4 hrs, neutralize before draining\n\n**5. Disinfection** — Chlorine 50-100 ppm, coat all surfaces, 2-6 hrs contact, test residual >25 ppm\n\n**6. Rinse** — Multiple freshwater rinses until pH neutral, zero chlorine, bacteria absent\n\n**7. Inspection** — Visual check (clean, no biofilm), structural check, water quality test\n\n**8. Refill** — Fill slowly, dose with chlorine, flush distribution system\n\n**Frequency:** Potable—annually | Industrial—1-2 years | Fire water—2-3 years',
        tips: [
          'Test for confined space hazards before entry',
          'Potable tanks require Ministry of Health notification',
          'Legionella testing recommended for cooling tower makeup tanks'
        ]
      },
      {
        title: 'Chemical Storage Tank Cleaning',
        content: '**Acid Tanks (HCl, H2SO4, H3PO4)** — Dilute to <5%, neutralize with caustic/sodium carbonate to pH 7-9, monitor exothermic heat, inspect for corrosion\n\n**Caustic Tanks (NaOH, KOH)** — Dilute, neutralize with citric/HCl to pH 7-9, dissolve crystalline deposits with warm water\n\n**Oxidizer Tanks (Hypochlorite, H2O2)** — Neutralize with sodium bisulfite/thiosulfate, test ORP <200 mV, vent chlorine gas\n\n**Solvent Tanks (Acetone, IPA, MEK, Toluene)** — Inert gas purge mandatory, LEL <10%, rinse with compatible solvent, recover for reuse\n\n**Polymer/Resin Tanks** — Dissolve with MEK/toluene/xylene, mechanical scraping if needed, detergent wash\n\n**Flammable Tanks (Gasoline, Diesel)** — Inert gas/steam purge, continuous monitoring, LEL <10%, no hot work until gas-free\n\n**Cross-Contamination Prevention:** Triple rinse between incompatible products. Sample and test rinse water. HCl to NaOH changeover requires complete neutralization.\n\n**Waste:** All chemical tank waste potentially hazardous. Segregate, manifest, dispose via Be\'ah only.',
        tips: [
          'Identify previous product before selecting cleaners—incompatibility causes explosions',
          'Never assume empty—vapor space can be toxic/flammable',
          'All waste requires hazardous waste manifest (Be\'ah)'
        ]
      },
      {
        title: 'Safety Protocols & Confined Space Entry',
        content: '**Confined Space:** ALL tanks in Oman require permits—limited entry/exit, hazardous atmosphere potential\n\n**Pre-Entry Requirements:** Confined Space Entry Permit, Lock-Out/Tag-Out, blind flanges (not just valves)\n\n**Gas Testing (Continuous):** O2: 19.5-23.5% | LEL: <10% | H2S: <10 ppm | Test at multiple levels—gases stratify\n\n**Ventilation:** Forced air, 20+ air changes/hour, maintain throughout entry\n\n**Entry Team:** Standby person outside (trained), rescue equipment ready (tripod/winch/harness), max 2-3 people inside\n\n**PPE:** Hard hat, safety glasses, boots | Chemical suits (Tychem) for caustic/acid | SCBA for H2S/low O2 (never air-purifying in O2-deficient) | Full harness + lifeline | Radio contact\n\n**Hot Work:** Gas-Free Certificate (<1% LEL, <10 ppm H2S), separate permit, fire watch, continuous monitoring\n\n**Emergency:** Evacuate immediately if symptoms. Standby NEVER enters without SCBA—most deaths are rescuers.\n\n**Oman Regulations:** Ministry of Manpower, PDO/OQ/ports have stricter requirements, mandatory incident reporting',
        tips: [
          'Most deaths are rescuers—never enter without SCBA and backup',
          'H2S in crude tanks kills in one breath—zero tolerance',
          'Calibrate gas meters—false readings kill'
        ]
      },
      {
        title: 'Environmental & Waste Disposal',
        content: '**Hazardous Waste:** Crude sludge, chemical residues, contaminated wash water, oily PPE → Be\'ah disposal required\n\n**Non-Hazardous:** Water tank sediment (if clean), debris, neutralized rinse water\n\n**Oman Regulations:** Environment Authority governs disposal | Be\'ah operates authorized facilities | Waste Generator License required | Manifest System tracks all waste\n\n**Crude Sludge Disposal:** Characterize (TPH, metals, BTEX) | 200L drums, labeled | Licensed transporter + manifest | Be\'ah Barka facility | Cost: 80-150 OMR/ton\n\n**Wash Water Treatment:** Neutralize pH 6.5-8.5 | Oil-water separation (coalescer/DAF) | Discharge limits: pH 6-9, O&G <15 mg/L, COD <150, BOD <50\n\n**Water Tank Waste:** Sediment to landfill if clean | Dechlorinate, neutralize, discharge to sewer (with permission)\n\n**Solvent Recovery:** Kerosene, naphtha, MEK recyclable via distillation—economic + environmental benefit\n\n**Documentation:** Waste Manifest (every shipment) | Disposal Certificate | Inventory Records (annual EA reporting) | Lab Analysis (retain 5 years)\n\n**Best Practices:** Minimize waste generation | Segregate incompatible wastes | Plan disposal before starting | Budget for disposal (often >chemical cost)',
        tips: [
          'Illegal dumping = severe fines—use Be\'ah only',
          'Disposal costs 80-150 OMR/ton—budget accordingly',
          'Crude sludge contains 20-60% recoverable hydrocarbons—worth recovering'
        ]
      }
    ],
    keyProducts: [
      'Caustic Soda (Tank Cleaning Grade)',
      'Hydrochloric Acid (Descaling)',
      'Citric Acid (Food-Safe Descaling)',
      'Sodium Hypochlorite (Disinfection)',
      'Calcium Hypochlorite (Chlorination)',
      'Industrial Degreasers',
      'Hydrocarbon Solvents (Kerosene, Naphtha)',
      'Sodium Bisulfite (Dechlorination)'
    ],
    faqs: [
      {
        question: 'What chemicals are needed for crude oil tank cleaning in Oman?',
        answer: 'Crude oil tank cleaning requires: (1) Caustic Soda (Sodium Hydroxide) 5-15% solution as primary cleaner—breaks down sludge and emulsifies hydrocarbons. Dose 50-150 kg per 1,000 barrels. Heat to 60-80°C for best results. (2) Hydrocarbon Solvents (kerosene, naphtha) for wax and light oil residues—use 10-20% of tank volume. (3) Industrial Degreasers 1-5% for stubborn deposits. (4) Freshwater for final rinse. Total chemical cost typically $5,000-15,000 depending on tank size. Global Chemicals LLC supplies all tank cleaning chemicals with technical support for PDO, OQ, and refinery operations in Oman.'
      },
      {
        question: 'How often should water storage tanks be cleaned in Oman?',
        answer: 'POTABLE WATER TANKS: Annually minimum, recommended every 6 months in hot summer due to accelerated biofilm growth in Oman heat. Oman Ministry of Health regulations require annual cleaning for drinking water tanks. INDUSTRIAL WATER TANKS: Every 1-2 years or when water quality degrades (visible sediment, discoloration, odor). FIRE WATER TANKS: Every 2-3 years to prevent sediment buildup that can clog fire protection systems. More frequent cleaning needed if: tanks are uncovered (algae growth), makeup water has high TDS (scale formation), or bacterial contamination detected (Legionella risk in cooling tower makeup tanks).'
      },
      {
        question: 'What safety equipment is required for tank cleaning in Oman?',
        answer: 'MANDATORY SAFETY EQUIPMENT: (1) Gas Detection: Multi-gas meter testing oxygen (19.5-23.5%), LEL (<10%), H2S (<10 ppm), continuously during entry. (2) Ventilation: Forced air blowers providing 20+ air changes/hour throughout work. (3) Respiratory Protection: SCBA (Self-Contained Breathing Apparatus) or supplied air for crude oil tanks or oxygen-deficient atmospheres. (4) Rescue Equipment: Tripod with winch, lifelines, full-body harness for each entrant. (5) Communication: Two-way radio or direct contact with standby person outside. (6) PPE: Chemical-resistant suits (Tychem) for caustic/acid work, hard hat, safety glasses, steel-toe boots. (7) Permits: Confined Space Entry Permit mandatory. Standby rescue person required—never work alone. Oman Ministry of Manpower regulations enforce these requirements strictly.'
      },
      {
        question: 'How do I dispose of tank cleaning waste in Oman?',
        answer: 'HAZARDOUS WASTE (crude sludge, chemical residues): Must go to Be\'ah authorized facility in Barka. Requires: (1) Waste Manifest documenting generator → transporter → disposal, (2) Licensed hazardous waste transporter, (3) Waste characterization test results, (4) Certificate of Disposal from Be\'ah. Cost: 80-150 OMR per ton typically. NON-HAZARDOUS WASTE (water tank sediment): Municipal landfill if tested clean. WASH WATER: Neutralize pH (6.5-8.5), treat oil content to <15 mg/L, discharge to approved treatment facility or sewer (with permission). Illegal dumping carries severe Environment Authority fines. Global Chemicals LLC can connect you with licensed waste disposal vendors for compliant disposal.'
      },
      {
        question: 'Do you provide tank cleaning chemicals and technical support in Oman?',
        answer: 'Yes, Global Chemicals LLC supplies complete tank cleaning chemical programs for industrial facilities across Oman including: (1) Tank cleaning chemicals: caustic soda, acids, degreasers, solvents, disinfectants, (2) Technical support: cleaning procedure development, chemical selection for specific tank types and contamination, (3) Safety guidance: confined space protocols, gas testing requirements, PPE specifications, (4) Waste disposal coordination: connections to licensed waste management vendors, (5) Training: operator training on chemical handling and safety procedures, (6) Emergency supply: 24/7 availability for urgent cleaning projects. We serve PDO, OQ, desalination plants, ports, refineries, and industrial facilities in Muscat, Sohar, Duqm, and Salalah. Contact us for site-specific recommendations and chemical supply.'
      }
    ]
  }
];

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  downloadUrl?: string;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  featured: boolean;
}

const Resources = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDownloadCategory, setSelectedDownloadCategory] = useState('all');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState('All');
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<IndustryGuide | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  // Labels for every download category we may ever offer. The visible filter
  // list is derived from the documents that actually exist (see
  // `downloadCategories` below) — the old hard-coded list advertised SDS,
  // Technical Documents, Certifications and Industry Guides, and all four
  // rendered "No resources found" because every resource is a catalog. Add a
  // resource in a new category and its filter appears automatically.
  const downloadCategoryLabels: Record<string, string> = {
    catalogs: 'Product Catalogs',
    sds: 'Safety Data Sheets',
    technical: 'Technical Documents',
    certificates: 'Certifications',
    guides: 'Industry Guides',
  };

  // The hero search box used to feed ONLY the Downloads tab, while the page
  // opens on Guides and the placeholder promised "articles and resources" —
  // so typing appeared to do nothing. It now filters guides and articles too.
  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (...fields: (string | undefined)[]) =>
    !query || fields.some((f) => f?.toLowerCase().includes(query));

  const filteredGuides = industryGuides.filter((guide) =>
    matchesQuery(
      guide.title,
      guide.excerpt,
      guide.category,
      ...(guide.keyProducts ?? []),
      ...guide.sections.map((s) => s.title)
    )
  );

  // Filter articles based on category and the hero search query
  const filteredArticles = blogArticles.filter((article) => {
    const matchesCategory = selectedArticleCategory === 'All' || article.category === selectedArticleCategory;
    return matchesCategory && matchesQuery(article.title, article.excerpt, article.category);
  });

  const featuredArticle = blogArticles.find((article) => article.featured);

  // Render markdown-like content with bold text and paragraphs
  const renderContent = (text: string) => {
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split('\n\n');

    return paragraphs.map((paragraph, pIndex) => {
      // Split each paragraph by bold markers (**text**) and lightweight
      // markdown-style internal links ([label](/products/category/id)) —
      // the only two inline markup forms this content supports.
      const parts = paragraph.split(/(\*\*.*?\*\*|\[[^\]]+\]\(\/[^)]+\))/g);
      const content = parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\((\/[^)]+)\)$/);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          return (
            <LocalizedLink
              key={index}
              to={href}
              className="font-semibold text-primary underline underline-offset-2 hover:no-underline"
            >
              {label}
            </LocalizedLink>
          );
        }
        return part;
      });

      return (
        <p key={pIndex} className="mb-3 last:mb-0">
          {content}
        </p>
      );
    });
  };

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Global Chemicals LLC Products Catalog',
      description: 'Complete product catalog featuring our comprehensive range of chemical products and solutions',
      category: 'catalogs',
      fileSize: '3.2 MB',
      icon: BookOpen,
      badge: 'New',
      downloadUrl: BrochureProducts
    },
    {
      id: '2',
      title: 'Global Chemicals LLC Company Overview',
      description: 'Comprehensive company overview featuring industries we serve, general introduction, services, capabilities, and product range',
      category: 'catalogs',
      fileSize: '2.8 MB',
      icon: BookOpen,
      badge: 'New',
      downloadUrl: BrochureGlobal
    },
    {
      id: '3',
      title: 'CDC Anti-Clog Solution Brochure',
      description: 'Detailed product information and technical specifications for CDC Anti-Clog chemical solutions',
      category: 'catalogs',
      fileSize: '1.5 MB',
      icon: Beaker,
      badge: 'New',
      downloadUrl: BrochureCDC
    },
    {
      id: '4',
      title: 'Global Chemicals Products List',
      description: 'Comprehensive list of all available chemical products with specifications and applications',
      category: 'catalogs',
      fileSize: '2.1 MB',
      icon: FileText,
      badge: 'New',
      downloadUrl: BrochureProductsList
    }
  ];

  const downloadCategories = [
    { id: 'all', label: 'All Resources' },
    ...Object.entries(downloadCategoryLabels)
      .filter(([id]) => resources.some((r) => r.category === id))
      .map(([id, label]) => ({ id, label })),
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedDownloadCategory === 'all' || resource.category === selectedDownloadCategory;
    return matchesSearch && matchesCategory;
  });

  const regularArticles = filteredArticles.filter((article) => !article.featured);

  const handleDownload = (resource: Resource) => {
    if (resource.downloadUrl) {
      setSelectedResource(resource);
      setDownloadDialogOpen(true);
    } else {
      toast({
        title: "Coming Soon",
        description: "This resource will be available for download soon. Please contact us for immediate access.",
        variant: "destructive",
      });
    }
  };

  const handleView = (resource: Resource) => {
    if (resource.downloadUrl) {
      setSelectedResource(resource);
      setPdfViewerOpen(true);
    } else {
      toast({
        title: "Coming Soon",
        description: "This resource will be available for viewing soon. Please contact us for immediate access.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSuccess = () => {
    // Track download event
    if (selectedResource) {
      trackDownload(selectedResource.title);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Guides & Resources | Oman & GCC | Global Chemicals LLC"
        description="Expert chemical guides for Oman & GCC: water treatment, lab chemicals, lubricants, oilfield. Download SDS, catalogs & technical docs. Serving UAE, Saudi Arabia, Qatar, Kuwait, Bahrain."
        keywords="water treatment chemicals GCC, industrial lubricants guide Middle East, laboratory chemicals UAE, oil gas production chemicals Saudi Arabia, swimming pool chemicals GCC, chemical SDS download, product catalogs, safety data sheets, PAC coagulant Oman, Shell Mobil Castrol lubricants GCC, desalination chemicals Middle East, corrosion inhibitors GCC"
        ogTitle="Chemical Industry Guides & Resources | Global Chemicals LLC Oman & GCC"
        ogDescription="Comprehensive guides on water treatment, lubricants, laboratory chemicals & oilfield chemicals for Oman & GCC industries. Free technical resources and expert knowledge."
        ogUrl="https://gcoman.com/resources"
        canonical="https://gcoman.com/resources"
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <SpeakableStructuredData
        url="https://gcoman.com/resources"
        cssSelector={["h1", "h2", ".speakable"]}
      />
      <Navigation />
      <main id="main-content">

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 px-4">
              Resources & Insights
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4 speakable">
              Access downloadable resources, industry news, technical guides, and expert insights
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <label htmlFor="resources-search" className="sr-only">
                Search guides, articles and downloads
              </label>
              <Search
                aria-hidden
                className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
              />
              <Input
                id="resources-search"
                type="search"
                placeholder="Search guides, articles and downloads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ltr:pl-12 rtl:pr-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section - Visible immediately */}
      <section className="py-6 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/products"
                className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Beaker className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold text-sm">Products</span>
                  <p className="text-xs text-muted-foreground">Browse catalog</p>
                </div>
              </Link>
              <Link
                to="/industries"
                className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Factory className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold text-sm">Industries</span>
                  <p className="text-xs text-muted-foreground">Sectors we serve</p>
                </div>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="font-semibold text-sm">Contact</span>
                  <p className="text-xs text-muted-foreground">Get in touch</p>
                </div>
              </Link>
              <a
                href="https://wa.me/96892772305"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border hover:border-green-500 hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <span className="font-semibold text-sm">WhatsApp</span>
                  <p className="text-xs text-muted-foreground">Quick support</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="guides" className="max-w-7xl mx-auto">
            <TabsList className="flex w-full max-w-2xl mx-auto mb-8 sm:mb-12 gap-2">
              <TabsTrigger
                value="guides"
                className="text-sm sm:text-base flex-1 gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Industry Guides
              </TabsTrigger>
              <TabsTrigger
                value="downloads"
                className="text-sm sm:text-base flex-1 gap-2"
              >
                <Download className="w-4 h-4" />
                Downloads
              </TabsTrigger>
              <TabsTrigger
                value="articles"
                className="text-sm sm:text-base flex-1 gap-2"
              >
                <FileText className="w-4 h-4" />
                Articles & News
              </TabsTrigger>
            </TabsList>

            {/* Industry Guides Tab */}
            <TabsContent value="guides" className="space-y-8">
              {!selectedGuide ? (
                <>
                  {/* Guides Introduction */}
                  <div className="text-center max-w-3xl mx-auto mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                      Expert Chemical Industry Guides for Oman &amp; GCC
                    </h2>
                    <p className="text-muted-foreground">
                      Comprehensive technical guides covering water treatment, industrial lubricants, laboratory chemicals, and more.
                      Written by industry experts for professionals in Oman, UAE, Saudi Arabia, Qatar, Kuwait &amp; Bahrain.
                    </p>
                  </div>

                  {/* Guides Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGuides.map((guide) => {
                      const IconComponent = guide.icon;
                      return (
                        <Card
                          key={guide.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`Open guide: ${guide.title}`}
                          className="hover:shadow-lg transition-all cursor-pointer group logo-gradient-border relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          onClick={() => setSelectedGuide(guide)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedGuide(guide);
                            }
                          }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <IconComponent className="h-8 w-8 text-primary" />
                              </div>
                              <Badge variant="secondary">{guide.category}</Badge>
                            </div>
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {guide.title}
                            </CardTitle>
                            <CardDescription className="mt-2 line-clamp-3">
                              {guide.excerpt}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{guide.readTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Updated {guide.lastUpdated}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              Read Full Guide
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>

                  {filteredGuides.length === 0 && (
                    <div className="text-center py-16" role="status">
                      <p className="text-lg font-semibold text-foreground mb-2">
                        No guides match “{searchQuery}”
                      </p>
                      <p className="text-muted-foreground mb-6">
                        Try a broader term, or ask our technical team directly.
                      </p>
                      <Button variant="outline" onClick={() => setSearchQuery('')}>
                        Clear search
                      </Button>
                    </div>
                  )}

                  {/* SEO Content Section */}
                  <div className="mt-12 bg-muted/50 rounded-lg p-6 sm:p-8">
                    <h3 className="text-xl font-bold mb-4">Why Choose Global Chemicals LLC for Your Chemical Needs in Oman?</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
                      <div>
                        <p className="mb-4">
                         Global Chemicals LLC is Oman's trusted partner for industrial chemicals — exporting to UAE, Saudi Arabia, Qatar, Kuwait, and Bahrain. Serving industries across Muscat, Sohar, Duqm, Salalah, Dubai, Abu Dhabi, Riyadh, Doha, and Kuwait City.
                          With over 10 years of experience and ISO 9001 certification, we provide quality chemicals backed by technical expertise.
                        </p>
                        <p>
                          Our product range includes water treatment chemicals, industrial lubricants from Shell, Mobil, and Castrol, laboratory reagents, oil & gas production chemicals, and swimming pool maintenance products.
                        </p>
                      </div>
                      <div>
                        <p className="mb-4">
                          We understand Oman's unique industrial requirements—from the demanding conditions in oil fields to the water treatment needs of desalination plants.
                          Our technical team provides guidance on product selection, dosing optimization, and troubleshooting.
                        </p>
                        <p>
                         Contact us for competitive pricing, bulk orders, and customized chemical solutions. We deliver across Oman with same-day delivery in Muscat, and export to UAE, Saudi Arabia, Qatar, Kuwait & Bahrain with 3-7 day lead times.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cross-Link to Blog */}
                  <div className="mt-8 bg-primary/5 rounded-lg p-6 sm:p-8 text-center">
                    <h3 className="text-xl font-bold mb-3">Latest Industry News & Updates</h3>
                    <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
                      Stay informed with the latest chemical industry news, product updates, and technical insights for Oman's industries.
                    </p>
                    <Button asChild>
                      <Link to="/blog">
                        Visit Our Blog
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                /* Selected Guide Full View */
                <article className="max-w-4xl mx-auto">
                  {/* Structured Data for the Guide */}
                  {selectedGuide.faqs && selectedGuide.faqs.length > 0 && (
                    <FAQStructuredData faqs={selectedGuide.faqs} />
                  )}
                  <ArticleStructuredData
                    title={selectedGuide.title}
                    description={selectedGuide.excerpt}
                    url={`https://gcoman.com/resources#${selectedGuide.slug}`}
                    author="Global Chemicals LLC"
                    publishedDate={selectedGuide.lastUpdated}
                    category={selectedGuide.category}
                  />

                  {/* Back Button */}
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedGuide(null)}
                    className="mb-6"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                    Back to All Guides
                  </Button>

                  {/* Guide Header */}
                  <header className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {selectedGuide.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedGuide.readTime}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Updated {selectedGuide.lastUpdated}
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                      {selectedGuide.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {selectedGuide.excerpt}
                    </p>
                  </header>

                  {/* Table of Contents */}
                  <nav className="bg-muted/50 rounded-lg p-6 mb-8">
                    <h2 className="font-semibold mb-3">In This Guide:</h2>
                    <ul className="space-y-2">
                      {selectedGuide.sections.map((section, index) => (
                        <li key={index}>
                          <a
                            href={`#section-${index}`}
                            className="text-primary hover:underline flex items-center gap-2"
                          >
                            <span className="text-muted-foreground">{index + 1}.</span>
                            {section.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Guide Content Sections */}
                  <div className="space-y-10">
                    {selectedGuide.sections.map((section, index) => (
                      <section key={index} id={`section-${index}`} className="scroll-mt-24">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">
                            {index + 1}
                          </span>
                          {section.title}
                        </h2>
                        <div className="text-muted-foreground leading-relaxed mb-4">
                          {renderContent(section.content)}
                        </div>
                        {section.tips && section.tips.length > 0 && (
                          <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 mt-4">
                            <h4 className="font-semibold flex items-center gap-2 mb-3">
                              <Lightbulb className="h-5 w-5 text-primary" />
                              Key Points
                            </h4>
                            <ul className="space-y-2">
                              {section.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </section>
                    ))}
                  </div>

                  {/* Key Products Section */}
                  {selectedGuide.keyProducts && selectedGuide.keyProducts.length > 0 && (
                    <section className="mt-10 p-6 bg-muted/50 rounded-lg">
                      <h2 className="text-xl font-bold mb-4">Related Products from Global Chemicals LLC</h2>
                      <p className="text-sm text-muted-foreground mb-4">Click on any product to explore our catalog:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedGuide.keyProducts.map((product, index) => (
                          <Link
                            key={index}
                            to={`/products?search=${encodeURIComponent(product)}`}
                            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
                          >
                            <Badge
                              variant="outline"
                              className="text-sm py-1.5 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {product}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-3">
                        <Button asChild>
                          <Link to="/products">View All Products</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/contact">Request Quote</Link>
                        </Button>
                      </div>
                    </section>
                  )}

                  {/* FAQs Section */}
                  {selectedGuide.faqs && selectedGuide.faqs.length > 0 && (
                    <section className="mt-10">
                      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                      <div className="space-y-4">
                        {selectedGuide.faqs.map((faq, index) => (
                          <div key={index} className="border rounded-lg p-5">
                            <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* CTA Section */}
                  <section className="mt-10 bg-primary/10 rounded-lg p-6 sm:p-8 text-center">
                    <h2 className="text-2xl font-bold mb-3">Need Expert Advice?</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                      Our technical team is ready to help you select the right chemicals for your specific application.
                      Contact us for product recommendations, technical specifications, and competitive pricing.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" asChild>
                        <LocalizedLink to="/contact">Contact Our Team</LocalizedLink>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <a href="https://wa.me/96892772305">WhatsApp Us</a>
                      </Button>
                    </div>
                  </section>

                  {/* Back to Guides */}
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedGuide(null)}
                    >
                      <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                      Browse More Industry Guides
                    </Button>
                  </div>
                </article>
              )}
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-8">
              {!selectedArticle ? (
                <>
                  {/* Category Filter */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-center flex-wrap px-2">
                    {blogCategories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedArticleCategory === category ? 'default' : 'outline'}
                        onClick={() => setSelectedArticleCategory(category)}
                        className="whitespace-nowrap text-xs sm:text-sm"
                        size="sm"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* Featured Article */}
                  {featuredArticle && selectedArticleCategory === 'All' && (
                    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow logo-gradient-border logo-gradient-top relative" onClick={() => setSelectedArticle(featuredArticle)}>
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary">Featured</Badge>
                          <Badge variant="secondary">{featuredArticle.category}</Badge>
                        </div>
                        <CardTitle className="text-2xl hover:text-primary transition-colors">{featuredArticle.title}</CardTitle>
                        <CardDescription className="text-base">{featuredArticle.excerpt}</CardDescription>
                      </CardHeader>
                      <CardFooter className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1"><User className="h-4 w-4" />{featuredArticle.author}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{featuredArticle.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{featuredArticle.readTime}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  )}

                  {/* Articles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularArticles.map((article) => (
                      <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow logo-gradient-border relative" onClick={() => setSelectedArticle(article)}>
                        <CardHeader>
                          <Badge variant="secondary" className="w-fit mb-2">{article.category}</Badge>
                          <CardTitle className="text-lg hover:text-primary transition-colors">{article.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                        </CardHeader>
                        <CardFooter className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{article.date}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <article className="max-w-4xl mx-auto">
                  <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mb-6">
                    <ChevronRight className="h-4 w-4 rotate-180 mr-2" />Back to Articles
                  </Button>
                  <Badge variant="secondary" className="mb-4">{selectedArticle.category}</Badge>
                  {/* h2: the page h1 ("Resources & Insights") is still rendered above */}
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">{selectedArticle.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                    <span className="flex items-center gap-1"><User className="h-4 w-4" />{selectedArticle.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{selectedArticle.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{selectedArticle.readTime}</span>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    {/* renderContent already emits <p> blocks; wrapping it in
                        another <p> was invalid HTML and browsers auto-closed
                        the outer tag, breaking the spacing. */}
                    {selectedArticle.content.map((paragraph, index) => (
                      <div key={index} className="mb-4 text-muted-foreground">{renderContent(paragraph)}</div>
                    ))}
                  </div>
                  {selectedArticle.relatedProducts && selectedArticle.relatedProducts.length > 0 && (
                    <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-3">Related Products</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedArticle.relatedProducts.map((product, i) => (
                          <Link key={i} to={`/products?search=${encodeURIComponent(product)}`}>
                            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">{product}</Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              )}
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads" className="space-y-8">
              {/* Download Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-center flex-wrap px-2">
                {downloadCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedDownloadCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedDownloadCategory(category.id)}
                    className="whitespace-nowrap text-xs sm:text-sm"
                    size="sm"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Resources Grid */}
              {filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No resources found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => {
                    const IconComponent = resource.icon;
                    return (
                      <Card key={resource.id} className="hover:shadow-lg transition-shadow logo-gradient-border relative">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            {resource.badge && (
                              <Badge variant="secondary">{resource.badge}</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">{resource.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {resource.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm text-muted-foreground">
                              {resource.fileSize}
                            </span>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleView(resource)}
                                size="sm"
                                variant="outline"
                                className="gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              <Button 
                                onClick={() => handleDownload(resource)}
                                size="sm"
                                className="gap-2"
                              >
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Download</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Downloads CTA */}
              <div className="mt-12 bg-primary/5 rounded-lg p-6 sm:p-8 md:p-12">
                <Card className="max-w-3xl mx-auto text-center border-0 shadow-none bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl">
                      Need Custom Documentation?
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-4">
                      Can't find what you're looking for? Our team can provide customized technical documentation, 
                      product specifications, or industry-specific solutions tailored to your requirements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <LocalizedLink to="/contact">Request Documents</LocalizedLink>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="https://wa.me/96892772305">Chat on WhatsApp</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      </main>
      <Footer />
      
      {/* PDF Viewer Dialog */}
      {selectedResource && (
        <PDFViewerDialog
          open={pdfViewerOpen}
          onOpenChange={setPdfViewerOpen}
          pdfUrl={selectedResource.downloadUrl || ''}
          title={selectedResource.title}
          onDownloadClick={() => {
            setPdfViewerOpen(false);
            setDownloadDialogOpen(true);
          }}
        />
      )}
      
      {/* Download Gate Dialog */}
      {selectedResource && (
        <DownloadGateDialog
          open={downloadDialogOpen}
          onOpenChange={setDownloadDialogOpen}
          resourceTitle={selectedResource.title}
          downloadUrl={selectedResource.downloadUrl || ''}
          onDownloadSuccess={handleDownloadSuccess}
        />
      )}
    </div>
  );
};

export default Resources;