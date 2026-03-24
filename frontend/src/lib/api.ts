import type {
    Blog,
    BlogCreatePayload,
    BlogUpdatePayload,
    AuthToken,
    ContactPayload,
    ChatPayload,
    ChatResponse,
    UploadResponse,
} from './types'

// ── Config ───────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('admin_token')
}

function authHeaders(token?: string): HeadersInit {
    const t = token || getToken()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (t) headers['Authorization'] = `Bearer ${t}`
    return headers
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const message = body.detail || body.message || `API Error ${res.status}`
        throw new Error(message)
    }
    return res.json()
}

// ── Blog Endpoints ───────────────────────────────────────────────────────────

/** Fetch published blogs with cache-busting. */
export async function fetchBlogs(category?: string): Promise<Blog[]> {
    try {
        const url = new URL(`${API_BASE}/blogs`)
        if (category) url.searchParams.set('category', category)
        url.searchParams.set('_cb', Date.now().toString())
        
        console.log(`📡 [API-Audit] GET: ${url.toString()}`)
        
        const res = await fetch(url.toString(), { cache: 'no-store' })
        return await handleResponse<Blog[]>(res)
    } catch (err) {
        console.error('[API] fetchBlogs failed:', err)
        return []
    }
}

/** Fetch a single blog by slug. */
export async function fetchBlog(slug: string): Promise<Blog | null> {
    try {
        const url = `${API_BASE}/blogs/${slug}?_cb=${Date.now()}`
        console.log(`📡 [API-Audit] GET (Single): ${url}`)
        const res = await fetch(url, { cache: 'no-store' })
        if (res.status === 404) return null
        return await handleResponse<Blog>(res)
    } catch (err) {
        console.error('[API] fetchBlog failed:', err)
        return null
    }
}

// ── Admin Blog Endpoints (JWT required) ──────────────────────────────────────

/** Fetch all blogs for admin. */
export async function fetchAdminBlogs(): Promise<Blog[]> {
    const url = `${API_BASE}/blogs/admin/all?_cb=${Date.now()}`
    console.log(`📡 [API-Audit] GET (Admin): ${url}`)
    const res = await fetch(url, {
        headers: authHeaders(),
        cache: 'no-store',
    })
    return handleResponse<Blog[]>(res)
}

/** Create a new blog. */
export async function createBlog(data: BlogCreatePayload, token?: string): Promise<Blog> {
    const url = `${API_BASE}/blogs`
    console.log(`📡 [API-Audit] POST: ${url}`)
    const res = await fetch(url, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    })
    return handleResponse<Blog>(res)
}

/** Update an existing blog by ID. */
export async function updateBlog(id: string, data: BlogUpdatePayload, token?: string): Promise<Blog> {
    const url = `${API_BASE}/blogs/${id}`
    console.log(`📡 [API-Audit] PUT: ${url}`)
    const res = await fetch(url, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    })
    return handleResponse<Blog>(res)
}

/** Delete a blog by ID. */
export async function deleteBlog(id: string, token?: string): Promise<void> {
    const url = `${API_BASE}/blogs/${id}`
    console.log(`📡 [API-Audit] DELETE: ${url}`)
    const res = await fetch(url, {
        method: 'DELETE',
        headers: authHeaders(token),
    })
    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || 'Failed to delete blog')
    }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function loginAdmin(username: string, password: string): Promise<AuthToken> {
    const url = `${API_BASE}/auth/login`
    console.log(`📡 [API-Audit] Auth Attempt: ${url}`)
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    return handleResponse<AuthToken>(res)
}

// ── Upload ───────────────────────────────────────────────────────────────────

export async function uploadImage(file: File, token?: string): Promise<UploadResponse> {
    const url = `${API_BASE}/upload`
    console.log(`📡 [API-Audit] Uploading to: ${url}`)
    const t = token || getToken()
    const formData = new FormData()
    formData.append('file', file)

    const headers: Record<string, string> = {}
    if (t) headers['Authorization'] = `Bearer ${t}`

    const res = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
    })
    return handleResponse<UploadResponse>(res)
}

// ── Contact ──────────────────────────────────────────────────────────────────

export async function submitContact(data: ContactPayload): Promise<{ status: string; message: string }> {
    const url = `${API_BASE}/contact`
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return handleResponse(res)
}

// ── Chat ─────────────────────────────────────────────────────────────────────

export async function sendChatMessage(data: ChatPayload): Promise<ChatResponse> {
    const url = `${API_BASE}/chat`
    console.log(`📡 [API-Audit] Sending Chat query: ${url}`)
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return handleResponse<ChatResponse>(res)
}
