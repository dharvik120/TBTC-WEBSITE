import React from "react";
import prisma from "@/lib/prisma";
import DownloadsClient from "@/components/admin/DownloadsClient";

export default async function AdminDownloadsPage() {
  const downloads = await prisma.download.findMany({
    orderBy: { displayOrder: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Catalogues & downloads manager
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Upload literature PDFs, define access restrictions, toggle homepage featuring, and set list display orders.
          </p>
        </div>
      </div>

      <DownloadsClient initialDownloads={downloads} />
    </div>
  );
}
