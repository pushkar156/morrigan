"use client"
import { useState } from 'react'
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

export default function CategoryScroll({ title, subtitle, category, blogs, theme }: CategoryAccordionProps) {
    const filteredBlogs = blogs.filter(b => b.category === category)
    const isDark = theme === "dark"
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

    if (filteredBlogs.length === 0) return null

    return (
        <section
            data-theme={isDark ? 'dark' : 'light'}
            className={`relative py-32 md:py-48 w-full transition-colors duration-700 ${isDark
                ? 'bg-[#000511] text-white'
                : 'bg-[#f8f9fa] text-black'
                }`}
        >
            <div className="container-custom relative z-10 w-full mb-16 px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className={`text-[10px] font-black tracking-[0.4em] uppercase mb-4 block ${isDark ? 'text-[#00d1ff]' : 'text-[#1152d4]'
                                }`}
                        >
                            Editorial Series
                        </motion.span>
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
                        className={`group flex items-center gap-4 text-[11px] font-black tracking-[0.3em] px-6 py-3 rounded-full border transition-all ${isDark
                                ? 'border-white/10 hover:border-[#00d1ff] hover:text-[#00d1ff]'
                                : 'border-black/10 hover:border-[#1152d4] hover:text-[#1152d4]'
                            }`}
                    >
                        VIEW FULL SERIES
                    </Link>
                </div>
            </div>

            {/* The Accordion Container */}
            <div className="container-custom px-6 h-[500px] md:h-[600px]">
                <div className="flex w-full h-full gap-3 md:gap-4 items-stretch">
                    {filteredBlogs.slice(0, 5).map((blog, idx) => {
                        const isExpanded = expandedIndex === idx
                        const date = new Date(blog.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })

                        return (
                            <motion.div
                                key={blog.id}
                                onMouseEnter={() => setExpandedIndex(idx)}
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
                                <Link href={`/blog/${blog.slug}`} className="block w-full h-full relative overflow-hidden rounded-3xl">
                                    {/* background image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={blog.featured_image || '/logo.png'}
                                            alt={blog.title}
                                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                                            }`} />
                                    </div>

                                    {/* Expanded Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            {isExpanded ? (
                                                <motion.div
                                                    key="expanded-content"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.4, delay: 0.2 }}
                                                    className="w-full"
                                                >
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="text-[10px] font-black tracking-widest text-[#00d1ff] uppercase">
                                                            {date}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-white/40" />
                                                        <span className="text-[10px] font-black tracking-widest text-white/60 uppercase">
                                                            {blog.read_time} MIN READ
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-sm text-white/60 font-sans line-clamp-2 max-w-md mb-6">
                                                        {blog.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-[#00d1ff] group-hover:gap-6 transition-all">
                                                        READ ARTICLE
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="collapsed-content"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="absolute inset-0 flex items-center justify-center p-4"
                                                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                                                >
                                                    <h3 className="text-lg font-serif font-bold text-white/80 whitespace-nowrap tracking-wider">
                                                        {blog.title}
                                                    </h3>
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
