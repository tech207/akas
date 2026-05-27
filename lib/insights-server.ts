import fs from 'fs/promises'
import path from 'path'

import type { Insight, InsightCategory } from './insights'

const DATA_FILE = path.join(process.cwd(), 'data', 'insights.json')

export async function getAllInsights(): Promise<Insight[]> {
  try {
    const json = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(json) as Insight[]
  } catch {
    return []
  }
}

export async function getInsightBySlug(slug: string): Promise<Insight | undefined> {
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
  const insights = await getAllInsights()
  if (insights.some((i) => i.slug === insight.slug)) {
    throw new Error(`Slug "${insight.slug}" already exists`)
  }
  insights.unshift(insight)
  await fs.writeFile(DATA_FILE, JSON.stringify(insights, null, 2), 'utf-8')
}

export async function updateInsight(slug: string, data: Insight): Promise<void> {
  const insights = await getAllInsights()
  const idx = insights.findIndex((i) => i.slug === slug)
  if (idx === -1) throw new Error(`Insight "${slug}" not found`)
  insights[idx] = data
  await fs.writeFile(DATA_FILE, JSON.stringify(insights, null, 2), 'utf-8')
}

export async function deleteInsight(slug: string): Promise<void> {
  const insights = await getAllInsights()
  const filtered = insights.filter((i) => i.slug !== slug)
  if (filtered.length === insights.length) throw new Error(`Insight "${slug}" not found`)
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8')
}
