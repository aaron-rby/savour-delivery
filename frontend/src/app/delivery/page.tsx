'use client';

import React, { useState, useEffect } from 'react';
import {
  Bike,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  Star,
  RefreshCw,
  Navigation,
  Coins
} from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { INITIAL_DELIVERY_PARTNERS } from '@/lib/demoData';
import { formatCurrency, formatRating } from '@/lib/currency';

export default function DeliveryPage() {
  const { activeUser } = usePersona();

  // Find delivery partner profile for this user
  const partnerProfile = INITIAL_DELIVERY_PARTNERS.find(p => p.userId === activeUser.userId) || INITIAL_DELIVERY_PARTNERS[0];

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching delivery orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeUser.userId]);

  // Active delivery: Order currently OUT_FOR_DELIVERY assigned to this driver
  const activeDelivery = orders.find(
    o => o.orderStatus === 'OUT_FOR_DELIVERY' && (!o.delivery || o.delivery.partnerId === partnerProfile.partnerId)
  );

  // Available orders ready for driver pickup: PREPARING
  const availableOrders = orders.filter(
    o => o.orderStatus === 'PREPARING'
  );

  // Past completed deliveries
  const completedDeliveries = orders.filter(
    o => o.orderStatus === 'DELIVERED'
  );

  const totalTips = completedDeliveries.reduce((sum, o) => sum + (o.tipAmount || 0), 0);

  const handleClaimAndPickup = async (orderId: number) => {
    setActionLoading(orderId);
    try {
      await updateOrderStatus(orderId, 'OUT_FOR_DELIVERY');
      await fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to claim order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteDelivery = async (orderId: number) => {
    setActionLoading(orderId);
    try {
      await updateOrderStatus(orderId, 'DELIVERED');
      await fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to mark delivered');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#C85A32]">
                Delivery Partner Portal
              </span>
              <span className="text-xs text-stone-500 font-mono">
                Vehicle: {partnerProfile.vehicleType} ({partnerProfile.vehicleNumber})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D241E] tracking-tight">
              {partnerProfile.fullName}&apos;s Delivery Hub
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Pickup assignment, live courier routing, and gratuity earnings.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E0D8CC] text-xs font-medium text-stone-700 hover:bg-[#FAF7F2] shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
            Refresh Feed
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#E0D8CC] p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed Trips</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-2xl font-black text-[#2D241E]">{completedDeliveries.length}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Successfully Delivered</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E0D8CC] p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Tips</span>
              <Coins className="w-4 h-4 text-[#C85A32]" />
            </div>
            <p className="text-2xl font-black text-[#2D241E] font-mono">{formatCurrency(totalTips)}</p>
            <p className="text-[11px] text-[#C85A32] font-medium mt-0.5">Direct courier earnings</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E0D8CC] p-4 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Partner Rating</span>
              <Star className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-[#2D241E]">{formatRating(partnerProfile?.rating)} / 5.0</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Customer feedback score</p>
          </div>
        </div>

        {/* Active Trip Banner if currently delivering */}
        {activeDelivery && (
          <div className="mb-6 bg-[#2D241E] text-white rounded-xl p-5 border border-stone-800 shadow-md">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Active Trip in Progress &bull; En Route to Customer</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">
                  Order #{activeDelivery.orderId} &bull; {activeDelivery.restaurantName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <strong>Deliver to:</strong> {activeDelivery.deliveryAddress}
                  </span>
                  <span className="font-mono bg-stone-800 px-2 py-0.5 rounded text-amber-300">
                    Tip: {formatCurrency(activeDelivery.tipAmount || 0)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCompleteDelivery(activeDelivery.orderId)}
                disabled={actionLoading === activeDelivery.orderId}
                className="px-4 py-2 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Delivered
              </button>
            </div>
          </div>
        )}

        {/* Available Pickups to Claim */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#2D241E] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#C85A32]" />
              <span>Ready for Pickup ({availableOrders.length})</span>
            </h2>
            <span className="text-xs text-stone-500 font-mono">Status: PREPARING</span>
          </div>

          {availableOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-[#E0D8CC]">
              <Bike className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-[#2D241E]">No orders ready for pickup</p>
              <p className="text-xs text-stone-500 mt-1">Kitchens are cooking dishes. As orders finish, they will show here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableOrders.map(order => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-xl border border-[#E0D8CC] p-4 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-[#2D241E]">
                          {order.restaurantName}
                        </h3>
                        <p className="text-xs text-stone-400 font-mono">Order #{order.orderId}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-semibold border border-amber-200">
                        {order.items?.length || 1} item{order.items?.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Drop-off: <strong>{order.deliveryAddress}</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div className="text-xs text-stone-600">
                      <span>Tip: </span>
                      <strong className="font-mono text-emerald-700">{formatCurrency(order.tipAmount || 0)}</strong>
                    </div>

                    <button
                      onClick={() => handleClaimAndPickup(order.orderId)}
                      disabled={actionLoading === order.orderId}
                      className="px-3.5 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs shadow-xs transition"
                    >
                      Pick Up Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Delivered Trips */}
        <div>
          <h2 className="text-lg font-bold text-[#2D241E] mb-3">
            Delivered Trips
          </h2>
          <div className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs overflow-hidden divide-y divide-stone-100">
            {completedDeliveries.map(order => (
              <div key={order.orderId} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#2D241E]">{order.restaurantName}</span>
                  <span className="text-stone-400 font-mono ml-2">Order #{order.orderId}</span>
                  <p className="text-stone-500 text-[11px] mt-0.5">{order.deliveryAddress}</p>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium text-[10px] border border-emerald-200">
                    DELIVERED
                  </span>
                  <p className="text-emerald-700 font-mono font-semibold mt-0.5">
                    +{formatCurrency(order.tipAmount || 0)} Tip
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
