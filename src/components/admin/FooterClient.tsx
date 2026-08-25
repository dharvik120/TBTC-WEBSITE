"use client";

import React, { useState, useTransition } from "react";
import { Save, Plus, Trash2, Layout, Link, Eye, EyeOff, Loader2, ArrowUp, ArrowDown, CheckCircle2, X } from "lucide-react";
import { updateFooterConfig } from "@/app/actions/admin";

interface FooterColumn {
  title: string;
  type: string; // text, links, categories, contact
  content?: string; // for text columns
  links?: { text: string; href: string }[]; // for link columns
  limit?: number; // for category columns
  showHours?: boolean; // for contact columns
}

interface FooterClientProps {
  settings: {
    footerConfig: string | null;
    copyrightText: string | null;
    copyrightLink: string | null;
    devCreditText: string | null;
    devCreditLink: string | null;
    devCreditEnabled: boolean;
    devCreditOpenInNewTab: boolean;
  };
}

export default function FooterClient({ settings }: FooterClientProps) {
  // Copyright & Credits
  const [copyrightText, setCopyrightText] = useState(settings.copyrightText || "");
  const [copyrightLink, setCopyrightLink] = useState(settings.copyrightLink || "");
  const [devCreditText, setDevCreditText] = useState(settings.devCreditText || "");
  const [devCreditLink, setDevCreditLink] = useState(settings.devCreditLink || "");
  const [devCreditEnabled, setDevCreditEnabled] = useState(settings.devCreditEnabled);
  const [devCreditOpenInNewTab, setDevCreditOpenInNewTab] = useState(settings.devCreditOpenInNewTab);

  // Column config
  const [columns, setColumns] = useState<FooterColumn[]>(() => {
    if (settings.footerConfig) {
      try {
        return JSON.parse(settings.footerConfig);
      } catch (e) {
        console.error("Failed parsing footerConfig:", e);
      }
    }
    return [];
  });

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Column Form
  const [colTitle, setColTitle] = useState("");
  const [colType, setColType] = useState("links");
  const [colContent, setColContent] = useState("");
  const [colLinks, setColLinks] = useState<{ text: string; href: string }[]>([]);
  const [newLinkText, setNewLinkText] = useState("");
  const [newLinkHref, setNewLinkHref] = useState("");

  const openNewCol = () => {
    setColTitle("");
    setColType("links");
    setColContent("");
    setColLinks([]);
    setNewLinkText("");
    setNewLinkHref("");
    setIsModalOpen(true);
  };

  const addColLink = () => {
    if (!newLinkText || !newLinkHref) return;
    setColLinks((prev) => [...prev, { text: newLinkText, href: newLinkHref }]);
    setNewLinkText("");
    setNewLinkHref("");
  };

  const removeColLink = (idx: number) => {
    setColLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveColumn = () => {
    if (!colTitle) {
      alert("Column Title is required.");
      return;
    }

    const newCol: FooterColumn = {
      title: colTitle,
      type: colType
    };

    if (colType === "text") {
      newCol.content = colContent;
    } else if (colType === "links") {
      newCol.links = colLinks;
    } else if (colType === "categories") {
      newCol.limit = 5;
    } else if (colType === "contact") {
      newCol.showHours = true;
    }

    setColumns((prev) => [...prev, newCol]);
    setIsModalOpen(false);
  };

  const handleDeleteColumn = (index: number) => {
    if (confirm("Remove this column block from the footer layout?")) {
      setColumns((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const moveColumn = (index: number, direction: "left" | "right") => {
    const newCols = [...columns];
    const targetIdx = direction === "left" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCols.length) return;

    const temp = newCols[index];
    newCols[index] = newCols[targetIdx];
    newCols[targetIdx] = temp;
    setColumns(newCols);
  };

  const handlePublish = () => {
    startTransition(async () => {
      const res = await updateFooterConfig({
        footerConfig: JSON.stringify(columns),
        copyrightText,
        copyrightLink,
        devCreditText,
        devCreditLink,
        devCreditEnabled,
        devCreditOpenInNewTab
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
          <span className="font-semibold">Footer layout & developer credits configurations saved successfully!</span>
        </div>
      )}

      {/* FOOTER BUILDER COLUMNS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <Layout className="w-4 h-4 text-slate-450" />
              <span>Multi-Column Footer Builder</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Define columns, link lists, contact details, and category menus in the website footer.</p>
          </div>
          <button
            onClick={openNewCol}
            disabled={columns.length >= 4}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column Block ({columns.length}/4)</span>
          </button>
        </div>

        {columns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {columns.map((col, idx) => (
              <div key={idx} className="border border-slate-200 bg-slate-50 p-4 rounded-lg space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[9px] text-slate-400 font-bold">Col #{idx + 1}</span>
                    <span className="bg-slate-200 text-slate-600 text-[8px] font-mono px-1 rounded-sm uppercase tracking-wide">{col.type}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase border-b border-slate-200 pb-1">{col.title}</h3>
                  
                  {col.type === "text" && <p className="text-slate-500 text-[10px] leading-relaxed">{col.content}</p>}
                  {col.type === "links" && col.links && (
                    <ul className="space-y-1 text-slate-500 text-[10px]">
                      {col.links.map((lnk, lIdx) => (
                        <li key={lIdx} className="truncate">• {lnk.text}</li>
                      ))}
                    </ul>
                  )}
                  {col.type === "categories" && <p className="text-slate-400 font-mono text-[9px] italic">Schedules dynamic Category listings</p>}
                  {col.type === "contact" && <p className="text-slate-400 font-mono text-[9px] italic">Injects offices contact numbers</p>}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveColumn(idx, "left")} disabled={idx === 0} className="p-1 hover:bg-slate-200 rounded text-slate-450 disabled:opacity-30">
                      <ArrowUp className="w-3.5 h-3.5 rotate-270" />
                    </button>
                    <button type="button" onClick={() => moveColumn(idx, "right")} disabled={idx === columns.length - 1} className="p-1 hover:bg-slate-200 rounded text-slate-450 disabled:opacity-30">
                      <ArrowDown className="w-3.5 h-3.5 rotate-270" />
                    </button>
                  </div>
                  <button type="button" onClick={() => handleDeleteColumn(idx)} className="p-1 text-slate-400 hover:text-red-650 rounded hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No column blocks set.
          </div>
        )}
      </div>

      {/* COPYRIGHT & DEVELOPER CREDITS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase border-b border-slate-150 pb-2">Copyrights & Credits Bar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Copyright text */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Copyright Line</label>
            <input type="text" value={copyrightText} onChange={(e) => setCopyrightText(e.target.value)} placeholder="Use {year} for current year macro" className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            <p className="text-[9px] text-slate-400">e.g. © {"{year}"} Shree TBTC Global Industries. All Rights Reserved.</p>
          </div>

          {/* Copyright link */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Copyright URL Anchor Link (Optional)</label>
            <input type="text" value={copyrightLink} onChange={(e) => setCopyrightLink(e.target.value)} placeholder="/" className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>

          {/* Developer credit text */}
          <div className="space-y-1.5 border-t border-slate-100 pt-4 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Developer Credit Label</label>
              <input type="text" value={devCreditText} onChange={(e) => setDevCreditText(e.target.value)} placeholder="Created & Developed By Webz Technologies" className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Developer Link URL</label>
              <input type="text" value={devCreditLink} onChange={(e) => setDevCreditLink(e.target.value)} placeholder="https://webztechnologies.com/" className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:col-span-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Developer Credit Status</label>
                <select value={devCreditEnabled ? "true" : "false"} onChange={(e) => setDevCreditEnabled(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none cursor-pointer">
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Open Link in New Tab</label>
                <select value={devCreditOpenInNewTab ? "true" : "false"} onChange={(e) => setDevCreditOpenInNewTab(e.target.value === "true")} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus:outline-none cursor-pointer">
                  <option value="true">Yes, target _blank</option>
                  <option value="false">No, target _self</option>
                </select>
              </div>
            </div>
          </div>
        </div>

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
            <span>Publish Footer configurations</span>
          </button>
        </div>
      </div>

      {/* New Column Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-lg p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                Add Footer Column Block
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Column Heading</label>
                  <input type="text" value={colTitle} onChange={(e) => setColTitle(e.target.value)} placeholder="e.g. Products" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Block Type</label>
                  <select value={colType} onChange={(e) => setColType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
                    <option value="links">Links List</option>
                    <option value="text">Rich Text Paragraph</option>
                    <option value="categories">Dynamic Categories</option>
                    <option value="contact">Contact Details</option>
                  </select>
                </div>
              </div>

              {/* Text Column Fields */}
              {colType === "text" && (
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Paragraph Description</label>
                  <textarea rows={4} value={colContent} onChange={(e) => setColContent(e.target.value)} placeholder="Type details..." className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
                </div>
              )}

              {/* Link List builder */}
              {colType === "links" && (
                <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg space-y-4">
                  <h4 className="font-extrabold text-[10px] font-mono text-slate-400 uppercase tracking-wide border-b border-slate-150 pb-1">Column Links</h4>
                  
                  {colLinks.length > 0 && (
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                      {colLinks.map((lnk, lIdx) => (
                        <div key={lIdx} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded">
                          <div>
                            <span className="font-bold text-slate-800">{lnk.text}</span>
                            <span className="font-mono text-slate-400 text-[10px] ml-2">({lnk.href})</span>
                          </div>
                          <button type="button" onClick={() => removeColLink(lIdx)} className="text-slate-400 hover:text-red-650">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 items-end bg-white border border-slate-150 p-2 rounded">
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Link Text</label>
                        <input type="text" placeholder="e.g. Products" value={newLinkText} onChange={(e) => setNewLinkText(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1" />
                      </div>
                      <div>
                        <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Link URL</label>
                        <input type="text" placeholder="e.g. /products" value={newLinkHref} onChange={(e) => setNewLinkHref(e.target.value)} className="w-full border border-slate-200 rounded px-2 py-1 font-mono" />
                      </div>
                    </div>
                    <button type="button" onClick={addColLink} className="py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold uppercase tracking-wider text-[9px] cursor-pointer">Add Link</button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" onClick={handleSaveColumn} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm">Save Column</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
