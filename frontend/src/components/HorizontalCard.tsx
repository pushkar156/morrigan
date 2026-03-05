"use client"
import Link from 'next/link'
import { Blog } from '@/lib/demo-data'

export default function HorizontalCard({ blog, isDark }: { blog: Blog, isDark: boolean }) {
    const date = new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const categoryDisplay = blog.category.replace(/-/g, ' ').toUpperCase()

    return (
        <Link
            href={`/blog/${blog.slug}`}
            className={`group relative flex flex-col w-[320px] md:w-[360px] h-fit shrink-0 rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-3 select-none ${isDark
                ? 'bg-[#0f1c2e] border border-white/5 hover:border-[#00d1ff]/25 shadow-xl hover:shadow-[0_24px_60px_rgba(0,209,255,0.1)]'
                : 'bg-white border border-black/5 hover:border-[#1152d4]/20 shadow-xl hover:shadow-[0_24px_60px_rgba(17,82,212,0.1)]'
                }`}
        >
            {/* Image — capped at 40% of card height */}
            <div className="relative h-[200px] md:h-[220px] w-full overflow-hidden shrink-0">
                <img
                    src={blog.featured_image || '/logo.png'}
                    alt={blog.title}
                    className="w-full h-full object-cover filter grayscale-[0.6] brightness-95 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    draggable={false}
                />
                {/* Bottom fade into card body */}
                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t pointer-events-none ${isDark ? 'from-[#0f1c2e]' : 'from-white'
                    }`} />
            </div>

            {/* Floating Category Pill — straddles the image-text boundary */}
            <div className="relative px-6 -mt-4 z-10">
                <span className={`inline-block text-[9px] font-black tracking-[0.2em] px-4 py-1.5 uppercase rounded-full transition-all duration-300 ${isDark
                    ? 'bg-[#00d1ff]/15 text-[#00d1ff] border border-[#00d1ff]/20 group-hover:bg-[#00d1ff]/25'
                    : 'bg-[#1152d4]/10 text-[#1152d4] border border-[#1152d4]/15 group-hover:bg-[#1152d4]/15'
                    }`}>
                    {categoryDisplay}
                </span>
            </div>

            {/* Typography Block with generous interior padding */}
            <div className="flex flex-col flex-1 px-6 pt-5 pb-6">
                <h3 className={`text-lg md:text-xl font-serif font-semibold leading-[1.35] mb-3 line-clamp-2 transition-colors duration-300 ${isDark ? 'text-white group-hover:text-[#00d1ff]' : 'text-[#000309] group-hover:text-[#1152d4]'
                    }`}>
                    {blog.title}
                </h3>

                <p className={`text-[13px] md:text-sm font-sans line-clamp-3 leading-[1.7] mb-auto ${isDark ? 'text-white/40' : 'text-black/45'
                    }`}>
                    {blog.excerpt}
                </p>

                {/* Metadata Footer Row — date + read time */}
                <div className={`flex items-center justify-between mt-6 pt-4 border-t transition-colors ${isDark ? 'border-white/5' : 'border-black/5'
                    }`}>
                    <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold tracking-wide uppercase ${isDark ? 'text-white/40' : 'text-black/40'
                            }`}>
                            {date}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] tracking-widest uppercase font-bold ${isDark ? 'text-white/30' : 'text-black/30'
                            }`}>
                            {blog.read_time} min read
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isDark
                            ? 'bg-white/5 text-white/30 group-hover:bg-[#00d1ff] group-hover:text-[#000511]'
                            : 'bg-black/5 text-black/30 group-hover:bg-[#1152d4] group-hover:text-white'
                            }`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
