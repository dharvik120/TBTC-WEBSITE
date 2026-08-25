"use client";

import React, { useState, useTransition } from "react";
import { Users, Plus, Trash2, Shield, Settings, Key, AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { createUser, deleteUser, updateRoleConfig } from "@/app/actions/admin";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface RoleConfig {
  role: string;
  canEditSettings: boolean;
  canEditProducts: boolean;
  canEditDownloads: boolean;
  canEditBlogs: boolean;
  canEditForms: boolean;
  canEditCustomPages: boolean;
}

interface UsersClientProps {
  initialUsers: User[];
  initialConfigs: RoleConfig[];
  currentUserId: string;
}

export default function UsersClient({ initialUsers, initialConfigs, currentUserId }: UsersClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [configs, setConfigs] = useState<RoleConfig[]>(initialConfigs);
  const [isPending, startTransition] = useTransition();

  // Create User State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("ADMIN");
  const [showPassword, setShowPassword] = useState(false);

  // Status message
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Role Configuration Editing State (local copies of checkboxes)
  const [roleConfigsState, setRoleConfigsState] = useState<{ [roleName: string]: RoleConfig }>(() => {
    const states: { [roleName: string]: RoleConfig } = {};
    // Ensure we have configs for ADMIN and EDITOR
    ["ADMIN", "EDITOR"].forEach((role) => {
      const existing = initialConfigs.find((c) => c.role === role);
      states[role] = existing || {
        role,
        canEditSettings: role === "ADMIN",
        canEditProducts: true,
        canEditDownloads: true,
        canEditBlogs: true,
        canEditForms: role === "ADMIN",
        canEditCustomPages: role === "ADMIN",
      };
    });
    return states;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await createUser({
        username: newUsername,
        email: newEmail,
        passwordPass: newPassword,
        role: newRole,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(`User '${newUsername}' registered successfully.`);
        if (res.user) {
          setUsers([res.user as unknown as User, ...users]);
        }
        // Reset form
        setNewUsername("");
        setNewEmail("");
        setNewPassword("");
        setNewRole("ADMIN");
        setIsAddModalOpen(false);
      }
    });
  };

  const handleDeleteUser = (id: string, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user account '${username}'?`)) {
      return;
    }
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await deleteUser(id);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(`Account '${username}' has been deleted.`);
        setUsers(users.filter((u) => u.id !== id));
      }
    });
  };

  const handleConfigCheckboxChange = (role: string, field: keyof Omit<RoleConfig, "role">) => {
    setRoleConfigsState((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: !prev[role][field],
      },
    }));
  };

  const handleSaveRoleConfig = (role: string) => {
    setError(null);
    setSuccess(null);

    const configToSave = roleConfigsState[role];

    startTransition(async () => {
      const res = await updateRoleConfig(role, {
        canEditSettings: configToSave.canEditSettings,
        canEditProducts: configToSave.canEditProducts,
        canEditDownloads: configToSave.canEditDownloads,
        canEditBlogs: configToSave.canEditBlogs,
        canEditForms: configToSave.canEditForms,
        canEditCustomPages: configToSave.canEditCustomPages,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(`Permissions for role '${role}' updated successfully!`);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-xs font-sans">
      
      {error && (
        <div className="bg-red-950/40 border border-red-900 text-red-400 rounded-lg p-4 font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 rounded-lg p-4 font-mono flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Console Accounts Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        
        <div className="flex justify-between items-center border-b border-slate-150 pb-3">
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Console Accounts & Roles</span>
            </h2>
            <p className="text-slate-500 text-[10px] mt-0.5">Manage console credentials access keys and editor levels.</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold rounded uppercase tracking-wider text-[10px] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create User</span>
          </button>
        </div>

        <div className="border border-slate-250 rounded-lg overflow-hidden divide-y divide-slate-150">
          {users.map((u) => (
            <div key={u.id} className="p-3.5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-[11px] font-mono">{u.username}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm font-mono uppercase ${
                    u.role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" :
                    u.role === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {u.role}
                  </span>
                  {u.id === currentUserId && (
                    <span className="text-[9px] text-slate-400 font-mono">(You)</span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Email address: {u.email}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[9.5px] font-mono text-slate-400 hidden sm:inline">
                  Created: {new Date(u.createdAt).toLocaleDateString()}
                </span>
                
                {u.id !== currentUserId && u.role !== "SUPER_ADMIN" && (
                  <button
                    onClick={() => handleDeleteUser(u.id, u.username)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded border border-transparent hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Role-Based Permissions Grid */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        
        <div className="border-b border-slate-150 pb-3">
          <h2 className="text-xs font-extrabold text-slate-800 tracking-wider font-mono uppercase flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Role-Based Permission Matrix</span>
          </h2>
          <p className="text-slate-500 text-[10px] mt-0.5">
            Configure edit rights for custom admin and editor roles. Super Admins always possess absolute authorization bypass.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {["ADMIN", "EDITOR"].map((roleName) => {
            const config = roleConfigsState[roleName];
            return (
              <div key={roleName} className="border border-slate-200 rounded-xl p-5 bg-slate-50/20 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2.5">
                  <span className="font-bold text-slate-800 font-mono tracking-wide uppercase text-[10.5px]">
                    Role: {roleName} Privilege
                  </span>
                  <button
                    onClick={() => handleSaveRoleConfig(roleName)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold rounded uppercase tracking-wider text-[9px] transition-colors cursor-pointer"
                  >
                    Save {roleName} Config
                  </button>
                </div>

                <div className="space-y-2.5">
                  {/* Settings */}
                  <label className="flex items-start gap-3 p-2 bg-white rounded border border-slate-100 hover:border-slate-200 transition-all select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.canEditSettings}
                      onChange={() => handleConfigCheckboxChange(roleName, "canEditSettings")}
                      className="mt-0.5 rounded text-slate-950 focus:ring-0 w-3.5 h-3.5"
                    />
                    <div>
                      <span className="block font-bold text-slate-700 text-[9.5px] uppercase font-mono">Website Settings</span>
                      <span className="block text-[8.5px] text-slate-400 mt-0.5">
                        Themes, sliders, contact bar, navigation header, footer and SEO parameters.
                      </span>
                    </div>
                  </label>

                  {/* Products */}
                  <label className="flex items-start gap-3 p-2 bg-white rounded border border-slate-100 hover:border-slate-200 transition-all select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.canEditProducts}
                      onChange={() => handleConfigCheckboxChange(roleName, "canEditProducts")}
                      className="mt-0.5 rounded text-slate-950 focus:ring-0 w-3.5 h-3.5"
                    />
                    <div>
                      <span className="block font-bold text-slate-700 text-[9.5px] uppercase font-mono">Catalog Products</span>
                      <span className="block text-[8.5px] text-slate-400 mt-0.5">
                        Create, modify, or delete products, catalog categories, brands and featured items.
                      </span>
                    </div>
                  </label>

                  {/* Downloads */}
                  <label className="flex items-start gap-3 p-2 bg-white rounded border border-slate-100 hover:border-slate-200 transition-all select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.canEditDownloads}
                      onChange={() => handleConfigCheckboxChange(roleName, "canEditDownloads")}
                      className="mt-0.5 rounded text-slate-950 focus:ring-0 w-3.5 h-3.5"
                    />
                    <div>
                      <span className="block font-bold text-slate-700 text-[9.5px] uppercase font-mono">Catalogues & PDF Downloads</span>
                      <span className="block text-[8.5px] text-slate-400 mt-0.5">
                        Upload or delete commercial PDF catalogues, brochures, and technical files.
                      </span>
                    </div>
                  </label>

                  {/* Blogs */}
                  <label className="flex items-start gap-3 p-2 bg-white rounded border border-slate-100 hover:border-slate-200 transition-all select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.canEditBlogs}
                      onChange={() => handleConfigCheckboxChange(roleName, "canEditBlogs")}
                      className="mt-0.5 rounded text-slate-950 focus:ring-0 w-3.5 h-3.5"
                    />
                    <div>
                      <span className="block font-bold text-slate-700 text-[9.5px] uppercase font-mono">Blogs & Articles</span>
                      <span className="block text-[8.5px] text-slate-400 mt-0.5">
                        Manage news articles, company announcements, and content posts.
                      </span>
                    </div>
                  </label>

                  {/* Forms */}
                  <label className="flex items-start gap-3 p-2 bg-white rounded border border-slate-100 hover:border-slate-200 transition-all select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.canEditForms}
                      onChange={() => handleConfigCheckboxChange(roleName, "canEditForms")}
                      className="mt-0.5 rounded text-slate-950 focus:ring-0 w-3.5 h-3.5"
                    />
                    <div>
                      <span className="block font-bold text-slate-700 text-[9.5px] uppercase font-mono">Inquiries & Form Builders</span>
                      <span className="block text-[8.5px] text-slate-400 mt-0.5">
                        View inbound inquiries, customize contact templates, and read quote requests.
                      </span>
                    </div>
                  </label>

                  {/* Custom Pages */}
                  <label className="flex items-start gap-3 p-2 bg-white rounded border border-slate-100 hover:border-slate-200 transition-all select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.canEditCustomPages}
                      onChange={() => handleConfigCheckboxChange(roleName, "canEditCustomPages")}
                      className="mt-0.5 rounded text-slate-950 focus:ring-0 w-3.5 h-3.5"
                    />
                    <div>
                      <span className="block font-bold text-slate-700 text-[9.5px] uppercase font-mono">Custom Pages & Sections</span>
                      <span className="block text-[8.5px] text-slate-400 mt-0.5">
                        Configure about sub-sections, custom pages, CTA banners, and social links.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            );
          })}

        </div>

      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 max-w-md w-full text-slate-300 space-y-6">
            
            <div className="text-center">
              <span className="font-mono text-[9px] font-bold text-slate-500 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
                Create Console Account
              </span>
              <h3 className="text-lg font-black text-white mt-2.5 tracking-tight font-mono uppercase">
                New User Credentials
              </h3>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              
              {/* Username */}
              <div>
                <label className="block text-[9px] font-bold font-mono text-slate-500 uppercase mb-1">
                  Username ID
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-600">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. janesmith"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[9px] font-bold font-mono text-slate-500 uppercase mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-600">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. jane@stbtcgi.in"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[9px] font-bold font-mono text-slate-500 uppercase mb-1">
                  Passkey Secret
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-600">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/80 border border-slate-800 rounded pl-9 pr-10 py-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-400 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-[9px] font-bold font-mono text-slate-500 uppercase mb-1">
                  Privilege Level Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-slate-700 font-mono"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="EDITOR">EDITOR</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:border-slate-700 hover:text-white rounded text-xs font-mono transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-950 font-bold font-mono rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Register User</span>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
