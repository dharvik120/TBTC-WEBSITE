"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, X, Award, Save, Upload, ExternalLink } from "lucide-react";
import { saveBrand, deleteBrand, uploadFile } from "@/app/actions/admin";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

interface BrandsClientProps {
  brands: Brand[];
}

export default function BrandsClient({ brands: initialBrands }: BrandsClientProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const openNew = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setLogoUrl(null);
    setDescription("");
    setWebsiteUrl("");
    setIsActive(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEdit = (b: Brand) => {
    setEditingId(b.id);
    setName(b.name);
    setSlug(b.slug);
    setLogoUrl(b.logoUrl);
    setDescription(b.description || "");
    setWebsiteUrl(b.websiteUrl || "");
    setIsActive(b.isActive);
    setIsFeatured(b.isFeatured);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const path = await uploadFile(formData);
    setUploading(false);
    if (path) {
      setLogoUrl(path);
    } else {
      alert("Failed to upload logo image.");
    }
  };

  const handleSave = () => {
    if (!name || !slug) {
      alert("Name and Slug are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveBrand(editingId, {
        name,
        slug,
        logoUrl,
        description,
        websiteUrl,
        isActive,
        isFeatured,
      });

      if (res.success) {
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand? Products mapped to this brand will remain but their brand association will be cleared.")) return;

    const res = await deleteBrand(id);
    if (res.success) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
        <span className="text-xs font-mono text-slate-500">
          Partner brands will display in the brand logostripe on the homepage.
        </span>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-white rounded shadow-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Plus className="w-4 h-4" />
          <span>New Brand</span>
        </button>
      </div>

      {/* Brands List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.length > 0 ? (
          brands.map((b) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative">
              
              {/* Featured Ribbon */}
              {b.isFeatured && (
                <span className="absolute top-3 right-3 bg-orange-50 text-orange-700 border border-orange-100 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                  Featured
                </span>
              )}

              <div className="space-y-4">
                {/* Brand Logo Display */}
                <div className="h-16 w-full bg-slate-50 border border-slate-100 rounded flex items-center justify-center p-3 relative overflow-hidden">
                  {b.logoUrl ? (
                    <img src={b.logoUrl} alt={b.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-sm font-black font-mono text-slate-400 tracking-wider">
                      {b.name}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{b.name}</h3>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">slug: {b.slug}</p>
                  {b.websiteUrl && (
                    <a href={b.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 mt-1.5">
                      <span>Visit Website</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end border-t border-slate-100 pt-4 mt-5">
                <span className={`px-2 py-0.5 rounded-sm font-mono text-[8px] font-bold uppercase shrink-0 border h-fit self-center mr-auto ${
                  b.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  {b.isActive ? "Active" : "Disabled"}
                </span>
                <button
                  onClick={() => openEdit(b)}
                  className="p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                  title="Edit Brand"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1 bg-slate-50 hover:bg-red-50 hover:border-red-200 rounded text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Brand"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-slate-200 rounded-md py-16 text-center font-mono text-xs text-slate-400">
            NO PARTNER BRANDS REGISTERED
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Brand" : "New Brand"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Logo Upload */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Brand Logo Image
                </label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded p-3">
                  <div className="w-16 h-12 bg-white border border-slate-100 rounded flex items-center justify-center p-1.5 shrink-0">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Award className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="logo-upload"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 bg-white rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer w-fit"
                    >
                      {uploading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      <span>Upload Logo</span>
                    </label>
                    <p className="text-[9px] text-slate-450 mt-1 truncate">PNG, JPG, SVG. Recommended: Transparent background.</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. ABB"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Slug (URL suffix)
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Brand Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://brandwebsite.com"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Brief description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none resize-y"
                />
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Homepage Featured
                  </label>
                  <select
                    value={isFeatured ? "true" : "false"}
                    onChange={(e) => setIsFeatured(e.target.value === "true")}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="false">Standard List</option>
                    <option value="true">Featured (Showcase Logo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={isActive ? "true" : "false"}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 focus:outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Brand</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
