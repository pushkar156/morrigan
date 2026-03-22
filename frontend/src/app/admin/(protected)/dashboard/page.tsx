"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { fetchAdminBlogs, deleteBlog } from '@/lib/api'
import type { Blog } from '@/lib/types'

export default function AdminDashboard() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoadingData, setIsLoadingData] = useState(true)

    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isSelectionMode, setIsSelectionMode] = useState(false)

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
                    const newSelected = new Set(selectedIds)
                    newSelected.delete(id)
                    setSelectedIds(newSelected)
                } catch (err: any) {
                    alert('Failed to delete: ' + err.message)
                }
            }
        }
    }

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return
        if (window.confirm(`Delete ${selectedIds.size} articles? This cannot be undone.`)) {
            try {
                for (const id of Array.from(selectedIds)) {
                    await deleteBlog(id)
                }
                setBlogs(blogs.filter(b => !selectedIds.has(b.id)))
                setSelectedIds(new Set())
            } catch (err: any) {
                alert('Failed during bulk delete: ' + err.message)
            }
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredBlogs.length && filteredBlogs.length > 0) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredBlogs.map(b => b.id)))
        }
    }

    const toggleSelectOne = (id: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) newSelected.delete(id)
        else newSelected.add(id)
        setSelectedIds(newSelected)
    }

    const stats = {
        total: blogs.length,
        published: blogs.filter(b => b.status === 'published').length,
        drafts: blogs.filter(b => b.status === 'draft').length
    }

    const filteredBlogs = blogs.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.category.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || b.status === statusFilter
        const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter
        return matchesSearch && matchesStatus && matchesCategory
    })

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
                    </Link>
                </motion.div>
            </header>

            {/* Interactive Stats Grid */}
            <div className="adm-dash-stats">
                {[
                    { id: 'all', label: 'TOTAL REPOSITORY', value: stats.total, icon: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z', accent: '#00d1ff', desc: 'Active Articles' },
                    { id: 'published', label: 'PUBLISHED LIVE', value: stats.published, icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14', accent: '#10b981', desc: 'Public Access', live: true },
                    { id: 'draft', label: 'DRAFT REVISION', value: stats.drafts, icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6', accent: '#8b8fa3', desc: 'Private Works' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                        className={`adm-dash-stat-card ${statusFilter === stat.id ? 'active' : ''}`}
                        style={{ '--accent': stat.accent } as any}
                    >
                        <div className="adm-dash-stat-glass" />
                        <div className="adm-dash-stat-icon-wrap">
                            <div className="adm-dash-stat-icon-bg" />
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon} /></svg>
                        </div>
                        <div className="adm-dash-stat-content">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="adm-dash-stat-label">{stat.label}</span>
                                {stat.live && <span className="stat-live-dot" />}
                            </div>
                            <div className="adm-dash-stat-num-wrap">
                                <span className="adm-dash-stat-value">{stat.value}</span>
                                <span className="adm-dash-stat-metric">{stat.desc}</span>
                            </div>
                        </div>
                        <div className="adm-dash-stat-edge-glow" />
                    </motion.div>
                ))}
            </div>


            {/* Content Hub (formerly the table section) */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="adm-dash-table-wrap"
            >
                {/* Command HUD */}
                <div className="adm-dash-controls-root">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 w-full">
                        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-5">
                            {/* Unified Search HUD */}
                            <div className={`adm-dash-search-hud ${searchQuery ? 'has-query' : ''}`}>
                                <div className="adm-dash-search-icon-wrap">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="SEARCH INTELLIGENCE..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="adm-dash-search-input"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="adm-dash-search-clear">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>

                            {/* Sliding Status Segment */}
                            <div className="adm-dash-status-segment">
                                <div className="adm-dash-segment-bg" style={{ 
                                    transform: `translateX(calc(${statusFilter === 'all' ? 0 : statusFilter === 'published' ? 100 : 200}%))`,
                                    width: 'calc((100% - 8px) / 3)' 
                                }} />
                                {(['all', 'published', 'draft'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s)}
                                        className={`adm-dash-segment-item ${statusFilter === s ? 'active' : ''}`}
                                    >
                                        {s.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setIsSelectionMode(!isSelectionMode);
                                    if (isSelectionMode) setSelectedIds(new Set()); 
                                }}
                                className={`adm-dash-action-pivot ${isSelectionMode ? 'active' : ''}`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span>{isSelectionMode ? 'FINISH' : 'SELECT'}</span>
                            </button>

                            {selectedIds.size > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    onClick={handleBulkDelete}
                                    className="adm-dash-bulk-delete"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    DELETE ({selectedIds.size})
                                </motion.button>
                            )}
                        </div>
                    </div>

                    {/* Category Horizon Strip */}
                    <div className="adm-dash-category-strip-wrap">
                        <div className="adm-dash-category-strip">
                            {[
                                { id: 'all', name: 'ALL' },
                                { id: 'back-to-basics', name: 'BASICS' },
                                { id: 'case-studies', name: 'STUDIES' },
                                { id: 'stock-analysis', name: 'ANALYSIS' },
                                { id: '100-days-challenge', name: 'CHALLENGE' },
                                { id: 'ma-diaries', name: 'M&A' }
                            ].map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setCategoryFilter(c.id)}
                                    className={`adm-dash-category-item ${categoryFilter === c.id ? 'active' : ''}`}
                                >
                                    {c.name}
                                    {categoryFilter === c.id && <motion.div layoutId="category-glow" className="adm-dash-category-glow" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="adm-dash-table-scroll">
                    <table className="adm-dash-table">
                        <thead>
                            <tr>
                                <th style={{ width: 80, paddingLeft: 48 }}>
                                    {isSelectionMode ? (
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size === filteredBlogs.length && filteredBlogs.length > 0}
                                            onChange={toggleSelectAll}
                                            className="adm-dash-checkbox"
                                        />
                                    ) : (
                                        "ID"
                                    )}
                                </th>
                                <th>TITLE & INTEL</th>
                                <th>CATEGORY</th>
                                <th>STATUS</th>
                                <th className="adm-dash-th-right" style={{ paddingRight: 48 }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="adm-dash-tbody">
                            <AnimatePresence mode="wait">
                                {filteredBlogs.length === 0 ? (
                                    <motion.tr 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="adm-dash-row"
                                    >
                                        <td colSpan={5} className="adm-dash-empty">
                                            {isLoadingData ? "LOADING REPOSITORY..." : "NO INTELLIGENCE FOUND."}
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filteredBlogs.map((blog, i) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            key={blog.id} 
                                            className="adm-dash-row"
                                        >
                                            <td style={{ width: 80, paddingLeft: 48 }}>
                                                {isSelectionMode ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(blog.id)}
                                                        onChange={() => toggleSelectOne(blog.id)}
                                                        className="adm-dash-checkbox"
                                                    />
                                                ) : (
                                                    <span className="adm-dash-index">{String(i + 1).padStart(2, '0')}</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="adm-dash-blog-info">
                                                    <span className="adm-dash-blog-title">{blog.title}</span>
                                                    <span className="adm-dash-blog-meta">
                                                        {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'DRAFT'} • {blog.read_time} MIN READ
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="adm-dash-category-pill">
                                                    {blog.category.replace(/-/g, ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={`adm-dash-status-indicator ${blog.status}`}>
                                                    <span className="status-dot" />
                                                    <span>{blog.status.toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td style={{ paddingRight: 48 }}>
                                                <div className="adm-dash-actions">
                                                    <Link href={`/admin/editor?id=${blog.id}`} className="adm-dash-action-btn" aria-label="Edit">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleAction(blog.id, 'delete')} 
                                                        className="adm-dash-action-btn delete" 
                                                        aria-label="Delete"
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <style jsx global>{`
                .adm-dash {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ══ Header ══ */
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
                    font-size: clamp(2.5rem, 5vw, 3.5rem);
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: -0.03em;
                    margin: 0 0 8px;
                }
                .adm-dash-desc {
                    font-family: var(--font-sans);
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: rgba(255,255,255,0.3);
                    margin: 0;
                    letter-spacing: 0.02em;
                }

                .adm-dash-new-btn {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 28px;
                    background: linear-gradient(135deg, #00d1ff, #1152d4);
                    border: none;
                    border-radius: 16px;
                    text-decoration: none;
                    color: #fff;
                    font-family: var(--font-sans);
                    font-size: 0.8rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 8px 24px -8px rgba(0,209,255,0.4);
                }
                .adm-dash-new-btn:hover {
                    box-shadow: 0 12px 40px rgba(0,209,255,0.3);
                    transform: translateY(-2px);
                }

                /* ══ Interactive Stats ══ */
                .adm-dash-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    margin-bottom: 48px;
                }
                @media (max-width: 768px) {
                    .adm-dash-stats { grid-template-columns: 1fr; }
                }

                .adm-dash-stat-card {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    padding: 28px 32px;
                    background: rgba(255,255,255,0.015);
                    border: 1px solid rgba(255,255,255,0.04);
                    border-radius: 24px;
                    cursor: default;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .adm-dash-stat-card.active {
                    background: rgba(255,255,255,0.04);
                    border-color: var(--accent);
                    box-shadow: 0 0 30px -10px var(--accent);
                }
                .adm-dash-stat-card.active .adm-dash-stat-icon-bg {
                    opacity: 0.25;
                    box-shadow: 0 0 15px var(--accent);
                }

                .adm-dash-stat-glass {
                    position: absolute; inset: 0;
                    backdrop-filter: blur(12px);
                    z-index: 0;
                }

                .adm-dash-stat-icon-wrap {
                    position: relative;
                    width: 56px; height: 56px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--accent);
                    z-index: 1;
                }
                .adm-dash-stat-icon-bg {
                    position: absolute; inset: 0;
                    background: var(--accent);
                    opacity: 0.1;
                    border: 1px solid var(--accent);
                    border-radius: 16px;
                    transition: opacity 0.3s;
                }

                .adm-dash-stat-content {
                    position: relative;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                }
                .adm-dash-stat-label {
                    font-family: var(--font-sans);
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.25em;
                    color: rgba(255,255,255,0.25);
                    transition: color 0.3s;
                }
                .adm-dash-stat-card.active .adm-dash-stat-label { color: #fff; }

                .adm-dash-stat-num-wrap {
                    display: flex;
                    align-items: baseline;
                    gap: 16px;
                }
                .adm-dash-stat-value {
                    font-family: var(--font-serif);
                    font-size: 2.5rem;
                    font-weight: 700;
                    line-height: 1;
                    color: var(--accent);
                    letter-spacing: -0.02em;
                }
                .adm-dash-stat-metric {
                    font-family: var(--font-sans);
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.15);
                    letter-spacing: 0.05em;
                }

                .stat-live-dot {
                    width: 6px; height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10b981;
                    animation: stat-pulse 2s infinite;
                }
                @keyframes stat-pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.6); opacity: 0.3; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .adm-dash-stat-edge-glow {
                    position: absolute;
                    bottom: 0; left: 0; right: 0; height: 1px;
                    background: linear-gradient(90deg, transparent, var(--accent), transparent);
                    opacity: 0;
                    transition: opacity 0.4s;
                }
                .adm-dash-stat-card.active .adm-dash-stat-edge-glow { opacity: 0.8; }

                /* ══ Command HUD & Layout ══ */
                .adm-dash-table-wrap {
                    background: rgba(255,255,255,0.005);
                    border: 1px solid rgba(255,255,255,0.04);
                    border-radius: 28px;
                    overflow: hidden;
                    backdrop-filter: blur(20px);
                }

                .adm-dash-controls-root {
                    padding: 36px 48px;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    display: flex;
                    flex-direction: column;
                    gap: 32px;
                }

                /* ══ Controls Styling ══ */
                .adm-dash-search-hud {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px;
                    padding: 0 18px;
                    height: 48px;
                    min-width: 340px;
                    transition: all 0.3s;
                }
                .adm-dash-search-hud:focus-within {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(0, 209, 255, 0.4);
                    box-shadow: 0 0 30px rgba(0, 209, 255, 0.08);
                }
                .adm-dash-search-input {
                    background: transparent;
                    border: none;
                    outline: none;
                    flex: 1;
                    padding-left: 14px;
                    font-family: var(--font-sans);
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #fff;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                .adm-dash-search-icon-wrap { color: rgba(255,255,255,0.2); }
                .adm-dash-search-hud:focus-within .adm-dash-search-icon-wrap { color: #00d1ff; }

                .adm-dash-status-segment {
                    position: relative;
                    display: flex;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px;
                    padding: 4px;
                    height: 48px;
                }
                .adm-dash-segment-bg {
                    position: absolute;
                    top: 4px; bottom: 4px; left: 4px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .adm-dash-segment-item {
                    position: relative;
                    flex: 1;
                    padding: 0 24px;
                    font-family: var(--font-sans);
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: rgba(255,255,255,0.25);
                    z-index: 1;
                    transition: color 0.3s;
                    min-width: 110px;
                }
                .adm-dash-segment-item.active { color: #00d1ff; }

                .adm-dash-action-pivot {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    height: 48px;
                    padding: 0 24px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px;
                    font-family: var(--font-sans);
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: rgba(255,255,255,0.3);
                    transition: all 0.3s;
                }
                .adm-dash-action-pivot:hover { color: #fff; background: rgba(255,255,255,0.06); }
                .adm-dash-action-pivot.active { color: #00d1ff; border-color: rgba(0, 209, 255, 0.3); background: rgba(0, 209, 255, 0.08); }

                .adm-dash-bulk-delete {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    height: 48px;
                    padding: 0 22px;
                    background: rgba(255, 107, 107, 0.08);
                    border: 1px solid rgba(255, 107, 107, 0.2);
                    border-radius: 16px;
                    color: #ff6b6b;
                    font-family: var(--font-sans);
                    font-size: 0.7rem;
                    font-weight: 800;
                    transition: all 0.3s;
                }
                .adm-dash-bulk-delete:hover { background: rgba(255, 107, 107, 0.15); box-shadow: 0 0 30px rgba(255, 107, 107, 0.15); }

                /* ══ Category Strip ══ */
                .adm-dash-category-strip {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding-bottom: 4px;
                }
                .adm-dash-category-strip::-webkit-scrollbar { height: 0; }
                .adm-dash-category-item {
                    position: relative;
                    padding: 10px 22px;
                    font-family: var(--font-sans);
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.15em;
                    color: rgba(255,255,255,0.2);
                    transition: color 0.3s;
                }
                .adm-dash-category-item.active { color: #00d1ff; }
                .adm-dash-category-glow {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 2px;
                    background: #00d1ff;
                    box-shadow: 0 0 15px #00d1ff;
                    border-radius: 10px;
                }

                /* ══ Table ══ */
                .adm-dash-table { width: 100%; border-collapse: collapse; }
                .adm-dash-table thead th {
                    padding: 20px 32px;
                    font-family: var(--font-sans);
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.2em;
                    color: rgba(255,255,255,0.2);
                    text-transform: uppercase;
                    text-align: left;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255,255,255,0.012);
                }
                .adm-dash-tbody {
                    display: table-row-group;
                    min-height: 480px;
                }
                .adm-dash-row {
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                    transition: all 0.3s;
                }
                .adm-dash-row:hover { background: rgba(255,255,255,0.02); }
                .adm-dash-table td { padding: 24px 32px; vertical-align: middle; }

                .adm-dash-blog-title {
                    display: block;
                    font-family: var(--font-serif);
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: rgba(255,255,255,0.9);
                    transition: color 0.2s;
                }
                .adm-dash-row:hover .adm-dash-blog-title { color: #00d1ff; }
                .adm-dash-blog-meta {
                    display: block;
                    font-family: var(--font-sans);
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.2);
                    margin-top: 4px;
                    letter-spacing: 0.05em;
                }

                .adm-dash-category-pill {
                    padding: 6px 14px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 100px;
                    font-size: 0.6rem;
                    font-weight: 800;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                }

                .adm-dash-status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: var(--font-sans);
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.1em;
                }
                .status-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
                .published { color: #10b981; }
                .published .status-dot { box-shadow: 0 0 10px #10b981; animation: status-pulse 2s infinite; }
                .draft { color: rgba(255,255,255,0.2); }

                @keyframes status-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

                .adm-dash-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    transition: all 0.3s;
                }
                .adm-dash-action-btn {
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255,255,255,0.3);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .adm-dash-action-btn:hover { 
                    background: rgba(255,255,255,0.06); 
                    color: #fff;
                    border-color: rgba(0, 209, 255, 0.5);
                    box-shadow: 0 0 15px rgba(0, 209, 255, 0.3);
                    transform: translateY(-2px);
                }
                .adm-dash-action-btn.delete:hover { 
                    color: #ff6b6b; 
                    border-color: rgba(255,107,107,0.4); 
                    box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
                }

                .adm-dash-checkbox {
                    appearance: none;
                    width: 20px; height: 20px;
                    background: rgba(255,255,255,0.02);
                    border: 2px solid rgba(255,255,255,0.1);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .adm-dash-checkbox:checked { background: #00d1ff; border-color: #00d1ff; }
                .adm-dash-checkbox:checked::after {
                    content: '✓';
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    color: #000; font-size: 11px; font-weight: 900;
                }

                .adm-dash-empty {
                    padding: 80px !important;
                    text-align: center;
                    font-family: var(--font-sans);
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.15);
                    letter-spacing: 0.1em;
                }
                .adm-dash-index {
                    font-family: var(--font-sans);
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.1);
                }
            `}</style>
        </div>
    )
}
