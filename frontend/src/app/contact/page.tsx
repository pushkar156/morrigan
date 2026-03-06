"use client"
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)

            // Reset success message after 5 seconds
            setTimeout(() => {
                setIsSuccess(false)
            }, 5000)
        }, 1500)
    }

    return (
        <main className="min-h-screen pt-32 pb-24 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00d1ff]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1152d4]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full bg-black/5 text-[10px] font-black tracking-[0.2em] uppercase text-black/60 mb-6">
                            Connect
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-black text-black tracking-tight leading-[1.1] mb-6">
                            Get In Touch
                        </h1>
                        <p className="text-lg md:text-xl font-sans font-medium text-black/60 leading-relaxed max-w-2xl mx-auto">
                            Have a question, feedback, or want to explore an institutional partnership? Send us a message and our editorial team will respond promptly.
                        </p>
                    </motion.div>
                </div>

                {/* Contact Grid Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-stretch">

                    {/* Left: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-2 flex flex-col justify-center space-y-12"
                    >
                        <div>
                            <h2 className="text-3xl font-serif font-black tracking-tight text-black mb-10">Contact Information</h2>

                            <div className="space-y-10">
                                <div className="group">
                                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-black/40 mb-3 group-hover:text-[#00d1ff] transition-colors">Digital Correspondence</h3>
                                    <a href="mailto:the.morrigan.news@gmail.com" className="text-xl font-semibold text-black hover:opacity-70 transition-opacity">
                                        the.morrigan.news@gmail.com
                                    </a>
                                </div>

                                <div className="group">
                                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-black/40 mb-3 group-hover:text-[#00d1ff] transition-colors">Global Headquarters</h3>
                                    <p className="text-xl font-semibold text-black">
                                        Mumbai, India
                                    </p>
                                </div>

                                <div className="group">
                                    <h3 className="text-xs font-black tracking-[0.2em] uppercase text-black/40 mb-3 group-hover:text-[#00d1ff] transition-colors">Social Network</h3>
                                    <div className="flex gap-4">
                                        <a href="https://www.linkedin.com/company/education-the-morrigan" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </a>
                                        <a href="mailto:the.morrigan.news@gmail.com" className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="M2 4l10 8 10-8" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white/70 backdrop-blur-3xl border border-white/60 p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1),0_0_40px_rgba(0,209,255,0.05)] h-full">
                            <h2 className="text-3xl font-serif font-black tracking-tight text-black mb-10">Send a Message</h2>

                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center px-6"
                                >
                                    <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-6 shadow-xl">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-serif font-black text-black mb-4">Message Received</h3>
                                    <p className="text-black/60 font-medium">Thank you for your correspondence. Our team will review and respond to you shortly.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                required
                                                className="w-full bg-white/50 border border-black/10 rounded-2xl px-6 py-4 text-sm font-medium text-black placeholder:text-black/30 outline-none focus:border-black/30 focus:bg-white transition-all shadow-inner"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Your Email"
                                                required
                                                className="w-full bg-white/50 border border-black/10 rounded-2xl px-6 py-4 text-sm font-medium text-black placeholder:text-black/30 outline-none focus:border-black/30 focus:bg-white transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Subject"
                                            required
                                            className="w-full bg-white/50 border border-black/10 rounded-2xl px-6 py-4 text-sm font-medium text-black placeholder:text-black/30 outline-none focus:border-black/30 focus:bg-white transition-all shadow-inner"
                                        />
                                    </div>

                                    <div>
                                        <textarea
                                            placeholder="Tell us more about your inquiry..."
                                            rows={6}
                                            required
                                            className="w-full bg-white/50 border border-black/10 rounded-2xl px-6 py-4 text-sm font-medium leading-relaxed text-black placeholder:text-black/30 outline-none focus:border-black/30 focus:bg-white transition-all shadow-inner resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full bg-black text-white font-black tracking-[0.2em] text-xs uppercase py-5 rounded-2xl transition-all shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        {isSubmitting ? 'Sending Transmission...' : 'Execute Transmission'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
