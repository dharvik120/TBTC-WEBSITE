import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Automatically determine the correct Cloudinary resource type
      let resourceType = "raw";
      if (file.type.startsWith("image/")) {
        resourceType = "image";
      } else if (file.type.startsWith("video/")) {
        resourceType = "video";
      }

      // Generate signature for secure authenticated upload to Cloudinary
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const signatureStr = `timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

      const bytes = await file.arrayBuffer();
      const fileBlob = new Blob([bytes], { type: file.type });

      const cloudinaryForm = new FormData();
      cloudinaryForm.append("file", fileBlob, file.name);
      cloudinaryForm.append("api_key", apiKey);
      cloudinaryForm.append("timestamp", timestamp);
      cloudinaryForm.append("signature", signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: "POST",
        body: cloudinaryForm,
      });

      const resText = await response.text();

      if (!response.ok) {
        console.error(`Cloudinary upload failed for ${file.name} (type: ${resourceType}):`, resText);
        throw new Error(`Cloudinary upload failed: ${response.statusText} (${resText})`);
      }

      const resData = JSON.parse(resText);
      return NextResponse.json({ url: resData.secure_url });
    } else {
      // Fallback: Save in database if Cloudinary environment variables are missing
      const prisma = (await import("@/lib/prisma")).default;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploaded = await prisma.uploadedFile.create({
        data: {
          filename: file.name || "unnamed",
          mimeType: file.type || "application/octet-stream",
          data: buffer,
        },
      });

      return NextResponse.json({ url: `/api/uploads/${uploaded.id}` });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
