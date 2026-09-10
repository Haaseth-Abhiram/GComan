import data from '@/data/products/water-treatment.json';
import Products from '@/pages/Products';

export default function ProductCategoryWaterTreatment() {
  return <Products initialCategory="water-treatment" initialProducts={data} />;
}
