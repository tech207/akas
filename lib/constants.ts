export const COMPANY = {
  nameEn: "A-KAS",
  nameZh: "愛卡斯人力資源",
  tagline: "Executive search and advisory with a precise, bilingual perspective.",
  addressZh: "台北市松山區八德路2段374號6樓之2",
  addressEn:
    "6F.-2, No. 374, Sec. 2, Bade Rd., Songshan Dist., Taipei City, Taiwan",
  tel: "02-27117762",
  phone: "02-27117762",
  fax: "02-27117762",
  email: "contact@a-kas.com",
  license: "Private Employment Service Institution License",
  social: {
    linkedin: "https://www.linkedin.com",
    facebook: "https://www.facebook.com"
  }
} as const;

export const BRAND_COPY = {
  principle: "Improve Living",
  taglineEn:
    "The purpose of living is to improve the living of whole human beings; the meaning of life is to create the proceeding life."
} as const;

export const NAV_ITEMS = [
  { label: "關於我們", href: "/about" },
  { label: "服務項目", href: "/services" },
  { label: "洞見專欄", href: "/insights" },
  { label: "法令專區", href: "/compliance" },
  { label: "聯絡我們", href: "/contact" }
] as const;
