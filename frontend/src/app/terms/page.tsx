'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'

export default function TermsOfService() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

    const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    return (
        <article className="min-h-screen bg-[#e8f0fc] selection:bg-[#00d1ff] selection:text-black">
            {/* Intel Reading Progress Bar */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1 bg-[#00d1ff] z-[100] origin-left"
                style={{ scaleX }}
            />

            {/* Immersive Parallax Header */}
            <div className="relative w-full h-[50vh] min-h-[400px] bg-[#1a1a2e] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#e8f0fc] via-[#1a1a2e]/80 to-[#1a1a2e]" />
                
                {/* Decorative Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 z-10 text-center container-custom">
                    <span className="text-[#00d1ff] font-bold tracking-[0.3em] text-xs uppercase mb-6 bg-white/5 backdrop-blur-md px-4 py-2 rounded-sm border border-white/10">
                        LEGAL DIRECTIVE
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white max-w-4xl leading-tight mb-8">
                        Terms of Service
                    </h1>
                    <div className="flex items-center gap-6 text-[#1152d4] font-sans tracking-wide text-sm uppercase font-bold bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
                        <span>LAST UPDATED</span>
                        <span className="w-1.5 h-1.5 bg-[#1152d4] rounded-full opacity-60" />
                        <span>{date}</span>
                    </div>
                </div>
            </div>

            <div className="container-custom max-w-[85rem] mx-auto py-20 px-6 flex flex-col xl:flex-row gap-12 lg:gap-16 relative">
                
                {/* TOC Sidebar */}
                <aside className="hidden lg:flex flex-col w-56 shrink-0 relative">
                    <div className="sticky top-40 flex flex-col gap-12">
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest border-b border-black/5 pb-2">Directive Root</p>
                            <nav className="flex items-center text-[11.5px] font-medium text-black/40">
                                <span className="transition-colors">Compliance</span>
                                <svg className="mx-2 w-3 h-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                <span className="text-[#1152d4] font-semibold">TOS</span>
                            </nav>
                        </div>
                    </div>
                </aside>

                <div className="w-full max-w-[70ch] mx-auto lg:mx-0">
                    <div className="briefing-content">
                        <div className="prose-intel-root">
                            <p>
                                These terms and conditions outline the rules and regulations for the use of The Morrigan's Website. By accessing this website we assume you accept these terms and conditions. Do not continue to use The Morrigan if you do not agree to take all of the terms and conditions stated on this page.
                            </p>

                            <h2 className="markdown-h-intel">1. Intellectual Property</h2>
                            <p>
                                Unless otherwise stated, The Morrigan and/or its licensors own the intellectual property rights for all material on The Morrigan. All intellectual property rights are reserved. You may access this from The Morrigan for your own personal use subjected to restrictions set in these terms and conditions.
                            </p>
                            <ul>
                                <li>You must not republish material from The Morrigan.</li>
                                <li>You must not sell, rent or sub-license material from The Morrigan.</li>
                                <li>You must not reproduce, duplicate or copy material from The Morrigan.</li>
                                <li>You must not redistribute content from The Morrigan.</li>
                            </ul>

                            <h2 className="markdown-h-intel">2. Disclaimer</h2>
                            <p>
                                The materials on The Morrigan's website are provided on an 'as is' basis. The Morrigan makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>

                            <h2 className="markdown-h-intel">3. Limitations</h2>
                            <p>
                                In no event shall The Morrigan or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Morrigan's website, even if The Morrigan or a Morrigan authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>

                            <br/><br/>
                            <p className="text-sm text-black/40 font-mono">
                                // END OF DIRECTIVE
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 my-24 opacity-10">
                        <span className="w-1.5 h-1.5 bg-black rounded-full" />
                        <span className="w-2 h-2 bg-black rounded-full" />
                        <span className="w-1.5 h-1.5 bg-black rounded-full" />
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="hidden xl:flex flex-col w-[320px] shrink-0 gap-12 lg:pl-4">
                    <div className="p-6 bg-white border border-black/5 rounded-xl shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#1152d4]" />
                        <h4 className="text-[12px] font-bold text-black/80 font-sans mb-3 tracking-widest uppercase text-center">Legal Counsel</h4>
                        <p className="text-[11.5px] text-black/50 leading-relaxed mb-6 text-center font-medium">
                            If you have any questions about these terms and conditions, please contact our legal counsel.
                        </p>
                        <a href="mailto:the.morrigan.news@gmail.com" className="w-full py-3 bg-[#1152d4] text-white text-[10px] font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 hover:bg-[#0c3e98] transition-colors">
                            File Dispute
                        </a>
                    </div>
                </aside>
            </div>

            <style jsx global>{`
                .prose-intel-root {
                    font-family: var(--font-sans);
                    font-size: 1.15rem;
                    line-height: 1.9;
                    color: rgba(0,0,0,0.8);
                }
                .prose-intel-root p { margin-bottom: 2.2rem; }
                .prose-intel-root ul {
                    list-style-type: disc;
                    padding-left: 2rem;
                    margin-bottom: 2.2rem;
                }
                .prose-intel-root li {
                    margin-bottom: 0.8rem;
                }
                .markdown-h-intel {
                    font-family: var(--font-serif);
                    font-size: 2.2rem;
                    font-weight: 700;
                    color: #000;
                    margin: 4.5rem 0 1.5rem;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }
                @media (max-width: 1024px) {
                    .markdown-h-intel { font-size: 1.8rem; }
                }
            `}</style>
        </article>
    )
}
