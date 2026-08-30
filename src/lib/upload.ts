/**
 * Client-side file upload utility.
 * Uploads files via the /api/upload API route instead of Server Actions,
 * bypassing the 1MB body size limit that Server Actions impose.
 */
export async function uploadFile(formData: FormData): Promise<string | null> {
  try {
    const file = formData.get("file") as File;
    if (file && file.size > 2 * 1024 * 1024) {
      alert(
        "⚠️ SECURITY WARNING: FILE SIZE LIMIT EXCEEDED! ⚠️\n\n" +
        `The file "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)} MB, ` +
        "which exceeds the absolute server limit of 2.0 MB.\n\n" +
        "Upload has been terminated to protect server bandwidth and memory."
      );
      return null;
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Upload failed:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    return data.url || null;
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}
