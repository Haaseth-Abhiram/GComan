import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  image?: string;
  details?: {
    formula?: string;
    fullDescription?: string;
    applications?: string[];
  };
}

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const Icon = product.icon;
  const productUrl = `/products/${product.category}/${product.id}`;
  
  return (
    <Link to={productUrl}>
      <Card
        className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer bg-card hover:-translate-y-1"
      >
        <div className="p-5 sm:p-6 flex flex-col h-full">
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-shrink-0 p-2.5 sm:p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1 sm:mb-2 line-clamp-2">
                {product.title}
              </h3>
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-3">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all pt-3 border-t border-border">
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
