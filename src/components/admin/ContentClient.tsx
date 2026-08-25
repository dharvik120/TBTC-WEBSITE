"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, X, Save, Upload, Layers, CheckCircle2, RefreshCw } from "lucide-react";
import { 
  saveWhyChooseUs, deleteWhyChooseUs, 
  saveIndustry, deleteIndustry 
} from "@/app/actions/admin";
import { uploadFile } from "@/lib/upload";

interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  iconName: string | null;
  displayOrder: number;
}

interface IndustryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface ContentClientProps {
  whyChooseUs: WhyChooseUsItem[];
  industries: IndustryItem[];
}

export default function ContentClient({ whyChooseUs: initialWhy, industries: initialInd }: ContentClientProps) {
  const [activeTab, setActiveTab] = useState<"industries" | "why">("industries");
  
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>(initialWhy);
  const [industries, setIndustries] = useState<IndustryItem[]>(initialInd);

  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  // Modal control
  const [modalType, setModalType] = useState<"why" | "ind" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Why Choose Us
  const [whyTitle, setWhyTitle] = useState("");
  const [whyDesc, setWhyDesc] = useState("");
  const [whyOrder, setWhyOrder] = useState(0);

  // Form Industry
  const [indName, setIndName] = useState("");
  const [indSlug, setIndSlug] = useState("");
  const [indDesc, setIndDesc] = useState("");
  const [indImage, setIndImage] = useState<string | null>(null);
  const [indOrder, setIndOrder] = useState(0);
  const [indActive, setIndActive] = useState(true);

  // Why triggers
  const openWhyNew = () => {
    setEditingId(null);
    setWhyTitle("");
    setWhyDesc("");
    setWhyOrder(0);
    setModalType("why");
  };

  const openWhyEdit = (item: WhyChooseUsItem) => {
    setEditingId(item.id);
    setWhyTitle(item.title);
    setWhyDesc(item.description);
    setWhyOrder(item.displayOrder);
    setModalType("why");
  };

  const handleWhySave = () => {
    if (!whyTitle || !whyDesc) {
      alert("Title and Description are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveWhyChooseUs(editingId, {
        title: whyTitle,
        description: whyDesc,
        iconName: "CheckCircle",
        displayOrder: Number(whyOrder),
      });
      if (res.success) {
        window.location.reload();
      }
    });
  };

  const handleWhyDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await deleteWhyChooseUs(id);
    if (res.success) {
      setWhyChooseUs((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Industry triggers
  const openIndNew = () => {
    setEditingId(null);
    setIndName("");
    setIndSlug("");
    setIndDesc("");
    setIndImage(null);
    setIndOrder(0);
    setIndActive(true);
    setModalType("ind");
  };

  const openIndEdit = (item: IndustryItem) => {
    setEditingId(item.id);
    setIndName(item.name);
    setIndSlug(item.slug);
    setIndDesc(item.description || "");
    setIndImage(item.imageUrl);
    setIndOrder(item.displayOrder);
    setIndActive(item.isActive);
    setModalType("ind");
  };

  const handleIndNameChange = (val: string) => {
    setIndName(val);
    if (!editingId) {
      setIndSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleIndImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const path = await uploadFile(formData);
    setUploading(false);

    if (path) {
      setIndImage(path);
    } else {
      alert("Upload failed.");
    }
  };

  const handleIndSave = () => {
    if (!indName || !indSlug) {
      alert("Name and Slug are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveIndustry(editingId, {
        name: indName,
        slug: indSlug,
        description: indDesc,
        imageUrl: indImage,
        displayOrder: Number(indOrder),
        isActive: indActive,
      });
      if (res.success) {
        window.location.reload();
      }
    });
  };

  const handleIndDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await deleteIndustry(id);
    if (res.success) {
      setIndustries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-xs font-mono font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("industries")}
          className={`pb-2.5 px-1 border-b-2 transition-colors focus:outline-none ${
            activeTab === "industries" ? "border-primary text-slate-800" : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
          style={{ borderBottomColor: activeTab === "industries" ? "var(--primary-color)" : "" }}
        >
          Sectors / Industries We Serve
        </button>
        <button
          onClick={() => setActiveTab("why")}
          className={`pb-2.5 px-1 border-b-2 transition-colors focus:outline-none ${
            activeTab === "why" ? "border-primary text-slate-800" : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
          style={{ borderBottomColor: activeTab === "why" ? "var(--primary-color)" : "" }}
        >
          Why Choose Us Features
        </button>
      </div>

      {/* Industries Tab Panel */}
      {activeTab === "industries" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
            <span className="text-xs font-mono text-slate-500">
              Sector highlights appear in grid format on the homepage.
            </span>
            <button
              onClick={openIndNew}
              className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-white rounded shadow-sm focus:outline-none cursor-pointer"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Sector</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industries.map((ind) => (
              <div key={ind.id} className="bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  {ind.imageUrl && (
                    <div className="h-32 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                      <img src={ind.imageUrl} alt={ind.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{ind.name}</h3>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">slug: {ind.slug} • Order: {ind.displayOrder}</p>
                    {ind.description && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{ind.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 p-4 bg-slate-50/50">
                  <span className={`px-2 py-0.5 rounded-sm font-mono text-[8px] font-bold uppercase shrink-0 border h-fit ${
                    ind.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}>
                    {ind.isActive ? "Active" : "Disabled"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openIndEdit(ind)}
                      className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleIndDelete(ind.id)}
                      className="p-1 bg-white hover:bg-red-50 hover:border-red-200 rounded text-slate-400 hover:text-red-650 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why Choose Us Tab Panel */}
      {activeTab === "why" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
            <span className="text-xs font-mono text-slate-500">
              Why Choose Us features render in bullet highlights lists.
            </span>
            <button
              onClick={openWhyNew}
              className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-white rounded shadow-sm focus:outline-none cursor-pointer"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Benefit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-md p-5 flex justify-between items-start gap-4 shadow-sm">
                <div className="flex gap-3">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{item.title}</h3>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">Order Index: {item.displayOrder}</p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0 self-center">
                  <button
                    onClick={() => openWhyEdit(item)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleWhyDelete(item.id)}
                    className="p-1.5 bg-slate-50 hover:bg-red-50 hover:border-red-200 rounded text-slate-450 hover:text-red-650 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. Why Choose Us Modal */}
      {modalType === "why" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Benefit Row" : "New Benefit Row"}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={whyTitle}
                  onChange={(e) => setWhyTitle(e.target.value)}
                  placeholder="e.g. Genuine Products"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={whyDesc}
                  onChange={(e) => setWhyDesc(e.target.value)}
                  placeholder="e.g. We supply only original and certified products..."
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none resize-y"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Display Order</label>
                <input
                  type="number"
                  value={whyOrder}
                  onChange={(e) => setWhyOrder(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button onClick={() => setModalType(null)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleWhySave} disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold disabled:opacity-50 cursor-pointer shadow-sm">
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Benefit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Industry Modal */}
      {modalType === "ind" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Industry Sector" : "New Industry Sector"}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="space-y-4 text-xs font-sans">
              
              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Sector Image</label>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded p-3">
                  <div className="w-16 h-12 bg-white border border-slate-100 rounded flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    {indImage ? (
                      <img src={indImage} alt="Sector preview" className="h-full w-full object-cover" />
                    ) : (
                      <Layers className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <input type="file" accept="image/*" id="ind-image-upload" onChange={handleIndImageUpload} className="hidden" />
                    <label htmlFor="ind-image-upload" className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 bg-white rounded text-[10px] font-bold text-slate-655 hover:bg-slate-50 cursor-pointer w-fit">
                      {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      <span>Upload Image</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={indName}
                  onChange={(e) => handleIndNameChange(e.target.value)}
                  placeholder="e.g. Food & Beverage"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={indSlug}
                  onChange={(e) => setIndSlug(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={indDesc}
                  onChange={(e) => setIndDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none resize-y"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Order Index</label>
                  <input
                    type="number"
                    value={indOrder}
                    onChange={(e) => setIndOrder(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Status</label>
                  <select
                    value={indActive ? "true" : "false"}
                    onChange={(e) => setIndActive(e.target.value === "true")}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="true">Active</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button onClick={() => setModalType(null)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleIndSave} disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold disabled:opacity-50 cursor-pointer shadow-sm">
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Sector</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
