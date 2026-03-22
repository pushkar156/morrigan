// ── Shared type definitions used across the frontend ──────────────────────────

export interface Blog {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    author: string
    category: string
    tags: string[] | null
    featured_image: string | null
    read_time: number
    status: string
    created_at: string
    updated_at: string | null
    published_at: string | null
}

export interface BlogCreatePayload {
    title: string
    content: string
    excerpt?: string
    author?: string
    category?: string
    tags?: string[]
    featured_image?: string
    read_time?: number
    status?: string
    published_at?: string
}

export interface BlogUpdatePayload {
    title?: string
    content?: string
    excerpt?: string
    author?: string
    category?: string
    tags?: string[]
    featured_image?: string
    read_time?: number
    status?: string
    published_at?: string
}

export interface AuthToken {
    access_token: string
    token_type: string
}

export interface ContactPayload {
    name: string
    email: string
    subject: string
    message: string
}

export interface ChatPayload {
    message: string
    history?: { role: "user" | "model"; text: string }[]
    blog_id?: string
    page_url?: string
    page_content?: string
}

export interface ChatResponse {
    response: string
}

export interface UploadResponse {
    url: string
    filename: string
}
