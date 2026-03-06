"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        // Simulate a tiny delay for premium feel
        setTimeout(() => {
            // For now, simple client side validation before hooking up to backend
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('admin_token', 'temp_token')
                router.push('/admin/dashboard')
            } else {
                setError('Invalid credentials. Please verify your access.')
                setIsLoading(false)
            }
        }, 800)
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] height-[500px] bg-[#00d1ff]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] height-[500px] bg-[#1152d4]/10 blur-[100px] rounded-full pointer-events-none" />

            <Link href="/" className="absolute top-10 left-10 flex items-center gap-3 decoration-none group z-20">
                <img src="/logo.png" alt="Morrigan" className="w-8 h-8 object-contain rounded-md" />
                <span className="font-serif font-black text-black tracking-widest text-lg group-hover:text-[#1a73e8] transition-colors">THE MORRIGAN</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/80 backdrop-blur-3xl border border-white/60 p-12 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1),0_0_40px_rgba(0,209,255,0.05)]">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif font-black text-black mb-3 tracking-tight">Admin Access</h1>
                        <p className="text-sm font-sans font-bold text-black/40 uppercase tracking-[0.2em]">Secure Editorial Protocol</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black tracking-[0.15em] text-black/60 uppercase mb-3">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/50 border border-black/10 rounded-2xl px-5 py-4 text-sm font-medium text-black placeholder:text-black/30 outline-none focus:border-[#00d1ff]/50 focus:bg-white transition-all shadow-inner"
                                placeholder="Enter your identifier"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black tracking-[0.15em] text-black/60 uppercase mb-3">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/50 border border-black/10 rounded-2xl px-5 py-4 text-sm font-medium text-black placeholder:text-black/30 outline-none focus:border-[#00d1ff]/50 focus:bg-white transition-all shadow-inner"
                                placeholder="Enter your access phrase"
                                required
                            />
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[#dc3545] text-xs font-bold tracking-wide text-center uppercase">
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-black text-white font-black tracking-[0.2em] text-xs uppercase py-5 rounded-2xl transition-all shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-[#1a73e8]'}`}
                        >
                            {isLoading ? 'Verifying...' : 'Authorize Access'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}
