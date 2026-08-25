"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Palette, PhoneCall, Menu, Sliders, Layers, 
  BookOpen, Package, FolderTree, Award, Star, Download,
  CheckCircle, ShieldAlert, Zap, Globe, FileText, Share2, 
  Mail, FileSpreadsheet, Building2, FormInput, Search, Users, Settings 
} from "lucide-react";

interface LinkItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  permissionKey?: "canEditSettings" | "canEditProducts" | "canEditDownloads" | "canEditBlogs" | "canEditForms" | "canEditCustomPages";
  superAdminOnly?: boolean;
}

interface GroupItem {
  groupName: string;
  links: LinkItem[];
}

const groups: GroupItem[] = [
  {
    groupName: "Website Management",
    links: [
      { name: "Themes & Appearance", href: "/admin/themes", icon: Palette, permissionKey: "canEditSettings" },
      { name: "Top Contact Bar", href: "/admin/topbar", icon: PhoneCall, permissionKey: "canEditSettings" },
      { name: "Header & Navigation", href: "/admin/navigation", icon: Menu, permissionKey: "canEditSettings" },
      { name: "Hero Slider", href: "/admin/slider", icon: Sliders, permissionKey: "canEditSettings" },
      { name: "Homepage Sections", href: "/admin/sections", icon: Layers, permissionKey: "canEditSettings" },
      { name: "About Us CMS", href: "/admin/about-cms", icon: BookOpen, permissionKey: "canEditSettings" },
      { name: "Footer Builder", href: "/admin/footer", icon: LayoutDashboard, permissionKey: "canEditSettings" }
    ]
  },
  {
    groupName: "Catalog Management",
    links: [
      { name: "Products", href: "/admin/products", icon: Package, permissionKey: "canEditProducts" },
      { name: "Categories", href: "/admin/categories", icon: FolderTree, permissionKey: "canEditProducts" },
      { name: "Brands", href: "/admin/brands", icon: Award, permissionKey: "canEditProducts" },
      { name: "Featured Products", href: "/admin/featured", icon: Star, permissionKey: "canEditProducts" },
      { name: "Catalogues & Downloads", href: "/admin/downloads", icon: Download, permissionKey: "canEditDownloads" }
    ]
  },
  {
    groupName: "Content Management",
    links: [
      { name: "Why Work With Us", href: "/admin/why-choose-us", icon: Zap, permissionKey: "canEditCustomPages" },
      { name: "Industries We Serve", href: "/admin/industries", icon: Globe, permissionKey: "canEditCustomPages" },
      { name: "CTA Sections", href: "/admin/cta", icon: Layers, permissionKey: "canEditCustomPages" },
      { name: "Custom Pages", href: "/admin/custom-pages", icon: FileText, permissionKey: "canEditCustomPages" },
      { name: "Social Media", href: "/admin/socials", icon: Share2, permissionKey: "canEditCustomPages" }
    ]
  },
  {
    groupName: "Leads",
    links: [
      { name: "Inquiries", href: "/admin/inquiries", icon: Mail, permissionKey: "canEditForms" },
      { name: "Quote Requests", href: "/admin/quotes", icon: FileSpreadsheet, permissionKey: "canEditForms" }
    ]
  },
  {
    groupName: "System",
    links: [
      { name: "Company Information", href: "/admin/company-info", icon: Building2, permissionKey: "canEditSettings" },
      { name: "Form Builder", href: "/admin/form-builder", icon: FormInput, permissionKey: "canEditForms" },
      { name: "SEO Settings", href: "/admin/seo", icon: Search, permissionKey: "canEditSettings" },
      { name: "Users & Roles", href: "/admin/users", icon: Users, superAdminOnly: true },
      { name: "General Settings", href: "/admin/settings", icon: Settings, permissionKey: "canEditSettings" }
    ]
  }
];

interface SidebarLinksProps {
  permissions: {
    canEditSettings: boolean;
    canEditProducts: boolean;
    canEditDownloads: boolean;
    canEditBlogs: boolean;
    canEditForms: boolean;
    canEditCustomPages: boolean;
  };
  role: string;
}

export default function AdminSidebarLinks({ permissions, role }: SidebarLinksProps) {
  const pathname = usePathname();

  // Helper to filter visible links
  const isLinkVisible = (link: LinkItem) => {
    if (link.superAdminOnly) {
      return role === "SUPER_ADMIN";
    }
    if (link.permissionKey) {
      return !!permissions[link.permissionKey];
    }
    return true;
  };

  return (
    <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto max-h-[calc(100vh-14rem)] select-none font-sans scrollbar-thin">
      
      {/* Overview Dashboard */}
      <div>
        <Link
          href="/admin"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border-l-2 ${
            pathname === "/admin"
              ? "bg-slate-900 text-white border-primary"
              : "text-slate-400 border-transparent hover:text-white hover:bg-slate-900/50"
          }`}
          style={{ borderLeftColor: pathname === "/admin" ? "var(--secondary-color)" : "" }}
        >
          <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
          <span>Dashboard Overview</span>
        </Link>
      </div>

      {/* Nav groups */}
      {groups.map((group) => {
        // Filter links within this group
        const visibleLinks = group.links.filter(isLinkVisible);

        // Don't render group if no links are visible
        if (visibleLinks.length === 0) return null;

        return (
          <div key={group.groupName} className="space-y-1">
            <span className="block px-3 text-[9px] font-extrabold font-mono text-slate-500 uppercase tracking-widest">
              {group.groupName}
            </span>
            <div className="space-y-0.5">
              {visibleLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[10.5px] font-semibold uppercase tracking-wider transition-all duration-200 border-l-2 ${
                      isActive
                        ? "bg-slate-900 text-white border-primary"
                        : "text-slate-400 border-transparent hover:text-white hover:bg-slate-900/40"
                    }`}
                    style={{ borderLeftColor: isActive ? "var(--secondary-color)" : "" }}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

    </nav>
  );
}
