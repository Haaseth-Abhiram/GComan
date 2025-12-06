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
    { name: 'Home', url: 'https://www.gcoman.com/' },
    { name: `Chemicals ${locationData.city}`, url: `https://www.gcoman.com/chemicals/${locationData.slug}` }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={locationData.metaTitle}
        description={locationData.metaDescription}
        keywords={locationData.metaKeywords}
        ogTitle={`Chemical Supplier in ${locationData.city}, Oman | Global Chemicals LLC`}
        ogDescription={locationData.metaDescription}
        ogUrl={`https://www.gcoman.com/chemicals/${locationData.slug}`}
        canonical={`https://www.gcoman.com/chemicals/${locationData.slug}`}
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <FAQStructuredData faqs={locationData.faqs} />
      <OrganizationStructuredData />

      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-primary/10 via-background to-background">
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
                  <Card key={index} className="hover:shadow-lg transition-shadow">
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

              <Card className="bg-primary/5 border-primary/20">
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
                <Card key={index}>
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
