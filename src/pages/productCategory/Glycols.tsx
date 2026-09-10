import data from '@/data/products/glycols.json';
import Products from '@/pages/Products';

export default function ProductCategoryGlycols() {
  return <Products initialCategory="glycols" initialProducts={data} />;
}
