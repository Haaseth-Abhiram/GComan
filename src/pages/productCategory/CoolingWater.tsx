import data from '@/data/products/cooling-water.json';
import Products from '@/pages/Products';

export default function ProductCategoryCoolingWater() {
  return <Products initialCategory="cooling-water" initialProducts={data} />;
}
