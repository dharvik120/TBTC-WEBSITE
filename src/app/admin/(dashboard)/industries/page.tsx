import React from "react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import IndustriesClient from "@/components/admin/IndustriesClient";

export default async function AdminIndustriesPage() {
  const settings = await getCompanySettings();
  const industries = await prisma.industry.findMany({
    orderBy: { displayOrder: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Industries We Serve CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure section titles, descriptions, layout formats, and manage individual industry sector cards.
          </p>
        </div>
      </div>

      <IndustriesClient settings={settings} initialIndustries={industries} />
    </div>
  );
}
