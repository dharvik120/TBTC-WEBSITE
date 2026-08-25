"use client";

import React, { useState, useTransition } from "react";
import { Palette, ShieldAlert, Save, RefreshCw, CheckCircle2, Layout, HelpCircle, Loader2 } from "lucide-react";
import { updateThemeAndColors } from "@/app/actions/admin";

interface CompanySettings {
  activeTheme: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  darkSectionColor: string;
  textColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  linkColor: string;
}

interface ThemesClientProps {
  settings: CompanySettings;
}

const themeOptions = [
  {
    id: "theme1",
    name: "Industrial Corporate",
    description: "Premium, highly structured B2B grid layout with full-width corporate hero banner. Ideal for high credibility and clean information architecture.",
    previewImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "theme2",
    name: "Modern Technical",
    description: "Dynamic engineering-focused layouts, refined typography, and subtle technical visual aids for contemporary suppliers.",
    previewImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "theme3",
    name: "Bold Industrial Showcase",
    description: "High-impact visual layout with large industrial photography, product-centered storytelling cards, and powerful call-to-actions.",
    previewImage: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400"
  }
];

const defaultColors = {
  theme1: {
    primaryColor: "#0b3c5d",
    secondaryColor: "#d9534f",
    accentColor: "#328cc1",
    backgroundColor: "#ffffff",
    darkSectionColor: "#0f172a",
    textColor: "#334155",
    buttonColor: "#0b3c5d",
    buttonHoverColor: "#0d4870",
    linkColor: "#0b3c5d",
  },
  theme2: {
    primaryColor: "#1e293b",
    secondaryColor: "#10b981",
    accentColor: "#6366f1",
    backgroundColor: "#fafafa",
    darkSectionColor: "#111827",
    textColor: "#374151",
    buttonColor: "#1e293b",
    buttonHoverColor: "#0f172a",
    linkColor: "#6366f1",
  },
  theme3: {
    primaryColor: "#111827",
    secondaryColor: "#e11d48",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    darkSectionColor: "#030712",
    textColor: "#1f2937",
    buttonColor: "#111827",
    buttonHoverColor: "#000000",
    linkColor: "#e11d48",
  }
};

export default function ThemesClient({ settings }: ThemesClientProps) {
  const [activeTheme, setActiveTheme] = useState(settings.activeTheme);

  // Color States
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor);
  const [accentColor, setAccentColor] = useState(settings.accentColor);
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor);
  const [darkSectionColor, setDarkSectionColor] = useState(settings.darkSectionColor);
  const [textColor, setTextColor] = useState(settings.textColor);
  const [buttonColor, setButtonColor] = useState(settings.buttonColor);
  const [buttonHoverColor, setButtonHoverColor] = useState(settings.buttonHoverColor);
  const [linkColor, setLinkColor] = useState(settings.linkColor);

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const applyDefaultColors = (themeId: "theme1" | "theme2" | "theme3") => {
    const defaults = defaultColors[themeId];
    setPrimaryColor(defaults.primaryColor);
    setSecondaryColor(defaults.secondaryColor);
    setAccentColor(defaults.accentColor);
    setBackgroundColor(defaults.backgroundColor);
    setDarkSectionColor(defaults.darkSectionColor);
    setTextColor(defaults.textColor);
    setButtonColor(defaults.buttonColor);
    setButtonHoverColor(defaults.buttonHoverColor);
    setLinkColor(defaults.linkColor);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateThemeAndColors({
        activeTheme,
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        darkSectionColor,
        textColor,
        buttonColor,
        buttonHoverColor,
        linkColor
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        // Direct CSS variable updates in layout runtime
        document.documentElement.style.setProperty("--primary-color", primaryColor);
        document.documentElement.style.setProperty("--secondary-color", secondaryColor);
      }
    });
  };

  return (
    <div className="space-y-8 text-xs font-sans max-w-5xl mx-auto">
      
      {/* Save Success Alert Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">CMS Theme & Appearance settings updated successfully! All public routes have been revalidated.</span>
        </div>
      )}

      {/* SECTION 1: Themes list grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
            <Layout className="w-4.5 h-4.5 text-slate-500" />
            <span>Frontend Portal Themes</span>
          </h2>
          <p className="text-slate-500 text-[10.5px] mt-0.5">Select a clearly different layout style for your Shree TBTC public pages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themeOptions.map((t) => {
            const isSelected = activeTheme === t.id;
            return (
              <div 
                key={t.id} 
                className={`border rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                  isSelected ? "border-slate-800 ring-1 ring-slate-800 bg-slate-50/20" : "border-slate-200 bg-white hover:border-slate-350"
                }`}
              >
                <div>
                  <div className="h-32 bg-slate-100 relative overflow-hidden border-b border-slate-150">
                    <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover" />
                    {isSelected && (
                      <span className="absolute top-3 right-3 bg-slate-900 text-white text-[8px] font-bold font-mono px-2 py-0.5 rounded-sm uppercase tracking-widest border border-slate-700">
                        Active Theme
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-extrabold text-slate-800 text-xs tracking-wide">{t.name}</h3>
                    <p className="text-slate-500 text-[10px] leading-relaxed">{t.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => {
                      setActiveTheme(t.id);
                      if (confirm("Would you like to auto-apply recommended color values for this theme style?")) {
                        applyDefaultColors(t.id as any);
                      }
                    }}
                    className={`flex-1 text-center py-2 rounded-md font-bold uppercase tracking-wider text-[9px] cursor-pointer transition-colors ${
                      isSelected 
                        ? "bg-slate-900 text-white" 
                        : "bg-slate-50 border border-slate-250 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected ? "Activated" : "Activate Theme"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Color management picker forms */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-150 pb-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <Palette className="w-4.5 h-4.5 text-slate-500" />
              <span>Appearance & CSS Color Management</span>
            </h2>
            <p className="text-slate-500 text-[10.5px] mt-0.5">Customize global styles. Color variables bind automatically to components.</p>
          </div>
          <button
            onClick={() => applyDefaultColors(activeTheme as any)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Recommended</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Primary */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Primary Theme Color</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Used for headers, strong buttons and prominent details.</p>
          </div>

          {/* Secondary */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Secondary Accent Color</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Used for badges, highlights, and warning triggers.</p>
          </div>

          {/* Accent */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">General Accent Color</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Used for card icons, background highlight stripes, and labels.</p>
          </div>

          {/* Canvas Background */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Canvas Background Color</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Main body canvas background color.</p>
          </div>

          {/* Dark Section */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Dark Section Background</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={darkSectionColor} onChange={(e) => setDarkSectionColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={darkSectionColor} onChange={(e) => setDarkSectionColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Used for the main footer and CTA stripes.</p>
          </div>

          {/* Text Color */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Text Typography Color</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Used for standard paragraph descriptions.</p>
          </div>

          {/* Button Color */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Button Primary Color</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Used for CTA buttons background color.</p>
          </div>

          {/* Button Hover */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Button Hover State</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={buttonHoverColor} onChange={(e) => setButtonHoverColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={buttonHoverColor} onChange={(e) => setButtonHoverColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Used for button background on hover.</p>
          </div>

          {/* Links Color */}
          <div className="space-y-1.5 bg-slate-50 border border-slate-200/60 p-3 rounded-lg">
            <label className="block text-[10px] font-bold text-slate-500 uppercase">Text Links Color</label>
            <div className="flex items-center gap-2.5">
              <input type="color" value={linkColor} onChange={(e) => setLinkColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <input type="text" value={linkColor} onChange={(e) => setLinkColor(e.target.value)} className="flex-1 border border-slate-250 rounded px-2.5 py-1 text-xs uppercase font-mono" />
            </div>
            <p className="text-[9px] text-slate-400">Used for anchors, catalog downloads, and sidebar details.</p>
          </div>
        </div>

        {/* Contrast Checker Alert */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3 text-slate-500 font-mono text-[10px] items-start">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold uppercase text-slate-700">Contrast Notice & Accessibility</p>
            <p>Ensure that high contrast between text background and canvas colors is preserved. White text on primary buttons must have at least 4.5:1 ratio (WCAG AA standard).</p>
          </div>
        </div>

        {/* Save footer */}
        <div className="flex justify-end pt-4 border-t border-slate-150">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold disabled:opacity-50 cursor-pointer shadow-sm text-[10px] uppercase font-mono tracking-wider"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Appearance & Theme</span>
          </button>
        </div>
      </div>

    </div>
  );
}
