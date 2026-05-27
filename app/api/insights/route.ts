import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { createInsight, getAllInsights } from '@/lib/insights-server'
import type { Insight } from '@/lib/insights'

function isAuthed(): boolean {
  const token = cookies().get('admin_token')?.value
  return token === process.env.ADMIN_TOKEN
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const insights = await getAllInsights()
  return NextResponse.json(insights)
}

export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json() as Insight
    await createInsight(body)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
