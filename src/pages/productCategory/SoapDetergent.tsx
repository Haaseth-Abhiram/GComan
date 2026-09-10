import data from '@/data/products/soap-detergent.json';
import Products from '@/pages/Products';

export default function ProductCategorySoapDetergent() {
  return <Products initialCategory="soap-detergent" initialProducts={data} />;
}
