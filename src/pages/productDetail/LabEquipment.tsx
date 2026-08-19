import data from '@/data/products/lab-equipment.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailLabEquipment() {
  return <ProductDetail category="lab-equipment" rawCategoryProducts={data} />;
}
