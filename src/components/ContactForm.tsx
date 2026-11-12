"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { submitInquiry } from "@/app/actions/public";

// Comprehensive international country calling codes list
export const INTERNATIONAL_DIAL_CODES = [
  { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" },
  { name: "United States", code: "US", dial: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial: "+44", flag: "🇬🇧" },
  { name: "United Arab Emirates", code: "AE", dial: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", code: "SA", dial: "+966", flag: "🇸🇦" },
  { name: "Germany", code: "DE", dial: "+49", flag: "🇩🇪" },
  { name: "Singapore", code: "SG", dial: "+65", flag: "🇸🇬" },
  { name: "Australia", code: "AU", dial: "+61", flag: "🇦🇺" },
  { name: "Canada", code: "CA", dial: "+1", flag: "🇨🇦" },
  { name: "Oman", code: "OM", dial: "+968", flag: "🇴🇲" },
  { name: "Qatar", code: "QA", dial: "+974", flag: "🇶🇦" },
  { name: "Kuwait", code: "KW", dial: "+965", flag: "🇰🇼" },
  { name: "Bahrain", code: "BH", dial: "+973", flag: "🇧🇭" },
  { name: "France", code: "FR", dial: "+33", flag: "🇫🇷" },
  { name: "Italy", code: "IT", dial: "+39", flag: "🇮🇹" },
  { name: "Netherlands", code: "NL", dial: "+31", flag: "🇳🇱" },
  { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
  { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
  { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪" },
  { name: "Japan", code: "JP", dial: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", dial: "+82", flag: "🇰🇷" },
  { name: "Malaysia", code: "MY", dial: "+60", flag: "🇲🇾" },
  { name: "Thailand", code: "TH", dial: "+66", flag: "🇹🇭" },
  { name: "Vietnam", code: "VN", dial: "+84", flag: "🇻🇳" },
  { name: "Indonesia", code: "ID", dial: "+62", flag: "🇮🇩" },
  { name: "Brazil", code: "BR", dial: "+55", flag: "🇧🇷" },
  { name: "Mexico", code: "MX", dial: "+52", flag: "🇲🇽" },
  { name: "Bangladesh", code: "BD", dial: "+880", flag: "🇧🇩" },
  { name: "Sri Lanka", code: "LK", dial: "+94", flag: "🇱🇰" },
  { name: "Nepal", code: "NP", dial: "+977", flag: "🇳🇵" },
  { name: "Other Countries", code: "INTL", dial: "+1", flag: "🌐" },
];

interface ContactFormProps {
  fields?: any[];
}

export default function ContactForm({ fields }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    country: "India",
    countryCode: "IN",
    countryDialCode: "+91",
    phoneNumber: "",
    inquiryType: "SALES",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryName = e.target.value;
    const countryObj = INTERNATIONAL_DIAL_CODES.find((c) => c.name === selectedCountryName);
    setFormData((prev) => ({
      ...prev,
      country: selectedCountryName,
      countryCode: countryObj ? countryObj.code : "IN",
      countryDialCode: countryObj ? countryObj.dial : prev.countryDialCode,
    }));
  };

  const handleDialCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const countryObj = INTERNATIONAL_DIAL_CODES.find((c) => c.code === selectedCode);
    if (countryObj) {
      setFormData((prev) => ({
        ...prev,
        country: countryObj.name,
        countryCode: countryObj.code,
        countryDialCode: countryObj.dial,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || !formData.message.trim()) {
      setError("Please fill out all required fields marked with an asterisk (*).");
      setLoading(false);
      return;
    }

    const fullInternationalPhone = `${formData.countryDialCode} ${formData.phoneNumber.trim()}`;

    const payload = {
      name: formData.name.trim(),
      companyName: formData.companyName.trim() || undefined,
      email: formData.email.trim(),
      phone: fullInternationalPhone,
      inquiryType: formData.inquiryType,
      message: formData.message.trim(),
      dynamicValues: {
        country: formData.country,
        countryCallingCode: formData.countryDialCode,
        localPhoneNumber: formData.phoneNumber.trim(),
        fullInternationalPhone: fullInternationalPhone,
      },
    };

    const result = await submitInquiry(payload);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setFormData({
        name: "",
        companyName: "",
        email: "",
        country: "India",
        countryCode: "IN",
        countryDialCode: "+91",
        phoneNumber: "",
        inquiryType: "SALES",
        message: "",
      });
    } else {
      setError(result.error || "Failed to submit inquiry. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md p-8 text-center space-y-4 font-sans shadow-sm animate-fadeIn">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-pulse" />
        <h3 className="text-lg font-bold">Inquiry Transmitted Successfully!</h3>
        <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
          Your inquiry has been logged into our global ERP pipeline. A technical sales executive from Shree TBTC Global Industries will contact you shortly with formal specifications and quotation.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs font-bold text-white px-4 py-2 rounded shadow-sm hover:opacity-90 transition-opacity cursor-pointer font-mono uppercase tracking-wider"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8 font-sans shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-900">Send an International Inquiry</h2>
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-primary" />
          Global Sales Desk
        </span>
      </div>
      <p className="text-slate-500 text-xs mb-6">
        Please fill out this form with your country code and requirements. Our technical sales desk will review and reply within 24 business hours.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3.5 mb-5 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-[11px] font-bold font-mono text-slate-500 uppercase mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe / Mohammed Al-Falasi"
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="companyName" className="block text-[11px] font-bold font-mono text-slate-500 uppercase mb-1">
              Company / Organization
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Global Power Systems LLC"
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Country & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block text-[11px] font-bold font-mono text-slate-500 uppercase mb-1">
              Country / Region <span className="text-red-500">*</span>
            </label>
            <select
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleCountryChange}
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors cursor-pointer"
            >
              {INTERNATIONAL_DIAL_CODES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name} ({c.dial})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] font-bold font-mono text-slate-500 uppercase mb-1">
              Corporate Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. procurement@company.com"
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* International Calling Code + Phone Number & Inquiry Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-[11px] font-bold font-mono text-slate-500 uppercase mb-1">
              International Phone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-slate-400 overflow-hidden">
              {/* Compact Country dial code select */}
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleDialCodeChange}
                className="w-[85px] sm:w-[92px] shrink-0 bg-slate-100 hover:bg-slate-200 border-r border-slate-200 px-2 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-none cursor-pointer transition-colors"
                title="Select Country Calling Code"
                aria-label="Country Calling Code"
              >
                {INTERNATIONAL_DIAL_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.dial} ({c.name})
                  </option>
                ))}
              </select>
              {/* Spacious Phone number digits input */}
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 98765 43210 / 555-0199"
                className="flex-1 min-w-0 w-full px-3 py-2 text-xs bg-transparent focus:outline-none font-mono"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Format: {formData.countryDialCode} [Your local number]
            </span>
          </div>

          <div>
            <label htmlFor="inquiryType" className="block text-[11px] font-bold font-mono text-slate-500 uppercase mb-1">
              Inquiry Classification <span className="text-red-500">*</span>
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              required
              value={formData.inquiryType}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="SALES">Sales / Price Quotation (RFQ)</option>
              <option value="TECHNICAL">Technical Specifications & Datasheets</option>
              <option value="GENERAL">General Procurement Inquiry</option>
              <option value="EXPORT">Export / International Shipment</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-[11px] font-bold font-mono text-slate-500 uppercase mb-1">
            Material & Quantity Specifications <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Please state product models, required quantities, destination port/country, and required delivery timeline..."
            className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors resize-y font-sans"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-white shadow-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase font-mono tracking-wider hover:opacity-95"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "Transmitting..." : "Submit Global Inquiry"}</span>
        </button>
      </form>
    </div>
  );
}
