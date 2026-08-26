"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, Menu, X, ShoppingCart, Phone, Mail, Clock, 
  ChevronDown, ArrowRight, MessageSquare, Globe 
} from "lucide-react";
import { useQuoteCart } from "@/context/QuoteCartContext";

interface HeaderClientProps {
  settings: {
    companyName: string;
    phoneNumbers?: string | null;
    email?: string | null;
    businessHours?: string | null;
    whatsAppNumber?: string | null;
    enableTopContactBar?: boolean | null;
    topBarTitle?: string | null;
    topBarConfig?: string | null;
    logoUrl?: string | null;
    mobileLogoUrl?: string | null;
    headerCtaText?: string | null;
    headerCtaLink?: string | null;
    enableHeaderSearch?: boolean | null;
    enableStickyHeader?: boolean | null;
    navigationConfig?: string | null;
  };
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  modelNumber?: string | null;
  categoryName: string;
  brandName?: string | null;
  imageUrl?: string | null;
}

export default function HeaderClient({ settings, categories }: HeaderClientProps) {
  const { cart } = useQuoteCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const firstPhone = settings.phoneNumbers?.split(",")[0]?.trim() || "";

  // Parse custom top bar config
  const showTopBar = settings.enableTopContactBar !== false;
  const announcementTitle = settings.topBarTitle || "DEALER & IMPORTER";
  
  interface TopBarItem {
    id: string;
    type: string;
    label: string;
    value: string;
    icon: string;
    isEnabled: boolean;
    displayOrder: number;
  }

  let topBarItems: TopBarItem[] = [];
  if (settings.topBarConfig) {
    try {
      topBarItems = JSON.parse(settings.topBarConfig)
        .filter((item: TopBarItem) => item.isEnabled)
        .sort((a: TopBarItem, b: TopBarItem) => a.displayOrder - b.displayOrder);
    } catch (e) {
      console.error("Failed to parse topBarConfig:", e);
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Phone": return Phone;
      case "Mail": return Mail;
      case "Clock": return Clock;
      case "MessageSquare": return MessageSquare;
      case "Globe": return Globe;
      default: return Phone;
    }
  };

  interface NavigationItem {
    name: string;
    href: string;
    isExternal: boolean;
    dropdownItems?: { name: string; href: string }[];
  }

  let navigationItems: NavigationItem[] = [];
  if (settings.navigationConfig) {
    try {
      navigationItems = JSON.parse(settings.navigationConfig);
    } catch (e) {
      console.error("Failed to parse navigationConfig:", e);
    }
  }

  // Handle sticky scroll
  useEffect(() => {
    if (settings.enableStickyHeader === false) {
      setIsSticky(false);
      return;
    }
    const handleScroll = () => {
      setIsSticky(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [settings.enableStickyHeader]);

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (e) {
        console.error("Error fetching suggestions:", e);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside search auto-close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchFocused(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full z-50 bg-white">
      {/* Top Bar - hidden when sticky and on mobile */}
      {showTopBar && (
        <div className="hidden lg:block bg-slate-900 text-slate-300 py-2.5 text-sm border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              {topBarItems.length > 0 ? (
                topBarItems.map((item) => {
                  const IconComp = getIconComponent(item.icon);
                  const isLink = item.type === "link" || item.type === "whatsapp";
                  const hrefValue = item.type === "email" 
                    ? `mailto:${item.value}` 
                    : item.type === "phone" 
                    ? `tel:${item.value}` 
                    : item.type === "whatsapp"
                    ? `https://wa.me/${item.value.replace(/[^0-9]/g, "")}`
                    : item.value;

                  if (isLink || item.type === "phone" || item.type === "email") {
                    return (
                      <a 
                        key={item.id} 
                        href={hrefValue} 
                        target={item.type === "link" || item.type === "whatsapp" ? "_blank" : undefined}
                        rel={item.type === "link" || item.type === "whatsapp" ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        <IconComp className="w-4 h-4 text-primary" style={{ color: "var(--secondary-color)" }} />
                        <span>{item.value}</span>
                      </a>
                    );
                  }

                  return (
                    <div key={item.id} className="flex items-center gap-2">
                      <IconComp className="w-4 h-4 text-slate-500" />
                      <span>{item.value}</span>
                    </div>
                  );
                })
              ) : (
                <>
                  {firstPhone && (
                    <a href={`tel:${firstPhone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                      <Phone className="w-4 h-4 text-primary" style={{ color: "var(--secondary-color)" }} />
                      <span>{firstPhone}</span>
                    </a>
                  )}
                  {settings.email && (
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                      <Mail className="w-4 h-4 text-primary" style={{ color: "var(--secondary-color)" }} />
                      <span>{settings.email}</span>
                    </a>
                  )}
                  {settings.businessHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>{settings.businessHours}</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs font-mono tracking-wider uppercase text-slate-400">
              <span>{announcementTitle}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className={`w-full transition-all duration-300 ${
        isSticky 
          ? "fixed top-0 left-0 right-0 shadow-md border-b border-slate-200 py-3 bg-white/95 backdrop-blur-sm" 
          : "relative py-4 border-b border-slate-100"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src={settings.logoUrl || "/images/logo.png"} alt={settings.companyName} className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Search */}
          {settings.enableHeaderSearch !== false && (
            <div ref={searchRef} className="hidden md:block relative w-80 lg:w-96">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products, models, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full pl-4 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  <Search className="w-4.5 h-4.5" />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {searchFocused && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-md shadow-xl max-h-96 overflow-y-auto z-50 divide-y divide-slate-100">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        router.push(`/product/${item.slug}`);
                        setSearchFocused(false);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors text-sm"
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded bg-slate-100 border border-slate-100" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-400 rounded border border-slate-100">
                          N/A
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                        <div className="flex gap-2 text-xs font-mono mt-0.5 text-slate-500">
                          {item.modelNumber && <span className="font-bold text-slate-700">{item.modelNumber}</span>}
                          <span>•</span>
                          <span className="truncate">{item.categoryName}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-7">
            {navigationItems.length > 0 ? (
              navigationItems.map((item, idx) => {
                const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;

                if (hasDropdown) {
                  return (
                    <div key={idx} className="relative group py-2">
                      <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-primary transition-colors focus:outline-none cursor-pointer">
                        {item.name}
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </button>
                      <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-100 rounded-md shadow-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {item.dropdownItems!.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link 
                    key={idx} 
                    href={item.href} 
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                );
              })
            ) : (
              <>
                <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                  About Us
                </Link>
                
                {/* Products Dropdown */}
                <div className="relative group py-2">
                  <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-primary transition-colors focus:outline-none">
                    Products
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-100 rounded-md shadow-lg py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/products" className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary">
                      All Products
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products/${cat.slug}`}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link href="/downloads" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                  Catalogues
                </Link>
                <Link href="/contact" className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors">
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Navigation CTAs */}
          <div className="flex items-center gap-4">
            {/* Quote Cart Badge */}
            <Link 
              href="/quote" 
              className="relative p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors text-slate-700"
              title="Request Quote Basket"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span 
                  className="absolute -top-1.5 -right-1.5 text-[10px] font-bold text-white w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: "var(--secondary-color)" }}
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Request Quote Button */}
            {settings.headerCtaText && (
              <Link 
                href={settings.headerCtaLink || "/quote"} 
                className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 border text-sm font-bold rounded-md shadow-sm text-white hover:bg-primary-hover focus:outline-none transition-all cursor-pointer"
                style={{ backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }}
              >
                {settings.headerCtaText}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md focus:outline-none bg-slate-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-white z-40 overflow-y-auto border-t border-slate-100 flex flex-col p-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-6">
            <input
              type="text"
              placeholder="Search products, models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-3 text-slate-400">
              <Search className="w-4.5 h-4.5" />
            </button>
          </form>

          {/* Nav Links */}
          <nav className="flex flex-col gap-4 text-base font-semibold text-slate-800 mb-8">
            {navigationItems.length > 0 ? (
              navigationItems.map((item, idx) => {
                const hasDropdown = item.dropdownItems && item.dropdownItems.length > 0;

                if (hasDropdown) {
                  return (
                    <div key={idx} className="py-2 border-b border-slate-50">
                      <p className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">{item.name}</p>
                      <div className="flex flex-col gap-2.5 pl-2 font-normal text-sm text-slate-600">
                        {item.dropdownItems!.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="hover:text-primary"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link 
                    key={idx} 
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 border-b border-slate-50 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                );
              })
            ) : (
              <>
                <Link 
                  href="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-slate-50 hover:text-primary"
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-slate-50 hover:text-primary"
                >
                  About Us
                </Link>
                
                <div className="py-2 border-b border-slate-50">
                  <p className="text-slate-400 font-mono text-xs uppercase tracking-wider mb-2">Product Categories</p>
                  <div className="flex flex-col gap-2.5 pl-2 font-normal text-sm text-slate-600">
                    <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">
                      All Products
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="hover:text-primary"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link 
                  href="/downloads" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-slate-50 hover:text-primary"
                >
                  Catalogues / Downloads
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-slate-50 hover:text-primary"
                >
                  Contact Us
                </Link>
              </>
            )}
          </nav>

          {/* Contact Details in Menu */}
          <div className="mt-auto bg-slate-50 p-4 rounded-md border border-slate-100 text-sm">
            <p className="font-bold text-slate-800 mb-3">Shree TBTC Global Industries</p>
            {firstPhone && (
              <a href={`tel:${firstPhone}`} className="flex items-center gap-2 text-slate-600 mb-2">
                <Phone className="w-4 h-4 text-primary" style={{ color: "var(--secondary-color)" }} />
                <span>{firstPhone}</span>
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-primary" style={{ color: "var(--secondary-color)" }} />
                <span>{settings.email}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
