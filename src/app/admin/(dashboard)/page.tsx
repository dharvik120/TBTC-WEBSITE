import React from "react";
import Link from "next/link";
import { 
  Package, FolderTree, Award, Inbox, FileSpreadsheet, 
  ArrowRight, Plus, Eye, Clock 
} from "lucide-react";
import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  // Fetch metrics counts
  const [
    productsCount,
    categoriesCount,
    brandsCount,
    inquiriesCount,
    quotesCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.inquiry.count(),
    prisma.quoteRequest.count(),
  ]);

  // Fetch recent inquiries
  const recentInquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Fetch recent products
  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, brand: true },
    take: 5,
  });

  const metrics = [
    { name: "Total Products", value: productsCount, icon: Package, href: "/admin/products", color: "text-blue-600" },
    { name: "Categories", value: categoriesCount, icon: FolderTree, href: "/admin/categories", color: "text-purple-600" },
    { name: "Partner Brands", value: brandsCount, icon: Award, href: "/admin/brands", color: "text-orange-600" },
    { name: "Inbound Inquiries", value: inquiriesCount, icon: Inbox, href: "/admin/inquiries", color: "text-emerald-600" },
    { name: "Quote Requests", value: quotesCount, icon: FileSpreadsheet, href: "/admin/quotes", color: "text-indigo-600" },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Upper Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-white border border-slate-200 rounded-md p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold tracking-wider block">
                  {card.name}
                </span>
                <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">
                  {card.value}
                </span>
                <Link href={card.href} className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 mt-2.5">
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className={`p-3 bg-slate-50 rounded border border-slate-100 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tables section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Inbound Inquiries */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-150 pb-4 mb-5">
            <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
              Recent Inquiries
            </h3>
            <Link href="/admin/inquiries" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-400">
                    <th className="py-2.5 px-3 font-bold uppercase">Customer</th>
                    <th className="py-2.5 px-3 font-bold uppercase">Type</th>
                    <th className="py-2.5 px-3 font-bold uppercase">Date</th>
                    <th className="py-2.5 px-3 font-bold uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-sans">
                  {recentInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-800">{inq.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{inq.companyName || "No Company"}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold ${
                          inq.inquiryType === "SALES" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          inq.inquiryType === "TECHNICAL" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}>
                          {inq.inquiryType}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link 
                          href="/admin/inquiries"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-700"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              NO INQUIRIES REGISTERED
            </div>
          )}
        </div>

        {/* Recently Added Products */}
        <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-150 pb-4 mb-5">
            <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
              Recently Added Products
            </h3>
            <div className="flex items-center gap-4">
              <Link href="/admin/products?new=true" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </Link>
              <Link href="/admin/products" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {recentProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-400">
                    <th className="py-2.5 px-3 font-bold uppercase">Product / Model</th>
                    <th className="py-2.5 px-3 font-bold uppercase">Category</th>
                    <th className="py-2.5 px-3 font-bold uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-sans">
                  {recentProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-800 truncate max-w-[160px]">{p.name}</p>
                        {p.modelNumber && (
                          <p className="text-[10px] font-mono text-slate-500 font-bold mt-0.5">M/N: {p.modelNumber}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 truncate max-w-[120px]">
                        {p.category.name}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold ${
                          p.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-50 text-slate-450 border border-slate-200"
                        }`}>
                          {p.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-mono">
              NO PRODUCTS REGISTERED
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
