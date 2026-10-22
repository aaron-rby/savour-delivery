'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Flame
} from 'lucide-react';
import { getRestaurantById, getMenuItems } from '@/lib/api';
import { Restaurant, MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency, formatRating, getInitials, getRestaurantBadgeColor } from '@/lib/currency';

function RestaurantDetailContent() {
  const params = useParams();
  const restaurantId = parseInt(params.id as string, 10);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const { items: cartItems, addToCart, updateQuantity, itemCount, totalAmount } = useCart();

  useEffect(() => {
    async function loadRestaurant() {
      try {
        const [r, m] = await Promise.all([
          getRestaurantById(restaurantId),
          getMenuItems(restaurantId)
        ]);
        if (r) setRestaurant(r);
        setMenuItems(m);
      } catch (err) {
        console.error('Error loading restaurant:', err);
      } finally {
        setLoading(false);
      }
    }
    if (restaurantId) {
      loadRestaurant();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#FAF7F2]">
        <div className="h-44 bg-white border border-[#E0D8CC] rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-white border border-[#E0D8CC] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-[#E0D8CC] rounded-xl text-center">
        <h2 className="text-lg font-bold text-[#2D241E]">Restaurant Not Found</h2>
        <p className="text-xs text-stone-500 mt-1">Restaurant ID #{restaurantId} does not exist in the database.</p>
        <Link
          href="/restaurants"
          className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#C85A32] text-white text-xs font-semibold hover:bg-[#B34D28] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(menuItems.map(m => m.category)))];

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const getItemQuantityInCart = (itemId: number) => {
    const found = cartItems.find(ci => ci.item.itemId === itemId);
    return found ? found.quantity : 0;
  };

  const badgeTheme = getRestaurantBadgeColor(restaurant.restaurantId);
  const initials = getInitials(restaurant.name);

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-24">
      {/* Restaurant Header Section */}
      <div className="bg-white border-b border-[#E8E2D9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#C85A32] font-medium mb-4 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Restaurants
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Initials Badge */}
              <div className={`w-16 h-16 rounded-xl ${badgeTheme.bg} ${badgeTheme.text} font-bold text-xl flex items-center justify-center shrink-0 shadow-xs`}>
                {initials}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#C85A32]">
                    {restaurant.cuisineType}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    restaurant.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {restaurant.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#2D241E]">
                  {restaurant.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-600">
                  <span className="flex items-center gap-1 font-semibold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {formatRating(restaurant.rating)}
                  </span>
                  <span className="text-stone-300">&bull;</span>
                  <span className="flex items-center gap-1 text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {restaurant.deliveryTimeEstimate || '25-35 min'}
                  </span>
                  <span className="text-stone-300">&bull;</span>
                  <span className="flex items-center gap-1 text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {restaurant.address}
                  </span>
                  {restaurant.phone && (
                    <>
                      <span className="text-stone-300">&bull;</span>
                      <span className="flex items-center gap-1 font-mono text-stone-500">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        {restaurant.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-stone-500 pt-2 sm:pt-0">
              <span className="px-2.5 py-1 rounded bg-[#FAF7F2] border border-stone-200">
                Restaurant ID #{restaurant.restaurantId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-[#E8E2D9]">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#C85A32] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid (Minimalist & Photo-Free) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const qty = getItemQuantityInCart(item.itemId);

            return (
              <div
                key={item.itemId}
                className={`bg-white rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                  item.isAvailable
                    ? 'border-[#E0D8CC] hover:border-[#C85A32]'
                    : 'border-stone-200 opacity-60 bg-stone-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      {/* Veg / Non-Veg Indicator */}
                      <span
                        title={item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                        className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center p-0.5 ${
                          item.isVegetarian ? 'border-emerald-600' : 'border-rose-600'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.isVegetarian ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                      </span>

                      <h3 className="font-bold text-sm text-[#2D241E]">{item.name}</h3>

                      {item.spicyLevel && item.spicyLevel > 0 && (
                        <span className="flex items-center text-[10px] text-rose-600 font-semibold gap-0.5">
                          <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                          {item.spicyLevel === 2 ? 'Spicy' : 'Mild'}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-stone-400">#{item.itemId}</span>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-sm font-bold text-[#2D241E]">
                    {formatCurrency(item.price)}
                  </span>

                  {item.isAvailable ? (
                    qty === 0 ? (
                      <button
                        onClick={() => addToCart(item, restaurant)}
                        className="px-3 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center border border-[#C85A32] rounded-lg bg-orange-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.itemId, qty - 1)}
                          className="px-2 py-1 text-[#C85A32] hover:bg-orange-100 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-xs text-[#2D241E] font-mono">
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemId, qty + 1)}
                          className="px-2 py-1 text-[#C85A32] hover:bg-orange-100 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  ) : (
                    <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40">
          <div className="bg-[#2D241E] rounded-xl p-3.5 shadow-xl flex items-center justify-between text-white border border-stone-800">
            <div>
              <p className="text-xs text-stone-300">
                {itemCount} item{itemCount > 1 ? 's' : ''} in cart
              </p>
              <p className="text-sm font-bold text-amber-400">
                {formatCurrency(totalAmount)}{' '}
                <span className="text-[10px] font-normal text-stone-400">(incl. tax &amp; delivery)</span>
              </p>
            </div>

            <Link
              href="/cart"
              className="px-4 py-2 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              View Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RestaurantDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#FAF7F2]">
          <div className="h-44 bg-white border border-[#E0D8CC] rounded-xl animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-28 bg-white border border-[#E0D8CC] rounded-xl animate-pulse" />
            <div className="h-28 bg-white border border-[#E0D8CC] rounded-xl animate-pulse" />
          </div>
        </div>
      }
    >
      <RestaurantDetailContent />
    </Suspense>
  );
}
