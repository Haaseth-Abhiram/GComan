import data from '@/data/products/agro.json';
import Products from '@/pages/Products';

export default function ProductCategoryAgro() {
  return <Products initialCategory="agro" initialProducts={data} />;
}
