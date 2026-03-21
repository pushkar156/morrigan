"use client"
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [hoverText, setHoverText] = useState('')

    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    // Smooth spring physics for a premium feel
    const springConfig = { damping: 24, stiffness: 200, mass: 0.5 }
    const x = useSpring(cursorX, springConfig)
    const y = useSpring(cursorY, springConfig)

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            setIsVisible(true)

            const target = e.target as HTMLElement
            // Event delegation to detect hover on interactive elements dynamically
            const interactable = target?.closest?.('a, button, input, [role="button"]')
            
            if (interactable) {
                setIsHovering(true)
                if (interactable.getAttribute('href')?.includes('/journal?')) {
                    setHoverText('Read')
                } else {
                    setHoverText('')
                }
            } else {
                setIsHovering(false)
                setHoverText('')
            }
        }

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener('mousemove', updateMousePosition)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('mouseenter', handleMouseEnter)

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseEnter)
        }
    }, [])

    return (
        <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full mix-blend-difference"
            style={{
                x,
                y,
                translateX: '-50%',
                translateY: '-50%',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }}
            animate={{
                width: isHovering ? 64 : 16,
                height: isHovering ? 64 : 16,
                backgroundColor: isHovering ? 'transparent' : '#ffffff',
                backdropFilter: isHovering ? 'blur(1.5px)' : 'blur(0px)',
                border: isHovering ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid transparent',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <AnimatePresence>
                {isHovering && hoverText && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-[10px] font-bold tracking-widest text-white uppercase"
                    >
                        {hoverText}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function MagneticButton({ children, className = "", strength = 0.3 }: { children: React.ReactNode, className?: string, strength?: number }) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

    const handleMouse = (e: React.MouseEvent) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current.getBoundingClientRect()
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)

        x.set(middleX * strength)
        y.set(middleY * strength)
    }

    const reset = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            style={{ x: springX, y: springY, display: "inline-block" }}
            className={`cursor-pointer ${className}`}
        >
            {children}
        </motion.div>
    )
}
