'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { loginAdmin as apiLogin } from './api'

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthContextValue {
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'admin_token'

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true) // true until we check localStorage

    // Hydrate token from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(TOKEN_KEY)
        if (stored) setToken(stored)
        setIsLoading(false)
    }, [])

    const login = useCallback(async (username: string, password: string) => {
        const data = await apiLogin(username, password)
        localStorage.setItem(TOKEN_KEY, data.access_token)
        setToken(data.access_token)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
    }, [])

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error('useAuth must be used inside an <AuthProvider>')
    }
    return ctx
}
