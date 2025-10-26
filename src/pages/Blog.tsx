import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Calendar, Clock, User, Search, ChevronRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Sample blog data - replace with real data from CMS/API
const blogPosts = [
  {
    id: 1,
    title: "Latest Innovations in Water Treatment Technology",
    excerpt: "Discover how advanced chemical solutions are revolutionizing water treatment processes across industries.",
    category: "Industry News",
    date: "2024-03-15",
    author: "Dr. Sarah Johnson",
    readTime: "5 min read",
    image: "/placeholder.svg",
    featured: true,
  },
  {
    id: 2,
    title: "Safety Best Practices in Chemical Handling",
    excerpt: "Essential guidelines for safe storage, handling, and disposal of industrial chemicals.",
    category: "Safety & Compliance",
    date: "2024-03-12",
    author: "Ahmed Al-Rashid",
    readTime: "7 min read",
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 3,
    title: "New Product Launch: Advanced Laboratory Reagents",
    excerpt: "Introducing our latest line of high-purity laboratory chemicals for research applications.",
    category: "Product Updates",
    date: "2024-03-10",
    author: "Michael Chen",
    readTime: "4 min read",
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 4,
    title: "Sustainable Chemical Solutions for Manufacturing",
    excerpt: "How eco-friendly chemicals are helping manufacturers reduce their environmental footprint.",
    category: "Technical Guides",
    date: "2024-03-08",
    author: "Dr. Sarah Johnson",
    readTime: "6 min read",
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 5,
    title: "Case Study: Optimizing Pool Maintenance with Modern Chemicals",
    excerpt: "Learn how a major resort chain improved water quality and reduced costs with our solutions.",
    category: "Case Studies",
    date: "2024-03-05",
    author: "Hassan Al-Mansoori",
    readTime: "8 min read",
    image: "/placeholder.svg",
    featured: false,
  },
  {
    id: 6,
    title: "Understanding Chemical Compatibility in Industrial Applications",
    excerpt: "A comprehensive guide to selecting compatible chemicals for your specific needs.",
    category: "Technical Guides",
    date: "2024-03-01",
    author: "Michael Chen",
    readTime: "10 min read",
    image: "/placeholder.svg",
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

  useEffect(() => {
    // SEO Meta Tags
    document.title = 'Chemical Industry Blog & News | Expert Insights | Global Chemicals LLC';
    
    const updateOrCreateMeta = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    updateOrCreateMeta('description', 'Stay informed with Global Chemicals LLC blog. Latest chemical industry news, technical guides, safety practices, product updates, and expert insights for Oman\'s industrial sectors.');
    updateOrCreateMeta('keywords', 'chemical industry blog, chemical news Oman, technical guides chemicals, safety best practices, chemical innovations, industry insights');
    
    // Open Graph
    updateOrCreateMeta('og:title', 'Chemical Industry Blog & News | Global Chemicals LLC', true);
    updateOrCreateMeta('og:description', 'Expert insights, industry news, and technical guidance for chemical applications across Oman\'s key sectors.', true);
    updateOrCreateMeta('og:url', 'https://www.gcoman.com/blog', true);
    
    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://www.gcoman.com/blog');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://www.gcoman.com/blog');
      document.head.appendChild(canonical);
    }
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background">
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
                    <div className="relative h-64 lg:h-full bg-muted">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent group-hover:from-primary/30 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Featured Image
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
                  <div className="relative h-48 bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Article Image
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
