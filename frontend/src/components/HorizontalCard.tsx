"use client"
import Link from 'next/link'
import { Blog } from '@/lib/demo-data'
import { motion } from 'framer-motion'

export default function HorizontalCard({ blog, index, isDark }: { blog: Blog, index: number, isDark: boolean }) {
    const date = new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const categoryDisplay = blog.category.replace(/-/g, ' ').toUpperCase()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="group relative w-[320px] md:w-[420px] shrink-0 flex flex-col"
        >
            <Link href={`/blog/${blog.slug}`} className="flex flex-col w-full h-full cursor-pointer">
                {/* Image Container (Sharp Editorial Borders instead of blurred gradients) */}
                <div className="relative h-[220px] md:h-[280px] w-full overflow-hidden mb-6 bg-black/5">
                    <img
                        src={blog.featured_image || '/logo.png'}
                        alt={blog.title}
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    {/* Subtle Overlay Border mimicking print press frame */}
                    <div className={`absolute inset-0 border ${isDark ? 'border-white/10' : 'border-black/10'} pointer-events-none transition-colors duration-300 group-hover:border-[#00d1ff]/30`} />
                </div>

                {/* Typography Block (Clean Whitespace/Darkspace) */}
                <div className="flex flex-col flex-1 px-1">
                    <div className="flex justify-between items-center mb-4">
                        <span className={`text-[9px] font-black tracking-[0.2em] px-2 py-1 uppercase rounded-sm transition-all duration-300 ${isDark ? 'bg-white/10 text-[#00d1ff] group-hover:bg-[#00d1ff]/20' : 'bg-black/5 text-[#1152d4] group-hover:bg-[#1152d4]/10'}`}>
                            {categoryDisplay}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                            {date}
                        </span>
                    </div>

                    {/* Premium Serif Typography completely isolated from imagery */}
                    <h3 className={`text-2xl md:text-[28px] font-serif font-bold leading-[1.2] mb-4 transition-colors duration-400 ${isDark ? 'text-white group-hover:text-[#00d1ff]' : 'text-[#000309] group-hover:text-[#1152d4]'}`}>
                        {blog.title}
                    </h3>

                    <p className={`text-sm md:text-base font-sans line-clamp-3 leading-relaxed mb-8 mt-auto ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                        {blog.excerpt}
                    </p>

                    {/* Minimalist Read More Accent mimicking institutional links */}
                    <div className="flex items-center gap-3 mt-auto transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                        <span className={`text-[10px] uppercase font-black tracking-[0.2em] ${isDark ? 'text-[#00d1ff]' : 'text-[#1152d4]'}`}>Read Insight</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={isDark ? 'text-[#00d1ff]' : 'text-[#1152d4]'}>
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
