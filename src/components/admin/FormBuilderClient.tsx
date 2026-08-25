"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, FormInput, Loader2, CheckCircle2 } from "lucide-react";
import { saveFormField, deleteFormField } from "@/app/actions/admin";

interface FormField {
  id: string;
  formType: string;
  label: string;
  name: string;
  type: string;
  placeholder: string | null;
  isRequired: boolean;
  options: string | null;
  validation: string | null;
  helpText: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface FormBuilderClientProps {
  initialFields: FormField[];
}

export default function FormBuilderClient({ initialFields }: FormBuilderClientProps) {
  const [selectedForm, setSelectedForm] = useState("GENERAL"); // GENERAL, PRODUCT, CONTACT
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [label, setLabel] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("TEXT");
  const [placeholder, setPlaceholder] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState("");
  const [helpText, setHelpText] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const activeFields = fields
    .filter((f) => f.formType === selectedForm)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const openNew = () => {
    setEditingId(null);
    setLabel("");
    setName("");
    setType("TEXT");
    setPlaceholder("");
    setIsRequired(false);
    setOptions("");
    setHelpText("");
    setDisplayOrder(activeFields.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (f: FormField) => {
    setEditingId(f.id);
    setLabel(f.label);
    setName(f.name);
    setType(f.type);
    setPlaceholder(f.placeholder || "");
    setIsRequired(f.isRequired);
    setOptions(f.options || "");
    setHelpText(f.helpText || "");
    setDisplayOrder(f.displayOrder);
    setIsActive(f.isActive);
    setIsModalOpen(true);
  };

  const handleSaveField = () => {
    if (!label || !name) {
      alert("Label and Identifier Name are required.");
      return;
    }

    startTransition(async () => {
      const res = await saveFormField(editingId, {
        formType: selectedForm,
        label,
        name: name.replace(/\s+/g, ""), // clean camelCase name
        type,
        placeholder: placeholder || null,
        isRequired,
        options: options || null,
        validation: null,
        helpText: helpText || null,
        displayOrder,
        isActive
      });

      if (res.success) {
        alert("Form field configuration saved!");
        window.location.reload();
      }
    });
  };

  const handleDeleteField = (id: string) => {
    if (confirm("Delete this form field? Submitted data associated with this label will no longer map.")) {
      startTransition(async () => {
        const res = await deleteFormField(id);
        if (res.success) {
          setFields((prev) => prev.filter((f) => f.id !== id));
        }
      });
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">
      
      {/* Selector tab */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between gap-6">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Form Template</label>
          <div className="flex gap-2">
            {["GENERAL", "PRODUCT", "CONTACT"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedForm(type)}
                className={`px-4 py-2 border rounded font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                  selectedForm === type 
                    ? "bg-slate-900 text-white border-slate-900" 
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-350"
                }`}
              >
                {type} Inquiry Form
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fields List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <FormInput className="w-4 h-4 text-slate-400" />
              <span>Form Fields Configuration</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Customize input elements, mark required fields, and order listings for {selectedForm} form.</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Field Element</span>
          </button>
        </div>

        {activeFields.length > 0 ? (
          <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-150">
            {activeFields.map((f) => (
              <div 
                key={f.id} 
                className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                  f.isActive ? "bg-white" : "bg-slate-50 opacity-60"
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">{f.label}</span>
                    {f.isRequired && (
                      <span className="bg-red-50 text-red-650 text-[8px] font-mono font-bold px-1 py-0.5 rounded-sm">Required</span>
                    )}
                    <span className="bg-slate-100 text-slate-500 text-[8px] font-mono px-1 py-0.5 rounded-sm uppercase">{f.type}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Identifier name: {f.name} • Order: {f.displayOrder}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(f)} className="p-1 hover:bg-slate-100 rounded text-slate-650">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteField(f.id)} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-slate-200 rounded-lg text-center text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            No fields defined. Form will fallback to standard default values.
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-md p-6 shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                {editingId ? "Edit Form Field" : "Add Form Field"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-650">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Field Label</label>
                  <input type="text" required value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. GST Number" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Variable Name (CamelCase)</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. gstNumber" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Field Input Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer">
                    <option value="TEXT">Short Text</option>
                    <option value="EMAIL">Email Address</option>
                    <option value="PHONE">Phone Number</option>
                    <option value="NUMBER">Number</option>
                    <option value="TEXTAREA">Multi-line Textarea</option>
                    <option value="SELECT">Select Dropdown</option>
                    <option value="RADIO">Radio Buttons</option>
                    <option value="CHECKBOX">Checkboxes</option>
                    <option value="DATE">Calendar Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Display Order</label>
                  <input type="number" required value={displayOrder} onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)} className="w-full border border-slate-200 rounded px-2.5 py-1 focus:outline-none font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Placeholder Text (Optional)</label>
                <input type="text" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder="e.g. Enter GSTIN..." className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
              </div>

              {/* Options list for select/radio/checkbox */}
              {["SELECT", "RADIO", "CHECKBOX"].includes(type) && (
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Selection Options (Comma-separated)</label>
                  <input type="text" value={options} onChange={(e) => setOptions(e.target.value)} placeholder="e.g. Option 1, Option 2, Option 3" className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">Help Text (Optional)</label>
                <input type="text" value={helpText} onChange={(e) => setHelpText(e.target.value)} placeholder="Help instructions displayed below field..." className="w-full border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none" />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-150">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 font-bold text-slate-500 uppercase select-none cursor-pointer">
                    <input type="checkbox" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} className="w-4 h-4 rounded text-primary border-slate-300 cursor-pointer" />
                    <span>Required Field</span>
                  </label>
                  <label className="flex items-center gap-2 font-bold text-slate-500 uppercase select-none cursor-pointer">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-primary border-slate-300 cursor-pointer" />
                    <span>Active Element</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded text-[11px] font-bold text-slate-650 hover:bg-slate-50 cursor-pointer font-mono uppercase tracking-wider">Cancel</button>
                  <button type="button" onClick={handleSaveField} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold cursor-pointer shadow-sm font-mono uppercase tracking-wider">Save Field</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
