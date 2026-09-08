import { Link } from 'react-router-dom';
import {
  Factory, Droplets, Wrench, Shield, SprayCan, Building2, Wine, Sparkles,
  FlaskConical, Zap, TestTube, Beaker, Wheat, FlaskRound, Microscope, Flame,
  Wind, Waves, ThermometerSun, ArrowRight, Star,
} from 'lucide-react';
import { withLangPrefix } from '@/lib/langRouting';

// Category ids must match the JSON filenames in src/data/products/ so the
// /products/:category routes resolve (same ids Products.tsx uses).
const CATEGORIES = [
  { id: 'water-treatment', name: 'Water Treatment', icon: Droplets },
  { id: 'oilfield', name: 'Oilfield & Refinery', icon: Factory },
  { id: 'lubricants', name: 'Lubricants & Greases', icon: Wrench },
  { id: 'lab-chemicals', name: 'Lab Chemicals', icon: Beaker },
  { id: 'lab-equipment', name: 'Lab Equipment', icon: TestTube },
  { id: 'ro-chemicals', name: 'RO Chemicals', icon: Waves },
  { id: 'cooling-water', name: 'Cooling Water', icon: ThermometerSun },
  { id: 'swimming-pool', name: 'Swimming Pool', icon: Droplets },
  { id: 'tank-cleaners', name: 'Tank Cleaners', icon: SprayCan },
  { id: 'corrosion-inhibitor', name: 'Corrosion Inhibitor', icon: Shield },
  { id: 'construction', name: 'Construction', icon: Building2 },
  { id: 'food-beverage', name: 'Food & Beverage', icon: Wine },
  { id: 'soap-detergent', name: 'Soap & Detergent', icon: Sparkles },
  { id: 'calcium-carbonate', name: 'Calcium Carbonate', icon: FlaskConical },
  { id: 'additives', name: 'Additives', icon: Zap },
  { id: 'agro', name: 'Agro Products', icon: Wheat },
  { id: 'solvents', name: 'Solvents', icon: FlaskRound },
  { id: 'inorganic', name: 'Inorganic Chemicals', icon: Microscope },
  { id: 'chlorinated', name: 'Chlorinated Solvents', icon: Flame },
  { id: 'ethanolamines', name: 'Ethanolamines', icon: Beaker },
  { id: 'glycols', name: 'Glycols', icon: Wind },
  { id: 'alcohols', name: 'Alcohols', icon: FlaskRound },
];

const FEATURED = [
  { name: 'PAC Powder', path: '/products/water-treatment/pac-powder' },
  { name: 'Caustic Soda Flakes', path: '/products/water-treatment/caustic-soda-flakes' },
  { name: 'Antiscalant', path: '/products/water-treatment/antiscalant-water' },
  { name: 'Shell Lubricants', path: '/products/lubricants/shell-lubricants' },
];

interface ProductsMegaMenuProps {
  prefix: '' | '/en' | '/ar';
  onNavigate: () => void;
}

const ProductsMegaMenu = ({ prefix, onNavigate }: ProductsMegaMenuProps) => {
  return (
    <div className="container mx-auto px-4">
      <div className="rounded-b-2xl border border-t-0 border-border bg-background shadow-xl p-6 animate-fade-in">
        {/* Category grid */}
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={withLangPrefix(prefix, `/products/${cat.id}`)}
                onClick={onNavigate}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/[0.08] border border-primary/15 flex items-center justify-center transition-all duration-200 group-hover:bg-primary/15 group-hover:scale-105">
                  <Icon className="w-[18px] h-[18px] text-primary" />
                </span>
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Featured + browse-all footer */}
        <div className="mt-5 pt-5 border-t border-border/60 flex flex-col xl:flex-row xl:items-center gap-4 xl:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground ltr:mr-1 rtl:ml-1">
              <Star className="w-3.5 h-3.5 text-[hsl(var(--logo-orange))]" />
              Featured
            </span>
            {FEATURED.map((p) => (
              <Link
                key={p.path}
                to={withLangPrefix(prefix, p.path)}
                onClick={onNavigate}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {p.name}
              </Link>
            ))}
          </div>
          <Link
            to={withLangPrefix(prefix, '/products')}
            onClick={onNavigate}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
          >
            Browse all 275 products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductsMegaMenu;
