import React from "react";
import prisma from "@/lib/prisma";
import InquiriesClient from "@/components/admin/InquiriesClient";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Inquiry Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Track and process standard contact inquiries and specific product leads.
          </p>
        </div>
      </div>

      <InquiriesClient inquiries={inquiries} />
    </div>
  );
}
