import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";

const renderSocialIcon = (iconName: string) => {
  const name = iconName ? iconName.toLowerCase() : "";
  switch (name) {
    case "facebook":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case "github":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case "pinterest":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    case "globe":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
  }
};

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
                      return (
                        <a
                          key={plat.id}
                          href={plat.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title={plat.platformName}
                        >
                          {renderSocialIcon(plat.iconName)}
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
