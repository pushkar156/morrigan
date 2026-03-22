import { Metadata } from 'next'
import { fetchBlog, fetchBlogs } from '@/lib/api'
import type { Blog } from '@/lib/types'
import BlogPostClient from './BlogPostClient'
import Link from 'next/link'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug
    const blog = await fetchBlog(slug)
    
    if (!blog) {
        return {
            title: 'Article Not Found | Morrigan',
        }
    }

    // In production, ideally use the absolute URL to your public assets. Example: 'https://themorrigan.com/logo.png'
    const fallbackImage = '/logo.png'

    return {
        title: `${blog.title} | Morrigan`,
        description: blog.excerpt || blog.title,
        openGraph: {
            title: blog.title,
            description: blog.excerpt || blog.title,
            images: blog.featured_image ? [{ url: blog.featured_image }] : [{ url: fallbackImage }],
            type: 'article',
            publishedTime: blog.published_at || undefined,
            authors: [blog.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.title,
            description: blog.excerpt || blog.title,
            images: blog.featured_image ? [blog.featured_image] : [fallbackImage],
        }
    }
}

export default async function BlogPostPage({ params }: Props) {
    const slug = (await params).slug
    const blog = await fetchBlog(slug)
    
    if (!blog) {
        return (
            <div className="min-h-screen bg-[#e8f0fc] flex flex-col items-center justify-center font-sans px-6 text-center">
                <h1 className="text-[120px] md:text-[160px] leading-none font-bold text-[#1152d4] mb-4 font-serif drop-shadow-sm">
                    404
                </h1>
                <p className="text-xl md:text-2xl text-black/60 mb-10 font-medium tracking-tight">
                    Article Not Found
                </p>
                <Link 
                    href="/journal" 
                    className="bg-[#1152d4] text-white px-8 py-3.5 rounded text-[11px] font-bold uppercase tracking-widest hover:bg-[#0c3e98] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#1152d4]/50"
                >
                    Return to Journal
                </Link>
            </div>
        )
    }

    let relatedBlogs: Blog[] = []
    if (blog.category) {
        const related = await fetchBlogs(blog.category)
        relatedBlogs = related.filter(b => b.slug !== slug).slice(0, 3)
    }

    return <BlogPostClient blog={blog} relatedBlogs={relatedBlogs} />
}
