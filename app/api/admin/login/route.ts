import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const submittedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

  if (
    (expectedEmail && submittedEmail !== expectedEmail) ||
    !password ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: '帳號或密碼錯誤' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_token', process.env.ADMIN_TOKEN!, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8 // 8 hours
  })
  return response
}
