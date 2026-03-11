"use client"
import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export function FloatingOrb({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) {
    return (
        <motion.div
            style={{
                position: 'absolute', left: x, top: y, width: size, height: size,
                borderRadius: '50%', background: color, filter: `blur(${size * 0.45}px)`,
                pointerEvents: 'none', zIndex: 0,
            }}
            animate={{ y: [0, -32, 0, 22, 0], x: [0, 14, -10, 6, 0], scale: [1, 1.09, 0.94, 1.05, 1] }}
            transition={{ duration: 9 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
        />
    )
}

export function ParticleField({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particles = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[]>([])
    const mouse = useRef({ x: -999, y: -999 })
    const raf = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return
        const ctx = canvas.getContext('2d')!

        const resize = () => {
            canvas.width = container.offsetWidth
            canvas.height = container.offsetHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const onMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
            for (let i = 0; i < 3; i++) {
                particles.current.push({
                    x: mouse.current.x + (Math.random() - 0.5) * 20,
                    y: mouse.current.y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: -Math.random() * 2 - 0.5,
                    life: 1, maxLife: 0.6 + Math.random() * 0.8,
                })
            }
        }
        container.addEventListener('mousemove', onMove)

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.current = particles.current.filter(p => p.life > 0)
            for (const p of particles.current) {
                p.x += p.vx; p.y += p.vy
                p.vy -= 0.03
                p.life -= 0.018 / p.maxLife
                const alpha = Math.max(0, p.life)
                const size = alpha * 3.5
                ctx.beginPath()
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(0, 209, 255, ${alpha * 0.7})`
                ctx.shadowBlur = 8
                ctx.shadowColor = '#00d1ff'
                ctx.fill()
            }
            raf.current = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            window.removeEventListener('resize', resize)
            container.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(raf.current)
        }
    }, [containerRef])

    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />
}
