"use client"
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'CONNECTION ESTABLISHED. SYSTEM ONLINE.\nMORRIGAN INTELLIGENCE TERMINAL V1.0\nAWAITING INPUT...' }
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
        setMessages(prev => [...prev, { role: 'user', text: `> ${input}` }])
        setInput('')

        // Simulate terminal processing
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'bot', text: "PROCESSING QUERY... \nACCESSING RAG VECTOR DB >> CONNECTION PENDING..." }])
        }, 1000)
    }

    return (
        <div className="fixed bottom-8 right-8 z-[2000] font-mono">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="chatbot-window mb-4 w-[420px] h-[580px] bg-[#000511] border border-[#00d1ff]/30 shadow-[0_0_40px_rgba(0,209,255,0.15)] flex flex-col overflow-hidden relative"
                    >
                        {/* Terminal CRT Scanline Effect */}
                        <div className="absolute inset-0 z-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(0, 209, 255, 0.2) 1px, transparent 1px)', backgroundSize: '100% 4px' }} />

                        {/* Top Bar - Data Terminal Style */}
                        <div className="relative z-10 p-3 bg-[#0a1526] border-b border-[#00d1ff]/20 flex justify-between items-center text-[#00d1ff]">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-none animate-pulse" />
                                <h3 className="font-bold text-xs tracking-[0.3em] uppercase opacity-80">Morrigan OS // TERMINAL</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#00d1ff]/50 hover:text-white transition-colors text-xs tracking-widest"
                            >
                                [ TERMINATE ]
                            </button>
                        </div>

                        {/* Message Area */}
                        <div
                            ref={scrollRef}
                            className="relative z-10 flex-grow overflow-y-auto p-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-[#00d1ff]/20"
                        >
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'bot'
                                        ? 'text-[#00d1ff] opacity-90'
                                        : 'text-white opacity-70'
                                        }`}
                                >
                                    {m.text}
                                </motion.div>
                            ))}
                            {/* Blinking Cursor at bottom of active text */}
                            <motion.div
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-2 h-4 bg-[#00d1ff] mt-[-10px]"
                            />
                        </div>

                        {/* Input Area */}
                        <div className="relative z-10 p-4 bg-[#050a14] border-t border-[#00d1ff]/20 flex gap-2">
                            <span className="text-[#00d1ff] mt-2 mr-1 animate-pulse">$&gt;</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="ENTER QUERY PARAMETERS..."
                                className="flex-grow bg-transparent text-[#00d1ff] placeholder:text-[#00d1ff]/30 text-xs sm:text-sm outline-none uppercase font-mono tracking-wider"
                                autoFocus
                            />
                            <button
                                onClick={handleSend}
                                className="text-xs tracking-widest border border-[#00d1ff]/30 text-[#00d1ff] px-3 py-1 hover:bg-[#00d1ff] hover:text-[#000511] transition-all uppercase"
                            >
                                EXEC
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button - Radar Style */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-none border-2 flex items-center justify-center transition-all shadow-[0_0_20px_rgba(0,209,255,0.2)] ${isOpen ? 'bg-[#0a1526] border-red-500/50 text-red-500' : 'bg-[#000511] border-[#00d1ff]/50 text-[#00d1ff] hover:bg-[#00d1ff]/10'
                    }`}
            >
                {isOpen ? (
                    <span className="text-xl font-mono relative top-[-1px]">X</span>
                ) : (
                    <span className="font-mono text-[10px] font-bold tracking-widest flex flex-col items-center">
                        <span>INIT</span>
                        <span>RAG</span>
                    </span>
                )}
            </motion.button>
        </div>
    )
}
