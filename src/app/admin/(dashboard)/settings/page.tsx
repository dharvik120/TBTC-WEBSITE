"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Upload, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { updateCompanySettings, uploadFile } from "@/app/actions/admin";

interface SettingsState {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  email: string;
  phoneNumbers: string;
  whatsAppNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  gstNumber: string;
  businessHours: string;
  googleMapsEmbed: string;
  socialLinks: { facebook: string; twitter: string; linkedin: string; instagram: string };
  seoTitleDefault: string;
  seoDescriptionDefault: string;
}

export default function SettingsPage() {
  const [formData, setFormData] = useState<SettingsState>({
    companyName: "",
    primaryColor: "#0b3c5d",
    secondaryColor: "#d9534f",
    email: "",
    phoneNumbers: "",
    whatsAppNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    gstNumber: "",
    businessHours: "",
    googleMapsEmbed: "",
    socialLinks: { facebook: "", twitter: "", linkedin: "", instagram: "" },
    seoTitleDefault: "",
    seoDescriptionDefault: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            companyName: data.companyName || "",
            primaryColor: data.primaryColor || "#0b3c5d",
            secondaryColor: data.secondaryColor || "#d9534f",
            email: data.email || "",
            phoneNumbers: data.phoneNumbers || "",
            whatsAppNumber: data.whatsAppNumber || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            postalCode: data.postalCode || "",
            gstNumber: data.gstNumber || "",
            businessHours: data.businessHours || "",
            googleMapsEmbed: data.googleMapsEmbed || "",
            socialLinks: data.socialLinks ? JSON.parse(data.socialLinks) : { facebook: "", twitter: "", linkedin: "", instagram: "" },
            seoTitleDefault: data.seoTitleDefault || "",
            seoDescriptionDefault: data.seoDescriptionDefault || "",
          });
        }
      } catch (e) {
        console.error("Error loading settings:", e);
        setError("Failed to fetch settings from database.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social_")) {
      const field = name.split("_")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await updateCompanySettings(formData);
      if (res.success) {
        setSuccess(true);
        // Apply CSS variables locally instantly
        document.documentElement.style.setProperty("--primary-color", formData.primaryColor);
        document.documentElement.style.setProperty("--secondary-color", formData.secondaryColor);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Failed to save settings. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500 font-mono text-xs gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
        <span>LOADING CONFIGURATION MATRIX...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Title block */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Global Company Settings
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Centrally configure details displayed in navigation headers, footer blocks, and quotation forms.
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded p-4 text-xs flex items-center gap-2.5 font-mono shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>SETTINGS UPDATED AND DEPLOYED ACROSS CACHED TEMPLATES.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 text-xs flex items-center gap-2.5 font-mono shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Core Company details */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold font-mono text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">
            1. Core Business Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">GST / Tax Number (Optional)</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="e.g. 19AAAAA1111A1Z1"
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Brand Styling colors */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold font-mono text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">
            2. Brand Colors (Applied dynamically to theme)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Primary Color (Hex)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="w-10 h-10 border border-slate-200 rounded cursor-pointer p-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-xs font-mono uppercase focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Secondary Accent Color (Hex)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  className="w-10 h-10 border border-slate-200 rounded cursor-pointer p-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-xs font-mono uppercase focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Contact coordinates */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold font-mono text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">
            3. Communication Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone List (Comma Sep.)</label>
              <input
                type="text"
                name="phoneNumbers"
                value={formData.phoneNumbers}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">WhatsApp Number (Full International)</label>
              <input
                type="text"
                name="whatsAppNumber"
                value={formData.whatsAppNumber}
                onChange={handleChange}
                required
                placeholder="e.g. +919331404702"
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Business Hours Description</label>
              <input
                type="text"
                name="businessHours"
                value={formData.businessHours}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Google Maps IFrame Source Link</label>
              <input
                type="text"
                name="googleMapsEmbed"
                value={formData.googleMapsEmbed}
                onChange={handleChange}
                placeholder="https://www.google.com/maps/embed?..."
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Address coordinates */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold font-mono text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">
            4. Geographic Location
          </h2>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Full Postal Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none bg-slate-50 focus:bg-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Social Media */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold font-mono text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">
            5. Social Profiles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Facebook URL</label>
              <input
                type="text"
                name="social_facebook"
                value={formData.socialLinks.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Twitter URL</label>
              <input
                type="text"
                name="social_twitter"
                value={formData.socialLinks.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">LinkedIn URL</label>
              <input
                type="text"
                name="social_linkedin"
                value={formData.socialLinks.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/..."
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Instagram URL</label>
              <input
                type="text"
                name="social_instagram"
                value={formData.socialLinks.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 6: SEO Defaults */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold font-mono text-slate-400 border-b border-slate-100 pb-2 uppercase tracking-widest">
            6. Default Search Engine Optimization (SEO)
          </h2>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Default SEO Page Title</label>
            <input
              type="text"
              name="seoTitleDefault"
              value={formData.seoTitleDefault}
              onChange={handleChange}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Default SEO Meta Description</label>
            <textarea
              name="seoDescriptionDefault"
              value={formData.seoDescriptionDefault}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none resize-y"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-4 border-t border-slate-250">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 py-3 px-6 text-xs font-bold text-white rounded bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed font-mono uppercase cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Config</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
