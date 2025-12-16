import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
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
import { SEO } from '@/components/SEO';
import { HowToStructuredData, BreadcrumbStructuredData, ArticleStructuredData, FAQStructuredData, LocalBusinessStructuredData } from '@/components/StructuredData';
import { Link } from 'react-router-dom';
import { blogArticles, articleCategories as blogCategories, BlogArticle } from '@/data/blogArticles';

// Breadcrumb items
const breadcrumbItems = [
  { name: 'Home', url: 'https://www.gcoman.com/' },
  { name: 'Resources', url: 'https://www.gcoman.com/resources' }
];

// HowTo steps for downloading resources
const downloadHowToSteps = [
  {
    name: 'Browse Resources',
    text: 'Navigate to the Resources page and browse through available product catalogs, safety data sheets, and technical documentation.'
  },
  {
    name: 'Select Resource Category',
    text: 'Filter resources by category: Product Catalogs, Safety Data Sheets, Technical Documents, Certifications, or Industry Guides.'
  },
  {
    name: 'Click Download',
    text: 'Click the Download button on your desired resource to open the download dialog.'
  },
  {
    name: 'Fill Contact Information',
    text: 'Enter your name, email, and company details in the download form. This helps us provide better support.'
  },
  {
    name: 'Download File',
    text: 'After submitting the form, your download will begin automatically. The file will be saved to your default downloads folder.'
  }
];

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
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<IndustryGuide | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);

  const downloadCategories = [
    { id: 'all', label: 'All Resources' },
    { id: 'catalogs', label: 'Product Catalogs' },
    { id: 'sds', label: 'Safety Data Sheets' },
    { id: 'technical', label: 'Technical Documents' },
    { id: 'certificates', label: 'Certifications' },
    { id: 'guides', label: 'Industry Guides' },
  ];

  // Filter articles based on category
  const filteredArticles = blogArticles.filter((article) => {
    const matchesCategory = selectedArticleCategory === 'All' || article.category === selectedArticleCategory;
    return matchesCategory;
  });

  const featuredArticle = blogArticles.find((article) => article.featured);

  // Render markdown-like content with bold text
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
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

  const handleDownloadSuccess = () => {
    // Additional actions after successful download can be added here
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Industry Guides & Chemical Resources | Global Chemicals LLC Oman"
        description="Expert chemical industry guides for Oman: water treatment, industrial lubricants, laboratory chemicals, oil & gas production chemicals. Download SDS, catalogs, and technical documentation."
        keywords="water treatment chemicals Oman, industrial lubricants guide, laboratory chemicals Oman, oil gas production chemicals, swimming pool chemicals, chemical SDS download, product catalogs, safety data sheets, PAC coagulant, Shell Mobil Castrol lubricants, desalination chemicals, corrosion inhibitors"
        ogTitle="Chemical Industry Guides & Resources | Global Chemicals LLC Oman"
        ogDescription="Comprehensive guides on water treatment, lubricants, laboratory chemicals & oil field chemicals for Oman industries. Free technical resources and expert knowledge."
        ogUrl="https://www.gcoman.com/resources"
        canonical="https://www.gcoman.com/resources"
      />
      <HowToStructuredData
        name="How to Download Chemical Resources from Global Chemicals LLC"
        description="Step-by-step guide to downloading product catalogs, safety data sheets, and technical documentation from Global Chemicals LLC."
        steps={downloadHowToSteps}
        totalTime="PT5M"
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <LocalBusinessStructuredData />
      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 px-4">
              Resources & Insights
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
              Access downloadable resources, industry news, technical guides, and expert insights
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles and resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
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
                href="https://wa.me/96893754388"
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
                      Expert Chemical Industry Guides for Oman
                    </h2>
                    <p className="text-muted-foreground">
                      Comprehensive technical guides covering water treatment, industrial lubricants, laboratory chemicals, and more.
                      Written by industry experts for professionals in Oman.
                    </p>
                  </div>

                  {/* Guides Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industryGuides.map((guide) => {
                      const IconComponent = guide.icon;
                      return (
                        <Card
                          key={guide.id}
                          className="hover:shadow-lg transition-all cursor-pointer group"
                          onClick={() => setSelectedGuide(guide)}
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

                  {/* SEO Content Section */}
                  <div className="mt-12 bg-muted/50 rounded-lg p-6 sm:p-8">
                    <h3 className="text-xl font-bold mb-4">Why Choose Global Chemicals LLC for Your Chemical Needs in Oman?</h3>
                    <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
                      <div>
                        <p className="mb-4">
                          Global Chemicals LLC is Oman's trusted partner for industrial chemicals, serving industries across Muscat, Sohar, Duqm, Salalah, and the Rusayl Industrial Area.
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
                          Contact us for competitive pricing, bulk orders, and customized chemical solutions. We deliver across Oman with reliable logistics and emergency supply capabilities.
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
                    url={`https://www.gcoman.com/resources#${selectedGuide.slug}`}
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
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {section.content}
                        </p>
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
                        <a href="/contact">Contact Our Team</a>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <a href="https://wa.me/96893754388">WhatsApp Us</a>
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
                    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedArticle(featuredArticle)}>
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
                      <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedArticle(article)}>
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
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4">{selectedArticle.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                    <span className="flex items-center gap-1"><User className="h-4 w-4" />{selectedArticle.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{selectedArticle.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{selectedArticle.readTime}</span>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    {selectedArticle.content.map((paragraph, index) => (
                      <p key={index} className="mb-4 text-muted-foreground whitespace-pre-line">{renderContent(paragraph)}</p>
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
                      <Card key={resource.id} className="hover:shadow-lg transition-shadow">
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
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {resource.fileSize}
                            </span>
                            <Button 
                              onClick={() => handleDownload(resource)}
                              size="sm"
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
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
                      <a href="/contact">Request Documents</a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="https://wa.me/96893754388">Chat on WhatsApp</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
      
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