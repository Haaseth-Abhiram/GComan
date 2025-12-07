import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Calendar, Clock, User, Search, ChevronRight, Tag, BookOpen, Download, ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { BlogListingStructuredData, BreadcrumbStructuredData, LocalBusinessStructuredData, ArticleStructuredData } from '@/components/StructuredData';

// Blog post interface with full content
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  featured: boolean;
  relatedProducts?: string[];
}

// Blog articles with full content for SEO
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Water Treatment Chemicals in Oman: Complete Guide for 2024",
    excerpt: "A comprehensive overview of water treatment chemicals used in Oman's desalination plants, municipal facilities, and industrial operations. Learn about PAC, calcium hypochlorite, antiscalants, and best practices for Oman's unique water challenges.",
    content: [
      "Oman faces unique water treatment challenges due to its arid climate and reliance on desalination. With over 500 million cubic meters of desalinated water produced annually, understanding the right chemicals for water treatment is essential for industries across Muscat, Sohar, Duqm, and Salalah.",
      "**Key Water Treatment Chemicals for Oman:**\n\n• **Poly Aluminium Chloride (PAC)** - The preferred coagulant for Oman's high-turbidity water conditions. PAC works effectively across a wide pH range (6.5-9.0) and performs well in the high temperatures common in the Gulf region.\n\n• **Calcium Hypochlorite** - Essential for disinfection in municipal water systems. With 65-70% available chlorine, it's stable and easy to store in Oman's climate.\n\n• **Sodium Hypochlorite** - Used in automated dosing systems at treatment plants. Degrades faster in heat, so use within 60 days.\n\n• **Antiscalants** - Critical for protecting RO membranes in desalination plants. Prevents calcium and magnesium scale formation.",
      "**Dosing Guidelines for Oman Conditions:**\n\nPAC dosage typically ranges from 10-50 mg/L depending on raw water turbidity. Summer temperatures require adjusted dosing due to faster reaction kinetics. Maintain residual chlorine levels of 0.2-0.5 mg/L at distribution points to ensure water safety throughout the network.",
      "**Best Practices:**\n\n1. Conduct jar tests to determine optimal coagulant dosage\n2. Store chemicals in cool, dry areas away from direct sunlight\n3. Monitor residual aluminium to meet WHO guidelines (<0.2 mg/L)\n4. Implement automated dosing systems for consistent chemical delivery\n5. Regular membrane autopsies help optimize chemical treatment programs",
      "Global Chemicals LLC supplies a complete range of water treatment chemicals with technical support for dosing optimization. Contact our team for product recommendations specific to your facility's requirements."
    ],
    category: "Technical Guides",
    date: "2024-12-01",
    author: "Global Chemicals Technical Team",
    readTime: "8 min read",
    image: "/images/blog/water-treatment-oman.jpg",
    featured: true,
    relatedProducts: ["Poly Aluminium Chloride (PAC)", "Calcium Hypochlorite", "Sodium Hypochlorite", "Antiscalants"]
  },
  {
    id: 2,
    title: "Chemical Storage Safety in Oman's Hot Climate: Essential Guidelines",
    excerpt: "Industrial chemicals require special handling in Oman's extreme temperatures. This guide covers proper storage conditions, temperature management, and safety protocols for chemical warehouses in Muscat, Sohar, and industrial zones.",
    content: [
      "Oman's extreme temperatures, regularly exceeding 45°C in summer, pose significant challenges for chemical storage. Proper storage practices are essential to maintain product quality, ensure worker safety, and comply with regulations.",
      "**Temperature Management:**\n\n• Never store chemicals above 30°C - this significantly reduces shelf life\n• Install temperature monitoring systems in all storage areas\n• Use air-conditioned storage rooms maintaining 20-25°C for sensitive chemicals\n• Flammable solvents require explosion-proof refrigerators\n• Drum temperatures can exceed 70°C when exposed to sun - causing seal failures",
      "**Storage Best Practices:**\n\n1. **Covered, Ventilated Areas** - Protect from direct sunlight with adequate ventilation\n2. **Drum Positioning** - Store horizontally or with bungs at 3 and 9 o'clock positions\n3. **Segregation** - Keep incompatible chemicals in separate areas (oxidizers away from flammables)\n4. **FIFO Management** - First-in, first-out inventory prevents degradation\n5. **Shade Structures** - Install for outdoor storage areas",
      "**Shelf Life Guidelines in Oman:**\n\n• Mineral oils: Maximum 2 years\n• Synthetic lubricants: Maximum 3 years\n• Sodium hypochlorite: Use within 60 days\n• Laboratory reagents: Check manufacturer specifications\n• Hygroscopic chemicals: Protect with desiccators or nitrogen blanketing",
      "**Safety Equipment Requirements:**\n\n• Emergency eyewash stations (test weekly)\n• Safety showers\n• Spill containment systems\n• Fire suppression appropriate for chemical types\n• SDS accessible within 30 seconds of work area\n\nGlobal Chemicals LLC provides storage guidance and can conduct facility assessments to ensure your chemical storage meets safety standards."
    ],
    category: "Safety & Compliance",
    date: "2024-11-28",
    author: "HSE Department",
    readTime: "6 min read",
    image: "/images/blog/chemical-safety-storage.jpg",
    featured: false,
    relatedProducts: ["Safety Equipment", "Spill Containment", "Storage Solutions"]
  },
  {
    id: 3,
    title: "Global Chemicals LLC Achieves JSRS Certification Renewal for 2024-2025",
    excerpt: "We are proud to announce the renewal of our JSRS (Joint Supplier Registration System) certification, reinforcing our commitment to serving Oman's oil and gas sector with quality chemicals and reliable supply.",
    content: [
      "Global Chemicals LLC is pleased to announce the successful renewal of our JSRS (Joint Supplier Registration System) certification for 2024-2025. This certification is a testament to our commitment to meeting the highest standards required by Oman's oil and gas industry.",
      "**What JSRS Certification Means:**\n\nThe Joint Supplier Registration System is a unified vendor qualification system used by major oil and gas operators in Oman, including PDO, OQ, and international contractors. JSRS certification demonstrates that a supplier meets stringent requirements for:\n\n• Quality management systems\n• Health, Safety, and Environment (HSE) compliance\n• Financial stability\n• Technical capability\n• Supply chain reliability",
      "**Our Commitment to Excellence:**\n\nThis renewal reflects Global Chemicals LLC's dedication to:\n\n1. Maintaining ISO 9001:2015 quality management standards\n2. Continuous improvement in safety practices\n3. Reliable supply chain management across Oman\n4. Technical support and expertise for oil & gas applications\n5. In-Country Value (ICV) contribution to Oman's economy",
      "**Serving Oman's Oil & Gas Sector:**\n\nWith JSRS certification, Global Chemicals LLC is qualified to supply:\n\n• Corrosion inhibitors for pipeline protection\n• Scale inhibitors for production optimization\n• Demulsifiers for oil-water separation\n• H2S scavengers for sour gas treatment\n• Drilling and completion chemicals\n• Production chemicals for enhanced recovery",
      "We thank our customers, partners, and team members who have contributed to this achievement. Global Chemicals LLC remains committed to being your trusted chemical partner in Oman's oil and gas industry."
    ],
    category: "Company News",
    date: "2024-11-20",
    author: "Global Chemicals LLC",
    readTime: "3 min read",
    image: "/images/blog/jsrs-certification.jpg",
    featured: false,
    relatedProducts: ["Corrosion Inhibitors", "Scale Inhibitors", "H2S Scavengers", "Demulsifiers"]
  },
  {
    id: 4,
    title: "Choosing the Right Lubricant for Oman's Industrial Equipment",
    excerpt: "High temperatures and dusty conditions demand premium lubricants. Compare Shell, Mobil, and Castrol products for hydraulic systems, gearboxes, and compressors in Oman's manufacturing and oil & gas sectors.",
    content: [
      "Industrial equipment in Oman faces extreme operating conditions - temperatures regularly exceeding 45°C, dust exposure, and demanding production schedules. Selecting the right lubricant is critical for equipment longevity and operational efficiency.",
      "**Key Selection Criteria for Oman:**\n\n• **High Viscosity Index (VI > 150)** - Maintains consistent performance across temperature ranges\n• **Oxidation Stability** - Resists breakdown in high-temperature environments\n• **Dust/Contamination Resistance** - Protects in sandy, dusty conditions\n• **Extended Drain Intervals** - Reduces maintenance frequency and downtime",
      "**Hydraulic Oils Comparison:**\n\n• **Shell Tellus S2 V** - Excellent for wide temperature applications, high VI for Oman conditions\n• **Mobil DTE 10 Excel** - Superior anti-wear protection, extended equipment life\n• **Castrol Hyspin AWS** - Good all-round performance, cost-effective option\n\nFor Oman, select ISO VG 46 or 68 grades for most applications.",
      "**Gear Oils for Industrial Gearboxes:**\n\n• **Shell Omala S4 GX** - Synthetic PAO-based, 4x longer oil life than mineral oils\n• **Mobil SHC 600 Series** - Reduces operating temperatures by 10-20°C\n• **Castrol Tribol** - Good EP protection for heavy-duty applications\n\nSynthetic gear oils offer significant advantages in Oman's hot climate.",
      "**Maintenance Best Practices:**\n\n1. Monitor oil temperature - every 10°C above 55°C halves oil life\n2. Implement oil analysis programs for predictive maintenance\n3. Maintain system cleanliness to ISO 16/14/11 or better\n4. Never mix different lubricant brands without compatibility testing\n5. Use calibrated grease guns to prevent over-lubrication\n\nGlobal Chemicals LLC is an authorized distributor for Shell, Mobil, and Castrol industrial lubricants. Contact us for technical guidance on lubricant selection."
    ],
    category: "Technical Guides",
    date: "2024-11-15",
    author: "Global Chemicals Technical Team",
    readTime: "7 min read",
    image: "/images/blog/industrial-lubricants.jpg",
    featured: false,
    relatedProducts: ["Shell Tellus Hydraulic Oils", "Mobil DTE Series", "Shell Omala Gear Oils", "Industrial Greases"]
  },
  {
    id: 5,
    title: "How Sohar Industrial Zone Companies Optimize Chemical Procurement",
    excerpt: "Case study on how manufacturing facilities in Sohar Industrial Zone reduced chemical costs by 15% through consolidated procurement, just-in-time delivery, and technical support from local suppliers.",
    content: [
      "Sohar Industrial Estate and SOHAR Port & Freezone host some of Oman's most significant manufacturing operations. This case study explores how companies in the zone have optimized their chemical procurement to reduce costs while improving operational efficiency.",
      "**The Challenge:**\n\nManufacturing facilities in Sohar faced several procurement challenges:\n\n• Multiple suppliers with inconsistent delivery schedules\n• High inventory carrying costs for chemicals\n• Limited technical support for chemical applications\n• Difficulty managing chemical specifications across operations\n• Long lead times affecting production planning",
      "**The Solution - Consolidated Procurement:**\n\nBy partnering with a local chemical supplier like Global Chemicals LLC, facilities achieved:\n\n1. **Single-Source Supply** - Consolidated orders across chemical categories\n2. **Just-in-Time Delivery** - Reduced inventory from 3 months to 2 weeks\n3. **Technical Support** - On-site consultation for chemical optimization\n4. **Standardized Specifications** - Consistent quality across all deliveries\n5. **Emergency Response** - 24-hour emergency supply capability",
      "**Results Achieved:**\n\n• **15% Cost Reduction** - Through volume discounts and reduced inventory\n• **30% Faster Delivery** - Local supply vs. international imports\n• **Zero Stockouts** - Reliable supply chain management\n• **Improved Safety** - Better chemical handling with supplier training\n• **Reduced Waste** - Right-sized packaging and quantities",
      "**Key Success Factors:**\n\n• Building long-term supplier relationships\n• Clear communication of requirements and specifications\n• Regular supplier performance reviews\n• Collaborative problem-solving approach\n• Leveraging supplier technical expertise\n\nGlobal Chemicals LLC serves numerous facilities in Sohar Industrial Zone. Contact us to discuss how we can optimize your chemical procurement."
    ],
    category: "Case Studies",
    date: "2024-11-10",
    author: "Business Development Team",
    readTime: "5 min read",
    image: "/images/blog/sohar-industrial.jpg",
    featured: false,
    relatedProducts: ["Industrial Chemicals", "Water Treatment Chemicals", "Lubricants"]
  },
  {
    id: 6,
    title: "Swimming Pool Chemicals: Maintaining Crystal Clear Water in Oman's Summer",
    excerpt: "Hotels, resorts, and residential pools in Oman face unique challenges during summer months. Learn proper chlorination, pH management, and algae prevention techniques for optimal pool water quality.",
    content: [
      "Maintaining pool water quality in Oman's hot, sunny climate is challenging. High temperatures accelerate chlorine consumption, while intense UV radiation degrades sanitizers rapidly. This guide covers essential maintenance practices for hotels, resorts, and residential pools.",
      "**Essential Water Chemistry Parameters:**\n\n• **Free Chlorine**: 1-3 ppm (test twice daily in summer)\n• **pH**: 7.2-7.6 (critical for chlorine effectiveness)\n• **Total Alkalinity**: 80-120 ppm\n• **Calcium Hardness**: 200-400 ppm\n• **Cyanuric Acid**: 30-50 ppm (for outdoor pools)",
      "**Chlorination Best Practices for Oman:**\n\n1. Add chlorine in the evening to reduce UV degradation\n2. Use stabilized chlorine (with cyanuric acid) for outdoor pools\n3. Shock treat pools weekly with calcium hypochlorite at 10 ppm\n4. Chlorine consumption can triple during hottest months\n5. Maintain cyanuric acid at 30-50 ppm as a UV shield\n\n**Recommended Products:**\n• Calcium Hypochlorite 65-70% for shock treatment\n• TCCA tablets for continuous chlorination\n• Sodium hypochlorite for automated dosing",
      "**pH and Alkalinity Control:**\n\nOman's high-TDS water often causes pH to drift upward. Use:\n\n• Hydrochloric acid (muriatic acid) to lower pH\n• Sodium bisulfate (dry acid) as a safer alternative\n• Sodium bicarbonate to raise alkalinity\n\n**Important:** Never add acid and chlorine simultaneously - allow 4 hours between additions.",
      "**Algae Prevention:**\n\n• Maintain proper chlorine levels - prevention is easier than treatment\n• Use algaecide weekly as a preventive measure\n• For green algae outbreaks: shock treat at 20-30 ppm chlorine\n• Brush all pool surfaces weekly to remove algae spores\n• Run pump continuously during treatment\n\nGlobal Chemicals LLC supplies a complete range of swimming pool chemicals with technical support. Contact us for pool maintenance programs for your hotel, resort, or facility."
    ],
    category: "Technical Guides",
    date: "2024-11-05",
    author: "Global Chemicals Technical Team",
    readTime: "6 min read",
    image: "/images/blog/pool-chemicals-oman.jpg",
    featured: false,
    relatedProducts: ["Calcium Hypochlorite", "Chlorine Tablets (TCCA)", "Hydrochloric Acid", "Pool Algaecides"]
  },
  {
    id: 7,
    title: "Understanding Oman's Chemical Import Regulations and Compliance",
    excerpt: "Navigate Oman's regulatory framework for industrial chemicals. This guide covers Ministry of Commerce requirements, environmental permits, and documentation needed for chemical imports and distribution.",
    content: [
      "Importing and distributing industrial chemicals in Oman requires compliance with various regulatory frameworks. Understanding these requirements ensures smooth operations and avoids costly delays or penalties.",
      "**Key Regulatory Bodies:**\n\n• **Ministry of Commerce, Industry and Investment Promotion** - Import licensing\n• **Environment Authority** - Environmental permits for hazardous chemicals\n• **Royal Oman Police** - Controlled substances permits\n• **Ministry of Health** - Food-grade and pharmaceutical chemicals\n• **Civil Defence** - Fire safety and storage approvals",
      "**Required Documentation for Chemical Imports:**\n\n1. Commercial Registration (CR) with appropriate activities\n2. Import License from Ministry of Commerce\n3. Safety Data Sheets (SDS) in English and Arabic\n4. Certificate of Analysis (CoA) for each batch\n5. Certificate of Origin\n6. Packing List with proper chemical descriptions\n7. Environmental permit for hazardous materials",
      "**Restricted and Controlled Chemicals:**\n\nSome chemicals require additional permits:\n\n• **Precursor chemicals** - Extra documentation and end-user declarations\n• **Hazardous substances** - Environment Authority permits\n• **Controlled drugs and substances** - Royal Oman Police authorization\n• **Radioactive materials** - Special licensing required",
      "**Compliance Best Practices:**\n\n1. Maintain up-to-date SDS for all chemicals\n2. Keep proper storage records and inventory\n3. Train staff on handling and emergency procedures\n4. Conduct regular internal audits\n5. Stay updated on regulatory changes\n6. Work with experienced local distributors who understand requirements\n\nGlobal Chemicals LLC handles all regulatory compliance for our products. We provide proper documentation and guidance to ensure your operations meet Oman's requirements."
    ],
    category: "Safety & Compliance",
    date: "2024-10-28",
    author: "Compliance Team",
    readTime: "8 min read",
    image: "/images/blog/regulations-compliance.jpg",
    featured: false,
    relatedProducts: []
  },
  {
    id: 8,
    title: "New: Extended Laboratory Chemical Range Now Available in Muscat",
    excerpt: "Global Chemicals LLC expands laboratory chemical inventory with AR grade reagents, HPLC solvents, and buffer solutions. Same-day delivery available in Muscat for urgent research and QC requirements.",
    content: [
      "Global Chemicals LLC is pleased to announce a significant expansion of our laboratory chemical inventory in Muscat. This expansion ensures faster delivery and better availability for research laboratories, quality control departments, and educational institutions across Oman.",
      "**New Product Categories Available:**\n\n**AR Grade Reagents:**\n• Hydrochloric Acid AR\n• Sulfuric Acid AR\n• Nitric Acid AR\n• Sodium Hydroxide AR\n• Potassium Hydroxide AR\n• Ammonia Solution AR\n\n**HPLC Solvents:**\n• Acetonitrile HPLC Grade\n• Methanol HPLC Grade\n• Water HPLC Grade\n• Hexane HPLC Grade\n• LC-MS Grade Solvents",
      "**Buffer Solutions and Standards:**\n• pH Buffer Solutions (pH 4, 7, 10)\n• Conductivity Standards\n• Volumetric Solutions\n• Reference Standards (select items)\n\n**Lab Consumables:**\n• Filter Papers\n• Syringes and Filters\n• Sample Vials\n• Pipette Tips",
      "**Same-Day Delivery in Muscat:**\n\nFor urgent requirements, we now offer same-day delivery within Muscat for orders placed before 11:00 AM. This service supports:\n\n• Research laboratories with time-sensitive experiments\n• QC departments facing production deadlines\n• Educational institutions with practical classes\n• Hospitals and clinical laboratories",
      "**Quality Assurance:**\n\nAll laboratory chemicals come with:\n• Certificate of Analysis (CoA)\n• Lot-specific purity documentation\n• Proper labeling and packaging\n• MSDS/SDS documentation\n\nContact our laboratory chemicals team for quotes and availability. We source from ISO 17034 accredited manufacturers for certified reference materials."
    ],
    category: "Product Updates",
    date: "2024-10-20",
    author: "Global Chemicals LLC",
    readTime: "4 min read",
    image: "/images/blog/laboratory-chemicals.jpg",
    featured: false,
    relatedProducts: ["AR Grade Chemicals", "HPLC Solvents", "pH Buffer Solutions", "Laboratory Reagents"]
  },
  {
    id: 9,
    title: "Corrosion Inhibitors for Oman's Oil & Gas Operations: Selection Guide",
    excerpt: "High H2S content and elevated temperatures make corrosion control critical in Oman's oilfields. Compare film-forming inhibitors, organic vs inorganic options, and monitoring best practices.",
    content: [
      "Corrosion is the leading cause of pipeline failures and equipment degradation in Oman's oil and gas operations. Many fields produce sour gas with high H2S content, combined with elevated temperatures and challenging water chemistry, making effective corrosion control essential.",
      "**Understanding Corrosion in Oman Operations:**\n\n• **CO2 Corrosion** - Forms carbonic acid in presence of water\n• **H2S Corrosion** - Creates sulfide stress cracking and pitting\n• **Organic Acid Corrosion** - From formation fluids\n• **Microbiologically Influenced Corrosion (MIC)** - In stagnant systems\n\nOman's high H2S fields require specialized treatment programs combining corrosion inhibitors with H2S scavenging.",
      "**Types of Corrosion Inhibitors:**\n\n**Film-Forming Inhibitors:**\n• Imidazoline-based - Excellent for high-H2S environments\n• Quaternary ammonium compounds - Good general protection\n• Phosphate esters - Effective in mixed CO2/H2S systems\n\n**Application Methods:**\n• Continuous injection - Standard for wet gas and high-water-cut systems\n• Batch treatments - Suitable for low-water producers\n• Squeeze treatments - For downhole protection",
      "**Selection Criteria for Oman Conditions:**\n\n1. H2S concentration in produced fluids\n2. Operating temperature range\n3. Water cut and water chemistry\n4. Flow regime (turbulent vs. laminar)\n5. Compatibility with other production chemicals\n6. Environmental and HSE requirements",
      "**Monitoring and Optimization:**\n\n• **Target corrosion rates:** Below 0.1 mm/year for carbon steel\n• **Inhibitor residuals:** Maintain 50-200 ppm at system endpoints\n• **Monitoring methods:** Corrosion coupons, ER probes, iron counts\n• **Regular testing:** Verify inhibitor effectiveness quarterly\n\nGlobal Chemicals LLC supplies corrosion inhibitors from leading manufacturers with technical support for selection and optimization. Contact us for laboratory testing and field trial programs."
    ],
    category: "Technical Guides",
    date: "2024-10-15",
    author: "Global Chemicals Technical Team",
    readTime: "9 min read",
    image: "/images/blog/corrosion-inhibitors.jpg",
    featured: false,
    relatedProducts: ["Corrosion Inhibitors", "H2S Scavengers", "Scale Inhibitors", "Biocides"]
  },
];

const categories = [
  "All",
  "Industry News",
  "Product Updates",
  "Technical Guides",
  "Case Studies",
  "Safety & Compliance",
  "Company News",
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  // Breadcrumb items for structured data
  const breadcrumbItems = selectedPost
    ? [
        { name: 'Home', url: 'https://www.gcoman.com/' },
        { name: 'Blog', url: 'https://www.gcoman.com/blog' },
        { name: selectedPost.title, url: `https://www.gcoman.com/blog/${selectedPost.id}` }
      ]
    : [
        { name: 'Home', url: 'https://www.gcoman.com/' },
        { name: 'Blog', url: 'https://www.gcoman.com/blog' }
      ];

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

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

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={selectedPost
          ? `${selectedPost.title} | Global Chemicals LLC Blog`
          : "Chemical Industry Blog Oman | News & Guides | Global Chemicals LLC"
        }
        description={selectedPost
          ? selectedPost.excerpt
          : "Expert chemical industry insights for Oman: water treatment guides for Muscat desalination plants, industrial lubricant selection for Sohar factories, oil & gas chemical solutions for PDO operations. Trusted technical advice from Oman's leading chemical supplier."
        }
        keywords="chemical industry blog Oman, water treatment chemicals Muscat, desalination chemicals Oman, industrial lubricants Sohar, oilfield chemicals PDO, chemical safety Oman, laboratory chemicals Muscat, swimming pool chemicals Oman, chemical supplier news Oman, industrial chemicals Salalah, Duqm chemicals, Rusayl industrial chemicals"
        ogTitle={selectedPost
          ? `${selectedPost.title} | Global Chemicals LLC`
          : "Chemical Industry Blog & Technical Guides | Global Chemicals LLC Oman"
        }
        ogDescription={selectedPost
          ? selectedPost.excerpt
          : "Expert insights on water treatment, lubricants, laboratory chemicals & oilfield solutions for Oman industries. Trusted guidance from Muscat's leading chemical supplier."
        }
        ogUrl="https://www.gcoman.com/blog"
        canonical="https://www.gcoman.com/blog"
      />
      <LocalBusinessStructuredData />
      {selectedPost ? (
        <ArticleStructuredData
          title={selectedPost.title}
          description={selectedPost.excerpt}
          url={`https://www.gcoman.com/blog/${selectedPost.id}`}
          author={selectedPost.author}
          publishedDate={selectedPost.date}
          category={selectedPost.category}
        />
      ) : (
        <BlogListingStructuredData posts={blogPosts} />
      )}
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Navigation />
      <WhatsAppButton />

      {selectedPost ? (
        /* Article Detail View */
        <article className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={handleBackToList}
                className="mb-6 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Articles
              </Button>

              {/* Article Header */}
              <header className="mb-8">
                <Badge className="mb-4">{selectedPost.category}</Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                  {selectedPost.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {selectedPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedPost.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readTime}
                  </div>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {selectedPost.excerpt}
                </p>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {selectedPost.content.map((paragraph, index) => (
                  <div key={index} className="mb-6">
                    {paragraph.split('\n').map((line, lineIndex) => (
                      <p key={lineIndex} className="text-muted-foreground leading-relaxed mb-3 whitespace-pre-wrap">
                        {renderContent(line)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Related Products */}
              {selectedPost.relatedProducts && selectedPost.relatedProducts.length > 0 && (
                <section className="mt-12 p-6 bg-muted/50 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Related Products from Global Chemicals LLC</h2>
                  <p className="text-sm text-muted-foreground mb-4">Click on any product to explore our catalog:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedPost.relatedProducts.map((product, index) => (
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
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link to="/products">View All Products</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/contact">Request Quote</Link>
                    </Button>
                  </div>
                </section>
              )}

              {/* CTA Section */}
              <section className="mt-12 bg-primary/10 rounded-lg p-6 sm:p-8 text-center">
                <h2 className="text-2xl font-bold mb-3">Need Expert Advice?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our technical team is ready to help with product selection, dosing recommendations, and application guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/contact">Contact Our Team</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="https://wa.me/96893754388" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp Us
                    </a>
                  </Button>
                </div>
              </section>

              {/* Back to Articles */}
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={handleBackToList}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse More Articles
                </Button>
              </div>
            </div>
          </div>
        </article>
      ) : (
        /* Blog Listing View */
        <>
          {/* Hero Section */}
          <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center animate-fade-in">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Blog & Industry News
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  Stay informed with the latest insights, innovations, and expert guidance in the chemical industry
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    className="pl-12 py-6"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Category Filters */}
          <section className="py-8 border-b border-border bg-background sticky top-0 z-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                {/* Featured Article */}
                {featuredPost && selectedCategory === "All" && !searchQuery && (
                  <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-1 h-8 bg-primary rounded-full"></span>
                      Featured Article
                    </h2>
                    <Card
                      className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
                      onClick={() => handlePostClick(featuredPost)}
                    >
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div className="relative h-64 lg:h-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent group-hover:from-primary/30 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center p-6">
                              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                                <Tag className="w-8 h-8 text-primary" />
                              </div>
                              <span className="text-sm text-muted-foreground font-medium">Featured Article</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                          <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                          <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                            {featuredPost.title}
                          </h3>
                          <p className="text-muted-foreground mb-6 text-lg">
                            {featuredPost.excerpt}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {featuredPost.author}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(featuredPost.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {featuredPost.readTime}
                            </div>
                          </div>
                          <Button className="w-fit group/btn">
                            Read Full Article
                            <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group cursor-pointer"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="relative h-48 bg-gradient-to-br from-primary/10 via-muted to-secondary/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                            <Tag className="w-6 h-6 text-primary/60" />
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full group/btn">
                          Read More
                          <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* No Results */}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">
                      No articles found matching your criteria. Try adjusting your filters or search query.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Cross-Links to Resources */}
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                  Explore More Resources
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Industry Guides</CardTitle>
                      </div>
                      <CardDescription>
                        In-depth technical guides on water treatment, lubricants, laboratory chemicals, and oil & gas production chemicals for Oman industries.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link to="/resources">
                          Browse Industry Guides
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Download className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Downloads Center</CardTitle>
                      </div>
                      <CardDescription>
                        Download product catalogs, safety data sheets, technical documents, and brochures for Global Chemicals LLC products.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/resources">
                          Access Downloads
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-16 bg-gradient-to-br from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Tag className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Subscribe to our newsletter for the latest industry insights, product updates, and expert guidance delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1"
                  />
                  <Button size="lg">
                    Subscribe Now
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Blog;
