"use client"
import { useCallback, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bold, Italic, Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, Quote, List, ListOrdered, Code,
    Undo, Redo, FileText, Clock, Zap,
    Table as TableIcon, CheckSquare, Highlighter,
    Eye, EyeOff, Layout, Terminal
} from 'lucide-react'

export default function RichTextEditor({
    content,
    onChange
}: {
    content: string
    onChange: (markdown: string) => void
}) {
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)
    const [readTime, setReadTime] = useState(1)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Sync counts
    useEffect(() => {
        const words = content.trim() ? content.split(/\s+/).length : 0
        setWordCount(words)
        setCharCount(content.length)
        setReadTime(Math.ceil(words / 200) || 1)

        // Auto-resize
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [content])

    const insertMarkdown = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart ?? 0
        const end = textarea.selectionEnd ?? 0
        const text = textarea.value
        const selected = text.substring(start, end)
        
        const before = text.substring(0, start)
        const after = text.substring(end)
        
        const newText = `${before}${prefix}${selected}${suffix}${after}`
        const newCursorPos = start + prefix.length + selected.length + suffix.length

        onChange(newText)
        
        // Restore focus and cursor
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
    }

    const CommandBtn = ({ onClick, children, title, active = false }: any) => (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            title={title}
            className={`
                group relative flex items-center justify-center p-2.5 rounded-xl transition-all duration-300
                ${active 
                    ? 'bg-[#00d1ff]/15 text-[#00d1ff] ring-1 ring-[#00d1ff]/40' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }
            `}
        >
            {children}
            {active && (
                <motion.div layoutId="activeGlow" className="absolute inset-0 rounded-xl bg-[#00d1ff]/5 pointer-events-none" />
            )}
        </button>
    )

    return (
        <div className="intelligence-editor-wrapper bg-[#030711]/40 rounded-2xl border border-white/10 shadow-3xl overflow-hidden flex flex-col font-sans mb-20 transition-all hover:border-white/20">
            {/* Executive Markdown HUD */}
            <div className="intelligence-toolbar-hud sticky top-0 z-50 p-3 flex flex-wrap items-center justify-between bg-black/80 backdrop-blur-2xl border-b border-white/5 gap-3">
                <div className="flex flex-wrap items-center gap-1">
                    <div className="flex bg-white/5 p-1 rounded-xl gap-0.5 mr-2">
                        <div className="flex items-center gap-2 px-3 text-[10px] font-black text-cyan-400 opacity-60">
                            <Terminal size={12} />
                            <span>INTEL CONSOLE V2.4</span>
                        </div>
                    </div>

                    <div className="flex gap-0.5">
                        <CommandBtn onClick={() => insertMarkdown('# ')} title="H1 Title"><Heading1 size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('## ')} title="H2 Section"><Heading2 size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('> ')} title="Quote Block"><Quote size={17} /></CommandBtn>
                    </div>

                    <div className="w-[1px] h-6 bg-white/10 mx-1" />

                    <div className="flex gap-0.5">
                        <CommandBtn onClick={() => insertMarkdown('**', '**')} title="Bold"><Bold size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('*', '*')} title="Italic"><Italic size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('`', '`')} title="Inline Code"><Code size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('==', '==')} title="Highlight"><Highlighter size={17} /></CommandBtn>
                    </div>

                    <div className="w-[1px] h-6 bg-white/10 mx-1" />

                    <div className="flex gap-0.5">
                        <CommandBtn onClick={() => insertMarkdown('- ')} title="Bullet List"><List size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('1. ')} title="Number List"><ListOrdered size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('- [ ] ')} title="Action Checklist"><CheckSquare size={17} /></CommandBtn>
                    </div>

                    <div className="w-[1px] h-6 bg-white/10 mx-1" />

                    <div className="flex gap-0.5">
                        <CommandBtn onClick={() => insertMarkdown('[', '](url)')} title="Link"><LinkIcon size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('![alt text](', ')')} title="Image"><ImageIcon size={17} /></CommandBtn>
                        <CommandBtn onClick={() => insertMarkdown('| Header 1 | Header 2 |\n| --- | --- |\n| Row 1 | Row 1 |\n')} title="Insert Table Template"><TableIcon size={17} /></CommandBtn>
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                    {/* Character Stats HUD */}
                    <div className="hidden lg:flex items-center gap-5 px-5 py-2 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-white/20 tracking-widest leading-none mb-1">DATA VOLUME</span>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-white/50">{wordCount} WORDS</span>
                                <span className="text-[10px] font-bold text-white/30">{charCount} B</span>
                            </div>
                        </div>
                        <div className="w-[1px] h-6 bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-white/20 tracking-widest leading-none mb-1">INTEL FLOW</span>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400/60">
                                <Clock size={12} />
                                <span>{readTime}M READ</span>
                            </div>
                        </div>
                    </div>

                    <CommandBtn onClick={() => onChange('')} title="PURGE CHANNEL">
                        <Zap size={17} className="text-amber-500/60" />
                    </CommandBtn>
                </div>
            </div>

            {/* High-Fidelity Markdown Console */}
            <div className="editor-console-surface p-0 bg-black/20 min-h-[700px]">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="INITIATING INTELLIGENCE LOG [MARKDOWN FORMATTING ACTIVE]..."
                    className="w-full min-h-[700px] p-12 sm:p-20 bg-transparent text-[rgba(255,255,255,0.7)] font-mono text-lg leading-relaxed outline-none resize-none selection:bg-cyan-500/30 selection:text-white"
                    data-lenis-prevent
                />
            </div>

            <style jsx>{`
                .editor-console-surface textarea {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.1) transparent;
                }
                .editor-console-surface textarea::-webkit-scrollbar {
                    width: 8px;
                }
                .editor-console-surface textarea::-webkit-scrollbar-track {
                    background: transparent;
                }
                .editor-console-surface textarea::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                .editor-console-surface textarea::placeholder {
                    color: rgba(255,255,255,0.05);
                    letter-spacing: 0.1em;
                    font-weight: 300;
                }
            `}</style>
        </div>
    )
}
