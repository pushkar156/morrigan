"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Journal', href: '/journal' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <>
            {/* Outer wrapper for centering the pill */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    padding: isScrolled ? '12px 24px' : '20px 24px',
                    transition: 'padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'none',
                }}
            >
                {/* Pill Container */}
                <nav
                    style={{
                        pointerEvents: 'auto',
                        maxWidth: isScrolled ? '860px' : '1100px',
                        width: '100%',
                        height: isScrolled ? '52px' : '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: isScrolled ? '0 24px' : '0 32px',
                        borderRadius: '100px',
                        background: isScrolled
                            ? 'rgba(8, 12, 24, 0.75)'
                            : 'rgba(8, 12, 24, 0.45)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: isScrolled
                            ? '1px solid rgba(0, 209, 255, 0.12)'
                            : '1px solid rgba(255, 255, 255, 0.06)',
                        boxShadow: isScrolled
                            ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 209, 255, 0.05), inset 0 1px 0 rgba(255,255,255,0.03)'
                            : '0 4px 20px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
                        <img
                            src="/logo.png"
                            alt="Morrigan"
                            style={{
                                height: isScrolled ? '26px' : '30px',
                                width: isScrolled ? '26px' : '30px',
                                objectFit: 'contain',
                                borderRadius: '6px',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        />
                        <span
                            style={{
                                color: '#fff',
                                fontSize: isScrolled ? '15px' : '16px',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                fontFamily: 'var(--font-serif)',
                                transition: 'font-size 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            }}
                        >
                            Morrigan
                        </span>
                    </Link>

                    {/* Desktop Nav Links + Login */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: isScrolled ? '28px' : '34px', transition: 'gap 0.5s ease' }} className="desktop-nav">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="nav-glow-link"
                                    style={{
                                        position: 'relative',
                                        color: isActive ? '#00d1ff' : 'rgba(255, 255, 255, 0.6)',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        fontFamily: 'var(--font-sans)',
                                        letterSpacing: '0.02em',
                                        padding: '6px 2px',
                                        transition: 'color 0.3s ease',
                                    }}
                                >
                                    {link.name}
                                </Link>
                            )
                        })}

                        {/* Divider */}
                        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

                        {/* Login */}
                        <Link
                            href="/login"
                            className="nav-glow-link"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '7px',
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '13px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                fontFamily: 'var(--font-sans)',
                                padding: '6px 2px',
                                transition: 'color 0.3s ease',
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Log in
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="mobile-only"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                        style={{
                            display: 'none',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            color: '#fff',
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="3" y1="7" x2="21" y2="7" />
                            <line x1="3" y1="17" x2="21" y2="17" />
                        </svg>
                    </button>
                </nav>
            </div>

            {/* Mobile Full-screen Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(8, 12, 24, 0.98)',
                            backdropFilter: 'blur(30px)',
                            zIndex: 1100,
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '80px 40px 40px',
                        }}
                    >
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                            style={{
                                position: 'absolute',
                                top: '24px',
                                right: '24px',
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                padding: '8px',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
                            {navLinks.map((link, i) => {
                                const isActive = pathname === link.href
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            style={{
                                                display: 'block',
                                                padding: '18px 0',
                                                color: isActive ? '#00d1ff' : '#fff',
                                                fontSize: '22px',
                                                fontWeight: 600,
                                                fontFamily: 'var(--font-sans)',
                                                textDecoration: 'none',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            }}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} style={{ marginTop: '28px' }}>
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '14px 28px',
                                    background: '#00d1ff',
                                    color: '#000',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontFamily: 'var(--font-sans)',
                                }}
                            >
                                Log in
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Styles */}
            <style jsx global>{`
        .desktop-nav {
          display: flex !important;
        }
        .mobile-only {
          display: none !important;
        }

        /* Soft glow on hover */
        .nav-glow-link:hover {
          color: #fff !important;
          text-shadow: 0 0 12px rgba(0, 209, 255, 0.5), 0 0 4px rgba(0, 209, 255, 0.3);
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
        }
      `}</style>
        </>
    )
}
