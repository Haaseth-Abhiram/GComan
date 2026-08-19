import data from '@/data/products/additives.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailAdditives() {
  return <ProductDetail category="additives" rawCategoryProducts={data} />;
}
