import data from '@/data/products/oilfield.json';
import Products from '@/pages/Products';

export default function ProductCategoryOilfield() {
  return <Products initialCategory="oilfield" initialProducts={data} />;
}
