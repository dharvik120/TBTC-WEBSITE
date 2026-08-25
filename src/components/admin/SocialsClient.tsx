"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Share2, Loader2, CheckCircle2 } from "lucide-react";
import { saveSocialPlatform, deleteSocialPlatform } from "@/app/actions/admin";

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
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);

  const openNew = () => {
    setEditingId(null);
    setName("");
    setIcon("Facebook");
    setUrl("");
    setOrder(socials.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (s: SocialPlatform) => {
    setEditingId(s.id);
    setName(s.platformName);
    setIcon(s.iconName);
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

    startTransition(async () => {
      const res = await saveSocialPlatform(editingId, {
        platformName: name,
        iconName: icon,
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
                  <h3 className="font-extrabold text-slate-850 text-xs">{s.platformName}</h3>
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
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Icon Key</label>
                  <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono cursor-pointer">
                    <option value="Facebook">Facebook</option>
                    <option value="Linkedin">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Youtube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Globe">Globe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Order Index</label>
                  <input type="number" required value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded px-2.5 py-1 focus:outline-none font-mono" />
                </div>
              </div>

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
