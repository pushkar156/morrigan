"use client"

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FloatingOrb, ParticleField } from '@/components/HeroVFX'



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

const values = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Independence',
    desc: 'No gatekeepers, no conflicts of interest. We answer only to intellectual honesty and our readers.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Rigour',
    desc: 'Every claim is sourced, every model stress-tested. We hold our analysis to institutional standards.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: 'Accessibility',
    desc: 'Complexity without confusion. We make institutional-grade research readable for everyone.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Depth',
    desc: 'Surface-level takes are everywhere. We go deeper — connecting dots others overlook.',
  },
]

const team = [
  {
    name: 'Akshit Tyagi',
    role: 'Co-Founder',
    image: '/images/AKSHIT.jpg',
    bio: 'Visionary leader with expertise in strategy and innovation.',
  },
  {
    name: 'Laksh Ranglani',
    role: 'Co-Founder',
    image: '/images/LAKSH.jpg',
    bio: 'Experienced analyst focused on market research and insights.',
  },
  {
    name: 'Srikrishna Ved Kodakalla',
    role: 'Co-Founder',
    image: '/images/SHRIKRISHNA.jpg',
    bio: 'strategist driving innovation and digital transformation.',
  },
]

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0); const my = useMotionValue(0)
  const px = useSpring(useTransform(mx, [0, 1], [-22, 22]), { stiffness: 55, damping: 18 })
  const py = useSpring(useTransform(my, [0, 1], [-12, 12]), { stiffness: 55, damping: 18 })

  const handleHeaderMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return
    const r = heroRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  return (
    <main className="ab-page">

      {/* ════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        onMouseMove={handleHeaderMouse}
        className="ab-header"
      >
        <ParticleField containerRef={heroRef as any} />

        <FloatingOrb delay={0} size={320} x="5%" y="10%" color="rgba(0,209,255,0.1)" />
        <FloatingOrb delay={2} size={200} x="70%" y="5%" color="rgba(17,82,212,0.13)" />
        <FloatingOrb delay={1} size={160} x="48%" y="52%" color="rgba(0,209,255,0.07)" />
        <FloatingOrb delay={3.5} size={110} x="88%" y="42%" color="rgba(135,206,235,0.09)" />

        <motion.div style={{ x: px, y: py }} className="ab-watermark">STORY</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="ab-header-inner"
        >
          <motion.span className="ab-eyebrow"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="ab-live-dot" />
            OUR STORY
          </motion.span>

          <h1 className="ab-title">
            {['About', 'Us'].map((word, i) => (
              <motion.span key={word}
                initial={{ opacity: 0, y: 70, filter: 'blur(12px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >{word}</motion.span>
            ))}
          </h1>

          <motion.p className="ab-subtitle"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            Intelligence deserves better storytelling. Morrigan was built on a single conviction — that finance, strategy, and technology are too important to be left to jargon and gated paywalls. We write for the curious and the serious.
          </motion.p>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          MISSION
      ════════════════════════════════════════════════════════════ */}
      <section className="ab-mission">
        <div className="container-custom">
          <FadeUp>
            <p className="ab-section-eyebrow">Our Mission</p>
            <div className="ab-section-rule" />
          </FadeUp>

          <div className="ab-mission-grid">
            <FadeUp className="ab-mission-img-col" delay={0.1}>
              <div className="ab-mission-img-wrap">
                <img src="/images/mission.png" alt="Market intelligence" className="ab-mission-img" />
              </div>
            </FadeUp>

            <FadeUp className="ab-mission-text-col" delay={0.2}>
              <blockquote className="ab-mission-quote">
                &ldquo;We restore depth to discourse — building a publication where rigour and{' '}
                <em className="ab-mission-em">readability</em> are never in conflict.&rdquo;
              </blockquote>
              <p className="ab-mission-body">
                Morrigan sits at the intersection of institutional research quality and modern
                media accessibility. Our editorial team draws on real-world experience, academic
                methodology, and a genuine belief that ideas shape markets — not the other way around.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          VALUES
      ════════════════════════════════════════════════════════════ */}
      <section className="ab-values">
        <div className="container-custom">
          <FadeUp>
            <p className="ab-section-eyebrow">What Drives Us</p>
            <h2 className="ab-values-heading">Built on conviction,<br />not convention.</h2>
          </FadeUp>

          <div className="ab-values-grid">
            {values.map((v, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="ab-value-card">
                  <div className="ab-value-icon">{v.icon}</div>
                  <h3 className="ab-value-title">{v.title}</h3>
                  <p className="ab-value-desc">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOUNDERS — 3 col centred
      ════════════════════════════════════════════════════════════ */}
      <section className="ab-founders">
        <div className="container-custom">
          <FadeUp>
            <p className="ab-section-eyebrow">The Founders</p>
            <h2 className="ab-founders-heading">
              The minds behind<br />the analysis.
            </h2>
          </FadeUp>

          <div className="ab-founders-grid">
            {team.map((member, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="ab-founder-card">
                  <div className="ab-founder-avatar">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="ab-founder-img"
                    />
                  </div>
                  <h3 className="ab-founder-name">{member.name}</h3>
                  <p className="ab-founder-role">{member.role}</p>
                  <p className="ab-founder-bio">{member.bio}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          MARQUEE
      ════════════════════════════════════════════════════════════ */}
      <section className="ab-marquee-section">
        <FadeUp>
          <p className="ab-marquee-label">What we cover</p>
        </FadeUp>
        <div className="ab-marquee-track-wrap">
          <div className="animate-marquee ab-marquee-track">
            {Array(3).fill(['Back to Basics', 'Strategy Series', 'Market Insights', 'Financial Literacy', 'Corporate Restructuring']).flat().map((label, i) => (
              <span key={i} className="ab-marquee-item">
                <span className={`ab-marquee-word ${i % 2 === 0 ? 'alt' : ''}`}>
                  {label}
                </span>
                <span className="ab-marquee-dot" />
              </span>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* ── About Page ── */

        .ab-page {
            min-height: 100vh;
            background: #f8f9fa;
            padding-top: 100px;
            overflow-x: hidden;
        }

        /* ══ Header ══ */
        .ab-header {
            position: relative;
            background: #254665;
            padding: 80px 2rem 90px;
            overflow: hidden;
            cursor: default;
        }

        .ab-header::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
            background-size: 48px 48px;
            pointer-events: none;
            z-index: 0;
            animation: ab-grid-move 30s linear infinite;
        }

        @keyframes ab-grid-move {
            0% { background-position: 0 0; }
            100% { background-position: 48px 48px; }
        }

        .ab-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(0,209,255,0.3), transparent);
        }

        .ab-watermark {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
            font-family: var(--font-serif); font-size: clamp(60px, 17vw, 200px);
            font-weight: 900; color: transparent;
            -webkit-text-stroke: 1px rgba(255,255,255,0.04);
            white-space: nowrap; pointer-events: none; user-select: none;
            letter-spacing: -0.04em; z-index: 0;
        }

        .ab-header-inner {
            position: relative; z-index: 2; max-width: 1400px; margin: 0 auto;
            display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;
        }

        .ab-eyebrow {
            display: flex; align-items: center; justify-content: center; gap: 10px;
            font-family: var(--font-sans); font-size: 0.62rem; font-weight: 700;
            letter-spacing: 0.35em; color: #00d1ff; text-transform: uppercase;
        }

        .ab-live-dot {
            width: 7px; height: 7px; border-radius: 50%; background: #00d1ff;
            animation: ab-pulse 2s ease-out infinite;
        }
        @keyframes ab-pulse {
            0%   { box-shadow: 0 0 0 0 rgba(0,209,255,0.6); }
            70%  { box-shadow: 0 0 0 8px rgba(0,209,255,0); }
            100% { box-shadow: 0 0 0 0 rgba(0,209,255,0); }
        }

        .ab-title {
            font-family: var(--font-serif);
            font-size: clamp(3rem, 8vw, 6.5rem);
            font-weight: 700; color: #fff; line-height: 1;
            letter-spacing: -0.02em; margin: 0;
        }

        .ab-subtitle {
            font-family: var(--font-sans); font-size: 0.95rem;
            color: rgba(255,255,255,0.45); max-width: 500px; line-height: 1.65; margin: 0;
        }

        /* ══ Mission ══ */
        .ab-mission {
            padding: 96px 0;
            background: #f8f9fa;
        }
        @media (max-width: 768px) {
            .ab-mission { padding: 64px 0; }
        }

        .ab-mission-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: center;
            margin-top: 40px;
        }
        @media (max-width: 1024px) {
            .ab-mission-grid { grid-template-columns: 1fr; gap: 32px; }
        }

        .ab-section-eyebrow {
            color: #00d1ff;
            font-size: 11px;
            font-family: var(--font-sans);
            font-weight: 700;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            margin-bottom: 16px;
        }

        .ab-section-rule {
            width: 48px; height: 1px;
            background: rgba(0,3,9,0.15);
        }

        .ab-mission-img-wrap {
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(0,3,9,0.07);
            background: rgba(0,3,9,0.03);
        }

        .ab-mission-img {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-mission-img-wrap:hover .ab-mission-img {
            transform: scale(1.03);
        }

        .ab-mission-text-col {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .ab-mission-quote {
            font-family: var(--font-serif);
            font-size: clamp(1.6rem, 3vw, 2.8rem);
            line-height: 1.2;
            font-weight: 700;
            letter-spacing: -0.01em;
            color: #000309;
            margin: 0;
            padding: 0;
            border: none;
        }

        .ab-mission-em {
            color: #1152d4;
            font-style: italic;
        }

        .ab-mission-body {
            margin-top: 32px;
            font-family: var(--font-sans);
            font-size: 1rem;
            line-height: 1.75;
            max-width: 560px;
            color: rgba(0,3,9,0.55);
        }

        /* ══ Values ══ */
        .ab-values {
            padding: 96px 0;
            background: #f8f9fa;
            border-top: 1px solid rgba(0,3,9,0.06);
        }
        @media (max-width: 768px) {
            .ab-values { padding: 64px 0; }
        }

        .ab-values-heading {
            font-family: var(--font-serif);
            font-size: clamp(1.8rem, 4vw, 3rem);
            font-weight: 900;
            letter-spacing: -0.025em;
            color: #000309;
            margin-bottom: 48px;
            line-height: 1.15;
        }

        .ab-values-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
        }
        @media (max-width: 1024px) {
            .ab-values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
            .ab-values-grid { grid-template-columns: 1fr; }
        }

        .ab-value-card {
            padding: 32px 28px;
            background: #fff;
            border: 1px solid rgba(0,3,9,0.06);
            border-radius: 18px;
            transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease, border-color 0.3s;
        }
        .ab-value-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 48px rgba(0,0,0,0.08);
            border-color: rgba(0,209,255,0.2);
        }

        .ab-value-icon {
            width: 48px; height: 48px;
            border-radius: 14px;
            background: rgba(0,209,255,0.06);
            border: 1px solid rgba(0,209,255,0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #00d1ff;
            margin-bottom: 20px;
            transition: background 0.3s, border-color 0.3s;
        }
        .ab-value-card:hover .ab-value-icon {
            background: rgba(0,209,255,0.1);
            border-color: rgba(0,209,255,0.25);
        }

        .ab-value-title {
            font-family: var(--font-serif);
            font-size: 1.1rem;
            font-weight: 700;
            color: #000309;
            margin-bottom: 10px;
            letter-spacing: -0.01em;
        }

        .ab-value-desc {
            font-family: var(--font-sans);
            font-size: 0.82rem;
            line-height: 1.65;
            color: rgba(0,3,9,0.5);
        }

        /* ══ Founders ══ */
        .ab-founders {
            padding: 96px 0;
            background: rgba(0,0,0,0.015);
        }
        @media (max-width: 768px) {
            .ab-founders { padding: 64px 0; }
        }

        .ab-founders-heading {
            font-family: var(--font-serif);
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 900;
            letter-spacing: -0.025em;
            color: #000309;
            margin-bottom: 48px;
            line-height: 1.1;
        }

        .ab-founders-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            max-width: 900px;
            margin: 0 auto;
        }
        @media (max-width: 768px) {
            .ab-founders-grid { grid-template-columns: 1fr; max-width: 320px; }
        }

        .ab-founder-card {
            cursor: default;
        }

        .ab-founder-avatar {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 20px;
            margin-bottom: 24px;
            overflow: hidden;
            background: rgba(0,3,9,0.04);
            border: 1px solid rgba(0,3,9,0.07);
            transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.4s ease;
        }
        .ab-founder-avatar:hover {
            transform: translateY(-6px);
            border-color: rgba(0,209,255,0.3);
        }

        .ab-founder-img {
            width: 100%; height: 100%;
            object-fit: cover;
            transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .ab-founder-avatar:hover .ab-founder-img {
            transform: scale(1.05);
        }

        .ab-founder-name {
            font-family: var(--font-serif);
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: -0.01em;
            color: #000309;
            margin-bottom: 4px;
        }

        .ab-founder-role {
            font-family: var(--font-sans);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #00d1ff;
            margin-bottom: 14px;
        }

        .ab-founder-bio {
            font-family: var(--font-sans);
            font-size: 0.85rem;
            line-height: 1.65;
            color: rgba(0,3,9,0.5);
        }

        /* ══ Marquee ══ */
        .ab-marquee-section {
            padding: 96px 0;
            border-top: 1px solid rgba(0,3,9,0.07);
            overflow: hidden;
        }

        .ab-marquee-label {
            text-align: center;
            font-family: var(--font-sans);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: rgba(0,3,9,0.3);
            margin-bottom: 40px;
        }

        .ab-marquee-track-wrap {
            overflow: hidden;
        }

        .ab-marquee-track {
            display: flex;
            gap: 0;
            white-space: nowrap;
            animation-duration: 22s;
        }

        .ab-marquee-item {
            display: inline-flex;
            align-items: center;
        }

        .ab-marquee-word {
            font-family: var(--font-serif);
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 900;
            letter-spacing: -0.03em;
            padding: 0 32px;
            color: rgba(0,3,9,0.12);
        }

        .ab-marquee-word.alt {
            color: rgba(0,3,9,0.07);
        }

        .ab-marquee-dot {
            width: 10px; height: 10px;
            border-radius: 50%;
            background: rgba(0,209,255,0.35);
            flex-shrink: 0;
        }

        @media (max-width: 640px) {
            .ab-header { padding: 60px 1.5rem 70px; }
        }
      `}</style>

    </main>
  )
}
