"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { DEMO_BLOGS as initialBlogs, Blog } from '@/lib/demo-data'

export default function AdminDashboard() {
    const [blogs, setBlogs] = useState<Blog[]>([])

    // Simulate fetching blogs
    useEffect(() => {
        setBlogs(initialBlogs)
    }, [])

    const handleAction = (id: number, action: 'edit' | 'delete') => {
        if (action === 'delete') {
            if (window.confirm('Delete this article?')) {
                setBlogs(blogs.filter(b => b.id !== id))
            }
        }
    }

    const stats = {
        total: blogs.length,
        published: blogs.length, // Randomizing logic isn't strictly necessary for demo, assume all published for now
        drafts: 0
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-black tracking-tight mb-2">Dashboard</h1>
                    <p className="text-black/50 font-sans text-sm font-semibold tracking-wide">Manage your intelligence repository</p>
                </div>

                <Link
                    href="/admin/editor"
                    className="group relative inline-flex items-center gap-3 bg-black text-white px-6 py-4 rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="relative z-10"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="relative z-10 text-xs font-black tracking-[0.2em] uppercase">New Article</span>
                </Link>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: 'Total Articles', value: stats.total, color: 'text-black' },
                    { label: 'Published Live', value: stats.published, color: 'text-[#00d1ff]' },
                    { label: 'Drafts', value: stats.drafts, color: 'text-black/30' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="bg-white/80 backdrop-blur-2xl border border-black/5 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/40 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <h3 className="text-xs font-black tracking-[0.2em] uppercase text-black/40 mb-3">{stat.label}</h3>
                        <p className={`text-6xl font-serif font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Articles Table */}
            <div className="bg-white/90 backdrop-blur-3xl border border-black/5 rounded-[2.5rem] shadow-xl overflow-hidden">
                <div className="px-10 py-8 border-b border-black/5">
                    <h2 className="text-xl font-serif font-bold text-black tracking-tight">Intelligence Repository</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/5 border-b border-black/5">
                                <th className="px-10 py-5 text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">Title & Details</th>
                                <th className="px-10 py-5 text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">Category</th>
                                <th className="px-10 py-5 text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">Status</th>
                                <th className="px-10 py-5 text-[10px] font-black tracking-[0.2em] text-black/40 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5">
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center">
                                        <p className="text-black/40 font-semibold tracking-wide text-sm">No articles found in the repository.</p>
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-black/[0.02] transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-serif font-bold text-lg text-black group-hover:text-[#1a73e8] transition-colors line-clamp-1">{blog.title}</span>
                                                <span className="font-sans text-xs font-semibold text-black/40 mt-1">
                                                    {new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {blog.read_time} min read
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-4 py-2 bg-black/5 text-black font-bold text-[10px] tracking-wider uppercase rounded-full">
                                                {blog.category.replace(/-/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#00d1ff] animate-pulse"></div>
                                                <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">PUBLISHED</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex justify-end gap-3 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/editor?id=${blog.id}`}
                                                    className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleAction(blog.id, 'delete')}
                                                    className="w-10 h-10 rounded-full border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Animation Styles */}
            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(200%) skewX(12deg); }
                }
            `}</style>
        </div>
    )
}
