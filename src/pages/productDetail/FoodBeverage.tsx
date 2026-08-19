import data from '@/data/products/food-beverage.json';
import ProductDetail from '@/pages/ProductDetail';

export default function ProductDetailFoodBeverage() {
  return <ProductDetail category="food-beverage" rawCategoryProducts={data} />;
}
