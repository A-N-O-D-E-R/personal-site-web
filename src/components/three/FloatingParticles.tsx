import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function FloatingParticles() {
  const ref = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15

      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }

    return { positions, velocities, count }
  }, [])

  useFrame(() => {
    if (!ref.current) return

    const positions = ref.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particles.count; i++) {
      positions[i * 3] += particles.velocities[i * 3]
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1]
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2]

      // Wrap around
      if (Math.abs(positions[i * 3]) > 8) positions[i * 3] *= -1
      if (Math.abs(positions[i * 3 + 1]) > 8) positions[i * 3 + 1] *= -1
      if (Math.abs(positions[i * 3 + 2]) > 8) positions[i * 3 + 2] *= -1
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={ref} positions={particles.positions}>
      <PointMaterial
        size={0.03}
        color="#3b82f6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </Points>
  )
}
