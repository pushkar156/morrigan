"use client"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Stars, PerspectiveCamera, Environment, ContactShadows, Center, Sparkles } from '@react-three/drei'
import { useLenis } from 'lenis/react'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

function BackgroundBubbles() {
    const count = 40
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
                    <sphereGeometry args={[p.size, 16, 16]} />
                    <meshStandardMaterial color="#00d1ff" transparent opacity={0.2} emissive="#00d1ff" emissiveIntensity={0.5} />
                </mesh>
            ))}
        </group>
    )
}

function OrbitalRings() {
    const parentRef = useRef<THREE.Group>(null)
    const ring1Ref = useRef<THREE.Mesh>(null)
    const ring2Ref = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()

        // Shared stable drift
        if (parentRef.current) {
            parentRef.current.rotation.z = t * 0.05
        }

        if (ring1Ref.current) {
            // Horizontal revolution
            ring1Ref.current.rotation.y = t * 0.6
        }
        if (ring2Ref.current) {
            // Vertical revolution - different speed to ensure path crossing
            ring2Ref.current.rotation.x = t * 0.4
        }
    })

    return (
        <group ref={parentRef}>
            {/* Ring 1 - Vertical Initial */}
            <mesh ref={ring1Ref} rotation={[0, 0, 0]}>
                <torusGeometry args={[4.2, 0.012, 16, 100]} />
                <meshStandardMaterial color="#00d1ff" transparent opacity={0.3} emissive="#00d1ff" emissiveIntensity={1} />
            </mesh>

            {/* Ring 2 - Horizontal Initial */}
            <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[4.5, 0.008, 16, 100]} />
                <meshStandardMaterial color="#1152d4" transparent opacity={0.2} emissive="#1152d4" emissiveIntensity={0.5} />
            </mesh>
        </group>
    )
}

function HeroObject() {
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

    useLenis(({ scroll, progress }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = progress * Math.PI
            groupRef.current.position.y = -progress * 10
            groupRef.current.scale.setScalar(1 - progress * 0.3)
        }
    })

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (meshRef.current) {
            // Mouse follow
            const targetX = mouse.current.x * (viewport.width / 5)
            const targetY = mouse.current.y * (viewport.height / 5)

            meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05)
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY + Math.sin(t) * 0.2, 0.05)

            meshRef.current.rotation.x = t * 0.1
            meshRef.current.rotation.y = t * 0.15
        }
    })

    return (
        <group ref={groupRef}>
            <Center>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    {/* The "Inconsistent" Distorted Icosahedron you liked (Lining removed) */}
                    <mesh
                        ref={meshRef}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                        scale={hovered ? 1.15 : 1}
                    >
                        <icosahedronGeometry args={[2.5, 12]} />
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

                <OrbitalRings />
                <Sparkles count={40} scale={12} size={2} speed={0.4} color="#00d1ff" />
            </Center>
        </group>
    )
}

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
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />

                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={2.5} color="#00d1ff" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#1152d4" />
                <spotLight position={[0, 20, 10]} angle={0.2} penumbra={1} intensity={4} color="#fff" />

                <Stars radius={100} depth={50} count={1200} factor={4} saturation={0} fade speed={1} />
                <BackgroundBubbles />
                <HeroObject />

                <Environment preset="night" />
                <ContactShadows position={[0, -6, 0]} opacity={0.2} scale={20} blur={3} far={10} />
            </Canvas>

            <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_rgba(0,209,255,0.04)_0%,_transparent_60%)]" />
        </div>
    )
}
