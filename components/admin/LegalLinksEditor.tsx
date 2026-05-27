"use client";

import { useRef, useState } from "react";
import { Check, ExternalLink, GripVertical, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";

type LegalLink = {
  label: string;
  href: string;
};

type Props = {
  initialLinks: LegalLink[];
};

// Track save/error state per-item by its index to avoid label-key collisions
type ItemState = { saving?: boolean; saved?: boolean };

export function LegalLinksEditor({ initialLinks }: Props) {
  const [links, setLinks] = useState<LegalLink[]>(initialLinks);
  const [itemState, setItemState] = useState<Record<number, ItemState>>({});
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [error, setError] = useState("");

  // ── New link form ──
  const [showNew, setShowNew] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  function setItemSaving(idx: number, v: boolean) {
    setItemState((s) => ({ ...s, [idx]: { ...s[idx], saving: v } }));
  }
  function setItemSaved(idx: number, v: boolean) {
    setItemState((s) => ({ ...s, [idx]: { ...s[idx], saved: v } }));
  }

  async function handleSave(idx: number) {
    setError("");
    const link = links[idx];
    const originalLabel = initialLinks[idx]?.label ?? link.label;
    setItemSaving(idx, true);
    setItemSaved(idx, false);

    const res = await fetch("/api/admin/compliance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target: "link",
        originalLabel,
        label: link.label,
        href: link.href
      })
    });

    setItemSaving(idx, false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "儲存失敗");
      return;
    }

    setItemSaved(idx, true);
    setEditingIdx(null);
    setTimeout(() => setItemSaved(idx, false), 2000);
  }

  async function handleDelete(idx: number) {
    const label = links[idx].label;
    if (!confirm(`確定要刪除「${label}」嗎？`)) return;
    setError("");

    const res = await fetch("/api/admin/compliance", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "link", label })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "刪除失敗");
      return;
    }

    setLinks((c) => c.filter((_, i) => i !== idx));
  }

  async function handleAdd() {
    if (!newLabel.trim()) return;
    setError("");
    setAddingNew(true);

    const res = await fetch("/api/admin/compliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "link", label: newLabel.trim(), href: newHref.trim() })
    });

    setAddingNew(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "新增失敗");
      return;
    }

    setLinks((c) => [...c, { label: newLabel.trim(), href: newHref.trim() }]);
    setNewLabel("");
    setNewHref("");
    setShowNew(false);
  }

  function updateLink(idx: number, partial: Partial<LegalLink>) {
    setLinks((c) => c.map((l, i) => (i === idx ? { ...l, ...partial } : l)));
  }

  return (
    <div className="border border-brand-ink/10 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-zh text-lg font-semibold text-brand-ink">相關法規連結</h2>
          <p className="mt-1 font-zh text-sm text-brand-stone">
            編輯前台法令專區顯示的外部法規網址，可修改名稱與連結。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-1.5 border border-brand-gold/50 bg-white px-3 py-2 font-zh text-xs text-brand-stone transition-colors hover:border-brand-gold hover:text-brand-ink"
        >
          <Plus size={14} />
          新增連結
        </button>
      </div>

      {error ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 font-zh text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {showNew ? (
        <div className="mt-4 space-y-2.5 border border-brand-gold/30 bg-brand-ivory p-4">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="連結名稱（顯示文字）"
            className="h-10 w-full border border-brand-ink/15 bg-white px-3 font-zh text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
          />
          <input
            value={newHref}
            onChange={(e) => setNewHref(e.target.value)}
            placeholder="https://..."
            className="h-10 w-full border border-brand-ink/15 bg-white px-3 font-mono text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void handleAdd()}
              disabled={addingNew || !newLabel.trim()}
              className="inline-flex items-center gap-1.5 bg-brand-ink px-4 py-2 font-zh text-xs text-white transition-colors hover:bg-brand-charcoal disabled:opacity-50"
            >
              {addingNew ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              新增
            </button>
            <button
              type="button"
              onClick={() => { setShowNew(false); setNewLabel(""); setNewHref(""); }}
              className="border border-brand-ink/15 bg-white px-4 py-2 font-zh text-xs text-brand-stone transition-colors hover:text-brand-ink"
            >
              取消
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {links.map((link, idx) => {
          const isEditing = editingIdx === idx;
          const st = itemState[idx] ?? {};

          return (
            <div key={idx} className="border border-brand-ink/10 bg-brand-ivory p-4">
              {isEditing ? (
                /* ── Edit mode ── */
                <div className="space-y-2">
                  <div>
                    <label className="block font-zh text-xs text-brand-stone/70">名稱</label>
                    <input
                      value={link.label}
                      onChange={(e) => updateLink(idx, { label: e.target.value })}
                      className="mt-1 h-9 w-full border border-brand-ink/15 bg-white px-3 font-zh text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-zh text-xs text-brand-stone/70">URL</label>
                    <input
                      value={link.href}
                      onChange={(e) => updateLink(idx, { href: e.target.value })}
                      placeholder="https://..."
                      className="mt-1 h-9 w-full border border-brand-ink/15 bg-white px-3 font-mono text-xs text-brand-ink outline-none transition-colors focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => void handleSave(idx)}
                      disabled={st.saving}
                      className="inline-flex items-center gap-1.5 bg-brand-ink px-3 py-1.5 font-zh text-xs text-white transition-colors hover:bg-brand-charcoal disabled:opacity-50"
                    >
                      {st.saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      {st.saving ? "儲存中..." : "儲存"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingIdx(null); setLinks(initialLinks.map((l, i) => links[i] ?? l)); }}
                      className="border border-brand-ink/15 bg-white px-3 py-1.5 font-zh text-xs text-brand-stone hover:text-brand-ink"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div className="flex items-start gap-3">
                  <GripVertical size={14} className="mt-1 flex-shrink-0 text-brand-stone/25" />
                  <div className="min-w-0 flex-1">
                    <p className="font-zh text-sm font-medium text-brand-ink">{link.label}</p>
                    {link.href ? (
                      <p className="mt-0.5 truncate font-mono text-xs text-brand-stone/60">{link.href}</p>
                    ) : (
                      <p className="mt-0.5 font-zh text-xs text-brand-stone/40">尚未設定 URL</p>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-1.5">
                    {st.saved ? (
                      <span className="inline-flex items-center gap-1 font-zh text-xs text-emerald-600">
                        <Check size={12} /> 已儲存
                      </span>
                    ) : null}
                    {link.href ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center border border-brand-ink/10 bg-white p-1.5 text-brand-stone hover:text-brand-ink"
                        title="開啟連結"
                      >
                        <ExternalLink size={13} />
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setEditingIdx(idx)}
                      className="inline-flex items-center border border-brand-ink/10 bg-white p-1.5 text-brand-stone hover:text-brand-ink"
                      title="編輯"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(idx)}
                      className="inline-flex items-center border border-red-200 bg-white p-1.5 text-red-400 hover:border-red-400 hover:text-red-600"
                      title="刪除"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {links.length === 0 && (
          <p className="py-6 text-center font-zh text-sm text-brand-stone/50">
            尚無法規連結。點擊「新增連結」建立第一筆。
          </p>
        )}
      </div>
    </div>
  );
}
