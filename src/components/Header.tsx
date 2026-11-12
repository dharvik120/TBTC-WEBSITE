import React from "react";
import { getCompanySettings, getActiveCategories } from "@/lib/settings";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const [categories, settings] = await Promise.all([
    getActiveCategories(),
    getCompanySettings(),
  ]);

  return <HeaderClient settings={settings} categories={categories} />;
}
