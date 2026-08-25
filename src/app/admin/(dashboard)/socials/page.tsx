import React from "react";
import prisma from "@/lib/prisma";
import SocialsClient from "@/components/admin/SocialsClient";

export default async function AdminSocialsPage() {
  const socials = await prisma.socialPlatform.findMany({
    orderBy: { displayOrder: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
            Social Media Channels Manager
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Connect corporate pages, manage routing links, and select representative icons for footer, header and contact profiles.
          </p>
        </div>
      </div>

      <SocialsClient initialSocials={socials} />
    </div>
  );
}
