import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { updateCompanyDocFile } from "@/lib/compliance-server";

function sanitizeFileName(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  const baseName = path
    .basename(fileName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "compliance-doc"}-${Date.now()}${extension}`;
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const label = formData.get("label");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "未收到檔案" }, { status: 400 });
  }

  const safeFileName = sanitizeFileName(file.name);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "compliance");
  const uploadPath = path.join(uploadDir, safeFileName);
  const bytes = await file.arrayBuffer();

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, Buffer.from(bytes));

  const fileUrl = `/uploads/compliance/${safeFileName}`;
  const fileExtension = path.extname(file.name).replace(".", "").toUpperCase() || "FILE";

  // Persist upload record to compliance.json
  if (typeof label === "string" && label) {
    try {
      await updateCompanyDocFile(label, fileUrl, fileExtension);
    } catch {
      // Doc label not found in compliance.json — still return success for the file itself
    }
  }

  return NextResponse.json({
    ok: true,
    fileName: safeFileName,
    url: fileUrl,
    type: fileExtension
  });
}
