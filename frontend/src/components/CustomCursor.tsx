"use client"
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [hoverText, setHoverText] = useState('')
    const pathname = usePathname()

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
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        // Setup listeners for interactive elements
        const setupInteractiveElements = () => {
            const interactables = document.querySelectorAll('a, button, input, [role="button"]')

            interactables.forEach((el) => {
                const element = el as HTMLElement
                // Avoid attaching multiple event listeners
                if (element.dataset.cursorAttached) return
                element.dataset.cursorAttached = "true"

                element.addEventListener('mouseenter', () => {
                    setIsHovering(true)
                    // If it's a journal link, show "Read", else just expand
                    if (element.getAttribute('href')?.includes('/journal?')) {
                        setHoverText('Read')
                    } else if (element.tagName === 'A' || element.tagName === 'BUTTON') {
                        setHoverText('')
                    }
                })

                element.addEventListener('mouseleave', () => {
                    setIsHovering(false)
                    setHoverText('')
                })
            })
        }

        window.addEventListener('mousemove', updateMousePosition)
        window.addEventListener('mouseout', handleMouseLeave)
        window.addEventListener('mouseover', handleMouseEnter)

        // Give Next.js a moment to mount the DOM, then attach hover listeners
        const timeout = setTimeout(setupInteractiveElements, 500)

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
            window.removeEventListener('mouseout', handleMouseLeave)
            window.removeEventListener('mouseover', handleMouseEnter)
            clearTimeout(timeout)
        }
    }, [pathname]) // Re-run when navigation changes

    return (
        <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full"
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
                backgroundColor: isHovering ? 'rgba(0, 209, 255, 0.15)' : 'rgba(0, 3, 9, 0.8)',
                backdropFilter: isHovering ? 'blur(4px)' : 'blur(0px)',
                border: isHovering ? '1px solid rgba(0, 209, 255, 0.4)' : '1px solid transparent',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <AnimatePresence>
                {isHovering && hoverText && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="text-[10px] font-bold tracking-widest text-[#00d1ff] uppercase"
                    >
                        {hoverText}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
