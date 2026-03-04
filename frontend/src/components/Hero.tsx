"use client"
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with WebGL
const LiquidEther = dynamic(() => import('./LiquidEther'), { ssr: false })

// Word-by-word stagger animation
function StaggeredText({ text, delay = 0 }: { text: string; delay?: number }) {
    const words = text.split(' ')
    return (
        <>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                        duration: 0.8,
                        delay: delay + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                    {word}
                </motion.span>
            ))}
        </>
    )
}

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.5, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

    return (
        <section
            ref={containerRef}
            className="relative min-h-[105vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20"
        >
            {/* LiquidEther Fluid Background */}
            <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                <LiquidEther
                    colors={['#00d1ff', '#1152d4', '#87CEEB']}
                    mouseForce={15}
                    cursorSize={80}
                    isViscous
                    viscous={30}
                    iterationsViscous={16}
                    iterationsPoisson={16}
                    resolution={0.35}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.4}
                    autoIntensity={2.0}
                    takeoverDuration={0.3}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* Vignette overlay — subtle darkening at edges for depth */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(248,249,250,0.6) 100%)',
                }}
            />

            {/* Frosted glass text container */}
            <motion.div
                style={{ y, opacity, scale }}
                className="relative z-20 max-w-5xl w-full"
            >
                <div
                    style={{
                        background: 'rgba(248, 249, 250, 0.55)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        borderRadius: '32px',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        padding: '60px 48px 56px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                    }}
                >
                    {/* Staggered Headline */}
                    <h1
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(2.2rem, 7vw, 6rem)',
                            lineHeight: 1.05,
                            letterSpacing: '-0.02em',
                            color: '#000309',
                            fontWeight: 700,
                            marginBottom: '24px',
                        }}
                    >
                        <StaggeredText text="Perspectives on Finance" delay={0.2} />
                        <br />
                        <StaggeredText text="& Business" delay={0.7} />
                    </h1>

                    {/* Separator */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 100 }}
                        transition={{ duration: 2, delay: 1.2, ease: "circOut" }}
                        style={{
                            height: '1px',
                            background: 'linear-gradient(to right, transparent, #00d1ff, transparent)',
                            margin: '0 auto 32px',
                            opacity: 0.5,
                        }}
                    />

                    {/* Body Copy */}
                    <motion.p
                        style={{
                            fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)',
                            color: 'rgba(0, 3, 9, 0.55)',
                            maxWidth: '640px',
                            margin: '0 auto 40px',
                            lineHeight: 1.7,
                            fontFamily: 'var(--font-sans)',
                            fontWeight: 500,
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 1.0 }}
                    >
                        Deep-dive analysis of IPOs, M&amp;A deals, and market trends.
                        Thought-provoking insights for the contemporary leader navigating India&apos;s financial landscape.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        style={{
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap' as const,
                        }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link
                            href="/journal"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '14px 36px',
                                background: 'linear-gradient(135deg, #00d1ff, #00b8e6)',
                                color: '#000309',
                                fontWeight: 900,
                                fontSize: '11px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase' as const,
                                borderRadius: '100px',
                                textDecoration: 'none',
                                boxShadow: '0 6px 20px rgba(0, 209, 255, 0.35)',
                                transition: 'all 0.3s ease',
                                border: 'none',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 209, 255, 0.5)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 209, 255, 0.35)'
                            }}
                        >
                            Explore Articles
                        </Link>

                        <Link
                            href="/contact"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '14px 36px',
                                background: 'rgba(255, 255, 255, 0.3)',
                                color: '#000309',
                                fontWeight: 900,
                                fontSize: '11px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase' as const,
                                borderRadius: '100px',
                                textDecoration: 'none',
                                border: '1px solid rgba(0, 3, 9, 0.15)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.background = 'rgba(0, 3, 9, 0.05)'
                                e.currentTarget.style.borderColor = 'rgba(0, 3, 9, 0.3)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                                e.currentTarget.style.borderColor = 'rgba(0, 3, 9, 0.15)'
                            }}
                        >
                            Contact Us
                        </Link>
                    </motion.div>
                </div>
            </motion.div>

        </section>
    )
}
