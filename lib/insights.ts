// InsightCategory is now a plain string (dynamically managed)
export type InsightCategory = string;

export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  category: InsightCategory;
  date: string;
  readingTime: string;
  featured?: boolean;
  coverTone: "navy" | "red" | "gold" | "charcoal" | "cream";
  coverImageUrl?: string;
  tags?: string[];
  // New HTML content field (takes priority over legacy content array)
  contentHtml?: string;
  // Legacy structure — kept for backward compat
  content: readonly {
    heading: string;
    body: readonly string[];
  }[];
};

// Default categories (used as fallback)
export const INSIGHT_CATEGORIES: readonly string[] = [
  "Executive Search",
  "HR Advisory",
  "Career",
  "ESG Social",
  "Labor Law"
] as const;

// Converts legacy content array to HTML for rendering
export function legacyContentToHtml(
  content: Insight["content"]
): string {
  return content
    .map(
      (section) =>
        `<h2>${section.heading}</h2>\n` +
        section.body.map((p) => `<p>${p}</p>`).join("\n")
    )
    .join("\n\n");
}
