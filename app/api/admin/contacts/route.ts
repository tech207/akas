import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { getAllContactSubmissions, markContactAsRead } from '@/lib/contact-server'

function isAuthed(): boolean {
  const token = cookies().get('admin_token')?.value
  return token === process.env.ADMIN_TOKEN
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const submissions = await getAllContactSubmissions()
  return NextResponse.json(submissions)
}

export async function PUT(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = (await request.json()) as { id: string }
  await markContactAsRead(id)
  return NextResponse.json({ ok: true })
}

export async function POST(request: Request) {
  if (!isAuthed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { toEmail, toName, originalSubject, originalMessage, replyBody } =
    (await request.json()) as {
      toEmail: string
      toName: string
      originalSubject?: string
      originalMessage: string
      replyBody: string
    }

  if (!toEmail || !replyBody) {
    return NextResponse.json({ error: '缺少必填欄位' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  if (!apiKey || !from) {
    return NextResponse.json({ error: '尚未設定 Resend 環境變數' }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const subject = originalSubject ? `Re: ${originalSubject}` : 'Re: 您的聯絡表單'

  const html = `
    <p>${replyBody.replace(/\n/g, '<br />')}</p>
    <hr style="margin:32px 0;border:none;border-top:1px solid #e5e5e5" />
    <p style="color:#888;font-size:13px">
      <strong>原始訊息 / Original message</strong><br />
      ${originalMessage.replace(/\n/g, '<br />')}
    </p>
  `

  const { error } = await resend.emails.send({
    from,
    to: [toEmail],
    replyTo: from,
    subject,
    html
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
