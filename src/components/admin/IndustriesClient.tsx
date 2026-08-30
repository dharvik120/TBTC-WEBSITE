"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { updateIndustriesSectionSettings, saveIndustry, deleteIndustry } from "@/app/actions/admin";
import { uploadFile } from "@/lib/upload";

interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  iconName: string | null;
  linkUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface IndustriesClientProps {
  settings: {
    homeIndustriesEnabled: boolean;
    homeIndustriesHeading: string;
    homeIndustriesSubtitle: string;
    homeIndustriesDescription: string;
    homeIndustriesBgColor: string;
    homeIndustriesTextColor: string;
    homeIndustriesLayout: string;
  };
  initialIndustries: Industry[];
}

export default function IndustriesClient({ settings, initialIndustries }: IndustriesClientProps) {
  // Global settings
  const [enabled, setEnabled] = useState(settings.homeIndustriesEnabled);
  const [heading, setHeading] = useState(settings.homeIndustriesHeading);
  const [subtitle, setSubtitle] = useState(settings.homeIndustriesSubtitle);
  const [description, setDescription] = useState(settings.homeIndustriesDescription);
  const [bgColor, setBgColor] = useState(settings.homeIndustriesBgColor);
  const [textColor, setTextColor] = useState(settings.homeIndustriesTextColor);
  const [layout, setLayout] = useState(settings.homeIndustriesLayout);

  // List CRUD
  const [industries, setIndustries] = useState<Industry[]>(initialIndustries.sort((a, b) => a.displayOrder - b.displayOrder));
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [iconName, setIconName] = useState("Globe");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [active, setActive] = useState(true);

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const path = await uploadFile(formData);
    setUploading(false);
    if (path) setImageUrl(path);
  };

  const openNew = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDesc("");
    setImageUrl("");
    setLinkUrl("");
    setIconName("Globe");
    setDisplayOrder(industries.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (ind: Industry) => {
    setEditingId(ind.id);
    setName(ind.name);
    setSlug(ind.slug);
    setDesc(ind.description || "");
    setImageUrl(ind.imageUrl || "");
    setLinkUrl(ind.linkUrl || "");
    setIconName(ind.iconName || "Globe");
    setDisplayOrder(ind.displayOrder);
    setActive(ind.isActive);
    setIsModalOpen(true);
  };

  const handleSaveIndustry = () => {
    if (!name || !slug) {
      alert("Name and URL Slug are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveIndustry(editingId, {
        name,
        slug,
        description: desc,
        imageUrl: imageUrl || null,
        displayOrder,
        isActive: active
      });

      if (res.success) {
        alert("✅ SUCCESS: Sector details saved successfully!");
        window.location.reload();
      }
    });
  };

  const handleDeleteIndustry = (id: string) => {
    if (confirm("Delete this industry sector?")) {
      startTransition(async () => {
        const res = await deleteIndustry(id);
        if (res.success) {
          setIndustries((prev) => prev.filter((i) => i.id !== id));
        }
      });
    }
  };

  const handleSaveGlobal = () => {
    startTransition(async () => {
      const res = await updateIndustriesSectionSettings({
        homeIndustriesEnabled: enabled,
        homeIndustriesHeading: heading,
        homeIndustriesSubtitle: subtitle,
        homeIndustriesDescription: description,
        homeIndustriesBgColor: bgColor,
        homeIndustriesTextColor: textColor,
        homeIndustriesLayout: layout
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
          <span className="font-semibold">Industries We Serve section configuration saved and published successfully!</span>
        </div>
      )}

      {/* Global settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Section settings</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enable Section</label>
            <select value={enabled ? "true" : "false"} onChange={(e) => setEnabled(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Layout display style</label>
            <select value={layout} onChange={(e) => setLayout(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
              <option value="grid">Grid of cards</option>
              <option value="carousel">Horizontal Carousel</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Main Heading</label>
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Section Subtitle</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Introductory description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Background Color</label>
            <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Text Color</label>
            <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-150">
          <button onClick={handleSaveGlobal} disabled={isPending} className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold uppercase text-[9px] font-mono tracking-wider cursor-pointer">
            {isPending ? <Loader2 className="w-3 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save global settings</span>
          </button>
        </div>
      </div>

      {/* Industries list */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Sectors / Industries We Serve</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Manage the list of industrial sectors catered to by Shree TBTC Global.</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Industry Sector</span>
          </button>
        </div>

        {industries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {industries.map((ind) => (
              <div 
                key={ind.id} 
                className={`border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col justify-between ${
                  ind.isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                <div>
                  <div className="h-28 bg-slate-200 relative overflow-hidden border-b border-slate-150">
                    {ind.imageUrl ? <img src={ind.imageUrl} alt={ind.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-mono text-slate-400">No Image</div>}
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="bg-slate-200 text-slate-700 text-[8px] font-bold font-mono px-1 rounded-sm uppercase">Order: {ind.displayOrder}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-xs">{ind.name}</h3>
                    <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">{ind.description}</p>
                  </div>
                </div>

                <div className="p-3.5 pt-0 flex justify-end gap-1.5 border-t border-slate-150 pt-2.5">
                  <button type="button" onClick={() => openEdit(ind)} className="p-1 hover:bg-slate-250 text-slate-650 rounded">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDeleteIndustry(ind.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No industry sectors listed.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Sector Details" : "Add Industry Sector"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Sector Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Oil & Gas refineries" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Slug (URL Name)</label>
                  <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. oil-and-gas" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Short Description</label>
                <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Sector supply details..." className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none leading-relaxed" />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Sector Image</label>
                <div className="flex gap-2">
                  <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Upload or enter URL..." className="flex-1 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
                  <div>
                    <input type="file" accept="image/*" id="ind-image-upload" className="hidden" onChange={handleImageUpload} />
                    <label htmlFor="ind-image-upload" className="flex items-center justify-center p-2.5 border border-slate-250 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer">
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Custom Link URL (Optional)</label>
                  <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/products/electrical" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Display Order</label>
                  <input type="number" required value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded px-2.5 py-1 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                <div>
                  <label className="flex items-center gap-2 font-bold text-slate-500 uppercase select-none cursor-pointer">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 rounded text-primary border-slate-300 cursor-pointer" />
                    <span>Enabled Sector</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer font-mono uppercase tracking-wider">Cancel</button>
                  <button type="button" onClick={handleSaveIndustry} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm font-mono uppercase tracking-wider">Save Sector</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
