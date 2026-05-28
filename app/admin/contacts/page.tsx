'use client'

import { useEffect, useState } from 'react'
import { Mail, MailOpen, RefreshCw, Send } from 'lucide-react'

import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import type { ContactSubmission } from '@/lib/contact-server'

export default function ContactsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [replying, setReplying] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sentIds, setSentIds] = useState<Set<string>>(new Set())
  const [sendError, setSendError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/contacts')
    if (res.ok) setSubmissions(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleMarkRead(id: string) {
    await fetch('/api/admin/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: true } : s))
    )
  }

  function openReply(id: string) {
    setReplying(id)
    setReplyBody('')
    setSendError(null)
  }

  function closeReply() {
    setReplying(null)
    setReplyBody('')
    setSendError(null)
  }

  async function handleSendReply(s: ContactSubmission) {
    setSending(true)
    setSendError(null)
    const res = await fetch('/api/admin/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toEmail: s.email,
        toName: s.nameZh,
        originalSubject: s.subject,
        originalMessage: s.message,
        replyBody
      })
    })
    setSending(false)
    if (res.ok) {
      setSentIds((prev) => new Set(prev).add(s.id))
      closeReply()
      if (!s.read) handleMarkRead(s.id)
    } else {
      const data = await res.json().catch(() => ({}))
      setSendError((data as { error?: string }).error ?? '寄送失敗，請稍後再試')
    }
  }

  const unreadCount = submissions.filter((s) => !s.read).length

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contact"
        title="聯絡紀錄"
        description="來自聯絡表單的訊息，請盡快回覆。"
      />

      <div className="flex items-center justify-between">
        <p className="font-zh text-sm text-brand-stone">
          共 <span className="font-semibold text-brand-ink">{submissions.length}</span> 筆，
          未讀 <span className="font-semibold text-brand-red">{unreadCount}</span> 筆
        </p>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 border border-brand-ink/10 px-3 py-1.5 font-zh text-xs text-brand-stone transition-colors hover:border-brand-gold"
        >
          <RefreshCw size={13} />
          重新整理
        </button>
      </div>

      {loading ? (
        <p className="font-zh text-sm text-brand-stone">載入中...</p>
      ) : submissions.length === 0 ? (
        <div className="border border-brand-ink/10 bg-white p-12 text-center">
          <Mail size={32} className="mx-auto mb-3 text-brand-gold/50" />
          <p className="font-zh text-sm text-brand-stone">尚無聯絡紀錄</p>
        </div>
      ) : (
        <div className="divide-y divide-brand-ink/10 border border-brand-ink/10 bg-white">
          {submissions.map((s) => (
            <div
              key={s.id}
              className={`p-5 transition-colors ${!s.read ? 'bg-brand-gold/5' : ''}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {s.read ? (
                      <MailOpen size={16} className="text-brand-stone/40" />
                    ) : (
                      <Mail size={16} className="text-brand-red" />
                    )}
                  </div>
                  <div>
                    <p className="font-zh font-semibold text-brand-ink">
                      {s.nameZh}
                      {s.nameEn && (
                        <span className="ml-2 font-sans text-sm font-normal text-brand-stone">
                          {s.nameEn}
                        </span>
                      )}
                    </p>
                    <a
                      href={`mailto:${s.email}`}
                      className="font-sans text-xs text-brand-gold hover:underline"
                    >
                      {s.email}
                    </a>
                    {s.subject && (
                      <p className="mt-1 font-zh text-sm text-brand-stone">
                        主題：{s.subject}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-7 flex shrink-0 items-center gap-3 sm:ml-0">
                  <span className="font-sans text-xs text-brand-stone/60">
                    {new Date(s.createdAt).toLocaleString('zh-TW', {
                      year: 'numeric', month: '2-digit', day: '2-digit',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  {!s.read && (
                    <button
                      onClick={() => handleMarkRead(s.id)}
                      className="border border-brand-ink/10 px-2.5 py-1 font-zh text-xs text-brand-stone transition-colors hover:border-brand-gold"
                    >
                      標記已讀
                    </button>
                  )}
                  {sentIds.has(s.id) ? (
                    <span className="font-zh text-xs text-brand-stone/50">已回覆</span>
                  ) : replying !== s.id ? (
                    <button
                      onClick={() => openReply(s.id)}
                      className="inline-flex items-center gap-1.5 border border-brand-gold/40 px-2.5 py-1 font-zh text-xs text-brand-gold transition-colors hover:border-brand-gold hover:bg-brand-gold/5"
                    >
                      <Send size={12} />
                      回覆
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="ml-7 mt-3">
                <p
                  className={`font-zh text-sm text-brand-charcoal ${expanded === s.id ? '' : 'line-clamp-2'}`}
                >
                  {s.message}
                </p>
                {s.message.length > 100 && (
                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="mt-1 font-zh text-xs text-brand-gold hover:underline"
                  >
                    {expanded === s.id ? '收起' : '展開'}
                  </button>
                )}
              </div>

              {replying === s.id && (
                <div className="ml-7 mt-4 space-y-2">
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder={`回覆給 ${s.nameZh}...`}
                    rows={5}
                    className="w-full border border-brand-ink/15 bg-white px-3 py-2.5 font-zh text-sm text-brand-ink placeholder:text-brand-stone/40 focus:border-brand-gold focus:outline-none"
                  />
                  {sendError && (
                    <p className="font-zh text-xs text-brand-red">{sendError}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendReply(s)}
                      disabled={sending || !replyBody.trim()}
                      className="inline-flex items-center gap-1.5 bg-brand-navy px-4 py-2 font-zh text-xs text-white transition-opacity disabled:opacity-40"
                    >
                      <Send size={12} />
                      {sending ? '寄送中...' : '送出回覆'}
                    </button>
                    <button
                      onClick={closeReply}
                      className="border border-brand-ink/10 px-4 py-2 font-zh text-xs text-brand-stone transition-colors hover:border-brand-ink/30"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
