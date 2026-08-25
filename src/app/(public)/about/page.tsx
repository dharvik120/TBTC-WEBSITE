export const dynamic = "force-dynamic";

import React from "react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import * as Icons from "lucide-react";

export default async function AboutPage() {
  const settings = await getCompanySettings();

  // Parse Highlights
  let highlights: string[] = [];
  if (settings.aboutStoryHighlights) {
    try {
      highlights = JSON.parse(settings.aboutStoryHighlights);
    } catch (e) {
      console.error("Failed parsing story highlights:", e);
    }
  }

  // Parse Values
  let values: any[] = [];
  if (settings.aboutValuesConfig) {
    try {
      values = JSON.parse(settings.aboutValuesConfig);
    } catch (e) {
      console.error("Failed parsing about values:", e);
    }
  }

  // Parse Stats
  let stats: any[] = [];
  if (settings.aboutStatsConfig) {
    try {
      stats = JSON.parse(settings.aboutStatsConfig);
    } catch (e) {
      console.error("Failed parsing about stats:", e);
    }
  }

  return (
    <div className="w-full flex flex-col py-10 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono text-slate-400 mb-6 flex items-center gap-1.5 uppercase">
          <a href="/" className="hover:text-slate-600">Home</a>
          <span>/</span>
          <span className="text-slate-600 font-bold">About Us</span>
        </nav>

        {/* Hero Section */}
        <div className="border-b border-slate-200 pb-10 mb-12">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 uppercase font-mono">
            {settings.aboutHeroTitle || "About Our Company"}
          </h1>
          <p className="text-slate-500 max-w-3xl text-base lg:text-lg leading-relaxed font-sans">
            {settings.aboutHeroSubtitle || "Your Trusted Partner in Industrial Procurement"}
          </p>
        </div>

        {/* Story & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mb-16">
          <div className="lg:col-span-2 space-y-6 text-slate-600 leading-relaxed font-sans">
            <h2 className="text-2xl font-bold text-slate-950">
              {settings.aboutStoryHeading || "One-Stop Source for Switchgear, Steels, Lubricants & Insulators"}
            </h2>
            <div className="whitespace-pre-line space-y-4 text-sm lg:text-base leading-relaxed text-slate-650">
              {settings.aboutStoryContent && settings.aboutStoryContent !== "Established as a primary supply hub in Howrah..." && settings.aboutStoryContent !== "Established as a primary supply hub in Howrah" ? (
                settings.aboutStoryContent
              ) : (
                <>
                  <p>
                    Under the leadership of <strong>Mr. Premnath Agrahari</strong>, <strong>{settings.companyName}</strong> was founded with the goal of bringing robust industrial procurement to global standards. Established as a primary supply hub in Howrah, we specialize in catering to critical production facilities that require zero downtime.
                  </p>
                  <p>
                    Our operations cover multiple specialized fields. We deal in low and medium voltage electrical switchgears (overload relays, MPCBs, starters), high-grade carbon and alloy steels (flanges, pipes, fittings), high-precision polymer melt filters for extruders, compressors, and high-tension porcelain suspension disc insulators.
                  </p>
                  <p>
                    We maintain close relationships with trusted manufacturers to ensure that every single item leaving our warehouse is 100% original, fully certified, and traceable.
                  </p>
                </>
              )}
            </div>
          </div>

          {highlights.length > 0 && (
            <div className="bg-slate-100/70 border border-slate-200 rounded-md p-6 space-y-6 font-mono text-xs">
              <h3 className="font-bold text-slate-950 border-b border-slate-200 pb-3 text-sm uppercase tracking-wide">
                Key Highlights
              </h3>
              <ul className="space-y-4 text-slate-600">
                {highlights.map((hl, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{hl.toUpperCase()}:</span>
                    <span className="font-bold text-slate-800 text-right">COMPLIANT</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Stats Section (only shows if stats are populated) */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 py-12 border-t border-b border-slate-200 mb-16 bg-slate-50/50 rounded-lg p-6">
            {stats.map((st, idx) => {
              const IconComponent = (Icons as any)[st.iconName] || Icons.Award;
              return (
                <div key={idx} className="text-center p-4">
                  <div className="flex justify-center text-slate-600 mb-2">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono">{st.value}</div>
                  <div className="text-xs text-slate-500 font-mono uppercase mt-1 tracking-wider">{st.label}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mission & Vision */}
        {(settings.aboutMissionContent || settings.aboutVisionContent) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {settings.aboutMissionContent && (
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900 uppercase font-mono tracking-wide flex items-center gap-2">
                  <Icons.Shield className="w-5 h-5 text-slate-600" />
                  <span>{settings.aboutMissionHeading || "Our Mission"}</span>
                </h3>
                <p className="text-slate-650 leading-relaxed font-sans text-sm">
                  {settings.aboutMissionContent}
                </p>
              </div>
            )}
            {settings.aboutVisionContent && (
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-lg space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900 uppercase font-mono tracking-wide flex items-center gap-2">
                  <Icons.Eye className="w-5 h-5 text-slate-600" />
                  <span>{settings.aboutVisionHeading || "Our Vision"}</span>
                </h3>
                <p className="text-slate-650 leading-relaxed font-sans text-sm">
                  {settings.aboutVisionContent}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Core Values */}
        {values.length > 0 && (
          <div className="border-t border-slate-200 pt-16">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-950 mb-12 text-center uppercase font-mono tracking-wide">
              Our Professional Commitments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((val, idx) => {
                const IconComponent = (Icons as any)[val.iconName] || Icons.CheckCircle2;
                return (
                  <div key={idx} className="flex gap-4 p-6 bg-white border border-slate-200 rounded-md hover:shadow-md transition-shadow">
                    <div className="text-slate-650 shrink-0 mt-0.5">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base mb-2 font-mono uppercase tracking-wide">{val.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{val.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
