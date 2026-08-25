import React from "react";
import prisma from "@/lib/prisma";
import SliderClient from "@/components/admin/SliderClient";

export default async function AdminSliderPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Hero Slider Management
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Configure full-width slides, background overlays, alignments, and call-to-action details for the front page.
          </p>
        </div>
      </div>

      <SliderClient slides={slides} />
    </div>
  );
}
