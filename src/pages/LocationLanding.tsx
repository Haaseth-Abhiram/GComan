import { useParams, Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Truck,
  Shield,
  Award,
  CheckCircle2,
  Factory,
  Droplets,
  Beaker,
  Building2,
  ChevronRight
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { BreadcrumbStructuredData, FAQStructuredData, OrganizationStructuredData } from '@/components/StructuredData';

// Location data for SEO-optimized landing pages
interface LocationData {
  slug: string;
  city: string;
  cityArabic: string;
  country: string;
  region: string;
  description: string;
  industries: string[];
  deliveryTime: string;
  keyClients: string[];
  highlights: string[];
  faqs: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const locations: Record<string, LocationData> = {
  'muscat': {
    slug: 'muscat',
    city: 'Muscat',
    cityArabic: 'مسقط',
    country: 'Oman',
    region: 'Muscat Governorate',
    description: 'Global Chemicals LLC is the leading chemical supplier in Muscat, Oman\'s capital city. We serve industries across Ghala, Rusayl Industrial Area, Wadi Kabir, Azaiba, and surrounding areas with prompt delivery and expert technical support. Our Muscat warehouse maintains extensive stock for immediate availability.',
    industries: ['Oil & Gas', 'Manufacturing', 'Water Treatment', 'Construction', 'Food Processing', 'Pharmaceuticals', 'Hotels & Hospitality'],
    deliveryTime: 'Same-day delivery available in Muscat metropolitan area',
    keyClients: ['PDO contractors', 'OQ facilities', 'Ministry projects', 'Major hotels', 'Manufacturing plants'],
    highlights: [
      'Head office located in Ghala, Muscat',
      'Same-day delivery within Muscat',
      'Technical support team on-site',
      '1000+ products in local stock',
      'ISO 9001 certified operations'
    ],
    faqs: [
      {
        question: 'Where is Global Chemicals LLC located in Muscat?',
        answer: 'Our head office and main warehouse is located at Office-3, Building Number 1737, Near Oman LNG, Ghala, Muscat. We serve all areas of Muscat including Rusayl, Wadi Kabir, Azaiba, Seeb, and surrounding industrial zones.'
      },
      {
        question: 'What is the delivery time for chemicals in Muscat?',
        answer: 'We offer same-day delivery for orders placed before 12:00 PM within the Muscat metropolitan area. For standard orders, delivery is typically within 24 hours. Emergency deliveries can be arranged outside business hours.'
      },
      {
        question: 'Do you provide technical support in Muscat?',
        answer: 'Yes, our technical team is based in Muscat and provides on-site support for product selection, dosing optimization, and troubleshooting. We offer free consultations for industrial clients in the Muscat area.'
      }
    ],
    metaTitle: 'Chemical Supplier Muscat | Industrial Chemicals Muscat | Global Chemicals LLC',
    metaDescription: 'Leading chemical supplier in Muscat, Oman. Same-day delivery. Water treatment chemicals, industrial lubricants, lab chemicals. ISO 9001 certified. Call +968-93754388.',
    metaKeywords: 'chemical supplier Muscat, chemicals Muscat, industrial chemicals Muscat, water treatment Muscat, PAC Muscat, caustic soda Muscat, lubricants Muscat, laboratory chemicals Muscat, chemical distributor Muscat Oman'
  },
  'sohar': {
    slug: 'sohar',
    city: 'Sohar',
    cityArabic: 'صحار',
    country: 'Oman',
    region: 'North Al Batinah Governorate',
    description: 'Global Chemicals LLC provides comprehensive chemical supply services to Sohar\'s thriving industrial sector. We serve SOHAR Port, SOHAR Freezone, Sohar Industrial Estate, and surrounding manufacturing facilities with specialized chemicals for oil & gas, refining, aluminum production, and petrochemical industries.',
    industries: ['Oil Refining', 'Petrochemicals', 'Aluminum Production', 'Steel Manufacturing', 'Power Generation', 'Desalination', 'Port Operations'],
    deliveryTime: 'Next-day delivery to Sohar area',
    keyClients: ['Sohar Aluminium', 'Sohar Refinery', 'OOCEP', 'Vale Oman', 'SOHAR Port industries'],
    highlights: [
      'Dedicated supply to SOHAR Freezone',
      'Next-day delivery from Muscat',
      'Bulk supply agreements available',
      'JSRS certified for industrial supply',
      'Technical support for heavy industries'
    ],
    faqs: [
      {
        question: 'Do you supply chemicals to SOHAR Freezone?',
        answer: 'Yes, we are an approved supplier for SOHAR Freezone and SOHAR Port industries. We supply water treatment chemicals, industrial lubricants, production chemicals, and laboratory reagents to facilities throughout the zone.'
      },
      {
        question: 'What is the delivery time to Sohar from Muscat?',
        answer: 'Standard delivery to Sohar is next-day for orders placed before 2:00 PM. We also offer scheduled weekly deliveries for bulk clients and emergency same-day delivery when required.'
      },
      {
        question: 'Can you supply chemicals for aluminum production in Sohar?',
        answer: 'Yes, we supply specialized chemicals for aluminum smelting and refining operations including caustic soda, hydrofluoric acid handling equipment, and process chemicals. Contact our technical team for specific requirements.'
      }
    ],
    metaTitle: 'Chemical Supplier Sohar | Industrial Chemicals SOHAR Freezone | Global Chemicals LLC',
    metaDescription: 'Chemical supplier for Sohar Industrial Estate & SOHAR Freezone. Oil refinery chemicals, petrochemicals, water treatment. Next-day delivery. ISO 9001 certified.',
    metaKeywords: 'chemical supplier Sohar, chemicals Sohar, SOHAR Freezone chemicals, Sohar Industrial Estate, refinery chemicals Sohar, petrochemicals Sohar, water treatment Sohar, industrial lubricants Sohar'
  },
  'salalah': {
    slug: 'salalah',
    city: 'Salalah',
    cityArabic: 'صلالة',
    country: 'Oman',
    region: 'Dhofar Governorate',
    description: 'Global Chemicals LLC serves Salalah and the Dhofar region with comprehensive chemical supply solutions. We support industries in Salalah Free Zone, Raysut Industrial Estate, and the Port of Salalah with water treatment chemicals, industrial lubricants, and specialty chemicals for the region\'s unique climate and industrial needs.',
    industries: ['Port Operations', 'Manufacturing', 'Agriculture', 'Tourism & Hotels', 'Food Processing', 'Fisheries', 'Cement Production'],
    deliveryTime: '2-3 day delivery to Salalah',
    keyClients: ['Port of Salalah', 'Salalah Free Zone industries', 'Dhofar hotels', 'Agricultural operations'],
    highlights: [
      'Regular shipments to Dhofar region',
      'Climate-specific chemical recommendations',
      'Hotel and hospitality supply',
      'Agricultural chemical expertise',
      'Fisheries processing chemicals'
    ],
    faqs: [
      {
        question: 'Do you deliver chemicals to Salalah?',
        answer: 'Yes, we provide regular scheduled deliveries to Salalah and the Dhofar region. Standard delivery time is 2-3 business days from our Muscat warehouse. We also maintain relationships with local warehousing for faster access to commonly used products.'
      },
      {
        question: 'What chemicals do you supply for hotels in Salalah?',
        answer: 'We supply swimming pool chemicals (calcium hypochlorite, pH adjusters, algaecides), cleaning chemicals, water treatment solutions, and kitchen/laundry chemicals for Salalah\'s hospitality sector. Contact us for customized supply agreements.'
      },
      {
        question: 'Do you provide chemicals for agricultural use in Dhofar?',
        answer: 'Yes, we supply agricultural chemicals suitable for Dhofar\'s unique climate including fertilizers, soil treatments, and water treatment chemicals for irrigation systems. Our team can recommend products for the Khareef season conditions.'
      }
    ],
    metaTitle: 'Chemical Supplier Salalah | Chemicals Dhofar | Global Chemicals LLC Oman',
    metaDescription: 'Chemical supplier for Salalah & Dhofar region. Pool chemicals, water treatment, industrial supplies. Regular deliveries. Serving Salalah Free Zone & Port of Salalah.',
    metaKeywords: 'chemical supplier Salalah, chemicals Salalah, Dhofar chemicals, Salalah Free Zone, pool chemicals Salalah, water treatment Salalah, industrial chemicals Dhofar'
  },
  'duqm': {
    slug: 'duqm',
    city: 'Duqm',
    cityArabic: 'الدقم',
    country: 'Oman',
    region: 'Al Wusta Governorate',
    description: 'Global Chemicals LLC supports Duqm Special Economic Zone (SEZ) and the rapidly growing industrial hub with specialized chemical supply services. We serve the Duqm Refinery, Dry Dock, Port of Duqm, and emerging manufacturing facilities with production chemicals, water treatment solutions, and industrial lubricants.',
    industries: ['Oil Refining', 'Dry Dock & Shipbuilding', 'Heavy Manufacturing', 'Logistics', 'Power Generation', 'Construction'],
    deliveryTime: '2-3 day delivery to Duqm SEZ',
    keyClients: ['Duqm Refinery & Petrochemical Industries', 'Oman Dry Dock Company', 'Duqm SEZ developments'],
    highlights: [
      'Approved supplier for Duqm SEZ',
      'Refinery-grade chemical supply',
      'Marine and dry dock chemicals',
      'Project-based bulk supply',
      'Technical consultancy available'
    ],
    faqs: [
      {
        question: 'Do you supply chemicals to Duqm Refinery?',
        answer: 'Yes, we are positioned to supply production chemicals, water treatment chemicals, and specialty chemicals to Duqm Refinery and Petrochemical Industries (DRPIC). We have experience with refinery chemical approvals and can support qualification processes.'
      },
      {
        question: 'What chemicals do you provide for the Duqm Dry Dock?',
        answer: 'We supply marine chemicals including antifouling paint additives, cleaning chemicals, water treatment for ship systems, and industrial lubricants suitable for marine applications. Contact us for dry dock-specific requirements.'
      },
      {
        question: 'Can you support new projects in Duqm SEZ?',
        answer: 'Absolutely. We provide project-based chemical supply including bulk quantities during construction and commissioning phases. Our team can support chemical specification and procurement planning for new developments in Duqm SEZ.'
      }
    ],
    metaTitle: 'Chemical Supplier Duqm | Duqm SEZ Chemicals | Global Chemicals LLC Oman',
    metaDescription: 'Chemical supplier for Duqm SEZ, Duqm Refinery & Dry Dock. Refinery chemicals, marine chemicals, water treatment. Supporting Oman\'s new industrial hub.',
    metaKeywords: 'chemical supplier Duqm, Duqm SEZ chemicals, Duqm Refinery chemicals, Duqm Dry Dock, industrial chemicals Duqm, water treatment Duqm, marine chemicals Oman'
  },
  'rusayl': {
    slug: 'rusayl',
    city: 'Rusayl Industrial Estate',
    cityArabic: 'المنطقة الصناعية بالرسيل',
    country: 'Oman',
    region: 'Muscat Governorate',
    description: 'Global Chemicals LLC is a trusted chemical partner for Rusayl Industrial Estate, Oman\'s largest industrial zone. We provide daily deliveries to manufacturing facilities, food processing plants, pharmaceutical companies, and diverse industries operating in Rusayl with comprehensive chemical solutions and technical support.',
    industries: ['Food & Beverage', 'Pharmaceuticals', 'Plastics & Packaging', 'Textiles', 'Metal Fabrication', 'Electronics', 'General Manufacturing'],
    deliveryTime: 'Same-day delivery to Rusayl Industrial Estate',
    keyClients: ['Food processing plants', 'Pharmaceutical manufacturers', 'Packaging companies', 'Chemical formulators'],
    highlights: [
      'Same-day delivery to Rusayl',
      'Food-grade chemicals available',
      'Pharmaceutical-grade reagents',
      'Small quantity orders welcome',
      'Regular scheduled deliveries'
    ],
    faqs: [
      {
        question: 'Do you deliver to all areas of Rusayl Industrial Estate?',
        answer: 'Yes, we provide same-day delivery to all phases and zones of Rusayl Industrial Estate. Orders placed before 11:00 AM are typically delivered the same afternoon. We also offer scheduled weekly deliveries for regular clients.'
      },
      {
        question: 'Do you supply food-grade chemicals for Rusayl food processors?',
        answer: 'Yes, we supply NSF-certified food-grade chemicals including sanitizers, cleaning agents, food-grade lubricants, and water treatment chemicals suitable for food and beverage manufacturing. All products come with appropriate certifications.'
      },
      {
        question: 'Can you supply small quantities to Rusayl SMEs?',
        answer: 'Absolutely. We understand that many Rusayl businesses are SMEs with varying requirements. We offer flexible order quantities and can supply from single units to bulk containers depending on your needs.'
      }
    ],
    metaTitle: 'Chemical Supplier Rusayl | Rusayl Industrial Estate Chemicals | Global Chemicals LLC',
    metaDescription: 'Chemical supplier for Rusayl Industrial Estate. Food-grade chemicals, pharmaceutical reagents, industrial supplies. Same-day delivery. Serving 500+ Rusayl industries.',
    metaKeywords: 'chemical supplier Rusayl, Rusayl Industrial Estate chemicals, food grade chemicals Rusayl, pharmaceutical chemicals Rusayl, industrial chemicals Rusayl, manufacturing chemicals Oman'
  },

  // ── GCC / Middle East Location Pages ──────────────────────────────────────

  'dubai': {
    slug: 'dubai',
    city: 'Dubai',
    cityArabic: 'دبي',
    country: 'UAE',
    region: 'Dubai, United Arab Emirates',
    description: 'Global Chemicals LLC exports a comprehensive range of industrial and specialty chemicals to Dubai and the broader UAE. We supply water treatment chemicals, oilfield chemicals, industrial lubricants, laboratory reagents, and construction chemicals to industries across Jebel Ali Free Zone (JAFZA), Dubai Industrial City, and major project sites throughout the Emirates.',
    industries: ['Oil & Gas', 'Construction', 'Manufacturing', 'Water Treatment', 'Hospitality', 'Pharmaceuticals', 'Food Processing'],
    deliveryTime: '3-5 business days to Dubai (road freight) or 1-2 days (air freight)',
    keyClients: ['JAFZA-registered companies', 'Dubai construction projects', 'Hotel chains', 'Manufacturing facilities', 'Pharmaceutical labs'],
    highlights: [
      'Full export documentation provided (COA, SDS, CO)',
      'FOB Muscat / CIF Dubai pricing available',
      'ISO 9001 certified quality assurance',
      'Competitive USD export pricing',
      'Large order bulk supply capability'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC supply chemicals to Dubai?',
        answer: 'Yes, we export a wide range of industrial and specialty chemicals to Dubai, UAE. Products include water treatment chemicals (PAC, antiscalants, biocides), industrial lubricants (Shell, Mobil), laboratory reagents (AR grade, HPLC solvents), and oilfield chemicals. Standard lead time is 3-5 business days via road freight.'
      },
      {
        question: 'What documentation do you provide for chemical exports to Dubai?',
        answer: 'We provide full export documentation including Certificate of Analysis (COA), Safety Data Sheet (SDS/MSDS), Certificate of Origin, commercial invoice, packing list, and any other documents required for UAE customs clearance. Products are exported in accordance with UAE import regulations.'
      },
      {
        question: 'Can you supply chemicals to Jebel Ali Free Zone (JAFZA)?',
        answer: 'Yes, we regularly supply chemicals to clients in JAFZA and Dubai Industrial City. We can coordinate with freight forwarders for delivery to free zone warehouses and provide all required documentation for free zone import procedures.'
      }
    ],
    metaTitle: 'Chemical Supplier Dubai | Industrial Chemicals UAE | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Dubai & UAE. Water treatment chemicals, industrial lubricants, lab chemicals, oilfield chemicals. ISO 9001 certified. 3-5 day delivery. Get a quote.',
    metaKeywords: 'chemical supplier Dubai, chemicals Dubai, industrial chemicals UAE, water treatment chemicals Dubai, laboratory chemicals Dubai, chemical exporter Oman UAE, chemical supplier UAE, oilfield chemicals Dubai, JAFZA chemical supplier'
  },

  'abu-dhabi': {
    slug: 'abu-dhabi',
    city: 'Abu Dhabi',
    cityArabic: 'أبوظبي',
    country: 'UAE',
    region: 'Abu Dhabi, United Arab Emirates',
    description: 'Global Chemicals LLC serves Abu Dhabi\'s oil & gas, manufacturing, and construction sectors with industrial and specialty chemical exports. We supply chemicals to ADNOC contractors, KIZAD (Khalifa Industrial Zone), Abu Dhabi Industrial City, and major infrastructure projects across the UAE capital.',
    industries: ['Oil & Gas (ADNOC)', 'Refining & Petrochemicals', 'Manufacturing', 'Construction & Infrastructure', 'Desalination', 'Utilities', 'Pharmaceuticals'],
    deliveryTime: '3-5 business days to Abu Dhabi (road freight)',
    keyClients: ['ADNOC contractors', 'KIZAD companies', 'Abu Dhabi construction projects', 'Utility companies', 'Petrochemical facilities'],
    highlights: [
      'ADNOC supply chain experience',
      'KIZAD and Abu Dhabi Industrial City supply',
      'Oilfield & refinery chemical expertise',
      'Full regulatory documentation',
      'Bulk and project-based supply'
    ],
    faqs: [
      {
        question: 'Do you supply chemicals to Abu Dhabi and ADNOC contractors?',
        answer: 'Yes, we supply chemicals to ADNOC contractors and oil & gas facilities in Abu Dhabi. Our portfolio includes corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers, water treatment chemicals, and specialty oilfield chemicals. We provide full documentation for Abu Dhabi supply chain qualification.'
      },
      {
        question: 'Can you supply chemicals to KIZAD (Khalifa Industrial Zone)?',
        answer: 'Yes, we export chemicals to companies operating in KIZAD and the broader Abu Dhabi Industrial City. We provide CIF Abu Dhabi or DAP KIZAD pricing and coordinate with approved freight forwarders for smooth delivery.'
      },
      {
        question: 'What is the lead time for chemical supply to Abu Dhabi?',
        answer: 'Standard road freight from Muscat to Abu Dhabi typically takes 3-5 business days. For urgent requirements, air freight can deliver within 1-2 business days. We also offer scheduled weekly shipments for regular clients with standing orders.'
      }
    ],
    metaTitle: 'Chemical Supplier Abu Dhabi | ADNOC Supply Chain Chemicals | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Abu Dhabi & KIZAD. Oilfield chemicals, water treatment, industrial lubricants. ISO 9001 certified. Serving ADNOC contractors. Get a quote.',
    metaKeywords: 'chemical supplier Abu Dhabi, chemicals Abu Dhabi, ADNOC chemical supplier, KIZAD chemicals, oilfield chemicals Abu Dhabi, water treatment chemicals Abu Dhabi, industrial chemicals UAE, chemical exporter Oman'
  },

  'riyadh': {
    slug: 'riyadh',
    city: 'Riyadh',
    cityArabic: 'الرياض',
    country: 'Saudi Arabia',
    region: 'Riyadh Region, Saudi Arabia',
    description: 'Global Chemicals LLC exports industrial and specialty chemicals to Riyadh and the broader Saudi Arabian market. We supply water treatment chemicals, industrial lubricants, laboratory reagents, oilfield chemicals, and construction chemicals to industries across the Kingdom — from Riyadh\'s industrial areas to the Eastern Province oil hubs.',
    industries: ['Oil & Gas', 'Petrochemicals', 'Water Treatment & Desalination', 'Manufacturing', 'Construction', 'Pharmaceuticals', 'Mining'],
    deliveryTime: '5-7 business days to Riyadh (road/sea freight)',
    keyClients: ['Saudi Aramco contractors', 'SABIC facilities', 'NWC water utilities', 'Industrial manufacturers', 'Pharmaceutical labs'],
    highlights: [
      'Saudi Aramco supply chain documentation',
      'SABIC-grade chemical quality',
      'Full Arabic documentation available',
      'Halal-certified products where applicable',
      'Large volume bulk supply capability'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC supply chemicals to Saudi Arabia?',
        answer: 'Yes, we export chemicals to all regions of Saudi Arabia including Riyadh, Jeddah, Dammam, and the Eastern Province. Products include water treatment chemicals, oilfield chemicals (corrosion inhibitors, scale inhibitors, demulsifiers), industrial lubricants, and laboratory reagents. Lead times are typically 5-7 business days.'
      },
      {
        question: 'Can you supply chemicals approved for Saudi Aramco contractors?',
        answer: 'Yes, we have experience supplying chemicals to Saudi Aramco-approved contractors. We provide full documentation packages including COA, SDS, Certificate of Origin, and technical data sheets to support vendor qualification processes. Contact our team for specific Aramco product list requirements.'
      },
      {
        question: 'What payment terms and currencies do you accept for Saudi Arabia?',
        answer: 'We accept payment in SAR (Saudi Riyal), USD, and other major currencies. Standard payment terms include advance payment, 30-day net for established accounts, and Letter of Credit (LC) for large orders. We provide complete export documentation for customs clearance at Saudi port of entry.'
      }
    ],
    metaTitle: 'Chemical Supplier Saudi Arabia | Industrial Chemicals Riyadh | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Saudi Arabia. Water treatment, oilfield, industrial chemicals to Riyadh, Jeddah, Dammam. ISO 9001 certified. Full export documentation. Get a quote.',
    metaKeywords: 'chemical supplier Saudi Arabia, chemicals Riyadh, chemical supplier Riyadh, industrial chemicals Saudi Arabia, water treatment chemicals KSA, oilfield chemicals Saudi Arabia, Saudi Aramco chemical supplier, chemical exporter Oman Saudi'
  },

  'doha': {
    slug: 'doha',
    city: 'Doha',
    cityArabic: 'الدوحة',
    country: 'Qatar',
    region: 'Doha, Qatar',
    description: 'Global Chemicals LLC exports specialty and industrial chemicals to Qatar, serving Doha\'s rapidly growing industrial, LNG, and infrastructure sectors. We supply water treatment chemicals, oilfield production chemicals, laboratory reagents, and industrial lubricants to QatarEnergy contractors, Ras Laffan Industrial City, and Doha-based industries.',
    industries: ['LNG & Gas Processing', 'Petrochemicals', 'Water Treatment & Desalination', 'Construction', 'Manufacturing', 'Oil & Gas', 'Utilities'],
    deliveryTime: '3-5 business days to Doha (road freight)',
    keyClients: ['QatarEnergy contractors', 'Ras Laffan companies', 'Doha construction projects', 'Utility companies', 'Industrial manufacturers'],
    highlights: [
      'QatarEnergy supply documentation support',
      'Ras Laffan Industrial City expertise',
      'LNG-sector chemical portfolio',
      'Full regulatory compliance documentation',
      'Competitive export pricing in QAR/USD'
    ],
    faqs: [
      {
        question: 'Do you supply chemicals to Qatar and Doha?',
        answer: 'Yes, we export industrial and specialty chemicals to Qatar. Our portfolio includes water treatment chemicals (PAC, antiscalants, biocides), oilfield production chemicals (corrosion inhibitors, demulsifiers), industrial lubricants, and laboratory reagents. Standard lead time from Muscat to Doha is 3-5 business days via road freight.'
      },
      {
        question: 'Can you supply chemicals to Ras Laffan Industrial City?',
        answer: 'Yes, we supply chemicals to QatarEnergy contractors and other companies operating in Ras Laffan Industrial City. We provide all required documentation for Ras Laffan Security Clearance and import procedures. Our team has experience with QatarEnergy vendor qualification requirements.'
      },
      {
        question: 'Can you handle LNG sector chemical requirements in Qatar?',
        answer: 'Yes, our chemical portfolio includes products specifically suited for LNG and gas processing operations, including corrosion inhibitors, hydrate inhibitors, defoamers, and water treatment chemicals. We can provide product specifications and technical support for LNG sector applications.'
      }
    ],
    metaTitle: 'Chemical Supplier Qatar | Industrial Chemicals Doha | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Qatar & Doha. LNG, water treatment, oilfield chemicals to Ras Laffan & Doha. ISO 9001 certified. QatarEnergy contractor support. Get a quote.',
    metaKeywords: 'chemical supplier Qatar, chemicals Doha, industrial chemicals Qatar, water treatment chemicals Qatar, oilfield chemicals Qatar, LNG chemicals Qatar, QatarEnergy chemical supplier, chemical exporter Oman Qatar, Ras Laffan chemicals'
  },

  'kuwait-city': {
    slug: 'kuwait-city',
    city: 'Kuwait City',
    cityArabic: 'مدينة الكويت',
    country: 'Kuwait',
    region: 'Kuwait City, Kuwait',
    description: 'Global Chemicals LLC exports industrial and specialty chemicals to Kuwait, serving Kuwait City\'s oil refining, manufacturing, and water treatment sectors. We supply chemicals to Kuwait Oil Company (KOC) contractors, KNPC refineries supply chains, Shuaiba Industrial Area, and other industrial zones across Kuwait.',
    industries: ['Oil Refining (KNPC)', 'Petrochemicals', 'Water Treatment & Desalination', 'Manufacturing', 'Construction', 'Utilities'],
    deliveryTime: '4-6 business days to Kuwait City (road freight)',
    keyClients: ['KOC contractors', 'KNPC supply chains', 'Shuaiba Industrial Area companies', 'Kuwait utility companies', 'Manufacturing facilities'],
    highlights: [
      'KOC/KNPC documentation expertise',
      'Shuaiba Industrial Area supply',
      'Refinery-grade chemical products',
      'Full Arabic & English documentation',
      'Bulk tanker and drum supply options'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC export chemicals to Kuwait?',
        answer: 'Yes, we export industrial and specialty chemicals to Kuwait. Our product range includes water treatment chemicals, oilfield production chemicals, industrial lubricants, and laboratory reagents. Delivery to Kuwait City typically takes 4-6 business days via road freight through Saudi Arabia.'
      },
      {
        question: 'Can you supply chemicals to Kuwait Oil Company (KOC) contractors?',
        answer: 'Yes, we have experience supplying chemicals to KOC-contracted companies and other oil & gas operators in Kuwait. We provide full documentation packages including COA, SDS, MSDS, Certificate of Origin, and technical data sheets for vendor qualification purposes.'
      },
      {
        question: 'What export pricing terms do you offer for Kuwait?',
        answer: 'We can quote on FOB Muscat, CIF Shuwaikh Port, or DAP delivery terms. Pricing is available in KWD, USD, or OMR. For regular clients we offer open account terms; for new relationships we typically start with advance payment or Letter of Credit.'
      }
    ],
    metaTitle: 'Chemical Supplier Kuwait | Industrial Chemicals Kuwait City | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Kuwait. Water treatment, oilfield, refinery chemicals to Kuwait City & Shuaiba. ISO 9001 certified. KOC contractor support. Get a quote.',
    metaKeywords: 'chemical supplier Kuwait, chemicals Kuwait City, industrial chemicals Kuwait, water treatment chemicals Kuwait, oilfield chemicals Kuwait, KOC chemical supplier, KNPC chemicals, chemical exporter Oman Kuwait, Shuaiba chemicals'
  },

  'bahrain': {
    slug: 'bahrain',
    city: 'Bahrain',
    cityArabic: 'البحرين',
    country: 'Bahrain',
    region: 'Manama, Kingdom of Bahrain',
    description: 'Global Chemicals LLC exports specialty and industrial chemicals to the Kingdom of Bahrain, supporting Manama\'s aluminum, refining, financial, and manufacturing sectors. We supply chemicals to ALBA (Aluminium Bahrain), BAPCO refinery contractors, Hidd Industrial Area, Sitra Industrial Area, and other major industrial zones in Bahrain.',
    industries: ['Aluminium Production (ALBA)', 'Oil Refining (BAPCO)', 'Manufacturing', 'Water Treatment', 'Construction', 'Pharmaceuticals', 'Financial Services Infrastructure'],
    deliveryTime: '3-5 business days to Bahrain (road freight via Saudi Arabia)',
    keyClients: ['ALBA supply chains', 'BAPCO contractors', 'Hidd Industrial Area companies', 'Sitra Industrial Area businesses', 'Bahrain utility companies'],
    highlights: [
      'ALBA aluminum sector chemical expertise',
      'BAPCO refinery chemical supply',
      'Hidd & Sitra industrial supply',
      'Full Bahraini customs documentation',
      'Competitive GCC export pricing'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC supply chemicals to Bahrain?',
        answer: 'Yes, we export industrial and specialty chemicals to the Kingdom of Bahrain. Our product range includes water treatment chemicals, industrial lubricants, aluminum processing chemicals, refinery chemicals, and laboratory reagents. Standard delivery time from Muscat to Manama is 3-5 business days via road freight.'
      },
      {
        question: 'Can you supply chemicals for ALBA (Aluminium Bahrain) operations?',
        answer: 'Yes, we supply chemicals relevant to aluminum production and processing including caustic soda, process chemicals, lubricants, and water treatment solutions. We provide all required technical documentation and can support ALBA supplier qualification processes.'
      },
      {
        question: 'What import documentation do you provide for Bahrain?',
        answer: 'We provide complete export documentation for Bahrain customs: Certificate of Origin (GCC preferential if applicable), Certificate of Analysis, Safety Data Sheet, Halal certificates (where applicable), commercial invoice, packing list, and Bill of Lading or Airway Bill.'
      }
    ],
    metaTitle: 'Chemical Supplier Bahrain | Industrial Chemicals Manama | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Bahrain. Aluminium, refinery, water treatment chemicals to Manama & Hidd. ISO 9001 certified. ALBA & BAPCO contractor support. Get a quote.',
    metaKeywords: 'chemical supplier Bahrain, chemicals Manama, industrial chemicals Bahrain, water treatment chemicals Bahrain, ALBA chemical supplier, BAPCO chemicals, chemical exporter Oman Bahrain, Hidd industrial chemicals, Sitra chemicals'
  }
};



const productCategories = [
  { name: 'Water Treatment Chemicals', icon: Droplets, description: 'PAC, chlorine, antiscalants, biocides' },
  { name: 'Industrial Lubricants', icon: Factory, description: 'Shell, Mobil, Castrol oils & greases' },
  { name: 'Laboratory Chemicals', icon: Beaker, description: 'AR grade, HPLC solvents, reagents' },
  { name: 'Oil & Gas Chemicals', icon: Building2, description: 'Corrosion inhibitors, demulsifiers' },
];

const LocationLanding = () => {
  const { location } = useParams<{ location: string }>();

  // Check if location exists
  if (!location || !locations[location]) {
    return <Navigate to="/contact" replace />;
  }

  const locationData = locations[location];

  const breadcrumbItems = [
    { name: 'Home', url: 'https://gcoman.com/' },
    { name: `Chemicals ${locationData.city}`, url: `https://gcoman.com/chemicals/${locationData.slug}` }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={locationData.metaTitle}
        description={locationData.metaDescription}
        keywords={locationData.metaKeywords}
        ogTitle={`Chemical Supplier in ${locationData.city}, ${locationData.country} | Global Chemicals LLC`}
        ogDescription={locationData.metaDescription}
        ogUrl={`https://gcoman.com/chemicals/${locationData.slug}`}
        canonical={`https://gcoman.com/chemicals/${locationData.slug}`}
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <FAQStructuredData faqs={locationData.faqs} />
      <OrganizationStructuredData />

      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                <MapPin className="w-3 h-3 mr-1" />
                {locationData.region}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {locationData.cityArabic}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Chemical Supplier in <span className="text-primary">{locationData.city}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {locationData.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" asChild>
                <a href="/contact">
                  Request Quote for {locationData.city}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+96893754388">
                  <Phone className="mr-2 h-4 w-4" />
                  +968-93754388
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                <Shield className="w-3 h-3 mr-1" />
                ISO 9001 Certified
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400">
                <Award className="w-3 h-3 mr-1" />
                JSRS Registered
              </Badge>
              <Badge variant="outline" className="bg-primary/10 border-primary/30">
                <Truck className="w-3 h-3 mr-1" />
                {locationData.deliveryTime}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Industries We Serve in {locationData.city}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {locationData.industries.map((industry, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Chemicals Available in {locationData.city}
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              We supply a comprehensive range of industrial and specialty chemicals to {locationData.city} businesses
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow logo-gradient-border relative">
                    <CardHeader>
                      <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="p-0" asChild>
                        <a href="/products">View Products →</a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why Choose Global Chemicals LLC in {locationData.city}?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ul className="space-y-4">
                  {locationData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="bg-primary/5 logo-gradient-border relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Delivery to {locationData.city}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{locationData.deliveryTime}</p>
                  <div className="space-y-2">
                    <p className="font-medium">Key Clients in {locationData.city}:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {locationData.keyClients.map((client, index) => (
                        <li key={index}>• {client}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Frequently Asked Questions - {locationData.city}
            </h2>

            <div className="space-y-4">
              {locationData.faqs.map((faq, index) => (
                <Card key={index} className="logo-gradient-border relative">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Get Chemicals Delivered to {locationData.city}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our team for product availability, pricing, and delivery schedules to {locationData.city} and {locationData.region}.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://wa.me/96893754388">
                  WhatsApp Us
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +968-93754388
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@gcoman.com
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Sun-Thu: 8AM-6PM
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationLanding;
