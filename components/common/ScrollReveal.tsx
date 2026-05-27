"use client";

import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type ScrollRevealDirection = "up" | "left" | "right";

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: ScrollRevealDirection;
  className?: string;
};

const hiddenStates: Record<ScrollRevealDirection, { opacity: number; x?: number; y?: number }> = {
  up: { opacity: 0, y: 40 },
  left: { opacity: 0, x: -40 },
  right: { opacity: 0, x: 40 }
};

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const initial = hiddenStates[direction];

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
