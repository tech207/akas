import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '聯絡我們',
  description: '聯絡艾卡斯管理顧問。地址：台北市松山區八德路2段374號6樓之2，電話：02-27117762，Email：info@a-kas.com'
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
