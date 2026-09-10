import data from '@/data/products/alcohols.json';
import Products from '@/pages/Products';

export default function ProductCategoryAlcohols() {
  return <Products initialCategory="alcohols" initialProducts={data} />;
}
