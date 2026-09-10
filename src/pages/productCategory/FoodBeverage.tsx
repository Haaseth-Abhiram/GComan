import data from '@/data/products/food-beverage.json';
import Products from '@/pages/Products';

export default function ProductCategoryFoodBeverage() {
  return <Products initialCategory="food-beverage" initialProducts={data} />;
}
