"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const router = useRouter()
    const { login } = useAuth()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            await login(username, password)
            router.push('/admin/dashboard')
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please verify your access.')
            setIsLoading(false)
        }
    }

    return (
        <main className="adm-login-page">
            {/* Ambient glows */}
            <div className="adm-login-glow adm-login-glow-1" />
            <div className="adm-login-glow adm-login-glow-2" />

            {/* Grid pattern */}
            <div className="adm-login-grid-pattern" />

            {/* Back to home */}
            <Link href="/" className="adm-login-home-link">
                <img src="/logo.png" alt="Morrigan" className="adm-login-home-logo" />
                <span className="adm-login-home-text">The Morrigan</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="adm-login-card"
            >
                {/* Accent line at top */}
                <div className="adm-login-card-accent" />

                <div className="adm-login-card-inner">
                    <div className="adm-login-head">
                        <div className="adm-login-icon-wrap">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h1 className="adm-login-title">Admin Access</h1>
                        <p className="adm-login-desc">Secure Editorial Protocol</p>
                    </div>

                    <form onSubmit={handleLogin} className="adm-login-form">
                        <div className={`adm-login-field ${focusedField === 'user' ? 'focused' : ''}`}>
                            <label className="adm-login-label">Username</label>
                            <div className="adm-login-input-wrap">
                                <svg className="adm-login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onFocus={() => setFocusedField('user')}
                                    onBlur={() => setFocusedField(null)}
                                    className="adm-login-input"
                                    placeholder="Enter your identifier"
                                    required
                                />
                            </div>
                            <motion.div
                                className="adm-login-field-bar"
                                animate={{ scaleX: focusedField === 'user' ? 1 : 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>

                        <div className={`adm-login-field ${focusedField === 'pass' ? 'focused' : ''}`}>
                            <label className="adm-login-label">Password</label>
                            <div className="adm-login-input-wrap">
                                <svg className="adm-login-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('pass')}
                                    onBlur={() => setFocusedField(null)}
                                    className="adm-login-input"
                                    placeholder="Enter your access phrase"
                                    required
                                />
                            </div>
                            <motion.div
                                className="adm-login-field-bar"
                                animate={{ scaleX: focusedField === 'pass' ? 1 : 0 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -8, height: 0 }}
                                    className="adm-login-error"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button type="submit" disabled={isLoading} className="adm-login-submit">
                            <span className="adm-login-submit-text">
                                {isLoading ? (
                                    <>
                                        <svg className="adm-login-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>
                                        Verifying…
                                    </>
                                ) : (
                                    <>
                                        Authorize Access
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </>
                                )}
                            </span>
                            {/* Shimmer */}
                            <div className="adm-login-submit-shimmer" />
                        </button>
                    </form>
                </div>
            </motion.div>

            <style jsx global>{`
                .adm-login-page {
                    min-height: 100vh;
                    background: #0b1929;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .adm-login-grid-pattern {
                    position: absolute; inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 48px 48px;
                    pointer-events: none; z-index: 0;
                }

                .adm-login-glow {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    filter: blur(120px);
                }
                .adm-login-glow-1 {
                    top: -15%; left: -10%;
                    width: 500px; height: 500px;
                    background: rgba(0,209,255,0.08);
                }
                .adm-login-glow-2 {
                    bottom: -15%; right: -10%;
                    width: 500px; height: 500px;
                    background: rgba(17,82,212,0.08);
                }

                .adm-login-home-link {
                    position: absolute;
                    top: 32px; left: 32px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    z-index: 20;
                    transition: opacity 0.3s;
                }
                .adm-login-home-link:hover { opacity: 0.8; }

                .adm-login-home-logo {
                    width: 32px; height: 32px;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .adm-login-home-text {
                    font-family: var(--font-serif);
                    font-weight: 700;
                    color: rgba(255,255,255,0.7);
                    letter-spacing: 0.06em;
                    font-size: 0.85rem;
                    transition: color 0.2s;
                }
                .adm-login-home-link:hover .adm-login-home-text { color: #00d1ff; }

                .adm-login-card {
                    width: 100%;
                    max-width: 440px;
                    position: relative;
                    z-index: 10;
                    background: rgba(255,255,255,0.04);
                    backdrop-filter: blur(40px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 24px;
                    overflow: hidden;
                }

                .adm-login-card-accent {
                    height: 3px;
                    background: linear-gradient(to right, #00d1ff, #1152d4);
                }

                .adm-login-card-inner {
                    padding: 48px 44px;
                }

                .adm-login-head {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .adm-login-icon-wrap {
                    width: 56px; height: 56px;
                    border-radius: 16px;
                    background: rgba(0,209,255,0.08);
                    border: 1px solid rgba(0,209,255,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00d1ff;
                    margin: 0 auto 20px;
                }

                .adm-login-title {
                    font-family: var(--font-serif);
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #fff;
                    margin: 0 0 8px;
                    letter-spacing: -0.02em;
                }

                .adm-login-desc {
                    font-family: var(--font-sans);
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.3);
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    margin: 0;
                }

                .adm-login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .adm-login-field {
                    position: relative;
                }

                .adm-login-label {
                    display: block;
                    font-family: var(--font-sans);
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                    margin-bottom: 10px;
                    transition: color 0.3s;
                }
                .adm-login-field.focused .adm-login-label {
                    color: #00d1ff;
                }

                .adm-login-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .adm-login-input-icon {
                    position: absolute;
                    left: 16px;
                    color: rgba(255,255,255,0.2);
                    pointer-events: none;
                    transition: color 0.3s;
                }
                .adm-login-field.focused .adm-login-input-icon {
                    color: rgba(0,209,255,0.5);
                }

                .adm-login-input {
                    width: 100%;
                    padding: 14px 16px 14px 44px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    font-family: var(--font-sans);
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: #fff;
                    outline: none;
                    transition: all 0.3s ease;
                }
                .adm-login-input::placeholder {
                    color: rgba(255,255,255,0.2);
                }
                .adm-login-input:focus {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(0,209,255,0.3);
                }

                .adm-login-field-bar {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(to right, #00d1ff, #1152d4);
                    transform-origin: left;
                    border-radius: 2px;
                }

                .adm-login-error {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    background: rgba(220,53,69,0.08);
                    border: 1px solid rgba(220,53,69,0.2);
                    border-radius: 12px;
                    color: #ff6b6b;
                    font-family: var(--font-sans);
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                }

                .adm-login-submit {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    padding: 17px 28px;
                    background: linear-gradient(135deg, #00d1ff, #1152d4);
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: box-shadow 0.3s, transform 0.3s;
                    margin-top: 8px;
                }
                .adm-login-submit:hover {
                    box-shadow: 0 12px 40px rgba(0,209,255,0.25);
                    transform: translateY(-2px);
                }
                .adm-login-submit:disabled {
                    opacity: 0.7;
                    cursor: wait;
                    transform: none;
                }

                .adm-login-submit-text {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-family: var(--font-sans);
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #fff;
                }

                .adm-login-submit-shimmer {
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
                    transform: translateX(-100%);
                    transition: transform 0.55s ease;
                }
                .adm-login-submit:hover .adm-login-submit-shimmer {
                    transform: translateX(100%);
                }

                .adm-login-spinner {
                    animation: adm-spin 0.75s linear infinite;
                }
                @keyframes adm-spin { to { transform: rotate(360deg); } }

                @media (max-width: 480px) {
                    .adm-login-card-inner { padding: 32px 24px; }
                    .adm-login-home-link { top: 20px; left: 20px; }
                }
            `}</style>
        </main>
    )
}
