"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Share2, Loader2, CheckCircle2 } from "lucide-react";
import { saveSocialPlatform, deleteSocialPlatform } from "@/app/actions/admin";

const renderSocialIcon = (iconName: string) => {
  const name = iconName ? iconName.toLowerCase() : "";
  switch (name) {
    case "facebook":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "github":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case "pinterest":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    case "globe":
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
  }
};

interface SocialPlatform {
  id: string;
  platformName: string;
  iconName: string;
  profileUrl: string;
  displayOrder: number;
  isActive: boolean;
}

interface SocialsClientProps {
  initialSocials: SocialPlatform[];
}

export default function SocialsClient({ initialSocials }: SocialsClientProps) {
  const [socials, setSocials] = useState<SocialPlatform[]>(initialSocials.sort((a, b) => a.displayOrder - b.displayOrder));
  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Facebook");
  const [customIconName, setCustomIconName] = useState("");
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);

  const openNew = () => {
    setEditingId(null);
    setName("");
    setIcon("Facebook");
    setCustomIconName("");
    setUrl("");
    setOrder(socials.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (s: SocialPlatform) => {
    setEditingId(s.id);
    setName(s.platformName);
    const builtInIcons = ["Facebook", "Linkedin", "Twitter", "Youtube", "Instagram", "Whatsapp", "Github", "Tiktok", "Pinterest", "Globe"];
    if (builtInIcons.includes(s.iconName)) {
      setIcon(s.iconName);
      setCustomIconName("");
    } else {
      setIcon("Custom");
      setCustomIconName(s.iconName);
    }
    setUrl(s.profileUrl);
    setOrder(s.displayOrder);
    setActive(s.isActive);
    setIsModalOpen(true);
  };

  const handleSaveSocial = () => {
    if (!name || !url) {
      alert("Platform Name and Profile URL are required.");
      return;
    }

    const finalIcon = icon === "Custom" ? customIconName : icon;
    if (!finalIcon) {
      alert("Please specify a custom icon name.");
      return;
    }

    startTransition(async () => {
      const res = await saveSocialPlatform(editingId, {
        platformName: name,
        iconName: finalIcon,
        profileUrl: url,
        displayOrder: order,
        isActive: active
      });

      if (res.success) {
        alert("Social profile saved successfully!");
        window.location.reload();
      }
    });
  };

  const handleDeleteSocial = (id: string) => {
    if (confirm("Delete this social connection?")) {
      startTransition(async () => {
        const res = await deleteSocialPlatform(id);
        if (res.success) {
          setSocials((prev) => prev.filter((s) => s.id !== id));
        }
      });
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Social platforms channels updated successfully!</span>
        </div>
      )}

      {/* Social list */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>Social Media Accounts</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Connect Facebook, LinkedIn, Twitter and other brand profiles to website widgets.</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Profile</span>
          </button>
        </div>

        {socials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {socials.map((s) => (
              <div 
                key={s.id} 
                className={`border border-slate-200 p-4 rounded-lg bg-slate-50 flex flex-col justify-between space-y-3 ${
                  s.isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="bg-slate-200 text-slate-700 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded-sm uppercase">Order: {s.displayOrder}</span>
                    <span className="bg-blue-50 text-blue-700 text-[8px] font-bold px-1.5 py-0.5 rounded-sm font-mono uppercase">{s.iconName}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1.5">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                      {renderSocialIcon(s.iconName)}
                    </div>
                    <h3 className="font-extrabold text-slate-850 text-xs">{s.platformName}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block truncate">{s.profileUrl}</span>
                </div>

                <div className="flex justify-end gap-1.5 border-t border-slate-150 pt-2.5">
                  <button type="button" onClick={() => openEdit(s)} className="p-1 hover:bg-slate-200 text-slate-650 rounded">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDeleteSocial(s.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No social accounts linked.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Social Connection" : "Connect Social Profile"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Platform Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. LinkedIn" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Profile Link URL</label>
                <input type="text" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="e.g. https://linkedin.com/company/shreetbtc" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Icon Type</label>
                  <select 
                    value={icon} 
                    onChange={(e) => setIcon(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono cursor-pointer text-[11px]"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="Linkedin">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Youtube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Whatsapp">WhatsApp</option>
                    <option value="Github">GitHub</option>
                    <option value="Tiktok">TikTok</option>
                    <option value="Pinterest">Pinterest</option>
                    <option value="Globe">Globe / Website</option>
                    <option value="Custom">Custom Lucide Icon...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Order Index</label>
                  <input type="number" required value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded px-2.5 py-1 focus:outline-none font-mono" />
                </div>
              </div>

              {icon === "Custom" && (
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Custom Lucide Icon Name</label>
                  <input 
                    type="text" 
                    required 
                    value={customIconName} 
                    onChange={(e) => setCustomIconName(e.target.value)} 
                    placeholder="e.g. ShieldCheck, Send, MessageSquare" 
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" 
                  />
                  <p className="text-[9px] text-slate-450 mt-1 font-mono">Enter any valid PascalCase name from Lucide icon directory.</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                <div>
                  <label className="flex items-center gap-2 font-bold text-slate-500 uppercase select-none cursor-pointer">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-4 h-4 rounded text-primary border-slate-300 cursor-pointer" />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer font-mono uppercase tracking-wider">Cancel</button>
                  <button type="button" onClick={handleSaveSocial} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm font-mono uppercase tracking-wider">Save Connection</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
