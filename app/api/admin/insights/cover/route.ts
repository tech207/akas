import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function sanitizeFileName(fileName: string) {
  const ext = path.extname(fileName).toLowerCase()
  const base = path
    .basename(fileName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return `${base || 'cover'}-${Date.now()}${ext}`
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: '未收到檔案' }, { status: 400 })
  }

  const safeFileName = sanitizeFileName(file.name)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'insights')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, safeFileName), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ ok: true, url: `/uploads/insights/${safeFileName}` })
}
