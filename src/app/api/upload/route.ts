import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and generate unique safe filename
    const originalName = file.name || "unnamed";
    const ext = path.extname(originalName) || "";
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_\-]/g, "_");
    const uniqueFilename = `${Date.now()}-${baseName}${ext}`;

    // 1. Save to local server storage (Hostinger public/uploads folder)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    // 2. Also record in database UploadedFile table (stored inside phpMyAdmin / PostgreSQL / MySQL)
    try {
      await prisma.uploadedFile.create({
        data: {
          filename: originalName,
          mimeType: file.type || "application/octet-stream",
          data: buffer,
        },
      });
    } catch (dbErr) {
      console.warn("Could not mirror file to UploadedFile table:", dbErr);
    }

    // Return the clean, self-hosted URL on our own domain
    return NextResponse.json({ 
      url: `/uploads/${uniqueFilename}`,
      filename: originalName,
      size: file.size
    });
  } catch (error: any) {
    console.error("Self-hosted upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
