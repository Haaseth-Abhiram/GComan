import data from '@/data/products/water-treatment.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailWaterTreatment() {
  return <ProductDetail category="water-treatment" rawCategoryProducts={data} />;
}
