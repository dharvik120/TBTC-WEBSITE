import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import MyAccountClient from "@/components/admin/MyAccountClient";

export default async function MyAccountPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-mono uppercase">
          My Profile Configuration
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Customize your username, email credentials, avatar signature logo, and password passkey.
        </p>
      </div>

      <MyAccountClient
        user={{
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage
        }}
      />
    </div>
  );
}
