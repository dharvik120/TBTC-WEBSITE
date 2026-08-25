"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/admin";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await requestPasswordReset(email);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (e: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-300">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-md p-6 lg:p-8 shadow-2xl relative">
        
        <div className="text-center mb-8 relative z-10">
          <span className="font-mono text-[10px] font-bold text-slate-500 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
            STBTCG Password Recovery
          </span>
          <h1 className="text-2xl font-black text-white mt-3 tracking-tight leading-none">
            Forgot Password
          </h1>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            Enter your registered email address below, and we will send you a secure link to reset your passkey.
          </p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-900 text-red-400 rounded p-3 mb-5 text-xs flex items-center gap-2.5 z-10 relative font-mono">
            <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-5 text-center relative z-10 py-4">
            <div className="w-12 h-12 bg-emerald-950/40 border border-emerald-900/60 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm">Recovery Link Sent!</h3>
              <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                If the email exists in our system, a password recovery link has been dispatched to <strong className="text-slate-300">{email}</strong>. Please check your inbox and spam folders.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded text-xs font-mono transition-all inline-block"
              >
                Return to Sign-In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
                Registered Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-600">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@stbtcgi.in"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-slate-700 text-white transition-colors font-mono"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Recovery Link...</span>
                </>
              ) : (
                <span>Request Recovery Link</span>
              )}
            </button>
          </form>
        )}

        {!success && (
          <div className="mt-8 text-center border-t border-slate-900 pt-6 text-[10px] text-slate-600 font-mono">
            <Link href="/admin/login" className="hover:text-slate-400 transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
