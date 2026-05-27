import Link from "next/link";
import { CheckCircle2, FileText, LinkIcon, PenLine, Plus, Upload } from "lucide-react";

import { ComplianceUploadPanel } from "@/components/admin/ComplianceUploadPanel";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { LegalLinksEditor } from "@/components/admin/LegalLinksEditor";
import { getComplianceData } from "@/lib/compliance-server";
import { getAllInsights } from "@/lib/insights-server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [insights, compliance] = await Promise.all([
    getAllInsights(),
    getComplianceData()
  ]);

  const featuredCount = insights.filter((insight) => insight.featured).length;
  const uploadedDocCount = compliance.companyDocs.filter((d) => d.fileUrl).length;
  const linkedCount = compliance.legalLinks.filter((l) => l.href).length;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 border-b border-brand-ink/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            Content Admin
          </p>
          <h1 className="mt-2 font-zh text-2xl font-semibold text-brand-ink">
            網站內容管理
          </h1>
          <p className="mt-2 font-zh text-sm leading-6 text-brand-stone">
            管理形象網站的洞見文章，以及法令專區的外部連結與公司文件上傳。
          </p>
        </div>
        <Link
          href="/admin/insights/new"
          className="inline-flex items-center justify-center gap-2 bg-brand-ink px-4 py-2.5 font-zh text-sm text-white transition-colors hover:bg-brand-charcoal"
        >
          <Plus size={16} />
          新增洞見文章
        </Link>
      </section>

      {/* ── Stats Cards ── */}
      <section className="grid gap-4 md:grid-cols-4">
        <article className="border border-brand-ink/10 bg-white p-5">
          <p className="font-zh text-sm text-brand-stone">洞見文章</p>
          <p className="mt-3 font-sans text-3xl font-semibold text-brand-ink">
            {insights.length}
          </p>
        </article>
        <article className="border border-brand-ink/10 bg-white p-5">
          <p className="font-zh text-sm text-brand-stone">首頁精選</p>
          <p className="mt-3 font-sans text-3xl font-semibold text-brand-ink">
            {featuredCount}
          </p>
        </article>
        <article className="border border-brand-ink/10 bg-white p-5">
          <div className="flex items-center gap-2">
            <LinkIcon size={14} className="text-brand-gold" />
            <p className="font-zh text-sm text-brand-stone">法規連結</p>
          </div>
          <p className="mt-3 font-sans text-3xl font-semibold text-brand-ink">
            {linkedCount}
            <span className="ml-1 text-base font-normal text-brand-stone">
              / {compliance.legalLinks.length}
            </span>
          </p>
          <p className="mt-1 font-zh text-xs text-brand-stone/60">已設定 URL</p>
        </article>
        <article className="border border-brand-ink/10 bg-white p-5">
          <div className="flex items-center gap-2">
            <Upload size={14} className="text-brand-gold" />
            <p className="font-zh text-sm text-brand-stone">公司文件</p>
          </div>
          <p className="mt-3 font-sans text-3xl font-semibold text-brand-ink">
            {uploadedDocCount}
            <span className="ml-1 text-base font-normal text-brand-stone">
              / {compliance.companyDocs.length}
            </span>
          </p>
          <p className="mt-1 font-zh text-xs text-brand-stone/60">已上傳</p>
        </article>
      </section>

      {/* ── Insights Table ── */}
      <section id="insights" className="border border-brand-ink/10 bg-white">
        <div className="flex flex-col gap-3 border-b border-brand-ink/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-zh text-lg font-semibold text-brand-ink">
              Insights 洞見文章
            </h2>
            <p className="mt-1 font-zh text-sm text-brand-stone">
              新增、編輯、刪除形象網站洞見文章。
            </p>
          </div>
          <Link
            href="/admin/insights/new"
            className="inline-flex items-center justify-center gap-2 border border-brand-gold/50 bg-white px-4 py-2 font-zh text-sm text-brand-stone transition-colors hover:border-brand-gold hover:text-brand-ink"
          >
            <Plus size={15} />
            新增文章
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b border-brand-ink/10 bg-brand-ivory">
              <tr>
                <th className="px-4 py-3 text-left font-zh font-medium text-brand-stone">
                  標題
                </th>
                <th className="px-4 py-3 text-left font-zh font-medium text-brand-stone">
                  分類
                </th>
                <th className="px-4 py-3 text-left font-zh font-medium text-brand-stone">
                  狀態
                </th>
                <th className="px-4 py-3 text-left font-zh font-medium text-brand-stone">
                  日期
                </th>
                <th className="px-4 py-3 text-right font-zh font-medium text-brand-stone">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/10">
              {insights.map((insight) => (
                <tr key={insight.slug} className="hover:bg-brand-ivory/70">
                  <td className="px-4 py-4">
                    <p className="line-clamp-1 font-zh font-semibold text-brand-ink">
                      {insight.title}
                    </p>
                    <p className="mt-1 font-mono text-xs text-brand-stone/70">
                      {insight.slug}
                    </p>
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
                  <td className="px-4 py-4 font-sans text-xs text-brand-stone">
                    {insight.date}
                  </td>
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Compliance Section ── */}
      <section id="compliance" className="space-y-6">
        <div className="flex items-center gap-3 border-b border-brand-ink/10 pb-4">
          <FileText size={18} className="text-brand-gold" />
          <div>
            <h2 className="font-zh text-lg font-semibold text-brand-ink">
              法令專區管理
            </h2>
            <p className="mt-1 font-zh text-sm text-brand-stone">
              管理前台法令專區的「相關法規連結」與「公司文件下載」內容。
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <LegalLinksEditor initialLinks={compliance.legalLinks} />
          <ComplianceUploadPanel docs={compliance.companyDocs} />
        </div>
      </section>
    </div>
  );
}
