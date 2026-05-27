import type { Metadata } from "next";
import type { ReactNode } from "react";

import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

import { LayoutShell } from "@/components/layout/LayoutShell";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'A-KAS Associates & Company',
  alternateName: '艾卡斯管理顧問',
  url: 'https://www.a-kas.com',
  email: 'info@a-kas.com',
  telephone: '+886-2-27117762',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6F.-2, No. 374, Sec. 2, Bade Road',
    addressLocality: 'Taipei',
    addressCountry: 'TW'
  }
}

export const metadata: Metadata = {
  title: {
    default: '艾卡斯管理顧問 | A-KAS Associates & Company',
    template: '%s | A-KAS'
  },
  description:
    'A-KAS 是亞洲專業的中高階人力資源和企業管理顧問公司，提供獵才招聘、企業顧問、個人職涯服務。台北市松山區八德路2段374號6樓之2。',
  keywords: ['獵頭', '高階人才招募', 'Executive Search', 'Taiwan', '艾卡斯', '管理顧問', '台北'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    url: 'https://www.a-kas.com',
    siteName: '艾卡斯管理顧問'
  },
  icons: { icon: '/favicon.svg' }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={cn(
          fontVariables,
          "bg-brand-cream text-brand-charcoal antialiased"
        )}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
