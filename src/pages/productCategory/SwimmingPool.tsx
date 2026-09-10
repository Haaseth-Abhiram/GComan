import data from '@/data/products/swimming-pool.json';
import Products from '@/pages/Products';

export default function ProductCategorySwimmingPool() {
  return <Products initialCategory="swimming-pool" initialProducts={data} />;
}
