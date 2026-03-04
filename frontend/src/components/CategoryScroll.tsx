"use client"
import { Blog } from '@/lib/demo-data'
import HorizontalCard from './HorizontalCard'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

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

    // Parallax scroll-link reference
    const targetRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    })

    // Alternating scroll directions based on index:
    // Even rows slide left as you scroll down
    // Odd rows slide right as you scroll down
    const direction = index % 2 === 0 ? ["10%", "-20%"] : ["-20%", "10%"]
    const x = useTransform(scrollYProgress, [0, 1], direction)

    return (
        <section
            ref={targetRef}
            className={`relative py-24 md:py-36 w-full overflow-hidden transition-colors duration-700 border-t ${isDark ? 'bg-[#0b1724] text-white border-white/[0.02] shadow-[inset_0_20px_40px_rgba(0,0,0,0.2)]' : 'bg-[#f2f4f7] text-black border-black/[0.03] shadow-[inset_0_20px_40px_rgba(0,0,0,0.02)]'}`}
        >
            <div className="container-custom relative z-10 w-full mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    {/* Header Block */}
                    <div className="max-w-xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className={`text-4xl md:text-5xl lg:text-6xl font-serif font-black mb-5 tracking-tight ${isDark ? 'text-white' : 'text-[#000309]'}`}
                        >
                            {title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className={`font-sans tracking-wide text-sm md:text-base lg:text-lg leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}
                        >
                            {subtitle}
                        </motion.p>
                    </div>

                    {/* Minimalist Explore Link */}
                    <Link href={`/journal?category=${category}`} className={`group flex items-center gap-6 text-[10px] sm:text-[11px] font-black tracking-[0.4em] transition-all whitespace-nowrap pb-2 ${isDark ? 'text-white/40 hover:text-[#00d1ff]' : 'text-black/40 hover:text-[#1152d4]'}`}>
                        <span>EXPLORE SERIES</span>
                        <div className={`w-12 h-[1px] group-hover:w-24 transition-all duration-500 ${isDark ? 'bg-white/20 group-hover:bg-[#00d1ff]' : 'bg-black/20 group-hover:bg-[#1152d4]'}`} />
                    </Link>
                </div>
            </div>

            {/* Drifting Parallax Cards Container */}
            {/* The wrapper handles the scrolling visually, making the block responsive to pure vertical scroll */}
            <div className="w-full relative px-4 md:px-0 flex justify-center overflow-x-hidden md:overflow-visible">
                <motion.div
                    style={{ x }}
                    className="flex gap-8 md:gap-14 w-max hover:cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: -1000, right: 1000 }} // Allow physical mobile swiping in tandem with parallax
                >
                    {filteredBlogs.length > 0 ? (
                        filteredBlogs.map((blog, idx) => (
                            <HorizontalCard key={blog.id} blog={blog} index={idx} isDark={isDark} />
                        ))
                    ) : (
                        <div className={`h-[400px] md:h-[500px] w-[340px] md:w-[440px] rounded-[32px] border border-dashed flex flex-col items-center justify-center gap-8 ${isDark ? 'border-white/10 text-white/20 bg-white/[0.02]' : 'border-black/10 text-black/20 bg-black/[0.02]'}`}>
                            <div className="w-20 h-20 rounded-full border border-current flex items-center justify-center text-3xl font-serif opacity-50">?</div>
                            <div className="flex flex-col items-center gap-2">
                                <span className={`text-[10px] font-black tracking-[0.4em] uppercase ${isDark ? 'text-[#00d1ff]/50' : 'text-[#1152d4]/50'}`}>Pending</span>
                                <span className="text-xs uppercase tracking-widest opacity-60">Editorial Release</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Soft edge gradients to blend the horizontal carousels smoothly on wide screens */}
            <div className={`hidden md:block absolute top-0 left-0 w-[15vw] h-full z-20 bg-gradient-to-r ${isDark ? 'from-[#0b1724] to-transparent' : 'from-[#f2f4f7] to-transparent'} pointer-events-none`} />
            <div className={`hidden md:block absolute top-0 right-0 w-[15vw] h-full z-20 bg-gradient-to-l ${isDark ? 'from-[#0b1724] to-transparent' : 'from-[#f2f4f7] to-transparent'} pointer-events-none`} />
        </section>
    )
}
