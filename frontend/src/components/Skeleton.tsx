"use client"

import { motion } from 'framer-motion'

interface SkeletonProps {
    className?: string
    width?: string | number
    height?: string | number
    borderRadius?: string | number
    variant?: 'text' | 'rect' | 'circle'
}

export default function Skeleton({ 
    className = '', 
    width, 
    height, 
    borderRadius = '0.5rem',
    variant = 'rect' 
}: SkeletonProps) {
    const isCircle = variant === 'circle'
    
    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
            }}
            className={`bg-black/5 dark:bg-white/5 relative overflow-hidden ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                borderRadius: isCircle ? '50%' : borderRadius,
            }}
        >
            <motion.div
                animate={{
                    x: ['-100%', '100%']
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            />
        </motion.div>
    )
}

export function BlogSkeleton() {
    return (
        <div className="flex flex-col gap-4 w-full h-full p-6">
            <Skeleton height="60%" borderRadius="2rem" />
            <Skeleton width="40%" height="20px" />
            <Skeleton width="90%" height="32px" />
            <Skeleton width="70%" height="16px" />
        </div>
    )
}

export function CategorySkeleton() {
    return (
        <div className="flex gap-6 h-full w-full">
            <div className="flex-[5]">
                <Skeleton height="100%" borderRadius="2.5rem" />
            </div>
            <div className="flex-1 hidden md:block">
                <Skeleton height="100%" borderRadius="2.5rem" />
            </div>
            <div className="flex-1 hidden md:block">
                <Skeleton height="100%" borderRadius="2.5rem" />
            </div>
            <div className="flex-1 hidden md:block">
                <Skeleton height="100%" borderRadius="2.5rem" />
            </div>
        </div>
    )
}
