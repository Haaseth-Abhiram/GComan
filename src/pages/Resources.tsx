import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  Beaker,
  Search,
  Filter
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  icon: any;
  badge?: string;
}

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'catalogs', label: 'Product Catalogs' },
    { id: 'sds', label: 'Safety Data Sheets' },
    { id: 'technical', label: 'Technical Documents' },
    { id: 'certificates', label: 'Certifications' },
    { id: 'guides', label: 'Industry Guides' },
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Complete Product Catalog 2024',
      description: 'Comprehensive catalog featuring our full range of industrial chemicals and laboratory supplies',
      category: 'catalogs',
      fileSize: '12.5 MB',
      icon: BookOpen,
      badge: 'New'
    },
    {
      id: '2',
      title: 'Safety Data Sheets Collection',
      description: 'Complete SDS documentation for all chemical products including handling and storage guidelines',
      category: 'sds',
      fileSize: '8.2 MB',
      icon: ShieldCheck,
      badge: 'Updated'
    },
    {
      id: '3',
      title: 'ISO Certifications Package',
      description: 'Official ISO 9001, ISO 14001, and ISO 45001 certification documents',
      category: 'certificates',
      fileSize: '2.1 MB',
      icon: Award
    },
    {
      id: '4',
      title: 'Chemical Storage Guidelines',
      description: 'Technical guide for proper storage, handling, and disposal of industrial chemicals',
      category: 'technical',
      fileSize: '3.8 MB',
      icon: FileText
    },
    {
      id: '5',
      title: 'Laboratory Equipment Manual',
      description: 'Detailed specifications and usage instructions for laboratory equipment and instruments',
      category: 'technical',
      fileSize: '6.4 MB',
      icon: Beaker
    },
    {
      id: '6',
      title: 'Water Treatment Solutions Guide',
      description: 'Industry best practices and product recommendations for water treatment applications',
      category: 'guides',
      fileSize: '4.7 MB',
      icon: BookOpen
    },
    {
      id: '7',
      title: 'Pharmaceutical Grade Chemicals',
      description: 'Specialized catalog for pharmaceutical industry with compliance documentation',
      category: 'catalogs',
      fileSize: '9.3 MB',
      icon: BookOpen
    },
    {
      id: '8',
      title: 'Quality Assurance Certificates',
      description: 'Certificate of Analysis (COA) templates and quality assurance documentation',
      category: 'certificates',
      fileSize: '1.9 MB',
      icon: Award
    },
    {
      id: '9',
      title: 'Oil & Gas Industry Solutions',
      description: 'Technical guide for chemical applications in oil and gas sector operations',
      category: 'guides',
      fileSize: '5.6 MB',
      icon: FileText
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (resourceTitle: string) => {
    // In production, this would trigger actual file download
    console.log('Downloading:', resourceTitle);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Resource Center
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Download product catalogs, safety data sheets, technical documentation, and certifications
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
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
                          onClick={() => handleDownload(resource.title)}
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center">
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
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
