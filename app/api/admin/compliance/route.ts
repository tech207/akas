import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import {
  addCompanyDoc,
  addLegalLink,
  deleteCompanyDoc,
  deleteLegalLink,
  getComplianceData,
  updateCompanyDoc,
  updateLegalLink
} from '@/lib/compliance-server'

function isAuthed(): boolean {
  const token = cookies().get('admin_token')?.value
  return token === process.env.ADMIN_TOKEN
}

export async function GET() {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await getComplianceData()
  return NextResponse.json(data)
}

// PUT — update a link OR a doc entry
// Body: { target: 'link'|'doc', originalLabel, label, href?, type? }
export async function PUT(request: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as {
      target: 'link' | 'doc'
      originalLabel: string
      label: string
      href?: string
      type?: string
    }

    if (body.target === 'doc') {
      await updateCompanyDoc(body.originalLabel, body.label, body.type ?? '')
    } else {
      await updateLegalLink(body.originalLabel, body.label, body.href ?? '')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// POST — add a new link OR doc entry
// Body: { target: 'link'|'doc', label, href?, type? }
export async function POST(request: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as {
      target: 'link' | 'doc'
      label: string
      href?: string
      type?: string
    }

    if (body.target === 'doc') {
      await addCompanyDoc(body.label, body.type ?? 'PDF')
    } else {
      await addLegalLink(body.label, body.href ?? '')
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

// DELETE — remove a link OR doc entry
// Body: { target: 'link'|'doc', label }
export async function DELETE(request: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as { target: 'link' | 'doc'; label: string }

    if (body.target === 'doc') {
      await deleteCompanyDoc(body.label)
    } else {
      await deleteLegalLink(body.label)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 404 })
  }
}
