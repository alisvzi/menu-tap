export type LocalUploadedFile = {
  url: string;
  name: string;
  size: number;
  type: string;
};

export async function uploadFiles(files: File[], folder?: string): Promise<LocalUploadedFile[]> {
  const form = new FormData();
  if (folder) form.append("folder", folder);
  for (const f of files) form.append("files", f);

  const res = await fetch("/api/uploads", { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Upload failed");
  }
  const data = await res.json();
  return (data?.files || []) as LocalUploadedFile[];
}