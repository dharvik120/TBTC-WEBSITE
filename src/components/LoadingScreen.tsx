"use client";

import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Progress counter animation from 0 to 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const step = prev < 40 ? 6 : prev < 80 ? 10 : 15;
        return Math.min(100, prev + step);
      });
    }, 45);

    // Fade out after 1.6s
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
      }, 600);
    }, 1600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="tbtc-app-loader"
      className={`fixed inset-0 z-[999999] bg-slate-950 flex flex-col items-center justify-center font-sans select-none ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#020617",
        zIndex: 999999,
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      {/* Background radial glow & technical grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,60,93,0.35)_0%,rgba(2,6,23,0.98)_75%)]" />
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-md w-full text-center">
        
        {/* Logo Card with Synchronized Animated Lines */}
        <div className="relative p-6 sm:p-8 bg-slate-900/95 border border-slate-800 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md mb-6 overflow-hidden">
          
          {/* Top Line Animation */}
          <div 
            className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
          />

          {/* Right Line Animation */}
          <div 
            className="absolute top-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
            style={{ height: `${progress}%`, transition: "height 0.1s linear" }}
          />

          {/* Bottom Line Animation */}
          <div 
            className="absolute bottom-0 right-0 h-[2px] bg-gradient-to-l from-transparent via-red-500 to-transparent"
            style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
          />

          {/* Left Line Animation */}
          <div 
            className="absolute bottom-0 left-0 w-[2px] bg-gradient-to-t from-transparent via-red-500 to-transparent"
            style={{ height: `${progress}%`, transition: "height 0.1s linear" }}
          />

          {/* High-Tech Glowing Laser Scanner Line */}
          <div 
            className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] pointer-events-none"
            style={{
              top: `${progress}%`,
              transition: "top 0.1s linear",
            }}
          />

          {/* Full Logo Display */}
          <div className="relative z-10 flex items-center justify-center p-2">
            <img
              src="/images/logo.png"
              alt="Shree TBTC Global Industries"
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
              draggable={false}
            />
          </div>
        </div>

        {/* Company Title & Industrial Typography */}
        <h1 className="text-white text-base sm:text-lg font-black font-mono tracking-widest uppercase mb-1 drop-shadow-md">
          Shree TBTC Global Industries
        </h1>
        <p className="text-cyan-400 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
          <span>Electrical Automation & Industrial Supplies</span>
        </p>

        {/* Synchronized Loading Progress Bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-red-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(56,189,248,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="tracking-widest uppercase text-slate-500">INITIALIZING CORE SYSTEM</span>
            <span className="font-bold text-cyan-400">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
