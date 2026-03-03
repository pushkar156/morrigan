"use client"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Home', href: '/' },
        {
            name: 'Journal',
            href: '/journal',
            dropdown: [
                { name: 'Back to Basics', href: '/journal?category=back-to-basics' },
                { name: 'Case Studies', href: '/journal?category=case-studies' },
                { name: 'Stock Analysis', href: '/journal?category=stock-analysis' },
                { name: '100 Days Challenge', href: '/journal?category=100-days-challenge' },
                { name: 'M&A Diaries', href: '/journal?category=ma-diaries' },
            ]
        },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <nav className={`fixed top-0 w-full z-[1000] px-6 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}>
            <div className={`max-w-7xl mx-auto flex justify-between items-center px-8 py-3 rounded-full transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent'}`}>
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="h-8 brightness-0 invert" />
                    <h2 className="text-white font-serif font-black tracking-widest text-lg uppercase hidden md:block">MORRIGAN</h2>
                </Link>

                <ul className="hidden md:flex gap-12 items-center">
                    {navLinks.map((link) => (
                        <li key={link.name} className="relative group">
                            <Link
                                href={link.href}
                                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-[#00d1ff] ${pathname === link.href ? 'text-[#00d1ff]' : 'text-white/40'}`}
                            >
                                {link.name}
                            </Link>

                            {link.dropdown && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-all transition-all duration-300">
                                    <div className="bg-[#0a1930] border border-white/10 p-6 rounded-2xl min-w-[240px] shadow-3xl">
                                        {link.dropdown.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="block py-3 text-[9px] font-bold text-white/40 hover:text-[#00d1ff] hover:translate-x-2 transition-all uppercase tracking-widest"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-6">
                    <button className="hidden md:block text-[10px] font-black text-white px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                        Login
                    </button>
                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={isMenuOpen ? { x: 0 } : { x: '100%' }}
                className="fixed inset-0 bg-black z-[1100] p-12 flex flex-col justify-center gap-8"
            >
                <button className="absolute top-8 right-8 text-4xl text-white" onClick={() => setIsMenuOpen(false)}>✕</button>
                {navLinks.map(link => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className="text-4xl font-serif text-white hover:italic transition-all"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}
            </motion.div>
        </nav>
    )
}
