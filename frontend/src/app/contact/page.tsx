"use client"
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)

            setTimeout(() => {
                setIsSuccess(false)
            }, 5000)
        }, 1500)
    }

    const inputClasses = "w-full bg-transparent border-b-2 border-black/10 py-4 text-lg font-sans font-medium text-black placeholder:text-black/30 outline-none focus:border-[#00d1ff] transition-all rounded-none"

    return (
        <main className="min-h-screen pt-48 pb-24 relative bg-[#f8f9fa] selection:bg-black selection:text-white">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10 w-full">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Left Column: Huge typography and info */}
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="inline-block font-sans text-xs font-bold tracking-widest uppercase text-[#00d1ff] mb-8 font-semibold">
                                // Connect
                            </span>
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-black text-black tracking-tight leading-none mb-8">
                                Let's<br />Talk.
                            </h1>
                            <p className="font-sans text-lg text-black/60 leading-relaxed max-w-sm font-medium">
                                Have an inquiry or wishing to establish an institutional partnership? Direct your transmission to our editorial intelligence core.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="mt-20 space-y-12"
                        >
                            <div className="group">
                                <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-black/40 mb-3">Digital Correspondence</h3>
                                <a href="mailto:the.morrigan.news@gmail.com" className="font-sans text-xl font-bold text-black hover:text-[#00d1ff] transition-colors">
                                    the.morrigan.news@gmail.com
                                </a>
                            </div>

                            <div className="group">
                                <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-black/40 mb-3">Global Headquarters</h3>
                                <p className="font-sans text-xl font-bold text-black">
                                    Mumbai, India
                                </p>
                            </div>

                            <div className="group">
                                <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-black/40 mb-5">Network</h3>
                                <div className="flex gap-4">
                                    <a href="https://www.linkedin.com/company/education-the-morrigan" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                    <a href="mailto:the.morrigan.news@gmail.com" className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="4" width="20" height="16" rx="2" />
                                            <path d="M2 4l10 8 10-8" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Premium Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7 mt-12 lg:mt-0"
                    >
                        <div className="bg-white p-10 md:p-14 lg:p-16 rounded-[2.5rem] shadow-2xl border border-black/5 min-h-full flex flex-col justify-center relative overflow-hidden">
                            {/* Decorative ambient shape */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00d1ff]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />

                            <AnimatePresence mode="wait">
                                {isSuccess ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-center py-20"
                                    >
                                        <div className="w-24 h-24 bg-[#00d1ff] text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#00d1ff]/20">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <h2 className="text-3xl font-serif font-black text-black mb-4">Transmission Successful</h2>
                                        <p className="font-sans text-lg text-black/50 mx-auto max-w-sm font-medium">Your correspondence has been securely routed. We will reply shortly.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-10 relative z-10"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="relative group">
                                                <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-black/40 transition-colors group-focus-within:text-[#00d1ff] mb-2 block">Name</label>
                                                <input required type="text" placeholder="John Doe" className={inputClasses} />
                                            </div>

                                            <div className="relative group">
                                                <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-black/40 transition-colors group-focus-within:text-[#00d1ff] mb-2 block">Email address</label>
                                                <input required type="email" placeholder="john@example.com" className={inputClasses} />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-black/40 transition-colors group-focus-within:text-[#00d1ff] mb-2 block">Subject</label>
                                            <input required type="text" placeholder="Partnership Inquiry..." className={inputClasses} />
                                        </div>

                                        <div className="relative group">
                                            <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-black/40 transition-colors group-focus-within:text-[#00d1ff] mb-2 block">Your Message</label>
                                            <textarea required rows={4} placeholder="How can we assist you?" className={`${inputClasses} resize-none`} />
                                        </div>

                                        <div className="pt-8 w-full">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`w-full flex items-center justify-center gap-4 bg-black text-white px-8 py-5 rounded-2xl overflow-hidden transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-[#1a73e8] ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                                            >
                                                <span className="font-sans text-xs font-bold tracking-[0.2em] uppercase">
                                                    {isSubmitting ? 'Transmitting...' : 'Send Message'}
                                                </span>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
