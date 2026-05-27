import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { addCategory, getCategories } from '@/lib/categories-server'

function isAuthed() {
  return cookies().get('admin_token')?.value === process.env.ADMIN_TOKEN
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const categories = await getCategories()
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { name } = (await request.json()) as { name: string }
    await addCategory(name)
    const updated = await getCategories()
    return NextResponse.json(updated, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
