import React from "react";
import prisma from "@/lib/prisma";
import UsersClient from "@/components/admin/UsersClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  // Strictly verify Super Admin role status
  if (session.role !== "SUPER_ADMIN") {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4 shadow-sm font-sans">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h1 className="text-lg font-bold text-slate-800 font-mono uppercase tracking-tight">Access Denied</h1>
        <p className="text-slate-500 text-xs leading-relaxed">
          You do not have permission to view or manage console credentials. This sector is restricted to Super Administrators.
        </p>
        <div className="pt-4">
          <Link
            href="/admin"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-mono transition-all inline-block no-underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Fetch all users and role config privileges
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  const configs = await prisma.roleConfig.findMany();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-250">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
          Console user credentials CMS
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Create console users, assign editor/admin privileges, and specify role access configurations.
        </p>
      </div>

      <UsersClient initialUsers={users} initialConfigs={configs} currentUserId={session.userId} />
    </div>
  );
}
