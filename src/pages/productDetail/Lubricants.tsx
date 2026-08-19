import data from '@/data/products/lubricants.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailLubricants() {
  return <ProductDetail category="lubricants" rawCategoryProducts={data} />;
}
