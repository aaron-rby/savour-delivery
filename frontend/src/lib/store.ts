// Client-side Relational State Store & Business Logic Engine for SAVOUR
import {
  Restaurant,
  MenuItem,
  Order,
  OrderStatus,
  User,
  DeliveryPartner,
  Review,
  OrderItem,
  Payment,
  Delivery,
  DatabaseMetrics
} from './types';
import {
  INITIAL_USERS,
  INITIAL_RESTAURANTS,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_DELIVERY_PARTNERS
} from './demoData';

const STORAGE_KEY_PREFIX = 'savour_db_v2_';

function loadOrInit<T>(key: string, initial: T): T {
  if (typeof window === 'undefined') return initial;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading localStorage key ${key}:`, e);
  }
  return initial;
}

function save<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed saving to localStorage key ${key}:`, e);
  }
}

export class RelationalDataStore {
  private users: User[] = INITIAL_USERS;
  private restaurants: Restaurant[] = INITIAL_RESTAURANTS;
  private menuItems: MenuItem[] = INITIAL_MENU_ITEMS;
  private orders: Order[] = INITIAL_ORDERS;
  private partners: DeliveryPartner[] = INITIAL_DELIVERY_PARTNERS;

  constructor() {
    this.refresh();
  }

  public refresh() {
    this.users = loadOrInit('users', INITIAL_USERS);
    this.restaurants = loadOrInit('restaurants', INITIAL_RESTAURANTS);
    this.menuItems = loadOrInit('menu_items', INITIAL_MENU_ITEMS);
    this.orders = loadOrInit('orders', INITIAL_ORDERS);
    this.partners = loadOrInit('partners', INITIAL_DELIVERY_PARTNERS);
  }

  public resetToSeed() {
    if (typeof window !== 'undefined') {
      ['users', 'restaurants', 'menu_items', 'orders', 'partners'].forEach(k => {
        localStorage.removeItem(STORAGE_KEY_PREFIX + k);
      });
    }
    this.users = [...INITIAL_USERS];
    this.restaurants = [...INITIAL_RESTAURANTS];
    this.menuItems = [...INITIAL_MENU_ITEMS];
    this.orders = [...INITIAL_ORDERS];
    this.partners = [...INITIAL_DELIVERY_PARTNERS];
  }

  // --- RESTAURANTS ---
  public getRestaurants(cuisine?: string, search?: string): Restaurant[] {
    let list = this.restaurants;
    if (cuisine && cuisine !== 'All') {
      list = list.filter(r => r.cuisineType.toLowerCase().includes(cuisine.toLowerCase()));
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.cuisineType.toLowerCase().includes(q));
    }
    return list;
  }

  public getRestaurantById(id: number): Restaurant | undefined {
    return this.restaurants.find(r => r.restaurantId === id);
  }

  // --- MENU ITEMS ---
  public getMenuItemsByRestaurant(restaurantId: number): MenuItem[] {
    return this.menuItems.filter(m => m.restaurantId === restaurantId);
  }

  public getMenuItemById(id: number): MenuItem | undefined {
    return this.menuItems.find(m => m.itemId === id);
  }

  public toggleMenuItemAvailability(itemId: number, isAvailable: boolean): MenuItem {
    const item = this.menuItems.find(m => m.itemId === itemId);
    if (!item) throw new Error(`Menu item ${itemId} not found`);
    item.isAvailable = isAvailable;
    save('menu_items', this.menuItems);
    return item;
  }

  // --- ORDERS & TRANSACTIONS ---
  public getOrders(customerId?: number): Order[] {
    if (customerId) {
      return this.orders.filter(o => o.customerId === customerId);
    }
    return [...this.orders].sort((a, b) => b.orderId - a.orderId);
  }

  public getOrderById(orderId: number): Order | undefined {
    return this.orders.find(o => o.orderId === orderId);
  }

  public createOrder(params: {
    orderId?: number;
    customerId: number;
    restaurantId: number;
    deliveryAddress: string;
    items: { itemId: number; quantity: number }[];
    tipAmount?: number;
    paymentMethod: 'CARD' | 'UPI' | 'NET_BANKING' | 'CASH_ON_DELIVERY';
  }): Order {
    const restaurant = this.getRestaurantById(params.restaurantId);
    if (!restaurant) throw new Error(`Restaurant ${params.restaurantId} not found`);
    if (!restaurant.isOpen) throw new Error(`Restaurant ${restaurant.name} is currently closed`);
    if (!params.items || params.items.length === 0) throw new Error("Order must contain at least one item");

    // Price Freezing & subtotal calculation
    let calculatedSubtotal = 0;
    const orderItems: OrderItem[] = [];

    params.items.forEach((req, idx) => {
      const menuItem = this.getMenuItemById(req.itemId);
      if (!menuItem) throw new Error(`Menu item ${req.itemId} not found`);
      if (menuItem.restaurantId !== params.restaurantId) {
        throw new Error(`Item ${menuItem.name} does not belong to ${restaurant.name}`);
      }
      if (!menuItem.isAvailable) {
        throw new Error(`Item ${menuItem.name} is currently unavailable`);
      }
      if (req.quantity <= 0) {
        throw new Error(`Quantity for ${menuItem.name} must be greater than zero`);
      }

      // Agreed price is frozen from the menu item price at order placement time
      const agreedPrice = menuItem.price;
      const lineSubtotal = Number((agreedPrice * req.quantity).toFixed(2));
      calculatedSubtotal += lineSubtotal;

      orderItems.push({
        orderItemId: Date.now() + idx,
        itemId: menuItem.itemId,
        itemName: menuItem.name,
        quantity: req.quantity,
        agreedUnitPrice: agreedPrice,
        subtotal: lineSubtotal
      });
    });

    const subtotal = Number(calculatedSubtotal.toFixed(2));
    const deliveryFee = subtotal >= 499 ? 0.00 : 40.00;
    const taxAmount = Number((subtotal * 0.05).toFixed(2));
    const tipAmount = params.tipAmount ? Number(params.tipAmount.toFixed(2)) : 0.00;
    const totalAmount = Number((subtotal + deliveryFee + taxAmount + tipAmount).toFixed(2));

    const newOrderId = params.orderId || (Math.max(1000, ...this.orders.map(o => o.orderId)) + 1);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const payment: Payment = {
      paymentId: Date.now(),
      orderId: newOrderId,
      paymentMethod: params.paymentMethod,
      paymentStatus: 'SUCCESS',
      amount: totalAmount,
      transactionRef: `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
      paidAt: nowStr
    };

    const newOrder: Order = {
      orderId: newOrderId,
      customerId: params.customerId,
      restaurantId: params.restaurantId,
      restaurantName: restaurant.name,
      deliveryAddress: params.deliveryAddress,
      orderStatus: 'PLACED',
      subtotal,
      itemsSubtotal: subtotal,
      deliveryFee,
      taxAmount,
      tipAmount,
      totalAmount,
      createdAt: nowStr,
      items: orderItems,
      payment
    };

    this.orders.unshift(newOrder);
    save('orders', this.orders);
    return newOrder;
  }

  // State Machine Validation matching OrderService.java
  public updateOrderStatus(orderId: number, targetStatus: OrderStatus): Order {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const currentStatus = order.orderStatus;
    const validNextStates: Record<OrderStatus, OrderStatus[]> = {
      PLACED: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['OUT_FOR_DELIVERY'],
      OUT_FOR_DELIVERY: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: []
    };

    const allowed = validNextStates[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${targetStatus}`);
    }

    order.orderStatus = targetStatus;
    order.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // If out for delivery and no delivery assigned, assign partner 1
    if (targetStatus === 'OUT_FOR_DELIVERY' && !order.delivery) {
      order.delivery = {
        deliveryId: Date.now(),
        orderId: order.orderId,
        partnerId: 1,
        partnerName: 'Jake Morrison',
        partnerPhone: '+1-555-0301',
        deliveryStatus: 'PICKED_UP',
        pickupTime: order.updatedAt
      };
    } else if (targetStatus === 'DELIVERED' && order.delivery) {
      order.delivery.deliveryStatus = 'DELIVERED';
      order.delivery.deliveredTime = order.updatedAt;
    }

    save('orders', this.orders);
    return order;
  }

  // Review submission with Foreign Key & Check Constraint checks
  public submitReview(orderId: number, customerId: number, rating: number, comment?: string): Review {
    const order = this.getOrderById(orderId);
    if (!order) throw new Error(`Foreign Key Violation: Order ${orderId} does not exist`);
    if (order.customerId !== customerId) throw new Error("Only the customer who placed this order can review it");
    if (order.orderStatus !== 'DELIVERED') throw new Error("Only DELIVERED orders can be reviewed");
    if (rating < 1 || rating > 5) throw new Error("Check Constraint Violation: Rating must be between 1 and 5");
    if (order.review) throw new Error("Unique Constraint Violation: Order has already been reviewed");

    const review: Review = {
      reviewId: Date.now(),
      orderId,
      customerId,
      restaurantId: order.restaurantId,
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    order.review = review;
    save('orders', this.orders);
    return review;
  }

  // --- DELIVERY PARTNERS ---
  public getDeliveryPartners(): DeliveryPartner[] {
    return this.partners;
  }

  public getAvailableDeliveries(): Order[] {
    return this.orders.filter(o => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'PREPARING');
  }

  public getActiveDeliveryForPartner(partnerId: number): Order | undefined {
    return this.orders.find(o => o.delivery?.partnerId === partnerId && o.delivery?.deliveryStatus !== 'DELIVERED');
  }

  // --- ADMIN & DATABASE METRICS ---
  public getMetrics(): DatabaseMetrics {
    const totalRevenue = this.orders
      .filter(o => o.orderStatus === 'DELIVERED')
      .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const totalOrderItems = this.orders.reduce((acc, curr) => acc + (curr.items?.length || 0), 0);
    const totalDeliveries = this.orders.filter(o => o.delivery).length;
    const totalPayments = this.orders.filter(o => o.payment).length;
    const totalReviews = this.orders.filter(o => o.review).length;

    return {
      usersCount: this.users.length,
      restaurantsCount: this.restaurants.length,
      menuItemsCount: this.menuItems.length,
      ordersCount: this.orders.length,
      orderItemsCount: totalOrderItems,
      deliveriesCount: totalDeliveries,
      paymentsCount: totalPayments,
      reviewsCount: totalReviews,
      deliveryPartnersCount: this.partners.length,
      totalRevenue: Number(totalRevenue.toFixed(2))
    };
  }
}

export const dbStore = new RelationalDataStore();
