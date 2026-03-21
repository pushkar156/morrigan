"use client"
import { useRef, useState } from 'react'
import { uploadImage } from '@/lib/api'

export default function RichTextEditor({
    content,
    onChange
}: {
    content: string
    onChange: (markdown: string) => void
}) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    // Keyboard Shortcuts (Macros)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b': e.preventDefault(); wrapText('**', '**'); break
                case 'i': e.preventDefault(); wrapText('*', '*'); break
                case 'k': e.preventDefault(); wrapText('[', '](url)'); break
            }
        }
        
        // Auto-bullet on Enter
        if (e.key === 'Enter') {
            const textarea = textareaRef.current
            if (!textarea) return
            const pos = textarea.selectionStart
            const lines = textarea.value.substring(0, pos).split('\n')
            const lastLine = lines[lines.length - 1]
            if (lastLine.trim().startsWith('- ')) {
                e.preventDefault()
                const before = textarea.value.substring(0, pos)
                const after = textarea.value.substring(pos)
                onChange(before + '\n- ' + after)
                setTimeout(() => { 
                    if(textarea) textarea.selectionStart = textarea.selectionEnd = pos + 3 
                }, 0)
            }
        }
    }

    const wrapText = (prefix: string, suffix: string) => {
        const textarea = textareaRef.current
        if (!textarea) return
        const start = textarea.selectionStart; const end = textarea.selectionEnd
        const text = textarea.value; const selected = text.substring(start, end)
        const newText = `${text.substring(0, start)}${prefix}${selected}${suffix}${text.substring(end)}`
        const newCursorPos = start + prefix.length + selected.length + suffix.length
        onChange(newText)
        setTimeout(() => {
            if(textarea) {
                textarea.focus(); 
                textarea.setSelectionRange(newCursorPos, newCursorPos)
            }
        }, 0)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            setIsUploading(true)
            try {
                const res = await uploadImage(file)
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
                const imageUrl = `${apiBase.replace('/api', '')}${res.url}`
                const markdownImage = `\n![${file.name}](${imageUrl})\n`
                const textarea = textareaRef.current
                if (textarea) {
                    const pos = textarea.selectionStart
                    onChange(textarea.value.substring(0, pos) + markdownImage + textarea.value.substring(pos))
                }
            } catch (err) { alert('Image upload failed.') } finally { setIsUploading(false) }
        }
    }

    return (
        <div className="intelligence-editor-wrapper bg-[#030711]/40 rounded-2xl border border-white/10 shadow-3xl overflow-hidden flex flex-col transition-all hover:border-white/20 relative">
            
            {isUploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black tracking-widest text-cyan-400">UPLOADING INTEL...</span>
                    </div>
                </div>
            )}

            <div className="editor-console-surface bg-black/20 h-[800px] overflow-hidden flex flex-col">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    placeholder="paste your code here."
                    className="flex-1 w-full h-full p-12 sm:p-20 bg-transparent text-[rgba(255,255,255,0.7)] font-mono text-base leading-relaxed outline-none resize-none selection:bg-cyan-500/30 selection:text-white overflow-y-auto whitespace-pre-wrap break-words"
                    data-lenis-prevent
                    spellCheck={false}
                />
            </div>

            <style jsx>{`
                .editor-console-surface textarea {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 209, 255, 0.2) transparent;
                }
                .editor-console-surface textarea::-webkit-scrollbar { width: 6px; }
                .editor-console-surface textarea::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); }
                .editor-console-surface textarea::-webkit-scrollbar-thumb { background: rgba(0, 209, 255, 0.15); border-radius: 10px; }
                .editor-console-surface textarea::placeholder { color: rgba(255,255,255,0.05); }
            `}</style>
        </div>
    )
}
