"use client"
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import chatbotAnimation from '../../public/chatbot.json'
import { usePathname } from 'next/navigation'
import { sendChatMessage } from '@/lib/api'
import type { ChatPayload } from '@/lib/types'

type Message = { role: 'bot' | 'user'; text: string; timestamp: Date }

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
    }, 14)
    return () => clearInterval(interval)
  }, [text])

  return (
    <div className="relative">
      <div className="markdown-chat">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {displayed + (done ? '' : ' ▮')}
        </ReactMarkdown>
      </div>
    </div>
  )
}

// ── Format time ─────────────────────────────────────────────────────────────
function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello! I\'m the Morrigan AI — your guide to financial intelligence. Ask me anything about markets, strategy, or our journal.', timestamp: new Date() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, isTyping])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 320)
    }
  }, [isOpen])

  // Auto-resize textarea
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }, [])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return
    const userText = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userText, timestamp: new Date() }])
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    setIsTyping(true)

    try {
      // Prepare payload with context
      const payload: ChatPayload = {
        message: userText,
        page_url: window.location.href,
      }

      // If we're on a blog page, try to get the article content for context
      if (pathname?.includes('/blog/')) {
        // Try to get the specific prose area first for cleaner content, fallback to entire article
        const prose = document.querySelector('.prose') || document.querySelector('article')
        if (prose) {
          payload.page_content = (prose as HTMLElement).innerText.slice(0, 5000)
        }
      }

      const res = await sendChatMessage(payload)
      
      setIsTyping(false)
      const reply: Message = {
        role: 'bot',
        text: res.response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, reply])
      if (!isOpen) setUnread(u => u + 1)
    } catch (err: any) {
      console.error('Chat failed:', err)
      setIsTyping(false)
      const errorReply: Message = {
        role: 'bot',
        text: "I encountered a synchronization error with the intelligence repository. Please verify your connection and try again.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorReply])
    }
  }, [input, isTyping, isOpen, pathname])

  const handleClearChat = () => {
    setMessages([{
      role: 'bot',
      text: 'Conversation cleared. How can I assist you?',
      timestamp: new Date()
    }])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Admin route guard
  if (pathname && pathname.startsWith('/admin')) return null

  const suggestions = [
    { label: 'What is Morrigan?', icon: '💡' },
    { label: 'Latest articles', icon: '📰' },
    { label: 'M&A coverage', icon: '🏢' },
    { label: 'Stock analysis', icon: '📊' },
  ]

  return (
    <div className="cb-container">

      {/* ── Chat Panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="cb-panel"
          >
            {/* Ambient decorations */}
            <div className="cb-ambient cb-ambient-1" />
            <div className="cb-ambient cb-ambient-2" />
            <div className="cb-top-shimmer" />

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="cb-header">
              <div className="cb-header-left">
                <div className="cb-header-avatar">
                  <Lottie animationData={chatbotAnimation} loop={true} className="cb-header-lottie" />
                </div>
                <div className="cb-header-info">
                  <h3 className="cb-header-name">The Morrigan</h3>
                  <div className="cb-header-status">
                    <span className="cb-status-dot" />
                    <span className="cb-status-text">Intelligence Active</span>
                  </div>
                </div>
              </div>
              <div className="cb-header-actions">
                <button onClick={handleClearChat} className="cb-header-btn" aria-label="Clear chat" title="Clear conversation">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <button onClick={() => setIsOpen(false)} className="cb-header-btn" aria-label="Close chat">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Accent bar */}
            <div className="cb-accent-bar" />

            {/* ── Messages ───────────────────────────────────────────────── */}
            <div ref={scrollRef} className="cb-messages">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`cb-msg-row ${m.role}`}
                >
                  {/* Bot avatar */}
                  {m.role === 'bot' && (
                    <div className="cb-msg-avatar">
                      <img src="/logo.png" alt="Morrigan" />
                    </div>
                  )}

                  <div className="cb-msg-content-col">
                    <div className={`cb-msg-bubble ${m.role} ${m.role === 'bot' ? 'bot-markdown-container' : ''}`}>
                      {m.role === 'bot' ? (
                          i === messages.length - 1 
                            ? <TypingMessage text={m.text} />
                            : <div className="markdown-chat"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown></div>
                      ) : (
                          m.text
                      )}
                    </div>
                    <span className="cb-msg-time">{formatTime(m.timestamp)}</span>
                  </div>

                  {/* User avatar */}
                  {m.role === 'user' && (
                    <div className="cb-msg-avatar user">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="cb-msg-row bot"
                  >
                    <div className="cb-msg-avatar">
                      <img src="/logo.png" alt="Morrigan" />
                    </div>
                    <div className="cb-typing-indicator">
                      {[0, 1, 2].map(j => (
                        <motion.div
                          key={j}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.9, delay: j * 0.15 }}
                          className="cb-typing-dot"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Suggested Prompts ─────────────────────────────────────── */}
            <AnimatePresence>
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: 0.5 }}
                  className="cb-suggestions"
                >
                  <span className="cb-suggestions-label">Suggested</span>
                  <div className="cb-suggestions-grid">
                    {suggestions.map(s => (
                      <button
                        key={s.label}
                        onClick={() => { setInput(s.label); inputRef.current?.focus() }}
                        className="cb-suggestion-btn"
                      >
                        <span className="cb-suggestion-icon">{s.icon}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input area ─────────────────────────────────────────────── */}
            <div className="cb-input-area">
              <div className="cb-input-wrap">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Morrigan anything…"
                  className="cb-input"
                  rows={1}
                />
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className={`cb-send-btn ${input.trim() && !isTyping ? 'active' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </motion.button>
              </div>
              <span className="cb-input-hint">Press Enter to send · Shift+Enter for new line</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Button ───────────────────────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(o => !o)}
        className={`cb-fab ${isOpen ? 'open' : ''}`}
      >
        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
            className="cb-fab-pulse"
          />
        )}

        {/* Icon transition */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="cb-fab-icon-wrap"
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
              transition={{ duration: 0.2 }}
              className="cb-fab-lottie"
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
              className="cb-fab-badge"
            >
              {unread}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <style jsx global>{`
        /* ══════════════════════════════════════════════════════════════
           CHATBOT — Morrigan AI Assistant
        ══════════════════════════════════════════════════════════════ */

        .cb-container {
          position: fixed;
          bottom: 32px; right: 32px;
          z-index: 2000;
          font-family: var(--font-sans);
        }

        /* ── Panel ── */
        .cb-panel {
          position: absolute;
          bottom: 80px; right: 0;
          width: 400px;
          max-height: calc(100vh - 140px);
          height: 580px;
          border-radius: 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(60px) saturate(180%);
          -webkit-backdrop-filter: blur(60px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow:
            0 32px 80px -16px rgba(0,0,0,0.22),
            0 0 1px rgba(0,0,0,0.1),
            0 0 48px rgba(0,209,255,0.06);
        }

        .cb-ambient {
          position: absolute;
          border-radius: 50%;
          pointer-events: none; z-index: 0;
        }
        .cb-ambient-1 {
          top: -80px; left: -80px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(0,209,255,0.08) 0%, transparent 70%);
        }
        .cb-ambient-2 {
          bottom: -60px; right: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(17,82,212,0.06) 0%, transparent 70%);
        }

        .cb-top-shimmer {
          position: absolute;
          top: 0; left: 12%; right: 12%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.95), transparent);
          z-index: 10; pointer-events: none;
        }

        /* ── Header ── */
        .cb-header {
          position: relative; z-index: 10;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: rgba(255,255,255,0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.04);
        }

        .cb-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cb-header-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cb-header-lottie {
          width: 100%; height: 100%;
        }

        .cb-header-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .cb-header-name {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1rem;
          color: #000309;
          letter-spacing: -0.01em;
          line-height: 1;
          margin: 0;
        }

        .cb-header-status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cb-status-dot {
          position: relative;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
        }
        .cb-status-dot::after {
          content: '';
          position: absolute; inset: -3px;
          border-radius: 50%;
          background: #22c55e;
          opacity: 0;
          animation: cb-dot-pulse 2s ease-out infinite;
        }
        @keyframes cb-dot-pulse {
          0%   { transform: scale(0.5); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        .cb-status-text {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #00d1ff;
        }

        .cb-header-actions {
          display: flex;
          gap: 6px;
        }

        .cb-header-btn {
          width: 32px; height: 32px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(0,0,0,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(0,3,9,0.35);
          cursor: pointer;
          transition: all 0.2s;
        }
        .cb-header-btn:hover {
          background: rgba(0,0,0,0.05);
          color: rgba(0,3,9,0.7);
          border-color: rgba(0,0,0,0.1);
        }

        .cb-accent-bar {
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(0,209,255,0.35), rgba(17,82,212,0.2), transparent);
          flex-shrink: 0;
          position: relative; z-index: 10;
        }

        /* ── Messages ── */
        .cb-messages {
          position: relative; z-index: 10;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 0;
          /* Premium scrollbar styling */
          scrollbar-width: thin;
          scrollbar-color: rgba(17, 82, 212, 0.2) transparent;
        }
        .cb-messages::-webkit-scrollbar { 
          width: 5px;
        }
        .cb-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        .cb-messages::-webkit-scrollbar-thumb {
          background: rgba(17, 82, 212, 0.15);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cb-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 209, 255, 0.3);
        }

        .cb-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 10px;
        }
        .cb-msg-row.user {
          flex-direction: row;
          justify-content: flex-end;
        }
        .cb-msg-row.bot {
          justify-content: flex-start;
        }

        .cb-msg-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 8px rgba(0,3,9,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cb-msg-avatar img {
          width: 18px; height: 18px;
          object-fit: contain;
        }
        .cb-msg-avatar.user {
          background: linear-gradient(135deg, #00d1ff, #1152d4);
          border: none;
          box-shadow: 0 3px 10px rgba(0,209,255,0.25);
        }

        .cb-msg-content-col {
          max-width: 72%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cb-msg-bubble {
          padding: 14px 18px;
          font-size: 0.82rem;
          font-weight: 500;
          line-height: 1.6;
          word-break: break-word;
        }
        .cb-msg-bubble.bot {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px 20px 20px 6px;
          color: #000309;
          box-shadow: 0 2px 12px rgba(0,3,9,0.05);
        }
        
        .bot-markdown-container .markdown-chat {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          font-size: 0.85rem;
          line-height: 1.6;
        }
        .markdown-chat p { margin: 0; }
        .markdown-chat strong { font-weight: 700; color: #000; }
        .markdown-chat em { font-style: italic; }
        .markdown-chat code {
          background: rgba(0,0,0,0.06);
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.75rem;
        }
        .markdown-chat pre {
          background: rgba(0,0,0,0.06);
          padding: 0.8rem;
          border-radius: 6px;
          overflow-x: auto;
        }
        .markdown-chat pre code {
          background: transparent;
          padding: 0;
        }
        .markdown-chat ul {
          list-style-type: disc;
          padding-left: 1.2rem;
        }
        .markdown-chat ol {
          list-style-type: decimal;
          padding-left: 1.2rem;
        }
        .markdown-chat h1, .markdown-chat h2, .markdown-chat h3 {
          font-family: var(--font-serif);
          font-weight: 700;
          color: #000;
          margin-top: 0.3rem;
          margin-bottom: 0.2rem;
        }
        .markdown-chat h3 { font-size: 1rem; }
        .markdown-chat a {
          color: #1152d4;
          text-decoration: underline;
        }
        .cb-msg-bubble.user {
          background: linear-gradient(135deg, #00d1ff 0%, #0088bb 100%);
          color: #fff;
          border-radius: 20px 20px 6px 20px;
          box-shadow: 0 6px 20px rgba(0,209,255,0.25);
        }

        .cb-msg-time {
          font-size: 0.56rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: rgba(0,3,9,0.2);
          padding: 0 4px;
        }
        .cb-msg-row.user .cb-msg-time {
          text-align: right;
        }

        .cb-typing-cursor {
          display: inline-block;
          width: 2px; height: 1em;
          background: #00d1ff;
          margin-left: 2px;
          vertical-align: text-bottom;
        }

        .cb-typing-indicator {
          padding: 14px 18px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px 20px 20px 6px;
          box-shadow: 0 2px 12px rgba(0,3,9,0.05);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .cb-typing-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d1ff, #1152d4);
        }

        /* ── Suggestions ── */
        .cb-suggestions {
          position: relative; z-index: 10;
          flex-shrink: 0;
          padding: 0 18px 12px;
        }

        .cb-suggestions-label {
          display: block;
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(0,3,9,0.2);
          margin-bottom: 10px;
          padding-left: 2px;
        }

        .cb-suggestions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .cb-suggestion-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,209,255,0.15);
          border-radius: 14px;
          font-family: var(--font-sans);
          font-size: 0.68rem;
          font-weight: 600;
          color: #1152d4;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .cb-suggestion-btn:hover {
          background: rgba(255,255,255,0.95);
          border-color: rgba(0,209,255,0.4);
          box-shadow: 0 4px 16px rgba(0,209,255,0.1);
          transform: translateY(-1px);
        }

        .cb-suggestion-icon {
          font-size: 0.85rem;
        }

        /* ── Input ── */
        .cb-input-area {
          position: relative; z-index: 10;
          flex-shrink: 0;
          padding: 12px 16px 16px;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: 1px solid rgba(0,0,0,0.04);
        }

        .cb-input-wrap {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: #fff;
          border: 1.5px solid rgba(0,0,0,0.08);
          border-radius: 18px;
          padding: 6px 6px 6px 18px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 10px rgba(0,3,9,0.04);
          transition: box-shadow 0.3s, border-color 0.3s;
        }
        .cb-input-wrap:focus-within {
          border-color: rgba(0,209,255,0.3);
          box-shadow: 0 0 0 3px rgba(0,209,255,0.08), inset 0 1px 0 rgba(255,255,255,0.9);
        }

        .cb-input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 500;
          color: #000309;
          caret-color: #00d1ff;
          resize: none;
          line-height: 1.5;
          max-height: 120px;
          padding: 8px 0;
        }
        .cb-input::placeholder {
          color: rgba(0,3,9,0.25);
        }

        .cb-send-btn {
          width: 38px; height: 38px;
          border-radius: 14px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,3,9,0.06);
          color: rgba(0,3,9,0.18);
          border: none;
          cursor: default;
          transition: all 0.25s ease;
        }
        .cb-send-btn.active {
          background: #000309;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,3,9,0.2);
        }
        .cb-send-btn.active:hover {
          background: #00d1ff;
          box-shadow: 0 4px 16px rgba(0,209,255,0.3);
        }

        .cb-input-hint {
          display: block;
          margin-top: 8px;
          text-align: center;
          font-size: 0.54rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: rgba(0,3,9,0.15);
        }

        /* ── FAB ── */
        .cb-fab {
          width: 62px; height: 62px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.4);
          background: #fff;
          box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.08);
          cursor: pointer;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.25s, border-color 0.25s;
        }
        .cb-fab.open {
          background: #000309;
          border-color: rgba(255,255,255,0.1);
        }

        .cb-fab-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(0,209,255,0.4);
          pointer-events: none;
        }

        .cb-fab-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cb-fab-lottie {
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(1.5);
        }

        .cb-fab-badge {
          position: absolute;
          top: -3px; right: -3px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #ef4444;
          border: 2.5px solid #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.55rem;
          font-weight: 800;
          color: #fff;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .cb-container {
            bottom: 20px; right: 20px;
          }
          .cb-panel {
            width: calc(100vw - 40px);
            max-height: calc(100vh - 120px);
            height: 520px;
            bottom: 72px;
            right: 0;
            border-radius: 24px;
          }
          .cb-fab {
            width: 56px; height: 56px;
          }
        }
      `}</style>
    </div>
  )
}
