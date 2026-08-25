import React from "react";
import { getCompanySettings } from "@/lib/settings";
import NavigationClient from "@/components/admin/NavigationClient";

export default async function AdminNavigationPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Header & Navigation Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Upload corporate logo files, toggle sticky headers, setup search boxes, and modify multi-level dropdown header navigation menus.
          </p>
        </div>
      </div>

      <NavigationClient settings={settings} />
    </div>
  );
}
