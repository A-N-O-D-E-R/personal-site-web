import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere } from '@react-three/drei'
import { Group, Mesh } from 'three'

export default function HeroScene() {
  const groupRef = useRef<Group>(null)
  const sphere1Ref = useRef<Mesh>(null)
  const sphere2Ref = useRef<Mesh>(null)

  const positions = useMemo(() => {
    return [
      { pos: [-2, 0, 0], color: '#3b82f6', speed: 0.3 },
      { pos: [2, 0, -2], color: '#8b5cf6', speed: 0.5 }
    ]
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
    }

    if (sphere1Ref.current) {
      sphere1Ref.current.position.y = Math.sin(t * 0.5) * 0.3
    }

    if (sphere2Ref.current) {
      sphere2Ref.current.position.y = Math.cos(t * 0.7) * 0.4
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere ref={sphere1Ref} args={[1, 64, 64]} position={positions[0].pos as [number, number, number]}>
        <MeshDistortMaterial
          color={positions[0].color}
          attach="material"
          distort={0.4}
          speed={positions[0].speed}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      <Sphere ref={sphere2Ref} args={[0.8, 64, 64]} position={positions[1].pos as [number, number, number]}>
        <MeshDistortMaterial
          color={positions[1].color}
          attach="material"
          distort={0.5}
          speed={positions[1].speed}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>

      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
    </group>
  )
}
