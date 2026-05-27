"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

import { BRAND_COPY, COMPANY } from "@/lib/constants";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay,
    duration: 0.8,
    ease: [0.22, 1, 0.36, 1]
  }
});

export function HeroSection() {
  return (
    <section
      aria-label={`${COMPANY.nameEn} hero`}
      className="relative min-h-screen overflow-hidden bg-brand-navy"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-transparent" />

      <div className="absolute left-12 top-1/2 hidden -translate-y-1/2 md:block">
        <div className="relative h-32 w-px bg-brand-gold/60">
          <span className="absolute -top-3 left-1/2 h-1 w-1 -translate-x-1/2 bg-brand-red" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center pl-16 pr-6 lg:pl-24">
        <div className="max-w-5xl">
          <motion.p
            {...fadeIn(0.1)}
            className="font-sans text-xs font-medium uppercase tracking-[0.3em] text-brand-gold"
          >
            SINCE ASIA · EXECUTIVE SEARCH
          </motion.p>

          <motion.h1
            {...fadeIn(0.3)}
            className="mt-5 font-display text-6xl font-light tracking-tight text-white lg:text-8xl"
          >
            {BRAND_COPY.principle}
          </motion.h1>

          <motion.div
            {...fadeIn(0.5)}
            className="my-6 h-0.5 w-20 bg-brand-gold"
          />

          <motion.p
            {...fadeIn(0.7)}
            className="max-w-xl font-sans text-lg leading-relaxed text-white/70"
          >
            {BRAND_COPY.taglineEn}
          </motion.p>

          <motion.div {...fadeIn(0.9)} className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-brand-gold px-8 py-3 font-sans text-sm text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
            >
              聯絡我們 Contact Us
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <ChevronDown size={24} className="text-white" />
        <span className="font-sans text-xs text-white/40">scroll</span>
      </motion.div>
    </section>
  );
}

export default HeroSection;
