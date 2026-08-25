"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, X, Sliders, Save, Upload, Eye } from "lucide-react";
import { saveSlide, deleteSlide } from "@/app/actions/admin";
import { uploadFile } from "@/lib/upload";

interface Slide {
  id: string;
  heading: string;
  subheading: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  secondaryCtaText: string | null;
  secondaryCtaLink: string | null;
  desktopImageUrl: string;
  mobileImageUrl: string | null;
  overlayOpacity: number;
  textAlignment: string;
  displayOrder: number;
  isActive: boolean;
}

interface SliderClientProps {
  slides: Slide[];
}

export default function SliderClient({ slides: initialSlides }: SliderClientProps) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  // Form State
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [secondaryCtaText, setSecondaryCtaText] = useState("");
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("");
  const [desktopImageUrl, setDesktopImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [overlayOpacity, setOverlayOpacity] = useState(0.4);
  const [textAlignment, setTextAlignment] = useState("LEFT");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const openNew = () => {
    setEditingId(null);
    setHeading("");
    setSubheading("");
    setCtaText("");
    setCtaLink("");
    setSecondaryCtaText("");
    setSecondaryCtaLink("");
    setDesktopImageUrl("");
    setMobileImageUrl("");
    setOverlayOpacity(0.4);
    setTextAlignment("LEFT");
    setDisplayOrder(0);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (s: Slide) => {
    setEditingId(s.id);
    setHeading(s.heading);
    setSubheading(s.subheading || "");
    setCtaText(s.ctaText || "");
    setCtaLink(s.ctaLink || "");
    setSecondaryCtaText(s.secondaryCtaText || "");
    setSecondaryCtaLink(s.secondaryCtaLink || "");
    setDesktopImageUrl(s.desktopImageUrl);
    setMobileImageUrl(s.mobileImageUrl || "");
    setOverlayOpacity(s.overlayOpacity);
    setTextAlignment(s.textAlignment);
    setDisplayOrder(s.displayOrder);
    setIsActive(s.isActive);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "desktop" | "mobile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "desktop") setUploadingDesktop(true);
    else setUploadingMobile(true);

    const formData = new FormData();
    formData.append("file", file);

    const path = await uploadFile(formData);

    if (type === "desktop") {
      setUploadingDesktop(false);
      if (path) setDesktopImageUrl(path);
    } else {
      setUploadingMobile(false);
      if (path) setMobileImageUrl(path);
    }
  };

  const handleSave = () => {
    if (!heading || !desktopImageUrl) {
      alert("Heading and Desktop Image URL are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveSlide(editingId, {
        heading,
        subheading,
        ctaText,
        ctaLink,
        secondaryCtaText,
        secondaryCtaLink,
        desktopImageUrl,
        mobileImageUrl,
        overlayOpacity: Number(overlayOpacity),
        textAlignment,
        displayOrder: Number(displayOrder),
        isActive,
      });

      if (res.success) {
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    const res = await deleteSlide(id);
    if (res.success) {
      setSlides((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
        <span className="text-xs font-mono text-slate-500">
          Sliders display in dynamic sequence on the front page hero banner.
        </span>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-white rounded shadow-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Slide</span>
        </button>
      </div>

      {/* Sliders Grid List */}
      <div className="space-y-4">
        {slides.length > 0 ? (
          slides.map((s) => (
            <div key={s.id} className="bg-white border border-slate-200 rounded-md p-5 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              
              {/* Desktop Image Preview */}
              <div className="h-24 w-full md:w-44 bg-slate-900 border border-slate-200 rounded flex items-center justify-center relative overflow-hidden shrink-0">
                <img src={s.desktopImageUrl} alt={s.heading} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <span className="text-[10px] font-mono font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                    ORDER: {s.displayOrder}
                  </span>
                </div>
              </div>

              {/* Text specifications */}
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-slate-800 text-sm leading-snug truncate">{s.heading}</h3>
                {s.subheading && <p className="text-slate-500 text-xs mt-1 truncate leading-relaxed">{s.subheading}</p>}
                <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-3 text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Align: {s.textAlignment}</span>
                  {s.ctaText && <span className="bg-slate-100 px-2 py-0.5 rounded">CTA: {s.ctaText} ({s.ctaLink})</span>}
                  {s.mobileImageUrl && <span className="bg-slate-100 px-2 py-0.5 rounded">Mobile Image Set</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0 items-center">
                <span className={`px-2 py-0.5 rounded-sm font-mono text-[8px] font-bold uppercase shrink-0 border mr-2 ${
                  s.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                }`}>
                  {s.isActive ? "Active" : "Disabled"}
                </span>
                <button
                  onClick={() => openEdit(s)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                  title="Edit Slide"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 bg-slate-50 hover:bg-red-50 hover:border-red-200 rounded text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-md py-16 text-center font-mono text-xs text-slate-400">
            NO HERO SLIDES SEEDED OR CREATED
          </div>
        )}
      </div>

      {/* Slide Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh] space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Hero Slide" : "New Hero Slide"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Form Image upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Desktop Image */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Desktop Image <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded p-2.5">
                    {desktopImageUrl && (
                      <img src={desktopImageUrl} alt="Desktop slide preview" className="h-20 object-cover w-full rounded border border-slate-100" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="slide-desktop-upload"
                      onChange={(e) => handleImageUpload(e, "desktop")}
                      className="hidden"
                    />
                    <label
                      htmlFor="slide-desktop-upload"
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-250 bg-white rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer w-full"
                    >
                      {uploadingDesktop ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>Upload Desktop Image</span>
                    </label>
                  </div>
                </div>

                {/* Mobile Image */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Mobile Image (Optional)
                  </label>
                  <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded p-2.5">
                    {mobileImageUrl && (
                      <img src={mobileImageUrl} alt="Mobile slide preview" className="h-20 object-cover w-full rounded border border-slate-100" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="slide-mobile-upload"
                      onChange={(e) => handleImageUpload(e, "mobile")}
                      className="hidden"
                    />
                    <label
                      htmlFor="slide-mobile-upload"
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-250 bg-white rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer w-full"
                    >
                      {uploadingMobile ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>Upload Mobile Image</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Slide Heading
                </label>
                <input
                  type="text"
                  required
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="e.g. Premium Switchgear Supplies"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              {/* Subheading */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Slide Subheading
                </label>
                <textarea
                  rows={2}
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  placeholder="e.g. Importer and dealer of relays, star-delta starters, and MPCBs."
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none resize-y"
                />
              </div>

              {/* Buttons: Primary button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Explore Products"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="/products"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Buttons: Secondary button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Secondary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={secondaryCtaText}
                    onChange={(e) => setSecondaryCtaText(e.target.value)}
                    placeholder="e.g. Contact Us"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Secondary CTA Link
                  </label>
                  <input
                    type="text"
                    value={secondaryCtaLink}
                    onChange={(e) => setSecondaryCtaLink(e.target.value)}
                    placeholder="/contact"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Align, Order, Opacity */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Text Alignment
                  </label>
                  <select
                    value={textAlignment}
                    onChange={(e) => setTextAlignment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="LEFT">Left</option>
                    <option value="CENTER">Center</option>
                    <option value="RIGHT">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Overlay Opacity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="0.9"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={isActive ? "true" : "false"}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
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
                  <span>Save Slide</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
