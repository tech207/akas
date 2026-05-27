import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.a-kas.com'
  const pages = ['', '/about', '/service', '/esg', '/regulations', '/contact']
  return pages.map((path) => ({
    url: baseUrl + path,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : 0.8
  }))
}
