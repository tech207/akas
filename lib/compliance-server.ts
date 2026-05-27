import fs from 'fs/promises'
import path from 'path'

export type LegalLink = {
  label: string
  href: string
}

export type CompanyDoc = {
  label: string
  type: string
  fileUrl: string
  uploadedAt: string
}

export type ComplianceData = {
  legalLinks: LegalLink[]
  companyDocs: CompanyDoc[]
}

const DATA_FILE = path.join(process.cwd(), 'data', 'compliance.json')

export async function getComplianceData(): Promise<ComplianceData> {
  try {
    const json = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(json) as ComplianceData
  } catch {
    return { legalLinks: [], companyDocs: [] }
  }
}

async function saveComplianceData(data: ComplianceData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// ── Legal Links ──────────────────────────────────────────────────

export async function updateLegalLink(
  originalLabel: string,
  newLabel: string,
  href: string
): Promise<void> {
  const data = await getComplianceData()
  const link = data.legalLinks.find((l) => l.label === originalLabel)
  if (!link) throw new Error(`Legal link "${originalLabel}" not found`)
  link.label = newLabel.trim() || originalLabel
  link.href = href
  await saveComplianceData(data)
}

export async function addLegalLink(label: string, href: string): Promise<void> {
  const data = await getComplianceData()
  if (data.legalLinks.some((l) => l.label === label)) {
    throw new Error(`Legal link "${label}" already exists`)
  }
  data.legalLinks.push({ label, href })
  await saveComplianceData(data)
}

export async function deleteLegalLink(label: string): Promise<void> {
  const data = await getComplianceData()
  const filtered = data.legalLinks.filter((l) => l.label !== label)
  if (filtered.length === data.legalLinks.length) {
    throw new Error(`Legal link "${label}" not found`)
  }
  data.legalLinks = filtered
  await saveComplianceData(data)
}

// ── Company Docs ─────────────────────────────────────────────────

export async function updateCompanyDocFile(
  label: string,
  fileUrl: string,
  type?: string
): Promise<void> {
  const data = await getComplianceData()
  const doc = data.companyDocs.find((d) => d.label === label)
  if (!doc) throw new Error(`Company doc "${label}" not found`)
  doc.fileUrl = fileUrl
  if (type) doc.type = type
  doc.uploadedAt = new Date().toISOString()
  await saveComplianceData(data)
}

export async function updateCompanyDoc(
  originalLabel: string,
  newLabel: string,
  type: string
): Promise<void> {
  const data = await getComplianceData()
  const doc = data.companyDocs.find((d) => d.label === originalLabel)
  if (!doc) throw new Error(`Company doc "${originalLabel}" not found`)
  doc.label = newLabel.trim() || originalLabel
  doc.type = type.trim()
  await saveComplianceData(data)
}

export async function addCompanyDoc(label: string, type: string): Promise<void> {
  const data = await getComplianceData()
  if (data.companyDocs.some((d) => d.label === label)) {
    throw new Error(`Company doc "${label}" already exists`)
  }
  data.companyDocs.push({ label, type: type || 'PDF', fileUrl: '', uploadedAt: '' })
  await saveComplianceData(data)
}

export async function deleteCompanyDoc(label: string): Promise<void> {
  const data = await getComplianceData()
  const filtered = data.companyDocs.filter((d) => d.label !== label)
  if (filtered.length === data.companyDocs.length) {
    throw new Error(`Company doc "${label}" not found`)
  }
  data.companyDocs = filtered
  await saveComplianceData(data)
}
