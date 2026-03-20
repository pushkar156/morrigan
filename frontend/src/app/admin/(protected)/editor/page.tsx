"use client"
import { useState, useRef, useCallback, useEffect, Suspense, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBlog, updateBlog, uploadImage, fetchAdminBlogs } from '@/lib/api'
import type { Blog } from '@/lib/types'
import RichTextEditor from '@/components/RichTextEditor'

export default function AdminEditorPage() {
    return (
        <Suspense fallback={<div className="adm-editor-loading">Loading Command Suite...</div>}>
            <AdminEditor />
        </Suspense>
    )
}

function AdminEditor() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('id')

    // -- State --
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
    const [isSaving, setIsSaving] = useState(false)
    const [isZenMode, setIsZenMode] = useState(false)
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [tagInput, setTagInput] = useState('')
    
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        category: 'stock-analysis',
        read_time: '5',
        featured_image: '',
        content: '',
        status: 'draft',
        tags: [] as string[]
    })

    // -- Metrics --
    const metrics = useMemo(() => {
        const text = formData.content.replace(/<[^>]*>?/gm, '') // Strip HTML
        const words = text.trim().split(/\s+/).filter(w => w.length > 0)
        const wordCount = words.length
        const rawMinutes = Math.max(1, Math.ceil(wordCount / 225))
        return { wordCount, readTime: rawMinutes }
    }, [formData.content])

    useEffect(() => {
        setFormData(prev => ({ ...prev, read_time: String(metrics.readTime) }))
    }, [metrics.readTime])

    // -- Load Data --
    useEffect(() => {
        if (editId) {
            fetchAdminBlogs().then(blogs => {
                const blog = blogs.find(b => b.id === editId)
                if (blog) {
                    setFormData({
                        title: blog.title,
                        excerpt: blog.excerpt || '',
                        category: blog.category || 'stock-analysis',
                        read_time: String(blog.read_time),
                        featured_image: blog.featured_image || '',
                        content: blog.content,
                        status: blog.status,
                        tags: blog.tags || []
                    })
                }
            }).catch(err => console.error('Failed to load blog:', err))
        }
    }, [editId])

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!formData.title.trim()) return
        setIsSaving(true)

        try {
            let imageUrl = formData.featured_image
            if (imageFile) {
                const uploadRes = await uploadImage(imageFile)
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
                imageUrl = `${apiBase.replace('/api', '')}${uploadRes.url}`
            }

            const payload = {
                title: formData.title,
                content: formData.content,
                excerpt: formData.excerpt || undefined,
                category: formData.category,
                read_time: parseInt(formData.read_time) || 5,
                featured_image: imageUrl || undefined,
                status: formData.status,
                tags: formData.tags.length > 0 ? formData.tags : undefined,
            }

            if (editId) await updateBlog(editId, payload)
            else await createBlog(payload)

            router.push('/admin/dashboard')
        } catch (err: any) {
            alert('Failed to save: ' + err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const categories = [
        { id: 'back-to-basics', name: 'Back to Basics' },
        { id: 'case-studies', name: 'Case Studies' },
        { id: 'stock-analysis', name: 'Stock Analysis' },
        { id: '100-days-challenge', name: '100 Days Challenge' },
        { id: 'ma-diaries', name: 'M&A Diaries' }
    ]

    return (
        <div className={`adm-editor-root ${isZenMode ? 'zen-active' : ''}`}>
            {/* Header HUD */}
            <AnimatePresence>
                {!isZenMode && (
                    <motion.header 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="adm-editor-header"
                    >
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <Link href="/admin/dashboard" className="adm-editor-back-hud">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                                    <span>VAULT REPOSITORY</span>
                                </Link>
                                <h1 className="adm-editor-title-main">{editId ? 'ARTICLE EDITOR' : 'NEW INTEL'}</h1>
                            </div>

                            <div className="adm-editor-top-actions">
                                <button onClick={() => setIsZenMode(true)} className="adm-editor-tool-btn" title="Focus Mode">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
                                    <span>ZEN</span>
                                </button>
                                <div className="adm-editor-tab-hud">
                                    <div className="tab-slider" style={{ transform: `translateX(${activeTab === 'edit' ? '0%' : '100%'})` }} />
                                    <button onClick={() => setActiveTab('edit')} className={activeTab === 'edit' ? 'active' : ''}>EDIT</button>
                                    <button onClick={() => setActiveTab('preview')} className={activeTab === 'preview' ? 'active' : ''}>PREVIEW</button>
                                </div>
                            </div>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>

            <main className="adm-editor-viewport">
                {activeTab === 'edit' ? (
                    <div className="adm-editor-grid">
                        {/* Write Column */}
                        <div className="adm-editor-main-col">
                            <motion.div layout className="adm-editor-glass-card main-writing-card">
                                <input
                                    type="text"
                                    placeholder="REPORT HEADLINE..."
                                    className="adm-editor-input-hero"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                                <div className="adm-editor-field">
                                    <div className="field-header">
                                        <label>EXECUTIVE SUMMARY</label>
                                        <span className="char-count">{formData.excerpt.length}/300</span>
                                    </div>
                                    <textarea
                                        placeholder="Briefly describe the report scope..."
                                        className="adm-editor-text-area-minimal"
                                        rows={2}
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    />
                                </div>
                                <div className="adm-editor-field editor-body-field">
                                    <label>INTELLIGENCE BODY</label>
                                    <div className="rich-editor-container-styled">
                                        <RichTextEditor 
                                            content={formData.content} 
                                            onChange={(html) => setFormData({ ...formData, content: html })} 
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Config Sidebar */}
                        <AnimatePresence>
                            {!isZenMode && (
                                <motion.aside 
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 40 }}
                                    className="adm-editor-side-col"
                                >
                                    <div className="adm-editor-glass-card sidebar-config">
                                        <div className="adm-editor-field">
                                            <label>CLASSIFICATION</label>
                                            <div className="adm-editor-custom-select">
                                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
                                                </select>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                                            </div>
                                        </div>

                                        <div className="adm-editor-field">
                                            <label>TAGS</label>
                                            <div className="tag-input-wrap">
                                                <input 
                                                    type="text" 
                                                    placeholder="ADD TAG..." 
                                                    value={tagInput}
                                                    onChange={e => setTagInput(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            const val = tagInput.trim()
                                                            if (val && !formData.tags.includes(val)) {
                                                                setFormData(p => ({ ...p, tags: [...p.tags, val] }))
                                                                setTagInput('')
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="tag-list">
                                                {formData.tags.map(t => (
                                                    <span key={t} className="tag-pill">
                                                        {t}
                                                        <button onClick={() => setFormData(p => ({ ...p, tags: p.tags.filter(tg => tg !== t) }))}>×</button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="adm-editor-field">
                                            <label>COVER INTEL (IMAGE)</label>
                                            <div className="adm-editor-dropzone-tech" onClick={() => fileInputRef.current?.click()}>
                                                {formData.featured_image ? (
                                                    <div className="image-filled">
                                                        <img src={formData.featured_image} alt="Cover" />
                                                        <button onClick={(e) => { e.stopPropagation(); setFormData({...formData, featured_image: ''}); setImageFile(null); }}>REMOVE</button>
                                                    </div>
                                                ) : (
                                                    <div className="dropzone-empty">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                                                        <span>DROP SCAN</span>
                                                    </div>
                                                )}
                                                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={e => {
                                                    const f = e.target.files?.[0]
                                                    if(f) {
                                                        setImageFile(f)
                                                        setFormData({...formData, featured_image: URL.createObjectURL(f)})
                                                    }
                                                }} />
                                            </div>
                                        </div>

                                        <div className="sidebar-metrics">
                                            <div className="metric">
                                                <span className="label">WORD COUNT</span>
                                                <span className="val">{metrics.wordCount}</span>
                                            </div>
                                            <div className="metric">
                                                <span className="label">READ TIME</span>
                                                <span className="val">{metrics.readTime}M</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.aside>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="adm-editor-preview-frame">
                         {/* Re-use preview block from original code but wrapped in premium container */}
                         <div className="preview-inner">
                            <div className="preview-hero" style={{ backgroundImage: `url(${formData.featured_image || '/logo.png'})` }}>
                                <div className="hero-overlay" />
                                <div className="hero-content">
                                    <span className="cat">{categories.find(c => c.id === formData.category)?.name}</span>
                                    <h1>{formData.title || 'UNTITLED REPORT'}</h1>
                                    <div className="meta">{metrics.readTime} MIN READ • PREVIEW MODE</div>
                                </div>
                            </div>
                            <div className="preview-body">
                                {formData.excerpt && <p className="excerpt">"{formData.excerpt}"</p>}
                                <div className="content prose prose-invert" dangerouslySetInnerHTML={{ __html: formData.content }} />
                            </div>
                         </div>
                    </div>
                )}
            </main>

            {/* Global Executive HUD (Floating Bar) */}
            <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="adm-editor-exec-hud"
            >
                <div className="exec-hud-inner">
                    <div className="exec-left">
                        {isZenMode && (
                            <button onClick={() => setIsZenMode(false)} className="exit-zen-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                                EXIT ZEN
                            </button>
                        )}
                        <span className="save-status">
                            <span className="status-dot pulsing" />
                            {isSaving ? 'SYNCING...' : 'LOCAL CACHE READY'}
                        </span>
                    </div>

                    <div className="exec-center">
                        <div className="status-segment-mini">
                            <div className="seg-bg" style={{ transform: `translateX(${formData.status === 'draft' ? '0%' : '100%'})` }} />
                            <button onClick={() => setFormData({...formData, status: 'draft'})} className={formData.status === 'draft' ? 'active' : ''}>DRAFT</button>
                            <button onClick={() => setFormData({...formData, status: 'published'})} className={formData.status === 'published' ? 'active' : ''}>LIVE</button>
                        </div>
                    </div>

                    <div className="exec-right">
                        <button 
                            disabled={isSaving || !formData.title.trim()} 
                            onClick={() => handleSave()}
                            className="exec-submit-btn"
                        >
                            {formData.status === 'published' ? 'EXECUTE PUBLISH' : 'FINALIZE DRAFT'}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                :root {
                    --c-cyan: #00d1ff;
                    --c-blue: #1152d4;
                    --glass: rgba(255,255,255,0.02);
                    --glass-border: rgba(255,255,255,0.06);
                }

                .adm-editor-root {
                    min-height: 100vh;
                    padding: 40px 20px 120px;
                    max-width: 1300px;
                    margin: 0 auto;
                    transition: padding 0.5s ease;
                }
                .adm-editor-root.zen-active {
                    max-width: 800px;
                    padding-top: 80px;
                }

                /* ══ Header HUD ══ */
                .adm-editor-header { margin-bottom: 40px; }
                .adm-editor-back-hud {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    color: rgba(255,255,255,0.3);
                    margin-bottom: 8px;
                    transition: color 0.3s;
                }
                .adm-editor-back-hud:hover { color: var(--c-cyan); }
                .adm-editor-title-main {
                    font-family: var(--font-serif);
                    font-size: 2.2rem;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    color: #fff;
                }

                .adm-editor-top-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .adm-editor-tool-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: var(--glass);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    color: rgba(255,255,255,0.4);
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    transition: all 0.3s;
                }
                .adm-editor-tool-btn:hover { color: var(--c-cyan); border-color: rgba(0,209,255,0.3); background: rgba(0,209,255,0.04); }

                .adm-editor-tab-hud {
                    position: relative;
                    display: flex;
                    background: var(--glass);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    padding: 4px;
                    height: 42px;
                }
                .adm-editor-tab-hud .tab-slider {
                    position: absolute; top: 4px; bottom: 4px; left: 4px;
                    width: calc(50% - 4px);
                    background: rgba(255,255,255,0.08);
                    border-radius: 8px;
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .adm-editor-tab-hud button {
                    position: relative;
                    z-index: 1;
                    width: 70px;
                    font-size: 0.6rem;
                    font-weight: 800;
                    color: rgba(255,255,255,0.25);
                    transition: color 0.3s;
                }
                .adm-editor-tab-hud button.active { color: var(--c-cyan); }

                /* ══ Layout ══ */
                .adm-editor-grid {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 40px;
                    align-items: start;
                }
                .zen-active .adm-editor-grid { grid-template-columns: 1fr; }

                .adm-editor-glass-card {
                    background: rgba(255,255,255,0.015);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 28px;
                    padding: 48px;
                    box-shadow: 0 20px 50px -20px rgba(0,0,0,0.5);
                }
                .sidebar-config { padding: 32px; position: sticky; top: 40px; }

                /* ══ Input Styling ══ */
                .adm-editor-input-hero {
                    width: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-family: var(--font-serif);
                    font-size: 3.5rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 40px;
                    letter-spacing: -0.03em;
                }
                .adm-editor-input-hero::placeholder { color: rgba(255,255,255,0.05); }

                .adm-editor-field { margin-bottom: 32px; }
                .adm-editor-field label {
                    display: block;
                    font-size: 0.6rem;
                    font-weight: 800;
                    letter-spacing: 0.25em;
                    color: rgba(255,255,255,0.2);
                    margin-bottom: 12px;
                }
                .field-header { display: flex; justify-content: space-between; align-items: baseline; }
                .char-count { font-size: 0.6rem; color: rgba(255,255,255,0.1); font-weight: 700; }

                .adm-editor-text-area-minimal {
                    width: 100%;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    padding: 16px;
                    color: rgba(255,255,255,0.7);
                    font-size: 0.95rem;
                    line-height: 1.6;
                    outline: none;
                    resize: none;
                    transition: border-color 0.3s;
                }
                .adm-editor-text-area-minimal:focus { border-color: rgba(0,209,255,0.3); }

                /* Sidebar Select */
                .adm-editor-custom-select {
                    position: relative;
                }
                .adm-editor-custom-select select {
                    width: 100%;
                    height: 48px;
                    background: var(--glass);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    padding: 0 16px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #fff;
                    appearance: none;
                    outline: none;
                }
                .adm-editor-custom-select select option { background: #0a1120; }
                .adm-editor-custom-select svg {
                    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
                    color: rgba(255,255,255,0.2); pointer-events: none;
                }

                /* Tags */
                .tag-input-wrap input {
                    width: 100%; height: 44px;
                    background: var(--glass);
                    border: 1px solid var(--glass-border);
                    border-radius: 10px;
                    padding: 0 14px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--c-cyan);
                    outline: none;
                }
                .tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
                .tag-pill {
                    display: flex; align-items: center; gap: 8px;
                    padding: 6px 12px;
                    background: rgba(0,209,255,0.08);
                    border: 1px solid rgba(0,209,255,0.15);
                    border-radius: 8px;
                    font-size: 0.6rem; font-weight: 800; color: var(--c-cyan);
                }
                .tag-pill button { color: rgba(255,255,255,0.3); font-size: 1rem; line-height: 1; }

                /* Dropzone Tech */
                .adm-editor-dropzone-tech {
                    position: relative;
                    width: 100%; height: 160px;
                    background: rgba(255,255,255,0.01);
                    border: 1px dashed var(--glass-border);
                    border-radius: 16px;
                    cursor: pointer;
                    overflow: hidden;
                    transition: all 0.3s;
                }
                .adm-editor-dropzone-tech:hover { border-color: var(--c-cyan); background: rgba(0,209,255,0.02); }
                .dropzone-empty {
                    height: 100%; width: 100%;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    gap: 12px; color: rgba(255,255,255,0.1);
                }
                .dropzone-empty span { font-size: 0.6rem; font-weight: 900; letter-spacing: 0.2em; }
                .image-filled { width: 100%; height: 100%; position: relative; }
                .image-filled img { width: 100%; height: 100%; object-fit: cover; }
                .image-filled button {
                    position: absolute; top: 12px; right: 12px;
                    padding: 6px 12px; background: rgba(0,0,0,0.6); color: #fff;
                    font-size: 0.55rem; font-weight: 900; border-radius: 6px; backdrop-filter: blur(4px);
                }

                /* Metrics */
                .sidebar-metrics {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
                    margin-top: 40px; border-top: 1px solid var(--glass-border); padding-top: 24px;
                }
                .metric .label { font-size: 0.55rem; color: rgba(255,255,255,0.1); display: block; margin-bottom: 4px; }
                .metric .val { font-size: 1.2rem; font-family: var(--font-serif); color: var(--c-cyan); font-weight: 700; }

                /* ══ Executive HUD ══ */
                .adm-editor-exec-hud {
                    position: fixed; left: 0; right: 0; bottom: 0; 
                    height: 90px;
                    background: rgba(0,0,0,0.2);
                    backdrop-filter: blur(30px);
                    border-top: 1px solid var(--glass-border);
                    display: flex; align-items: center;
                    z-index: 100;
                    padding: 0 40px;
                }
                .exec-hud-inner {
                    max-width: 1300px; width: 100%; margin: 0 auto;
                    display: flex; align-items: center; justify-content: space-between;
                }
                .exec-left { display: flex; align-items: center; gap: 24px; }
                .exit-zen-btn {
                    display: flex; align-items: center; gap: 8px;
                    color: rgba(255,255,255,0.4); font-size: 0.65rem; font-weight: 900;
                }
                .save-status {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.2); letter-spacing: 0.1em;
                }
                .status-dot { width: 6px; height: 6px; background: var(--c-cyan); border-radius: 50%; }
                .pulsing { animation: dot-pulse 2s infinite; }
                @keyframes dot-pulse { 0% { opacity:1; } 50% { opacity:0.3; } 100% { opacity:1; } }

                .status-segment-mini {
                    position: relative; display: flex;
                    background: rgba(255,255,255,0.03); border-radius: 12px; padding: 4px;
                }
                .status-segment-mini .seg-bg {
                    position: absolute; top: 4px; bottom: 4px; left: 4px; 
                    width: calc(50% - 4px);
                    background: var(--c-cyan); border-radius: 8px;
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    opacity: 0.15;
                }
                .status-segment-mini button {
                    position: relative; z-index: 1; min-width: 80px; padding: 10px;
                    font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.2); transition: color 0.3s;
                }
                .status-segment-mini button.active { color: var(--c-cyan); }

                .exec-submit-btn {
                    display: flex; align-items: center; gap: 12px;
                    padding: 14px 32px;
                    background: linear-gradient(135deg, var(--c-cyan), var(--c-blue));
                    border-radius: 14px; color: #fff;
                    font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em;
                    box-shadow: 0 10px 30px -10px var(--c-cyan);
                    transition: all 0.3s;
                }
                .exec-submit-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 40px -10px var(--c-cyan); }
                .exec-submit-btn:disabled { opacity: 0.4; transform: none; box-shadow: none; }

                /* ══ Preview Frame ══ */
                .adm-editor-preview-frame {
                    background: #fff; border-radius: 32px; overflow: hidden; color: #000;
                }
                .preview-zero { padding: 80px; text-align: center; color: #000; }
                .preview-hero { height: 400px; background-size: cover; background-position: center; position: relative; }
                .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #fff, transparent); }
                .hero-content { position: absolute; bottom: 40px; left: 40px; color: #000; }
                .hero-content h1 { font-family: var(--font-serif); font-size: 3rem; margin: 10px 0; font-weight: 700; }
                .preview-body { max-width: 800px; margin: 0 auto; padding: 60px 40px; }
                .preview-body .excerpt { font-style: italic; color: #666; font-size: 1.2rem; margin-bottom: 40px; border-left: 4px solid var(--c-cyan); padding-left: 20px; }
            `}</style>
        </div>
    )
}
