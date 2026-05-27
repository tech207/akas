"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bold,
  Check,
  Eye,
  EyeOff,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Plus,
  Quote,
  Save,
  Star,
  Tag,
  X
} from "lucide-react";

import type { Insight } from "@/lib/insights";

// ─── Helpers ───────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function estimateReadTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// ─── Rich Text Toolbar ─────────────────────────────────────

function ToolbarButton({
  title,
  onClick,
  active,
  children
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={[
        "flex h-8 w-8 items-center justify-center rounded text-sm transition-colors",
        active
          ? "bg-brand-ink text-white"
          : "text-brand-stone hover:bg-brand-ink/10 hover:text-brand-ink"
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function RichTextToolbar({ editorRef }: { editorRef: React.RefObject<HTMLDivElement> }) {
  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  const wrapBlock = (tag: string) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
  };

  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  useEffect(() => {
    function updateFormats() {
      const formats = new Set<string>();
      if (document.queryCommandState("bold")) formats.add("bold");
      if (document.queryCommandState("italic")) formats.add("italic");
      setActiveFormats(formats);
    }
    document.addEventListener("selectionchange", updateFormats);
    return () => document.removeEventListener("selectionchange", updateFormats);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-brand-ink/10 bg-brand-ivory px-3 py-2">
      <ToolbarButton title="H2 段落標題" onClick={() => wrapBlock("h2")}>
        <Heading2 size={15} />
      </ToolbarButton>
      <ToolbarButton title="H3 小標題" onClick={() => wrapBlock("h3")}>
        <Heading3 size={15} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-brand-ink/15" />
      <ToolbarButton title="粗體" onClick={() => exec("bold")} active={activeFormats.has("bold")}>
        <Bold size={14} />
      </ToolbarButton>
      <ToolbarButton title="斜體" onClick={() => exec("italic")} active={activeFormats.has("italic")}>
        <Italic size={14} />
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-brand-ink/15" />
      <ToolbarButton title="無序清單" onClick={() => exec("insertUnorderedList")}>
        <List size={14} />
      </ToolbarButton>
      <ToolbarButton title="有序清單" onClick={() => exec("insertOrderedList")}>
        <ListOrdered size={14} />
      </ToolbarButton>
      <ToolbarButton title="引用塊" onClick={() => wrapBlock("blockquote")}>
        <Quote size={14} />
      </ToolbarButton>
      <ToolbarButton title="水平分隔線" onClick={() => exec("insertHorizontalRule")}>
        <Minus size={14} />
      </ToolbarButton>
    </div>
  );
}

// ─── Tag Input ─────────────────────────────────────────────

function TagInput({
  tags,
  onChange
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  function add() {
    const val = input.trim().replace(/^#/, "");
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-brand-gold/15 px-2.5 py-1 font-sans text-xs text-brand-ink"
          >
            #{tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="text-brand-stone hover:text-brand-ink"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="輸入 tag，按 Enter 確認"
          className="h-9 flex-1 border border-brand-ink/15 bg-white px-3 font-sans text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
        />
        <button
          type="button"
          onClick={add}
          className="border border-brand-ink/15 bg-white px-3 font-zh text-xs text-brand-stone transition-colors hover:border-brand-gold hover:text-brand-ink"
        >
          <Plus size={13} />
        </button>
      </div>
      <p className="mt-1.5 font-sans text-xs text-brand-stone/60">
        用於 SEO meta keywords，每個 tag 按 Enter 或逗號確認
      </p>
    </div>
  );
}

// ─── Category Selector ─────────────────────────────────────

function CategorySelector({
  value,
  categories,
  onChange
}: {
  value: string;
  categories: string[];
  onChange: (val: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories);

  async function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed })
    });
    setSaving(false);
    if (res.ok) {
      const updated = (await res.json()) as string[];
      setLocalCategories(updated);
      onChange(trimmed);
      setNewName("");
      setAdding(false);
    }
  }

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full border border-brand-ink/15 bg-white px-3 font-sans text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
      >
        {localCategories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {adding ? (
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleAdd()}
            autoFocus
            placeholder="新分類名稱"
            className="h-9 flex-1 border border-brand-ink/15 bg-white px-3 font-zh text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
          />
          <button
            type="button"
            onClick={() => void handleAdd()}
            disabled={saving}
            className="border border-brand-gold/50 bg-white px-3 font-zh text-xs text-brand-stone hover:border-brand-gold disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className="border border-brand-ink/10 bg-white px-3 text-brand-stone hover:text-brand-ink"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 font-zh text-xs text-brand-stone transition-colors hover:text-brand-ink"
        >
          <Plus size={12} />
          新增分類
        </button>
      )}
    </div>
  );
}

// ─── Cover Image Upload ────────────────────────────────────

function CoverImageUpload({
  value,
  onChange
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/insights/cover", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const data = (await res.json()) as { url: string };
      onChange(data.url);
    }
  }

  return (
    <div>
      <div
        className="relative cursor-pointer overflow-hidden border-2 border-dashed border-brand-ink/20 transition-colors hover:border-brand-gold"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) void handleFile(file);
        }}
      >
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Cover" className="h-36 w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <p className="font-zh text-sm text-white">點擊更換圖片</p>
            </div>
          </div>
        ) : (
          <div className="flex h-36 flex-col items-center justify-center gap-2 text-brand-stone/50">
            {uploading ? (
              <Loader2 size={24} className="animate-spin text-brand-gold" />
            ) : (
              <>
                <ImageIcon size={24} />
                <p className="font-zh text-xs">點擊或拖放上傳封面圖片</p>
                <p className="font-sans text-xs">JPG / PNG / WEBP</p>
              </>
            )}
          </div>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-2 font-zh text-xs text-brand-stone/60 hover:text-red-500"
        >
          移除封面圖片
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
    </div>
  );
}

// ─── Article Preview ───────────────────────────────────────

function ArticlePreview({
  title,
  excerpt,
  category,
  date,
  readingTime,
  tags,
  coverImageUrl,
  contentHtml
}: {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  tags: string[];
  coverImageUrl: string;
  contentHtml: string;
}) {
  return (
    <div className="overflow-hidden border border-brand-ink/10 bg-white">
      {/* Header */}
      <div className="bg-brand-navy px-8 py-12 text-white">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-brand-gold">
          {category || "Category"}
        </p>
        <h1 className="font-zh-serif mt-4 text-3xl font-bold leading-tight text-white lg:text-4xl">
          {title || "文章標題"}
        </h1>
        <p className="font-zh mt-4 text-base leading-7 text-white/70">
          {excerpt || "文章摘要..."}
        </p>
        <div className="mt-6 flex items-center gap-3 font-sans text-xs text-white/45">
          <time>{date}</time>
          <span>/</span>
          <span>{readingTime}</span>
        </div>
      </div>

      {/* Cover image */}
      {coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverImageUrl} alt="Cover" className="h-64 w-full object-cover" />
      )}

      {/* Body */}
      <div className="px-8 py-10">
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: contentHtml || "<p>開始輸入文章內容...</p>" }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-brand-ink/10 pt-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-brand-gold/40 px-3 py-1 font-sans text-xs text-brand-stone"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────

type Props = {
  initial?: Insight;
  mode: "create" | "edit";
  initialCategories: string[];
};

export function InsightForm({ initial, mode, initialCategories }: Props) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split("T")[0];

  // Form state
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [category, setCategory] = useState(initial?.category ?? (initialCategories[0] ?? "Executive Search"));
  const [date, setDate] = useState(initial?.date ?? today);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [coverTone, setCoverTone] = useState<Insight["coverTone"]>(initial?.coverTone ?? "navy");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [readingTime, setReadingTime] = useState(initial?.readingTime ?? "5 min read");

  // Convert legacy content to HTML if needed
  const initialHtml = initial?.contentHtml
    ?? (initial?.content
      ? initial.content
          .map(
            (s) =>
              `<h2>${s.heading}</h2>\n` + s.body.map((b) => `<p>${b}</p>`).join("\n")
          )
          .join("\n\n")
      : "");

  const [contentHtml, setContentHtml] = useState(initialHtml);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Sync editor DOM → state on input
  const handleEditorInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setContentHtml(html);
    setReadingTime(estimateReadTime(html));
  }, []);

  // Initialize editor content on mount
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-slug from title (create mode only)
  function handleTitleChange(val: string) {
    setTitle(val);
    if (mode === "create") setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("標題不可為空"); return; }
    if (!slug.trim()) { setError("Slug 不可為空"); return; }

    const html = editorRef.current?.innerHTML ?? contentHtml;
    if (!html.trim() || html === "<br>") { setError("文章內容不可為空"); return; }

    const payload: Insight = {
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      date,
      readingTime,
      featured,
      coverTone,
      coverImageUrl: coverImageUrl || undefined,
      tags: tags.length > 0 ? tags : undefined,
      contentHtml: html,
      content: [] // kept for compat; new articles use contentHtml
    };

    setSaving(true);
    const url = mode === "create" ? "/api/insights" : `/api/insights/${initial!.slug}`;
    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "儲存失敗");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const COVER_TONES: Array<{ value: Insight["coverTone"]; bg: string }> = [
    { value: "navy", bg: "bg-brand-navy" },
    { value: "red", bg: "bg-brand-red" },
    { value: "gold", bg: "bg-brand-gold" },
    { value: "charcoal", bg: "bg-brand-charcoal" },
    { value: "cream", bg: "border border-brand-ink/15 bg-brand-cream" }
  ];

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Top bar ── */}
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-brand-ink/10 pb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 font-zh text-sm text-brand-stone transition-colors hover:text-brand-ink"
        >
          <ArrowLeft size={16} />
          返回
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="inline-flex items-center gap-2 border border-brand-ink/15 bg-white px-4 py-2 font-zh text-sm text-brand-stone transition-colors hover:border-brand-gold hover:text-brand-ink"
          >
            {previewMode ? <EyeOff size={15} /> : <Eye size={15} />}
            {previewMode ? "關閉預覽" : "預覽文章"}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-brand-ink px-5 py-2 font-zh text-sm text-white transition-colors hover:bg-brand-charcoal disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "儲存中..." : mode === "create" ? "發布文章" : "儲存變更"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-5 border border-red-200 bg-red-50 px-4 py-3 font-zh text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
        {/* ── Left: Editor ── */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="文章標題"
              required
              className="w-full border-0 bg-transparent font-zh-serif text-3xl font-bold text-brand-ink outline-none placeholder:text-brand-ink/25 focus:ring-0"
            />
            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-xs text-brand-stone/50">/insights/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.replace(/\s+/g, "-").replace(/[^\w-]/g, "").toLowerCase())}
                required
                className="flex-1 border-0 border-b border-brand-ink/15 bg-transparent pb-0.5 font-mono text-sm text-brand-stone outline-none transition-colors focus:border-brand-gold focus:ring-0"
                placeholder="url-slug"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-zh text-xs font-medium uppercase tracking-wider text-brand-stone/60">
              摘要 / Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="一到兩句說明文章重點，顯示於列表與 SEO description"
              className="mt-2 w-full border border-brand-ink/10 bg-brand-ivory px-4 py-3 font-zh text-sm leading-6 text-brand-ink outline-none transition-colors focus:border-brand-gold"
            />
          </div>

          {/* Rich text editor / Preview toggle */}
          {previewMode ? (
            <ArticlePreview
              title={title}
              excerpt={excerpt}
              category={category}
              date={date}
              readingTime={readingTime}
              tags={tags}
              coverImageUrl={coverImageUrl}
              contentHtml={contentHtml}
            />
          ) : (
            <div className="border border-brand-ink/10 bg-white">
              <RichTextToolbar editorRef={editorRef} />
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                className="min-h-[420px] px-6 py-5 font-zh text-base leading-loose text-brand-ink outline-none prose-editor focus:outline-none"
                data-placeholder="開始寫作..."
              />
            </div>
          )}
        </div>

        {/* ── Right: Settings ── */}
        <aside className="space-y-6">
          {/* Publish settings */}
          <div className="border border-brand-ink/10 bg-white p-5">
            <h3 className="font-zh text-sm font-semibold text-brand-ink">發布設定</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="font-zh text-xs text-brand-stone">分類</span>
                <div className="mt-1.5">
                  <CategorySelector
                    value={category}
                    categories={initialCategories}
                    onChange={setCategory}
                  />
                </div>
              </label>

              <label className="block">
                <span className="font-zh text-xs text-brand-stone">發布日期</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 h-10 w-full border border-brand-ink/15 bg-white px-3 font-sans text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
                />
              </label>

              <label className="block">
                <span className="font-zh text-xs text-brand-stone">閱讀時間（自動估算）</span>
                <input
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="mt-1.5 h-10 w-full border border-brand-ink/15 bg-white px-3 font-sans text-sm text-brand-ink outline-none transition-colors focus:border-brand-gold"
                />
              </label>

              <label className="flex cursor-pointer items-center gap-3 border border-brand-ink/10 bg-brand-ivory p-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="flex items-center gap-2 font-zh text-sm text-brand-ink">
                  <Star size={14} className="text-brand-gold" />
                  設為首頁精選
                </span>
              </label>
            </div>
          </div>

          {/* Cover tone */}
          <div className="border border-brand-ink/10 bg-white p-5">
            <h3 className="font-zh text-sm font-semibold text-brand-ink">封面色調</h3>
            <div className="mt-3 flex gap-2">
              {COVER_TONES.map(({ value, bg }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCoverTone(value)}
                  title={value}
                  className={[
                    "h-7 w-7 flex-1 transition-all",
                    bg,
                    coverTone === value
                      ? "ring-2 ring-brand-gold ring-offset-2"
                      : "opacity-50 hover:opacity-90"
                  ].join(" ")}
                />
              ))}
            </div>
            <p className="mt-2 font-sans text-xs text-brand-stone/60">
              {coverTone}
            </p>
          </div>

          {/* Cover image */}
          <div className="border border-brand-ink/10 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-zh text-sm font-semibold text-brand-ink">
              <ImageIcon size={14} className="text-brand-gold" />
              封面圖片
            </h3>
            <CoverImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />
          </div>

          {/* Tags */}
          <div className="border border-brand-ink/10 bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-zh text-sm font-semibold text-brand-ink">
              <Tag size={14} className="text-brand-gold" />
              Hashtags / SEO Tags
            </h3>
            <TagInput tags={tags} onChange={setTags} />
          </div>
        </aside>
      </div>
    </form>
  );
}
