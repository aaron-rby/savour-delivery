'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  ChefHat,
  Star,
  RefreshCw,
  Phone,
  Ban,
  ArrowRight
} from 'lucide-react';
import { usePersona } from '@/context/PersonaContext';
import { getOrders, updateOrderStatus, submitReview } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { formatCurrency } from '@/lib/currency';

function OrdersContent() {
  const searchParams = useSearchParams();
  const highlightedOrderId = searchParams.get('newOrderId');
  const { activeUser } = usePersona();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');

  // Review modal state
  const [reviewModalOrder, setReviewModalOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders(activeUser.role === 'ADMIN' ? undefined : activeUser.userId);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [activeUser.userId, activeUser.role]);

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await updateOrderStatus(orderId, 'CANCELLED');
      fetchUserOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalOrder) return;
    setSubmittingReview(true);
    setReviewError(null);

    try {
      await submitReview({
        orderId: reviewModalOrder.orderId,
        customerId: activeUser.userId,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewModalOrder(null);
      setReviewComment('');
      fetchUserOrders();
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const timelineSteps: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
    { key: 'PLACED', label: 'Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'PREPARING', label: 'Kitchen', icon: ChefHat },
    { key: 'OUT_FOR_DELIVERY', label: 'En Route', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return -1;
    }
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'ACTIVE') {
      return ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.orderStatus);
    }
    if (statusFilter === 'COMPLETED') {
      return o.orderStatus === 'DELIVERED';
    }
    if (statusFilter === 'CANCELLED') {
      return o.orderStatus === 'CANCELLED';
    }
    return true;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D241E] tracking-tight">
              My Orders &amp; Tracking
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Active persona: <span className="font-semibold text-[#2D241E]">{activeUser.fullName}</span> (ID #{activeUser.userId})
            </p>
          </div>

          <button
            onClick={fetchUserOrders}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E0D8CC] text-xs font-medium text-stone-700 hover:bg-[#FAF7F2] shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
            Refresh Orders
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mb-6">
          {(['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === tab
                  ? 'bg-[#C85A32] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-stone-200'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-44 bg-white border border-[#E0D8CC] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-[#E0D8CC]">
            <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#2D241E]">No orders found</h3>
            <p className="text-stone-500 text-xs mt-1">Place an order from any available restaurant to see it tracked here.</p>
            <Link
              href="/restaurants"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold shadow-xs"
            >
              Explore Restaurants
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const isDelivered = order.orderStatus === 'DELIVERED';
              const isCancelled = order.orderStatus === 'CANCELLED';
              const canCancel = order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED';
              const stepIdx = getStepIndex(order.orderStatus);
              const isHighlighted = highlightedOrderId && parseInt(highlightedOrderId, 10) === order.orderId;

              return (
                <div
                  key={order.orderId}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all space-y-4 ${
                    isHighlighted ? 'border-[#C85A32] ring-2 ring-orange-200' : 'border-[#E0D8CC]'
                  }`}
                >
                  {/* Order Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-base text-[#2D241E]">
                          {order.restaurantName || `Restaurant #${order.restaurantId}`}
                        </h2>
                        <span className="text-xs font-mono font-semibold text-stone-400">
                          #{order.orderId}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                        Placed: {order.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isCancelled
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition"
                        >
                          Cancel
                        </button>
                      )}

                      {isDelivered && !order.review && (
                        <button
                          onClick={() => {
                            setReviewModalOrder(order);
                            setReviewRating(5);
                            setReviewComment('');
                            setReviewError(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 flex items-center gap-1 transition"
                        >
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Rate
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tracking Stepper */}
                  {!isCancelled ? (
                    <div className="py-2">
                      <div className="grid grid-cols-5 gap-2 relative">
                        {timelineSteps.map((s, idx) => {
                          const Icon = s.icon;
                          const isPastOrCurrent = stepIdx >= idx;
                          const isCurrent = stepIdx === idx;

                          return (
                            <div key={s.key} className="flex flex-col items-center text-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${
                                  isCurrent
                                    ? 'bg-[#C85A32] text-white shadow-xs'
                                    : isPastOrCurrent
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-stone-100 text-stone-400'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span
                                className={`text-[11px] font-medium ${
                                  isCurrent
                                    ? 'text-[#C85A32] font-bold'
                                    : isPastOrCurrent
                                    ? 'text-stone-800'
                                    : 'text-stone-400'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>This order was cancelled. Payment refunded to original payment method.</span>
                    </div>
                  )}

                  {/* Items & Price Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Item lines */}
                    <div className="space-y-1.5 bg-[#FAF7F2] rounded-lg p-3.5 border border-[#E8E2D9]">
                      <p className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Frozen Agreed Items
                      </p>
                      {order.items?.map(it => (
                        <div key={it.orderItemId} className="flex justify-between text-xs text-stone-700">
                          <div>
                            <span className="font-semibold text-[#2D241E]">{it.quantity}x</span> {it.itemName || `Item #${it.itemId}`}
                            <span className="text-[10px] text-stone-500 ml-1 font-mono">
                              @ {formatCurrency(it.agreedUnitPrice)}
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-[#2D241E]">
                            {formatCurrency((it.agreedUnitPrice || 0) * (it.quantity || 1))}
                          </span>
                        </div>
                      ))}

                      <div className="pt-2 border-t border-stone-200 text-xs text-stone-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Delivery Fee</span>
                          <span className="font-mono">
                            {(order.deliveryFee ?? 0) === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (5%)</span>
                          <span className="font-mono">{formatCurrency(order.taxAmount)}</span>
                        </div>
                        {(order.tipAmount ?? 0) > 0 && (
                          <div className="flex justify-between">
                            <span>Courier Tip</span>
                            <span className="font-mono">{formatCurrency(order.tipAmount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-[#2D241E] pt-1.5 border-t border-stone-200 text-sm">
                          <span>Total Paid</span>
                          <span className="font-mono text-[#C85A32]">{formatCurrency(order.totalAmount)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Logistics & Review info */}
                    <div className="space-y-3 text-xs">
                      <div className="bg-[#FAF7F2] rounded-lg p-3.5 border border-[#E8E2D9] space-y-1">
                        <p className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                          Delivery Details
                        </p>
                        <p className="text-stone-600">
                          <strong className="text-stone-800">Address:</strong> {order.deliveryAddress}
                        </p>
                        <p className="text-stone-600 font-mono">
                          <strong className="text-stone-800 font-sans">Payment:</strong> {order.payment?.paymentMethod || 'CARD'} &bull; Ref: {order.payment?.transactionRef || 'TXN-SETTLED'}
                        </p>
                      </div>

                      {order.delivery && (
                        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 space-y-1">
                          <p className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-emerald-700" />
                            Courier Assigned
                          </p>
                          <p className="text-emerald-800">
                            {order.delivery.partnerName || 'Courier Partner'} &bull; Status: {order.delivery.deliveryStatus}
                          </p>
                          {order.delivery.partnerPhone && (
                            <p className="text-emerald-700 font-mono text-[11px] flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {order.delivery.partnerPhone}
                            </p>
                          )}
                        </div>
                      )}

                      {order.review && (
                        <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 space-y-0.5">
                          <div className="flex items-center gap-1 text-amber-900 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Rated {order.review.rating} / 5 Stars</span>
                          </div>
                          {order.review.comment && (
                            <p className="text-stone-600 italic">
                              &ldquo;{order.review.comment}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {reviewModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl border border-[#E0D8CC] max-w-md w-full p-6 text-[#2D241E] shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2.5">
                <div>
                  <h3 className="font-bold text-base text-[#2D241E]">Rate Your Dining Experience</h3>
                  <p className="text-xs text-stone-500">Order #{reviewModalOrder.orderId} &bull; {reviewModalOrder.restaurantName}</p>
                </div>
                <button
                  onClick={() => setReviewModalOrder(null)}
                  className="text-stone-400 hover:text-stone-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-105 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            reviewRating >= star ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-mono font-bold text-xs text-[#2D241E]">
                      {reviewRating} of 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Comments
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs text-[#2D241E] focus:outline-none focus:border-[#C85A32]"
                    placeholder="Share feedback on meal quality, temperature, and delivery..."
                  />
                </div>

                {reviewError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {reviewError}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOrder(null)}
                    className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-4 py-2 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs shadow-xs transition"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full bg-[#FAF7F2]">
          <div className="h-44 bg-white border border-[#E0D8CC] rounded-xl animate-pulse" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
