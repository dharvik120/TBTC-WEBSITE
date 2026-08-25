"use client";

import React, { useState, useTransition } from "react";
import { Search, Save, Loader2, CheckCircle2 } from "lucide-react";
import { updateCompanySettings } from "@/app/actions/admin";

interface SeoClientProps {
  settings: {
    companyName: string;
    seoTitleDefault: string | null;
    seoDescriptionDefault: string | null;
  };
}

export default function SeoClient({ settings }: SeoClientProps) {
  const [seoTitle, setSeoTitle] = useState(settings.seoTitleDefault || "");
  const [seoDescription, setSeoDescription] = useState(settings.seoDescriptionDefault || "");
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateCompanySettings({
        companyName: settings.companyName,
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
        socialLinks: {},
        seoTitleDefault: seoTitle,
        seoDescriptionDefault: seoDescription
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-3xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Default SEO settings updated and cached successfully!</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2 border-b border-slate-150 pb-2">
          <Search className="w-4 h-4 text-slate-450" />
          <span>SEO Metadata Defaults</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Default Portal SEO Title</label>
            <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            <p className="text-[9px] text-slate-400 mt-1">Displayed in browser tabs and search engine snippet headings.</p>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Default Portal SEO Meta Description</label>
            <textarea rows={4} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none leading-relaxed" />
            <p className="text-[9px] text-slate-400 mt-1">Used by search crawlers (Google, Bing) to index descriptions.</p>
          </div>
        </div>

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
            <span>Publish SEO settings</span>
          </button>
        </div>
      </div>

    </div>
  );
}
