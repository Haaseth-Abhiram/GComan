import data from '@/data/products/ro-chemicals.json';
import Products from '@/pages/Products';

export default function ProductCategoryRoChemicals() {
  return <Products initialCategory="ro-chemicals" initialProducts={data} />;
}
