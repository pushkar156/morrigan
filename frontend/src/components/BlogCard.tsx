import Link from 'next/link'
import { Blog } from '@/lib/demo-data'

export default function BlogCard({ blog }: { blog: Blog }) {
    const date = new Date(blog.published_at).toLocaleDateString()
    const categoryDisplay = blog.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

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
