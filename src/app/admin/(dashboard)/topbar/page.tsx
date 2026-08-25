import React from "react";
import { getCompanySettings } from "@/lib/settings";
import TopbarClient from "@/components/admin/TopbarClient";

export default async function AdminTopbarPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Top Contact Bar Configuration
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage top contact bar visibility, left announcements text, and reorder multiple active contact tags.
          </p>
        </div>
      </div>

      <TopbarClient 
        initialEnable={settings.enableTopContactBar}
        initialTitle={settings.topBarTitle}
        initialConfig={settings.topBarConfig}
      />
    </div>
  );
}
