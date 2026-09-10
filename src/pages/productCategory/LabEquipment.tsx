import data from '@/data/products/lab-equipment.json';
import Products from '@/pages/Products';

export default function ProductCategoryLabEquipment() {
  return <Products initialCategory="lab-equipment" initialProducts={data} />;
}
