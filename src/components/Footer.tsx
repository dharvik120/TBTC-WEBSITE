import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import * as Icons from "lucide-react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumn {
  title: string;
  type: string; // text, links, categories, contact
  content?: string;
  links?: FooterLink[];
  limit?: number;
  showHours?: boolean;
}

export default async function Footer() {
  const settings = await getCompanySettings();

  // Parse columns config
  let columns: FooterColumn[] = [
    {
      title: "Company Profile",
      type: "text",
      content: "Leading dealer and importer of electrical switchgear, industrial steels, high-performance lubricants, filtration products, compressors, and high-tension insulators."
    },
    {
      title: "Quick Links",
      type: "links",
      links: [
        { text: "Home", href: "/" },
        { text: "About Us", href: "/about" },
        { text: "Products", href: "/products" },
        { text: "Downloads", href: "/downloads" },
        { text: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Stock Segments",
      type: "categories",
      limit: 5
    },
    {
      title: "Contact Details",
      type: "contact",
      showHours: true
    }
  ];

  if (settings.footerConfig) {
    try {
      columns = JSON.parse(settings.footerConfig);
    } catch (e) {
      console.error("Failed to parse footerConfig:", e);
    }
  }

  // Fetch active categories to show in categories column
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { displayOrder: "asc" },
    take: 5,
  });

  // Fetch active social media platforms
  const socialPlatforms = await prisma.socialPlatform.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  const phones = settings.phoneNumbers ? settings.phoneNumbers.split(",").map(p => p.trim()) : [];
  const currentYear = new Date().getFullYear();

  // Copyright Text replacement
  let copyright = "© {year} Shree TBTC Global Industries. All Rights Reserved.";
  if (settings.copyrightText) {
    copyright = settings.copyrightText.replace("{year}", String(currentYear));
  } else {
    copyright = copyright.replace("{year}", String(currentYear));
  }

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t-2 font-sans" style={{ borderTopColor: "var(--secondary-color)" }}>
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <h4 className="text-white font-mono font-bold tracking-widest text-[11px] uppercase border-b border-slate-900 pb-1.5">{col.title}</h4>
            
            {/* TEXT COLUMN */}
            {col.type === "text" && (
              <div className="space-y-4">
                <Link href="/" className="inline-block">
                  <img src={settings.logoUrl || "/images/logo.png"} alt={settings.companyName} className="h-10 w-auto object-contain bg-white rounded p-1" />
                </Link>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {col.content}
                </p>
                {/* Social Links */}
                {socialPlatforms.length > 0 && (
                  <div className="flex items-center gap-3 pt-2">
                    {socialPlatforms.map((plat) => {
                      const IconComponent = (Icons as any)[plat.iconName] || Icons.Share2;
                      return (
                        <a
                          key={plat.id}
                          href={plat.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title={plat.platformName}
                        >
                          <IconComponent className="w-4 h-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* LINKS COLUMN */}
            {col.type === "links" && col.links && (
              <ul className="flex flex-col gap-2.5">
                {col.links.map((lnk, lIdx) => (
                  <li key={lIdx}>
                    <Link href={lnk.href} className="hover:text-white transition-colors">
                      {lnk.text}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* CATEGORIES COLUMN */}
            {col.type === "categories" && (
              <ul className="flex flex-col gap-2.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/products/${cat.slug}`} className="hover:text-white transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/products" className="text-[10px] font-bold text-slate-300 hover:text-white underline">
                    All Products Catalog
                  </Link>
                </li>
              </ul>
            )}

            {/* CONTACT DETAILS COLUMN */}
            {col.type === "contact" && (
              <ul className="flex flex-col gap-3 text-slate-400">
                {settings.address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{settings.address}</span>
                  </li>
                )}
                {phones.length > 0 && (
                  <li className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      {phones.map((phone, pIdx) => (
                        <a key={pIdx} href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                      ))}
                    </div>
                  </li>
                )}
                {settings.email && (
                  <li className="flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors truncate">{settings.email}</a>
                  </li>
                )}
                {settings.businessHours && col.showHours && (
                  <li className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{settings.businessHours}</span>
                  </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Lower Copyright & Credits Bar */}
      <div className="bg-slate-990 border-t border-slate-900 py-6 text-[10px] text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>{copyright}</p>
          
          {settings.devCreditEnabled && (
            <p className="text-slate-500 font-mono">
              <a 
                href={settings.devCreditLink || "https://webztechnologies.com/"} 
                target={settings.devCreditOpenInNewTab ? "_blank" : "_self"} 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors underline font-bold"
                style={{ color: "var(--secondary-color)" }}
              >
                {settings.devCreditText || "Created & Developed By Webz Technologies"}
              </a>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
