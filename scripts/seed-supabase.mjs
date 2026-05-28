import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createClient } from '@supabase/supabase-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

async function loadLocalEnv() {
  try {
    const raw = await readFile(path.join(root, '.env.local'), 'utf-8')
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (!match) continue
      const [, key, value] = match
      process.env[key] ??= value
    }
  } catch {
    // Environment variables may already be provided by the shell or CI.
  }
}

await loadLocalEnv()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'akas-assets'

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function readJson(relativePath) {
  const raw = await readFile(path.join(root, relativePath), 'utf-8')
  return JSON.parse(raw)
}

async function assertOk(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }
}

const categories = await readJson('data/categories.json')
const insights = await readJson('data/insights.json')
const compliance = await readJson('data/compliance.json')

await assertOk(
  await supabase.storage.createBucket(bucket, { public: true }),
  `create storage bucket ${bucket}`
).catch(async (error) => {
  if (!error.message.includes('already exists')) throw error
})

await assertOk(
  await supabase.from('categories').upsert(
    categories.map((name, index) => ({
      name,
      sort_order: index
    })),
    { onConflict: 'name' }
  ),
  'seed categories'
)

await assertOk(
  await supabase.from('insights').upsert(
    insights.map((insight) => ({
      slug: insight.slug,
      title: insight.title,
      excerpt: insight.excerpt,
      category: insight.category,
      date: insight.date,
      reading_time: insight.readingTime,
      featured: insight.featured ?? false,
      cover_tone: insight.coverTone,
      cover_image_url: insight.coverImageUrl ?? null,
      tags: insight.tags ?? null,
      content_html: insight.contentHtml ?? null,
      content: insight.content ?? []
    })),
    { onConflict: 'slug' }
  ),
  'seed insights'
)

await assertOk(
  await supabase.from('legal_links').upsert(
    compliance.legalLinks.map((link, index) => ({
      label: link.label,
      href: link.href ?? '',
      sort_order: index
    })),
    { onConflict: 'label' }
  ),
  'seed legal links'
)

await assertOk(
  await supabase.from('company_docs').upsert(
    compliance.companyDocs.map((doc, index) => ({
      label: doc.label,
      type: doc.type || 'PDF',
      file_url: doc.fileUrl ?? '',
      uploaded_at: doc.uploadedAt || null,
      sort_order: index
    })),
    { onConflict: 'label' }
  ),
  'seed company docs'
)

console.log('Seeded Supabase content successfully.')
