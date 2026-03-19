"use client"
import { motion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* The primary deep blue splash that hides the screen immediately on navigation */}
            <motion.div
                className="fixed top-0 left-0 w-full h-screen bg-[#1152d4] z-[99999] pointer-events-none origin-bottom"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* The secondary bright cyan slash that follows closely behind for a fluid aesthetic */}
            <motion.div
                className="fixed top-0 left-0 w-full h-screen bg-[#00d1ff] z-[99998] pointer-events-none origin-bottom"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />
            {/* Page Content fades in gracefully instead of snapping */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
                {children}
            </motion.div>
        </>
    )
}
