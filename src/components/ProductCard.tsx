"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, ShoppingCart, Check, FileText, ArrowRight } from "lucide-react";
import { useQuoteCart } from "@/context/QuoteCartContext";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    modelNumber?: string | null;
    sku?: string | null;
    shortDescription?: string | null;
    technicalSpecs?: string | null; // JSON String
    price?: number | null;
    showPrice: boolean;
    isAvailable: boolean;
    category: { name: string; slug: string };
    brand?: { name: string; slug: string; logoUrl?: string | null } | null;
    images: { imageUrl: string }[];
  };
  whatsAppNumber?: string | null;
}

export default function ProductCard({ product, whatsAppNumber }: ProductCardProps) {
  const { addToCart, isInCart } = useQuoteCart();
  const [copied, setCopied] = useState(false);

  const mainImage = product.images[0]?.imageUrl || null;
  const isAdded = isInCart(product.id);

  // Parse specifications
  let specs: Record<string, string> = {};
  if (product.technicalSpecs) {
    try {
      specs = JSON.parse(product.technicalSpecs);
    } catch (e) {
      console.error("Failed to parse technical specs:", e);
    }
  }
  const specItems = Object.entries(specs).slice(0, 3); // Take first 3 for card view

  // Build WhatsApp Inquiry URL
  const cleanPhone = whatsAppNumber ? whatsAppNumber.replace(/[^0-9+]/g, "") : "";
  const waMessage = `Hello, I am interested in:
Product: ${product.name}
Model: ${product.modelNumber || "N/A"}
Category: ${product.category.name}

Please provide more details and a technical quotation.`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  const handleAddToQuote = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      modelNumber: product.modelNumber || undefined,
      imageUrl: mainImage || undefined,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-md border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group overflow-hidden">
      
      {/* Product Image Panel */}
      <Link href={`/product/${product.slug}`} className="relative h-48 w-full bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100 overflow-hidden shrink-0">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-slate-400 text-xs font-mono font-bold uppercase flex flex-col items-center gap-1.5">
            <FileText className="w-8 h-8 text-slate-300" />
            <span>Image Not Available</span>
          </div>
        )}

        {/* Brand Badge */}
        {product.brand && (
          <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm font-mono shadow-sm">
            {product.brand.name}
          </span>
        )}

        {/* Availability Badge */}
        {!product.isAvailable && (
          <span className="absolute top-3 right-3 bg-slate-500/95 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm font-mono">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col">
        <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-slate-400 mb-1">
          {product.category.name}
        </span>
        <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-primary transition-colors mb-1.5">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        
        {/* Monospace Model number (crucial for B2B) */}
        {product.modelNumber && (
          <div className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-sm w-fit border border-slate-200/50 mb-3">
            M/N: {product.modelNumber}
          </div>
        )}

        {product.shortDescription && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {product.shortDescription}
          </p>
        )}

        {/* Specs Tag List */}
        {specItems.length > 0 && (
          <div className="mt-auto border-t border-slate-100 pt-3 mb-4">
            <div className="flex flex-col gap-1.5">
              {specItems.map(([key, val]) => (
                <div key={key} className="flex justify-between text-[11px] font-sans">
                  <span className="text-slate-400 font-medium">{key}:</span>
                  <span className="text-slate-600 font-bold truncate max-w-[150px]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price display / RFQ status */}
        <div className="border-t border-slate-100 pt-3 mt-auto flex justify-between items-center">
          {product.showPrice && product.price ? (
            <div>
              <span className="text-xs text-slate-400 block leading-none font-mono">EST. PRICE</span>
              <span className="text-lg font-extrabold text-slate-900 font-mono">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-xs text-slate-400 block leading-none font-mono font-bold">PRICING</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                Quote Only
              </span>
            </div>
          )}
          <Link 
            href={`/product/${product.slug}`} 
            className="text-xs font-bold text-primary group-hover:text-secondary flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Card Actions Panel */}
      <div className="grid grid-cols-2 border-t border-slate-200">
        
        {/* WhatsApp Inquiry Button */}
        {whatsAppNumber ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-emerald-600 hover:text-white hover:bg-emerald-600 transition-colors border-r border-slate-200"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        ) : (
          <div className="flex items-center justify-center py-2.5 text-xs text-slate-400 font-mono border-r border-slate-200 bg-slate-50 cursor-not-allowed">
            WhatsApp N/A
          </div>
        )}

        {/* Add to Quote Button */}
        <button
          onClick={handleAddToQuote}
          disabled={!product.isAvailable}
          className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
            isAdded
              ? "bg-slate-900 text-white"
              : "text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>In Quote</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Quote</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
