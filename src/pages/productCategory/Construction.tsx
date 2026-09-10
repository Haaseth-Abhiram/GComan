import data from '@/data/products/construction.json';
import Products from '@/pages/Products';

export default function ProductCategoryConstruction() {
  return <Products initialCategory="construction" initialProducts={data} />;
}
