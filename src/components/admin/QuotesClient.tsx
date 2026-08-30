"use client";

import React, { useState, useTransition } from "react";
import { FileSpreadsheet, Eye, Trash2, Loader2, X, Check, Save, ShoppingCart, User, MapPin } from "lucide-react";
import { updateQuoteStatus, deleteQuoteRequest } from "@/app/actions/admin";

interface QuoteRequestItem {
  id: string;
  quantity: number;
  note: string | null;
  product: {
    name: string;
    modelNumber: string | null;
  };
}

interface QuoteRequest {
  id: string;
  name: string;
  companyName: string | null;
  email: string;
  phone: string;
  city: string | null;
  state: string | null;
  message: string | null;
  status: string;
  internalNotes: string | null;
  createdAt: Date;
  items: QuoteRequestItem[];
}

interface QuotesClientProps {
  quotes: QuoteRequest[];
}

export default function QuotesClient({ quotes: initialQuotes }: QuotesClientProps) {
  const [quotes, setQuotes] = useState<QuoteRequest[]>(initialQuotes);
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  
  const [isPending, startTransition] = useTransition();
  const [statusVal, setStatusVal] = useState("");
  const [notesVal, setNotesVal] = useState("");

  const handleSelect = (qr: QuoteRequest) => {
    setSelected(qr);
    setStatusVal(qr.status);
    setNotesVal(qr.internalNotes || "");
  };

  const handleSaveStatusAndNotes = () => {
    if (!selected) return;

    startTransition(async () => {
      const res = await updateQuoteStatus(selected.id, statusVal, notesVal);
      if (res.success) {
        setQuotes((prev) =>
          prev.map((q) =>
            q.id === selected.id
              ? { ...q, status: statusVal, internalNotes: notesVal }
              : q
          )
        );
        setSelected((prev) => prev ? { ...prev, status: statusVal, internalNotes: notesVal } : null);
        alert("Quote request updated successfully!");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote request? This cannot be undone.")) return;

    const res = await deleteQuoteRequest(id);
    if (res.success) {
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  // Export filtered list to Excel (CSV)
  const exportListToExcel = () => {
    const headers = ["Date", "Name", "Company Name", "Email", "Phone", "City/State", "Items Count", "Products List", "Status", "Cover Message", "Internal Notes"];
    const rows = filtered.map((q) => {
      const itemsList = q.items.map((i) => `${i.product.name}${i.product.modelNumber ? ` [M/N: ${i.product.modelNumber}]` : ""} (Qty: ${i.quantity})`).join("; ");
      return [
        new Date(q.createdAt).toLocaleString("en-IN"),
        q.name,
        q.companyName || "",
        q.email,
        q.phone,
        `${q.city || ""}${q.city && q.state ? ", " : ""}${q.state || ""}`,
        q.items.reduce((sum, i) => sum + i.quantity, 0),
        itemsList.replace(/"/g, '""'),
        q.status,
        (q.message || "").replace(/"/g, '""'),
        (q.internalNotes || "").replace(/"/g, '""')
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `quotes_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export filtered list to PDF table report
  const exportListToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tableRowsHtml = filtered.map((q) => `
      <tr>
        <td>${new Date(q.createdAt).toLocaleDateString("en-IN")}</td>
        <td>
          <strong>${q.name}</strong><br/>
          <small>${q.companyName || "No Company"}</small>
        </td>
        <td>${q.email}<br/>${q.phone}</td>
        <td>${q.items.reduce((sum, i) => sum + i.quantity, 0)} Items (${q.items.length} types)</td>
        <td>${q.status}</td>
      </tr>
    `).join("");

    const html = `
      <html>
        <head>
          <title>Quote Requests Report</title>
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
              <div class="title">Shree TBTC - RFQ Quotes Report</div>
              <div style="font-size: 10px; color: #64748b; margin-top: 3px;">Filter: Status=${filterStatus}</div>
            </div>
            <div style="font-size: 10px; color: #64748b;">Generated: ${new Date().toLocaleString("en-IN")}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Buyer</th>
                <th>Contact Info</th>
                <th>Total Items</th>
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

  // Export single Quote request details invoice/sheet PDF
  const exportSingleToPDF = (q: QuoteRequest) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsTableRows = q.items.map((item) => `
      <tr>
        <td style="border:1px solid #e2e8f0;padding:10px;font-size:11px;">
          <strong>${item.product.name}</strong>
          ${item.product.modelNumber ? `<br/><span style="color:#64748b;font-size:10px;">Model: ${item.product.modelNumber}</span>` : ""}
        </td>
        <td style="border:1px solid #e2e8f0;padding:10px;font-size:11px;text-align:center;font-weight:bold;">${item.quantity}</td>
        <td style="border:1px solid #e2e8f0;padding:10px;font-size:11px;color:#475569;">${item.note || "--"}</td>
      </tr>
    `).join("");

    const html = `
      <html>
        <head>
          <title>Quotation Request - ${q.name}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #0b3c5d; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #0b3c5d; text-transform: uppercase; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 4px; }
            .meta-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 30px; }
            th { border: 1px solid #e2e8f0; background: #f8fafc; padding: 10px; text-align: left; font-size: 10px; font-weight: bold; color: #475569; text-transform: uppercase; }
            .message-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 4px; margin-bottom: 30px; white-space: pre-wrap; font-size: 12px; line-height: 1.6; }
            .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Shree TBTC - Quotation Request (RFQ)</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Request ID: ${q.id}</div>
          </div>
          <div class="meta">
            <div class="meta-box">
              <div class="meta-title">Buyer Information</div>
              <div style="font-size: 13px;"><strong>${q.name}</strong></div>
              ${q.companyName ? `<div style="font-size: 11px; margin-top:3px;">Company: ${q.companyName}</div>` : ""}
              <div style="font-size: 11px;">Email: ${q.email}</div>
              <div style="font-size: 11px;">Phone: ${q.phone}</div>
              ${(q.city || q.state) ? `<div style="font-size: 11px;">Location: ${q.city || ""}${q.city && q.state ? ", " : ""}${q.state || ""}</div>` : ""}
            </div>
            <div class="meta-box">
              <div class="meta-title">Quotation Details</div>
              <div style="font-size: 11px;">Status: <strong>${q.status}</strong></div>
              <div style="font-size: 11px;">Items Count: <strong>${q.items.reduce((sum, i) => sum + i.quantity, 0)} Items</strong></div>
              <div style="font-size: 11px;">Date Received: ${new Date(q.createdAt).toLocaleString("en-IN")}</div>
            </div>
          </div>

          <div class="meta-title">Requested Products & Specifications</div>
          <table>
            <thead>
              <tr>
                <th>Product Description</th>
                <th style="text-align:center;width:80px;">Qty</th>
                <th>Specifications / Notes</th>
              </tr>
            </thead>
            <tbody>
              ${itemsTableRows}
            </tbody>
          </table>

          ${q.message ? `
            <div class="meta-title">Buyer Note/Message</div>
            <div class="message-box">${q.message}</div>
          ` : ""}

          ${q.internalNotes ? `
            <div class="meta-title">Internal Commercial Notes</div>
            <div class="message-box" style="border-left: 4px solid #64748b; background: #fafafa;">${q.internalNotes}</div>
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

  // Filter quotes
  const filtered = quotes.filter((q) => {
    return filterStatus === "ALL" || q.status === filterStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white border border-slate-200 p-4 rounded-md shadow-sm">
        <div className="flex items-center gap-1.5 text-xs">
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
            <option value="QUOTED">Quoted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-mono text-slate-500">
            Showing {filtered.length} of {quotes.length} RFQs
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
        
        {/* Table Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 font-mono uppercase">
                    <th className="py-3 px-4 font-bold">Buyer / Company</th>
                    <th className="py-3 px-4 font-bold">Items Count</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filtered.map((qr) => (
                    <tr 
                      key={qr.id}
                      className={`hover:bg-slate-50/50 cursor-pointer ${
                        selected?.id === qr.id ? "bg-slate-50/80 font-semibold" : ""
                      }`}
                      onClick={() => handleSelect(qr)}
                    >
                      <td className="py-4.5 px-4">
                        <p className="font-bold text-slate-900">{qr.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{qr.companyName || "No Company"}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{qr.email} | {qr.phone}</p>
                      </td>
                      <td className="py-4.5 px-4">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-650 px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-slate-200">
                          <ShoppingCart className="w-3 h-3 text-slate-500" />
                          <span>{qr.items.reduce((sum, i) => sum + i.quantity, 0)} Items ({qr.items.length} unique)</span>
                        </span>
                      </td>
                      <td className="py-4.5 px-4">
                        <span className={`px-2 py-0.5 rounded-sm font-mono text-[9px] font-bold uppercase ${
                          qr.status === "NEW" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          qr.status === "CONTACTED" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                          qr.status === "IN_PROGRESS" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          qr.status === "QUOTED" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          "bg-slate-50 text-slate-500 border border-slate-200"
                        }`}>
                          {qr.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleSelect(qr)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-600"
                            title="View RFQ"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(qr.id)}
                            className="p-1.5 bg-slate-50 hover:bg-red-50 hover:border-red-200 rounded text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Request"
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
              NO QUOTE REQUESTS FOUND
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                <h3 className="font-extrabold text-slate-800 text-sm font-mono uppercase tracking-wider">
                  RFQ Details
                </h3>
                <button
                  onClick={() => setSelected(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Customer Info Card */}
              <div className="text-xs space-y-2">
                <p className="text-slate-400 font-mono text-[9px] uppercase font-bold">Buyer Details</p>
                <div className="bg-slate-50 rounded border border-slate-150 p-3 space-y-2 font-mono">
                  <p className="font-bold text-slate-800 text-sm font-sans">{selected.name}</p>
                  {selected.companyName && <p className="text-slate-650">Company: {selected.companyName}</p>}
                  <p className="text-slate-650">Email: <a href={`mailto:${selected.email}`} className="underline hover:text-slate-900">{selected.email}</a></p>
                  <p className="text-slate-650">Phone: <a href={`tel:${selected.phone}`} className="underline hover:text-slate-900">{selected.phone}</a></p>
                  
                  {/* Location info */}
                  {(selected.city || selected.state) && (
                    <div className="flex gap-1 items-start text-slate-600 pt-1 border-t border-slate-200/50">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selected.city}{selected.city && selected.state ? ", " : ""}{selected.state}</span>
                    </div>
                  )}

                  <p className="text-slate-500 text-[10px] pt-1">
                    Received: {new Date(selected.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Message */}
              {selected.message && (
                <div className="text-xs space-y-2">
                  <p className="text-slate-400 font-mono text-[9px] uppercase font-bold">Cover Message</p>
                  <div className="bg-slate-50 rounded border border-slate-150 p-3 text-slate-700 whitespace-pre-line">
                    {selected.message}
                  </div>
                </div>
              )}

              {/* Selected Items list */}
              <div className="text-xs space-y-2">
                <p className="text-slate-400 font-mono text-[9px] uppercase font-bold">Requested Materials</p>
                <div className="divide-y divide-slate-150 border border-slate-150 rounded overflow-hidden">
                  {selected.items.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 font-sans truncate">{item.product.name}</p>
                        {item.product.modelNumber && (
                          <p className="text-[10px] font-mono text-slate-500 mt-0.5">M/N: {item.product.modelNumber}</p>
                        )}
                        {item.note && (
                          <p className="text-[10px] text-slate-500 mt-1 italic bg-amber-50/50 px-1.5 py-0.5 rounded border border-amber-100/30">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                      <span className="font-mono font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded shrink-0">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Notes */}
              <div className="space-y-4 pt-4 border-t border-slate-150 text-xs">
                
                {/* Status */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Process Status
                  </label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="NEW">New RFQ</option>
                    <option value="CONTACTED">Contacted Customer</option>
                    <option value="IN_PROGRESS">Evaluating Costs</option>
                    <option value="QUOTED">Commercial Proposal Sent</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                {/* Internal notes */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase mb-1">
                    Internal Logging Notes
                  </label>
                  <textarea
                    rows={4}
                    value={notesVal}
                    onChange={(e) => setNotesVal(e.target.value)}
                    placeholder="Log quotation details, margin ratios, or follow-up timelines..."
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
                  <span>Save RFQ Updates</span>
                </button>

                {/* Print details button */}
                <button
                  onClick={() => exportSingleToPDF(selected)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-bold uppercase text-[10px] font-mono cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print RFQ PDF Report</span>
                </button>

              </div>

            </div>
          ) : (
            <div className="bg-slate-50 rounded-md border border-dashed border-slate-300 py-16 px-4 text-center font-mono text-xs text-slate-450">
              SELECT A QUOTATION REQUEST TO LOG PRICES AND CONTACT STATUS
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
