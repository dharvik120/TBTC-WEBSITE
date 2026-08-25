export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Download, ShieldCheck, CheckCircle2, ChevronRight, Tag } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductInquiryForm from "@/components/ProductInquiryForm";
import ProductDetailsCartActions from "@/components/ProductDetailsCartActions";
import ProductCard from "@/components/ProductCard";

interface ProductPageProps {
  params: Promise<{
    "product-slug": string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams["product-slug"];

  const settings = await getCompanySettings();
  const fields = await prisma.formField.findMany({
    where: { isActive: true, formType: "PRODUCT" },
    orderBy: { displayOrder: "asc" }
  });

  // Fetch unique product
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
      documents: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Parse specifications
  let specs: Record<string, string> = {};
  if (product.technicalSpecs) {
    try {
      specs = JSON.parse(product.technicalSpecs);
    } catch (e) {
      console.error("Failed to parse specs:", e);
    }
  }

  // Fetch related products (same category)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id },
    },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
    take: 3,
  });

  const mainImage = product.images[0]?.imageUrl || null;

  return (
    <div className="w-full py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono text-slate-400 mb-8 flex items-center gap-1.5 uppercase">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-slate-600">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/products/${product.category.slug}`} className="hover:text-slate-600">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 font-bold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Brief Summary Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-md p-4 lg:p-6">
            <ProductImageGallery images={product.images} name={product.name} />
          </div>

          {/* Right Column: Spec Summary & Pricing */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-md p-6 lg:p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.brand && (
                  <span className="bg-slate-900 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono">
                    {product.brand.name}
                  </span>
                )}
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono">
                  {product.category.name}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-1">
                {product.name}
              </h1>

              {product.modelNumber && (
                <div className="text-sm font-mono font-bold text-slate-500 mb-6 uppercase">
                  Model No: <span className="text-slate-800">{product.modelNumber}</span>
                </div>
              )}

              {/* Price Banner */}
              <div className="border-y border-slate-150 py-4 mb-6">
                {product.showPrice && product.price ? (
                  <div>
                    <span className="text-xs text-slate-400 font-mono font-bold block mb-1">ESTIMATED PRICE</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-500 font-sans">(Excl. GST & Shipping)</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-slate-400 font-mono font-bold block mb-0.5">PRICING</span>
                    <span className="text-lg font-bold text-slate-600 uppercase tracking-wide">
                      Request Quotation Only
                    </span>
                  </div>
                )}
              </div>

              {product.shortDescription && (
                <p className="text-slate-650 text-sm leading-relaxed mb-6 font-sans">
                  {product.shortDescription}
                </p>
              )}

              {/* Quick Specs bullets */}
              {Object.keys(specs).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-slate-50 p-4 border border-slate-200/50 rounded">
                  {Object.entries(specs).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="text-xs flex gap-2">
                      <span className="text-slate-400 font-medium">{key}:</span>
                      <span className="text-slate-800 font-bold truncate">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart & WhatsApp buttons */}
            <ProductDetailsCartActions
              product={{
                id: product.id,
                name: product.name,
                modelNumber: product.modelNumber,
                categoryName: product.category.name,
                imageUrl: mainImage,
              }}
              whatsAppNumber={settings.whatsAppNumber}
            />
          </div>

        </div>

        {/* Detailed Sections Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Main specifications / detail panel */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Full Description */}
            {product.fullDescription && (
              <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8">
                <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4 font-mono text-xs uppercase tracking-wider">
                  Product Overview
                </h2>
                <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-line font-sans">
                  {product.fullDescription}
                </p>
              </div>
            )}

            {/* Technical Specifications Table */}
            {Object.keys(specs).length > 0 && (
              <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8">
                <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4 font-mono text-xs uppercase tracking-wider">
                  Technical Specifications
                </h2>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-mono border-b border-slate-200">
                        <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Parameter</th>
                        <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 font-sans">
                      {Object.entries(specs).map(([key, val]) => (
                        <tr key={key} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-medium text-slate-500 bg-slate-50/30 w-1/3 border-r border-slate-150">
                            {key}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Key Features (Markdown/Line-separated) */}
            {product.keyFeatures && (
              <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8">
                <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4 font-mono text-xs uppercase tracking-wider">
                  Key Features & Advantages
                </h2>
                <ul className="space-y-2.5 text-xs text-slate-650 font-sans">
                  {product.keyFeatures.split("\n").map((feature, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-primary shrink-0 mt-0.5">•</span>
                      <span>{feature.replace(/^[-\*\+]\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Applications */}
            {product.applications && (
              <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8">
                <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4 font-mono text-xs uppercase tracking-wider">
                  Primary Applications
                </h2>
                <p className="text-slate-650 text-sm leading-relaxed whitespace-pre-line font-sans">
                  {product.applications}
                </p>
              </div>
            )}

            {/* Downloads & Technical Attachments */}
            {product.documents && product.documents.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-md p-6 lg:p-8">
                <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4 font-mono text-xs uppercase tracking-wider">
                  Datasheets & Downloads
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 border border-slate-200 rounded-md hover:bg-slate-50 hover:border-slate-350 transition-all font-sans"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5.5 h-5.5 text-red-500 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block line-clamp-1">{doc.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{doc.docType}</span>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <ProductInquiryForm
              productId={product.id}
              productName={product.name}
              modelNumber={product.modelNumber}
              fields={fields}
            />

            {/* Quality Standard Card */}
            <div className="bg-slate-900 text-white rounded-md p-5 border border-slate-800 text-xs flex gap-3.5 items-start">
              <ShieldCheck className="w-8 h-8 text-primary shrink-0" style={{ color: "var(--secondary-color)" }} />
              <div>
                <p className="font-bold mb-1">100% Genuine Industrial Product</p>
                <p className="text-slate-400 leading-relaxed font-sans">
                  We verify standards and guarantee authenticity for all products supplied by Shree TBTC.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-slate-200 pt-12">
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 mb-8 tracking-tight">
              Related Materials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  whatsAppNumber={settings.whatsAppNumber}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
