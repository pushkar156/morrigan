"use client"
import { useRef } from 'react'

export default function RichTextEditor({
    content,
    onChange
}: {
    content: string
    onChange: (markdown: string) => void
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    return (
        <div className="intelligence-editor-wrapper bg-[#030711]/40 rounded-2xl border border-white/10 shadow-3xl overflow-hidden flex flex-col font-sans transition-all hover:border-white/20">
            {/* High-Fidelity Internally Scrollable Markdown Console */}
            <div className="editor-console-surface p-0 bg-black/20 h-[800px] overflow-hidden">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="INITIATING INTELLIGENCE LOG [MARKDOWN FORMATTING ACTIVE]..."
                    className="w-full h-full p-12 sm:p-20 bg-transparent text-[rgba(255,255,255,0.7)] font-mono text-lg leading-relaxed outline-none resize-none selection:bg-cyan-500/30 selection:text-white"
                    data-lenis-prevent
                    spellCheck={false}
                />
            </div>

            <style jsx>{`
                .editor-console-surface textarea {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 209, 255, 0.2) transparent;
                }
                .editor-console-surface textarea::-webkit-scrollbar {
                    width: 6px;
                }
                .editor-console-surface textarea::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }
                .editor-console-surface textarea::-webkit-scrollbar-thumb {
                    background: rgba(0, 209, 255, 0.15);
                    border-radius: 10px;
                    transition: background 0.3s;
                }
                .editor-console-surface textarea::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 209, 255, 0.3);
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
