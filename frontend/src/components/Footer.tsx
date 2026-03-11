"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MagneticButton } from './CustomCursor'

export default function Footer() {
    const pathname = usePathname()
    const currentYear = new Date().getFullYear()

    // Hide footer on admin routes
    if (pathname && pathname.startsWith('/admin')) return null

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <footer className="m-footer">
            <div className="m-footer-top-glow" />

            <div className="m-footer-grid">
                {/* Column 1: Brand & About */}
                <div>
                    <Link href="/" className="m-footer-logo-box">
                        <div className="m-footer-logo-img">
                            <img src="/logo.png" alt="Morrigan Logo" />
                        </div>
                        <h2>THE MORRIGAN</h2>
                    </Link>
                    <p className="m-footer-desc">
                        An independent editorial platform decoding capital flows, market shifts, and institutional strategy for the modern era.
                    </p>
                </div>

                {/* Column 2: Intelligence Links */}
                <div>
                    <h3>Intelligence</h3>
                    <ul className="m-footer-links">
                        {[
                            { name: 'Back to Basics', href: '/journal?category=back-to-basics' },
                            { name: 'Case Studies', href: '/journal?category=case-studies' },
                            { name: 'Stock Analysis', href: '/journal?category=stock-analysis' },
                            { name: '100 Days Challenge', href: '/journal?category=100-days-challenge' },
                            { name: 'M&A Diaries', href: '/journal?category=ma-diaries' },
                        ].map((item) => (
                            <li key={item.name}>
                                <Link href={item.href}>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Company Links */}
                <div>
                    <h3>Company</h3>
                    <ul className="m-footer-links" style={{ marginBottom: '16px' }}>
                        <li>
                            <Link href="/about">About Us</Link>
                        </li>
                        <li>
                            <Link href="/contact">Contact</Link>
                        </li>
                    </ul>

                    <h3 style={{ marginTop: '32px' }}>Connect</h3>
                    <div className="m-footer-socials">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.15H5.078z" />
                            </svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a href="mailto:the.morrigan.news@gmail.com" aria-label="Email">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="M2 4l10 8 10-8" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Column 4: Partnership */}
                <div className="m-footer-col-partner">
                    <div className="m-footer-partner-wrapper">
                        <h3>In Association With</h3>
                        <div className="m-footer-partner-box">
                            <img src="/partner.png" alt="Strategic Partner" className="m-footer-partner-img" />
                            <div className="m-footer-partner-text-wrapper">
                                <span className="m-footer-partner-text-top">Strategic Partner</span>
                                <span className="m-footer-partner-text-bottom">Institutional Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="m-footer-bottom">
                <p className="m-footer-disclaimer">
                    <strong>Disclaimer:</strong> Morrigan is an independent editorial and analysis platform. The information, opinions, and data provided on this website are for informational and educational purposes only and do not constitute financial, investment, legal, or tax advice. We do not solicit, recommend, or endorse any specific securities, investments, or financial strategies. Institutional capital flows, IPOs, and M&A activities involve high market risks. Users are fully responsible for any financial decisions they make and should consult with registered financial advisors or conduct independent due diligence prior to executing any market transactions. By continuing to use this platform, you acknowledge and accept these terms.
                </p>

                <div className="m-footer-legal-bar">
                    <div className="m-footer-copyright-group">
                        <span className="m-footer-copyright">&copy; {currentYear} The Morrigan</span>
                        <span className="m-footer-divider">|</span>
                        <span className="m-footer-slogan">Restoring depth to financial discourse</span>
                    </div>

                    <div className="m-footer-actions">
                        <div className="m-footer-legal-links">
                            <Link href="/privacy">Privacy</Link>
                            <span style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
                            <Link href="/terms">Terms</Link>
                        </div>

                        <MagneticButton strength={0.6}>
                            <button
                                onClick={scrollToTop}
                                className="m-footer-top-btn"
                                aria-label="Back to top"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 19V5" />
                                    <path d="M5 12l7-7 7 7" />
                                </svg>
                            </button>
                        </MagneticButton>
                    </div>
                </div>
            </div>
        </footer>
    )
}
