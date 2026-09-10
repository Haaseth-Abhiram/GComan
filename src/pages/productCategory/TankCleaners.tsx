import data from '@/data/products/tank-cleaners.json';
import Products from '@/pages/Products';

export default function ProductCategoryTankCleaners() {
  return <Products initialCategory="tank-cleaners" initialProducts={data} />;
}
