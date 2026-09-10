import data from '@/data/products/additives.json';
import Products from '@/pages/Products';

export default function ProductCategoryAdditives() {
  return <Products initialCategory="additives" initialProducts={data} />;
}
