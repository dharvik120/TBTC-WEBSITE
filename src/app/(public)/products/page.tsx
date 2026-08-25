export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Search, Filter, RotateCcw, Box, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import ProductCard from "@/components/ProductCard";
import SortSelector from "@/components/SortSelector";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    availability?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const settings = await getCompanySettings();
  const params = await searchParams;

  const q = params.q || "";
  const categorySlug = params.category || "";
  const brandSlug = params.brand || "";
  const availability = params.availability || "all";
  const sort = params.sort || "featured";

  // Fetch categories and brands for the filter sidebar
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { displayOrder: "asc" },
  });

  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  // Build Prisma query filters
  const whereClause: any = {
    isActive: true,
  };

  if (q.trim()) {
    whereClause.OR = [
      { name: { contains: q } },
      { modelNumber: { contains: q } },
      { sku: { contains: q } },
      { shortDescription: { contains: q } },
    ];
  }

  if (categorySlug) {
    whereClause.category = {
      OR: [
        { slug: categorySlug },
        { parent: { slug: categorySlug } } // include subcategories
      ]
    };
  }

  if (brandSlug) {
    whereClause.brand = { slug: brandSlug };
  }

  if (availability === "instock") {
    whereClause.isAvailable = true;
  }

  // Determine sorting logic
  let orderByClause: any = { displayOrder: "asc" };
  if (sort === "newest") {
    orderByClause = { createdAt: "desc" };
  } else if (sort === "name-asc") {
    orderByClause = { name: "asc" };
  } else if (sort === "featured") {
    orderByClause = [
      { isFeatured: "desc" },
      { displayOrder: "asc" }
    ];
  }

  // Fetch products
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: orderByClause,
  });

  // Active filter displays
  const activeCategory = categories.find(c => c.slug === categorySlug);
  const activeBrand = brands.find(b => b.slug === brandSlug);

  return (
    <div className="w-full py-8 lg:py-12 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono text-slate-400 mb-6 flex items-center gap-1.5 uppercase">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">Products</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 1. Filter Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            
            {/* Active Filters Summary */}
            {(categorySlug || brandSlug || q || availability !== "all") && (
              <div className="bg-slate-900 text-white rounded-md p-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-slate-400">ACTIVE FILTERS</span>
                  <Link href="/products" className="text-secondary hover:underline flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {q && <span className="bg-slate-800 px-2.5 py-1 rounded">Search: &quot;{q}&quot;</span>}
                  {activeCategory && <span className="bg-slate-800 px-2.5 py-1 rounded">Cat: {activeCategory.name}</span>}
                  {activeBrand && <span className="bg-slate-800 px-2.5 py-1 rounded">Brand: {activeBrand.name}</span>}
                  {availability !== "all" && <span className="bg-slate-800 px-2.5 py-1 rounded">In Stock Only</span>}
                </div>
              </div>
            )}

            {/* Filter Group: Search */}
            <div className="bg-white border border-slate-200 rounded-md p-4">
              <h3 className="font-bold text-slate-800 text-xs font-mono uppercase tracking-wider mb-3">Search Catalog</h3>
              <form action="/products" method="GET" className="relative">
                {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                {brandSlug && <input type="hidden" name="brand" value={brandSlug} />}
                {availability !== "all" && <input type="hidden" name="availability" value={availability} />}
                {sort !== "featured" && <input type="hidden" name="sort" value={sort} />}
                <input
                  type="text"
                  name="q"
                  placeholder="Model or keywords..."
                  defaultValue={q}
                  className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none"
                />
                <button type="submit" className="absolute right-2.5 top-2.5 text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Filter Group: Categories */}
            <div className="bg-white border border-slate-200 rounded-md p-4">
              <h3 className="font-bold text-slate-800 text-xs font-mono uppercase tracking-wider mb-3">Categories</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link 
                    href={{
                      pathname: "/products",
                      query: { ...Object.fromEntries(new URLSearchParams(Object.entries(params).filter(([k]) => k !== "category"))), category: undefined }
                    }}
                    className={`block py-1 hover:text-primary ${!categorySlug ? "font-bold text-primary" : "text-slate-600"}`}
                  >
                    All Categories
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={{
                        pathname: "/products",
                        query: { ...params, category: cat.slug }
                      }}
                      className={`block py-1 hover:text-primary truncate ${categorySlug === cat.slug ? "font-bold text-primary border-l-2 pl-1.5" : "text-slate-600"}`}
                      style={{ borderLeftColor: categorySlug === cat.slug ? "var(--secondary-color)" : "" }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter Group: Brands */}
            {brands.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-md p-4">
                <h3 className="font-bold text-slate-800 text-xs font-mono uppercase tracking-wider mb-3">Brands</h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link
                      href={{
                        pathname: "/products",
                        query: { ...Object.fromEntries(new URLSearchParams(Object.entries(params).filter(([k]) => k !== "brand"))), brand: undefined }
                      }}
                      className={`block py-1 hover:text-primary ${!brandSlug ? "font-bold text-primary" : "text-slate-600"}`}
                    >
                      All Brands
                    </Link>
                  </li>
                  {brands.map((b) => (
                    <li key={b.id}>
                      <Link
                        href={{
                          pathname: "/products",
                          query: { ...params, brand: b.slug }
                        }}
                        className={`block py-1 hover:text-primary truncate ${brandSlug === b.slug ? "font-bold text-primary border-l-2 pl-1.5" : "text-slate-600"}`}
                        style={{ borderLeftColor: brandSlug === b.slug ? "var(--secondary-color)" : "" }}
                      >
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Filter Group: Availability */}
            <div className="bg-white border border-slate-200 rounded-md p-4">
              <h3 className="font-bold text-slate-800 text-xs font-mono uppercase tracking-wider mb-3">Availability</h3>
              <div className="flex flex-col gap-2.5 text-xs text-slate-600">
                <Link
                  href={{
                    pathname: "/products",
                    query: { ...params, availability: "all" }
                  }}
                  className={`flex items-center gap-2 ${availability === "all" ? "font-bold text-primary" : ""}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border border-slate-350 flex items-center justify-center ${availability === "all" ? "bg-primary border-primary" : ""}`}>
                    {availability === "all" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>
                  <span>Show All</span>
                </Link>
                <Link
                  href={{
                    pathname: "/products",
                    query: { ...params, availability: "instock" }
                  }}
                  className={`flex items-center gap-2 ${availability === "instock" ? "font-bold text-primary" : ""}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border border-slate-350 flex items-center justify-center ${availability === "instock" ? "bg-primary border-primary" : ""}`}>
                    {availability === "instock" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </span>
                  <span>In Stock Only</span>
                </Link>
              </div>
            </div>

          </aside>

          {/* 2. Products List Panel */}
          <main className="flex-1">
            
            {/* Header controls: Search results count and Sorting */}
            <div className="bg-white border border-slate-200 rounded-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans">
              <div className="font-semibold text-slate-700">
                Found <span className="text-slate-900 font-extrabold">{products.length}</span> materials
              </div>
              
              <SortSelector currentSort={sort} />
            </div>

            {/* Products grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    whatsAppNumber={settings.whatsAppNumber}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-md py-16 px-4 text-center">
                <Box className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Matching Materials</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any products matching your active filters. Try resetting the criteria.
                </p>
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-1.5 px-4 py-2 border text-xs font-bold text-slate-700 border-slate-350 hover:bg-slate-50 rounded"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </Link>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
