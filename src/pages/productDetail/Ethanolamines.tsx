import data from '@/data/products/ethanolamines.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailEthanolamines() {
  return <ProductDetail category="ethanolamines" rawCategoryProducts={data} />;
}
