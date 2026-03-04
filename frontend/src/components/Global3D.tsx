"use client"
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Environment, Sparkles } from '@react-three/drei'
import { useLenis } from 'lenis/react'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

// Shared scroll state
const scrollState = { progress: 0 }

// ─── Floating Bubbles ───────────────────────────────────────────────
function BackgroundBubbles() {
    const count = 20
    const points = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 20 - 10],
            size: Math.random() * 0.08 + 0.02,
            speed: Math.random() * 0.2 + 0.05
        }))
    }, [])

    const group = useRef<THREE.Group>(null)

    useFrame(() => {
        if (group.current) {
            group.current.children.forEach((child, i) => {
                child.position.y += points[i].speed * 0.04
                if (child.position.y > 20) child.position.y = -20
            })
        }
    })

    return (
        <group ref={group}>
            {points.map((p, i) => (
                <mesh key={i} position={p.position as any}>
                    <sphereGeometry args={[p.size, 8, 8]} />
                    <meshStandardMaterial color="#00d1ff" transparent opacity={0.2} emissive="#00d1ff" emissiveIntensity={0.5} />
                </mesh>
            ))}
        </group>
    )
}

// ─── Cursor Glow Trail (premium replacement for blob) ───────────────
function CursorGlow() {
    const meshRef = useRef<THREE.Mesh>(null)
    const mouse = useRef({ x: 0, y: 0 })
    const smoothPos = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useLenis(({ progress }) => {
        scrollState.progress = progress
    })

    useFrame((state) => {
        if (!meshRef.current) return

        const { viewport } = state

        // Smooth follow
        smoothPos.current.x = THREE.MathUtils.lerp(smoothPos.current.x, mouse.current.x * viewport.width / 2, 0.06)
        smoothPos.current.y = THREE.MathUtils.lerp(smoothPos.current.y, mouse.current.y * viewport.height / 2, 0.06)

        meshRef.current.position.x = smoothPos.current.x
        meshRef.current.position.y = smoothPos.current.y
        meshRef.current.position.z = -2

        // Subtle pulse
        const t = state.clock.getElapsedTime()
        const scale = 1.8 + Math.sin(t * 0.8) * 0.2
        meshRef.current.scale.setScalar(scale)
    })

    return (
        <mesh ref={meshRef}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial
                color="#00d1ff"
                transparent
                opacity={0.04}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    )
}

// ─── Main Scene ─────────────────────────────────────────────────────
export default function Global3D() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-[#f8f9fa]">
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #e0faff 0%, #f8f9fa 70%)',
                    opacity: 0.6
                }}
            />

            <Canvas
                className="w-full h-full"
                style={{ position: 'absolute', top: 0, left: 0 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
                frameloop="always"
            >
                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2.5} color="#00d1ff" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#1152d4" />

                <BackgroundBubbles />
                <CursorGlow />

                <Environment preset="night" />
                <Sparkles count={20} scale={12} size={1.5} speed={0.4} color="#00d1ff" />
            </Canvas>
        </div>
    )
}
