"use client";

import React, { useState, useTransition } from "react";
import { Save, Plus, Trash2, ShieldCheck, Award, BookOpen, Loader2, CheckCircle2 } from "lucide-react";
import { updateAboutPageCMS } from "@/app/actions/admin";

interface CompanySettings {
  aboutHeroTitle: string | null;
  aboutHeroSubtitle: string | null;
  aboutHeroBgImage: string | null;
  aboutHeroCtaText: string | null;
  aboutHeroCtaLink: string | null;
  aboutStoryHeading: string | null;
  aboutStoryContent: string | null;
  aboutStoryImages: string | null;
  aboutStoryHighlights: string | null;
  aboutMissionHeading: string | null;
  aboutMissionContent: string | null;
  aboutMissionImage: string | null;
  aboutVisionHeading: string | null;
  aboutVisionContent: string | null;
  aboutVisionImage: string | null;
  aboutValuesConfig: string | null;
  aboutStatsConfig: string | null;
  aboutTeamConfig: string | null;
  aboutCertificationsConfig: string | null;
  aboutCtaConfig: string | null;
}

interface AboutCMSClientProps {
  settings: CompanySettings;
}

export default function AboutCMSClient({ settings }: AboutCMSClientProps) {
  // Hero
  const [heroTitle, setHeroTitle] = useState(settings.aboutHeroTitle || "");
  const [heroSubtitle, setHeroSubtitle] = useState(settings.aboutHeroSubtitle || "");
  const [heroBgImage, setHeroBgImage] = useState(settings.aboutHeroBgImage || "");
  const [heroCtaText, setHeroCtaText] = useState(settings.aboutHeroCtaText || "");
  const [heroCtaLink, setHeroCtaLink] = useState(settings.aboutHeroCtaLink || "");

  // Story
  const [storyHeading, setStoryHeading] = useState(settings.aboutStoryHeading || "");
  const [storyContent, setStoryContent] = useState(settings.aboutStoryContent || "");
  const [storyHighlights, setStoryHighlights] = useState<string[]>(() => {
    if (settings.aboutStoryHighlights) {
      try { return JSON.parse(settings.aboutStoryHighlights); } catch (e) { }
    }
    return [];
  });
  const [newHighlight, setNewHighlight] = useState("");

  // Mission & Vision
  const [missionHeading, setMissionHeading] = useState(settings.aboutMissionHeading || "");
  const [missionContent, setMissionContent] = useState(settings.aboutMissionContent || "");
  const [missionImage, setMissionImage] = useState(settings.aboutMissionImage || "");
  const [visionHeading, setVisionHeading] = useState(settings.aboutVisionHeading || "");
  const [visionContent, setVisionContent] = useState(settings.aboutVisionContent || "");
  const [visionImage, setVisionImage] = useState(settings.aboutVisionImage || "");

  // Values Config
  const [values, setValues] = useState<any[]>(() => {
    if (settings.aboutValuesConfig) {
      try { return JSON.parse(settings.aboutValuesConfig); } catch (e) { }
    }
    return [];
  });
  const [newValueTitle, setNewValueTitle] = useState("");
  const [newValueDesc, setNewValueDesc] = useState("");
  const [newValueIcon, setNewValueIcon] = useState("ShieldCheck");

  // Stats Config
  const [stats, setStats] = useState<any[]>(() => {
    if (settings.aboutStatsConfig) {
      try { return JSON.parse(settings.aboutStatsConfig); } catch (e) { }
    }
    return [];
  });
  const [newStatValue, setNewStatValue] = useState("");
  const [newStatLabel, setNewStatLabel] = useState("");
  const [newStatIcon, setNewStatIcon] = useState("Award");

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handlers
  const addHighlight = () => {
    if (!newHighlight) return;
    setStoryHighlights((prev) => [...prev, newHighlight]);
    setNewHighlight("");
  };

  const removeHighlight = (idx: number) => {
    setStoryHighlights((prev) => prev.filter((_, i) => i !== idx));
  };

  const addValue = () => {
    if (!newValueTitle || !newValueDesc) return;
    setValues((prev) => [...prev, { title: newValueTitle, description: newValueDesc, iconName: newValueIcon }]);
    setNewValueTitle("");
    setNewValueDesc("");
  };

  const removeValue = (idx: number) => {
    setValues((prev) => prev.filter((_, i) => i !== idx));
  };

  const addStat = () => {
    if (!newStatValue || !newStatLabel) return;
    setStats((prev) => [...prev, { value: newStatValue, label: newStatLabel, iconName: newStatIcon }]);
    setNewStatValue("");
    setNewStatLabel("");
  };

  const removeStat = (idx: number) => {
    setStats((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateAboutPageCMS({
        aboutHeroTitle: heroTitle,
        aboutHeroSubtitle: heroSubtitle,
        aboutHeroBgImage: heroBgImage || null,
        aboutHeroCtaText: heroCtaText,
        aboutHeroCtaLink: heroCtaLink,
        aboutStoryHeading: storyHeading,
        aboutStoryContent: storyContent,
        aboutStoryImages: JSON.stringify([]),
        aboutStoryHighlights: JSON.stringify(storyHighlights),
        aboutMissionHeading: missionHeading,
        aboutMissionContent: missionContent,
        aboutMissionImage: missionImage || null,
        aboutVisionHeading: visionHeading,
        aboutVisionContent: visionContent,
        aboutVisionImage: visionImage || null,
        aboutValuesConfig: JSON.stringify(values),
        aboutStatsConfig: JSON.stringify(stats),
        aboutTeamConfig: JSON.stringify([]),
        aboutCertificationsConfig: JSON.stringify([]),
        aboutCtaConfig: JSON.stringify({ heading: "Get a Technical Quotation Today", buttonText: "Request RFQ", link: "/quote" })
      });
      if (res.success) {
        setSaveSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-8 text-xs font-sans max-w-5xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">About Us CMS sections updated and re-rendered successfully!</span>
        </div>
      )}

      {/* 1. Hero Block */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase border-b border-slate-150 pb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Hero Header Section</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hero Title</label>
            <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hero Subtitle</label>
            <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CTA Action Text</label>
            <input type="text" value={heroCtaText} onChange={(e) => setHeroCtaText(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CTA Action Link</label>
            <input type="text" value={heroCtaLink} onChange={(e) => setHeroCtaLink(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
          </div>
        </div>
      </div>

      {/* 2. Story Block */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase border-b border-slate-150 pb-2">Company Story</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Story Main Heading</label>
            <input type="text" value={storyHeading} onChange={(e) => setStoryHeading(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Story Content</label>
            <textarea rows={6} value={storyContent} onChange={(e) => setStoryContent(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none leading-relaxed font-sans" />
          </div>

          {/* Highlights List */}
          <div className="border border-slate-200 bg-slate-50/50 p-4 rounded-lg space-y-3">
            <h4 className="font-bold text-[10px] text-slate-500 uppercase font-mono">Bullet Highlights Checklist</h4>
            {storyHighlights.length > 0 && (
              <div className="space-y-1.5">
                {storyHighlights.map((hl, hIdx) => (
                  <div key={hIdx} className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded">
                    <span className="font-medium text-slate-700">{hl}</span>
                    <button type="button" onClick={() => removeHighlight(hIdx)} className="text-slate-400 hover:text-red-650">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 bg-white p-1.5 border border-slate-200 rounded">
              <input type="text" placeholder="Add a new capability highlight..." value={newHighlight} onChange={(e) => setNewHighlight(e.target.value)} className="flex-1 border-0 focus:outline-none px-2 py-1" />
              <button type="button" onClick={addHighlight} className="px-4 py-1 bg-slate-900 text-white rounded font-bold uppercase text-[9px] tracking-wider cursor-pointer">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mission */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase border-b border-slate-150 pb-2">Mission statement</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mission Heading</label>
              <input type="text" value={missionHeading} onChange={(e) => setMissionHeading(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Content Description</label>
              <textarea rows={4} value={missionContent} onChange={(e) => setMissionContent(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none leading-relaxed" />
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase border-b border-slate-150 pb-2">Vision statement</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vision Heading</label>
              <input type="text" value={visionHeading} onChange={(e) => setVisionHeading(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Content Description</label>
              <textarea rows={4} value={visionContent} onChange={(e) => setThemeVision(e.target.value)} className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none leading-relaxed" />
            </div>
          </div>
        </div>

      </div>

      {/* 4. Core Values CMS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase border-b border-slate-150 pb-2">Company Values</h2>
        
        {values.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {values.map((val, vIdx) => (
              <div key={vIdx} className="border border-slate-200 bg-slate-50 p-3 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-650 shrink-0" />
                    <span className="font-bold text-slate-850">{val.title}</span>
                  </div>
                  <p className="text-slate-500 text-[10px] leading-relaxed">{val.description}</p>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="button" onClick={() => removeValue(vIdx)} className="text-slate-400 hover:text-red-650 p-1 hover:bg-slate-100 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Value Form */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <h4 className="font-bold text-[10px] text-slate-500 uppercase font-mono">Create New Value Item</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Value Title</label>
              <input type="text" placeholder="e.g. Safety First" value={newValueTitle} onChange={(e) => setNewValueTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2.5 py-1" />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Icon Key</label>
              <select value={newValueIcon} onChange={(e) => setNewValueIcon(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-mono">
                <option value="ShieldCheck">ShieldCheck</option>
                <option value="Clock">Clock</option>
                <option value="Wrench">Wrench</option>
                <option value="Award">Award</option>
                <option value="CheckCircle">CheckCircle</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Short description</label>
              <input type="text" placeholder="Explain details..." value={newValueDesc} onChange={(e) => setNewValueDesc(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2.5 py-1" />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button type="button" onClick={addValue} className="px-4 py-1.5 bg-slate-900 text-white rounded font-bold uppercase text-[9px] tracking-wider cursor-pointer">Add Value Item</button>
          </div>
        </div>
      </div>

      {/* 5. Statistics Config */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase border-b border-slate-150 pb-2">Custom Statistics Cards</h2>
        <p className="text-slate-500 text-[10px] -mt-2">Only dynamic numbers added here will display on the frontend about layout.</p>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((st, sIdx) => (
              <div key={sIdx} className="border border-slate-200 bg-slate-50 p-3 rounded-lg flex flex-col justify-between text-center">
                <div>
                  <span className="font-extrabold text-slate-800 text-base">{st.value}</span>
                  <span className="text-slate-450 block text-[9.5px] font-medium leading-tight mt-0.5">{st.label}</span>
                </div>
                <div className="flex justify-center pt-2">
                  <button type="button" onClick={() => removeStat(sIdx)} className="text-slate-400 hover:text-red-650 p-1 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Stat Form */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <h4 className="font-bold text-[10px] text-slate-500 uppercase font-mono">Create New Stat Card</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Value (Numeric / Text)</label>
              <input type="text" placeholder="e.g. 500+" value={newStatValue} onChange={(e) => setNewStatValue(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2.5 py-1" />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Stat Label</label>
              <input type="text" placeholder="e.g. Active Clients" value={newStatLabel} onChange={(e) => setNewStatLabel(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2.5 py-1" />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5">Lucide Icon Key</label>
              <select value={newStatIcon} onChange={(e) => setNewStatIcon(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-mono">
                <option value="Award">Award</option>
                <option value="Users">Users</option>
                <option value="Package">Package</option>
                <option value="Globe">Globe</option>
                <option value="Activity">Activity</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button type="button" onClick={addStat} className="px-4 py-1.5 bg-slate-900 text-white rounded font-bold uppercase text-[9px] tracking-wider cursor-pointer">Add Stat Card</button>
          </div>
        </div>

        {/* Save CTA Panel */}
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
            <span>Save About Us CMS Settings</span>
          </button>
        </div>
      </div>

    </div>
  );

  // Helper inside client state
  function setThemeVision(val: string) {
    setVisionContent(val);
  }
}
