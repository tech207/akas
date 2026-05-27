import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { InsightForm } from "@/components/admin/InsightForm";
import { getCategories } from "@/lib/categories-server";

export default async function NewInsightPage() {
  const categories = await getCategories();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Content Editor"
        title="新增洞見文章"
        description="建立文章標題、摘要、分類、Hashtag 與正文內容，儲存後即發布。"
      />
      <InsightForm mode="create" initialCategories={categories} />
    </div>
  );
}
