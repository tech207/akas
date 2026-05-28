"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FileText, Home, Mail, Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/admin/LogoutButton";

const navItems = [
  { label: "內容總覽", href: "/admin", icon: Home, exact: true },
  { label: "洞見文章", href: "/admin/insights", icon: Newspaper, exact: false },
  { label: "法令專區", href: "/admin/compliance", icon: FileText, exact: false },
  { label: "聯絡紀錄", href: "/admin/contacts", icon: Mail, exact: false }
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminShell({ children, unreadCount = 0 }: { children: ReactNode; unreadCount?: number }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-ivory font-sans text-brand-ink md:flex">

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden w-56 shrink-0 flex-col bg-brand-navy text-white md:flex">
        <div className="px-5 py-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand-gold font-sans text-xs font-semibold text-brand-ink">
              AK
            </span>
            <div>
              <span className="block font-zh text-sm font-medium leading-snug">
                內容管理後台
              </span>
              <span className="block font-sans text-[11px] text-white/40">
                A-KAS Admin
              </span>
            </div>
          </Link>
        </div>

        <div className="mx-5 border-t border-white/10" />

        <nav className="flex flex-col gap-0.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href, item.exact);
            const badge = item.href === "/admin/contacts" && unreadCount > 0 ? unreadCount : null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 font-zh text-sm transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={16} className="shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badge !== null && (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 font-sans text-[10px] font-semibold leading-none text-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="border-t border-white/10 px-3 py-4 space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 font-zh text-sm text-white/45 transition-colors hover:text-white/80"
          >
            查看網站 ↗
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Mobile header + nav ── */}
      <div className="md:hidden">
        <header className="flex items-center justify-between bg-brand-navy px-5 py-4 text-white">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-brand-gold font-sans text-xs font-semibold text-brand-ink">
              AK
            </span>
            <span className="font-zh text-sm font-medium">內容管理後台</span>
          </Link>
          <div className="w-20">
            <LogoutButton />
          </div>
        </header>

        <nav className="flex overflow-x-auto border-b border-white/10 bg-brand-navy px-2 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href, item.exact);
            const badge = item.href === "/admin/contacts" && unreadCount > 0 ? unreadCount : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 px-3 py-2 font-zh text-xs transition-colors",
                  active ? "text-white" : "text-white/50 hover:text-white"
                )}
              >
                <Icon size={13} />
                {item.label}
                {badge !== null && (
                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 font-sans text-[10px] font-semibold leading-none text-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 px-5 py-8 md:px-8">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>

    </div>
  );
}
