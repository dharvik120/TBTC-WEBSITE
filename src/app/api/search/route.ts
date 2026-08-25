import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json([]);
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { modelNumber: { contains: query } },
          { sku: { contains: query } },
          { shortDescription: { contains: query } },
          { category: { name: { contains: query } } },
          { brand: { name: { contains: query } } },
        ],
      },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { displayOrder: "asc" },
          take: 1,
        },
      },
      take: 8,
    });

    const results = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      modelNumber: p.modelNumber,
      categoryName: p.category.name,
      brandName: p.brand?.name || null,
      imageUrl: p.images[0]?.imageUrl || null,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
