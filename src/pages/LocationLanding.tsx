import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotFound from '@/pages/NotFound';
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
import { BreadcrumbStructuredData, FAQStructuredData, SpeakableStructuredData } from '@/components/StructuredData';
import { LocalizedLink } from '@/components/LocalizedLink';

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
  /** Optional cross-link to a relevant in-depth guide, e.g. the GCC desalination pillar. */
  relatedGuide?: { slug: string; title: string; blurb: string };
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
      '275+ products in local stock',
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

  'rustaq': {
    slug: 'rustaq',
    city: 'Rustaq',
    cityArabic: 'الرستاق',
    country: 'Oman',
    region: 'South Al Batinah Governorate',
    description: 'Global Chemicals LLC supplies industrial and specialty chemicals to Rustaq and the South Al Batinah Governorate. Rustaq is home to growing agricultural, food processing, and construction sectors, alongside the historic city\'s expanding light industrial activity. We deliver water treatment chemicals, agricultural inputs, food-grade chemicals, and industrial process chemicals to clients across Rustaq, Nakhal, and surrounding areas within 24–48 hours from our Muscat warehouse.',
    industries: ['Agriculture & Irrigation', 'Food Processing', 'Construction', 'Water Treatment', 'General Manufacturing', 'Hotels & Hospitality'],
    deliveryTime: '24–48 hour delivery to Rustaq from Muscat',
    keyClients: ['Farms and agricultural operations', 'Food processing companies', 'Construction contractors', 'Hotels and resorts', 'Municipal water authorities'],
    highlights: [
      '24–48 hour delivery to Rustaq',
      'Agricultural and food-grade chemicals available',
      'Water treatment chemicals for rural networks',
      'Flexible minimum order quantities',
      'Technical support in Arabic and English'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC deliver chemicals to Rustaq?',
        answer: 'Yes. We deliver industrial and specialty chemicals to Rustaq and surrounding South Al Batinah areas including Nakhal, Wadi Bani Awf, and Awabi. Standard delivery from our Muscat warehouse is 24–48 hours. For urgent requirements, same-day dispatch is available for orders placed before 9 AM.'
      },
      {
        question: 'What chemicals do you supply to Rustaq farms and agricultural operations?',
        answer: 'We supply a range of agricultural chemicals to Rustaq farms including water treatment chemicals for irrigation systems (antiscalants, biocides, algaecides), fertilizer-grade inputs, pH adjustment chemicals (caustic soda, hydrochloric acid), and pool/water sanitisers for farm facilities. All chemicals come with full SDS documentation.'
      },
      {
        question: 'Can you supply water treatment chemicals for Rustaq municipal systems?',
        answer: 'Yes. We supply Poly Aluminium Chloride (PAC), sodium hypochlorite, chlorine tablets, antiscalants, and coagulants used in municipal water treatment and distribution across Oman\'s governorates including South Al Batinah. Contact us for bulk pricing and delivery schedules.'
      }
    ],
    metaTitle: 'Chemical Supplier Rustaq | Industrial Chemicals South Al Batinah | Global Chemicals LLC',
    metaDescription: 'Chemical supplier for Rustaq, Oman. Agricultural chemicals, water treatment, food-grade & industrial chemicals. 24–48 hour delivery from Muscat. Call +968-93754388.',
    metaKeywords: 'chemical supplier Rustaq, chemicals Rustaq Oman, agricultural chemicals Rustaq, water treatment Rustaq, industrial chemicals South Al Batinah, chemical supplier Nakhal Oman'
  },

  // ── GCC / Middle East Location Pages ──────────────────────────────────────

  'dubai': {
    slug: 'dubai',
    city: 'Dubai',
    cityArabic: 'دبي',
    country: 'UAE',
    region: 'Dubai, United Arab Emirates',
    description: 'Global Chemicals LLC supplies industrial and specialty chemicals to Dubai from our Muscat warehouse, moving under GCC customs transit so most industrial grades clear without a separate UAE import agent. Road freight runs the Hatta and Al Ain border lanes to Dubai in 3–5 business days, with drum, IBC, and full-container loads consolidated on scheduled weekly departures; air freight from Muscat reaches Dubai within 24 hours for urgent requirements. We serve buyers across Jebel Ali Free Zone (JAFZA), Dubai Industrial City, Dubai Investments Park (DIP), Al Quoz Industrial Area, and National Industries Park — water treatment and facilities-management companies, district cooling operators, construction and MEP contractors, hotel and hospitality chains, food processors, marine chandlers at Jebel Ali, and pharmaceutical and analytical laboratories. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce, GHS Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and HS-coded commercial invoice; conformity and permit guidance for regulated categories is advised per product before shipment.',
    industries: ['Water Treatment & District Cooling', 'Oil & Gas', 'Construction & MEP', 'Manufacturing', 'Hospitality & Facilities Management', 'Pharmaceuticals & Laboratories', 'Food Processing', 'Marine & Ship Supply'],
    deliveryTime: '3–5 business days by road via the Hatta / Al Ain border lanes; 24-hour air freight available',
    keyClients: ['JAFZA-registered companies', 'District cooling & FM operators', 'Dubai construction & MEP contractors', 'Hotel chains & hospitality groups', 'Marine chandlers at Jebel Ali', 'Pharmaceutical & QC labs'],
    highlights: [
      'GCC customs union — no UAE import agent for most industrial grades',
      'Road freight Muscat to Dubai in 3–5 business days; air freight in 24h',
      'JAFZA, DIP, Al Quoz & Dubai Industrial City delivery experience',
      'Vendor pack: attested CoO, Arabic + English SDS, batch CoA, TDS',
      'Drum, IBC and full-container loads on scheduled weekly departures'
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
      },
      {
        question: 'Do I need a UAE import agent to buy chemicals from Oman?',
        answer: 'For most industrial chemical grades, no. Oman and the UAE share the GCC customs union, so consignments move under customs transit without a separate UAE import agent or local trade licence on our side. Regulated categories — food-contact, cosmetic-grade, and certain hazardous classifications — carry additional UAE conformity or permit requirements, and our export team confirms what applies per product before shipment.'
      },
      {
        question: 'Why import chemicals from Oman instead of buying locally in Dubai?',
        answer: 'Direct import from our Muscat warehouse removes one trading margin from the chain, and GCC preferential origin applies to eligible products. For recurring volume in commodity chemicals — caustic soda, PAC, sodium hypochlorite, glycols, solvents — landed cost via the 3–5 day road lane is frequently below local trader pricing, and scheduled weekly departures keep stock replenishment predictable. We quote FOB Muscat, CIF Jebel Ali, or DAP-to-door in AED or USD so you can compare like for like.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Dubai UAE | Global Chemicals LLC',
    metaDescription: 'Chemical suppliers in Dubai: import from Oman in 3–5 days, 24h air freight. Water treatment, oilfield & lab chemicals to JAFZA, DIP, Al Quoz. Get a quote.',
    metaKeywords: 'chemical suppliers in Dubai, chemical supplier Dubai, chemicals Dubai, industrial chemicals UAE, water treatment chemicals Dubai, laboratory chemicals Dubai, chemical exporter Oman UAE, chemical supplier UAE, oilfield chemicals Dubai, JAFZA chemical supplier, chemical trading companies in Dubai'
  },

  'abu-dhabi': {
    slug: 'abu-dhabi',
    city: 'Abu Dhabi',
    cityArabic: 'أبوظبي',
    country: 'UAE',
    region: 'Abu Dhabi, United Arab Emirates',
    description: 'Global Chemicals LLC supplies industrial and specialty chemicals to Abu Dhabi from our Muscat warehouse, moving under GCC customs transit so most industrial grades clear without a separate UAE import agent. Road freight runs the Al Ain / Mezyad border lane to the capital in 3–5 business days, with drum, IBC, and full-container loads consolidated on scheduled weekly departures; air freight from Muscat reaches Abu Dhabi within 24–48 hours for urgent requirements. We serve buyers across Mussafah and the ICAD industrial cities, KEZAD (Khalifa Economic Zones, formerly KIZAD), and the Ruwais refining corridor — ADNOC group contractors and oilfield service companies, desalination and utility operators, construction and infrastructure contractors, manufacturers, and pharmaceutical and analytical laboratories. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce, GHS Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and HS-coded commercial invoice, with conformity and permit guidance for regulated categories advised per product before shipment.',
    industries: ['Oil & Gas (ADNOC)', 'Refining & Petrochemicals (Ruwais)', 'Desalination & Utilities', 'Construction & Infrastructure', 'Manufacturing (Mussafah / ICAD / KEZAD)', 'Pharmaceuticals & Laboratories'],
    deliveryTime: '3–5 business days by road via the Al Ain / Mezyad border lane; 24–48h air freight available',
    keyClients: ['ADNOC group contractors & oilfield service companies', 'KEZAD & ICAD manufacturers', 'Desalination & utility operators', 'Abu Dhabi construction & infrastructure projects', 'Pharmaceutical & QC laboratories'],
    highlights: [
      'GCC customs union — no UAE import agent for most industrial grades',
      'Al Ain / Mezyad road lane, Muscat to Abu Dhabi in 3–5 business days',
      'Mussafah, ICAD, KEZAD & Ruwais corridor delivery experience',
      'Vendor pack: attested CoO, Arabic + English SDS, batch CoA, TDS',
      'Drum, IBC and full-container loads on scheduled weekly departures'
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
      },
      {
        question: 'Do I need a UAE import agent to buy chemicals from Oman for Abu Dhabi?',
        answer: 'For most industrial chemical grades, no. Oman and the UAE share the GCC customs union, so consignments move under customs transit without a separate UAE import agent. Regulated categories — food-contact, cosmetic-grade, and certain hazardous classifications — carry additional UAE conformity or permit requirements, and our export team confirms what applies per product before shipment.'
      },
      {
        question: 'Can you deliver chemicals to Mussafah and the ICAD industrial cities?',
        answer: 'Yes. Mussafah and the ICAD I–III industrial cities are regular delivery destinations on our Abu Dhabi lane, alongside KEZAD and project sites on the Ruwais corridor. We quote FOB Muscat, CIF Abu Dhabi, or DAP-to-door in AED or USD, and consolidate drum and IBC orders with full-container loads on scheduled weekly departures.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Abu Dhabi | ADNOC Supply Chain',
    metaDescription: 'Chemical suppliers in Abu Dhabi — import from Oman in 3–5 days. Oilfield, water treatment & lab chemicals to Mussafah, ICAD & KEZAD. Get a quote.',
    metaKeywords: 'chemical suppliers in Abu Dhabi, chemical supplier Abu Dhabi, chemicals Abu Dhabi, ADNOC chemical supplier, KEZAD chemicals, KIZAD chemicals, Mussafah industrial chemicals, oilfield chemicals Abu Dhabi, water treatment chemicals Abu Dhabi, industrial chemicals UAE, chemical exporter Oman'
  },

  'riyadh': {
    slug: 'riyadh',
    city: 'Riyadh',
    cityArabic: 'الرياض',
    country: 'Saudi Arabia',
    region: 'Riyadh Region, Saudi Arabia',
    description: 'Global Chemicals LLC supplies industrial and specialty chemicals to Riyadh from our Muscat warehouse, moving under GCC customs transit so most industrial grades clear without a Saudi import agent. Road freight runs the Batha border lane (Muscat–Hofuf–Riyadh) in 5–7 business days, with drum, IBC, and full-container loads consolidated on scheduled weekly departures; Eastern Province transfers via Dammam add 1–2 days. We serve Riyadh\'s Second Industrial City (Sudair and Al Kharj corridors), NWC water and wastewater operators, construction and infrastructure contractors, pharmaceutical and laboratory buyers, and Aramco- and SABIC-tier service companies with water treatment chemicals, glycols and solvents, corrosion and scale inhibitors, food-grade products, and laboratory reagents. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce, GHS Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and HS-coded commercial invoice, with SASO conformity and SFDA permit guidance advised per product before shipment.',
    industries: ['Water Treatment & Desalination', 'Oil & Gas / Petrochemicals', 'Construction & Infrastructure', 'Manufacturing', 'Pharmaceuticals & Laboratories', 'Food & Beverage Processing'],
    deliveryTime: '5–7 business days by road via the Batha border crossing (Dammam/Eastern Province transfers 4–6 days)',
    keyClients: ['Saudi Aramco and SABIC tier contractors', 'NWC water & wastewater operators', 'Riyadh Second Industrial City manufacturers', 'Construction & infrastructure projects', 'Pharmaceutical and analytical laboratories'],
    highlights: [
      'Batha-border road lane, Muscat to Riyadh in 5–7 business days',
      'GCC customs union — no Saudi agent for most industrial grades',
      'Vendor-qualification pack: CoO, Arabic + English SDS, batch CoA, TDS',
      'SASO conformity and SFDA permit guidance advised per product',
      'Drum, IBC and full-container loads on scheduled weekly departures'
    ],
    faqs: [
      {
        question: 'How long does chemical delivery from Oman to Riyadh take?',
        answer: 'Road freight under GCC customs transit runs the Batha border lane from Muscat to Riyadh in 5–7 business days. Consignments routed through Dammam and the Eastern Province clear in 4–6 days, with a 1–2 day onward transfer to Riyadh. Drum, IBC and full-container loads move on scheduled weekly departures, and partial loads can be consolidated for urgent requirements.'
      },
      {
        question: 'Do I need a Saudi import agent to buy chemicals from Oman?',
        answer: 'For most industrial chemical grades, no. Oman and Saudi Arabia share the GCC customs union, so consignments move under customs transit without a separate Saudi import agent. Categories under SASO conformity assessment or SFDA supervision — food-contact, cosmetic, and certain hazardous classifications — do require import permits, and our export team confirms the requirement per product before shipment.'
      },
      {
        question: 'Can you supply chemicals for Saudi Aramco and SABIC contractor requirements?',
        answer: 'We supply Aramco- and SABIC-tier service companies and provide the documentation pack their vendor-qualification workflows ask for: Certificate of Origin attested by the Oman Chamber of Commerce, batch Certificate of Analysis, GHS Safety Data Sheets in Arabic and English, Technical Data Sheets, and ISO 9001:2015 certification. Send us the specification or approved-product list and we will confirm which grades we can match before you register the line item.'
      },
      {
        question: 'Which chemicals do you deliver to Riyadh?',
        answer: 'Water treatment and RO chemicals (PAC, caustic soda, antiscalants, sodium hypochlorite), glycols and solvents, corrosion and scale inhibitors, construction chemicals, food-grade products, and laboratory reagents. Bulk and packed quantities both ship on the Riyadh lane — send your product list and destination district for delivered pricing in SAR or USD.'
      },
      {
        question: 'What payment terms and currencies do you accept for Saudi orders?',
        answer: 'We invoice in SAR, USD, or other major currencies. Terms include advance payment, 30-day net for established accounts, and Letter of Credit for large or bulk orders. Complete export documentation is issued with each shipment for customs clearance at the Saudi point of entry.'
      }
    ],
    metaTitle: 'Chemical Supplier Riyadh, Saudi Arabia | Global Chemicals LLC',
    metaDescription: 'Chemicals delivered to Riyadh from Oman in 5–7 days via the Batha lane. Water treatment, oilfield & lab chemicals with Arabic SDS and CoO. Get a quote.',
    metaKeywords: 'chemical supplier Riyadh, chemicals Riyadh, industrial chemicals Riyadh, chemical supplier Saudi Arabia, water treatment chemicals Riyadh, oilfield chemicals Saudi Arabia, Saudi Aramco chemical supplier, SABIC chemical supplier, chemical exporter Oman Saudi'

  },

  'doha': {
    slug: 'doha',
    city: 'Doha',
    cityArabic: 'الدوحة',
    country: 'Qatar',
    region: 'Doha, Qatar',
    description: 'Global Chemicals LLC supplies industrial and specialty chemicals to Qatar from our Muscat warehouse, with road freight reaching Doha in 3–5 business days and drum, IBC, and full-container loads consolidated on scheduled weekly departures. We serve Qatar\'s industrial map end to end: QatarEnergy contractors and LNG operators in Ras Laffan Industrial City, petrochemical and fertilizer producers in Mesaieed Industrial City (MIC), manufacturers in the Doha Industrial Area and New Industrial Area, water and utility operators, infrastructure contractors, and analytical laboratories. The portfolio spans oilfield production chemicals (corrosion inhibitors, hydrate inhibitors, scale inhibitors, demulsifiers), water treatment and RO chemicals, industrial lubricants, and laboratory reagents. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce, GHS Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and HS-coded commercial invoice, and our team is experienced with Ras Laffan security clearance and QatarEnergy vendor-qualification documentation.',
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
      },
      {
        question: 'Can you deliver chemicals to Mesaieed Industrial City (MIC)?',
        answer: 'Yes. Mesaieed Industrial City\'s petrochemical, fertilizer, and steel producers are regular destinations on our Qatar lane, alongside the Doha Industrial Area and New Industrial Area. We quote FOB Muscat, CIF Hamad Port, or DAP-to-site in QAR or USD, and consolidate drum and IBC orders with full-container loads on scheduled weekly departures.'
      },
      {
        question: 'What payment terms and currencies do you accept for Qatar orders?',
        answer: 'We invoice in QAR, USD, or other major currencies. Terms include advance payment, 30-day net for established accounts, and Letter of Credit for large or bulk orders. Complete export documentation is issued with each shipment for clearance at the Qatari point of entry.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Qatar | Doha & Ras Laffan Supply',
    metaDescription: 'Chemical suppliers in Qatar — Doha & Ras Laffan supply from Oman in 3–5 days. LNG, water treatment, oilfield & lab chemicals. Get a quote.',
    metaKeywords: 'chemical suppliers in Qatar, chemical suppliers in Doha, chemical supplier Qatar, chemicals Doha, industrial chemicals Qatar, water treatment chemicals Qatar, oilfield chemicals Qatar, LNG chemicals Qatar, QatarEnergy chemical supplier, chemical exporter Oman Qatar, Ras Laffan chemicals, Mesaieed chemicals',
    relatedGuide: {
      slug: 'gcc-desalination-water-treatment-chemicals',
      title: 'Desalination & Water Treatment Chemicals Across the GCC',
      blurb: 'A region-wide guide to the antiscalants, biocides, and coagulants used across GCC desalination plants — including Qatar\'s.'
    }
  },

  'kuwait-city': {
    slug: 'kuwait-city',
    city: 'Kuwait City',
    cityArabic: 'مدينة الكويت',
    country: 'Kuwait',
    region: 'Kuwait City, Kuwait',
    description: 'Global Chemicals LLC supplies industrial and specialty chemicals to Kuwait from our Muscat warehouse, moving under GCC customs transit with road freight through Saudi Arabia reaching Kuwait City in 4–6 business days; drum, IBC, and full-container loads consolidate on scheduled weekly departures. We serve Kuwait\'s industrial map end to end: KOC contractors and oilfield service companies in Ahmadi, KNPC refinery supply chains across Mina Abdullah, Mina Al-Ahmadi, and the Al-Zour complex, manufacturers in Shuaiba Industrial Area and Sabhan, desalination and power-plant operators, and analytical laboratories. The portfolio spans refinery and oilfield production chemicals, water treatment and RO chemicals for Kuwait\'s desalination-dependent water system, industrial lubricants, and laboratory reagents. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce, GHS Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and HS-coded commercial invoice, with vendor-qualification documentation support for KOC and KNPC contractor workflows.',
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
      },
      {
        question: 'Do I need a Kuwaiti import agent to buy chemicals from Oman?',
        answer: 'For most industrial chemical grades, no. Oman and Kuwait share the GCC customs union, so consignments move under customs transit without a separate Kuwaiti import agent. Regulated categories — food-contact, cosmetic-grade, and certain hazardous classifications — carry additional conformity or permit requirements, and our export team confirms what applies per product before shipment.'
      },
      {
        question: 'Can you deliver chemicals to Shuaiba, Ahmadi, and the Al-Zour complex?',
        answer: 'Yes. Shuaiba Industrial Area, the Ahmadi oil-sector hub, and the Al-Zour refinery and power complex are regular destinations on our Kuwait lane, alongside Sabhan and the Shuwaikh port area. We quote FOB Muscat, CIF Shuwaikh, or DAP-to-site in KWD or USD, and consolidate drum and IBC orders with full-container loads on scheduled weekly departures.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Kuwait | KNPC & Shuaiba Supply',
    metaDescription: 'Chemical suppliers in Kuwait — import from Oman in 4–6 days. Refinery, water treatment & lab chemicals to Shuaiba, Ahmadi & Al-Zour. Get a quote.',
    metaKeywords: 'chemical suppliers in Kuwait, chemical suppliers in Kuwait City, chemical supplier Kuwait, chemicals Kuwait City, industrial chemicals Kuwait, water treatment chemicals Kuwait, oilfield chemicals Kuwait, KOC chemical supplier, KNPC chemicals, chemical exporter Oman Kuwait, Shuaiba chemicals, Al-Zour chemicals',
    relatedGuide: {
      slug: 'gcc-desalination-water-treatment-chemicals',
      title: 'Desalination & Water Treatment Chemicals Across the GCC',
      blurb: 'Kuwait sources around 90% of its potable water from desalination — see the full regional guide to the chemistry behind it.'
    }
  },

  'bahrain': {
    slug: 'bahrain',
    city: 'Bahrain',
    cityArabic: 'البحرين',
    country: 'Bahrain',
    region: 'Manama, Kingdom of Bahrain',
    description: 'Global Chemicals LLC supplies industrial and specialty chemicals to the Kingdom of Bahrain from our Muscat warehouse, moving under GCC customs transit with road freight via Saudi Arabia and the King Fahd Causeway reaching Manama in 3–5 business days; drum, IBC, and full-container loads consolidate on scheduled weekly departures. We serve Bahrain\'s industrial map end to end: ALBA (Aluminium Bahrain) supply chains, Bapco refining contractors in Sitra and Awali, manufacturers in the Hidd and Salman industrial areas and the Bahrain International Investment Park (BIIP), desalination and utility operators, and pharmaceutical and analytical laboratories. The portfolio spans aluminum process chemicals including caustic soda, refinery and water treatment chemicals, industrial lubricants, and laboratory reagents. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce — GCC preferential origin applied where eligible to reduce import duty — plus GHS Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and HS-coded commercial invoice.',
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
      },
      {
        question: 'Do I need a Bahraini import agent to buy chemicals from Oman?',
        answer: 'For most industrial chemical grades, no. Oman and Bahrain share the GCC customs union, so consignments move under customs transit without a separate Bahraini import agent, and GCC preferential origin reduces import duty on eligible products. Regulated categories — food-contact, cosmetic-grade, and certain hazardous classifications — carry additional conformity or permit requirements, confirmed per product before shipment.'
      },
      {
        question: 'Can you deliver chemicals to Hidd, Sitra, and the Bahrain International Investment Park?',
        answer: 'Yes. The Hidd and Salman industrial areas, Sitra\'s refining and petrochemical cluster, and BIIP manufacturers are regular destinations on our Bahrain lane. We quote FOB Muscat, CIF Khalifa Bin Salman Port, or DAP-to-site in BHD or USD, and consolidate drum and IBC orders with full-container loads on scheduled weekly departures.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Bahrain | ALBA & BAPCO Supply',
    metaDescription: 'Chemical suppliers in Bahrain — import from Oman in 3–5 days via Saudi. Aluminium, refinery & water treatment chemicals to Hidd & Sitra. Get a quote.',
    metaKeywords: 'chemical suppliers in Bahrain, chemical supplier Bahrain, chemicals Manama, industrial chemicals Bahrain, water treatment chemicals Bahrain, ALBA chemical supplier, BAPCO chemicals, chemical exporter Oman Bahrain, Hidd industrial chemicals, Sitra chemicals, BIIP chemicals',
    relatedGuide: {
      slug: 'gcc-desalination-water-treatment-chemicals',
      title: 'Desalination & Water Treatment Chemicals Across the GCC',
      blurb: 'See the full regional guide to the antiscalants, biocides, and corrosion inhibitors behind Gulf desalination and industrial water treatment.'
    }
  },

  // ── Additional UAE Cities ──────────────────────────────────────────────────

  'fujairah': {
    slug: 'fujairah',
    city: 'Fujairah',
    cityArabic: 'الفجيرة',
    country: 'UAE',
    region: 'Fujairah, United Arab Emirates',
    description: 'Global Chemicals LLC is ideally positioned to supply Fujairah\'s oil bunkering, maritime, and industrial sectors. Fujairah is the UAE emirate that shares a direct land border with Oman — making Muscat-to-Fujairah road freight the shortest and fastest of all GCC export routes, with same-day delivery possible. We supply water treatment chemicals, maritime chemicals, industrial lubricants, and specialty chemicals to Port of Fujairah operators, oil storage terminals, FFZA companies, and construction projects throughout the emirate.',
    industries: ['Oil Bunkering & Maritime', 'Oil Storage Terminals', 'Construction & Infrastructure', 'Fishing & Aquaculture', 'Manufacturing', 'Fujairah Free Zone (FFZA)', 'Agriculture'],
    deliveryTime: '2–4 hours by road from Muscat — fastest of all GCC destinations',
    keyClients: ['Port of Fujairah operators', 'ENOC oil storage terminals', 'FFZA (Fujairah Free Zone) companies', 'Construction project sites', 'Maritime service companies'],
    highlights: [
      'Fastest GCC delivery — Oman shares border with Fujairah',
      'Same-day delivery possible for orders placed before noon',
      'Oil bunkering & maritime chemical expertise',
      'Full export documentation for UAE customs',
      'Competitive pricing for Fujairah industry'
    ],
    faqs: [
      {
        question: 'How fast can Global Chemicals LLC deliver chemicals to Fujairah?',
        answer: 'Fujairah shares a land border with Oman via the Dibba/Khatmat Malaha crossing. Road freight from our Muscat warehouse to Fujairah typically takes 2–4 hours — making same-day delivery possible for orders placed before midday. This is the fastest GCC export route we operate, shorter than any other UAE, Saudi, Qatar, Kuwait, or Bahrain delivery.'
      },
      {
        question: 'Do you supply chemicals for oil bunkering operations at Port of Fujairah?',
        answer: 'Yes. The Port of Fujairah is the world\'s 3rd largest bunkering hub after Rotterdam and Singapore. We supply chemicals for maritime and bunkering operations including water treatment chemicals, corrosion inhibitors, cleaning chemicals, and specialty marine chemicals. Contact our team at sales@gcoman.com for bunkering sector product availability and pricing.'
      },
      {
        question: 'Can you supply chemicals to Fujairah Free Zone (FFZA) companies?',
        answer: 'Yes, we export chemicals to FFZA-registered companies and the broader Fujairah industrial area. We provide complete UAE customs documentation: Certificate of Origin, Certificate of Analysis, SDS/MSDS, and commercial invoices. Our proximity means we can fulfil urgent orders the same day.'
      }
    ],
    metaTitle: 'Chemical Supplier Fujairah UAE | Same-Day Delivery from Oman | Global Chemicals LLC',
    metaDescription: 'Chemical supplier to Fujairah, UAE. Same-day delivery possible — Oman shares border with Fujairah. Oil bunkering, maritime & industrial chemicals. ISO 9001 certified. Get a quote.',
    metaKeywords: 'chemical supplier Fujairah, chemicals Fujairah UAE, chemical exporter Oman Fujairah, oil bunkering chemicals Fujairah, maritime chemicals Fujairah, Fujairah Free Zone chemicals FFZA, industrial chemicals Fujairah, water treatment chemicals Fujairah, same day chemical delivery Fujairah from Oman'
  },

  'sharjah': {
    slug: 'sharjah',
    city: 'Sharjah',
    cityArabic: 'الشارقة',
    country: 'UAE',
    region: 'Sharjah, United Arab Emirates',
    description: 'Global Chemicals LLC supplies industrial and specialty chemicals to Sharjah from our Muscat warehouse, moving under GCC customs transit so most industrial grades clear without a separate UAE import agent. Road freight reaches Sharjah in 3–5 business days via the Hatta and Al Ain border lanes, with drum, IBC, and full-container loads consolidated on scheduled weekly departures. Sharjah is one of the GCC\'s densest industrial and chemical-trading hubs, and we serve it district by district: Hamriyah Free Zone (HFZA) — the region\'s largest chemical storage and trading zone, SAIF Zone at Sharjah International Airport, Sharjah Industrial Areas 1–13, Al Sajaa Industrial Area, and the University City research corridor. Buyers include manufacturers, chemical traders and re-exporters, construction materials producers, food processors, and university and QC laboratories. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce, GHS Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and HS-coded commercial invoice, with conformity and permit guidance for regulated categories advised per product before shipment.',
    industries: ['Manufacturing & Industry', 'Chemicals Trading (Hamriyah FZ)', 'Construction Materials', 'Food Processing', 'Logistics & Warehousing', 'Education & Research', 'Pharmaceuticals'],
    deliveryTime: '3–5 business days to Sharjah (road freight)',
    keyClients: ['Hamriyah Free Zone (HFZA) companies', 'SAIF Zone businesses', 'Sharjah Industrial Area manufacturers', 'University & research labs', 'Food processing facilities'],
    highlights: [
      'Hamriyah Free Zone & SAIF Zone supply expertise',
      'Full UAE free zone import documentation provided',
      '1,000+ chemicals in stock for immediate export',
      'ISO 9001 certified quality assurance',
      'Competitive export pricing in AED/USD'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC supply chemicals to Sharjah and its free zones?',
        answer: 'Yes, we export chemicals to Sharjah including companies in Hamriyah Free Zone (HFZA), SAIF Zone, Sharjah Industrial Area, and surrounding business districts. Our range covers water treatment chemicals, industrial lubricants, laboratory reagents, food-grade chemicals, and oilfield chemicals. Standard delivery from Muscat takes 3–5 business days via road freight.'
      },
      {
        question: 'Can you supply chemicals to Hamriyah Free Zone (HFZA) in Sharjah?',
        answer: 'Yes, we supply chemicals to HFZA-registered companies. Hamriyah Free Zone is one of the GCC\'s largest chemical trading and storage hubs with over 6,500 registered companies. We provide all required HFZA import documentation: Certificate of Origin, Certificate of Analysis, SDS/MSDS, and commercial invoices in the formats required for free zone customs clearance.'
      },
      {
        question: 'What laboratory chemicals can you supply to Sharjah universities and research institutes?',
        answer: 'We supply AR grade laboratory chemicals, HPLC-grade solvents, buffer solutions, indicators, and specialty analytical chemicals to universities, research institutions, and QC labs in Sharjah. We stock 50+ standard laboratory chemicals and can source specialty items on request with full CoA and SDS documentation.'
      },
      {
        question: 'Do I need a UAE import agent to buy chemicals from Oman for Sharjah?',
        answer: 'For most industrial chemical grades, no. Oman and the UAE share the GCC customs union, so consignments move under customs transit without a separate UAE import agent. Regulated categories — food-contact, cosmetic-grade, and certain hazardous classifications — carry additional UAE conformity or permit requirements, and our export team confirms what applies per product before shipment.'
      },
      {
        question: 'Can you supply chemical traders and re-exporters in Hamriyah Free Zone?',
        answer: 'Yes. Many HFZA companies buy from us in bulk — drums, IBCs, or full container loads — for onward regional trading and re-export. We quote FOB Muscat or DAP Hamriyah in AED or USD, supply GCC preferential-origin documentation where eligible, and can ship with neutral or private labelling arrangements for trading houses on request.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Sharjah | HFZA & SAIF Zone Supply',
    metaDescription: 'Chemical suppliers in Sharjah — import from Oman in 3–5 days. HFZA, SAIF Zone & Industrial Area supply. Water treatment & lab chemicals. Get a quote.',
    metaKeywords: 'chemical suppliers in Sharjah, chemical supplier Sharjah, chemicals Sharjah UAE, Hamriyah Free Zone chemicals HFZA, SAIF Zone chemicals Sharjah, industrial chemicals Sharjah, water treatment chemicals Sharjah, laboratory chemicals Sharjah, chemical exporter Oman Sharjah, chemical distributor Sharjah UAE'
  },

  'ras-al-khaimah': {
    slug: 'ras-al-khaimah',
    city: 'Ras Al Khaimah',
    cityArabic: 'رأس الخيمة',
    country: 'UAE',
    region: 'Ras Al Khaimah, United Arab Emirates',
    description: 'Global Chemicals LLC exports industrial and specialty chemicals to Ras Al Khaimah (RAK), UAE\'s northernmost emirate and a fast-growing manufacturing hub. Home to RAKEZ with 14,000+ registered businesses, RAK Ceramics (one of the world\'s largest ceramics manufacturers), Stevin Rock quarrying operations, and RAK Ports, the emirate has significant and growing industrial chemical demand across construction, ceramics, and manufacturing sectors.',
    industries: ['Ceramics & Building Materials (RAK Ceramics)', 'Quarrying & Mining (Stevin Rock)', 'Construction & Infrastructure', 'Manufacturing (RAKEZ)', 'Food Processing', 'Pharmaceuticals', 'Free Zone Trading'],
    deliveryTime: '3–5 business days to Ras Al Khaimah (road freight)',
    keyClients: ['RAK Ceramics supply chain', 'RAKEZ registered companies', 'Stevin Rock quarrying operations', 'RAK construction projects', 'RAK Ports industrial customers'],
    highlights: [
      'RAK Ceramics sector chemical expertise',
      'RAKEZ free zone import documentation provided',
      'Construction chemicals for RAK\'s growing sector',
      'Competitive export pricing for RAK manufacturers',
      'ISO 9001 certified supply with full documentation'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC supply chemicals to Ras Al Khaimah (RAK)?',
        answer: 'Yes, we export industrial and specialty chemicals to Ras Al Khaimah including RAKEZ-registered companies, RAK industrial zone manufacturers, and project sites throughout the emirate. Our range covers construction chemicals, water treatment chemicals, industrial lubricants, and laboratory reagents. Standard delivery from Muscat is 3–5 business days via road freight.'
      },
      {
        question: 'What chemicals do you supply for the ceramics industry in RAK?',
        answer: 'For RAK\'s ceramics and building materials sector including RAK Ceramics supply chains, we supply process chemicals, industrial cleaning agents, water treatment chemicals, and specialty industrial chemicals. Our technical team can advise on specific requirements for ceramic manufacturing, glazing, and surface treatment applications in RAK.'
      },
      {
        question: 'Can you supply chemicals to RAKEZ (Ras Al Khaimah Economic Zone) companies?',
        answer: 'Yes, we supply chemicals to businesses in RAKEZ\'s Al Hamra, Al Ghail, and other zones. We provide all required import documentation: Certificate of Origin, Safety Data Sheet, Certificate of Analysis, packing list, and commercial invoice in the format required for RAKEZ customs clearance.'
      }
    ],
    metaTitle: 'Chemical Supplier Ras Al Khaimah | RAKEZ Industrial Chemicals UAE | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Ras Al Khaimah (RAK), UAE. RAKEZ, RAK Ceramics, construction & industrial chemicals. ISO 9001 certified. 3-5 day delivery from Muscat. Get a quote.',
    metaKeywords: 'chemical supplier Ras Al Khaimah, chemicals RAK UAE, RAKEZ chemical supplier, RAK Ceramics chemicals, construction chemicals RAK, industrial chemicals Ras Al Khaimah, water treatment RAK UAE, chemical exporter Oman RAK, manufacturing chemicals Ras Al Khaimah UAE'
  },

  // ── Additional KSA Cities ──────────────────────────────────────────────────

  'jeddah': {
    slug: 'jeddah',
    city: 'Jeddah',
    cityArabic: 'جدة',
    country: 'Saudi Arabia',
    region: 'Makkah Province, Saudi Arabia',
    description: 'Global Chemicals LLC exports specialty and industrial chemicals to Jeddah, Saudi Arabia\'s second-largest city and gateway to the Red Sea. We serve Jeddah Industrial City, King Abdullah Economic City (KAEC), the pharmaceutical and healthcare sector, food and beverage manufacturers, and construction projects across the Makkah and Madinah regions with a comprehensive portfolio of water treatment, industrial, food-grade, and oilfield chemicals.',
    industries: ['Construction & Infrastructure', 'Pharmaceuticals & Healthcare', 'Food & Beverage Processing', 'Water Treatment & Desalination', 'Hospitality (Hajj/Umrah)', 'Manufacturing', 'Port Logistics'],
    deliveryTime: '5–7 business days to Jeddah (road freight) or 4–6 days sea freight via Port of Sohar',
    keyClients: ['Jeddah Industrial City manufacturers', 'KAEC companies', 'Pharmaceutical labs & hospitals', 'Food processing facilities', 'Hajj/Umrah hospitality groups'],
    highlights: [
      'Jeddah Industrial City & KAEC supply expertise',
      'Pharmaceutical and food-grade chemicals stocked',
      'Full Saudi customs & SASO documentation support',
      'Arabic SDS and technical documentation provided',
      'Sea freight option via Port of Sohar for bulk orders'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC export chemicals to Jeddah?',
        answer: 'Yes, we export chemicals to Jeddah including King Abdullah Economic City (KAEC), Jeddah Industrial City, and project sites across Makkah Province. Our range covers water treatment chemicals, food-grade chemicals, pharmaceutical-grade reagents, construction chemicals, and industrial lubricants. Road freight from Muscat takes 5–7 business days; sea freight via Sohar Port takes 4–6 days.'
      },
      {
        question: 'Can you supply food-grade and pharmaceutical chemicals for Jeddah manufacturers?',
        answer: 'Yes, we supply NSF and food-grade certified chemicals for food and beverage processing and pharmaceutical-grade reagents for healthcare and manufacturing sectors. All food-grade products come with appropriate certifications including Halal certification where required. Safety Data Sheets are provided in both English and Arabic.'
      },
      {
        question: 'What documentation do you provide for chemical imports into Jeddah?',
        answer: 'We provide complete Saudi customs documentation: Certificate of Origin attested by Oman Chamber of Commerce, Safety Data Sheet in Arabic and English, Certificate of Analysis, Technical Data Sheet, and commercial invoice with HS codes. For products requiring SASO conformity or SFDA approval, our team provides guidance on the Saudi import permit process.'
      }
    ],
    metaTitle: 'Chemical Supplier Jeddah | Industrial Chemicals Saudi Arabia | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Jeddah, Saudi Arabia. Jeddah Industrial City, KAEC, pharma & food-grade chemicals. ISO 9001 certified. Full Saudi customs documentation. Get a quote.',
    metaKeywords: 'chemical supplier Jeddah, chemicals Jeddah Saudi Arabia, industrial chemicals Jeddah, food grade chemicals Jeddah, pharmaceutical chemicals Jeddah, KAEC chemical supplier, Jeddah Industrial City chemicals, water treatment Jeddah, chemical exporter Oman Jeddah KSA'
  },

  // ── Iraq ──────────────────────────────────────────────────────────────────

  'baghdad': {
    slug: 'baghdad',
    city: 'Baghdad',
    cityArabic: 'بغداد',
    country: 'Iraq',
    region: 'Baghdad & Southern Iraq',
    description: 'Global Chemicals LLC exports industrial and specialty chemicals to Iraq — one of the Middle East\'s largest emerging chemical markets driven by oil sector rehabilitation, infrastructure rebuilding, and growing manufacturing activity. We supply oilfield chemicals, water treatment chemicals, industrial lubricants, and construction chemicals to Baghdad, Basra, Kirkuk, and other major Iraqi cities. Iraq\'s oil production exceeds 4 million barrels per day, generating significant demand for production chemicals, corrosion inhibitors, demulsifiers, H2S scavengers, and drilling fluids across fields operated by BP, Shell, Lukoil, CNPC, and national oil companies.',
    industries: ['Oil & Gas (MoO, BP, Shell, Lukoil, CNPC)', 'Water Treatment & Infrastructure', 'Construction & Reconstruction', 'Manufacturing', 'Agriculture', 'Pharmaceutical & Healthcare', 'Power Generation'],
    deliveryTime: '7–10 business days to Baghdad / Basra (air freight 3–5 days for urgent)',
    keyClients: ['Iraq national oil company contractors', 'Basra Oil Company supply chains', 'Water infrastructure project contractors', 'Baghdad construction projects', 'Industrial facilities across Iraq'],
    highlights: [
      'Full oilfield chemical portfolio for Iraq upstream operations',
      'Arabic SDS and documentation provided',
      'Experience with Iraq customs and import regulations',
      'Both road freight and air freight options available',
      'ISO 9001 certified quality with full CoA documentation'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC export chemicals to Iraq?',
        answer: 'Yes, we export industrial and specialty chemicals to Iraq including Baghdad, Basra, Kirkuk, Erbil, and Mosul. Our portfolio covers oilfield chemicals (corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers), water treatment chemicals, industrial lubricants, and construction chemicals. Standard delivery is 7–10 business days; air freight is available for urgent requirements in 3–5 days.'
      },
      {
        question: 'What oilfield chemicals can you supply for Iraq operations?',
        answer: 'Iraq\'s oil fields are among the most active in the world, with production from Basra, Kirkuk, West Qurna, Rumaila, and Majnoon fields. We supply corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers, biocides, drilling fluid additives, completion fluids, and production chemicals compatible with Iraq\'s high-temperature, high-salinity reservoir conditions. Full Technical Data Sheets and Safety Data Sheets in Arabic and English are provided.'
      },
      {
        question: 'What documentation do you provide for chemical exports to Iraq?',
        answer: 'We provide all required export documentation for Iraqi customs: Certificate of Origin attested by Oman Chamber of Commerce, Certificate of Analysis, Safety Data Sheet in Arabic and English, Technical Data Sheet, commercial invoice, packing list, and Bill of Lading. Our team has experience navigating Iraqi import requirements and can advise on specific documentation needs for your sector.'
      }
    ],
    metaTitle: 'Chemical Supplier Iraq | Baghdad Basra Oil & Industrial Chemicals | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Iraq — Baghdad, Basra, Kirkuk. Oilfield chemicals, water treatment, industrial chemicals for Iraq oil sector. ISO 9001. Arabic documentation. Get a quote.',
    metaKeywords: 'chemical supplier Iraq, chemicals Baghdad, chemicals Basra Iraq, oilfield chemicals Iraq, industrial chemicals Iraq, water treatment chemicals Iraq, chemical exporter Oman Iraq, Iraq oil sector chemicals, corrosion inhibitor Iraq, chemical supplier Baghdad'
  },

  // ── Jordan ─────────────────────────────────────────────────────────────────

  'amman': {
    slug: 'amman',
    city: 'Amman',
    cityArabic: 'عمّان',
    country: 'Jordan',
    region: 'Amman & Northern Jordan',
    description: 'Global Chemicals LLC exports specialty and industrial chemicals to Jordan, a key chemical distribution and manufacturing hub for the broader Levant region. We supply water treatment chemicals, pharmaceutical-grade chemicals, agricultural chemicals, food-grade chemicals, and industrial chemicals to Amman, Zarqa Industrial City, Aqaba (Jordan\'s only seaport and free zone), and the Dead Sea industrial area. Jordan hosts a significant phosphate and potash mining industry (Jordan\'s natural resources), a growing pharmaceutical sector, and a large water treatment network — all sectors with sustained chemical demand.',
    industries: ['Phosphate & Potash Mining', 'Pharmaceuticals & Healthcare', 'Water Treatment', 'Food & Beverage', 'Construction', 'Agriculture', 'Aqaba Free Zone (ASEZA)'],
    deliveryTime: '5–8 business days to Amman / Zarqa (road freight via Saudi Arabia)',
    keyClients: ['Jordan phosphate sector suppliers', 'Zarqa Industrial City manufacturers', 'Pharmaceutical companies in Amman', 'Water Authority of Jordan contractors', 'Aqaba Special Economic Zone companies'],
    highlights: [
      'Pharmaceutical & food-grade chemical expertise',
      'Phosphate and potash industry chemical supply',
      'Full Arabic documentation and SDS provided',
      'Aqaba Free Zone and direct import support',
      'ISO 9001 certified quality assurance'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC export chemicals to Jordan?',
        answer: 'Yes, we export specialty and industrial chemicals to Jordan including Amman, Zarqa, Aqaba, and the Dead Sea industrial area. Our portfolio covers water treatment chemicals, pharmaceutical-grade reagents, agricultural chemicals, food-grade chemicals, and industrial chemicals. Standard delivery via road freight through Saudi Arabia takes 5–8 business days.'
      },
      {
        question: 'Can you supply chemicals for Jordan\'s pharmaceutical sector?',
        answer: 'Yes. Jordan is one of the largest pharmaceutical exporters in the Arab world, with over 100 pharmaceutical manufacturers based primarily in Amman and Zarqa. We supply pharmaceutical-grade reagents, HPLC solvents, AR grade chemicals, and specialty analytical chemicals with full Certificate of Analysis, GMP-compatible documentation, and Safety Data Sheets in Arabic and English.'
      },
      {
        question: 'Do you supply water treatment chemicals to Jordan?',
        answer: 'Yes. Jordan faces acute water scarcity — it is among the world\'s most water-stressed countries — making water treatment chemicals essential infrastructure inputs. We supply PAC, chlorine, antiscalants, biocides, corrosion inhibitors, and specialty water treatment chemicals to support Jordan\'s water treatment plants and distribution networks. All products come with full technical documentation.'
      }
    ],
    metaTitle: 'Chemical Supplier Jordan | Amman Pharma Water Treatment Chemicals | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Jordan — Amman, Zarqa, Aqaba. Pharmaceutical, water treatment, agricultural & industrial chemicals. ISO 9001 certified. Arabic documentation. Get a quote.',
    metaKeywords: 'chemical supplier Jordan, chemicals Amman Jordan, pharmaceutical chemicals Jordan, water treatment chemicals Jordan, industrial chemicals Amman, agricultural chemicals Jordan, chemical exporter Oman Jordan, Aqaba chemicals, Zarqa Industrial City chemicals, chemical supplier Middle East Jordan'
  },

  // ── Egypt ──────────────────────────────────────────────────────────────────

  'cairo': {
    slug: 'cairo',
    city: 'Cairo',
    cityArabic: 'القاهرة',
    country: 'Egypt',
    region: 'Cairo, Alexandria & Greater Egypt',
    description: 'Global Chemicals LLC exports specialty and industrial chemicals to Egypt — the Arab world\'s most populous country and largest non-GCC chemical market. Egypt\'s rapidly expanding industrial base includes petrochemicals, textiles, food processing, pharmaceuticals, and construction — all sectors with significant chemical demand. We supply water treatment chemicals, industrial lubricants, pharmaceutical-grade reagents, food-grade chemicals, agricultural chemicals, and construction chemicals to Cairo, Alexandria (Egypt\'s chemical and industrial hub), Suez Canal Economic Zone, and across Egypt\'s major industrial and agricultural regions.',
    industries: ['Oil & Gas (EGPC, ENI, BP Egypt)', 'Petrochemicals', 'Textiles & Dyeing', 'Food & Beverage Processing', 'Pharmaceuticals', 'Construction & Cement', 'Agriculture (Nile Delta, Sinai)'],
    deliveryTime: '7–12 business days to Cairo / Alexandria (sea freight via Alexandria Port)',
    keyClients: ['Egyptian pharmaceutical manufacturers', 'Alexandria industrial zone companies', 'Suez Canal Economic Zone businesses', 'Egyptian food processing industry', 'Cairo construction project operators'],
    highlights: [
      'Largest non-GCC Middle East market coverage',
      'Sea freight via Alexandria and Damietta ports',
      'Full Arabic SDS and technical documentation',
      'Pharmaceutical & food-grade chemical portfolio',
      'ISO 9001 certified quality with CoA and SDS'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC export chemicals to Egypt?',
        answer: 'Yes, we export industrial and specialty chemicals to Egypt including Cairo, Alexandria, Port Said, Suez, and industrial zones across the Nile Delta and Upper Egypt. Our portfolio covers water treatment chemicals, pharmaceutical-grade reagents, food-grade chemicals, agricultural chemicals, industrial lubricants, and construction chemicals. Standard sea freight delivery via Alexandria Port takes 7–12 business days from Muscat.'
      },
      {
        question: 'What chemicals can you supply for Egypt\'s pharmaceutical and food industry?',
        answer: 'Egypt has over 150 pharmaceutical manufacturers and a large food processing sector. We supply pharmaceutical-grade solvents, AR grade analytical chemicals, HPLC-grade reagents, food-grade additives, and processing chemicals with full GMP-compatible documentation. All food-grade products are supplied with Halal certificates where applicable, and Safety Data Sheets are provided in Arabic and English.'
      },
      {
        question: 'How do you ship chemicals to Egypt from Oman?',
        answer: 'We ship chemicals to Egypt primarily via sea freight from Port of Sohar or Muscat Port to Alexandria Port or Damietta Port, taking 7–12 business days. For urgent requirements, air freight via Cairo International Airport is available with 3–5 day delivery. We handle all required export documentation including Certificate of Origin attested by Oman Chamber of Commerce, Arabic SDS, Certificate of Analysis, and Egypt Customs-compliant invoicing.'
      }
    ],
    metaTitle: 'Chemical Supplier Egypt | Cairo Alexandria Industrial Chemicals | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Egypt — Cairo, Alexandria, Suez. Pharma, food-grade, water treatment & industrial chemicals. ISO 9001 certified. Arabic documentation. Get a quote.',
    metaKeywords: 'chemical supplier Egypt, chemicals Cairo Egypt, chemicals Alexandria Egypt, pharmaceutical chemicals Egypt, water treatment chemicals Egypt, industrial chemicals Egypt, chemical exporter Oman Egypt, food grade chemicals Egypt, agricultural chemicals Egypt, chemical supplier Middle East Egypt'
  },

  'dammam': {
    slug: 'dammam',
    city: 'Dammam',
    cityArabic: 'الدمام',
    country: 'Saudi Arabia',
    region: 'Eastern Province, Saudi Arabia',
    description: 'Global Chemicals LLC serves Saudi Arabia\'s Eastern Province — the Kingdom\'s oil heartland — with industrial and specialty chemical exports. Dammam, Al Khobar, and nearby Dhahran (home to Saudi Aramco\'s global headquarters) and Jubail Industrial City represent the highest concentration of oil & gas chemical demand in the region. We supply oilfield chemicals, water treatment chemicals, industrial lubricants, and laboratory reagents to Aramco contractors, SABIC suppliers, and industrial operations across the Eastern Province.',
    industries: ['Oil & Gas (Saudi Aramco)', 'Refining & Petrochemicals (SABIC)', 'Water Treatment & Desalination', 'Manufacturing', 'Steel (Hadeed, SABIC)', 'Utilities & Power', 'Construction'],
    deliveryTime: '4–6 business days to Dammam / Eastern Province (road freight)',
    keyClients: ['Saudi Aramco contractors (Dhahran)', 'SABIC industrial facilities', 'Jubail Industrial City suppliers', 'Eastern Province utility companies', 'Al Khobar construction projects'],
    highlights: [
      'Saudi Aramco supply chain documentation expertise',
      'Full oilfield chemical portfolio for upstream & downstream',
      'Full Arabic technical documentation provided',
      'Jubail Industrial City supply capability',
      'ISO 9001 and JSRS certified quality assurance'
    ],
    faqs: [
      {
        question: 'Do you supply chemicals to Dammam and the Eastern Province?',
        answer: 'Yes, we export industrial and oilfield chemicals to Saudi Arabia\'s Eastern Province including Dammam, Al Khobar, Dhahran, and nearby Jubail Industrial City. Our oilfield portfolio includes corrosion inhibitors, scale inhibitors, demulsifiers, H2S scavengers, and production chemicals suited for Aramco-operated facilities. Standard delivery time from Muscat is 4–6 business days.'
      },
      {
        question: 'Can your chemicals be used by Saudi Aramco contractors?',
        answer: 'Yes, we provide chemicals and full documentation packages suitable for Saudi Aramco contractor vendor qualification including ISO 9001:2015 certificates, batch-specific Certificate of Analysis, Safety Data Sheet in English and Arabic, Technical Data Sheets, and Certificate of Origin. We have experience supporting Aramco contractor supply chain requirements.'
      },
      {
        question: 'Do you supply chemicals to Jubail Industrial City?',
        answer: 'Yes, Jubail Industrial City — one of the world\'s largest industrial zones — is within our Eastern Province supply territory. We export chemicals to SABIC contractors, petrochemical facilities, and other Jubail industrial operators. Water treatment chemicals, industrial lubricants, and specialty oilfield chemicals are among our most requested products for the Jubail sector.'
      }
    ],
    metaTitle: 'Chemical Supplier Dammam | Eastern Province KSA | Aramco Contractors | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Dammam & Eastern Province, KSA. Saudi Aramco contractors, SABIC, Jubail Industrial City. Oilfield & water treatment chemicals. ISO 9001. Get a quote.',
    metaKeywords: 'chemical supplier Dammam, chemicals Eastern Province Saudi Arabia, Saudi Aramco chemical supplier, oilfield chemicals Dammam, industrial chemicals Eastern Province KSA, Jubail Industrial City chemicals, SABIC chemical supplier, chemical exporter Oman Dammam, Al Khobar chemicals Saudi Arabia',
    relatedGuide: {
      slug: 'gcc-desalination-water-treatment-chemicals',
      title: 'Desalination & Water Treatment Chemicals Across the GCC',
      blurb: 'Marafiq\'s Jubail plant alone processes 800,000 m³/day — see the full regional guide to Gulf desalination water treatment chemistry.'
    }
  },

  'jubail': {
    slug: 'jubail',
    city: 'Jubail',
    cityArabic: 'الجبيل',
    country: 'Saudi Arabia',
    region: 'Eastern Province, Saudi Arabia',
    description: 'Global Chemicals LLC supplies water treatment and process chemicals to Jubail Industrial City — one of the world\'s largest industrial complexes, with 700+ factories including 13 of SABIC\'s Saudi plants, Sadara Chemical, Saudi Kayan, Petrokemya, and SATORP\'s refinery. Jubail\'s scale runs on desalinated water: Marafiq\'s Jubail IWPP alone processes 800,000 m³/day for cooling towers and boiler feedwater across the complex. We supply antiscalants, membrane cleaners, cooling-tower biocides, corrosion inhibitors, and boiler-water treatment chemicals suited to Jubail\'s petrochemical and desalination-scale water treatment demand.',
    industries: ['Petrochemicals (SABIC, Sadara, Saudi Kayan, Petrokemya)', 'Refining (SATORP)', 'Desalination & Water Treatment (Marafiq)', 'Power Generation', 'Industrial Manufacturing'],
    deliveryTime: '4–6 business days to Jubail Industrial City (road freight via Dammam)',
    keyClients: ['SABIC plant contractors', 'Sadara Chemical suppliers', 'Saudi Kayan & Petrokemya contractors', 'SATORP-affiliated operators', 'Marafiq water treatment operators'],
    highlights: [
      'RO membrane antiscalants & cleaners for desalination-scale water treatment',
      'Cooling-tower biocides and corrosion inhibitors for petrochemical plants',
      'Boiler-water treatment chemistry',
      'Full Arabic technical documentation provided',
      'ISO 9001 and JSRS certified quality assurance'
    ],
    faqs: [
      {
        question: 'Do you supply chemicals to Jubail Industrial City?',
        answer: 'Yes, we export water treatment and process chemicals to Jubail Industrial City, one of the world\'s largest petrochemical hubs. Our portfolio includes RO membrane antiscalants and cleaners, cooling-tower biocides, corrosion inhibitors, and boiler-water treatment chemicals suited to Jubail\'s SABIC, Sadara, Saudi Kayan, and Petrokemya plants. Standard delivery from Muscat is 4–6 business days via road freight through Dammam.'
      },
      {
        question: 'Can you supply chemicals for desalination and water treatment plants in Jubail?',
        answer: 'Yes, water treatment is our strongest category match to Jubail\'s demand — Marafiq\'s Jubail IWPP processes 800,000 m³/day of desalinated water feeding the complex\'s cooling towers and boiler systems. We supply antiscalants, biocides, and corrosion inhibitors specified for large-scale RO and thermal desalination water treatment.'
      },
      {
        question: 'What documentation do you provide for chemical imports into Jubail?',
        answer: 'We provide complete documentation for Saudi customs and vendor qualification: Certificate of Origin attested by Oman Chamber of Commerce, Safety Data Sheet in English and Arabic, Certificate of Analysis, Technical Data Sheet, and ISO 9001:2015 certification. For SASO-regulated product lines we support the certification process directly.'
      }
    ],
    metaTitle: 'Chemical Supplier Jubail Industrial City | Water Treatment & Petrochemical Chemicals | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Jubail Industrial City, Saudi Arabia. Antiscalants, cooling-tower biocides, corrosion inhibitors for SABIC, Sadara, Saudi Kayan & Marafiq desalination. ISO 9001. Get a quote.',
    metaKeywords: 'chemical supplier Jubail, Jubail Industrial City chemicals, water treatment chemicals Jubail, antiscalant Jubail, SABIC chemical supplier, Sadara Chemical supplier, Marafiq desalination chemicals, cooling tower biocide Jubail, corrosion inhibitor Jubail Saudi Arabia, chemical exporter Oman Jubail',
    relatedGuide: {
      slug: 'gcc-desalination-water-treatment-chemicals',
      title: 'Desalination & Water Treatment Chemicals Across the GCC',
      blurb: 'The full technical guide to the antiscalants, biocides, and coagulants behind Marafiq\'s desalination-scale water treatment and every other major Gulf plant.'
    }
  },

  'yanbu': {
    slug: 'yanbu',
    city: 'Yanbu',
    cityArabic: 'ينبع',
    country: 'Saudi Arabia',
    region: 'Al Madinah Province, Saudi Arabia',
    description: 'Global Chemicals LLC exports industrial and process chemicals to Yanbu, Saudi Arabia\'s Red Sea petrochemical and export gateway. Yanbu is home to YASREF (the 400,000 bpd Aramco–Sinopec refinery), YANSAB (SABIC\'s 4-million-tonne-per-year petrochemical complex), and a newly announced Aramco–Sinopec integrated petrochemical expansion. We supply oilfield chemicals, water treatment chemicals, industrial lubricants, and laboratory reagents to contractors and suppliers serving Yanbu\'s refining and petrochemical operations.',
    industries: ['Refining (YASREF)', 'Petrochemicals (YANSAB, SABIC)', 'Export Logistics & Port Operations', 'Industrial Manufacturing'],
    deliveryTime: '6–8 business days to Yanbu (road freight) or 5–7 days sea freight via Port of Sohar/Duqm',
    keyClients: ['YASREF refinery contractors', 'YANSAB & SABIC petrochemical suppliers', 'Yanbu port logistics operators', 'Industrial manufacturing contractors'],
    highlights: [
      'Chemicals suited to refining and petrochemical process demand',
      'Sea freight option via Port of Sohar/Duqm for bulk orders',
      'Full Saudi customs & SASO documentation support',
      'Arabic SDS and technical documentation provided',
      'ISO 9001 and JSRS certified quality assurance'
    ],
    faqs: [
      {
        question: 'Does Global Chemicals LLC export chemicals to Yanbu?',
        answer: 'Yes, we export industrial and process chemicals to Yanbu, including contractors and suppliers serving YASREF\'s refinery and YANSAB\'s petrochemical complex. Our range covers oilfield chemicals, water treatment chemicals, industrial lubricants, and laboratory reagents. Road freight from Muscat takes 6–8 business days; sea freight via Sohar or Duqm Port takes 5–7 days.'
      },
      {
        question: 'Do you supply chemicals for Yanbu\'s refining and petrochemical plants?',
        answer: 'Yes, our oilfield and process chemical portfolio — corrosion inhibitors, scale inhibitors, demulsifiers, and production chemicals — is suited to refining and petrochemical operations like YASREF and YANSAB. With Aramco and Sinopec announcing a new integrated petrochemical complex for Yanbu in 2025, industrial demand in the area is growing.'
      },
      {
        question: 'What documentation do you provide for chemical imports into Yanbu?',
        answer: 'We provide complete Saudi customs documentation: Certificate of Origin attested by Oman Chamber of Commerce, Safety Data Sheet in Arabic and English, Certificate of Analysis, Technical Data Sheet, and commercial invoice with HS codes. For products requiring SASO conformity, our team provides guidance on the Saudi import permit process.'
      }
    ],
    metaTitle: 'Chemical Supplier Yanbu | Refining & Petrochemical Chemicals Saudi Arabia | Global Chemicals LLC',
    metaDescription: 'Chemical supplier exporting to Yanbu, Saudi Arabia. Oilfield & process chemicals for YASREF refinery, YANSAB & SABIC petrochemical plants. ISO 9001 certified. Get a quote.',
    metaKeywords: 'chemical supplier Yanbu, Yanbu Industrial City chemicals, YASREF chemical supplier, YANSAB chemical supplier, oilfield chemicals Yanbu, petrochemical chemicals Yanbu Saudi Arabia, chemical exporter Oman Yanbu, Red Sea chemical supplier Saudi Arabia'
  },
  // ── Country-level hubs ───────────────────────────────────────────────────
  // The Aug 2026 GSC data showed country-level queries landing on NOTHING:
  // "chemical suppliers in saudi arabia" @48.5 and "chemical supplier in uae"
  // @66.8 had no page — only city pages existed. These two entries aggregate
  // the country story around the import angle (GCC customs union, lanes,
  // documentation), which is the winnable intent for an Oman-based exporter.
  'saudi-arabia': {
    slug: 'saudi-arabia',
    city: 'Saudi Arabia',
    cityArabic: 'المملكة العربية السعودية',
    country: 'Saudi Arabia',
    region: 'Riyadh, Jeddah, Dammam, Jubail & Yanbu',
    description: 'Global Chemicals LLC is a GCC-based chemical supplier exporting to Saudi Arabia from our Muscat warehouse — no Saudi agent required for most industrial imports under the GCC customs union. We serve manufacturers, water treatment plants, construction projects, food producers, and oilfield service companies across Riyadh, Jeddah, Dammam, Jubail Industrial City, and Yanbu with water treatment chemicals, industrial and food-grade chemicals, corrosion inhibitors, glycols, and laboratory reagents. Road freight reaches the Eastern Province in 4–6 business days and Riyadh in 5–7; sea freight from Sohar Port serves Jeddah and Yanbu for bulk orders. Every consignment ships with Certificate of Origin attested by the Oman Chamber of Commerce, Arabic and English SDS, CoA, and HS-coded commercial invoices, with SASO/SFDA guidance where product categories require it.',
    industries: ['Water Treatment & Desalination', 'Oil & Gas / Petrochemicals', 'Construction & Infrastructure', 'Food & Beverage Processing', 'Manufacturing', 'Pharmaceuticals & Healthcare', 'Agriculture'],
    deliveryTime: '4–7 business days by road (Dammam 4–6, Riyadh 5–7); sea freight via Sohar Port to Jeddah/Yanbu in 4–6 days',
    keyClients: ['Jubail & Yanbu industrial city manufacturers', 'Eastern Province water treatment operators', 'Riyadh construction & infrastructure projects', 'Jeddah food and pharmaceutical producers', 'Oilfield service contractors'],
    highlights: [
      'GCC customs union — streamlined import, no local agent needed for most products',
      'Five Saudi delivery lanes: Riyadh, Jeddah, Dammam, Jubail, Yanbu',
      'Certificate of Origin, Arabic SDS, and SASO/SFDA documentation support',
      'Road and Sohar-Port sea freight options for drum, IBC and container loads',
      'ISO 9001:2015 certified supplier with full batch CoA'
    ],
    faqs: [
      {
        question: 'Who supplies industrial chemicals to Saudi Arabia from the GCC?',
        answer: 'Global Chemicals LLC exports industrial, water-treatment, food-grade and oilfield chemicals to Saudi Arabia from Muscat, Oman. Under the GCC customs union most industrial chemicals move without a Saudi import agent — we deliver by road to Riyadh, Dammam and Jubail in 4–7 business days and by sea from Sohar Port to Jeddah and Yanbu. Request a quote with your product list and destination city for delivered pricing.'
      },
      {
        question: 'What documentation is required to import chemicals into Saudi Arabia?',
        answer: 'Standard consignments ship with a Certificate of Origin attested by the Oman Chamber of Commerce, Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and an HS-coded commercial invoice. Product categories under SASO conformity or SFDA supervision (food-contact, cosmetic, and certain hazardous classes) need import permits — our export team advises on the requirement per product before shipment.'
      },
      {
        question: 'How long does chemical delivery from Oman to Saudi Arabia take?',
        answer: 'Road freight under GCC customs transit reaches the Eastern Province (Dammam, Jubail) in 4–6 business days and Riyadh in 5–7. For Red Sea destinations, container and IBC loads ship from Sohar Port to Jeddah or Yanbu in 4–6 days. Urgent partial loads can be consolidated on scheduled weekly departures.'
      },
      {
        question: 'Which cities in Saudi Arabia do you deliver chemicals to?',
        answer: 'Scheduled lanes serve Riyadh, Jeddah, Dammam, Jubail Industrial City, and Yanbu — see each city page for lane detail — and we quote ad-hoc deliveries to other Saudi destinations including NEOM, Rabigh, and Qassim on request.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Saudi Arabia — Import from Oman',
    metaDescription: 'Chemical suppliers serving Saudi Arabia from Oman: water treatment, industrial, food-grade & oilfield chemicals to Riyadh, Jeddah, Dammam, Jubail & Yanbu. SASO/SFDA guidance, Arabic SDS. Get a quote.',
    metaKeywords: 'chemical suppliers in saudi arabia, chemical supplier saudi arabia, industrial chemicals saudi arabia, specialty chemical distributors in saudi arabia, import chemicals saudi arabia, chemical exporter oman saudi arabia, water treatment chemicals riyadh, chemical supply jubail yanbu'
  },
  'uae': {
    slug: 'uae',
    city: 'United Arab Emirates',
    cityArabic: 'الإمارات العربية المتحدة',
    country: 'UAE',
    region: 'Dubai, Abu Dhabi, Sharjah, Fujairah & Ras Al Khaimah',
    description: 'Global Chemicals LLC supplies chemicals to the United Arab Emirates from our Muscat warehouse — the fastest cross-border lane in our network, with Fujairah reachable in 2–4 hours by road and Dubai and Abu Dhabi in 3–5 business days under GCC customs transit. Importing from Oman gives UAE buyers a second-source supply line at GCC-preferential terms: water treatment and RO chemicals, food-grade products, glycols and solvents, corrosion inhibitors, construction chemicals, and laboratory reagents, all shipped with CoA, GHS SDS in Arabic and English, and HS-coded export documentation. We serve industrial zones across all seven emirates including JAFZA, Dubai Industrial City, ICAD Abu Dhabi, Sharjah SAIF Zone, Fujairah Free Zone, and RAKEZ.',
    industries: ['Water Treatment & RO/Desalination', 'Construction & Infrastructure', 'Manufacturing & Free Zones', 'Food & Beverage Processing', 'Oil & Gas Services', 'Hospitality & Facilities Management', 'Marine & Ports'],
    deliveryTime: 'Fujairah 2–4 hours by road; Dubai, Sharjah & Abu Dhabi 3–5 business days; Ras Al Khaimah 3–5 days',
    keyClients: ['JAFZA and Dubai Industrial City manufacturers', 'Abu Dhabi ICAD industrial operators', 'Sharjah and Ajman factories', 'Fujairah bunkering and marine services', 'RAKEZ manufacturing companies'],
    highlights: [
      'Fujairah in 2–4 hours — the fastest chemical import lane from Oman',
      'GCC customs transit to all seven emirates, 3–5 day standard delivery',
      'Second-source supply line independent of Jebel Ali congestion',
      'Free-zone delivery experience: JAFZA, ICAD, SAIF, RAKEZ, Fujairah FZ',
      'Arabic + English SDS, CoA and HS-coded export documents on every load'
    ],
    faqs: [
      {
        question: 'Can UAE companies import chemicals from Oman easily?',
        answer: 'Yes — Oman and the UAE are both GCC customs-union members, so most industrial chemicals move across the border under customs transit without duties or a local import agent. Our trucks cross at Khatm Al Shikla/Hatta or via Al Ain daily; Fujairah deliveries take 2–4 hours and Dubai or Abu Dhabi 3–5 business days. It is a practical second-source lane when Jebel Ali lead times or supplier concentration are a concern.'
      },
      {
        question: 'Which chemicals do you supply to Dubai and Abu Dhabi?',
        answer: 'The full catalogue ships to the UAE: water treatment and RO chemicals (antiscalants, membrane cleaners, PAC, hypochlorite), food-grade chemicals with HACCP-compatible documents, glycols (MEG, PG, TEG), industrial solvents and alcohols, corrosion inhibitors, construction chemicals, swimming-pool chemicals, and laboratory reagents. Free-zone and mainland deliveries both supported with the correct customs paperwork.'
      },
      {
        question: 'How fast is chemical delivery from Oman to the UAE?',
        answer: 'Fujairah and the east coast: 2–4 hours by road — same-day for morning orders. Dubai, Sharjah and Abu Dhabi: 3–5 business days on scheduled departures, with urgent dedicated-truck options quoted on request. Ras Al Khaimah and the northern emirates: 3–5 business days.'
      },
      {
        question: 'Do you deliver to UAE free zones like JAFZA and RAKEZ?',
        answer: 'Yes — we deliver into JAFZA, Dubai Industrial City, ICAD Abu Dhabi, SAIF Zone, RAKEZ, and Fujairah Free Zone with the free-zone gate documentation prepared in advance. State the zone and company licence details in your enquiry and our export team prepares the paperwork before dispatch.'
      }
    ],
    metaTitle: 'Chemical Supplier to UAE & Dubai — Import from Oman',
    metaDescription: 'Chemical supplier to the UAE from Oman: Fujairah in 2–4 hours, Dubai & Abu Dhabi in 3–5 days under GCC customs. Water treatment, food-grade, glycols & industrial chemicals. Get a quote.',
    metaKeywords: 'chemical supplier in uae, chemical suppliers in uae, industrial chemicals dubai, chemical supplier dubai import, industrial chemical wholesale suppliers in dubai uae, import chemicals from oman to uae, chemical supplier abu dhabi, free zone chemical delivery jafza'
  },
  // Qatar and Kuwait hubs complete the GCC country-hub set (added after the
  // Aug 2026 GCC coverage review): both countries previously had only a single
  // city page (doha / kuwait-city) while UAE and Saudi Arabia got the full
  // exporter-intent hub treatment. Lane facts mirror the city pages and the
  // export-guide blog: no Oman–Qatar land border (road via Saudi Arabia, or
  // sea Sohar Port → Hamad Port); Kuwait by road via Saudi Arabia.
  'qatar': {
    slug: 'qatar',
    city: 'Qatar',
    cityArabic: 'قطر',
    country: 'Qatar',
    region: 'Doha, Ras Laffan, Mesaieed & Hamad Port',
    description: 'Global Chemicals LLC is a GCC-based chemical supplier exporting to Qatar from our Muscat warehouse. Oman and Qatar do not share a land border, so consignments move by road through Saudi Arabia under GCC customs transit in 3–5 business days, or by sea from Sohar Port to Hamad Port — a lane proven at scale when Oman became Qatar\'s main transshipment partner. We serve LNG and gas-processing operations in Ras Laffan Industrial City, petrochemical and fertilizer producers in Mesaieed, Kahramaa desalination and network contractors, construction projects across Doha, food and beverage processors, and manufacturers in the Qatar Free Zones (Ras Bufontas, Umm Al Houl) and Manateq industrial zones. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce, Arabic and English SDS, batch Certificate of Analysis, and HS-coded commercial invoices, with guidance on Ministry of Public Health and QatarEnergy vendor documentation where required.',
    industries: ['LNG & Gas Processing', 'Petrochemicals & Fertilizers', 'Water Treatment & Desalination', 'Construction & Infrastructure', 'Food & Beverage Processing', 'Manufacturing & Free Zones', 'Utilities & District Cooling'],
    deliveryTime: '3–5 business days by road via Saudi Arabia; sea freight from Sohar Port to Hamad Port for container and bulk loads',
    keyClients: ['QatarEnergy and Ras Laffan contractors', 'Mesaieed petrochemical and fertilizer producers', 'Kahramaa desalination and utility contractors', 'Doha construction and infrastructure projects', 'QFZ and Manateq zone manufacturers'],
    highlights: [
      'GCC customs union — streamlined import with no local agent needed for most products',
      'Two lanes: road via Saudi Arabia (3–5 days) or sea Sohar Port → Hamad Port',
      'Ras Laffan and QatarEnergy vendor documentation experience',
      'Certificate of Origin, Arabic + English SDS and batch CoA on every load',
      'ISO 9001:2015 certified supplier quoting in QAR, USD or OMR'
    ],
    faqs: [
      {
        question: 'Who supplies industrial chemicals to Qatar from the GCC?',
        answer: 'Global Chemicals LLC exports industrial, water-treatment, food-grade and oilfield chemicals to Qatar from Muscat, Oman. Under the GCC customs union most industrial chemicals clear without a Qatari import agent — we deliver by road through Saudi Arabia in 3–5 business days, or by sea from Sohar Port to Hamad Port for container loads. Send your product list and destination for delivered pricing in QAR, USD or OMR.'
      },
      {
        question: 'How do chemicals ship from Oman to Qatar without a land border?',
        answer: 'Two proven lanes: road freight transits Saudi Arabia under GCC customs transit and crosses into Qatar at Abu Samra, reaching Doha in 3–5 business days; sea freight sails from Sohar Port direct to Hamad Port — the route that carried the bulk of Oman–Qatar trade from 2017 onward — and suits container, IBC and drum consignments on weekly departures.'
      },
      {
        question: 'What documentation is required to import chemicals into Qatar?',
        answer: 'Standard consignments ship with a Certificate of Origin attested by the Oman Chamber of Commerce (GCC preferential), Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and an HS-coded commercial invoice. Food-contact and consumable categories fall under Ministry of Public Health supervision, and Ras Laffan deliveries need site security clearance — our export team prepares both before dispatch.'
      },
      {
        question: 'Which areas of Qatar do you deliver chemicals to?',
        answer: 'We deliver to Doha and its industrial areas, Ras Laffan Industrial City, Mesaieed Industrial City, the Qatar Free Zones at Ras Bufontas and Umm Al Houl, and Manateq logistics and industrial parks. Other destinations including Dukhan and Al Wakrah are quoted on request — see the Doha city page for lane detail.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Qatar — Import from Oman',
    metaDescription: 'Chemical suppliers serving Qatar from Oman: water treatment, LNG, food-grade & industrial chemicals to Doha, Ras Laffan & Mesaieed. Road via Saudi Arabia or sea Sohar–Hamad Port. Get a quote.',
    metaKeywords: 'chemical suppliers in qatar, chemical supplier qatar, industrial chemicals qatar, chemical companies in qatar, import chemicals qatar, chemical exporter oman qatar, water treatment chemicals doha, ras laffan chemical supplier, mesaieed chemicals, hamad port chemical import',
    relatedGuide: {
      slug: 'chemical-exporter-oman-saudi-arabia-qatar-kuwait',
      title: 'Chemical Supply from Oman to Saudi Arabia, Qatar & Kuwait: Export Guide 2026',
      blurb: 'Lead times, documentation and product availability for exporting chemicals from Muscat to Qatar — including the Sohar–Hamad Port sea lane.'
    }
  },
  'kuwait': {
    slug: 'kuwait',
    city: 'Kuwait',
    cityArabic: 'الكويت',
    country: 'Kuwait',
    region: 'Kuwait City, Shuaiba, Mina Abdullah & Al Zour',
    description: 'Global Chemicals LLC is a GCC-based chemical supplier exporting to Kuwait from our Muscat warehouse — road freight transits Saudi Arabia under GCC customs and reaches Kuwait City in 4–6 business days, with sea freight to Shuwaikh and Shuaiba ports for container loads. We serve Kuwait\'s refining sector — KNPC\'s Mina Al-Ahmadi and Mina Abdullah refineries and the KIPIC Al Zour complex — alongside KOC oilfield service contractors, EQUATE and PIC petrochemical supply chains, Ministry of Electricity & Water desalination and power stations, Shuaiba and Sabhan industrial area manufacturers, and construction projects across the country. Every consignment ships with a Certificate of Origin attested by the Oman Chamber of Commerce, Arabic and English SDS, batch Certificate of Analysis, and HS-coded commercial invoices, with KUCAS conformity guidance where product categories require it.',
    industries: ['Oil Refining (KNPC & KIPIC)', 'Oilfield Services (KOC)', 'Petrochemicals', 'Power & Desalination', 'Construction & Infrastructure', 'Manufacturing', 'Water Treatment'],
    deliveryTime: '4–6 business days by road via Saudi Arabia; sea freight to Shuwaikh/Shuaiba ports for container and bulk loads',
    keyClients: ['KNPC and KIPIC refinery supply chains', 'KOC oilfield service contractors', 'EQUATE and PIC petrochemical operations', 'MEW power and desalination stations', 'Shuaiba and Sabhan industrial manufacturers'],
    highlights: [
      'GCC customs union — streamlined import with no local agent needed for most products',
      'Road lane via Saudi Arabia in 4–6 days; sea freight to Shuwaikh and Shuaiba',
      'KOC/KNPC vendor documentation experience and refinery-grade portfolio',
      'KUCAS conformity guidance plus CoO, Arabic SDS and batch CoA on every load',
      'ISO 9001:2015 certified supplier quoting in KWD, USD or OMR'
    ],
    faqs: [
      {
        question: 'Who supplies industrial chemicals to Kuwait from the GCC?',
        answer: 'Global Chemicals LLC exports industrial, water-treatment, oilfield and refinery chemicals to Kuwait from Muscat, Oman. Under the GCC customs union most industrial chemicals clear without a Kuwaiti import agent — road freight through Saudi Arabia reaches Kuwait City in 4–6 business days, and container loads ship by sea to Shuwaikh or Shuaiba. Send your product list for delivered pricing in KWD, USD or OMR.'
      },
      {
        question: 'What documentation is required to import chemicals into Kuwait?',
        answer: 'Standard consignments ship with a Certificate of Origin attested by the Oman Chamber of Commerce (GCC preferential), Safety Data Sheets in Arabic and English, batch Certificate of Analysis, Technical Data Sheet, and an HS-coded commercial invoice. Product categories under the Kuwait Conformity Assessment Scheme (KUCAS) need a Technical Evaluation Report before customs clearance — our export team confirms the requirement per product and prepares the paperwork before shipment.'
      },
      {
        question: 'How long does chemical delivery from Oman to Kuwait take?',
        answer: 'Road freight under GCC customs transit crosses Saudi Arabia and reaches Kuwait City, Shuaiba and the industrial areas in 4–6 business days. Container and bulk consignments ship by sea to Shuwaikh Port or Shuaiba Port; urgent partial loads can be consolidated on scheduled weekly road departures.'
      },
      {
        question: 'Do you supply chemicals for Kuwait\'s refineries and the Al Zour complex?',
        answer: 'Yes — our refinery and oilfield portfolio covers corrosion inhibitors, oxygen scavengers, demulsifiers, antiscalants, glycols and water treatment chemicals used across KNPC\'s Mina Al-Ahmadi and Mina Abdullah refineries and the KIPIC Al Zour refinery and petrochemical complex, and we provide the full documentation packages KOC and KNPC contractor qualification requires.'
      }
    ],
    metaTitle: 'Chemical Suppliers in Kuwait — Import from Oman',
    metaDescription: 'Chemical suppliers serving Kuwait from Oman: refinery, oilfield, water treatment & industrial chemicals to Kuwait City, Shuaiba & Al Zour. KUCAS guidance, Arabic SDS. Get a quote.',
    metaKeywords: 'chemical suppliers in kuwait, chemical supplier kuwait, industrial chemicals kuwait, chemical companies in kuwait, import chemicals kuwait, chemical exporter oman kuwait, refinery chemicals kuwait, KNPC chemical supplier, shuaiba industrial chemicals, al zour refinery chemicals',
    relatedGuide: {
      slug: 'chemical-exporter-oman-saudi-arabia-qatar-kuwait',
      title: 'Chemical Supply from Oman to Saudi Arabia, Qatar & Kuwait: Export Guide 2026',
      blurb: 'Lead times, documentation and product availability for exporting chemicals from Muscat to Kuwait — including KUCAS conformity requirements.'
    }
  }
};



const productCategories = [
  { name: 'Water Treatment Chemicals', icon: Droplets, description: 'PAC, chlorine, antiscalants, biocides', category: 'water-treatment' },
  { name: 'Industrial Lubricants', icon: Factory, description: 'Shell, Mobil, Castrol oils & greases', category: 'lubricants' },
  { name: 'Laboratory Chemicals', icon: Beaker, description: 'AR grade, HPLC solvents, reagents', category: 'lab-chemicals' },
  { name: 'Oil & Gas Chemicals', icon: Building2, description: 'Corrosion inhibitors, demulsifiers', category: 'oilfield' },
];

// Popular, specific product pages surfaced from location-page prose (FAQs
// repeatedly name these by product, not just category — PAC, sodium
// hypochlorite, caustic soda, antiscalants). Deep-linking here gives Google
// and buyers a direct path from a location page to the actual product page,
// rather than only the generic category listing.
const popularWaterTreatmentProducts = [
  { label: 'Poly Aluminium Chloride (PAC)', category: 'water-treatment', slug: 'pac-liquid' },
  { label: 'Calcium Hypochlorite', category: 'water-treatment', slug: 'calcium-hypochlorite-water' },
  { label: 'Sodium Hypochlorite', category: 'water-treatment', slug: 'sodium-hypochlorite' },
  { label: 'Caustic Soda Liquid', category: 'water-treatment', slug: 'caustic-soda-liquid' },
  { label: 'Antiscalant', category: 'water-treatment', slug: 'antiscalant-water' },
];

const LocationLanding = () => {
  const { location } = useParams<{ location: string }>();
  const { t, i18n } = useTranslation();

  // Unknown city slugs render the (noindexed) 404 page — silently redirecting
  // to /contact taught crawlers that any /chemicals/* URL resolves with 200.
  if (!location || !locations[location]) {
    return <NotFound />;
  }

  const locationData = locations[location];
  const isAr = i18n.language === 'ar';
  const cityLabel = isAr ? locationData.cityArabic : locationData.city;

  // Arabic SEO meta — only when a real translation exists in
  // location-pages-ar.json (GCC cities, the country hubs, and the Oman
  // cities are translated; Iraq/Jordan/Egypt pages are not yet). Passing
  // arTitle/arDescription to <SEO> makes the /ar twin indexable with a
  // localized meta layer and emits hreflang pairs on both language versions;
  // cities without a translation stay noindex on /ar (see CLAUDE.md's
  // Arabic SEO model — never index a page whose body is still English).
  // Gate on metaTitle + metaDescription: the same rule sync-ar-sitemap.mjs
  // uses, and the exact fields the eager ar-meta.json subset carries — so this
  // check stays correct on English renders before (or without) the lazy full
  // Arabic bundle. Do NOT gate on body fields like `description` here; those
  // live only in the lazily-loaded location-pages-ar.json.
  const tAr = i18n.getFixedT('ar');
  const hasArabicSeo =
    i18n.exists(`locationPages.${location}.metaTitle`, { lng: 'ar' }) &&
    i18n.exists(`locationPages.${location}.metaDescription`, { lng: 'ar' });
  const arSeoTitle = hasArabicSeo ? tAr(`locationPages.${location}.metaTitle`) : undefined;
  const arSeoDescription = hasArabicSeo ? tAr(`locationPages.${location}.metaDescription`) : undefined;

  // Body content translation, mirroring ProductDetail.tsx's pattern: swap to
  // the Arabic strings when the /ar route is active and a translation exists,
  // otherwise fall back to the English data so untranslated cities render
  // correctly (in English) even when visited under /ar/chemicals/:location.
  const translatedDescription = isAr
    ? t(`locationPages.${location}.description`, { defaultValue: locationData.description })
    : locationData.description;
  const translatedIndustries = isAr
    ? (t(`locationPages.${location}.industries`, { returnObjects: true, defaultValue: locationData.industries }) as string[])
    : locationData.industries;
  const translatedDeliveryTime = isAr
    ? t(`locationPages.${location}.deliveryTime`, { defaultValue: locationData.deliveryTime })
    : locationData.deliveryTime;
  const translatedKeyClients = isAr
    ? (t(`locationPages.${location}.keyClients`, { returnObjects: true, defaultValue: locationData.keyClients }) as string[])
    : locationData.keyClients;
  const translatedHighlights = isAr
    ? (t(`locationPages.${location}.highlights`, { returnObjects: true, defaultValue: locationData.highlights }) as string[])
    : locationData.highlights;
  const translatedFaqs = isAr
    ? (t(`locationPages.${location}.faqs`, { returnObjects: true, defaultValue: locationData.faqs }) as { question: string; answer: string }[])
    : locationData.faqs;
  const translatedMetaKeywords = isAr
    ? t(`locationPages.${location}.metaKeywords`, { defaultValue: locationData.metaKeywords })
    : locationData.metaKeywords;

  const breadcrumbItems = [
    { name: isAr ? 'الرئيسية' : 'Home', url: 'https://gcoman.com/' },
    { name: isAr ? 'مواقع التوصيل' : 'Delivery Locations', url: 'https://gcoman.com/chemicals' },
    { name: isAr ? `كيماويات ${locationData.cityArabic}` : `Chemicals ${locationData.city}`, url: `https://gcoman.com/chemicals/${locationData.slug}` }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={locationData.metaTitle}
        description={locationData.metaDescription}
        arTitle={arSeoTitle}
        arDescription={arSeoDescription}
        keywords={translatedMetaKeywords}
        ogTitle={`Chemical Supplier in ${locationData.city}, ${locationData.country} | Global Chemicals LLC`}
        ogDescription={locationData.metaDescription}
        ogUrl={`https://gcoman.com/chemicals/${locationData.slug}`}
        canonical={`https://gcoman.com/chemicals/${locationData.slug}`}
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <FAQStructuredData faqs={translatedFaqs} />
      <SpeakableStructuredData url={`https://gcoman.com/chemicals/${locationData.slug}`} cssSelector={["h1", "h2", ".speakable"]} />

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
              {isAr ? (
                <>مورد الكيماويات في <span className="text-primary">{locationData.cityArabic}</span></>
              ) : (
                <>Chemical Supplier in <span className="text-primary">{locationData.city}</span></>
              )}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 speakable">
              {translatedDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" asChild>
                <LocalizedLink to="/contact">
                  {isAr ? `اطلب عرض سعر لـ${cityLabel}` : `Request Quote for ${locationData.city}`}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </LocalizedLink>
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
                {isAr ? 'معتمدة آيزو 9001' : 'ISO 9001 Certified'}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400">
                <Award className="w-3 h-3 mr-1" />
                {isAr ? 'مسجّلة في JSRS' : 'JSRS Registered'}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 border-primary/30">
                <Truck className="w-3 h-3 mr-1" />
                {translatedDeliveryTime}
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
              {isAr ? `القطاعات التي نخدمها في ${cityLabel}` : `Industries We Serve in ${locationData.city}`}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {translatedIndustries.map((industry, index) => (
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
              {isAr ? `الكيماويات المتوفرة في ${cityLabel}` : `Chemicals Available in ${locationData.city}`}
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              {isAr
                ? `نورّد مجموعة شاملة من الكيماويات الصناعية والمتخصصة للشركات في ${cityLabel}`
                : `We supply a comprehensive range of industrial and specialty chemicals to ${locationData.city} businesses`}
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
                        <LocalizedLink to={`/products/${category.category}`}>View Products →</LocalizedLink>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Popular Products — direct links to specific product pages,
                not just the category listing, so buyers reading about a
                chemical by name (PAC, caustic soda, antiscalants...) in the
                FAQs above can click straight through to it. */}
            <div className="mt-10 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                {isAr ? 'منتجات شائعة:' : 'Popular products:'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularWaterTreatmentProducts.map((product) => (
                  <Button key={product.slug} variant="outline" size="sm" asChild>
                    <LocalizedLink to={`/products/${product.category}/${product.slug}`}>
                      {product.label}
                    </LocalizedLink>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Guide (optional cross-link, e.g. the GCC desalination pillar) */}
      {locationData.relatedGuide && (
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="logo-gradient-border relative">
                <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary mb-1">Related Guide</p>
                    <p className="font-semibold">{locationData.relatedGuide.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{locationData.relatedGuide.blurb}</p>
                  </div>
                  <Button variant="outline" asChild className="shrink-0">
                    <LocalizedLink to={`/blog/${locationData.relatedGuide.slug}`}>
                      Read the guide
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </LocalizedLink>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {isAr ? `لماذا تختار شركة جلوبال كيميكالز في ${cityLabel}؟` : `Why Choose Global Chemicals LLC in ${locationData.city}?`}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <ul className="space-y-4">
                  {translatedHighlights.map((highlight, index) => (
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
                    {isAr ? `التوصيل إلى ${cityLabel}` : `Delivery to ${locationData.city}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{translatedDeliveryTime}</p>
                  <div className="space-y-2">
                    <p className="font-medium">{isAr ? `أبرز العملاء في ${cityLabel}:` : `Key Clients in ${locationData.city}:`}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {translatedKeyClients.map((client, index) => (
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
              {isAr ? `الأسئلة الشائعة - ${cityLabel}` : `Frequently Asked Questions - ${locationData.city}`}
            </h2>

            <div className="space-y-4">
              {translatedFaqs.map((faq, index) => (
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
              {isAr ? `احصل على توصيل الكيماويات إلى ${cityLabel}` : `Get Chemicals Delivered to ${locationData.city}`}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {isAr
                ? `تواصل مع فريقنا لمعرفة توفر المنتجات والأسعار ومواعيد التوصيل إلى ${cityLabel}.`
                : `Contact our team for product availability, pricing, and delivery schedules to ${locationData.city} and ${locationData.region}.`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" asChild>
                <LocalizedLink to="/contact">{isAr ? 'تواصل معنا' : 'Contact Us'}</LocalizedLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://wa.me/96893754388">
                  {isAr ? 'تواصل عبر واتساب' : 'WhatsApp Us'}
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
