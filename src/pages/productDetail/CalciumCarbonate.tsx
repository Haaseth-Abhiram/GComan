import data from '@/data/products/calcium-carbonate.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailCalciumCarbonate() {
  return <ProductDetail category="calcium-carbonate" rawCategoryProducts={data} />;
}
