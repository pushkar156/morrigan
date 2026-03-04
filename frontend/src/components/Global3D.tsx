"use client"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, PerspectiveCamera, Environment, Sparkles } from '@react-three/drei'
import { useLenis } from 'lenis/react'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

// Shared scroll state
const scrollState = { progress: 0 }

// ─── Floating Bubbles (reduced count for performance) ───────────────
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

// ─── Hero Blob → Cursor Drop ────────────────────────────────────────
function HeroBlob() {
    const meshRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)
    const [hovered, setHovered] = useState(false)
    const { viewport } = useThree()

    const mouse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Sync Lenis scroll → shared state
    useLenis(({ progress }) => {
        scrollState.progress = progress
    })

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (!meshRef.current || !groupRef.current) return

        const progress = scrollState.progress

        // Transition: hero blob → small cursor drop
        const transStart = 0.08
        const transEnd = 0.3
        const transT = THREE.MathUtils.clamp(
            (progress - transStart) / (transEnd - transStart),
            0, 1
        )
        const eased = transT * transT * (3 - 2 * transT)

        // Scale: 1 (hero) → 0.22 (cursor drop)
        const targetScale = THREE.MathUtils.lerp(1, 0.22, eased)
        groupRef.current.scale.setScalar(
            THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08)
        )

        // Follow strength: loose in hero, tight as cursor drop
        const followStrength = THREE.MathUtils.lerp(0.04, 0.09, eased)
        const moveRange = THREE.MathUtils.lerp(viewport.width / 5, viewport.width / 2.5, eased)

        const targetX = mouse.current.x * moveRange
        const targetY = mouse.current.y * (viewport.height / 3)

        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, followStrength)
        meshRef.current.position.y = THREE.MathUtils.lerp(
            meshRef.current.position.y,
            targetY + Math.sin(t) * (0.2 * (1 - eased)),
            followStrength
        )

        // In hero: scroll pushes blob down. After transition: stays with cursor
        groupRef.current.position.y = -progress * 10 * (1 - eased)

        meshRef.current.rotation.x = t * 0.1
        meshRef.current.rotation.y = t * 0.15
    })

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    scale={hovered ? 1.15 : 1}
                >
                    <icosahedronGeometry args={[2.5, 8]} />
                    <MeshDistortMaterial
                        color="#00d1ff"
                        speed={hovered ? 4 : 1.5}
                        distort={0.45}
                        radius={1}
                        metalness={1}
                        roughness={0.05}
                        emissive="#1152d4"
                        emissiveIntensity={0.6}
                    />
                </mesh>
            </Float>
        </group>
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
                <HeroBlob />

                <Environment preset="night" />
                <Sparkles count={20} scale={12} size={1.5} speed={0.4} color="#00d1ff" />
            </Canvas>
        </div>
    )
}
