'use client';

import React, { useState, useEffect } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  TrendingUp,
  UtensilsCrossed,
  RefreshCw,
  Check,
  Receipt
} from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { getOrders, getMenuItems, updateOrderStatus, toggleMenuItemAvailability, getRestaurantById } from '@/lib/api';
import { Order, MenuItem, Restaurant, OrderStatus } from '@/lib/types';
import { formatCurrency, formatRating } from '@/lib/currency';

export default function OperatorPage() {
  const { activeUser } = usePersona();

  // If user is Marco Rossi (id 7), restaurant is 1. If Rajesh (8), restaurant is 2. Default to 1.
  const operatorRestaurantId = activeUser.userId === 8 ? 2 : activeUser.userId === 9 ? 3 : 1;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'MENU'>('ORDERS');
  const [statusActionLoading, setStatusActionLoading] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, allOrders, items] = await Promise.all([
        getRestaurantById(operatorRestaurantId),
        getOrders(),
        getMenuItems(operatorRestaurantId)
      ]);
      if (r) setRestaurant(r);
      // Filter orders belonging to this restaurant
      setOrders(allOrders.filter(o => o.restaurantId === operatorRestaurantId));
      setMenuItems(items);
    } catch (err) {
      console.error('Error fetching operator data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [operatorRestaurantId]);

  const handleAdvanceStatus = async (orderId: number, targetStatus: OrderStatus) => {
    setStatusActionLoading(orderId);
    try {
      await updateOrderStatus(orderId, targetStatus);
      await fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Invalid state transition');
    } finally {
      setStatusActionLoading(null);
    }
  };

  const handleToggleAvailability = async (itemId: number, currentAvailable: boolean) => {
    try {
      await toggleMenuItemAvailability(operatorRestaurantId, itemId, !currentAvailable);
      setMenuItems(prev =>
        prev.map(m => (m.itemId === itemId ? { ...m, isAvailable: !currentAvailable } : m))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update item availability');
    }
  };

  // Metrics (Defensive calculations against undefined fields)
  const activeOrders = orders.filter(o => ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.orderStatus));
  const totalRevenue = orders
    .filter(o => o.orderStatus === 'DELIVERED')
    .reduce((sum, o) => {
      const sub = o.subtotal ?? o.itemsSubtotal ?? (o.totalAmount ? o.totalAmount - (o.deliveryFee ?? 0) - (o.taxAmount ?? 0) - (o.tipAmount ?? 0) : 0);
      return sum + (sub > 0 ? sub : (o.totalAmount ?? 0));
    }, 0);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Operator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#C85A32]">
                Kitchen Operations
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Operator: {activeUser.fullName} ({activeUser.role})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D241E] tracking-tight">
              {restaurant ? restaurant.name : 'Kitchen Console'}
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Manage order lifecycle states, cooking queue, and real-time menu availability.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E0D8CC] text-xs font-medium text-stone-700 hover:bg-[#FAF7F2] shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
            Refresh Queue
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#E0D8CC] p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Queue</span>
              <Clock className="w-4 h-4 text-[#C85A32]" />
            </div>
            <p className="text-2xl font-black text-[#2D241E]">{activeOrders.length}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Pending kitchen completion</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E0D8CC] p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">Net Sales</span>
              <Receipt className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-2xl font-black text-[#2D241E] font-mono">{formatCurrency(totalRevenue)}</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Delivered orders subtotal</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E0D8CC] p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">Kitchen Rating</span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-[#2D241E]">
              {formatRating(restaurant?.rating)} / 5.0
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">Verified customer reviews</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E0D8CC] p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider">Catalog Items</span>
              <UtensilsCrossed className="w-4 h-4 text-stone-600" />
            </div>
            <p className="text-2xl font-black text-[#2D241E]">{menuItems.length}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {menuItems.filter(m => m.isAvailable).length} available &bull; {menuItems.filter(m => !m.isAvailable).length} out
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 border-b border-[#E8E2D9] mb-6 pb-2">
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'ORDERS'
                ? 'bg-[#C85A32] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-stone-200'
            }`}
          >
            Live Kitchen Queue ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('MENU')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'MENU'
                ? 'bg-[#C85A32] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-stone-200'
            }`}
          >
            Menu Stock Toggles ({menuItems.length})
          </button>
        </div>

        {/* Tab 1: Orders Queue */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-[#E0D8CC]">
                <ChefHat className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="font-bold text-sm text-[#2D241E]">No orders in kitchen queue</p>
                <p className="text-xs text-stone-500 mt-1">Incoming customer orders will appear here automatically.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs overflow-hidden divide-y divide-stone-100">
                {orders.map(order => {
                  const isPlaced = order.orderStatus === 'PLACED';
                  const isConfirmed = order.orderStatus === 'CONFIRMED';
                  const isPreparing = order.orderStatus === 'PREPARING';
                  const isOut = order.orderStatus === 'OUT_FOR_DELIVERY';
                  const isDelivered = order.orderStatus === 'DELIVERED';
                  const isCancelled = order.orderStatus === 'CANCELLED';

                  // Safe subtotal retrieval (protects against line 247 crash)
                  const safeSubtotal =
                    order.subtotal ??
                    order.itemsSubtotal ??
                    (order.totalAmount
                      ? order.totalAmount - (order.deliveryFee ?? 0) - (order.taxAmount ?? 0) - (order.tipAmount ?? 0)
                      : 0);

                  return (
                    <div key={order.orderId} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#2D241E]">
                            Order #{order.orderId}
                          </span>
                          <span className="text-xs text-stone-500 font-mono">
                            ({order.createdAt})
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isDelivered
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isCancelled
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600">
                          <strong className="text-stone-800">Customer:</strong> User #{order.customerId} ({order.customerName || 'Customer'}) &bull; <strong className="text-stone-800">Address:</strong> {order.deliveryAddress}
                        </p>

                        <div className="text-xs text-stone-500 flex flex-wrap gap-1.5 pt-0.5">
                          {order.items?.map(it => (
                            <span key={it.orderItemId} className="bg-[#FAF7F2] border border-stone-200 px-2 py-0.5 rounded text-stone-700 font-medium">
                              {it.quantity}x {it.itemName}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* State Machine Transition Controls & Safe Subtotal */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right mr-2 hidden sm:block">
                          <p className="text-[11px] text-stone-400 font-mono">Subtotal</p>
                          <p className="font-mono font-bold text-[#2D241E] text-sm">
                            {formatCurrency(safeSubtotal)}
                          </p>
                        </div>

                        {isPlaced && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAdvanceStatus(order.orderId, 'CANCELLED')}
                              disabled={statusActionLoading === order.orderId}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-medium transition"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAdvanceStatus(order.orderId, 'CONFIRMED')}
                              disabled={statusActionLoading === order.orderId}
                              className="px-3.5 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold shadow-xs transition"
                            >
                              Accept Order
                            </button>
                          </div>
                        )}

                        {isConfirmed && (
                          <button
                            onClick={() => handleAdvanceStatus(order.orderId, 'PREPARING')}
                            disabled={statusActionLoading === order.orderId}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition"
                          >
                            Start Cooking
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => handleAdvanceStatus(order.orderId, 'OUT_FOR_DELIVERY')}
                            disabled={statusActionLoading === order.orderId}
                            className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold shadow-xs transition"
                          >
                            Ready for Dispatch
                          </button>
                        )}

                        {isOut && (
                          <span className="px-2.5 py-1 rounded bg-[#FAF7F2] border border-stone-200 text-stone-600 text-xs font-mono">
                            Courier En Route
                          </span>
                        )}

                        {isDelivered && (
                          <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Completed
                          </span>
                        )}

                        {isCancelled && (
                          <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Menu Inventory Stock Toggles */}
        {activeTab === 'MENU' && (
          <div className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs overflow-hidden">
            <div className="p-3.5 bg-[#FAF7F2] border-b border-[#E8E2D9] flex items-center justify-between text-xs text-stone-600">
              <span className="font-semibold text-[#2D241E]">
                Menu Inventory Controls (Executes UPDATE MENU_ITEMS SET is_available = ?)
              </span>
              <span className="font-mono text-stone-400">TABLE: MENU_ITEMS</span>
            </div>

            <div className="divide-y divide-stone-100">
              {menuItems.map(item => (
                <div key={item.itemId} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center p-0.5 ${
                        item.isVegetarian ? 'border-emerald-600' : 'border-rose-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-[#2D241E]">{item.name}</h4>
                        <span className="text-[10px] font-mono text-stone-400">#{item.itemId}</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-mono mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium ${item.isAvailable ? 'text-emerald-700' : 'text-stone-400'}`}>
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                    <button
                      onClick={() => handleToggleAvailability(item.itemId, item.isAvailable)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        item.isAvailable ? 'bg-emerald-600' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          item.isAvailable ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
