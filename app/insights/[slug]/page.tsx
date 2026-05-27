import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { ArticleCard } from "@/components/sections/insights/ArticleCard";
import { getAllInsights, getInsightBySlug, getRelatedInsights } from "@/lib/insights-server";
import { legacyContentToHtml } from "@/lib/insights";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) return { title: "Insight Not Found | A-KAS" };
  return {
    title: `${insight.title} | A-KAS Insights`,
    description: insight.excerpt,
    keywords: insight.tags?.join(", ") ?? undefined,
    openGraph: {
      title: insight.title,
      description: insight.excerpt,
      images: insight.coverImageUrl ? [{ url: insight.coverImageUrl }] : []
    }
  };
}

export async function generateStaticParams() {
  const insights = await getAllInsights();
  return insights.map((i) => ({ slug: i.slug }));
}

export default async function InsightDetailPage({ params }: Props) {
  const insight = await getInsightBySlug(params.slug);
  if (!insight) notFound();

  const related = await getRelatedInsights(insight.slug, insight.category);
  const fallbackRelated = related.length > 0
    ? related
    : (await getAllInsights()).filter((i) => i.slug !== insight.slug).slice(0, 3);

  // Prefer new contentHtml, fall back to rendering legacy content array
  const bodyHtml =
    insight.contentHtml && insight.contentHtml.trim()
      ? insight.contentHtml
      : legacyContentToHtml(insight.content);

  return (
    <>
      <article>
        {/* ── Header ── */}
        <section className="bg-brand-navy py-20 text-white">
          <Container>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-brand-gold"
            >
              <ArrowLeft size={14} />
              Back to Insights
            </Link>
            <div className="mt-12 max-w-4xl">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-brand-gold">
                {insight.category}
              </p>
              <h1 className="font-zh-serif mt-5 text-4xl font-bold leading-tight text-white lg:text-5xl">
                {insight.title}
              </h1>
              <p className="font-zh mt-6 max-w-3xl text-lg leading-8 text-white/70">
                {insight.excerpt}
              </p>
              <div className="mt-8 flex items-center gap-3 font-sans text-xs text-white/45">
                <time dateTime={insight.date}>{insight.date}</time>
                <span aria-hidden="true">/</span>
                <span>{insight.readingTime}</span>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Cover image (if any) ── */}
        {insight.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={insight.coverImageUrl}
            alt={insight.title}
            className="h-72 w-full object-cover lg:h-96"
          />
        )}

        {/* ── Body ── */}
        <section className="bg-brand-cream py-20">
          <Container className="max-w-3xl">
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {/* Tags */}
            {insight.tags && insight.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-2 border-t border-brand-gold/20 pt-8">
                {insight.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-brand-gold/40 px-3 py-1 font-sans text-xs text-brand-stone"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Container>
        </section>
      </article>

      {/* ── Related ── */}
      <section className="bg-brand-porcelain py-20">
        <Container>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.28em] text-brand-gold">Related</p>
              <h2 className="mt-3 font-display text-5xl font-light text-brand-charcoal">More Insights</h2>
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 self-start border border-brand-gold px-5 py-2 font-sans text-xs uppercase tracking-[0.18em] text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy md:self-auto"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {fallbackRelated.map((item) => (
              <ArticleCard key={item.slug} insight={item} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
