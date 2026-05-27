import Link from "next/link";

import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";

const aboutCopy =
  "艾卡斯(A-KAS)是一家成立在亞洲以「人本」為中心的專業中高階人力資源和企業管理顧問公司，協助企業在亞太地區聘任最適當的領導人才與專業人士。";

export function AboutPreviewSection() {
  return (
    <section className="bg-brand-cream py-24">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionTitle en="ABOUT A-KAS" zh="關於艾卡斯" />
            <p className="font-zh mb-6 mt-6 text-base leading-loose text-brand-charcoal/80">
              {aboutCopy}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex border border-brand-charcoal/20 px-7 py-3 font-zh text-sm text-brand-charcoal transition-all duration-300 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy"
            >
              了解更多
            </Link>
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
  );
}

export default AboutPreviewSection;
