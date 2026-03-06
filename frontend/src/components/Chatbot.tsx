"use client"
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import chatbotAnimation from '../../public/chatbot.json'

import { usePathname } from 'next/navigation'

export default function Chatbot() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello. I am the Morrigan AI assistant. How can I help you navigate the insights today?' }
    ])
    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = () => {
        if (!input.trim()) return
        setMessages(prev => [...prev, { role: 'user', text: input }])
        setInput('')

        // Simulate seamless processing
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', text: "I am analyzing the repository for that information. (Backend connection pending...)" }])
        }, 1200)
    }

    if (pathname && pathname.startsWith('/admin')) return null

    return (
        <div className="fixed bottom-8 right-8 z-[2000]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-6 w-[380px] h-[600px] bg-white/85 backdrop-blur-3xl border border-white/60 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3),0_0_40px_rgba(0,209,255,0.1)] rounded-[2.5rem] flex flex-col overflow-hidden relative"
                    >
                        {/* Top Bar - Editorial Style */}
                        <div className="relative z-10 px-8 py-6 border-b border-black/5 flex justify-between items-center bg-white/40">
                            <div className="flex items-center gap-4">
                                {/* Lottie Avatar */}
                                <div className="w-12 h-12 rounded-full flex items-center justify-center -ml-2">
                                    <Lottie animationData={chatbotAnimation} loop={true} className="w-full h-full" />
                                </div>
                                <div>
                                    <h3 className="font-serif font-black text-black text-lg leading-none tracking-tight">Morrigan AI</h3>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#00d1ff] uppercase">Online</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors text-black/50 hover:text-black"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Message Area */}
                        <div
                            ref={scrollRef}
                            className="relative z-10 flex-grow overflow-y-auto px-6 py-8 flex flex-col gap-6 scrollbar-none"
                        >
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-5 py-4 text-[13px] leading-relaxed font-medium ${m.role === 'user'
                                            ? 'bg-black text-white rounded-[1.5rem] rounded-tr-sm shadow-xl'
                                            : 'bg-white/80 border border-black/5 text-black rounded-[1.5rem] rounded-tl-sm shadow-sm'
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="relative z-10 p-5 bg-white/50 border-t border-black/5">
                            <div className="relative flex items-center bg-white border border-black/10 rounded-full shadow-inner p-1 pl-6">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask Morrigan..."
                                    className="flex-grow bg-transparent text-black placeholder:text-black/30 text-sm outline-none font-medium h-12"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSend}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-[#00d1ff] transition-colors ml-2 shadow-md shrink-0"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button - Glassmorphism Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-[0_15px_30px_rgba(0,0,0,0.2)] ml-auto ${isOpen
                    ? 'bg-black text-white'
                    : 'bg-white backdrop-blur-md border border-white/40 text-black hover:shadow-[0_20px_40px_rgba(0,209,255,0.3)]'
                    }`}
            >
                {/* 
                    LOTTIE ANIMATION PLACEHOLDER 
                    When the Lottie JSON is ready, we will replace this entire inner content with the <Lottie /> component
                */}
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.svg key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </motion.svg>
                    ) : (
                        <motion.div key="open" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="w-full h-full flex items-center justify-center scale-150">
                            <Lottie animationData={chatbotAnimation} loop={true} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    )
}
