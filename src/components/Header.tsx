import React from "react";
import prisma from "@/lib/prisma";
import { getCompanySettings } from "@/lib/settings";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  // Fetch active categories for dropdown
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const settings = await getCompanySettings();

  return <HeaderClient settings={settings} categories={categories} />;
}
