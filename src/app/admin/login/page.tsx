"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, User, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { adminLogin, checkIsFirstTimeSetup } from "@/app/actions/admin";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    async function checkSetup() {
      const res = await checkIsFirstTimeSetup();
      setIsFirstTime(res.isFirstTime);
    }
    checkSetup();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await adminLogin(null, formData);
      if (res && res.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch (e: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-300">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-md p-6 lg:p-8 shadow-2xl relative grid-pattern">
        
        {/* Decorative Grid Lines */}
        <div className="absolute top-0 left-10 w-px h-full bg-slate-900/40 pointer-events-none" />
        <div className="absolute top-0 right-10 w-px h-full bg-slate-900/40 pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <span className="font-mono text-[10px] font-bold text-slate-500 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
            STBT Admin Auth
          </span>
          <h1 className="text-2xl font-black text-white mt-3 tracking-tight leading-none">
            Admin Portal Sign-In
          </h1>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Authorized administrative credentials required to manage settings, catalogs, and customer leads.
          </p>
        </div>

        {isFirstTime && (
          <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 rounded p-3.5 mb-5 text-xs flex flex-col gap-2 z-10 relative font-sans">
            <div className="flex items-center gap-2 font-bold font-mono uppercase text-[10px] tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Initial Setup Required</span>
            </div>
            <p className="text-slate-400 leading-normal text-[11px]">
              No administrator accounts were detected in the database. Please register the first super administrator account to begin.
            </p>
            <Link
              href="/admin/register"
              className="mt-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-center rounded text-[10px] font-mono uppercase tracking-wider transition-colors inline-block"
            >
              Configure Super Admin
            </Link>
          </div>
        )}

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 rounded p-3 mb-5 text-xs flex items-center gap-2.5 z-10 relative font-mono">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
              Username ID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-600">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-slate-700 text-white transition-colors font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-[10px] font-bold font-mono text-slate-500 uppercase">
                Secret Passkey
              </label>
              <Link href="/admin/forgot-password" className="text-[9px] font-bold font-mono text-slate-500 hover:text-slate-400 uppercase transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-600">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-slate-700 text-white transition-colors font-mono"
              />
            </div>
          </div>

          {/* Sign In button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Authentication...</span>
              </>
            ) : (
              <span>Decrypt & Connect</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-900 pt-6 text-[10px] text-slate-600 font-mono">
          <Link href="/" className="hover:text-slate-400 transition-colors">
            ← Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}
