import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '法令專區',
  description: '艾卡斯管理顧問法令專區，包含就業服務相關法規連結與公司申訴、收費等文件下載。'
}
import { ExternalLink, FileText, Download } from 'lucide-react'

import { Container } from '@/components/common/Container'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import { SectionTitle } from '@/components/common/SectionTitle'

// ── Section 2：外部法規連結 ──────────────────────────────────────
const LEGAL_LINKS = [
  { label: '就業歧視及性別平等工作', href: '#' },
  { label: '違反勞動法令事業單位（雇主）查詢系統', href: '#' },
  { label: '台北市違反勞動法令公布專區', href: '#' },
  { label: '職業介紹和定型化契約', href: '#' },
  { label: '求職防騙宣導', href: '#' },
  { label: '個人隱私及防止性騷擾及其他就業相關訊息', href: '#' }
] as const

// ── Section 3：公司文件下載 ──────────────────────────────────────
type DocType = 'PDF' | 'JPG'

type CompanyDoc = {
  label: string
  type: DocType
}

const COMPANY_DOCS: readonly CompanyDoc[] = [
  { label: '艾卡斯就業服務許可証（台北市政府）', type: 'JPG' },
  { label: '艾卡斯就業服務專業人員證書', type: 'JPG' },
  { label: '艾卡斯申訴處理流程', type: 'PDF' },
  { label: '艾卡斯申訴流程處理機制', type: 'PDF' },
  { label: '艾卡斯收費項目及金額明細表', type: 'PDF' },
  { label: '艾卡斯性騷擾防治措施、申訴及調查處理要點', type: 'PDF' },
  { label: '艾卡斯工作場所性騷擾防治措施及懲戒規範', type: 'PDF' },
  { label: '艾卡斯職業介紹和定型化契約和個人資料使用同意書 (PDF)', type: 'PDF' }
] as const

// ───────────────────────────────────────────────────────────────
export default function RegulationsPage() {
  return (
    <main>
      {/* Section 1：Hero Banner */}
      <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-brand-navy px-4 text-center">
        <h1 className="font-display text-7xl font-light text-white">CONTENTS OF CL</h1>
        <p className="mt-2 font-zh-serif text-2xl text-brand-gold">/ 法令專區</p>
        <nav
          aria-label="Breadcrumb"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-white/40"
        >
          <Link href="/" className="transition-colors hover:text-white/70">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-white/60">法令專區</span>
        </nav>
      </section>

      {/* Section 2：外部法規連結 */}
      <ScrollReveal>
        <section className="bg-brand-cream py-16 px-4">
          <Container>
            <SectionTitle en="LEGAL REFERENCES" zh="相關法規連結" />
            <ul className="mt-10">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-brand-gold/20 py-4 transition-colors duration-200 hover:bg-red-50"
                  >
                    <span className="flex items-center">
                      <span className="mr-4 h-6 w-1 flex-shrink-0 bg-brand-red" />
                      <span className="font-zh text-brand-charcoal transition-colors duration-200 group-hover:text-brand-red">
                        {label}
                      </span>
                    </span>
                    <ExternalLink size={16} className="ml-4 flex-shrink-0 text-brand-gold" />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </ScrollReveal>

      {/* Section 3：公司文件下載 */}
      <ScrollReveal>
        <section className="bg-brand-navy py-16 px-4">
          <Container>
            <SectionTitle en="COMPANY DOCUMENTS" zh="公司文件下載" light />
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {COMPANY_DOCS.map(({ label, type }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-sm border border-brand-gold/20 bg-white/5 p-6"
                >
                  <div className="flex items-start gap-4">
                    <FileText size={24} className="mt-0.5 flex-shrink-0 text-brand-gold" strokeWidth={1.5} />
                    <div>
                      <p className="font-zh text-sm text-white">{label}</p>
                      <span className="mt-1 inline-block bg-brand-gold/20 px-2 py-0.5 font-sans text-xs text-brand-gold">
                        {type}
                      </span>
                    </div>
                  </div>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 flex flex-shrink-0 items-center gap-1.5 font-sans text-sm text-brand-gold transition-colors hover:text-white"
                    aria-label={`下載 ${label}`}
                  >
                    <Download size={16} />
                    下載
                  </a>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </ScrollReveal>
    </main>
  )
}
