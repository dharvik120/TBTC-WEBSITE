import React from "react";
import prisma from "@/lib/prisma";
import BlogsClient from "@/components/admin/BlogsClient";

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { publishDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Blogs & resources Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Publish technical guides, product literature reviews, and updates from Shree TBTC.
          </p>
        </div>
      </div>

      <BlogsClient blogs={blogs} />
    </div>
  );
}
