export const dynamic = "force-dynamic";

import React from "react";
import ProductsPage from "../page";

interface CategoryPageProps {
  params: Promise<{
    "category-slug": string;
  }>;
  searchParams: Promise<{
    q?: string;
    brand?: string;
    availability?: string;
    sort?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = resolvedParams["category-slug"];

  // Re-use ProductsPage layout by passing the category slug in searchParams wrapper
  const mergedSearchParams = Promise.resolve({
    ...resolvedSearchParams,
    category: categorySlug,
  });

  return <ProductsPage searchParams={mergedSearchParams} />;
}
