"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ShieldAlert, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { checkIsFirstTimeSetup, registerAdmin } from "@/app/actions/admin";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bypass = searchParams.get("bypass") === "true";

  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function checkSetup() {
      if (bypass) {
        setIsFirstTime(true);
      } else {
        const res = await checkIsFirstTimeSetup();
        setIsFirstTime(res.isFirstTime);
      }
    }
    checkSetup();
  }, [bypass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await registerAdmin({ 
        username, 
        email, 
        passwordPass: password,
        bypass
      });
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      }
    } catch (e: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (isFirstTime === null) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isFirstTime === false) {
    return (
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-md p-8 shadow-2xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
        <h1 className="text-xl font-bold text-white tracking-tight">Registration Locked</h1>
        <p className="text-slate-500 text-xs leading-relaxed">
          The administrator account has already been registered. For security reasons, public registration is locked.
        </p>
        <div className="pt-4">
          <Link
            href="/admin/login"
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded text-xs font-mono transition-all inline-block"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-md p-6 lg:p-8 shadow-2xl relative">
      
      <div className="text-center mb-8 relative z-10">
        <span className="font-mono text-[10px] font-bold text-slate-500 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
          {bypass ? "Bypass Admin Setup" : "STBTCG Admin Setup"}
        </span>
        <h1 className="text-2xl font-black text-white mt-3 tracking-tight leading-none">
          Create Admin User
        </h1>
        <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
          Register new administrator login credentials to configure and manage the platform.
        </p>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900 text-red-400 rounded p-3 mb-5 text-xs flex items-center gap-2.5 z-10 relative font-mono">
          <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 rounded p-3 mb-5 text-xs flex items-center gap-2.5 z-10 relative font-mono">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>Admin account created successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {/* Username */}
        <div>
          <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
            Username ID
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-600">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-slate-700 text-white transition-colors font-mono"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-600">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@stbtcgi.in"
              className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-slate-700 text-white transition-colors font-mono"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
            Secret Passkey
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-600">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-10 py-2 text-xs focus:outline-none focus:border-slate-700 text-white transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-400 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
            Confirm Passkey
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-600">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-10 py-2 text-xs focus:outline-none focus:border-slate-700 text-white transition-colors font-mono"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-400 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Register & Initialise</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-slate-900 pt-6 text-[10px] text-slate-600 font-mono">
        <Link href="/admin/login" className="hover:text-slate-400 transition-colors">
          ← Return to Sign-In
        </Link>
      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-300">
      <Suspense fallback={
        <div className="flex justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
