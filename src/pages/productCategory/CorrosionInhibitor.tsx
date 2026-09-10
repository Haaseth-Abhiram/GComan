import data from '@/data/products/corrosion-inhibitor.json';
import Products from '@/pages/Products';

export default function ProductCategoryCorrosionInhibitor() {
  return <Products initialCategory="corrosion-inhibitor" initialProducts={data} />;
}
