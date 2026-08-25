import React from "react";
import prisma from "@/lib/prisma";
import CategoriesClient from "@/components/admin/CategoriesClient";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Category Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Define product categories and subcategory relationships for catalog filtration.
          </p>
        </div>
      </div>

      <CategoriesClient categories={categories} />
    </div>
  );
}
