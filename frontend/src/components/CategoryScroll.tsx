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
}

export default function CategoryScroll({ title, subtitle, category, blogs }: CategoryScrollProps) {
    const filteredBlogs = blogs.filter(b => b.category === category)

    return (
        <section className="category-section">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                <div className="max-w-xl">
                    <motion.h2
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-serif text-black mb-4 leading-tight"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-black/40 font-sans tracking-tight text-sm md:text-lg leading-relaxed"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                <Link href={`/journal?category=${category}`} className="group flex items-center gap-6 text-[10px] font-black tracking-[0.4em] text-black/30 hover:text-[#00d1ff] transition-all whitespace-nowrap pb-2">
                    <span>EXPLORE SERIES</span>
                    <div className="w-16 h-[1px] bg-black/10 group-hover:w-24 group-hover:bg-[#00d1ff] transition-all" />
                </Link>
            </div>

            <div className="horizontal-scroll overflow-x-auto pb-12 -mx-4 px-4 md:mx-0 md:px-0">
                {filteredBlogs.length > 0 ? (
                    <div className="flex gap-8 md:gap-12">
                        {filteredBlogs.map((blog, idx) => (
                            <HorizontalCard key={blog.id} blog={blog} index={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="h-[400px] w-full rounded-3xl border border-dashed border-black/10 flex flex-col items-center justify-center text-black/10 gap-4">
                        <div className="w-12 h-12 rounded-full border border-current opacity-20 flex items-center justify-center">?</div>
                        <span className="text-[10px] font-black tracking-widest">PENDING EDITORIAL RELEASE</span>
                    </div>
                )}
            </div>
        </section>
    )
}
