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

/** Fetch published blogs. No fallback to demo data since it was removed. */
export async function fetchBlogs(category?: string): Promise<Blog[]> {
    try {
        const url = new URL(`${API_BASE}/blogs`)
        if (category) url.searchParams.set('category', category)
        const res = await fetch(url.toString(), { cache: 'no-store' })
        return await handleResponse<Blog[]>(res)
    } catch (err) {
        console.error('[API] fetchBlogs failed:', err)
        return [] // Return empty list on failure
    }
}

/** Fetch a single blog by slug. Returns null if not found or on API failure. */
export async function fetchBlog(slug: string): Promise<Blog | null> {
    try {
        const res = await fetch(`${API_BASE}/blogs/${slug}`, { cache: 'no-store' })
        if (res.status === 404) return null
        return await handleResponse<Blog>(res)
    } catch (err) {
        console.error('[API] fetchBlog failed:', err)
        return null
    }
}

// ── Admin Blog Endpoints (JWT required) ──────────────────────────────────────

/** Fetch all blogs (admin: includes drafts). */
export async function fetchAdminBlogs(): Promise<Blog[]> {
    const res = await fetch(`${API_BASE}/blogs/admin/all`, {
        headers: authHeaders(),
        cache: 'no-store',
    })
    return handleResponse<Blog[]>(res)
}

/** Create a new blog. */
export async function createBlog(data: BlogCreatePayload, token?: string): Promise<Blog> {
    const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    })
    return handleResponse<Blog>(res)
}

/** Update an existing blog by ID. */
export async function updateBlog(id: string, data: BlogUpdatePayload, token?: string): Promise<Blog> {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify(data),
    })
    return handleResponse<Blog>(res)
}

/** Delete a blog by ID. */
export async function deleteBlog(id: string, token?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    })
    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || 'Failed to delete blog')
    }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

/** Login and receive a JWT access token. */
export async function loginAdmin(username: string, password: string): Promise<AuthToken> {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })
    return handleResponse<AuthToken>(res)
}

// ── Upload ───────────────────────────────────────────────────────────────────

/** Upload an image file. Returns the URL for the stored image. */
export async function uploadImage(file: File, token?: string): Promise<UploadResponse> {
    const t = token || getToken()
    const formData = new FormData()
    formData.append('file', file)

    const headers: Record<string, string> = {}
    if (t) headers['Authorization'] = `Bearer ${t}`

    const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers,
        body: formData,
    })
    return handleResponse<UploadResponse>(res)
}

// ── Contact ──────────────────────────────────────────────────────────────────

/** Submit a contact form. */
export async function submitContact(data: ContactPayload): Promise<{ status: string; message: string }> {
    const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return handleResponse(res)
}

// ── Chat ─────────────────────────────────────────────────────────────────────

/** Send a message to the Morrigan AI chatbot. */
export async function sendChatMessage(data: ChatPayload): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    return handleResponse<ChatResponse>(res)
}
