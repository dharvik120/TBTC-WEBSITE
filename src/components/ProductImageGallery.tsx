"use client";

import React, { useState } from "react";
import { FileImage, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: { id: string; imageUrl: string }[];
  name: string;
}

export default function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div className="w-full min-h-[380px] lg:min-h-[460px] bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 font-mono text-xs shadow-sm">
        <FileImage className="w-16 h-16 text-slate-300 mb-3" />
        <span className="font-bold tracking-wider">NO PREVIEW IMAGE AVAILABLE</span>
        <span className="text-[10px] text-slate-400 mt-1 font-sans">Contact sales for technical drawings</span>
      </div>
    );
  }

  const activeImage = images[activeIdx]?.imageUrl || images[0].imageUrl;

  return (
    <div className="flex flex-col gap-4 font-sans">
      {/* Active Main Image Container (Amazon-style large showcase) */}
      <div 
        onClick={() => setIsZoomed(true)}
        className="w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] bg-white border border-slate-200 rounded-lg flex items-center justify-center p-4 sm:p-8 relative overflow-hidden group shadow-sm cursor-zoom-in transition-all hover:border-slate-350"
      >
        <img
          src={activeImage}
          alt={name}
          className="w-full h-full max-h-[440px] object-contain transition-transform duration-300 group-hover:scale-105 select-none drop-shadow-sm"
        />

        {/* Amazon-style zoom overlay hint */}
        <div className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded shadow-sm backdrop-blur-xs flex items-center gap-1.5 transition-opacity opacity-75 group-hover:opacity-100">
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Click to Zoom</span>
        </div>

        {/* Image count badge */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-white/90 border border-slate-200 text-slate-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(idx)}
              className={`w-20 h-20 bg-white border-2 rounded-md p-1.5 flex items-center justify-center shrink-0 transition-all focus:outline-none cursor-pointer ${
                idx === activeIdx 
                  ? "border-primary ring-2 ring-primary/20 shadow-sm" 
                  : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
              }`}
              title={`View image ${idx + 1}`}
            >
              <img
                src={img.imageUrl}
                alt={`${name} thumbnail ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Zoom Modal (Amazon-style lightbox) */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          {/* Top Bar with title & close button */}
          <div 
            className="w-full max-w-5xl flex justify-between items-center text-white pb-4 mb-2 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="font-bold text-sm sm:text-base">{name}</h3>
              <p className="text-xs text-slate-400 font-mono">Image {activeIdx + 1} of {images.length}</p>
            </div>
            <button
              onClick={() => setIsZoomed(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
              title="Close Zoom"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Image */}
          <div 
            className="relative w-full max-w-4xl max-h-[80vh] flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt={name}
              className="max-w-full max-h-[75vh] object-contain rounded drop-shadow-2xl"
            />

            {/* Prev/Next buttons in modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-2 p-3 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors cursor-pointer"
                  title="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 p-3 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors cursor-pointer"
                  title="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
