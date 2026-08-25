import React from "react";
import { getCompanySettings } from "@/lib/settings";
import ThemesClient from "@/components/admin/ThemesClient";

export default async function AdminThemesPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Themes & Portal Appearance
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Toggle public layout designs, configure branding colors, and check accessibility options.
          </p>
        </div>
      </div>

      <ThemesClient settings={settings} />
    </div>
  );
}
