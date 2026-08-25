export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, CheckCircle2, ShieldCheck, Mail, Phone, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import * as Icons from "lucide-react";

export default async function HomePage() {
  const settings = await getCompanySettings();
  const theme = settings.activeTheme || "theme1";

  // 1. Fetch active slides
  const slides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  // 2. Fetch root categories
  const categoriesLimit = settings.homeCategoriesLimit || 6;
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null, isFeatured: true },
    orderBy: { displayOrder: "asc" },
    take: categoriesLimit,
  });

  // 3. Fetch featured products
  const featuredLimit = settings.homeFeaturedProductsLimit || 6;
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
    orderBy: { displayOrder: "asc" },
    take: featuredLimit,
  });

  // 4. Fetch Why Choose Us items
  const whyChooseUs = await prisma.whyChooseUs.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  // 5. Fetch industries
  const industries = await prisma.industry.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  // 6. Parse sections config
  let sections = [
    { id: "slider", name: "Hero Slider", isEnabled: true, displayOrder: 1 },
    { id: "intro", name: "Who We Are", isEnabled: true, displayOrder: 2 },
    { id: "categories", name: "Categories", isEnabled: true, displayOrder: 3 },
    { id: "featured", name: "Featured Products", isEnabled: true, displayOrder: 4 },
    { id: "why", name: "Why Work With Us", isEnabled: true, displayOrder: 5 },
    { id: "industries", name: "Industries We Serve", isEnabled: true, displayOrder: 6 },
    { id: "cta", name: "Call to Action", isEnabled: true, displayOrder: 7 }
  ];

  if (settings.homepageSectionsConfig) {
    try {
      sections = JSON.parse(settings.homepageSectionsConfig);
    } catch (e) {
      console.error("Failed to parse homepageSectionsConfig:", e);
    }
  }

  // Sort sections
  sections.sort((a, b) => a.displayOrder - b.displayOrder);

  // Render helper for slider
  const renderSlider = () => {
    if (!slides || slides.length === 0) return null;
    return (
      <HeroSlider 
        slides={slides}
        autoplay={settings.sliderAutoplay}
        autoplaySpeed={settings.sliderAutoplaySpeed}
        transitionStyle={settings.sliderTransitionStyle}
        height={settings.sliderHeight}
        showArrows={settings.sliderShowArrows}
        showDots={settings.sliderShowDots}
      />
    );
  };

  // Render Who We Are Introduction
  const renderIntro = () => {
    if (!settings.introEnabled) return null;

    let images: string[] = [];
    if (settings.introImages) {
      try {
        images = JSON.parse(settings.introImages);
      } catch (e) {}
    }
    const introImg = images[0] || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800";

    const isLeft = settings.introLayoutStyle === "left-image";

    if (theme === "theme2") {
      // Theme 2: Modern Technical layout
      return (
        <section className="py-16 bg-slate-50 border-b border-slate-200 grid-pattern">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-6 space-y-4 ${isLeft ? "lg:order-2" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="h-1 w-6 bg-emerald-500 rounded" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-600">
                  {settings.introHeading}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
                {settings.introHighlightHeading}
              </h2>
              <p className="text-slate-500 font-mono text-[11px] leading-relaxed uppercase tracking-wider">
                {settings.introSubtitle}
              </p>
              <div className="text-slate-650 text-xs leading-relaxed space-y-4 font-sans whitespace-pre-line">
                {settings.introDescription}
              </div>
              <div className="pt-4">
                <Link 
                  href={settings.introCtaLink || "/about"}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded shadow hover:bg-slate-800 transition-colors"
                >
                  <span>{settings.introCtaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className={`lg:col-span-6 ${isLeft ? "lg:order-1" : ""}`}>
              <div className="relative rounded-lg overflow-hidden border border-emerald-500/20 p-2 bg-emerald-500/5 aspect-video">
                <img src={introImg} alt="Technical Procurement" className="w-full h-full object-cover rounded shadow" />
                <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white font-mono text-[9px] px-2 py-0.5 border border-slate-700 rounded uppercase">
                  TBTC System Config Active
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (theme === "theme3") {
      // Theme 3: Bold Industrial Showcase layout
      return (
        <section className="py-20 bg-slate-950 text-white border-b border-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className={`space-y-6 ${isLeft ? "lg:order-2" : ""}`}>
              <div>
                <span className="text-[10px] font-black text-rose-500 font-mono uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 border border-rose-500/20 rounded">
                  {settings.introHeading.toUpperCase()}
                </span>
                <h2 className="text-3xl lg:text-5xl font-black tracking-tight mt-3 uppercase font-mono">
                  {settings.introHighlightHeading}
                </h2>
              </div>
              <p className="text-slate-400 font-sans text-sm italic">
                {settings.introSubtitle}
              </p>
              <div className="text-slate-350 text-xs leading-relaxed space-y-4 font-sans whitespace-pre-line">
                {settings.introDescription}
              </div>
              <div className="pt-2">
                <Link 
                  href={settings.introCtaLink || "/about"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded font-mono transition-colors shadow-lg"
                >
                  <span>{settings.introCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className={`${isLeft ? "lg:order-1" : ""}`}>
              <div className="relative rounded-lg overflow-hidden border-2 border-rose-600/30 aspect-square max-w-md mx-auto">
                <img src={introImg} alt="Industrial Equipment" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>EST. HOWRAH</span>
                  <span>PREMIUM IMPORTER</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Default Theme 1: Industrial Corporate
    return (
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100 font-sans">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`${isLeft ? "lg:order-2" : ""}`}>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              {settings.introHeading}
            </span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-950 mt-2 mb-6 leading-tight uppercase font-mono">
              {settings.introHighlightHeading}
            </h2>
            <div className="text-slate-650 space-y-4 leading-relaxed font-sans text-xs whitespace-pre-line">
              {settings.introDescription}
            </div>
            <div className="mt-8 flex gap-4">
              <Link 
                href={settings.introCtaLink || "/about"} 
                className="inline-flex items-center gap-2 px-5 py-2.5 border text-[10px] font-bold text-white shadow-sm transition-all rounded-md hover:bg-opacity-95 uppercase font-mono tracking-wider"
                style={{ backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }}
              >
                <span>{settings.introCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 hover:border-slate-400 text-[10px] font-bold text-slate-700 rounded-md transition-colors uppercase font-mono tracking-wider"
              >
                Get in Touch
              </Link>
            </div>
          </div>
          
          <div className={`relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-8 flex flex-col justify-between aspect-video grid-pattern ${isLeft ? "lg:order-1" : ""}`}>
            <div className="flex justify-between items-start">
              <div className="font-mono text-[9px] text-slate-400 font-bold border border-slate-200 px-2 py-0.5 rounded">
                SYSTEM CONFIG // ACTIVE
              </div>
              <div className="text-right text-slate-400 text-[10px] font-mono">
                TBTC_CO_2026
              </div>
            </div>
            <div className="my-6 flex flex-col gap-2">
              <img src="/images/logo.png" alt="TBTC Logo" className="h-14 w-auto object-contain self-start" />
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 font-bold">
                Global Procurement Core
              </p>
            </div>
            <div className="border-t border-slate-200 pt-4 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>LOCATION: West Bengal</span>
              <span>ESTABLISHED CAPABILITIES</span>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Render Product Categories
  const renderCategories = () => {
    if (!categories || categories.length === 0) return null;

    if (theme === "theme2") {
      // Theme 2 Layout: Modern technical boxes
      return (
        <section className="py-16 bg-slate-100/50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10 border-b border-slate-200 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-wider">PORTAL CATEGORIES</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1 uppercase font-mono">Stock Range catalog</h2>
              </div>
              <Link href="/products" className="text-xs font-mono font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1">
                <span>EXPLORE ALL</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  className="bg-white border border-slate-200 rounded-lg p-5 hover:border-emerald-500/50 hover:shadow-sm transition-all group flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0 font-mono text-sm font-bold group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {cat.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide group-hover:text-emerald-600 transition-colors">{cat.name}</h3>
                    <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (theme === "theme3") {
      // Theme 3 Layout: Bold visual tiles
      return (
        <section className="py-20 bg-white border-b border-slate-150">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-widest">STOCK CLASSIFICATION</span>
              <h2 className="text-3xl font-black text-slate-950 mt-2 uppercase font-mono">PRODUCT SECTOR TILES</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products/${cat.slug}`}
                  className="relative group h-64 overflow-hidden rounded-md border border-slate-200/50 flex flex-col justify-end p-6"
                >
                  {/* Category Image or Fallback background */}
                  <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                    <img src={cat.imageUrl || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600"} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div className="relative z-20 space-y-2 text-white">
                    <h3 className="text-lg font-black uppercase font-mono tracking-wide">{cat.name}</h3>
                    <p className="text-[10px] text-slate-350 leading-relaxed line-clamp-2 font-sans">{cat.description}</p>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-rose-500 uppercase tracking-widest pt-2 group-hover:text-white transition-colors">
                      <span>Explore Segment</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Default Theme 1 Layout: Boxy grids
    return (
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                Material Catalogues
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 uppercase font-mono">
                Product Categories
              </h2>
            </div>
            <Link href="/products" className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wide">
              <span>Browse Full Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="bg-white border border-slate-200/80 rounded-md p-6 shadow-sm hover:shadow-md hover:border-slate-350 transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base mb-2 uppercase font-mono group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 group-hover:text-primary transition-colors border-t border-slate-50 pt-4 uppercase tracking-widest">
                  <span>EXPLORE PRODUCTS</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Render Featured Products
  const renderFeatured = () => {
    if (!settings.homeFeaturedProductsEnabled || !featuredProducts || featuredProducts.length === 0) return null;

    if (theme === "theme2") {
      // Theme 2: Sleek Cards with technical specifications summary list
      return (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">{settings.homeFeaturedProductsSubtitle}</span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-950 mt-1 uppercase font-mono">{settings.homeFeaturedProductsHeading}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  whatsAppNumber={settings.whatsAppNumber}
                />
              ))}
            </div>
            
            <div className="text-center pt-8">
              <Link 
                href={settings.homeFeaturedProductsCtaLink || "/products"}
                className="inline-flex items-center gap-1.5 px-6 py-3 border border-slate-250 hover:bg-slate-50 text-slate-700 text-xs font-mono uppercase font-bold tracking-wider rounded"
              >
                <span>{settings.homeFeaturedProductsCtaText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      );
    }

    if (theme === "theme3") {
      // Theme 3: Visual high-contrast showcase
      return (
        <section className="py-20 bg-slate-900 text-white border-b border-slate-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-widest">{settings.homeFeaturedProductsSubtitle.toUpperCase()}</span>
                <h2 className="text-3xl font-black mt-2 uppercase font-mono tracking-wide">{settings.homeFeaturedProductsHeading}</h2>
              </div>
              <Link href="/products" className="text-xs font-mono font-bold text-rose-500 hover:text-white flex items-center gap-1">
                <span>VIEW FULL INVENTORY</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  whatsAppNumber={settings.whatsAppNumber}
                />
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Default Theme 1
    return (
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                {settings.homeFeaturedProductsSubtitle}
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-1 uppercase font-mono">
                {settings.homeFeaturedProductsHeading}
              </h2>
            </div>
            <Link href={settings.homeFeaturedProductsCtaLink || "/products"} className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider">
              <span>{settings.homeFeaturedProductsCtaText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                whatsAppNumber={settings.whatsAppNumber}
              />
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Render Why Choose Us benefits
  const renderWhy = () => {
    if (!settings.whyWorkEnabled || !whyChooseUs || whyChooseUs.length === 0) return null;

    if (theme === "theme2") {
      // Theme 2: Tech boxes with Lucide Icon components mapped dynamically
      return (
        <section className="py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">{settings.whyWorkSubtitle}</span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-950 mt-2 uppercase font-mono">{settings.whyWorkHeading}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map((item) => {
                const IconComponent = (Icons as any)[item.iconName || "ShieldCheck"] || CheckCircle2;
                return (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-sm">
                    <div className="w-9 h-9 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">{item.title}</h3>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    if (theme === "theme3") {
      // Theme 3: Visual high-contrast lists
      return (
        <section className="py-20 bg-slate-950 text-white border-b border-slate-900">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[9px] font-black text-rose-500 font-mono uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 border border-rose-500/20 rounded">WHY SHREE TBTC</span>
              <h2 className="text-3xl font-black uppercase font-mono tracking-wide">{settings.whyWorkHeading}</h2>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">{settings.whyWorkDescription}</p>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseUs.map((item) => (
                <div key={item.id} className="p-5 border border-slate-800 bg-slate-900/60 rounded-md space-y-2">
                  <div className="w-8 h-8 rounded bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 font-mono text-[10px] font-bold">
                    0{item.displayOrder}
                  </div>
                  <h3 className="font-bold text-slate-100 text-xs uppercase font-mono">{item.title}</h3>
                  <p className="text-slate-400 text-[10.5px] leading-relaxed font-sans">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Default Theme 1
    return (
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              {settings.whyWorkSubtitle}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1 uppercase font-mono">
              {settings.whyWorkHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="p-6 bg-slate-50 border border-slate-200/55 rounded-md flex flex-col gap-4">
                <div 
                  className="w-10 h-10 rounded flex items-center justify-center text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  <CheckCircle2 className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 text-base uppercase font-mono">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Render Industries We Serve
  const renderIndustries = () => {
    if (!settings.homeIndustriesEnabled || !industries || industries.length === 0) return null;

    if (theme === "theme2") {
      // Theme 2: Tech grids
      return (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">{settings.homeIndustriesSubtitle}</span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-2 uppercase font-mono">{settings.homeIndustriesHeading}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {industries.map((ind) => (
                <div key={ind.id} className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between group">
                  <div className="h-40 relative bg-slate-200 overflow-hidden">
                    {ind.imageUrl ? <img src={ind.imageUrl} alt={ind.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : null}
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">{ind.name}</h3>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">{ind.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (theme === "theme3") {
      // Theme 3: Visual visual banner sliders
      return (
        <section className="py-20 bg-slate-900 text-white border-b border-slate-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="font-mono text-xs font-bold text-rose-500 tracking-widest uppercase">{settings.homeIndustriesSubtitle.toUpperCase()}</span>
              <h2 className="text-3xl font-black mt-2 uppercase font-mono tracking-wide">{settings.homeIndustriesHeading}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {industries.map((ind) => (
                <div key={ind.id} className="relative h-64 rounded overflow-hidden border border-slate-800 flex flex-col justify-end p-5 group">
                  <div className="absolute inset-0 bg-slate-950">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                    {ind.imageUrl ? <img src={ind.imageUrl} alt={ind.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-500" /> : null}
                  </div>
                  <div className="relative z-20 space-y-1 text-white">
                    <h4 className="font-bold uppercase font-mono text-xs text-rose-500">SECTOR {ind.displayOrder}</h4>
                    <h3 className="font-black uppercase font-mono text-sm tracking-wide">{ind.name}</h3>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{ind.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Default Theme 1
    return (
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100 font-sans">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              {settings.homeIndustriesSubtitle}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1 uppercase font-mono">
              {settings.homeIndustriesHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industries.map((ind) => (
              <div 
                key={ind.id}
                className="bg-white rounded-md border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                {ind.imageUrl && (
                  <div className="h-44 overflow-hidden relative border-b border-slate-100">
                    <img 
                      src={ind.imageUrl} 
                      alt={ind.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-extrabold text-slate-800 text-sm mb-2 group-hover:text-primary transition-colors uppercase font-mono">
                    {ind.name}
                  </h3>
                  {ind.description && (
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      {ind.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Render CTA Conversion Stripe
  const renderCTA = () => {
    if (!settings.homeCtaEnabled) return null;

    let buttonsList: any[] = [];
    if (settings.homeCtaButtons) {
      try {
        buttonsList = JSON.parse(settings.homeCtaButtons).filter((b: any) => b.isActive);
      } catch (e) {}
    }

    if (theme === "theme2") {
      // Theme 2: Minimal technical CTA box
      return (
        <section className="py-16 bg-slate-900 text-white text-center border-b border-slate-850 relative grid-pattern">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight uppercase font-mono">
              {settings.homeCtaHeading}
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs leading-relaxed font-sans">
              {settings.homeCtaDescription}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {buttonsList.length > 0 ? (
                buttonsList.map((btn, idx) => (
                  <Link
                    key={idx}
                    href={btn.link}
                    target={btn.openInNewTab ? "_blank" : "_self"}
                    className="px-5 py-2.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded"
                    style={{ backgroundColor: btn.color || "#10b981", color: btn.textColor || "#ffffff" }}
                  >
                    {btn.text}
                  </Link>
                ))
              ) : (
                <>
                  <Link href="/quote" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-mono uppercase font-bold tracking-wider rounded transition-colors shadow">
                    Request RFQ Spec Sheets
                  </Link>
                  <Link href="/contact" className="px-5 py-2.5 border border-white/20 hover:border-white text-white text-[10px] font-mono uppercase font-bold tracking-wider rounded transition-colors">
                    Contact Executive
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      );
    }

    if (theme === "theme3") {
      // Theme 3: Bold rose showcase stripe
      return (
        <section className="py-20 bg-rose-600 text-white text-center relative overflow-hidden border-b border-rose-700">
          <div className="absolute inset-0 bg-slate-950/40 z-10" />
          <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-20">
            <h2 className="text-3xl lg:text-4xl font-black uppercase font-mono tracking-wide leading-tight">
              {settings.homeCtaHeading}
            </h2>
            <p className="text-rose-100 max-w-xl mx-auto text-xs leading-relaxed font-sans">
              {settings.homeCtaDescription}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {buttonsList.length > 0 ? (
                buttonsList.map((btn, idx) => (
                  <Link
                    key={idx}
                    href={btn.link}
                    target={btn.openInNewTab ? "_blank" : "_self"}
                    className="px-6 py-3 text-xs font-mono uppercase font-bold tracking-wider rounded bg-slate-950 text-white hover:bg-slate-900 transition-all shadow-md"
                  >
                    {btn.text}
                  </Link>
                ))
              ) : (
                <>
                  <Link href="/quote" className="px-6 py-3 bg-slate-950 text-white text-xs font-mono uppercase font-bold tracking-wider rounded transition-all shadow-lg">
                    Submit RFQ Form
                  </Link>
                  <Link href="/contact" className="px-6 py-3 bg-white text-rose-600 text-xs font-mono uppercase font-bold tracking-wider rounded transition-all shadow-lg">
                    Contact Office
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      );
    }

    // Default Theme 1
    return (
      <section 
        className="py-16 text-center text-white border-b border-slate-900 font-sans"
        style={{ backgroundColor: "var(--primary-color)" }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-4 tracking-tight leading-tight uppercase font-mono">
            {settings.homeCtaHeading}
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto mb-8 text-xs leading-relaxed font-sans">
            {settings.homeCtaDescription}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {buttonsList.length > 0 ? (
              buttonsList.map((btn, idx) => (
                <Link
                  key={idx}
                  href={btn.link}
                  target={btn.openInNewTab ? "_blank" : "_self"}
                  className="px-5 py-2.5 text-[10px] font-mono uppercase font-bold tracking-wider rounded shadow-sm"
                  style={{ backgroundColor: btn.color, color: btn.textColor }}
                >
                  {btn.text}
                </Link>
              ))
            ) : (
              <>
                <Link 
                  href="/quote"
                  className="px-5 py-2.5 text-[10px] font-mono uppercase font-bold text-slate-900 bg-white hover:bg-slate-50 transition-colors shadow-sm rounded-md cursor-pointer"
                >
                  Request a Custom Quote
                </Link>
                <Link 
                  href="/contact"
                  className="px-5 py-2.5 text-[10px] font-mono uppercase font-bold text-white bg-transparent border border-white/30 hover:border-white transition-colors rounded-md cursor-pointer"
                >
                  Talk to an Expert
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="w-full flex flex-col">
      {sections.map((section) => {
        if (!section.isEnabled) return null;
        switch (section.id) {
          case "slider":
            return <React.Fragment key="slider">{renderSlider()}</React.Fragment>;
          case "intro":
            return <React.Fragment key="intro">{renderIntro()}</React.Fragment>;
          case "categories":
            return <React.Fragment key="categories">{renderCategories()}</React.Fragment>;
          case "featured":
            return <React.Fragment key="featured">{renderFeatured()}</React.Fragment>;
          case "why":
            return <React.Fragment key="why">{renderWhy()}</React.Fragment>;
          case "industries":
            return <React.Fragment key="industries">{renderIndustries()}</React.Fragment>;
          case "cta":
            return <React.Fragment key="cta">{renderCTA()}</React.Fragment>;
          default:
            return null;
        }
      })}
    </div>
  );
}
