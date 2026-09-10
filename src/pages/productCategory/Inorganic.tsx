import data from '@/data/products/inorganic.json';
import Products from '@/pages/Products';

export default function ProductCategoryInorganic() {
  return <Products initialCategory="inorganic" initialProducts={data} />;
}
