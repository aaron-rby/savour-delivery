import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, Database, ShieldCheck, Terminal, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FAF7F2] text-[#5A4E45] border-t border-[#E8E2D9] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#C85A32] flex items-center justify-center text-white">
                <UtensilsCrossed className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-lg text-[#2D241E] tracking-tight">SAVOUR</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Food Delivery Database System engineered for <strong>BACSE202 Database Systems</strong> at Vellore Institute of Technology.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#C85A32] font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>Oracle 23ai &bull; Spring Boot 3 &bull; React</span>
            </div>
          </div>

          {/* Database Specs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D241E] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#C85A32]" />
              Relational Schema
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600 font-mono">
              <li>&bull; 9 Normalized Relations (3NF/BCNF)</li>
              <li>&bull; Oracle Identity Sequences &amp; PKs</li>
              <li>&bull; Strict Foreign Key Referential Integrity</li>
              <li>&bull; CHECK Constraints &amp; Price Freezing</li>
            </ul>
          </div>

          {/* System Portals */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D241E] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32]" />
              Role Portals
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <Link href="/restaurants" className="hover:text-[#C85A32] transition">Customer Discovery &amp; Menu</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-[#C85A32] transition">Order Lifecycle &amp; Reviews</Link>
              </li>
              <li>
                <Link href="/operator" className="hover:text-[#C85A32] transition">Restaurant Kitchen Console</Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-[#C85A32] transition">Delivery Courier Dashboard</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#C85A32] transition">DBA &amp; Constraint Testing Sandbox</Link>
              </li>
            </ul>
          </div>

          {/* Academic & Verification */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D241E] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#C85A32]" />
              Backend Verification
            </h4>
            <div className="p-3 rounded-lg bg-white border border-[#E8E2D9] text-[11px] text-[#2D241E] font-mono space-y-1 shadow-xs">
              <p className="text-emerald-700 font-bold">&check; mvn test: 12/12 PASSED</p>
              <p className="text-stone-600">Driver: Oracle JDBC / HikariCP</p>
              <p className="text-stone-600">Currency: Indian Rupees (₹)</p>
              <p className="text-stone-600">State Machine: ACID Verified</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E8E2D9] mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
          <p>&copy; 2026 SAVOUR Food Delivery System &bull; Course Project BACSE202</p>
          <p className="mt-1 sm:mt-0 font-mono">Normalized Relational Architecture</p>
        </div>
      </div>
    </footer>
  );
}
