"use client"
import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full relative overflow-hidden bg-[#f8f9fa]">
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00d1ff40] to-transparent" />

            <div className="max-w-7xl mx-auto px-8 md:px-16 py-24 md:py-32">
                {/* Main Grid - clean 3-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12">

                    {/* Brand Identity */}
                    <div className="md:col-span-5 flex flex-col gap-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center border border-black/10 group-hover:bg-[#00d1ff] group-hover:border-[#00d1ff] transition-all duration-700">
                                <img src="/logo.png" alt="Morrigan Logo" className="h-7 invert brightness-0" />
                            </div>
                            <h2 className="text-2xl font-serif font-black tracking-widest text-black">THE MORRIGAN</h2>
                        </Link>
                        <p className="text-black/50 leading-relaxed font-sans text-sm md:text-base max-w-sm">
                            Morrigan is an independent editorial platform decoding capital flows, market shifts, and institutional strategy for the modern era.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-4 grid grid-cols-2 gap-12">
                        <div className="flex flex-col gap-6">
                            <h3 className="text-black/80 text-xs font-black uppercase tracking-[0.2em]">Intelligence</h3>
                            <ul className="flex flex-col gap-5">
                                <li><Link href="/journal?category=back-to-basics" className="text-black/60 hover:text-[#00d1ff] transition-colors text-sm">Back to Basics</Link></li>
                                <li><Link href="/journal?category=case-studies" className="text-black/60 hover:text-[#00d1ff] transition-colors text-sm">Strategy Series</Link></li>
                                <li><Link href="/journal?category=stock-analysis" className="text-black/60 hover:text-[#00d1ff] transition-colors text-sm">Market Insights</Link></li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h3 className="text-black/80 text-xs font-black uppercase tracking-[0.2em]">Connect</h3>
                            <ul className="flex flex-col gap-5">
                                <li>
                                    <a href="mailto:the.morrigan.news@gmail.com" className="group text-black/60 hover:text-[#00d1ff] transition-colors inline-flex items-center gap-2 text-sm">
                                        <span className="group-hover:translate-x-1 transition-transform">Gmail</span>
                                        <span className="text-[#00d1ff] opacity-40">↗</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://linkedin.com" target="_blank" className="group text-black/60 hover:text-[#00d1ff] transition-colors inline-flex items-center gap-2 text-sm">
                                        <span className="group-hover:translate-x-1 transition-transform">LinkedIn</span>
                                        <span className="text-[#00d1ff] opacity-40">↗</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Partnership Section */}
                    <div className="md:col-span-3 flex flex-col gap-6">
                        <h3 className="text-black/40 text-xs font-black uppercase tracking-[0.2em]">In Association With</h3>
                        <div className="flex items-center gap-6 p-6 bg-white border border-black/5 rounded-3xl shadow-sm group hover:border-[#00d1ff30] transition-all duration-700">
                            <img src="/partner.png" alt="Partner Logo" className="h-10 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00d1ff]">Strategic Partner</span>
                                <span className="text-xs text-black/30 font-bold uppercase tracking-widest mt-1 italic">Institutional Access</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legal Bottom Bar */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-12 mt-16 border-t border-black/5">
                    <div className="flex flex-col gap-2">
                        <span className="text-black font-bold tracking-widest text-[10px] uppercase">All Rights Reserved &copy; {currentYear}</span>
                        <span className="text-black/20 text-[9px] font-bold uppercase tracking-[0.3em]">Restoring depth to financial discourse</span>
                    </div>

                    <div className="flex gap-10 items-center">
                        <Link href="/privacy" className="text-[10px] uppercase tracking-widest font-black text-black/60 hover:text-[#00d1ff] transition-all">Privacy Policy</Link>
                        <Link href="/terms" className="text-[10px] uppercase tracking-widest font-black text-black/60 hover:text-[#00d1ff] transition-all">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
