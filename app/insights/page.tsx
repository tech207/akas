import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { ArticleCard } from "@/components/sections/insights/ArticleCard";
import { getAllInsights } from "@/lib/insights-server";
import { INSIGHT_CATEGORIES } from "@/lib/insights";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const insights = await getAllInsights();
  const featuredInsight = insights.find((i) => i.featured) ?? insights[0];
  const remainingInsights = insights.filter((i) => i.slug !== featuredInsight?.slug);

  return (
    <>
      <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-brand-navy px-4 text-center">
        <h1 className="font-display text-7xl font-light text-white">INSIGHTS</h1>
        <p className="font-zh-serif mt-2 text-2xl text-brand-gold">/ 洞見專欄</p>
        <nav
          aria-label="Breadcrumb"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm text-white/40"
        >
          <Link href="/" className="transition-colors hover:text-white/70">Home</Link>
          <span aria-hidden="true">&gt;</span>
          <span>Insights</span>
        </nav>
      </section>

      <ScrollReveal>
        <section className="bg-brand-cream py-20">
          <Container>
            {featuredInsight && (
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
                <Link
                  href={`/insights/${featuredInsight.slug}`}
                  className="relative flex min-h-[360px] overflow-hidden bg-brand-navy p-8 text-white"
                >
                  <span className="absolute -right-6 -top-8 font-display text-[11rem] font-light leading-none text-white/5">
                    A
                  </span>
                  <div className="relative mt-auto">
                    <p className="font-sans text-xs uppercase tracking-[0.3em] text-brand-gold">
                      Featured Article
                    </p>
                    <h2 className="font-zh-serif mt-5 max-w-xl text-3xl font-bold leading-snug lg:text-4xl">
                      {featuredInsight.title}
                    </h2>
                    <p className="font-zh mt-5 max-w-lg text-base leading-8 text-white/70">
                      {featuredInsight.excerpt}
                    </p>
                  </div>
                </Link>

                <div className="flex flex-col justify-center border-y border-brand-gold/30 py-10">
                  <p className="font-sans text-xs uppercase tracking-[0.28em] text-brand-gold">
                    A-KAS Perspective
                  </p>
                  <h2 className="mt-4 font-display text-5xl font-light text-brand-charcoal">
                    Knowledge for better decisions.
                  </h2>
                  <p className="font-zh mt-6 max-w-2xl text-base leading-loose text-brand-charcoal/70">
                    我們將獵才招聘、人資顧問、職涯諮詢、ESG Social 與勞動議題整理為可閱讀、可討論、可行動的專業觀點，協助企業與人才做出更穩定的選擇。
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {INSIGHT_CATEGORIES.map((category) => (
                      <span
                        key={category}
                        className="border border-brand-gold/40 px-4 py-2 font-sans text-xs text-brand-charcoal"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-brand-porcelain py-20">
          <Container>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.28em] text-brand-gold">Latest</p>
                <h2 className="mt-3 font-display text-5xl font-light text-brand-charcoal">Articles</h2>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {remainingInsights.map((insight) => (
                <ArticleCard key={insight.slug} insight={insight} />
              ))}
            </div>
          </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-brand-red py-14 text-center">
          <Container>
            <p className="font-zh-serif text-2xl font-bold text-white">
              需要針對企業人才、職涯或 ESG Social 議題進一步討論？
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 border border-white px-8 py-3 font-sans text-sm text-white transition-all duration-300 hover:bg-white hover:text-brand-red"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
          </Container>
        </section>
      </ScrollReveal>
    </>
  );
}
