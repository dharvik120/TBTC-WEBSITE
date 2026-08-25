import React from "react";
import prisma from "@/lib/prisma";
import BrandsClient from "@/components/admin/BrandsClient";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Brand Partner Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure partner brands and manufacturers associated with products.
          </p>
        </div>
      </div>

      <BrandsClient brands={brands} />
    </div>
  );
}
