import data from '@/data/products/chlorinated.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailChlorinated() {
  return <ProductDetail category="chlorinated" rawCategoryProducts={data} />;
}
