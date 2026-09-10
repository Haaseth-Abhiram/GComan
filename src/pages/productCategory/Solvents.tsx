import data from '@/data/products/solvents.json';
import Products from '@/pages/Products';

export default function ProductCategorySolvents() {
  return <Products initialCategory="solvents" initialProducts={data} />;
}
