"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Blog } from '@/lib/demo-data'

interface CategoryAccordionProps {
    title: string
    subtitle: string
    category: string
    blogs: Blog[]
    theme: "light" | "dark"
    index: number
}

export default function CategoryScroll({ title, subtitle, category, blogs, theme, index }: CategoryAccordionProps) {
    const filteredBlogs = blogs.filter(b => b.category === category)
    const isDark = theme === "dark"
    const [expandedIndex, setExpandedIndex] = useState<number>(0)
    const [isPaused, setIsPaused] = useState(false)

    // Autoplay Logic
    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            setExpandedIndex((prev) => (prev + 1) % filteredBlogs.length)
        }, 4000)

        return () => clearInterval(interval)
    }, [isPaused, filteredBlogs.length])

    if (filteredBlogs.length === 0) return null

    return (
        <section
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            data-theme={isDark ? 'dark' : 'light'}
            className={`relative w-full transition-colors duration-700 ${isDark ? 'text-white' : 'text-black'}`}
            style={{
                backgroundColor: isDark ? '#000511' : '#f8f9fa',
                paddingTop: index === 0 ? '80px' : '30px', // Adjust this for top breathing room
                paddingBottom: '50px' // Adjust this for space between categories
            }}
        >
            <div
                className="container-custom relative z-10 w-full px-6"
                style={{ marginBottom: '20px' }} // breathing space between title and gallery
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight"
                        >
                            {title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className={`font-sans text-base opacity-60 max-w-xl`}
                        >
                            {subtitle}
                        </motion.p>
                    </div>

                    <Link
                        href={`/journal?category=${category}`}
                        className={`group flex items-center gap-4 text-[11px] font-black tracking-[0.3em] rounded-full border transition-all ${isDark
                            ? 'border-white/10 hover:border-[#00d1ff] hover:text-[#00d1ff]'
                            : 'border-black/10 hover:border-[#1152d4] hover:text-[#1152d4]'
                            }`}
                        style={{ padding: '8px 20px' }} // Adjust this for button size/text clearance
                    >
                        VIEW FULL SERIES
                    </Link>
                </div>
            </div>

            {/* The Accordion Container */}
            <div className="container-custom px-6 h-[500px] md:h-[600px]">
                <div className="flex w-full h-full gap-5 md:gap-8 items-stretch">
                    {filteredBlogs.slice(0, 5).map((blog, idx) => {
                        const isExpanded = expandedIndex === idx
                        const date = new Date(blog.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })

                        return (
                            <motion.div
                                key={blog.id}
                                onMouseEnter={() => {
                                    setExpandedIndex(idx)
                                    setIsPaused(true)
                                }}
                                className="relative h-full cursor-pointer group"
                                initial={false}
                                animate={{
                                    flex: isExpanded ? 5 : 1,
                                }}
                                transition={{
                                    duration: 0.7,
                                    ease: [0.23, 1, 0.32, 1],
                                }}
                            >
                                <Link href={`/blog/${blog.slug}`} className="block w-full h-full relative overflow-hidden rounded-[2.5rem]">
                                    {/* background image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={blog.featured_image || '/logo.png'}
                                            alt={blog.title}
                                            className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 ease-out group-hover:grayscale-0 group-hover:scale-[1.35]"
                                        />
                                        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-700 ${isExpanded ? 'opacity-0' : 'opacity-100'}`} />
                                    </div>

                                    {/* Glass Content Layers - Removed flex-end to ensure pure absolute floating */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            {isExpanded ? (
                                                <motion.div
                                                    key="expanded-content"
                                                    initial={{ opacity: 0, scale: 0.85, y: 60 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.85, y: 40 }}
                                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                    className="absolute inset-x-12 bottom-12 bg-white/40 backdrop-blur-3xl border border-[#00d1ff]/30 z-20"
                                                    style={{
                                                        padding: '64px',
                                                        borderRadius: '3rem',
                                                        boxShadow: '0 50px 120px -30px rgba(0,0,0,0.4), 0 0 40px rgba(0,209,255,0.1)',
                                                    }}
                                                >
                                                    <div className="flex items-center gap-6 mb-8">
                                                        <span className="text-[11px] font-black tracking-[0.15em] text-[#00d1ff]/80 uppercase">
                                                            {date}
                                                        </span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-black/10" />
                                                        <span className="text-[11px] font-bold tracking-tight text-black/50 uppercase">
                                                            {blog.read_time} MIN READ
                                                        </span>
                                                    </div>
                                                    <h3 className="text-4xl md:text-5xl font-serif font-black text-black mb-8 leading-[1] tracking-tighter">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-lg text-black/80 font-sans line-clamp-2 max-w-2xl mb-12 leading-relaxed font-medium">
                                                        {blog.excerpt}
                                                    </p>
                                                    <div className="inline-flex items-center gap-5 text-[11px] font-black tracking-[0.4em] text-[#00d1ff]/80 group-hover:gap-8 transition-all cursor-pointer">
                                                        READ FULL ARTICLE
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="collapsed-content"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute inset-0 flex items-center justify-center p-10"
                                                >
                                                    <div
                                                        className="bg-white/70 backdrop-blur-2xl rounded-full border border-white/50 flex items-center justify-center shadow-2xl"
                                                        style={{
                                                            writingMode: 'vertical-rl',
                                                            transform: 'rotate(180deg)',
                                                            padding: '12px 6px' // Matched pill proportion
                                                        }}
                                                    >
                                                        <h3 className="text-sm font-serif font-bold text-black/80 whitespace-nowrap tracking-wide capitalize">
                                                            {blog.title}
                                                        </h3>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
