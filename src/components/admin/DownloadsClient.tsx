"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Download, FileText, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { saveDownload, deleteDownload } from "@/app/actions/admin";
import { uploadFile } from "@/lib/upload";

interface DownloadItem {
  id: string;
  title: string;
  fileUrl: string;
  category: string | null;
  description: string | null;
  coverImageUrl: string | null;
  brandName: string | null;
  downloadAccess: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

interface DownloadsClientProps {
  initialDownloads: DownloadItem[];
}

export default function DownloadsClient({ initialDownloads }: DownloadsClientProps) {
  const [downloads, setDownloads] = useState<DownloadItem[]>(initialDownloads.sort((a, b) => a.displayOrder - b.displayOrder));
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [category, setCategory] = useState("Full Catalogues");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [downloadAccess, setDownloadAccess] = useState("DIRECT"); // DIRECT, INQUIRY_REQUIRED
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "pdf") setUploadingPdf(true);
    else setUploadingCover(true);

    const formData = new FormData();
    formData.append("file", file);
    const path = await uploadFile(formData);

    if (type === "pdf") {
      setUploadingPdf(false);
      if (path) setFileUrl(path);
    } else {
      setUploadingCover(false);
      if (path) setCoverImageUrl(path);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setTitle("");
    setFileUrl("");
    setCategory("Full Catalogues");
    setDescription("");
    setCoverImageUrl("");
    setBrandName("");
    setDownloadAccess("DIRECT");
    setDisplayOrder(downloads.length + 1);
    setIsActive(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEdit = (d: DownloadItem) => {
    setEditingId(d.id);
    setTitle(d.title);
    setFileUrl(d.fileUrl);
    setCategory(d.category || "Full Catalogues");
    setDescription(d.description || "");
    setCoverImageUrl(d.coverImageUrl || "");
    setBrandName(d.brandName || "");
    setDownloadAccess(d.downloadAccess || "DIRECT");
    setDisplayOrder(d.displayOrder);
    setIsActive(d.isActive);
    setIsFeatured(d.isFeatured);
    setIsModalOpen(true);
  };

  const handleSaveDownload = () => {
    if (!title || !fileUrl) {
      alert("Title and Literature PDF file are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveDownload(editingId, {
        title,
        fileUrl,
        category,
        description: description || null,
        coverImageUrl: coverImageUrl || null,
        brandName: brandName || null,
        downloadAccess,
        displayOrder,
        isActive,
        isFeatured
      });

      if (res.success) {
        alert("✅ SUCCESS: Literature item saved successfully!");
        window.location.reload();
      }
    });
  };

  const handleDeleteDownload = (id: string) => {
    if (confirm("Are you sure you want to delete this catalogue download?")) {
      startTransition(async () => {
        const res = await deleteDownload(id);
        if (res.success) {
          setDownloads((prev) => prev.filter((d) => d.id !== id));
        }
      });
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Catalogues inventory details updated successfully!</span>
        </div>
      )}

      {/* Downloads list */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-400" />
              <span>Catalogues & Literature Center</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Manage PDF specifications sheets, manuals, certificates, and full booklets downloads.</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Literature</span>
          </button>
        </div>

        {downloads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {downloads.map((d) => (
              <div 
                key={d.id} 
                className={`border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col justify-between ${
                  d.isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                <div>
                  <div className="h-32 bg-slate-100 relative overflow-hidden border-b border-slate-150 flex items-center justify-center p-2">
                    {d.coverImageUrl ? (
                      <img src={d.coverImageUrl} alt={d.title} className="max-h-full max-w-full object-contain shadow-sm" />
                    ) : (
                      <FileText className="w-8 h-8 text-slate-350" />
                    )}
                    {d.isFeatured && (
                      <span className="absolute top-2 right-2 bg-amber-500 text-white text-[8px] font-bold font-mono px-1 rounded-sm uppercase tracking-wide">Featured</span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="bg-slate-200 text-slate-700 text-[8px] font-bold font-mono px-1 rounded-sm uppercase">{d.category || "General"}</span>
                      <span className="text-[8px] font-bold font-mono text-slate-450 uppercase">{d.downloadAccess === "DIRECT" ? "Direct Access" : "Inquiry Needed"}</span>
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-xs truncate">{d.title}</h3>
                    <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">{d.description || "No description provided."}</p>
                  </div>
                </div>

                <div className="p-3.5 pt-0 flex justify-end gap-1 border-t border-slate-150 pt-2.5">
                  <button type="button" onClick={() => openEdit(d)} className="p-1 hover:bg-slate-200 text-slate-650 rounded">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDeleteDownload(d.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No brochures or specifications booklets uploaded.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-lg p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Literature Detail" : "Upload Literature"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Literature Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Switchgear Catalog 2026" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Category Classification</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
                    <option value="Full Catalogues">Full Catalogues</option>
                    <option value="Technical Datasheets">Technical Datasheets</option>
                    <option value="Instruction Manuals">Instruction Manuals</option>
                    <option value="Quality Certificates">Quality Certificates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Short Description</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Provide short details..." className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none leading-relaxed" />
              </div>

              {/* PDF upload */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Literature File (PDF or Document)</label>
                <div className="flex gap-2">
                  <input type="text" required value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="Upload file or enter URL..." className="flex-1 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
                  <div>
                    <input type="file" accept=".pdf,.doc,.docx" id="brochure-pdf-upload" className="hidden" onChange={(e) => handleFileUpload(e, "pdf")} />
                    <label htmlFor="brochure-pdf-upload" className="flex items-center justify-center p-2.5 border border-slate-250 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer">
                      {uploadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </label>
                  </div>
                </div>
              </div>

              {/* Cover image upload */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Cover Image (Optional)</label>
                <div className="flex gap-2">
                  <input type="text" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="Upload cover image URL..." className="flex-1 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
                  <div>
                    <input type="file" accept="image/*" id="brochure-cover-upload" className="hidden" onChange={(e) => handleFileUpload(e, "cover")} />
                    <label htmlFor="brochure-cover-upload" className="flex items-center justify-center p-2.5 border border-slate-250 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer">
                      {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Access Control</label>
                  <select value={downloadAccess} onChange={(e) => setDownloadAccess(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
                    <option value="DIRECT">Direct PDF Download</option>
                    <option value="INQUIRY_REQUIRED">RFQ / Inquiry details required first</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Display Order</label>
                  <input type="number" required value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded px-2.5 py-1 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 font-bold text-slate-500 uppercase select-none cursor-pointer">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded text-primary border-slate-300 cursor-pointer" />
                    <span>Feature on downloads page</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold text-slate-500 uppercase select-none cursor-pointer">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-primary border-slate-300 cursor-pointer" />
                    <span>Online / Active</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer font-mono uppercase tracking-wider">Cancel</button>
                  <button type="button" onClick={handleSaveDownload} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm font-mono uppercase tracking-wider">Publish Catalog</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
