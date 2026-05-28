import fs from 'fs/promises'
import path from 'path'

import { getSupabaseAdmin, hasSupabaseConfig } from './supabase-server'

const DATA_FILE = path.join(process.cwd(), 'data', 'categories.json')

export async function getCategories(): Promise<string[]> {
  if (hasSupabaseConfig()) {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw new Error(error.message)
    return data.map((category) => category.name)
  }

  try {
    const json = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(json) as string[]
  } catch {
    return ['Executive Search', 'HR Advisory', 'Career', 'ESG Social', 'Labor Law']
  }
}

export async function addCategory(name: string): Promise<void> {
  if (hasSupabaseConfig()) {
    const trimmed = name.trim()
    if (!trimmed) throw new Error('Category name cannot be empty')

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('categories').insert({ name: trimmed })
    if (error) throw new Error(error.message)
    return
  }

  const categories = await getCategories()
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Category name cannot be empty')
  if (categories.includes(trimmed)) throw new Error(`Category "${trimmed}" already exists`)
  categories.push(trimmed)
  await fs.writeFile(DATA_FILE, JSON.stringify(categories, null, 2), 'utf-8')
}
