"use client"
import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminEditor() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        category: 'stock-analysis',
        read_time: '5',
        featured_image: '',
        content: '',
        status: 'draft'
    })

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return
        setImageFile(file)
        const url = URL.createObjectURL(file)
        setFormData(prev => ({ ...prev, featured_image: url }))
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileSelect(file)
    }, [handleFileSelect])

    const handleRemoveImage = () => {
        setImageFile(null)
        setFormData(prev => ({ ...prev, featured_image: '' }))
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            alert('Intelligence saved to repository.')
            router.push('/admin/dashboard')
        }, 1200)
    }

    const categories = [
        { id: 'back-to-basics', name: 'Back to Basics' },
        { id: 'case-studies', name: 'Case Studies' },
        { id: 'stock-analysis', name: 'Stock Analysis' },
        { id: '100-days-challenge', name: '100 Days Challenge' },
        { id: 'ma-diaries', name: 'M&A Diaries' }
    ]

    return (
        <div className="adm-editor">
            {/* Header */}
            <header className="adm-editor-header">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/admin/dashboard" className="adm-editor-back">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            Back to Vault
                        </Link>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="adm-editor-title"
                    >New Article</motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="adm-editor-desc"
                    >Drafting Intelligence Report M-{(Math.random() * 1000).toFixed(0)}</motion.p>
                </div>
            </header>

            {/* Form Section */}
            <div className="adm-editor-grid">
                {/* Main Content Area */}
                <div className="adm-editor-main">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="adm-editor-content-card"
                    >
                        <input
                            type="text"
                            placeholder="ARTICLE HEADLINE"
                            className="adm-editor-headline"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <div className="adm-editor-field-group">
                            <label className="adm-editor-label">Executive Subtitle / Excerpt</label>
                            <textarea
                                rows={3}
                                placeholder="A brief summary to draw the reader in..."
                                className="adm-editor-textarea"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>

                        <div className="adm-editor-field-group">
                            <label className="adm-editor-label">Intelligence Body (Markdown)</label>
                            <textarea
                                rows={20}
                                placeholder="Begin drafting the analysis... (Supports Markdown)"
                                className="adm-editor-textarea mono"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Configuration */}
                <div className="adm-editor-sidebar">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="adm-editor-sidebar-card"
                    >
                        {/* Status Toggle */}
                        <div className="adm-editor-field-group">
                            <label className="adm-editor-label">Save State</label>
                            <div className="adm-editor-status-toggle">
                                <button
                                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                                    className={`adm-editor-status-btn ${formData.status === 'draft' ? 'active' : ''}`}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    Draft
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, status: 'published' })}
                                    className={`adm-editor-status-btn publish ${formData.status === 'published' ? 'active' : ''}`}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" /><polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    Publish
                                </button>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="adm-editor-field-group">
                            <label className="adm-editor-label">Category Classification</label>
                            <div className="adm-editor-select-wrap">
                                <select
                                    className="adm-editor-select"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <svg className="adm-editor-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>

                        {/* Read Time */}
                        <div className="adm-editor-field-group">
                            <label className="adm-editor-label">Read Time (Minutes)</label>
                            <input
                                type="number"
                                className="adm-editor-number-input"
                                value={formData.read_time}
                                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                                min="1"
                            />
                        </div>

                        {/* Cover Image */}
                        <div className="adm-editor-field-group">
                            <label className="adm-editor-label">Cover Image</label>

                            {/* Mode Toggle */}
                            <div className="adm-editor-img-mode-toggle">
                                <button
                                    onClick={() => setImageMode('upload')}
                                    className={`adm-editor-img-mode-btn ${imageMode === 'upload' ? 'active' : ''}`}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    Upload File
                                </button>
                                <button
                                    onClick={() => setImageMode('url')}
                                    className={`adm-editor-img-mode-btn ${imageMode === 'url' ? 'active' : ''}`}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                    Image URL
                                </button>
                            </div>

                            {/* Upload Mode */}
                            {imageMode === 'upload' && (
                                <>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                        className="adm-editor-file-hidden"
                                    />
                                    {!imageFile ? (
                                        <div
                                            className={`adm-editor-dropzone ${isDragging ? 'dragging' : ''}`}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                        >
                                            <div className="adm-editor-dropzone-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                            </div>
                                            <p className="adm-editor-dropzone-text">Drop an image here or <span>browse files</span></p>
                                            <p className="adm-editor-dropzone-hint">PNG, JPG, WebP up to 5MB</p>
                                        </div>
                                    ) : (
                                        <div className="adm-editor-file-info">
                                            <div className="adm-editor-file-info-left">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                                <div>
                                                    <span className="adm-editor-file-name">{imageFile.name}</span>
                                                    <span className="adm-editor-file-size">{(imageFile.size / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </div>
                                            <button onClick={handleRemoveImage} className="adm-editor-file-remove" aria-label="Remove image">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* URL Mode */}
                            {imageMode === 'url' && (
                                <input
                                    type="text"
                                    placeholder="https://example.com/cover.jpg"
                                    className="adm-editor-text-input mono"
                                    value={formData.featured_image}
                                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                />
                            )}

                            {/* Preview */}
                            {formData.featured_image && (
                                <div className="adm-editor-image-preview">
                                    <img src={formData.featured_image} alt="Cover preview" />
                                    <div className="adm-editor-image-preview-label">Cover Preview</div>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="adm-editor-divider" />

                        {/* Submit */}
                        <button
                            onClick={handleSave}
                            disabled={isSaving || !formData.title.trim()}
                            className="adm-editor-submit"
                        >
                            <span className="adm-editor-submit-text">
                                {isSaving ? (
                                    <>
                                        <svg className="adm-editor-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" /></svg>
                                        Synchronizing…
                                    </>
                                ) : (
                                    <>
                                        {formData.status === 'published' ? 'EXECUTE & PUBLISH' : 'SAVE DRAFT'}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </>
                                )}
                            </span>
                            <div className="adm-editor-submit-shimmer" />
                        </button>
                    </motion.div>
                </div>
            </div>

            <style jsx global>{`
                .adm-editor {
                    max-width: 1100px;
                    margin: 0 auto;
                }

                .adm-editor-header {
                    margin-bottom: 36px;
                }

                .adm-editor-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    font-family: var(--font-sans);
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                    margin-bottom: 16px;
                    transition: color 0.2s;
                }
                .adm-editor-back:hover { color: #00d1ff; }

                .adm-editor-title {
                    font-family: var(--font-serif);
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: -0.02em;
                    margin: 0 0 6px;
                }

                .adm-editor-desc {
                    font-family: var(--font-sans);
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.3);
                    margin: 0;
                }

                .adm-editor-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 28px;
                    align-items: start;
                }
                @media (max-width: 1024px) {
                    .adm-editor-grid { grid-template-columns: 1fr; }
                }

                /* ══ Content Card ══ */
                .adm-editor-content-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 20px;
                    padding: 40px;
                }

                .adm-editor-headline {
                    width: 100%;
                    font-family: var(--font-serif);
                    font-size: clamp(1.8rem, 3vw, 3rem);
                    font-weight: 700;
                    color: #fff;
                    background: transparent;
                    border: none;
                    outline: none;
                    margin-bottom: 32px;
                    letter-spacing: -0.02em;
                }
                .adm-editor-headline::placeholder {
                    color: rgba(255,255,255,0.08);
                }

                .adm-editor-field-group {
                    margin-bottom: 24px;
                }
                .adm-editor-field-group:last-child {
                    margin-bottom: 0;
                }

                .adm-editor-label {
                    display: block;
                    font-family: var(--font-sans);
                    font-size: 0.6rem;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.25);
                    margin-bottom: 10px;
                }

                .adm-editor-textarea {
                    width: 100%;
                    padding: 16px 20px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 14px;
                    font-family: var(--font-sans);
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.8);
                    outline: none;
                    resize: vertical;
                    line-height: 1.7;
                    transition: all 0.3s ease;
                }
                .adm-editor-textarea.mono {
                    font-family: 'SF Mono', 'Fira Code', monospace;
                    font-size: 0.82rem;
                    line-height: 1.6;
                }
                .adm-editor-textarea::placeholder {
                    color: rgba(255,255,255,0.15);
                }
                .adm-editor-textarea:focus {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(0,209,255,0.25);
                    box-shadow: 0 0 0 3px rgba(0,209,255,0.05);
                }

                /* ══ Sidebar Card ══ */
                .adm-editor-sidebar-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 20px;
                    padding: 32px;
                    position: sticky;
                    top: 24px;
                }

                .adm-editor-status-toggle {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                .adm-editor-status-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.02);
                    color: rgba(255,255,255,0.3);
                    font-family: var(--font-sans);
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                .adm-editor-status-btn:hover {
                    background: rgba(255,255,255,0.04);
                    color: rgba(255,255,255,0.5);
                }
                .adm-editor-status-btn.active {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.12);
                    color: rgba(255,255,255,0.8);
                }
                .adm-editor-status-btn.publish.active {
                    background: rgba(0,209,255,0.08);
                    border-color: rgba(0,209,255,0.2);
                    color: #00d1ff;
                }

                .adm-editor-select-wrap {
                    position: relative;
                }

                .adm-editor-select {
                    width: 100%;
                    padding: 14px 40px 14px 16px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                    font-family: var(--font-sans);
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.7);
                    appearance: none;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.25s;
                }
                .adm-editor-select option {
                    background: #1a2d42;
                    color: #fff;
                }
                .adm-editor-select:focus {
                    border-color: rgba(0,209,255,0.3);
                }

                .adm-editor-select-chevron {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.25);
                    pointer-events: none;
                }

                .adm-editor-number-input {
                    width: 100%;
                    padding: 14px 16px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                    font-family: var(--font-serif);
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #00d1ff;
                    text-align: center;
                    outline: none;
                    letter-spacing: -0.02em;
                    transition: border-color 0.3s;
                }
                .adm-editor-number-input:focus {
                    border-color: rgba(0,209,255,0.3);
                }

                .adm-editor-text-input {
                    width: 100%;
                    padding: 14px 16px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                    font-family: var(--font-sans);
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.6);
                    outline: none;
                    transition: border-color 0.3s;
                }
                .adm-editor-text-input.mono {
                    font-family: 'SF Mono', 'Fira Code', monospace;
                    font-size: 0.75rem;
                    letter-spacing: -0.01em;
                }
                .adm-editor-text-input::placeholder {
                    color: rgba(255,255,255,0.15);
                }
                .adm-editor-text-input:focus {
                    border-color: rgba(0,209,255,0.3);
                }

                .adm-editor-image-preview {
                    margin-top: 12px;
                    width: 100%;
                    height: 160px;
                    border-radius: 14px;
                    overflow: hidden;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    position: relative;
                }
                .adm-editor-image-preview img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                }
                .adm-editor-image-preview-label {
                    position: absolute;
                    bottom: 8px; left: 8px;
                    padding: 4px 10px;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(8px);
                    border-radius: 8px;
                    font-size: 0.55rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.7);
                }

                /* ══ Image Upload ══ */
                .adm-editor-img-mode-toggle {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6px;
                    margin-bottom: 12px;
                }

                .adm-editor-img-mode-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.02);
                    color: rgba(255,255,255,0.3);
                    font-family: var(--font-sans);
                    font-size: 0.62rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                .adm-editor-img-mode-btn:hover {
                    color: rgba(255,255,255,0.5);
                    background: rgba(255,255,255,0.04);
                }
                .adm-editor-img-mode-btn.active {
                    color: #00d1ff;
                    background: rgba(0,209,255,0.08);
                    border-color: rgba(0,209,255,0.2);
                }

                .adm-editor-file-hidden {
                    display: none;
                }

                .adm-editor-dropzone {
                    padding: 32px 20px;
                    border: 2px dashed rgba(255,255,255,0.1);
                    border-radius: 14px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: transparent;
                }
                .adm-editor-dropzone:hover,
                .adm-editor-dropzone.dragging {
                    border-color: rgba(0,209,255,0.35);
                    background: rgba(0,209,255,0.04);
                }

                .adm-editor-dropzone-icon {
                    width: 48px; height: 48px;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255,255,255,0.2);
                    transition: all 0.3s;
                }
                .adm-editor-dropzone:hover .adm-editor-dropzone-icon {
                    color: rgba(0,209,255,0.5);
                    background: rgba(0,209,255,0.06);
                    border-color: rgba(0,209,255,0.15);
                }

                .adm-editor-dropzone-text {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.35);
                    margin: 0;
                }
                .adm-editor-dropzone-text span {
                    color: #00d1ff;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }

                .adm-editor-dropzone-hint {
                    font-size: 0.62rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.15);
                    letter-spacing: 0.06em;
                    margin: 0;
                }

                .adm-editor-file-info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 16px;
                    background: rgba(0,209,255,0.04);
                    border: 1px solid rgba(0,209,255,0.12);
                    border-radius: 12px;
                }

                .adm-editor-file-info-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: rgba(0,209,255,0.6);
                }
                .adm-editor-file-info-left div {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .adm-editor-file-name {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.7);
                    max-width: 180px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .adm-editor-file-size {
                    font-size: 0.6rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.25);
                    letter-spacing: 0.05em;
                }

                .adm-editor-file-remove {
                    width: 28px; height: 28px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,100,100,0.15);
                    background: rgba(255,100,100,0.06);
                    color: rgba(255,100,100,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .adm-editor-file-remove:hover {
                    color: #ff6b6b;
                    background: rgba(255,100,100,0.12);
                    border-color: rgba(255,100,100,0.3);
                }

                .adm-editor-divider {
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent);
                    margin: 28px 0;
                }

                .adm-editor-submit {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    padding: 17px 28px;
                    background: linear-gradient(135deg, #00d1ff, #1152d4);
                    border: none;
                    border-radius: 14px;
                    cursor: pointer;
                    transition: box-shadow 0.3s, transform 0.3s;
                }
                .adm-editor-submit:hover {
                    box-shadow: 0 12px 40px rgba(0,209,255,0.25);
                    transform: translateY(-2px);
                }
                .adm-editor-submit:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .adm-editor-submit-text {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-family: var(--font-sans);
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #fff;
                }

                .adm-editor-submit-shimmer {
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.55s ease;
                }
                .adm-editor-submit:hover .adm-editor-submit-shimmer {
                    transform: translateX(100%);
                }

                .adm-editor-spinner {
                    animation: adm-editor-spin 0.75s linear infinite;
                }
                @keyframes adm-editor-spin { to { transform: rotate(360deg); } }

                @media (max-width: 640px) {
                    .adm-editor-content-card { padding: 24px 20px; }
                    .adm-editor-sidebar-card { padding: 24px 20px; }
                }
            `}</style>
        </div>
    )
}
