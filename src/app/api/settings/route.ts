import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.companySettings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      settings = await prisma.companySettings.create({
        data: {
          id: "singleton",
          companyName: "Shree TBTC Global Industries",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings API:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}
