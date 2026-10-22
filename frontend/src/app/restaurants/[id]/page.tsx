import { INITIAL_RESTAURANTS } from '@/lib/demoData';
import RestaurantDetail from './RestaurantDetail';

export function generateStaticParams() {
  return INITIAL_RESTAURANTS.map(restaurant => ({ id: String(restaurant.restaurantId) }));
}

export default function RestaurantPage() {
  return <RestaurantDetail />;
}
