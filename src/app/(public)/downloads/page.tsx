export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Download, FileText, FileSpreadsheet, Layers, Info } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function DownloadsPage() {
  // Fetch active general downloads
  const downloads = await prisma.download.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="w-full py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono text-slate-400 mb-6 flex items-center gap-1.5 uppercase">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">Catalogues & Downloads</span>
        </nav>

        {/* Heading */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Technical Resources & Catalogues
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl font-sans">
            Access our general product literature, technical guides, certificates, and full catalogues.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-slate-100 border border-slate-200 text-slate-700 rounded-md p-4 mb-10 flex gap-3 text-xs leading-relaxed font-sans">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5">Looking for product-specific datasheets?</p>
            <p className="text-slate-500">
              Detailed specifications, user manuals, and certificates for individual items (like relays, flanges, and insulators) are available directly on their respective product details pages. Browse the <Link href="/products" className="text-primary underline font-bold">Products Catalog</Link> to find specific sheets.
            </p>
          </div>
        </div>

        {/* Downloads list */}
        {downloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloads.map((doc) => {
              const isExcel = doc.fileUrl.endsWith(".xlsx") || doc.fileUrl.endsWith(".xls");
              const isPdf = doc.fileUrl.endsWith(".pdf");

              return (
                <div 
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-md p-5 flex items-center justify-between hover:border-slate-350 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0 font-sans">
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-500 shrink-0">
                      {isPdf ? (
                        <FileText className="w-6 h-6 text-red-500" />
                      ) : isExcel ? (
                        <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Layers className="w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 text-sm block truncate">{doc.title}</span>
                      {doc.category && (
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mt-0.5">
                          {doc.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={doc.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-650 hover:text-slate-900 transition-colors focus:outline-none cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-md py-16 px-4 text-center font-sans">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 mb-1">General Literature Coming Soon</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We are currently updating our digital archive with general company brochures and certificate lists. In the meantime, you can download datasheets directly from individual product pages.
            </p>
            <div className="mt-6">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 px-4 py-2 border text-xs font-bold text-white rounded cursor-pointer"
                style={{ backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }}
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
