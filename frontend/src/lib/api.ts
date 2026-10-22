// SAVOUR API Client with Dual Mode (Spring Boot Oracle JDBC / Local Relational Engine)
import { Restaurant, MenuItem, Order, OrderStatus, DatabaseMetrics, Review } from './types';
import { dbStore } from './store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function fetchBackend(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    throw new Error('GitHub Pages uses the browser demo store');
  }
  return fetch(input, init);
}

export interface BackendHealthResponse {
  connected: boolean;
  mode: 'ORACLE_JDBC' | 'H2_COMPATIBLE' | 'STANDALONE_DEMO';
  message: string;
  timestamp: string;
}

// Check backend connectivity
export async function checkBackendHealth(): Promise<BackendHealthResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetchBackend(`${API_BASE_URL}/health`, {
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        connected: true,
        mode: data.database?.includes('Oracle') ? 'ORACLE_JDBC' : 'H2_COMPATIBLE',
        message: data.message || 'Connected to Spring Boot JDBC Backend',
        timestamp: new Date().toLocaleTimeString()
      };
    }
  } catch {
    // Expected fallback when backend server is not running locally
  }

  return {
    connected: false,
    mode: 'STANDALONE_DEMO',
    message: 'SAVOUR High-Fidelity Client Engine (Full relational simulation ready)',
    timestamp: new Date().toLocaleTimeString()
  };
}

export function normalizeRestaurant(raw: any): Restaurant {
  if (!raw) return raw;
  const restaurantId = Number(raw.restaurantId);
  const name = raw.name || raw.restaurantName || `Restaurant #${restaurantId}`;
  
  let defaultCuisine = 'Indian Gourmet';
  if (restaurantId === 1) defaultCuisine = 'North Indian Frontier';
  else if (restaurantId === 2) defaultCuisine = 'Coastal South Indian';
  else if (restaurantId === 3) defaultCuisine = 'Coastal Seafood';
  else if (restaurantId === 4) defaultCuisine = 'Hyderabadi Nizami';
  else if (restaurantId === 5) defaultCuisine = 'South Indian Classical';
  else if (restaurantId === 6) defaultCuisine = 'Traditional Bengali';

  const cuisineType = raw.cuisineType || defaultCuisine;
  const address = raw.address || (raw.addressLine ? `${raw.addressLine}${raw.city ? `, ${raw.city}` : ''}${raw.postalCode ? ` - ${raw.postalCode}` : ''}` : 'Address provided');
  const phone = raw.phone || raw.contactPhone || '+91 98765 43210';
  const rating = raw.rating != null ? Number(raw.rating) : 4.8;
  const isOpen = raw.isOpen != null ? Boolean(raw.isOpen) : true;
  const deliveryTimeEstimate = raw.deliveryTimeEstimate || '25-35 min';
  const priceTier = raw.priceTier || '$$';

  return {
    restaurantId,
    ownerId: raw.ownerId || 7,
    name,
    cuisineType,
    address,
    phone,
    rating,
    isOpen,
    deliveryTimeEstimate,
    priceTier
  };
}

export function normalizeMenuItem(raw: any): MenuItem {
  if (!raw) return raw;
  const itemId = Number(raw.itemId);
  const restaurantId = Number(raw.restaurantId);
  const name = raw.name || raw.itemName || `Dish #${itemId}`;
  const price = raw.price != null ? Number(raw.price) : (raw.currentPrice != null ? Number(raw.currentPrice) : 0);
  const category = raw.category || 'Mains';
  const description = raw.description || `${category} prepared fresh with traditional heritage recipes and premium ingredients.`;
  
  const isAvailable = raw.isAvailable === true || raw.isAvailable === 1 || raw.isAvailable === '1';
  
  // Vegetarian heuristic if not explicitly set
  const lowerName = name.toLowerCase();
  const lowerCat = category.toLowerCase();
  const isVegetarian = raw.isVegetarian != null 
    ? Boolean(raw.isVegetarian)
    : (lowerCat.includes('bread') || lowerCat.includes('dessert') || lowerCat.includes('beverage') || lowerCat.includes('tiffin') ||
       lowerName.includes('dal') || lowerName.includes('dosa') || lowerName.includes('idli') || lowerName.includes('vada') || lowerName.includes('pongal') || lowerName.includes('paneer'));

  return {
    itemId,
    restaurantId,
    name,
    description,
    price,
    category,
    isVegetarian,
    isAvailable,
    spicyLevel: raw.spicyLevel != null ? Number(raw.spicyLevel) : 1
  };
}

// Restaurants
export async function getRestaurants(cuisine?: string, search?: string): Promise<Restaurant[]> {
  try {
    const url = new URL(`${API_BASE_URL}/restaurants`);
    if (cuisine && cuisine !== 'All') url.searchParams.set('cuisine', cuisine);
    const res = await fetchBackend(url.toString(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeRestaurant);
        if (search && search.trim() !== '') {
          const q = search.toLowerCase();
          return normalized.filter(r => r.name.toLowerCase().includes(q) || r.cuisineType.toLowerCase().includes(q));
        }
        return normalized;
      }
    }
  } catch {
    // Fall back to client store
  }
  return dbStore.getRestaurants(cuisine, search).map(normalizeRestaurant);
}

export async function getRestaurantById(id: number): Promise<Restaurant | undefined> {
  try {
    const res = await fetchBackend(`${API_BASE_URL}/restaurants/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return normalizeRestaurant(data);
    }
  } catch {
    // Fallback
  }
  const found = dbStore.getRestaurantById(id);
  return found ? normalizeRestaurant(found) : undefined;
}

export async function getMenuItems(restaurantId: number): Promise<MenuItem[]> {
  try {
    const res = await fetchBackend(`${API_BASE_URL}/restaurants/${restaurantId}/menu`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(normalizeMenuItem);
      }
    }
  } catch {
    // Fallback
  }
  return dbStore.getMenuItemsByRestaurant(restaurantId).map(normalizeMenuItem);
}

export async function toggleMenuItemAvailability(restaurantId: number, itemId: number, isAvailable: boolean): Promise<void> {
  try {
    const res = await fetchBackend(`${API_BASE_URL}/restaurants/${restaurantId}/menu/${itemId}/availability?available=${isAvailable}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      dbStore.toggleMenuItemAvailability(itemId, isAvailable);
      return;
    }
  } catch {
    // Fallback
  }
  dbStore.toggleMenuItemAvailability(itemId, isAvailable);
}

function normalizeOrder(raw: any): Order {
  if (!raw) return raw;
  const orderId = Number(raw.orderId);
  const subtotal = Number(raw.subtotal ?? raw.itemsSubtotal ?? 0);
  const itemsSubtotal = Number(raw.itemsSubtotal ?? raw.subtotal ?? 0);
  const deliveryFee = raw.deliveryFee != null ? Number(raw.deliveryFee) : 50;
  const taxAmount = raw.taxAmount != null ? Number(raw.taxAmount) : 0;
  const tipAmount = raw.tipAmount != null ? Number(raw.tipAmount) : 0;
  const totalAmount = raw.totalAmount != null ? Number(raw.totalAmount) : (subtotal + deliveryFee + taxAmount + tipAmount);
  const deliveryAddress = raw.deliveryAddress || (raw.dropoffLine ? `${raw.dropoffLine}${raw.dropoffCity ? `, ${raw.dropoffCity}` : ''}` : 'Flat 402, Shanti Niketan, New Delhi');
  const createdAt = raw.createdAt || raw.orderedAt || new Date().toISOString();

  // Defensive item mapping guaranteeing stable keys and accurate names
  const items = Array.isArray(raw.items)
    ? raw.items.map((it: any, idx: number) => {
        const itemId = Number(it.itemId);
        const quantity = Number(it.quantity || 1);
        const unitPrice = it.agreedUnitPrice != null ? Number(it.agreedUnitPrice) : (it.price != null ? Number(it.price) : 0);
        const lineSubtotal = it.lineTotal != null ? Number(it.lineTotal) : (unitPrice * quantity);
        return {
          orderItemId: it.orderItemId != null ? Number(it.orderItemId) : (orderId ? Number(`${orderId}${itemId || idx}`) : idx + 1),
          orderId,
          itemId,
          itemName: it.itemName || it.name || `Dish #${itemId}`,
          quantity,
          agreedUnitPrice: unitPrice,
          subtotal: lineSubtotal
        };
      })
    : [];

  const payment = raw.payment || {
    paymentId: raw.paymentId || (orderId ? Number(`${orderId}01`) : 1),
    orderId,
    paymentMethod: raw.paymentMethod || 'UPI',
    paymentStatus: raw.paymentStatus || 'COMPLETED',
    amount: totalAmount,
    transactionRef: `TXN-SAV-${orderId || 'DEMO'}`
  };

  return {
    ...raw,
    orderId,
    customerId: Number(raw.customerId),
    customerName: raw.customerName || 'Customer',
    restaurantId: Number(raw.restaurantId),
    restaurantName: raw.restaurantName || 'Restaurant',
    subtotal,
    itemsSubtotal,
    deliveryFee,
    taxAmount,
    tipAmount,
    totalAmount,
    deliveryAddress,
    createdAt,
    items,
    payment
  };
}

// Orders
export async function getOrders(customerId?: number): Promise<Order[]> {
  try {
    const endpoint = customerId ? `${API_BASE_URL}/orders/customer/${customerId}` : `${API_BASE_URL}/orders`;
    const res = await fetchBackend(endpoint, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data.map(normalizeOrder) : [];
    }
  } catch {
    // Fallback
  }
  return dbStore.getOrders(customerId).map(normalizeOrder);
}

export async function getOrderById(orderId: number): Promise<Order | undefined> {
  try {
    const res = await fetchBackend(`${API_BASE_URL}/orders/${orderId}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return normalizeOrder(data);
    }
  } catch {
    // Fallback
  }
  const found = dbStore.getOrderById(orderId);
  return found ? normalizeOrder(found) : undefined;
}

export async function createOrder(payload: {
  customerId: number;
  restaurantId: number;
  deliveryAddress: string;
  items: { itemId: number; quantity: number }[];
  tipAmount?: number;
  paymentMethod: 'CARD' | 'UPI' | 'NET_BANKING' | 'CASH_ON_DELIVERY';
}): Promise<Order> {
  const backendPayload = {
    customerId: payload.customerId,
    restaurantId: payload.restaurantId,
    dropoffLine: payload.deliveryAddress,
    dropoffCity: 'New Delhi',
    dropoffPostalCode: '110021',
    deliveryAddress: payload.deliveryAddress,
    paymentMethod: payload.paymentMethod,
    items: payload.items.map(it => ({
      itemId: it.itemId,
      quantity: it.quantity
    }))
  };

  try {
    const res = await fetchBackend(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload)
    });
    if (res.ok) {
      const order = await res.json();
      const normalized = normalizeOrder(order);
      // Sync local engine
      dbStore.createOrder({
        ...payload,
        orderId: normalized.orderId
      });
      return normalized;
    } else {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to place order via backend');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Failed to place order')) {
      throw err;
    }
    // Fallback to store
    return normalizeOrder(dbStore.createOrder(payload));
  }
}

export async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  try {
    const res = await fetchBackend(`${API_BASE_URL}/orders/${orderId}/status?status=${status}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      const updated = await res.json();
      dbStore.refresh();
      return normalizeOrder(updated);
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Invalid status transition');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Invalid status transition')) {
      throw err;
    }
    return normalizeOrder(dbStore.updateOrderStatus(orderId, status));
  }
}

// Reviews
export async function submitReview(payload: {
  orderId: number;
  customerId: number;
  rating: number;
  comment?: string;
}): Promise<Review> {
  try {
    const res = await fetchBackend(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const review = await res.json();
      dbStore.refresh();
      return review;
    } else {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit review');
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Failed to submit review')) {
      throw err;
    }
    return dbStore.submitReview(payload.orderId, payload.customerId, payload.rating, payload.comment);
  }
}

// Admin Metrics
export async function getDatabaseMetrics(): Promise<DatabaseMetrics> {
  try {
    const res = await fetchBackend(`${API_BASE_URL}/admin/metrics`, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return dbStore.getMetrics();
}
