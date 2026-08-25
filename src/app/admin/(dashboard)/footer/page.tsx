import React from "react";
import { getCompanySettings } from "@/lib/settings";
import FooterClient from "@/components/admin/FooterClient";

export default async function AdminFooterPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Footer builder & copyright CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Build columns blocks, define custom link lists, reorder footer elements, and manage developer credits/copyright tags.
          </p>
        </div>
      </div>

      <FooterClient settings={settings} />
    </div>
  );
}
