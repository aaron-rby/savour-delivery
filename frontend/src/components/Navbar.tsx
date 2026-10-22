'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePersona } from '@/context/PersonaContext';
import { useCart } from '@/context/CartContext';
import { checkBackendHealth, BackendHealthResponse } from '@/lib/api';
import { INITIAL_USERS } from '@/lib/demoData';
import {
  UtensilsCrossed,
  ShoppingBag,
  UserCheck,
  ChevronDown,
  ChefHat,
  Bike,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { activeUser, setPersona, allPersonas, isMounted } = usePersona();
  const { itemCount, conflictState, resolveConflict } = useCart();
  const [personaOpen, setPersonaOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<BackendHealthResponse>({
    connected: false,
    mode: 'STANDALONE_DEMO',
    message: 'Checking...',
    timestamp: ''
  });
  const [checkingHealth, setCheckingHealth] = useState(false);

  const runHealthCheck = async () => {
    setCheckingHealth(true);
    const res = await checkBackendHealth();
    setHealthStatus(res);
    setCheckingHealth(false);
  };

  useEffect(() => {
    runHealthCheck();
    const interval = setInterval(runHealthCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  const primaryNav = [
    { label: 'Home', href: '/' },
    { label: 'Restaurants', href: '/restaurants' },
    { label: 'My Orders', href: '/orders' },
  ];

  const portals = [
    { label: 'Kitchen', href: '/operator', icon: ChefHat },
    { label: 'Courier', href: '/delivery', icon: Bike },
    { label: 'DB Admin', href: '/admin', icon: Database },
  ];

  // Deterministic server and initial client persona rendering
  const displayName = isMounted ? activeUser.fullName : INITIAL_USERS[0].fullName;
  const displayRole = isMounted ? activeUser.role : INITIAL_USERS[0].role;
  const displayId = isMounted ? activeUser.userId : INITIAL_USERS[0].userId;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E2D9] text-[#2D241E] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-[#C85A32] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-lg tracking-tight text-[#2D241E]">SAVOUR</span>
                    <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      VIT
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 font-medium">Database Systems</p>
                </div>
              </Link>

              {/* Main Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                {primaryNav.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#C85A32] text-white shadow-sm'
                          : 'text-[#5A4E45] hover:text-[#2D241E] hover:bg-[#EFE9DF]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <span className="h-4 w-px bg-stone-300 mx-1" />

                {portals.map(p => {
                  const Icon = p.icon;
                  const isActive = pathname === p.href;
                  return (
                    <Link
                      key={p.href}
                      href={p.href}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-stone-800 text-white'
                          : 'text-[#6C6057] hover:text-[#2D241E] hover:bg-[#EFE9DF]'
                      }`}
                    >
                      <Icon className="w-3 h-3 text-[#C85A32]" />
                      <span>{p.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2.5">
              {/* Oracle Live Status Indicator */}
              <button
                onClick={runHealthCheck}
                title="Click to check Oracle JDBC connectivity"
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                  healthStatus.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${healthStatus.connected ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                <span>{healthStatus.connected ? 'Oracle Live' : 'Demo Mode'}</span>
                <RefreshCw className={`w-2.5 h-2.5 text-stone-400 ${checkingHealth ? 'animate-spin' : ''}`} />
              </button>

              {/* Persona Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPersonaOpen(!personaOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E0D8CC] hover:border-[#C85A32] text-[#2D241E] text-xs shadow-sm transition-all"
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#C85A32]" />
                  <div className="text-left leading-tight hidden sm:block">
                    <p className="font-semibold text-xs text-[#2D241E]" suppressHydrationWarning>
                      {displayName}
                    </p>
                    <p className="text-[10px] text-stone-500 font-mono" suppressHydrationWarning>
                      {displayRole}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {personaOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E0D8CC] rounded-xl shadow-lg p-2 z-50">
                    <div className="px-3 py-2 border-b border-stone-100 mb-1">
                      <p className="text-[11px] font-bold text-[#2D241E] uppercase tracking-wider">
                        Switch Active Persona
                      </p>
                      <p className="text-[10px] text-stone-500">
                        Changes database authorization role & user id
                      </p>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-1">
                      {allPersonas.map(persona => {
                        const isSelected = displayId === persona.userId;
                        let roleTag = 'text-stone-700 bg-stone-100';
                        if (persona.role === 'ADMIN') roleTag = 'text-purple-700 bg-purple-50';
                        if (persona.role === 'RESTAURANT_OPERATOR') roleTag = 'text-amber-800 bg-amber-50';
                        if (persona.role === 'DELIVERY_PARTNER') roleTag = 'text-blue-700 bg-blue-50';
                        if (persona.role === 'CUSTOMER') roleTag = 'text-emerald-700 bg-emerald-50';

                        return (
                          <button
                            key={persona.userId}
                            onClick={() => {
                              setPersona(persona.userId);
                              setPersonaOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                              isSelected
                                ? 'bg-orange-50 text-[#C85A32] font-semibold border border-[#C85A32]/30'
                                : 'text-stone-700 hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <p className="font-medium text-xs text-[#2D241E]">{persona.fullName}</p>
                              <p className="text-[10px] text-stone-500 truncate">{persona.email}</p>
                            </div>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ${roleTag}`}>
                              {persona.role}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Button */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#C85A32] hover:bg-[#B34D28] text-white shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#2D241E] border-2 border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#E8E2D9] bg-[#FAF7F2] text-stone-600 text-[11px]">
          <Link href="/" className={`px-2 py-1 ${pathname === '/' ? 'text-[#C85A32] font-bold' : ''}`}>
            Home
          </Link>
          <Link href="/restaurants" className={`px-2 py-1 ${pathname === '/restaurants' ? 'text-[#C85A32] font-bold' : ''}`}>
            Restaurants
          </Link>
          <Link href="/orders" className={`px-2 py-1 ${pathname === '/orders' ? 'text-[#C85A32] font-bold' : ''}`}>
            My Orders
          </Link>
          <Link href="/operator" className={`px-2 py-1 ${pathname === '/operator' ? 'text-[#C85A32] font-bold' : ''}`}>
            Kitchen
          </Link>
          <Link href="/delivery" className={`px-2 py-1 ${pathname === '/delivery' ? 'text-[#C85A32] font-bold' : ''}`}>
            Delivery
          </Link>
          <Link href="/admin" className={`px-2 py-1 ${pathname === '/admin' ? 'text-[#C85A32] font-bold' : ''}`}>
            Admin
          </Link>
        </div>
      </header>

      {/* Multi-Restaurant Conflict Modal */}
      {conflictState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E0D8CC] rounded-xl max-w-md w-full p-6 text-[#2D241E] shadow-xl">
            <div className="flex items-center gap-3 text-[#C85A32] mb-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-base">Replace items in cart?</h3>
            </div>
            <p className="text-xs text-stone-600 mb-5 leading-relaxed">
              Your cart currently contains food from another restaurant. Relational constraint integrity requires each food order to belong to a single restaurant.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => resolveConflict(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:bg-[#FAF7F2] border border-stone-200"
              >
                Keep Current Cart
              </button>
              <button
                onClick={() => resolveConflict(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#C85A32] hover:bg-[#B34D28] text-white shadow-sm"
              >
                Start New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
