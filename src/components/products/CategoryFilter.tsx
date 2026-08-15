import { Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube, Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound, Flame, Wind, Wine, Shield, SprayCan } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'group relative flex flex-col items-center gap-2 p-4 rounded-lg logo-gradient-border transition-all duration-300 hover:scale-105',
              isActive
                ? 'bg-primary/5 shadow-lg'
                : 'bg-card hover:shadow-md'
            )}
          >
            <div
              className={cn(
                'p-3 rounded-full transition-colors',
                isActive ? 'bg-primary/10' : 'bg-muted'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                )}
              />
            </div>
            <span
              className={cn(
                'text-xs sm:text-sm font-medium text-center leading-tight transition-colors',
                isActive ? 'text-primary' : 'text-foreground'
              )}
            >
              {category.name}
            </span>
            <span
              className={cn(
                'text-xs transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {category.count} products
            </span>
          </button>
        );
      })}
    </div>
  );
};
