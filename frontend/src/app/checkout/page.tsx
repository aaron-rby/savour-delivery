'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  QrCode,
  Building,
  Banknote,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  Lock,
  Loader2,
  Database,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePersona } from '@/context/PersonaContext';
import { createOrder } from '@/lib/api';
import { PaymentMethod } from '@/lib/types';
import { formatCurrency } from '@/lib/currency';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, currentRestaurant, subtotal, deliveryFee, taxAmount, tipAmount, totalAmount, clearCart } = useCart();
  const { activeUser } = usePersona();

  const [address, setAddress] = useState(activeUser.address || 'Flat 402, Shanti Niketan, New Delhi');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txnLogs, setTxnLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0 || !currentRestaurant) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-16">
        <div className="max-w-md mx-auto py-10 px-4 text-center">
          <h2 className="text-xl font-bold text-[#2D241E]">No items in cart for checkout</h2>
          <p className="text-xs text-stone-500 mt-1">Please add dishes to your cart before proceeding.</p>
          <Link
            href="/restaurants"
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C85A32] text-white text-xs font-semibold hover:bg-[#B34D28] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setTxnLogs([
      '1. Initializing Oracle ACID transaction block...',
      '2. Validating foreign keys: customer_id & restaurant_id...',
      '3. Freezing agreed unit prices into ORDER_ITEMS...',
      '4. Recording payment record with status SUCCESS...',
      '5. Committing transaction to Oracle Database...'
    ]);

    try {
      const payload = {
        customerId: activeUser.userId,
        restaurantId: currentRestaurant.restaurantId,
        deliveryAddress: address,
        items: items.map(ci => ({
          itemId: ci.item.itemId,
          quantity: ci.quantity
        })),
        tipAmount,
        paymentMethod
      };

      const newOrder = await createOrder(payload);
      clearCart();

      // Navigate to /orders
      setTimeout(() => {
        router.push(`/orders?newOrderId=${newOrder.orderId}`);
      }, 1000);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setErrorMsg(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  const paymentOptions = [
    { id: 'UPI', label: 'UPI Instant Pay', icon: QrCode, desc: 'Google Pay, PhonePe, Paytm' },
    { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, RuPay' },
    { id: 'NET_BANKING', label: 'Net Banking', icon: Building, desc: 'SBI, HDFC, ICICI & major banks' },
    { id: 'CASH_ON_DELIVERY', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay cash upon delivery' }
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-[#C85A32] mb-4 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Cart
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D241E] tracking-tight">
            Checkout &amp; Confirmation
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Confirm your delivery address and finalize payment with ACID transactional guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Address & Payment Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Active Persona Banner */}
            <div className="bg-white rounded-xl p-4 border border-[#E0D8CC] shadow-xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C85A32] flex items-center justify-center font-bold text-white text-xs">
                  {activeUser.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#2D241E]">Ordering as: {activeUser.fullName}</p>
                  <p className="text-[11px] text-stone-500 font-mono">User ID #{activeUser.userId} &bull; {activeUser.email}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified
              </span>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl border border-[#E0D8CC] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#2D241E] font-bold text-sm border-b border-stone-100 pb-2.5">
                <MapPin className="w-4 h-4 text-[#C85A32]" />
                <span>1. Delivery Destination</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Complete Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs text-[#2D241E] focus:outline-none focus:border-[#C85A32]"
                    placeholder="Enter delivery address"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs text-[#2D241E] focus:outline-none focus:border-[#C85A32]"
                    placeholder="e.g. Leave at reception or call on arrival"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-[#E0D8CC] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#2D241E] font-bold text-sm border-b border-stone-100 pb-2.5">
                <Lock className="w-4 h-4 text-[#C85A32]" />
                <span>2. Payment Option</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {paymentOptions.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id as PaymentMethod)}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-[#C85A32] bg-orange-50/50 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className={`p-1.5 rounded-md ${isSelected ? 'bg-[#C85A32] text-white' : 'bg-stone-100 text-stone-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-bold text-xs ${isSelected ? 'text-[#C85A32]' : 'text-[#2D241E]'}`}>
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-stone-500">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Transaction Log */}
            {isSubmitting && (
              <div className="bg-[#2D241E] text-emerald-400 rounded-xl p-4 border border-stone-800 font-mono text-xs space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-stone-700">
                  <Database className="w-4 h-4 text-[#C85A32]" />
                  <span>Executing Oracle ACID Transaction</span>
                  <Loader2 className="w-3 h-3 animate-spin text-amber-400 ml-auto" />
                </div>
                {txnLogs.map((log, i) => (
                  <p key={i} className="text-emerald-300 text-[11px]">
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Right Summary Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#E0D8CC] p-5 shadow-xs space-y-4">
              <h2 className="font-bold text-sm text-[#2D241E] border-b border-stone-100 pb-2.5">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-[#2D241E]">{currentRestaurant.name}</p>
                {items.map(({ item, quantity }) => (
                  <div key={item.itemId} className="flex justify-between text-stone-600">
                    <span>{quantity}x {item.name}</span>
                    <span className="font-mono">{formatCurrency(item.price * quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                <div className="flex justify-between">
                  <span>Courier Tip</span>
                  <span className="font-mono font-semibold text-[#2D241E]">{formatCurrency(tipAmount)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-[#2D241E]">Total Due</span>
                  <span className="font-extrabold text-lg text-[#C85A32] font-mono">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition ${
                  isSubmitting
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-[#C85A32] hover:bg-[#B34D28] text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Committing Order...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Confirm &amp; Place Order ({formatCurrency(totalAmount)})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
