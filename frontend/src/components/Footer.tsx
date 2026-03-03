import Link from 'next/link'

export default function Footer() {
    return (
        <footer>
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section logo-section">
                        <img src="/logo.png" alt="Morrigan Logo" className="logo-image" />
                        <p className="logo-tagline">
                            Quality news, where you want it, when you want it. Restoring depth to financial discourse.
                        </p>
                    </div>

                    <div className="footer-section connect-section">
                        <h3>Connect</h3>
                        <ul>
                            <li>
                                <a href="mailto:the.morrigan.news@gmail.com">
                                    <svg className="social-icon" viewBox="0 0 24 24">
                                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.548l8.073-6.055C21.69 2.28 24 3.434 24 5.457z" />
                                    </svg>
                                    Gmail
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/company/education-the-morrigan" target="_blank" rel="noopener noreferrer">
                                    <svg className="social-icon" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section association-section">
                        <h3>In Association With</h3>
                        <div className="partner-logo">
                            <img src="/partner.png" alt="Partner Logo" />
                            <span>Official Partner</span>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} The Morrigan. All rights reserved.</p>
                    <div className="footer-links">
                        <Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
