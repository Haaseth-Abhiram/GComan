import data from '@/data/products/ro-chemicals.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailRoChemicals() {
  return <ProductDetail category="ro-chemicals" rawCategoryProducts={data} />;
}
