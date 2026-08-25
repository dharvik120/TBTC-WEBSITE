import React from "react";
import prisma from "@/lib/prisma";
import ProductsClient from "@/components/admin/ProductsClient";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
      documents: true,
    },
    orderBy: { displayOrder: "asc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Product Catalog Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Build and manage the low/medium voltage switchgear specs, steel profiles, greases, filters, and insulators.
          </p>
        </div>
      </div>

      <ProductsClient 
        products={products} 
        categories={categories} 
        brands={brands} 
      />
    </div>
  );
}
