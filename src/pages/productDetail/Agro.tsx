import data from '@/data/products/agro.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailAgro() {
  return <ProductDetail category="agro" rawCategoryProducts={data} />;
}
