"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bold, Italic, Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, Quote, List, ListOrdered, Code,
    Undo, Redo, RemoveFormatting, FileText, Clock, Zap
} from 'lucide-react'

export default function RichTextEditor({
    content,
    onChange
}: {
    content: string
    onChange: (html: string) => void
}) {
    const [wordCount, setWordCount] = useState(0)
    const [readTime, setReadTime] = useState(1)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Placeholder.configure({
                placeholder: 'Begin your intelligence briefing...',
            }),
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#00d1ff] underline underline-offset-4 decoration-[#00d1ff]/40 transition-all hover:decoration-[#00d1ff]',
                },
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl max-w-full h-auto my-12 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] border border-white/5 ring-1 ring-white/10',
                },
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange(html)
            
            // Stats Calculation
            const text = editor.getText()
            const words = text.trim() === '' ? 0 : text.split(/\s+/).length
            setWordCount(words)
            setReadTime(Math.ceil(words / 200) || 1)
        },
        editorProps: {
            attributes: {
                class: 'outline-none text-[rgba(255,255,255,0.95)] font-sans',
            },
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor && content && editor.isEmpty) {
            editor.commands.setContent(content)
        }
    }, [content, editor])


    if (!editor) return null

    const CommandBtn = ({ onClick, isActive = false, disabled = false, children, title }: any) => (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            disabled={disabled}
            title={title}
            className={`
                group relative flex items-center justify-center p-2.5 rounded-xl transition-all duration-300
                ${isActive 
                    ? 'bg-[#00d1ff]/15 text-[#00d1ff] ring-1 ring-[#00d1ff]/40 shadow-[0_0_20px_rgba(0,209,255,0.1)]' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }
                ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {children}
            {isActive && (
                <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 rounded-xl bg-[#00d1ff]/5 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
            )}
        </button>
    )

    const addLink = () => {
        const url = window.prompt('ENTER INTEL LINK:')
        if (url) editor.chain().focus().setLink({ href: url }).run()
    }

    const addImage = () => {
        const url = window.prompt('IMAGE URL:')
        if (url) editor.chain().focus().setImage({ src: url }).run()
    }

    return (
        <div className="intelligence-editor-wrapper bg-[#030711]/40 rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col font-sans">
            {/* Bubble Selection Menu */}
            <BubbleMenu editor={editor} className="flex bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-1.5 gap-1">
                <CommandBtn isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></CommandBtn>
                <CommandBtn isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></CommandBtn>
                <CommandBtn onClick={addLink} isActive={editor.isActive('link')}><LinkIcon size={14} /></CommandBtn>
            </BubbleMenu>

            {/* Premium Command HUD (Toolbar) */}
            <div className="intelligence-toolbar-hud sticky top-0 z-50 p-3 flex items-center justify-between bg-black/60 backdrop-blur-2xl border-b border-white/5">
                <div className="flex items-center gap-1">
                    <div className="flex bg-white/5 p-1 rounded-xl gap-0.5">
                        <CommandBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={16} /></CommandBtn>
                        <CommandBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={16} /></CommandBtn>
                    </div>

                    <div className="w-[1px] h-6 bg-white/10 mx-2" />

                    <div className="flex gap-1">
                        <CommandBtn isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Headline 1"><Heading1 size={17} /></CommandBtn>
                        <CommandBtn isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Headline 2"><Heading2 size={17} /></CommandBtn>
                        <CommandBtn isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Briefing Quote"><Quote size={17} /></CommandBtn>
                    </div>

                    <div className="w-[1px] h-6 bg-white/10 mx-2" />

                    <div className="flex gap-1">
                        <CommandBtn isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={17} /></CommandBtn>
                        <CommandBtn isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={17} /></CommandBtn>
                        <CommandBtn isActive={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={17} /></CommandBtn>
                    </div>

                    <div className="w-[1px] h-6 bg-white/10 mx-2" />

                    <div className="flex gap-1">
                        <CommandBtn isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={17} /></CommandBtn>
                        <CommandBtn isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={17} /></CommandBtn>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Live Stats HUD */}
                    <div className="hidden md:flex items-center gap-5 px-4 py-1.5 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-white/30">
                            <FileText size={12} className="text-cyan-500/50" />
                            <span>{wordCount} WORDS</span>
                        </div>
                        <div className="w-[1px] h-3 bg-white/10" />
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-white/30">
                            <Clock size={12} className="text-cyan-500/50" />
                            <span>{readTime} MIN READ</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <CommandBtn onClick={addLink} isActive={editor.isActive('link')}><LinkIcon size={17} /></CommandBtn>
                        <CommandBtn onClick={addImage}><ImageIcon size={17} /></CommandBtn>
                        <CommandBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="RESET STYLES">
                            <Zap size={17} className="text-amber-500/50" />
                        </CommandBtn>
                    </div>
                </div>
            </div>

            {/* Document Surface */}
            <div className="intelligence-document-surface p-12 min-h-[600px] overflow-y-auto rich-editor-internal-scroll custom-prose" data-lenis-prevent style={{ maxHeight: '700px' }}>
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
                .intelligence-document-surface .ProseMirror { min-height: 500px; }
                .intelligence-document-surface .ProseMirror > * + * { margin-top: 1.8em; }
                .intelligence-document-surface .ProseMirror p { 
                    line-height: 1.85; 
                    font-size: 1.1rem; 
                    color: rgba(255,255,255,0.75); 
                    font-weight: 400;
                    letter-spacing: 0.01em;
                }
                .intelligence-document-surface .ProseMirror h1 { 
                    font-size: 3.2rem; 
                    font-weight: 800; 
                    margin-top: 2.5em; 
                    margin-bottom: 0.8em; 
                    color: #fff; 
                    letter-spacing: -0.03em;
                    line-height: 1.1;
                }
                .intelligence-document-surface .ProseMirror h2 { 
                    font-size: 2rem; 
                    font-weight: 700; 
                    margin-top: 2em; 
                    margin-bottom: 0.6em; 
                    color: #fff; 
                    letter-spacing: -0.02em;
                    border-left: 4px solid #00d1ff;
                    padding-left: 1rem;
                    line-height: 1.2;
                }
                .intelligence-document-surface .ProseMirror blockquote { 
                    border-left: 1px solid rgba(0,209,255,0.4); 
                    padding: 2rem 2.5rem; 
                    font-style: italic; 
                    color: rgba(255,255,255,0.6); 
                    background: linear-gradient(90deg, rgba(0,209,255,0.05) 0%, transparent 100%);
                    font-size: 1.2rem;
                    line-height: 1.7;
                    border-radius: 4px;
                }
                .intelligence-document-surface .ProseMirror pre { 
                    background: #000; 
                    padding: 2rem; 
                    border-radius: 16px; 
                    border: 1px solid rgba(255,255,255,0.05); 
                    box-shadow: inset 0 20px 40px rgba(0,0,0,0.5);
                    margin: 3rem 0;
                }
                .intelligence-document-surface .ProseMirror code { 
                    color: #00d1ff; 
                    background: rgba(0,209,255,0.1); 
                    padding: 0.2em 0.5em; 
                    border-radius: 4px; 
                    font-size: 0.9em;
                }
                .intelligence-document-surface .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: rgba(255,255,255,0.1);
                    pointer-events: none;
                    height: 0;
                    font-style: italic;
                    letter-spacing: 0.05em;
                }
                
                /* Selection HUD Enhancement */
                .ProseMirror-focused ::selection {
                    background: rgba(0,209,255,0.25);
                }
            `}</style>
        </div>
    )
}
