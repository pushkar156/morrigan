"use client"
import { Blog } from '@/lib/demo-data'
import HorizontalCard from './HorizontalCard'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface CategoryScrollProps {
    title: string
    subtitle: string
    category: string
    blogs: Blog[]
    theme: "light" | "dark"
    index: number
}

export default function CategoryScroll({ title, subtitle, category, blogs, theme, index }: CategoryScrollProps) {
    const filteredBlogs = blogs.filter(b => b.category === category)
    const isDark = theme === "dark"

    // Direction: even rows scroll left, odd rows scroll right
    const isReversed = index % 2 !== 0

    // Animation duration scales with number of cards — slower = more elegant
    const baseDuration = Math.max(20, filteredBlogs.length * 15)

    return (
        <section
            data-theme={isDark ? 'dark' : 'light'}
            className={`relative py-32 md:py-40 w-full overflow-hidden transition-colors duration-700 ${isDark
                ? 'bg-[#0b1724] text-white'
                : 'bg-[#f2f4f7] text-black'
                }`}
        >
            {/* Section Header */}
            <div className="container-custom relative z-10 w-full mb-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className={`text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-3 tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-[#000309]'
                                }`}
                        >
                            {title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className={`font-sans tracking-wide text-sm md:text-base leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'
                                }`}
                        >
                            {subtitle}
                        </motion.p>
                    </div>

                    <Link
                        href={`/journal?category=${category}`}
                        className={`group flex items-center gap-4 text-[10px] sm:text-[11px] font-black tracking-[0.3em] transition-all whitespace-nowrap shrink-0 px-5 py-3 rounded-full border ${isDark
                            ? 'text-white/40 hover:text-[#00d1ff] border-white/10 hover:border-[#00d1ff]/30 hover:bg-[#00d1ff]/5'
                            : 'text-black/40 hover:text-[#1152d4] border-black/10 hover:border-[#1152d4]/30 hover:bg-[#1152d4]/5'
                            }`}
                    >
                        <span>EXPLORE SERIES</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-1">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Infinite Marquee Carousel — pure CSS animation */}
            {filteredBlogs.length > 0 ? (
                <div className="relative w-full overflow-hidden group/carousel">
                    {/* The track translating infinitely. We translate precisely -33.333%. */}
                    <div
                        className={`flex w-max ${isReversed ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}
                        style={{ animationDuration: `${baseDuration}s` }}
                    >
                        {/* We duplicate the array 3x. Each item provides its own right-padding to guarantee mathematical perfection for the loop without flex-gap drift. */}
                        {[...filteredBlogs, ...filteredBlogs, ...filteredBlogs].map((blog, idx) => (
                            <div key={`blog-wrap-${idx}`} className="shrink-0 pr-6 md:pr-10">
                                <HorizontalCard
                                    blog={blog}
                                    isDark={isDark}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="container-custom flex justify-center">
                    <div className={`h-[450px] w-[360px] rounded-2xl border border-dashed flex flex-col items-center justify-center gap-8 ${isDark ? 'border-white/10 text-white/20 bg-white/[0.02]' : 'border-black/10 text-black/20 bg-black/[0.02]'
                        }`}>
                        <div className="w-20 h-20 rounded-full border border-current flex items-center justify-center text-3xl font-serif opacity-50">?</div>
                        <div className="flex flex-col items-center gap-2">
                            <span className={`text-[10px] font-black tracking-[0.4em] uppercase ${isDark ? 'text-[#00d1ff]/50' : 'text-[#1152d4]/50'}`}>Pending</span>
                            <span className="text-xs uppercase tracking-widest opacity-60">Editorial Release</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Soft edge fade masks */}
            <div className={`absolute top-0 left-0 w-[8vw] h-full z-20 bg-gradient-to-r pointer-events-none ${isDark ? 'from-[#0b1724] to-transparent' : 'from-[#f2f4f7] to-transparent'
                }`} />
            <div className={`absolute top-0 right-0 w-[8vw] h-full z-20 bg-gradient-to-l pointer-events-none ${isDark ? 'from-[#0b1724] to-transparent' : 'from-[#f2f4f7] to-transparent'
                }`} />
        </section>
    )
}
