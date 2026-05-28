import { NextResponse } from "next/server";
import { z } from "zod";

import { saveContactSubmission } from "@/lib/contact-server";

const contactSchema = z.object({
  nameZh: z.string().min(1, "請填寫中文姓名"),
  nameEn: z.string().optional(),
  email: z.string().email("請填寫正確 Email 格式"),
  subject: z.string().optional(),
  message: z.string().min(10, "訊息至少 10 個字")
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await saveContactSubmission(result.data);
  } catch {
    return NextResponse.json({ ok: false, error: "儲存失敗，請稍後再試" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
