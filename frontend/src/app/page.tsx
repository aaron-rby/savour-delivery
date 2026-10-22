'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Search,
  Star,
  Clock,
  ArrowRight,
  Database,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Award,
  ChefHat
} from 'lucide-react';
import { getRestaurants } from '@/lib/api';
import { Restaurant } from '@/lib/types';
import { formatRating, getInitials, getRestaurantBadgeColor } from '@/lib/currency';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [loading, setLoading] = useState(true);

  const cuisines = [
    { label: 'All', icon: Sparkles },
    { label: 'Italian', icon: UtensilsCrossed },
    { label: 'Indian', icon: ChefHat },
    { label: 'Japanese', icon: Award },
    { label: 'Mexican', icon: TrendingUp },
    { label: 'French Bakery', icon: UtensilsCrossed }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredRestaurants = restaurants.filter(r => {
    if (!r) return false;
    const cuisine = r.cuisineType || '';
    const name = r.name || '';
    const matchesCuisine = selectedCuisine === 'All' || cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
    const matchesSearch = !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase()) || cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCuisine && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-12 pb-16 bg-[#FAF7F2]">
      {/* Minimalist Hero Section */}
      <section className="bg-white border-b border-[#E8E2D9] pt-14 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E0D8CC] text-[#C85A32] text-xs font-semibold uppercase tracking-wider">
            <Database className="w-3.5 h-3.5" />
            <span>BACSE202 Database Systems &bull; VIT Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2D241E] leading-tight">
            SAVOUR Delivery System
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            A normalized relational food delivery system with ACID transactions, Oracle SQL constraints, and Indian Rupee (₹) pricing.
          </p>

          {/* Clean Search Input */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-[#FAF7F2] border border-[#E0D8CC] rounded-xl shadow-xs">
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-white rounded-lg border border-stone-200">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, dishes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#2D241E] placeholder:text-stone-400 focus:outline-none"
                />
              </div>
              <Link
                href="/restaurants"
                className="px-4 py-2 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Cuisine Filter Buttons */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
            {cuisines.map(c => (
              <button
                key={c.label}
                onClick={() => setSelectedCuisine(c.label)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCuisine === c.label
                    ? 'bg-[#C85A32] text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-stone-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D241E]">
              Featured Restaurants
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Explore authentic dining spots with real-time availability</p>
          </div>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#C85A32] hover:underline"
          >
            All restaurants ({restaurants.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-44 bg-white border border-[#E0D8CC] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-[#E0D8CC]">
            <UtensilsCrossed className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#2D241E]">No restaurants match your search</h3>
            <p className="text-stone-500 text-xs mt-1">Try resetting the cuisine or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRestaurants.map(restaurant => {
              const ratingDisplay = formatRating(restaurant.rating);
              const nameDisplay = restaurant.name || 'Restaurant';
              const cuisineDisplay = restaurant.cuisineType || 'Cuisine';
              const addressDisplay = restaurant.address || 'Address provided on checkout';
              const isOpen = Boolean(restaurant.isOpen);
              const initials = getInitials(nameDisplay);
              const badgeTheme = getRestaurantBadgeColor(restaurant.restaurantId);

              return (
                <div
                  key={restaurant.restaurantId}
                  className="bg-white rounded-xl border border-[#E0D8CC] hover:border-[#C85A32] p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Header: Initials Badge + Rating & Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${badgeTheme.bg} ${badgeTheme.text} font-bold text-base flex items-center justify-center tracking-wider shadow-xs`}>
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-[#2D241E]">
                            {nameDisplay}
                          </h3>
                          <p className="text-xs text-[#C85A32] font-medium">
                            {cuisineDisplay}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        isOpen ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}>
                        {isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-1 mb-3">
                      {addressDisplay}
                    </p>

                    {/* Metadata strip */}
                    <div className="flex items-center gap-3 text-xs text-stone-600 mb-4 pb-3 border-b border-stone-100">
                      <span className="flex items-center gap-1 font-semibold text-amber-700">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {ratingDisplay}
                      </span>
                      <span className="text-stone-300">&bull;</span>
                      <span className="flex items-center gap-1 text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {restaurant.deliveryTimeEstimate || '25-35 min'}
                      </span>
                      <span className="text-stone-300">&bull;</span>
                      <span className="font-mono text-stone-500 text-[11px]">
                        ID #{restaurant.restaurantId}
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-400 font-mono">
                      Fast Delivery
                    </span>
                    <Link
                      href={`/restaurants/${restaurant.restaurantId}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white font-semibold text-xs inline-flex items-center gap-1 shadow-xs transition-colors"
                    >
                      View Menu
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Relational Database Architecture Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
        <div className="bg-white border border-[#E0D8CC] rounded-xl p-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] uppercase font-bold text-[#C85A32] tracking-wider">
              Relational Guarantees
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D241E] mt-1">
              Database Systems Architecture
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Demonstrates Oracle SQL schema design, DDL constraints, and Spring Boot JDBC repositories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E8E2D9]">
              <div className="w-8 h-8 rounded-md bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center mb-3">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#2D241E] mb-1">1. Price Freezing</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Item prices are frozen upon order placement into <code className="text-[#C85A32] font-mono">agreed_unit_price</code>. Subsequent menu updates never distort order history.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E8E2D9]">
              <div className="w-8 h-8 rounded-md bg-emerald-600/10 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#2D241E] mb-1">2. Referential Integrity</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Foreign key constraints enforce that all ordered items belong to the same restaurant. Cross-restaurant cart pollution is atomically prevented.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E8E2D9]">
              <div className="w-8 h-8 rounded-md bg-stone-700/10 text-[#2D241E] flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#2D241E] mb-1">3. State Machine</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Orders advance through strictly validated states: <code className="text-[#2D241E] font-mono">PLACED &rarr; PREPARING &rarr; OUT_FOR_DELIVERY &rarr; DELIVERED</code>.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs shadow-xs transition"
            >
              Open Database Sandbox &amp; Integrity Checker
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
