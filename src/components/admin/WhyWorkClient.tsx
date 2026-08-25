"use client";

import React, { useState, useTransition } from "react";
import { Save, Plus, Edit, Trash2, ShieldCheck, Loader2, CheckCircle2, ArrowUp, ArrowDown, HelpCircle, X } from "lucide-react";
import { updateWhyWorkUsSection, saveWhyChooseUs, deleteWhyChooseUs } from "@/app/actions/admin";

interface WhyItem {
  id: string;
  title: string;
  description: string;
  iconName: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface WhyWorkClientProps {
  settings: {
    whyWorkEnabled: boolean;
    whyWorkHeading: string;
    whyWorkHighlight: string;
    whyWorkSubtitle: string;
    whyWorkDescription: string;
    whyWorkBgColor: string;
    whyWorkTextColor: string;
    whyWorkImage: string | null;
    whyWorkLayout: string;
  };
  initialItems: WhyItem[];
}

export default function WhyWorkClient({ settings, initialItems }: WhyWorkClientProps) {
  // Global settings
  const [enabled, setEnabled] = useState(settings.whyWorkEnabled);
  const [heading, setHeading] = useState(settings.whyWorkHeading);
  const [highlight, setHighlight] = useState(settings.whyWorkHighlight);
  const [subtitle, setSubtitle] = useState(settings.whyWorkSubtitle);
  const [description, setDescription] = useState(settings.whyWorkDescription);
  const [bgColor, setBgColor] = useState(settings.whyWorkBgColor);
  const [textColor, setTextColor] = useState(settings.whyWorkTextColor);
  const [layout, setLayout] = useState(settings.whyWorkLayout);

  // Items CRUD list
  const [items, setItems] = useState<WhyItem[]>(initialItems.sort((a, b) => a.displayOrder - b.displayOrder));
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemIcon, setItemIcon] = useState("ShieldCheck");
  const [itemOrder, setItemOrder] = useState(0);

  const openNew = () => {
    setEditingId(null);
    setItemTitle("");
    setItemDesc("");
    setItemIcon("ShieldCheck");
    setItemOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const openEdit = (item: WhyItem) => {
    setEditingId(item.id);
    setItemTitle(item.title);
    setItemDesc(item.description);
    setItemIcon(item.iconName || "ShieldCheck");
    setItemOrder(item.displayOrder);
    setIsModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!itemTitle || !itemDesc) {
      alert("Title and Description are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveWhyChooseUs(editingId, {
        title: itemTitle,
        description: itemDesc,
        iconName: itemIcon,
        displayOrder: itemOrder,
        isActive: true
      } as any);

      if (res.success) {
        // Optimistic / fetch refresh trigger
        alert("Benefit item saved successfully! Re-publishing page variables.");
        window.location.reload();
      }
    });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to remove this benefit card?")) {
      startTransition(async () => {
        const res = await deleteWhyChooseUs(id);
        if (res.success) {
          setItems((prev) => prev.filter((item) => item.id !== id));
        }
      });
    }
  };

  const handleSaveGlobal = () => {
    startTransition(async () => {
      const res = await updateWhyWorkUsSection({
        whyWorkEnabled: enabled,
        whyWorkHeading: heading,
        whyWorkHighlight: highlight,
        whyWorkSubtitle: subtitle,
        whyWorkDescription: description,
        whyWorkBgColor: bgColor,
        whyWorkTextColor: textColor,
        whyWorkImage: null,
        whyWorkLayout: layout
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
          <span className="font-semibold">Why Choose Us section settings saved and published successfully!</span>
        </div>
      )}

      {/* Global Config */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Global Settings</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enable Section</label>
            <select value={enabled ? "true" : "false"} onChange={(e) => setEnabled(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Highlighted word</label>
            <input type="text" value={highlight} onChange={(e) => setHighlight(e.target.value)} placeholder="e.g. Shree TBTC" className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Section layout style</label>
            <select value={layout} onChange={(e) => setLayout(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
              <option value="left-content">Text Left, benefits grid Right</option>
              <option value="grid">Simple card grid</option>
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
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Short section intro description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Background Color</label>
            <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Text Typography Color</label>
            <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-150">
          <button onClick={handleSaveGlobal} disabled={isPending} className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold uppercase text-[9px] font-mono tracking-wider cursor-pointer shadow-sm">
            {isPending ? <Loader2 className="w-3 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save global settings</span>
          </button>
        </div>
      </div>

      {/* Benefits List CRUD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Benefit Cards List</h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Manage individual value cards that appear inside the Why Choose Us section block.</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Benefit Card</span>
          </button>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border border-slate-200 p-4 rounded-lg bg-slate-50 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-200 text-slate-650 text-[8px] font-bold px-1.5 py-0.5 rounded-sm font-mono uppercase">Order: {item.displayOrder}</span>
                      <span className="bg-blue-50 text-blue-700 text-[8px] font-bold px-1.5 py-0.5 rounded-sm font-mono uppercase">{item.iconName || "ShieldCheck"}</span>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-xs">{item.title}</h3>
                  <p className="text-slate-500 text-[10px] leading-relaxed">{item.description}</p>
                </div>
                <div className="flex justify-end gap-1.5 border-t border-slate-150 pt-2.5">
                  <button type="button" onClick={() => openEdit(item)} className="p-1 hover:bg-slate-200 text-slate-650 rounded">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDeleteItem(item.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No benefit cards added yet.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Benefit Card" : "Add Benefit Card"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Title</label>
                <input type="text" required value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} placeholder="e.g. Certified Source" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Short Description</label>
                <textarea rows={3} required value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} placeholder="Provide short details..." className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none leading-relaxed" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Lucide Icon Key</label>
                  <select value={itemIcon} onChange={(e) => setItemIcon(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none font-mono cursor-pointer">
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="Clock">Clock</option>
                    <option value="Wrench">Wrench</option>
                    <option value="Award">Award</option>
                    <option value="CheckCircle">CheckCircle</option>
                    <option value="Zap">Zap</option>
                    <option value="Globe">Globe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Order Index</label>
                  <input type="number" required value={itemOrder} onChange={(e) => setItemOrder(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded px-2.5 py-1 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer font-mono uppercase tracking-wider">Cancel</button>
                <button type="button" onClick={handleSaveItem} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm font-mono uppercase tracking-wider">Save Card</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
