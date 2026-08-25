/**
 * Client-side file upload utility.
 * Uploads files via the /api/upload API route instead of Server Actions,
 * bypassing the 1MB body size limit that Server Actions impose.
 */
export async function uploadFile(formData: FormData): Promise<string | null> {
  try {
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
