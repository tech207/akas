import Link from "next/link";
import { FileText, LinkIcon, Mail, Newspaper, Upload } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getComplianceData } from "@/lib/compliance-server";
import { getAllInsights } from "@/lib/insights-server";
import { getAllContactSubmissions } from "@/lib/contact-server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [insights, compliance, contacts] = await Promise.all([
    getAllInsights(),
    getComplianceData(),
    getAllContactSubmissions()
  ]);

  const featuredCount = insights.filter((i) => i.featured).length;
  const uploadedDocCount = compliance.companyDocs.filter((d) => d.fileUrl).length;
  const linkedCount = compliance.legalLinks.filter((l) => l.href).length;
  const unreadCount = contacts.filter((c) => !c.read).length;

  const stats = [
    {
      label: "洞見文章",
      value: insights.length,
      sub: `${featuredCount} 篇首頁精選`,
      icon: Newspaper,
      href: "/admin/insights"
    },
    {
      label: "法規連結",
      value: linkedCount,
      sub: `共 ${compliance.legalLinks.length} 項`,
      icon: LinkIcon,
      href: "/admin/compliance"
    },
    {
      label: "公司文件",
      value: uploadedDocCount,
      sub: `共 ${compliance.companyDocs.length} 項`,
      icon: Upload,
      href: "/admin/compliance"
    },
    {
      label: "未讀聯絡",
      value: unreadCount,
      sub: `共 ${contacts.length} 筆紀錄`,
      icon: Mail,
      href: "/admin/contacts",
      highlight: unreadCount > 0
    }
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Content Admin"
        title="網站內容管理"
        description="管理形象網站的洞見文章，以及法令專區的外部連結與公司文件上傳。"
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group border border-brand-ink/10 bg-white p-5 transition-colors hover:border-brand-gold/50"
            >
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-brand-gold" />
                <p className="font-zh text-sm text-brand-stone">{s.label}</p>
              </div>
              <p className={`mt-3 font-sans text-3xl font-semibold ${s.highlight ? "text-brand-red" : "text-brand-ink"}`}>
                {s.value}
              </p>
              <p className="mt-1 font-zh text-xs text-brand-stone/60">{s.sub}</p>
            </Link>
          );
        })}
      </section>

      <section className="border border-brand-ink/10 bg-white p-6">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold">
          Quick Actions
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/insights/new"
            className="inline-flex items-center gap-2 border border-brand-ink/10 px-4 py-2.5 font-zh text-sm text-brand-ink transition-colors hover:border-brand-gold"
          >
            <Newspaper size={15} />
            新增洞見文章
          </Link>
          <Link
            href="/admin/compliance"
            className="inline-flex items-center gap-2 border border-brand-ink/10 px-4 py-2.5 font-zh text-sm text-brand-ink transition-colors hover:border-brand-gold"
          >
            <FileText size={15} />
            管理法令文件
          </Link>
          {unreadCount > 0 && (
            <Link
              href="/admin/contacts"
              className="inline-flex items-center gap-2 border border-brand-red/30 bg-brand-red/5 px-4 py-2.5 font-zh text-sm text-brand-red transition-colors hover:border-brand-red"
            >
              <Mail size={15} />
              查看 {unreadCount} 筆未讀訊息
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
