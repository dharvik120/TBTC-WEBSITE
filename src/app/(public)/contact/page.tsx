export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  const settings = await getCompanySettings();
  const fields = await prisma.formField.findMany({
    where: { isActive: true, formType: "CONTACT" },
    orderBy: { displayOrder: "asc" }
  });

  const phones = settings.phoneNumbers ? settings.phoneNumbers.split(",").map(p => p.trim()) : [];

  return (
    <div className="w-full py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-mono text-slate-400 mb-6 flex items-center gap-1.5 uppercase">
          <Link href="/" className="hover:text-slate-600">Home</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">Contact Us</span>
        </nav>

        {/* Heading */}
        <div className="border-b border-slate-200 pb-8 mb-12">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Contact Our Sales & Support
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl font-sans">
            Reach out to Shree TBTC Global Industries. We provide professional sales support and standard quotations for all industrial electrical and steel requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Coordinates */}
          <div className="lg:col-span-5 space-y-8 font-sans">
            
            {/* Address */}
            {settings.address && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase font-mono tracking-wider mb-1">Office Address</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{settings.address}</p>
                </div>
              </div>
            )}

            {/* Phones */}
            {phones.length > 0 && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase font-mono tracking-wider mb-1">Phone Contacts</h3>
                  <div className="flex flex-col gap-1 text-slate-650 text-xs">
                    {phones.map((phone, idx) => (
                      <a key={idx} href={`tel:${phone}`} className="hover:text-primary transition-colors hover:underline font-semibold">{phone}</a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            {settings.email && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase font-mono tracking-wider mb-1">Email Coordinates</h3>
                  <a href={`mailto:${settings.email}`} className="text-slate-650 text-xs hover:text-primary hover:underline font-semibold">{settings.email}</a>
                </div>
              </div>
            )}

            {/* Business Hours */}
            {settings.businessHours && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase font-mono tracking-wider mb-1">Working Hours</h3>
                  <p className="text-slate-650 text-xs leading-relaxed">{settings.businessHours}</p>
                </div>
              </div>
            )}

            {/* Google Maps Embed (if provided) */}
            {settings.googleMapsEmbed && (
              <div className="border border-slate-200 rounded-md overflow-hidden h-64 shadow-sm">
                <iframe
                  title="Office Location Map"
                  src={settings.googleMapsEmbed}
                  className="w-full h-full border-0"
                  allowFullScreen={false}
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <ContactForm fields={fields} />
          </div>
        </div>
      </div>
    </div>
  );
}
