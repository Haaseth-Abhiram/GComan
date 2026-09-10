import data from '@/data/products/lab-chemicals.json';
import Products from '@/pages/Products';

export default function ProductCategoryLabChemicals() {
  return <Products initialCategory="lab-chemicals" initialProducts={data} />;
}
