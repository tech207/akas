import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InsightForm } from "@/components/admin/InsightForm";
import { getCategories } from "@/lib/categories-server";
import { getInsightBySlug } from "@/lib/insights-server";

type Props = { params: { slug: string } };

export default async function EditInsightPage({ params }: Props) {
  const [insight, categories] = await Promise.all([
    getInsightBySlug(params.slug),
    getCategories()
  ]);

  if (!insight) notFound();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Content Editor"
        title="編輯洞見文章"
        description={`正在編輯：${insight.slug}`}
      />
      <InsightForm mode="edit" initial={insight} initialCategories={categories} />
    </div>
  );
}
