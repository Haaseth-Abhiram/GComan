import data from '@/data/products/solvents.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailSolvents() {
  return <ProductDetail category="solvents" rawCategoryProducts={data} />;
}
