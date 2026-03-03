"use client"
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    // Better Parallax Control
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6], [1, 0.5, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
    const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10])

    return (
        <section
            ref={containerRef}
            className="relative min-h-[105vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20"
        >
            <motion.div
                style={{ y, opacity, scale, filter: `blur(${blur}px)` }}
                className="relative z-20 max-w-6xl w-full"
            >
                {/* Subtle Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-10 inline-block px-8 py-3 rounded-full hero-badge text-[11px] font-black uppercase tracking-[0.4em] ring-1 ring-[#00d1ff20]"
                >
                    Institutional Editorial Intelligence
                </motion.div>

                {/* Cinematic Headline */}
                <motion.h1
                    className="text-white font-serif text-[clamp(2.5rem,8.5vw,7.5rem)] mb-8 leading-[1] tracking-tight whitespace-nowrap"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    Decoding the <br />
                    <span className="italic font-light !text-[0.85em] opacity-50 block mt-2">New Economy</span>
                </motion.h1>

                {/* Separator */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 120 }}
                    transition={{ duration: 2, delay: 1, ease: "circOut" }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-[#00d1ff] to-transparent mx-auto mb-12 opacity-60"
                />

                {/* Balanced Body Copy */}
                <motion.p
                    className="text-lg md:text-2xl text-[rgba(255,255,255,0.6)] max-w-3xl mx-auto mb-16 font-sans tracking-tight leading-relaxed font-medium"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                >
                    Morrigan provides sharp, data-driven analysis on geopolitics, <br className="hidden md:block" />
                    emerging technologies, and the institutional capital flows of modern India.
                </motion.p>

                {/* Premium Buttons */}
                <motion.div
                    className="flex flex-wrap gap-10 justify-center items-center"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link href="/journal" className="group relative px-12 py-5 bg-[#00d1ff] text-[#000309] font-black text-xs uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_15px_40px_rgba(0,209,255,0.25)]">
                        <span className="relative z-10">Access Intelligence</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </Link>

                    <Link href="/about" className="group flex items-center gap-4 text-white p-4 font-bold text-xs uppercase tracking-[0.2em] transition-all border-b border-white/5 hover:border-[#00d1ff] pb-1">
                        <span>Our Thesis</span>
                        <span className="text-[#00d1ff] group-hover:translate-x-2 transition-transform">→</span>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Minimal Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 2 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/10"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#00d1ff40]" />
            </motion.div>
        </section>
    )
}
