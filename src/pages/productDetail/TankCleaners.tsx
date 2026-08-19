import data from '@/data/products/tank-cleaners.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailTankCleaners() {
  return <ProductDetail category="tank-cleaners" rawCategoryProducts={data} />;
}
