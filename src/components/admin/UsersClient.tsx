"use client";

import React, { useState, useTransition } from "react";
import { Users, Plus, X, UserCheck, Loader2 } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface UsersClientProps {
  initialUsers: User[];
}

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [users] = useState<User[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Read-only user lists view
  return (
    <div className="space-y-6 text-xs font-sans max-w-3xl mx-auto">
      
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Console Accounts & Roles</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Manage console credentials access keys and editor levels.</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-150">
          {users.map((u) => (
            <div key={u.id} className="p-3.5 flex items-center justify-between gap-4 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-850 text-[11px] font-mono">{u.username}</span>
                  <span className="bg-blue-50 text-blue-700 text-[8px] font-bold px-1.5 py-0.5 rounded-sm font-mono">{u.role}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Email address: {u.email}</span>
              </div>
              <span className="text-[9.5px] font-mono text-slate-400">Created: {new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
