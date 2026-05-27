import { ScrollReveal } from "@/components/common/ScrollReveal";
import { AboutPreviewSection } from "@/components/sections/home/AboutPreviewSection";
import { CtaSection } from "@/components/sections/home/CtaSection";
import { EsgPreviewSection } from "@/components/sections/home/EsgPreviewSection";
import { HeroSection } from "@/components/sections/home/HeroSection";
import { ServicesSection } from "@/components/sections/home/ServicesSection";
import { StatsSection } from "@/components/sections/home/StatsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ScrollReveal>
        <StatsSection />
      </ScrollReveal>
      <ScrollReveal>
        <AboutPreviewSection />
      </ScrollReveal>
      <ScrollReveal>
        <ServicesSection />
      </ScrollReveal>
      <ScrollReveal>
        <EsgPreviewSection />
      </ScrollReveal>
      <ScrollReveal>
        <CtaSection />
      </ScrollReveal>
    </>
  );
}
