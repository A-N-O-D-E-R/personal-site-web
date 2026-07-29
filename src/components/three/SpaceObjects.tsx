import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

export function Rocket() {
  const rocketRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (rocketRef.current) {
      const t = clock.getElapsedTime()
      // Rocket orbits between Earth and Mars
      const angle = t * 0.25
      rocketRef.current.position.x = Math.cos(angle) * 5.5
      rocketRef.current.position.z = Math.sin(angle) * 5.5
      rocketRef.current.position.y = Math.sin(t * 0.5) * 0.5
      rocketRef.current.rotation.y = angle + Math.PI / 2
    }
  })

  return (
    <group ref={rocketRef}>
      {/* Rocket body */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rocket nose cone */}
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.05, 0.1, 16]} />
        <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Rocket fins */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[-0.12, side * 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.08, 0.001, 0.08]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Engine glow */}
      <pointLight position={[-0.2, 0, 0]} intensity={0.5} color="#f97316" distance={1} />
      <mesh position={[-0.18, 0, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
    </group>
  )
}

export function Satellite() {
  const satelliteRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (satelliteRef.current) {
      const t = clock.getElapsedTime()
      // Satellite orbits near Earth
      const angle = t * 0.4
      satelliteRef.current.position.x = Math.cos(angle) * 5.3
      satelliteRef.current.position.z = Math.sin(angle) * 5.3
      satelliteRef.current.position.y = Math.cos(t * 0.3) * 0.3
      satelliteRef.current.rotation.y = t * 0.5
      satelliteRef.current.rotation.x = t * 0.3
    }
  })

  return (
    <group ref={satelliteRef}>
      {/* Main satellite body */}
      <mesh>
        <boxGeometry args={[0.12, 0.08, 0.08]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Solar panels */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 0.12, 0, 0]}>
          <boxGeometry args={[0.15, 0.001, 0.2]} />
          <meshStandardMaterial color="#1e40af" metalness={0.5} roughness={0.2} emissive="#1e3a8a" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Antenna */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>

      {/* Dish */}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.02, 0.02, 16]} />
        <meshStandardMaterial color="#e5e7eb" metalness={0.7} />
      </mesh>

      {/* Blinking light */}
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#3b82f6" distance={0.5} />
    </group>
  )
}
