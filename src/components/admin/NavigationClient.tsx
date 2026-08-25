"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, ChevronRight, FileImage, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { updateHeaderNavigationConfig, uploadFile } from "@/app/actions/admin";

interface NavigationItem {
  name: string;
  href: string;
  isExternal: boolean;
  dropdownItems?: { name: string; href: string }[];
}

interface NavigationClientProps {
  settings: {
    logoUrl: string | null;
    mobileLogoUrl: string | null;
    headerCtaText: string | null;
    headerCtaLink: string | null;
    enableHeaderSearch: boolean;
    enableStickyHeader: boolean;
    navigationConfig: string | null;
  };
}

export default function NavigationClient({ settings }: NavigationClientProps) {
  // Global settings
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [mobileLogoUrl, setMobileLogoUrl] = useState(settings.mobileLogoUrl);
  const [headerCtaText, setHeaderCtaText] = useState(settings.headerCtaText || "Request Quote");
  const [headerCtaLink, setHeaderCtaLink] = useState(settings.headerCtaLink || "/quote");
  const [enableHeaderSearch, setEnableHeaderSearch] = useState(settings.enableHeaderSearch);
  const [enableStickyHeader, setEnableStickyHeader] = useState(settings.enableStickyHeader);

  // Navigation Links
  const [navItems, setNavItems] = useState<NavigationItem[]>(() => {
    if (settings.navigationConfig) {
      try {
        return JSON.parse(settings.navigationConfig);
      } catch (e) {
        console.error("Failed parsing navigationConfig:", e);
      }
    }
    return [];
  });

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form State
  const [linkName, setLinkName] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [linkExternal, setLinkExternal] = useState(false);
  
  // Nested sub-items array state
  const [subItems, setSubItems] = useState<{ name: string; href: string }[]>([]);
  const [subName, setSubName] = useState("");
  const [subHref, setSubHref] = useState("");

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingMob, setUploadingMob] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "mobile") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "main") setUploadingLogo(true);
    else setUploadingMob(true);

    const formData = new FormData();
    formData.append("file", file);
    const path = await uploadFile(formData);

    if (type === "main") {
      setUploadingLogo(false);
      if (path) setLogoUrl(path);
    } else {
      setUploadingMob(false);
      if (path) setMobileLogoUrl(path);
    }
  };

  const openNew = () => {
    setEditingIndex(null);
    setLinkName("");
    setLinkHref("");
    setLinkExternal(false);
    setSubItems([]);
    setIsModalOpen(true);
  };

  const openEdit = (idx: number) => {
    const item = navItems[idx];
    setEditingIndex(idx);
    setLinkName(item.name);
    setLinkHref(item.href);
    setLinkExternal(item.isExternal);
    setSubItems(item.dropdownItems || []);
    setIsModalOpen(true);
  };

  const addSubItem = () => {
    if (!subName || !subHref) return;
    setSubItems((prev) => [...prev, { name: subName, href: subHref }]);
    setSubName("");
    setSubHref("");
  };

  const removeSubItem = (idx: number) => {
    setSubItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveLink = () => {
    if (!linkName || !linkHref) {
      alert("Name and Link URL are required.");
      return;
    }

    const payload: NavigationItem = {
      name: linkName,
      href: linkHref,
      isExternal: linkExternal,
    };
    if (subItems.length > 0) {
      payload.dropdownItems = subItems;
    }

    if (editingIndex !== null) {
      setNavItems((prev) => prev.map((item, idx) => (idx === editingIndex ? payload : item)));
    } else {
      setNavItems((prev) => [...prev, payload]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteLink = (index: number) => {
    if (confirm("Remove this link from header?")) {
      setNavItems((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const moveLink = (index: number, direction: "up" | "down") => {
    const newItems = [...navItems];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setNavItems(newItems);
  };

  const handlePublish = () => {
    startTransition(async () => {
      const res = await updateHeaderNavigationConfig({
        logoUrl,
        mobileLogoUrl,
        headerCtaText,
        headerCtaLink,
        enableHeaderSearch,
        enableStickyHeader,
        navigationConfig: JSON.stringify(navItems)
      });
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Website Header and navigation config published successfully!</span>
        </div>
      )}

      {/* Grid: Logos & Global switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Logos section */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Header Logos</h2>
          
          <div className="space-y-3">
            {/* Desktop Logo */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-4">
              <div className="h-10 w-28 bg-white border border-slate-100 rounded flex items-center justify-center p-1 relative overflow-hidden">
                {logoUrl ? <img src={logoUrl} alt="Desktop Logo" className="max-h-full max-w-full object-contain" /> : <FileImage className="w-5 h-5 text-slate-300" />}
              </div>
              <div>
                <input type="file" accept="image/*" id="main-logo-upload" className="hidden" onChange={(e) => handleLogoUpload(e, "main")} />
                <label htmlFor="main-logo-upload" className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 bg-white rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer shadow-sm">
                  {uploadingLogo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Main Logo</span>
                </label>
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-4">
              <div className="h-10 w-28 bg-white border border-slate-100 rounded flex items-center justify-center p-1 relative overflow-hidden">
                {mobileLogoUrl ? <img src={mobileLogoUrl} alt="Mobile Logo" className="max-h-full max-w-full object-contain" /> : <FileImage className="w-5 h-5 text-slate-300" />}
              </div>
              <div>
                <input type="file" accept="image/*" id="mobile-logo-upload" className="hidden" onChange={(e) => handleLogoUpload(e, "mobile")} />
                <label htmlFor="mobile-logo-upload" className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 bg-white rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer shadow-sm">
                  {uploadingMob ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Mobile Logo</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Header Options</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sticky Navigation</label>
              <select value={enableStickyHeader ? "true" : "false"} onChange={(e) => setEnableStickyHeader(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none">
                <option value="true">Enable sticky scroll</option>
                <option value="false">Disable sticky scroll</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Search Bar Widget</label>
              <select value={enableHeaderSearch ? "true" : "false"} onChange={(e) => setEnableHeaderSearch(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none">
                <option value="true">Visible</option>
                <option value="false">Hidden</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CTA Button Text</label>
              <input type="text" value={headerCtaText} onChange={(e) => setHeaderCtaText(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CTA Button Link</label>
              <input type="text" value={headerCtaLink} onChange={(e) => setHeaderCtaLink(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
            </div>
          </div>
        </div>

      </div>

      {/* Navigation menu structure */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Header Navigation Menu Builder</h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Drag links up or down to set order, and define nested dropdown menus.</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Main Link</span>
          </button>
        </div>

        {navItems.length > 0 ? (
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-150">
            {navItems.map((item, idx) => (
              <div key={idx} className="bg-white">
                {/* Main Link row */}
                <div className="p-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-slate-350 font-bold shrink-0">#{idx + 1}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.name}</span>
                        {item.isExternal && (
                          <span className="bg-slate-100 text-slate-500 text-[8px] font-mono font-bold uppercase px-1 rounded-sm">External</span>
                        )}
                        {item.dropdownItems && item.dropdownItems.length > 0 && (
                          <span className="bg-blue-50 text-blue-700 text-[8px] font-mono font-bold uppercase px-1 rounded-sm">
                            Dropdown ({item.dropdownItems.length})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{item.href}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveLink(idx, "up")} disabled={idx === 0} className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => moveLink(idx, "down")} disabled={idx === navItems.length - 1} className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-px h-4.5 bg-slate-200 mx-1.5" />
                    <button onClick={() => openEdit(idx)} className="p-1 hover:bg-slate-100 rounded text-slate-650">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteLink(idx)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Submenu Dropdown List (if exists) */}
                {item.dropdownItems && item.dropdownItems.length > 0 && (
                  <div className="pl-12 bg-slate-50/50 border-t border-slate-100 py-2 divide-y divide-slate-150/50">
                    {item.dropdownItems.map((sub, subIdx) => (
                      <div key={subIdx} className="flex justify-between items-center py-1.5 pr-4 text-[11px]">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{sub.name}</span>
                          <span className="font-mono text-slate-400">({sub.href})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No links added. Menu is empty.
          </div>
        )}

        {/* Publish Action */}
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
            <span>Publish Navigation Menu</span>
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-lg p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingIndex !== null ? "Edit Menu Link" : "Add Main Link"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Link Label</label>
                  <input
                    type="text"
                    required
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    placeholder="e.g. Products"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Link URL</label>
                  <input
                    type="text"
                    required
                    value={linkHref}
                    onChange={(e) => setLinkHref(e.target.value)}
                    placeholder="e.g. /products"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 font-bold text-slate-500 uppercase select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkExternal}
                    onChange={(e) => setLinkExternal(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-slate-300 cursor-pointer"
                  />
                  <span>Open in a new browser tab (External Link)</span>
                </label>
              </div>

              {/* Submenu Dropdown manager */}
              <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-lg space-y-4">
                <h4 className="font-extrabold text-[10px] font-mono text-slate-400 uppercase tracking-wide border-b border-slate-150 pb-1.5">
                  Dropdown Items (Optional)
                </h4>

                {/* Submenu List */}
                {subItems.length > 0 && (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {subItems.map((sub, sIdx) => (
                      <div key={sIdx} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded">
                        <div>
                          <span className="font-bold text-slate-800">{sub.name}</span>
                          <span className="font-mono text-slate-400 text-[10px] ml-2">({sub.href})</span>
                        </div>
                        <button type="button" onClick={() => removeSubItem(sIdx)} className="p-1 text-slate-400 hover:text-red-650 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Submenu Add Form */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end bg-white border border-slate-150 p-2.5 rounded">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Sub-item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. STARTERS"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Sub-item Link</label>
                    <input
                      type="text"
                      placeholder="e.g. /products/electrical"
                      value={subHref}
                      onChange={(e) => setSubHref(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSubItem}
                    className="w-full py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold uppercase tracking-wider text-[9px] cursor-pointer"
                  >
                    Add Sub-item
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150 animate-fadeIn">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLink}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm"
                >
                  Save Link
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
