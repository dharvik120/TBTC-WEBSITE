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
}

interface GroupItem {
  groupName: string;
  links: LinkItem[];
}

const groups: GroupItem[] = [
  {
    groupName: "Website Management",
    links: [
      { name: "Themes & Appearance", href: "/admin/themes", icon: Palette },
      { name: "Top Contact Bar", href: "/admin/topbar", icon: PhoneCall },
      { name: "Header & Navigation", href: "/admin/navigation", icon: Menu },
      { name: "Hero Slider", href: "/admin/slider", icon: Sliders },
      { name: "Homepage Sections", href: "/admin/sections", icon: Layers },
      { name: "About Us CMS", href: "/admin/about-cms", icon: BookOpen },
      { name: "Footer Builder", href: "/admin/footer", icon: LayoutDashboard }
    ]
  },
  {
    groupName: "Catalog Management",
    links: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Categories", href: "/admin/categories", icon: FolderTree },
      { name: "Brands", href: "/admin/brands", icon: Award },
      { name: "Featured Products", href: "/admin/featured", icon: Star },
      { name: "Catalogues & Downloads", href: "/admin/downloads", icon: Download }
    ]
  },
  {
    groupName: "Content Management",
    links: [
      { name: "Why Work With Us", href: "/admin/why-choose-us", icon: Zap },
      { name: "Industries We Serve", href: "/admin/industries", icon: Globe },
      { name: "CTA Sections", href: "/admin/cta", icon: Layers },
      { name: "Custom Pages", href: "/admin/custom-pages", icon: FileText },
      { name: "Social Media", href: "/admin/socials", icon: Share2 }
    ]
  },
  {
    groupName: "Leads",
    links: [
      { name: "Inquiries", href: "/admin/inquiries", icon: Mail },
      { name: "Quote Requests", href: "/admin/quotes", icon: FileSpreadsheet }
    ]
  },
  {
    groupName: "System",
    links: [
      { name: "Company Information", href: "/admin/company-info", icon: Building2 },
      { name: "Form Builder", href: "/admin/form-builder", icon: FormInput },
      { name: "SEO Settings", href: "/admin/seo", icon: Search },
      { name: "Users & Roles", href: "/admin/users", icon: Users },
      { name: "General Settings", href: "/admin/settings", icon: Settings }
    ]
  }
];

export default function AdminSidebarLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)] select-none font-sans scrollbar-thin">
      
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
      {groups.map((group) => (
        <div key={group.groupName} className="space-y-1">
          <span className="block px-3 text-[9px] font-extrabold font-mono text-slate-500 uppercase tracking-widest">
            {group.groupName}
          </span>
          <div className="space-y-0.5">
            {group.links.map((link) => {
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
      ))}

    </nav>
  );
}
