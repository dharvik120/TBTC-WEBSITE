import React from "react";
import prisma from "@/lib/prisma";
import QuotesClient from "@/components/admin/QuotesClient";

export default async function AdminQuotesPage() {
  // Query all quote requests including nested items and product details
  const quotes = await prisma.quoteRequest.findMany({
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              modelNumber: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Quotation Requests (RFQs)
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Log and review multi-product quote baskets submitted by B2B buyers.
          </p>
        </div>
      </div>

      <QuotesClient quotes={quotes} />
    </div>
  );
}
