import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Insight } from "@/lib/insights";

const coverToneClass: Record<Insight["coverTone"], string> = {
  navy: "bg-brand-navy text-white",
  red: "bg-brand-red text-white",
  gold: "bg-brand-gold text-brand-navy",
  charcoal: "bg-brand-charcoal text-white",
  cream: "bg-brand-porcelain text-brand-navy"
};

export function ArticleCard({ insight }: { insight: Insight }) {
  return (
    <article className="group flex h-full flex-col border border-brand-charcoal/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-soft">
      <Link
        href={`/insights/${insight.slug}`}
        className={[
          "relative flex aspect-[5/3] items-end overflow-hidden p-5",
          coverToneClass[insight.coverTone]
        ].join(" ")}
      >
        <span className="absolute right-5 top-4 font-display text-7xl font-light opacity-10">
          {insight.category.charAt(0)}
        </span>
        <span className="relative font-sans text-xs uppercase tracking-[0.24em] opacity-80">
          {insight.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 font-sans text-xs text-brand-stone">
          <time dateTime={insight.date}>{insight.date}</time>
          <span aria-hidden="true">/</span>
          <span>{insight.readingTime}</span>
        </div>

        <h3 className="font-zh-serif mt-4 text-xl font-bold leading-snug text-brand-charcoal">
          <Link
            href={`/insights/${insight.slug}`}
            className="transition-colors hover:text-brand-red"
          >
            {insight.title}
          </Link>
        </h3>

        <p className="font-zh mt-4 flex-1 text-sm leading-7 text-brand-charcoal/70">
          {insight.excerpt}
        </p>

        <Link
          href={`/insights/${insight.slug}`}
          className="mt-6 inline-flex items-center gap-2 self-start font-sans text-xs uppercase tracking-[0.2em] text-brand-gold transition-colors hover:text-brand-red"
        >
          Read
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}
