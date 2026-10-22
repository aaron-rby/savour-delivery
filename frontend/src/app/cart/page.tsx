'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  UtensilsCrossed,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/currency';

export default function CartPage() {
  const {
    items,
    currentRestaurant,
    subtotal,
    deliveryFee,
    taxAmount,
    tipAmount,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    setTipAmount
  } = useCart();

  const tipOptions = [0, 20, 30, 50];
  const freeDeliveryThreshold = 499.00;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  if (items.length === 0 || !currentRestaurant) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white border border-[#E0D8CC] text-[#C85A32] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D241E]">Your Cart is Empty</h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Explore restaurants and add your favorite dishes to begin your order.
          </p>
          <Link
            href="/restaurants"
            className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs shadow-xs transition"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D241E] tracking-tight">
              Order Cart
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              Ordering from <span className="font-semibold text-[#2D241E]">{currentRestaurant.name}</span>
            </p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1 text-xs text-rose-700 hover:text-rose-900 font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Delivery Banner */}
            <div className="bg-white border border-[#E0D8CC] rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-[#2D241E]">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                {remainingForFreeDelivery > 0 ? (
                  <p>
                    Add <span className="font-bold text-[#C85A32]">{formatCurrency(remainingForFreeDelivery)}</span> more for <strong>Free Delivery</strong>!
                  </p>
                ) : (
                  <p className="text-emerald-700 font-semibold">
                    Free Delivery Unlocked (Orders &ge; ₹499)
                  </p>
                )}
              </div>
            </div>

            {/* Items Table / Cards */}
            <div className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs divide-y divide-stone-100 overflow-hidden">
              {items.map(({ item, quantity }) => (
                <div key={item.itemId} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-[#2D241E]">{item.name}</h3>
                    <p className="text-xs text-stone-500 font-mono">
                      {formatCurrency(item.price)} each &bull; Item #{item.itemId}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-[#FAF7F2] overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.itemId, quantity - 1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-xs text-[#2D241E] font-mono">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.itemId, quantity + 1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold font-mono text-xs sm:text-sm text-[#2D241E] w-20 text-right">
                      {formatCurrency(item.price * quantity)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.itemId)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <Link
                href={`/restaurants/${currentRestaurant.restaurantId}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#C85A32] hover:underline"
              >
                <ArrowLeft className="w-3 h-3" />
                Add more items from {currentRestaurant.name}
              </Link>
            </div>
          </div>

          {/* Bill Breakdown Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#E0D8CC] shadow-xs p-5 space-y-4">
              <h2 className="font-bold text-sm text-[#2D241E] border-b border-stone-100 pb-2.5">
                Bill Summary
              </h2>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-mono font-semibold text-[#2D241E]">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono font-semibold text-[#2D241E]">
                    {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : formatCurrency(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-mono font-semibold text-[#2D241E]">{formatCurrency(taxAmount)}</span>
                </div>

                {/* Delivery Partner Tip Selection */}
                <div className="pt-2 border-t border-stone-100">
                  <span className="font-medium text-[#2D241E] block mb-1.5 text-xs">Courier Tip</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {tipOptions.map(t => (
                      <button
                        key={t}
                        onClick={() => setTipAmount(t)}
                        className={`py-1 rounded text-xs font-mono font-semibold transition ${
                          tipAmount === t
                            ? 'bg-[#C85A32] text-white shadow-xs'
                            : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-200 border border-stone-200'
                        }`}
                      >
                        {t === 0 ? 'None' : `₹${t}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-2.5 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#2D241E]">Total Amount</span>
                  <span className="font-extrabold text-lg text-[#C85A32] font-mono">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-2.5 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                Proceed to Checkout
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Relational Database Note */}
            <div className="bg-white rounded-xl p-4 text-[11px] space-y-1 border border-[#E0D8CC]">
              <div className="flex items-center gap-1.5 text-[#C85A32] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ACID Price Freezing Invariant</span>
              </div>
              <p className="text-stone-500 leading-relaxed">
                Unit prices are locked in <code className="text-[#C85A32] font-mono">ORDER_ITEMS.agreed_unit_price</code>.
                Foreign key constraints prevent multi-restaurant cart mixing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
