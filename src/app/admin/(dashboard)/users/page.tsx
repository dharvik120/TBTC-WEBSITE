import React from "react";
import prisma from "@/lib/prisma";
import UsersClient from "@/components/admin/UsersClient";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Console user credentials CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Display console users, role privileges, email tags and profiles timelines.
          </p>
        </div>
      </div>

      <UsersClient initialUsers={users} />
    </div>
  );
}
