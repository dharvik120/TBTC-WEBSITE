import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, ShieldAlert, Cpu } from "lucide-react";
import { adminLogout } from "@/app/actions/admin";
import AdminSidebarLinks from "@/components/AdminSidebarLinks";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      
      {/* Sidebar Panel */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shrink-0 border-r border-slate-900 grid-pattern">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-center px-6 border-b border-slate-900 bg-slate-950/80">
          <img src="/images/logo.png" alt="STBT Console" className="h-10 w-auto object-contain bg-white rounded p-1" />
        </div>

        {/* Links */}
        <AdminSidebarLinks />

        {/* Logout at bottom */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/50">
          <div className="flex items-center justify-between mb-3 px-2 text-xs font-mono text-slate-500">
            <span>USER: {session.username}</span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-red-400 hover:text-white hover:bg-red-950/60 rounded border border-transparent hover:border-red-900 transition-all font-mono uppercase cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>

      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Console Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <h2 className="text-sm font-bold text-slate-800 font-mono uppercase tracking-wider">
            Administrative Control Panel
          </h2>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">Node: Local Dev</span>
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-primary" style={{ color: "var(--secondary-color)" }} />
              <span>{session.role} STATUS</span>
            </div>
          </div>
        </header>

        {/* Dashboard Pages wrapper */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-100">
          {children}
        </main>

      </div>
    </div>
  );
}
