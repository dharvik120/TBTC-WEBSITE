"use client";

import React, { useState, useTransition } from "react";
import { Building2, Save, Loader2, CheckCircle2, Info } from "lucide-react";
import { updateCompanySettings } from "@/app/actions/admin";

interface CompanySettings {
  companyName: string;
  email: string | null;
  phoneNumbers: string | null;
  whatsAppNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  gstNumber: string | null;
  businessHours: string | null;
  googleMapsEmbed: string | null;
  seoTitleDefault: string | null;
  seoDescriptionDefault: string | null;
}

interface CompanyInfoClientProps {
  settings: CompanySettings;
}

export default function CompanyInfoClient({ settings }: CompanyInfoClientProps) {
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [email, setEmail] = useState(settings.email || "");
  const [phoneNumbers, setPhoneNumbers] = useState(settings.phoneNumbers || "");
  const [whatsAppNumber, setWhatsAppNumber] = useState(settings.whatsAppNumber || "");
  const [address, setAddress] = useState(settings.address || "");
  const [city, setCity] = useState(settings.city || "");
  const [state, setState] = useState(settings.state || "");
  const [country, setCountry] = useState(settings.country || "");
  const [postalCode, setPostalCode] = useState(settings.postalCode || "");
  const [gstNumber, setGstNumber] = useState(settings.gstNumber || "");
  const [businessHours, setBusinessHours] = useState(settings.businessHours || "");
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState(settings.googleMapsEmbed || "");

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (!companyName) {
      alert("Company Name is required.");
      return;
    }

    startTransition(async () => {
      const res = await updateCompanySettings({
        companyName,
        primaryColor: "#0b3c5d", // will preserve current values or fallback
        secondaryColor: "#d9534f",
        email,
        phoneNumbers,
        whatsAppNumber,
        address,
        city,
        state,
        country,
        postalCode,
        gstNumber,
        businessHours,
        googleMapsEmbed,
        socialLinks: {},
        seoTitleDefault: settings.seoTitleDefault || "",
        seoDescriptionDefault: settings.seoDescriptionDefault || ""
      });

      if (res.success) {
        setSaveSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Company settings updated successfully! All routes refreshed.</span>
        </div>
      )}

      {/* Profile Details Form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2 border-b border-slate-150 pb-2">
          <Building2 className="w-4 h-4 text-slate-450" />
          <span>Core Corporate Profile</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Company Registered Name</label>
            <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">GST Registration Number</label>
            <input type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="e.g. 19AAAAA0000A1Z0" className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Primary Email Contact</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">WhatsApp Sales Line</label>
            <input type="text" value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} placeholder="e.g. +919331404702" className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Phone contacts (Comma separated)</label>
            <input type="text" value={phoneNumbers} onChange={(e) => setPhoneNumbers(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full office address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:col-span-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">State / Province</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Postal Zip Code</label>
              <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Business Hours Description</label>
            <input type="text" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} placeholder="Monday – Saturday (10:00 AM – 05:00 PM)" className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Google Maps Embed URL / iframe source</label>
            <textarea rows={3} value={googleMapsEmbed} onChange={(e) => setGoogleMapsEmbed(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3 text-slate-500 font-mono text-[10px]">
          <Info className="w-4.5 h-4.5 text-blue-500 shrink-0" />
          <div>
            <p className="font-bold text-slate-700 uppercase">Information Syncing</p>
            <p className="mt-0.5">Updating these values refreshes contacts in header components, footer contacts, contact us maps, and meta tags automatically.</p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex justify-end pt-4 border-t border-slate-150">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold disabled:opacity-50 cursor-pointer shadow-sm text-[10px] uppercase font-mono tracking-wider"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Publish Company settings</span>
          </button>
        </div>
      </div>

    </div>
  );
}
