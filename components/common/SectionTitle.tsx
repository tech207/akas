import { GoldDivider } from "@/components/common/GoldDivider";

type SectionTitleProps = {
  en: string;
  zh: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionTitle({
  en,
  zh,
  align = "left",
  light = false
}: SectionTitleProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "text-center" : "text-left"}>
      <h2
        className={[
          "font-display text-5xl font-light tracking-wide lg:text-6xl",
          light ? "text-white" : "text-brand-ink"
        ].join(" ")}
      >
        {en}
      </h2>
      <GoldDivider className={["mt-4", isCenter ? "mx-auto" : ""].join(" ")} />
      <p
        className={[
          "font-zh mt-2 text-lg",
          light ? "text-brand-gold" : "text-brand-stone"
        ].join(" ")}
      >
        {zh}
      </p>
    </div>
  );
}
