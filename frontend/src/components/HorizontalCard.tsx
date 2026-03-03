"use client"
import Link from 'next/link'
import { Blog } from '@/lib/demo-data'
import { motion } from 'framer-motion'

export default function HorizontalCard({ blog, index }: { blog: Blog, index: number }) {
    const date = new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const categoryDisplay = blog.category.replace(/-/g, ' ').toUpperCase()

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="group relative w-[380px] shrink-0"
        >
            <Link href={`/blog/${blog.slug}`}>
                <div className="relative h-[480px] w-full overflow-hidden rounded-3xl mb-6 bg-white border border-black/5 shadow-md group-hover:shadow-xl group-hover:border-[#00d1ff20] transition-all duration-700">
                    <img
                        src={blog.featured_image || '/logo.png'}
                        alt={blog.title}
                        className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    />

                    {/* Overlay Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-white via-white/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] font-black tracking-[0.2em] text-[#00d1ff] bg-black/5 px-3 py-1 rounded">
                                {categoryDisplay}
                            </span>
                            <span className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{date}</span>
                        </div>

                        <h3 className="text-2xl font-serif text-black leading-tight mb-4 group-hover:text-[#00d1ff] transition-colors">
                            {blog.title}
                        </h3>

                        <p className="text-sm text-black/60 line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            {blog.excerpt}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
