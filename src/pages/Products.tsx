import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube } from 'lucide-react';

const Products = () => {
  const products = [
    {
      icon: FlaskConical,
      title: 'Calcium Carbonate',
      description:
        'High-purity calcium carbonate for various industrial applications including plastics, paint, and paper industries.',
      category: 'Specialty Chemicals',
    },
    {
      icon: Wrench,
      title: 'Lubricants & Greases',
      description:
        'Premium quality lubricants and greases designed for industrial machinery and automotive applications.',
      category: 'Industrial',
    },
    {
      icon: Droplets,
      title: 'Water Treatment',
      description:
        'Comprehensive range of chemicals for water and wastewater treatment, ensuring clean and safe water.',
      category: 'Treatment Solutions',
    },
    {
      icon: Zap,
      title: 'Additives',
      description:
        'Specialized additives to enhance product performance across multiple industries and applications.',
      category: 'Performance',
    },
    {
      icon: TestTube,
      title: 'Lab Equipment',
      description:
        'Professional laboratory equipment and instruments for research, quality control, and testing facilities.',
      category: 'Laboratory',
    },
    {
      icon: Beaker,
      title: 'Lab Chemicals',
      description:
        'High-grade laboratory chemicals and reagents for analytical and research applications.',
      category: 'Laboratory',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <WhatsAppButton />

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Products</h1>
            <p className="text-lg text-muted-foreground">
              High-quality chemical solutions for diverse industrial needs
            </p>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in-up">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Global Chemicals LLC specializes in supplying a wide range of high-quality chemicals for various
              industries. We take pride in offering exceptional solutions that meet the unique needs of our customers.
              Our diverse product portfolio includes:
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {products.map((product, index) => {
              const Icon = product.icon;
              return (
                <Card
                  key={index}
                  className="group p-6 hover:shadow-xl transition-all animate-fade-in border-border hover:border-primary/50 cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                    <button className="text-primary font-semibold text-sm hover:underline flex items-center gap-2 group/btn">
                      Learn More
                      <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-4">Why Choose Our Products</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              We continuously strive to expand our product offerings, staying at the forefront of industry trends and
              innovations.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Comprehensive Range',
                  description: 'Wide selection of specialty and commodity chemicals for all your industrial needs.',
                },
                {
                  title: 'Quality Assured',
                  description:
                    'Every product meets stringent quality standards and undergoes rigorous testing procedures.',
                },
                {
                  title: 'Expert Support',
                  description:
                    'Technical support and guidance from our team of experienced chemical industry professionals.',
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-card rounded-lg border border-border animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
