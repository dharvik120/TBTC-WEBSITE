import React from "react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import FeaturedClient from "@/components/admin/FeaturedClient";

export default async function AdminFeaturedPage() {
  const settings = await getCompanySettings();
  const products = await prisma.product.findMany({
    orderBy: { displayOrder: "asc" },
    include: { category: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Featured products selector
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Toggle product featured status and configure general featured banner titles, subtitles and display limits.
          </p>
        </div>
      </div>

      <FeaturedClient settings={settings} products={products} />
    </div>
  );
}
