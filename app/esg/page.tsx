import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ESG Social(s)服務',
  description: '艾卡斯提供 ESG 相關顧問服務，涵蓋供應鏈管理、勞資關係、多元職場、人才發展等議題。'
}
import {
  Network,
  Users,
  ShieldCheck,
  Globe,
  Wallet,
  UserPlus,
  type LucideIcon
} from 'lucide-react'

import { Container } from '@/components/common/Container'
import { ScrollReveal } from '@/components/common/ScrollReveal'
import { SectionTitle } from '@/components/common/SectionTitle'

// ── Section 3 data ──────────────────────────────────────────────
type EsgPillar = {
  letter: string
  en: string
  zh: string
  points: readonly string[]
}

const PILLARS: readonly EsgPillar[] = [
  {
    letter: 'E',
    en: 'Environmental',
    zh: '環境',
    points: ['供應鏈管理', '環境風險評估', '永續發展策略']
  },
  {
    letter: 'S',
    en: 'Social',
    zh: '社會',
    points: ['員工健康安全', '多元職場政策', '人才發展規劃']
  },
  {
    letter: 'G',
    en: 'Governance',
    zh: '治理',
    points: ['公司治理顧問', '合規風險管理', '利害關係人管理']
  }
] as const

// ── Section 4 data ──────────────────────────────────────────────
type ServiceScope = {
  icon: LucideIcon
  label: string
}

const SCOPES: readonly ServiceScope[] = [
  { icon: Network,    label: '供應鏈管理' },
  { icon: Users,      label: '勞資關係' },
  { icon: ShieldCheck, label: '員工健康安全' },
  { icon: Globe,      label: '多元職場' },
  { icon: Wallet,     label: '薪酬福利' },
  { icon: UserPlus,   label: '人才招聘與發展' }
] as const

// ───────────────────────────────────────────────────────────────
export default function EsgPage() {
  return (
    <main>
      {/* Section 1：Hero Banner */}
      <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-brand-navy px-4 text-center">
        <h1 className="font-display text-7xl font-light text-white">ESG SOCIAL(S)服務</h1>
        <p className="mt-2 font-zh-serif text-2xl text-brand-gold">/ 企業社會責任服務</p>
        <nav
          aria-label="Breadcrumb"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-white/40"
        >
          <Link href="/" className="transition-colors hover:text-white/70">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-white/60">ESG</span>
        </nav>
      </section>

      {/* Section 2：服務說明 */}
      <ScrollReveal>
        <section className="bg-brand-cream py-24 px-4 text-center">
          <p className="mx-auto max-w-3xl font-zh text-lg leading-loose text-brand-ink">
            涉及公司如何處理多元利害關係人的權益，包含管理供應鏈，勞資關係，員工健康安全及舒適，
            多元職場，薪酬福利，招聘和職涯發展，人權，客戶隱私和安全等問題諮詢和解決方案提供顧問服務。
          </p>
        </section>
      </ScrollReveal>

      {/* Section 3：E / S / G 三欄 */}
      <ScrollReveal>
        <section className="bg-brand-navy py-20 px-4">
          <Container>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {PILLARS.map(({ letter, en, zh, points }) => (
                <div key={letter} className="border-t-2 border-brand-gold pt-8 text-center">
                  <p className="font-display text-8xl font-light text-brand-gold">{letter}</p>
                  <p className="mt-2 font-sans text-xl text-white">{en}</p>
                  <p className="font-zh text-lg text-brand-stone">{zh}</p>
                  <ul className="mt-4 space-y-2">
                    {points.map((point) => (
                      <li key={point} className="font-zh text-sm text-brand-stone/70">{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </ScrollReveal>

      {/* Section 4：服務範疇 */}
      <ScrollReveal>
        <section className="bg-brand-cream py-16 px-4">
          <Container>
            <SectionTitle en="SERVICE SCOPE" zh="服務範疇" align="center" />
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3">
              {SCOPES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 border border-brand-gold/30 p-6 text-center transition-colors duration-300 hover:border-brand-gold/60"
                >
                  <Icon size={32} className="text-brand-gold" strokeWidth={1.5} />
                  <span className="font-zh text-base text-brand-ink">{label}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </ScrollReveal>
    </main>
  )
}
