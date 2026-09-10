import data from '@/data/products/lubricants.json';
import Products from '@/pages/Products';

export default function ProductCategoryLubricants() {
  return <Products initialCategory="lubricants" initialProducts={data} />;
}
