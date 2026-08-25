"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Loader2, ArrowUp, ArrowDown, HelpCircle, CheckCircle2 } from "lucide-react";
import { updateTopBarConfig } from "@/app/actions/admin";

interface TopBarItem {
  id: string;
  type: string; // phone, email, hours, whatsapp, link
  label: string;
  value: string;
  icon: string;
  isEnabled: boolean;
  displayOrder: number;
}

interface TopbarClientProps {
  initialEnable: boolean;
  initialTitle: string;
  initialConfig: string | null;
}

export default function TopbarClient({ initialEnable, initialTitle, initialConfig }: TopbarClientProps) {
  const [enableTopContactBar, setEnableTopContactBar] = useState(initialEnable);
  const [topBarTitle, setTopBarTitle] = useState(initialTitle);
  
  // Parse Items
  const [items, setItems] = useState<TopBarItem[]>(() => {
    if (initialConfig) {
      try {
        return JSON.parse(initialConfig).sort((a: any, b: any) => a.displayOrder - b.displayOrder);
      } catch (e) {
        console.error("Failed parsing topBarConfig:", e);
      }
    }
    return [];
  });

  const [isPending, startTransition] = useTransition();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [itemType, setItemType] = useState("phone");
  const [itemLabel, setItemLabel] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [itemIcon, setItemIcon] = useState("Phone");
  const [itemEnabled, setItemEnabled] = useState(true);

  const openNew = () => {
    setEditingId(null);
    setItemType("phone");
    setItemLabel("");
    setItemValue("");
    setItemIcon("Phone");
    setItemEnabled(true);
    setIsModalOpen(true);
  };

  const openEdit = (item: TopBarItem) => {
    setEditingId(item.id);
    setItemType(item.type);
    setItemLabel(item.label);
    setItemValue(item.value);
    setItemIcon(item.icon);
    setItemEnabled(item.isEnabled);
    setIsModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!itemLabel || !itemValue) {
      alert("Label and Value are required.");
      return;
    }

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, type: itemType, label: itemLabel, value: itemValue, icon: itemIcon, isEnabled: itemEnabled }
            : item
        )
      );
    } else {
      const newItem: TopBarItem = {
        id: Date.now().toString(),
        type: itemType,
        label: itemLabel,
        value: itemValue,
        icon: itemIcon,
        isEnabled: itemEnabled,
        displayOrder: items.length + 1
      };
      setItems((prev) => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to remove this topbar detail?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    // Swap
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    // Re-assign displayOrder
    newItems.forEach((item, idx) => {
      item.displayOrder = idx + 1;
    });

    setItems(newItems);
  };

  const handlePublish = () => {
    startTransition(async () => {
      const res = await updateTopBarConfig({
        enableTopContactBar,
        topBarTitle,
        topBarConfig: JSON.stringify(items)
      });
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">
      
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-lg flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Top Contact Bar configuration updated and published successfully!</span>
        </div>
      )}

      {/* Global Toggle */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Enable Top Contact Bar</label>
          <select
            value={enableTopContactBar ? "true" : "false"}
            onChange={(e) => setEnableTopContactBar(e.target.value === "true")}
            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="true">Yes, show top bar details</option>
            <option value="false">No, hide top bar fully</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Left Announcement Title</label>
          <input
            type="text"
            value={topBarTitle}
            onChange={(e) => setTopBarTitle(e.target.value)}
            disabled={!enableTopContactBar}
            placeholder="e.g. DEALER & IMPORTER"
            className="w-full border border-slate-250 rounded px-2.5 py-1.5 focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      {/* Items list */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase">Topbar Contact Items</h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Customize phone widgets, office hours, and email contact links.</p>
          </div>
          <button
            onClick={openNew}
            disabled={!enableTopContactBar}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>

        {items.length > 0 ? (
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-150">
            {items.map((item, idx) => (
              <div 
                key={item.id} 
                className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                  item.isEnabled ? "bg-white" : "bg-slate-50/50 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-slate-300 font-bold shrink-0">#{idx + 1}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{item.label}</span>
                      <span className="bg-slate-100 text-slate-500 text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-sm">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block truncate mt-0.5">Value: {item.value} • Icon: {item.icon}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Reordering */}
                  <button
                    onClick={() => moveItem(idx, "up")}
                    disabled={idx === 0 || !enableTopContactBar}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, "down")}
                    disabled={idx === items.length - 1 || !enableTopContactBar}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-px h-4.5 bg-slate-200 mx-1.5" />

                  {/* Status Toggle */}
                  <button
                    onClick={() => {
                      setItems((prev) =>
                        prev.map((it) => (it.id === item.id ? { ...it, isEnabled: !it.isEnabled } : it))
                      );
                    }}
                    disabled={!enableTopContactBar}
                    className={`p-1 rounded ${item.isEnabled ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"}`}
                    title={item.isEnabled ? "Disable Item" : "Enable Item"}
                  >
                    {item.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => openEdit(item)}
                    disabled={!enableTopContactBar}
                    className="p-1 hover:bg-slate-100 rounded text-slate-650"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={!enableTopContactBar}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono text-[10px] uppercase tracking-wider">
            No contact bar items added.
          </div>
        )}

        {/* Action Panel */}
        <div className="flex justify-end pt-4 border-t border-slate-150">
          <button
            onClick={handlePublish}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold disabled:opacity-50 cursor-pointer shadow-sm text-[10px] uppercase font-mono tracking-wider"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Publish Contact Bar changes</span>
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Contact Detail" : "New Contact Detail"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Item Type</label>
                <select
                  value={itemType}
                  onChange={(e) => {
                    setItemType(e.target.value);
                    // Match default labels & icons
                    if (e.target.value === "phone") { setItemLabel("Call Us"); setItemIcon("Phone"); }
                    else if (e.target.value === "email") { setItemLabel("Email"); setItemIcon("Mail"); }
                    else if (e.target.value === "hours") { setItemLabel("Hours"); setItemIcon("Clock"); }
                    else if (e.target.value === "whatsapp") { setItemLabel("WhatsApp"); setItemIcon("MessageSquare"); }
                    else { setItemLabel("Link"); setItemIcon("Globe"); }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="phone">Phone Line</option>
                  <option value="email">Email Address</option>
                  <option value="hours">Business Hours</option>
                  <option value="whatsapp">WhatsApp Shortcut</option>
                  <option value="link">Custom URL Link</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Display Label</label>
                <input
                  type="text"
                  required
                  value={itemLabel}
                  onChange={(e) => setItemLabel(e.target.value)}
                  placeholder="e.g. Sales Inquiries"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Display Value / Destination Link</label>
                <input
                  type="text"
                  required
                  value={itemValue}
                  onChange={(e) => setItemValue(e.target.value)}
                  placeholder="e.g. +91 93314 04702"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Lucide Icon Key</label>
                  <select
                    value={itemIcon}
                    onChange={(e) => setItemIcon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono"
                  >
                    <option value="Phone">Phone</option>
                    <option value="Mail">Mail</option>
                    <option value="Clock">Clock</option>
                    <option value="MessageSquare">MessageSquare</option>
                    <option value="Globe">Globe</option>
                    <option value="MapPin">MapPin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Default Status</label>
                  <select
                    value={itemEnabled ? "true" : "false"}
                    onChange={(e) => setItemEnabled(e.target.value === "true")}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
