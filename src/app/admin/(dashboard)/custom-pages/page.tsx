import React from "react";
import prisma from "@/lib/prisma";
import CustomPagesClient from "@/components/admin/CustomPagesClient";

export default async function AdminCustomPagesPage() {
  const pages = await prisma.customPage.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Custom sub-pages CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Build terms sheets, privacy policies, corporate profiles, and custom certificates showcases using rich markdown editors.
          </p>
        </div>
      </div>

      <CustomPagesClient initialPages={pages} />
    </div>
  );
}
