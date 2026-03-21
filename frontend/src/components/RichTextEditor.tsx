"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Typography from '@tiptap/extension-typography'
import { useCallback, useEffect, useState } from 'react'
import {
    Bold, Italic, Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, List, ListOrdered, Code,
    Undo, Redo, RemoveFormatting, PlusSquare, 
    Trash2, Columns, Rows, Zap, AlertTriangle, HelpCircle
} from 'lucide-react'

export default function RichTextEditor({
    content,
    onChange
}: {
    content: string
    onChange: (html: string) => void
}) {
    const [isSaving, setIsSaving] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Typography,
            Placeholder.configure({
                placeholder: 'Type "/" for commands or start writing...',
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#00d1ff] underline underline-offset-4 decoration-[#00d1ff]/40 transition-all hover:decoration-[#00d1ff]',
                },
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl max-w-full h-auto my-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5',
                },
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
            setIsSaving(true)
            setTimeout(() => setIsSaving(false), 2000)
        },
        editorProps: {
            attributes: {
                class: 'outline-none text-[rgba(255,255,255,0.9)] font-sans',
            },
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor && content && editor.isEmpty) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    const addLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('Image URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    if (!editor) return null

    const CommandBtn = ({ onClick, isActive = false, disabled = false, children, title, variant = 'default' }: any) => (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${isActive ? 'bg-[#00d1ff]/20 text-[#00d1ff] shadow-[0_0_15px_rgba(0,209,255,0.2)]' : 'text-white/40 hover:bg-white/5 hover:text-white'} ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'} ${variant === 'danger' ? 'hover:bg-red-500/20 hover:text-red-400' : ''}`}
        >
            {children}
        </button>
    )

    return (
        <div className="intelligence-editor-root relative bg-[#050912]/40 rounded-2xl border border-white/5 overflow-hidden flex flex-col font-sans">
            {/* Context Bubble Menu for Text Selection */}
            {editor && (
                <BubbleMenu 
                    editor={editor} 
                    shouldShow={({ state }) => !state.selection.empty && !editor.isActive('table')}
                    className="flex bg-[#0a0f1c] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-1 gap-1"
                >
                    <CommandBtn isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></CommandBtn>
                    <CommandBtn isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></CommandBtn>
                    <CommandBtn isActive={editor.isActive('link')} onClick={addLink}><LinkIcon size={14} /></CommandBtn>
                </BubbleMenu>
            )}

            {/* Table Control Menu */}
            {editor && (
                <BubbleMenu 
                    editor={editor} 
                    shouldShow={() => editor.isActive('table')}
                    className="flex bg-[#0a0f1c] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-1 gap-1"
                >
                    <CommandBtn title="Add Row Above" onClick={() => editor.chain().focus().addRowBefore().run()}><Rows size={14} className="rotate-180" /></CommandBtn>
                    <CommandBtn title="Add Row Below" onClick={() => editor.chain().focus().addRowAfter().run()}><Rows size={14} /></CommandBtn>
                    <CommandBtn title="Add Column Before" onClick={() => editor.chain().focus().addColumnBefore().run()}><Columns size={14} className="rotate-180" /></CommandBtn>
                    <CommandBtn title="Add Column After" onClick={() => editor.chain().focus().addColumnAfter().run()}><Columns size={14} /></CommandBtn>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <CommandBtn title="Delete Table" variant="danger" onClick={() => editor.chain().focus().deleteTable().run()}><Trash2 size={14} /></CommandBtn>
                </BubbleMenu>
            )}

            {/* Floating Slash Menu (Empty Line Only) */}
            {editor && (
                <FloatingMenu 
                    editor={editor} 
                    shouldShow={({ state }) => {
                        const { $from } = state.selection
                        return $from.parent.content.size === 0 && !$from.parent.type.name.includes('table')
                    }}
                    className="flex flex-col bg-[#0a0f1c]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-56 p-1.5"
                >
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl text-left transition-all group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00d1ff]/10 group-hover:text-[#00d1ff]"><Heading1 size={18} /></div>
                        <div><p className="text-sm font-bold text-white">Headline 1</p><p className="text-[10px] text-white/40">Large intelligence header</p></div>
                    </button>
                    <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl text-left transition-all group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00d1ff]/10 group-hover:text-[#00d1ff]"><Heading2 size={18} /></div>
                        <div><p className="text-sm font-bold text-white">Sub-Header</p><p className="text-[10px] text-white/40">Technical section heading</p></div>
                    </button>
                    <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl text-left transition-all group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00d1ff]/10 group-hover:text-[#00d1ff]"><PlusSquare size={18} /></div>
                        <div><p className="text-sm font-bold text-white">Data Matrix</p><p className="text-[10px] text-white/40">Insert intelligence table (3x3)</p></div>
                    </button>
                    <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl text-left transition-all group">
                        <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#00d1ff]/10 group-hover:text-[#00d1ff]"><AlertTriangle size={18} /></div>
                        <div><p className="text-sm font-bold text-white">Strategic Alert</p><p className="text-[10px] text-white/40">Highlight critical information</p></div>
                    </button>
                </FloatingMenu>
            )}

            {/* Ghost Toolbar */}
            <div className="intelligence-toolbar flex flex-wrap items-center gap-1.5 p-3 bg-white/[0.03] backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-1">
                    <CommandBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}><Undo size={16} /></CommandBtn>
                    <CommandBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}><Redo size={16} /></CommandBtn>
                </div>
                
                <div className="w-[1px] h-6 bg-white/10 mx-1" />

                <div className="flex items-center gap-1">
                    <CommandBtn isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></CommandBtn>
                    <CommandBtn isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></CommandBtn>
                </div>
                
                <div className="w-[1px] h-6 bg-white/10 mx-1" />

                <div className="flex items-center gap-1">
                    <CommandBtn isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={16} /></CommandBtn>
                    <CommandBtn isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></CommandBtn>
                </div>
                
                <div className="w-[1px] h-6 bg-white/10 mx-1" />

                <div className="flex items-center gap-1">
                    <CommandBtn isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></CommandBtn>
                    <CommandBtn isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></CommandBtn>
                </div>
                
                <div className="w-[1px] h-6 bg-white/10 mx-1" />

                <div className="flex items-center gap-1">
                    <CommandBtn isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Strategic Alert"><AlertTriangle size={16} /></CommandBtn>
                    <CommandBtn onClick={() => editor.chain().focus().insertContent('<blockquote class="market-intel"><strong>MARKET INTEL:</strong> Current trend detected...</blockquote>').run()} title="Market Intel"><Zap size={16} /></CommandBtn>
                    <CommandBtn onClick={() => editor.chain().focus().insertContent('<blockquote class="kiq"><strong>KIQ:</strong> What is the primary objective?</blockquote>').run()} title="Key Intelligence Question"><HelpCircle size={16} /></CommandBtn>
                </div>

                <div className="w-[1px] h-6 bg-white/10 mx-1" />
                
                <div className="flex items-center gap-1">
                    <CommandBtn title="Insert Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><PlusSquare size={16} /></CommandBtn>
                    <CommandBtn isActive={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={16} /></CommandBtn>
                </div>

                <div className="flex items-center gap-1 ml-auto">
                    {/* Auto-Save Pulse Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 mr-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-[#00d1ff] animate-pulse' : 'bg-[#00d1ff]/40 shadow-[0_0_8px_#00d1ff/20]'}`} />
                        <span className="text-[10px] font-black tracking-tighter text-white/40 uppercase">{isSaving ? 'Syncing...' : 'Encrypted'}</span>
                    </div>
                    <CommandBtn onClick={addLink} isActive={editor.isActive('link')}><LinkIcon size={16} /></CommandBtn>
                    <CommandBtn onClick={addImage}><ImageIcon size={16} /></CommandBtn>
                    <CommandBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear"><RemoveFormatting size={16} /></CommandBtn>
                </div>
            </div>
            
            {/* Write Field */}
            <div className="intelligence-write-field p-8 min-h-[500px] overflow-y-auto rich-editor-internal-scroll custom-prose" style={{ maxHeight: '600px' }}>
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
                .intelligence-write-field .ProseMirror > * + * { margin-top: 1.5em; }
                .intelligence-write-field .ProseMirror p { line-height: 1.8; font-size: 1.05rem; letter-spacing: 0.01em; color: rgba(255,255,255,0.8); }
                .intelligence-write-field .ProseMirror h1 { font-size: 2.75rem; font-weight: 800; margin-top: 2em; margin-bottom: 0.75em; color: #fff; letter-spacing: -0.02em; }
                .intelligence-write-field .ProseMirror h2 { font-size: 1.8rem; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.5em; color: #fff; letter-spacing: -0.01em; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25em; }
                
                /* Advanced Table Styles */
                .intelligence-write-field .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 2rem 0;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                }
                .intelligence-write-field .ProseMirror th, 
                .intelligence-write-field .ProseMirror td {
                    min-width: 1em;
                    border: 1px solid rgba(255,255,255,0.05);
                    padding: 0.75rem 1rem;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                    color: rgba(255,255,255,0.7);
                    font-size: 0.95rem;
                }
                .intelligence-write-field .ProseMirror th {
                    font-weight: 900;
                    text-align: left;
                    background: rgba(255,255,255,0.03);
                    color: #fff;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                }
                .intelligence-write-field .ProseMirror .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(0, 209, 255, 0.05);
                    pointer-events: none;
                }
                .intelligence-write-field .ProseMirror .column-resize-handle {
                    position: absolute;
                    right: -2px; top: 0; bottom: 0;
                    width: 4px; z-index: 20;
                    background-color: #00d1ff;
                    pointer-events: none;
                }

                /* Custom Callout/Widget Styles */
                .intelligence-write-field .ProseMirror blockquote { 
                    border-left: 3px solid #00d1ff; 
                    padding-left: 1.5rem; 
                    font-style: italic; 
                    color: rgba(255,255,255,0.6); 
                    background: rgba(0,209,255,0.03); 
                    padding-top: 1rem; 
                    padding-bottom: 1rem; 
                    border-radius: 0 8px 8px 0; 
                    box-shadow: inset 5px 0 15px rgba(0,209,255,0.05); 
                }
                .intelligence-write-field .ProseMirror blockquote.market-intel { 
                    border-left: 3px solid #ffcc00; 
                    background: rgba(255,204,0,0.03); 
                    box-shadow: inset 5px 0 15px rgba(255,204,0,0.05); 
                    color: rgba(255,255,255,0.7);
                }
                .intelligence-write-field .ProseMirror blockquote.market-intel strong { color: #ffcc00; }
                .intelligence-write-field .ProseMirror blockquote.kiq { 
                    border-left: 3px solid #a0a0ff; 
                    background: rgba(160,160,255,0.03); 
                    box-shadow: inset 5px 0 15px rgba(160,160,255,0.05); 
                    color: rgba(255,255,255,0.7);
                    font-style: normal;
                }
                .intelligence-write-field .ProseMirror blockquote.kiq strong { color: #a0a0ff; font-weight: 700; }

                .intelligence-write-field .ProseMirror code { background: rgba(0,209,255,0.1); padding: 0.2em 0.4em; border-radius: 6px; color: #00d1ff; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.9em; }
                .intelligence-write-field .ProseMirror pre { background: #000; padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); position: relative; }
                .intelligence-write-field .ProseMirror pre::before { content: 'CODE'; position: absolute; top: 0; right: 2rem; transform: translateY(-50%); background: #111; color: rgba(255,255,255,0.2); font-size: 0.5rem; font-weight: 900; letter-spacing: 0.2em; padding: 2px 8px; border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; }
                
                .intelligence-write-field .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: rgba(255,255,255,0.1);
                    pointer-events: none;
                    height: 0;
                    font-style: italic;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </div>
    )
}
