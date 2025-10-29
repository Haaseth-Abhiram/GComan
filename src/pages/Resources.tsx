import { useState, useEffect } from 'react';
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
import BrochureProductsList from '@/assets/brochures/Global-Chemicals-Products-List.pdf';
import { DownloadGateDialog } from '@/components/DownloadGateDialog';

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

  useEffect(() => {
    // SEO Meta Tags
    document.title = 'Resources & Downloads | SDS, Catalogs, Technical Guides | Global Chemicals LLC';
    
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

    updateOrCreateMeta('description', 'Download chemical product catalogs, safety data sheets (SDS), technical guides, certifications, and industry resources from Global Chemicals LLC. Free access to essential chemical documentation.');
    updateOrCreateMeta('keywords', 'chemical SDS download, product catalogs, safety data sheets, ISO certificates, technical guides, chemical documentation, brochures download');
    
    // Open Graph
    updateOrCreateMeta('og:title', 'Chemical Resources & Downloads | SDS, Catalogs, Guides | Global Chemicals LLC', true);
    updateOrCreateMeta('og:description', 'Access comprehensive chemical resources: product catalogs, safety data sheets, technical documentation, and certifications. Download now.', true);
    updateOrCreateMeta('og:url', 'https://www.gcoman.com/resources', true);
    
    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://www.gcoman.com/resources');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://www.gcoman.com/resources');
      document.head.appendChild(canonical);
    }
  }, []);

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
      title: 'Global Chemicals Products List',
      description: 'Comprehensive list of all available chemical products with specifications and applications',
      category: 'catalogs',
      fileSize: '2.1 MB',
      icon: FileText,
      badge: 'New',
      downloadUrl: BrochureProductsList
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

      {/* Main Content with Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="downloads" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 sm:mb-12 bg-muted/30 p-1 rounded-lg border border-border">
              <TabsTrigger 
                value="downloads" 
                className="text-sm sm:text-base py-2.5 sm:py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground rounded-md transition-all"
              >
                Downloads
              </TabsTrigger>
              <TabsTrigger 
                value="articles" 
                className="text-sm sm:text-base py-2.5 sm:py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground rounded-md transition-all"
              >
                Articles & News
              </TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-12">
              {/* Stay Updated Message */}
              <div className="max-w-2xl mx-auto text-center py-16 px-4">
                <div className="mb-8">
                  <Tag className="w-16 h-16 text-primary mx-auto mb-6 animate-fade-in" />
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fade-in">Stay Updated</h2>
                  <p className="text-lg text-muted-foreground animate-fade-in">
                    Our articles and industry news section is coming soon. Subscribe to our newsletter to receive the latest updates, product announcements, and technical insights directly to your inbox.
                  </p>
                </div>
                
                <Card className="max-w-xl mx-auto animate-fade-in">
                  <CardHeader>
                    <CardTitle>Subscribe to Our Newsletter</CardTitle>
                    <CardDescription>
                      Get the latest chemical industry insights and product updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1"
                      />
                      <Button className="w-full sm:w-auto">
                        Subscribe Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
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