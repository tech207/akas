import Link from "next/link";
import { CheckCircle2, PenLine, Plus } from "lucide-react";

import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAllInsights } from "@/lib/insights-server";

export const dynamic = "force-dynamic";

export default async function AdminInsightsPage() {
  const insights = await getAllInsights();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Insights"
        title="洞見文章"
        description="新增、編輯、刪除形象網站洞見文章。"
        actions={
          <Link
            href="/admin/insights/new"
            className="inline-flex items-center justify-center gap-2 bg-brand-ink px-4 py-2.5 font-zh text-sm text-white transition-colors hover:bg-brand-charcoal"
          >
            <Plus size={16} />
            新增文章
          </Link>
        }
      />

      <div className="border border-brand-ink/10 bg-white overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-brand-ink/10 bg-brand-ivory">
            <tr>
              <th className="px-4 py-3 text-left font-zh font-medium text-brand-stone">標題</th>
              <th className="px-4 py-3 text-left font-zh font-medium text-brand-stone">分類</th>
              <th className="px-4 py-3 text-left font-zh font-medium text-brand-stone">狀態</th>
              <th className="px-4 py-3 text-left font-zh font-medium text-brand-stone">日期</th>
              <th className="px-4 py-3 text-right font-zh font-medium text-brand-stone">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-ink/10">
            {insights.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center font-zh text-sm text-brand-stone">
                  尚無文章
                </td>
              </tr>
            ) : (
              insights.map((insight) => (
                <tr key={insight.slug} className="hover:bg-brand-ivory/70">
                  <td className="px-4 py-4">
                    <p className="line-clamp-1 font-zh font-semibold text-brand-ink">
                      {insight.title}
                    </p>
                    <p className="mt-1 font-mono text-xs text-brand-stone/70">{insight.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="border border-brand-gold/40 px-2 py-1 font-sans text-xs text-brand-stone">
                      {insight.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 font-zh text-xs text-brand-stone">
                      <CheckCircle2 size={13} className="text-emerald-700" />
                      {insight.featured ? "首頁精選" : "已發布"}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-sans text-xs text-brand-stone">{insight.date}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/insights/${insight.slug}`}
                        className="inline-flex items-center gap-1.5 border border-brand-ink/10 bg-white px-3 py-1.5 font-zh text-xs text-brand-ink transition-colors hover:border-brand-gold"
                      >
                        <PenLine size={13} />
                        編輯
                      </Link>
                      <DeleteButton slug={insight.slug} title={insight.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
