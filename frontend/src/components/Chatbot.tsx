"use client"
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Welcome to access Morrigan Intelligence. How can I assist your inquiry today?' }
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

        // Simulate thinking
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', text: "I'm processing your request across our editorial database. Our full RAG capabilities are currently being calibrated for this interface." }])
        }, 1000)
    }

    return (
        <div className="fixed bottom-8 right-8 z-[2000]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="chatbot-window mb-4 w-[380px] h-[550px] bg-[rgba(10,25,48,0.9)] backdrop-blur-xl border border-[rgba(0,209,255,0.2)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
                    >
                        <div className="p-4 bg-[rgba(255,255,255,0.05)] border-bottom border-[rgba(255,255,255,0.1)] flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#00d1ff] rounded-full animate-pulse" />
                                <h3 className="text-white font-bold text-sm tracking-widest uppercase">Morrigan AI</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/50 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div
                            ref={scrollRef}
                            className="flex-grow overflow-y-auto p-6 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.1)]"
                        >
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: m.role === 'bot' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${m.role === 'bot'
                                            ? 'bg-[rgba(255,255,255,0.05)] text-white/90 self-start border border-[rgba(255,255,255,0.05)]'
                                            : 'bg-[#1152d4] text-white self-end shadow-lg shadow-[#1152d4]/20'
                                        }`}
                                >
                                    {m.text}
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-4 bg-[rgba(0,0,0,0.2)] flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                className="flex-grow bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2 text-white outline-none focus:border-[#00d1ff] transition-colors"
                            />
                            <button
                                onClick={handleSend}
                                className="bg-[#00d1ff] text-[#000309] p-2 rounded-lg hover:scale-105 active:scale-95 transition-transform"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,209,255,0.3)] transition-all ${isOpen ? 'bg-white text-[#000309]' : 'bg-[#00d1ff] text-[#000309]'
                    }`}
            >
                {isOpen ? (
                    <span className="text-xl font-bold">✕</span>
                ) : (
                    <img src="/chatbot.svg" alt="Chat" className="w-8 h-8" />
                )}
            </motion.button>
        </div>
    )
}
