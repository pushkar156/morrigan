"use client"

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FloatingOrb, ParticleField } from '@/components/HeroVFX'

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
  const mx = useMotionValue(0); const my = useMotionValue(0)
  const px = useSpring(useTransform(mx, [0, 1], [-22, 22]), { stiffness: 55, damping: 18 })
  const py = useSpring(useTransform(my, [0, 1], [-12, 12]), { stiffness: 55, damping: 18 })

  const handleHeaderMouse = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return
    const r = heroRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  return (
    <main className="bg-[#f8f9fa] relative overflow-x-hidden">

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeaderMouse}
        className="relative overflow-hidden cursor-default"
        style={{
          background: '#254665',
          padding: '180px 2rem 90px',
        }}
      >
        <ParticleField containerRef={heroRef as any} />

        <FloatingOrb delay={0} size={320} x="5%" y="10%" color="rgba(0,209,255,0.1)" />
        <FloatingOrb delay={2} size={200} x="70%" y="5%" color="rgba(17,82,212,0.13)" />
        <FloatingOrb delay={1} size={160} x="48%" y="52%" color="rgba(0,209,255,0.07)" />
        <FloatingOrb delay={3.5} size={110} x="88%" y="42%" color="rgba(135,206,235,0.09)" />

        <motion.div style={{ x: px, y: py }} className="about-watermark">STORY</motion.div>

        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(0,209,255,0.3), transparent)',
            zIndex: 1
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center gap-4"
        >
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.35em',
            color: '#00d1ff',
            textTransform: 'uppercase'
          }}>
            OUR STORY
          </span>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            margin: '0 0 8px 0'
          }}>
            <StaggeredText text="Intelligence deserves" delay={0.2} />
            <br />
            <span style={{ color: '#00d1ff' }}>
              <StaggeredText text="better storytelling." delay={0.7} />
            </span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '480px',
            lineHeight: 1.65,
            margin: '0 auto'
          }}>
            Morrigan was built on a single conviction — that finance, strategy, and technology
            are too important to be left to jargon and gated paywalls. We write for the curious
            and the serious.
          </p>
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

      <style jsx global>{`
        .about-watermark {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
            font-family: var(--font-serif); font-size: clamp(60px, 17vw, 200px);
            font-weight: 900; color: transparent;
            -webkit-text-stroke: 1px rgba(255,255,255,0.04);
            white-space: nowrap; pointer-events: none; user-select: none;
            letter-spacing: -0.04em; z-index: 0;
        }
      `}</style>

    </main>
  )
}
