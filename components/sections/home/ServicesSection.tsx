import Link from 'next/link'
import { Building2, Search, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Container } from '@/components/common/Container'
import { SectionTitle } from '@/components/common/SectionTitle'

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

export function ServicesSection() {
  return (
    <section className="bg-brand-navy py-24">
      <Container>
        <SectionTitle en="OUR SERVICE" zh="我們的服務" light align="center" />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
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
              <Icon size={32} className="text-brand-red" strokeWidth={1.5} />

              <h3 className="mt-4 font-zh-serif text-xl text-white">{titleZh}</h3>

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
  )
}
