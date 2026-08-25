import React from "react";
import { getCompanySettings } from "@/lib/settings";
import AboutCMSClient from "@/components/admin/AboutCMSClient";

export default async function AdminAboutCMSPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            About Us page content CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Update company stories, setup core values lists, publish mission/vision targets, and verify credentials statistics.
          </p>
        </div>
      </div>

      <AboutCMSClient settings={settings} />
    </div>
  );
}
