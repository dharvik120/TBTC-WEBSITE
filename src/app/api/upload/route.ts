import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Call Catbox upload API
    const catboxForm = new FormData();
    catboxForm.append("reqtype", "fileupload");
    catboxForm.append("fileToUpload", file);

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxForm,
    });

    if (!response.ok) {
      throw new Error(`Catbox error: ${response.statusText}`);
    }

    const fileUrl = await response.text();
    if (!fileUrl || !fileUrl.startsWith("http")) {
      throw new Error(`Invalid response from Catbox: ${fileUrl}`);
    }

    return NextResponse.json({ url: fileUrl.trim() });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
