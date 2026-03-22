"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const { isAuthenticated, isLoading, logout, token } = useAuth()
    const [editorDirty, setEditorDirty] = useState(false)
    const [showGuardModal, setShowGuardModal] = useState<{ active: boolean, targetPath: string }>({ active: false, targetPath: '' })
    const [isSavingEmergency, setIsSavingEmergency] = useState(false)

    // Listen for editor status changes
    useEffect(() => {
        const handleStatus = (e: any) => setEditorDirty(e.detail.isDirty)
        const handleInterceptedNav = (e: any) => setShowGuardModal({ active: true, targetPath: e.detail.targetPath })

        window.addEventListener('editor-integrity-change', handleStatus)
        window.addEventListener('editor-intercepted-nav', handleInterceptedNav)
        
        return () => {
            window.removeEventListener('editor-integrity-change', handleStatus)
            window.removeEventListener('editor-intercepted-nav', handleInterceptedNav)
        }
    }, [])

    const handleIntercept = (e: React.MouseEvent, target: string) => {
        if (editorDirty) {
            e.preventDefault()
            setShowGuardModal({ active: true, targetPath: target })
        }
    }

    const confirmSave = () => {
        setIsSavingEmergency(true)
        window.dispatchEvent(new CustomEvent('editor-emergency-save', { detail: { targetPath: showGuardModal.targetPath } }))
        // The editor will handle the actual API call and redirect
    }

    const discardChanges = () => {
        setEditorDirty(false) // Bypass for next render
        router.push(showGuardModal.targetPath)
        setShowGuardModal({ active: false, targetPath: '' })
    }

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
                                    onClick={(e) => handleIntercept(e, link.href)}
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
                    <button onClick={(e) => {
                        if (editorDirty) {
                            e.preventDefault();
                            setShowGuardModal({ active: true, targetPath: '/admin/login' });
                        } else {
                            handleLogout();
                        }
                    }} className={`adm-sidebar-logout ${!isSidebarOpen ? 'icon-only' : ''}`}>
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

            {/* Navigation Guard Modal */}
            <AnimatePresence>
                {showGuardModal.active && (
                    <div className="guard-overlay">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="guard-card"
                        >
                            <div className="guard-header">
                                <div className="guard-icon-box">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d1ff" strokeWidth="2.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <h2 className="guard-title">Integrity Check</h2>
                                <p className="guard-subtitle">Your editorial changes are currently unsaved. How would you like to proceed?</p>
                            </div>

                            <div className="guard-actions">
                                <button 
                                    className="g-btn g-btn-primary" 
                                    onClick={confirmSave}
                                    disabled={isSavingEmergency}
                                >
                                    {isSavingEmergency ? 'Writing to Vault...' : 'Save Draft & Exit'}
                                </button>
                                <button 
                                    className="g-btn g-btn-ghost" 
                                    onClick={discardChanges}
                                    disabled={isSavingEmergency}
                                >
                                    Discard Changes
                                </button>
                                <button 
                                    className="g-btn g-btn-cancel" 
                                    onClick={() => setShowGuardModal({ active: false, targetPath: '' })}
                                    disabled={isSavingEmergency}
                                >
                                    Stay Here
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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

                /* ══ Navigation Guard Custom Styles ══ */
                .guard-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(4, 10, 20, 0.85);
                    backdrop-filter: blur(12px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .guard-card {
                    background: #0d1b2a;
                    border: 1px solid rgba(0, 209, 255, 0.15);
                    border-radius: 24px;
                    width: 100%;
                    max-width: 440px;
                    padding: 40px;
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 209, 255, 0.05);
                    text-align: center;
                }

                .guard-icon-box {
                    width: 60px; height: 60px;
                    background: rgba(0, 209, 255, 0.06);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                }

                .guard-title {
                    font-family: var(--font-serif);
                    font-size: 1.5rem;
                    color: #fff;
                    margin-bottom: 12px;
                }

                .guard-subtitle {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.5);
                    line-height: 1.6;
                    margin-bottom: 32px;
                }

                .guard-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .g-btn {
                    padding: 14px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .g-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .g-btn-primary {
                    background: #00d1ff;
                    color: #000;
                }
                .g-btn-primary:hover:not(:disabled) {
                    background: #33daff;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 209, 255, 0.3);
                }

                .g-btn-ghost {
                    background: rgba(255, 100, 100, 0.06);
                    color: #ff6b6b;
                    border-color: rgba(255, 100, 100, 0.15);
                }
                .g-btn-ghost:hover:not(:disabled) {
                    background: rgba(255, 100, 100, 0.1);
                    color: #ff5252;
                }

                .g-btn-cancel {
                    background: transparent;
                    color: rgba(255, 255, 255, 0.4);
                }
                .g-btn-cancel:hover:not(:disabled) {
                    color: #fff;
                }
            `}</style>
        </div>
    )
}
