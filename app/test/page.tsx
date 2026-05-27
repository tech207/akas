import { Container } from "@/components/common/Container";
import { GoldDivider } from "@/components/common/GoldDivider";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { SectionTitle } from "@/components/common/SectionTitle";

const revealItems = [
  {
    title: "Brand Presence",
    body: "A restrained visual system for a high-trust advisory experience."
  },
  {
    title: "Editorial Rhythm",
    body: "Large display typography, quiet spacing, and gold accents."
  },
  {
    title: "Bilingual Ready",
    body: "English and Traditional Chinese typography can coexist cleanly."
  }
];

export default function TestPage() {
  return (
    <main className="min-h-screen bg-brand-ivory text-brand-ink">
      <section className="border-b border-brand-gold/25 bg-brand-porcelain py-20">
        <Container>
          <div className="max-w-4xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.28em] text-brand-gold">
              Stage 1 Typography System
            </p>
            <h1 className="mt-6 font-display text-7xl font-light leading-none tracking-wide text-brand-ink sm:text-8xl">
              A-KAS
            </h1>
            <GoldDivider className="mt-8" width="w-24" />
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div>
                <p className="font-display text-4xl font-light italic">
                  Cormorant Garamond
                </p>
                <p className="mt-3 font-sans text-sm leading-6 text-brand-stone">
                  Display face for refined English headlines and brand moments.
                </p>
              </div>
              <div>
                <p className="font-sans text-2xl font-medium">DM Sans</p>
                <p className="mt-3 font-sans text-sm leading-6 text-brand-stone">
                  Body text, interface labels, and compact supporting copy.
                </p>
              </div>
              <div>
                <p className="font-zh-serif text-2xl font-bold">繁體中文標題</p>
                <p className="font-zh mt-3 text-sm leading-6 text-brand-stone">
                  中文內文使用 Noto 字型，確保閱讀穩定、字面清晰。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionTitle en="Selected Foundations" zh="基礎元件展示" />
            <p className="font-zh max-w-2xl text-lg leading-8 text-brand-stone">
              這個測試頁用來確認字型變數、Tailwind token、SectionTitle、
              GoldDivider 與 ScrollReveal 都能在 App Router 中正常運作。
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-brand-charcoal py-24">
        <Container>
          <SectionTitle
            en="Dark Surface"
            zh="深色背景版本"
            align="center"
            light
          />
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
            {revealItems.map((item, index) => (
              <ScrollReveal
                key={item.title}
                delay={index * 0.14}
                direction={index === 0 ? "left" : index === 2 ? "right" : "up"}
                className="h-full"
              >
                <article className="h-full border border-white/10 bg-white/[0.04] p-7 shadow-soft">
                  <h3 className="font-display text-3xl font-light tracking-wide text-white">
                    {item.title}
                  </h3>
                  <p className="mt-5 font-sans text-sm leading-6 text-white/70">
                    {item.body}
                  </p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <SectionTitle
                en="Scroll Reveal"
                zh="滾動進場動畫"
                align="center"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <p className="font-zh mt-10 text-lg leading-8 text-brand-stone">
                多個元素可透過 delay 形成 stagger 節奏，動畫使用
                easeOutQuint 曲線，保持低調但精準的高端品牌感。
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </main>
  );
}
