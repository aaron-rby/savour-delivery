'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Star,
  Clock,
  UtensilsCrossed,
  ArrowRight,
  MapPin,
  Check
} from 'lucide-react';
import { getRestaurants } from '@/lib/api';
import { Restaurant } from '@/lib/types';
import { formatRating, getInitials, getRestaurantBadgeColor } from '@/lib/currency';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [openOnly, setOpenOnly] = useState(false);

  useEffect(() => {
    async function fetchList() {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to load restaurants:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, []);

  const cuisines = ['All', 'Italian', 'Indian', 'Japanese', 'Mexican', 'French Bakery & Cafe', 'American Craft Burgers'];

  const filtered = restaurants.filter(r => {
    if (!r) return false;
    const name = r.name || '';
    const cuisine = r.cuisineType || '';
    const address = r.address || '';
    const matchesSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || cuisine.toLowerCase().includes(search.toLowerCase()) || address.toLowerCase().includes(search.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
    const matchesRating = (r.rating ?? 0) >= minRating;
    const matchesOpen = !openOnly || Boolean(r.isOpen);
    return matchesSearch && matchesCuisine && matchesRating && matchesOpen;
  });

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2D241E] tracking-tight">
            Restaurants Directory
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Browse verified kitchens with real-time operational status and relational integrity checks.
          </p>
        </div>

        {/* Clean Filter Bar */}
        <div className="bg-white rounded-xl p-4 border border-[#E0D8CC] shadow-xs mb-6 space-y-3">
          {/* Search Input */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-[#FAF7F2] rounded-lg border border-stone-200">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by restaurant name, cuisine, or address..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-[#2D241E] placeholder:text-stone-400 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-[11px] text-stone-500 hover:text-stone-800 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          {/* Cuisine Chips & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
              {cuisines.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCuisine(c)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCuisine === c
                      ? 'bg-[#C85A32] text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-[#FAF7F2] border border-stone-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Rating Filter */}
              <div className="flex items-center gap-1 text-xs text-stone-600">
                <span className="text-[11px] font-medium text-stone-500">Min Rating:</span>
                <select
                  value={minRating}
                  onChange={e => setMinRating(Number(e.target.value))}
                  className="bg-[#FAF7F2] border border-stone-200 rounded px-2 py-0.5 text-xs text-[#2D241E] focus:outline-none"
                >
                  <option value={0}>Any</option>
                  <option value={4.5}>4.5+ ★</option>
                  <option value={4.7}>4.7+ ★</option>
                  <option value={4.8}>4.8+ ★</option>
                </select>
              </div>

              {/* Open Only Toggle */}
              <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openOnly}
                  onChange={e => setOpenOnly(e.target.checked)}
                  className="rounded text-[#C85A32] focus:ring-0"
                />
                <span>Open Now</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-stone-500 font-medium">
            Showing <span className="font-semibold text-[#2D241E]">{filtered.length}</span> restaurant{filtered.length === 1 ? '' : 's'}
          </p>
          {(selectedCuisine !== 'All' || search || minRating > 0 || openOnly) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCuisine('All');
                setMinRating(0);
                setOpenOnly(false);
              }}
              className="text-xs text-[#C85A32] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Loading / Empty / Restaurant Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-44 bg-white border border-[#E0D8CC] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-[#E0D8CC]">
            <UtensilsCrossed className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-[#2D241E]">No restaurants match your criteria</h3>
            <p className="text-stone-500 text-xs mt-1">Try expanding your search query or reset filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(restaurant => {
              const ratingDisplay = formatRating(restaurant.rating);
              const nameDisplay = restaurant.name || 'Restaurant';
              const cuisineDisplay = restaurant.cuisineType || 'Cuisine';
              const addressDisplay = restaurant.address || 'Address on order confirmation';
              const isOpen = Boolean(restaurant.isOpen);
              const initials = getInitials(nameDisplay);
              const badgeTheme = getRestaurantBadgeColor(restaurant.restaurantId);

              return (
                <div
                  key={restaurant.restaurantId}
                  className="bg-white rounded-xl border border-[#E0D8CC] hover:border-[#C85A32] p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Badge & Status */}
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

                    <p className="text-xs text-stone-500 flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{addressDisplay}</span>
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

                  {/* View Menu Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-400 font-mono">
                      {isOpen ? 'Accepting Orders' : 'Offline'}
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
      </div>
    </div>
  );
}
