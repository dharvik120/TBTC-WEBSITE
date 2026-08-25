import React from "react";
import prisma from "@/lib/prisma";
import ContentClient from "@/components/admin/ContentClient";

export default async function AdminContentPage() {
  const industries = await prisma.industry.findMany({
    orderBy: { displayOrder: "asc" },
  });

  const whyChooseUs = await prisma.whyChooseUs.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Homepage Content Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure benefit highlights and active industrial target sectors.
          </p>
        </div>
      </div>

      <ContentClient 
        industries={industries} 
        whyChooseUs={whyChooseUs} 
      />
    </div>
  );
}
