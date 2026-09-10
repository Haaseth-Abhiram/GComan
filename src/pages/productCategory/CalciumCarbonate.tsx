import data from '@/data/products/calcium-carbonate.json';
import Products from '@/pages/Products';

export default function ProductCategoryCalciumCarbonate() {
  return <Products initialCategory="calcium-carbonate" initialProducts={data} />;
}
