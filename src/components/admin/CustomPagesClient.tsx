"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Loader2, CheckCircle2, FileText } from "lucide-react";
import { saveCustomPage, deleteCustomPage } from "@/app/actions/admin";

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  isActive: boolean;
}

interface CustomPagesClientProps {
  initialPages: CustomPage[];
}

export default function CustomPagesClient({ initialPages }: CustomPagesClientProps) {
  const [pages, setPages] = useState<CustomPage[]>(initialPages);
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const openNew = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setSeoTitle("");
    setSeoDescription("");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (page: CustomPage) => {
    setEditingId(page.id);
    setTitle(page.title);
    setSlug(page.slug);
    setContent(page.content);
    setSeoTitle(page.seoTitle || "");
    setSeoDescription(page.seoDescription || "");
    setIsActive(page.isActive);
    setIsModalOpen(true);
  };

  const handleSavePage = () => {
    if (!title || !slug || !content) {
      alert("Title, Slug, and content body are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveCustomPage(editingId, {
        title,
        slug,
        content,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        isActive
      });

      if (res.success) {
        alert("Custom Page published successfully!");
        window.location.reload();
      }
    });
  };

  const handleDeletePage = (id: string) => {
    if (confirm("Are you sure you want to delete this custom page?")) {
      startTransition(async () => {
        const res = await deleteCustomPage(id);
        if (res.success) {
          setPages((prev) => prev.filter((p) => p.id !== id));
        }
      });
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Custom Page details saved successfully!</span>
        </div>
      )}

      {/* Pages list */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Dynamic Pages CMS</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Publish custom sub-pages (e.g., terms, privacy policy, custom certifications profiles).</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Page</span>
          </button>
        </div>

        {pages.length > 0 ? (
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-150">
            {pages.map((p) => (
              <div 
                key={p.id} 
                className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                  p.isActive ? "bg-white" : "bg-slate-50 opacity-60"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">{p.title}</span>
                    {!p.isActive && (
                      <span className="bg-red-50 text-red-650 text-[8px] font-mono font-bold uppercase px-1 rounded-sm">Offline</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Public link: /page/{p.slug}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-650"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeletePage(p.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No custom pages created.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-3xl p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Custom Page" : "Create Custom Page"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Page Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Terms of Service" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Link URL Slug</label>
                  <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. terms-of-service" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Page Markdown / HTML content body</label>
                <textarea rows={10} required value={content} onChange={(e) => setContent(e.target.value)} placeholder="Supports markdown formats..." className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono text-[11px] leading-relaxed" />
              </div>

              {/* SEO Parameters */}
              <div className="border border-slate-150 bg-slate-50/50 p-4 rounded-lg space-y-4">
                <h4 className="font-extrabold text-[10px] font-mono text-slate-450 uppercase border-b border-slate-150 pb-1">Page SEO Meta Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Meta Title override</label>
                    <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Meta Description override</label>
                    <input type="text" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                <div>
                  <label className="flex items-center gap-2 font-bold text-slate-500 uppercase select-none cursor-pointer">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-primary border-slate-300 cursor-pointer" />
                    <span>Publish live instantly (Active)</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer">Cancel</button>
                  <button type="button" onClick={handleSavePage} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm">Publish Page</button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
