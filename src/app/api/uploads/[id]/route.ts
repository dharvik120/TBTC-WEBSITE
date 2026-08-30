import { NextRequest, NextResponse } from "next/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const file = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!file) {
      return notFound();
    }

    // Set caching headers for better performance
    const headers = new Headers();
    headers.set("Content-Type", file.mimeType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    // Convert Prisma bytes representation to a standard Node Buffer
    const buffer = Buffer.from(file.data);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
