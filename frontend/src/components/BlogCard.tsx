import Link from 'next/link'
import type { Blog } from '@/lib/types'

export default function BlogCard({ blog }: { blog: Blog }) {
    const date = blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'Draft'
    const categoryDisplay = (blog.category || '').replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())

    return (
        <Link href={`/blog/${blog.slug}`} className="blog-card">
            <img
                src={blog.featured_image || '/logo.png'}
                alt={blog.title}
                className="blog-card-image"
            />
            <div className="blog-card-content">
                <div className="blog-card-category">{categoryDisplay}</div>
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.excerpt}</p>
                <div className="blog-card-meta">
                    <span>{date}</span>
                    <span>•</span>
                    <span>{blog.read_time} min read</span>
                </div>
            </div>
        </Link>
    )
}
