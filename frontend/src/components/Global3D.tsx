"use client"
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Stars, PerspectiveCamera, Environment, ContactShadows, Center } from '@react-three/drei'
import { useLenis } from 'lenis/react'
import { useRef, useState, useEffect, useMemo } from 'react'
import * as THREE from 'three'

function BackgroundBubbles() {
    const count = 50
    const points = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 20 - 10],
            size: Math.random() * 0.05 + 0.02,
            speed: Math.random() * 0.3 + 0.05
        }))
    }, [])

    const group = useRef<THREE.Group>(null)

    useFrame(() => {
        if (group.current) {
            group.current.children.forEach((child, i) => {
                child.position.y += points[i].speed * 0.05
                if (child.position.y > 20) child.position.y = -20
            })
        }
    })

    return (
        <group ref={group}>
            {points.map((p, i) => (
                <mesh key={i} position={p.position as any}>
                    <sphereGeometry args={[p.size, 16, 16]} />
                    <meshStandardMaterial color="#00d1ff" transparent opacity={0.15} />
                </mesh>
            ))}
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
            // Rotation and float based on scroll
            groupRef.current.rotation.y = progress * Math.PI
            groupRef.current.position.y = -progress * 10
            groupRef.current.scale.setScalar(1 - progress * 0.5)
        }
    })

    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.getElapsedTime()
            // Responsive positioning and mouse follow
            const targetX = mouse.current.x * (viewport.width / 4)
            const targetY = mouse.current.y * (viewport.height / 4)

            meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05)
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY + Math.sin(t) * 0.2, 0.05)

            meshRef.current.rotation.x += 0.002
            meshRef.current.rotation.y += 0.005
        }
    })

    return (
        <group ref={groupRef}>
            <Center>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <mesh
                        ref={meshRef}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                        scale={hovered ? 1.2 : 1}
                    >
                        <icosahedronGeometry args={[2.5, 12]} />
                        <MeshDistortMaterial
                            color="#00d1ff"
                            speed={hovered ? 4 : 1.5}
                            distort={0.45}
                            radius={1}
                            metalness={0.9}
                            roughness={0.1}
                            emissive="#1152d4"
                            emissiveIntensity={0.4}
                        />
                    </mesh>
                </Float>

                {/* Orbital rings */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[4, 0.02, 16, 100]} />
                    <meshStandardMaterial color="#00d1ff" transparent opacity={0.2} />
                </mesh>
                <mesh rotation={[Math.PI / 1.5, Math.PI / 4, 0]}>
                    <torusGeometry args={[4.5, 0.015, 16, 100]} />
                    <meshStandardMaterial color="#1152d4" transparent opacity={0.1} />
                </mesh>
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
        <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-[#000309]">
            {/* Deep Background Gradient */}
            <div
                className="absolute inset-0 z-0 bg-no-repeat bg-center bg-cover"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #142c53 0%, #000309 80%)',
                    opacity: 0.6
                }}
            />

            <Canvas
                className="w-full h-full"
                style={{ position: 'absolute', top: 0, left: 0 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d1ff" />
                <spotLight position={[-10, 20, 10]} angle={0.12} penumbra={1} intensity={2} color="#1152d4" />

                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                <BackgroundBubbles />
                <HeroObject />

                <Environment preset="night" />
                <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={20} blur={2.5} far={4} />
            </Canvas>

            {/* Light Scan Interaction */}
            <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_rgba(0,209,255,0.05)_0%,_transparent_50%)]" />
        </div>
    )
}
