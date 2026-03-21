'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { fetchBlog } from '@/lib/api'
import type { Blog } from '@/lib/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export default function BlogPost() {
    const params = useParams()
    const slug = params.slug as string
    const [blog, setBlog] = useState<Blog | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (slug) {
            fetchBlog(slug)
                .then(data => setBlog(data))
                .catch(err => console.error('Failed to load blog:', err))
                .finally(() => setIsLoading(false))
        }
    }, [slug])

    if (isLoading) {
        return (
            <article className="min-h-screen bg-[#e8f0fc] flex items-center justify-center">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        border: '3px solid rgba(0,0,0,0.1)',
                        borderTopColor: '#1152d4',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <p style={{ fontFamily: 'var(--font-sans)', color: 'rgba(0,0,0,0.4)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Loading article...
                    </p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </article>
        )
    }

    if (!blog) {
        return (
            <article className="min-h-screen bg-[#e8f0fc] flex items-center justify-center">
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#1a1a2e', marginBottom: '16px' }}>
                        Article Not Found
                    </h1>
                    <p style={{ fontFamily: 'var(--font-sans)', color: 'rgba(0,0,0,0.5)', marginBottom: '24px' }}>
                        The article you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link href="/journal" style={{
                        fontFamily: 'var(--font-sans)',
                        color: '#1152d4',
                        fontWeight: 600,
                        textDecoration: 'none',
                        borderBottom: '2px solid #00d1ff',
                        paddingBottom: '2px',
                    }}>
                        ← Back to Journal
                    </Link>
                </div>
            </article>
        )
    }

    const date = blog.published_at
        ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'Unpublished'
    const categoryDisplay = (blog.category || '').replace(/-/g, ' ').toUpperCase()

    return (
        <article className="min-h-screen bg-[#e8f0fc] selection:bg-[#00d1ff] selection:text-black">
            {/* Immersive Parallax Header */}
            <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${blog.featured_image || '/logo.png'})`,
                        filter: 'grayscale(0.5) brightness(0.6)',
                        transform: 'scale(1.05)'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e8f0fc] via-transparent to-black/40" />

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 z-10 text-center container-custom">
                    <span className="text-[#00d1ff] font-bold tracking-[0.3em] text-xs uppercase mb-6 bg-black/40 px-4 py-2 rounded-sm backdrop-blur-md border border-white/10">
                        {categoryDisplay}
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white max-w-5xl leading-tight mb-8 drop-shadow-xl">
                        {blog.title}
                    </h1>
                    <div className="flex items-center gap-6 text-white/70 font-sans tracking-wide text-sm uppercase">
                        <span>By <strong className="text-white">{blog.author}</strong></span>
                        <span className="w-1 h-1 bg-[#00d1ff] rounded-full" />
                        <span>{date}</span>
                        <span className="w-1 h-1 bg-[#00d1ff] rounded-full" />
                        <span>{blog.read_time} MIN READ</span>
                    </div>
                </div>
            </div>

            {/* Reading Container with Sticky Sidebar */}
            <div className="container-custom max-w-7xl mx-auto py-20 px-6 flex flex-col lg:flex-row gap-16 relative">

                {/* Floating Social / Actions Sidebar */}
                <aside className="hidden lg:flex flex-col w-48 shrink-0 relative">
                    <div className="sticky top-40 flex flex-col gap-8">
                        <div>
                            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-4">Share Insight</p>
                            <div className="flex gap-4">
                                {/* X/Twitter */}
                                <button className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-[#1152d4] hover:border-[#1152d4] transition-all">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.15H5.078z" /></svg>
                                </button>
                                {/* LinkedIn */}
                                <button className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-[#1152d4] hover:border-[#1152d4] transition-all">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </button>
                                {/* Link */}
                                <button className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-[#1152d4] hover:border-[#1152d4] transition-all">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-[1px] bg-black/10 my-4" />

                        <Link href="/journal" className="text-xs font-bold text-black/40 uppercase tracking-widest hover:text-[#1152d4] flex items-center gap-2 transition-colors">
                            <span className="text-lg leading-none">←</span> BACK TO JOURNAL
                        </Link>
                    </div>
                </aside>

                {/* Main Content Reading Width */}
                <div className="w-full max-w-[65ch] mx-auto lg:mx-0">
                    {blog.excerpt && (
                        <p className="text-2xl font-serif text-[#1152d4] italic mb-12 leading-relaxed border-l-4 border-[#00d1ff] pl-6 text-black/70 font-semibold shadow-[calc(-10px)_0_20px_rgba(0,209,255,0.05)]">
                            &ldquo;{blog.excerpt}&rdquo;
                        </p>
                    )}

                    <div className="prose prose-lg prose-slate max-w-none 
                                   prose-p:font-sans prose-p:text-black/80 prose-p:leading-loose prose-p:tracking-wide
                                   prose-headings:font-serif prose-headings:text-black prose-headings:tracking-tight
                                   prose-a:text-[#1152d4] prose-a:no-underline hover:prose-a:underline
                                   prose-strong:text-black
                                   prose-li:text-black/80 prose-li:leading-loose"
                    >
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]} 
                            rehypePlugins={[rehypeRaw]}
                        >
                            {blog.content}
                        </ReactMarkdown>
                    </div>

                    {/* End mark */}
                    <div className="flex items-center justify-center gap-4 my-20 opacity-20">
                        <span className="w-1 h-1 bg-black rounded-full" />
                        <span className="w-1.5 h-1.5 bg-black rounded-full" />
                        <span className="w-1 h-1 bg-black rounded-full" />
                    </div>
                </div>

            </div>
        </article>
    )
}
