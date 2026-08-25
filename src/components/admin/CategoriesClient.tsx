"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Loader2, X, Folder, ChevronRight, Save } from "lucide-react";
import { saveCategory, deleteCategory } from "@/app/actions/admin";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  parentId: string | null;
}

interface CategoriesClientProps {
  categories: Category[];
}

export default function CategoriesClient({ categories: initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [parentId, setParentId] = useState<string | null>(null);

  const openNew = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setDisplayOrder(0);
    setIsActive(true);
    setParentId(null);
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDisplayOrder(cat.displayOrder);
    setIsActive(cat.isActive);
    setParentId(cat.parentId);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      // Auto generate slug
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleSave = () => {
    if (!name || !slug) {
      alert("Name and Slug are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveCategory(editingId, {
        name,
        slug,
        description,
        imageUrl: null,
        displayOrder: Number(displayOrder),
        isActive,
        parentId,
      });

      if (res.success) {
        // Simple reload to fetch updated relations cleanly
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All nested subcategories and products will be affected.")) return;

    const res = await deleteCategory(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Build Hierarchical Lists
  const rootCategories = categories.filter((c) => !c.parentId);
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
        <span className="text-xs font-mono text-slate-500">
          Double-click or click Edit on any category to configure.
        </span>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-white rounded shadow-sm focus:outline-none cursor-pointer"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories tree grid */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm divide-y divide-slate-150">
        {rootCategories.length > 0 ? (
          rootCategories.map((root) => {
            const subs = getSubcategories(root.id);
            return (
              <div key={root.id} className="p-4 space-y-3">
                <div className="flex justify-between items-center bg-slate-50 border border-slate-200/80 p-3 rounded-md">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Folder className="w-5 h-5 text-slate-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-extrabold text-slate-800 text-sm">{root.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">slug: {root.slug} • Order: {root.displayOrder}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold uppercase shrink-0 border h-fit self-center ${
                      root.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {root.isActive ? "Active" : "Disabled"}
                    </span>
                    <button
                      onClick={() => openEdit(root)}
                      className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(root.id)}
                      className="p-1 bg-white hover:bg-red-50 hover:border-red-200 rounded text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subcategories items */}
                {subs.length > 0 && (
                  <div className="pl-8 space-y-2 border-l border-slate-200 border-dashed ml-5">
                    {subs.map((sub) => (
                      <div key={sub.id} className="flex justify-between items-center bg-white border border-slate-150 p-2.5 rounded-md hover:bg-slate-50/50">
                        <div className="flex items-center gap-2 min-w-0">
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-750 text-xs">{sub.name}</span>
                            <span className="text-[9px] font-mono text-slate-400 block">slug: {sub.slug}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded-sm font-mono text-[8px] font-bold uppercase shrink-0 border h-fit self-center ${
                            sub.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}>
                            {sub.isActive ? "Active" : "Disabled"}
                          </span>
                          <button
                            onClick={() => openEdit(sub)}
                            className="p-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                            title="Edit Subcategory"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="p-0.5 bg-white hover:bg-red-50 hover:border-red-200 rounded text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Subcategory"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center text-slate-400 text-xs font-mono">
            NO CATEGORIES REGISTERED
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Category" : "New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {/* Parent category */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Parent Category (Leave empty for root)
                </label>
                <select
                  value={parentId || ""}
                  onChange={(e) => setParentId(e.target.value || null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="">[None - Root Category]</option>
                  {categories.filter(c => !c.parentId && c.id !== editingId).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Electrical Switchgear"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none bg-slate-50 focus:bg-white"
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
                  placeholder="e.g. electrical-switchgear"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide brief details about this category..."
                  className="w-full border border-slate-200 rounded px-2.5 py-2 focus:outline-none bg-slate-50 focus:bg-white resize-y"
                />
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  />
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
                  className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50 focus:outline-none cursor-pointer"
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
                  <span>Save Category</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
