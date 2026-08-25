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

interface ContactFormProps {
  fields?: FormField[];
}

export default function ContactForm({ fields = [] }: ContactFormProps) {
  // Setup dynamic form values state
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.name] = "";
    });
    return initial;
  });

  // Fallback state for standard form
  const [fallbackData, setFallbackData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    inquiryType: "GENERAL",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDynamicChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFallbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        name: formValues[nameKey] || "Dynamic Submitter",
        email: formValues[emailKey] || "dynamic@tbtc.com",
        phone: formValues[phoneKey] || "0000000000",
        message: formValues[messageKey] || "Submitted via dynamic builder form.",
        inquiryType: "CONTACT",
        companyName: formValues.companyName || formValues.company || "",
        dynamicValues: formValues
      };
    } else {
      // Fallback submission logic
      payload = {
        name: fallbackData.name,
        companyName: fallbackData.companyName,
        email: fallbackData.email,
        phone: fallbackData.phone,
        inquiryType: fallbackData.inquiryType,
        message: fallbackData.message,
      };
    }

    const result = await submitInquiry(payload);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      // Reset
      setFormValues({});
      setFallbackData({
        name: "",
        companyName: "",
        email: "",
        phone: "",
        inquiryType: "GENERAL",
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
        <h3 className="text-lg font-bold">Message Sent Successfully!</h3>
        <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
          Your inquiry has been stored in our system. Shree TBTC Global Industries sales or technical teams will review your request and get back to you shortly.
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
      <h2 className="text-xl font-bold text-slate-800 mb-2">Send an Inquiry</h2>
      <p className="text-slate-500 text-xs mb-6">
        Fill out this form and we will route your query to the appropriate technical sales executive.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3.5 mb-5 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields && fields.length > 0 ? (
          // DYNAMIC FORM BUILDER ELEMENTS RENDERER
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
                            className="w-4 h-4 rounded text-primary border-slate-350 cursor-pointer"
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
                          className="w-4 h-4 text-primary border-slate-350 cursor-pointer"
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
                Your Name <span className="text-red-500">*</span>
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
                placeholder="e.g. Acme Controls Ltd"
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
                  placeholder="e.g. buyer@company.com"
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
              <label htmlFor="inquiryType" className="block text-[11px] font-bold font-mono text-slate-400 uppercase mb-1">
                Inquiry Type <span className="text-red-500">*</span>
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                required
                value={fallbackData.inquiryType}
                onChange={handleFallbackChange}
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors cursor-pointer"
              >
                <option value="GENERAL">General Information</option>
                <option value="TECHNICAL">Technical Specifications / Support</option>
                <option value="SALES">Sales / RFQ / Custom Order</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-[11px] font-bold font-mono text-slate-400 uppercase mb-1">
                Message details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={fallbackData.message}
                onChange={handleFallbackChange}
                placeholder="Type your message details here..."
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white transition-colors resize-y"
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white shadow-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase font-mono tracking-wider"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "Sending..." : "Submit Inquiry"}</span>
        </button>
      </form>
    </div>
  );
}
