// SAVOUR Food Delivery System - TypeScript Definitions (Matching Oracle Schema)

export type UserRole = 'CUSTOMER' | 'RESTAURANT_OPERATOR' | 'DELIVERY_PARTNER' | 'ADMIN';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export type PaymentMethod = 'CARD' | 'UPI' | 'NET_BANKING' | 'CASH_ON_DELIVERY';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type DeliveryStatus = 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED' | 'FAILED';

export interface User {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  createdAt?: string;
}

export interface Restaurant {
  restaurantId: number;
  ownerId: number;
  name: string;
  cuisineType: string;
  address: string;
  phone: string;
  rating: number;
  isOpen: boolean;
  deliveryTimeEstimate?: string;
  priceTier?: '$' | '$$' | '$$$' | '$$$$';
  imageUrl?: string;
  createdAt?: string;
}

export interface MenuItem {
  itemId: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  spicyLevel?: number; // 0, 1, 2, 3
  imageUrl?: string;
  createdAt?: string;
}

export interface OrderItem {
  orderItemId?: number;
  orderId?: number;
  itemId: number;
  itemName?: string;
  quantity: number;
  agreedUnitPrice: number;
  subtotal?: number;
}

export interface Order {
  orderId: number;
  customerId: number;
  customerName?: string;
  restaurantId: number;
  restaurantName?: string;
  deliveryAddress: string;
  orderStatus: OrderStatus;
  subtotal?: number;
  itemsSubtotal?: number;
  deliveryFee?: number;
  taxAmount?: number;
  tipAmount?: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt?: string;
  items?: OrderItem[];
  payment?: Payment;
  delivery?: Delivery;
  review?: Review;
}

export interface Payment {
  paymentId: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amount: number;
  transactionRef: string;
  paidAt?: string;
}

export interface DeliveryPartner {
  partnerId: number;
  userId: number;
  fullName?: string;
  phone?: string;
  vehicleType: string;
  vehicleNumber: string;
  isAvailable: boolean;
  rating: number;
}

export interface Delivery {
  deliveryId: number;
  orderId: number;
  partnerId: number;
  partnerName?: string;
  partnerPhone?: string;
  deliveryStatus: DeliveryStatus;
  pickupTime?: string;
  deliveredTime?: string;
}

export interface Review {
  reviewId: number;
  orderId: number;
  customerId: number;
  restaurantId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface CartItem {
  item: MenuItem;
  restaurant: Restaurant;
  quantity: number;
}

export interface DatabaseMetrics {
  usersCount: number;
  restaurantsCount: number;
  menuItemsCount: number;
  ordersCount: number;
  orderItemsCount: number;
  deliveriesCount: number;
  paymentsCount: number;
  reviewsCount: number;
  deliveryPartnersCount: number;
  totalRevenue: number;
}
