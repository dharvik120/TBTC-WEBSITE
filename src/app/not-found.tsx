import React from "react";
import Link from "next/link";
import { Home, Search, ArrowRight, ShieldAlert, Phone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Brand Bar */}
      <div className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="Shree TBTC Global Industries" 
              className="h-9 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-500 hidden sm:inline">ERROR STATUS: 404 NOT_FOUND</span>
            <Link 
              href="/" 
              className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-2xl w-full text-center relative z-10 space-y-8">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Industrial Diagnostic // Route Unreachable</span>
          </div>

          {/* Big 404 Typography */}
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-black font-mono tracking-tighter text-slate-800 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-mono tracking-wider drop-shadow-md">
                Component Not Located
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed font-sans">
            The requested technical literature, material inventory listing, or portal directory does not exist or may have been re-indexed to our updated industrial catalog.
          </p>

          {/* Quick Search */}
          <form 
            action="/products" 
            method="GET" 
            className="max-w-md mx-auto flex items-center bg-slate-900/90 border border-slate-800 rounded-md p-1.5 focus-within:border-cyan-500 transition-colors shadow-lg"
          >
            <input
              type="text"
              name="q"
              placeholder="Search product model, category, switchgear..."
              className="flex-1 bg-transparent px-3 py-2 text-xs text-white focus:outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search</span>
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold text-white shadow-sm font-mono uppercase tracking-wider transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--primary-color, #0b3c5d)" }}
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold text-slate-300 border border-slate-800 bg-slate-900 hover:bg-slate-850 hover:text-white font-mono uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Explore Materials Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-bold text-slate-400 hover:text-white font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact Sales Desk</span>
            </Link>
          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs font-mono text-slate-600">
        <p>© {new Date().getFullYear()} Shree TBTC Global Industries. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

