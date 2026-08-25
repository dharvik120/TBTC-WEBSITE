"use client";

import React, { useState, useTransition } from "react";
import { User, Mail, Lock, Upload, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { updateMyAccount } from "@/app/actions/admin";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage: string | null;
}

interface MyAccountClientProps {
  user: UserProfile;
}

export default function MyAccountClient({ user }: MyAccountClientProps) {
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setProfileImage(data.filePath || data.url);
        setSuccess("Profile avatar uploaded! Click 'Save Profile Changes' to apply.");
      }
    } catch (err) {
      setError("Failed to upload avatar image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const res = await updateMyAccount({
        username,
        email,
        passwordPass: password || undefined,
        profileImage,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Profile settings updated successfully!");
        setPassword("");
        setConfirmPassword("");
        // Reload page to reflect changes in sidebar
        window.location.reload();
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs font-sans">
      
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Avatar Column */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-4 md:col-span-1">
          <h3 className="font-bold text-slate-800 text-[11px] font-mono uppercase tracking-wider">
            Profile Avatar
          </h3>
          
          <div className="relative group">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 text-slate-400 text-xl font-bold uppercase">
                {username.substring(0, 2)}
              </div>
            )}
            
            {uploading && (
              <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
          </div>

          <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold px-3 py-1.5 rounded uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? "Uploading..." : "Upload New"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>
          <span className="text-[9px] text-slate-400 leading-normal">
            JPEG, PNG or SVG file types are supported.
          </span>
        </div>

        {/* Credentials Form Column */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5 md:col-span-2">
          
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-[11px] font-mono uppercase tracking-wider">
              Profile Credentials
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Manage your active admin identity logs.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            
            {/* Username */}
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
                Account Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded pl-9 pr-4 py-2 focus:outline-none focus:bg-white focus:border-slate-400 text-slate-800 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-5 border border-slate-200 rounded pl-9 pr-4 py-2 focus:outline-none focus:bg-white focus:border-slate-400 text-slate-800 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Role Display */}
            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
                Account Privilege Level
              </label>
              <input
                type="text"
                disabled
                value={user.role}
                className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-2 text-slate-500 font-mono font-bold uppercase"
              />
              <span className="text-[9px] text-slate-400 block mt-1">
                Privilege levels can only be updated by a Super Administrator.
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2">
              <h4 className="font-bold text-slate-800 text-[10px] font-mono uppercase tracking-wider mb-3">
                Update Passkey (Leave blank to keep current)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
                    New Passkey
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-5 border border-slate-200 rounded pl-9 pr-10 py-2 focus:outline-none focus:bg-white focus:border-slate-400 text-slate-800 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
                    Confirm New Passkey
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-5 border border-slate-200 rounded pl-9 pr-10 py-2 focus:outline-none focus:bg-white focus:border-slate-400 text-slate-800 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isPending || uploading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-mono font-bold px-4 py-2.5 rounded uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
