import data from '@/data/products/soap-detergent.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailSoapDetergent() {
  return <ProductDetail category="soap-detergent" rawCategoryProducts={data} />;
}
