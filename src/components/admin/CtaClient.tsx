"use client";

import React, { useState, useTransition } from "react";
import { Save, Plus, Edit, Trash2, Layout, Link, Eye, EyeOff, Loader2, CheckCircle2, X } from "lucide-react";
import { updateCtaSectionSettings } from "@/app/actions/admin";

interface CtaButton {
  text: string;
  link: string;
  style: string; // primary, secondary
  color: string;
  textColor: string;
  openInNewTab: boolean;
  isActive: boolean;
}

interface CtaClientProps {
  settings: {
    homeCtaEnabled: boolean;
    homeCtaHeading: string;
    homeCtaHighlight: string;
    homeCtaDescription: string;
    homeCtaBgColor: string;
    homeCtaBgImage: string | null;
    homeCtaBgOverlay: number;
    homeCtaTextColor: string;
    homeCtaButtons: string | null;
  };
}

export default function CtaClient({ settings }: CtaClientProps) {
  // Global settings
  const [enabled, setEnabled] = useState(settings.homeCtaEnabled);
  const [heading, setHeading] = useState(settings.homeCtaHeading);
  const [highlight, setHighlight] = useState(settings.homeCtaHighlight);
  const [description, setDescription] = useState(settings.homeCtaDescription);
  const [bgColor, setBgColor] = useState(settings.homeCtaBgColor);
  const [bgOverlay, setBgOverlay] = useState(settings.homeCtaBgOverlay);
  const [textColor, setTextColor] = useState(settings.homeCtaTextColor);

  // Buttons CRUD list
  const [buttons, setButtons] = useState<CtaButton[]>(() => {
    if (settings.homeCtaButtons) {
      try {
        return JSON.parse(settings.homeCtaButtons);
      } catch (e) {
        console.error("Failed parsing homeCtaButtons:", e);
      }
    }
    return [];
  });

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form State
  const [btnText, setBtnText] = useState("");
  const [btnLink, setBtnLink] = useState("");
  const [btnStyle, setBtnStyle] = useState("primary");
  const [btnColor, setBtnColor] = useState("#d9534f");
  const [btnTextColor, setBtnTextColor] = useState("#ffffff");
  const [btnOpenNew, setBtnOpenNew] = useState(false);
  const [btnActive, setBtnActive] = useState(true);

  const openNewBtn = () => {
    setEditingIndex(null);
    setBtnText("");
    setBtnLink("");
    setBtnStyle("primary");
    setBtnColor("#d9534f");
    setBtnTextColor("#ffffff");
    setBtnOpenNew(false);
    setBtnActive(true);
    setIsModalOpen(true);
  };

  const openEditBtn = (idx: number) => {
    const btn = buttons[idx];
    setEditingIndex(idx);
    setBtnText(btn.text);
    setBtnLink(btn.link);
    setBtnStyle(btn.style);
    setBtnColor(btn.color);
    setBtnTextColor(btn.textColor);
    setBtnOpenNew(btn.openInNewTab);
    setBtnActive(btn.isActive);
    setIsModalOpen(true);
  };

  const handleSaveBtn = () => {
    if (!btnText || !btnLink) {
      alert("Button Text and Target Link are required.");
      return;
    }

    const payload: CtaButton = {
      text: btnText,
      link: btnLink,
      style: btnStyle,
      color: btnColor,
      textColor: btnTextColor,
      openInNewTab: btnOpenNew,
      isActive: btnActive
    };

    if (editingIndex !== null) {
      setButtons((prev) => prev.map((btn, idx) => (idx === editingIndex ? payload : btn)));
    } else {
      setButtons((prev) => [...prev, payload]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteBtn = (index: number) => {
    if (confirm("Delete this CTA button configuration?")) {
      setButtons((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const handlePublish = () => {
    startTransition(async () => {
      const res = await updateCtaSectionSettings({
        homeCtaEnabled: enabled,
        homeCtaHeading: heading,
        homeCtaHighlight: highlight,
        homeCtaDescription: description,
        homeCtaBgColor: bgColor,
        homeCtaBgImage: null,
        homeCtaBgOverlay: bgOverlay,
        homeCtaTextColor: textColor,
        homeCtaButtons: JSON.stringify(buttons)
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
          <span className="font-semibold">Call to Action stripe configurations saved and published successfully!</span>
        </div>
      )}

      {/* Global settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Stripe Settings</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enable Section</label>
            <select value={enabled ? "true" : "false"} onChange={(e) => setEnabled(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Highlighted text</label>
            <input type="text" value={highlight} onChange={(e) => setHighlight(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Overlay Opacity</label>
            <input type="number" step="0.1" min="0" max="1" value={bgOverlay} onChange={(e) => setBgOverlay(parseFloat(e.target.value) || 0)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Main Heading</label>
            <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Description text</label>
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
      </div>

      {/* Buttons Manager */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">CTA Buttons</h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Define buttons, destination links, colors, and select targets.</p>
          </div>
          <button
            onClick={openNewBtn}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add CTA Button</span>
          </button>
        </div>

        {buttons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {buttons.map((btn, idx) => (
              <div key={idx} className={`border border-slate-200 p-4 rounded-lg bg-slate-50 flex flex-col justify-between space-y-3 ${btn.isActive ? "opacity-100" : "opacity-60"}`}>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="bg-slate-200 text-slate-700 text-[8px] font-bold font-mono px-1 rounded-sm uppercase">{btn.style}</span>
                    <span className="font-mono text-slate-350 text-[9px]">#{idx + 1}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-850 text-xs">{btn.text}</h3>
                  <span className="text-[10px] font-mono text-slate-400 block truncate">Link: {btn.link}</span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200 pt-2.5">
                  <span className="font-mono text-[9px] text-slate-400">Target: {btn.openInNewTab ? "_blank" : "_self"}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEditBtn(idx)} className="p-1 hover:bg-slate-250 text-slate-650 rounded">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDeleteBtn(idx)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No buttons added to CTA.
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-150">
          <button
            onClick={handlePublish}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold disabled:opacity-50 cursor-pointer shadow-sm text-[10px] uppercase font-mono tracking-wider"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Publish CTA Changes</span>
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingIndex !== null ? "Edit CTA Button" : "Add CTA Button"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Button text</label>
                  <input type="text" required value={btnText} onChange={(e) => setBtnText(e.target.value)} placeholder="e.g. Chat Support" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Button link</label>
                  <input type="text" required value={btnLink} onChange={(e) => setBtnLink(e.target.value)} placeholder="e.g. /contact" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Button color</label>
                  <input type="text" required value={btnColor} onChange={(e) => setBtnColor(e.target.value)} placeholder="#d9534f" className="w-full border border-slate-250 rounded px-2 py-1.5 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Text Color</label>
                  <input type="text" required value={btnTextColor} onChange={(e) => setBtnTextColor(e.target.value)} placeholder="#ffffff" className="w-full border border-slate-250 rounded px-2 py-1.5 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Open link target</label>
                  <select value={btnOpenNew ? "true" : "false"} onChange={(e) => setBtnOpenNew(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
                    <option value="false">Same Tab (_self)</option>
                    <option value="true">New Tab (_blank)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Default Status</label>
                  <select value={btnActive ? "true" : "false"} onChange={(e) => setBtnActive(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" onClick={handleSaveBtn} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm">Save Button</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
