import data from '@/data/products/oilfield.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailOilfield() {
  return <ProductDetail category="oilfield" rawCategoryProducts={data} />;
}
