"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import ImageExtension from '@tiptap/extension-image'
import { useCallback, useEffect } from 'react'
import {
    Bold, Italic, Link as LinkIcon, Image as ImageIcon,
    Heading1, Heading2, Quote, List, ListOrdered, Code,
    Undo, Redo, RemoveFormatting
} from 'lucide-react'

export default function RichTextEditor({
    content,
    onChange
}: {
    content: string
    onChange: (html: string) => void
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#00d1ff] underline underline-offset-4 decoration-[#00d1ff]/40',
                },
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full h-auto my-6',
                },
            })
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'outline-none min-h-[300px] text-[rgba(255,255,255,0.85)] font-sans',
            },
        },
        immediatelyRender: false,
    })

    useEffect(() => {
        if (editor && content) {
            const isSame = editor.getHTML() === content
            if (!isSame) {
                // To avoid losing cursor position, we only update if totally empty or if we really need to sync
                // For a simple admin UI, doing a replace is okay on first load
                if (editor.isEmpty) {
                    editor.commands.setContent(content)
                }
            }
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

    const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, title }: any) => (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-md transition-colors ${isActive ? 'bg-[rgba(0,209,255,0.15)] text-[#00d1ff]' : 'text-[rgba(255,255,255,0.5)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white'} ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </button>
    )

    return (
        <div className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] rounded-xl overflow-hidden flex flex-col hide-scrollbar">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)] shrink-0">
                <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                    <Undo size={16} />
                </ToolbarButton>
                <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                    <Redo size={16} />
                </ToolbarButton>
                
                <div className="w-[1px] h-5 bg-[rgba(255,255,255,0.1)] mx-1" />

                <ToolbarButton title="Bold" isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton title="Italic" isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic size={16} />
                </ToolbarButton>
                <ToolbarButton title="Clear Formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
                    <RemoveFormatting size={16} />
                </ToolbarButton>
                
                <div className="w-[1px] h-5 bg-[rgba(255,255,255,0.1)] mx-1" />

                <ToolbarButton title="Heading 1" isActive={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                    <Heading1 size={16} />
                </ToolbarButton>
                <ToolbarButton title="Heading 2" isActive={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 size={16} />
                </ToolbarButton>
                
                <div className="w-[1px] h-5 bg-[rgba(255,255,255,0.1)] mx-1" />

                <ToolbarButton title="Bullet List" isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List size={16} />
                </ToolbarButton>
                <ToolbarButton title="Ordered List" isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered size={16} />
                </ToolbarButton>
                
                <div className="w-[1px] h-5 bg-[rgba(255,255,255,0.1)] mx-1" />

                <ToolbarButton title="Blockquote" isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote size={16} />
                </ToolbarButton>
                <ToolbarButton title="Code Block" isActive={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                    <Code size={16} />
                </ToolbarButton>
                
                <div className="w-[1px] h-5 bg-[rgba(255,255,255,0.1)] mx-1" />

                <ToolbarButton title="Hyperlink" isActive={editor.isActive('link')} onClick={addLink}>
                    <LinkIcon size={16} />
                </ToolbarButton>
                <ToolbarButton title="Image URL" onClick={addImage}>
                    <ImageIcon size={16} />
                </ToolbarButton>
            </div>
            
            {/* Editor Content Area */}
            <div 
                className="p-5 flex-grow overflow-y-auto rich-editor-internal-scroll custom-prose"
                style={{ maxHeight: '600px' }}
            >
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
                .custom-prose .ProseMirror > * + * {
                    margin-top: 1.25em;
                }
                .custom-prose .ProseMirror p {
                    line-height: 1.7;
                    color: rgba(255,255,255,0.85);
                }
                .custom-prose .ProseMirror h1 {
                    font-size: 2.25rem;
                    font-weight: 700;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    font-family: var(--font-serif);
                    color: white;
                }
                .custom-prose .ProseMirror h2 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    font-family: var(--font-serif);
                    color: white;
                }
                .custom-prose .ProseMirror h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    font-family: var(--font-serif);
                    color: white;
                }
                .custom-prose .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    color: rgba(255,255,255,0.8);
                }
                .custom-prose .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    color: rgba(255,255,255,0.8);
                }
                .custom-prose .ProseMirror li {
                    margin-top: 0.5em;
                    margin-bottom: 0.5em;
                    color: rgba(255,255,255,0.8);
                }
                .custom-prose .ProseMirror blockquote {
                    border-left: 3px solid #00d1ff;
                    padding-left: 1rem;
                    margin-left: 0;
                    margin-right: 0;
                    font-style: italic;
                    color: rgba(255,255,255,0.6);
                }
                .custom-prose .ProseMirror code {
                    background: rgba(255,255,255,0.1);
                    padding: 0.2em 0.4em;
                    border-radius: 4px;
                    font-family: 'SF Mono', 'Fira Code', monospace;
                    font-size: 0.85em;
                    color: #00d1ff;
                }
                .custom-prose .ProseMirror pre {
                    background: #111;
                    color: #fff;
                    font-family: 'SF Mono', 'Fira Code', monospace;
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                }
                .custom-prose .ProseMirror pre code {
                    background: none;
                    padding: 0;
                    color: inherit;
                }
                .custom-prose .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                }
                .custom-prose .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: rgba(255,255,255,0.25);
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    )
}
