'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`確定要刪除「${title}」嗎？此操作無法復原。`)) return
    setLoading(true)
    await fetch(`/api/insights/${slug}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 border border-red-200 bg-white px-3 py-1.5 font-zh text-xs text-red-500 transition-colors hover:border-red-400 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={13} />
      {loading ? '...' : '刪除'}
    </button>
  )
}
