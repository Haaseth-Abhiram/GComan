import data from '@/data/products/chlorinated.json';
import Products from '@/pages/Products';

export default function ProductCategoryChlorinated() {
  return <Products initialCategory="chlorinated" initialProducts={data} />;
}
