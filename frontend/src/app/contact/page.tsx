"use client"
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence, useTransform } from 'framer-motion'

/* ── Floating ambient orb ── */
function FloatingOrb({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) {
    return (
        <motion.div
            style={{
                position: 'absolute', left: x, top: y, width: size, height: size,
                borderRadius: '50%', background: color, filter: `blur(${size * 0.45}px)`,
                pointerEvents: 'none', zIndex: 0,
            }}
            animate={{ y: [0, -32, 0, 22, 0], x: [0, 14, -10, 6, 0], scale: [1, 1.09, 0.94, 1.05, 1] }}
            transition={{ duration: 9 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
        />
    )
}

/* ── Particle canvas that follows cursor in header ── */
function ParticleField({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particles = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[]>([])
    const mouse = useRef({ x: -999, y: -999 })
    const raf = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return
        const ctx = canvas.getContext('2d')!

        const resize = () => {
            canvas.width = container.offsetWidth
            canvas.height = container.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const onMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
            for (let i = 0; i < 3; i++) {
                particles.current.push({
                    x: mouse.current.x + (Math.random() - 0.5) * 20,
                    y: mouse.current.y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: -Math.random() * 2 - 0.5,
                    life: 1, maxLife: 0.6 + Math.random() * 0.8,
                })
            }
        }
        container.addEventListener('mousemove', onMove)

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.current = particles.current.filter(p => p.life > 0)
            for (const p of particles.current) {
                p.x += p.vx; p.y += p.vy
                p.vy -= 0.03
                p.life -= 0.018 / p.maxLife
                const alpha = Math.max(0, p.life)
                const size = alpha * 3.5
                ctx.beginPath()
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(0, 209, 255, ${alpha * 0.7})`
                ctx.shadowBlur = 8
                ctx.shadowColor = '#00d1ff'
                ctx.fill()
            }
            raf.current = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            window.removeEventListener('resize', resize)
            container.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(raf.current)
        }
    }, [containerRef])

    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />
}

/* ── 3D tilt info card ── */
function TiltCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const rotX = useMotionValue(0)
    const rotY = useMotionValue(0)
    const sRotX = useSpring(rotX, { stiffness: 220, damping: 22 })
    const sRotY = useSpring(rotY, { stiffness: 220, damping: 22 })
    const [hovered, setHovered] = useState(false)

    const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const r = ref.current.getBoundingClientRect()
        rotX.set(-((e.clientY - r.top) / r.height - 0.5) * 16)
        rotY.set(((e.clientX - r.left) / r.width - 0.5) * 16)
    }, [rotX, rotY])

    const onLeave = useCallback(() => {
        rotX.set(0); rotY.set(0); setHovered(false)
    }, [rotX, rotY])

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={onLeave}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d', perspective: 600 }}
        >
            <motion.div
                className="ct-info-item"
                animate={{
                    boxShadow: hovered
                        ? '0 20px 60px rgba(0,209,255,0.18), 0 0 0 1px rgba(0,209,255,0.25)'
                        : '0 4px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)',
                }}
                transition={{ duration: 0.35 }}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}

/* ── Magnetic button ── */
function MagBtn({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
    const ref = useRef<HTMLButtonElement>(null)
    const x = useMotionValue(0); const y = useMotionValue(0)
    const sx = useSpring(x, { stiffness: 320, damping: 22 })
    const sy = useSpring(y, { stiffness: 320, damping: 22 })

    return (
        <motion.button ref={ref}
            style={{ x: sx, y: sy }}
            onMouseMove={e => {
                if (!ref.current) return
                const r = ref.current.getBoundingClientRect()
                x.set((e.clientX - (r.left + r.width / 2)) * 0.38)
                y.set((e.clientY - (r.top + r.height / 2)) * 0.38)
            }}
            onMouseLeave={() => { x.set(0); y.set(0) }}
            onClick={onClick}
            whileTap={{ scale: 0.96 }}
            className={className}
        >{children}</motion.button>
    )
}

/* ── Animated input field ── */
function Field({ label, type = 'text', placeholder, value, onChange, required, textarea }: {
    label: string; type?: string; placeholder: string;
    value: string; onChange: (v: string) => void; required?: boolean; textarea?: boolean
}) {
    const [focused, setFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value)
        setHasValue(e.target.value.length > 0)
    }

    const shared = {
        value, placeholder: focused ? placeholder : '',
        required,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
        onChange: handleChange,
        className: 'ct-field-input',
    }

    return (
        <div className="ct-field">
            <motion.label
                className="ct-field-label"
                animate={{
                    y: focused || hasValue ? -24 : 0,
                    scale: focused || hasValue ? 0.82 : 1,
                    color: focused ? '#00d1ff' : 'rgba(0,0,0,0.4)',
                }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
                {label}
            </motion.label>
            <div className={`ct-field-wrap ${focused ? 'focused' : ''} ${hasValue ? 'has-value' : ''}`}>
                {textarea
                    ? <textarea {...shared} rows={5} style={{ resize: 'none' }} />
                    : <input {...shared} type={type} />
                }
                {/* Bottom bar animation */}
                <motion.div
                    className="ct-field-bar"
                    animate={{ scaleX: focused ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>
        </div>
    )
}

/* ── Glitchy counter for stats ── */
function GlitchNumber({ value, suffix = '' }: { value: number | string; suffix?: string }) {
    const [display, setDisplay] = useState('--')
    useEffect(() => {
        const chars = '0123456789'
        let iterations = 0
        const target = String(value)
        const interval = setInterval(() => {
            setDisplay(
                target.split('').map((c, i) =>
                    iterations > i * 2 ? c : chars[Math.floor(Math.random() * chars.length)]
                ).join('')
            )
            iterations++
            if (iterations >= target.length * 2 + 4) clearInterval(interval)
        }, 60)
        return () => clearInterval(interval)
    }, [value])
    return <>{display}{suffix}</>
}

export default function ContactPage() {
    const headerRef = useRef<HTMLDivElement>(null)
    const mx = useMotionValue(0); const my = useMotionValue(0)
    const px = useSpring(useTransform(mx, [0, 1], [-22, 22]), { stiffness: 55, damping: 18 })
    const py = useSpring(useTransform(my, [0, 1], [-12, 12]), { stiffness: 55, damping: 18 })

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
    const [sendProgress, setSendProgress] = useState(0)

    const handleHeaderMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!headerRef.current) return
        const r = headerRef.current.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
    }

    const handleSubmit = () => {
        if (!form.name || !form.email || !form.subject || !form.message) return
        setStatus('sending')
        setSendProgress(0)
        const start = Date.now()
        const tick = setInterval(() => {
            const p = Math.min((Date.now() - start) / 1600, 1)
            setSendProgress(p)
            if (p >= 1) { clearInterval(tick); setStatus('sent') }
        }, 16)
    }

    const contactItems = [
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 4l10 8 10-8" />
                </svg>
            ),
            label: 'Email', value: 'the.morrigan.news@gmail.com',
            href: 'mailto:the.morrigan.news@gmail.com', stat: null, statLabel: null,
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
            ),
            label: 'Location', value: 'Bangalore, India',
            href: null, stat: 'IN', statLabel: 'Region',
        },
        {
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
            label: 'LinkedIn', value: 'The Morrigan',
            href: 'https://www.linkedin.com/company/education-the-morrigan', stat: null, statLabel: null,
        },
    ]

    return (
        <main className="ct-page">

            {/* ══ HEADER ══ */}
            <div ref={headerRef} onMouseMove={handleHeaderMouse} className="ct-header">
                <ParticleField containerRef={headerRef} />

                <FloatingOrb delay={0}   size={320} x="5%"  y="10%" color="rgba(0,209,255,0.1)" />
                <FloatingOrb delay={2}   size={200} x="70%" y="5%"  color="rgba(17,82,212,0.13)" />
                <FloatingOrb delay={1}   size={160} x="48%" y="52%" color="rgba(0,209,255,0.07)" />
                <FloatingOrb delay={3.5} size={110} x="88%" y="42%" color="rgba(135,206,235,0.09)" />

                {/* Parallax watermark */}
                <motion.div style={{ x: px, y: py }} className="ct-watermark">CONNECT</motion.div>

                <motion.div className="ct-header-inner"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.div className="ct-eyebrow"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <span className="ct-live-dot" />
                        GET IN TOUCH
                    </motion.div>

                    <h1 className="ct-title">
                        {['Contact', 'Us'].map((word, i) => (
                            <motion.span key={word}
                                initial={{ opacity: 0, y: 70, filter: 'blur(12px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                                style={{ display: 'inline-block', marginRight: '0.3em' }}
                            >{word}</motion.span>
                        ))}
                    </h1>

                    <motion.p className="ct-subtitle"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.7 }}
                    >
                        Have a question or want to work together? We&apos;d love to hear from you.
                        Send us a message and we&apos;ll respond as soon as possible.
                    </motion.p>

                    {/* Animated stats strip */}
                    <motion.div className="ct-stats"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.85, duration: 0.6 }}
                    >
                        {[
                            { num: '100', suf: '%', label: 'Independent' },
                            { num: '3', suf: '+', label: 'Ways to Reach' },
                        ].map((s, i) => (
                            <motion.div key={s.label} className="ct-stat"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.95 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <span className="ct-stat-num"><GlitchNumber value={s.num} suffix={s.suf} /></span>
                                <span className="ct-stat-label">{s.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                <div className="ct-header-line" />
            </div>

            {/* ══ BODY ══ */}
            <div className="ct-body container-custom">

                {/* Left — info */}
                <motion.div className="ct-info-col"
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="ct-info-header">
                        <h2 className="ct-col-heading">Contact Information</h2>
                        <p className="ct-col-sub">Reach out through any channel below — we&apos;ll get back to you promptly.</p>
                    </div>

                    <div className="ct-info-items">
                        {contactItems.map((item, i) => (
                            <TiltCard key={item.label} delay={0.35 + i * 0.1}>
                                <div className="ct-info-icon-wrap">
                                    <div className="ct-info-icon">{item.icon}</div>
                                    <div className="ct-info-icon-glow" />
                                </div>
                                <div className="ct-info-text">
                                    <div className="ct-info-label">{item.label}</div>
                                    {item.href
                                        ? <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="ct-info-value link">{item.value}</a>
                                        : <span className="ct-info-value">{item.value}</span>
                                    }
                                </div>
                                {item.stat && <div className="ct-info-badge"><span className="ct-info-badge-num">{item.stat}</span><span className="ct-info-badge-lbl">{item.statLabel}</span></div>}




                            </TiltCard>
                        ))}
                    </div>

                    <motion.blockquote className="ct-quote"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                    >
                        <span className="ct-quote-mark">&ldquo;</span>
                        Restoring depth to financial discourse.
                        <span className="ct-quote-mark">&rdquo;</span>
                    </motion.blockquote>
                </motion.div>

                {/* Right — form */}
                <motion.div className="ct-form-col"
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Form header with animated underline */}
                    <div className="ct-form-head">
                        <h2 className="ct-col-heading">Send Us a Message</h2>
                        <motion.div className="ct-form-head-line"
                            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {status === 'sent' ? (
                            <motion.div key="success" className="ct-success"
                                initial={{ opacity: 0, scale: 0.88 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* Ripple rings */}
                                <div className="ct-success-rings">
                                    {[0, 1, 2].map(i => (
                                        <motion.div key={i} className="ct-success-ring"
                                            initial={{ scale: 0.5, opacity: 0.8 }}
                                            animate={{ scale: 2.5, opacity: 0 }}
                                            transition={{ duration: 1.4, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
                                        />
                                    ))}
                                    <motion.div className="ct-success-icon"
                                        initial={{ scale: 0, rotate: -30 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.15, type: 'spring', stiffness: 280, damping: 18 }}
                                    >
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </motion.div>
                                </div>
                                <motion.h3 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>Message Sent!</motion.h3>
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                                    Thanks for reaching out. We&apos;ll get back to you shortly.
                                </motion.p>
                                <motion.button className="ct-reset-btn"
                                    onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setStatus('idle') }}
                                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                                >
                                    Send another message
                                </motion.button>
                            </motion.div>
                        ) : (
                            <motion.div key="form" className="ct-form"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            >
                                <div className="ct-form-row">
                                    <Field label="Your Name" placeholder="John Doe" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
                                    <Field label="Your Email" type="email" placeholder="john@example.com" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} required />
                                </div>
                                <Field label="Subject" placeholder="What's this about?" value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} required />
                                <Field label="Message" placeholder="Tell us more about your inquiry…" value={form.message} onChange={v => setForm(f => ({ ...f, message: v }))} required textarea />

                                <MagBtn onClick={handleSubmit} className="ct-submit-btn">
                                    <AnimatePresence mode="wait">
                                        {status === 'sending' ? (
                                            <motion.span key="sending" className="ct-btn-inner"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            >
                                                <svg className="ct-spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                                                </svg>
                                                Sending…
                                            </motion.span>
                                        ) : (
                                            <motion.span key="idle" className="ct-btn-inner"
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                            >
                                                Send Message
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {/* Progress bar inside button */}
                                    {status === 'sending' && (
                                        <motion.div className="ct-btn-progress" style={{ scaleX: sendProgress, originX: 0 }} />
                                    )}
                                </MagBtn>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <style jsx global>{`
                .ct-page {
                    min-height: 100vh; background: #f2f4f7;
                    padding-top: 100px; overflow-x: hidden;
                }

                /* ══ Header ══ */
                .ct-header {
                    position: relative; background: #000309;
                    padding: 80px 2rem 110px; overflow: hidden; cursor: default;
                }
                .ct-header::before {
                    content: ''; position: absolute; inset: 0;
                    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
                    background-size: 48px 48px; pointer-events: none; z-index: 0;
                }
                .ct-header-line {
                    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(to right, transparent, rgba(0,209,255,0.55), transparent);
                }
                .ct-watermark {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
                    font-family: var(--font-serif); font-size: clamp(60px, 17vw, 200px);
                    font-weight: 900; color: transparent;
                    -webkit-text-stroke: 1px rgba(255,255,255,0.04);
                    white-space: nowrap; pointer-events: none; user-select: none;
                    letter-spacing: -0.04em; z-index: 0;
                }
                .ct-header-inner {
                    position: relative; z-index: 2; max-width: 1400px; margin: 0 auto;
                    display: flex; flex-direction: column; align-items: center; text-align: center; gap: 22px;
                }
                .ct-eyebrow {
                    display: flex; align-items: center; gap: 10px;
                    font-family: var(--font-sans); font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.35em; color: #00d1ff; text-transform: uppercase;
                }
                .ct-live-dot {
                    width: 7px; height: 7px; border-radius: 50%; background: #00d1ff;
                    animation: ct-pulse 2s ease-out infinite;
                }
                @keyframes ct-pulse {
                    0%   { box-shadow: 0 0 0 0 rgba(0,209,255,0.6); }
                    70%  { box-shadow: 0 0 0 8px rgba(0,209,255,0); }
                    100% { box-shadow: 0 0 0 0 rgba(0,209,255,0); }
                }
                .ct-title {
                    font-family: var(--font-serif); font-size: clamp(3rem, 9vw, 7rem);
                    font-weight: 700; color: #fff; line-height: 1; letter-spacing: -0.03em; margin: 0;
                }
                .ct-subtitle {
                    font-family: var(--font-sans); font-size: 0.95rem;
                    color: rgba(255,255,255,0.4); max-width: 500px; line-height: 1.7; margin: 0;
                }
                .ct-stats {
                    display: flex; gap: 0; margin-top: 8px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 100px; backdrop-filter: blur(10px);
                    overflow: hidden;
                }
                .ct-stat {
                    display: flex; flex-direction: column; align-items: center; gap: 3px;
                    padding: 18px 36px;
                    border-right: 1px solid rgba(255,255,255,0.07);
                }
                .ct-stat:last-child { border-right: none; }
                .ct-stat-num {
                    font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700;
                    color: #00d1ff; line-height: 1; letter-spacing: -0.02em;
                }
                .ct-stat-label {
                    font-family: var(--font-sans); font-size: 0.58rem; font-weight: 600;
                    letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.3);
                }

                /* ══ Body ══ */
                .ct-body {
                    display: grid; grid-template-columns: 1fr 1.65fr;
                    gap: 64px; padding-top: 72px; padding-bottom: 100px; align-items: start;
                }
                @media (max-width: 920px) { .ct-body { grid-template-columns: 1fr; gap: 44px; } }

                /* ══ Info col ══ */
                .ct-info-col { display: flex; flex-direction: column; gap: 24px; }
                .ct-info-header { display: flex; flex-direction: column; gap: 10px; }
                .ct-col-heading {
                    font-family: var(--font-serif); font-size: 1.65rem; font-weight: 700;
                    color: #000309; margin: 0; letter-spacing: -0.015em;
                }
                .ct-col-sub {
                    font-family: var(--font-sans); font-size: 0.875rem;
                    color: rgba(0,0,0,0.45); line-height: 1.7; margin: 0;
                }
                .ct-info-items { display: flex; flex-direction: column; gap: 14px; }
                .ct-info-item {
                    display: flex; align-items: center; gap: 16px;
                    padding: 18px 20px; background: #fff; border-radius: 16px;
                    transition: background 0.3s;
                }
                .ct-info-item:hover { background: #fafcff; }
                .ct-info-icon-wrap { position: relative; flex-shrink: 0; }
                .ct-info-icon {
                    width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
                    background: rgba(0,209,255,0.08); border: 1px solid rgba(0,209,255,0.15);
                    display: flex; align-items: center; justify-content: center; color: #00d1ff;
                    position: relative; z-index: 1;
                    transition: background 0.3s, border-color 0.3s;
                }
                .ct-info-item:hover .ct-info-icon {
                    background: rgba(0,209,255,0.14); border-color: rgba(0,209,255,0.3);
                }
                .ct-info-icon-glow {
                    position: absolute; inset: -4px; border-radius: 16px;
                    background: rgba(0,209,255,0.12); filter: blur(8px);
                    opacity: 0; transition: opacity 0.3s; z-index: 0;
                }
                .ct-info-item:hover .ct-info-icon-glow { opacity: 1; }
                .ct-info-text { flex: 1; min-width: 0; }
                .ct-info-label {
                    font-family: var(--font-sans); font-size: 0.62rem; font-weight: 700;
                    letter-spacing: 0.18em; text-transform: uppercase; color: rgba(0,0,0,0.32); margin-bottom: 4px;
                }
                .ct-info-value {
                    font-family: var(--font-sans); font-size: 0.875rem; font-weight: 500;
                    color: #000309; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;
                }
                .ct-info-value.link { text-decoration: none; transition: color 0.2s; }
                .ct-info-value.link:hover { color: #00d1ff; }
                .ct-info-badge {
                    flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 1px;
                    background: rgba(0,209,255,0.06); border: 1px solid rgba(0,209,255,0.15);
                    border-radius: 10px; padding: 8px 12px;
                }
                .ct-info-badge-num {
                    font-family: var(--font-serif); font-size: 1rem; font-weight: 700;
                    color: #00d1ff; line-height: 1;
                }
                .ct-info-badge-lbl {
                    font-family: var(--font-sans); font-size: 0.55rem; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase; color: rgba(0,0,0,0.3);
                }
                .ct-quote {
                    font-family: var(--font-serif); font-size: 1rem; font-style: italic;
                    color: rgba(0,0,0,0.28); border-left: 2px solid rgba(0,209,255,0.35);
                    padding-left: 18px; margin: 6px 0 0; line-height: 1.6;
                }
                .ct-quote-mark { font-size: 1.3em; color: rgba(0,209,255,0.4); }

                /* ══ Form col ══ */
                .ct-form-col {
                    background: #fff; border: 1px solid rgba(0,0,0,0.06);
                    border-radius: 22px; padding: 44px;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.06);
                    position: relative; overflow: hidden;
                }
                /* Subtle top-right corner glow */
                .ct-form-col::before {
                    content: ''; position: absolute; top: -60px; right: -60px;
                    width: 180px; height: 180px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(0,209,255,0.08), transparent 70%);
                    pointer-events: none;
                }
                .ct-form-head {
                    margin-bottom: 32px; position: relative; padding-bottom: 20px;
                }
                .ct-form-head-line {
                    position: absolute; bottom: 0; left: 0;
                    width: 100%; height: 1px;
                    background: linear-gradient(to right, rgba(0,209,255,0.4), transparent);
                    transform-origin: left;
                }
                .ct-form { display: flex; flex-direction: column; gap: 24px; }
                .ct-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                @media (max-width: 600px) { .ct-form-row { grid-template-columns: 1fr; } }

                /* ══ Field ══ */
                .ct-field { display: flex; flex-direction: column; gap: 0; position: relative; padding-top: 20px; }
                .ct-field-label {
                    position: absolute; top: 32px; left: 0; transform-origin: left top;
                    font-family: var(--font-sans); font-size: 0.875rem; font-weight: 500;
                    color: rgba(0,0,0,0.4); pointer-events: none; z-index: 1;
                    transition: none;
                }
                .ct-field-wrap {
                    position: relative; border-bottom: 1.5px solid rgba(0,0,0,0.12);
                    transition: border-color 0.3s;
                }
                .ct-field-wrap.focused { border-color: transparent; }
                .ct-field-input {
                    width: 100%; padding: 10px 0; background: transparent;
                    border: none; outline: none; font-family: var(--font-sans);
                    font-size: 0.9rem; color: #000309;
                }
                .ct-field-input::placeholder { color: rgba(0,0,0,0.25); }
                .ct-field-bar {
                    position: absolute; bottom: -1.5px; left: 0; right: 0; height: 2px;
                    background: linear-gradient(to right, #00d1ff, #1152d4);
                    transform-origin: left; border-radius: 2px;
                }

                /* ══ Submit ══ */
                .ct-submit-btn {
                    position: relative; overflow: hidden;
                    margin-top: 8px; width: 100%; padding: 17px 28px;
                    background: #000309; border: none; border-radius: 14px;
                    font-family: var(--font-sans); font-size: 0.9rem; font-weight: 700;
                    letter-spacing: 0.04em; color: #fff; cursor: pointer;
                    transition: background 0.3s, box-shadow 0.3s;
                }
                .ct-submit-btn::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent 0%, rgba(0,209,255,0.15) 50%, transparent 100%);
                    transform: translateX(-100%); transition: transform 0.55s ease;
                }
                .ct-submit-btn:hover::after { transform: translateX(100%); }
                .ct-submit-btn:hover { box-shadow: 0 10px 36px rgba(0,209,255,0.22); }
                .ct-btn-inner {
                    display: flex; align-items: center; justify-content: center; gap: 10px; position: relative; z-index: 1;
                }
                .ct-btn-progress {
                    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
                    background: linear-gradient(to right, #00d1ff, #1152d4);
                }
                .ct-spinner {
                    animation: ct-spin 0.75s linear infinite;
                }
                @keyframes ct-spin { to { transform: rotate(360deg); } }

                /* ══ Success ══ */
                .ct-success {
                    display: flex; flex-direction: column; align-items: center;
                    text-align: center; gap: 18px; padding: 48px 20px;
                }
                .ct-success-rings {
                    position: relative; width: 80px; height: 80px;
                    display: flex; align-items: center; justify-content: center;
                }
                .ct-success-ring {
                    position: absolute; width: 80px; height: 80px; border-radius: 50%;
                    border: 1.5px solid rgba(0,209,255,0.4);
                }
                .ct-success-icon {
                    width: 64px; height: 64px; border-radius: 50%; z-index: 1;
                    background: rgba(0,209,255,0.1); border: 1.5px solid rgba(0,209,255,0.3);
                    display: flex; align-items: center; justify-content: center; color: #00d1ff;
                }
                .ct-success h3 {
                    font-family: var(--font-serif); font-size: 1.55rem; font-weight: 700; color: #000309;
                }
                .ct-success p {
                    font-family: var(--font-sans); font-size: 0.875rem; color: rgba(0,0,0,0.45);
                }
                .ct-reset-btn {
                    background: none; border: 1px solid rgba(0,0,0,0.12); padding: 10px 28px;
                    border-radius: 100px; font-family: var(--font-sans); font-size: 0.78rem;
                    font-weight: 600; letter-spacing: 0.06em; cursor: pointer; color: rgba(0,0,0,0.5);
                    transition: all 0.25s ease;
                }
                .ct-reset-btn:hover { border-color: rgba(0,209,255,0.4); color: #00d1ff; background: rgba(0,209,255,0.04); }

                @media (max-width: 640px) {
                    .ct-header { padding: 60px 1.5rem 80px; }
                    .ct-form-col { padding: 28px 20px; }
                    .ct-stats { flex-direction: row; }
                    .ct-stat { padding: 14px 20px; }
                }
            `}</style>
        </main>
    )
}
