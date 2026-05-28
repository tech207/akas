import { FileText } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ComplianceUploadPanel } from "@/components/admin/ComplianceUploadPanel";
import { LegalLinksEditor } from "@/components/admin/LegalLinksEditor";
import { getComplianceData } from "@/lib/compliance-server";

export const dynamic = "force-dynamic";

export default async function AdminCompliancePage() {
  const compliance = await getComplianceData();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Compliance"
        title="法令專區"
        description="管理前台法令專區的「相關法規連結」與「公司文件下載」內容。"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <LegalLinksEditor initialLinks={compliance.legalLinks} />
        <ComplianceUploadPanel docs={compliance.companyDocs} />
      </div>
    </div>
  );
}
