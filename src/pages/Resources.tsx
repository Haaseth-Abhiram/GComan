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
  Tag
} from 'lucide-react';
import BrochureGlobal from '@/assets/brochures/Global-Chemicals-LLC-Brochure.pdf';
import BrochureCDC from '@/assets/brochures/CDC-Anti-Clog-Brochure.pdf';
import BrochureProducts from '@/assets/brochures/Global-Chemicals-Products-Brochure.pdf';

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

  const downloadCategories = [
    { id: 'all', label: 'All Resources' },
    { id: 'catalogs', label: 'Product Catalogs' },
    { id: 'sds', label: 'Safety Data Sheets' },
    { id: 'technical', label: 'Technical Documents' },
    { id: 'certificates', label: 'Certifications' },
    { id: 'guides', label: 'Industry Guides' },
  ];

  const articleCategories = [
    "All",
    "Industry News",
    "Product Updates",
    "Technical Guides",
    "Case Studies",
    "Safety & Compliance",
    "Company News",
  ];

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
      title: 'Safety Data Sheets Collection',
      description: 'Complete SDS documentation for all chemical products including handling and storage guidelines',
      category: 'sds',
      fileSize: '8.2 MB',
      icon: ShieldCheck,
      badge: 'Updated'
    },
    {
      id: '5',
      title: 'ISO Certifications Package',
      description: 'Official ISO 9001, ISO 14001, and ISO 45001 certification documents',
      category: 'certificates',
      fileSize: '2.1 MB',
      icon: Award
    },
    {
      id: '6',
      title: 'Chemical Storage Guidelines',
      description: 'Technical guide for proper storage, handling, and disposal of industrial chemicals',
      category: 'technical',
      fileSize: '3.8 MB',
      icon: FileText
    },
    {
      id: '7',
      title: 'Laboratory Equipment Manual',
      description: 'Detailed specifications and usage instructions for laboratory equipment and instruments',
      category: 'technical',
      fileSize: '6.4 MB',
      icon: Beaker
    },
    {
      id: '8',
      title: 'Water Treatment Solutions Guide',
      description: 'Industry best practices and product recommendations for water treatment applications',
      category: 'guides',
      fileSize: '4.7 MB',
      icon: BookOpen
    },
    {
      id: '9',
      title: 'Quality Assurance Certificates',
      description: 'Certificate of Analysis (COA) templates and quality assurance documentation',
      category: 'certificates',
      fileSize: '1.9 MB',
      icon: Award
    },
    {
      id: '10',
      title: 'Oil & Gas Industry Solutions',
      description: 'Technical guide for chemical applications in oil and gas sector operations',
      category: 'guides',
      fileSize: '5.6 MB',
      icon: FileText
    }
  ];

  const articles: Article[] = [
    {
      id: 1,
      title: "Latest Innovations in Water Treatment Technology",
      excerpt: "Discover how advanced chemical solutions are revolutionizing water treatment processes across industries.",
      category: "Industry News",
      date: "2024-03-15",
      author: "Dr. Sarah Johnson",
      readTime: "5 min read",
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
      featured: false,
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedDownloadCategory === 'all' || resource.category === selectedDownloadCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedArticleCategory === "All" || article.category === selectedArticleCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = articles.find((article) => article.featured);
  const regularArticles = filteredArticles.filter((article) => !article.featured);

  const handleDownload = (resource: Resource) => {
    if (resource.downloadUrl) {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = resource.downloadUrl;
      link.download = resource.title.replace(/\s+/g, '-') + '.pdf';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `${resource.title} is being downloaded.`,
      });
    } else {
      toast({
        title: "Coming Soon",
        description: "This resource will be available for download soon. Please contact us for immediate access.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Resources & Insights
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
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

      {/* Main Content with Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="articles" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="articles" className="text-base">Articles & News</TabsTrigger>
              <TabsTrigger value="downloads" className="text-base">Downloads</TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-12">
              {/* Article Category Filters */}
              <div className="flex flex-wrap gap-3 justify-center">
                {articleCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedArticleCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedArticleCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Featured Article */}
              {featuredArticle && selectedArticleCategory === "All" && !searchQuery && (
                <div>
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
                        <Badge className="w-fit mb-4">{featuredArticle.category}</Badge>
                        <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                          {featuredArticle.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 text-lg">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {featuredArticle.author}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredArticle.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {featuredArticle.readTime}
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
                {regularArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                    <div className="relative h-48 bg-muted">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:from-primary/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Article Image
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">{article.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.date).toLocaleDateString('en-US', { 
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

              {/* No Articles Found */}
              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found matching your criteria.</p>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="mt-16 bg-gradient-to-br from-primary/5 to-background rounded-lg p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center">
                  <Tag className="w-12 h-12 text-primary mx-auto mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Subscribe for the latest industry insights, product updates, and expert guidance.
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
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads" className="space-y-8">
              {/* Download Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
                {downloadCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedDownloadCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedDownloadCategory(category.id)}
                    className="whitespace-nowrap"
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
              <div className="mt-12 bg-primary/5 rounded-lg p-8 md:p-12">
                <Card className="max-w-3xl mx-auto text-center border-0 shadow-none bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">
                      Need Custom Documentation?
                    </CardTitle>
                    <CardDescription className="text-base mt-4">
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
    </div>
  );
};

export default Resources;