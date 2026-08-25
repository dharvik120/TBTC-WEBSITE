"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitInquiry } from "@/app/actions/public";

interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder: string | null;
  isRequired: boolean;
  options: string | null;
  helpText: string | null;
}

interface ProductInquiryFormProps {
  productId: string;
  productName: string;
  modelNumber?: string | null;
  fields?: FormField[];
}

export default function ProductInquiryForm({ productId, productName, modelNumber, fields = [] }: ProductInquiryFormProps) {
  // Setup dynamic form values state
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.name === "message" || f.name.toLowerCase().includes("message")) {
        initial[f.name] = `Hello, I would like to receive technical specifications and pricing details for the product: ${productName}${modelNumber ? ` (Model: ${modelNumber})` : ""}. Please contact me at your earliest.`;
      } else {
        initial[f.name] = "";
      }
    });
    return initial;
  });

  // Fallback state
  const [fallbackData, setFallbackData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    message: `Hello, I would like to receive technical specifications and pricing details for the product: ${productName}${modelNumber ? ` (Model: ${modelNumber})` : ""}. Please contact me at your earliest.`,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDynamicChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFallbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFallbackData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let payload: any = {};

    if (fields && fields.length > 0) {
      // Validate dynamic fields
      for (const field of fields) {
        if (field.isRequired && !formValues[field.name]) {
          setError(`Please fill in the required field: ${field.label}`);
          setLoading(false);
          return;
        }
      }

      // Map standard keys for SQLite columns
      const nameKey = fields.find((f) => f.name.toLowerCase().includes("name") || f.name.toLowerCase() === "fullname")?.name || "fullName";
      const emailKey = fields.find((f) => f.name.toLowerCase() === "email")?.name || "email";
      const phoneKey = fields.find((f) => f.name.toLowerCase().includes("phone") || f.name.toLowerCase() === "telephone")?.name || "phone";
      const messageKey = fields.find((f) => f.name.toLowerCase().includes("message") || f.name.toLowerCase() === "comment")?.name || "message";

      payload = {
        name: formValues[nameKey] || "Dynamic Product Inquirer",
        email: formValues[emailKey] || "dynamic@tbtc.com",
        phone: formValues[phoneKey] || "0000000000",
        message: formValues[messageKey] || `Inquiry for product: ${productName}`,
        inquiryType: "PRODUCT",
        relatedProductId: productId,
        companyName: formValues.companyName || formValues.company || "",
        dynamicValues: formValues
      };
    } else {
      payload = {
        name: fallbackData.name,
        companyName: fallbackData.companyName,
        email: fallbackData.email,
        phone: fallbackData.phone,
        inquiryType: "PRODUCT",
        relatedProductId: productId,
        message: fallbackData.message,
      };
    }

    const result = await submitInquiry(payload);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setFormValues({});
      setFallbackData({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        message: "",
      });
    } else {
      setError(result.error || "Failed to submit inquiry. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md p-6 text-center space-y-3 font-sans shadow-sm animate-fadeIn">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h3 className="text-base font-bold">Inquiry Sent Successfully!</h3>
        <p className="text-xs text-emerald-700 max-w-xs mx-auto leading-relaxed">
          Thank you for contacting Shree TBTC Global Industries. Our sales department will contact you with details shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs font-semibold underline text-emerald-600 hover:text-emerald-800 cursor-pointer font-mono uppercase tracking-wider"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-md p-6 font-sans shadow-sm">
      <h3 className="font-extrabold text-slate-800 text-lg mb-1 leading-snug">Product Inquiry</h3>
      <p className="text-slate-500 text-xs mb-6">
        Submit this form to receive a direct quote or technical document response.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3 mb-4 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields && fields.length > 0 ? (
          // DYNAMIC
          fields.map((field) => {
            const optionsList = field.options ? field.options.split(",").map((o) => o.trim()) : [];

            return (
              <div key={field.id} className="space-y-1">
                <label className="block text-[11px] font-bold font-mono text-slate-500 uppercase">
                  {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                </label>

                {field.type === "TEXTAREA" ? (
                  <textarea
                    required={field.isRequired}
                    rows={4}
                    value={formValues[field.name] || ""}
                    onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                    placeholder={field.placeholder || "Enter details..."}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors resize-y"
                  />
                ) : field.type === "SELECT" ? (
                  <select
                    required={field.isRequired}
                    value={formValues[field.name] || ""}
                    onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="">-- Select Option --</option>
                    {optionsList.map((o, idx) => (
                      <option key={idx} value={o}>{o}</option>
                    ))}
                  </select>
                ) : field.type === "CHECKBOX" ? (
                  <div className="flex flex-wrap gap-3 py-1.5">
                    {optionsList.map((o, idx) => {
                      const currentVals = Array.isArray(formValues[field.name]) ? formValues[field.name] : [];
                      const isChecked = currentVals.includes(o);
                      return (
                        <label key={idx} className="flex items-center gap-2 text-slate-700 text-xs cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const next = isChecked ? currentVals.filter((v: string) => v !== o) : [...currentVals, o];
                              handleDynamicChange(field.name, next);
                            }}
                            className="w-4 h-4 rounded text-primary border-slate-355 cursor-pointer"
                          />
                          <span>{o}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : field.type === "RADIO" ? (
                  <div className="flex flex-wrap gap-4 py-1.5">
                    {optionsList.map((o, idx) => (
                      <label key={idx} className="flex items-center gap-2 text-slate-700 text-xs cursor-pointer select-none">
                        <input
                          type="radio"
                          name={field.name}
                          value={o}
                          checked={formValues[field.name] === o}
                          onChange={() => handleDynamicChange(field.name, o)}
                          className="w-4 h-4 text-primary border-slate-355 cursor-pointer"
                        />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type={field.type.toLowerCase()}
                    required={field.isRequired}
                    value={formValues[field.name] || ""}
                    onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                    placeholder={field.placeholder || ""}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                  />
                )}

                {field.helpText && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">{field.helpText}</span>
                )}
              </div>
            );
          })
        ) : (
          // STATIC FALLBACK
          <>
            <div>
              <label htmlFor="name" className="block text-[11px] font-bold font-mono text-slate-400 uppercase mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={fallbackData.name}
                onChange={handleFallbackChange}
                placeholder="e.g. John Doe"
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-[11px] font-bold font-mono text-slate-400 uppercase mb-1">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={fallbackData.companyName}
                onChange={handleFallbackChange}
                placeholder="e.g. Acme Industrial Ltd"
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-[11px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={fallbackData.email}
                  onChange={handleFallbackChange}
                  placeholder="e.g. contact@company.com"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[11px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={fallbackData.phone}
                  onChange={handleFallbackChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-[11px] font-bold font-mono text-slate-400 uppercase mb-1">
                Message details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={fallbackData.message}
                onChange={handleFallbackChange}
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors resize-y"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white shadow-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase font-mono tracking-wider"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "Submitting..." : "Send Inquiry Request"}</span>
        </button>
      </form>
    </div>
  );
}
