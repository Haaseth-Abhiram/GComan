import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Beaker, Droplets, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import waterTreatmentImg from '@/assets/products/water-treatment.jpg';
import oilGasImg from '@/assets/products/oil-gas.jpg';
import industrialLubricantsImg from '@/assets/products/industrial-lubricants.jpg';

const FeaturedProducts = () => {
  const products = [
    {
      icon: Droplets,
      name: 'Water Treatment Solutions',
      category: 'Treatment',
      description: 'Advanced formulations for industrial water purification and wastewater management.',
      features: ['High Efficiency', 'Cost-Effective', 'Eco-Friendly'],
      image: waterTreatmentImg,
    },
    {
      icon: Droplets,
      name: 'Oil & Gas Solutions',
      category: 'Energy',
      description: 'Specialized chemicals for drilling, production, and refining operations in the oil and gas industry.',
      features: ['Performance Proven', 'Industry Standard', 'Technical Support'],
      image: oilGasImg,
    },
    {
      icon: Wrench,
      name: 'Industrial Lubricants',
      category: 'Industrial',
      description: 'Premium lubricants engineered for maximum performance and equipment longevity.',
      features: ['Long-Lasting', 'Temperature Stable', 'Reduced Friction'],
      image: industrialLubricantsImg,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            Featured Solutions
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 px-4">
            Our Most Popular Products
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Discover our best-selling chemical solutions trusted by industries worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <Card
                key={index}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border hover:border-primary/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/products"
                    className="flex items-center gap-2 text-primary font-semibold text-sm group/link hover:gap-3 transition-all"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
          >
            View All Products
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
