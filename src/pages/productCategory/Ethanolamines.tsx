import data from '@/data/products/ethanolamines.json';
import Products from '@/pages/Products';

export default function ProductCategoryEthanolamines() {
  return <Products initialCategory="ethanolamines" initialProducts={data} />;
}
