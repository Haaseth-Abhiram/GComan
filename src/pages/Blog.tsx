import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Tag, ArrowRight, TrendingUp, Beaker, Droplets, Factory, Leaf } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
  icon: any;
}

const blogPosts: BlogPost[] = [
  {
    id: 'top-chemical-suppliers-oman-2026',
    title: 'Top Chemical Suppliers in Oman 2026: Industry Guide',
    excerpt: 'A comprehensive guide to the leading chemical suppliers serving Oman\'s industrial sectors in 2026. Compare capabilities, certifications, product ranges, and service quality to find the right chemical partner for your business.',
    content: 'Oman\'s chemical supply industry continues to grow in 2026, driven by expansion in oil & gas, construction, and manufacturing sectors...',
    author: 'Global Chemicals Editorial Team',
    date: '2026-02-15',
    readTime: '10 min read',
    category: 'Industry Guide',
    tags: ['Chemical Suppliers', 'Oman', 'Industry Guide'],
    icon: TrendingUp,
  },
  {
    id: 'water-treatment-chemicals-muscat-oman',
    title: 'Water Treatment Chemicals for Industrial Use in Muscat, Oman',
    excerpt: 'Essential guide to selecting and using water treatment chemicals for industrial applications in Muscat. Covers PAC, calcium hypochlorite, antiscalants, and dosing best practices for Oman\'s unique water conditions.',
    content: 'Industrial water treatment in Muscat requires specialized chemical solutions due to high salinity, elevated temperatures, and stringent environmental regulations...',
    author: 'Global Chemicals Technical Team',
    date: '2026-02-10',
    readTime: '8 min read',
    category: 'Water Treatment',
    tags: ['Water Treatment', 'Muscat', 'Industrial'],
    icon: Droplets,
  },
  {
    id: 'agricultural-chemicals-oman-buyers-guide',
    title: 'Agricultural Chemicals in Oman: A Complete Buyer\'s Guide',
    excerpt: 'Everything you need to know about sourcing agricultural chemicals in Oman. From fertilizers and soil conditioners to crop protection products, this guide helps farmers and agricultural businesses make informed purchasing decisions.',
    content: 'Oman\'s agricultural sector is transforming under the nation\'s food security strategy, creating growing demand for quality agricultural chemicals...',
    author: 'Business Development Team',
    date: '2026-02-05',
    readTime: '9 min read',
    category: 'Industry Guide',
    tags: ['Agricultural Chemicals', 'Oman', 'Buyer Guide'],
    icon: Leaf,
  },
  {
    id: 'water-treatment-trends-2025',
    title: 'Water Treatment Trends in Oman: What to Expect in 2025',
    excerpt: 'Explore the latest innovations in water treatment technology and sustainable practices shaping Oman\'s desalination and wastewater sectors.',
    content: 'As Oman continues to invest heavily in water infrastructure, 2025 promises breakthrough advances in desalination efficiency, smart monitoring systems, and green chemistry applications...',
    author: 'Global Chemicals Technical Team',
    date: '2024-12-15',
    readTime: '6 min read',
    category: 'Water Treatment',
    tags: ['Desalination', 'Innovation', 'Sustainability'],
    icon: Droplets,
  },
  {
    id: 'industrial-lubricants-guide',
    title: 'Complete Guide to Industrial Lubricants Selection for Oman Climate',
    excerpt: 'Learn how to choose the right lubricants for extreme heat conditions and extend equipment life in Oman\'s challenging industrial environment.',
    content: 'Operating industrial equipment in Oman\'s high-temperature environment requires careful lubricant selection. This comprehensive guide covers viscosity grades, thermal stability requirements...',
    author: 'Lubrication Specialists',
    date: '2024-12-10',
    readTime: '8 min read',
    category: 'Industrial Chemicals',
    tags: ['Lubricants', 'Maintenance', 'Best Practices'],
    icon: Factory,
  },
  {
    id: 'green-chemistry-oman',
    title: 'Green Chemistry Initiatives: Sustainable Chemical Solutions in Oman',
    excerpt: 'Discover how Oman\'s industrial sector is adopting eco-friendly chemical alternatives and reducing environmental impact.',
    content: 'The shift toward green chemistry in Oman reflects growing environmental awareness and regulatory requirements. From biodegradable cleaners to low-VOC solvents...',
    author: 'Sustainability Team',
    date: '2024-12-05',
    readTime: '7 min read',
    category: 'Sustainability',
    tags: ['Green Chemistry', 'Environment', 'Regulations'],
    icon: Leaf,
  },
  {
    id: 'lab-chemical-safety',
    title: 'Laboratory Chemical Safety: Essential Protocols for Omani Labs',
    excerpt: 'Critical safety guidelines and best practices for handling laboratory chemicals in research and industrial settings.',
    content: 'Proper laboratory chemical safety protocols are non-negotiable in modern facilities. This guide covers storage requirements, PPE selection, emergency procedures...',
    author: 'Safety & Compliance Team',
    date: '2024-12-01',
    readTime: '10 min read',
    category: 'Safety',
    tags: ['Laboratory', 'Safety', 'Compliance'],
    icon: Beaker,
  },
  {
    id: 'oil-gas-chemicals-trends',
    title: 'Oil & Gas Chemical Innovations: Enhancing Production in Oman',
    excerpt: 'Latest developments in oilfield chemicals, enhanced oil recovery, and production optimization technologies.',
    content: 'Oman\'s oil and gas sector continues to evolve with advanced chemical solutions. From corrosion inhibitors to scale preventers and enhanced recovery agents...',
    author: 'Oil & Gas Specialists',
    date: '2024-11-28',
    readTime: '9 min read',
    category: 'Oil & Gas',
    tags: ['Oilfield', 'Production', 'Innovation'],
    icon: TrendingUp,
  },
  {
    id: 'cooling-tower-maintenance',
    title: 'Cooling Tower Chemical Treatment: Best Practices for Oman',
    excerpt: 'Optimize cooling tower performance and prevent scaling, corrosion, and biological growth in hot climates.',
    content: 'Effective cooling tower maintenance in Oman\'s extreme heat requires specialized chemical programs. Learn about proper biocide selection, scale inhibition strategies...',
    author: 'Water Treatment Team',
    date: '2024-11-25',
    readTime: '7 min read',
    category: 'Water Treatment',
    tags: ['Cooling Tower', 'Maintenance', 'Efficiency'],
    icon: Droplets,
  },
];

const categories = ['All', 'Water Treatment', 'Industrial Chemicals', 'Sustainability', 'Safety', 'Oil & Gas', 'Industry Guide'];

const Blog = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Chemical Industry Blog | Technical Articles & Insights | Global Chemicals Oman"
        description="Expert insights on water treatment, industrial chemicals, laboratory safety, and oil & gas innovations in Oman. Technical articles, guides, and industry trends from Global Chemicals LLC."
        keywords="chemical industry blog Oman, water treatment articles, industrial chemicals guide, laboratory safety Oman, oil gas chemicals, chemical news Muscat, technical articles Oman"
        ogTitle="Chemical Industry Blog & Technical Articles | Global Chemicals Oman"
        ogDescription="Expert chemical industry insights, technical guides, and innovations. Stay updated with the latest trends in water treatment, industrial chemicals, and safety practices in Oman."
        canonical="https://www.gcoman.com/blog"
      />

      <Navigation />
      <WhatsAppButton />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Chemical Industry Insights & Technical Articles
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Expert guidance on water treatment, industrial chemicals, safety protocols, and industry innovations in Oman
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Featured Post */}
              {selectedCategory === 'All' && (
                <Card className="mb-12 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-2 gap-8 p-8">
                    <div className="flex flex-col justify-center">
                      <Badge className="w-fit mb-4">{blogPosts[0].category}</Badge>
                      <h2 className="text-3xl font-bold mb-4 text-foreground">
                        {blogPosts[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-6 text-lg">
                        {blogPosts[0].excerpt}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(blogPosts[0].date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {blogPosts[0].readTime}
                        </div>
                      </div>
                      <Link to={`/resources`}>
                        <Button size="lg" className="w-fit">
                          Read Article <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-12">
                      {(() => {
                        const FeaturedIcon = blogPosts[0].icon;
                        return <FeaturedIcon className="h-32 w-32 text-primary" />;
                      })()}
                    </div>
                  </div>
                </Card>
              )}

              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(selectedCategory === 'All' ? 1 : 0).map((post) => {
                  const IconComponent = post.icon;
                  return (
                    <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all group">
                      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-12 flex items-center justify-center">
                        <IconComponent className="h-20 w-20 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="p-6">
                        <Badge variant="outline" className="mb-3">
                          {post.category}
                        </Badge>
                        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Link to={`/resources`}>
                          <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Call to Action */}
              <div className="mt-16 text-center">
                <Card className="p-12 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <h2 className="text-3xl font-bold mb-4">Need Expert Chemical Consultation?</h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Our technical team is ready to help you with product selection, technical support, and custom chemical solutions for your specific needs.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/contact">
                      <Button size="lg">Contact Our Team</Button>
                    </Link>
                    <Link to="/resources">
                      <Button size="lg" variant="outline">Browse Technical Guides</Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
