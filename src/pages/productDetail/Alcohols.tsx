import data from '@/data/products/alcohols.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailAlcohols() {
  return <ProductDetail category="alcohols" rawCategoryProducts={data} />;
}
