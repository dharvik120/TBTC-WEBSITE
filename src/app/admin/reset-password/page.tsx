"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/app/actions/admin";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing in the URL.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await resetPassword(token, password);
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

  if (!token) {
    return (
      <div className="text-center relative z-10 py-4 space-y-4">
        <div className="w-12 h-12 bg-red-950/40 border border-red-900/60 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-white text-sm">Token Invalid</h3>
          <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
            The password recovery token is missing or invalid. Please request a new recovery link.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/admin/forgot-password"
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded text-xs font-mono transition-all inline-block"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-950/50 border border-red-900 text-red-400 rounded p-3 mb-5 text-xs flex items-center gap-2.5 z-10 relative font-mono">
          <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-400 rounded p-3 mb-5 text-xs flex items-center gap-2.5 z-10 relative font-mono">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>Password reset successfully! Redirecting to login...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {/* New Password */}
        <div>
          <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
            New Secret Passkey
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
            Confirm New Passkey
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
              <span>Updating passkey...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-300">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-md p-6 lg:p-8 shadow-2xl relative">
        
        <div className="text-center mb-8 relative z-10">
          <span className="font-mono text-[10px] font-bold text-slate-500 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
            STBTCG Key Reset
          </span>
          <h1 className="text-2xl font-black text-white mt-3 tracking-tight leading-none">
            Reset Password
          </h1>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Please enter and confirm your new administrator credentials below.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

      </div>
    </div>
  );
}
