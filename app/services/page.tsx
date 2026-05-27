import Link from 'next/link'
import { Building2, Search, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Container } from '@/components/common/Container'
import { ScrollReveal } from '@/components/common/ScrollReveal'

// ── Section 3 data ──────────────────────────────────────────────
type ServiceCard = {
  icon: LucideIcon
  titleZh: string
  items: readonly string[]
  featured?: boolean
}

const SERVICES: readonly ServiceCard[] = [
  {
    icon: Building2,
    titleZh: '企業客戶服務',
    items: ['專業派遣服務', '企業輔導服務和教育訓練服務', '身心靈和文化藝術課程規劃']
  },
  {
    icon: Search,
    titleZh: '獵才招聘',
    items: ['一般中高階獵才', '策略性人力發展獵才服務', '指定性獵才服務'],
    featured: true
  },
  {
    icon: User,
    titleZh: '個人客戶服務',
    items: ['職涯服務和諮詢', '身心靈諮詢', '心理諮詢服務']
  }
] as const

// ───────────────────────────────────────────────────────────────
export default function ServicesPage() {
  return (
    <main>
      {/* Section 1：Hero Banner */}
      <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-brand-navy px-4 text-center">
        <h1 className="font-display text-7xl font-light text-white">OUR SERVICE</h1>
        <p className="mt-2 font-zh-serif text-2xl text-brand-gold">/ 我們的服務</p>
        <nav
          aria-label="Breadcrumb"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-white/40"
        >
          <Link href="/" className="transition-colors hover:text-white/70">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-white/60">Services</span>
        </nav>
      </section>

      {/* Section 2：服務說明 */}
      <ScrollReveal>
        <section className="bg-brand-cream py-12 px-4 text-center">
          <p className="mx-auto max-w-2xl font-zh text-base text-brand-charcoal/70">
            艾卡斯為個人客戶提供職涯服務與相關心理諮詢服務；
            為企業客戶提供中高階獵才服務、專業派遣服務、以及相關教育訓練與課程規劃。
          </p>
          <p className="mt-8 font-display text-3xl text-brand-navy">WHAT WE DO? 服務項目</p>
        </section>
      </ScrollReveal>

      {/* Section 3：服務三欄 */}
      <ScrollReveal>
        <section className="bg-brand-navy py-20 px-4">
          <Container>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {SERVICES.map(({ icon: Icon, titleZh, items, featured }) => (
                <div
                  key={titleZh}
                  className={[
                    'group flex flex-col rounded-sm border bg-white/5 p-8 transition-all duration-300',
                    'hover:-translate-y-1 hover:border-brand-gold/60',
                    featured
                      ? 'border-brand-gold/20 border-t-4 border-t-brand-gold'
                      : 'border-brand-gold/20'
                  ].join(' ')}
                >
                  <Icon size={40} className="text-brand-red" strokeWidth={1.5} />
                  <h3 className="mt-4 font-zh-serif text-2xl text-white">{titleZh}</h3>
                  <ul className="mt-4 flex-1 space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 font-zh text-sm text-white/65">
                        <span className="mt-0.5 flex-shrink-0 text-brand-gold">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="mt-8 inline-block self-start border border-brand-gold px-5 py-2 font-sans text-xs text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
                  >
                    Contact US
                  </Link>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </ScrollReveal>

      {/* Section 4：CTA 條帶 */}
      <ScrollReveal>
        <section className="bg-brand-red py-12 px-4 text-center">
          <p className="font-zh text-2xl text-white">想瞭解更多？與我們的顧問直接對話。</p>
          <Link
            href="/contact"
            className="mt-6 inline-block border border-white px-8 py-3 font-sans text-sm text-white transition-all duration-300 hover:bg-white hover:text-brand-red"
          >
            聯絡我們
          </Link>
        </section>
      </ScrollReveal>
    </main>
  )
}
