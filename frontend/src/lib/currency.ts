// Currency & Numeric Formatting Utilities for SAVOUR (Indian Rupees ₹)

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Formats a monetary value into Indian Rupee format (e.g. ₹650.00, ₹1,250.00).
 * Safely handles null, undefined, and non-numeric inputs without crashing.
 */
export function formatCurrency(amount: number | null | undefined, fallback: string = '₹0.00'): string {
  if (amount == null) return fallback;
  const num = Number(amount);
  if (isNaN(num)) return fallback;
  return inrFormatter.format(num);
}

/**
 * Safely formats a rating number to 1 decimal place.
 */
export function formatRating(rating: number | null | undefined, fallback: string = '4.8'): string {
  if (rating == null) return fallback;
  const num = Number(rating);
  if (isNaN(num)) return fallback;
  return num.toFixed(1);
}

/**
 * Returns initials from a restaurant or entity name (e.g. 'Trattoria Bella' -> 'TB')
 */
export function getInitials(name: string | null | undefined, fallback: string = 'SV'): string {
  if (!name || name.trim() === '') return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Returns a tasteful, muted earth-toned background color for restaurant badges
 * matching the cream and terracotta visual design language.
 */
export function getRestaurantBadgeColor(id: number | null | undefined): { bg: string; text: string; border: string } {
  const colors = [
    { bg: 'bg-[#C85A32]', text: 'text-white', border: 'border-[#B34D28]' }, // Terracotta
    { bg: 'bg-[#8B5E3C]', text: 'text-white', border: 'border-[#724C30]' }, // Warm Mocha
    { bg: 'bg-[#5C715E]', text: 'text-white', border: 'border-[#4A5C4C]' }, // Sage Olive
    { bg: 'bg-[#B07D3E]', text: 'text-white', border: 'border-[#946831]' }, // Warm Amber
    { bg: 'bg-[#6D5D6E]', text: 'text-white', border: 'border-[#594C5A]' }, // Muted Slate
    { bg: 'bg-[#A8644A]', text: 'text-white', border: 'border-[#8F523B]' }, // Brick Rust
  ];
  const index = Math.abs(Number(id) || 0) % colors.length;
  return colors[index];
}
