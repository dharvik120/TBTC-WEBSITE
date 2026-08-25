"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export interface Slide {
  id: string;
  heading: string;
  subheading?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
  desktopImageUrl: string;
  mobileImageUrl?: string | null;
  overlayOpacity: number;
  textAlignment: string; // LEFT, CENTER, RIGHT
  buttonsConfig?: string | null; // JSON list supporting multiple buttons
}

interface HeroSliderProps {
  slides: Slide[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  transitionStyle?: string; // fade, slide
  height?: string; // h-[500px], h-[600px], etc.
  showArrows?: boolean;
  showDots?: boolean;
}

export default function HeroSlider({ 
  slides, 
  autoplay = true, 
  autoplaySpeed = 5000, 
  transitionStyle = "fade",
  height = "h-[500px] lg:h-[650px]",
  showArrows = true,
  showDots = true
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = slides.length;

  useEffect(() => {
    if (total === 0) return;

    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, autoplaySpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, total, autoplaySpeed]);

  if (total === 0) return null;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const activeSlide = slides[current];

  // Alignments class mapping
  const alignmentClass = {
    LEFT: "text-left items-start justify-start",
    CENTER: "text-center items-center justify-center",
    RIGHT: "text-right items-end justify-end",
  }[activeSlide.textAlignment] || "text-left items-start justify-start";

  return (
    <section 
      className={`relative w-full overflow-hidden border-b border-slate-800 bg-slate-900 ${height}`}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(autoplay)}
    >
      {/* Slides items */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        
        // Parse custom buttons config
        let slideButtons: any[] = [];
        if (slide.buttonsConfig) {
          try {
            slideButtons = JSON.parse(slide.buttonsConfig).filter((b: any) => b.isActive);
          } catch (e) {
            console.error("Failed to parse slide buttons config:", e);
          }
        }

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
              transitionStyle === "slide"
                ? `transform transition-transform ${isActive ? "translate-x-0 z-10" : index < current ? "-translate-x-full z-0 pointer-events-none" : "translate-x-full z-0 pointer-events-none"}`
                : `transition-opacity ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`
            }`}
          >
            {/* Background Image (Responsive) */}
            <picture className="absolute inset-0 w-full h-full">
              {slide.mobileImageUrl && (
                <source media="(max-width: 640px)" srcSet={slide.mobileImageUrl} />
              )}
              <img
                src={slide.desktopImageUrl}
                alt={slide.heading}
                className="w-full h-full object-cover object-center"
              />
            </picture>

            {/* Dark Overlay */}
            <div
              className="absolute inset-0 bg-slate-950"
              style={{ opacity: slide.overlayOpacity }}
            />

            {/* Slide Content */}
            <div className="absolute inset-0 max-w-7xl mx-auto px-6 lg:px-8 flex items-center z-20">
              <div className={`flex flex-col w-full max-w-3xl ${alignmentClass} text-white`}>
                <span className="font-mono text-xs font-bold tracking-widest text-slate-350 uppercase mb-3 px-3 py-1 bg-slate-950/60 border border-slate-800 backdrop-blur-sm rounded-sm inline-block">
                  Featured Solutions
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight uppercase font-mono">
                  {slide.heading}
                </h1>
                {slide.subheading && (
                  <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl font-normal leading-relaxed font-sans">
                    {slide.subheading}
                  </p>
                )}
                
                {/* CTA Action Panel */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {slideButtons.length > 0 ? (
                    // DYNAMIC BUTTONS
                    slideButtons.map((btn, bIdx) => (
                      <Link
                        key={bIdx}
                        href={btn.link}
                        target={btn.openInNewTab ? "_blank" : "_self"}
                        className={`px-5 py-3 text-xs font-mono uppercase tracking-wider font-bold shadow-sm transition-all rounded-md cursor-pointer border`}
                        style={{ 
                          backgroundColor: btn.style === "primary" ? btn.color : "transparent",
                          borderColor: btn.color,
                          color: btn.textColor || "#ffffff"
                        }}
                      >
                        {btn.text}
                      </Link>
                    ))
                  ) : (
                    // STATIC FALLBACK BUTTONS
                    <>
                      {slide.ctaText && slide.ctaLink && (
                        <Link
                          href={slide.ctaLink}
                          className="px-6 py-3 border text-xs font-mono uppercase tracking-wider font-bold text-white shadow-sm transition-all rounded-md cursor-pointer hover:bg-opacity-90"
                          style={{ backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }}
                        >
                          {slide.ctaText}
                        </Link>
                      )}
                      {slide.secondaryCtaText && slide.secondaryCtaLink && (
                        <Link
                          href={slide.secondaryCtaLink}
                          className="px-6 py-3 bg-transparent border border-white/40 hover:border-white text-xs font-mono uppercase tracking-wider font-bold text-white rounded-md transition-colors cursor-pointer"
                        >
                          {slide.secondaryCtaText}
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Manual Controls */}
      {showArrows && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white hover:bg-slate-900/50 rounded-full border border-white/10 transition-colors focus:outline-none hidden sm:block"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 text-white/70 hover:text-white hover:bg-slate-900/50 rounded-full border border-white/10 transition-colors focus:outline-none hidden sm:block"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Overlay controls - slide count & play state */}
      <div className="absolute bottom-6 left-6 lg:left-8 z-30 flex items-center gap-6 bg-slate-950/65 backdrop-blur-sm border border-slate-800 text-slate-400 py-2 px-4 rounded-sm text-xs font-mono">
        <div className="flex items-center gap-2">
          <span>{String(current + 1).padStart(2, "0")}</span>
          <span className="text-slate-600">/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>
        <div className="w-px h-4 bg-slate-800" />
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="hover:text-white transition-colors focus:outline-none"
          title={isPlaying ? "Pause Autoplay" : "Resume Autoplay"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Pagination bullets */}
      {showDots && (
        <div className="absolute bottom-6 right-6 lg:right-8 z-30 flex gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${
                idx === current ? "w-8" : "w-2.5 hover:bg-white/50"
              }`}
              style={{ backgroundColor: idx === current ? "var(--secondary-color)" : "rgba(255, 255, 255, 0.25)" }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
