import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { deleteInsight, getInsightBySlug, updateInsight } from '@/lib/insights-server'
import type { Insight } from '@/lib/insights'

type Ctx = { params: { slug: string } }

function isAuthed(): boolean {
  const token = cookies().get('admin_token')?.value
  return token === process.env.ADMIN_TOKEN
}

export async function GET(_req: Request, { params }: Ctx) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const insight = await getInsightBySlug(params.slug)
  if (!insight) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(insight)
}

export async function PUT(request: Request, { params }: Ctx) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as Insight
    await updateInsight(params.slug, body)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await deleteInsight(params.slug)
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}
