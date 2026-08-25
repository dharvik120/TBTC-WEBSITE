"use client";

import React, { useState, useTransition } from "react";
import { Layers, Save, Eye, EyeOff, ArrowUp, ArrowDown, Loader2, CheckCircle2 } from "lucide-react";
import { updateHomepageSectionsConfig } from "@/app/actions/admin";

interface SectionConfig {
  id: string;
  name: string;
  isEnabled: boolean;
  displayOrder: number;
}

interface SectionsClientProps {
  initialConfig: string | null;
}

export default function SectionsClient({ initialConfig }: SectionsClientProps) {
  const [sections, setSections] = useState<SectionConfig[]>(() => {
    if (initialConfig) {
      try {
        return JSON.parse(initialConfig).sort((a: any, b: any) => a.displayOrder - b.displayOrder);
      } catch (e) {
        console.error("Failed parsing homepageSectionsConfig:", e);
      }
    }
    // Fallback defaults
    return [
      { id: "slider", name: "Hero Banner Slides", isEnabled: true, displayOrder: 1 },
      { id: "intro", name: "Who We Are", isEnabled: true, displayOrder: 2 },
      { id: "categories", name: "Category grid", isEnabled: true, displayOrder: 3 },
      { id: "featured", name: "Featured Products", isEnabled: true, displayOrder: 4 },
      { id: "why", name: "Why Choose Us benefits", isEnabled: true, displayOrder: 5 },
      { id: "industries", name: "Industries We Serve", isEnabled: true, displayOrder: 6 },
      { id: "cta", name: "Call to Action banners", isEnabled: true, displayOrder: 7 }
    ];
  });

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, isEnabled: !sec.isEnabled } : sec))
    );
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSecs = [...sections];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSecs.length) return;

    const temp = newSecs[index];
    newSecs[index] = newSecs[targetIdx];
    newSecs[targetIdx] = temp;

    // Recalculate displayOrder
    newSecs.forEach((sec, idx) => {
      sec.displayOrder = idx + 1;
    });

    setSections(newSecs);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateHomepageSectionsConfig(JSON.stringify(sections));
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-3xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Homepage section order and visibility rules saved successfully!</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-slate-500" />
            <span>Homepage Section Manager</span>
          </h2>
          <p className="text-slate-500 text-[10.5px] mt-0.5">Toggle active sections and reorder the rendering stack using directional arrows.</p>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-150">
          {sections.map((sec, idx) => (
            <div 
              key={sec.id} 
              className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                sec.isEnabled ? "bg-white" : "bg-slate-50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-350 font-bold shrink-0">#{idx + 1}</span>
                <div>
                  <span className="font-bold text-slate-850 text-[11px] uppercase tracking-wide">{sec.name}</span>
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">Section ID: {sec.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Reordering */}
                <button
                  onClick={() => moveSection(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveSection(idx, "down")}
                  disabled={idx === sections.length - 1}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <span className="w-px h-4 bg-slate-200 mx-1.5" />

                {/* Toggle Eye */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  className={`p-1.5 rounded flex items-center gap-1 font-bold text-[9px] uppercase tracking-wider font-mono cursor-pointer ${
                    sec.isEnabled 
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {sec.isEnabled ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

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
            <span>Save Section Layout</span>
          </button>
        </div>
      </div>

    </div>
  );
}
