import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: '關於艾卡斯',
  description: '了解艾卡斯管理顧問的背景、理念與顧問團隊，20年以上業界服務經驗，深耕亞太地區。'
};

import { Container } from "@/components/common/Container";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { SectionTitle } from "@/components/common/SectionTitle";

const aboutCopy =
  "艾卡斯(A-KAS)是一家成立在亞洲以「人本」為中心的專業中高階人力資源和企業管理顧問公司。透過我們全方面性對人才經營的理念和用心並善用策略聯盟體系，並憑藉我們對於業別市場/企業組織/專業人才的豐富經驗及嚴謹的風險管理流程；艾卡斯成功的協助眾多集團客戶在亞太地區聘任最適當的領導人才和專業人士並且協助集團客戶在人力發展上人才的穩定和組織的成長。我們並提供企業專業獵才和顧問服務,企業輔導服務和教育訓練服務, 身心靈和文化藝術課程規劃, 個人職涯服務和諮詢, 身心靈諮詢和心理諮詢服務。";

const philosophyCopy =
  "艾卡斯(A-KAS)的顧問都是群在業界服務20年以上的專業人士並且有共同的人生哲學-服務人群和資源分享, 我們並以過去一位智者的所言激勵同仁彼此 – 生活的目的在增進人類全體的生活, 生命的意義在創造宇宙繼起之生命。";

export default function AboutPage() {
  return (
    <>
      <ScrollReveal>
        <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-brand-navy px-4 text-center">
          <h1 className="font-display text-7xl font-light text-white">
            ABOUT A-KAS
          </h1>
          <p className="font-zh-serif mt-2 text-2xl text-brand-gold">
            / 關於艾卡斯
          </p>

          <nav
            aria-label="Breadcrumb"
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm text-white/40"
          >
            <Link href="/" className="transition-colors hover:text-white/70">
              Home
            </Link>
            <span aria-hidden="true">&gt;</span>
            <span>About</span>
          </nav>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-brand-cream py-24">
          <Container>
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <SectionTitle en="ABOUT A-KAS" zh="關於艾卡斯" />
                <p className="font-zh mb-6 mt-6 text-base leading-loose text-brand-charcoal/80">
                  {aboutCopy}
                </p>
                <p className="font-zh mb-6 text-base leading-loose text-brand-charcoal/80">
                  {philosophyCopy}
                </p>
              </div>

              <div className="lg:col-span-2">
                <div className="relative flex aspect-[3/4] items-center justify-center bg-brand-navy px-8 py-12 after:absolute after:bottom-0 after:right-0 after:h-12 after:w-12 after:border-b after:border-r after:border-brand-gold">
                  <blockquote className="text-center font-display text-xl font-light italic leading-relaxed text-white/80">
                    生活的目的在增進人類全體的生活，生命的意義在創造宇宙繼起之生命。
                  </blockquote>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-brand-red px-4 py-16">
          <h2 className="text-center font-zh-serif text-2xl font-bold text-white">
            【求職安全諮詢專線】
          </h2>
          <p className="font-zh mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/90">
            親愛的求職者：若您於求職面試或工作中遇有任何詐騙、爭議或任何情況，請您直接與提供您服務之顧問聯繫，或撥打以下專線諮詢：
          </p>
          <div className="mt-6 flex flex-col justify-center gap-4 text-center sm:flex-row">
            <p className="font-mono text-lg font-bold text-white">
              臺北市勞動局：0800-085151
            </p>
            <p className="font-mono text-lg font-bold text-white">
              艾卡斯管理顧問線：02-2711-7762 獵頭部
            </p>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
