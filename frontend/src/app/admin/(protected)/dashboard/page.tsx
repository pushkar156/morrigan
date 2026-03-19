"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { fetchAdminBlogs, deleteBlog } from '@/lib/api'
import type { Blog } from '@/lib/types'

export default function AdminDashboard() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    useEffect(() => {
        loadBlogs()
    }, [])

    const loadBlogs = async () => {
        setIsLoadingData(true)
        try {
            const data = await fetchAdminBlogs()
            setBlogs(data)
        } catch (err) {
            console.error('Failed to load blogs:', err)
        } finally {
            setIsLoadingData(false)
        }
    }

    const handleAction = async (id: string, action: 'edit' | 'delete') => {
        if (action === 'delete') {
            if (window.confirm('Delete this article? This cannot be undone.')) {
                try {
                    await deleteBlog(id)
                    setBlogs(blogs.filter(b => b.id !== id))
                } catch (err: any) {
                    alert('Failed to delete: ' + err.message)
                }
            }
        }
    }

    const stats = {
        total: blogs.length,
        published: blogs.filter(b => b.status === 'published').length,
        drafts: blogs.filter(b => b.status === 'draft').length
    }

    return (
        <div className="adm-dash">
            {/* Header */}
            <header className="adm-dash-header">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="adm-dash-title"
                    >Dashboard</motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="adm-dash-desc"
                    >Manage your intelligence repository</motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Link href="/admin/editor" className="adm-dash-new-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span>New Article</span>
                        <div className="adm-dash-new-btn-shimmer" />
                    </Link>
                </motion.div>
            </header>

            {/* Stats Grid */}
            <div className="adm-dash-stats">
                {[
                    { label: 'Total Articles', value: stats.total, icon: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z', accent: '#00d1ff' },
                    { label: 'Published Live', value: stats.published, icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14', accent: '#10b981' },
                    { label: 'Drafts', value: stats.drafts, icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6', accent: '#8b8fa3' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
                        className="adm-dash-stat-card"
                    >
                        <div className="adm-dash-stat-icon" style={{ color: stat.accent, background: `${stat.accent}12`, borderColor: `${stat.accent}22` }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon} /></svg>
                        </div>
                        <div className="adm-dash-stat-info">
                            <span className="adm-dash-stat-label">{stat.label}</span>
                            <span className="adm-dash-stat-value" style={{ color: stat.accent }}>{stat.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Articles Table */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="adm-dash-table-wrap"
            >
                <div className="adm-dash-table-header">
                    <h2 className="adm-dash-table-title">Intelligence Repository</h2>
                    <span className="adm-dash-table-count">{blogs.length} articles</span>
                </div>

                <div className="adm-dash-table-scroll">
                    <table className="adm-dash-table">
                        <thead>
                            <tr>
                                <th>Title & Details</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th className="adm-dash-th-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="adm-dash-empty">
                                        <p>No articles found in the repository.</p>
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog.id} className="adm-dash-row">
                                        <td className="adm-dash-td-title">
                                            <span className="adm-dash-blog-title">{blog.title}</span>
                                            <span className="adm-dash-blog-meta">
                                                {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not published'} • {blog.read_time} min read
                                            </span>
                                        </td>
                                        <td>
                                            <span className="adm-dash-category-pill">
                                                {blog.category.replace(/-/g, ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={`adm-dash-status ${blog.status === 'draft' ? 'draft' : ''}`}>
                                                <span className="adm-dash-status-dot" style={blog.status === 'draft' ? { background: '#8b8fa3' } : {}} />
                                                <span>{blog.status === 'published' ? 'Published' : 'Draft'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="adm-dash-actions">
                                                <Link href={`/admin/editor?id=${blog.id}`} className="adm-dash-action-btn edit" aria-label="Edit article">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </Link>
                                                <button onClick={() => handleAction(blog.id, 'delete')} className="adm-dash-action-btn delete" aria-label="Delete article">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <style jsx global>{`
                .adm-dash {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .adm-dash-header {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 24px;
                    margin-bottom: 40px;
                }

                .adm-dash-title {
                    font-family: var(--font-serif);
                    font-size: clamp(2rem, 4vw, 3rem);
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: -0.02em;
                    margin: 0 0 6px;
                }

                .adm-dash-desc {
                    font-family: var(--font-sans);
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.35);
                    margin: 0;
                }

                .adm-dash-new-btn {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #00d1ff, #1152d4);
                    border: none;
                    border-radius: 14px;
                    text-decoration: none;
                    color: #fff;
                    font-family: var(--font-sans);
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    overflow: hidden;
                    transition: box-shadow 0.3s, transform 0.3s;
                }
                .adm-dash-new-btn:hover {
                    box-shadow: 0 12px 40px rgba(0,209,255,0.25);
                    transform: translateY(-2px);
                }
                .adm-dash-new-btn-shimmer {
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                    transform: translateX(-100%);
                    transition: transform 0.55s ease;
                }
                .adm-dash-new-btn:hover .adm-dash-new-btn-shimmer {
                    transform: translateX(100%);
                }

                /* ══ Stats ══ */
                .adm-dash-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 40px;
                }
                @media (max-width: 768px) {
                    .adm-dash-stats { grid-template-columns: 1fr; }
                }

                .adm-dash-stat-card {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    padding: 24px 28px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 18px;
                    transition: border-color 0.3s, background 0.3s;
                }
                .adm-dash-stat-card:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                }

                .adm-dash-stat-icon {
                    width: 48px; height: 48px;
                    border-radius: 14px;
                    border: 1px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .adm-dash-stat-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .adm-dash-stat-label {
                    font-family: var(--font-sans);
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.3);
                }

                .adm-dash-stat-value {
                    font-family: var(--font-serif);
                    font-size: 2rem;
                    font-weight: 700;
                    line-height: 1;
                    letter-spacing: -0.02em;
                }

                /* ══ Table ══ */
                .adm-dash-table-wrap {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 20px;
                    overflow: hidden;
                }

                .adm-dash-table-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 32px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }

                .adm-dash-table-title {
                    font-family: var(--font-serif);
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.85);
                    margin: 0;
                }

                .adm-dash-table-count {
                    font-family: var(--font-sans);
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    color: rgba(255,255,255,0.25);
                    text-transform: uppercase;
                }

                .adm-dash-table-scroll {
                    overflow-x: auto;
                }

                .adm-dash-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }

                .adm-dash-table thead th {
                    padding: 16px 32px;
                    font-family: var(--font-sans);
                    font-size: 0.6rem;
                    font-weight: 700;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.25);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.02);
                }
                .adm-dash-th-right { text-align: right; }

                .adm-dash-row {
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    transition: background 0.2s;
                }
                .adm-dash-row:hover {
                    background: rgba(255,255,255,0.02);
                }
                .adm-dash-row:last-child {
                    border-bottom: none;
                }

                .adm-dash-table td {
                    padding: 20px 32px;
                    vertical-align: middle;
                }

                .adm-dash-td-title {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .adm-dash-blog-title {
                    font-family: var(--font-serif);
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.8);
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    transition: color 0.2s;
                }
                .adm-dash-row:hover .adm-dash-blog-title {
                    color: #00d1ff;
                }

                .adm-dash-blog-meta {
                    font-family: var(--font-sans);
                    font-size: 0.72rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.25);
                }

                .adm-dash-category-pill {
                    display: inline-block;
                    padding: 6px 14px;
                    background: rgba(0,209,255,0.06);
                    border: 1px solid rgba(0,209,255,0.12);
                    border-radius: 100px;
                    font-family: var(--font-sans);
                    font-size: 0.6rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(0,209,255,0.7);
                    white-space: nowrap;
                }

                .adm-dash-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: var(--font-sans);
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    color: rgba(16,185,129,0.8);
                }

                .adm-dash-status-dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: #10b981;
                    animation: adm-status-pulse 2s ease-out infinite;
                }
                @keyframes adm-status-pulse {
                    0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
                    70%  { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
                    100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
                }

                .adm-dash-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                    opacity: 0.3;
                    transition: opacity 0.25s;
                }
                .adm-dash-row:hover .adm-dash-actions {
                    opacity: 1;
                }

                .adm-dash-action-btn {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.08);
                    background: rgba(255,255,255,0.03);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.25s;
                    text-decoration: none;
                }
                .adm-dash-action-btn.edit {
                    color: rgba(255,255,255,0.5);
                }
                .adm-dash-action-btn.edit:hover {
                    color: #00d1ff;
                    border-color: rgba(0,209,255,0.3);
                    background: rgba(0,209,255,0.08);
                }
                .adm-dash-action-btn.delete {
                    color: rgba(255,100,100,0.5);
                }
                .adm-dash-action-btn.delete:hover {
                    color: #ff6b6b;
                    border-color: rgba(255,100,100,0.3);
                    background: rgba(255,100,100,0.08);
                }

                .adm-dash-empty {
                    text-align: center;
                    padding: 60px 20px;
                }
                .adm-dash-empty p {
                    font-family: var(--font-sans);
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.3);
                }
            `}</style>
        </div>
    )
}
