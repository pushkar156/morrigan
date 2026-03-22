import { MetadataRoute } from 'next'
import { fetchBlogs } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://themorrigan.com'
  
  // 1. Fetch all blogs for the sitemap
  let blogs: any[] = []
  try {
    blogs = await fetchBlogs()
  } catch (e) {
    console.error('[Sitemap] Fetch failed:', e)
  }

  // 2. Map blogs to sitemap entries
  const blogEntries = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updated_at || blog.published_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // 3. Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.2,
    },
  ]

  return [...staticPages, ...blogEntries]
}
