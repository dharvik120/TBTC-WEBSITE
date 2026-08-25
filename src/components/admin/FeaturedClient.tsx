"use client";

import React, { useState, useTransition } from "react";
import { Star, Save, Search, Loader2, CheckCircle2 } from "lucide-react";
import { updateFeaturedSectionSettings, toggleProductFeatured } from "@/app/actions/admin";

interface Product {
  id: string;
  name: string;
  slug: string;
  modelNumber: string | null;
  sku: string | null;
  isFeatured: boolean;
  category: { name: string };
}

interface FeaturedClientProps {
  settings: {
    homeFeaturedProductsEnabled: boolean;
    homeFeaturedProductsHeading: string;
    homeFeaturedProductsSubtitle: string;
    homeFeaturedProductsLimit: number;
    homeFeaturedProductsCtaText: string;
    homeFeaturedProductsCtaLink: string;
  };
  products: Product[];
}

export default function FeaturedClient({ settings, products }: FeaturedClientProps) {
  // Section configs
  const [enabled, setEnabled] = useState(settings.homeFeaturedProductsEnabled);
  const [heading, setHeading] = useState(settings.homeFeaturedProductsHeading);
  const [subtitle, setSubtitle] = useState(settings.homeFeaturedProductsSubtitle);
  const [limit, setLimit] = useState(settings.homeFeaturedProductsLimit);
  const [ctaText, setCtaText] = useState(settings.homeFeaturedProductsCtaText);
  const [ctaLink, setCtaLink] = useState(settings.homeFeaturedProductsCtaLink);

  const [productList, setProductList] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filteredProducts = productList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.modelNumber && p.modelNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleFeatured = (id: string, currentVal: boolean) => {
    startTransition(async () => {
      const res = await toggleProductFeatured(id, !currentVal);
      if (res.success) {
        setProductList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isFeatured: !currentVal } : p))
        );
      }
    });
  };

  const handleSaveGlobal = () => {
    startTransition(async () => {
      const res = await updateFeaturedSectionSettings({
        homeFeaturedProductsEnabled: enabled,
        homeFeaturedProductsHeading: heading,
        homeFeaturedProductsSubtitle: subtitle,
        homeFeaturedProductsLimit: limit,
        homeFeaturedProductsCtaText: ctaText,
        homeFeaturedProductsCtaLink: ctaLink
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
          <span className="font-semibold">Featured products settings updated and published successfully!</span>
        </div>
      )}

      {/* Global section settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Featured Section settings</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enable Section</label>
            <select value={enabled ? "true" : "false"} onChange={(e) => setEnabled(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Max products to show</label>
            <input type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value) || 0)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Main Heading</label>
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Section Subtitle</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">View All Button text</label>
            <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">View All Link URL</label>
            <input type="text" value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-150">
          <button onClick={handleSaveGlobal} disabled={isPending} className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold uppercase text-[9px] font-mono tracking-wider cursor-pointer shadow-sm">
            {isPending ? <Loader2 className="w-3 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save global settings</span>
          </button>
        </div>
      </div>

      {/* Selector list grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <Star className="w-4 h-4 text-slate-400" />
              <span>Mark Featured Products</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Check products to include them in the homepage featured grid.</p>
          </div>
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-2.5 py-1">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 focus:outline-none text-[11px] w-48 py-0.5"
            />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-150 max-h-[400px] overflow-y-auto">
            {filteredProducts.map((p) => (
              <div key={p.id} className="p-3.5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-850 text-[11px]">{p.name}</span>
                    <span className="bg-slate-150 text-slate-550 text-[8px] font-mono px-1 rounded-sm">{p.category.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Model: {p.modelNumber || "N/A"} • SKU: {p.sku || "N/A"}</span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(p.id, p.isFeatured)}
                    disabled={isPending}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-colors ${
                      p.isFeatured 
                        ? "bg-amber-500 hover:bg-amber-600 text-white" 
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 shrink-0 fill-current" />
                    <span>{p.isFeatured ? "Featured" : "Standard"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No products found matching query.
          </div>
        )}
      </div>

    </div>
  );
}
