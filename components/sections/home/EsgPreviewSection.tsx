import Link from "next/link";

import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";

const esgCopy =
  "涉及公司如何處理多元利害關係人的權益，包含管理供應鏈，勞資關係，員工健康安全及舒適，多元職場，薪酬福利，招聘和職涯發展，人權，客戶隱私和安全等問題諮詢和解決方案提供顧問服務。";

const esgItems = [
  { letter: "E", en: "Environmental", zh: "環境" },
  { letter: "S", en: "Social", zh: "社會" },
  { letter: "G", en: "Governance", zh: "治理" }
] as const;

export function EsgPreviewSection() {
  return (
    <section className="bg-brand-cream py-24">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle en="ESG SOCIAL(S)" zh="ESG 社會責任服務" />
            <p className="font-zh mt-6 text-base leading-loose text-brand-charcoal/80">
              {esgCopy}
            </p>
            <Link
              href="/esg"
              className="mt-10 inline-flex border border-brand-charcoal/20 px-7 py-3 font-zh text-sm text-brand-charcoal transition-all duration-300 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy"
            >
              了解 ESG 服務
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {esgItems.map((item) => (
              <article
                key={item.letter}
                className="border border-brand-gold/30 p-6 text-center"
              >
                <p className="font-display text-5xl font-light text-brand-gold">
                  {item.letter}
                </p>
                <h3 className="mt-5 font-sans text-sm font-semibold text-brand-charcoal">
                  {item.en}
                </h3>
                <p className="font-zh mt-2 text-sm text-brand-stone">
                  {item.zh}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default EsgPreviewSection;
