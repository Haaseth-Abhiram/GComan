import data from '@/data/products/corrosion-inhibitor.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailCorrosionInhibitor() {
  return <ProductDetail category="corrosion-inhibitor" rawCategoryProducts={data} />;
}
