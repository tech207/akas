"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FileText, Home, Mail, Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/LogoutButton";

const navItems = [
  { label: "內容總覽", href: "/admin", icon: Home, exact: true },
  { label: "洞見文章", href: "/admin#insights", icon: Newspaper, exact: false },
  { label: "法令專區", href: "/admin#compliance", icon: FileText, exact: false },
  { label: "聯絡紀錄", href: "/admin/contacts", icon: Mail, exact: true }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-ivory font-sans text-brand-ink">
      <header className="border-b border-brand-ink/10 bg-brand-navy px-5 py-4 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-brand-gold font-sans text-xs font-semibold text-brand-ink">
              AK
            </span>
            <span>
              <span className="block font-zh text-sm font-medium">
                內容管理後台
              </span>
              <span className="block font-sans text-xs text-white/45">
                Insights / Compliance
              </span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact
                ? pathname === item.href
                : item.href === "/admin" && pathname === "/admin";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 border border-white/10 px-3 py-2 font-zh text-xs transition-colors",
                    active
                      ? "bg-white text-brand-ink"
                      : "text-white/65 hover:border-brand-gold/60 hover:text-white"
                  )}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              target="_blank"
              className="border border-white/10 px-3 py-2 font-zh text-xs text-white/55 transition-colors hover:border-brand-gold/60 hover:text-white"
            >
              查看網站
            </Link>
            <div className="w-24">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
