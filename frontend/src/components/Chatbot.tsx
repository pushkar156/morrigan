"use client"
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import chatbotAnimation from '../../public/chatbot.json'
import { usePathname } from 'next/navigation'

type Message = { role: 'bot' | 'user'; text: string }

// ── Character-by-character typing effect ─────────────────────────────────────
function TypingMessage({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, 16)
    return () => clearInterval(interval)
  }, [text])

  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{ display: 'inline-block', width: 2, height: '1em', background: '#00d1ff', marginLeft: 2, verticalAlign: 'text-bottom' }}
        />
      )}
    </span>
  )
}

// ── Ripple helper ─────────────────────────────────────────────────────────────
function useRipple() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const trigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600)
  }
  return { ripples, trigger }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function ChatbotLight() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello. I am the Morrigan AI assistant. How can I help you navigate the insights today?' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { ripples, trigger } = useRipple()

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 320)
    }
  }, [isOpen])

  const handleSend = () => {
    if (!input.trim() || isTyping) return
    const userText = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const reply: Message = { role: 'bot', text: 'I am analyzing the repository for that information. (Backend connection pending...)' }
      setMessages(prev => [...prev, reply])
      if (!isOpen) setUnread(u => u + 1)
    }, 1200)
  }

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    trigger(e)
    setIsOpen(o => !o)
  }

  // Admin route guard
  if (pathname && pathname.startsWith('/admin')) return null

  return (
    <div className="fixed bottom-8 right-8 z-[2000]" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── Chat Panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 w-[380px] h-[600px] rounded-[2.5rem] flex flex-col overflow-hidden relative"
            style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.65)',
              boxShadow: [
                '0 30px 80px -20px rgba(0,0,0,0.25)',
                '0 0 40px rgba(0,209,255,0.08)',
                'inset 0 1px 0 rgba(255,255,255,0.95)',
                'inset 0 -1px 0 rgba(0,0,0,0.03)',
              ].join(', '),
            }}
          >
            {/* Ambient orbs */}
            <div style={{ position: 'absolute', top: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,209,255,0.09) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(17,82,212,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            {/* Top shimmer */}
            <div style={{ position: 'absolute', top: 0, left: '12%', right: '12%', height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.95), transparent)', zIndex: 10, pointerEvents: 'none' }} />

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div
              className="relative z-10 flex-shrink-0 flex items-center border-b border-black/5"
              style={{
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Lottie + name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lottie animationData={chatbotAnimation} loop={true} className="w-full h-full" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-black text-lg leading-none" style={{ letterSpacing: '-0.01em' }}>
                    THE MORRIGAN
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div style={{ position: 'relative', width: 7, height: 7, flexShrink: 0 }}>
                      <motion.div
                        animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e' }}
                      />
                      <div style={{ position: 'absolute', inset: 1, borderRadius: '50%', background: '#22c55e' }} />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#00d1ff] uppercase">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cyan accent bar */}
            <div style={{ height: 2, background: 'linear-gradient(to right, transparent, rgba(0,209,255,0.4), rgba(17,82,212,0.2), transparent)', flexShrink: 0, position: 'relative', zIndex: 10 }} />

            {/* ── Messages ───────────────────────────────────────────────── */}
            <div
              ref={scrollRef}
              className="relative z-10 flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4 scrollbar-none"
              style={{ minHeight: 0 }}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex w-full items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot avatar */}
                  {m.role === 'bot' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,3,9,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src="/logo.png" alt="Morrigan" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-5 py-4 text-[13px] leading-relaxed font-medium ${
                      m.role === 'user'
                        ? 'rounded-[1.5rem] rounded-tr-sm'
                        : 'text-black rounded-[1.5rem] rounded-tl-sm'
                    }`}
                    style={m.role === 'user' ? {
                      background: 'linear-gradient(135deg, #00d1ff, #0099cc)',
                      color: '#fff',
                      boxShadow: '0 8px 24px rgba(0,209,255,0.3)',
                    } : {
                      background: 'rgba(255,255,255,0.75)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 2px 16px rgba(0,3,9,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
                    }}
                  >
                    {m.role === 'bot' && i === messages.length - 1
                      ? <TypingMessage text={m.text} />
                      : m.text
                    }
                  </div>

                  {/* User avatar */}
                  {m.role === 'user' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #00d1ff, #0077aa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,209,255,0.3)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Bouncing dots typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div
                      className="px-5 py-4 rounded-[1.5rem] rounded-tl-sm flex items-center gap-1.5"
                      style={{
                        background: 'rgba(255,255,255,0.75)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.8)',
                        boxShadow: '0 2px 16px rgba(0,3,9,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
                      }}
                    >
                      {[0, 1, 2].map(j => (
                        <motion.div
                          key={j}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.9, delay: j * 0.15 }}
                          style={{ width: 5, height: 5, borderRadius: '50%', background: 'linear-gradient(135deg, #00d1ff, #1152d4)' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Suggested prompts (first load only) ───────────────────── */}
            <AnimatePresence>
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative z-10 px-5 pb-3 flex gap-2 flex-wrap flex-shrink-0"
                >
                  {['What is Morrigan?', 'M&A coverage', 'Stock analysis'].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => { setInput(prompt); inputRef.current?.focus() }}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(0,209,255,0.25)',
                        color: '#1152d4',
                        letterSpacing: '0.04em',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.borderColor = 'rgba(0,209,255,0.5)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(0,209,255,0.25)' }}
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input area ─────────────────────────────────────────────── */}
            <div
              className="relative z-10 flex-shrink-0 border-t border-black/5"
              style={{
                padding: '10px 16px 16px',
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              <div
                className="flex items-center w-full rounded-full transition-all"
                style={{
                  background: '#fff',
                  border: '1.5px solid rgba(0,0,0,0.08)',
                  padding: '3px 3px 3px 16px',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,3,9,0.04)',
                }}
                onFocusCapture={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 0 3px rgba(0,209,255,0.15), inset 0 1px 0 rgba(255,255,255,0.9)'}
                onBlurCapture={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 8px rgba(0,3,9,0.04)'}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Morrigan..."
                  className="flex-1 min-w-0 bg-transparent text-sm outline-none font-medium"
                  style={{
                    height: 42,
                    lineHeight: '42px',
                    color: '#000309',
                    caretColor: '#00d1ff',
                    padding: 0,
                  }}
                />
                {/* Send button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: input.trim() && !isTyping ? '#000309' : 'rgba(0,3,9,0.07)',
                    color: input.trim() && !isTyping ? '#fff' : 'rgba(0,3,9,0.2)',
                    boxShadow: input.trim() && !isTyping ? '0 4px 12px rgba(0,3,9,0.2)' : 'none',
                    cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                    transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
                    border: 'none',
                  }}
                  onMouseEnter={e => { if (input.trim() && !isTyping) e.currentTarget.style.background = '#00d1ff' }}
                  onMouseLeave={e => { if (input.trim() && !isTyping) e.currentTarget.style.background = '#000309' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB — morphs into close button when open ─────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        animate={{ backgroundColor: isOpen ? '#000309' : '#ffffff' }}
        transition={{ duration: 0.25 }}
        className="w-16 h-16 rounded-full flex items-center justify-center ml-auto relative overflow-hidden border shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: isOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.4)',
        }}
      >
        {/* Ripples */}
        {ripples.map(r => (
          <motion.span
            key={r.id}
            initial={{ width: 0, height: 0, opacity: 0.35, x: r.x, y: r.y, translateX: '-50%', translateY: '-50%' }}
            animate={{ width: 130, height: 130, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{ position: 'absolute', borderRadius: '50%', background: 'rgba(0,209,255,0.35)', pointerEvents: 'none' }}
          />
        ))}

        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(0,209,255,0.45)', pointerEvents: 'none' }}
          />
        )}

        {/* Icon: Lottie when closed, X when open */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="lottie"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full h-full flex items-center justify-center scale-150"
            >
              <Lottie animationData={chatbotAnimation} loop={true} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute', top: -2, right: -2,
                width: 18, height: 18, borderRadius: '50%',
                background: '#ef4444', border: '2px solid #f8f9fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 800, color: '#fff',
              }}
            >
              {unread}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
