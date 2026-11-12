import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url") || searchParams.get("file");
    const name = searchParams.get("name") || "TBTC_Document";
    const action = searchParams.get("action") || "download"; // "download" | "view"

    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    let buffer: Buffer | null = null;
    let contentType = "application/pdf";

    // 1. Direct local file check
    if (url.startsWith("/uploads/") || url.startsWith("uploads/")) {
      const cleanPath = url.replace(/^\/?uploads\//, "");
      const localPath = path.join(process.cwd(), "public", "uploads", cleanPath);
      if (fs.existsSync(localPath)) {
        buffer = fs.readFileSync(localPath);
        const ext = path.extname(cleanPath).toLowerCase();
        if (ext === ".pdf") contentType = "application/pdf";
        else if (ext === ".xlsx" || ext === ".xls") contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        else if (ext === ".doc" || ext === ".docx") contentType = "application/msword";
        else if (ext === ".png") contentType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      }
    } else if (url.startsWith("/api/uploads/")) {
      const id = url.replace("/api/uploads/", "");
      const dbFile = await prisma.uploadedFile.findUnique({ where: { id } });
      if (dbFile) {
        buffer = Buffer.from(dbFile.data);
        contentType = dbFile.mimeType || "application/pdf";
      }
    }

    // 2. Fallback to HTTP fetch if not found locally
    if (!buffer) {
      const fetchUrl = url.startsWith("/")
        ? `${request.nextUrl.origin}${url}`
        : url;

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        return new NextResponse("Failed to retrieve document", { status: response.status });
      }
      contentType = response.headers.get("content-type") || "application/pdf";
      buffer = Buffer.from(await response.arrayBuffer());
    }

    // Build a clean, professional filename
    let filename = name.trim();
    if (!filename.includes(".")) {
      if (contentType.includes("pdf")) {
        filename += ".pdf";
      } else if (contentType.includes("spreadsheet") || contentType.includes("excel")) {
        filename += ".xlsx";
      } else if (contentType.includes("msword") || contentType.includes("document")) {
        filename += ".docx";
      } else {
        filename += ".pdf";
      }
    }

    const safeName = filename.replace(/[^\w\s\-_.()]/g, "_");
    const disposition = action === "view" ? "inline" : "attachment";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", String(buffer.length));
    headers.set(
      "Content-Disposition",
      `${disposition}; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(filename)}`
    );
    headers.set("Cache-Control", "public, max-age=86400, must-revalidate");

    return new NextResponse(new Uint8Array(buffer), { status: 200, headers });
  } catch (error: unknown) {
    console.error("Download proxy error:", error);
    const message = error instanceof Error ? error.message : "Download failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
