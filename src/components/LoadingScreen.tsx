"use client";

import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMounted(false);
      return;
    }

    // Fade out and unmount cleanly after full animation cycle
    const timer = setTimeout(() => {
      setMounted(false);
    }, 2450);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="tbtc-logo-loader" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: `
        .tbtc-logo-loader {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          animation: 0.45s 2.05s forwards tbtc-loader-out;
        }

        .tbtc-loader-logo {
          width: min(340px, 68vw);
          height: auto;
          display: block;
          animation: 0.5s 1.7s both tbtc-brand-pulse;
        }

        .tbtc-reveal-emblem-1 {
          stroke-dasharray: 1;
          stroke-dashoffset: 1px;
          animation: 1.15s ease-in-out 0.1s forwards tbtc-draw-brand;
        }

        .tbtc-reveal-emblem-2 {
          stroke-dasharray: 1;
          stroke-dashoffset: 1px;
          animation: 0.95s ease-in-out 0.35s forwards tbtc-draw-brand;
        }

        .tbtc-reveal-emblem-3 {
          stroke-dasharray: 1;
          stroke-dashoffset: 1px;
          animation: 0.85s ease-in-out 0.5s forwards tbtc-draw-brand;
        }

        .tbtc-reveal-type {
          opacity: 0;
          animation: 0.5s 1.25s forwards tbtc-fade-in;
        }

        .tbtc-reveal-complete {
          opacity: 0;
          animation: 0.25s 1.55s forwards tbtc-fade-in;
        }

        .tbtc-loader-tagline {
          margin-top: 24px;
          font-size: 10px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          letter-spacing: 0.26em;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 700;
          opacity: 0;
          animation: 0.6s 0.95s forwards tbtc-fade-in;
          text-align: center;
          padding: 0 16px;
        }

        @keyframes tbtc-draw-brand {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes tbtc-fade-in {
          to {
            opacity: 1;
          }
        }

        @keyframes tbtc-brand-pulse {
          0% {
            transform: scale(0.97);
            filter: brightness(0.96);
          }
          50% {
            transform: scale(1.02);
            filter: brightness(1.06);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }

        @keyframes tbtc-loader-out {
          to {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
        }
      `}} />

      <svg viewBox="0 0 500 395" className="tbtc-loader-logo">
        <defs>
          <mask id="tbtc-brand-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="395">
            {/* Outline drawing strokes for TBTC emblem */}
            <path
              className="tbtc-reveal-emblem-1"
              d="M 160 250 L 250 15 L 340 250 Z"
              fill="none"
              stroke="white"
              strokeWidth="60"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength="1"
            />
            <path
              className="tbtc-reveal-emblem-2"
              d="M 250 5 L 250 255 M 165 125 L 335 125"
              fill="none"
              stroke="white"
              strokeWidth="65"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength="1"
            />
            <path
              className="tbtc-reveal-emblem-3"
              d="M 175 45 L 325 215 M 325 45 L 175 215"
              fill="none"
              stroke="white"
              strokeWidth="50"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength="1"
            />
            {/* Typography reveal */}
            <rect className="tbtc-reveal-type" x="0" y="260" width="500" height="135" fill="white" />
            {/* 100% complete fill */}
            <rect className="tbtc-reveal-complete" width="500" height="395" fill="white" />
          </mask>
        </defs>
        <image
          href="/images/logo.png"
          width="500"
          height="395"
          mask="url(#tbtc-brand-reveal)"
        />
      </svg>

      <p className="tbtc-loader-tagline">
        Electrical Automation &amp; Industrial Supplies
      </p>
    </div>
  );
}
