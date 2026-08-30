"use client";

import React, { useState, useTransition } from "react";
import { 
  Plus, Edit, Trash2, Loader2, X, Package, Save, Upload, 
  Search, Eye, Copy, ArrowLeft, Trash, FileText, CheckCircle2 
} from "lucide-react";
import { saveProduct, deleteProduct } from "@/app/actions/admin";
import { uploadFile } from "@/lib/upload";

interface Product {
  id: string;
  name: string;
  slug: string;
  modelNumber: string | null;
  sku: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  keyFeatures: string | null;
  technicalSpecs: string | null;
  applications: string | null;
  isFeatured: boolean;
  price: number | null;
  showPrice: boolean;
  isAvailable: boolean;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  displayOrder: number;
  categoryId: string;
  brandId: string | null;
  category: { name: string };
  brand: { name: string } | null;
  images: { imageUrl: string }[];
  documents: { name: string; fileUrl: string; docType: string }[];
}

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface ProductsClientProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}

export default function ProductsClient({ products: initialProducts, categories, brands }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [applications, setApplications] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [price, setPrice] = useState<number | "">("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  // Nested arrays states
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<{ name: string; fileUrl: string; docType: string }[]>([]);

  const openNew = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setModelNumber("");
    setSku("");
    setShortDescription("");
    setFullDescription("");
    setKeyFeatures("");
    setApplications("");
    setCategoryId(categories[0]?.id || "");
    setBrandId("");
    setIsFeatured(false);
    setShowPrice(false);
    setPrice("");
    setIsAvailable(true);
    setIsActive(true);
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setDisplayOrder(0);
    setSpecs([]);
    setImages([]);
    setDocuments([]);
    setEditorOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setModelNumber(p.modelNumber || "");
    setSku(p.sku || "");
    setShortDescription(p.shortDescription || "");
    setFullDescription(p.fullDescription || "");
    setKeyFeatures(p.keyFeatures || "");
    setApplications(p.applications || "");
    setCategoryId(p.categoryId);
    setBrandId(p.brandId || "");
    setIsFeatured(p.isFeatured);
    setShowPrice(p.showPrice);
    setPrice(p.price || "");
    setIsAvailable(p.isAvailable);
    setIsActive(p.isActive);
    setSeoTitle(p.seoTitle || "");
    setSeoDescription(p.seoDescription || "");
    setSeoKeywords(p.seoKeywords || "");
    setDisplayOrder(p.displayOrder);
    
    // Parse specs JSON
    let parsedSpecs: { key: string; value: string }[] = [];
    if (p.technicalSpecs) {
      try {
        parsedSpecs = Object.entries(JSON.parse(p.technicalSpecs)).map(([k, v]) => ({ key: k, value: String(v) }));
      } catch (e) {
        console.error("Specs parse error", e);
      }
    }
    setSpecs(parsedSpecs);
    setImages(p.images.map(img => img.imageUrl));
    setDocuments(p.documents);
    setEditorOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      const path = await uploadFile(formData);
      if (path) {
        setImages((prev) => [...prev, path]);
      }
    }
    setUploadingImage(false);
  };

  // Document Upload handler
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>, nameStr: string, typeStr: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", file);
    const path = await uploadFile(formData);
    setUploadingDoc(false);

    if (path) {
      setDocuments((prev) => [
        ...prev,
        { name: nameStr || file.name, fileUrl: path, docType: typeStr },
      ]);
    } else {
      alert("Failed to upload document.");
    }
  };

  // Specs Editor helpers
  const addSpecRow = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };
  const updateSpecRow = (idx: number, field: "key" | "value", val: string) => {
    setSpecs((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };
  const removeSpecRow = (idx: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save Product
  const handleSave = () => {
    if (!name || !slug || !categoryId) {
      alert("Name, Slug, and Category are required.");
      return;
    }

    // Compile Specs list to JSON object string
    const specsObject = Object.fromEntries(specs.filter(s => s.key.trim() !== "").map(s => [s.key, s.value]));
    const technicalSpecs = JSON.stringify(specsObject);

    startTransition(async () => {
      const res = await saveProduct(editingId, {
        name,
        slug,
        modelNumber,
        sku,
        shortDescription,
        fullDescription,
        keyFeatures,
        technicalSpecs,
        applications,
        categoryId,
        brandId: brandId || null,
        isFeatured,
        showPrice,
        price: price === "" ? null : Number(price),
        isAvailable,
        isActive,
        seoTitle,
        seoDescription,
        seoKeywords,
        displayOrder: Number(displayOrder),
        images,
        documents,
      });

      if (res.success) {
        alert("✅ SUCCESS: Product specifications saved successfully! Live database refreshed.");
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? All related inquiries and quote baskets logs containing this product will be affected.")) return;

    const res = await deleteProduct(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDuplicate = (p: Product) => {
    setEditingId(null);
    setName(`${p.name} (Copy)`);
    setSlug(`${p.slug}-copy`);
    setModelNumber(p.modelNumber ? `${p.modelNumber}-C` : "");
    setSku(p.sku ? `${p.sku}-C` : "");
    setShortDescription(p.shortDescription || "");
    setFullDescription(p.fullDescription || "");
    setKeyFeatures(p.keyFeatures || "");
    setApplications(p.applications || "");
    setCategoryId(p.categoryId);
    setBrandId(p.brandId || "");
    setIsFeatured(false);
    setShowPrice(p.showPrice);
    setPrice(p.price || "");
    setIsAvailable(p.isAvailable);
    setIsActive(p.isActive);
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setDisplayOrder(p.displayOrder);

    let parsedSpecs: { key: string; value: string }[] = [];
    if (p.technicalSpecs) {
      try {
        parsedSpecs = Object.entries(JSON.parse(p.technicalSpecs)).map(([k, v]) => ({ key: k, value: String(v) }));
      } catch (e) {}
    }
    setSpecs(parsedSpecs);
    setImages(p.images.map(img => img.imageUrl));
    setDocuments(p.documents);
    setEditorOpen(true);
  };

  // Filtration logic
  const filtered = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.modelNumber?.toLowerCase().includes(term) ||
      p.category.name.toLowerCase().includes(term) ||
      p.brand?.name.toLowerCase().includes(term)
    );
  });

  if (editorOpen) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8 font-sans space-y-6 max-w-5xl mx-auto shadow-sm">
        
        {/* Editor Header */}
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
                {editingId ? "Edit Product Specifications" : "Create New Product Entry"}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Define core specs, model numbers, key features, and file attachments.</p>
            </div>
          </div>
        </div>

        {/* Form Body Layout */}
        <div className="space-y-6 text-xs">
          
          {/* Card 1: Identification */}
          <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-md space-y-4">
            <h3 className="font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
              1. Product Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Thermal Overload Relay"
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Slug (URL Suffix) *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Model Number (M/N)</label>
                <input
                  type="text"
                  value={modelNumber}
                  onChange={(e) => setModelNumber(e.target.value)}
                  placeholder="e.g. STBT-OR-22"
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SW-OR-22"
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category Mapping *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Brand Mapping</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="">[Generic / No Brand]</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Pricing & Availability */}
          <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-md space-y-4">
            <h3 className="font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
              2. Pricing, Inventory & Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Display Mode</label>
                <select
                  value={showPrice ? "true" : "false"}
                  onChange={(e) => setShowPrice(e.target.value === "true")}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="false">Request Quote Only</option>
                  <option value="true">Show Price</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estimated Price (INR)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  disabled={!showPrice}
                  placeholder="₹ 0.00"
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none font-mono disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Availability</label>
                <select
                  value={isAvailable ? "true" : "false"}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Listing Status</label>
                <select
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="true">Active & Visible</option>
                  <option value="false">Disabled / Hidden</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none font-mono"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4.5 h-4.5 text-primary border-slate-300 rounded cursor-pointer"
                />
                <label htmlFor="featured-check" className="font-bold text-slate-700 cursor-pointer select-none">
                  Mark as Homepage Featured
                </label>
              </div>
            </div>
          </div>

          {/* Card 3: Detailed Description */}
          <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-md space-y-4">
            <h3 className="font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
              3. Description Literature
            </h3>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Short Description (Displays in card summaries)</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none resize-y"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Description (Overview tab)</label>
              <textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                rows={5}
                className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none resize-y"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Key Features (Line separated bullets)</label>
                <textarea
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  placeholder="- Voltage rating: 240V&#10;- Adjustable trip class"
                  rows={4}
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none resize-y"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Applications (Overview paragraph/bullets)</label>
                <textarea
                  value={applications}
                  onChange={(e) => setApplications(e.target.value)}
                  placeholder="MCC panels, ventilation grids..."
                  rows={4}
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none resize-y"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Specs Editor */}
          <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
              <h3 className="font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                4. Technical Specifications Table
              </h3>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            {specs.length > 0 ? (
              <div className="space-y-2">
                {specs.map((row, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Parameter (e.g. Voltage)"
                      value={row.key}
                      onChange={(e) => updateSpecRow(idx, "key", e.target.value)}
                      className="flex-1 border border-slate-200 rounded px-3 py-1.5 bg-white focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 240V AC)"
                      value={row.value}
                      onChange={(e) => updateSpecRow(idx, "value", e.target.value)}
                      className="flex-1 border border-slate-200 rounded px-3 py-1.5 bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecRow(idx)}
                      className="p-2 text-slate-400 hover:text-red-650 transition-colors cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs font-mono">
                NO SPECIFICATIONS DECLARED. CLICK ADD ROW TO POPULATE.
              </div>
            )}
          </div>

          {/* Card 5: Multiple image uploads */}
          <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-md space-y-4">
            <h3 className="font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
              5. Product Images & Gallery
            </h3>
            <div className="flex items-center gap-4 bg-white border border-slate-200 rounded p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                id="product-images-upload"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="product-images-upload"
                className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-250 bg-slate-50 rounded text-xs font-bold text-slate-650 hover:bg-slate-100 cursor-pointer shadow-sm shrink-0"
              >
                {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4.5 h-4.5" />}
                <span>Upload Product Images</span>
              </label>
              <p className="text-[10px] text-slate-450 truncate">Select one or more images. The first image becomes the main display cover.</p>
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-2">
                {images.map((url, idx) => (
                  <div key={idx} className="w-24 h-24 bg-white border border-slate-200 rounded p-1.5 relative overflow-hidden flex items-center justify-center group shadow-sm">
                    <img src={url} alt={`Preview ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow focus:outline-none"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-slate-900/90 text-white text-[7px] font-bold px-1 rounded font-mono uppercase tracking-wider">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 6: Technical documents upload */}
          <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-md space-y-4">
            <h3 className="font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
              6. Literature Attachments (Brochures & Manuals)
            </h3>
            
            {/* Adding row inline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white border border-slate-200 rounded p-4 items-center">
              <div>
                <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Attachment Title</label>
                <input
                  type="text"
                  placeholder="e.g. 11KV Insulator Datasheet"
                  id="new-doc-name"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-slate-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-450 uppercase mb-0.5">Document Classification</label>
                <select
                  id="new-doc-type"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="DATASHEET">Datasheet</option>
                  <option value="CATALOG">Catalog / Brochure</option>
                  <option value="MANUAL">User Manual Guide</option>
                </select>
              </div>
              <div className="pt-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  id="doc-attachment-upload"
                  onChange={(e) => {
                    const nameInput = document.getElementById("new-doc-name") as HTMLInputElement;
                    const typeInput = document.getElementById("new-doc-type") as HTMLSelectElement;
                    handleDocUpload(e, nameInput.value, typeInput.value);
                    nameInput.value = "";
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="doc-attachment-upload"
                  className="flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-250 bg-slate-50 rounded font-bold text-slate-650 hover:bg-slate-100 cursor-pointer shadow-sm w-full"
                >
                  {uploadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>Choose & Upload File</span>
                </label>
              </div>
            </div>

            {documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {documents.map((doc, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded p-3 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-red-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 truncate block">{doc.name}</span>
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">{doc.docType}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDocuments((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-red-650 transition-colors focus:outline-none"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-slate-400 text-xs font-mono">
                NO LITERATURE ATTACHMENTS BOUND
              </div>
            )}
          </div>

          {/* Card 7: SEO Tags */}
          <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-md space-y-4">
            <h3 className="font-bold text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
              7. Product SEO Override
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SEO Title Override</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="If empty, defaults to Product Name"
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SEO Meta Keywords</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="Comma separated: relay, thermal, motor protection"
                  className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SEO Meta Description Override</label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="If empty, defaults to Short Description"
                rows={2}
                className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:outline-none resize-y"
              />
            </div>
          </div>

        </div>

        {/* Save & Cancel Footer Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-250">
          <button
            type="button"
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
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Product Specifications</span>
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search products, models, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-1.5 py-2 px-4 text-xs font-bold text-white rounded shadow-sm focus:outline-none cursor-pointer w-full sm:w-auto justify-center"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <Plus className="w-4 h-4" />
          <span>New Product Entry</span>
        </button>

      </div>

      {/* Products table */}
      <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 font-mono uppercase">
                  <th className="py-3 px-4 font-bold">Image / Title</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Brand</th>
                  <th className="py-3 px-4 font-bold">Pricing info</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    
                    {/* Title */}
                    <td className="py-4.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded flex items-center justify-center p-1 shrink-0">
                          {p.images[0]?.imageUrl ? (
                            <img src={p.images[0].imageUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-350" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate max-w-[200px]">{p.name}</span>
                          {p.modelNumber && (
                            <span className="text-[10px] font-mono text-slate-400 font-bold block mt-0.5">M/N: {p.modelNumber}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4.5 px-4 text-slate-500 font-medium">
                      {p.category.name}
                    </td>

                    {/* Brand */}
                    <td className="py-4.5 px-4 text-slate-500 font-mono font-bold">
                      {p.brand?.name || "[Generic]"}
                    </td>

                    {/* Pricing */}
                    <td className="py-4.5 px-4 font-mono font-bold">
                      {p.showPrice && p.price ? `₹${p.price.toLocaleString("en-IN")}` : "Quote Only"}
                    </td>

                    {/* Actions */}
                    <td className="py-4.5 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <span className={`px-2 py-0.5 rounded-sm font-mono text-[8px] font-bold uppercase shrink-0 border h-fit self-center mr-2 ${
                          p.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                          {p.isActive ? "Active" : "Disabled"}
                        </span>
                        
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                          title="Duplicate Product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-650"
                          title="Edit Specs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 bg-slate-50 hover:bg-red-50 hover:border-red-200 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Product"
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
            NO PRODUCTS LISTED OR FOUND
          </div>
        )}
      </div>

    </div>
  );
}
