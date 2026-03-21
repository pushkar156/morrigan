'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { fetchBlog } from '@/lib/api'
import type { Blog } from '@/lib/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { motion, useScroll, useSpring } from 'framer-motion'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' 

export default function BlogPost() {
    const params = useParams()
    const slug = params.slug as string
    const [blog, setBlog] = useState<Blog | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

    useEffect(() => {
        if (slug) {
            fetchBlog(slug)
                .then(data => setBlog(data))
                .catch(err => console.error('Failed to load blog:', err))
                .finally(() => setIsLoading(false))
        }
    }, [slug])

    // Generate TOC
    const toc = useMemo(() => {
        if (!blog?.content) return []
        const lines = blog.content.split('\n')
        return lines
            .filter(line => line.startsWith('#'))
            .map(line => {
                const level = line.match(/^#+/)?.[0].length || 1
                const text = line.replace(/^#+\s*/, '')
                const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
                return { level, text, id }
            })
    }, [blog])

    // Custom Components for ReactMarkdown
    const components = {
        code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            return language ? (
                <div className="syntax-highlighter-block">
                    <pre>
                        <code 
                            className={`hljs language-${language}`}
                            dangerouslySetInnerHTML={{ 
                                __html: hljs.highlight(String(children).replace(/\n$/, ''), { language }).value 
                            }}
                        />
                    </pre>
                </div>
            ) : (
                <code className="inline-code-intel" {...props}>{children}</code>
            )
        },
        blockquote({ children }: any) {
            return (
                <div className="intel-callout-box">
                    <div className="pulse-indicator" />
                    <div className="callout-inner">{children}</div>
                </div>
            )
        },
        table({ children }: any) {
            return (
                <div className="analyst-table-scroll">
                    <table className="analyst-table">{children}</table>
                </div>
            )
        },
        h1: ({ children }: any) => {
            const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
            return <h1 id={id} className="markdown-h-intel">{children}</h1>
        },
        h2: ({ children }: any) => {
            const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
            return <h2 id={id} className="markdown-h-intel">{children}</h2>
        },
        h3: ({ children }: any) => {
            const id = String(children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
            return <h3 id={id} className="markdown-h-intel-sub">{children}</h3>
        }
    }

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
            {/* Intel Reading Progress Bar */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1 bg-[#00d1ff] z-[100] origin-left"
                style={{ scaleX }}
            />

            {/* Immersive Parallax Header */}
            <div className="relative w-full h-[75vh] min-h-[600px] overflow-hidden">
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

            <div className="container-custom max-w-7xl mx-auto py-20 px-6 flex flex-col lg:flex-row gap-20 relative">
                <aside className="hidden lg:flex flex-col w-56 shrink-0 relative">
                    <div className="sticky top-40 flex flex-col gap-10">
                        <div className="text-[10px] font-black tracking-widest text-black/30 uppercase flex items-center gap-2">
                            <Link href="/journal" className="hover:text-[#1152d4]">INTEL</Link>
                            <span>/</span>
                            <span>{categoryDisplay}</span>
                        </div>

                        {toc.length > 0 && (
                            <div>
                                <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-6 border-b border-black/5 pb-2">Execution Path</p>
                                <ul className="flex flex-col gap-3">
                                    {toc.map((item, i) => (
                                        <li key={i} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                                            <a 
                                                href={`#${item.id}`} 
                                                className="block text-[11px] font-bold text-black/40 hover:text-[#1152d4] transition-colors uppercase tracking-tight"
                                            >
                                                {item.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-4">Export Analysis</p>
                            <div className="flex gap-4">
                                <button className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-[#1152d4] transition-all">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.15H5.078z" /></svg>
                                </button>
                                <button className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/60 hover:text-[#1152d4] transition-all">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="w-full max-w-[70ch] mx-auto lg:mx-0">
                    <div className="briefing-content">
                        {blog.excerpt && (
                            <p className="primary-excerpt">
                                &ldquo;{blog.excerpt}&rdquo;
                            </p>
                        )}

                        <div className="prose-intel-root">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]} 
                                rehypePlugins={[rehypeRaw]}
                                components={components}
                            >
                                {blog.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 my-24 opacity-10">
                        <span className="w-1.5 h-1.5 bg-black rounded-full" />
                        <span className="w-2 h-2 bg-black rounded-full" />
                        <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .prose-intel-root {
                    font-family: var(--font-sans);
                    font-size: 1.15rem;
                    line-height: 1.9;
                    color: rgba(0,0,0,0.8);
                }
                .prose-intel-root p { margin-bottom: 2.2rem; }
                .prose-intel-root p:first-of-type::first-letter {
                    float: left;
                    font-family: var(--font-serif);
                    font-size: 4.8rem;
                    line-height: 1;
                    padding: 0.1rem 1rem 0 0;
                    color: #1152d4;
                    font-weight: 700;
                }
                .markdown-h-intel {
                    font-family: var(--font-serif);
                    font-size: 2.6rem;
                    font-weight: 700;
                    color: #000;
                    margin: 4.5rem 0 1.8rem;
                    letter-spacing: -0.03em;
                    scroll-margin-top: 100px;
                    line-height: 1.2;
                }
                .markdown-h-intel-sub {
                    font-family: var(--font-serif);
                    font-size: 1.9rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin: 3.5rem 0 1.4rem;
                    scroll-margin-top: 100px;
                }
                .inline-code-intel {
                    background: rgba(0,209,255,0.08);
                    color: #1152d4;
                    padding: 0.2rem 0.5rem;
                    border-radius: 6px;
                    font-family: var(--font-mono);
                    font-size: 0.85em;
                }
                .syntax-highlighter-block {
                    background: #030711 !important;
                    padding: 1.5rem;
                    border-radius: 16px;
                    margin: 3rem 0;
                    border: 1px solid rgba(255,255,255,0.05);
                    box-shadow: 0 30px 60px -12px rgba(0,0,0,0.25);
                    overflow: hidden;
                }
                .syntax-highlighter-block pre { margin: 0; padding: 0; overflow-x: auto; }
                .syntax-highlighter-block code { font-family: var(--font-mono) !important; font-size: 0.9rem !important; line-height: 1.6 !important; }
                
                .intel-callout-box {
                    position: relative;
                    background: white;
                    border-left: 4px solid #00d1ff;
                    padding: 2.5rem 3rem;
                    margin: 3.5rem 0;
                    border-radius: 4px 16px 16px 4px;
                    box-shadow: 0 10px 40px rgba(0,209,255,0.04);
                }
                .pulse-indicator {
                    position: absolute; top: 1.5rem; left: -10px;
                    width: 16px; height: 16px; background: #00d1ff;
                    border-radius: 50%; box-shadow: 0 0 15px #00d1ff;
                    animation: callout-pulse 2s infinite;
                }
                @keyframes callout-pulse { 0% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.8); opacity: 0; } 100% { transform: scale(1); opacity: 0.8; } }
                
                .analyst-table-scroll { width: 100%; overflow-x: auto; margin: 3.5rem 0; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
                .analyst-table { width: 100%; border-collapse: collapse; background: white; font-family: var(--font-mono); font-size: 0.85rem; min-width: 600px; }
                .analyst-table th { background: #f8faff; padding: 1.2rem 1rem; text-align: left; font-weight: 800; border-bottom: 2px solid #e8f0fc; color: #1152d4; text-transform: uppercase; letter-spacing: 0.08em; }
                .analyst-table td { padding: 1.2rem 1rem; border-bottom: 1px solid #e8f0fc; color: rgba(0,0,0,0.7); }
                .analyst-table tr:last-child td { border-bottom: none; }
                .analyst-table tr:hover td { background: #f0f7ff; }

                .primary-excerpt {
                    font-size: 1.5rem; line-height: 1.6; font-family: var(--font-serif); 
                    color: #1152d4; italic; margin-bottom: 4rem;
                    border-left: 5px solid #00d1ff; padding-left: 2.5rem; 
                    font-weight: 600; text-align: left;
                }

                @media (max-width: 1024px) {
                    .markdown-h-intel { font-size: 2.1rem; }
                    .prose-intel-root p:first-of-type::first-letter { font-size: 3.8rem; }
                    .primary-excerpt { font-size: 1.3rem; }
                }
            `}</style>
        </article>
    )
}
