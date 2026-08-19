import data from '@/data/products/construction.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailConstruction() {
  return <ProductDetail category="construction" rawCategoryProducts={data} />;
}
