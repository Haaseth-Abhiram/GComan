import data from '@/data/products/lab-chemicals.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailLabChemicals() {
  return <ProductDetail category="lab-chemicals" rawCategoryProducts={data} />;
}
