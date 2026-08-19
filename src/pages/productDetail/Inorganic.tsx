import data from '@/data/products/inorganic.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailInorganic() {
  return <ProductDetail category="inorganic" rawCategoryProducts={data} />;
}
