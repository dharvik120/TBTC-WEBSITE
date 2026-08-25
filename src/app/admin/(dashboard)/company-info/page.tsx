import React from "react";
import { getCompanySettings } from "@/lib/settings";
import CompanyInfoClient from "@/components/admin/CompanyInfoClient";

export default async function AdminCompanyInfoPage() {
  const settings = await getCompanySettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Company information manager
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Update company legal names, email addresses, phone lines, GST numbers, addresses, maps embeds, and business hours.
          </p>
        </div>
      </div>

      <CompanyInfoClient settings={settings} />
    </div>
  );
}
