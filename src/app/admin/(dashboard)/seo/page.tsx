import React from "react";
import { getCompanySettings } from "@/lib/settings";
import SeoClient from "@/components/admin/SeoClient";

export default async function AdminSeoPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            SEO metadata settings
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure default titles, descriptors, keywords defaults and sitemaps search engine crawlers index tags.
          </p>
        </div>
      </div>

      <SeoClient settings={settings} />
    </div>
  );
}
