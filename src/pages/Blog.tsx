import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Calendar, Clock, User, Search, ChevronRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { BlogListingStructuredData, BreadcrumbStructuredData } from '@/components/StructuredData';

// Blog articles - Real content for SEO
const blogPosts = [
  {
    id: 1,
    title: "Water Treatment Chemicals in Oman: Complete Guide for 2024",
    excerpt: "A comprehensive overview of water treatment chemicals used in Oman's desalination plants, municipal facilities, and industrial operations. Learn about PAC, calcium hypochlorite, antiscalants, and best practices for Oman's unique water challenges.",
    category: "Technical Guides",
    date: "2024-12-01",
    author: "Global Chemicals Technical Team",
    readTime: "8 min read",
    image: "/images/blog/water-treatment-oman.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Chemical Storage Safety in Oman's Hot Climate: Essential Guidelines",
    excerpt: "Industrial chemicals require special handling in Oman's extreme temperatures. This guide covers proper storage conditions, temperature management, and safety protocols for chemical warehouses in Muscat, Sohar, and industrial zones.",
    category: "Safety & Compliance",
    date: "2024-11-28",
    author: "HSE Department",
    readTime: "6 min read",
    image: "/images/blog/chemical-safety-storage.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Global Chemicals LLC Achieves JSRS Certification Renewal for 2024-2025",
    excerpt: "We are proud to announce the renewal of our JSRS (Joint Supplier Registration System) certification, reinforcing our commitment to serving Oman's oil and gas sector with quality chemicals and reliable supply.",
    category: "Company News",
    date: "2024-11-20",
    author: "Global Chemicals LLC",
    readTime: "3 min read",
    image: "/images/blog/jsrs-certification.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Choosing the Right Lubricant for Oman's Industrial Equipment",
    excerpt: "High temperatures and dusty conditions demand premium lubricants. Compare Shell, Mobil, and Castrol products for hydraulic systems, gearboxes, and compressors in Oman's manufacturing and oil & gas sectors.",
    category: "Technical Guides",
    date: "2024-11-15",
    author: "Global Chemicals Technical Team",
    readTime: "7 min read",
    image: "/images/blog/industrial-lubricants.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "How Sohar Industrial Zone Companies Optimize Chemical Procurement",
    excerpt: "Case study on how manufacturing facilities in Sohar Industrial Zone reduced chemical costs by 15% through consolidated procurement, just-in-time delivery, and technical support from local suppliers.",
    category: "Case Studies",
    date: "2024-11-10",
    author: "Business Development Team",
    readTime: "5 min read",
    image: "/images/blog/sohar-industrial.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "Swimming Pool Chemicals: Maintaining Crystal Clear Water in Oman's Summer",
    excerpt: "Hotels, resorts, and residential pools in Oman face unique challenges during summer months. Learn proper chlorination, pH management, and algae prevention techniques for optimal pool water quality.",
    category: "Technical Guides",
    date: "2024-11-05",
    author: "Global Chemicals Technical Team",
    readTime: "6 min read",
    image: "/images/blog/pool-chemicals-oman.jpg",
    featured: false,
  },
  {
    id: 7,
    title: "Understanding Oman's Chemical Import Regulations and Compliance",
    excerpt: "Navigate Oman's regulatory framework for industrial chemicals. This guide covers Ministry of Commerce requirements, environmental permits, and documentation needed for chemical imports and distribution.",
    category: "Safety & Compliance",
    date: "2024-10-28",
    author: "Compliance Team",
    readTime: "8 min read",
    image: "/images/blog/regulations-compliance.jpg",
    featured: false,
  },
  {
    id: 8,
    title: "New: Extended Laboratory Chemical Range Now Available in Muscat",
    excerpt: "Global Chemicals LLC expands laboratory chemical inventory with AR grade reagents, HPLC solvents, and buffer solutions. Same-day delivery available in Muscat for urgent research and QC requirements.",
    category: "Product Updates",
    date: "2024-10-20",
    author: "Global Chemicals LLC",
    readTime: "4 min read",
    image: "/images/blog/laboratory-chemicals.jpg",
    featured: false,
  },
  {
    id: 9,
    title: "Corrosion Inhibitors for Oman's Oil & Gas Operations: Selection Guide",
    excerpt: "High H2S content and elevated temperatures make corrosion control critical in Oman's oilfields. Compare film-forming inhibitors, organic vs inorganic options, and monitoring best practices.",
    category: "Technical Guides",
    date: "2024-10-15",
    author: "Global Chemicals Technical Team",
    readTime: "9 min read",
    image: "/images/blog/corrosion-inhibitors.jpg",
    featured: false,
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

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  // Breadcrumb items for structured data
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.gcoman.com/' },
    { name: 'Blog', url: 'https://www.gcoman.com/blog' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Blog & News | Global Chemicals LLC"
        description="Chemical industry news, water treatment tips, laboratory best practices & product updates from Global Chemicals LLC Oman experts. Read the latest insights."
        keywords="chemical industry blog, chemical news Oman, technical guides chemicals, safety best practices, chemical innovations, industry insights, water treatment blog, oil gas chemicals news"
        ogTitle="Chemical Industry Blog & News | Global Chemicals LLC"
        ogDescription="Expert insights, industry news, and technical guidance for chemical applications across Oman's key sectors."
        ogUrl="https://www.gcoman.com/blog"
        canonical="https://www.gcoman.com/blog"
      />
      <BlogListingStructuredData posts={blogPosts} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Navigation />
      <WhatsAppButton />

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
                <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
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
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
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

      <Footer />
    </div>
  );
};

export default Blog;
