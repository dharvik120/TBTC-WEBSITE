import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the file stream to a static memory Buffer/Blob
    // to prevent multipart boundary issues in serverless runtimes.
    const bytes = await file.arrayBuffer();
    const fileBlob = new Blob([bytes], { type: file.type });

    const catboxForm = new FormData();
    catboxForm.append("reqtype", "fileupload");
    catboxForm.append("fileToUpload", fileBlob, file.name || "upload");

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: catboxForm,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Catbox error: ${response.statusText} (${errorText})`);
    }

    const fileUrl = await response.text();
    if (!fileUrl || !fileUrl.startsWith("http")) {
      throw new Error(`Invalid response from Catbox: ${fileUrl}`);
    }

    return NextResponse.json({ url: fileUrl.trim() });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
