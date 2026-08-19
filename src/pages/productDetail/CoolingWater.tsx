import data from '@/data/products/cooling-water.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailCoolingWater() {
  return <ProductDetail category="cooling-water" rawCategoryProducts={data} />;
}
