"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const { isAuthenticated, isLoading, logout, token } = useAuth()

    const handleLogout = () => {
        logout()
        router.push('/admin/login')
    }

    useEffect(() => {
        console.log("[Auth Guard] isLoading:", isLoading, "token:", token ? "Exists" : "None")
        if (!isLoading && !token) {
            router.push('/admin/login')
        }
    }, [isLoading, token, router])

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#0d1b2a]">
                <div className="flex flex-col items-center gap-6">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00d1ff]/20 border-t-[#00d1ff]"></div>
                    <span className="text-[11px] font-black tracking-[0.3em] text-[#00d1ff] uppercase">Security Verification</span>
                </div>
            </div>
        )
    }

    if (!token) {
        return null
    }

    const navLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z' },
        { name: 'New Article', href: '/admin/editor', icon: 'M12 5v14M5 12h14' },
    ]

    return (
        <div className="adm-layout">
            {/* Sidebar */}
            <aside className={`adm-sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
                {/* Top accent line */}
                <div className="adm-sidebar-accent" />

                {/* Logo Area */}
                <div className="adm-sidebar-header">
                    <Link href="/" className="adm-sidebar-logo-link">
                        <img src="/logo.png" alt="Morrigan" className="adm-sidebar-logo-img" />
                        {isSidebarOpen && <span className="adm-sidebar-logo-text">The Morrigan</span>}
                    </Link>
                    {isSidebarOpen && (
                        <button onClick={() => setIsSidebarOpen(false)} className="adm-sidebar-toggle">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="adm-sidebar-nav">
                    {!isSidebarOpen && (
                        <button onClick={() => setIsSidebarOpen(true)} className="adm-sidebar-expand">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                    )}

                    <div className="adm-sidebar-nav-group">
                        {isSidebarOpen && <span className="adm-sidebar-nav-label">Navigation</span>}
                        {navLinks.map(link => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`adm-sidebar-link ${isActive ? 'active' : ''} ${!isSidebarOpen ? 'icon-only' : ''}`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="adm-sidebar-link-icon">
                                        <path d={link.icon} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {isSidebarOpen && <span className="adm-sidebar-link-text">{link.name}</span>}
                                    {isActive && isSidebarOpen && <span className="adm-sidebar-link-indicator" />}
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="adm-sidebar-footer">
                    <button onClick={handleLogout} className={`adm-sidebar-logout ${!isSidebarOpen ? 'icon-only' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="adm-sidebar-link-icon">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {isSidebarOpen && <span className="adm-sidebar-link-text">Secure Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`adm-main ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
                {children}
            </main>

            <style jsx global>{`
                .adm-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #0d1b2a;
                    font-family: var(--font-sans);
                }

                /* ══ Sidebar ══ */
                .adm-sidebar {
                    position: fixed;
                    inset: 0 auto 0 0;
                    width: 280px;
                    background: rgba(13,27,42,0.95);
                    backdrop-filter: blur(30px);
                    border-right: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .adm-sidebar.collapsed {
                    width: 76px;
                }

                .adm-sidebar-accent {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(to right, #00d1ff, #1152d4, transparent);
                }

                .adm-sidebar-header {
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }

                .adm-sidebar-logo-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    transition: opacity 0.3s;
                }
                .adm-sidebar-logo-link:hover { opacity: 0.8; }

                .adm-sidebar-logo-img {
                    width: 32px; height: 32px;
                    border-radius: 8px;
                    object-fit: contain;
                }

                .adm-sidebar-logo-text {
                    font-family: var(--font-serif);
                    font-weight: 700;
                    color: rgba(255,255,255,0.8);
                    letter-spacing: 0.06em;
                    font-size: 0.85rem;
                }

                .adm-sidebar-toggle {
                    width: 32px; height: 32px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255,255,255,0.4);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .adm-sidebar-toggle:hover {
                    background: rgba(255,255,255,0.08);
                    color: #00d1ff;
                    border-color: rgba(0,209,255,0.2);
                }

                .adm-sidebar-nav {
                    flex: 1;
                    padding: 20px 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .adm-sidebar-expand {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    padding: 10px 0;
                    margin-bottom: 16px;
                    color: rgba(255,255,255,0.3);
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .adm-sidebar-expand:hover { color: #00d1ff; }

                .adm-sidebar-nav-group {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .adm-sidebar-nav-label {
                    font-size: 0.58rem;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.2);
                    padding: 0 12px;
                    margin-bottom: 8px;
                }

                .adm-sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 12px 14px;
                    border-radius: 12px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.45);
                    transition: all 0.25s ease;
                    position: relative;
                    border: 1px solid transparent;
                }
                .adm-sidebar-link.icon-only {
                    justify-content: center;
                    padding: 12px;
                }
                .adm-sidebar-link:hover {
                    color: rgba(255,255,255,0.8);
                    background: rgba(255,255,255,0.04);
                }
                .adm-sidebar-link.active {
                    color: #00d1ff;
                    background: rgba(0,209,255,0.08);
                    border-color: rgba(0,209,255,0.15);
                    font-weight: 700;
                }

                .adm-sidebar-link-icon {
                    flex-shrink: 0;
                }

                .adm-sidebar-link-text {
                    font-size: 0.85rem;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                }
                .adm-sidebar-link.active .adm-sidebar-link-text {
                    font-weight: 700;
                }

                .adm-sidebar-link-indicator {
                    position: absolute;
                    right: 14px;
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #00d1ff;
                    box-shadow: 0 0 8px rgba(0,209,255,0.5);
                }

                .adm-sidebar-footer {
                    padding: 16px 14px;
                    border-top: 1px solid rgba(255,255,255,0.06);
                }

                .adm-sidebar-logout {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 12px 14px;
                    width: 100%;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    background: none;
                    color: rgba(255,100,100,0.6);
                    cursor: pointer;
                    transition: all 0.25s ease;
                    font-family: var(--font-sans);
                }
                .adm-sidebar-logout.icon-only {
                    justify-content: center;
                    padding: 12px;
                }
                .adm-sidebar-logout:hover {
                    color: #ff6b6b;
                    background: rgba(255,100,100,0.06);
                    border-color: rgba(255,100,100,0.12);
                }

                /* ══ Main ══ */
                .adm-main {
                    flex: 1;
                    margin-left: 280px;
                    padding: 40px 48px 80px;
                    min-height: 100vh;
                    transition: margin-left 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .adm-main.sidebar-collapsed {
                    margin-left: 76px;
                }

                @media (max-width: 768px) {
                    .adm-main { padding: 24px 20px 60px; }
                }
            `}</style>
        </div>
    )
}
