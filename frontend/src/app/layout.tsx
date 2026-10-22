import type { Metadata } from 'next';
import './globals.css';
import { PersonaProvider } from '@/context/PersonaContext';
import { CartProvider } from '@/context/CartContext';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SAVOUR | Enterprise Food Delivery & Relational Database System',
  description: 'Full-stack food delivery application built with Next.js, Spring Boot 3, and Oracle SQL Database. Course project for BACSE202 Database Systems at VIT.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-orange-500 selection:text-white">
        <PersonaProvider>
          <CartProvider>
            <Suspense fallback={<div className="h-16 bg-[#2D241E] border-b border-stone-800" />}>
              <Navbar />
            </Suspense>
            {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
              <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900">
                Interactive demo: orders stay in this browser. The Java/JDBC database backend runs separately on your laptop.
              </div>
            )}
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </CartProvider>
        </PersonaProvider>
      </body>
    </html>
  );
}
