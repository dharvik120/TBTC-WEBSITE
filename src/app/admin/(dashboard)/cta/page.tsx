import React from "react";
import { getCompanySettings } from "@/lib/settings";
import CtaClient from "@/components/admin/CtaClient";

export default async function AdminCtaPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Call to Action Section CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure background banner colors, highlights text, and build multiple dynamic action buttons for global sections.
          </p>
        </div>
      </div>

      <CtaClient settings={settings} />
    </div>
  );
}
