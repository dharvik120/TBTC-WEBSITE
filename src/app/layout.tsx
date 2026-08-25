export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import "./globals.css";
import { QuoteCartProvider } from "@/context/QuoteCartContext";
import { getCompanySettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCompanySettings();
  const title = settings.seoTitleDefault || `${settings.companyName} | Industrial Electrical & Automation`;
  const description = settings.seoDescriptionDefault || `${settings.companyName} is your premier partner for industrial automation and electrical components.`;
  const logoUrl = "https://www.stbtcgi.in/images/logo.png"; // Dynamic canonical URL fallback

  return {
    title: {
      template: `%s | ${settings.companyName}`,
      default: title,
    },
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: "https://www.stbtcgi.in",
      siteName: settings.companyName,
      images: [
        {
          url: logoUrl,
          width: 800,
          height: 600,
          alt: settings.companyName,
        }
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [logoUrl],
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getCompanySettings();
  
  const primaryColor = settings?.primaryColor || "#0b3c5d";
  const secondaryColor = settings?.secondaryColor || "#d9534f";
  const accentColor = settings?.accentColor || "#328cc1";
  const backgroundColor = settings?.backgroundColor || "#ffffff";
  const darkSectionColor = settings?.darkSectionColor || "#0f172a";
  const textColor = settings?.textColor || "#334155";
  const buttonColor = settings?.buttonColor || "#0b3c5d";
  const buttonHoverColor = settings?.buttonHoverColor || "#0d4870";
  const linkColor = settings?.linkColor || "#0b3c5d";

  return (
    <html 
      lang="en" 
      className="h-full antialiasedScroll"
      suppressHydrationWarning
      style={{
        "--primary-color": primaryColor,
        "--secondary-color": secondaryColor,
        "--accent-color": accentColor,
        "--background-color": backgroundColor,
        "--dark-section-color": darkSectionColor,
        "--text-color": textColor,
        "--button-color": buttonColor,
        "--button-hover-color": buttonHoverColor,
        "--link-color": linkColor,
      } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <QuoteCartProvider>
          {children}
        </QuoteCartProvider>
      </body>
    </html>
  );
}
