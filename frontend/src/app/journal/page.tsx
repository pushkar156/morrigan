"use client"
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DEMO_BLOGS, Blog } from '@/lib/demo-data'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FloatingOrb, ParticleField } from '@/components/HeroVFX'

const CATEGORIES = [
    { id: 'all', label: 'All Posts' },
    { id: 'back-to-basics', label: 'Back to Basics' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'stock-analysis', label: 'Stock Analysis' },
    { id: '100-days-challenge', label: '100 Days Challenge' },
    { id: 'ma-diaries', label: 'M&A Diaries' },
]

function JournalCard({ blog, index }: { blog: Blog; index: number }) {
    const date = new Date(blog.published_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
    const categoryDisplay = blog.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/blog/${blog.slug}`} className="journal-card-link">
                <article className="journal-card">
                    <div className="journal-card-img-wrap">
                        <img
                            src={blog.featured_image || '/logo.png'}
                            alt={blog.title}
                            className="journal-card-img"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png' }}
                        />
                        <div className="journal-card-category-pill">{categoryDisplay}</div>
                    </div>
                    <div className="journal-card-body">
                        <h3 className="journal-card-title">{blog.title}</h3>
                        <p className="journal-card-excerpt">{blog.excerpt}</p>
                        <div className="journal-card-meta">
                            <span className="journal-card-author">{blog.author}</span>
                            <span className="journal-card-dot">·</span>
                            <span>{date}</span>
                            <span className="journal-card-dot">·</span>
                            <span>{blog.read_time} min read</span>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    )
}

function JournalContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
    const [searchQuery, setSearchQuery] = useState('')
    const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>([])
    const searchRef = useRef<HTMLInputElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const mx = useMotionValue(0); const my = useMotionValue(0)
    const px = useSpring(useTransform(mx, [0, 1], [-22, 22]), { stiffness: 55, damping: 18 })
    const py = useSpring(useTransform(my, [0, 1], [-12, 12]), { stiffness: 55, damping: 18 })

    const handleHeaderMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!headerRef.current) return
        const r = headerRef.current.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
    }

    useEffect(() => {
        const cat = searchParams.get('category') || 'all'
        setActiveCategory(cat)
    }, [searchParams])

    useEffect(() => {
        let filtered = DEMO_BLOGS
        if (activeCategory !== 'all') {
            filtered = filtered.filter(b => b.category === activeCategory)
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.excerpt.toLowerCase().includes(q)
            )
        }
        setDisplayedBlogs(filtered)
    }, [activeCategory, searchQuery])

    const handleCategoryChange = (catId: string) => {
        setActiveCategory(catId)
        if (catId === 'all') {
            router.push('/journal', { scroll: false })
        } else {
            router.push(`/journal?category=${catId}`, { scroll: false })
        }
    }

    return (
        <main className="journal-page">
            {/* Page Header */}
            <div ref={headerRef} onMouseMove={handleHeaderMouse} className="journal-header">
                <ParticleField containerRef={headerRef} />

                <FloatingOrb delay={0} size={320} x="5%" y="10%" color="rgba(0,209,255,0.1)" />
                <FloatingOrb delay={2} size={200} x="70%" y="5%" color="rgba(17,82,212,0.13)" />
                <FloatingOrb delay={1} size={160} x="48%" y="52%" color="rgba(0,209,255,0.07)" />
                <FloatingOrb delay={3.5} size={110} x="88%" y="42%" color="rgba(135,206,235,0.09)" />

                {/* Parallax watermark */}
                <motion.div style={{ x: px, y: py }} className="journal-watermark">ARCHIVE</motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="journal-header-inner"
                >
                    <motion.span className="journal-eyebrow"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <span className="journal-live-dot" />
                        EDITORIAL ARCHIVE
                    </motion.span>
                    <h1 className="journal-title">
                        {['The', 'Journal'].map((word, i) => (
                            <motion.span key={word}
                                initial={{ opacity: 0, y: 70, filter: 'blur(12px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                style={{ display: 'inline-block', marginRight: '0.3em' }}
                            >{word}</motion.span>
                        ))}
                    </h1>
                    <motion.p className="journal-subtitle"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.7 }}
                    >
                        Dispatches from the intersection of capital, strategy, and institutional logic.
                    </motion.p>
                </motion.div>
            </div>

            {/* Search + Filters */}
            <div className="journal-controls">
                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="journal-search-wrap"
                >
                    <svg className="journal-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={searchRef}
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search articles…"
                        className="journal-search-input"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="journal-search-clear"
                            aria-label="Clear search"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )}
                </motion.div>

                {/* Category tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="journal-tabs"
                >
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`journal-tab ${activeCategory === cat.id ? 'active' : ''}`}
                        >
                            {cat.label}
                            {activeCategory === cat.id && (
                                <motion.span
                                    layoutId="tab-underline"
                                    className="journal-tab-underline"
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Results count */}
            <div className="journal-results-bar container-custom">
                <motion.span
                    key={displayedBlogs.length}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="journal-results-count"
                >
                    {displayedBlogs.length} {displayedBlogs.length === 1 ? 'article' : 'articles'}
                </motion.span>
            </div>

            {/* Grid */}
            <div className="journal-grid-wrap container-custom">
                <AnimatePresence mode="wait">
                    {displayedBlogs.length > 0 ? (
                        <motion.div
                            key={`${activeCategory}-${searchQuery}`}
                            className="journal-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {displayedBlogs.map((blog, i) => (
                                <JournalCard key={`${blog.id}-${blog.slug}`} blog={blog} index={i} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="journal-empty"
                        >
                            <div className="journal-empty-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <h3>No articles found</h3>
                            <p>Try adjusting your search or selecting a different category.</p>
                            <button
                                onClick={() => { setSearchQuery(''); handleCategoryChange('all') }}
                                className="journal-empty-reset"
                            >
                                Clear filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                /* ── Journal Page Styles ── */

                .journal-page {
                    min-height: 100vh;
                    background: #f8f9fa;
                    padding-top: 100px;
                }

                /* Header */
                .journal-header {
                    background: #254665;
                    padding: 80px 2rem 90px;
                    position: relative;
                    overflow: hidden;
                }

                .journal-header::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 48px 48px;
                    pointer-events: none;
                    animation: journal-grid-move 30s linear infinite;
                }
                
                @keyframes journal-grid-move {
                    0% { background-position: 0 0; }
                    100% { background-position: 48px 48px; }
                }

                .journal-header::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(0,209,255,0.3), transparent);
                }

                .journal-header-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    gap: 16px;
                    position: relative;
                    z-index: 1;
                }

                .journal-eyebrow {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    font-family: var(--font-sans);
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 0.35em;
                    color: #00d1ff;
                    text-transform: uppercase;
                }

                .journal-live-dot {
                    width: 7px; height: 7px; border-radius: 50%; background: #00d1ff;
                    animation: journal-pulse 2s ease-out infinite;
                }
                @keyframes journal-pulse {
                    0%   { box-shadow: 0 0 0 0 rgba(0,209,255,0.6); }
                    70%  { box-shadow: 0 0 0 8px rgba(0,209,255,0); }
                    100% { box-shadow: 0 0 0 0 rgba(0,209,255,0); }
                }

                .journal-watermark {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
                    font-family: var(--font-serif); font-size: clamp(60px, 17vw, 200px);
                    font-weight: 900; color: transparent;
                    -webkit-text-stroke: 1px rgba(255,255,255,0.04);
                    white-space: nowrap; pointer-events: none; user-select: none;
                    letter-spacing: -0.04em; z-index: 0;
                }

                .journal-title {
                    font-family: var(--font-serif);
                    font-size: clamp(3rem, 8vw, 6.5rem);
                    font-weight: 700;
                    color: #fff;
                    line-height: 1;
                    letter-spacing: -0.02em;
                    margin: 0;
                }

                .journal-subtitle {
                    font-family: var(--font-sans);
                    font-size: 0.95rem;
                    color: rgba(255,255,255,0.45);
                    max-width: 480px;
                    line-height: 1.65;
                    margin: 0;
                }

                /* Controls */
                .journal-controls {
                    background: #fff;
                    border-bottom: 1px solid rgba(0,0,0,0.07);
                    position: sticky;
                    top: 80px;
                    z-index: 50;
                    padding: 0 2rem;
                    display: flex;
                    flex-direction: column;
                    max-width: 100%;
                }

                .journal-search-wrap {
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                    position: relative;
                    padding: 20px 0 0;
                }

                .journal-search-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(0,0,0,0.3);
                    pointer-events: none;
                    margin-top: 10px;
                }

                .journal-search-input {
                    width: 100%;
                    padding: 14px 44px 14px 46px;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 12px;
                    background: #f8f9fa;
                    font-family: var(--font-sans);
                    font-size: 0.875rem;
                    color: #000309;
                    outline: none;
                    transition: all 0.25s ease;
                }

                .journal-search-input::placeholder {
                    color: rgba(0,0,0,0.3);
                }

                .journal-search-input:focus {
                    border-color: rgba(0,209,255,0.4);
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(0,209,255,0.08);
                }

                .journal-search-clear {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 10px;
                    transition: color 0.2s;
                }
                .journal-search-clear:hover { color: #000; }

                /* Tabs */
                .journal-tabs {
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                    display: flex;
                    gap: 0;
                    overflow-x: auto;
                    scrollbar-width: none;
                    padding: 12px 0 0;
                }
                .journal-tabs::-webkit-scrollbar { display: none; }

                .journal-tab {
                    position: relative;
                    flex-shrink: 0;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-family: var(--font-sans);
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: rgba(0,0,0,0.45);
                    padding: 10px 18px 14px;
                    transition: color 0.25s ease;
                    letter-spacing: 0.01em;
                }

                .journal-tab:hover { color: #000309; }
                .journal-tab.active { color: #000309; font-weight: 600; }

                .journal-tab-underline {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #00d1ff;
                    border-radius: 2px 2px 0 0;
                }

                /* Results bar */
                .journal-results-bar {
                    padding-top: 32px;
                    padding-bottom: 8px;
                }

                .journal-results-count {
                    font-family: var(--font-sans);
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: rgba(0,0,0,0.3);
                }

                /* Grid */
                .journal-grid-wrap {
                    padding-bottom: 100px;
                    padding-top: 16px;
                }

                .journal-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 28px;
                }

                @media (max-width: 1100px) {
                    .journal-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 680px) {
                    .journal-grid { grid-template-columns: 1fr; }
                    .journal-header { padding: 60px 1.5rem 70px; }
                    .journal-controls { padding: 0 1.5rem; }
                }

                /* Card */
                .journal-card-link {
                    display: block;
                    text-decoration: none;
                    color: inherit;
                    height: 100%;
                }

                .journal-card {
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.06);
                    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.3s ease;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .journal-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 48px rgba(0,0,0,0.1);
                    border-color: rgba(0,209,255,0.2);
                }

                .journal-card-img-wrap {
                    position: relative;
                    overflow: hidden;
                    aspect-ratio: 16 / 9;
                    background: #f0f0f0;
                }

                .journal-card-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
                }

                .journal-card:hover .journal-card-img {
                    transform: scale(1.04);
                }

                .journal-card-category-pill {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    background: rgba(0,3,9,0.75);
                    backdrop-filter: blur(8px);
                    color: #00d1ff;
                    font-family: var(--font-sans);
                    font-size: 0.6rem;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 100px;
                    border: 1px solid rgba(0,209,255,0.2);
                }

                .journal-card-body {
                    padding: 22px 22px 24px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    gap: 10px;
                }

                .journal-card-title {
                    font-family: var(--font-serif);
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #000309;
                    line-height: 1.35;
                    letter-spacing: -0.01em;
                    margin: 0;
                    transition: color 0.2s;
                }

                .journal-card:hover .journal-card-title {
                    color: #1152d4;
                }

                .journal-card-excerpt {
                    font-family: var(--font-sans);
                    font-size: 0.82rem;
                    color: rgba(0,0,0,0.5);
                    line-height: 1.65;
                    margin: 0;
                    flex: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .journal-card-meta {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    font-family: var(--font-sans);
                    font-size: 0.72rem;
                    color: rgba(0,0,0,0.35);
                    margin-top: auto;
                    padding-top: 14px;
                    border-top: 1px solid rgba(0,0,0,0.06);
                }

                .journal-card-author {
                    font-weight: 600;
                    color: rgba(0,0,0,0.55);
                }

                .journal-card-dot {
                    opacity: 0.4;
                }

                /* Empty State */
                .journal-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    padding: 80px 2rem;
                    text-align: center;
                }

                .journal-empty-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.04);
                    border: 1px solid rgba(0,0,0,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(0,0,0,0.25);
                }

                .journal-empty h3 {
                    font-family: var(--font-serif);
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: #000309;
                }

                .journal-empty p {
                    font-family: var(--font-sans);
                    font-size: 0.875rem;
                    color: rgba(0,0,0,0.4);
                    max-width: 320px;
                }

                .journal-empty-reset {
                    margin-top: 8px;
                    background: none;
                    border: 1px solid rgba(0,0,0,0.12);
                    padding: 10px 24px;
                    border-radius: 100px;
                    font-family: var(--font-sans);
                    font-size: 0.78rem;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    cursor: pointer;
                    color: rgba(0,0,0,0.5);
                    transition: all 0.25s ease;
                }

                .journal-empty-reset:hover {
                    border-color: rgba(0,209,255,0.4);
                    color: #00d1ff;
                    background: rgba(0,209,255,0.04);
                }
            `}</style>
        </main>
    )
}

export default function JournalPage() {
    return (
        <Suspense>
            <JournalContent />
        </Suspense>
    )
}
