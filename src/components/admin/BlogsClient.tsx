"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, X, PenTool, Save, Upload, ArrowLeft, BookOpen } from "lucide-react";
import { saveBlog, deleteBlog, uploadFile } from "@/app/actions/admin";

interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featuredImageUrl: string | null;
  author: string | null;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  publishDate: Date;
}

interface BlogsClientProps {
  blogs: Blog[];
}

export default function BlogsClient({ blogs: initialBlogs }: BlogsClientProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null);
  const [author, setAuthor] = useState("Admin");
  const [status, setStatus] = useState("DRAFT");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [publishDateStr, setPublishDateStr] = useState("");

  const openNew = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setSummary("");
    setContent("");
    setFeaturedImageUrl(null);
    setAuthor("Admin");
    setStatus("DRAFT");
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setPublishDateStr(new Date().toISOString().split("T")[0]);
    setEditorOpen(true);
  };

  const openEdit = (b: Blog) => {
    setEditingId(b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setSummary(b.summary || "");
    setContent(b.content);
    setFeaturedImageUrl(b.featuredImageUrl);
    setAuthor(b.author || "Admin");
    setStatus(b.status);
    setSeoTitle(b.seoTitle || "");
    setSeoDescription(b.seoDescription || "");
    setSeoKeywords(b.seoKeywords || "");
    setPublishDateStr(new Date(b.publishDate).toISOString().split("T")[0]);
    setEditorOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const path = await uploadFile(formData);
    setUploading(false);

    if (path) {
      setFeaturedImageUrl(path);
    } else {
      alert("Featured image upload failed.");
    }
  };

  const handleSave = () => {
    if (!title || !slug || !content) {
      alert("Title, Slug, and Content are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveBlog(editingId, {
        title,
        slug,
        summary,
        content,
        featuredImageUrl,
        author,
        status,
        seoTitle,
        seoDescription,
        seoKeywords,
        publishDate: new Date(publishDateStr),
      });

      if (res.success) {
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const res = await deleteBlog(id);
    if (res.success) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  if (editorOpen) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8 font-sans space-y-6 max-w-4xl mx-auto shadow-sm">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setEditorOpen(false)}
              className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight font-mono uppercase">
                {editingId ? "Edit Resource Entry" : "Create New Resource Entry"}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Author technical bulletins, news updates, or product selectors guides.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-xs font-sans">
          
          {/* Featured Image */}
          <div>
            <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Featured Banner Image</label>
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded p-3">
              <div className="w-20 h-16 bg-white border border-slate-100 rounded flex items-center justify-center p-1 shrink-0 overflow-hidden">
                {featuredImageUrl ? (
                  <img src={featuredImageUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <PenTool className="w-6 h-6 text-slate-350" />
                )}
              </div>
              <div>
                <input type="file" accept="image/*" id="blog-image-upload" onChange={handleImageUpload} className="hidden" />
                <label htmlFor="blog-image-upload" className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 bg-white rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer w-fit">
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Upload Image</span>
                </label>
              </div>
            </div>
          </div>

          {/* Title and Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Article Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Author, Status, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Publish Date</label>
              <input
                type="date"
                value={publishDateStr}
                onChange={(e) => setPublishDateStr(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Short Summary (Used in card listing)</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-none resize-y"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Content Body (Accepts Markdown / text spacing)</label>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article content here..."
              className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-none resize-y"
            />
          </div>

          {/* SEO Override */}
          <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-md space-y-4 pt-2">
            <h3 className="font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1">
              SEO Parameters (Optional overrides)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SEO Title Override</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SEO Meta Keywords</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SEO Description Override</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none resize-y"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-250">
            <button
              onClick={() => setEditorOpen(false)}
              className="px-5 py-2.5 border border-slate-250 bg-white rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold disabled:opacity-50 cursor-pointer shadow-sm font-mono uppercase"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Article</span>
            </button>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
        <span className="text-xs font-mono text-slate-500">
          Blogs and technical resources appear on the resource section.
        </span>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-white rounded shadow-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Blogs List */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
        {blogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 font-mono uppercase">
                  <th className="py-3 px-4 font-bold">Image / Title</th>
                  <th className="py-3 px-4 font-bold">Author</th>
                  <th className="py-3 px-4 font-bold">Publish Date</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    
                    <td className="py-4 px-4 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-slate-50 border border-slate-150 rounded flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                          {b.featuredImageUrl ? (
                            <img src={b.featuredImageUrl} alt={b.title} className="w-full h-full object-cover" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-slate-350" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 truncate block max-w-[240px]">{b.title}</span>
                          <span className="text-[9px] font-mono text-slate-400 block mt-0.5">slug: {b.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-650 font-medium">
                      {b.author || "Admin"}
                    </td>

                    <td className="py-4 px-4 text-slate-400 font-mono">
                      {new Date(b.publishDate).toLocaleDateString("en-IN")}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-sm font-mono text-[8px] font-bold uppercase shrink-0 border ${
                        b.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(b)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 bg-slate-50 hover:bg-red-50 hover:border-red-200 rounded text-slate-450 hover:text-red-650 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center text-slate-400 text-xs font-mono">
            NO ARTICLES RECORDED
          </div>
        )}
      </div>

    </div>
  );
}
