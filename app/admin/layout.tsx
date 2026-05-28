import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { getUnreadContactCount } from "@/lib/contact-server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const unreadCount = await getUnreadContactCount();
  return <AdminShell unreadCount={unreadCount}>{children}</AdminShell>;
}
