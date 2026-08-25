"use client";

import React, { useState } from "react";
import { FileImage } from "lucide-react";

interface ProductImageGalleryProps {
  images: { id: string; imageUrl: string }[];
  name: string;
}

export default function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-50 border border-slate-200 rounded-md flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
        <FileImage className="w-12 h-12 text-slate-350 mb-2" />
        <span>NO IMAGES AVAILABLE</span>
      </div>
    );
  }

  const activeImage = images[activeIdx].imageUrl;

  return (
    <div className="flex flex-col gap-4">
      {/* Active Main Image */}
      <div className="w-full aspect-square bg-slate-50 border border-slate-250 rounded-md flex items-center justify-center p-6 relative overflow-hidden group">
        <img
          src={activeImage}
          alt={name}
          className="max-h-full max-w-full object-contain group-hover:scale-[1.03] transition-transform duration-355"
        />
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1.5 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              className={`w-20 h-20 bg-slate-50 border rounded p-1.5 flex items-center justify-center shrink-0 transition-all focus:outline-none ${
                idx === activeIdx 
                  ? "border-primary ring-2 ring-primary/10" 
                  : "border-slate-200 hover:border-slate-350"
              }`}
            >
              <img
                src={img.imageUrl}
                alt={`${name} thumbnail ${idx + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
