import { Container } from '@/components/common/Container'

const STATS = [
  { value: '20+', labelEn: 'Years of Industry Experience', labelZh: '業界服務年資' },
  { value: 'Asia Pacific', labelEn: 'Service Region', labelZh: '服務地區' },
  { value: '3', labelEn: 'Core Service Areas', labelZh: '核心服務領域' }
] as const

export function StatsSection() {
  return (
    <section className="bg-brand-red py-12">
      <Container>
        <div className="grid grid-cols-1 divide-y divide-white/20 md:grid-cols-3 md:divide-x md:divide-y-0">
          {STATS.map(({ value, labelEn, labelZh }) => (
            <div key={labelEn} className="py-8 text-center md:py-0">
              <p className="font-display text-6xl font-light text-white">{value}</p>
              <p className="mt-2 font-sans text-sm uppercase tracking-wider text-white/80">{labelEn}</p>
              <p className="mt-1 font-zh text-xs text-white/60">{labelZh}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
