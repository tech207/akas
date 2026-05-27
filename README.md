# 技術規格

## 2.1 前端框架

| 技術 | 版本 | 用途 | 選擇理由 |
| --- | --- | --- | --- |
| Next.js | 14 (App Router) | 核心前端框架 | SSR/ISR/SSG 三者兼備；SEO 友善；APP 共用邏輯 |
| TypeScript | 5.x | 型別安全 | 降低跨端開發錯誤率，加速後期 APP 開發 |
| Tailwind CSS | 3.x | 樣式系統 | 設計 Token 統一管理；快速迭代；與 shadcn/ui 完美配合 |
| shadcn/ui | latest | UI 元件庫 | 可完全客製化；不鎖定供應商；無版權問題 |
| Framer Motion | 11.x | 動態效果 | 低調流暢動畫；適合高端品牌定位 |
| next-intl | 3.x | 多語系 | 繁體中文 / 英文雙語；未來擴充日文預留 |

## 2.2 後端與資料庫

| 技術 | 版本 | 用途 | 選擇理由 |
| --- | --- | --- | --- |
| PostgreSQL | 16 | 主資料庫 | JSONB 欄位處理非結構化面試筆記；全文搜尋；成熟穩定 |
| Prisma | 5.x | ORM | Type-safe 查詢；migration 管理；與 TypeScript 完美整合 |
| tRPC | 11.x | API 層 | 前後端型別共用；無需手寫 API 文件；APP 端直接複用 |
| NextAuth.js | v5 (Auth.js) | 身份驗證 | 支援企業 Email / Google SSO / 魔法連結 |
| Supabase | cloud | PostgreSQL 託管 | 含即時訂閱 / Row Level Security / 備份管理 |
| Redis (Upstash) | cloud | 快取 / 限流 | API Rate Limiting；Session 快取；Queue 任務 |

## 2.3 內容管理（CMS）

| 技術 | 版本 | 用途 | 選擇理由 |
| --- | --- | --- | --- |
| Payload CMS | 3.x | 無頭式 CMS | 完全自托管；TypeScript 原生；後台與 Next.js 同框架 |
| Cloudflare R2 | - | 檔案儲存 | PDF 法令文件 / 履歷 / 圖片；相容 S3 API；無流量費用 |
| Resend + React Email | latest | 電子郵件 | 交易信（聯絡表單回覆）；通知信；支援繁中模板 |
| Meilisearch | 1.x | 全文搜尋 | 職位 / 候選人快速搜尋；支援中文分詞；自托管 |
