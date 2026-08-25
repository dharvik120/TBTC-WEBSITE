import React from "react";
import { getCompanySettings } from "@/lib/settings";
import SectionsClient from "@/components/admin/SectionsClient";

export default async function AdminSectionsPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Homepage Sections Layout Manager
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Enable or disable sections on the landing homepage and configure the vertical scroll order layout dynamically.
          </p>
        </div>
      </div>

      <SectionsClient initialConfig={settings.homepageSectionsConfig} />
    </div>
  );
}
