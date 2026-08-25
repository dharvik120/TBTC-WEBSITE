import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getCompanySettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCompanySettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <WhatsAppButton 
        whatsAppNumber={settings.whatsAppNumber} 
        companyName={settings.companyName} 
      />
    </div>
  );
}
