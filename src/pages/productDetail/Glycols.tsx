import data from '@/data/products/glycols.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailGlycols() {
  return <ProductDetail category="glycols" rawCategoryProducts={data} />;
}
