import fs from 'fs/promises'
import path from 'path'

import type { Insight, InsightCategory } from './insights'
import { getSupabaseAdmin, hasSupabaseConfig } from './supabase-server'

const DATA_FILE = path.join(process.cwd(), 'data', 'insights.json')

type InsightRow = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  reading_time: string
  featured: boolean
  cover_tone: Insight['coverTone']
  cover_image_url: string | null
  tags: string[] | null
  content_html: string | null
  content: Insight['content']
}

function toInsight(row: InsightRow): Insight {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.date,
    readingTime: row.reading_time,
    featured: row.featured,
    coverTone: row.cover_tone,
    coverImageUrl: row.cover_image_url ?? undefined,
    tags: row.tags ?? undefined,
    contentHtml: row.content_html ?? undefined,
    content: row.content ?? []
  }
}

function toInsightRow(insight: Insight) {
  return {
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
  }
}

export async function getAllInsights(): Promise<Insight[]> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as InsightRow[]).map(toInsight)
  }

  try {
    const json = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(json) as Insight[]
  } catch {
    return []
  }
}

export async function getInsightBySlug(slug: string): Promise<Insight | undefined> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? toInsight(data as InsightRow) : undefined
  }

  const insights = await getAllInsights()
  return insights.find((i) => i.slug === slug)
}

export async function getRelatedInsights(
  currentSlug: string,
  category: InsightCategory
): Promise<Insight[]> {
  const insights = await getAllInsights()
  return insights
    .filter((i) => i.slug !== currentSlug && i.category === category)
    .slice(0, 3)
}

export async function createInsight(insight: Insight): Promise<void> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('insights').insert(toInsightRow(insight))
    if (error) throw new Error(error.message)
    return
  }

  const insights = await getAllInsights()
  if (insights.some((i) => i.slug === insight.slug)) {
    throw new Error(`Slug "${insight.slug}" already exists`)
  }
  insights.unshift(insight)
  await fs.writeFile(DATA_FILE, JSON.stringify(insights, null, 2), 'utf-8')
}

export async function updateInsight(slug: string, data: Insight): Promise<void> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('insights')
      .update(toInsightRow(data))
      .eq('slug', slug)

    if (error) throw new Error(error.message)
    return
  }

  const insights = await getAllInsights()
  const idx = insights.findIndex((i) => i.slug === slug)
  if (idx === -1) throw new Error(`Insight "${slug}" not found`)
  insights[idx] = data
  await fs.writeFile(DATA_FILE, JSON.stringify(insights, null, 2), 'utf-8')
}

export async function deleteInsight(slug: string): Promise<void> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('insights').delete().eq('slug', slug)
    if (error) throw new Error(error.message)
    return
  }

  const insights = await getAllInsights()
  const filtered = insights.filter((i) => i.slug !== slug)
  if (filtered.length === insights.length) throw new Error(`Insight "${slug}" not found`)
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8')
}
