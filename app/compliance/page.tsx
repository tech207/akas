import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink, FileText } from "lucide-react";

import { Container } from "@/components/common/Container";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { SectionTitle } from "@/components/common/SectionTitle";
import { getComplianceData } from "@/lib/compliance-server";

export const metadata: Metadata = {
  title: "法令專區",
  description:
    "艾卡斯管理顧問法令專區，包含就業服務相關法規連結與公司申訴、收費等文件下載。"
};

export const dynamic = "force-dynamic";

export default async function CompliancePage() {
  const compliance = await getComplianceData();

  return (
    <>
      <section className="relative flex min-h-[50vh] flex-col items-center justify-center bg-brand-navy px-4 text-center">
        <h1 className="font-display text-7xl font-light text-white">
          CONTENTS OF CL
        </h1>
        <p className="font-zh-serif mt-2 text-2xl text-brand-gold">
          / 法令專區
        </p>
        <nav
          aria-label="Breadcrumb"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-sm text-white/40"
        >
          <Link href="/" className="transition-colors hover:text-white/70">
            Home
          </Link>
          <span aria-hidden="true">&gt;</span>
          <span>法令專區</span>
        </nav>
      </section>

      <ScrollReveal>
        <section className="bg-brand-cream px-4 py-16">
          <Container>
            <SectionTitle en="LEGAL REFERENCES" zh="相關法規連結" />
            <ul className="mt-10">
              {compliance.legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-brand-gold/20 py-4 transition-colors duration-200 hover:bg-red-50"
                  >
                    <span className="flex items-center">
                      <span className="mr-4 h-6 w-1 flex-shrink-0 bg-brand-red" />
                      <span className="font-zh text-brand-charcoal transition-colors duration-200 group-hover:text-brand-red">
                        {label}
                      </span>
                    </span>
                    <ExternalLink
                      size={16}
                      className="ml-4 flex-shrink-0 text-brand-gold"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="bg-brand-navy px-4 py-16">
          <Container>
            <SectionTitle en="COMPANY DOCUMENTS" zh="公司文件下載" light />
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
              {compliance.companyDocs.map(({ label, type, fileUrl }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-sm border border-brand-gold/20 bg-white/5 p-6"
                >
                  <div className="flex items-start gap-4">
                    <FileText
                      size={24}
                      className="mt-0.5 flex-shrink-0 text-brand-gold"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="font-zh text-sm text-white">{label}</p>
                      <span className="mt-1 inline-block bg-brand-gold/20 px-2 py-0.5 font-sans text-xs text-brand-gold">
                        {type}
                      </span>
                    </div>
                  </div>
                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 flex flex-shrink-0 items-center gap-1.5 font-sans text-sm text-brand-gold transition-colors hover:text-white"
                      aria-label={`下載 ${label}`}
                    >
                      <Download size={16} />
                      下載
                    </a>
                  ) : (
                    <span className="ml-4 flex-shrink-0 font-zh text-xs text-white/30">
                      尚未上傳
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      </ScrollReveal>
    </>
  );
}
