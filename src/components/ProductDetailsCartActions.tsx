"use client";

import React, { useState } from "react";
import { ShoppingCart, Check, MessageCircle } from "lucide-react";
import { useQuoteCart } from "@/context/QuoteCartContext";

interface ProductDetailsCartActionsProps {
  product: {
    id: string;
    name: string;
    modelNumber?: string | null;
    categoryName: string;
    imageUrl?: string | null;
  };
  whatsAppNumber?: string | null;
}

export default function ProductDetailsCartActions({ product, whatsAppNumber }: ProductDetailsCartActionsProps) {
  const { addToCart, isInCart } = useQuoteCart();
  const isAdded = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      modelNumber: product.modelNumber || undefined,
      imageUrl: product.imageUrl || undefined,
    });
  };

  // WhatsApp link setup
  const cleanPhone = whatsAppNumber ? whatsAppNumber.replace(/[^0-9+]/g, "") : "";
  const message = `Hello, I am interested in:
Product: ${product.name}
Model: ${product.modelNumber || "N/A"}
Category: ${product.categoryName}

Please provide detailed catalog brochures and a commercial quote.`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      {/* Add to Quote */}
      <button
        onClick={handleAddToCart}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold shadow-sm rounded-md transition-all focus:outline-none cursor-pointer ${
          isAdded
            ? "bg-slate-900 text-white"
            : "bg-slate-100 hover:bg-slate-200 text-slate-800"
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Added to Quote Basket</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Quote Basket</span>
          </>
        )}
      </button>

      {/* WhatsApp Inquiry */}
      {whatsAppNumber && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm rounded-md cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
          <span>Inquire on WhatsApp</span>
        </a>
      )}
    </div>
  );
}
