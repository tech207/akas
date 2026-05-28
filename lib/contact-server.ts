import fs from 'fs/promises'
import path from 'path'

import { getSupabaseAdmin, hasSupabaseConfig } from './supabase-server'

const DATA_FILE = path.join(process.cwd(), 'data', 'contacts.json')

export type ContactSubmission = {
  id: string
  nameZh: string
  nameEn?: string
  email: string
  subject?: string
  message: string
  read: boolean
  createdAt: string
}

type ContactRow = {
  id: string
  name_zh: string
  name_en: string | null
  email: string
  subject: string | null
  message: string
  read: boolean
  created_at: string
}

function toSubmission(row: ContactRow): ContactSubmission {
  return {
    id: row.id,
    nameZh: row.name_zh,
    nameEn: row.name_en ?? undefined,
    email: row.email,
    subject: row.subject ?? undefined,
    message: row.message,
    read: row.read,
    createdAt: row.created_at
  }
}

export async function saveContactSubmission(data: {
  nameZh: string
  nameEn?: string
  email: string
  subject?: string
  message: string
}): Promise<void> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('contact_submissions').insert({
      name_zh: data.nameZh,
      name_en: data.nameEn ?? null,
      email: data.email,
      subject: data.subject ?? null,
      message: data.message
    })
    if (error) throw new Error(error.message)
    return
  }

  const submissions = await readLocalSubmissions()
  submissions.unshift({
    id: crypto.randomUUID(),
    nameZh: data.nameZh,
    nameEn: data.nameEn,
    email: data.email,
    subject: data.subject,
    message: data.message,
    read: false,
    createdAt: new Date().toISOString()
  })
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf-8')
}

export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as ContactRow[]).map(toSubmission)
  }

  return readLocalSubmissions()
}

export async function markContactAsRead(id: string): Promise<void> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('contact_submissions')
      .update({ read: true })
      .eq('id', id)
    if (error) throw new Error(error.message)
    return
  }

  const submissions = await readLocalSubmissions()
  const idx = submissions.findIndex((s) => s.id === id)
  if (idx !== -1) {
    submissions[idx].read = true
    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf-8')
  }
}

async function readLocalSubmissions(): Promise<ContactSubmission[]> {
  try {
    const json = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(json) as ContactSubmission[]
  } catch {
    return []
  }
}
