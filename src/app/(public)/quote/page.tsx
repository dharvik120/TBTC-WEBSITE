"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, Send, CheckCircle2, ShoppingCart, ChevronRight, AlertCircle, FileText } from "lucide-react";
import { useQuoteCart } from "@/context/QuoteCartContext";
import { submitQuoteRequest } from "@/app/actions/public";

export default function QuotePage() {
  const { cart, updateQuantity, updateNote, removeFromCart, clearCart } = useQuoteCart();
  
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare items list for submission
    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      note: item.note,
    }));

    const result = await submitQuoteRequest(customerDetails, items);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      clearCart();
    } else {
      setError(result.error || "Failed to submit quote request. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="w-full py-16 lg:py-24 bg-slate-50/50 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-md p-8 text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">RFQ Submitted!</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your Request for Quotation (RFQ) has been logged. Our commercial estimating team will compile pricing, check stock availability, and email a formal quotation sheet.
          </p>
          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white rounded-md transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <span>Browse More Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono text-slate-400 mb-6 flex items-center gap-1.5 uppercase">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">Request Quote</span>
        </nav>

        <h1 className="text-2xl lg:text-4xl font-black text-slate-900 tracking-tight mb-8">
          Request for Quotation (RFQ)
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Panel: Quote Items Basket */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white border border-slate-200 rounded-md p-4 flex justify-between items-center text-xs font-mono">
                <span className="font-bold text-slate-400 uppercase">SELECTED MATERIALS ({cart.length})</span>
                <button
                  onClick={clearCart}
                  className="text-red-600 font-semibold hover:underline cursor-pointer"
                >
                  Clear List
                </button>
              </div>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white border border-slate-200 rounded-md p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                  >
                    {/* Product Summary */}
                    <div className="flex gap-3 items-center min-w-0 flex-1">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-slate-50 rounded p-1 border border-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-350 shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-sm block truncate">
                          {item.name}
                        </span>
                        {item.modelNumber && (
                          <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 rounded block w-fit mt-1">
                            M/N: {item.modelNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions and Note Block */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto shrink-0">
                      
                      {/* Quantity adjustments */}
                      <div className="flex items-center border border-slate-200 rounded overflow-hidden h-9 bg-slate-50 shrink-0 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2.5 hover:bg-slate-100 text-slate-500 h-full flex items-center justify-center focus:outline-none"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2.5 hover:bg-slate-100 text-slate-500 h-full flex items-center justify-center focus:outline-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item-specific Note */}
                      <input
                        type="text"
                        placeholder="Add details/notes..."
                        value={item.note || ""}
                        onChange={(e) => updateNote(item.productId, e.target.value)}
                        className="flex-1 sm:w-48 border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:bg-white"
                      />

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors focus:outline-none self-end sm:self-auto"
                        title="Remove product"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel: Submission Form */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
                <h3 className="font-extrabold text-slate-800 text-base mb-2">Request Quote Submission</h3>
                <p className="text-slate-500 text-xs mb-6">
                  Provide your business contact details to receive our formal proposal sheets.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 mb-4 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                      Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={customerDetails.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label htmlFor="companyName" className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={customerDetails.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Acme Industries Ltd"
                      className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={customerDetails.email}
                        onChange={handleInputChange}
                        placeholder="e.g. name@company.com"
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={customerDetails.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={customerDetails.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Howrah"
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={customerDetails.state}
                        onChange={handleInputChange}
                        placeholder="e.g. West Bengal"
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                      Notes or Message details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={customerDetails.message}
                      onChange={handleInputChange}
                      placeholder="Add timing requirements, project scope, etc."
                      className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors resize-y"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-white shadow-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Submitting Quote Request..." : "Submit Quotation Request"}</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-md py-16 px-4 text-center font-sans">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Your Quote List is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mb-6">
              Browse our industrial materials catalog, search for parts, and click &quot;Add to Quote&quot; to build your commercial request.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-3 border text-xs font-bold text-white rounded cursor-pointer"
              style={{ backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }}
            >
              <span>Explore Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
