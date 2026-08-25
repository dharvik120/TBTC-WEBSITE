import React from "react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import WhyWorkClient from "@/components/admin/WhyWorkClient";

export default async function AdminWhyWorkPage() {
  const settings = await getCompanySettings();
  const items = await prisma.whyChooseUs.findMany({
    orderBy: { displayOrder: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Why Work With Us benefits CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure titles, highlighted words, section colors, and manage the dynamic list of benefits.
          </p>
        </div>
      </div>

      <WhyWorkClient settings={settings} initialItems={items} />
    </div>
  );
}
