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
        <section className="category-section py-20">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-6">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-5xl font-serif text-white mb-2"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 font-sans tracking-tight"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                <Link href={`/journal?category=${category}`} className="group flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-white transition-colors">
                    <span>VIEW FULL SERIES</span>
                    <div className="w-12 h-[1px] bg-white/10 group-hover:w-20 group-hover:bg-[#00d1ff] transition-all" />
                </Link>
            </div>

            <div className="horizontal-scroll overflow-x-auto pb-10">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((blog, idx) => (
                        <HorizontalCard key={blog.id} blog={blog} index={idx} />
                    ))
                ) : (
                    <div className="h-[400px] w-full rounded-2xl border border-dashed border-white/5 flex items-center justify-center text-white/10">
                        PENDING EDITORIAL RELEASE
                    </div>
                )}
            </div>
        </section>
    )
}
