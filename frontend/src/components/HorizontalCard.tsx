"use client"
import Link from 'next/link'
import { Blog } from '@/lib/demo-data'
import { motion } from 'framer-motion'

export default function HorizontalCard({ blog, index, isDark }: { blog: Blog, index: number, isDark: boolean }) {
    const date = new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const categoryDisplay = blog.category.replace(/-/g, ' ').toUpperCase()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className={`group relative w-[340px] md:w-[440px] shrink-0 flex flex-col rounded-[32px] overflow-hidden transition-all duration-700 hover:-translate-y-3 ${isDark
                    ? 'bg-[#111f2e] border border-white/10 hover:border-[#00d1ff]/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,209,255,0.15)]'
                    : 'bg-white border border-black/10 hover:border-[#1152d4]/40 shadow-2xl hover:shadow-[0_20px_50px_rgba(17,82,212,0.15)]'
                }`}
        >
            {/* FORCE text color & none decoration inline to absolutely nuke browser default blue links */}
            <Link
                href={`/blog/${blog.slug}`}
                className="flex flex-col w-full h-full cursor-pointer"
                style={{ textDecoration: 'none', color: isDark ? '#ffffff' : '#000309' }}
            >
                {/* Image Container - Larger & More Cinematic */}
                <div className="relative h-[260px] md:h-[300px] w-full overflow-hidden bg-black/5 shrink-0">
                    <img
                        src={blog.featured_image || '/logo.png'}
                        alt={blog.title}
                        className="w-full h-full object-cover filter grayscale-[0.8] opacity-90 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                    />
                    {/* Shadow overlay matching the bottom card for seamless integration on mobile/shrinks */}
                    <div className={`absolute bottom-0 w-full h-[50%] bg-gradient-to-t ${isDark ? 'from-[#111f2e] to-transparent' : 'from-white to-transparent'} opacity-80 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`} />
                </div>

                {/* Typography Block formatted as an elegant padded card interior */}
                <div className="flex flex-col flex-1 p-8 md:p-10 relative z-10 bg-inherit">
                    <div className="flex justify-between items-center mb-6">
                        <span className={`text-[10px] font-black tracking-[0.25em] px-4 py-2 uppercase rounded-full transition-all duration-300 ${isDark
                                ? 'bg-white/10 text-[#00d1ff] group-hover:bg-[#00d1ff]/20'
                                : 'bg-black/5 text-[#1152d4] group-hover:bg-[#1152d4]/10'
                            }`}>
                            {categoryDisplay}
                        </span>
                        <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                            {date}
                        </span>
                    </div>

                    <h3 className={`text-2xl md:text-[28px] font-serif font-extrabold leading-[1.2] mb-5 transition-colors duration-400 ${isDark ? 'group-hover:text-[#00d1ff]' : 'group-hover:text-[#1152d4]'
                        }`}>
                        {blog.title}
                    </h3>

                    <p className={`text-[15px] md:text-[16px] font-sans line-clamp-3 leading-[1.8] mb-10 mt-auto ${isDark ? 'text-white/60' : 'text-black/60'
                        }`}>
                        {blog.excerpt}
                    </p>

                    {/* Bottom Action Bar */}
                    <div className={`flex items-center justify-between mt-auto pt-6 border-t transition-colors duration-500 ${isDark ? 'border-white/10 group-hover:border-white/30' : 'border-black/5 group-hover:border-black/15'
                        }`}>
                        <div className="flex items-center gap-4 transform translate-x-[-15px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                            <span className={`text-[11px] uppercase font-black tracking-[0.3em] ${isDark ? 'text-[#00d1ff]' : 'text-[#1152d4]'}`}>
                                Read Insight
                            </span>
                        </div>

                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isDark
                                ? 'bg-white/10 text-white/50 group-hover:bg-[#00d1ff] group-hover:text-[#000511] shadow-[0_0_0_1px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(0,209,255,0.4)]'
                                : 'bg-black/5 text-black/50 group-hover:bg-[#1152d4] group-hover:text-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)] group-hover:shadow-[0_0_20px_rgba(17,82,212,0.3)]'
                            }`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
