'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex w-full items-center justify-center gap-2 border border-white/10 px-3 py-2 font-zh text-xs text-white/60 transition-colors hover:border-brand-gold/60 hover:text-white"
    >
      <LogOut size={14} />
      登出
    </button>
  )
}
