"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        router.push('/admin/login')
    }

    // A simple auth guard for the frontend demo
    // We check if we're in the browser to avoid SSR hydration mismatches
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('admin_token')
            if (!token) {
                router.push('/admin/login')
            }
        }
    }, [pathname, router])

    return (
        <div className="flex min-h-screen bg-[#f8f9fa] font-sans">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white/95 backdrop-blur-3xl border-r border-black/5 flex flex-col z-[1000] transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                {/* Logo Area */}
                <div className="h-24 flex items-center justify-between px-6 border-b border-black/5">
                    <Link href="/" className="flex items-center gap-3 decoration-none">
                        <img src="/logo.png" alt="Morrigan" className="w-8 h-8 rounded-sm object-contain" />
                        {isSidebarOpen && <span className="font-serif font-black text-black tracking-widest uppercase">Morrigan</span>}
                    </Link>
                    {isSidebarOpen && (
                        <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-black/50 hover:bg-black/5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="flex-grow p-4 space-y-2">
                    {!isSidebarOpen && (
                        <button onClick={() => setIsSidebarOpen(true)} className="w-full flex justify-center mb-6 py-2 text-black/50 hover:text-black">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                    )}

                    {[
                        { name: 'Dashboard', href: '/admin/dashboard', icon: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z' },
                        { name: 'New Article', href: '/admin/editor', icon: 'M12 5v14M5 12h14' },
                    ].map(link => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-2xl transition-all border ${isActive
                                        ? 'bg-black text-white border-black shadow-lg font-bold'
                                        : 'bg-transparent text-black/60 border-transparent hover:bg-black/5 hover:text-black font-semibold'
                                    }`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                                    <path d={link.icon} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {isSidebarOpen && <span className="ml-4 text-sm tracking-wide">{link.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-black/5">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-2xl text-red-500/80 hover:bg-red-500/10 hover:text-red-600 transition-all font-semibold`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {isSidebarOpen && <span className="ml-4 text-sm tracking-wide">Secure Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'} pt-8 px-10 pb-20 relative min-h-screen`}>
                {children}
            </main>
        </div>
    )
}
