'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, Restaurant, CartItem } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  currentRestaurant: Restaurant | null;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  tipAmount: number;
  totalAmount: number;
  itemCount: number;
  setTipAmount: (tip: number) => void;
  addToCart: (item: MenuItem, restaurant: Restaurant, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  conflictState: {
    isOpen: boolean;
    pendingItem?: MenuItem;
    pendingRestaurant?: Restaurant;
  };
  resolveConflict: (replace: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tipAmount, setTipAmount] = useState<number>(30.00);
  const [conflictState, setConflictState] = useState<{
    isOpen: boolean;
    pendingItem?: MenuItem;
    pendingRestaurant?: Restaurant;
  }>({ isOpen: false });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savour_cart_items_v2');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savour_cart_items_v2', JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  const currentRestaurant = items.length > 0 ? items[0].restaurant : null;

  const addToCart = (item: MenuItem, restaurant: Restaurant, quantity = 1) => {
    // Check if adding from another restaurant
    if (currentRestaurant && currentRestaurant.restaurantId !== restaurant.restaurantId) {
      setConflictState({
        isOpen: true,
        pendingItem: item,
        pendingRestaurant: restaurant
      });
      return;
    }

    setItems(prev => {
      const existing = prev.find(ci => ci.item.itemId === item.itemId);
      if (existing) {
        return prev.map(ci =>
          ci.item.itemId === item.itemId
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      }
      return [...prev, { item, restaurant, quantity }];
    });
  };

  const resolveConflict = (replace: boolean) => {
    if (replace && conflictState.pendingItem && conflictState.pendingRestaurant) {
      setItems([{
        item: conflictState.pendingItem,
        restaurant: conflictState.pendingRestaurant,
        quantity: 1
      }]);
    }
    setConflictState({ isOpen: false });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev =>
      prev.map(ci =>
        ci.item.itemId === itemId ? { ...ci, quantity } : ci
      )
    );
  };

  const removeFromCart = (itemId: number) => {
    setItems(prev => prev.filter(ci => ci.item.itemId !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = Number(
    items.reduce((sum, ci) => sum + (ci.item?.price || 0) * ci.quantity, 0).toFixed(2)
  );

  const deliveryFee = items.length === 0 ? 0.00 : (subtotal >= 499 ? 0.00 : 40.00);
  const taxAmount = Number((subtotal * 0.05).toFixed(2));
  const totalAmount = items.length === 0 ? 0.00 : Number((subtotal + deliveryFee + taxAmount + tipAmount).toFixed(2));
  const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        currentRestaurant,
        subtotal,
        deliveryFee,
        taxAmount,
        tipAmount,
        totalAmount,
        itemCount,
        setTipAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        conflictState,
        resolveConflict
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
