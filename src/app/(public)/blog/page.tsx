export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishDate: "desc" },
  });

  return (
    <div className="w-full py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono text-slate-400 mb-6 flex items-center gap-1.5 uppercase">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">Blog & Resources</span>
        </nav>

        {/* Heading */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Industrial Blog & Technical Resources
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl font-sans">
            Read technical articles, product selection guides, electrical automation tips, and recent updates from Shree TBTC.
          </p>
        </div>

        {/* Grid list */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="group flex flex-col bg-white border border-slate-250 rounded-md overflow-hidden hover:shadow-md transition-shadow font-sans"
              >
                {b.featuredImageUrl && (
                  <div className="h-48 w-full relative overflow-hidden border-b border-slate-150 bg-slate-50">
                    <img 
                      src={b.featuredImageUrl} 
                      alt={b.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 font-bold mb-2">
                      {new Date(b.publishDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug line-clamp-2 group-hover:text-primary mb-3">
                      {b.title}
                    </h3>
                    {b.summary && (
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-6 font-sans">
                        {b.summary}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-bold text-primary flex items-center gap-1 mt-auto">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-md py-16 px-4 text-center font-sans">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No Articles Published</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              We are working on compiling technical guides and product catalog comparison checklists. Check back soon for our first posts.
            </p>
            <div className="mt-6">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 px-4 py-2 border text-xs font-bold text-white rounded cursor-pointer"
                style={{ backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }}
              >
                Browse Materials Catalog
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
