"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminEditor() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        category: 'stock-analysis',
        read_time: '5',
        featured_image: '',
        content: '',
        status: 'draft'
    })

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        // Simulate save
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
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <Link href="/admin/dashboard" className="text-xs font-black tracking-[0.3em] uppercase text-black/40 hover:text-[#00d1ff] transition-colors mb-4 inline-flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Back to Vault
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-black tracking-tight mb-2">New Article</h1>
                    <p className="text-black/50 font-sans text-sm font-semibold tracking-wide">Drafting Intelligence Report M-{(Math.random() * 1000).toFixed(0)}</p>
                </div>
            </header>

            {/* Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/80 backdrop-blur-3xl border border-black/5 p-10 rounded-[2.5rem] shadow-xl">
                        <input
                            type="text"
                            placeholder="ARTICLE HEADLINE"
                            className="w-full text-4xl md:text-6xl font-serif font-black placeholder:text-black/10 text-black bg-transparent border-none outline-none mb-8 resize-none focus:ring-0"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <div className="mb-8">
                            <label className="block text-xs font-black tracking-[0.2em] text-black/40 uppercase mb-4">Executive Subtitle / Excerpt</label>
                            <textarea
                                rows={3}
                                placeholder="A brief summary to draw the reader in..."
                                className="w-full bg-white/50 border border-black/10 rounded-2xl px-6 py-5 text-lg font-medium text-black placeholder:text-black/30 outline-none focus:border-[#00d1ff]/50 focus:bg-white transition-all shadow-inner resize-none"
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-xs font-black tracking-[0.2em] text-black/40 uppercase">Intelligence Body (Markdown)</label>
                            </div>
                            <textarea
                                rows={20}
                                placeholder="Begin drafting the analysis... (Supports Markdown)"
                                className="w-full bg-black/[0.02] border border-black/10 rounded-2xl px-6 py-6 font-mono text-sm leading-relaxed text-black/80 placeholder:text-black/20 outline-none focus:border-[#00d1ff]/50 focus:bg-white transition-all shadow-inner resize-y font-medium"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Configuration */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/80 backdrop-blur-3xl border border-black/5 p-8 rounded-[2.5rem] shadow-md sticky top-6">

                        <div className="mb-8">
                            <label className="block text-xs font-black tracking-[0.2em] text-black/40 uppercase mb-3">Save State</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${formData.status === 'draft'
                                            ? 'bg-black/10 text-black border border-black/20 shadow-inner'
                                            : 'text-black/40 hover:bg-black/5'
                                        }`}
                                >
                                    Draft
                                </button>
                                <button
                                    onClick={() => setFormData({ ...formData, status: 'published' })}
                                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${formData.status === 'published'
                                            ? 'bg-[#00d1ff]/20 text-[#008cb0] font-black border border-[#00d1ff]/50 shadow-inner'
                                            : 'text-black/40 hover:bg-[#00d1ff]/5'
                                        }`}
                                >
                                    Publish
                                </button>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-black tracking-[0.2em] text-black/40 uppercase mb-3">Category Classification</label>
                            <select
                                className="w-full bg-white border border-black/10 rounded-xl px-4 py-4 text-sm font-bold text-black appearance-none outline-none focus:border-[#00d1ff] shadow-sm cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-black tracking-[0.2em] text-black/40 uppercase mb-3">Read Time (Minutes)</label>
                            <input
                                type="number"
                                className="w-full bg-white border border-black/10 rounded-xl px-4 py-4 text-center font-serif font-black text-2xl text-black outline-none focus:border-[#00d1ff] shadow-sm tracking-tighter"
                                value={formData.read_time}
                                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                                min="1"
                            />
                        </div>

                        <div className="mb-10">
                            <label className="block text-xs font-black tracking-[0.2em] text-black/40 uppercase mb-3">Featured Graphic (URL)</label>
                            <input
                                type="text"
                                placeholder="/images/cover.jpg"
                                className="w-full bg-white border border-black/10 rounded-xl px-4 py-4 text-xs font-bold text-black/60 outline-none focus:border-[#00d1ff] shadow-sm font-mono tracking-tight"
                                value={formData.featured_image}
                                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                            />
                            {formData.featured_image && (
                                <div className="mt-4 w-full h-32 rounded-xl bg-black/5 border border-black/10 overflow-hidden relative">
                                    <img src={formData.featured_image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving || !formData.title.trim()}
                            className={`w-full bg-black text-white font-black tracking-[0.2em] text-xs uppercase py-5 rounded-2xl transition-all shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 ${(isSaving || !formData.title.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a73e8]'
                                }`}
                        >
                            {isSaving ? 'Synchronizing...' : (formData.status === 'published' ? 'EXECUTE & PUBLISH' : 'SAVE DRAFT')}
                        </button>

                    </motion.div>
                </div>
            </div>
        </div>
    )
}
