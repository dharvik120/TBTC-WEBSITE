"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsAppNumber?: string | null;
  companyName: string;
}

export default function WhatsAppButton({ whatsAppNumber, companyName }: WhatsAppButtonProps) {
  if (!whatsAppNumber) return null;

  // Clean the phone number (remove non-digits, keep leading plus if there)
  const cleanNumber = whatsAppNumber.replace(/[^0-9+]/g, "");

  const defaultMessage = `Hello, I would like to know more about the products and services offered by ${companyName}.`;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce group"
      aria-label="Chat on WhatsApp"
      style={{ animationDuration: "3s" }}
    >
      <MessageCircle className="w-6.5 h-6.5 fill-white text-emerald-500" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out text-sm font-semibold whitespace-nowrap">
        WhatsApp Us
      </span>
    </a>
  );
}
