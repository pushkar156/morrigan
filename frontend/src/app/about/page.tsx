"use client"

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MagneticButton } from '@/components/CustomCursor'

const LiquidEther = dynamic(() => import('@/components/LiquidEther'), { ssr: false })

function StaggeredText({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: delay + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-block', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </>
  )
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const team = [
  {
    name: 'Akshit Tyagi',
    role: 'Co-Founder',
    initials: '',
    color: '#1152d4',
    bio: 'Visionary leader with expertise in strategy and innovation.',
  },
  {
    name: 'Laksh Ranglani',
    role: 'Co-Founder & Role',
    initials: '',
    color: '#00d1ff',
    bio: 'Experienced analyst focused on market research and insights.',
  },
  {
    name: 'Srikrishna Ved Kodakalla',
    role: 'Co-Founder & Role',
    initials: '',
    color: '#1152d4',
    bio: 'strategist driving innovation and digital transformation.',
  },
]

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.7], [1, 0.5, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  return (
    <main className="bg-[#f8f9fa] relative overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[105vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20"
      >
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

        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(248,249,250,0.6) 100%)' }}
        />

        <motion.div style={{ y, opacity, scale }} className="relative z-20 max-w-5xl w-full">
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
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hero-badge"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                borderRadius: '100px', padding: '6px 16px',
                fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '28px',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d1ff', display: 'inline-block' }} />
              Our Story
            </motion.div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 7vw, 6rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: '#000309', fontWeight: 700, marginBottom: '24px' }}>
              <StaggeredText text="Intelligence deserves" delay={0.2} />
              <br />
              <span style={{ color: '#00d1ff' }}>
                <StaggeredText text="better storytelling." delay={0.7} />
              </span>
            </h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ duration: 2, delay: 1.2, ease: 'circOut' }}
              style={{ height: '1px', background: 'linear-gradient(to right, transparent, #00d1ff, transparent)', margin: '0 auto 32px', opacity: 0.5 }}
            />

            <motion.p
              style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)', color: 'rgba(0, 3, 9, 0.55)', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7, fontFamily: 'var(--font-sans)', fontWeight: 500 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.0 }}
            >
              Morrigan was built on a single conviction — that finance, strategy, and technology
              are too important to be left to jargon and gated paywalls. We write for the curious
              and the serious.
            </motion.p>

            <motion.div
              style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' as const }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <MagneticButton strength={0.4}>
                <Link
                  href="/journal"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 36px', background: 'linear-gradient(135deg, #00d1ff, #00b8e6)', color: '#000309', fontWeight: 900, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, borderRadius: '100px', textDecoration: 'none', boxShadow: '0 6px 20px rgba(0, 209, 255, 0.35)', transition: 'all 0.3s ease', border: 'none' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 209, 255, 0.5)' }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 209, 255, 0.35)' }}
                >
                  Explore Articles
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.4}>
                <Link
                  href="/contact"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 36px', background: 'rgba(255, 255, 255, 0.3)', color: '#000309', fontWeight: 900, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, borderRadius: '100px', textDecoration: 'none', border: '1px solid rgba(0, 3, 9, 0.15)', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(0, 3, 9, 0.05)'; e.currentTarget.style.borderColor = 'rgba(0, 3, 9, 0.3)' }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.borderColor = 'rgba(0, 3, 9, 0.15)' }}
                >
                  Contact Us
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MISSION
      ════════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-44 bg-[#f8f9fa]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <FadeUp className="lg:col-span-4" delay={0}>
              <p style={{ color: '#00d1ff', fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Our Mission
              </p>
              <div style={{ width: 48, height: 1, background: 'rgba(0,3,9,0.15)' }} />
            </FadeUp>

            <FadeUp className="lg:col-span-8" delay={0.15}>
              <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.01em', color: '#000309' }}>
                &ldquo;We restore depth to discourse — building a publication where rigour and{' '}
                <em style={{ color: '#1152d4' }}>readability</em> are never in conflict.&rdquo;
              </blockquote>
              <p style={{ marginTop: '32px', fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '560px', color: 'rgba(0,3,9,0.55)' }}>
                Morrigan sits at the intersection of institutional research quality and modern
                media accessibility. Our editorial team draws on real-world experience, academic
                methodology, and a genuine belief that ideas shape markets — not the other way around.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOUNDERS — 3 col centred
      ════════════════════════════════════════════════════════════ */}
      <section className="py-32 md:py-44" style={{ background: 'rgba(0,0,0,0.015)' }}>
        <div className="container-custom">
          <FadeUp>
            <p style={{ color: '#00d1ff', fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '12px' }}>
              The Founders
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.025em', color: '#000309', marginBottom: '64px', lineHeight: 1.1 }}>
              The minds behind<br />the analysis.
            </h2>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {team.map((member, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ cursor: 'default' }}>
                  <div
                    style={{ width: '100%', aspectRatio: '1', borderRadius: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,3,9,0.04)', border: '1px solid rgba(0,3,9,0.07)', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, border-color 0.4s ease' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      const el = e.currentTarget
                      el.style.transform = 'translateY(-8px)'
                      el.style.background = member.color
                      el.style.borderColor = 'transparent'
                      const span = el.querySelector('span') as HTMLElement
                      if (span) span.style.color = member.color === '#000309' ? '#f8f9fa' : '#fff'
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      const el = e.currentTarget
                      el.style.transform = 'translateY(0)'
                      el.style.background = 'rgba(0,3,9,0.04)'
                      el.style.borderColor = 'rgba(0,3,9,0.07)'
                      const span = el.querySelector('span') as HTMLElement
                      if (span) span.style.color = member.color
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', color: member.color, transition: 'color 0.4s ease' }}>
                      {member.initials}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#000309', marginBottom: '4px' }}>
                    {member.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00d1ff', marginBottom: '14px' }}>
                    {member.role}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', lineHeight: 1.65, color: 'rgba(0,3,9,0.5)' }}>
                    {member.bio}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MARQUEE
      ════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ borderTop: '1px solid rgba(0,3,9,0.07)', overflow: 'hidden' }}>
        <FadeUp>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-sans)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,3,9,0.3)', marginBottom: '40px' }}>
            What we cover
          </p>
        </FadeUp>
        <div style={{ overflow: 'hidden' }}>
          <div className="animate-marquee" style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', animationDuration: '22s' }}>
            {Array(3).fill(['Back to Basics', 'Strategy Series', 'Market Insights', 'Financial Literacy', 'Corporate Restructuring']).flat().map((label, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.03em', padding: '0 32px', color: i % 2 === 0 ? 'rgba(0,3,9,0.07)' : 'rgba(0,3,9,0.12)' }}>
                  {label}
                </span>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(0,209,255,0.35)', flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
