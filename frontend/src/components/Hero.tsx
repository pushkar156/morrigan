"use client"
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

export default function Hero() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

    return (
        <section
            ref={containerRef}
            className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden select-none"
        >
            <motion.div
                style={{ y, opacity, scale }}
                className="relative z-20 max-w-5xl"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8"
                >
                    <span className="hero-badge px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
                        Strategic Intelligence Platform
                    </span>
                </motion.div>

                <motion.h1
                    className="hero-title text-white font-serif text-[clamp(3rem,10vw,8rem)] mb-6 leading-[0.95] mix-blend-difference"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    THE MORRIGAN <br />
                    <span className="italic font-light text-[0.8em] opacity-40">CHRONICLES</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                    className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#00d1ff] to-transparent mx-auto mb-10"
                />

                <motion.p
                    className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto mb-12 font-sans tracking-tight leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                >
                    Analyzing the intersection of geopolitics, deep-tech, and
                    capital flow in the new world order.
                </motion.p>

                <motion.div
                    className="flex flex-wrap gap-8 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.7 }}
                >
                    <Link href="/journal" className="group relative px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full overflow-hidden transition-all hover:pr-14 active:scale-95">
                        <span className="relative z-10">Enter Archive</span>
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">→</span>
                    </Link>

                    <Link href="/about" className="text-white hover:text-[#00d1ff] font-bold text-xs uppercase tracking-widest transition-colors border-b border-white/20 pb-1">
                        Our Thesis
                    </Link>
                </motion.div>
            </motion.div>

            {/* Hero Bottom - Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold rotate-90 mb-8 origin-left">SCROLL</span>
                <div className="w-[1px] h-20 bg-gradient-to-t from-[#00d1ff] to-transparent animate-pulse" />
            </motion.div>
        </section>
    )
}
