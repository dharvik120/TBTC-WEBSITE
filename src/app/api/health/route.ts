import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    // Perform lightweight query to keep Supabase PostgreSQL connection active & awake 24x7
    const settings = await prisma.companySettings.findFirst({
      select: { id: true, companyName: true, updatedAt: true },
    });

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      service: "Shree TBTC Global Portal",
      database: "connected",
      supabaseKeepAlive: "active",
      responseTimeMs: responseTime,
      timestamp: new Date().toISOString(),
      company: settings?.companyName || "Shree TBTC",
    }, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      }
    });
  } catch (error: any) {
    console.error("Health check / DB keep-alive error:", error);
    return NextResponse.json({
      status: "degraded",
      database: "disconnected",
      error: error?.message || "Database connection error",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

