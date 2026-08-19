import data from '@/data/products/swimming-pool.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailSwimmingPool() {
  return <ProductDetail category="swimming-pool" rawCategoryProducts={data} />;
}
