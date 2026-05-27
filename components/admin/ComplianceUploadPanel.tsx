"use client";

import { useRef, useState } from "react";
import { Check, ExternalLink, FileText, GripVertical, Loader2, Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";

type ComplianceDoc = {
  label: string;
  type: string;
  fileUrl: string;
  uploadedAt: string;
};

type ItemState = { uploading?: boolean; saving?: boolean; saved?: boolean };

export function ComplianceUploadPanel({ docs: initialDocs }: { docs: ComplianceDoc[] }) {
  const [docs, setDocs] = useState<ComplianceDoc[]>(initialDocs);
  const [itemState, setItemState] = useState<Record<number, ItemState>>({});
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [error, setError] = useState("");

  // ── New doc form ──
  const [showNew, setShowNew] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("PDF");
  const [addingNew, setAddingNew] = useState(false);

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function setIs(idx: number, partial: Partial<ItemState>) {
    setItemState((s) => ({ ...s, [idx]: { ...s[idx], ...partial } }));
  }

  function updateDoc(idx: number, partial: Partial<ComplianceDoc>) {
    setDocs((d) => d.map((doc, i) => (i === idx ? { ...doc, ...partial } : doc)));
  }

  // ── Upload file ──
  async function uploadFile(idx: number, file: File) {
    setError("");
    setIs(idx, { uploading: true });
    const label = docs[idx].label;
    const fd = new FormData();
    fd.append("label", label);
    fd.append("file", file);

    const res = await fetch("/api/admin/compliance/upload", { method: "POST", body: fd });
    setIs(idx, { uploading: false });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "上傳失敗");
      return;
    }

    const data = (await res.json()) as { url: string; type?: string };
    updateDoc(idx, { 
      fileUrl: data.url, 
      uploadedAt: new Date().toISOString(),
      ...(data.type ? { type: data.type } : {})
    });
  }

  // ── Save doc metadata ──
  async function handleSave(idx: number) {
    setError("");
    const doc = docs[idx];
    const originalLabel = initialDocs[idx]?.label ?? doc.label;
    setIs(idx, { saving: true, saved: false });

    const res = await fetch("/api/admin/compliance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target: "doc",
        originalLabel,
        label: doc.label,
        type: doc.type
      })
    });

    setIs(idx, { saving: false });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "儲存失敗");
      return;
    }

    setIs(idx, { saved: true });
    setEditingIdx(null);
    setTimeout(() => setIs(idx, { saved: false }), 2000);
  }

  // ── Delete doc entry ──
  async function handleDelete(idx: number) {
    const label = docs[idx].label;
    if (!confirm(`確定要刪除「${label}」嗎？此操作不會刪除已上傳的檔案。`)) return;
    setError("");

    const res = await fetch("/api/admin/compliance", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "doc", label })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "刪除失敗");
      return;
    }

    setDocs((d) => d.filter((_, i) => i !== idx));
  }

  // ── Add new doc entry ──
  async function handleAdd() {
    if (!newLabel.trim()) return;
    setError("");
    setAddingNew(true);

    const res = await fetch("/api/admin/compliance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "doc", label: newLabel.trim(), type: newType.trim() || "PDF" })
    });

    setAddingNew(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "新增失敗");
      return;
    }

    setDocs((d) => [...d, { label: newLabel.trim(), type: newType.trim() || "PDF", fileUrl: "", uploadedAt: "" }]);
    setNewLabel("");
    setNewType("PDF");
    setShowNew(false);
  }

  return (
    <div className="border border-brand-ink/10 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <UploadCloud size={18} className="text-brand-gold" />
          <div>
            <h2 className="font-zh text-lg font-semibold text-brand-ink">公司文件上傳</h2>
            <p className="font-zh text-sm text-brand-stone">可修改名稱、類型，上傳任意格式檔案。</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowNew(!showNew)}
          className="inline-flex items-center gap-1.5 border border-brand-gold/50 bg-white px-3 py-2 font-zh text-xs text-brand-stone transition-colors hover:border-brand-gold hover:text-brand-ink"
        >
          <Plus size={14} />
          新增項目
        </button>
      </div>

      {error ? (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 font-zh text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {/* ── New doc form ── */}
      {showNew ? (
        <div className="mt-4 space-y-2.5 border border-brand-gold/30 bg-brand-ivory p-4">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="文件名稱（顯示文字）"
            className="h-10 w-full border border-brand-ink/15 bg-white px-3 font-zh text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
          />
          <input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="檔案類型標籤（如 PDF、JPG、ZIP…）"
            className="h-10 w-full border border-brand-ink/15 bg-white px-3 font-sans text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
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
              onClick={() => { setShowNew(false); setNewLabel(""); setNewType("PDF"); }}
              className="border border-brand-ink/15 bg-white px-4 py-2 font-zh text-xs text-brand-stone hover:text-brand-ink"
            >
              取消
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {docs.map((doc, idx) => {
          const st = itemState[idx] ?? {};
          const hasUpload = !!doc.fileUrl;
          const isEditing = editingIdx === idx;
          const uploadDate = doc.uploadedAt
            ? new Date(doc.uploadedAt).toLocaleDateString("zh-TW")
            : null;

          return (
            <div key={idx} className="border border-brand-ink/10 bg-brand-ivory">
              {/* ── View header ── */}
              <div className="flex items-center gap-3 p-4">
                <GripVertical size={14} className="flex-shrink-0 text-brand-stone/20" />

                <div className="flex flex-1 items-center gap-2 min-w-0">
                  {hasUpload ? (
                    <Check size={14} className="flex-shrink-0 text-emerald-600" />
                  ) : (
                    <FileText size={14} className="flex-shrink-0 text-brand-stone/40" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-zh text-sm font-medium text-brand-ink">{doc.label}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded-sm bg-brand-ink/8 px-1.5 py-0.5 font-sans text-[11px] text-brand-stone">
                        {doc.type}
                      </span>
                      {hasUpload && uploadDate ? (
                        <span className="font-zh text-xs text-emerald-600">已上傳 ({uploadDate})</span>
                      ) : (
                        <span className="font-zh text-xs text-brand-stone/40">尚未上傳</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-1.5">
                  {st.saved ? (
                    <span className="font-zh text-xs text-emerald-600">
                      <Check size={12} className="inline" /> 已儲存
                    </span>
                  ) : null}
                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[idx]?.click()}
                    disabled={st.uploading}
                    className="inline-flex items-center gap-1 border border-brand-gold/50 bg-white px-2.5 py-1.5 font-zh text-xs text-brand-stone transition-colors hover:border-brand-gold hover:text-brand-ink disabled:opacity-50"
                    title={hasUpload ? "重新上傳" : "上傳檔案"}
                  >
                    {st.uploading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <UploadCloud size={12} />
                    )}
                    {st.uploading ? "上傳中" : hasUpload ? "重傳" : "上傳"}
                  </button>
                  {hasUpload ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center border border-brand-ink/10 bg-white p-1.5 text-brand-stone hover:text-brand-ink"
                      title="開啟檔案"
                    >
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setEditingIdx(isEditing ? null : idx)}
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

                {/* Hidden file input */}
                <input
                  ref={(el) => { fileInputRefs.current[idx] = el; }}
                  type="file"
                  accept="*/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadFile(idx, file);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* ── Edit mode: label + type ── */}
              {isEditing ? (
                <div className="border-t border-brand-ink/10 bg-white px-4 py-3 space-y-2">
                  <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
                    <div>
                      <label className="block font-zh text-xs text-brand-stone/70">文件名稱</label>
                      <input
                        value={doc.label}
                        onChange={(e) => updateDoc(idx, { label: e.target.value })}
                        className="mt-1 h-9 w-full border border-brand-ink/15 bg-white px-3 font-zh text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block font-zh text-xs text-brand-stone/70">類型標籤</label>
                      <input
                        value={doc.type}
                        onChange={(e) => updateDoc(idx, { type: e.target.value })}
                        placeholder="PDF"
                        className="mt-1 h-9 w-full border border-brand-ink/15 bg-white px-3 font-sans text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
                      />
                    </div>
                  </div>
                  {doc.fileUrl ? (
                    <p className="font-mono text-xs text-brand-stone/50 truncate">
                      檔案：{doc.fileUrl}
                    </p>
                  ) : null}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleSave(idx)}
                      disabled={st.saving}
                      className="inline-flex items-center gap-1.5 bg-brand-ink px-3 py-1.5 font-zh text-xs text-white hover:bg-brand-charcoal disabled:opacity-50"
                    >
                      {st.saving ? <Loader2 size={12} className="animate-spin" /> : null}
                      {st.saving ? "儲存中..." : "儲存名稱與類型"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingIdx(null); setDocs(initialDocs.map((d, i) => docs[i] ?? d)); }}
                      className="border border-brand-ink/15 bg-white px-3 py-1.5 font-zh text-xs text-brand-stone hover:text-brand-ink"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}

        {docs.length === 0 && (
          <p className="py-6 text-center font-zh text-sm text-brand-stone/50">
            尚無公司文件。點擊「新增項目」建立第一筆。
          </p>
        )}
      </div>
    </div>
  );
}
