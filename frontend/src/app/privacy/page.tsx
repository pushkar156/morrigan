'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'

export default function PrivacyPolicy() {
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
                        Privacy Policy
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
                                <span className="text-[#1152d4] font-semibold">Privacy</span>
                            </nav>
                        </div>
                    </div>
                </aside>

                <div className="w-full max-w-[70ch] mx-auto lg:mx-0">
                    <div className="briefing-content">
                        <div className="prose-intel-root">
                            <p>
                                The Morrigan ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tells you about your privacy rights and how the law protects you.
                            </p>

                            <h2 className="markdown-h-intel">1. The data we collect about you</h2>
                            <p>
                                Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).
                            </p>
                            <ul>
                                <li><strong>Identity Data</strong> includes first name, maiden name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                            </ul>

                            <h2 className="markdown-h-intel">2. How we use your personal data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul>
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal obligation.</li>
                            </ul>

                            <h2 className="markdown-h-intel">3. Data security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
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
                        <h4 className="text-[12px] font-bold text-black/80 font-sans mb-3 tracking-widest uppercase text-center">Contact DPO</h4>
                        <p className="text-[11.5px] text-black/50 leading-relaxed mb-6 text-center font-medium">
                            If you have any questions about this privacy policy or our privacy practices, please contact our data privacy manager.
                        </p>
                        <a href="mailto:the.morrigan.news@gmail.com" className="w-full py-3 bg-[#1152d4] text-white text-[10px] font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 hover:bg-[#0c3e98] transition-colors">
                            File Inquiry
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
