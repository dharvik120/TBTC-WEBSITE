"use client";

import React, { useState, useTransition } from "react";
import { Inbox, Eye, Trash2, Loader2, X, Save } from "lucide-react";
import { updateInquiryStatus, deleteInquiry } from "@/app/actions/admin";

interface Inquiry {
  id: string;
  name: string;
  companyName: string | null;
  email: string;
  phone: string;
  inquiryType: string;
  relatedProductId: string | null;
  message: string;
  status: string;
  internalNotes: string | null;
  dynamicValues?: string | null;
  createdAt: Date;
}

interface InquiriesClientProps {
  inquiries: Inquiry[];
}

export default function InquiriesClient({ inquiries: initialInquiries }: InquiriesClientProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  
  // Note/Status transition states
  const [isPending, startTransition] = useTransition();
  const [statusVal, setStatusVal] = useState("");
  const [notesVal, setNotesVal] = useState("");

  const handleSelect = (inq: Inquiry) => {
    setSelected(inq);
    setStatusVal(inq.status);
    setNotesVal(inq.internalNotes || "");
  };

  const handleSaveStatusAndNotes = () => {
    if (!selected) return;

    startTransition(async () => {
      const res = await updateInquiryStatus(selected.id, statusVal, notesVal);
      if (res.success) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === selected.id
              ? { ...i, status: statusVal, internalNotes: notesVal }
              : i
          )
        );
        setSelected((prev) => prev ? { ...prev, status: statusVal, internalNotes: notesVal } : null);
        alert("Inquiry status & notes updated successfully!");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry? This action is irreversible.")) return;

    const res = await deleteInquiry(id);
    if (res.success) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  // Export filtered list to Excel (CSV)
  const exportListToExcel = () => {
    const headers = ["Date", "Name", "Company Name", "Email", "Phone", "Inquiry Type", "Message", "Status", "Internal Notes"];
    const rows = filtered.map((inq) => [
      new Date(inq.createdAt).toLocaleString("en-IN"),
      inq.name,
      inq.companyName || "",
      inq.email,
      inq.phone,
      inq.inquiryType,
      (inq.message || "").replace(/"/g, '""'), // escape double quotes
      inq.status,
      (inq.internalNotes || "").replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inquiries_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export filtered list to PDF (print formatted table in new window)
  const exportListToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableRowsHtml = filtered.map((inq) => `
      <tr>
        <td>${new Date(inq.createdAt).toLocaleDateString("en-IN")}</td>
        <td>
          <strong>${inq.name}</strong><br/>
          <small>${inq.companyName || "No Company"}</small>
        </td>
        <td>${inq.email}<br/>${inq.phone}</td>
        <td>${inq.inquiryType}</td>
        <td>${inq.status}</td>
      </tr>
    `).join("");

    const html = `
      <html>
        <head>
          <title>Inquiries List Report</title>
          <style>
            body { font-family: sans-serif; padding: 30px; color: #1e293b; }
            .header { border-bottom: 2px solid #0b3c5d; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 20px; font-weight: bold; color: #0b3c5d; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            th { background: #f8fafc; font-weight: bold; color: #475569; text-transform: uppercase; font-size: 10px; }
            tr:nth-child(even) { background: #f8fafc; }
            .footer { text-align: center; font-size: 9px; color: #94a3b8; margin-top: 40px; border-t: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Shree TBTC - Inquiries Report</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 3px;">Filter: Type=${filterType} | Status=${filterStatus}</div>
            </div>
            <div style="font-size: 10px; color: #64748b;">Generated: ${new Date().toLocaleString("en-IN")}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Contact</th>
                <th>Contact Details</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
          <div class="footer">
            © ${new Date().getFullYear()} Shree TBTC Global Industries.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Export single inquiry to PDF
  const exportSingleToPDF = (inq: Inquiry) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let customFieldsHtml = "";
    if (inq.dynamicValues) {
      try {
        const parsed = JSON.parse(inq.dynamicValues);
        if (parsed && Object.keys(parsed).length > 0) {
          customFieldsHtml = `
            <div class="meta-title" style="margin-top:20px;">Form Specifications</div>
            <table style="width:100%; border-collapse: collapse; margin-bottom: 30px;">
              ${Object.entries(parsed).map(([k, v]) => `
                <tr>
                  <td style="width:200px;font-weight:bold;background:#f8fafc;border:1px solid #e2e8f0;padding:8px;font-size:11px;">${k.toUpperCase()}</td>
                  <td style="border:1px solid #e2e8f0;padding:8px;font-size:11px;">${Array.isArray(v) ? v.join(", ") : String(v)}</td>
                </tr>
              `).join("")}
            </table>
          `;
        }
      } catch(e){}
    }

    const html = `
      <html>
        <head>
          <title>Inquiry Details - ${inq.name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #0b3c5d; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #0b3c5d; text-transform: uppercase; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 4px; }
            .meta-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
            .message-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 4px; margin-bottom: 30px; white-space: pre-wrap; font-size: 12px; line-height: 1.6; }
            .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Shree TBTC - Customer Inquiry</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Reference ID: ${inq.id}</div>
          </div>
          <div class="meta">
            <div class="meta-box">
              <div class="meta-title">Buyer Information</div>
              <div style="font-size: 13px;"><strong>${inq.name}</strong></div>
              ${inq.companyName ? `<div style="font-size: 11px; margin-top:3px;">Company: ${inq.companyName}</div>` : ""}
              <div style="font-size: 11px;">Email: ${inq.email}</div>
              <div style="font-size: 11px;">Phone: ${inq.phone}</div>
            </div>
            <div class="meta-box">
              <div class="meta-title">Inquiry Log</div>
              <div style="font-size: 11px;">Type: <strong>${inq.inquiryType}</strong></div>
              <div style="font-size: 11px;">Status: <strong>${inq.status}</strong></div>
              <div style="font-size: 11px;">Date: ${new Date(inq.createdAt).toLocaleString("en-IN")}</div>
            </div>
          </div>
          ${customFieldsHtml}
          <div class="meta-title">Inquiry Message</div>
          <div class="message-box">${inq.message}</div>
          ${inq.internalNotes ? `
            <div class="meta-title">Internal Sales Notes</div>
            <div class="message-box" style="border-left: 4px solid #64748b; background: #fafafa;">${inq.internalNotes}</div>
          ` : ""}
          <div class="footer">
            © ${new Date().getFullYear()} Shree TBTC Global Industries. Generated on ${new Date().toLocaleDateString("en-IN")}.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Filter logic
  const filtered = inquiries.filter((i) => {
    const matchType = filterType === "ALL" || i.inquiryType === filterType;
    const matchStatus = filterStatus === "ALL" || i.status === filterStatus;
    return matchType && matchStatus;
  });

  // Parse dynamic values of the selected inquiry
  let parsedDynamic: Record<string, any> | null = null;
  if (selected?.dynamicValues) {
    try {
      parsedDynamic = JSON.parse(selected.dynamicValues);
    } catch (e) {
      console.error("Failed to parse dynamicValues:", e);
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Filter Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono font-bold uppercase">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="GENERAL">General</option>
              <option value="TECHNICAL">Technical</option>
              <option value="SALES">Sales</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono font-bold uppercase">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-mono text-slate-500">
            Showing {filtered.length} of {inquiries.length} Inquiries
          </div>
          <button
            onClick={exportListToExcel}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold font-mono uppercase cursor-pointer transition-colors shadow-sm"
            title="Export List to CSV/Excel"
          >
            Excel
          </button>
          <button
            onClick={exportListToPDF}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold font-mono uppercase cursor-pointer transition-colors shadow-sm"
            title="Export List to PDF"
          >
            PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* List table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 font-mono uppercase">
                    <th className="py-3 px-4 font-bold">Contact / Company</th>
                    <th className="py-3 px-4 font-bold">Inquiry Details</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filtered.map((inq) => (
                    <tr 
                      key={inq.id} 
                      className={`hover:bg-slate-50/50 cursor-pointer ${
                        selected?.id === inq.id ? "bg-slate-50/80 font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(inq)}
                    >
                      <td className="py-4.5 px-4">
                        <p className="font-bold text-slate-900">{inq.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{inq.companyName || "No Company"}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{inq.email} | {inq.phone}</p>
                      </td>
                      <td className="py-4.5 px-4">
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm font-mono text-[9px] font-bold uppercase">
                          {inq.inquiryType}
                        </span>
                        <p className="text-slate-500 mt-2 line-clamp-1 truncate max-w-[200px]">{inq.message}</p>
                      </td>
                      <td className="py-4.5 px-4">
                        <span className={`px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold uppercase ${
                          inq.status === "NEW" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          inq.status === "CONTACTED" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                          inq.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          "bg-slate-50 text-slate-500 border border-slate-200"
                        }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleSelect(inq)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-600"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id)}
                            className="p-1.5 bg-slate-50 hover:bg-red-50 hover:border-red-200 rounded text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 text-center text-slate-400 text-xs font-mono">
              NO INQUIRIES MATCHING CURRENT FILTERS
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                  Inquiry Details
                </h3>
                <button 
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Contact Card */}
              <div className="text-xs space-y-2">
                <p className="text-slate-400 font-mono text-[9px] uppercase font-bold">Customer Contact</p>
                <div className="bg-slate-50 rounded border border-slate-150 p-3 space-y-2 font-mono">
                  <p className="font-bold text-slate-800 text-sm font-sans">{selected.name}</p>
                  {selected.companyName && <p className="text-slate-600">Company: {selected.companyName}</p>}
                  <p className="text-slate-600">Email: <a href={`mailto:${selected.email}`} className="underline hover:text-slate-900">{selected.email}</a></p>
                  <p className="text-slate-600">Phone: <a href={`tel:${selected.phone}`} className="underline hover:text-slate-900">{selected.phone}</a></p>
                  <p className="text-slate-650 text-[10px] pt-1 border-t border-slate-200">
                    Logged: {new Date(selected.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Custom dynamic values details */}
              {parsedDynamic && Object.keys(parsedDynamic).length > 0 && (
                <div className="text-xs space-y-2">
                  <p className="text-slate-400 font-mono text-[9px] uppercase font-bold">Custom Form Fields</p>
                  <div className="bg-slate-50 rounded border border-slate-150 p-3 space-y-2 font-mono">
                    {Object.entries(parsedDynamic).map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-150/60 pb-1.5 last:border-0 last:pb-0 gap-1 text-[11px]">
                        <span className="text-slate-500 font-bold uppercase">{key}</span>
                        <span className="text-slate-800 font-sans text-right">{Array.isArray(val) ? val.join(", ") : String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Details */}
              <div className="text-xs space-y-2">
                <p className="text-slate-400 font-mono text-[9px] uppercase font-bold">Query message</p>
                <div className="bg-slate-50 rounded border border-slate-150 p-3 text-slate-700 whitespace-pre-line leading-relaxed">
                  {selected.message}
                </div>
              </div>

              {/* Status and Notes Editing */}
              <div className="space-y-4 pt-4 border-t border-slate-150 text-xs">
                {/* Status selector */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Process Status
                  </label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="NEW">New Lead</option>
                    <option value="CONTACTED">Contacted Customer</option>
                    <option value="IN_PROGRESS">In Progress / Review</option>
                    <option value="CLOSED">Closed / Resolved</option>
                  </select>
                </div>

                {/* Internal notes */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Internal Sales Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notesVal}
                    onChange={(e) => setNotesVal(e.target.value)}
                    placeholder="Log conversation history, quotation dates, or technical updates here..."
                    className="w-full border border-slate-200 rounded px-2.5 py-2 focus:outline-none resize-y"
                  />
                </div>

                {/* Save button */}
                <button
                  onClick={handleSaveStatusAndNotes}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold uppercase text-[10px] disabled:opacity-50 font-mono cursor-pointer shadow-sm"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Updates</span>
                </button>

                {/* Print details button */}
                <button
                  onClick={() => exportSingleToPDF(selected)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-bold uppercase text-[10px] font-mono cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Detail PDF Report</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-md border border-dashed border-slate-300 py-16 px-4 text-center font-mono text-xs text-slate-450">
              SELECT AN INQUIRY TO VIEW DETAILS AND LOG ACTIONS
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
