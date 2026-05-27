import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'categories.json')

export async function getCategories(): Promise<string[]> {
  try {
    const json = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(json) as string[]
  } catch {
    return ['Executive Search', 'HR Advisory', 'Career', 'ESG Social', 'Labor Law']
  }
}

export async function addCategory(name: string): Promise<void> {
  const categories = await getCategories()
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Category name cannot be empty')
  if (categories.includes(trimmed)) throw new Error(`Category "${trimmed}" already exists`)
  categories.push(trimmed)
  await fs.writeFile(DATA_FILE, JSON.stringify(categories, null, 2), 'utf-8')
}
