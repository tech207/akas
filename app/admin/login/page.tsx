"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("密碼錯誤，請重試。");
    }
  }

  return (
    <main className="grid min-h-screen bg-[#171D24] text-white lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex items-center px-6 py-12 md:px-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center bg-brand-gold font-sans text-sm font-semibold text-brand-ink">
              AK
            </span>
            <div>
              <p className="font-sans text-sm font-semibold tracking-wide">
                A-KAS Admin
              </p>
              <p className="font-zh text-xs text-white/50">營運管理後台</p>
            </div>
          </div>

          <h1 className="mt-12 font-zh text-3xl font-semibold tracking-normal">
            管理員登入
          </h1>
          <p className="mt-3 font-zh text-sm leading-6 text-white/60">
            登入後可管理洞見文章，以及法令專區的連結與公司文件上傳。
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 border border-white/10 bg-white/[0.04] p-6"
          >
            <label className="block font-zh text-sm text-white/70">
              管理員密碼
            </label>
            <div className="relative mt-2">
              <LockKeyhole
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 w-full border border-white/15 bg-white/[0.03] pl-10 pr-3 font-sans text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-gold"
                placeholder="Enter password"
              />
            </div>

            {error ? (
              <p className="mt-3 border border-red-400/30 bg-red-950/30 px-3 py-2 font-zh text-sm text-red-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full bg-brand-gold py-3 font-zh text-sm font-medium text-brand-ink transition-colors hover:bg-[#C9AE75] disabled:opacity-60"
            >
              {loading ? "登入中..." : "登入後台"}
            </button>
          </form>
        </div>
      </section>

      <section className="hidden border-l border-white/10 bg-[#101820] p-12 lg:flex lg:items-end">
        <div className="max-w-xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Management Console
          </p>
          <p className="mt-5 font-zh text-3xl font-semibold leading-tight">
            把形象網站內容集中到一個簡單、可維護的管理入口。
          </p>
          <div className="mt-8 grid grid-cols-3 border border-white/10">
            {["Insights", "Compliance", "Documents"].map((item) => (
              <div key={item} className="border-r border-white/10 p-4 last:border-r-0">
                <p className="font-sans text-xs text-white/50">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
