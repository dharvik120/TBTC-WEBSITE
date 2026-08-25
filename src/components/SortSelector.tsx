"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface SortSelectorProps {
  currentSort: string;
}

export default function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 text-xs font-sans">
      <span className="text-slate-400">Sort By:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={handleChange}
          className="appearance-none bg-slate-50 border border-slate-200 px-3 py-1.5 pr-8 rounded focus:outline-none font-semibold text-slate-700 cursor-pointer"
        >
          <option value="featured">Featured / Default</option>
          <option value="newest">Newest Additions</option>
          <option value="name-asc">Alphabetical (A-Z)</option>
        </select>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-90 absolute right-2.5 top-2 pointer-events-none" />
      </div>
    </div>
  );
}
