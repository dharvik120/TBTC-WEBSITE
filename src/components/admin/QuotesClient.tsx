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
        <div className="text-xs font-mono text-slate-500">
          Showing {filtered.length} of {quotes.length} RFQs
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
